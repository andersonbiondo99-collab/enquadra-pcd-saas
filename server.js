"use strict";

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8080);
const ROOT_DIR = __dirname;
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT_DIR, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PLANS_FILE = path.join(DATA_DIR, "plans.json");
const CID_MAP_FILE = path.join(DATA_DIR, "cid-map.json");
const SESSION_COOKIE = "enquadra_session";
const BODY_LIMIT_BYTES = 1024 * 1024 * 2;
const MERCADO_PAGO_API = "api.mercadopago.com";
const APP_BASE_URL = normalizeText(process.env.APP_BASE_URL);
const MP_ACCESS_TOKEN = normalizeText(process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN);
const MP_WEBHOOK_SECRET = normalizeText(process.env.MP_WEBHOOK_SECRET || process.env.MERCADO_PAGO_WEBHOOK_SECRET);
const ALLOWED_ORIGINS = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((value) => normalizeText(value))
  .filter(Boolean);
const DEFAULT_ADMIN_USERNAME = "ANDERSONBIONDO";
const DEFAULT_ADMIN_PASSWORD = "13090404";
const DEFAULT_ADMIN_COMPANY = "DaviCore Health";

const DEFAULT_PLAN_CATALOG = [
  {
    id: "individual_recorrente_30",
    label: "Medico Recorrente 30 Laudos",
    audience: "Medico",
    audienceKey: "doctor",
    priceCents: 59700,
    months: 1,
    laudoLimit: 30,
    description: "Assinatura recorrente mensal com 30 laudos liberados por ciclo e renovacao automatica no Mercado Pago.",
    billingModel: "subscription",
    quotaPeriod: "monthly",
    status: "active",
    sortOrder: 0
  },
  {
    id: "individual_25",
    label: "Medico 10 Documentos",
    audience: "Medico",
    audienceKey: "doctor",
    priceCents: 39700,
    months: 12,
    laudoLimit: 10,
    description: "Pacote de entrada para emissao eventual, com pagamento avulso e consumo por credito no ciclo contratado.",
    billingModel: "one_time",
    quotaPeriod: "contract",
    status: "active",
    sortOrder: 10
  },
  {
    id: "individual_80",
    label: "Medico 25 Documentos",
    audience: "Medico",
    audienceKey: "doctor",
    priceCents: 89700,
    months: 12,
    laudoLimit: 25,
    description: "Pacote intermediario para pratica recorrente, com melhor custo por documento dentro do periodo contratado.",
    billingModel: "one_time",
    quotaPeriod: "contract",
    status: "active",
    sortOrder: 20
  },
  {
    id: "individual_180",
    label: "Medico 50 Documentos",
    audience: "Medico",
    audienceKey: "doctor",
    priceCents: 149700,
    months: 12,
    laudoLimit: 50,
    description: "Pacote ampliado para maior volume de emissao medica, sem mensalidade recorrente.",
    billingModel: "one_time",
    quotaPeriod: "contract",
    status: "active",
    sortOrder: 30
  },
  {
    id: "empresarial_120",
    label: "Empresarial 3 Meses",
    audience: "Empresa",
    audienceKey: "company",
    priceCents: 199700,
    months: 3,
    laudoLimit: null,
    description: "Dashboard administrativo para empresas com gestao de medicos vinculados, indicadores e controle corporativo.",
    billingModel: "one_time",
    quotaPeriod: "none",
    status: "active",
    sortOrder: 40
  },
  {
    id: "empresarial_250",
    label: "Empresarial 6 Meses",
    audience: "Empresa",
    audienceKey: "company",
    priceCents: 349700,
    months: 6,
    laudoLimit: null,
    description: "Dashboard administrativo para empresas com gestao de medicos vinculados, indicadores e controle corporativo.",
    billingModel: "one_time",
    quotaPeriod: "none",
    status: "active",
    sortOrder: 50
  },
  {
    id: "empresarial_800",
    label: "Empresarial 12 Meses",
    audience: "Empresa",
    audienceKey: "company",
    priceCents: 649700,
    months: 12,
    laudoLimit: null,
    description: "Dashboard administrativo para empresas com gestao de medicos vinculados, indicadores e controle corporativo.",
    billingModel: "one_time",
    quotaPeriod: "none",
    status: "active",
    sortOrder: 60
  }
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const STATIC_IMAGE_ALIASES = {
  "/img/logo.png": ["img/logo.png", "logo.png"],
  "/img/foto.png": ["img/foto.png", "foto.png"],
  "/logo.png": ["logo.png", "img/logo.png"],
  "/foto.png": ["foto.png", "img/foto.png"]
};
const MAX_PAYMENT_HISTORY_ITEMS = 40;
const CID_LOOKUP_HOST = "www.codigocid.com.br";
const CID_LOOKUP_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const sessions = new Map();
const cidLookupCache = new Map();
let cidCatalogMap = Object.create(null);
let cidCatalogEntries = [];

ensureDataStore();
loadCidCatalog();

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    applyCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      const allowedOrigin = getAllowedOrigin(req);
      if (!allowedOrigin && normalizeText(req.headers.origin)) {
        return sendJson(res, 403, { message: "Origem nao autorizada." });
      }
      res.writeHead(204);
      res.end();
      return;
    }

    if (pathname === "/health") {
      return sendJson(res, 200, { ok: true, service: "enquadra-pcd-saas", mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN) });
    }

    if (pathname === "/api/public/bootstrap" && req.method === "GET") {
      return sendJson(res, 200, buildPublicBootstrap());
    }

    if (pathname === "/api/auth/bootstrap" && req.method === "GET") {
      const users = readUsers();
      const admins = users.filter((item) => item.role === "admin");
      return sendJson(res, 200, {
        configured: admins.length > 0,
        totalUsers: users.length,
        totalCompanies: users.filter((item) => item.role === "buyer").length,
        mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN)
      });
    }

    if (pathname === "/api/cid/lookup" && req.method === "GET") {
      const code = normalizeCidCode(requestUrl.searchParams.get("code"));
      if (!code) {
        return sendJson(res, 400, { message: "Informe um CID valido para consulta." });
      }

      let result;
      try {
        result = await lookupCidDescriptionByCode(code);
      } catch (error) {
        console.error("[cid-lookup] Falha ao consultar CID externo:", error);
        return sendJson(res, 502, {
          code,
          found: false,
          description: "",
          sourceUrl: buildCidLookupUrl(code),
          message: "Nao foi possivel consultar a descricao do CID neste momento."
        });
      }

      if (!result.found) {
        return sendJson(res, 404, {
          code,
          found: false,
          description: "",
          sourceUrl: result.sourceUrl || buildCidLookupUrl(code)
        });
      }

      return sendJson(res, 200, {
        code,
        found: true,
        description: result.description,
        sourceUrl: result.sourceUrl || buildCidLookupUrl(code),
        cached: Boolean(result.cached)
      });
    }

    if (pathname === "/api/cid/search" && req.method === "GET") {
      const query = requestUrl.searchParams.get("q");
      const items = searchCidCatalog(query, 8);
      return sendJson(res, 200, { query: normalizeText(query), items });
    }

    if (pathname === "/api/public/register-company" && req.method === "POST") {
      const body = await readJsonBody(req);
      const company = normalizeText(body.company);
      const companyCnpj = normalizeCnpj(body.companyCnpj);
      const contactName = normalizeText(body.contactName);
      const email = normalizeEmail(body.email);
      const username = normalizeText(body.username);
      const password = String(body.password || "");
      const accountType = normalizeAccountType(body.accountType);
      const crmNumber = String(body.crmNumber || "").replace(/\D/g, "");
      const crmState = normalizeText(body.crmState).toUpperCase();
      const doctorCpf = String(body.doctorCpf || "").replace(/\D/g, "");
      const doctorBirthDate = normalizeDateInput(body.doctorBirthDate);
      const legalAccepted = Boolean(body.legalAccepted);
      const doctorAccepted = Boolean(body.doctorAccepted);
      const plan = getPlanById(body.planId, { includeInactive: false, fallbackToFirst: false });
      const users = readUsers();
      const reusableSignupUser = findReusableSignupUser(users, {
        email,
        username,
        password,
        accountType
      });
      if (reusableSignupUser) {
        let resumeInfo = {
          user: reusableSignupUser,
          plan: getPlanById(reusableSignupUser.planId || "mensal", { includeInactive: true }),
          checkout: buildStoredCheckoutSnapshot(reusableSignupUser)
        };
        if (MP_ACCESS_TOKEN) {
          try {
            resumeInfo = await ensureCheckoutForBlockedAccess({
              user: reusableSignupUser,
              req,
              source: "signup_resume"
            });
          } catch (error) {
            console.error(error);
          }
        }

        const resumedUser = resumeInfo.user || reusableSignupUser;
        const resumedPlan = resumeInfo.plan || getPlanById(resumedUser.planId || "mensal", { includeInactive: true });
        return sendJson(res, 200, {
          message: buildCheckoutResumeMessage(reusableSignupUser, resumeInfo),
          user: serializeUser(resumedUser),
          plan: resumedPlan,
          mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN),
          checkout: resumeInfo.checkout || buildStoredCheckoutSnapshot(resumedUser),
          resumed: true
        });
      }
      const validationError = validatePublicRegistration({
        company,
        companyCnpj,
        contactName,
        email,
        username,
        password,
        plan,
        accountType,
        crmNumber,
        crmState,
        doctorCpf,
        doctorBirthDate,
        legalAccepted,
        doctorAccepted
      }, users);
      if (validationError) {
        return sendJson(res, 400, { message: validationError });
      }

      const newUser = buildUserRecord({
        company,
        companyCnpj,
        username,
        password,
        role: "buyer",
        status: "inadimplente",
        paymentStatus: "pending",
        paymentDueAt: null,
        email,
        contactName,
        planId: plan.id,
        createdBy: "self-signup",
        accountType,
        crmNumber,
        crmState,
        doctorCpf,
        doctorBirthDate,
        crmValidated: false,
        legalAccepted,
        doctorAccepted
      });

      users.push(newUser);
      writeUsers(users);

      let checkout = null;
      if (MP_ACCESS_TOKEN) {
        checkout = await createBillingCheckout({ user: newUser, plan, req });
        updateUserRecord(newUser.id, (current) => appendPaymentHistory({
          ...current,
          mpPreferenceId: checkout.preferenceId || "",
          mpCheckoutUrl: checkout.checkoutUrl,
          mpSubscriptionId: checkout.subscriptionId || "",
          mpSubscriptionStatus: checkout.subscriptionStatus || "",
          paymentProvider: "mercadopago",
          updatedAt: new Date().toISOString()
        }, {
          title: normalizePlanBillingModel(plan.billingModel) === "subscription"
            ? "Assinatura preparada no Mercado Pago"
            : "Checkout comercial gerado",
          details: normalizePlanBillingModel(plan.billingModel) === "subscription"
            ? `A assinatura do plano ${plan.label} foi iniciada para liberacao automatica apos confirmacao.`
            : `O checkout do plano ${plan.label} foi gerado para concluir a liberacao comercial da conta.`,
          status: "pending",
          provider: "mercadopago",
          source: "signup",
          referenceId: checkout.subscriptionId || checkout.preferenceId || "",
          amountCents: Number(plan.priceCents || 0),
          dedupKey: `checkout:${newUser.id}:${checkout.subscriptionId || checkout.preferenceId || `${plan.id}:signup`}`
        }));
      }

      return sendJson(res, 201, {
        message: MP_ACCESS_TOKEN ? "Conta criada. Continue pelo checkout do Mercado Pago para liberar o acesso." : "Conta criada. Configure o token do Mercado Pago para liberar o checkout automatico.",
        user: serializeUser(readUserById(newUser.id)),
        plan,
        mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN),
        checkout
      });
    }

    if (pathname === "/api/auth/session" && req.method === "GET") {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 200, { authenticated: false });
      }
      return sendJson(res, 200, {
        authenticated: true,
        user: serializeUser(user),
        summary: user.role === "admin" ? buildDashboardSummary(readUsers()) : null,
        sessionToken: getSessionTokenFromRequest(req)
      });
    }

    if (pathname === "/api/auth/setup" && req.method === "POST") {
      const users = readUsers();
      const admins = users.filter((item) => item.role === "admin");
      if (admins.length > 0) {
        return sendJson(res, 409, { message: "A configuracao inicial ja foi concluida. Use o acesso administrativo padrao." });
      }

      const body = await readJsonBody(req);
      const company = normalizeText(body.company);
      const username = normalizeText(body.username);
      const password = String(body.password || "");
      const validationError = validateUserPayload({ company, username, password, role: "admin" }, true);
      if (validationError) {
        return sendJson(res, 400, { message: validationError });
      }

      const newUser = buildUserRecord({ company, username, password, role: "admin", status: "active", paymentStatus: "approved", paymentDueAt: null, email: "", contactName: "", planId: "internal", createdBy: "setup" });
      users.push(newUser);
      writeUsers(users);
      const sessionToken = createSession(req, res, newUser.id);
      touchUserLastAccess(newUser.id);
      return sendJson(res, 201, { user: serializeUser(readUserById(newUser.id)), sessionToken });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readJsonBody(req);
      const username = normalizeText(body.username);
      const password = String(body.password || "");
      const users = readUsers();
      const loginKey = normalizeUserIdentifier(username);
      const user = users.find((item) => item.usernameKey === loginKey || normalizeEmail(item.email) === loginKey);
      if (!user || !verifyPassword(password, user)) {
        return sendJson(res, 401, { message: "Credenciais invalidas." });
      }

      const accessError = getAccessError(user);
      if (accessError) {
        let blockedUser = user;
        let checkout = buildStoredCheckoutSnapshot(user);
        let message = accessError;

        if (MP_ACCESS_TOKEN && isCheckoutResumeEligible(user)) {
          try {
            const resumeInfo = await ensureCheckoutForBlockedAccess({
              user,
              req,
              source: "login_resume"
            });
            blockedUser = resumeInfo.user || user;
            checkout = resumeInfo.checkout || checkout;
            message = buildCheckoutResumeMessage(user, resumeInfo);
          } catch (error) {
            console.error(error);
          }
        }

        return sendJson(res, 403, {
          message,
          user: serializeUser(blockedUser),
          checkout
        });
      }

      const sessionToken = createSession(req, res, user.id);
      touchUserLastAccess(user.id);
      return sendJson(res, 200, { user: serializeUser(readUserById(user.id)), sessionToken });
    }

    if (pathname === "/api/auth/logout" && req.method === "POST") {
      destroySession(req, res);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === "/api/company/profile" && req.method === "PATCH") {
      const companyUser = requireCompany(req, res);
      if (!companyUser) {
        return;
      }

      const body = await readJsonBody(req);
      const company = body.company !== undefined ? normalizeText(body.company) : companyUser.company;
      const companyCnpj = body.companyCnpj !== undefined ? normalizeCnpj(body.companyCnpj) : normalizeCnpj(companyUser.companyCnpj);
      const companyLogoDataUrl = body.companyLogoDataUrl !== undefined
        ? normalizeImageDataUrl(body.companyLogoDataUrl)
        : normalizeImageDataUrl(companyUser.companyLogoDataUrl);

      if (!company) {
        return sendJson(res, 400, { message: "Informe o nome da empresa para salvar o perfil." });
      }
      if (companyCnpj.length !== 14) {
        return sendJson(res, 400, { message: "Informe um CNPJ valido com 14 digitos." });
      }
      if (body.companyLogoDataUrl !== undefined && String(body.companyLogoDataUrl || "").trim() && !companyLogoDataUrl) {
        return sendJson(res, 400, { message: "A logo da empresa precisa ser uma imagem valida em PNG, JPG, WEBP ou SVG." });
      }

      const updated = updateUserRecord(companyUser.id, (current) => appendCompanyActivityRecord({
        ...current,
        company,
        companyCnpj,
        companyLogoDataUrl,
        updatedAt: new Date().toISOString()
      }, {
        doctorName: "Administrativo da empresa",
        action: body.companyLogoDataUrl !== undefined
          ? "Perfil corporativo atualizado com nova logo"
          : "Perfil corporativo atualizado"
      }));

      return sendJson(res, 200, { user: serializeUser(updated) });
    }

    if (pathname === "/api/company/doctors" && req.method === "POST") {
      const companySessionUser = requireCompany(req, res);
      if (!companySessionUser) {
        return;
      }

      const body = await readJsonBody(req);
      const name = normalizeText(body.name);
      const crm = String(body.crm || "").replace(/\D/g, "");
      const crmState = normalizeText(body.crmState).toUpperCase();
      const specialty = normalizeText(body.specialty);

      if (!name) {
        return sendJson(res, 400, { message: "Informe o nome do medico para vincular ao dashboard." });
      }
      if (crm.length < 4) {
        return sendJson(res, 400, { message: "Informe um CRM valido para cadastrar o medico." });
      }
      if (!crmState) {
        return sendJson(res, 400, { message: "Informe a UF do CRM para liberar o acesso operacional do medico." });
      }

      const users = readUsers();
      const companyIndex = users.findIndex((item) => item.id === companySessionUser.id
        && item.role === "buyer"
        && normalizeAccountType(item.accountType) === "company");
      if (companyIndex === -1) {
        return sendJson(res, 404, { message: "Conta empresarial nao localizada." });
      }

      const companyUser = users[companyIndex];
      const companyDoctors = normalizeCompanyDoctors(companyUser.linkedDoctors);

      if (companyDoctors.some((item) => item.crm === crm && (!item.crmState || item.crmState === crmState))) {
        return sendJson(res, 400, { message: "Ja existe um medico cadastrado com este CRM." });
      }

      const generatedUsername = generateCompanyDoctorUsername(name, users);
      const generatedPassword = generateCompanyDoctorPassword();
      const createdAt = new Date().toISOString();
      const doctorId = crypto.randomUUID();
      const doctorUser = buildUserRecord({
        company: companyUser.company,
        username: generatedUsername,
        password: generatedPassword,
        role: "buyer",
        status: companyUser.status === "blocked"
          ? "blocked"
          : (companyUser.status === "inadimplente" ? "inadimplente" : "active"),
        paymentStatus: companyUser.paymentStatus,
        paymentDueAt: companyUser.paymentDueAt,
        email: "",
        contactName: name,
        planId: companyUser.planId || "mensal",
        createdBy: `company:${companyUser.id}`,
        notes: `Medico corporativo vinculado a ${companyUser.company}.`,
        accountType: "doctor",
        crmNumber: crm,
        crmState,
        doctorCpf: "",
        doctorBirthDate: "",
        crmValidated: true,
        legalAccepted: true,
        doctorAccepted: true,
        companyLogoDataUrl: companyUser.companyLogoDataUrl || "",
        responsibilityMode: "company",
        linkedCompanyId: companyUser.id,
        linkedCompanyDoctorId: doctorId
      });
      const nextDoctor = normalizeCompanyDoctor({
        id: doctorId,
        name,
        crm,
        crmState,
        specialty,
        createdAt,
        accessUserId: doctorUser.id,
        accessUsername: doctorUser.username,
        accessCreatedAt: createdAt,
        responsibilityMode: "company"
      });

      users[companyIndex] = appendCompanyActivityRecord({
        ...companyUser,
        linkedDoctors: [nextDoctor, ...companyDoctors],
        updatedAt: createdAt
      }, {
        doctorName: nextDoctor.name,
        action: `Medico vinculado ao painel corporativo com acesso operacional liberado (${nextDoctor.accessUsername})`,
        occurredAt: createdAt
      });
      users.push(doctorUser);
      writeUsers(users);

      return sendJson(res, 201, {
        user: serializeUser(users[companyIndex]),
        doctorAccess: {
          doctorId: nextDoctor.id,
          doctorName: nextDoctor.name,
          username: doctorUser.username,
          password: generatedPassword
        }
      });
    }

    const companyDoctorAccessMatch = pathname.match(/^\/api\/company\/doctors\/([a-zA-Z0-9_-]+)\/access$/);
    if (companyDoctorAccessMatch && req.method === "POST") {
      const companySessionUser = requireCompany(req, res);
      if (!companySessionUser) {
        return;
      }

      const doctorId = companyDoctorAccessMatch[1];
      const users = readUsers();
      const companyIndex = users.findIndex((item) => item.id === companySessionUser.id
        && item.role === "buyer"
        && normalizeAccountType(item.accountType) === "company");
      if (companyIndex === -1) {
        return sendJson(res, 404, { message: "Conta empresarial nao localizada." });
      }

      const companyUser = users[companyIndex];
      const doctors = normalizeCompanyDoctors(companyUser.linkedDoctors);
      const doctorIndex = doctors.findIndex((item) => item.id === doctorId);
      if (doctorIndex === -1) {
        return sendJson(res, 404, { message: "Medico nao localizado nesta empresa." });
      }

      const doctor = doctors[doctorIndex];
      const existingAccess = users.find((item) => isCompanyManagedDoctor(item)
        && normalizeText(item.linkedCompanyId) === companyUser.id
        && normalizeText(item.linkedCompanyDoctorId) === doctorId);
      if (existingAccess || (doctor.accessUserId && doctor.accessUsername)) {
        return sendJson(res, 409, { message: "Este medico ja possui acesso operacional gerado." });
      }

      const generatedUsername = generateCompanyDoctorUsername(doctor.name, users);
      const generatedPassword = generateCompanyDoctorPassword();
      const createdAt = new Date().toISOString();
      const doctorUser = buildUserRecord({
        company: companyUser.company,
        username: generatedUsername,
        password: generatedPassword,
        role: "buyer",
        status: companyUser.status === "blocked"
          ? "blocked"
          : (companyUser.status === "inadimplente" ? "inadimplente" : "active"),
        paymentStatus: companyUser.paymentStatus,
        paymentDueAt: companyUser.paymentDueAt,
        email: "",
        contactName: doctor.name,
        planId: companyUser.planId || "mensal",
        createdBy: `company:${companyUser.id}`,
        notes: `Medico corporativo vinculado a ${companyUser.company}.`,
        accountType: "doctor",
        crmNumber: doctor.crm,
        crmState: doctor.crmState,
        doctorCpf: "",
        doctorBirthDate: "",
        crmValidated: true,
        legalAccepted: true,
        doctorAccepted: true,
        companyLogoDataUrl: companyUser.companyLogoDataUrl || "",
        responsibilityMode: "company",
        linkedCompanyId: companyUser.id,
        linkedCompanyDoctorId: doctorId
      });

      const nextDoctor = normalizeCompanyDoctor({
        ...doctor,
        accessUserId: doctorUser.id,
        accessUsername: doctorUser.username,
        accessCreatedAt: createdAt,
        responsibilityMode: "company"
      });
      doctors[doctorIndex] = nextDoctor;

      users[companyIndex] = appendCompanyActivityRecord({
        ...companyUser,
        linkedDoctors: doctors,
        updatedAt: createdAt
      }, {
        doctorName: nextDoctor.name,
        action: `Acesso operacional gerado para o medico (${nextDoctor.accessUsername})`,
        occurredAt: createdAt
      });
      users.push(doctorUser);
      writeUsers(users);

      return sendJson(res, 201, {
        user: serializeUser(users[companyIndex]),
        doctorAccess: {
          doctorId: nextDoctor.id,
          doctorName: nextDoctor.name,
          username: doctorUser.username,
          password: generatedPassword
        }
      });
    }

    const companyDoctorMatch = pathname.match(/^\/api\/company\/doctors\/([a-zA-Z0-9_-]+)$/);
    if (companyDoctorMatch && req.method === "DELETE") {
      const companySessionUser = requireCompany(req, res);
      if (!companySessionUser) {
        return;
      }

      const doctorId = companyDoctorMatch[1];
      const users = readUsers();
      const companyIndex = users.findIndex((item) => item.id === companySessionUser.id
        && item.role === "buyer"
        && normalizeAccountType(item.accountType) === "company");
      if (companyIndex === -1) {
        return sendJson(res, 404, { message: "Conta empresarial nao localizada." });
      }

      const companyUser = users[companyIndex];
      const currentDoctors = normalizeCompanyDoctors(companyUser.linkedDoctors);
      const currentDoctor = currentDoctors.find((item) => item.id === doctorId);
      if (!currentDoctor) {
        return sendJson(res, 404, { message: "Medico nao localizado nesta empresa." });
      }

      const doctorUserIds = new Set(
        users
          .filter((item) => isCompanyManagedDoctor(item)
            && normalizeText(item.linkedCompanyId) === companyUser.id
            && normalizeText(item.linkedCompanyDoctorId) === doctorId)
          .map((item) => item.id)
      );

      const nextUsers = users.filter((item) => !doctorUserIds.has(item.id));
      const nextCompanyIndex = nextUsers.findIndex((item) => item.id === companyUser.id);
      const nextCompany = appendCompanyActivityRecord({
        ...nextUsers[nextCompanyIndex],
        linkedDoctors: currentDoctors.filter((item) => item.id !== doctorId),
        updatedAt: new Date().toISOString()
      }, {
        doctorName: currentDoctor.name,
        action: `Medico removido do dashboard corporativo (CRM ${currentDoctor.crm})`
      });
      nextUsers[nextCompanyIndex] = nextCompany;
      writeUsers(nextUsers);

      return sendJson(res, 200, { user: serializeUser(nextCompany) });
    }

    if (pathname === "/api/usage/laudos" && req.method === "POST") {
      const user = requireAuthenticated(req, res);
      if (!user) {
        return;
      }

      if (normalizeAccountType(user.accountType) !== "doctor") {
        return sendJson(res, 403, { message: "A emissao documental e exclusiva do perfil medico autenticado." });
      }

      const quotaError = getUserLaudoQuotaError(user);
      if (quotaError) {
        return sendJson(res, 403, { message: quotaError, user: serializeUser(user) });
      }

      const updated = updateUserRecord(user.id, (current) => ({
        ...current,
        usageCount: Number(current.usageCount || 0) + 1,
        currentCycleUsageCount: Number(resolveCurrentCycleUsageCount(current) || 0) + 1,
        currentCycleStartedAt: current.currentCycleStartedAt || current.paymentLastApprovedAt || current.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      syncCompanyUsageFromDoctor(readUserById(user.id) || updated);
      return sendJson(res, 200, { ok: true, user: serializeUser(updated) });
    }

    if (pathname === "/api/billing/renewal-link" && req.method === "POST") {
      const user = requireAuthenticated(req, res);
      if (!user) {
        return;
      }
      if (user.role !== "buyer") {
        return sendJson(res, 400, { message: "A renovacao e exclusiva para clientes contratantes." });
      }
      if (!MP_ACCESS_TOKEN) {
        return sendJson(res, 400, { message: "Mercado Pago nao configurado. Informe MP_ACCESS_TOKEN e APP_BASE_URL." });
      }

      const plan = getPlanById(user.planId || "mensal", { includeInactive: true });
      const reusableSubscriptionError = getSubscriptionRenewalBlocker(user, plan);
      if (reusableSubscriptionError) {
        return sendJson(res, 400, { message: reusableSubscriptionError, user: serializeUser(user) });
      }

      const checkout = await createBillingCheckout({ user, plan, req, purpose: "renewal" });
      const updated = updateUserRecord(user.id, (current) => appendPaymentHistory({
        ...current,
        mpPreferenceId: checkout.preferenceId || "",
        mpCheckoutUrl: checkout.checkoutUrl,
        mpSubscriptionId: checkout.subscriptionId || current.mpSubscriptionId || "",
        mpSubscriptionStatus: checkout.subscriptionStatus || current.mpSubscriptionStatus || "",
        paymentProvider: "mercadopago",
        renewalOfferedAt: new Date().toISOString(),
        lastPaymentAttemptAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, {
        title: normalizePlanBillingModel(plan.billingModel) === "subscription"
          ? "Assinatura de renovacao preparada"
          : "Link de renovacao gerado",
        details: normalizePlanBillingModel(plan.billingModel) === "subscription"
          ? `A renovacao recorrente do plano ${plan.label} foi enviada ao Mercado Pago.`
          : `Um novo checkout foi aberto para renovar o plano ${plan.label}.`,
        status: "pending",
        provider: "mercadopago",
        source: "renewal",
        referenceId: checkout.subscriptionId || checkout.preferenceId || "",
        amountCents: Number(plan.priceCents || 0),
        dedupKey: `renewal:${user.id}:${checkout.subscriptionId || checkout.preferenceId || `${plan.id}:renewal`}`
      }));

      return sendJson(res, 200, { checkout, user: serializeUser(updated) });
    }

    if (pathname === "/api/admin/summary" && req.method === "GET") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }
      return sendJson(res, 200, { summary: buildDashboardSummary(readUsers()), admin: serializeUser(adminUser), plans: readPlans({ includeInactive: true }) });
    }

    if (pathname === "/api/admin/users" && req.method === "GET") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      return sendJson(res, 200, {
        users: readUsers().map(serializeUser),
        admin: serializeUser(adminUser),
        summary: buildDashboardSummary(readUsers()),
        mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN),
        plans: readPlans({ includeInactive: true })
      });
    }

    if (pathname === "/api/admin/plans" && req.method === "GET") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      return sendJson(res, 200, {
        plans: readPlans({ includeInactive: true }),
        mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN)
      });
    }

    if (pathname === "/api/admin/plans" && req.method === "POST") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      const body = await readJsonBody(req);
      let nextPlan;
      try {
        nextPlan = validateAndBuildAdminPlanPayload(body, { isCreate: true });
      } catch (error) {
        return sendJson(res, 400, { message: error.message || "Nao foi possivel validar o plano informado." });
      }
      const plans = readPlans({ includeInactive: true });
      if (plans.some((plan) => plan.id === nextPlan.id)) {
        return sendJson(res, 409, { message: "Ja existe um plano com este codigo interno." });
      }

      plans.push({
        ...nextPlan,
        sortOrder: Number(nextPlan.sortOrder || (plans.length ? Math.max(...plans.map((plan) => Number(plan.sortOrder || 0))) + 10 : 10))
      });
      writePlans(plans);

      return sendJson(res, 201, {
        message: "Plano criado com sucesso.",
        plans: readPlans({ includeInactive: true })
      });
    }

    if (pathname === "/api/admin/users" && req.method === "POST") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      const body = await readJsonBody(req);
      const users = readUsers();
      const company = normalizeText(body.company);
      const contactName = normalizeText(body.contactName);
      const email = normalizeEmail(body.email);
      const username = normalizeText(body.username);
      const password = String(body.password || "");
      const role = normalizeRole(body.role);
      const status = normalizeStatus(body.status);
      const paymentStatus = normalizePaymentStatus(body.paymentStatus);
      const paymentDueAt = normalizeDueDate(body.paymentDueAt);
      const plan = getPlanById(body.planId || "mensal", { includeInactive: true });
      const notes = normalizeText(body.notes);
      const accountType = normalizeAccountType(body.accountType);
      const companyCnpj = normalizeCnpj(body.companyCnpj);
      const crmNumber = String(body.crmNumber || "").replace(/\D/g, "");
      const crmState = normalizeText(body.crmState).toUpperCase();
      const crmValidated = Boolean(body.crmValidated);
      const validationError = validateAdminCreation({ company, username, password, role, email, plan, users, accountType, companyCnpj, crmNumber, crmState });
      if (validationError) {
        return sendJson(res, 400, { message: validationError });
      }

      const newUser = buildUserRecord({
        company,
        companyCnpj,
        username,
        password,
        role,
        status,
        paymentStatus: role === "admin" ? "approved" : paymentStatus,
        paymentDueAt: role === "admin" ? null : paymentDueAt,
        email,
        contactName,
        planId: role === "admin" ? "internal" : plan.id,
        createdBy: adminUser.username,
        notes,
        accountType: role === "admin" ? "company" : accountType,
        crmNumber: role === "admin" || accountType !== "doctor" ? "" : crmNumber,
        crmState: role === "admin" || accountType !== "doctor" ? "" : crmState,
        crmValidated: role === "admin" || accountType !== "doctor" ? false : crmValidated
      });

      users.push(newUser);
      writeUsers(users);
      return sendJson(res, 201, { user: serializeUser(readUserById(newUser.id)), summary: buildDashboardSummary(readUsers()) });
    }

    const adminUserMatch = pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)$/);
    if (adminUserMatch && req.method === "PATCH") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      const userId = adminUserMatch[1];
      const body = await readJsonBody(req);
      const users = readUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) {
        return sendJson(res, 404, { message: "Usuario nao localizado." });
      }

      const current = users[index];
      const nextPlan = getPlanById(body.planId || current.planId || "mensal", { includeInactive: true });
      const nextUsername = body.username !== undefined ? normalizeText(body.username) : current.username;
      const nextEmail = body.email !== undefined ? normalizeEmail(body.email) : current.email;
      const nextRole = body.role !== undefined ? normalizeRole(body.role) : current.role;
      const nextAccountType = nextRole === "admin"
        ? "company"
        : normalizeAccountType(body.accountType !== undefined ? body.accountType : current.accountType);
      const nextCompanyCnpj = nextRole === "admin"
        ? ""
        : normalizeCnpj(body.companyCnpj !== undefined ? body.companyCnpj : current.companyCnpj);
      const nextCrmNumber = nextRole === "admin" || nextAccountType !== "doctor"
        ? ""
        : String(body.crmNumber !== undefined ? body.crmNumber : current.crmNumber || "").replace(/\D/g, "");
      const nextCrmState = nextRole === "admin" || nextAccountType !== "doctor"
        ? ""
        : normalizeText(body.crmState !== undefined ? body.crmState : current.crmState).toUpperCase();
      const validationError = validateAdminUpdate({
        current,
        company: body.company !== undefined ? normalizeText(body.company) : current.company,
        username: nextUsername,
        role: nextRole,
        email: nextEmail,
        plan: nextPlan,
        accountType: nextAccountType,
        companyCnpj: nextCompanyCnpj,
        crmNumber: nextCrmNumber,
        crmState: nextCrmState,
        users,
        userId
      });
      if (validationError) {
        return sendJson(res, 400, { message: validationError });
      }

      const now = new Date().toISOString();
      let updated = {
        ...current,
        company: body.company !== undefined ? normalizeText(body.company) : current.company,
        username: nextUsername,
        usernameKey: normalizeUserIdentifier(nextUsername),
        contactName: body.contactName !== undefined ? normalizeText(body.contactName) : current.contactName,
        email: nextEmail,
        role: nextRole,
        companyCnpj: nextRole === "admin" ? "" : nextCompanyCnpj,
        status: body.status !== undefined ? normalizeStatus(body.status) : current.status,
        paymentStatus: body.paymentStatus !== undefined ? normalizePaymentStatus(body.paymentStatus) : current.paymentStatus,
        paymentDueAt: body.paymentDueAt !== undefined ? normalizeDueDate(body.paymentDueAt) : current.paymentDueAt,
        planId: nextPlan.id,
        planLabel: nextPlan.label,
        planPriceCents: nextPlan.priceCents,
        billingCycleMonths: nextPlan.months,
        planLaudoLimit: nextPlan.laudoLimit,
        planBillingModel: normalizePlanBillingModel(nextPlan.billingModel),
        planQuotaPeriod: normalizePlanQuotaPeriod(nextPlan.quotaPeriod, nextPlan.billingModel, nextPlan.laudoLimit),
        accountType: nextRole === "admin" ? "company" : nextAccountType,
        crmNumber: nextRole === "admin" || nextAccountType !== "doctor" ? "" : nextCrmNumber,
        crmState: nextRole === "admin" || nextAccountType !== "doctor" ? "" : nextCrmState,
        crmValidated: nextRole === "admin" || nextAccountType !== "doctor"
          ? false
          : (body.crmValidated !== undefined ? Boolean(body.crmValidated) : Boolean(current.crmValidated)),
        notes: body.notes !== undefined ? normalizeText(body.notes) : current.notes,
        updatedAt: now
      };

      if (nextPlan.id !== current.planId) {
        updated.currentCycleUsageCount = 0;
        updated.currentCycleStartedAt = updated.paymentStatus === "approved"
          ? now
          : (current.currentCycleStartedAt || null);
      }

      if (updated.role !== "admin" && updated.paymentStatus === "approved" && current.paymentStatus !== "approved") {
        updated.paymentLastApprovedAt = now;
        updated.currentCycleUsageCount = 0;
        updated.currentCycleStartedAt = now;
        if (!updated.paymentDueAt) {
          updated.paymentDueAt = addMonths(now, Number(updated.billingCycleMonths || 1)).toISOString();
        }
      }

      if (updated.role === "admin") {
        updated.paymentStatus = "approved";
        updated.paymentDueAt = null;
        updated.status = "active";
        updated.planId = "internal";
        updated.planLabel = "Administracao interna";
        updated.planPriceCents = 0;
        updated.billingCycleMonths = 0;
        updated.planLaudoLimit = null;
        updated.planBillingModel = "internal";
        updated.planQuotaPeriod = "none";
        updated.currentCycleUsageCount = 0;
        updated.currentCycleStartedAt = null;
        updated.paymentHistory = [];
      }

      if (body.password !== undefined && String(body.password || "")) {
        if (String(body.password).length < 6) {
          return sendJson(res, 400, { message: "A nova senha precisa ter pelo menos 6 caracteres." });
        }
        const credential = hashPassword(String(body.password));
        updated.passwordSalt = credential.salt;
        updated.passwordHash = credential.hash;
      }

      if (updated.role !== "admin") {
        const paymentEntries = [];
        if (current.planId !== updated.planId) {
          paymentEntries.push({
            title: "Plano ajustado manualmente",
            details: `O plano foi alterado de ${current.planLabel || current.planId || "nao informado"} para ${updated.planLabel || updated.planId || "nao informado"}.`,
            status: updated.paymentStatus,
            provider: updated.paymentProvider || "manual",
            source: "admin",
            amountCents: Number(updated.planPriceCents || 0)
          });
        }
        if (current.paymentStatus !== updated.paymentStatus) {
          paymentEntries.push({
            title: "Status de pagamento ajustado manualmente",
            details: `O pagamento passou de ${current.paymentStatus || "nao informado"} para ${updated.paymentStatus || "nao informado"}.`,
            status: updated.paymentStatus,
            provider: updated.paymentProvider || "manual",
            source: "admin"
          });
        }
        if ((current.paymentDueAt || "") !== (updated.paymentDueAt || "")) {
          paymentEntries.push({
            title: "Vigencia comercial atualizada",
            details: updated.paymentDueAt
              ? `A data de vigencia foi definida para ${updated.paymentDueAt.slice(0, 10)}.`
              : "A data de vigencia foi removida do cadastro.",
            status: updated.paymentStatus,
            provider: updated.paymentProvider || "manual",
            source: "admin"
          });
        }
        updated = paymentEntries.reduce((accumulator, entry) => appendPaymentHistory(accumulator, entry), updated);
      }

      users[index] = updated;
      writeUsers(users);
      return sendJson(res, 200, { user: serializeUser(readUserById(userId)), summary: buildDashboardSummary(readUsers()) });
    }

    if (adminUserMatch && req.method === "DELETE") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      const userId = adminUserMatch[1];
      const users = readUsers();
      const current = users.find((item) => item.id === userId);
      if (!current) {
        return sendJson(res, 404, { message: "Usuario nao localizado." });
      }

      if (adminUser.id === userId) {
        return sendJson(res, 400, { message: "Nao e permitido excluir o administrador em uso." });
      }

      const adminCount = users.filter((item) => item.role === "admin").length;
      if (current.role === "admin" && adminCount <= 1) {
        return sendJson(res, 400, { message: "Mantenha pelo menos um administrador ativo na plataforma." });
      }

      const idsToDelete = new Set([current.id]);
      let deletedManagedDoctors = 0;
      const now = new Date().toISOString();

      if (current.role === "buyer" && normalizeAccountType(current.accountType) === "company") {
        users.forEach((item) => {
          if (isCompanyManagedDoctor(item) && normalizeText(item.linkedCompanyId) === current.id) {
            idsToDelete.add(item.id);
            deletedManagedDoctors += 1;
          }
        });
      }

      let nextUsers = users.filter((item) => !idsToDelete.has(item.id));

      if (isCompanyManagedDoctor(current) && normalizeText(current.linkedCompanyId)) {
        const companyId = normalizeText(current.linkedCompanyId);
        const companyIndex = nextUsers.findIndex((item) => item.id === companyId);
        if (companyIndex >= 0) {
          const linkedDoctorId = normalizeText(current.linkedCompanyDoctorId);
          const companyUser = nextUsers[companyIndex];
          const companyDoctors = normalizeCompanyDoctors(companyUser.linkedDoctors);
          const filteredDoctors = companyDoctors.filter((doctor) => {
            if (linkedDoctorId && doctor.id === linkedDoctorId) {
              return false;
            }
            if (normalizeText(doctor.accessUserId) === current.id) {
              return false;
            }
            return true;
          });

          nextUsers[companyIndex] = appendCompanyActivityRecord({
            ...companyUser,
            linkedDoctors: filteredDoctors,
            updatedAt: now
          }, {
            doctorName: normalizeText(current.contactName) || normalizeText(current.username) || "Medico corporativo",
            action: `Medico removido pelo painel administrativo (${normalizeText(current.username) || "sem usuario"})`,
            occurredAt: now
          });
        }
      }

      destroySessionsForUsers(Array.from(idsToDelete));
      writeUsers(nextUsers);

      const removedLinkedUsers = Math.max(0, idsToDelete.size - 1);
      const message = current.role === "buyer" && normalizeAccountType(current.accountType) === "company"
        ? (deletedManagedDoctors
          ? `Empresa excluida com ${deletedManagedDoctors} acesso(s) medico(s) vinculado(s).`
          : "Empresa excluida com sucesso.")
        : current.role === "admin"
          ? "Administrador excluido com sucesso."
          : "Usuario excluido com sucesso.";

      return sendJson(res, 200, {
        ok: true,
        deletedUserId: current.id,
        removedLinkedUsers,
        message,
        summary: buildDashboardSummary(nextUsers)
      });
    }

    const adminPlanMatch = pathname.match(/^\/api\/admin\/plans\/([a-zA-Z0-9_-]+)$/);
    if (adminPlanMatch && req.method === "PATCH") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      const planId = adminPlanMatch[1];
      const body = await readJsonBody(req);
      const plans = readPlans({ includeInactive: true });
      const index = plans.findIndex((plan) => plan.id === planId);
      if (index === -1) {
        return sendJson(res, 404, { message: "Plano nao localizado." });
      }

      const currentPlan = plans[index];
      let nextPlan;
      try {
        nextPlan = validateAndBuildAdminPlanPayload({ ...currentPlan, ...body, id: currentPlan.id }, { isCreate: false });
      } catch (error) {
        return sendJson(res, 400, { message: error.message || "Nao foi possivel validar o plano informado." });
      }
      plans[index] = { ...currentPlan, ...nextPlan, id: currentPlan.id };
      writePlans(plans);

      const syncResult = await syncUsersFromPlanCatalogUpdate(currentPlan, plans[index]);
      return sendJson(res, 200, {
        message: buildPlanUpdateMessage(syncResult),
        plans: readPlans({ includeInactive: true }),
        summary: buildDashboardSummary(readUsers())
      });
    }

    const paymentLinkMatch = pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)\/payment-link$/);
    if (paymentLinkMatch && req.method === "POST") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }
      if (!MP_ACCESS_TOKEN) {
        return sendJson(res, 400, { message: "Mercado Pago nao configurado. Informe MP_ACCESS_TOKEN e APP_BASE_URL." });
      }

      const user = readUserById(paymentLinkMatch[1]);
      if (!user) {
        return sendJson(res, 404, { message: "Usuario nao localizado." });
      }
      if (user.role !== "buyer") {
        return sendJson(res, 400, { message: "O link de pagamento e exclusivo para clientes." });
      }

      const plan = getPlanById(user.planId || "mensal", { includeInactive: true });
      const reusableSubscriptionError = getSubscriptionRenewalBlocker(user, plan);
      if (reusableSubscriptionError) {
        return sendJson(res, 400, { message: reusableSubscriptionError, user: serializeUser(user) });
      }

      const checkout = await createBillingCheckout({ user, plan, req, purpose: "renewal" });
      const updated = updateUserRecord(user.id, (current) => appendPaymentHistory({
        ...current,
        mpPreferenceId: checkout.preferenceId || "",
        mpCheckoutUrl: checkout.checkoutUrl,
        mpSubscriptionId: checkout.subscriptionId || current.mpSubscriptionId || "",
        mpSubscriptionStatus: checkout.subscriptionStatus || current.mpSubscriptionStatus || "",
        paymentProvider: "mercadopago",
        paymentStatus: current.paymentStatus === "approved" ? "approved" : "pending",
        renewalOfferedAt: new Date().toISOString(),
        lastPaymentAttemptAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, {
        title: normalizePlanBillingModel(plan.billingModel) === "subscription"
          ? "Assinatura de renovacao preparada"
          : "Link de pagamento administrativo gerado",
        details: normalizePlanBillingModel(plan.billingModel) === "subscription"
          ? `O administrador preparou uma assinatura recorrente para o plano ${plan.label}.`
          : `O administrador gerou um checkout comercial para reativar o plano ${plan.label}.`,
        status: "pending",
        provider: "mercadopago",
        source: "admin",
        referenceId: checkout.subscriptionId || checkout.preferenceId || "",
        amountCents: Number(plan.priceCents || 0),
        dedupKey: `admin-renewal:${user.id}:${checkout.subscriptionId || checkout.preferenceId || `${plan.id}:admin`}`
      }));

      return sendJson(res, 200, { checkout, user: serializeUser(updated) });
    }

    const renewalContactMatch = pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)\/renewal-contact$/);
    if (renewalContactMatch && req.method === "POST") {
      const adminUser = requireAdmin(req, res);
      if (!adminUser) {
        return;
      }

      const user = readUserById(renewalContactMatch[1]);
      if (!user) {
        return sendJson(res, 404, { message: "Usuario nao localizado." });
      }
      if (user.role !== "buyer") {
        return sendJson(res, 400, { message: "O acompanhamento de renovacao e exclusivo para clientes." });
      }

      const body = await readJsonBody(req);
      const channel = normalizeText(body.channel || "manual");
      const updated = updateUserRecord(user.id, (current) => ({
        ...current,
        renewalContactedAt: new Date().toISOString(),
        renewalContactChannel: channel,
        updatedAt: new Date().toISOString()
      }));

      return sendJson(res, 200, { user: serializeUser(updated), summary: buildDashboardSummary(readUsers()) });
    }

    if (pathname === "/api/webhooks/mercadopago" && req.method === "POST") {
      const body = await readJsonBody(req);
      const signatureValidation = validateMercadoPagoWebhookSignature(req, requestUrl, body);
      if (!signatureValidation.valid) {
        return sendJson(res, 401, { message: "Assinatura do webhook Mercado Pago invalida." });
      }
      queueMercadoPagoWebhookProcessing(body, requestUrl).catch((error) => {
        console.error("Falha ao processar webhook Mercado Pago:", error);
      });
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === "/" || pathname === "/index.html") {
      return serveFile(res, path.join(ROOT_DIR, "index.html"));
    }
    if (pathname === "/style.css") {
      return serveFile(res, path.join(ROOT_DIR, "style.css"));
    }
    if (pathname === "/app.js") {
      return serveFile(res, path.join(ROOT_DIR, "app.js"));
    }
    if (pathname === "/official_page1.png") {
      return serveFile(res, path.join(ROOT_DIR, "official_page1.png"));
    }
    const aliasedStaticAsset = resolveAliasedStaticAsset(pathname);
    if (aliasedStaticAsset) {
      return serveFile(res, aliasedStaticAsset);
    }
    if (pathname.startsWith("/img/")) {
      const filePath = path.join(ROOT_DIR, pathname);
      if (!filePath.startsWith(path.join(ROOT_DIR, "img"))) {
        return sendJson(res, 403, { message: "Acesso negado." });
      }
      return serveFile(res, filePath);
    }

    return sendJson(res, 404, { message: "Rota nao encontrada." });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { message: "Erro interno do servidor." });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Enquadra PcD online em http://${HOST === "0.0.0.0" ? "127.0.0.1" : HOST}:${PORT}`);
});

function ensureDataStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
  }
  if (!fs.existsSync(PLANS_FILE)) {
    fs.writeFileSync(PLANS_FILE, JSON.stringify(buildDefaultPlanCatalog(), null, 2), "utf8");
  }
  ensureDefaultAdmin();
  ensureDefaultPlanCatalogFile();
}

function resolveAliasedStaticAsset(pathname) {
  const candidates = STATIC_IMAGE_ALIASES[pathname];
  if (!candidates || !candidates.length) {
    return "";
  }

  for (const candidate of candidates) {
    const filePath = path.join(ROOT_DIR, ...String(candidate).split("/"));
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return "";
}

function ensureDefaultAdmin() {
  const users = readUsersRaw();
  const existingAdmin = users.find((item) => item.role === "admin" && item.usernameKey === normalizeUserIdentifier(DEFAULT_ADMIN_USERNAME));
  if (existingAdmin) {
    return;
  }

  const now = new Date().toISOString();
  const credential = hashPassword(DEFAULT_ADMIN_PASSWORD);
  users.push({
    id: crypto.randomUUID(),
    company: DEFAULT_ADMIN_COMPANY,
    contactName: "Administrador da plataforma",
    email: "",
    username: DEFAULT_ADMIN_USERNAME,
    usernameKey: normalizeUserIdentifier(DEFAULT_ADMIN_USERNAME),
    role: "admin",
    status: "active",
    paymentStatus: "approved",
    paymentDueAt: null,
    paymentLastApprovedAt: now,
    planId: "internal",
    planLabel: "Administracao interna",
    planPriceCents: 0,
    billingCycleMonths: 0,
    planLaudoLimit: null,
    planBillingModel: "internal",
    planQuotaPeriod: "none",
    paymentProvider: "manual",
    usageCount: 0,
    currentCycleUsageCount: 0,
    currentCycleStartedAt: null,
    lastAccessAt: null,
    lastPaymentAttemptAt: null,
    mpPreferenceId: "",
    mpCheckoutUrl: "",
    mpLastPaymentId: "",
    mpSubscriptionId: "",
    mpSubscriptionStatus: "",
    notes: "Administrador padrao da plataforma.",
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    passwordSalt: credential.salt,
    passwordHash: credential.hash
  });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function ensureDefaultPlanCatalogFile() {
  const currentPlans = readPlansRaw();
  const normalizedPlans = normalizePlanCatalog(currentPlans);
  const defaultPlans = buildDefaultPlanCatalog();
  const changed = JSON.stringify(normalizedPlans) !== JSON.stringify(currentPlans)
    || defaultPlans.some((defaultPlan) => !normalizedPlans.some((plan) => plan.id === defaultPlan.id));

  if (!changed) {
    return;
  }

  const mergedPlans = mergePlanCatalogWithDefaults(normalizedPlans, defaultPlans);
  fs.writeFileSync(PLANS_FILE, JSON.stringify(mergedPlans, null, 2), "utf8");
}

function readUsersRaw() {
  const raw = fs.readFileSync(USERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function buildDefaultPlanCatalog() {
  return normalizePlanCatalog(DEFAULT_PLAN_CATALOG);
}

function readPlansRaw() {
  const raw = fs.readFileSync(PLANS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function readPlans(options = {}) {
  const plans = normalizePlanCatalog(readPlansRaw());
  const includeInactive = Boolean(options.includeInactive);
  return includeInactive ? plans : plans.filter((plan) => plan.status === "active");
}

function writePlans(plans) {
  fs.writeFileSync(PLANS_FILE, JSON.stringify(normalizePlanCatalog(plans), null, 2), "utf8");
}

function normalizePlanCatalog(plans = []) {
  const source = Array.isArray(plans) && plans.length ? plans : buildDefaultPlanCatalogFallback();
  const seen = new Set();
  return source
    .map((plan, index) => normalizePlanRecord(plan, index))
    .filter((plan) => {
      if (!plan || !plan.id || seen.has(plan.id)) {
        return false;
      }
      seen.add(plan.id);
      return true;
    })
    .sort((left, right) => {
      const leftOrder = Number(left.sortOrder || 0);
      const rightOrder = Number(right.sortOrder || 0);
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      return left.label.localeCompare(right.label, "pt-BR");
    });
}

function buildDefaultPlanCatalogFallback() {
  return DEFAULT_PLAN_CATALOG.map((plan) => ({ ...plan }));
}

function mergePlanCatalogWithDefaults(currentPlans = [], defaultPlans = []) {
  const current = normalizePlanCatalog(currentPlans);
  const defaults = normalizePlanCatalog(defaultPlans);
  const byId = new Map(current.map((plan) => [plan.id, plan]));

  defaults.forEach((plan) => {
    if (!byId.has(plan.id)) {
      byId.set(plan.id, plan);
    }
  });

  return normalizePlanCatalog(Array.from(byId.values()));
}

function normalizePlanRecord(plan = {}, index = 0) {
  const audienceKey = normalizePlanAudienceKey(plan.audienceKey || plan.audience);
  const billingModel = normalizePlanBillingModel(plan.billingModel);
  const laudoLimit = normalizePlanLaudoLimit(plan.laudoLimit);
  const quotaPeriod = normalizePlanQuotaPeriod(plan.quotaPeriod, billingModel, laudoLimit);
  const label = normalizeText(plan.label || "").slice(0, 120) || `Plano ${index + 1}`;
  const description = normalizeText(plan.description || "").slice(0, 320);
  const status = normalizePlanStatus(plan.status);
  const sortOrder = Number.isFinite(Number(plan.sortOrder)) ? Number(plan.sortOrder) : (index * 10);
  const generatedId = slugifyPlanId(plan.id || `${audienceKey}_${label}`);

  return {
    id: generatedId || `plan_${index + 1}`,
    label,
    audience: audienceKey === "doctor" ? "Medico" : "Empresa",
    audienceKey,
    priceCents: normalizePlanPriceCents(plan.priceCents),
    months: normalizePlanMonths(plan.months),
    laudoLimit,
    description,
    billingModel,
    quotaPeriod,
    status,
    sortOrder,
    mercadopagoPlanId: normalizeText(plan.mercadopagoPlanId || "")
  };
}

function normalizePlanAudienceKey(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (["medico", "médico", "doctor", "individual"].includes(normalized)) {
    return "doctor";
  }
  return "company";
}

function normalizePlanBillingModel(value) {
  return normalizeText(value).toLowerCase() === "subscription" ? "subscription" : "one_time";
}

function normalizePlanQuotaPeriod(value, billingModel, laudoLimit) {
  if (laudoLimit === null) {
    return "none";
  }
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "monthly") {
    return "monthly";
  }
  if (normalized === "contract") {
    return "contract";
  }
  return billingModel === "subscription" ? "monthly" : "contract";
}

function normalizePlanStatus(value) {
  return normalizeText(value).toLowerCase() === "inactive" ? "inactive" : "active";
}

function normalizePlanPriceCents(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }
  return Math.round(numeric);
}

function normalizePlanMonths(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 1;
  }
  return Math.max(1, Math.round(numeric));
}

function normalizePlanLaudoLimit(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }
  return Math.round(numeric);
}

function slugifyPlanId(value) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

function readUsers() {
  const users = readUsersRaw();
  const normalized = applyLifecycleRules(users);
  if (normalized.changed) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(normalized.users, null, 2), "utf8");
  }
  return normalized.users;
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function readUserById(userId) {
  return readUsers().find((item) => item.id === userId) || null;
}

function updateUserRecord(userId, transform) {
  const users = readUsers();
  const index = users.findIndex((item) => item.id === userId);
  if (index === -1) {
    return null;
  }
  const nextUser = transform({ ...users[index] });
  users[index] = nextUser;
  writeUsers(users);
  return nextUser;
}

function buildUserRecord({
  company,
  companyCnpj,
  username,
  password,
  role,
  status,
  paymentStatus,
  paymentDueAt,
  email,
  contactName,
  planId,
  createdBy,
  notes,
  accountType,
  crmNumber,
  crmState,
  doctorCpf,
  doctorBirthDate,
  crmValidated,
  legalAccepted,
  doctorAccepted,
  companyLogoDataUrl,
  responsibilityMode,
  linkedCompanyId,
  linkedCompanyDoctorId,
  linkedDoctors,
  activityLog,
  documentHistory,
  paymentHistory
}) {
  const now = new Date().toISOString();
  const plan = getPlanById(planId || "mensal", { includeInactive: true });
  const credential = hashPassword(password);

  return {
    id: crypto.randomUUID(),
    company,
    contactName: normalizeText(contactName),
    email: normalizeEmail(email),
    username,
    usernameKey: normalizeUserIdentifier(username),
    role,
    companyCnpj: role === "buyer" && normalizeAccountType(accountType) === "company" ? normalizeCnpj(companyCnpj) : "",
    companyLogoDataUrl: role === "buyer" ? normalizeImageDataUrl(companyLogoDataUrl) : "",
    status,
    paymentStatus,
    paymentDueAt,
    paymentLastApprovedAt: paymentStatus === "approved" ? now : null,
    planId: role === "admin" ? "internal" : plan.id,
    planLabel: role === "admin" ? "Administracao interna" : plan.label,
    planPriceCents: role === "admin" ? 0 : plan.priceCents,
    billingCycleMonths: role === "admin" ? 0 : plan.months,
    planLaudoLimit: role === "admin" ? null : plan.laudoLimit,
    planBillingModel: role === "admin" ? "internal" : normalizePlanBillingModel(plan.billingModel),
    planQuotaPeriod: role === "admin" ? "none" : normalizePlanQuotaPeriod(plan.quotaPeriod, plan.billingModel, plan.laudoLimit),
    paymentProvider: role === "admin" ? "manual" : (MP_ACCESS_TOKEN ? "mercadopago" : "manual"),
    usageCount: 0,
    currentCycleUsageCount: 0,
    currentCycleStartedAt: paymentStatus === "approved" ? now : null,
    lastAccessAt: null,
    lastPaymentAttemptAt: null,
    mpPreferenceId: "",
    mpCheckoutUrl: "",
    mpLastPaymentId: "",
    mpSubscriptionId: "",
    mpSubscriptionStatus: "",
    notes: normalizeText(notes),
    accountType: normalizeAccountType(role === "admin" ? "company" : accountType),
    crmNumber: role === "admin" ? "" : String(crmNumber || "").replace(/\D/g, ""),
    crmState: role === "admin" ? "" : normalizeText(crmState).toUpperCase(),
    doctorCpf: role === "admin" ? "" : String(doctorCpf || "").replace(/\D/g, ""),
    doctorBirthDate: role === "admin" ? "" : normalizeDateInput(doctorBirthDate),
    crmValidated: role === "admin" ? false : Boolean(crmValidated),
    legalAcceptedAt: role === "admin" ? null : (legalAccepted ? now : null),
    doctorAcceptedAt: role === "admin" ? null : (normalizeAccountType(accountType) === "doctor" && doctorAccepted ? now : null),
    responsibilityMode: role === "admin" ? "" : normalizeResponsibilityMode(responsibilityMode),
    linkedCompanyId: role === "admin" ? "" : normalizeText(linkedCompanyId),
    linkedCompanyDoctorId: role === "admin" ? "" : normalizeText(linkedCompanyDoctorId),
    linkedDoctors: role === "buyer" && normalizeAccountType(accountType) === "company" ? normalizeCompanyDoctors(linkedDoctors) : [],
    activityLog: role === "buyer" && normalizeAccountType(accountType) === "company" ? normalizeCompanyActivityLog(activityLog) : [],
    documentHistory: role === "buyer" && normalizeAccountType(accountType) === "company" ? normalizeCompanyDocumentHistory(documentHistory, 0) : [],
    paymentHistory: role === "admin" ? [] : normalizePaymentHistory(paymentHistory),
    renewalOfferedAt: null,
    renewalContactedAt: null,
    renewalContactChannel: "",
    createdBy: normalizeText(createdBy),
    createdAt: now,
    updatedAt: now,
    passwordSalt: credential.salt,
    passwordHash: credential.hash
  };
}

function buildPublicBootstrap() {
  const users = readUsers();
  return {
    configured: users.some((item) => item.role === "admin"),
    mercadopagoConfigured: Boolean(MP_ACCESS_TOKEN),
    plans: readPlans({ includeInactive: false }),
    insights: [
      "Plataforma de apoio tecnico para organizacao e descricao funcional em processos de caracterizacao de PCD.",
      "Jornada comercial com avisos legais, diferenciacao entre empresa, medico e demonstracao, e bloqueio de interpretacoes indevidas.",
      "Fluxos guiados para avaliacao ocupacional com suporte a minuta tecnica, revisao profissional e controle institucional.",
      "Base SaaS com controle de clientes, acessos, pagamento, consumo por laudos e governanca de uso."
    ],
    summary: buildDashboardSummary(users)
  };
}

function buildDashboardSummary(users) {
  const clients = users.filter((item) => item.role === "buyer" && !isCompanyManagedDoctor(item));
  const renewalSnapshots = clients.map((item) => ({ user: item, renewal: buildRenewalSnapshot(item) }));
  return {
    totalClients: clients.length,
    totalAdmins: users.filter((item) => item.role === "admin").length,
    activeClients: clients.filter((item) => item.status === "active").length,
    blockedClients: clients.filter((item) => item.status === "blocked").length,
    delinquentClients: clients.filter((item) => item.status === "inadimplente").length,
    pendingPayments: clients.filter((item) => item.paymentStatus === "pending").length,
    approvedPayments: clients.filter((item) => item.paymentStatus === "approved").length,
    totalReports: clients.reduce((sum, item) => sum + Number(item.usageCount || 0), 0),
    expiringSoonClients: renewalSnapshots.filter((item) => ["attention", "urgent"].includes(item.renewal.stage)).length,
    renewalContactPendingClients: renewalSnapshots.filter((item) => item.renewal.needsContact && !item.user.renewalContactedAt).length,
    individualPlanCount: clients.filter((item) => String(item.planId || "").startsWith("individual_")).length,
    businessPlanCount: clients.filter((item) => String(item.planId || "").startsWith("empresarial_")).length
  };
}

function buildRenewalSnapshot(user) {
  if (!user || user.role === "admin") {
    return {
      dueAt: null,
      daysRemaining: null,
      stage: "not_applicable",
      label: "Nao se aplica",
      needsContact: false,
      canRenew: false
    };
  }

  const dueAt = user.paymentDueAt || user.expiresAt || null;
  if (!dueAt) {
    return {
      dueAt: null,
      daysRemaining: null,
      stage: "without_due_date",
      label: "Sem vigencia definida",
      needsContact: false,
      canRenew: false
    };
  }

  const dueDate = new Date(dueAt);
  if (Number.isNaN(dueDate.getTime())) {
    return {
      dueAt,
      daysRemaining: null,
      stage: "without_due_date",
      label: "Vigencia invalida",
      needsContact: false,
      canRenew: false
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const paymentStatus = normalizePaymentStatus(user.paymentStatus);

  if (paymentStatus === "expired" || user.status === "inadimplente" || daysRemaining < 0) {
    return {
      dueAt,
      daysRemaining,
      stage: "expired",
      label: "Plano vencido",
      needsContact: true,
      canRenew: true
    };
  }

  if (daysRemaining <= 7) {
    return {
      dueAt,
      daysRemaining,
      stage: "urgent",
      label: "Renovacao urgente",
      needsContact: true,
      canRenew: true
    };
  }

  if (daysRemaining <= 15) {
    return {
      dueAt,
      daysRemaining,
      stage: "attention",
      label: "Vencendo em breve",
      needsContact: true,
      canRenew: true
    };
  }

  return {
    dueAt,
    daysRemaining,
    stage: "active",
    label: "Plano ativo",
    needsContact: false,
    canRenew: true
  };
}

function applyLifecycleRules(users) {
  let changed = false;
  const normalized = users.map((user) => {
    const next = { ...user };

    if (next.role === "admin") {
      if (next.status !== "active") {
        next.status = "active";
        changed = true;
      }
      if (next.paymentStatus !== "approved") {
        next.paymentStatus = "approved";
        changed = true;
      }
      next.paymentDueAt = null;
      return next;
    }

    const plan = getPlanById(next.planId || "mensal", { includeInactive: true });
    if (plan) {
      const normalizedBillingModel = normalizePlanBillingModel(next.planBillingModel || plan.billingModel);
      const normalizedQuotaPeriod = normalizePlanQuotaPeriod(next.planQuotaPeriod || plan.quotaPeriod, normalizedBillingModel, next.planLaudoLimit === undefined ? plan.laudoLimit : next.planLaudoLimit);

      if (!next.planLabel) {
        next.planLabel = plan.label;
        changed = true;
      }
      if (next.planPriceCents === undefined || next.planPriceCents === null) {
        next.planPriceCents = plan.priceCents;
        changed = true;
      }
      if (next.billingCycleMonths === undefined || next.billingCycleMonths === null) {
        next.billingCycleMonths = plan.months;
        changed = true;
      }
      if (next.planLaudoLimit === undefined) {
        next.planLaudoLimit = plan.laudoLimit;
        changed = true;
      }
      if (next.planBillingModel !== normalizedBillingModel) {
        next.planBillingModel = normalizedBillingModel;
        changed = true;
      }
      if (next.planQuotaPeriod !== normalizedQuotaPeriod) {
        next.planQuotaPeriod = normalizedQuotaPeriod;
        changed = true;
      }
    }

    if (next.currentCycleUsageCount === undefined || next.currentCycleUsageCount === null) {
      next.currentCycleUsageCount = Math.max(0, Number(next.usageCount || 0));
      changed = true;
    }
    if (!next.currentCycleStartedAt) {
      next.currentCycleStartedAt = next.paymentLastApprovedAt || next.createdAt || next.updatedAt || new Date().toISOString();
      changed = true;
    }
    if (next.mpSubscriptionId === undefined) {
      next.mpSubscriptionId = "";
      changed = true;
    }
    if (next.mpSubscriptionStatus === undefined) {
      next.mpSubscriptionStatus = "";
      changed = true;
    }
    if (!Array.isArray(next.paymentHistory)) {
      next.paymentHistory = [];
      changed = true;
    }
    const normalizedPaymentHistory = normalizePaymentHistory(next.paymentHistory);
    if (JSON.stringify(normalizedPaymentHistory) !== JSON.stringify(next.paymentHistory)) {
      next.paymentHistory = normalizedPaymentHistory;
      changed = true;
    }

    if (next.paymentStatus === "approved" && next.paymentDueAt && new Date(next.paymentDueAt).getTime() < Date.now()) {
      next.paymentStatus = "expired";
      if (next.status !== "blocked") {
        next.status = "inadimplente";
      }
      next.updatedAt = new Date().toISOString();
      changed = true;
    }

    return next;
  });

  const companyById = new Map(
    normalized
      .filter((item) => item.role === "buyer" && normalizeAccountType(item.accountType) === "company")
      .map((item) => [item.id, item])
  );

  const synced = normalized.map((user) => {
    if (!isCompanyManagedDoctor(user)) {
      return user;
    }

    const companyUser = companyById.get(normalizeText(user.linkedCompanyId));
    if (!companyUser) {
      return user;
    }

    const next = syncCompanyManagedDoctorRecord(user, companyUser);
    if (JSON.stringify(next) !== JSON.stringify(user)) {
      next.updatedAt = new Date().toISOString();
      changed = true;
    }
    return next;
  });

  return { users: synced, changed };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  if (!user || !user.passwordSalt || !user.passwordHash) {
    return false;
  }
  const hash = crypto.scryptSync(String(password || ""), user.passwordSalt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function normalizeCidCode(value) {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(",", ".")
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9.]/g, "");
  if (!raw) {
    return "";
  }

  const collapsed = raw.replace(/\./g, "");
  if (!raw.includes(".") && /^[A-Z]\d{2}[A-Z0-9]{1,4}$/.test(collapsed)) {
    return `${collapsed.slice(0, 3)}.${collapsed.slice(3, 7)}`;
  }

  if (/^[A-Z]\d{2}\.[A-Z0-9]{1,4}$/.test(raw)) {
    const [head, tail] = raw.split(".");
    return `${head}.${tail.slice(0, 4)}`;
  }

  return raw;
}

function loadCidCatalog() {
  try {
    const raw = fs.readFileSync(CID_MAP_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const nextMap = Object.create(null);
    const nextEntries = [];

    Object.entries(parsed && typeof parsed === "object" ? parsed : {}).forEach(([code, description]) => {
      const normalizedCode = normalizeCidCode(code);
      const normalizedDescription = normalizeText(description);
      if (!normalizedCode || !normalizedDescription) {
        return;
      }

      nextMap[normalizedCode] = normalizedDescription;
      nextEntries.push({
        code: normalizedCode,
        description: normalizedDescription,
        searchIndex: `${normalizedCode} ${normalizeSearchText(normalizedDescription)}`
      });
    });

    cidCatalogMap = nextMap;
    cidCatalogEntries = nextEntries;
  } catch (error) {
    console.warn("[cid-catalog] Nao foi possivel carregar a base local de CID.", error && error.message ? error.message : error);
    cidCatalogMap = Object.create(null);
    cidCatalogEntries = [];
  }
}

function lookupLocalCidDescription(code) {
  return cidCatalogMap[normalizeCidCode(code)] || "";
}

function searchCidCatalog(query, limit = 8) {
  const normalizedCode = normalizeCidCode(query);
  const searchQuery = normalizeSearchText(query);
  if (!normalizedCode && !searchQuery) {
    return [];
  }

  const prefixMatches = [];
  const descriptionMatches = [];

  cidCatalogEntries.forEach((entry) => {
    if (prefixMatches.length >= limit && descriptionMatches.length >= limit) {
      return;
    }

    if (normalizedCode && entry.code.startsWith(normalizedCode)) {
      prefixMatches.push(entry);
      return;
    }

    if (searchQuery && entry.searchIndex.includes(searchQuery)) {
      descriptionMatches.push(entry);
    }
  });

  return [...prefixMatches, ...descriptionMatches]
    .slice(0, limit)
    .map((entry) => ({ code: entry.code, description: entry.description }));
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint) || 0))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16) || 0));
}

function stripHtmlTags(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function buildCidLookupUrl(code) {
  return `https://${CID_LOOKUP_HOST}/busca?q=${encodeURIComponent(normalizeCidCode(code))}`;
}

function isCidLookupCacheFresh(entry) {
  return Boolean(entry && entry.storedAt && (Date.now() - entry.storedAt) < CID_LOOKUP_CACHE_TTL_MS);
}

function extractCidDescriptionFromSearchHtml(html, code) {
  const normalizedCode = normalizeCidCode(code);
  if (!html || !normalizedCode) {
    return "";
  }

  const resultPattern = /<span[^>]*>\s*CID\s*(?:<!--\s*-->)?\s*([A-Z0-9.,]+)\s*<\/span>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = resultPattern.exec(String(html))) !== null) {
    const foundCode = normalizeCidCode(decodeHtmlEntities(stripHtmlTags(match[1])));
    if (foundCode !== normalizedCode) {
      continue;
    }

    const description = normalizeText(
      decodeHtmlEntities(stripHtmlTags(match[2])).replace(/\s+/g, " ")
    );
    if (description) {
      return description;
    }
  }

  return "";
}

function fetchRemoteText(urlString) {
  return new Promise((resolve, reject) => {
    const target = new URL(urlString);
    const request = https.request({
      protocol: target.protocol,
      hostname: target.hostname,
      path: `${target.pathname}${target.search}`,
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36"
      },
      timeout: 10000
    }, (response) => {
      if (
        response.statusCode >= 300
        && response.statusCode < 400
        && response.headers.location
      ) {
        response.resume();
        resolve(fetchRemoteText(new URL(response.headers.location, target).toString()));
        return;
      }

      let raw = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        raw += chunk;
      });
      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(raw);
          return;
        }
        reject(new Error(`Consulta externa de CID retornou status ${response.statusCode || 0}.`));
      });
    });

    request.on("timeout", () => {
      request.destroy(new Error("Tempo esgotado na consulta externa do CID."));
    });
    request.on("error", reject);
    request.end();
  });
}

async function lookupCidDescriptionByCode(code) {
  const normalizedCode = normalizeCidCode(code);
  const sourceUrl = buildCidLookupUrl(normalizedCode);
  if (!normalizedCode) {
    return { found: false, description: "", sourceUrl, cached: false };
  }

  const localDescription = lookupLocalCidDescription(normalizedCode);
  if (localDescription) {
    return {
      found: true,
      description: localDescription,
      sourceUrl: "local-catalog",
      cached: true,
      source: "local"
    };
  }

  const cachedEntry = cidLookupCache.get(normalizedCode);
  if (isCidLookupCacheFresh(cachedEntry)) {
    return {
      found: Boolean(cachedEntry.found),
      description: cachedEntry.description || "",
      sourceUrl: cachedEntry.sourceUrl || sourceUrl,
      cached: true,
      source: cachedEntry.source || "external"
    };
  }

  const html = await fetchRemoteText(sourceUrl);
  const description = extractCidDescriptionFromSearchHtml(html, normalizedCode);
  const nextEntry = {
    found: Boolean(description),
    description,
    sourceUrl,
    storedAt: Date.now(),
    source: "external"
  };
  cidLookupCache.set(normalizedCode, nextEntry);

  return {
    found: nextEntry.found,
    description: nextEntry.description,
    sourceUrl,
    cached: false,
    source: "external"
  };
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeCnpj(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 14);
}

function normalizeUserIdentifier(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeAccountType(value) {
  return value === "doctor" ? "doctor" : "company";
}

function normalizeResponsibilityMode(value) {
  return value === "company" ? "company" : "";
}

function normalizeRole(value) {
  return value === "admin" ? "admin" : "buyer";
}

function normalizeStatus(value) {
  if (value === "blocked") {
    return "blocked";
  }
  if (value === "inadimplente") {
    return "inadimplente";
  }
  return "active";
}

function normalizePaymentStatus(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (["approved", "pending", "rejected", "cancelled", "expired"].includes(normalized)) {
    return normalized;
  }
  return "pending";
}

function normalizeDueDate(value) {
  if (!value) {
    return null;
  }
  const candidate = new Date(value);
  if (Number.isNaN(candidate.getTime())) {
    return null;
  }
  candidate.setHours(23, 59, 59, 999);
  return candidate.toISOString();
}

function normalizeDateInput(value) {
  if (!value) {
    return "";
  }
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }
  const candidate = new Date(text);
  if (Number.isNaN(candidate.getTime())) {
    return "";
  }
  return candidate.toISOString().slice(0, 10);
}

function normalizeImageDataUrl(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  if (!/^data:image\/(png|jpe?g|webp|svg\+xml);base64,[a-z0-9+/=]+$/i.test(text)) {
    return "";
  }
  return text.length <= 900000 ? text : "";
}

function buildAccessSlug(value) {
  const text = normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return text || "medico";
}

function generateCompanyDoctorUsername(name, users) {
  const base = buildAccessSlug(name).slice(0, 24) || "medico";
  let attempt = base;
  let counter = 2;

  while (users.some((item) => item.usernameKey === normalizeUserIdentifier(attempt))) {
    attempt = `${base}${counter}`.slice(0, 28);
    counter += 1;
  }

  return attempt;
}

function generateCompanyDoctorPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "";
  for (let index = 0; index < 10; index += 1) {
    password += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return password;
}

function isCompanyManagedDoctor(user) {
  return Boolean(user
    && user.role === "buyer"
    && normalizeAccountType(user.accountType) === "doctor"
    && normalizeResponsibilityMode(user.responsibilityMode) === "company"
    && normalizeText(user.linkedCompanyId));
}

function syncCompanyManagedDoctorRecord(user, companyUser) {
  if (!isCompanyManagedDoctor(user) || !companyUser) {
    return user;
  }

  return {
    ...user,
    company: companyUser.company,
    companyLogoDataUrl: normalizeImageDataUrl(companyUser.companyLogoDataUrl),
    planId: companyUser.planId || user.planId,
    planLabel: companyUser.planLabel || user.planLabel,
    planPriceCents: Number(companyUser.planPriceCents || 0),
    billingCycleMonths: Number(companyUser.billingCycleMonths || 0),
    planLaudoLimit: companyUser.planLaudoLimit === null || companyUser.planLaudoLimit === undefined
      ? null
      : Number(companyUser.planLaudoLimit),
    paymentStatus: companyUser.paymentStatus,
    paymentDueAt: companyUser.paymentDueAt || null,
    paymentLastApprovedAt: companyUser.paymentLastApprovedAt || user.paymentLastApprovedAt || null,
    status: user.status === "blocked"
      ? "blocked"
      : (companyUser.status === "blocked"
        ? "blocked"
        : (companyUser.status === "inadimplente" ? "inadimplente" : "active"))
  };
}

function normalizeCompanyDoctor(entry = {}) {
  const name = normalizeText(entry.name);
  const crm = String(entry.crm || "").replace(/\D/g, "").slice(0, 20);
  if (!name || !crm) {
    return null;
  }
  return {
    id: normalizeText(entry.id) || crypto.randomUUID(),
    name,
    crm,
    crmState: normalizeText(entry.crmState).toUpperCase(),
    specialty: normalizeText(entry.specialty),
    createdAt: normalizeDateTime(entry.createdAt),
    accessUserId: normalizeText(entry.accessUserId),
    accessUsername: normalizeText(entry.accessUsername),
    accessCreatedAt: normalizeDateTime(entry.accessCreatedAt),
    responsibilityMode: normalizeResponsibilityMode(entry.responsibilityMode || "company")
  };
}

function normalizeCompanyDoctors(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((entry) => normalizeCompanyDoctor(entry))
    .filter(Boolean)
    .slice(0, 200);
}

function normalizeCompanyActivity(entry = {}) {
  const action = normalizeText(entry.action);
  if (!action) {
    return null;
  }
  return {
    id: normalizeText(entry.id) || crypto.randomUUID(),
    doctorName: normalizeText(entry.doctorName) || "Administrativo da empresa",
    action,
    occurredAt: normalizeDateTime(entry.occurredAt)
  };
}

function normalizeCompanyActivityLog(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((entry) => normalizeCompanyActivity(entry))
    .filter(Boolean)
    .sort((left, right) => String(right.occurredAt).localeCompare(String(left.occurredAt)))
    .slice(0, 80);
}

function normalizeCompanyDocumentEntry(entry = {}) {
  const count = Math.max(0, Number(entry.count || 0));
  const date = normalizeDateInput(entry.date || entry.occurredAt);
  if (!date || !count) {
    return null;
  }
  return {
    id: normalizeText(entry.id) || crypto.randomUUID(),
    date,
    count,
    doctorName: normalizeText(entry.doctorName),
    source: normalizeText(entry.source) || "company"
  };
}

function normalizeCompanyDocumentHistory(list, fallbackUsageCount = 0) {
  const normalized = Array.isArray(list)
    ? list.map((entry) => normalizeCompanyDocumentEntry(entry)).filter(Boolean)
    : [];

  if (!normalized.length && Number(fallbackUsageCount || 0) > 0) {
    normalized.push({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      count: Number(fallbackUsageCount || 0),
      doctorName: "",
      source: "legacy"
    });
  }

  return normalized
    .sort((left, right) => String(left.date).localeCompare(String(right.date)))
    .slice(-180);
}

function normalizePaymentHistoryEntry(entry = {}) {
  const occurredAt = normalizeDateTime(entry.occurredAt);
  const amountCandidate = entry.amountCents;
  return {
    id: normalizeText(entry.id) || crypto.randomUUID(),
    title: normalizeText(entry.title) || "Atualizacao comercial",
    details: normalizeText(entry.details),
    status: normalizeText(entry.status).toLowerCase() || "info",
    provider: normalizeText(entry.provider) || "manual",
    source: normalizeText(entry.source) || "system",
    referenceId: normalizeText(entry.referenceId),
    amountCents: Number.isFinite(Number(amountCandidate)) ? Math.max(0, Math.round(Number(amountCandidate))) : null,
    occurredAt,
    dedupKey: normalizeText(entry.dedupKey)
  };
}

function normalizePaymentHistory(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  const unique = [];
  const seenDedupKeys = new Set();
  list.forEach((entry) => {
    const normalized = normalizePaymentHistoryEntry(entry);
    if (normalized.dedupKey) {
      if (seenDedupKeys.has(normalized.dedupKey)) {
        return;
      }
      seenDedupKeys.add(normalized.dedupKey);
    }
    unique.push(normalized);
  });

  return unique
    .sort((left, right) => String(right.occurredAt).localeCompare(String(left.occurredAt)))
    .slice(0, MAX_PAYMENT_HISTORY_ITEMS);
}

function appendPaymentHistory(user, entry) {
  const normalizedEntry = normalizePaymentHistoryEntry(entry);
  const existing = Array.isArray(user && user.paymentHistory) ? user.paymentHistory : [];
  const withoutSameKey = normalizedEntry.dedupKey
    ? existing.filter((item) => normalizeText(item && item.dedupKey) !== normalizedEntry.dedupKey)
    : existing;
  return {
    ...user,
    paymentHistory: normalizePaymentHistory([normalizedEntry, ...withoutSameKey])
  };
}

function normalizeDateTime(value) {
  const candidate = value ? new Date(value) : new Date();
  return Number.isNaN(candidate.getTime()) ? new Date().toISOString() : candidate.toISOString();
}

function appendCompanyActivityRecord(user, entry) {
  return {
    ...user,
    activityLog: normalizeCompanyActivityLog([...(Array.isArray(user.activityLog) ? user.activityLog : []), { ...entry, occurredAt: normalizeDateTime(entry && entry.occurredAt) }])
  };
}

function logCompanyActivity(userId, entry) {
  return updateUserRecord(userId, (current) => appendCompanyActivityRecord({
    ...current,
    updatedAt: new Date().toISOString()
  }, entry));
}

function syncCompanyUsageFromDoctor(doctorUser) {
  if (!doctorUser || normalizeAccountType(doctorUser.accountType) !== "doctor") {
    return;
  }

  const users = readUsers();
  const companyId = normalizeText(doctorUser.linkedCompanyId);
  const companyIndex = companyId
    ? users.findIndex((item) => item.id === companyId
      && item.role === "buyer"
      && normalizeAccountType(item.accountType) === "company")
    : users.findIndex((item) => item.role === "buyer"
      && normalizeAccountType(item.accountType) === "company"
      && normalizeText(item.company).toLowerCase() === normalizeText(doctorUser.company).toLowerCase());

  if (companyIndex === -1) {
    return;
  }

  const companyUser = users[companyIndex];
  const eventDate = new Date().toISOString();
  const nextHistory = normalizeCompanyDocumentHistory([
    ...(Array.isArray(companyUser.documentHistory) ? companyUser.documentHistory : []),
    {
      id: crypto.randomUUID(),
      date: eventDate.slice(0, 10),
      count: 1,
      doctorName: doctorUser.contactName || doctorUser.username || "Medico responsavel",
      source: "doctor"
    }
  ], Number(companyUser.usageCount || 0));

  const nextUser = appendCompanyActivityRecord({
    ...companyUser,
    usageCount: Number(companyUser.usageCount || 0) + 1,
    documentHistory: nextHistory,
    updatedAt: eventDate
  }, {
    doctorName: doctorUser.contactName || doctorUser.username || "Medico responsavel",
    action: "Documento registrado no ecossistema da empresa",
    occurredAt: eventDate
  });

  users[companyIndex] = nextUser;
  writeUsers(users);
}

function getPlanById(planId, options = {}) {
  const plans = readPlans({ includeInactive: Boolean(options.includeInactive) });
  const match = plans.find((item) => item.id === planId);
  if (match) {
    return match;
  }
  if (options.fallbackToFirst === false) {
    return null;
  }
  const fallbackPool = plans.length ? plans : buildDefaultPlanCatalog();
  return fallbackPool[0] || null;
}

function resolveCurrentCycleUsageCount(user) {
  if (!user) {
    return 0;
  }
  if (user.currentCycleUsageCount !== undefined && user.currentCycleUsageCount !== null) {
    return Math.max(0, Number(user.currentCycleUsageCount || 0));
  }
  return Math.max(0, Number(user.usageCount || 0));
}

function calculateRemainingLaudos(user) {
  if (!user || user.planLaudoLimit === null || user.planLaudoLimit === undefined) {
    return null;
  }
  return Math.max(0, Number(user.planLaudoLimit || 0) - Number(resolveCurrentCycleUsageCount(user) || 0));
}

function planMatchesAccountType(plan, accountType) {
  if (!plan) {
    return false;
  }
  const audienceKey = normalizePlanAudienceKey(plan.audienceKey || plan.audience);
  return normalizeAccountType(accountType) === "doctor"
    ? audienceKey === "doctor"
    : audienceKey === "company";
}

function getUserLaudoQuotaError(user) {
  if (!user || normalizeAccountType(user.accountType) !== "doctor") {
    return "";
  }

  const limit = user.planLaudoLimit === null || user.planLaudoLimit === undefined
    ? null
    : Number(user.planLaudoLimit || 0);
  if (!limit) {
    return "";
  }

  const used = Number(resolveCurrentCycleUsageCount(user) || 0);
  if (used < limit) {
    return "";
  }

  const quotaPeriod = normalizePlanQuotaPeriod(user.planQuotaPeriod, user.planBillingModel, user.planLaudoLimit);
  if (quotaPeriod === "monthly") {
    return `O plano atual atingiu o limite de ${limit} laudo(s) neste ciclo mensal. Aguarde a renovacao da assinatura ou ajuste o plano.`;
  }
  return `O plano atual atingiu o limite contratado de ${limit} laudo(s). Gere uma nova contratacao ou altere o plano para continuar.`;
}

function getSubscriptionRenewalBlocker(user, plan) {
  if (!user || !plan || normalizePlanBillingModel(plan.billingModel) !== "subscription") {
    return "";
  }

  const subscriptionStatus = normalizeMercadoPagoSubscriptionStatus(user.mpSubscriptionStatus);
  if (user.paymentStatus === "approved" && ["authorized", "pending"].includes(subscriptionStatus)) {
    return "Esta conta ja possui uma assinatura recorrente ativa. Ajuste o plano nas configuracoes ou aguarde a proxima cobranca automatica.";
  }
  if (user.paymentStatus === "pending" && normalizeText(user.mpSubscriptionId)) {
    return "Ja existe uma assinatura pendente para esta conta. Use o link atual do Mercado Pago para concluir a ativacao.";
  }
  return "";
}

function isCheckoutResumeEligible(user) {
  if (!user || user.role !== "buyer") {
    return false;
  }
  return ["pending", "rejected", "cancelled", "expired"].includes(normalizePaymentStatus(user.paymentStatus));
}

function buildStoredCheckoutSnapshot(user) {
  if (!user) {
    return null;
  }
  const checkoutUrl = normalizeText(user.mpCheckoutUrl);
  if (!checkoutUrl) {
    return null;
  }
  return {
    type: normalizePlanBillingModel(user.planBillingModel),
    checkoutUrl,
    sandboxCheckoutUrl: "",
    preferenceId: user.mpPreferenceId || "",
    subscriptionId: user.mpSubscriptionId || "",
    subscriptionStatus: user.mpSubscriptionStatus || ""
  };
}

function buildCheckoutResumeMessage(user, resumeInfo = {}) {
  const originalStatus = normalizePaymentStatus(user && user.paymentStatus);
  const hasCheckoutUrl = Boolean(
    resumeInfo
    && resumeInfo.checkout
    && normalizeText(resumeInfo.checkout.checkoutUrl || resumeInfo.checkout.sandboxCheckoutUrl)
  );
  const checkoutWasCreated = Boolean(resumeInfo && resumeInfo.created);

  if (originalStatus === "pending") {
    if (hasCheckoutUrl && checkoutWasCreated) {
      return "Identificamos um cadastro pendente e reabrimos o checkout do Mercado Pago para concluir a libera\u00e7\u00e3o.";
    }
    if (hasCheckoutUrl) {
      return "Identificamos um cadastro pendente. Retome o checkout do Mercado Pago para concluir a libera\u00e7\u00e3o.";
    }
    return "Seu cadastro est\u00e1 pendente de pagamento. Fa\u00e7a login para acompanhar a libera\u00e7\u00e3o comercial.";
  }

  if (originalStatus === "rejected" || originalStatus === "cancelled") {
    return hasCheckoutUrl
      ? "Seu cadastro j\u00e1 existe, mas o pagamento n\u00e3o foi aprovado. Preparamos um novo checkout para retomar a contrata\u00e7\u00e3o."
      : "Seu cadastro j\u00e1 existe, mas o pagamento n\u00e3o foi aprovado. Solicite um novo link comercial para retomar a contrata\u00e7\u00e3o.";
  }

  if (originalStatus === "expired") {
    return hasCheckoutUrl
      ? "Seu acesso comercial est\u00e1 vencido. Preparamos um checkout para reativar a conta."
      : "Seu acesso comercial est\u00e1 vencido. Gere uma nova contrata\u00e7\u00e3o para reativar a conta.";
  }

  return "Seu cadastro j\u00e1 existe. Fa\u00e7a login para acompanhar a contrata\u00e7\u00e3o.";
}

async function ensureCheckoutForBlockedAccess({ user, req, source = "checkout_resume" }) {
  const plan = getPlanById(user && user.planId ? user.planId : "mensal", { includeInactive: true });
  const originalStatus = normalizePaymentStatus(user && user.paymentStatus);
  const storedCheckout = buildStoredCheckoutSnapshot(user);
  if (!user || !plan || !MP_ACCESS_TOKEN || !isCheckoutResumeEligible(user)) {
    return {
      user,
      plan,
      checkout: storedCheckout,
      created: false
    };
  }

  if (originalStatus === "pending" && storedCheckout) {
    return {
      user,
      plan,
      checkout: storedCheckout,
      created: false
    };
  }

  const reusableSubscriptionError = getSubscriptionRenewalBlocker(user, plan);
  if (reusableSubscriptionError && storedCheckout) {
    return {
      user,
      plan,
      checkout: storedCheckout,
      created: false,
      message: reusableSubscriptionError
    };
  }
  if (reusableSubscriptionError) {
    throw new Error(reusableSubscriptionError);
  }

  const purpose = originalStatus === "pending" ? "signup" : "renewal";
  const checkout = await createBillingCheckout({ user, plan, req, purpose });
  const checkoutUrl = checkout.checkoutUrl || checkout.sandboxCheckoutUrl || "";
  const now = new Date().toISOString();
  const updatedUser = updateUserRecord(user.id, (current) => appendPaymentHistory({
    ...current,
    mpPreferenceId: checkout.preferenceId || "",
    mpCheckoutUrl: checkoutUrl,
    mpSubscriptionId: checkout.subscriptionId || current.mpSubscriptionId || "",
    mpSubscriptionStatus: checkout.subscriptionStatus || current.mpSubscriptionStatus || "",
    paymentProvider: "mercadopago",
    paymentStatus: current.paymentStatus === "approved" ? "approved" : "pending",
    renewalOfferedAt: purpose === "renewal" ? now : current.renewalOfferedAt,
    lastPaymentAttemptAt: now,
    updatedAt: now
  }, {
    title: normalizePlanBillingModel(plan.billingModel) === "subscription"
      ? (purpose === "signup" ? "Assinatura retomada" : "Assinatura de reativacao preparada")
      : (purpose === "signup" ? "Checkout pendente reaberto" : "Checkout de reativacao gerado"),
    details: purpose === "signup"
      ? `A conta ${current.company} retomou o fluxo comercial do plano ${plan.label}.`
      : `Um novo checkout foi preparado para retomar o plano ${plan.label}.`,
    status: "pending",
    provider: "mercadopago",
    source,
    referenceId: checkout.subscriptionId || checkout.preferenceId || "",
    amountCents: Number(plan.priceCents || 0),
    dedupKey: `${source}:${user.id}:${checkout.subscriptionId || checkout.preferenceId || `${plan.id}:${purpose}`}`
  }));

  return {
    user: updatedUser,
    plan,
    checkout: {
      ...checkout,
      checkoutUrl
    },
    created: true
  };
}

function findReusableSignupUser(users, payload = {}) {
  const email = normalizeEmail(payload.email);
  const usernameKey = normalizeUserIdentifier(payload.username);
  const accountType = normalizeAccountType(payload.accountType);

  return (Array.isArray(users) ? users : []).find((item) => {
    if (!item || item.role !== "buyer") {
      return false;
    }

    const sameUsername = item.usernameKey === usernameKey;
    const sameEmail = email && normalizeEmail(item.email) === email;
    if (!sameUsername && !sameEmail) {
      return false;
    }

    if (!isCheckoutResumeEligible(item)) {
      return false;
    }

    if (accountType && normalizeAccountType(item.accountType) !== accountType) {
      return false;
    }

    return verifyPassword(payload.password, item);
  }) || null;
}

function validateAndBuildAdminPlanPayload(body, options = {}) {
  const isCreate = Boolean(options.isCreate);
  const audienceKey = normalizePlanAudienceKey(body.audienceKey || body.audience);
  const billingModel = normalizePlanBillingModel(body.billingModel);
  const laudoLimit = normalizePlanLaudoLimit(body.laudoLimit);
  const months = normalizePlanMonths(body.months);
  const priceCents = normalizePlanPriceCents(body.priceCents);
  const label = normalizeText(body.label || "");
  const description = normalizeText(body.description || "");
  const status = normalizePlanStatus(body.status);
  const quotaPeriod = normalizePlanQuotaPeriod(body.quotaPeriod, billingModel, laudoLimit);
  const planId = slugifyPlanId(body.id || body.code || `${audienceKey}_${label}`);

  if (!label) {
    throw new Error("Informe o nome comercial do plano.");
  }
  if (!planId) {
    throw new Error("Nao foi possivel gerar um codigo interno para o plano.");
  }
  if (planId === "internal") {
    throw new Error("Escolha outro codigo interno para o plano.");
  }
  if (!Number.isFinite(priceCents) || priceCents < 0) {
    throw new Error("Informe um valor valido para o plano.");
  }
  if (!description) {
    throw new Error("Descreva rapidamente o que este plano entrega.");
  }
  if (audienceKey === "doctor" && laudoLimit === null) {
    throw new Error("Planos medicos precisam informar a franquia de laudos.");
  }
  if (billingModel === "subscription" && months !== 1) {
    throw new Error("Planos recorrentes devem trabalhar com ciclo mensal de 1 mes.");
  }
  if (billingModel === "subscription" && quotaPeriod !== "monthly") {
    throw new Error("Planos recorrentes precisam usar franquia mensal.");
  }
  if (audienceKey === "company" && laudoLimit !== null && quotaPeriod === "monthly") {
    throw new Error("Planos empresariais administrativos devem permanecer sem franquia mensal de laudos.");
  }

  return normalizePlanRecord({
    id: isCreate ? planId : (body.id || planId),
    label,
    audienceKey,
    priceCents,
    months,
    laudoLimit,
    description,
    billingModel,
    quotaPeriod,
    status,
    sortOrder: body.sortOrder,
    mercadopagoPlanId: body.mercadopagoPlanId || ""
  });
}

async function syncUsersFromPlanCatalogUpdate(previousPlan, nextPlan) {
  const users = readUsers();
  let changedUsers = 0;
  let updatedSubscriptions = 0;
  let subscriptionUpdateErrors = 0;

  const syncedUsers = await Promise.all(users.map(async (user) => {
    if (user.role !== "buyer" || user.planId !== previousPlan.id) {
      return user;
    }

    changedUsers += 1;
    const nextUser = {
      ...user,
      planLabel: nextPlan.label,
      planPriceCents: nextPlan.priceCents,
      billingCycleMonths: nextPlan.months,
      planLaudoLimit: nextPlan.laudoLimit,
      planBillingModel: normalizePlanBillingModel(nextPlan.billingModel),
      planQuotaPeriod: normalizePlanQuotaPeriod(nextPlan.quotaPeriod, nextPlan.billingModel, nextPlan.laudoLimit),
      updatedAt: new Date().toISOString()
    };

    if (normalizePlanBillingModel(nextPlan.billingModel) === "subscription"
      && normalizeText(user.mpSubscriptionId)
      && MP_ACCESS_TOKEN) {
      try {
        await updateMercadoPagoSubscription(user.mpSubscriptionId, buildMercadoPagoSubscriptionUpdatePayload(user, nextPlan));
        nextUser.mpSubscriptionStatus = user.mpSubscriptionStatus || "authorized";
        updatedSubscriptions += 1;
      } catch (error) {
        subscriptionUpdateErrors += 1;
      }
    }

    return nextUser;
  }));

  writeUsers(syncedUsers);
  return { changedUsers, updatedSubscriptions, subscriptionUpdateErrors };
}

function buildPlanUpdateMessage(result = {}) {
  const changedUsers = Number(result.changedUsers || 0);
  const updatedSubscriptions = Number(result.updatedSubscriptions || 0);
  const subscriptionUpdateErrors = Number(result.subscriptionUpdateErrors || 0);

  if (!changedUsers) {
    return "Plano atualizado com sucesso.";
  }

  if (!updatedSubscriptions && !subscriptionUpdateErrors) {
    return `Plano atualizado com sucesso e refletido em ${changedUsers} conta(s) vinculada(s).`;
  }

  if (subscriptionUpdateErrors) {
    return `Plano atualizado com sucesso, refletido em ${changedUsers} conta(s) e com ${updatedSubscriptions} assinatura(s) do Mercado Pago sincronizada(s). ${subscriptionUpdateErrors} assinatura(s) precisarao de revisao manual.`;
  }

  return `Plano atualizado com sucesso, refletido em ${changedUsers} conta(s) e com ${updatedSubscriptions} assinatura(s) do Mercado Pago atualizada(s).`;
}

function validateUserPayload(payload, requirePassword) {
  if (!payload.company) {
    return "Informe a empresa do comprador.";
  }
  if (!payload.username) {
    return "Informe o usuario de acesso.";
  }
  if (!payload.role) {
    return "Informe o perfil de acesso.";
  }
  if (requirePassword && String(payload.password || "").length < 6) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  return "";
}

function validatePublicRegistration(payload, users) {
  if (!payload.company) {
    return payload.accountType === "doctor" ? "Informe o nome do medico." : "Informe o nome da empresa.";
  }
  if (payload.accountType === "company" && payload.companyCnpj.length !== 14) {
    return "Informe um CNPJ valido com 14 digitos para concluir o cadastro empresarial.";
  }
  if (!payload.contactName && payload.accountType !== "doctor") {
    return "Informe o responsavel pela conta.";
  }
  if (!payload.email || !payload.email.includes("@")) {
    return "Informe um e-mail valido para continuar.";
  }
  if (!payload.username) {
    return payload.accountType === "doctor" ? "Informe o usuario de acesso do medico." : "Informe o usuario de acesso da empresa.";
  }
  if (!payload.plan) {
    return "Selecione um plano para continuar.";
  }
  if (!planMatchesAccountType(payload.plan, payload.accountType)) {
    return payload.accountType === "doctor"
      ? "Selecione um plano medico valido para continuar."
      : "Selecione um plano empresarial valido para continuar.";
  }
  if (String(payload.password || "").length < 6) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (!payload.legalAccepted) {
    return "Confirme a ciencia sobre o uso do sistema como apoio tecnico para continuar.";
  }
  if (payload.accountType === "doctor") {
    if (!payload.crmNumber || String(payload.crmNumber).length < 4 || !payload.crmState) {
    return "Informe CRM e UF válidos para solicitar o plano médico.";
    }
    if (!payload.doctorCpf || String(payload.doctorCpf).length !== 11) {
    return "Informe o CPF completo do médico para concluir o cadastro.";
    }
    if (!payload.doctorBirthDate) {
    return "Informe a data de nascimento do médico para concluir o cadastro.";
    }
    if (!payload.doctorAccepted) {
    return "Confirme a responsabilidade técnica médica para prosseguir.";
    }
  }
  if (users.some((item) => item.usernameKey === normalizeUserIdentifier(payload.username))) {
    return "Já existe um acesso com esse usuário.";
  }
  if (users.some((item) => normalizeEmail(item.email) && normalizeEmail(item.email) === payload.email)) {
    return "Já existe uma conta vinculada a este e-mail.";
  }
  return "";
}

function validateAdminCreation(payload) {
  if (!payload.company) {
    return "Informe a empresa do cliente.";
  }
  if (!payload.username) {
    return "Informe o usuario do acesso.";
  }
  if (String(payload.password || "").length < 6) {
    return "A senha inicial precisa ter pelo menos 6 caracteres.";
  }
  if (!payload.role) {
    return "Informe o perfil da conta.";
  }
  if (payload.role === "buyer" && !payload.plan) {
    return "Selecione um plano para a conta do cliente.";
  }
  if (payload.role === "buyer" && normalizePlanBillingModel(payload.plan && payload.plan.billingModel) === "subscription" && !payload.email) {
    return "Planos recorrentes exigem um e-mail valido para o checkout do Mercado Pago.";
  }
  if (payload.role === "buyer" && !planMatchesAccountType(payload.plan, payload.accountType)) {
    return normalizeAccountType(payload.accountType) === "doctor"
      ? "Selecione um plano medico valido para este cadastro."
      : "Selecione um plano empresarial valido para este cadastro.";
  }
  if (payload.role === "buyer" && normalizeAccountType(payload.accountType) === "company" && payload.companyCnpj && payload.companyCnpj.length !== 14) {
    return "Quando informado, o CNPJ da empresa precisa ter 14 digitos.";
  }
  if (payload.role === "buyer" && normalizeAccountType(payload.accountType) === "doctor" && (!payload.crmNumber || String(payload.crmNumber).length < 4 || !payload.crmState)) {
    return "Para cadastro medico, informe CRM e UF validos.";
  }
  if (payload.users.some((item) => item.usernameKey === normalizeUserIdentifier(payload.username))) {
    return "Ja existe um acesso com esse usuario.";
  }
  if (payload.email && payload.users.some((item) => normalizeEmail(item.email) === payload.email)) {
    return "Ja existe um cadastro com esse e-mail.";
  }
  return "";
}

function validateAdminUpdate(payload) {
  if (!payload.company) {
    return "Informe a empresa do cliente.";
  }
  if (!payload.username) {
    return "Informe o usuario do acesso.";
  }
  if (payload.role === "buyer" && !payload.plan) {
    return "Selecione um plano para a conta do cliente.";
  }
  if (payload.role === "buyer" && normalizePlanBillingModel(payload.plan && payload.plan.billingModel) === "subscription" && !payload.email) {
    return "Planos recorrentes exigem um e-mail valido para o checkout do Mercado Pago.";
  }
  if (payload.role === "buyer" && !planMatchesAccountType(payload.plan, payload.accountType)) {
    return normalizeAccountType(payload.accountType) === "doctor"
      ? "Selecione um plano medico valido para este cadastro."
      : "Selecione um plano empresarial valido para este cadastro.";
  }
  if (payload.role === "buyer" && normalizeAccountType(payload.accountType) === "company" && payload.companyCnpj && payload.companyCnpj.length !== 14) {
    return "Quando informado, o CNPJ da empresa precisa ter 14 digitos.";
  }
  if (payload.role === "buyer" && normalizeAccountType(payload.accountType) === "doctor" && (!payload.crmNumber || String(payload.crmNumber).length < 4 || !payload.crmState)) {
    return "Para cadastro medico, informe CRM e UF validos.";
  }

  const usernameKey = normalizeUserIdentifier(payload.username);
  const duplicatedUser = payload.users.some((item) => item.id !== payload.userId && item.usernameKey === usernameKey);
  if (duplicatedUser) {
    return "Ja existe outro acesso com esse usuario.";
  }

  if (payload.email) {
    const duplicatedEmail = payload.users.some((item) => item.id !== payload.userId && normalizeEmail(item.email) === payload.email);
    if (duplicatedEmail) {
      return "Ja existe outro cadastro com esse e-mail.";
    }
  }

  return "";
}

function serializeUser(user) {
  const plan = user.role === "admin" ? null : getPlanById(user.planId || "mensal", { includeInactive: true });
  const renewal = buildRenewalSnapshot(user);
  const linkedDoctors = normalizeCompanyDoctors(user.linkedDoctors);
  const activityLog = normalizeCompanyActivityLog(user.activityLog);
  const documentHistory = normalizeCompanyDocumentHistory(user.documentHistory, Number(user.usageCount || 0));
  const paymentHistory = normalizePaymentHistory(user.paymentHistory);
  return {
    id: user.id,
    company: user.company,
    companyCnpj: user.companyCnpj || "",
    companyLogoDataUrl: normalizeImageDataUrl(user.companyLogoDataUrl),
    contactName: user.contactName || "",
    email: user.email || "",
    username: user.username,
    role: user.role,
    status: user.status,
    paymentStatus: user.paymentStatus,
    paymentDueAt: user.paymentDueAt,
    paymentLastApprovedAt: user.paymentLastApprovedAt || null,
    planId: user.planId || null,
    planLabel: user.planLabel || (plan ? plan.label : "Administracao interna"),
    planPriceCents: Number(user.planPriceCents || 0),
    billingCycleMonths: Number(user.billingCycleMonths || 0),
    planLaudoLimit: user.planLaudoLimit === null || user.planLaudoLimit === undefined ? null : Number(user.planLaudoLimit),
    planBillingModel: user.role === "admin" ? "internal" : normalizePlanBillingModel(user.planBillingModel || (plan ? plan.billingModel : "one_time")),
    planQuotaPeriod: user.role === "admin" ? "none" : normalizePlanQuotaPeriod(user.planQuotaPeriod || (plan ? plan.quotaPeriod : ""), user.planBillingModel || (plan ? plan.billingModel : ""), user.planLaudoLimit === null || user.planLaudoLimit === undefined ? (plan ? plan.laudoLimit : null) : user.planLaudoLimit),
    paymentProvider: user.paymentProvider || "manual",
    usageCount: Number(user.usageCount || 0),
    currentCycleUsageCount: Number(resolveCurrentCycleUsageCount(user) || 0),
    currentCycleStartedAt: user.currentCycleStartedAt || user.paymentLastApprovedAt || user.createdAt || null,
    remainingLaudos: calculateRemainingLaudos(user),
    lastAccessAt: user.lastAccessAt || null,
    lastPaymentAttemptAt: user.lastPaymentAttemptAt || null,
    mpPreferenceId: user.mpPreferenceId || "",
    mpCheckoutUrl: user.mpCheckoutUrl || "",
    mpLastPaymentId: user.mpLastPaymentId || "",
    mpSubscriptionId: user.mpSubscriptionId || "",
    mpSubscriptionStatus: user.mpSubscriptionStatus || "",
    notes: user.notes || "",
    accountType: normalizeAccountType(user.accountType),
    crmNumber: user.crmNumber || "",
    crmState: user.crmState || "",
    doctorCpf: user.doctorCpf || "",
    doctorBirthDate: user.doctorBirthDate || "",
    crmValidated: Boolean(user.crmValidated),
    legalAcceptedAt: user.legalAcceptedAt || null,
    doctorAcceptedAt: user.doctorAcceptedAt || null,
    responsibilityMode: normalizeResponsibilityMode(user.responsibilityMode),
    linkedCompanyId: user.linkedCompanyId || "",
    linkedCompanyDoctorId: user.linkedCompanyDoctorId || "",
    renewalOfferedAt: user.renewalOfferedAt || null,
    renewalContactedAt: user.renewalContactedAt || null,
    renewalContactChannel: user.renewalContactChannel || "",
    linkedDoctors,
    activityLog,
    documentHistory,
    paymentHistory,
    renewalStage: renewal.stage,
    renewalLabel: renewal.label,
    renewalDaysRemaining: renewal.daysRemaining,
    renewalNeedsContact: renewal.needsContact,
    createdBy: user.createdBy || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isAdmin: user.role === "admin",
    canAccess: user.role === "admin" ? user.status === "active" : !getAccessError(user)
  };
}

function getAccessError(user) {
  if (!user) {
    return "Conta não localizada.";
  }
  if (user.role === "admin") {
    return user.status === "active" ? "" : "Acesso administrativo bloqueado.";
  }
  if (user.status === "blocked") {
    return "Acesso bloqueado. Contate o administrador da plataforma.";
  }
  if (user.paymentStatus === "pending") {
    return "Pagamento ainda não aprovado. Finalize o plano para liberar o acesso.";
  }
  if (user.paymentStatus === "rejected" || user.paymentStatus === "cancelled") {
    return "Pagamento não aprovado. Gere um novo link de pagamento ou contate o administrador.";
  }
  if (user.paymentStatus === "expired" || user.status === "inadimplente") {
    return "Acesso indisponível por inadimplência ou vencimento do plano.";
  }
  if (user.paymentStatus !== "approved") {
    return "Acesso indisponível até a confirmação do pagamento.";
  }
  return "";
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((accumulator, part) => {
    const [name, ...rest] = part.trim().split("=");
    if (!name) {
      return accumulator;
    }
    accumulator[name] = decodeURIComponent(rest.join("=") || "");
    return accumulator;
  }, {});
}

function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req);
  const cookieToken = normalizeText(cookies[SESSION_COOKIE]);
  if (cookieToken) {
    return cookieToken;
  }

  const authorization = normalizeText(req.headers.authorization || "");
  if (/^bearer\s+/i.test(authorization)) {
    return normalizeText(authorization.replace(/^bearer\s+/i, ""));
  }

  return normalizeText(req.headers["x-session-token"] || "");
}

function getAuthenticatedUser(req) {
  const token = getSessionTokenFromRequest(req);
  if (!token) {
    return null;
  }
  const session = sessions.get(token);
  if (!session) {
    return null;
  }
  const user = readUserById(session.userId);
  if (!user || getAccessError(user)) {
    sessions.delete(token);
    return null;
  }
  return user;
}

function requireAuthenticated(req, res) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    sendJson(res, 401, { message: "Sessao invalida ou expirada." });
    return null;
  }
  return user;
}

function requireAdmin(req, res) {
  const user = requireAuthenticated(req, res);
  if (!user) {
    return null;
  }
  if (user.role !== "admin") {
    sendJson(res, 403, { message: "Acesso restrito ao administrador." });
    return null;
  }
  return user;
}

function requireCompany(req, res) {
  const user = requireAuthenticated(req, res);
  if (!user) {
    return null;
  }
  if (user.role !== "buyer" || normalizeAccountType(user.accountType) !== "company") {
    sendJson(res, 403, { message: "Acesso restrito ao dashboard da empresa." });
    return null;
  }
  return user;
}

function getAllowedOrigin(req) {
  const origin = normalizeText(req && req.headers ? req.headers.origin : "");
  if (!origin) {
    return "";
  }

  let parsedOrigin;
  let parsedAppBase;
  try {
    parsedOrigin = new URL(origin);
  } catch (error) {
    return "";
  }

  try {
    parsedAppBase = APP_BASE_URL ? new URL(APP_BASE_URL) : null;
  } catch (error) {
    parsedAppBase = null;
  }

  if (parsedAppBase && parsedOrigin.origin === parsedAppBase.origin) {
    return parsedOrigin.origin;
  }

  if (ALLOWED_ORIGINS.includes(parsedOrigin.origin)) {
    return parsedOrigin.origin;
  }

  if (parsedOrigin.protocol === "https:" && parsedOrigin.hostname.endsWith(".netlify.app")) {
    return parsedOrigin.origin;
  }

  return "";
}

function applyCorsHeaders(req, res) {
  const allowedOrigin = getAllowedOrigin(req);
  if (!allowedOrigin) {
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Session-Token");
  res.setHeader("Vary", "Origin");
}

function isSecureRequest(req) {
  const forwardedProto = normalizeText(req && req.headers ? req.headers["x-forwarded-proto"] : "").toLowerCase();
  if (forwardedProto === "https") {
    return true;
  }
  return Boolean(req && req.socket && req.socket.encrypted);
}

function isCrossOriginRequest(req) {
  const origin = normalizeText(req && req.headers ? req.headers.origin : "");
  const host = normalizeText(req && req.headers ? req.headers.host : "");
  if (!origin || !host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host !== host;
  } catch (error) {
    return false;
  }
}

function buildSessionCookie(req, value, maxAgeSeconds) {
  const segments = [
    `${SESSION_COOKIE}=${value}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${Math.max(0, Number(maxAgeSeconds || 0))}`
  ];

  if (isCrossOriginRequest(req) && isSecureRequest(req)) {
    segments.push("SameSite=None", "Secure");
  } else {
    segments.push("SameSite=Lax");
    if (isSecureRequest(req)) {
      segments.push("Secure");
    }
  }

  return segments.join("; ");
}

function createSession(req, res, userId) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, { token, userId, createdAt: new Date().toISOString() });
  res.setHeader("Set-Cookie", buildSessionCookie(req, token, 86400));
  return token;
}

function destroySession(req, res) {
  const token = getSessionTokenFromRequest(req);
  if (token) {
    sessions.delete(token);
  }
  res.setHeader("Set-Cookie", buildSessionCookie(req, "", 0));
}

function destroySessionsForUsers(userIds = []) {
  const blockedIds = new Set((Array.isArray(userIds) ? userIds : []).map((value) => normalizeText(value)).filter(Boolean));
  if (!blockedIds.size) {
    return;
  }

  Array.from(sessions.entries()).forEach(([token, session]) => {
    if (session && blockedIds.has(normalizeText(session.userId))) {
      sessions.delete(token);
    }
  });
}

function touchUserLastAccess(userId) {
  const updated = updateUserRecord(userId, (current) => {
    const now = new Date().toISOString();
    const next = { ...current, lastAccessAt: now, updatedAt: now };
    if (current.role === "buyer" && normalizeAccountType(current.accountType) === "company") {
      return appendCompanyActivityRecord(next, {
        doctorName: "Administrativo da empresa",
        action: "Acesso ao dashboard corporativo realizado",
        occurredAt: now
      });
    }
    return next;
  });

  if (isCompanyManagedDoctor(updated) && normalizeText(updated.linkedCompanyId)) {
    updateUserRecord(updated.linkedCompanyId, (current) => appendCompanyActivityRecord({
      ...current,
      updatedAt: new Date().toISOString()
    }, {
      doctorName: updated.contactName || updated.username || "Medico responsavel",
      action: "Acesso ao ambiente operacional realizado"
    }));
  }
}

function queueMercadoPagoWebhookProcessing(body, requestUrl) {
  const notification = extractMercadoPagoNotification(body, requestUrl);
  if (!notification.id || !notification.type || !MP_ACCESS_TOKEN) {
    return Promise.resolve();
  }
  if (notification.type === "subscription") {
    return fetchMercadoPagoSubscription(notification.id).then((subscription) => syncSubscriptionIntoUser(subscription));
  }
  if (notification.type === "subscription_payment") {
    return fetchMercadoPagoAuthorizedPayment(notification.id).then((authorizedPayment) => syncAuthorizedPaymentIntoUser(authorizedPayment));
  }
  return fetchMercadoPagoPayment(notification.id).then((payment) => syncPaymentIntoUser(payment));
}

function extractMercadoPagoNotification(body, requestUrl) {
  const params = requestUrl instanceof URL ? requestUrl.searchParams : new URLSearchParams();
  const safeBody = body && typeof body === "object" ? body : {};
  const rawType = normalizeText(
    params.get("type")
    || params.get("topic")
    || safeBody.type
    || safeBody.topic
    || safeBody.action
  ).toLowerCase();
  const id = normalizeText(
    params.get("data.id")
    || params.get("id")
    || (safeBody.data && safeBody.data.id ? String(safeBody.data.id) : "")
    || (safeBody.id ? String(safeBody.id) : "")
  );

  if (!id) {
    return { id: "", type: "" };
  }

  if (rawType.includes("authorized_payment")) {
    return { id, type: "subscription_payment" };
  }
  if (rawType.includes("subscription") || rawType.includes("preapproval")) {
    return { id, type: "subscription" };
  }
  if (rawType.includes("payment")) {
    return { id, type: "payment" };
  }
  return { id: "", type: "" };
}

function validateMercadoPagoWebhookSignature(req, requestUrl, body) {
  if (!MP_WEBHOOK_SECRET) {
    return { valid: true };
  }

  const rawSignature = normalizeText(req && req.headers ? req.headers["x-signature"] : "");
  const requestId = normalizeText(req && req.headers ? req.headers["x-request-id"] : "");
  const signature = parseMercadoPagoSignatureHeader(rawSignature);
  const notification = extractMercadoPagoNotification(body, requestUrl);
  const manifest = buildMercadoPagoWebhookManifest({
    notificationId: notification.id,
    requestId,
    timestamp: signature.ts
  });

  if (!signature.ts || !signature.v1 || !requestId || !manifest) {
    return { valid: false };
  }

  const expected = crypto
    .createHmac("sha256", MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  const incoming = String(signature.v1 || "").toLowerCase();
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(incoming, "utf8");
  if (left.length !== right.length) {
    return { valid: false };
  }

  return { valid: crypto.timingSafeEqual(left, right) };
}

function parseMercadoPagoSignatureHeader(value) {
  return String(value || "")
    .split(",")
    .reduce((accumulator, part) => {
      const [rawKey, rawValue] = String(part || "").split("=");
      const key = normalizeText(rawKey).toLowerCase();
      const parsedValue = normalizeText(rawValue);
      if (key && parsedValue) {
        accumulator[key] = parsedValue;
      }
      return accumulator;
    }, { ts: "", v1: "" });
}

function buildMercadoPagoWebhookManifest({ notificationId, requestId, timestamp }) {
  const segments = [];
  if (notificationId) {
    segments.push(`id:${String(notificationId).toLowerCase()};`);
  }
  if (requestId) {
    segments.push(`request-id:${requestId};`);
  }
  if (timestamp) {
    segments.push(`ts:${timestamp};`);
  }
  return segments.join("");
}

function syncPaymentIntoUser(payment) {
  if (!payment || !payment.external_reference) {
    return null;
  }
  const user = readUserById(String(payment.external_reference));
  if (!user) {
    return null;
  }
  const paymentStatus = normalizeMercadoPagoPaymentStatus(payment.status);
  const approvedAt = payment.date_approved ? new Date(payment.date_approved) : new Date();
  const dueAt = paymentStatus === "approved" ? addMonths(approvedAt, Number(user.billingCycleMonths || 1)).toISOString() : user.paymentDueAt;
  return updateUserRecord(user.id, (current) => appendPaymentHistory({
    ...current,
    status: paymentStatus === "approved" ? "active" : (current.status === "blocked" ? "blocked" : "inadimplente"),
    paymentStatus,
    paymentDueAt: paymentStatus === "approved" ? dueAt : current.paymentDueAt,
    paymentLastApprovedAt: paymentStatus === "approved" ? approvedAt.toISOString() : current.paymentLastApprovedAt,
    currentCycleUsageCount: paymentStatus === "approved" ? 0 : resolveCurrentCycleUsageCount(current),
    currentCycleStartedAt: paymentStatus === "approved" ? approvedAt.toISOString() : (current.currentCycleStartedAt || current.paymentLastApprovedAt || current.createdAt || null),
    renewalOfferedAt: paymentStatus === "approved" ? null : current.renewalOfferedAt,
    lastPaymentAttemptAt: new Date().toISOString(),
    mpLastPaymentId: String(payment.id || ""),
    updatedAt: new Date().toISOString()
  }, {
    title: paymentStatus === "approved"
      ? "Pagamento aprovado"
      : paymentStatus === "pending"
        ? "Pagamento em processamento"
        : paymentStatus === "rejected"
          ? "Pagamento recusado"
          : paymentStatus === "cancelled"
            ? "Pagamento cancelado"
            : "Pagamento expirado",
    details: paymentStatus === "approved"
      ? "O Mercado Pago confirmou a cobranca e o acesso foi liberado automaticamente."
      : "O status comercial retornou pelo Mercado Pago e foi sincronizado com o cadastro.",
    status: paymentStatus,
    provider: "mercadopago",
    source: "webhook",
    referenceId: String(payment.id || ""),
    amountCents: Number.isFinite(Number(payment.transaction_amount))
      ? Math.round(Number(payment.transaction_amount) * 100)
      : null,
    dedupKey: `payment:${String(payment.id || "")}:${paymentStatus}`
  }));
}

async function syncAuthorizedPaymentIntoUser(authorizedPayment) {
  if (!authorizedPayment) {
    return null;
  }

  let updatedUser = null;
  const paymentId = authorizedPayment.payment && authorizedPayment.payment.id
    ? String(authorizedPayment.payment.id)
    : "";
  if (paymentId) {
    try {
      updatedUser = await fetchMercadoPagoPayment(paymentId).then((payment) => syncPaymentIntoUser(payment));
    } catch (error) {
      updatedUser = null;
    }
  } else if (authorizedPayment.external_reference) {
    updatedUser = syncPaymentIntoUser({
      id: authorizedPayment.id,
      external_reference: authorizedPayment.external_reference,
      status: authorizedPayment.status || (authorizedPayment.payment ? authorizedPayment.payment.status : ""),
      date_approved: authorizedPayment.debit_date || authorizedPayment.last_modified || authorizedPayment.date_created || null,
      transaction_amount: authorizedPayment.value || authorizedPayment.amount || 0
    });
  }

  if (authorizedPayment.preapproval_id) {
    try {
      await fetchMercadoPagoSubscription(String(authorizedPayment.preapproval_id)).then((subscription) => syncSubscriptionIntoUser(subscription));
    } catch (error) {
      // Mantem o fluxo do pagamento mesmo quando o espelho da assinatura ainda nao estiver disponivel.
    }
  }

  return updatedUser;
}

function syncSubscriptionIntoUser(subscription) {
  if (!subscription) {
    return null;
  }
  const externalReference = normalizeText(subscription.external_reference)
    || normalizeText(subscription.metadata && subscription.metadata.user_id);
  const user = externalReference
    ? readUserById(externalReference)
    : readUsers().find((item) => normalizeText(item.mpSubscriptionId) === normalizeText(subscription.id));
  if (!user) {
    return null;
  }

  const subscriptionStatus = normalizeMercadoPagoSubscriptionStatus(subscription.status);
  return updateUserRecord(user.id, (current) => {
    let next = {
      ...current,
      mpSubscriptionId: String(subscription.id || current.mpSubscriptionId || ""),
      mpSubscriptionStatus: subscriptionStatus,
      updatedAt: new Date().toISOString()
    };

    if (subscriptionStatus === "cancelled" && (!current.paymentDueAt || new Date(current.paymentDueAt).getTime() <= Date.now())) {
      next.paymentStatus = "cancelled";
      if (current.status !== "blocked") {
        next.status = "inadimplente";
      }
    }

    next = appendPaymentHistory(next, {
      title: subscriptionStatus === "authorized"
        ? "Assinatura autorizada"
        : subscriptionStatus === "pending"
          ? "Assinatura pendente"
          : subscriptionStatus === "paused"
            ? "Assinatura pausada"
            : subscriptionStatus === "cancelled"
              ? "Assinatura cancelada"
              : "Assinatura atualizada",
      details: subscriptionStatus === "cancelled"
        ? "A assinatura recorrente foi cancelada no Mercado Pago e o cadastro entrou em observacao comercial."
        : "O status da assinatura recorrente foi sincronizado automaticamente pelo Mercado Pago.",
      status: subscriptionStatus,
      provider: "mercadopago",
      source: "webhook",
      referenceId: String(subscription.id || ""),
      amountCents: Number.isFinite(Number(subscription.auto_recurring && subscription.auto_recurring.transaction_amount))
        ? Math.round(Number(subscription.auto_recurring.transaction_amount) * 100)
        : null,
      dedupKey: `subscription:${String(subscription.id || "")}:${subscriptionStatus}`
    });

    return next;
  });
}

function normalizeMercadoPagoPaymentStatus(status) {
  const normalized = normalizeText(status).toLowerCase();
  if (normalized === "approved") {
    return "approved";
  }
  if (normalized === "pending" || normalized === "in_process" || normalized === "in_mediation") {
    return "pending";
  }
  if (normalized === "rejected") {
    return "rejected";
  }
  if (normalized === "cancelled") {
    return "cancelled";
  }
  return "expired";
}

function normalizeMercadoPagoSubscriptionStatus(status) {
  const normalized = normalizeText(status).toLowerCase();
  if (normalized === "authorized") {
    return "authorized";
  }
  if (normalized === "paused") {
    return "paused";
  }
  if (normalized === "cancelled") {
    return "cancelled";
  }
  if (normalized === "pending") {
    return "pending";
  }
  return normalized || "pending";
}

async function createBillingCheckout({ user, plan, req, purpose = "signup" }) {
  if (normalizePlanBillingModel(plan && plan.billingModel) === "subscription") {
    return createMercadoPagoSubscriptionCheckout({ user, plan, req, purpose });
  }
  return createMercadoPagoCheckout({ user, plan, req, purpose });
}

async function createMercadoPagoCheckout({ user, plan, req, purpose = "signup" }) {
  const baseUrl = resolveBaseUrl(req);
  const planAction = purpose === "renewal" ? "Renovacao" : "Contratacao";
  const planDescription = plan.laudoLimit === null || plan.laudoLimit === undefined
    ? `Plano empresarial com dashboard administrativo por ${Number(plan.months || 0)} ${Number(plan.months || 0) === 1 ? "mes" : "meses"} no DaviCore Health para ${user.company}`
    : `${Number(plan.laudoLimit || 0)} laudos no DaviCore Health para ${user.company}`;
  const payload = {
    items: [{ id: plan.id, title: `${planAction} ${plan.label} - ${user.company}`, description: planDescription, quantity: 1, currency_id: "BRL", unit_price: Number((plan.priceCents / 100).toFixed(2)) }],
    payer: user.email ? { email: user.email } : undefined,
    external_reference: user.id,
    auto_return: "approved",
    back_urls: {
      success: `${baseUrl}/index.html?checkout=success`,
      pending: `${baseUrl}/index.html?checkout=pending`,
      failure: `${baseUrl}/index.html?checkout=failure`
    },
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    metadata: { user_id: user.id, plan_id: plan.id, company: user.company, purpose }
  };

  const response = await mercadoPagoRequest("POST", "/checkout/preferences", payload);
  return {
    type: "one_time",
    preferenceId: response.id,
    checkoutUrl: response.init_point || "",
    sandboxCheckoutUrl: response.sandbox_init_point || ""
  };
}

async function createMercadoPagoSubscriptionCheckout({ user, plan, req, purpose = "signup" }) {
  if (!normalizeEmail(user.email)) {
    throw new Error("Planos recorrentes do Mercado Pago exigem um e-mail valido do contratante.");
  }

  const baseUrl = resolveBaseUrl(req);
  const payload = {
    reason: `${purpose === "renewal" ? "Renovacao" : "Assinatura"} ${plan.label} - ${user.company}`,
    external_reference: user.id,
    payer_email: normalizeEmail(user.email),
    back_url: `${baseUrl}/index.html?checkout=success`,
    status: "pending",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: Number((plan.priceCents / 100).toFixed(2)),
      currency_id: "BRL"
    },
    notification_url: `${baseUrl}/api/webhooks/mercadopago`
  };

  const response = await mercadoPagoRequest("POST", "/preapproval", payload);
  return {
    type: "subscription",
    subscriptionId: response.id || "",
    subscriptionStatus: normalizeMercadoPagoSubscriptionStatus(response.status || "pending"),
    checkoutUrl: response.init_point || response.sandbox_init_point || "",
    sandboxCheckoutUrl: response.sandbox_init_point || "",
    preferenceId: ""
  };
}

function fetchMercadoPagoPayment(paymentId) {
  return mercadoPagoRequest("GET", `/v1/payments/${encodeURIComponent(String(paymentId))}`);
}

function fetchMercadoPagoSubscription(subscriptionId) {
  return mercadoPagoRequest("GET", `/preapproval/${encodeURIComponent(String(subscriptionId))}`);
}

function fetchMercadoPagoAuthorizedPayment(authorizedPaymentId) {
  return mercadoPagoRequest("GET", `/authorized_payments/${encodeURIComponent(String(authorizedPaymentId))}`);
}

function updateMercadoPagoSubscription(subscriptionId, payload) {
  return mercadoPagoRequest("PUT", `/preapproval/${encodeURIComponent(String(subscriptionId))}`, payload);
}

function buildMercadoPagoSubscriptionUpdatePayload(user, plan) {
  return {
    reason: `${plan.label} - ${user.company}`,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: Number((plan.priceCents / 100).toFixed(2)),
      currency_id: "BRL"
    }
  };
}

function mercadoPagoRequest(method, pathName, payload) {
  if (!MP_ACCESS_TOKEN) {
    return Promise.reject(new Error("MP_ACCESS_TOKEN nao configurado."));
  }

  return new Promise((resolve, reject) => {
    const body = payload ? JSON.stringify(payload) : "";
    const request = https.request({
      protocol: "https:",
      hostname: MERCADO_PAGO_API,
      path: pathName,
      method,
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        Accept: "application/json",
        ...(payload ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } : {})
      }
    }, (response) => {
      let raw = "";
      response.on("data", (chunk) => { raw += chunk; });
      response.on("end", () => {
        let parsed = {};
        try {
          parsed = raw ? JSON.parse(raw) : {};
        } catch (error) {
          parsed = {};
        }
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(parsed);
          return;
        }
        reject(new Error(parsed.message || parsed.error || `Mercado Pago retornou status ${response.statusCode}.`));
      });
    });

    request.on("error", reject);
    if (body) {
      request.write(body);
    }
    request.end();
  });
}

function resolveBaseUrl(req) {
  if (APP_BASE_URL) {
    return APP_BASE_URL.replace(/\/+$/, "");
  }
  const forwardedProto = normalizeText(req.headers["x-forwarded-proto"]);
  const protocol = forwardedProto || "http";
  const host = req.headers.host || "127.0.0.1:8080";
  return `${protocol}://${host}`;
}

function addMonths(baseDate, months) {
  const date = baseDate instanceof Date ? new Date(baseDate.getTime()) : new Date(baseDate);
  if (Number.isNaN(date.getTime())) {
    return new Date();
  }
  date.setMonth(date.getMonth() + Number(months || 0));
  return date;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > BODY_LIMIT_BYTES) {
        reject(new Error("Corpo da requisicao excedeu o limite permitido."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("JSON invalido na requisicao."));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    return sendJson(res, 404, { message: "Arquivo nao encontrado." });
  }
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { "Content-Type": contentType, "Content-Length": content.length });
  res.end(content);
}
