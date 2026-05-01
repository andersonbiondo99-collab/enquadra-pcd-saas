const startPcdDigital = () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const moduleConfigs = {
    fisica: {
      title: "Deficiência Física",
      guidance: "Selecione a condição principal, a topografia e o impacto funcional relevante para chegar ao enquadramento físico.",
      banner: "O enquadramento físico exige permanência, perda anatômica relevante ou limitação funcional importante, com repercussão compatível no desempenho."
    },
    auditiva: {
      title: "Deficiência Auditiva",
      guidance: "Use os dados objetivos do audiograma sem aparelho auditivo para o enquadramento direto por critério técnico.",
      banner: "Critério auditivo: média aritmética de 41 dB ou mais em cada orelha para perda bilateral parcial, ou perda superior a 95 dB em cada frequência de uma orelha para surdez unilateral total."
    },
    visual: {
      title: "Deficiência Visual",
      guidance: "Informe os achados visuais objetivos para enquadramento por acuidade, campo visual ou visão monocular.",
      banner: "Critério visual: cegueira no melhor olho até 0,05, baixa visão entre 0,3 e 0,05, campo visual binocular até 60° ou visão monocular reconhecida por lei."
    },
    clinicas: {
      title: "Condições Clínicas",
      guidance: "Condições clínicas persistentes exigem confirmação funcional e documental para sustentar enquadramento.",
      banner: "Sem persistência e impacto funcional moderado ou grave, o sistema não conclui enquadramento por condição clínica."
    },
    intelectual: {
      title: "Deficiência Intelectual",
      guidance: "Avalie funcionamento intelectual, habilidades adaptativas e necessidade de suporte para enquadramento intelectual.",
      banner: "O sistema exige caráter permanente, limitação adaptativa consistente e necessidade de suporte compatível."
    },
    psicossocial: {
      title: "Deficiência Mental/Psicossocial",
      guidance: "Registre persistência do quadro, restrição de participação e suporte documental para sustentar enquadramento psicossocial.",
      banner: "A decisão depende de restrição psicossocial relevante e impacto funcional compatível em igualdade de condições."
    }
  };

  const PHYSICAL_FUNCTION_LIBRARY = {
    upper: [
      { value: "alcance", label: "dificuldade para alcance funcional" },
      { value: "elevacao", label: "prejuízo para elevação do membro superior" },
      { value: "sustentacao", label: "dificuldade para sustentação e transporte de carga" },
      { value: "ferramentas", label: "prejuízo para manuseio de ferramentas e objetos" }
    ],
    hand: [
      { value: "pinca", label: "prejuízo de pinça e preensão fina" },
      { value: "preensao_palmar", label: "dificuldade para preensão palmar" },
      { value: "destreza", label: "redução de destreza manual" },
      { value: "ferramentas", label: "prejuízo para manuseio de ferramentas e objetos" }
    ],
    lower: [
      { value: "marcha", label: "limitação para marcha e deslocamento" },
      { value: "escadas", label: "dificuldade para subir e descer escadas" },
      { value: "agachamento", label: "prejuízo para agachar ou ajoelhar" },
      { value: "ortostatismo", label: "redução de tolerância ao ortostatismo prolongado" }
    ],
    foot: [
      { value: "apoio", label: "prejuízo para apoio e impulsão do pé" },
      { value: "equilibrio", label: "instabilidade e dificuldade de equilíbrio" },
      { value: "marcha", label: "limitação para marcha e deslocamento" },
      { value: "escadas", label: "dificuldade para escadas e mudança de nível" }
    ],
    axial: [
      { value: "postura", label: "prejuízo para manutenção de postura" },
      { value: "flexao_tronco", label: "dificuldade para flexão e rotação do tronco" },
      { value: "sedestacao", label: "redução de tolerância para sedestação prolongada" },
      { value: "carga", label: "dificuldade para manuseio e levantamento de carga" }
    ],
    generic: [
      { value: "deslocamento", label: "prejuízo funcional em deslocamento e posicionamento" },
      { value: "tarefas", label: "dificuldade para execução de tarefas ocupacionais usuais" },
      { value: "ritmo", label: "redução de ritmo funcional" }
    ]
  };

  const MOVEMENT_OPTIONS = {
    "ombro": [
      { value: "elevacao_abducao", label: "Elevação / abdução do ombro" },
      { value: "rotacao_ombro", label: "Rotação do ombro" }
    ],
    "cotovelo": [
      { value: "flexao_extensao_cotovelo", label: "Flexão / extensão de cotovelo" },
      { value: "prono_supinacao", label: "Pronação / supinação" }
    ],
    "punho e mão": [
      { value: "flexao_extensao_punho", label: "Flexão / extensão de punho" },
      { value: "preensao", label: "Preensão e destreza manual" }
    ],
    "membro superior": [
      { value: "alcance_global_mss", label: "Alcance e posicionamento do membro superior" },
      { value: "manipulacao_global_mss", label: "Manipulação global do membro superior" }
    ],
    "quadril": [
      { value: "flexao_quadril", label: "Flexão / extensão de quadril" },
      { value: "marcha_quadril", label: "Marcha e transição postural" }
    ],
    "joelho": [
      { value: "flexao_extensao_joelho", label: "Flexão / extensão de joelho" },
      { value: "agachamento_joelho", label: "Agachamento e ajoelhamento" }
    ],
    "tornozelo e pé": [
      { value: "dorsi_planti", label: "Dorsiflexão / flexão plantar" },
      { value: "apoio_propulsao", label: "Apoio e propulsão" }
    ],
    "membro inferior": [
      { value: "marcha_global_mii", label: "Marcha e deslocamento do membro inferior" },
      { value: "equilibrio_mii", label: "Equilíbrio e apoio" }
    ],
    "coluna": [
      { value: "flexao_tronco", label: "Flexão / extensão do tronco" },
      { value: "rotacao_tronco", label: "Rotação do tronco" }
    ]
  };

  const STRENGTH_PATTERN_OPTIONS = {
    upper: [
      { value: "cintura_escapular", label: "Cintura escapular / ombro" },
      { value: "flexores_cotovelo", label: "Flexores de cotovelo" },
      { value: "extensores_cotovelo", label: "Extensores de cotovelo" }
    ],
    hand: [
      { value: "flexores_punho", label: "Flexores de punho" },
      { value: "extensores_punho", label: "Extensores de punho" },
      { value: "preensao_pinca", label: "Preensão / pinça" }
    ],
    lower: [
      { value: "quadriceps", label: "Quadríceps" },
      { value: "isquiotibiais", label: "Isquiotibiais" },
      { value: "gluteos", label: "Glúteos" }
    ],
    foot: [
      { value: "dorsiflexores", label: "Dorsiflexores" },
      { value: "plantiflexores", label: "Plantiflexores" },
      { value: "inversores_eversores", label: "Inversores / eversores" }
    ],
    axial: [
      { value: "paravertebrais", label: "Paravertebrais" },
      { value: "musculatura_tronco", label: "Musculatura estabilizadora do tronco" }
    ],
    generic: [
      { value: "segmento_predominante", label: "Segmento predominante acometido" }
    ]
  };

  const AMPUTATION_SCOPE_META = {
    dedos_mao: { label: "dedo(s) da mão", family: "hand", segment: "punho e mão" },
    mao_punho: { label: "mão / punho", family: "hand", segment: "punho e mão" },
    antebraco: { label: "antebraço", family: "upper", segment: "membro superior" },
    braco: { label: "braço", family: "upper", segment: "membro superior" },
    dedos_pe: { label: "dedo(s) do pé", family: "foot", segment: "tornozelo e pé" },
    pe_tornozelo: { label: "pé / tornozelo", family: "foot", segment: "tornozelo e pé" },
    perna: { label: "perna", family: "lower", segment: "membro inferior" },
    coxa: { label: "coxa", family: "lower", segment: "membro inferior" }
  };

  const VISUAL_ACUITY_SEVERITY = {
    normal_20_40: 0,
    moderada_20_70: 1,
    baixa_20_200: 2,
    muito_baixa_20_400: 3,
    cegueira_20_400: 4,
    cegueira_menor_20_400: 5,
    sem_percepcao_util: 6
  };

  const AUTH_API = {
    bootstrap: "/api/auth/bootstrap",
    session: "/api/auth/session",
    setup: "/api/auth/setup",
    login: "/api/auth/login",
    logout: "/api/auth/logout"
  };

  const DEFAULT_LOCAL_APP_ORIGIN = "http://127.0.0.1:8080";
  const API_SESSION_TOKEN_KEY = "enquadra_api_session_token_v1";

  function normalizeAppOrigin(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function getConfiguredAppOrigin() {
    const meta = document.querySelector('meta[name="davicore-app-origin"]');
    const configured = normalizeAppOrigin(meta ? meta.getAttribute("content") : "");
    const isLocalRuntime = window.location.protocol === "file:"
      || /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname || "");
    return isLocalRuntime ? "" : configured;
  }

  function getConfiguredApiOrigin() {
    const meta = document.querySelector('meta[name="davicore-api-origin"]');
    const configured = normalizeAppOrigin(meta ? meta.getAttribute("content") : "");
    const isLocalRuntime = window.location.protocol === "file:"
      || /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname || "");
    return isLocalRuntime ? "" : configured;
  }

  function getPreferredAppOrigin() {
    const configuredApi = getConfiguredApiOrigin();
    if (configuredApi) return configuredApi;

    const browserOrigin = normalizeAppOrigin(window.location.origin);
    const isHostedRuntime = window.location.protocol !== "file:"
      && !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname || "")
      && /^https?:\/\//i.test(browserOrigin);
    const configured = getConfiguredAppOrigin();

    if (isHostedRuntime && !/\.netlify\.app$/i.test(window.location.hostname || "")) {
      return browserOrigin;
    }

    if (configured) return configured;

    if (/^https?:\/\//i.test(browserOrigin)) {
      return browserOrigin;
    }

    return DEFAULT_LOCAL_APP_ORIGIN;
  }

  function buildAppUrl(path = "/") {
    const base = getPreferredAppOrigin();
    const safePath = String(path || "/");
    if (/^https?:\/\//i.test(safePath)) return safePath;
    return `${base}${safePath.startsWith("/") ? safePath : `/${safePath}`}`;
  }

  function redirectToPreferredAppOrigin() {
    const target = buildAppUrl("/");
    if (!target) return false;
    window.location.replace(target);
    return true;
  }

  function buildApiUrl(url) {
    return buildAppUrl(url);
  }

  function getApiSessionToken() {
    try {
      return String(window.sessionStorage.getItem(API_SESSION_TOKEN_KEY) || "").trim();
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  function persistApiSessionToken(token) {
    try {
      const normalized = String(token || "").trim();
      if (!normalized) {
        window.sessionStorage.removeItem(API_SESSION_TOKEN_KEY);
        return;
      }
      window.sessionStorage.setItem(API_SESSION_TOKEN_KEY, normalized);
    } catch (error) {
      console.error(error);
    }
  }

  function clearApiSessionToken() {
    try {
      window.sessionStorage.removeItem(API_SESSION_TOKEN_KEY);
    } catch (error) {
      console.error(error);
    }
  }

  const refs = {
    authShell: $("#authShell"),
    accessBuyerButton: $("#accessBuyerButton"),
    accessAdminButton: $("#accessAdminButton"),
    appShell: $("#appShell"),
    adminShell: $("#adminShell"),
    authModeBadge: $("#authModeBadge"),
    authTitle: $("#authTitle"),
    authDescription: $("#authDescription"),
    authStatus: $("#authStatus"),
    authStatusAction: $("#authStatusAction"),
    loginForm: $("#loginForm"),
    loginUsername: $("#loginUsername"),
    loginPassword: $("#loginPassword"),
    loginSubmitButton: $("#loginSubmitButton"),
    registerForm: $("#registerForm"),
    registerCompany: $("#registerCompany"),
    registerCompanyCnpj: $("#registerCompanyCnpj"),
    registerContactName: $("#registerContactName"),
    registerEmail: $("#registerEmail"),
    registerUsername: $("#registerUsername"),
    registerPassword: $("#registerPassword"),
    registerPasswordConfirm: $("#registerPasswordConfirm"),
    registerPlan: $("#registerPlan"),
    registerDoctorCrm: $("#registerDoctorCrm"),
    registerDoctorCrmUf: $("#registerDoctorCrmUf"),
    registerDoctorCpf: $("#registerDoctorCpf"),
    registerDoctorBirthDate: $("#registerDoctorBirthDate"),
    registerUsernameSuggestions: $("#registerUsernameSuggestions"),
    registerSubmitButton: $("#registerSubmitButton"),
    selectedPlanBrief: $("#selectedPlanBrief"),
    selectedPlanBriefTitle: $("#selectedPlanBriefTitle"),
    selectedPlanBriefDescription: $("#selectedPlanBriefDescription"),
    selectedPlanBriefBilling: $("#selectedPlanBriefBilling"),
    selectedPlanBriefMeta: $("#selectedPlanBriefMeta"),
    setupForm: $("#setupForm"),
    setupCompany: $("#setupCompany"),
    setupUsername: $("#setupUsername"),
    setupPassword: $("#setupPassword"),
    setupPasswordConfirm: $("#setupPasswordConfirm"),
    showSetupButton: $("#showSetupButton"),
    showRegisterButton: $("#showRegisterButton"),
    showLoginFromRegisterButton: $("#showLoginFromRegisterButton"),
    showLoginButton: $("#showLoginButton"),
    sessionUserLabel: $("#sessionUserLabel"),
    adminSessionUserLabel: $("#adminSessionUserLabel"),
    logoutButton: $("#logoutButton"),
    adminLogoutButton: $("#adminLogoutButton"),
    homePanel: $("#homePanel"),
    workspace: $("#workspace"),
    moduleTitle: $("#moduleTitle"),
    moduleGuidance: $("#moduleGuidance"),
    moduleRuleBanner: $("#moduleRuleBanner"),
    moduleButtons: $$("[data-module]"),
    moduleForms: $$(".module-form"),
    assessmentForm: $("#assessmentForm"),
    backToModules: $("#backToModules"),
    resetModule: $("#resetModule"),
    dashboardTotalClients: $("#dashboardTotalClients"),
    dashboardActiveClients: $("#dashboardActiveClients"),
    dashboardDelinquentClients: $("#dashboardDelinquentClients"),
    dashboardTotalReports: $("#dashboardTotalReports"),
    resultCard: $("#resultCard"),
    resultTitle: $("#resultTitle"),
    resultMessage: $("#resultMessage"),
    resultFacts: $("#resultFacts"),
    descriptionBlock: $("#descriptionBlock"),
    limitationsBlock: $("#limitationsBlock"),
    reportBlock: $("#reportBlock"),
    pdfBlock: $("#pdfBlock"),
    supportBlock: $("#supportBlock"),
    descriptionText: $("#descriptionText"),
    limitationsText: $("#limitationsText"),
    reportText: $("#reportText"),
    supportText: $("#supportText"),
    downloadPdfButton: $("#downloadPdfButton"),
    savePdfButton: $("#savePdfButton"),
    pdfActionStatus: $("#pdfActionStatus"),
    reportWorkerName: $("#reportWorkerName"),
    reportWorkerCpf: $("#reportWorkerCpf"),
    reportDate: $("#reportDate"),
    reportOrigin: $("#reportOrigin"),
    reportCompany: $("#reportCompany"),
    reportRole: $("#reportRole"),
    reportSector: $("#reportSector"),
    reportExaminer: $("#reportExaminer"),
    reportExaminerRegistry: $("#reportExaminerRegistry"),
    reportUnit: $("#reportUnit"),
    reportExternalFiles: $("#reportExternalFiles"),
    reportExternalFilesStatus: $("#reportExternalFilesStatus"),
    reportExternalFilesList: $("#reportExternalFilesList"),
    audioFile: $("#audioFile"),
    audioUploadStatus: $("#audioUploadStatus"),
    audioPaste: $("#audioPaste"),
    audioParsePaste: $("#audioParsePaste"),
    audioAvgOD: $("#audioAvgOD"),
    audioAvgOE: $("#audioAvgOE"),
    physicalConditionType: $("#physicalConditionType"),
    physicalCaseChoices: $$("#physicalCaseChoices .choice-card"),
    physicalFunctionChecklist: $("#physicalFunctionChecklist")
  };

  const state = {
    activeModule: null,
    lastResult: null,
    lastLaudoUsageSignature: "",
    authMode: "login",
    authAccessType: "buyer",
    authAccessTouched: false,
    authBootstrap: null,
    planCatalog: [],
    sessionUser: null,
    companyCurrentView: "overview",
    companySelectedMonth: "",
    companyLogoDraft: "",
    companyLastDoctorAccess: null,
    adminCurrentView: "overview",
    adminExpandedUserId: "",
    adminUsersCache: [],
    adminUserSearch: "",
    adminUserFilter: "active_company",
    adminCreateProfile: "",
    isRepairingText: false,
    textRepairObserver: null,
    pendingTextRepairFrame: 0,
    pendingTextRepairRoot: null
  };

  init();

  function init() {
    repairInterfaceTextContent();
    observeInterfaceTextMutations();
    initAuth();
    initCompanyDashboard();
    initInlineAdminPanel();

    refs.moduleButtons.forEach((button) => {
      button.addEventListener("click", () => setActiveModule(button.dataset.module));
    });

    refs.backToModules.addEventListener("click", showHome);
    refs.resetModule.addEventListener("click", resetCurrentModule);

    refs.assessmentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      evaluateCurrentModule();
    });

    if (refs.downloadPdfButton) {
      refs.downloadPdfButton.addEventListener("click", handlePdfDownload);
    }
    if (refs.savePdfButton) {
      refs.savePdfButton.addEventListener("click", handlePdfSave);
    }

    if (refs.reportExternalFiles) {
      refs.reportExternalFiles.addEventListener("change", handleExternalFilesChange);
      updateExternalFilesUI();
    }

    refs.audioFile.addEventListener("change", handleAudioFileUpload);
    if (refs.audioParsePaste) {
      refs.audioParsePaste.addEventListener("click", handleAudioPasteParse);
    }

    [
      "#audioOD500",
      "#audioOD1000",
      "#audioOD2000",
      "#audioOD3000",
      "#audioOE500",
      "#audioOE1000",
      "#audioOE2000",
      "#audioOE3000"
    ].forEach((selector) => {
      const field = $(selector);
      if (field) {
        field.addEventListener("input", updateAudiometryAverages);
      }
    });

    [
      "#physicalConditionType",
      "#physicalSegment",
      "#physicalAmputationScope",
      "#physicalLaterality",
      "#physicalPermanent",
      "#physicalClinicalBasis",
      "#physicalSupportDocs",
      "#physicalMovementFocus",
      "#physicalStrengthPattern",
      "#physicalMobility",
      "#physicalStrengthGrade",
      "#physicalAnatomicalLoss",
      "#physicalImpactGrade",
      "#physicalFunctionalLossSuspected",
      "#physicalNeedMovementDocumentation",
      "#physicalAmputationLevel"
    ].forEach((selector) => {
      const field = $(selector);
      if (field) {
        field.addEventListener("change", () => {
          updatePhysicalChoiceButtons();
          updatePhysicalFieldVisibility();
        });
      }
    });

    [
      "#handThumb",
      "#handThumbLevel",
      "#handIndex",
      "#handIndexLevel",
      "#handMiddle",
      "#handMiddleLevel",
      "#handRing",
      "#handRingLevel",
      "#handLittle",
      "#handLittleLevel",
      "#footHallux",
      "#footHalluxLevel",
      "#footSecond",
      "#footSecondLevel",
      "#footThird",
      "#footThirdLevel",
      "#footFourth",
      "#footFourthLevel",
      "#footFifth",
      "#footFifthLevel"
    ].forEach((selector) => {
      const field = $(selector);
      if (field) {
        field.addEventListener("change", () => {
          updatePhysicalFieldVisibility();
        });
      }
    });

    const visualFieldChanged = $("#visualFieldChanged");
    if (visualFieldChanged) {
      visualFieldChanged.addEventListener("change", updateVisualFieldVisibility);
    }

    refs.physicalCaseChoices.forEach((button) => {
      button.addEventListener("click", () => {
        if (refs.physicalConditionType) {
          refs.physicalConditionType.value = button.dataset.physicalChoice;
        }
        updatePhysicalChoiceButtons();
        updatePhysicalFieldVisibility();
      });
    });

    renderIdleResult({
      title: "Selecione um módulo e preencha os dados clínicos",
      message: "O sistema só gera descrição técnica e limitações funcionais quando o caso enquadra conforme a lógica clínico-funcional definida."
    });

    if (refs.reportDate && !refs.reportDate.value) {
      refs.reportDate.value = new Date().toISOString().slice(0, 10);
    }

    updateAudiometryAverages();
    updatePhysicalChoiceButtons();
    updatePhysicalFieldVisibility();
    updateVisualFieldVisibility();
  }

  function initAuth() {
    if (refs.loginForm) {
      refs.loginForm.addEventListener("submit", handleLoginSubmit);
    }
    if (refs.setupForm) {
      refs.setupForm.addEventListener("submit", handleSetupSubmit);
    }
    if (refs.showSetupButton) {
      refs.showSetupButton.addEventListener("click", () => setAuthMode("setup"));
    }
    if (refs.showLoginButton) {
      refs.showLoginButton.addEventListener("click", () => setAuthMode("login"));
    }
    if (refs.logoutButton) {
      refs.logoutButton.addEventListener("click", handleLogout);
    }

    const profile = getStoredAuthProfile();
    const session = getStoredSessionUser();

    if (profile && session && session.username) {
      applyAuthenticatedSession(session);
      return;
    }

    if (profile) {
      setAuthMode("login");
      setAuthStatus("Acesso configurado. Informe usuário e senha para entrar.");
      return;
    }

    setAuthMode("setup");
    setAuthStatus("Faça a configuração inicial do acesso local para liberar o sistema.");
  }

  function setAuthMode(mode) {
    state.authMode = mode === "setup" ? "setup" : "login";
    if (refs.loginForm) {
      refs.loginForm.classList.toggle("hidden", state.authMode !== "login");
    }
    if (refs.setupForm) {
      refs.setupForm.classList.toggle("hidden", state.authMode !== "setup");
    }
    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = state.authMode === "setup" ? "Configuração inicial" : "Acesso local";
    }
    if (refs.authTitle) {
      refs.authTitle.textContent = state.authMode === "setup" ? "Configurar acesso do sistema" : "Entrar no sistema";
    }
    if (refs.authDescription) {
      refs.authDescription.textContent = state.authMode === "setup"
        ? "Defina a empresa e o usuário principal para iniciar a versão comercial local do sistema."
        : "Informe usuário e senha para acessar o ambiente operacional.";
    }
  }

  function setAuthStatus(message = "") {
    if (refs.authStatus) {
      refs.authStatus.textContent = message;
    }
  }

  async function handleSetupSubmit(event) {
    event.preventDefault();

    const company = normalizedText("setupCompany");
    const username = normalizedText("setupUsername");
    const password = valueOfRaw("setupPassword");
    const confirmation = valueOfRaw("setupPasswordConfirm");

    if (!company || !username || !password || !confirmation) {
      setAuthStatus("Preencha empresa, usuário e senha para concluir a configuração.");
      return;
    }

    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmation) {
      setAuthStatus("A confirmação da senha não confere.");
      return;
    }

    const profile = {
      company,
      username,
      usernameKey: normalizeUserIdentifier(username),
      passwordHash: await buildAuthHash(password),
      createdAt: new Date().toISOString()
    };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    persistSessionUser({
      username: profile.username,
      company: profile.company,
      loginAt: new Date().toISOString()
    });

    if (refs.setupForm) {
      refs.setupForm.reset();
    }
    setAuthStatus("");
    applyAuthenticatedSession({
      username: profile.username,
      company: profile.company,
      loginAt: new Date().toISOString()
    });
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    const profile = getStoredAuthProfile();
    if (!profile) {
      setAuthMode("setup");
      setAuthStatus("Nenhum acesso foi configurado ainda. Faça a configuração inicial.");
      return;
    }

    const username = normalizedText("loginUsername");
    const password = valueOfRaw("loginPassword");

    if (!username || !password) {
      setAuthStatus("Informe usuário e senha para entrar.");
      return;
    }

    const candidateHash = await buildAuthHash(password);
    const validUser = normalizeUserIdentifier(username) === profile.usernameKey;
    const validPassword = candidateHash === profile.passwordHash;

    if (!validUser || !validPassword) {
      setAuthStatus("Credenciais inválidas. Revise usuário e senha.");
      return;
    }

    const session = {
      username: profile.username,
      company: profile.company,
      loginAt: new Date().toISOString()
    };

    persistSessionUser(session);
    if (refs.loginForm) {
      refs.loginForm.reset();
    }
    setAuthStatus("");
    applyAuthenticatedSession(session);
  }

  function handleLogout() {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    if (refs.appShell) {
      refs.appShell.classList.add("hidden");
    }
    if (refs.authShell) {
      refs.authShell.classList.remove("hidden");
    }
    setAuthMode(getStoredAuthProfile() ? "login" : "setup");
    setAuthStatus("Sessão encerrada com sucesso.");
  }

  function applyAuthenticatedSession(session) {
    if (refs.authShell) {
      refs.authShell.classList.add("hidden");
    }
    if (refs.appShell) {
      refs.appShell.classList.remove("hidden");
    }
    if (refs.sessionUserLabel) {
      refs.sessionUserLabel.textContent = session.company
        ? `${session.username} • ${session.company}`
        : session.username;
    }
    if (refs.reportCompany && !refs.reportCompany.value && session.company) {
      refs.reportCompany.value = session.company;
    }
  }

  function getStoredAuthProfile() {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function getStoredSessionUser() {
    try {
      const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function persistSessionUser(session) {
    window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  async function buildAuthHash(value) {
    const normalized = String(value || "");
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      const bytes = new TextEncoder().encode(normalized);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest))
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
    }
    return fallbackHash(normalized);
  }

  function fallbackHash(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) - hash) + value.charCodeAt(index);
      hash |= 0;
    }
    return `fallback_${Math.abs(hash)}`;
  }

  function normalizeUserIdentifier(value) {
    return normalizeSpacing(String(value || "")).toLowerCase();
  }

  function waitForApiRetry(delayMs) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, delayMs);
    });
  }

  function isRetryableApiMethod(method) {
    const normalizedMethod = String(method || "GET").trim().toUpperCase();
    return normalizedMethod === "GET" || normalizedMethod === "HEAD";
  }

  function isRetryableApiRequest(url, method) {
    const normalizedUrl = String(url || "");
    return isRetryableApiMethod(method) || normalizedUrl === AUTH_API.login;
  }

  async function apiJson(url, options = {}) {
    const sessionToken = getApiSessionToken();
    const requestUrl = buildApiUrl(url);
    const config = {
      method: options.method || "GET",
      headers: {
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        ...(options.headers || {})
      },
      credentials: "include"
    };

    if (options.body !== undefined) {
      config.body = JSON.stringify(options.body);
    }

    const maxAttempts = isRetryableApiRequest(url, config.method) ? 3 : 1;
    let response;
    let lastNetworkError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        response = await fetch(requestUrl, config);
      } catch (error) {
        lastNetworkError = error;
        if (attempt < maxAttempts) {
          await waitForApiRetry(450 * attempt);
          continue;
        }
        const isDirectFileAccess = window.location.protocol === "file:";
        throw new Error(isDirectFileAccess
          ? `Nao foi possivel conectar ao servidor. Abra o sistema por ${getPreferredAppOrigin()} ou pela hospedagem publicada.`
          : `Nao foi possivel conectar ao servidor neste momento. Verifique se o backend esta online em ${getPreferredAppOrigin()}.`);
      }

      if (response && [502, 503, 504].includes(response.status) && attempt < maxAttempts) {
        await waitForApiRetry(450 * attempt);
        continue;
      }

      break;
    }

    if (!response) {
      throw lastNetworkError || new Error("Nao foi possivel obter resposta do servidor.");
    }

    let payload = {};
    try {
      payload = await response.json();
    } catch (error) {
      payload = {};
    }

    if (!response.ok) {
      const isApiRoute = String(url || "").startsWith("/api/");
      const isNetlifyHost = /\.netlify\.app$/i.test(window.location.hostname || "");
      if (response.status === 404 && isApiRoute) {
        throw new Error(isNetlifyHost
          ? `A API publicada nao foi encontrada. Verifique se o backend esta online em ${getPreferredAppOrigin()}.`
          : "A rota da API nao foi encontrada neste ambiente. Verifique se o backend publicado esta usando a versao correta.");
      }
      if ((response.status === 502 || response.status === 503 || response.status === 504) && isApiRoute) {
        throw new Error("O servidor publicado respondeu com instabilidade temporaria. Aguarde alguns segundos e tente novamente.");
      }
      if (response.status === 401 && isApiRoute) {
        clearApiSessionToken();
      }
      const apiError = new Error(payload && payload.message ? payload.message : "Falha na comunicação com o servidor.");
      apiError.payload = payload;
      apiError.status = response.status;
      throw apiError;
    }

    return payload;
  }

  function initAuth() {
    if (refs.loginForm) {
      refs.loginForm.addEventListener("submit", handleLoginSubmit);
    }
    if (refs.setupForm) {
      refs.setupForm.addEventListener("submit", handleSetupSubmit);
    }
    if (refs.showSetupButton) {
      refs.showSetupButton.addEventListener("click", () => setAuthMode("setup"));
    }
    if (refs.showLoginButton) {
      refs.showLoginButton.addEventListener("click", () => setAuthMode("login"));
    }
    if (refs.logoutButton) {
      refs.logoutButton.addEventListener("click", handleLogout);
    }
    if (refs.adminLogoutButton) {
      refs.adminLogoutButton.addEventListener("click", handleLogout);
    }
    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.addEventListener("click", () => {
        if (state.authBootstrap && !state.authBootstrap.configured) {
          setAuthAccessType("admin");
          setAuthMode("setup");
          setAuthStatus("Antes do acesso da empresa, configure o administrador da plataforma.");
          return;
        }
        setAuthAccessType("buyer");
        setAuthMode("login");
        setAuthStatus("Informe as credenciais da empresa para entrar no ambiente operacional.");
      });
    }
    if (refs.accessAdminButton) {
      refs.accessAdminButton.addEventListener("click", () => {
        setAuthAccessType("admin");
        setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
        setAuthStatus(state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais do administrador da plataforma."
          : "Configure agora o primeiro administrador da plataforma.");
      });
    }

    loadAuthBootstrap();
  }

  function setAuthMode(mode) {
    state.authMode = mode === "setup" ? "setup" : "login";
    if (refs.loginForm) {
      refs.loginForm.classList.toggle("hidden", state.authMode !== "login");
    }
    if (refs.setupForm) {
      refs.setupForm.classList.toggle("hidden", state.authMode !== "setup");
    }
    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = state.authMode === "setup" ? "Configuracao inicial" : "Acesso protegido";
    }
    if (refs.authTitle) {
      refs.authTitle.textContent = state.authMode === "setup" ? "Configurar acesso do sistema" : "Entrar no sistema";
    }
    if (refs.authDescription) {
      refs.authDescription.textContent = state.authMode === "setup"
        ? "Defina a empresa e o usuario administrador para liberar a primeira conta do sistema."
        : "Informe usuario e senha para acessar o ambiente operacional.";
    }
  }

  function setAuthStatus(message = "") {
    if (refs.authStatus) {
      refs.authStatus.textContent = message;
    }
  }

  async function loadAuthBootstrap() {
    try {
      const bootstrap = await apiJson(AUTH_API.bootstrap);
      state.authBootstrap = bootstrap;

      if (!bootstrap.configured) {
        setAuthMode("setup");
        setAuthStatus("Faca a configuracao inicial do acesso para liberar a primeira conta administradora.");
        return;
      }

      const sessionResponse = await apiJson(AUTH_API.session);
      if (sessionResponse.authenticated && sessionResponse.user) {
        applyAuthenticatedSession(sessionResponse.user);
        return;
      }

      setAuthMode("login");
      setAuthStatus("Acesso configurado. Informe usuario e senha para entrar.");
    } catch (error) {
      console.error(error);
      setAuthMode("login");
      setAuthStatus("Nao foi possivel verificar a configuracao do site. Confira o servidor.");
    }
  }

  async function handleSetupSubmit(event) {
    event.preventDefault();

    const company = normalizedText("setupCompany");
    const username = normalizedText("setupUsername");
    const password = valueOfRaw("setupPassword");
    const confirmation = valueOfRaw("setupPasswordConfirm");

    if (!company || !username || !password || !confirmation) {
      setAuthStatus("Preencha empresa, usuario e senha para concluir a configuracao.");
      return;
    }

    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmation) {
      setAuthStatus("A confirmacao da senha nao confere.");
      return;
    }

    try {
      const response = await apiJson(AUTH_API.setup, {
        method: "POST",
        body: { company, username, password }
      });

      if (refs.setupForm) {
        refs.setupForm.reset();
      }

      state.authBootstrap = { configured: true, company };
      setAuthStatus("");
      applyAuthenticatedSession(response.user);
    } catch (error) {
      setAuthStatus(error.message || "Nao foi possivel concluir a configuracao inicial.");
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      setAuthStatus("Login bloqueado nesta abertura local. Abra o sistema por http://127.0.0.1:8080 ou pela hospedagem publicada.");
      return;
    }

    const username = normalizedText("loginUsername");
    const password = valueOfRaw("loginPassword");

    if (!username || !password) {
      setAuthStatus("Informe usuario e senha para entrar.");
      return;
    }

    try {
      const response = await apiJson(AUTH_API.login, {
        method: "POST",
        body: { username, password }
      });

      if (refs.loginForm) {
        refs.loginForm.reset();
      }

      setAuthStatus("");
      applyAuthenticatedSession(response.user);
    } catch (error) {
      setAuthStatus(error.message || "Credenciais invalidas. Revise usuario e senha.");
    }
  }

  async function handleLogout() {
    try {
      await apiJson(AUTH_API.logout, { method: "POST" });
    } catch (error) {
      console.error(error);
    }

    state.sessionUser = null;
    if (refs.appShell) {
      refs.appShell.classList.add("hidden");
    }
    if (refs.authShell) {
      refs.authShell.classList.remove("hidden");
    }
    if (refs.sessionAdminLink) {
      refs.sessionAdminLink.classList.add("hidden");
    }
    closeInlineAdminPanel();
    setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
    setAuthStatus("Sessao encerrada com sucesso.");
  }

  function applyAuthenticatedSession(session) {
    state.sessionUser = session || null;
    if (refs.authShell) {
      refs.authShell.classList.add("hidden");
    }
    if (refs.appShell) {
      refs.appShell.classList.remove("hidden");
    }
    if (refs.sessionUserLabel) {
      refs.sessionUserLabel.textContent = session && session.company
        ? `${session.username} - ${session.company}`
        : (session && session.username ? session.username : "Sessao ativa");
    }
    if (refs.sessionAdminLink) {
      refs.sessionAdminLink.classList.toggle("hidden", !(session && (session.role === "admin" || session.isAdmin)));
    }
    syncInlineAdminAccess(session);
    if (refs.reportCompany && !refs.reportCompany.value && session && session.company) {
      refs.reportCompany.value = session.company;
    }
  }

  function setActiveModule(moduleKey) {
    if (isCompanySession()) {
      return;
    }

    state.activeModule = moduleKey;

    refs.homePanel.classList.add("hidden");
    refs.workspace.classList.remove("hidden");

    const config = moduleConfigs[moduleKey];
    refs.moduleTitle.textContent = config.title;
    refs.moduleGuidance.textContent = config.guidance;
    refs.moduleRuleBanner.textContent = config.banner;

    refs.moduleForms.forEach((formSection) => {
      formSection.classList.toggle("is-active", formSection.dataset.moduleForm === moduleKey);
    });

    updatePhysicalChoiceButtons();
    updatePhysicalFieldVisibility();
    updateAudiometryAverages();
    updateVisualFieldVisibility();
    syncAllCidDescriptionFields({ normalizeCodeField: true });

    renderIdleResult({
      title: `Módulo ${config.title}`,
      message: "Preencha os campos estruturados e execute a classificação para obter o resultado técnico."
    });
  }

  function showHome() {
    if (isCompanySession()) {
      if (refs.companyDashboard) refs.companyDashboard.classList.remove("hidden");
      if (refs.workspace) refs.workspace.classList.add("hidden");
      if (refs.homePanel) refs.homePanel.classList.add("hidden");
      return;
    }

    refs.workspace.classList.add("hidden");
    refs.homePanel.classList.remove("hidden");
  }

  function renderIdleResult(payload) {
    state.lastResult = null;
    state.lastLaudoUsageSignature = "";
    refs.resultCard.className = "result-card neutral";
    refs.resultTitle.textContent = payload.title;
    refs.resultMessage.textContent = payload.message;
    refs.resultFacts.innerHTML = "";
    refs.descriptionBlock.classList.add("hidden");
    refs.limitationsBlock.classList.add("hidden");
    refs.reportBlock.classList.add("hidden");
    refs.pdfBlock.classList.add("hidden");
    refs.supportBlock.classList.add("hidden");
    refs.descriptionText.textContent = "";
    refs.limitationsText.textContent = "";
    refs.reportText.textContent = "";
    refs.supportText.textContent = "";
    setPdfActionStatus("");
  }

  function renderResult(result) {
    state.lastResult = result;
    state.lastLaudoUsageSignature = "";
    const toneClass = {
      eligible: "success",
      review: "warning",
      ineligible: "danger"
    }[result.status] || "neutral";

    refs.resultCard.className = `result-card ${toneClass}`;
    refs.resultTitle.textContent = result.title;
    refs.resultMessage.textContent = result.message;
    refs.resultFacts.innerHTML = "";

    (result.facts || []).forEach((fact) => {
      const item = document.createElement("li");
      item.textContent = fact;
      refs.resultFacts.appendChild(item);
    });

    const canShowOutputs = result.status === "eligible";
    refs.descriptionBlock.classList.toggle("hidden", !canShowOutputs);
    refs.limitationsBlock.classList.toggle("hidden", !canShowOutputs);
    refs.reportBlock.classList.toggle("hidden", !canShowOutputs || !result.report);
    refs.pdfBlock.classList.toggle("hidden", !canShowOutputs);
    refs.descriptionText.textContent = canShowOutputs ? result.description : "";
    refs.limitationsText.textContent = canShowOutputs ? result.limitations : "";
    refs.reportText.textContent = canShowOutputs ? (result.report || "") : "";

    const hasSupport = Boolean(result.supportNote);
    refs.supportBlock.classList.toggle("hidden", !hasSupport);
    refs.supportText.textContent = hasSupport ? result.supportNote : "";
    setPdfActionStatus("");
  }

  function evaluateCurrentModule() {
    if (isCompanySession()) {
      return;
    }

    if (!state.activeModule) {
      return;
    }

    const engineMap = {
      auditiva: evaluateAuditory,
      fisica: evaluatePhysical,
      clinicas: evaluateClinical,
      visual: evaluateVisual,
      intelectual: evaluateIntellectual,
      psicossocial: evaluatePsychosocial
    };

    const result = engineMap[state.activeModule]();
    renderResult(result);
  }

  function resetCurrentModule() {
    if (isCompanySession()) {
      return;
    }

    if (!state.activeModule) {
      return;
    }

    const activeForm = $(`.module-form[data-module-form="${state.activeModule}"]`);
    if (!activeForm) {
      return;
    }

    activeForm.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.id && field.id.startsWith("report")) {
        return;
      }
      if (field.type === "checkbox") {
        field.checked = false;
      } else {
        field.value = "";
      }
    });

    if (state.activeModule === "auditiva") {
      refs.audioUploadStatus.textContent = "É possível importar arquivo estruturado em CSV, TXT, JSON ou PDF textual para preenchimento automático.";
    }

    updateAudiometryAverages();
    updatePhysicalChoiceButtons();
    updatePhysicalFieldVisibility();
    updateVisualFieldVisibility();

    renderIdleResult({
      title: `Módulo ${moduleConfigs[state.activeModule].title}`,
      message: "Campos limpos. Preencha novamente os dados estruturados para classificar o caso."
    });
  }

  function toggleInlineAdminUser(userId) {
    state.adminExpandedUserId = state.adminExpandedUserId === userId ? "" : userId;
    renderInlineAdminUsers(state.adminUsersCache || []);
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const statusClass = escapeHtml(user.status || "active");
      const paymentClass = escapeHtml(normalizeLocalPaymentStatus(user.paymentStatus || "pending"));
      const planLabel = user.role === "admin"
        ? "Administracao interna"
        : `${toPresentationText(user.planLabel || "Plano nao definido")} (${formatCurrencyCents(user.planPriceCents || 0)})`;
      const expanded = state.adminExpandedUserId === user.id;

      const card = document.createElement("article");
      card.className = `admin-user-row${expanded ? " is-open" : ""}`;
      card.innerHTML = `
        <button class="admin-user-toggle" type="button" data-admin-user-toggle="${escapeHtml(user.id)}" aria-expanded="${expanded ? "true" : "false"}">
          <div class="admin-user-main">
            <strong>${escapeHtml(toPresentationText(user.company || "Empresa nao informada"))}</strong>
            <span>${escapeHtml(toPresentationText(user.username || "-"))} - ${escapeHtml(roleLabel)}</span>
          </div>

          <div class="admin-user-resume">
            <span class="admin-user-chip">Plano: ${escapeHtml(planLabel)}</span>
            <span class="admin-user-chip">Laudos: ${escapeHtml(String(Number(user.usageCount || 0)))}</span>
            <span class="admin-user-chip">Validade: ${escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt))}</span>
          </div>

          <div class="user-badges">
            <span class="user-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
            <span class="user-badge ${paymentClass}">${escapeHtml(paymentLabel)}</span>
          </div>
        </button>

        <div class="admin-user-detail${expanded ? "" : " hidden"}">
          <div class="user-meta">
            <div class="meta-box"><strong>Contato</strong><span>${escapeHtml(toPresentationText(user.contactName || "Sem responsavel informado"))}</span></div>
            <div class="meta-box"><strong>E-mail</strong><span>${escapeHtml(toPresentationText(user.email || "Sem e-mail"))}</span></div>
            <div class="meta-box"><strong>Ultimo acesso</strong><span>${escapeHtml(formatInlineAdminDateTime(user.lastAccessAt))}</span></div>
            <div class="meta-box"><strong>Criado em</strong><span>${escapeHtml(formatInlineAdminDateTime(user.createdAt))}</span></div>
            <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
            <div class="meta-box"><strong>Perfil</strong><span>${escapeHtml(roleLabel)}</span></div>
          </div>

          ${state.authProvider === "api" && user.role !== "admin" ? `
            <div class="admin-user-quick-actions">
              ${user.mpCheckoutUrl ? `<a class="ghost-button" href="${escapeHtml(user.mpCheckoutUrl)}" target="_blank" rel="noopener">Abrir checkout atual</a>` : ""}
              <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar checkout Mercado Pago</button>
            </div>
          ` : ""}

          <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
            <label class="field"><span>Empresa</span><input type="text" name="company" value="${escapeHtml(toPresentationText(user.company || ""))}"></label>
            <label class="field"><span>Responsavel</span><input type="text" name="contactName" value="${escapeHtml(toPresentationText(user.contactName || ""))}"></label>
            <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(toPresentationText(user.email || ""))}"></label>
            <label class="field"><span>Usuario</span><input type="text" name="username" value="${escapeHtml(toPresentationText(user.username || ""))}"></label>
            <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
            <label class="field"><span>Status do acesso</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
            <label class="field"><span>Status do pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
            <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
            <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
            <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
            <label class="field field-full"><span>Observacoes internas</span><textarea name="notes" rows="3">${escapeHtml(toPresentationText(user.notes || "", true))}</textarea></label>
            <div class="form-actions field-full"><button class="primary-button" type="submit">Salvar alteracoes</button></div>
          </form>

          <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
        </div>
      `;

      refs.adminUsersGrid.appendChild(card);
    });

    refs.adminUsersGrid.querySelectorAll("[data-admin-user-toggle]").forEach((button) => {
      button.addEventListener("click", () => toggleInlineAdminUser(button.dataset.adminUserToggle || ""));
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O PDF só pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const missing = [];
    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliação");
    if (!identity.examiner) missing.push("profissional responsável");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatórios para emissão do PDF: ${joinList(missing)}.`);
      return;
    }

    const pdfPayload = buildPdfPayload(identity, state.lastResult);

    if (window.location.protocol === "file:") {
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);
      if (!openedPrintView) {
        window.alert("O navegador bloqueou a abertura do formulário oficial para impressão. Permita pop-ups desta página e tente novamente.");
      }
      return;
    }

    let blob;
    try {
      blob = await buildLaudoPdfBlob(pdfPayload);
    } catch (error) {
      console.error(error);
      const openedPrintFallback = await openOfficialPrintPreview(pdfPayload);
      if (openedPrintFallback) {
        return;
      }
      window.alert(`Não foi possível emitir o PDF no formulário oficial neste momento.${error && error.message ? `\n\nDetalhe técnico: ${error.message}` : ""}`);
      return;
    }
    const fileName = buildPdfFileName(identity.workerName);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function collectReportIdentity() {
    return {
      workerName: normalizedText("reportWorkerName"),
      workerCpf: normalizedText("reportWorkerCpf"),
      reportDate: valueOfRaw("reportDate"),
      origin: valueOf("reportOrigin"),
      company: normalizedText("reportCompany"),
      role: normalizedText("reportRole"),
      sector: normalizedText("reportSector"),
      examiner: normalizedText("reportExaminer"),
      examinerRegistry: normalizedText("reportExaminerRegistry"),
      unit: normalizedText("reportUnit")
    };
  }

  function buildPdfPayload(identity, result) {
    return {
      title: "LAUDO CARACTERIZADOR DE PESSOA COM DEFICIÊNCIA",
      moduleLabel: moduleConfigs[state.activeModule] ? moduleConfigs[state.activeModule].title : "Módulo não especificado",
      identity,
      result,
      technicalBasis: buildTechnicalBasisText(state.activeModule, result),
      generatedAt: new Date()
    };
  }

  function buildPdfFileName(workerName) {
    const safeWorker = (workerName || "trabalhador")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
    return `laudo_caracterizador_${safeWorker || "trabalhador"}.pdf`;
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final sÃ³ pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const externalFiles = collectExternalReportFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliaÃ§Ã£o");
    if (!identity.examiner) missing.push("profissional responsÃ¡vel");
    if (!identity.examinerRegistry) missing.push("conselho/registro");
    if (!externalFiles.length) missing.push("laudo mÃ©dico externo anexo");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatÃ³rios para emissÃ£o final: ${joinList(missing)}.`);
      return;
    }

    try {
      const attachments = await buildAttachmentPayloads(externalFiles);
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura do pacote de impressÃ£o. Permita pop-ups desta pÃ¡gina e tente novamente.");
      }
    } catch (error) {
      console.error(error);
      window.alert(`NÃ£o foi possÃ­vel preparar o pacote final de impressÃ£o neste momento.${error && error.message ? `\n\nDetalhe tÃ©cnico: ${error.message}` : ""}`);
    }
  }

  function buildPdfPayload(identity, result, attachments = []) {
    return {
      title: "LAUDO CARACTERIZADOR DE PESSOA COM DEFICIÃŠNCIA",
      moduleLabel: moduleConfigs[state.activeModule] ? moduleConfigs[state.activeModule].title : "MÃ³dulo nÃ£o especificado",
      identity,
      result,
      attachments,
      technicalBasis: buildTechnicalBasisText(state.activeModule, result),
      generatedAt: new Date()
    };
  }

  function handleExternalFilesChange() {
    updateExternalFilesUI();
  }

  function collectExternalReportFiles() {
    return refs.reportExternalFiles && refs.reportExternalFiles.files
      ? Array.from(refs.reportExternalFiles.files)
      : [];
  }

  function updateExternalFilesUI() {
    if (!refs.reportExternalFilesStatus || !refs.reportExternalFilesList) {
      return;
    }

    const files = collectExternalReportFiles();
    refs.reportExternalFilesList.innerHTML = "";

    if (!files.length) {
      refs.reportExternalFilesStatus.textContent = "Nenhum documento anexado atÃ© o momento.";
      const emptyState = document.createElement("div");
      emptyState.className = "attachment-empty";
      emptyState.textContent = "Anexe aqui o laudo mÃ©dico externo que deve acompanhar a emissÃ£o final.";
      refs.reportExternalFilesList.appendChild(emptyState);
      return;
    }

    refs.reportExternalFilesStatus.textContent = `${files.length} documento(s) pronto(s) para compor o pacote final de impressÃ£o.`;

    files.forEach((file, index) => {
      const item = document.createElement("article");
      item.className = "attachment-item";

      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${file.name}`;

      const detail = document.createElement("span");
      const fileType = file.type ? file.type : inferMimeTypeFromName(file.name);
      detail.textContent = `${describeAttachmentKind(fileType)} â€¢ ${formatFileSize(file.size)}`;

      item.appendChild(title);
      item.appendChild(detail);
      refs.reportExternalFilesList.appendChild(item);
    });
  }

  async function buildAttachmentPayloads(files) {
    const attachments = [];
    for (const file of files) {
      const mimeType = file.type || inferMimeTypeFromName(file.name);
      const isImage = mimeType.startsWith("image/");
      const isPdf = mimeType === "application/pdf" || /\.pdf$/i.test(file.name);
      attachments.push({
        name: file.name,
        mimeType,
        size: file.size,
        sizeLabel: formatFileSize(file.size),
        previewKind: isImage ? "image" : (isPdf ? "pdf" : "file"),
        source: isImage ? await readFileAsDataUrl(file) : URL.createObjectURL(file)
      });
    }
    return attachments;
  }

  function cleanupAttachmentPayloads(attachments = []) {
    attachments.forEach((attachment) => {
      if (attachment && attachment.previewKind !== "image" && attachment.source && attachment.source.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.source);
      }
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error(`Falha ao ler o anexo ${file.name}.`));
      reader.readAsDataURL(file);
    });
  }

  function inferMimeTypeFromName(fileName) {
    if (/\.pdf$/i.test(fileName)) return "application/pdf";
    if (/\.(png)$/i.test(fileName)) return "image/png";
    if (/\.(jpg|jpeg)$/i.test(fileName)) return "image/jpeg";
    if (/\.webp$/i.test(fileName)) return "image/webp";
    return "application/octet-stream";
  }

  function describeAttachmentKind(mimeType) {
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType.startsWith("image/")) return "Imagem";
    return "Documento";
  }

  function formatFileSize(size) {
    const numeric = Number(size || 0);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return "tamanho nÃ£o informado";
    }
    if (numeric < 1024) {
      return `${numeric} B`;
    }
    if (numeric < 1024 * 1024) {
      return `${(numeric / 1024).toFixed(1)} KB`;
    }
    return `${(numeric / (1024 * 1024)).toFixed(2)} MB`;
  }

  function updatePhysicalChoiceButtons() {
    const selected = refs.physicalConditionType ? refs.physicalConditionType.value : "";
    refs.physicalCaseChoices.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.physicalChoice === selected);
    });
  }

  function updatePhysicalFieldVisibility() {
    const choice = refs.physicalConditionType ? refs.physicalConditionType.value : "";
    const scope = valueOf("physicalAmputationScope");
    const resolvedSegment = resolvePhysicalSegment();
    const isAmputation = choice === "Amputação";
    const movementDriven = ["Limitação articular", "Lesão neurológica", "Sequela traumática", "Outras alterações físicas permanentes", "Deformidade"].includes(choice);
    const showStrength = ["Lesão neurológica", "Sequela traumática", "Outras alterações físicas permanentes"].includes(choice);
    const showMobility = movementDriven;
    const showAnatomicalLoss = isAmputation || ["Deformidade", "Sequela traumática", "Outras alterações físicas permanentes"].includes(choice);

    toggleField("physicalSegmentField", Boolean(choice) && !isAmputation);
    toggleField("physicalAmputationScopeField", isAmputation);
    toggleField("physicalLateralityField", Boolean(choice));
    toggleField("physicalPermanentField", Boolean(choice));
    toggleField("physicalClinicalBasisField", Boolean(choice));
    toggleField("physicalSupportDocsField", Boolean(choice));
    toggleField("physicalCidField", Boolean(choice));
    toggleField("physicalCidDescriptionField", Boolean(choice));
    toggleField("physicalMovementFocusField", movementDriven && Boolean(resolvePhysicalSegment()));
    toggleField("physicalAnatomicalLossField", showAnatomicalLoss);
    toggleField("physicalStrengthPatternField", showStrength);
    toggleField("physicalStrengthGradeField", showStrength);
    toggleField("physicalMobilityField", showMobility);
    toggleField("physicalImpactGradeField", Boolean(choice));
    toggleField("physicalFunctionalLossField", ["Lesão neurológica", "Sequela traumática", "Outras alterações físicas permanentes"].includes(choice));
    toggleField("physicalMovementDocumentationField", ["Limitação articular", "Lesão neurológica", "Sequela traumática"].includes(choice));

    setBlockVisible("physicalAmputationGeneralGroup", isAmputation);
    setBlockVisible("physicalHandDigitsGroup", isAmputation && scope === "dedos_mao");
    setBlockVisible("physicalFootDigitsGroup", isAmputation && scope === "dedos_pe");
    toggleField("physicalAmputationLevelField", isAmputation && !["dedos_mao", "dedos_pe"].includes(scope));

    if (isAmputation) {
      const permanentField = document.getElementById("physicalPermanent");
      const anatomicalField = document.getElementById("physicalAnatomicalLoss");
      if (permanentField) {
        permanentField.value = "sim";
      }
      if (anatomicalField && !anatomicalField.value) {
        anatomicalField.value = "relevante";
      }
    }

    const lateralityField = document.getElementById("physicalLaterality");
    if (lateralityField) {
      if (resolvedSegment === "coluna" && !lateralityField.value) {
        lateralityField.value = "axial";
        lateralityField.dataset.autoAxial = "true";
      } else if (
        resolvedSegment !== "coluna"
        && lateralityField.dataset.autoAxial === "true"
        && lateralityField.value === "axial"
      ) {
        lateralityField.value = "";
        lateralityField.dataset.autoAxial = "false";
      }
    }

    syncDigitLevelState("handThumb", "handThumbLevel");
    syncDigitLevelState("handIndex", "handIndexLevel");
    syncDigitLevelState("handMiddle", "handMiddleLevel");
    syncDigitLevelState("handRing", "handRingLevel");
    syncDigitLevelState("handLittle", "handLittleLevel");
    syncDigitLevelState("footHallux", "footHalluxLevel");
    syncDigitLevelState("footSecond", "footSecondLevel");
    syncDigitLevelState("footThird", "footThirdLevel");
    syncDigitLevelState("footFourth", "footFourthLevel");
    syncDigitLevelState("footFifth", "footFifthLevel");

    populateMovementFocusOptions(resolvePhysicalSegment());
    populateStrengthPatternOptions(resolvePhysicalFunctionFamily());
    renderPhysicalFunctionOptions();
    syncAllCidDescriptionFields();
  }

  function toggleField(id, shouldShow) {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.classList.toggle("hidden", !shouldShow);
    if (!shouldShow) {
      element.querySelectorAll("input, select, textarea").forEach((field) => {
        if (field.id === "physicalConditionType" || field.id === "physicalPermanent") {
          return;
        }
        if (field.type === "checkbox") {
          field.checked = false;
        } else {
          field.value = "";
        }
      });
    }
  }

  function setBlockVisible(id, shouldShow) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle("hidden", !shouldShow);
      if (!shouldShow) {
        element.querySelectorAll("input, select").forEach((field) => {
          if (field.type === "checkbox") {
            field.checked = false;
          } else {
            field.value = "";
          }
        });
      }
    }
  }

  function syncDigitLevelState(checkboxId, selectId) {
    const checkbox = document.getElementById(checkboxId);
    const select = document.getElementById(selectId);
    if (!checkbox || !select) {
      return;
    }

    select.disabled = !checkbox.checked;
    if (!checkbox.checked) {
      select.value = "";
    }
  }

  function resolvePhysicalSegment() {
    const choice = valueOf("physicalConditionType");
    if (choice === "amputação") {
      const scope = valueOf("physicalAmputationScope");
      return AMPUTATION_SCOPE_META[scope] ? AMPUTATION_SCOPE_META[scope].segment : "";
    }
    return valueOf("physicalSegment");
  }

  function resolveEffectivePhysicalLaterality() {
    return valueOf("physicalLaterality") || (resolvePhysicalSegment() === "coluna" ? "axial" : "");
  }

  function buildPhysicalMissingItems(context = {}) {
    const missing = [];
    const functionalCount = Number(context.functionalCount || 0);
    const objectiveEvidenceCount = Number(context.objectiveEvidenceCount || 0);
    const hasFunctionalEvidence = functionalCount > 0
      || Boolean(context.functionalLossSuspected)
      || objectiveEvidenceCount > 0
      || Boolean(context.impactGrade)
      || Boolean(context.inferredImpactGrade);
    if (!context.conditionType) {
      missing.push("a situação física principal");
    }
    if (context.conditionType && context.conditionType !== "amputação" && !context.segmentReady) {
      missing.push("o segmento corporal acometido");
    }
    if (!context.impactGrade && !context.inferredImpactGrade && !hasFunctionalEvidence) {
      missing.push("o impacto funcional");
    }
    if (!functionalCount && !context.functionalLossSuspected && !objectiveEvidenceCount) {
      missing.push("as limitações funcionais observadas");
    }
    if (context.conditionType === "amputação" && !context.scope) {
      missing.push("a região anatômica da amputação");
    }
    if (
      context.conditionType === "limitação articular"
      && !context.movementFocus
      && !context.mobility
      && functionalCount < 2
      && !objectiveEvidenceCount
    ) {
      missing.push("o movimento principal comprometido");
    }
    if (
      context.conditionType === "lesão neurológica"
      && !context.strengthGrade
      && !context.mobility
      && !functionalCount
      && !context.functionalLossSuspected
    ) {
      missing.push("a graduação de força muscular, a mobilidade ou as limitações funcionais observadas");
    }
    return missing;
  }

  function inferPhysicalImpactGrade(context = {}) {
    if (context.impactGrade) {
      return context.impactGrade;
    }

    const markerCount = Number(context.functionalCount || 0);
    const severeObjectiveLoss = Boolean(
      context.amputationRelevant
      || ["0", "1", "2"].includes(context.strengthGrade)
      || context.mobility === "grave"
    );
    const moderateObjectiveLoss = Boolean(
      context.relevantAnatomicalLoss
      || ["3", "4"].includes(context.strengthGrade)
      || ["moderada", "grave"].includes(context.mobility || "")
      || context.functionalLossSuspected
      || (context.conditionType === "limitação articular"
        && context.segmentReady
        && (Boolean(context.movementFocus) || markerCount >= 1))
    );

    if ((markerCount >= 2 && severeObjectiveLoss) || markerCount >= 4) {
      return "grave";
    }

    if (
      (markerCount >= 1 && moderateObjectiveLoss)
      || markerCount >= 2
      || (context.conditionType === "amputação" && context.amputationRelevant)
    ) {
      return "moderado";
    }

    return "";
  }

  function populateMovementFocusOptions(segment) {
    const field = document.getElementById("physicalMovementFocus");
    if (!field) {
      return;
    }

    const options = MOVEMENT_OPTIONS[segment] || [];
    const current = field.value;
    field.innerHTML = '<option value="">Selecione</option>';
    options.forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      field.appendChild(element);
    });

    if (options.some((option) => option.value === current)) {
      field.value = current;
    }
  }

  function populateStrengthPatternOptions(family) {
    const field = document.getElementById("physicalStrengthPattern");
    if (!field) {
      return;
    }

    const options = STRENGTH_PATTERN_OPTIONS[family] || STRENGTH_PATTERN_OPTIONS.generic;
    const current = field.value;
    field.innerHTML = '<option value="">Selecione</option>';
    options.forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      field.appendChild(element);
    });

    if (options.some((option) => option.value === current)) {
      field.value = current;
    }
  }

  function renderPhysicalFunctionOptions() {
    if (!refs.physicalFunctionChecklist) {
      return;
    }

    const family = resolvePhysicalFunctionFamily();
    const options = [
      ...(PHYSICAL_FUNCTION_LIBRARY[family] || []),
      ...PHYSICAL_FUNCTION_LIBRARY.generic
    ];
    const previous = checkedValues("physicalFunctionItem");

    refs.physicalFunctionChecklist.innerHTML = "";

    options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "toggle-chip";
      label.innerHTML = `<input type="checkbox" name="physicalFunctionItem" value="${option.value}" data-label="${option.label}"><span>${capitalize(option.label)}</span>`;
      const input = label.querySelector("input");
      input.checked = previous.includes(option.value);
      refs.physicalFunctionChecklist.appendChild(label);
    });
  }

  function resolvePhysicalFunctionFamily() {
    const choice = valueOf("physicalConditionType");
    const scope = valueOf("physicalAmputationScope");
    const segment = resolvePhysicalSegment();

    if (choice === "amputação" && AMPUTATION_SCOPE_META[scope]) {
      return AMPUTATION_SCOPE_META[scope].family;
    }
    if (segment === "punho e mão") {
      return "hand";
    }
    if (["membro superior", "ombro", "cotovelo"].includes(segment)) {
      return "upper";
    }
    if (segment === "tornozelo e pé") {
      return "foot";
    }
    if (["membro inferior", "quadril", "joelho"].includes(segment)) {
      return "lower";
    }
    if (segment === "coluna") {
      return "axial";
    }
    return "generic";
  }

  function updateVisualFieldVisibility() {
    const changed = valueOf("visualFieldChanged");
    toggleField("visualFieldExtentField", changed === "sim");
  }

  function handleAudioPasteParse() {
    const text = refs.audioPaste ? refs.audioPaste.value : "";
    if (!text || !text.trim()) {
      refs.audioUploadStatus.textContent = "Cole o texto da audiometria antes de solicitar a leitura automática.";
      return;
    }

    try {
      const parsed = parseAudiometryFreeText(text);
      fillAudiometryFields(parsed);
      refs.audioUploadStatus.textContent = "Texto da audiometria interpretado com sucesso e campos preenchidos automaticamente.";
    } catch (error) {
      refs.audioUploadStatus.textContent = "Não consegui interpretar o texto colado. Revise o formato ou preencha manualmente os campos.";
    }
  }

  function updateAudiometryAverages() {
    const odValues = ["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"].map(numberOf);
    const oeValues = ["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"].map(numberOf);

    refs.audioAvgOD.value = odValues.every(Number.isFinite) ? `${formatDecimal(average(odValues))} dB` : "";
    refs.audioAvgOE.value = oeValues.every(Number.isFinite) ? `${formatDecimal(average(oeValues))} dB` : "";
  }

  async function handleAudioFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      refs.audioUploadStatus.textContent = "É possível importar arquivo estruturado em CSV, TXT, JSON ou PDF textual para preenchimento automático.";
      return;
    }

    if (/\.(png|jpg|jpeg)$/i.test(file.name)) {
      refs.audioUploadStatus.textContent = `Arquivo ${file.name} anexado. Para preenchimento automático, use CSV, TXT, JSON, PDF textual ou cole o texto da audiometria.`;
      return;
    }

    try {
      const parsed = await parseAudiometryFile(file);
      fillAudiometryFields(parsed);
      refs.audioUploadStatus.textContent = `Arquivo ${file.name} importado com sucesso para os campos de OD e OE.`;
    } catch (error) {
      refs.audioUploadStatus.textContent = /\.pdf$/i.test(file.name)
        ? `Arquivo ${file.name} anexado, mas a extração automática não conseguiu reconhecer o texto do PDF. Se for PDF escaneado, revise os campos manualmente ou utilize o texto colado.`
        : `Arquivo ${file.name} anexado, mas a importação automática não foi reconhecida. Revise e preencha manualmente os campos.`;
    }
  }

  async function parseAudiometryFile(file) {
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".pdf")) {
      const extracted = await extractTextFromPdf(file);
      try {
        return parseAudiometryDelimited(extracted);
      } catch (error) {
        return parseAudiometryFreeText(extracted);
      }
    }

    const text = await file.text();

    if (lowerName.endsWith(".json")) {
      return parseAudiometryJson(text);
    }

    try {
      return parseAudiometryDelimited(text);
    } catch (error) {
      return parseAudiometryFreeText(text);
    }
  }

  async function extractTextFromPdf(file) {
    const buffer = await file.arrayBuffer();
    const rawBytes = new Uint8Array(buffer);
    const latin1 = new TextDecoder("latin1").decode(rawBytes);
    const pieces = [];
    const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
    let match;

    while ((match = streamRegex.exec(latin1))) {
      const streamStart = match.index + match[0].indexOf(match[1]);
      const streamEnd = streamStart + match[1].length;
      let slice = rawBytes.slice(streamStart, streamEnd);
      slice = trimPdfStreamBytes(slice);

      const header = latin1.slice(Math.max(0, match.index - 240), match.index);
      let decoded = "";

      if (/FlateDecode/i.test(header)) {
        decoded = await decodePdfFlateSlice(slice);
      } else {
        decoded = new TextDecoder("latin1").decode(slice);
      }

      const textLayer = extractPdfOperatorsText(decoded);
      if (textLayer) {
        pieces.push(textLayer);
      }
    }

    if (pieces.length) {
      return pieces.join(" ");
    }

    return latin1;
  }

  function trimPdfStreamBytes(bytes) {
    let start = 0;
    let end = bytes.length;

    while (start < end && (bytes[start] === 10 || bytes[start] === 13)) {
      start += 1;
    }
    while (end > start && (bytes[end - 1] === 10 || bytes[end - 1] === 13)) {
      end -= 1;
    }

    return bytes.slice(start, end);
  }

  async function decodePdfFlateSlice(bytes) {
    const attempts = ["deflate", "deflate-raw"];
    for (const format of attempts) {
      try {
        const stream = new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format)));
        return await stream.text();
      } catch (error) {
        continue;
      }
    }
    return "";
  }

  function extractPdfOperatorsText(content) {
    const collected = [];
    const tjMatches = content.match(/\((?:\\.|[^\\()])*\)\s*Tj/g) || [];
    tjMatches.forEach((item) => {
      const textMatch = item.match(/\((.*)\)\s*Tj/);
      if (textMatch) {
        collected.push(unescapePdfString(textMatch[1]));
      }
    });

    const tjArrayMatches = content.match(/\[(.*?)\]\s*TJ/gs) || [];
    tjArrayMatches.forEach((item) => {
      const strings = item.match(/\((?:\\.|[^\\()])*\)/g) || [];
      strings.forEach((token) => {
        collected.push(unescapePdfString(token.slice(1, -1)));
      });
    });

    return collected.join(" ");
  }

  function unescapePdfString(value) {
    return value
      .replace(/\\([\\()])/g, "$1")
      .replace(/\\([0-7]{3})/g, (_, octal) => String.fromCharCode(Number.parseInt(octal, 8)))
      .replace(/\\r/g, " ")
      .replace(/\\n/g, " ")
      .replace(/\\t/g, " ");
  }

  function parseAudiometryJson(text) {
    const data = JSON.parse(text);
    const result = {};

    if (data.od && data.oe) {
      [500, 1000, 2000, 3000].forEach((frequency) => {
        result[`od${frequency}`] = parseNumberish(data.od[frequency]);
        result[`oe${frequency}`] = parseNumberish(data.oe[frequency]);
      });
    } else {
      [500, 1000, 2000, 3000].forEach((frequency) => {
        result[`od${frequency}`] = parseNumberish(data[`od${frequency}`]);
        result[`oe${frequency}`] = parseNumberish(data[`oe${frequency}`]);
      });
    }

    ensureAudiometryCompleteness(result);
    return result;
  }

  function parseAudiometryDelimited(text) {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const result = {};
    const rows = lines.map((line) => line.split(/[;,|\t]+/).map((item) => item.trim()));
    const headerRow = rows.find((row) => row.join(" ").includes("500") && row.join(" ").includes("3000"));
    const odRow = rows.find((row) => /^od$/i.test(row[0]));
    const oeRow = rows.find((row) => /^oe$/i.test(row[0]));

    if (headerRow && odRow && oeRow && headerRow.length >= 5) {
      const indexes = {
        500: headerRow.findIndex((cell) => cell.includes("500")),
        1000: headerRow.findIndex((cell) => cell.includes("1000")),
        2000: headerRow.findIndex((cell) => cell.includes("2000")),
        3000: headerRow.findIndex((cell) => cell.includes("3000"))
      };

      Object.keys(indexes).forEach((frequency) => {
        result[`od${frequency}`] = parseNumberish(odRow[indexes[frequency]]);
        result[`oe${frequency}`] = parseNumberish(oeRow[indexes[frequency]]);
      });

      ensureAudiometryCompleteness(result);
      return result;
    }

    rows.forEach((row) => {
      if (row.length < 3) {
        return;
      }

      const frequency = Number.parseInt(row[0], 10);
      if (![500, 1000, 2000, 3000].includes(frequency)) {
        return;
      }

      result[`od${frequency}`] = parseNumberish(row[1]);
      result[`oe${frequency}`] = parseNumberish(row[2]);
    });

    ensureAudiometryCompleteness(result);
    return result;
  }

  function parseAudiometryFreeText(text) {
    const normalizedTextValue = text
      .replace(/,/g, ".")
      .replace(/\u0000/g, " ")
      .replace(/\r/g, "\n")
      .trim();

    const result = {};
    const upper = normalizedTextValue.toUpperCase();

    const sections = {
      od: extractEarSection(upper, "OD", "OE"),
      oe: extractEarSection(upper, "OE", "")
    };

    [500, 1000, 2000, 3000].forEach((frequency) => {
      result[`od${frequency}`] = readFrequencyFromSection(sections.od, frequency);
      result[`oe${frequency}`] = readFrequencyFromSection(sections.oe, frequency);
    });

    if (!Object.values(result).every(Number.isFinite)) {
      const lineBased = parseFrequencyLineText(upper);
      Object.assign(result, lineBased);
    }

    ensureAudiometryCompleteness(result);
    return result;
  }

  function ensureAudiometryCompleteness(data) {
    const requiredKeys = ["od500", "od1000", "od2000", "od3000", "oe500", "oe1000", "oe2000", "oe3000"];
    const isComplete = requiredKeys.every((key) => Number.isFinite(data[key]));
    if (!isComplete) {
      throw new Error("Audiometria incompleta");
    }
  }

  function extractEarSection(text, ear, nextEar) {
    const start = text.indexOf(ear);
    if (start < 0) {
      return text;
    }

    if (!nextEar) {
      return text.slice(start);
    }

    const end = text.indexOf(nextEar, start + ear.length);
    return end > start ? text.slice(start, end) : text.slice(start);
  }

  function readFrequencyFromSection(section, frequency) {
    const regex = new RegExp(`${frequency}\\s*(?:HZ)?\\s*[:=\\-]?\\s*(\\d+(?:\\.\\d+)?)`, "i");
    const match = section.match(regex);
    return match ? parseNumberish(match[1]) : Number.NaN;
  }

  function parseFrequencyLineText(text) {
    const result = {};
    const lines = text.split(/\r?\n| \| /);

    lines.forEach((line) => {
      const frequencyMatch = line.match(/\b(500|1000|2000|3000)\b/);
      if (!frequencyMatch) {
        return;
      }

      const frequency = frequencyMatch[1];
      const values = line.match(/(\d+(?:\.\d+)?)/g);
      if (!values || values.length < 3) {
        return;
      }

      result[`od${frequency}`] = parseNumberish(values[1]);
      result[`oe${frequency}`] = parseNumberish(values[2]);
    });

    return result;
  }

  function fillAudiometryFields(data) {
    $("#audioOD500").value = data.od500;
    $("#audioOD1000").value = data.od1000;
    $("#audioOD2000").value = data.od2000;
    $("#audioOD3000").value = data.od3000;
    $("#audioOE500").value = data.oe500;
    $("#audioOE1000").value = data.oe1000;
    $("#audioOE2000").value = data.oe2000;
    $("#audioOE3000").value = data.oe3000;
    updateAudiometryAverages();
  }

  function evaluateAuditory() {
    const withoutAid = valueOf("audioWithoutAid");
    const impactGrade = valueOf("audioImpactGrade");
    const impactMarkers = checkedLabels("audioImpactMarker");
    const cid = normalizedText("audioCid");
    const odValues = ["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"].map(numberOf);
    const oeValues = ["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"].map(numberOf);
    const allValuesFilled = odValues.every(Number.isFinite) && oeValues.every(Number.isFinite);
    const facts = [];

    if (!allValuesFilled) {
      return reviewResult("Informe as frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz para OD e OE ou importe arquivo estruturado.");
    }

    if (withoutAid !== "sim") {
      return reviewResult("É necessário confirmar que o audiograma utilizado para o critério foi realizado sem uso de aparelho auditivo.");
    }

    const odAverage = average(odValues);
    const oeAverage = average(oeValues);
    const bilateralPartial = odAverage >= 41 && oeAverage >= 41;
    const unilateralTotal = odAverage > 95 || oeAverage > 95;
    const limitationsCore = impactMarkers.length
      ? joinList(impactMarkers)
      : "prejuízo para percepção e discriminação de sons e da fala, especialmente em ambientes com ruído, com interferência na comunicação em igualdade de condições";
    const documentationNote = refs.audioFile.files && refs.audioFile.files[0]
      ? ""
      : "Para sustentação documental do enquadramento, recomenda-se anexar audiometria tonal liminar sem uso de aparelho auditivo.";

    facts.push(`Média OD: ${formatDecimal(odAverage)} dB`);
    facts.push(`Média OE: ${formatDecimal(oeAverage)} dB`);
    if (impactGrade) {
      facts.push(`Impacto funcional auditivo: ${capitalize(impactGrade)}`);
    }
    if (refs.audioFile.files && refs.audioFile.files[0]) {
      facts.push(`Documento anexado: ${refs.audioFile.files[0].name}`);
    }

    if (bilateralPartial) {
      return eligibleResult({
        message: "Enquadra como PCD por perda auditiva bilateral parcial compatível com o critério técnico informado.",
        description: `Trabalhador com deficiência auditiva, comprovada por audiograma sem uso de aparelho auditivo, apresentando perda auditiva bilateral parcial, com média aritmética de ${formatDecimal(odAverage)} dB na orelha direita e ${formatDecimal(oeAverage)} dB na orelha esquerda, aferida separadamente nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz, conforme critérios técnicos vigentes. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitação sensorial auditiva que compromete a percepção e discriminação de sons e da fala, especialmente em ambientes com ruído, interferindo na comunicação e participação plena em igualdade de condições, com ${limitationsCore}.`,
        facts,
        supportNote: joinSupportNotes([
          documentationNote,
          !impactMarkers.length ? "Os campos de impacto funcional auditivo não foram detalhados; a limitação funcional foi descrita a partir do padrão sensorial esperado para o critério audiométrico objetivo." : ""
        ])
      });
    }

    if (unilateralTotal) {
      const affectedSide = odAverage > 95 ? "direita" : "esquerda";
      return eligibleResult({
        message: "Enquadra como PCD por surdez unilateral total conforme os dados objetivos informados.",
        description: `Trabalhador com deficiência auditiva, comprovada por audiograma sem uso de aparelho auditivo, apresentando surdez unilateral total à orelha ${affectedSide}, com média aritmética de ${formatDecimal(odAverage)} dB na orelha direita e ${formatDecimal(oeAverage)} dB na orelha esquerda, aferida separadamente nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz, conforme critérios técnicos vigentes. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitação sensorial auditiva com prejuízo para localização sonora, percepção e discriminação da fala, especialmente em ambientes com ruído, com ${limitationsCore}.`,
        facts,
        supportNote: joinSupportNotes([
          documentationNote,
          !impactMarkers.length ? "Os campos de impacto funcional auditivo não foram detalhados; a limitação funcional foi descrita a partir do padrão sensorial esperado para o critério audiométrico objetivo." : ""
        ])
      });
    }

    return ineligibleResult("Exame não atende aos critérios técnicos para caracterização de deficiência auditiva.", facts, documentationNote);
  }

  function evaluatePhysical() {
    const conditionType = valueOf("physicalConditionType");
    const segment = resolvePhysicalSegment();
    const scope = valueOf("physicalAmputationScope");
    const laterality = resolveEffectivePhysicalLaterality();
    const permanent = valueOf("physicalPermanent");
    const cid = normalizedText("physicalCid");
    const clinicalBasis = normalizedText("physicalClinicalBasis");
    const supportDocs = valueOf("physicalSupportDocs");
    const movementFocus = valueOf("physicalMovementFocus");
    const strengthPattern = valueOf("physicalStrengthPattern");
    const anatomicalLoss = valueOf("physicalAnatomicalLoss");
    const amputationLevel = valueOf("physicalAmputationLevel");
    const strengthGrade = valueOf("physicalStrengthGrade");
    const mobility = valueOf("physicalMobility");
    const rawImpactGrade = valueOf("physicalImpactGrade");
    const functionalMarkers = checkedLabels("physicalFunctionItem");
    const functionalLossSuspected = checked("physicalFunctionalLossSuspected");
    const relevantAnatomicalLoss = ["parcial", "relevante"].includes(anatomicalLoss);
    const significantStrengthLoss = ["0", "1", "2", "3"].includes(strengthGrade);
    const borderlineStrengthLoss = strengthGrade === "4";
    const relevantMobilityLoss = ["moderada", "grave"].includes(mobility);
    const associatedNeurologicalEvidence = relevantMobilityLoss || relevantAnatomicalLoss || functionalLossSuspected;
    const strengthCriterion = significantStrengthLoss || (borderlineStrengthLoss && associatedNeurologicalEvidence);
    const amputationDetail = collectAmputationDetail();
    const amputationRelevant = evaluateAmputationRelevance(scope, amputationDetail, amputationLevel);
    const segmentReady = conditionType === "amputação" ? Boolean(scope) : Boolean(segment);
    const objectiveEvidenceCount = [
      amputationRelevant,
      relevantAnatomicalLoss,
      strengthCriterion,
      relevantMobilityLoss,
      Boolean(movementFocus),
      functionalLossSuspected
    ].filter(Boolean).length;
    const impactGrade = inferPhysicalImpactGrade({
      impactGrade: rawImpactGrade,
      conditionType,
      segmentReady,
      functionalCount: functionalMarkers.length,
      relevantAnatomicalLoss,
      strengthGrade,
      mobility,
      movementFocus,
      functionalLossSuspected,
      amputationRelevant
    });
    const impactWasInferred = !rawImpactGrade && Boolean(impactGrade);
    const moderateOrSevereImpact = ["moderado", "grave"].includes(impactGrade);
    const articularCriterion = Boolean(segment) && (
      Boolean(movementFocus)
      || relevantMobilityLoss
      || functionalMarkers.length >= 2
      || objectiveEvidenceCount >= 2
    );
    const neuroCriterion = strengthCriterion
      || relevantMobilityLoss
      || functionalMarkers.length >= 2
      || objectiveEvidenceCount >= 2;
    const generalFunctionalCriterion = relevantMobilityLoss
      || relevantAnatomicalLoss
      || functionalLossSuspected
      || functionalMarkers.length >= 2
      || objectiveEvidenceCount >= 2;
    if (impactWasInferred) {
      const impactField = document.getElementById("physicalImpactGrade");
      if (impactField && !impactField.value) {
        impactField.value = impactGrade;
      }
    }

    const missingItems = buildPhysicalMissingItems({
      conditionType,
      segmentReady,
      laterality,
      requiresLaterality: false,
      impactGrade: rawImpactGrade,
      inferredImpactGrade: impactGrade,
      functionalCount: functionalMarkers.length,
      functionalLossSuspected,
      objectiveEvidenceCount,
      scope,
      movementFocus,
      strengthGrade,
      mobility
    });

    const facts = [
      `Condição principal: ${capitalize(conditionType)}`,
      `Segmento funcional: ${conditionType === "amputação" ? composeAmputationFinding(scope, laterality, amputationDetail, amputationLevel) : composeSegment(segment, laterality)}`,
      `Lateralidade: ${laterality ? capitalize(laterality) : "Não especificada"}`,
      `Condição permanente: ${translateYesNo(permanent)}`,
      `Impacto funcional: ${capitalize(impactGrade || "não informado")}${impactWasInferred ? " (inferido pelos achados objetivos)" : ""}`,
      `Perda anatômica: ${capitalize(anatomicalLoss || (conditionType === "amputação" ? "relevante" : "não informada"))}`,
      `Topografia da perda de força: ${strengthPattern ? labelForSelectValue("physicalStrengthPattern") : "Não informada"}`,
      `Força muscular: ${strengthGrade || "Não informada"}`,
      `Mobilidade: ${capitalize(mobility || "não informada")}`
    ];

    if (missingItems.length) {
      return reviewResult(`Para concluir o enquadramento físico, informe ${joinList(missingItems)}.`, facts, buildPhysicalDocumentationNote({
        conditionType,
        scope,
        supportDocs,
        segment,
        movementFocus,
        strengthGrade,
        mobility,
        requiresLaterality: false
      }));
    }

    if (permanent !== "sim") {
      return reviewResult("Há repercussão funcional, porém é necessária confirmação do caráter permanente da alteração.", facts);
    }

    const scenarioEligible = {
      amputação: amputationRelevant && moderateOrSevereImpact,
      "limitação articular": articularCriterion && moderateOrSevereImpact,
      "lesão neurológica": neuroCriterion && moderateOrSevereImpact,
      deformidade: generalFunctionalCriterion && moderateOrSevereImpact,
      "sequela traumática": (generalFunctionalCriterion || strengthCriterion) && moderateOrSevereImpact,
      "outras alterações físicas permanentes": (generalFunctionalCriterion || strengthCriterion) && moderateOrSevereImpact
    };

    const docNote = buildPhysicalDocumentationNote({
      conditionType,
      scope,
      supportDocs,
      segment,
      movementFocus,
      strengthGrade,
      mobility,
      requiresLaterality: false
    });

    if (scenarioEligible[conditionType]) {
      const findings = [];
      if (conditionType !== "amputação" && relevantAnatomicalLoss) {
        findings.push(anatomicalLoss === "relevante" ? "perda anatômica relevante" : "perda anatômica parcial relevante");
      }
      if (strengthCriterion && strengthGrade && strengthGrade !== "5" && strengthGrade !== "na") {
        findings.push(`redução de força muscular grau ${strengthGrade}${strengthPattern ? ` em ${labelForSelectValue("physicalStrengthPattern").toLowerCase()}` : ""}`);
      }
      if (relevantMobilityLoss) {
        findings.push(`limitação ${mobility} de mobilidade`);
      }
      if (functionalLossSuspected) {
        findings.push("perda funcional consistente do segmento acometido");
      }
      if (movementFocus) {
        findings.push(labelForSelectValue("physicalMovementFocus"));
      }

      const segmentText = conditionType === "amputação"
        ? composeAmputationFinding(scope, laterality, amputationDetail, amputationLevel)
        : composeSegment(segment, laterality);
      const basisText = clinicalBasis ? `, com base clínica ${lowercaseFirst(clinicalBasis)}` : "";
      const findingsText = findings.length ? `, apresentando ${joinList(findings)}` : "";
      const description = `Trabalhador com deficiência física decorrente de ${lowercaseFirst(conditionType)} em ${segmentText}, de caráter permanente${findingsText}${basisText}. CID: ${formatCid(cid)}.`;
      let limitations = `Apresenta limitação funcional ${functionalDegreeText(impactGrade)}, com ${joinList(functionalMarkers)}.`;

      return eligibleResult({
        message: "Enquadra como PCD pela combinação entre permanência da condição, evidência anatômico-funcional objetiva e impacto funcional moderado ou grave.",
        description,
        limitations,
        facts,
        supportNote: docNote
      });
    }

    if (conditionType === "lesão neurológica" && borderlineStrengthLoss && !associatedNeurologicalEvidence) {
      return reviewResult("Força muscular grau 4 isolada exige alterações associadas para sustentar enquadramento físico, conforme a cartilha técnica do MPT.", facts, docNote);
    }

    if (impactGrade === "leve" || (!scenarioEligible[conditionType] && !relevantAnatomicalLoss && !strengthCriterion && !relevantMobilityLoss && !amputationRelevant && !functionalLossSuspected)) {
      return ineligibleResult("Alteração não caracteriza deficiência conforme critérios funcionais.", facts, docNote);
    }

    return reviewResult("Dados funcionais ainda insuficientes para conclusão segura. Revise a coerência entre perda estrutural, mobilidade, força, permanência e impacto funcional.", facts, docNote);
  }

  function evaluateClinical() {
    const condition = normalizedText("clinicalCondition");
    const cid = normalizedText("clinicalCid");
    const medicalReport = valueOf("clinicalMedicalReport");
    const multidisciplinary = valueOf("clinicalMultidisciplinary");
    const persistent = valueOf("clinicalPersistent");
    const limitationGrade = valueOf("clinicalLimitationGrade");
    const dailyImpact = valueOf("clinicalDailyImpact");
    const markers = checkedLabels("clinicalMarker");
    const facts = [];

    if (condition) {
      facts.push(`Condição informada: ${condition}`);
    }
    if (medicalReport) {
      facts.push(`Laudo médico: ${translateYesNo(medicalReport)}`);
    }
    if (multidisciplinary) {
      facts.push(`Avaliação multidisciplinar: ${translateYesNo(multidisciplinary)}`);
    }

    if (!condition || !limitationGrade || !dailyImpact || !markers.length) {
      return reviewResult("Condição identificada. Necessária avaliação funcional.", facts, buildClinicalDocumentationNote(condition, medicalReport, multidisciplinary));
    }

    if (limitationGrade === "leve" || dailyImpact === "nao") {
      return ineligibleResult("Condição identificada, porém sem impacto funcional suficiente para enquadramento como PCD.", facts, buildClinicalDocumentationNote(condition, medicalReport, multidisciplinary));
    }

    if (persistent === "sim" && dailyImpact === "sim" && ["moderado", "grave"].includes(limitationGrade) && (medicalReport === "sim" || multidisciplinary === "sim")) {
      return eligibleResult({
        message: "Enquadra como PCD por condição clínica persistente associada a impacto funcional significativo.",
        description: `Trabalhador com condição clínica persistente compatível com ${lowercaseFirst(condition)}, associada a comprometimento funcional ${limitationGrade} documentado em análise clínica e funcional, sem utilização isolada do CID como critério de enquadramento. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitações funcionais caracterizadas por ${joinList(markers)}.`,
        facts,
        supportNote: buildClinicalDocumentationNote(condition, medicalReport, multidisciplinary)
      });
    }

    return reviewResult("Condição identificada. Necessária avaliação funcional.", facts, buildClinicalDocumentationNote(condition, medicalReport, multidisciplinary));
  }

  function evaluateVisual() {
    const condition = valueOf("visualPrimaryFinding");
    const laterality = valueOf("visualLaterality");
    const permanent = valueOf("visualPermanent");
    const supportDocs = valueOf("visualSupportDocs");
    const impactGrade = valueOf("visualImpactGrade");
    const cid = normalizedText("visualCid");
    const acuityOD = valueOf("visualAcuityOD");
    const acuityOE = valueOf("visualAcuityOE");
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");
    const limitations = checkedLabels("visualMarker");
    const facts = [];

    if (condition) {
      facts.push(`Achado visual principal: ${labelForSelectValue("visualPrimaryFinding")}`);
    }
    if (laterality) {
      facts.push(`Lateralidade: ${capitalize(laterality)}`);
    }
    if (impactGrade) {
      facts.push(`Impacto funcional visual: ${capitalize(impactGrade)}`);
    }

    if (!condition || !permanent || !acuityOD || !acuityOE) {
      return reviewResult("Necessita avaliação complementar com base funcional e achados objetivos.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    if (condition === "visao_monocular" && !laterality) {
      return reviewResult("Na visão monocular, informe o lado acometido para manter a descrição técnica objetiva.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    if (permanent === "nao") {
      return ineligibleResult("Alteração visual sem caráter permanente não caracteriza deficiência conforme critérios funcionais.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    const objectiveEligible = isVisualObjectiveEligible(condition, acuityOD, acuityOE, fieldChanged, fieldExtent);
    const objectiveText = composeVisualObjectiveText(acuityOD, acuityOE, fieldChanged, fieldExtent);
    const visualLimitationsText = limitations.length
      ? joinList(limitations)
      : defaultVisualLimitations(condition);

    if (!objectiveEligible) {
      return ineligibleResult(
        "Dados objetivos não caracterizam deficiência visual conforme critérios técnicos.",
        facts,
        fieldChanged === "sim" && !fieldExtent ? buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent) : ""
      );
    }

    if (supportDocs === "sim") {
      return eligibleResult({
        message: "Enquadra como PCD por alteração visual permanente com base objetiva e impacto funcional relevante.",
        description: `Trabalhador com deficiência visual de caráter permanente, com acometimento ${laterality || "não especificado"}, fundamentado em ${objectiveText}. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitações funcionais visuais caracterizadas por ${visualLimitationsText}.`,
        facts,
        supportNote: joinSupportNotes([
          buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent),
          !limitations.length ? "As limitações funcionais foram descritas a partir do padrão esperado para o quadro visual objetivo informado." : ""
        ])
      });
    }

    return reviewResult("Necessita avaliação complementar com documentação objetiva suficiente para sustentar o enquadramento.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
  }

  function evaluateIntellectual() {
    const condition = normalizedText("intellectualFunctionalProfile");
    const permanent = valueOf("intellectualPermanent");
    const developmental = valueOf("intellectualDevelopmental");
    const supportDocs = valueOf("intellectualSupportDocs");
    const impactGrade = valueOf("intellectualImpactGrade");
    const supportNeed = valueOf("intellectualSupportNeed");
    const cid = normalizedText("intellectualCid");
    const limitations = checkedLabels("intellectualMarker");
    const facts = [];

    if (condition) {
      facts.push(`Base informada: ${condition}`);
    }
    if (developmental) {
      facts.push(`Período do desenvolvimento: ${capitalize(developmental)}`);
    }

    if (!condition || !limitations.length || !impactGrade || !permanent || !supportNeed) {
      return reviewResult("Necessita avaliação complementar das habilidades adaptativas e documentação funcional.", facts, buildIntellectualDocumentationNote(supportDocs));
    }

    if (["ausente", "leve"].includes(impactGrade)) {
      return ineligibleResult("Dados informados não demonstram limitação adaptativa suficiente para enquadramento.", facts, buildIntellectualDocumentationNote(supportDocs));
    }

    if (permanent === "sim" && developmental === "sim" && supportDocs === "sim" && ["moderado", "grave"].includes(impactGrade) && ["frequente", "contínuo"].includes(supportNeed)) {
      return eligibleResult({
        message: "Enquadra como PCD por comprometimento adaptativo permanente com repercussão funcional relevante.",
        description: `Trabalhador com deficiência intelectual, de caráter permanente, com comprometimento do funcionamento intelectual e das habilidades adaptativas compatível com ${lowercaseFirst(condition)}, demandando suporte ${supportNeed}. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitações funcionais caracterizadas por ${joinList(limitations)}.`,
        facts,
        supportNote: buildIntellectualDocumentationNote(supportDocs)
      });
    }

    return reviewResult("Necessita avaliação complementar das habilidades adaptativas e documentação funcional.", facts, buildIntellectualDocumentationNote(supportDocs));
  }

  function evaluatePsychosocial() {
    const condition = normalizedText("psychosocialCondition");
    const persistent = valueOf("psychosocialPersistent");
    const followUp = valueOf("psychosocialFollowUp");
    const supportDocs = valueOf("psychosocialSupportDocs");
    const participation = valueOf("psychosocialParticipation");
    const impactGrade = valueOf("psychosocialImpactGrade");
    const cid = normalizedText("psychosocialCid");
    const limitations = checkedLabels("psychosocialMarker");
    const facts = [];

    if (condition) {
      facts.push(`Base informada: ${condition}`);
    }
    if (followUp) {
      facts.push(`Acompanhamento terapêutico/documental: ${translateYesNo(followUp)}`);
    }

    if (!condition || !limitations.length || !impactGrade || !persistent || !participation) {
      return reviewResult("Necessita avaliação complementar da persistência do quadro e do impacto psicossocial.", facts, buildPsychosocialDocumentationNote(supportDocs, followUp));
    }

    if (["ausente", "leve"].includes(impactGrade) || participation === "nao") {
      return ineligibleResult("Dados informados não demonstram restrição psicossocial suficiente para enquadramento.", facts, buildPsychosocialDocumentationNote(supportDocs, followUp));
    }

    if (persistent === "sim" && supportDocs === "sim" && participation === "sim" && ["moderado", "grave"].includes(impactGrade)) {
      return eligibleResult({
        message: "Enquadra como PCD por restrição psicossocial persistente e impacto funcional relevante.",
        description: `Trabalhador com deficiência mental/psicossocial de caráter persistente, associada a restrição relevante de participação social e laboral em igualdade de condições, com base funcional descrita em ${ensureSentence(lowercaseFirst(condition))} CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitações funcionais e de participação caracterizadas por ${joinList(limitations)}.`,
        facts,
        supportNote: buildPsychosocialDocumentationNote(supportDocs, followUp)
      });
    }

    return reviewResult("Necessita avaliação complementar da persistência do quadro e do impacto psicossocial.", facts, buildPsychosocialDocumentationNote(supportDocs, followUp));
  }

  function eligibleResult(payload) {
    const description = buildOfficialDescriptionText(payload) || toPresentationText(payload && payload.description ? payload.description : "");
    const limitations = buildOfficialLimitationsText({
      ...(payload || {}),
      description
    }) || ensurePrintSentence(payload && payload.limitations ? payload.limitations : "");
    const facts = Array.isArray(payload && payload.facts)
      ? payload.facts.map((fact) => toPresentationText(fact)).filter(Boolean)
      : [];
    const supportNote = toPresentationText(payload && payload.supportNote ? payload.supportNote : "", true);
    const enrichedPayload = {
      ...(payload || {}),
      description,
      limitations,
      facts,
      supportNote
    };

    return {
      status: "eligible",
      title: "Enquadra como PCD",
      message: toPresentationText(payload && payload.message ? payload.message : ""),
      description,
      limitations,
      report: payload && payload.report ? toPresentationText(payload.report, true) : buildCharacterizationReport(enrichedPayload),
      facts,
      supportNote
    };
  }

  function reviewResult(message, facts = [], supportNote = "") {
    return {
      status: "review",
      title: "Necessita avaliação complementar",
      message: toPresentationText(message),
      facts: Array.isArray(facts) ? facts.map((fact) => toPresentationText(fact)).filter(Boolean) : [],
      supportNote: toPresentationText(supportNote, true)
    };
  }

  function ineligibleResult(message, facts = [], supportNote = "") {
    return {
      status: "ineligible",
      title: "Não caracterizado como PCD conforme critérios técnicos",
      message: toPresentationText(message) || "Não caracterizado como PCD conforme critérios técnicos.",
      facts: Array.isArray(facts) ? facts.map((fact) => toPresentationText(fact)).filter(Boolean) : [],
      supportNote: toPresentationText(supportNote, true)
    };
  }

  function valueOf(id) {
    const field = document.getElementById(id);
    return field ? String(field.value || "").trim().toLowerCase() : "";
  }

  function valueOfRaw(id) {
    const field = document.getElementById(id);
    return field ? String(field.value || "").trim() : "";
  }

  function normalizedText(id) {
    const field = document.getElementById(id);
    return field ? normalizeSpacing(field.value || "") : "";
  }

  function checked(id) {
    const field = document.getElementById(id);
    return Boolean(field && field.checked);
  }

  function checkedValues(name) {
    return $$(`input[name="${name}"]:checked`).map((field) => field.value);
  }

  function checkedLabels(name) {
    return $$(`input[name="${name}"]:checked`).map((field) => field.dataset.label || field.value);
  }

  function labelForSelectValue(id) {
    const field = document.getElementById(id);
    if (!field || field.selectedIndex < 0) {
      return "";
    }
    return normalizeSpacing(field.options[field.selectedIndex].textContent || "");
  }

  function numberOf(id) {
    const field = document.getElementById(id);
    return parseNumberish(field ? field.value : "");
  }

  function parseNumberish(value) {
    if (value === null || value === undefined || value === "") {
      return Number.NaN;
    }

    const normalized = String(value).replace(",", ".").trim();
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  function average(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function normalizeSpacing(text) {
    return String(text).replace(/\s+/g, " ").trim();
  }

  function formatDecimal(value) {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }

  const CID_DESCRIPTION_MAP = Object.freeze({
    "S68.0": "Amputação traumática do polegar",
    "H54.0": "Cegueira em ambos os olhos",
    "M54.5": "Dor lombar baixa"
  });

  function normalizeCidCode(cid) {
    const raw = String(cid || "")
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

  function formatCid(cid) {
    const normalized = normalizeCidCode(cid);
    if (!normalized) {
      return "não informado";
    }
    const description = CID_DESCRIPTION_MAP[normalized];
    return description ? `${normalized} - ${description}` : normalized;
  }

  function formatDateForReport(value) {
    if (!value) {
      return "Não informada";
    }
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  function formatDateTimeForReport(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "data/hora não informadas";
    }
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  }

  function ensureSentence(text) {
    const trimmed = normalizeSpacing(text);
    if (!trimmed) {
      return "";
    }

    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  }

  function capitalize(text) {
    const normalized = normalizeSpacing(text);
    if (!normalized) {
      return "";
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  function lowercaseFirst(text) {
    const normalized = normalizeSpacing(text);
    if (!normalized) {
      return "";
    }

    return normalized.charAt(0).toLowerCase() + normalized.slice(1);
  }

  function translateYesNo(value) {
    if (value === "sim") {
      return "Sim";
    }
    if (value === "nao") {
      return "Não";
    }
    return "Não informado";
  }

  function composeSegment(segment, laterality) {
    if (!segment) {
      return "segmento não especificado";
    }

    if (laterality === "bilateral") {
      return `${segment} bilateral`;
    }

    if (laterality === "axial") {
      return segment;
    }

    if (laterality === "direito") {
      return `${segment} direito`;
    }

    if (laterality === "esquerdo") {
      return `${segment} esquerdo`;
    }

    return segment;
  }

  function collectAmputationDetail() {
    return {
      hand: [
        collectDigit("handThumb", "handThumbLevel", "1º quirodáctilo"),
        collectDigit("handIndex", "handIndexLevel", "2º quirodáctilo"),
        collectDigit("handMiddle", "handMiddleLevel", "3º quirodáctilo"),
        collectDigit("handRing", "handRingLevel", "4º quirodáctilo"),
        collectDigit("handLittle", "handLittleLevel", "5º quirodáctilo")
      ].filter(Boolean),
      foot: [
        collectDigit("footHallux", "footHalluxLevel", "1º pododáctilo"),
        collectDigit("footSecond", "footSecondLevel", "2º pododáctilo"),
        collectDigit("footThird", "footThirdLevel", "3º pododáctilo"),
        collectDigit("footFourth", "footFourthLevel", "4º pododáctilo"),
        collectDigit("footFifth", "footFifthLevel", "5º pododáctilo")
      ].filter(Boolean)
    };
  }

  function collectDigit(checkboxId, levelId, label) {
    if (!checked(checkboxId)) {
      return null;
    }
    return {
      label,
      level: normalizedText(levelId)
    };
  }

  function evaluateAmputationRelevance(scope, detail, generalLevel) {
    if (!scope) {
      return false;
    }
    if (["mao_punho", "antebraco", "braco", "pe_tornozelo", "perna", "coxa"].includes(scope)) {
      return true;
    }

    const selected = scope === "dedos_mao" ? detail.hand : detail.foot;
    if (!selected.length) {
      return false;
    }

    const proximal = selected.some((item) => ["falange proximal", "desarticulação metacarpofalângica", "desarticulação metatarsofalângica"].includes(item.level));
    if (scope === "dedos_mao") {
      const thumbAffected = selected.some((item) => item.label === "1º quirodáctilo");
      return thumbAffected || selected.length >= 2 || proximal || generalLevel === "parcial";
    }

    const halluxAffected = selected.some((item) => item.label === "1º pododáctilo");
    return halluxAffected || selected.length >= 2 || proximal || generalLevel === "parcial";
  }

  function composeAmputationFinding(scope, laterality, detail, generalLevel) {
    const scopeMeta = AMPUTATION_SCOPE_META[scope];
    if (!scopeMeta) {
      return composeSegment("segmento não especificado", laterality);
    }

    const sideText = laterality === "bilateral" ? " bilateral" : laterality === "direito" ? " direito" : laterality === "esquerdo" ? " esquerdo" : "";

    if (scope === "dedos_mao") {
      const items = detail.hand.map((item) => item.level ? `${item.label} em ${item.level}` : item.label);
      return `quirodáctilos${sideText}${items.length ? `, incluindo ${joinList(items)}` : ""}`;
    }

    if (scope === "dedos_pe") {
      const items = detail.foot.map((item) => item.level ? `${item.label} em ${item.level}` : item.label);
      return `pododáctilos${sideText}${items.length ? `, incluindo ${joinList(items)}` : ""}`;
    }

    const levelText = generalLevel ? ` em nível ${labelForSelectValue("physicalAmputationLevel").toLowerCase()}` : "";
    return `${scopeMeta.label}${sideText}${levelText}`;
  }

  function buildPhysicalDocumentationNote(data) {
    const notes = [];
    if (data.supportDocs === "nao") {
      if (data.conditionType === "amputação") {
        notes.push("Recomenda-se laudo ortopédico, cirúrgico ou documento funcional que descreva o nível da amputação e o caráter permanente.");
      } else if (data.conditionType === "lesão neurológica") {
        notes.push("Recomenda-se laudo de neurologia ou fisiatria com descrição da perda funcional, força e permanência.");
      } else {
        notes.push("Recomenda-se laudo ortopédico ou fisiátrico com descrição objetiva da limitação funcional e do caráter permanente.");
      }
    }
    if (data.conditionType === "limitação articular" && !data.movementFocus) {
      notes.push("Especifique o movimento ou função predominante afetada para reforçar a consistência descritiva do caso.");
    }
    if (data.conditionType === "lesão neurológica" && data.strengthGrade === "4" && !["moderada", "grave"].includes(data.mobility || "")) {
      notes.push("Para força grau 4, descreva alterações associadas de mobilidade, trofismo ou perda funcional para sustentar o enquadramento.");
    }
    return joinSupportNotes(notes);
  }

  function buildClinicalDocumentationNote(condition, medicalReport, multidisciplinary) {
    if (!condition) {
      return "";
    }

    const notes = [];
    if (medicalReport !== "sim") {
      notes.push("Necessita laudo médico assistente atualizado descrevendo persistência do quadro e repercussão funcional.");
    }
    if (multidisciplinary !== "sim") {
      notes.push(`Necessária avaliação multidisciplinar para enquadramento da condição de saúde. ${buildClinicalMultidisciplinaryExamples(condition)}`);
    }
    return joinSupportNotes(notes);
  }

  function buildClinicalMultidisciplinaryExamples(condition) {
    if (condition.includes("fibromialgia") || condition.includes("reumatológica")) {
      return "Exemplos úteis: fisioterapia, terapia ocupacional, psicologia e especialidade médica assistente, preferencialmente reumatologia ou fisiatria.";
    }
    if (condition.includes("dor crônica")) {
      return "Exemplos úteis: fisioterapia, terapia ocupacional, psicologia da dor e especialidade médica assistente, como ortopedia, fisiatria ou clínica da dor.";
    }
    if (condition.includes("síndrome dolorosa")) {
      return "Exemplos úteis: fisioterapia, psicologia, terapia ocupacional e avaliação médica assistente em clínica da dor, fisiatria ou ortopedia.";
    }
    return "Exemplos úteis: fisioterapia, terapia ocupacional, psicologia e especialidade médica assistente conforme a base clínica do caso.";
  }

  function buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent) {
    const notes = [];
    if (supportDocs === "nao") {
      notes.push("Necessita laudo oftalmológico com acuidade visual corrigida e, quando aplicável, campimetria.");
    }
    if (fieldChanged === "sim" && !fieldExtent) {
      notes.push("Quando houver campimetria alterada, informe se o somatório binocular é igual ou menor que 60° ou se o dado ainda é inconclusivo.");
    }
    return joinSupportNotes(notes);
  }

  function buildIntellectualDocumentationNote(supportDocs) {
    return supportDocs === "nao"
      ? "Necessita documentação psicológica, neuropsicológica ou equivalente, associada a evidência funcional de limitação adaptativa."
      : "";
  }

  function buildPsychosocialDocumentationNote(supportDocs, followUp) {
    const notes = [];
    if (supportDocs === "nao") {
      notes.push("Necessita laudo psiquiátrico, psicológico ou documento equivalente com repercussão funcional descrita.");
    }
    if (followUp === "nao") {
      notes.push("A ausência de acompanhamento terapêutico fragiliza a sustentação funcional do enquadramento.");
    }
    return joinSupportNotes(notes);
  }

  function isVisualObjectiveEligible(condition, acuityOD, acuityOE, fieldChanged, fieldExtent) {
    const od = VISUAL_ACUITY_SEVERITY[acuityOD] ?? -1;
    const oe = VISUAL_ACUITY_SEVERITY[acuityOE] ?? -1;
    const betterEye = Math.min(od, oe);
    const worseEye = Math.max(od, oe);

    if (condition === "cegueira_bilateral") {
      return betterEye >= 4;
    }
    if (condition === "baixa_visao_bilateral") {
      return betterEye >= 1;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60";
    }
    if (condition === "visao_monocular") {
      return worseEye >= 4;
    }
    return betterEye >= 1 || (fieldChanged === "sim" && fieldExtent === "ate_60");
  }

  function composeVisualObjectiveText(acuityOD, acuityOE, fieldChanged, fieldExtent) {
    const pieces = [
      `acuidade visual de ${labelForSelectValue("visualAcuityOD")} em OD`,
      `${labelForSelectValue("visualAcuityOE")} em OE`
    ];
    if (fieldChanged === "sim") {
      pieces.push(fieldExtent === "ate_60"
        ? "somatório da medida do campo visual binocular igual ou menor que 60°"
        : "campimetria com restrição importante de campo visual");
    }
    return joinList(pieces);
  }

  function defaultVisualLimitations(condition) {
    if (condition === "cegueira_bilateral") {
      return "prejuízo acentuado para orientação visual, leitura e deslocamento com segurança";
    }
    if (condition === "baixa_visao_bilateral") {
      return "dificuldade para leitura contínua, reconhecimento de detalhes e uso de materiais visuais";
    }
    if (condition === "campo_visual_reduzido") {
      return "redução de percepção periférica, obstáculos e segurança no deslocamento";
    }
    if (condition === "visao_monocular") {
      return "prejuízo para percepção de profundidade, campo visual lateral e segurança em determinadas tarefas";
    }
    return "limitação visual relevante para leitura, orientação e execução de tarefas com demanda visual";
  }

  function buildCharacterizationReport(payload) {
    const reportSections = [
      "Após análise técnico-funcional dos dados clínicos estruturados e dos critérios aplicáveis ao caso, conclui-se pelo enquadramento como pessoa com deficiência para fins de caracterização ocupacional.",
      `Descrição da deficiência e CID: ${payload.description || ""}`,
      `Limitações funcionais: ${payload.limitations || ""}`,
      `Conclusão técnico-funcional: ${payload.message || ""}`
    ];

    if (payload.supportNote) {
      reportSections.push(`Observações técnicas e documentação complementar: ${payload.supportNote}`);
    }

    return reportSections.join("\n\n");
  }

  function buildCharacterizationReport(payload) {
    const attachments = collectExternalReportFiles();
    const reportSections = [
      "ApÃ³s anÃ¡lise tÃ©cnico-funcional dos dados clÃ­nicos estruturados e dos critÃ©rios aplicÃ¡veis ao caso, conclui-se pelo enquadramento como pessoa com deficiÃªncia para fins de caracterizaÃ§Ã£o ocupacional.",
      `DescriÃ§Ã£o da deficiÃªncia e CID: ${payload.description || ""}`,
      `LimitaÃ§Ãµes funcionais: ${payload.limitations || ""}`,
      `ConclusÃ£o tÃ©cnico-funcional: ${payload.message || ""}`
    ];

    if (payload.supportNote) {
      reportSections.push(`ObservaÃ§Ãµes tÃ©cnicas e documentaÃ§Ã£o complementar: ${payload.supportNote}`);
    }

    if (attachments.length) {
      reportSections.push(`Documentos externos vinculados ao caso: ${attachments.map((file) => file.name).join(", ")}.`);
    }

    return reportSections.join("\n\n");
  }

  function buildTechnicalBasisText(moduleKey, result) {
    const base = {
      auditiva: "Critério técnico fundamentado em dados audiométricos objetivos, com média aritmética nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz, sem uso de aparelho auditivo, observada a lógica normativa aplicável à caracterização da deficiência auditiva.",
      visual: "Critério técnico fundamentado em achados visuais objetivos, com análise prioritária de acuidade visual corrigida, campo visual e condição sensorial visual reconhecida, nos termos da lógica normativa aplicável à caracterização da deficiência visual.",
      fisica: "Critério técnico fundamentado na permanência da alteração, presença de perda anatômica ou limitação relevante, comprometimento funcional do segmento corporal afetado e impacto ocupacional compatível com deficiência física.",
      clinicas: "Critério técnico fundamentado em condição clínica persistente associada a limitação funcional relevante, sem uso isolado do CID, com necessidade de coerência clínico-funcional e, quando indicado, suporte multiprofissional.",
      intelectual: "Critério técnico fundamentado em comprometimento permanente do funcionamento intelectual e das habilidades adaptativas, com repercussão prática nas atividades de vida diária e laborais.",
      psicossocial: "Critério técnico fundamentado em quadro mental ou psicossocial persistente, com restrição relevante de participação social e laboral em igualdade de condições."
    }[moduleKey] || "Critério técnico fundamentado em análise clínico-funcional estruturada.";

    const complement = result && result.message ? `Conclusão aplicada ao caso: ${result.message}` : "";
    return joinSupportNotes([base, complement]);
  }

  const OFFICIAL_LAUDO_TEMPLATE = {
    imagePath: "official_page1.png",
    pdfWidth: 612,
    pdfHeight: 792,
    nameField: { x: 114, y: 84, width: 385, paddingY: 17, font: "700 15px Arial" },
    cpfField: { x: 560, y: 84, width: 165, paddingY: 17, font: "700 15px Arial" },
    cidField: { x: 92, y: 120, width: 112, paddingY: 15, font: "700 13px Arial" },
    descriptionRect: { x: 63, y: 205, width: 688, height: 56, fontSizes: [11.4, 11, 10.6, 10.2] },
    limitationsRect: { x: 63, y: 304, width: 688, height: 70, fontSizes: [11.4, 11, 10.6, 10.2] },
    signatureField: { x: 340, y: 951, width: 205, paddingY: 13, font: "9.6px Arial" },
    dateField: { x: 655, y: 949, width: 80, paddingY: 14, font: "11.2px Arial" },
    originMarks: {
      congenita: [71, 147],
      acidente_trabalho: [160, 147],
      acidente_comum: [325, 147],
      doenca_comum: [424, 147],
      pos_operatorio: [528, 147]
    },
    moduleMarks: {
      fisica: [69, 399],
      auditiva: [69, 666],
      visual: [69, 739],
      monocular: [426, 399],
      intelectual: [426, 489],
      psicossocial: [426, 672]
    },
    physical: {
      amputationMark: [187, 539],
      otherMark: [69, 596],
      otherTextRect: { x: 176, y: 589, width: 180, height: 18, fontSizes: [11.5, 10.5, 9.5] }
    },
    visual: {
      blindnessMark: [78, 756],
      lowVisionMark: [78, 784],
      fieldMark: [78, 812]
    },
    intellectualMarks: {
      comunicacao: [426, 529],
      autonomia: [426, 546],
      rotina: [426, 563],
      julgamento: [426, 597],
      aprendizagem: [426, 614],
      instrucoes: [426, 648]
    }
  };

  async function buildLaudoPdfBlob(payload) {
    const canvas = await buildOfficialLaudoCanvas(payload);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    return createPdfBlobFromJpegDataUrl(
      dataUrl,
      canvas.width,
      canvas.height,
      OFFICIAL_LAUDO_TEMPLATE.pdfWidth,
      OFFICIAL_LAUDO_TEMPLATE.pdfHeight
    );
  }

  async function buildOfficialLaudoCanvas(payload) {
    const image = await loadImage(OFFICIAL_LAUDO_TEMPLATE.imagePath);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    applyTemplateOverlay(ctx, canvas.width, canvas.height, payload);

    return canvas;
  }

  async function buildOfficialLaudoImageDataUrl(payload) {
    const canvas = await buildOfficialLaudoCanvas(payload);
    return canvas.toDataURL("image/png");
  }

  function applyTemplateOverlay(ctx, width, height, payload) {
    const template = OFFICIAL_LAUDO_TEMPLATE;
    const color = "#111111";
    const workerName = payload.identity.workerName || "";
    const cpf = payload.identity.workerCpf || "";
    const cid = resolveCurrentCid() || "não informado";
    const origin = payload.identity.origin || inferOriginFromCurrentCase();
    const description = buildOfficialDescriptionText(payload);
    const limitations = buildOfficialLimitationsText(payload);
    const professional = payload.identity.examiner || "";
    const registry = payload.identity.examinerRegistry || "";
    const signatureLine = joinSupportNotes([professional, registry]);
    const date = formatDateForReport(payload.identity.reportDate);

    drawBoxText(ctx, workerName, template.nameField.x, template.nameField.y, template.nameField.width, template.nameField.paddingY, template.nameField.font, color);
    drawBoxText(ctx, cpf, template.cpfField.x, template.cpfField.y, template.cpfField.width, template.cpfField.paddingY, template.cpfField.font, color);
    drawBoxText(ctx, cid, template.cidField.x, template.cidField.y, template.cidField.width, template.cidField.paddingY, template.cidField.font, color);

    drawOriginMark(ctx, origin, color);

    drawParagraphAutoFit(
      ctx,
      description,
      template.descriptionRect.x,
      template.descriptionRect.y,
      template.descriptionRect.width,
      template.descriptionRect.height,
      color,
      template.descriptionRect.fontSizes,
      "Arial"
    );
    drawParagraphAutoFit(
      ctx,
      limitations,
      template.limitationsRect.x,
      template.limitationsRect.y,
      template.limitationsRect.width,
      template.limitationsRect.height,
      color,
      template.limitationsRect.fontSizes,
      "Arial"
    );

    markSectionByModule(ctx, state.activeModule, color, payload);
    drawTechnicalDetailByModule(ctx, state.activeModule, payload, color);

    drawBoxText(ctx, signatureLine, template.signatureField.x, template.signatureField.y, template.signatureField.width, template.signatureField.paddingY, template.signatureField.font, color);
    drawBoxText(ctx, date, template.dateField.x, template.dateField.y, template.dateField.width, template.dateField.paddingY, template.dateField.font, color);
  }

  function drawOriginMark(ctx, origin, color) {
    const coords = OFFICIAL_LAUDO_TEMPLATE.originMarks[origin];
    if (!coords) {
      return;
    }
    drawMark(ctx, coords[0], coords[1], color, 4.5);
  }

  function markSectionByModule(ctx, moduleKey, color, payload) {
    if (moduleKey === "visual" && valueOf("visualPrimaryFinding") === "visao_monocular") {
      const monocularCoords = OFFICIAL_LAUDO_TEMPLATE.moduleMarks.monocular;
      drawMark(ctx, monocularCoords[0], monocularCoords[1], color, 4.5);
      return;
    }

    const coords = OFFICIAL_LAUDO_TEMPLATE.moduleMarks[moduleKey];
    if (coords) {
      drawMark(ctx, coords[0], coords[1], color, 4.5);
    }
  }

  function drawTechnicalDetailByModule(ctx, moduleKey, payload, color) {
    if (moduleKey === "fisica") {
      const physicalTemplate = OFFICIAL_LAUDO_TEMPLATE.physical;
      const physicalChoice = valueOf("physicalConditionType");
      drawMark(
        ctx,
        physicalChoice === "amputação" ? physicalTemplate.amputationMark[0] : physicalTemplate.otherMark[0],
        physicalChoice === "amputação" ? physicalTemplate.amputationMark[1] : physicalTemplate.otherMark[1],
        color,
        4.3
      );
      drawParagraphAutoFit(
        ctx,
        buildPhysicalPdfDetail(),
        physicalTemplate.otherTextRect.x,
        physicalTemplate.otherTextRect.y,
        physicalTemplate.otherTextRect.width,
        physicalTemplate.otherTextRect.height,
        color,
        physicalTemplate.otherTextRect.fontSizes,
        "'Arial Narrow', Arial"
      );
      return;
    }

    if (moduleKey === "visual") {
      const visualTemplate = OFFICIAL_LAUDO_TEMPLATE.visual;
      const finding = valueOf("visualPrimaryFinding");
      if (finding === "cegueira_bilateral") {
        drawMark(ctx, visualTemplate.blindnessMark[0], visualTemplate.blindnessMark[1], color, 4.5);
      } else if (finding === "baixa_visao_bilateral") {
        drawMark(ctx, visualTemplate.lowVisionMark[0], visualTemplate.lowVisionMark[1], color, 4.5);
      } else if (finding === "campo_visual_reduzido") {
        drawMark(ctx, visualTemplate.fieldMark[0], visualTemplate.fieldMark[1], color, 4.5);
      }
      return;
    }

    if (moduleKey === "intelectual") {
      const selected = checkedValues("intellectualMarker");
      selected.forEach((item) => {
        const coords = OFFICIAL_LAUDO_TEMPLATE.intellectualMarks[item];
        if (coords) {
          drawMark(ctx, coords[0], coords[1], color, 4);
        }
      });
    }
  }

  function buildPhysicalPdfDetail() {
    const choice = valueOf("physicalConditionType");
    const scope = valueOf("physicalAmputationScope");
    const laterality = resolveEffectivePhysicalLaterality();
    if (choice === "amputação") {
      return composeAmputationFinding(scope, laterality, collectAmputationDetail(), valueOf("physicalAmputationLevel"));
    }
    return `${capitalize(choice)} em ${composeSegment(resolvePhysicalSegment(), laterality)}`;
  }

  function buildPsychosocialPdfDetail() {
    const selected = checkedLabels("psychosocialMarker");
    return selected.length ? selected.join("; ") : "restrição relevante de participação psicossocial";
  }

  function getAudiometryAverage(ear) {
    const fieldMap = ear === "OD"
      ? ["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"]
      : ["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"];
    const values = fieldMap.map(numberOf);
    return values.every(Number.isFinite) ? average(values) : Number.NaN;
  }

  function buildOfficialDescriptionText(payload) {
    const cid = formatCid(resolveCurrentCid());

    if (state.activeModule === "auditiva") {
      const odAverage = getAudiometryAverage("OD");
      const oeAverage = getAudiometryAverage("OE");
      const rightTotal = odAverage > 95;
      const leftTotal = oeAverage > 95;
      if (rightTotal || leftTotal) {
        const side = rightTotal ? "direita" : "esquerda";
        return `Surdez unilateral total à orelha ${side}, audiometria sem aparelho, médias de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE. CID: ${cid}.`;
      }
      return `Deficiência auditiva bilateral parcial, audiometria sem aparelho, médias de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE. CID: ${cid}.`;
    }

    if (state.activeModule === "fisica") {
      const choice = valueOf("physicalConditionType");
      const scope = valueOf("physicalAmputationScope");
      const laterality = valueOf("physicalLaterality");
      const segmentText = choice === "amputação"
        ? composeAmputationFinding(scope, laterality, collectAmputationDetail(), valueOf("physicalAmputationLevel"))
        : composeSegment(resolvePhysicalSegment(), laterality);
      return `Deficiência física permanente por ${lowercaseFirst(choice)} em ${segmentText}. CID: ${cid}.`;
    }

    if (state.activeModule === "visual") {
      const objectiveText = buildOfficialVisualSummary();
      return `Deficiência visual permanente com ${objectiveText}. CID: ${cid}.`;
    }

    if (state.activeModule === "clinicas") {
      const condition = normalizedText("clinicalCondition");
      const grade = valueOf("clinicalLimitationGrade");
      return `Condição clínica persistente compatível com ${lowercaseFirst(condition)}, com limitação funcional ${grade || "relevante"}. CID: ${cid}.`;
    }

    if (state.activeModule === "intelectual") {
      const supportNeed = labelForSelectValue("intellectualSupportNeed").toLowerCase() || "compatível com limitação adaptativa relevante";
      return `Deficiência intelectual permanente, com comprometimento do funcionamento intelectual e das habilidades adaptativas, demandando suporte ${supportNeed}. CID: ${cid}.`;
    }

    if (state.activeModule === "psicossocial") {
      return `Deficiência mental/psicossocial persistente, com restrição relevante de participação social e laboral. CID: ${cid}.`;
    }

    return payload.result.description || "";
  }

  function buildOfficialLimitationsText(payload) {
    if (state.activeModule === "auditiva") {
      const summary = summarizeLabelsForLaudo(checkedLabels("audioImpactMarker"), 3);
      return ensureSentence(summary || "Prejuízo para compreensão da fala, comunicação em ruído e percepção de alertas sonoros");
    }

    if (state.activeModule === "fisica") {
      const grade = valueOf("physicalImpactGrade");
      const summary = summarizeLabelsForLaudo(checkedLabels("physicalFunctionItem"), 4);
      return ensureSentence(`Limitação funcional ${functionalDegreeText(grade || "moderado")}, com ${summary || "restrição para execução de tarefas e movimentos do segmento acometido"}`);
    }

    if (state.activeModule === "visual") {
      const summary = summarizeLabelsForLaudo(checkedLabels("visualMarker"), 3);
      return ensureSentence(summary || "Dificuldade para leitura, orientação espacial e deslocamento com segurança");
    }

    if (state.activeModule === "clinicas") {
      const summary = summarizeLabelsForLaudo(checkedLabels("clinicalMarker"), 4);
      return ensureSentence(summary || "Limitação funcional persistente em atividades diárias e laborais");
    }

    if (state.activeModule === "intelectual") {
      const summary = summarizeLabelsForLaudo(checkedLabels("intellectualMarker"), 4);
      return ensureSentence(summary || "Dificuldade para compreensão de instruções, organização de rotina e autonomia funcional");
    }

    if (state.activeModule === "psicossocial") {
      const summary = summarizeLabelsForLaudo(checkedLabels("psychosocialMarker"), 4);
      return ensureSentence(summary || "Restrição de participação social e laboral em igualdade de condições");
    }

    return payload.result.limitations || "";
  }

  function buildOfficialVisualSummary() {
    const condition = valueOf("visualPrimaryFinding");
    const acuityOD = labelForSelectValue("visualAcuityOD");
    const acuityOE = labelForSelectValue("visualAcuityOE");
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");

    if (condition === "visao_monocular") {
      return `visão monocular, com acuidade ${acuityOD} em OD e ${acuityOE} em OE`;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60"
        ? "campo visual binocular igual ou menor que 60°"
        : "restrição relevante de campo visual";
    }
    return `acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE${fieldChanged === "sim" ? ", associada a alteração de campo visual" : ""}`;
  }

  function summarizeLabelsForLaudo(labels, maxItems = 3) {
    const filtered = labels.filter(Boolean).map((item) => normalizeSpacing(item));
    if (!filtered.length) {
      return "";
    }
    if (filtered.length <= maxItems) {
      return joinList(filtered);
    }
    return `${joinList(filtered.slice(0, maxItems))} e outras limitações correlatas`;
  }

  function drawBoxText(ctx, text, x, y, width, paddingY, font, color) {
    if (!text) {
      return;
    }
    ctx.font = font;
    ctx.fillStyle = color;
    const clipped = clipTextToWidth(ctx, text, width);
    ctx.fillText(clipped, x, y + paddingY);
  }

  function drawParagraphInRect(ctx, text, x, y, width, height, font, color, lineHeight) {
    if (!text) {
      return;
    }
    ctx.font = font;
    ctx.fillStyle = color;
    const lines = wrapCanvasText(ctx, text, width);
    const maxLines = Math.max(1, Math.floor(height / lineHeight));
    lines.slice(0, maxLines).forEach((line, index) => {
      ctx.fillText(line, x, y + (index * lineHeight));
    });
  }

  function drawParagraphAutoFit(ctx, text, x, y, width, height, color, fontSizes = [13, 12, 11], fontFamily = "Arial") {
    if (!text) {
      return;
    }

    const sizes = Array.isArray(fontSizes) && fontSizes.length ? fontSizes : [13, 12, 11];
    const fittingSize = sizes.find((size) => {
      ctx.font = `${size}px ${fontFamily}`;
      const lineHeight = size + 3;
      return wrapCanvasText(ctx, text, width).length * lineHeight <= height;
    }) || sizes[sizes.length - 1];

    drawParagraphInRect(ctx, text, x, y, width, height, `${fittingSize}px ${fontFamily}`, color, fittingSize + 3);
  }

  function wrapCanvasText(ctx, text, maxWidth) {
    const words = normalizeSpacing(text).split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const trial = line ? `${line} ${word}` : word;
      if (ctx.measureText(trial).width <= maxWidth || !line) {
        line = trial;
      } else {
        lines.push(line);
        line = word;
      }
    });

    if (line) {
      lines.push(line);
    }

    return lines;
  }

  function clipTextToWidth(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) {
      return text;
    }
    let clipped = text;
    while (clipped.length > 0 && ctx.measureText(`${clipped}...`).width > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    return `${clipped}...`;
  }

  function drawMark(ctx, centerX, centerY, color, halfSize = 4.5) {
    ctx.save();
    const size = Math.max(4, halfSize + 0.5);
    ctx.fillStyle = color;
    ctx.fillRect(centerX - (size / 2), centerY - (size / 2), size, size);
    ctx.restore();
  }

  function createPdfBlobFromJpegDataUrl(dataUrl, widthPx, heightPx, pageWidth = 612, pageHeight = 792) {
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const imageBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      imageBytes[i] = binary.charCodeAt(i);
    }

    const imageObjectId = 1;
    const contentObjectId = 2;
    const pageObjectId = 3;
    const pagesObjectId = 4;
    const catalogObjectId = 5;

    const scaleX = pageWidth;
    const scaleY = pageHeight;
    const content = `q ${scaleX} 0 0 ${scaleY} 0 0 cm /Im0 Do Q`;
    const parts = [];
    const offsets = [0];

    function pushString(value) {
      parts.push(new TextEncoder().encode(value));
    }

    function totalLength() {
      return parts.reduce((sum, part) => sum + part.length, 0);
    }

    pushString("%PDF-1.4\n");
    offsets.push(totalLength());
    pushString(`${imageObjectId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
    parts.push(imageBytes);
    pushString(`\nendstream\nendobj\n`);

    offsets.push(totalLength());
    pushString(`${contentObjectId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);

    offsets.push(totalLength());
    pushString(`${pageObjectId} 0 obj\n<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 ${imageObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>\nendobj\n`);

    offsets.push(totalLength());
    pushString(`${pagesObjectId} 0 obj\n<< /Type /Pages /Kids [${pageObjectId} 0 R] /Count 1 >>\nendobj\n`);

    offsets.push(totalLength());
    pushString(`${catalogObjectId} 0 obj\n<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>\nendobj\n`);

    const xrefStart = totalLength();
    pushString(`xref\n0 6\n0000000000 65535 f \n`);
    offsets.slice(1).forEach((offset) => {
      pushString(`${String(offset).padStart(10, "0")} 00000 n \n`);
    });
    pushString(`trailer\n<< /Size 6 /Root ${catalogObjectId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

    return new Blob(parts, { type: "application/pdf" });
  }

  async function openOfficialPrintPreview(payload) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return false;
    }

    const imageDataUrl = await buildOfficialLaudoImageDataUrl(payload);
    const html = buildOfficialPrintHtml(imageDataUrl);
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    return true;
  }

  function buildOfficialPrintHtml(imageDataUrl) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador Oficial</title>
  <style>
    @page { size: Letter portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #eef3f8; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page-shell {
      display: flex;
      justify-content: center;
      padding: 24px;
    }
    .page-image {
      width: 816px;
      max-width: calc(100vw - 48px);
      height: auto;
      background: #fff;
      box-shadow: 0 18px 42px rgba(21, 36, 51, 0.14);
    }
    @media print {
      body { background: #fff; }
      .page-shell { padding: 0; }
      .page-image {
        max-width: none;
        width: 816px;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="page-shell">
    <img class="page-image" id="pageImage" src="${escapeHtml(imageDataUrl)}" alt="Laudo oficial renderizado">
  </div>
  <script>
    const pageImage = document.getElementById("pageImage");
    function triggerPrint() {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, 350);
    }
    if (pageImage && pageImage.complete) {
      triggerPrint();
    } else if (pageImage) {
      pageImage.addEventListener("load", triggerPrint, { once: true });
    }
  </script>
</body>
</html>`;
  }

  async function openOfficialPrintPreview(payload) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return false;
    }

    const imageDataUrl = await buildOfficialLaudoImageDataUrl(payload);
    const html = buildOfficialPrintHtml(imageDataUrl, payload);
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.addEventListener("beforeunload", () => cleanupAttachmentPayloads(payload.attachments || []), { once: true });
    window.setTimeout(() => cleanupAttachmentPayloads(payload.attachments || []), 10 * 60 * 1000);
    return true;
  }

  function buildOfficialPrintHtml(imageDataUrl, payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const attachmentSummary = buildAttachmentSummaryHtml(attachments);
    const attachmentSheets = buildAttachmentPrintSheetsHtml(attachments);
    const printDelay = attachments.length ? 1200 : 450;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador e Anexos</title>
  <style>
    @page { size: Letter portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #edf3f8; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; color: #152433; }
    .bundle-shell {
      display: grid;
      justify-content: center;
      gap: 24px;
      padding: 24px;
    }
    .sheet {
      width: 816px;
      min-height: 1056px;
      background: #ffffff;
      box-shadow: 0 18px 42px rgba(21, 36, 51, 0.14);
      page-break-after: always;
      break-after: page;
    }
    .sheet:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .official-sheet {
      display: block;
    }
    .page-image {
      display: block;
      width: 816px;
      height: auto;
    }
    .annex-cover {
      display: grid;
      align-content: start;
      gap: 18px;
      padding: 42px 46px;
    }
    .annex-cover h2 {
      margin: 0;
      font-size: 1.9rem;
    }
    .annex-cover p {
      margin: 0;
      line-height: 1.6;
      color: #5f7182;
    }
    .annex-list {
      display: grid;
      gap: 12px;
      margin-top: 6px;
    }
    .annex-item {
      display: grid;
      gap: 4px;
      padding: 14px 16px;
      border: 1px solid rgba(32, 61, 90, 0.14);
      border-radius: 14px;
      background: #f8fbfd;
    }
    .annex-item strong {
      font-size: 0.98rem;
    }
    .annex-item span {
      color: #5f7182;
      line-height: 1.45;
    }
    .attachment-sheet {
      display: grid;
      align-content: start;
      gap: 14px;
      padding: 28px 28px 20px;
    }
    .attachment-head {
      display: grid;
      gap: 4px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(32, 61, 90, 0.14);
    }
    .attachment-head h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    .attachment-head p {
      margin: 0;
      color: #5f7182;
      line-height: 1.5;
    }
    .attachment-preview {
      width: 100%;
      border: 1px solid rgba(32, 61, 90, 0.12);
      border-radius: 16px;
      background: #ffffff;
      overflow: hidden;
      min-height: 920px;
    }
    .attachment-image {
      display: block;
      width: 100%;
      height: auto;
      max-height: 920px;
      object-fit: contain;
      background: #ffffff;
    }
    .attachment-pdf {
      width: 100%;
      height: 920px;
      border: 0;
      display: block;
      background: #ffffff;
    }
    .attachment-note {
      margin: 0;
      color: #7a5d14;
      line-height: 1.5;
      padding: 12px 14px;
      border-radius: 14px;
      background: #fff7dd;
      border: 1px solid rgba(168, 120, 23, 0.18);
    }
    @media print {
      body { background: #ffffff; }
      .bundle-shell { padding: 0; gap: 0; }
      .sheet { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="sheet official-sheet">
      <img class="page-image" id="pageImage" src="${escapeHtml(imageDataUrl)}" alt="Laudo oficial renderizado">
    </section>
    ${attachmentSummary}
    ${attachmentSheets}
  </div>
  <script>
    const images = Array.from(document.querySelectorAll("img"));
    let pendingImages = images.filter(function (image) { return !image.complete; }).length;
    function triggerPrint() {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, ${printDelay});
    }
    if (!pendingImages) {
      triggerPrint();
    } else {
      images.forEach(function (image) {
        image.addEventListener("load", function () {
          pendingImages -= 1;
          if (pendingImages <= 0) {
            triggerPrint();
          }
        }, { once: true });
        image.addEventListener("error", function () {
          pendingImages -= 1;
          if (pendingImages <= 0) {
            triggerPrint();
          }
        }, { once: true });
      });
    }
  </script>
</body>
</html>`;
  }

  function buildAttachmentSummaryHtml(attachments = []) {
    if (!attachments.length) {
      return "";
    }

    const items = attachments.map((attachment, index) => `
      <article class="annex-item">
        <strong>${index + 1}. ${escapeHtml(attachment.name)}</strong>
        <span>${escapeHtml(describeAttachmentKind(attachment.mimeType))} • ${escapeHtml(attachment.sizeLabel)}</span>
      </article>
    `).join("");

    return `
      <section class="sheet annex-cover">
        <span class="section-step">Anexos</span>
        <h2>DocumentaÃ§Ã£o mÃ©dica externa</h2>
        <p>Os arquivos abaixo foram vinculados ao caso para compor a impressÃ£o do laudo caracterizador e a juntada documental operacional.</p>
        <div class="annex-list">${items}</div>
      </section>
    `;
  }

  function buildAttachmentPrintSheetsHtml(attachments = []) {
    return attachments.map((attachment, index) => {
      if (attachment.previewKind === "image") {
        return `
          <section class="sheet attachment-sheet">
            <header class="attachment-head">
              <h3>Anexo ${index + 1} - ${escapeHtml(attachment.name)}</h3>
              <p>Documento externo incorporado ao pacote final de impressÃ£o.</p>
            </header>
            <div class="attachment-preview">
              <img class="attachment-image" src="${escapeHtml(attachment.source)}" alt="${escapeHtml(attachment.name)}">
            </div>
          </section>
        `;
      }

      if (attachment.previewKind === "pdf") {
        return `
          <section class="sheet attachment-sheet">
            <header class="attachment-head">
              <h3>Anexo ${index + 1} - ${escapeHtml(attachment.name)}</h3>
              <p>Documento em PDF anexado ao caso.</p>
            </header>
            <div class="attachment-preview">
              <embed class="attachment-pdf" src="${escapeHtml(attachment.source)}#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf">
            </div>
            <p class="attachment-note">Se o navegador nÃ£o renderizar este PDF dentro da folha, utilize a opÃ§Ã£o de salvar em PDF pelo navegador ou abra o anexo em nova guia para impressÃ£o complementar.</p>
          </section>
        `;
      }

      return `
        <section class="sheet attachment-sheet">
          <header class="attachment-head">
            <h3>Anexo ${index + 1} - ${escapeHtml(attachment.name)}</h3>
            <p>Documento externo registrado no caso, sem prÃ©-visualizaÃ§Ã£o compatÃ­vel nesta tela.</p>
          </header>
          <p class="attachment-note">Arquivo identificado como ${escapeHtml(describeAttachmentKind(attachment.mimeType))}. Mantenha este documento vinculado ao processo do trabalhador.</p>
        </section>
      `;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const candidates = buildImageSourceCandidates(src);
      let currentIndex = 0;

      const tryLoad = () => {
        if (currentIndex >= candidates.length) {
          reject(new Error(`Falha ao carregar imagem do formulário oficial: ${src}`));
          return;
        }

        const candidate = candidates[currentIndex];
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => {
          currentIndex += 1;
          tryLoad();
        };
        image.src = candidate;
      };

      tryLoad();
    });
  }

  function buildImageSourceCandidates(src) {
    const absoluteSrc = new URL(src, window.location.href).href;

    if (window.location.protocol === "file:") {
      return [src, absoluteSrc];
    }

    return [`${src}?v=${Date.now()}`, src, absoluteSrc];
  }

  function inferOriginFromCurrentCase() {
    const basis = valueOf("physicalClinicalBasis");
    if (basis === "congênita") return "congenita";
    if (basis === "traumática") return "acidente_comum";
    if (basis === "pós-cirúrgica") return "pos_operatorio";
    if (basis === "neurológica" || basis === "vascular" || basis === "outra base clínica") return "doenca_comum";
    return "";
  }

  function resolveCurrentCid() {
    const fieldsByModule = {
      auditiva: "audioCid",
      fisica: "physicalCid",
      clinicas: "clinicalCid",
      visual: "visualCid",
      intelectual: "intellectualCid",
      psicossocial: "psychosocialCid"
    };
    const fieldId = fieldsByModule[state.activeModule];
    return fieldId ? normalizedText(fieldId) : "";
  }

  function buildStructuredPdfBlob(payload) {
    const pages = [];
    let currentPage = [];
    let currentY = 800;
    const marginX = 46;
    const pageHeight = 842;
    const bottomLimit = 70;
    const contentWidth = 503;

    function newPage() {
      currentPage = [];
      pages.push(currentPage);
      currentY = 800;
    }

    function ensureSpace(heightNeeded) {
      if (!pages.length) {
        newPage();
      }
      if (currentY - heightNeeded < bottomLimit) {
        newPage();
      }
    }

    function pushOp(op) {
      currentPage.push(op);
    }

    function drawText(text, x, y, size = 10, font = "F1") {
      const safe = escapePdfText(text);
      pushOp(`BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${safe}) Tj ET`);
    }

    function drawWrappedText(text, x, y, width, size = 10, font = "F1", lineGap = 13) {
      const lines = wrapTextForPdf(text, width, size, font);
      lines.forEach((line, index) => {
        drawText(line, x, y - (index * lineGap), size, font);
      });
      return lines.length * lineGap;
    }

    function drawRule(y) {
      pushOp(`0.75 w ${marginX} ${y.toFixed(2)} m ${marginX + contentWidth} ${y.toFixed(2)} l S`);
    }

    function drawSection(title, body) {
      const paragraphs = Array.isArray(body) ? body.filter(Boolean) : [body].filter(Boolean);
      const estimated = 34 + paragraphs.reduce((sum, paragraph) => sum + (wrapTextForPdf(paragraph, contentWidth - 22, 10, "F1").length * 13), 0);
      ensureSpace(estimated + 24);
      pushOp(`0.6 w ${marginX} ${(currentY - estimated + 10).toFixed(2)} ${contentWidth} ${(estimated + 10).toFixed(2)} re S`);
      drawText(title, marginX + 12, currentY - 18, 11, "F2");
      let textY = currentY - 36;
      paragraphs.forEach((paragraph) => {
        const consumed = drawWrappedText(paragraph, marginX + 12, textY, contentWidth - 22, 10, "F1", 13);
        textY -= consumed + 4;
      });
      currentY = currentY - estimated - 16;
    }

    newPage();
    drawText(payload.title, marginX, currentY, 15, "F2");
    currentY -= 18;
    drawText("Laudo técnico-funcional para fins de caracterização ocupacional", marginX, currentY, 10, "F1");
    currentY -= 14;
    drawRule(currentY);
    currentY -= 20;

    drawSection("1. Identificação do trabalhador", [
      `Nome: ${payload.identity.workerName || "Não informado"}`,
      `CPF: ${payload.identity.workerCpf || "Não informado"}    Empresa: ${payload.identity.company || "Não informada"}`,
      `Função / cargo: ${payload.identity.role || "Não informado"}    Setor: ${payload.identity.sector || "Não informado"}`,
      `Data da avaliação: ${formatDateForReport(payload.identity.reportDate)}    Unidade / clínica: ${payload.identity.unit || "Não informada"}`
    ]);

    drawSection("2. Identificação do profissional responsável", [
      `Profissional responsável: ${payload.identity.examiner || "Não informado"}`,
      `Conselho / registro: ${payload.identity.examinerRegistry || "Não informado"}`
    ]);

    drawSection("3. Enquadramento técnico", [
      `Módulo analisado: ${payload.moduleLabel}`,
      `Conclusão: ${payload.result.title}. ${payload.result.message}`
    ]);

    drawSection("4. Descrição da deficiência e CID", payload.result.description || "Não disponível.");
    drawSection("5. Limitações funcionais", payload.result.limitations || "Não disponíveis.");
    drawSection("6. Fundamentação técnico-funcional", payload.technicalBasis);

    if (payload.result.supportNote) {
      drawSection("7. Observações técnicas e documentação complementar", payload.result.supportNote);
    }

    ensureSpace(80);
    drawRule(currentY - 12);
    drawText(payload.identity.examiner || "Profissional responsável", marginX, currentY - 36, 10, "F2");
    drawText(payload.identity.examinerRegistry || "Registro profissional", marginX, currentY - 50, 10, "F1");
    drawText(`Documento emitido em ${formatDateTimeForReport(payload.generatedAt)}`, marginX + 250, currentY - 50, 9, "F1");

    const contentStreams = pages.map((pageOps) => pageOps.join("\n"));
    return createPdfBlobFromStreams(contentStreams, pageHeight);
  }

  function createPdfBlobFromStreams(contentStreams, pageHeight) {
    const objects = [];
    const reserveObject = () => {
      objects.push("");
      return objects.length;
    };

    const catalogId = reserveObject();
    const pagesId = reserveObject();
    const fontRegularId = reserveObject();
    const fontBoldId = reserveObject();
    const pageIds = contentStreams.map(() => reserveObject());
    const contentIds = contentStreams.map(() => reserveObject());

    objects[fontRegularId - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
    objects[fontBoldId - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

    contentStreams.forEach((stream, index) => {
      objects[contentIds[index] - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
      objects[pageIds[index] - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 ${pageHeight}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentIds[index]} 0 R >>`;
    });

    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;

    let pdf = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((obj, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new Blob([latin1StringToUint8Array(pdf)], { type: "application/pdf" });
  }

  function wrapTextForPdf(text, width, size, font) {
    const normalized = normalizeSpacing(text);
    if (!normalized) {
      return [""];
    }

    const words = normalized.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const trial = currentLine ? `${currentLine} ${word}` : word;
      if (measurePdfTextWidth(trial, size, font) <= width || !currentLine) {
        currentLine = trial;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  function measurePdfTextWidth(text, size, font) {
    if (!measurePdfTextWidth.canvas) {
      measurePdfTextWidth.canvas = document.createElement("canvas");
      measurePdfTextWidth.context = measurePdfTextWidth.canvas.getContext("2d");
    }
    const ctx = measurePdfTextWidth.context;
    ctx.font = `${font === "F2" ? "700" : "400"} ${size}px Arial`;
    return ctx.measureText(text).width;
  }

  function escapePdfText(text) {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function latin1StringToUint8Array(value) {
    const bytes = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index += 1) {
      bytes[index] = value.charCodeAt(index) & 0xff;
    }
    return bytes;
  }

  function joinSupportNotes(notes) {
    const filtered = notes.filter(Boolean).map((item) => normalizeSpacing(item));
    if (!filtered.length) {
      return "";
    }
    return filtered.join(" ");
  }

  function joinList(items) {
    const filtered = items.filter(Boolean);
    if (!filtered.length) {
      return "alteração funcional relevante";
    }
    if (filtered.length === 1) {
      return filtered[0];
    }
    if (filtered.length === 2) {
      return `${filtered[0]} e ${filtered[1]}`;
    }
    return `${filtered.slice(0, -1).join(", ")} e ${filtered[filtered.length - 1]}`;
  }

  function getDefaultPlanCatalog() {
    return [
      {
        id: "individual_25",
        label: "Medico Start 25",
        audience: "Medico",
        priceCents: 29700,
        months: 1,
        laudoLimit: 25,
        description: "Entrada para medico com demanda pontual, testes assistidos e menor volume mensal."
      },
      {
        id: "individual_80",
        label: "Medico Pro 80",
        audience: "Medico",
        priceCents: 79700,
        months: 3,
        laudoLimit: 80,
        description: "Faixa intermediaria para pratica recorrente, com melhor custo por laudo e uso continuo."
      },
      {
        id: "individual_180",
        label: "Medico Scale 180",
        audience: "Medico",
        priceCents: 149700,
        months: 6,
        laudoLimit: 180,
        description: "Pacote para medico ou clinica enxuta com producao ampliada e previsao semestral."
      },
      {
        id: "empresarial_120",
        label: "Empresa Base 120",
        audience: "Empresa",
        priceCents: 119700,
        months: 3,
        laudoLimit: 120,
        description: "Plano empresarial de entrada para operacao interna com equipe reduzida e demanda controlada."
      },
      {
        id: "empresarial_250",
        label: "Empresa Pro 250",
        audience: "Empresa",
        priceCents: 199700,
        months: 6,
        laudoLimit: 250,
        description: "Pacote para clinicas ocupacionais, consultorias e equipes com demanda mensal constante."
      },
      {
        id: "empresarial_800",
        label: "Empresa Enterprise 800",
        audience: "Empresa",
        priceCents: 499700,
        months: 12,
        laudoLimit: 800,
        description: "Formato anual para operacoes com carteira ativa, varios usuarios e alta producao de laudos."
      }
    ];
  }

  function getPlanCatalogById(planId) {
    const catalog = getStoredPlanCatalog({ includeInactive: true });
    return catalog.find((item) => item.id === planId) || catalog[0] || null;
  }

  function buildPlanOptionsHtml(selectedPlanId, includeInternal = false) {
    const catalog = getStoredPlanCatalog({ includeInactive: true });
    const options = catalog.map((plan) => {
      const selected = plan.id === selectedPlanId ? " selected" : "";
      const suffix = plan.status === "inactive" ? " (inativo)" : "";
      return `<option value="${escapeHtml(plan.id)}"${selected}>${escapeHtml(`${plan.label}${suffix}`)}</option>`;
    });

    if (includeInternal && selectedPlanId === "internal") {
      options.unshift('<option value="internal" selected>Administracao interna</option>');
    }

    return options.join("");
  }

  function populatePlanSelects() {
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length
      ? state.planCatalog
      : getDefaultPlanCatalog();

    if (registerPlanLabel) registerPlanLabel.textContent = journey === "doctor" ? "Cr\u00e9ditos m\u00e9dicos dispon\u00edveis" : "Planos empresariais dispon\u00edveis";
    if (registerSubmitButton) {
      registerSubmitButton.textContent = journey === "doctor"
        ? "Validar CRM e seguir para pagamento"
        : "Criar conta e seguir para pagamento";
    }

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = buildPlanOptionsHtml(refs.registerPlan.value || (catalog[0] ? catalog[0].id : ""));
      if (!refs.registerPlan.value && catalog[0]) {
        refs.registerPlan.value = catalog[0].id;
      }
    }

    if (refs.adminPlan) {
      refs.adminPlan.innerHTML = buildPlanOptionsHtml(refs.adminPlan.value || (catalog[0] ? catalog[0].id : ""), true);
      if (!refs.adminPlan.value && catalog[0]) {
        refs.adminPlan.value = catalog[0].id;
      }
    }

    renderPlanCatalogCards(catalog);
  }

  function renderPlanCatalogCards(catalog = []) {
    const plans = Array.isArray(catalog) && catalog.length ? catalog : getDefaultPlanCatalog();
    const registerGrid = document.getElementById("registerPlanGrid");
    const adminGrid = document.getElementById("adminPlanGrid");

    const cardsHtml = plans.map((plan, index) => `
      <article class="plan-card ${index === 1 ? "is-featured" : ""}">
        <strong>${escapeHtml(fixBrokenText(plan.label || ""))}</strong>
        <div class="plan-card-price">${escapeHtml(formatCurrencyCents(plan.priceCents || 0))}</div>
        <span>${Number(plan.months || 0)} ${Number(plan.months || 0) === 1 ? "mês" : "meses"} de acesso</span>
        <span>Até ${escapeHtml(String(Number(plan.laudoLimit || 0)))} laudos por ciclo</span>
      </article>
    `).join("");

    if (registerGrid) {
      registerGrid.innerHTML = cardsHtml;
    }

    if (adminGrid) {
      adminGrid.innerHTML = cardsHtml;
    }
  }

  function renderAdminDashboardSummary(summary) {
    const safeSummary = summary || {};
    if (refs.dashboardTotalClients) {
      refs.dashboardTotalClients.textContent = String(Number(safeSummary.totalClients || 0));
    }
    if (refs.dashboardActiveClients) {
      refs.dashboardActiveClients.textContent = String(Number(safeSummary.activeClients || 0));
    }
    if (refs.dashboardDelinquentClients) {
      refs.dashboardDelinquentClients.textContent = String(Number(safeSummary.delinquentClients || 0));
    }
    if (refs.dashboardTotalReports) {
      refs.dashboardTotalReports.textContent = String(Number(safeSummary.totalReports || 0));
    }
  }

  function computeLocalDashboardSummary(users) {
    const normalizedUsers = Array.isArray(users) ? users : [];
    const clients = normalizedUsers.filter((item) => item.role !== "admin" && !isCompanyManagedDoctorUser(item));
    return {
      totalClients: clients.length,
      activeClients: clients.filter((item) => item.status === "active" && normalizeLocalPaymentStatus(item.paymentStatus) === "approved").length,
      delinquentClients: clients.filter((item) => item.status === "inadimplente" || ["pending", "expired", "rejected", "cancelled"].includes(normalizeLocalPaymentStatus(item.paymentStatus))).length,
      totalReports: clients.reduce((sum, item) => sum + Number(item.usageCount || 0), 0)
    };
  }

  async function ensureLocalDefaultAdmin() {
    const users = readLocalUsers();
    const existingAdmin = users.find((item) => item.role === "admin" && normalizeUserIdentifier(item.username) === normalizeUserIdentifier("ANDERSONBIONDO"));
    if (existingAdmin) {
      return;
    }

    const passwordHash = await buildAuthHash("13090404");
    users.push(buildLocalUserRecord({
      company: "Enquadra PcD",
      username: "ANDERSONBIONDO",
      passwordHash,
      role: "admin",
      status: "active",
      expiresAt: null,
      contactName: "Administrador da plataforma",
      email: "",
      paymentStatus: "approved",
      paymentDueAt: null,
      planId: "internal",
      notes: "Administrador padrao da plataforma."
    }));
    writeLocalUsers(users);
  }

  function normalizeLocalStatus(value) {
    if (value === "blocked") {
      return "blocked";
    }
    if (value === "inadimplente") {
      return "inadimplente";
    }
    return "active";
  }

  function normalizeLocalPaymentStatus(value) {
    if (["approved", "pending", "rejected", "cancelled", "expired"].includes(value)) {
      return value;
    }
    return "approved";
  }

  function addMonthsToIso(baseDate, months) {
    const date = baseDate instanceof Date ? new Date(baseDate.getTime()) : new Date(baseDate || Date.now());
    date.setMonth(date.getMonth() + Number(months || 0));
    return date.toISOString();
  }

  function getLocalAccessError(user) {
    if (!user) {
      return "Conta nao localizada.";
    }
    if (user.role === "admin") {
      return user.status === "active" ? "" : "Acesso administrativo bloqueado.";
    }

    const companyController = isCompanyManagedDoctorUser(user)
      ? readLocalUsers().find((item) => item.id === user.linkedCompanyId && normalizeAccountType(item.accountType) === "company")
      : null;
    const effectiveStatus = companyController
      ? (user.status === "blocked" ? "blocked" : (companyController.status || user.status))
      : user.status;
    const effectivePaymentStatus = companyController
      ? normalizeLocalPaymentStatus(companyController.paymentStatus)
      : normalizeLocalPaymentStatus(user.paymentStatus);
    const effectiveDueAt = companyController ? companyController.paymentDueAt : user.paymentDueAt;

    if (effectiveStatus === "blocked") {
      return "A conta desta empresa está bloqueada.";
    }

    if (effectivePaymentStatus === "pending") {
      return "Pagamento ainda não aprovado. Finalize o plano para liberar o acesso.";
    }
    if (effectivePaymentStatus === "rejected" || effectivePaymentStatus === "cancelled") {
      return "Pagamento não aprovado. Gere um novo link de pagamento ou contate o administrador.";
    }
    if (effectivePaymentStatus === "expired" || effectiveStatus === "inadimplente") {
      return "Acesso indisponível por inadimplência ou vencimento do plano.";
    }
    if (effectiveDueAt && new Date(effectiveDueAt).getTime() < Date.now()) {
      return "Acesso indisponível por vencimento do plano.";
    }
    return "";
  }

  async function activateLocalAuthMode() {
    state.authProvider = "local";
    state.planCatalog = getDefaultPlanCatalog();
    populatePlanSelects();
    await ensureLocalDefaultAdmin();

    const users = readLocalUsers();
    const session = getLocalSessionUser();
    state.authBootstrap = {
      configured: users.some((item) => item.role === "admin"),
      mode: "local",
      plans: state.planCatalog
    };

    if (session && session.username) {
      applyAuthenticatedSession(session);
      return;
    }

    setAuthAccessType("buyer", { preserveMode: true });
    setAuthMode("login");
      setAuthStatus("Modo local ativo. Use o login da empresa para testes ou entre como administrador com o usuário padrão.");
  }

  function applyCheckoutQueryFeedback() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const checkoutStatus = params.get("checkout");
      if (!checkoutStatus) {
        return;
      }

      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");

      if (checkoutStatus === "success") {
        setAuthStatus("Retorno de pagamento recebido. Assim que o webhook confirmar a aprovação, o acesso contratado será liberado automaticamente.");
      } else if (checkoutStatus === "pending") {
        setAuthStatus("Pagamento em processamento. Aguarde a confirmação do Mercado Pago antes de tentar acessar a área contratada.");
      } else if (checkoutStatus === "failure") {
        setAuthStatus("Pagamento não concluído. Gere um novo checkout pelo cadastro ou solicite apoio comercial para retomar a contratação.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAuthBootstrap() {
    if (window.location.protocol === "file:") {
      await activateLocalAuthMode();
      return;
    }

    try {
      const bootstrap = await apiJson("/api/public/bootstrap");
      state.authProvider = "api";
      state.authBootstrap = bootstrap;
      state.planCatalog = normalizeClientPlanCatalog(bootstrap.plans || []);
      populatePlanSelects();

      const sessionResponse = await apiJson(AUTH_API.session);
      if (sessionResponse.authenticated && sessionResponse.user) {
        applyAuthenticatedSession(sessionResponse.user);
        if (sessionResponse.summary) {
          renderAdminDashboardSummary(sessionResponse.summary);
        }
        return;
      }

      if (!state.authAccessTouched) {
        setAuthAccessType("buyer", { preserveMode: true });
      } else {
        updateAuthEntryCopy();
      }
      setAuthMode(bootstrap.configured ? "login" : "setup");
      applyCheckoutQueryFeedback();

      if (!window.location.search.includes("checkout=")) {
        setAuthStatus(bootstrap.configured
          ? "Escolha o perfil de entrada e siga com login ou criacao de conta."
          : "Configure o administrador principal para liberar a plataforma.");
      }
    } catch (error) {
      console.error(error);
      await activateLocalAuthMode();
    }
  }

  function formatCpfValue(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) {
      return digits;
    }
    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  function handleCpfMaskInput(event) {
    if (!event || !event.target) {
      return;
    }
    event.target.value = formatCpfValue(event.target.value);
  }

  function formatCnpjValue(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 14);
    if (digits.length <= 2) {
      return digits;
    }
    if (digits.length <= 5) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }
    if (digits.length <= 8) {
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    }
    if (digits.length <= 12) {
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }

  function handleCnpjMaskInput(event) {
    if (!event || !event.target) {
      return;
    }
    event.target.value = formatCnpjValue(event.target.value);
  }

  function normalizeCompanySessionDoctor(entry = {}) {
    const name = String(entry.name || "").trim();
    const crm = String(entry.crm || "").replace(/\D/g, "").slice(0, 20);
    if (!name || !crm) {
      return null;
    }
    return {
      id: String(entry.id || `doctor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
      name,
      crm,
      crmState: String(entry.crmState || "").trim().toUpperCase(),
      specialty: String(entry.specialty || "").trim(),
      createdAt: entry.createdAt || new Date().toISOString(),
      accessUserId: String(entry.accessUserId || "").trim(),
      accessUsername: String(entry.accessUsername || "").trim(),
      accessCreatedAt: entry.accessCreatedAt || "",
      crmValidated: Boolean(entry.crmValidated || String(entry.responsibilityMode || "").trim().toLowerCase() === "company"),
      responsibilityMode: String(entry.responsibilityMode || "company").trim().toLowerCase() === "company" ? "company" : ""
    };
  }

  function normalizeCompanySessionDoctors(list = []) {
    return (Array.isArray(list) ? list : [])
      .map((entry) => normalizeCompanySessionDoctor(entry))
      .filter(Boolean);
  }

  function normalizeResponsibilityMode(value) {
    return String(value || "").trim().toLowerCase() === "company" ? "company" : "";
  }

  function isCompanyManagedDoctorUser(user) {
    return Boolean(user
      && !user.isAdmin
      && user.role === "buyer"
      && normalizeAccountType(user.accountType) === "doctor"
      && normalizeResponsibilityMode(user.responsibilityMode) === "company"
      && String(user.linkedCompanyId || "").trim());
  }

  function buildCompanyDoctorAccessSlug(value) {
    const text = String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "");
    return text || "medico";
  }

  function generateCompanyDoctorUsername(name, users = []) {
    const base = buildCompanyDoctorAccessSlug(name).slice(0, 24) || "medico";
    let attempt = base;
    let counter = 2;

    while ((Array.isArray(users) ? users : []).some((item) => normalizeUserIdentifier(item.username || item.email || "") === normalizeUserIdentifier(attempt) || item.usernameKey === normalizeUserIdentifier(attempt))) {
      attempt = `${base}${counter}`.slice(0, 28);
      counter += 1;
    }

    return attempt;
  }

  function generateCompanyDoctorPassword() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let password = "";
    for (let index = 0; index < 10; index += 1) {
      password += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return password;
  }

  function normalizeCompanySessionActivity(entry = {}) {
    const action = String(entry.action || "").trim();
    if (!action) {
      return null;
    }
    return {
      id: String(entry.id || `activity_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
      doctorName: String(entry.doctorName || "Administrativo da empresa").trim() || "Administrativo da empresa",
      action,
      occurredAt: entry.occurredAt || new Date().toISOString()
    };
  }

  function normalizeCompanySessionActivities(list = []) {
    return (Array.isArray(list) ? list : [])
      .map((entry) => normalizeCompanySessionActivity(entry))
      .filter(Boolean)
      .sort((left, right) => String(right.occurredAt || "").localeCompare(String(left.occurredAt || "")));
  }

  function normalizeCompanySessionDocumentEntry(entry = {}) {
    const count = Math.max(0, Number(entry.count || 0));
    const rawDate = String(entry.date || entry.occurredAt || "").trim();
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
      ? rawDate
      : (parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString().slice(0, 10) : "");
    if (!date || !count) {
      return null;
    }
    return {
      id: String(entry.id || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
      date,
      count,
      doctorName: String(entry.doctorName || "").trim(),
      source: String(entry.source || "company").trim() || "company"
    };
  }

  function normalizeCompanySessionDocumentHistory(list = [], fallbackCount = 0) {
    const normalized = (Array.isArray(list) ? list : [])
      .map((entry) => normalizeCompanySessionDocumentEntry(entry))
      .filter(Boolean);

    if (!normalized.length && Number(fallbackCount || 0) > 0) {
      normalized.push({
        id: `doc_legacy_${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        count: Number(fallbackCount || 0),
        doctorName: "",
        source: "legacy"
      });
    }

    return normalized.sort((left, right) => String(left.date || "").localeCompare(String(right.date || "")));
  }

  function appendCompanySessionActivity(base = {}, entry = {}) {
    return normalizeCompanySessionActivities([
      ...(Array.isArray(base.activityLog) ? base.activityLog : []),
      { ...entry, occurredAt: entry.occurredAt || new Date().toISOString() }
    ]);
  }

  function isCompanySession(session = state.sessionUser) {
    return Boolean(session && !session.isAdmin && session.role === "buyer" && normalizeAccountType(session.accountType) === "company");
  }

  function isDoctorOperationalSession(session = state.sessionUser) {
    if (!session || session.isAdmin) {
      return false;
    }
    const accountType = normalizeAccountType(session.accountType);
    return accountType === "doctor" || accountType === "demo";
  }

  function buildMonthKey(dateLike) {
    const candidate = dateLike ? new Date(dateLike) : new Date();
    const safe = Number.isNaN(candidate.getTime()) ? new Date() : candidate;
    return `${safe.getFullYear()}-${String(safe.getMonth() + 1).padStart(2, "0")}`;
  }

  function buildMonthLabel(monthKey) {
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
      return "Período";
    }
    const [year, month] = monthKey.split("-");
    const candidate = new Date(Number(year), Number(month) - 1, 1);
    return candidate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }

  function formatDashboardDateTime(value) {
    if (!value) {
      return "Sem registro";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Sem registro";
    }
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDashboardDate(value) {
    if (!value) {
      return "Sem data";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Sem data";
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function collectReportIdentity() {
    return {
      workerName: normalizedText("reportWorkerName"),
      workerCpf: formatCpfValue(valueOfRaw("reportWorkerCpf")),
      workerBirthDate: valueOfRaw("reportBirthDate"),
      reportDate: valueOfRaw("reportDate"),
      origin: valueOf("reportOrigin"),
      company: normalizedText("reportCompany"),
      role: normalizedText("reportRole"),
      sector: normalizedText("reportSector"),
      examiner: normalizedText("reportExaminer"),
      examinerRegistry: normalizedText("reportExaminerRegistry"),
      examinerSpecialty: normalizedText("reportExaminerSpecialty"),
      unit: normalizedText("reportUnit")
    };
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const username = normalizedText("loginUsername");
    const password = valueOfRaw("loginPassword");

    if (!username || !password) {
      setAuthStatus("Informe usuário ou e-mail e a senha para entrar.");
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(AUTH_API.login, {
          method: "POST",
          body: { username, password }
        });

        if (!isAccessTypeAllowed(response.user)) {
          try {
            await apiJson(AUTH_API.logout, { method: "POST" });
          } catch (logoutError) {
            console.error(logoutError);
          }
          setAuthStatus(accessTypeMismatchMessage(response.user));
          return;
        }

        if (refs.loginForm) {
          refs.loginForm.reset();
        }

        setAuthStatus("");
        applyAuthenticatedSession(response.user);
      } catch (error) {
        setAuthStatus(error.message || "Credenciais inválidas. Revise usuário, e-mail e senha.");
        applyCheckoutStatusAction(error && error.payload ? error.payload : null);
      }
      return;
    }

    if (isDoctorJourney) {
      setAuthStatus("O plano m\u00e9dico exige valida\u00e7\u00e3o online no CFM e s\u00f3 pode ser contratado com o backend publicado e configurado.");
      return;
    }

    const users = readLocalUsers();
    const identifier = normalizeUserIdentifier(username);
    const userIndex = users.findIndex((item) => item.usernameKey === identifier || normalizeUserIdentifier(item.email) === identifier);
    const user = userIndex >= 0 ? users[userIndex] : null;

    if (!user) {
      setAuthStatus("Credenciais inválidas. Revise usuário, e-mail e senha.");
      return;
    }

    if (!isAccessTypeAllowed(user)) {
      setAuthStatus(accessTypeMismatchMessage(user));
      return;
    }

    const candidateHash = await buildAuthHash(password);
    if (candidateHash !== user.passwordHash) {
      setAuthStatus("Credenciais inválidas. Revise usuário, e-mail e senha.");
      return;
    }

    const accessError = getLocalAccessError(user);
    if (accessError) {
      setAuthStatus(accessError);
      return;
    }

    const updatedUser = {
      ...user,
      lastAccessAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (normalizeAccountType(updatedUser.accountType) === "company") {
      updatedUser.activityLog = appendCompanySessionActivity(updatedUser, {
        doctorName: "Administrativo da empresa",
        action: "Acesso ao dashboard corporativo realizado",
        occurredAt: updatedUser.lastAccessAt
      });
    }

    users[userIndex] = updatedUser;
    writeLocalUsers(users);

    const session = buildLocalSessionUser(updatedUser);
    persistLocalSessionUser(session);

    if (refs.loginForm) {
      refs.loginForm.reset();
    }

    setAuthStatus("");
    applyAuthenticatedSession(session);
  }

  function isDoctorCfmConfigured() {
    return state.authProvider === "api"
      && Boolean(state.authBootstrap && state.authBootstrap.cfmValidationConfigured);
  }

  function buildLocalUserRecord({
    company,
    companyCnpj = "",
    username,
    passwordHash,
    role,
    status,
    expiresAt,
    contactName = "",
    email = "",
    paymentStatus = "approved",
    paymentDueAt = null,
    planId = "individual_25",
    notes = "",
    usageCount = 0,
    lastAccessAt = null,
    accountType = "company",
    crmNumber = "",
    crmState = "",
    doctorCpf = "",
    doctorBirthDate = "",
    crmValidated = false,
    responsibilityMode = "",
    linkedCompanyId = "",
    linkedCompanyDoctorId = "",
    companyLogoDataUrl = "",
    linkedDoctors = [],
    activityLog = [],
    documentHistory = []
  }) {
    const now = new Date().toISOString();
    const plan = role === "admin" ? null : getPlanCatalogById(planId || "individual_25");
    return {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      company,
      companyCnpj: String(companyCnpj || "").replace(/\D/g, "").slice(0, 14),
      contactName,
      email,
      username,
      usernameKey: normalizeUserIdentifier(username),
      passwordHash,
      role,
      status: normalizeLocalStatus(status),
      expiresAt,
      paymentStatus: role === "admin" ? "approved" : normalizeLocalPaymentStatus(paymentStatus),
      paymentDueAt: role === "admin" ? null : paymentDueAt,
      paymentLastApprovedAt: role === "admin" || paymentStatus === "approved" ? now : null,
      planId: role === "admin" ? "internal" : (plan ? plan.id : "individual_25"),
      planLabel: role === "admin" ? "Administracao interna" : (plan ? plan.label : "Individual Essencial"),
      planPriceCents: role === "admin" ? 0 : Number(plan && plan.priceCents ? plan.priceCents : 0),
      billingCycleMonths: role === "admin" ? 0 : Number(plan && plan.months ? plan.months : 0),
      planLaudoLimit: role === "admin" ? null : Number(plan && plan.laudoLimit ? plan.laudoLimit : 0),
      usageCount: Number(usageCount || 0),
      lastAccessAt,
      notes,
      accountType: normalizeAccountType(accountType),
      crmNumber: String(crmNumber || "").replace(/\D/g, ""),
      crmState: String(crmState || "").toUpperCase(),
      doctorCpf: String(doctorCpf || "").replace(/\D/g, ""),
      doctorBirthDate: String(doctorBirthDate || ""),
      crmValidated: Boolean(crmValidated),
      responsibilityMode: normalizeResponsibilityMode(responsibilityMode),
      linkedCompanyId: String(linkedCompanyId || "").trim(),
      linkedCompanyDoctorId: String(linkedCompanyDoctorId || "").trim(),
      companyLogoDataUrl: String(companyLogoDataUrl || ""),
      linkedDoctors: normalizeCompanySessionDoctors(linkedDoctors),
      activityLog: normalizeCompanySessionActivities(activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(documentHistory, Number(usageCount || 0)),
      createdAt: now,
      updatedAt: now
    };
  }

  function buildLocalSessionUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status,
      paymentStatus: user.paymentStatus || "approved",
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || null,
      planLabel: user.planLabel || "",
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      accountType: normalizeAccountType(user.accountType),
      crmNumber: user.crmNumber || "",
      crmState: user.crmState || "",
      crmValidated: Boolean(user.crmValidated),
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      linkedDoctors: normalizeCompanySessionDoctors(user.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(user.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(user.documentHistory, Number(user.usageCount || 0))
    };
  }

  function serializeLocalUser(user) {
    const plan = user.role === "admin" ? null : getPlanCatalogById(user.planId || "individual_25");
    const planBillingModel = user.role === "admin"
      ? "internal"
      : normalizeClientPlanBillingModel(user.planBillingModel || (plan ? plan.billingModel : "one_time"));
    const planLaudoLimit = user.planLaudoLimit === null || user.planLaudoLimit === undefined
      ? (plan && plan.laudoLimit !== undefined ? plan.laudoLimit : null)
      : Number(user.planLaudoLimit);
    const currentCycleUsageCount = Math.max(0, Number(user.currentCycleUsageCount !== undefined ? user.currentCycleUsageCount : user.usageCount || 0));
    const quotaPeriod = user.role === "admin"
      ? "none"
      : normalizeClientPlanQuotaPeriod(user.planQuotaPeriod || (plan ? plan.quotaPeriod : ""), planBillingModel, planLaudoLimit);
    const remainingLaudos = planLaudoLimit === null || planLaudoLimit === undefined
      ? null
      : Math.max(0, Number(planLaudoLimit || 0) - currentCycleUsageCount);
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status || "active",
      paymentStatus: user.role === "admin" ? "approved" : normalizeLocalPaymentStatus(user.paymentStatus),
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || (user.role === "admin" ? "internal" : "individual_25"),
      planLabel: user.planLabel || (user.role === "admin" ? "Administracao interna" : ((getPlanCatalogById(user.planId || "individual_25") || {}).label || "Individual Essencial")),
      planPriceCents: Number(user.planPriceCents || 0),
      billingCycleMonths: Number(user.billingCycleMonths || 0),
      planLaudoLimit: user.planLaudoLimit === null || user.planLaudoLimit === undefined ? null : Number(user.planLaudoLimit),
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      notes: user.notes || "",
      expiresAt: user.expiresAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      accountType: normalizeAccountType(user.accountType),
      crmNumber: user.crmNumber || "",
      crmState: user.crmState || "",
      doctorCpf: user.doctorCpf || "",
      doctorBirthDate: user.doctorBirthDate || "",
      crmValidated: Boolean(user.crmValidated),
      responsibilityMode: normalizeResponsibilityMode(user.responsibilityMode),
      linkedCompanyId: user.linkedCompanyId || "",
      linkedCompanyDoctorId: user.linkedCompanyDoctorId || "",
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      linkedDoctors: normalizeCompanySessionDoctors(user.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(user.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(user.documentHistory, Number(user.usageCount || 0)),
      canAccess: user.role === "admin" ? user.status === "active" : !getLocalAccessError(user)
    };
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    const companyCnpj = refs.registerCompanyCnpj ? refs.registerCompanyCnpj.value.replace(/\D/g, "") : "";
    const contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const planId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = getPlanCatalogById(planId);

    if (!company || !contactName || !email || !username || !password || !passwordConfirm) {
      setAuthStatus("Preencha empresa, responsavel, e-mail, usuario, senha e confirmacao para criar a conta.");
      return;
    }

    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail valido para a conta empresarial.");
      return;
    }

    if (!isDoctorJourney && companyCnpj.length !== 14) {
      setAuthStatus("Informe um CNPJ vÃ¡lido com 14 dÃ­gitos para concluir o cadastro empresarial.");
      return;
    }
    if (!plan) {
      setAuthStatus("Selecione um plano valido para continuar.");
      return;
    }

    if (password.length < 6) {
      setAuthStatus("A senha da empresa precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== passwordConfirm) {
      setAuthStatus("A confirmacao da senha nao confere.");
      return;
    }

    if (state.authProvider === "api") {
      try {
        setAuthStatus(isDoctorJourney
          ? "Criando a conta médica e preparando o checkout comercial..."
          : "Criando a conta e preparando o checkout comercial...");
        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            companyCnpj,
            contactName,
            email,
            username,
            password,
            planId: plan.id
          }
        });

        if (refs.registerForm) {
          refs.registerForm.reset();
        }
        populatePlanSelects();
        if (refs.loginUsername) {
          refs.loginUsername.value = username;
        }

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkoutUrl = response && response.checkout
          ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
          : "";

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          setAuthStatus(popup
            ? "Conta criada com sucesso. O checkout do Mercado Pago foi aberto em nova guia para liberar o acesso."
            : "Conta criada com sucesso. Abra o checkout do Mercado Pago liberado pelo sistema para concluir a ativacao.");
        } else {
          setAuthStatus(response.message || "Conta criada. Configure o Mercado Pago para concluir a liberacao automatica.");
        }
      } catch (error) {
        setAuthStatus(error.message || "Nao foi possivel criar a conta empresarial neste momento.");
      }
      return;
    }

    if (isDoctorJourney) {
      setAuthStatus("O plano m\u00e9dico exige valida\u00e7\u00e3o online no CFM e s\u00f3 pode ser contratado com o backend publicado e configurado.");
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Ja existe um acesso local com esse usuario.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Ja existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      companyCnpj,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), plan.months),
      planId: plan.id,
      notes: "Conta criada em modo local de demonstracao."
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) {
      refs.registerForm.reset();
    }
    populatePlanSelects();
    setAuthStatus("Conta criada em modo local de demonstracao. O acesso da empresa foi liberado automaticamente.");
    persistLocalSessionUser(buildLocalSessionUser(newUser));
    applyAuthenticatedSession(buildLocalSessionUser(newUser));
  }

  function formatRoleLabel(role) {
    return role === "admin" ? "Administrador" : "Empresa";
  }

  function formatAccountTypeLabel(accountType, role) {
    if (role === "admin") {
      return "Administrador";
    }
    return normalizeAccountType(accountType) === "doctor" ? "Medico" : "Empresa";
  }

  function formatCrmDisplay(crmState, crmNumber) {
    const safeState = String(crmState || "").trim().toUpperCase();
    const safeNumber = String(crmNumber || "").replace(/\D/g, "");

    if (!safeState && !safeNumber) {
      return "Nao informado";
    }
    if (!safeState) {
      return safeNumber || "Nao informado";
    }
    if (!safeNumber) {
      return `CRM/${safeState} nao informado`;
    }
    return `CRM/${safeState} ${safeNumber}`;
  }

  function formatCrmValidationLabel(validated) {
    return validated ? "Validado" : "Pendente";
  }

  function buildCrmStateOptionsHtml(selectedValue = "") {
    const selected = String(selectedValue || "").toUpperCase();
    const states = ["", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    return states.map((stateCode) => {
      const label = stateCode || "Selecione";
      return `<option value="${escapeHtml(stateCode)}"${stateCode === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
    }).join("");
  }

  function formatStatusLabel(status) {
    if (status === "blocked") {
      return "Bloqueado";
    }
    if (status === "inadimplente") {
      return "Inadimplente";
    }
    return "Ativo";
  }

  function formatPaymentStatusLabel(status) {
    if (status === "approved") return "Aprovado";
    if (status === "pending") return "Pendente";
    if (status === "rejected") return "Recusado";
    if (status === "cancelled") return "Cancelado";
    if (status === "expired") return "Vencido";
    return "Nao informado";
  }

  function formatCurrencyCents(value) {
    const amount = Number(value || 0) / 100;
    return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  async function loadInlineAdminUsers() {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Carregando acessos...</div>';

    if (state.authProvider === "api") {
      const response = await apiJson("/api/admin/users");
      const users = Array.isArray(response.users) ? response.users : [];
      state.adminUsersCache = users;

      if (Array.isArray(response.plans) && response.plans.length) {
        state.planCatalog = normalizeClientPlanCatalog(response.plans, { includeInactive: true });
        populatePlanSelects();
      }

      if (refs.adminUsersCount) {
        refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
      }

      if (response.summary) {
        renderAdminDashboardSummary(response.summary);
      }

      renderInlineAdminUsers(users);
      return;
    }

    const users = readLocalUsers().map(serializeLocalUser);
    state.adminUsersCache = users;
    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
    }
    renderAdminDashboardSummary(computeLocalDashboardSummary(users));
    renderInlineAdminUsers(users);
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const planLabel = user.role === "admin"
        ? "Administracao interna"
        : `${user.planLabel || "Plano nao definido"} (${formatCurrencyCents(user.planPriceCents || 0)})`;

      const card = document.createElement("article");
      card.className = "user-card";
      card.innerHTML = `
        <div class="user-card-head">
          <div>
            <h4>${escapeHtml(user.company || "Empresa nao informada")}</h4>
            <p>${escapeHtml(user.username || "-")} - ${escapeHtml(roleLabel)}</p>
            <p>${escapeHtml(user.contactName || "Sem responsavel informado")} - ${escapeHtml(user.email || "Sem e-mail")}</p>
          </div>
          <span class="user-badge ${escapeHtml(user.status || "active")}">${escapeHtml(statusLabel)}</span>
        </div>

        <div class="user-meta">
          <div class="meta-box">
            <strong>Plano</strong>
            <span>${escapeHtml(planLabel)}</span>
          </div>
          <div class="meta-box">
            <strong>Pagamento</strong>
            <span>${escapeHtml(paymentLabel)}</span>
          </div>
          <div class="meta-box">
            <strong>Laudos</strong>
            <span>${escapeHtml(String(Number(user.usageCount || 0)))}</span>
          </div>
          <div class="meta-box">
            <strong>Criado em</strong>
            <span>${escapeHtml(formatInlineAdminDateTime(user.createdAt))}</span>
          </div>
          <div class="meta-box">
            <strong>Ultimo acesso</strong>
            <span>${escapeHtml(formatInlineAdminDateTime(user.lastAccessAt))}</span>
          </div>
          <div class="meta-box">
            <strong>Vencimento</strong>
            <span>${escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt))}</span>
          </div>
        </div>

        ${state.authProvider === "api" && user.role !== "admin" ? `
          <div class="admin-user-quick-actions">
            <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar link Mercado Pago</button>
          </div>
        ` : ""}

        <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
          <label class="field">
            <span>Empresa</span>
            <input type="text" name="company" value="${escapeHtml(user.company || "")}">
          </label>

          <label class="field">
            <span>Responsavel</span>
            <input type="text" name="contactName" value="${escapeHtml(user.contactName || "")}">
          </label>

          <label class="field">
            <span>E-mail</span>
            <input type="email" name="email" value="${escapeHtml(user.email || "")}">
          </label>

          <label class="field">
            <span>Usuario</span>
            <input type="text" name="username" value="${escapeHtml(user.username || "")}">
          </label>

          <label class="field">
            <span>Perfil</span>
            <select name="role">
              <option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option>
              <option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option>
            </select>
          </label>

          <label class="field">
            <span>Status</span>
            <select name="status">
              <option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option>
              <option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option>
              <option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option>
            </select>
          </label>

          <label class="field">
            <span>Pagamento</span>
            <select name="paymentStatus">
              <option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option>
              <option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option>
              <option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option>
              <option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option>
              <option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option>
            </select>
          </label>

          <label class="field">
            <span>Plano</span>
            <select name="planId">
              ${buildPlanOptionsHtml(user.planId || "mensal", true)}
            </select>
          </label>

          <label class="field">
            <span>Vencimento</span>
            <input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}">
          </label>

          <label class="field">
            <span>Nova senha</span>
            <input type="password" name="password" placeholder="Preencha apenas se quiser trocar">
          </label>

          <label class="field field-full">
            <span>Observacoes</span>
            <textarea name="notes" rows="3">${escapeHtml(user.notes || "")}</textarea>
          </label>

          <div class="form-actions field-full">
            <button class="primary-button" type="submit">Salvar alteracoes</button>
          </div>
        </form>

        <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
      `;

      refs.adminUsersGrid.appendChild(card);
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  async function handleInlineAdminCreateUser(event) {
    event.preventDefault();

    const payload = {
      company: refs.adminCompany ? refs.adminCompany.value.trim() : "",
      contactName: refs.adminContactName ? refs.adminContactName.value.trim() : "",
      email: refs.adminEmail ? refs.adminEmail.value.trim().toLowerCase() : "",
      username: refs.adminUsername ? refs.adminUsername.value.trim() : "",
      password: refs.adminPassword ? refs.adminPassword.value : "",
      role: refs.adminRole ? refs.adminRole.value : "buyer",
      status: refs.adminStatus ? refs.adminStatus.value : "active",
      paymentStatus: refs.adminPaymentStatus ? refs.adminPaymentStatus.value : "pending",
      paymentDueAt: refs.adminPaymentDueAt && refs.adminPaymentDueAt.value ? refs.adminPaymentDueAt.value : null,
      planId: refs.adminPlan ? refs.adminPlan.value : "",
      notes: refs.adminNotes ? refs.adminNotes.value.trim() : ""
    };

    if (!payload.company || !payload.username || !payload.password) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Preencha empresa, usuario e senha inicial para criar o acesso.";
      return;
    }

    if (payload.password.length < 6) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "A senha inicial precisa ter pelo menos 6 caracteres.";
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson("/api/admin/users", { method: "POST", body: payload });

        if (refs.createUserForm) refs.createUserForm.reset();
        populatePlanSelects();
        if (refs.adminRole) refs.adminRole.value = "buyer";
        if (refs.adminStatus) refs.adminStatus.value = "active";
        if (refs.adminPaymentStatus) refs.adminPaymentStatus.value = "pending";
        if (response.summary) renderAdminDashboardSummary(response.summary);
        if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Acesso criado com sucesso.";
        state.adminExpandedUserId = response && response.user && response.user.id ? response.user.id : "";
        setAdminView("users");
        await loadInlineAdminUsers();
      } catch (error) {
        if (refs.adminStatusNote) refs.adminStatusNote.textContent = error.message || "Nao foi possivel criar o acesso.";
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(payload.username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Ja existe um acesso com esse usuario neste navegador.";
      return;
    }
    if (payload.email && users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(payload.email))) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Ja existe um acesso com esse e-mail neste navegador.";
      return;
    }

    const passwordHash = await buildAuthHash(payload.password);
    const plan = getPlanCatalogById(payload.planId || "mensal");
    const newUser = buildLocalUserRecord({
      company: payload.company,
      username: payload.username,
      passwordHash,
      role: payload.role === "admin" ? "admin" : "buyer",
      status: payload.role === "admin" ? "active" : normalizeLocalStatus(payload.status),
      expiresAt: null,
      contactName: payload.contactName,
      email: payload.email,
      paymentStatus: payload.role === "admin" ? "approved" : normalizeLocalPaymentStatus(payload.paymentStatus),
      paymentDueAt: payload.role === "admin"
        ? null
        : (payload.paymentDueAt ? new Date(payload.paymentDueAt).toISOString() : addMonthsToIso(new Date(), plan ? plan.months : 1)),
      planId: payload.role === "admin" ? "internal" : (plan ? plan.id : "mensal"),
      notes: payload.notes
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.createUserForm) refs.createUserForm.reset();
    populatePlanSelects();
    if (refs.adminRole) refs.adminRole.value = "buyer";
    if (refs.adminStatus) refs.adminStatus.value = "active";
    if (refs.adminPaymentStatus) refs.adminPaymentStatus.value = "pending";
    if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Acesso criado com sucesso.";
    state.adminExpandedUserId = newUser.id;
    setAdminView("users");
    await loadInlineAdminUsers();
  }

  async function handleInlineAdminUpdateUser(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const userId = form && form.dataset ? form.dataset.inlineUserId : "";
    const note = document.querySelector(`[data-inline-user-note="${CSS.escape(userId)}"]`);
    const formData = new FormData(form);
    const payload = {
      company: String(formData.get("company") || "").trim(),
      contactName: String(formData.get("contactName") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      username: String(formData.get("username") || "").trim(),
      role: String(formData.get("role") || ""),
      status: String(formData.get("status") || ""),
      paymentStatus: String(formData.get("paymentStatus") || ""),
      paymentDueAt: String(formData.get("paymentDueAt") || ""),
      planId: String(formData.get("planId") || ""),
      notes: String(formData.get("notes") || "").trim(),
      password: String(formData.get("password") || "")
    };

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          body: payload
        });

        if (response.summary) renderAdminDashboardSummary(response.summary);
        if (note) note.textContent = "Alteracoes salvas com sucesso.";
        await loadInlineAdminUsers();
      } catch (error) {
        if (note) note.textContent = error.message || "Nao foi possivel salvar as alteracoes.";
      }
      return;
    }

    const users = readLocalUsers();
    const index = users.findIndex((item) => item.id === userId);
    if (index === -1) {
      if (note) note.textContent = "Usuario nao localizado.";
      return;
    }

    if (!payload.company || !payload.username) {
      if (note) note.textContent = "Empresa e usuario sao obrigatorios.";
      return;
    }

    const usernameKey = normalizeUserIdentifier(payload.username);
    const duplicatedUser = users.some((item) => item.id !== userId && item.usernameKey === usernameKey);
    if (duplicatedUser) {
      if (note) note.textContent = "Ja existe outro acesso com esse usuario.";
      return;
    }

    if (payload.email) {
      const duplicatedEmail = users.some((item) => item.id !== userId && normalizeUserIdentifier(item.email) === normalizeUserIdentifier(payload.email));
      if (duplicatedEmail) {
        if (note) note.textContent = "Ja existe outro acesso com esse e-mail.";
        return;
      }
    }

    const current = users[index];
    const role = payload.role === "admin" ? "admin" : "buyer";
    const plan = role === "admin" ? null : getPlanCatalogById(payload.planId || current.planId || "mensal");
    const updated = {
      ...current,
      company: payload.company,
      contactName: payload.contactName,
      email: payload.email,
      username: payload.username,
      usernameKey,
      role,
      status: role === "admin" ? "active" : normalizeLocalStatus(payload.status),
      paymentStatus: role === "admin" ? "approved" : normalizeLocalPaymentStatus(payload.paymentStatus),
      paymentDueAt: role === "admin"
        ? null
        : (payload.paymentDueAt ? new Date(payload.paymentDueAt).toISOString() : current.paymentDueAt),
      planId: role === "admin" ? "internal" : (plan ? plan.id : "mensal"),
      planLabel: role === "admin" ? "Administracao interna" : (plan ? plan.label : current.planLabel),
      planPriceCents: role === "admin" ? 0 : (plan ? Number(plan.priceCents || 0) : Number(current.planPriceCents || 0)),
      billingCycleMonths: role === "admin" ? 0 : (plan ? Number(plan.months || 0) : Number(current.billingCycleMonths || 0)),
      planLaudoLimit: role === "admin" ? null : (plan ? Number(plan.laudoLimit || 0) : current.planLaudoLimit),
      notes: payload.notes,
      updatedAt: new Date().toISOString()
    };

    if (payload.password) {
      if (payload.password.length < 6) {
        if (note) note.textContent = "A nova senha precisa ter pelo menos 6 caracteres.";
        return;
      }
      updated.passwordHash = await buildAuthHash(payload.password);
    }

    users[index] = updated;
    writeLocalUsers(users);

    if (state.sessionUser && state.sessionUser.id === updated.id) {
      const nextSession = buildLocalSessionUser(updated);
      persistLocalSessionUser(nextSession);
      applyAuthenticatedSession(nextSession);
    }

    if (note) note.textContent = "Alteracoes salvas com sucesso.";
    await loadInlineAdminUsers();
  }

  function toggleInlineAdminUser(userId) {
    state.adminExpandedUserId = state.adminExpandedUserId === userId ? "" : userId;
    renderInlineAdminUsers(state.adminUsersCache || []);
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const statusClass = escapeHtml(user.status || "active");
      const paymentClass = escapeHtml(normalizeLocalPaymentStatus(user.paymentStatus || "pending"));
      const planLabel = user.role === "admin"
        ? "Administracao interna"
        : `${toPresentationText(user.planLabel || "Plano nao definido")} (${formatCurrencyCents(user.planPriceCents || 0)})`;
      const expanded = state.adminExpandedUserId === user.id;

      const card = document.createElement("article");
      card.className = `admin-user-row${expanded ? " is-open" : ""}`;
      card.innerHTML = `
        <button class="admin-user-toggle" type="button" data-admin-user-toggle="${escapeHtml(user.id)}" aria-expanded="${expanded ? "true" : "false"}">
          <div class="admin-user-main">
            <strong>${escapeHtml(toPresentationText(user.company || "Empresa nao informada"))}</strong>
            <span>${escapeHtml(toPresentationText(user.username || "-"))} - ${escapeHtml(roleLabel)}</span>
          </div>

          <div class="admin-user-resume">
            <span class="admin-user-chip">Plano: ${escapeHtml(planLabel)}</span>
            <span class="admin-user-chip">Laudos: ${escapeHtml(String(Number(user.usageCount || 0)))}</span>
            <span class="admin-user-chip">Validade: ${escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt))}</span>
          </div>

          <div class="user-badges">
            <span class="user-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
            <span class="user-badge ${paymentClass}">${escapeHtml(paymentLabel)}</span>
          </div>
        </button>

        <div class="admin-user-detail${expanded ? "" : " hidden"}">
          <div class="user-meta">
            <div class="meta-box"><strong>Contato</strong><span>${escapeHtml(toPresentationText(user.contactName || "Sem responsavel informado"))}</span></div>
            <div class="meta-box"><strong>E-mail</strong><span>${escapeHtml(toPresentationText(user.email || "Sem e-mail"))}</span></div>
            <div class="meta-box"><strong>Ultimo acesso</strong><span>${escapeHtml(formatInlineAdminDateTime(user.lastAccessAt))}</span></div>
            <div class="meta-box"><strong>Criado em</strong><span>${escapeHtml(formatInlineAdminDateTime(user.createdAt))}</span></div>
            <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
            <div class="meta-box"><strong>Perfil</strong><span>${escapeHtml(roleLabel)}</span></div>
          </div>

          ${state.authProvider === "api" && user.role !== "admin" ? `
            <div class="admin-user-quick-actions">
              ${user.mpCheckoutUrl ? `<a class="ghost-button" href="${escapeHtml(user.mpCheckoutUrl)}" target="_blank" rel="noopener">Abrir checkout atual</a>` : ""}
              <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar checkout Mercado Pago</button>
            </div>
          ` : ""}

          <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
            <label class="field"><span>Empresa</span><input type="text" name="company" value="${escapeHtml(toPresentationText(user.company || ""))}"></label>
            <label class="field"><span>Responsavel</span><input type="text" name="contactName" value="${escapeHtml(toPresentationText(user.contactName || ""))}"></label>
            <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(toPresentationText(user.email || ""))}"></label>
            <label class="field"><span>Usuario</span><input type="text" name="username" value="${escapeHtml(toPresentationText(user.username || ""))}"></label>
            <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
            <label class="field"><span>Status do acesso</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
            <label class="field"><span>Status do pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
            <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
            <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
            <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
            <label class="field field-full"><span>Observacoes internas</span><textarea name="notes" rows="3">${escapeHtml(toPresentationText(user.notes || "", true))}</textarea></label>
            <div class="form-actions field-full"><button class="primary-button" type="submit">Salvar alteracoes</button></div>
          </form>

          <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
        </div>
      `;

      refs.adminUsersGrid.appendChild(card);
    });

    refs.adminUsersGrid.querySelectorAll("[data-admin-user-toggle]").forEach((button) => {
      button.addEventListener("click", () => toggleInlineAdminUser(button.dataset.adminUserToggle || ""));
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  async function handleInlineAdminPaymentLink(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.paymentLink : "";
    const note = userId ? document.querySelector(`[data-inline-user-note="${CSS.escape(userId)}"]`) : null;

    if (!userId) {
      return;
    }

    if (state.authProvider !== "api") {
      if (note) note.textContent = "O checkout do Mercado Pago exige o servidor publicado.";
      return;
    }

    try {
      const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}/payment-link`, { method: "POST" });
      const checkoutUrl = response && response.checkout
        ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
        : "";

      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank", "noopener");
      }

      if (note) {
        note.textContent = checkoutUrl
          ? "Link de pagamento gerado com sucesso."
          : "Link preparado, mas o checkout nao retornou uma URL valida.";
      }

      await loadInlineAdminUsers();
    } catch (error) {
      if (note) note.textContent = error.message || "Nao foi possivel gerar o link de pagamento.";
    }
  }

  async function handleLocalAccessReset() {
    setAuthStatus("A reconfiguração manual do acesso local foi desativada nesta instalação.");
  }

  function buildLocalUserRecord({
    company,
    companyCnpj = "",
    username,
    passwordHash,
    role,
    status,
    expiresAt,
    contactName = "",
    email = "",
    paymentStatus = "approved",
    paymentDueAt = null,
    planId = "mensal",
    notes = "",
    usageCount = 0,
    lastAccessAt = null
  }) {
    const now = new Date().toISOString();
    const plan = role === "admin" ? null : getPlanCatalogById(planId || "mensal");
    return {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      company,
      contactName,
      email,
      username,
      usernameKey: normalizeUserIdentifier(username),
      passwordHash,
      role,
      status: normalizeLocalStatus(status),
      expiresAt,
      paymentStatus: role === "admin" ? "approved" : normalizeLocalPaymentStatus(paymentStatus),
      paymentDueAt: role === "admin" ? null : paymentDueAt,
      paymentLastApprovedAt: role === "admin" || paymentStatus === "approved" ? now : null,
      planId: role === "admin" ? "internal" : (plan ? plan.id : "mensal"),
      planLabel: role === "admin" ? "Administracao interna" : (plan ? plan.label : "Plano Mensal"),
      planPriceCents: role === "admin" ? 0 : Number(plan && plan.priceCents ? plan.priceCents : 0),
      billingCycleMonths: role === "admin" ? 0 : Number(plan && plan.months ? plan.months : 0),
      planLaudoLimit: role === "admin" ? null : Number(plan && plan.laudoLimit ? plan.laudoLimit : 0),
      usageCount: Number(usageCount || 0),
      lastAccessAt,
      notes,
      createdAt: now,
      updatedAt: now
    };
  }

  function buildLocalSessionUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status,
      paymentStatus: user.paymentStatus || "approved",
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || null,
      planLabel: user.planLabel || "",
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin"
    };
  }

  function serializeLocalUser(user) {
    return {
      id: user.id,
      company: user.company,
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status || "active",
      paymentStatus: user.role === "admin" ? "approved" : normalizeLocalPaymentStatus(user.paymentStatus),
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || (user.role === "admin" ? "internal" : "mensal"),
      planLabel: user.planLabel || (user.role === "admin" ? "Administracao interna" : ((getPlanCatalogById(user.planId || "mensal") || {}).label || "Plano Mensal")),
      planPriceCents: Number(user.planPriceCents || 0),
      billingCycleMonths: Number(user.billingCycleMonths || 0),
      planLaudoLimit: user.planLaudoLimit === null || user.planLaudoLimit === undefined ? null : Number(user.planLaudoLimit),
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      notes: user.notes || "",
      expiresAt: user.expiresAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      canAccess: user.role === "admin" ? user.status === "active" : !getLocalAccessError(user)
    };
  }

  async function incrementUsageCounter() {
    if (!state.sessionUser || state.sessionUser.role === "admin" || state.sessionUser.isAdmin) {
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson("/api/usage/laudos", { method: "POST" });
        if (response && response.user) {
          state.sessionUser = response.user;
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    const users = readLocalUsers();
    const index = users.findIndex((item) => item.id === state.sessionUser.id);
    if (index === -1) {
      return;
    }

    users[index] = {
      ...users[index],
      usageCount: Number(users[index].usageCount || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    if (normalizeAccountType(users[index].accountType) === "doctor") {
      const companyIndex = users.findIndex((item) => item.id !== users[index].id
        && item.role === "buyer"
        && normalizeAccountType(item.accountType) === "company"
        && String(item.company || "").trim().toLowerCase() === String(users[index].company || "").trim().toLowerCase());

      if (companyIndex >= 0) {
        const companyUser = users[companyIndex];
        const doctorName = users[index].contactName || users[index].username || "Médico responsável";
        users[companyIndex] = {
          ...companyUser,
          usageCount: Number(companyUser.usageCount || 0) + 1,
          activityLog: appendCompanySessionActivity(companyUser, {
            doctorName,
            action: "Documento registrado no ecossistema da empresa"
          }),
          documentHistory: normalizeCompanySessionDocumentHistory([
            ...(Array.isArray(companyUser.documentHistory) ? companyUser.documentHistory : []),
            {
              id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              date: new Date().toISOString().slice(0, 10),
              count: 1,
              doctorName,
              source: "doctor"
            }
          ], Number(companyUser.usageCount || 0) + 1),
          updatedAt: new Date().toISOString()
        };
      }
    }

    writeLocalUsers(users);

    const nextSession = buildLocalSessionUser(users[index]);
    persistLocalSessionUser(nextSession);
    state.sessionUser = nextSession;
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final so pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const externalFiles = collectExternalReportFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliacao");
    if (!identity.examiner) missing.push("profissional responsavel");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatorios para emissao do laudo: ${missing.join(", ")}.`);
      return;
    }

    try {
      const attachments = externalFiles.length ? await buildAttachmentPayloads(externalFiles) : [];
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura da janela de impressao. Permita pop-ups desta pagina e tente novamente.");
        return;
      }

      await incrementUsageCounter();
    } catch (error) {
      console.error(error);
      window.alert(`Nao foi possivel preparar a impressao do laudo neste momento.${error && error.message ? `\n\nDetalhe tecnico: ${toAsciiSafeText(error.message)}` : ""}`);
    }
  }

  function fixBrokenText(value) {
    let text = String(value || "");
    const replacements = [
      ["Ã¡", "á"], ["Ãà", "à"], ["Ãâ", "â"], ["Ãã", "ã"], ["Ãª", "ê"], ["Ã©", "é"], ["Ã¨", "è"],
      ["Ã­", "í"], ["Ã¬", "ì"], ["Ã³", "ó"], ["Ã²", "ò"], ["Ã´", "ô"], ["Ãµ", "õ"],
      ["Ãº", "ú"], ["Ã§", "ç"], ["Ã‰", "É"], ["ÃŠ", "Ê"], ["Ã“", "Ó"], ["Ãš", "Ú"],
      ["Ã‡", "Ç"], ["Â°", "°"], ["Âº", "º"], ["Âª", "ª"], ["Â", ""], ["â€¢", "-"],
      ["â€“", "-"], ["â€”", "-"], ["â€˜", "'"], ["â€™", "'"], ["â€œ", "\""], ["â€", "\""]
    ];
    replacements.forEach(([from, to]) => {
      text = text.split(from).join(to);
    });
    return text;
  }

  function toAsciiSafeText(value) {
    const fixed = fixBrokenText(value);
    return fixed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function ensurePrintSentence(value) {
    const text = toAsciiSafeText(value);
    if (!text) {
      return "";
    }
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }

  function parseFontSize(fontValue, fallback = 11) {
    const match = String(fontValue || "").match(/(\d+(?:\.\d+)?)px/);
    return match ? Number(match[1]) : fallback;
  }

  function buildOverlayText(x, y, width, font, text, options = {}) {
    const fontSize = parseFontSize(font, options.fontSize || 11);
    const weight = String(font || "").includes("700") ? 700 : 400;
    const top = (options.top !== undefined ? options.top : (y + ((options.paddingY || 0) - fontSize)));
    return `<div class="overlay-field" style="left:${x}px;top:${top}px;width:${width}px;font:${weight} ${fontSize}px Arial;">${escapeHtml(toAsciiSafeText(text))}</div>`;
  }

  function buildOverlayParagraph(x, y, width, height, text, fontSize = 11, weight = 400) {
    return `<div class="overlay-field overlay-paragraph" style="left:${x}px;top:${y}px;width:${width}px;height:${height}px;font:${weight} ${fontSize}px Arial;">${escapeHtml(toAsciiSafeText(text))}</div>`;
  }

  function buildOverlayMark(x, y, size = 8) {
    return `<span class="overlay-mark" style="left:${x - (size / 2)}px;top:${y - (size / 2)}px;width:${size}px;height:${size}px;"></span>`;
  }

  function normalizedChoiceKey(value) {
    return toAsciiSafeText(String(value || "")).toLowerCase();
  }

  function buildCharacterizationReport(payload) {
    const attachments = collectExternalReportFiles();
    const reportSections = [
      "Apos analise tecnico-funcional dos dados clinicos estruturados e dos criterios aplicaveis ao caso, conclui-se pelo enquadramento como pessoa com deficiencia para fins de caracterizacao ocupacional.",
      `Descricao da deficiencia e CID: ${toAsciiSafeText(payload.description || "")}`,
      `Limitacoes funcionais: ${toAsciiSafeText(payload.limitations || "")}`,
      `Conclusao tecnico-funcional: ${toAsciiSafeText(payload.message || "")}`
    ];

    if (payload.supportNote) {
      reportSections.push(`Observacoes tecnicas e documentacao complementar: ${toAsciiSafeText(payload.supportNote)}`);
    }

    if (attachments.length) {
      reportSections.push(`Documentos externos vinculados ao caso: ${attachments.map((file) => toAsciiSafeText(file.name)).join(", ")}.`);
    }

    return reportSections.join("\n\n");
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final so pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const externalFiles = collectExternalReportFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliacao");
    if (!identity.examiner) missing.push("profissional responsavel");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatorios para emissao do laudo: ${missing.join(", ")}.`);
      return;
    }

    try {
      const attachments = externalFiles.length ? await buildAttachmentPayloads(externalFiles) : [];
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura da janela de impressao. Permita pop-ups desta pagina e tente novamente.");
      }
    } catch (error) {
      console.error(error);
      window.alert(`Nao foi possivel preparar a impressao do laudo neste momento.${error && error.message ? `\n\nDetalhe tecnico: ${toAsciiSafeText(error.message)}` : ""}`);
    }
  }

  function buildPdfPayload(identity, result, attachments = []) {
    return {
      title: "LAUDO CARACTERIZADOR DE PESSOA COM DEFICIENCIA",
      moduleLabel: moduleConfigs[state.activeModule] ? toAsciiSafeText(moduleConfigs[state.activeModule].title) : "Modulo nao especificado",
      identity,
      result,
      attachments,
      technicalBasis: toAsciiSafeText(buildTechnicalBasisText(state.activeModule, result)),
      generatedAt: new Date()
    };
  }

  function updateExternalFilesUI() {
    if (!refs.reportExternalFilesStatus || !refs.reportExternalFilesList) {
      return;
    }

    const files = collectExternalReportFiles();
    refs.reportExternalFilesList.innerHTML = "";

    if (!files.length) {
      refs.reportExternalFilesStatus.textContent = "Nenhum documento anexado no momento. O anexo e opcional.";
      const emptyState = document.createElement("div");
      emptyState.className = "attachment-empty";
      emptyState.textContent = "Se quiser, anexe laudos externos ou exames complementares para sair junto com a impressao.";
      refs.reportExternalFilesList.appendChild(emptyState);
      return;
    }

    refs.reportExternalFilesStatus.textContent = `${files.length} documento(s) pronto(s) para compor o pacote final de impressao.`;

    files.forEach((file, index) => {
      const item = document.createElement("article");
      item.className = "attachment-item";

      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${toAsciiSafeText(file.name)}`;

      const detail = document.createElement("span");
      const fileType = file.type ? file.type : inferMimeTypeFromName(file.name);
      detail.textContent = `${describeAttachmentKind(fileType)} - ${formatFileSize(file.size)}`;

      item.appendChild(title);
      item.appendChild(detail);
      refs.reportExternalFilesList.appendChild(item);
    });
  }

  function formatFileSize(size) {
    const numeric = Number(size || 0);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return "tamanho nao informado";
    }
    if (numeric < 1024) {
      return `${numeric} B`;
    }
    if (numeric < 1024 * 1024) {
      return `${(numeric / 1024).toFixed(1)} KB`;
    }
    return `${(numeric / (1024 * 1024)).toFixed(2)} MB`;
  }

  function buildOfficialDescriptionText(payload) {
    const cid = toAsciiSafeText(formatCid(resolveCurrentCid()));

    if (state.activeModule === "auditiva") {
      const odAverage = getAudiometryAverage("OD");
      const oeAverage = getAudiometryAverage("OE");
      const rightTotal = odAverage > 95;
      const leftTotal = oeAverage > 95;
      if (rightTotal || leftTotal) {
        const side = rightTotal ? "direita" : "esquerda";
        return `Surdez unilateral total em orelha ${side}, audiometria sem aparelho, medias de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE. CID: ${cid}.`;
      }
      return `Deficiencia auditiva bilateral parcial, audiometria sem aparelho, medias de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE. CID: ${cid}.`;
    }

    if (state.activeModule === "fisica") {
      const choice = normalizedChoiceKey(valueOf("physicalConditionType"));
      const scope = valueOf("physicalAmputationScope");
      const laterality = valueOf("physicalLaterality");
      const segmentText = choice.includes("amput")
        ? toAsciiSafeText(composeAmputationFinding(scope, laterality, collectAmputationDetail(), valueOf("physicalAmputationLevel")))
        : toAsciiSafeText(composeSegment(resolvePhysicalSegment(), laterality));
      return `Deficiencia fisica permanente por ${choice || "alteracao fisica"} em ${segmentText}. CID: ${cid}.`;
    }

    if (state.activeModule === "visual") {
      return `Deficiencia visual permanente com ${buildOfficialVisualSummary()}. CID: ${cid}.`;
    }

    if (state.activeModule === "clinicas") {
      const condition = toAsciiSafeText(normalizedText("clinicalCondition"));
      const grade = toAsciiSafeText(valueOf("clinicalLimitationGrade") || "relevante");
      return `Condicao clinica persistente compativel com ${condition}, com limitacao funcional ${grade}. CID: ${cid}.`;
    }

    if (state.activeModule === "intelectual") {
      const supportNeed = toAsciiSafeText(labelForSelectValue("intellectualSupportNeed").toLowerCase() || "relevante");
      return `Deficiencia intelectual permanente, com comprometimento adaptativo e necessidade de suporte ${supportNeed}. CID: ${cid}.`;
    }

    if (state.activeModule === "psicossocial") {
      return `Deficiencia mental ou psicossocial persistente, com restricao relevante de participacao social e laboral. CID: ${cid}.`;
    }

    return toAsciiSafeText(payload.result.description || "");
  }

  function buildOfficialLimitationsText(payload) {
    if (state.activeModule === "auditiva") {
      const summary = summarizeLabelsForLaudo(checkedLabels("audioImpactMarker"), 3);
      return ensurePrintSentence(summary || "Prejuizo para compreensao da fala, comunicacao em ruido e percepcao de alertas sonoros");
    }

    if (state.activeModule === "fisica") {
      const grade = toAsciiSafeText(functionalDegreeText(valueOf("physicalImpactGrade") || "moderado"));
      const summary = summarizeLabelsForLaudo(checkedLabels("physicalFunctionItem"), 4);
      return ensurePrintSentence(`Limitacao funcional ${grade}, com ${summary || "restricao para execucao de tarefas e movimentos do segmento acometido"}`);
    }

    if (state.activeModule === "visual") {
      const summary = summarizeLabelsForLaudo(checkedLabels("visualMarker"), 3);
      return ensurePrintSentence(summary || "Dificuldade para leitura, orientacao espacial e deslocamento com seguranca");
    }

    if (state.activeModule === "clinicas") {
      const summary = summarizeLabelsForLaudo(checkedLabels("clinicalMarker"), 4);
      return ensurePrintSentence(summary || "Limitacao funcional persistente em atividades diarias e laborais");
    }

    if (state.activeModule === "intelectual") {
      const summary = summarizeLabelsForLaudo(checkedLabels("intellectualMarker"), 4);
      return ensurePrintSentence(summary || "Dificuldade para compreensao de instrucoes, organizacao de rotina e autonomia funcional");
    }

    if (state.activeModule === "psicossocial") {
      const summary = summarizeLabelsForLaudo(checkedLabels("psychosocialMarker"), 4);
      return ensurePrintSentence(summary || "Restricao de participacao social e laboral em igualdade de condicoes");
    }

    return ensurePrintSentence(payload.result.limitations || "");
  }

  function buildOfficialVisualSummary() {
    const condition = valueOf("visualPrimaryFinding");
    const acuityOD = toAsciiSafeText(labelForSelectValue("visualAcuityOD"));
    const acuityOE = toAsciiSafeText(labelForSelectValue("visualAcuityOE"));
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");

    if (condition === "visao_monocular") {
      return `visao monocular, com acuidade ${acuityOD} em OD e ${acuityOE} em OE`;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60"
        ? "campo visual binocular igual ou menor que 60 graus"
        : "restricao relevante de campo visual";
    }
    return `acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE${fieldChanged === "sim" ? ", associada a alteracao de campo visual" : ""}`;
  }

  async function openOfficialPrintPreview(payload) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return false;
    }

    try {
      const useOverlayMode = window.location.protocol === "file:";
      const html = useOverlayMode
        ? buildOfficialOverlayPrintHtml(payload)
        : buildOfficialPrintHtml(await buildOfficialLaudoImageDataUrl(payload), payload);

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.addEventListener("beforeunload", () => cleanupAttachmentPayloads(payload.attachments || []), { once: true });
      window.setTimeout(() => cleanupAttachmentPayloads(payload.attachments || []), 10 * 60 * 1000);
      return true;
    } catch (error) {
      console.error(error);
      const html = buildOfficialOverlayPrintHtml(payload);
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.addEventListener("beforeunload", () => cleanupAttachmentPayloads(payload.attachments || []), { once: true });
      window.setTimeout(() => cleanupAttachmentPayloads(payload.attachments || []), 10 * 60 * 1000);
      return true;
    }
  }

  function buildOfficialPrintHtml(imageDataUrl, payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const attachmentSummary = buildAttachmentSummaryHtml(attachments);
    const attachmentSheets = buildAttachmentPrintSheetsHtml(attachments);
    const printDelay = attachments.length ? 1200 : 450;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador</title>
  <style>
    @page { size: Letter portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #edf3f8; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; color: #152433; }
    .bundle-shell { display: grid; justify-content: center; gap: 24px; padding: 24px; }
    .sheet { width: 816px; min-height: 1056px; background: #ffffff; box-shadow: 0 18px 42px rgba(21, 36, 51, 0.14); page-break-after: always; break-after: page; }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .page-image { display: block; width: 816px; height: auto; }
    .annex-cover { display: grid; align-content: start; gap: 18px; padding: 42px 46px; }
    .annex-cover h2 { margin: 0; font-size: 1.9rem; }
    .annex-cover p { margin: 0; line-height: 1.6; color: #5f7182; }
    .annex-list { display: grid; gap: 12px; margin-top: 6px; }
    .annex-item { display: grid; gap: 4px; padding: 14px 16px; border: 1px solid rgba(32, 61, 90, 0.14); border-radius: 14px; background: #f8fbfd; }
    .annex-item strong { font-size: 0.98rem; }
    .annex-item span { color: #5f7182; line-height: 1.45; }
    .attachment-sheet { display: grid; align-content: start; gap: 14px; padding: 28px 28px 20px; }
    .attachment-head { display: grid; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid rgba(32, 61, 90, 0.14); }
    .attachment-head h3 { margin: 0; font-size: 1.1rem; }
    .attachment-head p { margin: 0; color: #5f7182; line-height: 1.5; }
    .attachment-preview { width: 100%; border: 1px solid rgba(32, 61, 90, 0.12); border-radius: 16px; background: #ffffff; overflow: hidden; min-height: 920px; }
    .attachment-image { display: block; width: 100%; height: auto; max-height: 920px; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 920px; border: 0; display: block; background: #ffffff; }
    .attachment-note { margin: 0; color: #7a5d14; line-height: 1.5; padding: 12px 14px; border-radius: 14px; background: #fff7dd; border: 1px solid rgba(168, 120, 23, 0.18); }
    @media print { body { background: #ffffff; } .bundle-shell { padding: 0; gap: 0; } .sheet { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="sheet official-sheet">
      <img class="page-image" id="pageImage" src="${escapeHtml(imageDataUrl)}" alt="Laudo oficial renderizado">
    </section>
    ${attachmentSummary}
    ${attachmentSheets}
  </div>
  <script>
    const images = Array.from(document.querySelectorAll("img"));
    let pendingImages = images.filter(function (image) { return !image.complete; }).length;
    function triggerPrint() {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, ${printDelay});
    }
    if (!pendingImages) {
      triggerPrint();
    } else {
      images.forEach(function (image) {
        image.addEventListener("load", function () {
          pendingImages -= 1;
          if (pendingImages <= 0) triggerPrint();
        }, { once: true });
        image.addEventListener("error", function () {
          pendingImages -= 1;
          if (pendingImages <= 0) triggerPrint();
        }, { once: true });
      });
    }
  </script>
</body>
</html>`;
  }

  function buildOfficialOverlayPrintHtml(payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const attachmentSummary = buildAttachmentSummaryHtml(attachments);
    const attachmentSheets = buildAttachmentPrintSheetsHtml(attachments);
    const baseSrc = new URL(OFFICIAL_LAUDO_TEMPLATE.imagePath, window.location.href).href;
    const overlayElements = buildOfficialOverlayElements(payload);
    const printDelay = attachments.length ? 1200 : 450;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador</title>
  <style>
    @page { size: Letter portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #edf3f8; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; color: #152433; }
    .bundle-shell { display: grid; justify-content: center; gap: 24px; padding: 24px; }
    .sheet { width: 816px; min-height: 1056px; background: #ffffff; box-shadow: 0 18px 42px rgba(21, 36, 51, 0.14); page-break-after: always; break-after: page; }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .template-sheet { position: relative; overflow: hidden; }
    .template-image { display: block; width: 816px; height: auto; }
    .template-layer { position: absolute; inset: 0; }
    .overlay-field { position: absolute; color: #111111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .overlay-paragraph { white-space: normal; line-height: 1.22; overflow: hidden; }
    .overlay-mark { position: absolute; display: block; background: #111111; }
    .annex-cover { display: grid; align-content: start; gap: 18px; padding: 42px 46px; }
    .annex-cover h2 { margin: 0; font-size: 1.9rem; }
    .annex-cover p { margin: 0; line-height: 1.6; color: #5f7182; }
    .annex-list { display: grid; gap: 12px; margin-top: 6px; }
    .annex-item { display: grid; gap: 4px; padding: 14px 16px; border: 1px solid rgba(32, 61, 90, 0.14); border-radius: 14px; background: #f8fbfd; }
    .annex-item strong { font-size: 0.98rem; }
    .annex-item span { color: #5f7182; line-height: 1.45; }
    .attachment-sheet { display: grid; align-content: start; gap: 14px; padding: 28px 28px 20px; }
    .attachment-head { display: grid; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid rgba(32, 61, 90, 0.14); }
    .attachment-head h3 { margin: 0; font-size: 1.1rem; }
    .attachment-head p { margin: 0; color: #5f7182; line-height: 1.5; }
    .attachment-preview { width: 100%; border: 1px solid rgba(32, 61, 90, 0.12); border-radius: 16px; background: #ffffff; overflow: hidden; min-height: 920px; }
    .attachment-image { display: block; width: 100%; height: auto; max-height: 920px; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 920px; border: 0; display: block; background: #ffffff; }
    .attachment-note { margin: 0; color: #7a5d14; line-height: 1.5; padding: 12px 14px; border-radius: 14px; background: #fff7dd; border: 1px solid rgba(168, 120, 23, 0.18); }
    @media print { body { background: #ffffff; } .bundle-shell { padding: 0; gap: 0; } .sheet { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="sheet template-sheet">
      <img class="template-image" id="pageImage" src="${escapeHtml(baseSrc)}" alt="Formulario oficial">
      <div class="template-layer">${overlayElements}</div>
    </section>
    ${attachmentSummary}
    ${attachmentSheets}
  </div>
  <script>
    const images = Array.from(document.querySelectorAll("img"));
    let pendingImages = images.filter(function (image) { return !image.complete; }).length;
    function triggerPrint() {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, ${printDelay});
    }
    if (!pendingImages) {
      triggerPrint();
    } else {
      images.forEach(function (image) {
        image.addEventListener("load", function () {
          pendingImages -= 1;
          if (pendingImages <= 0) triggerPrint();
        }, { once: true });
        image.addEventListener("error", function () {
          pendingImages -= 1;
          if (pendingImages <= 0) triggerPrint();
        }, { once: true });
      });
    }
  </script>
</body>
</html>`;
  }

  function buildOfficialOverlayElements(payload = {}) {
    const template = OFFICIAL_LAUDO_TEMPLATE;
    const elements = [];
    const workerName = payload.identity && payload.identity.workerName ? payload.identity.workerName : "";
    const cpf = payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : "";
    const cid = resolveCurrentCid() || "nao informado";
    const origin = payload.identity && payload.identity.origin ? payload.identity.origin : inferOriginFromCurrentCase();
    const description = buildOfficialDescriptionText(payload);
    const limitations = buildOfficialLimitationsText(payload);
    const signatureLine = joinSupportNotes([
      payload.identity && payload.identity.examiner ? payload.identity.examiner : "",
      payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : ""
    ]);
    const date = payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "";

    elements.push(buildOverlayText(template.nameField.x, template.nameField.y, template.nameField.width, template.nameField.font, workerName, { paddingY: template.nameField.paddingY }));
    elements.push(buildOverlayText(template.cpfField.x, template.cpfField.y, template.cpfField.width, template.cpfField.font, cpf, { paddingY: template.cpfField.paddingY }));
    elements.push(buildOverlayText(template.cidField.x, template.cidField.y, template.cidField.width, template.cidField.font, cid, { paddingY: template.cidField.paddingY }));
    elements.push(buildOverlayParagraph(template.descriptionRect.x, template.descriptionRect.y, template.descriptionRect.width, template.descriptionRect.height, description, 10.8, 400));
    elements.push(buildOverlayParagraph(template.limitationsRect.x, template.limitationsRect.y, template.limitationsRect.width, template.limitationsRect.height, limitations, 10.8, 400));
    elements.push(buildOverlayText(template.signatureField.x, template.signatureField.y, template.signatureField.width, template.signatureField.font, signatureLine, { paddingY: template.signatureField.paddingY }));
    elements.push(buildOverlayText(template.dateField.x, template.dateField.y, template.dateField.width, template.dateField.font, date, { paddingY: template.dateField.paddingY }));

    const originCoords = template.originMarks[origin];
    if (originCoords) {
      elements.push(buildOverlayMark(originCoords[0], originCoords[1], 7));
    }

    if (state.activeModule === "visual" && valueOf("visualPrimaryFinding") === "visao_monocular") {
      const monocular = template.moduleMarks.monocular;
      elements.push(buildOverlayMark(monocular[0], monocular[1], 7));
    } else {
      const moduleCoords = template.moduleMarks[state.activeModule];
      if (moduleCoords) {
        elements.push(buildOverlayMark(moduleCoords[0], moduleCoords[1], 7));
      }
    }

    if (state.activeModule === "fisica") {
      const choiceKey = normalizedChoiceKey(valueOf("physicalConditionType"));
      const isAmputation = choiceKey.includes("amput");
      const targetMark = isAmputation ? template.physical.amputationMark : template.physical.otherMark;
      elements.push(buildOverlayMark(targetMark[0], targetMark[1], 7));
      elements.push(buildOverlayParagraph(template.physical.otherTextRect.x, template.physical.otherTextRect.y, template.physical.otherTextRect.width, template.physical.otherTextRect.height, buildPhysicalPdfDetail(), 9.8, 400));
    }

    if (state.activeModule === "visual") {
      const finding = valueOf("visualPrimaryFinding");
      if (finding === "cegueira_bilateral") {
        elements.push(buildOverlayMark(template.visual.blindnessMark[0], template.visual.blindnessMark[1], 7));
      } else if (finding === "baixa_visao_bilateral") {
        elements.push(buildOverlayMark(template.visual.lowVisionMark[0], template.visual.lowVisionMark[1], 7));
      } else if (finding === "campo_visual_reduzido") {
        elements.push(buildOverlayMark(template.visual.fieldMark[0], template.visual.fieldMark[1], 7));
      }
    }

    if (state.activeModule === "intelectual") {
      checkedValues("intellectualMarker").forEach((item) => {
        const coords = template.intellectualMarks[item];
        if (coords) {
          elements.push(buildOverlayMark(coords[0], coords[1], 7));
        }
      });
    }

    return elements.join("");
  }

  function buildAttachmentSummaryHtml(attachments = []) {
    if (!attachments.length) {
      return "";
    }

    const items = attachments.map((attachment, index) => `
      <article class="annex-item">
        <strong>${index + 1}. ${escapeHtml(toAsciiSafeText(attachment.name))}</strong>
        <span>${escapeHtml(describeAttachmentKind(attachment.mimeType))} - ${escapeHtml(attachment.sizeLabel)}</span>
      </article>
    `).join("");

    return `
      <section class="sheet annex-cover">
        <span class="section-step">Anexos</span>
        <h2>Documentacao medica externa</h2>
        <p>Os arquivos abaixo foram vinculados ao caso para compor a impressao do laudo caracterizador e a juntada documental operacional.</p>
        <div class="annex-list">${items}</div>
      </section>
    `;
  }

  function buildAttachmentPrintSheetsHtml(attachments = []) {
    return attachments.map((attachment, index) => {
      if (attachment.previewKind === "image") {
        return `
          <section class="sheet attachment-sheet">
            <header class="attachment-head">
              <h3>Anexo ${index + 1} - ${escapeHtml(toAsciiSafeText(attachment.name))}</h3>
              <p>Documento externo incorporado ao pacote final de impressao.</p>
            </header>
            <div class="attachment-preview">
              <img class="attachment-image" src="${escapeHtml(attachment.source)}" alt="${escapeHtml(toAsciiSafeText(attachment.name))}">
            </div>
          </section>
        `;
      }

      if (attachment.previewKind === "pdf") {
        return `
          <section class="sheet attachment-sheet">
            <header class="attachment-head">
              <h3>Anexo ${index + 1} - ${escapeHtml(toAsciiSafeText(attachment.name))}</h3>
              <p>Documento em PDF anexado ao caso.</p>
            </header>
            <div class="attachment-preview">
              <embed class="attachment-pdf" src="${escapeHtml(attachment.source)}#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf">
            </div>
            <p class="attachment-note">Se o navegador nao renderizar este PDF dentro da folha, abra o anexo em nova guia e imprima separadamente.</p>
          </section>
        `;
      }

      return `
        <section class="sheet attachment-sheet">
          <header class="attachment-head">
            <h3>Anexo ${index + 1} - ${escapeHtml(toAsciiSafeText(attachment.name))}</h3>
            <p>Documento externo registrado no caso, sem pre-visualizacao compativel nesta tela.</p>
          </header>
          <p class="attachment-note">Arquivo identificado como ${escapeHtml(describeAttachmentKind(attachment.mimeType))}. Mantenha este documento vinculado ao processo do trabalhador.</p>
        </section>
      `;
    }).join("");
  }

  function initCompanyDashboard() {
    refs.companyDashboard = $("#companyDashboard");
    refs.companyDashboardTitle = $("#companyDashboardTitle");
    refs.companyDashboardSubtitle = $("#companyDashboardSubtitle");
    refs.companyDashboardPlanChip = $("#companyDashboardPlanChip");
    refs.companyDashboardCnpjChip = $("#companyDashboardCnpjChip");
    refs.companyDashboardStatus = $("#companyDashboardStatus");
    refs.companyViewButtons = $$("[data-company-view]");
    refs.companyViewPanels = $$("[data-company-view-panel]");
    refs.companyMetricTotalDocuments = $("#companyMetricTotalDocuments");
    refs.companyMetricMonthlyDocuments = $("#companyMetricMonthlyDocuments");
    refs.companyMetricDoctors = $("#companyMetricDoctors");
    refs.companyMetricLastActivity = $("#companyMetricLastActivity");
    refs.companyUsageMonthFilter = $("#companyUsageMonthFilter");
    refs.companyUsageSummary = $("#companyUsageSummary");
    refs.companyUsageBars = $("#companyUsageBars");
    refs.companyActivityList = $("#companyActivityList");
    refs.companyDoctorForm = $("#companyDoctorForm");
    refs.companyDoctorName = $("#companyDoctorName");
    refs.companyDoctorCrm = $("#companyDoctorCrm");
    refs.companyDoctorCrmState = $("#companyDoctorCrmState");
    refs.companyDoctorSpecialty = $("#companyDoctorSpecialty");
    refs.companyDoctorsCount = $("#companyDoctorsCount");
    refs.companyDoctorsList = $("#companyDoctorsList");
    refs.companyDoctorAccessPanel = $("#companyDoctorAccessPanel");
    refs.companyDoctorAccessSummary = $("#companyDoctorAccessSummary");
    refs.companyDoctorAccessUsername = $("#companyDoctorAccessUsername");
    refs.companyDoctorAccessPassword = $("#companyDoctorAccessPassword");
    refs.companyDoctorAccessHint = $("#companyDoctorAccessHint");
    refs.companyDoctorAccessCopy = $("#companyDoctorAccessCopy");
    refs.companyProfileForm = $("#companyProfileForm");
    refs.companyProfileName = $("#companyProfileName");
    refs.companyProfileCnpj = $("#companyProfileCnpj");
    refs.companyLogoInput = $("#companyLogoInput");
    refs.companyLogoPreview = $("#companyLogoPreview");
    refs.appTopbarLogo = $("#appTopbarLogo");
    refs.appTopbarEyebrow = $("#appTopbarEyebrow");
    refs.appTopbarTitle = $("#appTopbarTitle");
    refs.appTopbarSubtitle = document.querySelector("#appShell .topbar-subtitle");
    refs.appTopbarNote = $("#appTopbarNote");

    if (refs.companyViewButtons.length) {
      refs.companyViewButtons.forEach((button) => {
        button.addEventListener("click", () => setCompanyDashboardView(button.dataset.companyView || "overview"));
      });
    }

    if (refs.companyUsageMonthFilter) {
      refs.companyUsageMonthFilter.addEventListener("change", (event) => {
        state.companySelectedMonth = String(event.target.value || "");
        renderCompanyDashboard();
      });
    }

    if (refs.companyDoctorForm) {
      refs.companyDoctorForm.addEventListener("submit", handleCompanyDoctorSubmit);
    }

    if (refs.companyProfileForm) {
      refs.companyProfileForm.addEventListener("submit", handleCompanyProfileSubmit);
    }

    if (refs.companyLogoInput) {
      refs.companyLogoInput.addEventListener("change", handleCompanyLogoSelected);
    }

    if (refs.companyProfileCnpj) {
      refs.companyProfileCnpj.addEventListener("input", handleCnpjMaskInput);
    }

    if (refs.companyDoctorAccessCopy) {
      refs.companyDoctorAccessCopy.addEventListener("click", handleCompanyDoctorAccessCopy);
    }

    if (refs.companyDoctorCrm) {
      refs.companyDoctorCrm.addEventListener("input", (event) => {
        if (!event || !event.target) return;
        event.target.value = String(event.target.value || "").replace(/\D/g, "");
      });
    }

    if (refs.companyDoctorCrmState && !refs.companyDoctorCrmState.options.length) {
      refs.companyDoctorCrmState.innerHTML = buildCrmStateOptionsHtml("");
    }

    setCompanyDashboardView(state.companyCurrentView || "overview");
  }

  function setCompanyDashboardStatus(message = "") {
    if (refs.companyDashboardStatus) {
      refs.companyDashboardStatus.textContent = message;
    }
  }

  function clearCompanyDoctorAccess() {
    state.companyLastDoctorAccess = null;

    if (refs.companyDoctorAccessPanel) {
      refs.companyDoctorAccessPanel.classList.add("hidden");
    }
    if (refs.companyDoctorAccessSummary) {
      refs.companyDoctorAccessSummary.textContent = "As credenciais recem-geradas aparecem aqui para envio seguro ao medico.";
    }
    if (refs.companyDoctorAccessUsername) {
      refs.companyDoctorAccessUsername.value = "";
    }
    if (refs.companyDoctorAccessPassword) {
      refs.companyDoctorAccessPassword.value = "";
    }
    if (refs.companyDoctorAccessHint) {
      refs.companyDoctorAccessHint.textContent = "Essas credenciais sao exibidas apenas nesta geracao. Compartilhe em canal seguro e oriente o medico a trocar a senha no primeiro acesso.";
    }
  }

  function renderCompanyDoctorAccess(doctorAccess) {
    const hasAccess = Boolean(doctorAccess && doctorAccess.username && doctorAccess.password);
    if (!hasAccess) {
      clearCompanyDoctorAccess();
      return;
    }

    state.companyLastDoctorAccess = {
      doctorId: String(doctorAccess.doctorId || ""),
      doctorName: String(doctorAccess.doctorName || "").trim(),
      username: String(doctorAccess.username || "").trim(),
      password: String(doctorAccess.password || "")
    };

    if (!refs.companyDoctorAccessPanel) {
      return;
    }

    refs.companyDoctorAccessPanel.classList.remove("hidden");
    if (refs.companyDoctorAccessSummary) {
      refs.companyDoctorAccessSummary.textContent = state.companyLastDoctorAccess.doctorName
        ? `Acesso operacional gerado para ${state.companyLastDoctorAccess.doctorName}. Compartilhe os dados abaixo com seguranca.`
        : "Acesso operacional gerado. Compartilhe os dados abaixo com seguranca.";
    }
    if (refs.companyDoctorAccessUsername) {
      refs.companyDoctorAccessUsername.value = state.companyLastDoctorAccess.username;
    }
    if (refs.companyDoctorAccessPassword) {
      refs.companyDoctorAccessPassword.value = state.companyLastDoctorAccess.password;
    }
    if (refs.companyDoctorAccessHint) {
      refs.companyDoctorAccessHint.textContent = "Essas credenciais sao mostradas uma unica vez nesta tela. Oriente o medico a alterar a senha assim que entrar.";
    }
  }

  async function handleCompanyDoctorAccessCopy() {
    if (!state.companyLastDoctorAccess) {
      setCompanyDashboardStatus("Nenhuma credencial foi gerada nesta sessao para copiar.");
      return;
    }

    const payload = [
      state.companyLastDoctorAccess.doctorName ? `Medico: ${state.companyLastDoctorAccess.doctorName}` : "",
      `Usuario: ${state.companyLastDoctorAccess.username}`,
      `Senha provisoria: ${state.companyLastDoctorAccess.password}`
    ].filter(Boolean).join("\n");

    try {
      await copyTextToClipboard(payload);
      setCompanyDashboardStatus("Credenciais copiadas. Envie ao medico por um canal seguro.");
    } catch (error) {
      console.error(error);
      setCompanyDashboardStatus("Nao foi possivel copiar as credenciais automaticamente.");
    }
  }

  function isMissingCompanyDoctorAccessRouteError(error) {
    const message = String(error && error.message ? error.message : "");
    return message.toLowerCase().includes("rota nao encontrada");
  }

  function setCompanyDashboardView(view) {
    const nextView = view === "doctors" || view === "branding" ? view : "overview";
    state.companyCurrentView = nextView;

    if (refs.companyViewButtons) {
      refs.companyViewButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.companyView === nextView);
      });
    }

    if (refs.companyViewPanels) {
      refs.companyViewPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.companyViewPanel !== nextView);
      });
    }
  }

  function buildCompanyActivityFeed(session) {
    const activities = normalizeCompanySessionActivities(session && session.activityLog ? session.activityLog : []);
    const documentActivities = normalizeCompanySessionDocumentHistory(
      session && session.documentHistory ? session.documentHistory : [],
      Number(session && session.usageCount ? session.usageCount : 0)
    ).map((entry) => ({
      id: `doc_activity_${entry.id}`,
      doctorName: entry.doctorName || "Sistema corporativo",
      action: `${Number(entry.count || 0)} documento(s) registrado(s) no ecossistema da empresa`,
      occurredAt: `${entry.date}T12:00:00`
    }));

    const feed = [...activities, ...documentActivities].sort((left, right) => String(right.occurredAt || "").localeCompare(String(left.occurredAt || "")));
    if (!feed.length && session && session.lastAccessAt) {
      return [{
        id: `fallback_${session.id || "company"}`,
        doctorName: "Administrativo da empresa",
        action: "Último acesso ao dashboard corporativo",
        occurredAt: session.lastAccessAt
      }];
    }
    return feed.slice(0, 12);
  }

  function buildCompanyDashboardModel(session = state.sessionUser) {
    if (!session) {
      return null;
    }

    const doctors = normalizeCompanySessionDoctors(session.linkedDoctors);
    const documentHistory = normalizeCompanySessionDocumentHistory(session.documentHistory, Number(session.usageCount || 0));
    const availableMonths = Array.from(new Set(documentHistory.map((entry) => String(entry.date || "").slice(0, 7)).filter(Boolean)));

    if (!availableMonths.length) {
      availableMonths.push(buildMonthKey(new Date()));
    }

    availableMonths.sort().reverse();
    const selectedMonth = availableMonths.includes(state.companySelectedMonth) ? state.companySelectedMonth : availableMonths[0];
    const [selectedYear, selectedMonthNumber] = selectedMonth.split("-").map((value) => Number(value || 0));
    const daysInMonth = new Date(selectedYear || new Date().getFullYear(), selectedMonthNumber || 1, 0).getDate();
    const chartPoints = Array.from({ length: daysInMonth }, (_, index) => ({
      label: String(index + 1).padStart(2, "0"),
      count: 0
    }));

    const monthEntries = documentHistory.filter((entry) => String(entry.date || "").startsWith(selectedMonth));
    monthEntries.forEach((entry) => {
      const parts = String(entry.date || "").split("-");
      const day = Number(parts[2] || 0);
      if (day >= 1 && day <= chartPoints.length) {
        chartPoints[day - 1].count += Number(entry.count || 0);
      }
    });

    const totalDocuments = documentHistory.reduce((sum, entry) => sum + Number(entry.count || 0), 0);
    const documentsThisMonth = monthEntries.reduce((sum, entry) => sum + Number(entry.count || 0), 0);
    const activityFeed = buildCompanyActivityFeed(session);
    const lastActivity = activityFeed[0] || null;

    return {
      session,
      doctors,
      availableMonths,
      selectedMonth,
      chartPoints,
      totalDocuments,
      documentsThisMonth,
      activities: activityFeed,
      lastActivity
    };
  }

  function updateAppShellChrome(session = state.sessionUser) {
    if (!refs.appTopbarLogo || !refs.appTopbarEyebrow || !refs.appTopbarTitle || !refs.appTopbarSubtitle || !refs.appTopbarNote) {
      return;
    }

    const isCompany = isCompanySession(session);
    const isDemo = Boolean(session && normalizeAccountType(session.accountType) === "demo");
    const effectiveLogo = isCompany && (state.companyLogoDraft || session.companyLogoDataUrl)
      ? (state.companyLogoDraft || session.companyLogoDataUrl)
      : "img/logo.png";

    refs.appTopbarLogo.src = effectiveLogo;
    refs.appTopbarLogo.alt = isCompany ? `Logo de ${session.company || "empresa"}` : "DaviCore Health";

    if (isCompany) {
      refs.appTopbarEyebrow.textContent = "Empresa contratante • dashboard corporativo";
      refs.appTopbarTitle.textContent = session.company || "Dashboard da empresa";
      refs.appTopbarSubtitle.textContent = "Painel administrativo para acompanhar utilização, médicos vinculados, identidade visual e governança do ambiente empresarial.";
      refs.appTopbarNote.textContent = "Ambiente administrativo da empresa";
      return;
    }

    if (isDemo) {
      refs.appTopbarEyebrow.textContent = "Modo demonstração • jornada guiada";
      refs.appTopbarTitle.textContent = "Enquadra PcD";
      refs.appTopbarSubtitle.textContent = "Navegação guiada para apresentação comercial, sem emissão documental e sem validade operacional.";
      refs.appTopbarNote.textContent = "Ambiente de demonstração";
      return;
    }

    refs.appTopbarEyebrow.textContent = "Médico autenticado • operação técnica";
    refs.appTopbarTitle.textContent = "Enquadra PcD";
    refs.appTopbarSubtitle.textContent = "Fluxo técnico para avaliação ocupacional, descrição funcional e emissão estruturada de laudo.";
    refs.appTopbarNote.textContent = "Ambiente operacional médico";
  }

  function renderCompanyUsageChart(model) {
    if (!refs.companyUsageBars || !refs.companyUsageSummary || !refs.companyUsageMonthFilter) {
      return;
    }

    const optionsHtml = model.availableMonths.map((monthKey) => (
      `<option value="${escapeHtml(monthKey)}"${monthKey === model.selectedMonth ? " selected" : ""}>${escapeHtml(buildMonthLabel(monthKey))}</option>`
    )).join("");

    if (refs.companyUsageMonthFilter.innerHTML !== optionsHtml) {
      refs.companyUsageMonthFilter.innerHTML = optionsHtml;
    }
    refs.companyUsageMonthFilter.value = model.selectedMonth;

    refs.companyUsageSummary.textContent = `${buildMonthLabel(model.selectedMonth)}: ${model.documentsThisMonth} documento(s) registrado(s).`;

    const peak = Math.max(0, ...model.chartPoints.map((point) => Number(point.count || 0)));
    if (!peak) {
      refs.companyUsageBars.innerHTML = `<div class="company-chart-empty">Nenhum documento registrado em ${escapeHtml(buildMonthLabel(model.selectedMonth))}.</div>`;
      return;
    }

    refs.companyUsageBars.innerHTML = model.chartPoints.map((point) => {
      const count = Number(point.count || 0);
      const height = peak ? Math.max(10, Math.round((count / peak) * 100)) : 10;
      return `
        <div class="company-chart-bar" title="${escapeHtml(`${point.label}: ${count} documento(s)`)}">
          <span class="company-chart-bar-count">${count > 0 ? escapeHtml(String(count)) : "&nbsp;"}</span>
          <div class="company-chart-bar-fill" style="height:${height}%"></div>
          <span class="company-chart-bar-label">${escapeHtml(point.label)}</span>
        </div>
      `;
    }).join("");
  }

  function renderCompanyActivityList(items = []) {
    if (!refs.companyActivityList) {
      return;
    }

    if (!items.length) {
      refs.companyActivityList.innerHTML = '<div class="company-empty-state">Nenhuma atividade recente registrada neste ambiente.</div>';
      return;
    }

    refs.companyActivityList.innerHTML = items.map((item) => `
      <article class="company-activity-item">
        <div>
          <strong>${escapeHtml(item.doctorName || "Administrativo da empresa")}</strong>
          <p>${escapeHtml(item.action || "Atualização registrada")}</p>
        </div>
        <time>${escapeHtml(formatDashboardDateTime(item.occurredAt))}</time>
      </article>
    `).join("");
  }

  function renderCompanyDoctorsList(doctors = []) {
    if (!refs.companyDoctorsList) {
      return;
    }

    if (refs.companyDoctorsCount) {
      refs.companyDoctorsCount.textContent = `${doctors.length} médico(s)`;
    }

    if (!doctors.length) {
      refs.companyDoctorsList.innerHTML = '<div class="company-empty-state">Nenhum médico vinculado ainda. Use o formulário ao lado para iniciar a gestão.</div>';
      return;
    }

    refs.companyDoctorsList.innerHTML = doctors.map((doctor) => `
      <article class="company-doctor-card">
        <div class="company-doctor-card-head">
          <div>
            <h4>${escapeHtml(doctor.name)}</h4>
            <p>Cadastro sob responsabilidade administrativa da empresa.</p>
          </div>
          <button class="ghost-button" type="button" data-company-doctor-remove="${escapeHtml(doctor.id)}">Excluir</button>
        </div>
        <div class="company-doctor-meta">
          <span class="company-doctor-chip">CRM ${escapeHtml(doctor.crm)}</span>
          <span class="company-doctor-chip">${escapeHtml(doctor.specialty || "Especialidade não informada")}</span>
          <span class="company-doctor-chip">Cadastrado em ${escapeHtml(formatDashboardDate(doctor.createdAt))}</span>
        </div>
      </article>
    `).join("");

    refs.companyDoctorsList.querySelectorAll("[data-company-doctor-remove]").forEach((button) => {
      button.addEventListener("click", async () => {
        const doctorId = button.getAttribute("data-company-doctor-remove") || "";
        if (!doctorId) {
          return;
        }
        const confirmed = window.confirm("Deseja realmente excluir este médico do dashboard da empresa?");
        if (!confirmed) {
          return;
        }
        await deleteCompanyDoctorById(doctorId);
      });
    });
  }

  function syncCompanyProfileForm(session) {
    if (!session) {
      return;
    }

    if (refs.companyProfileName && refs.companyProfileName !== document.activeElement) {
      refs.companyProfileName.value = session.company || "";
    }
    if (refs.companyProfileCnpj && refs.companyProfileCnpj !== document.activeElement) {
      refs.companyProfileCnpj.value = formatCnpjValue(session.companyCnpj || "");
    }

    const effectiveLogo = state.companyLogoDraft || session.companyLogoDataUrl || "img/logo.png";
    if (refs.companyLogoPreview) {
      refs.companyLogoPreview.src = effectiveLogo;
    }
  }

  function renderCompanyDashboard() {
    const session = state.sessionUser;
    if (!refs.companyDashboard) {
      return;
    }

    if (!isCompanySession(session)) {
      refs.companyDashboard.classList.add("hidden");
      return;
    }

    const model = buildCompanyDashboardModel(session);
    state.companySelectedMonth = model.selectedMonth;

    refs.companyDashboard.classList.remove("hidden");
    document.body.classList.add("company-mode");
    updateAppShellChrome(session);

    if (refs.companyDashboardTitle) {
      refs.companyDashboardTitle.textContent = session.company || "Painel administrativo da empresa";
    }
    if (refs.companyDashboardSubtitle) {
      refs.companyDashboardSubtitle.textContent = "Gestão de médicos vinculados, acompanhamento de indicadores e controle administrativo sem acesso ao ambiente técnico.";
    }
    if (refs.companyDashboardPlanChip) {
      refs.companyDashboardPlanChip.textContent = session.planLabel || "Plano empresarial";
    }
    if (refs.companyDashboardCnpjChip) {
      refs.companyDashboardCnpjChip.textContent = session.companyCnpj
        ? `CNPJ ${formatCnpjValue(session.companyCnpj)}`
        : "CNPJ não informado";
    }
    if (refs.companyMetricTotalDocuments) {
      refs.companyMetricTotalDocuments.textContent = String(model.totalDocuments);
    }
    if (refs.companyMetricMonthlyDocuments) {
      refs.companyMetricMonthlyDocuments.textContent = String(model.documentsThisMonth);
    }
    if (refs.companyMetricDoctors) {
      refs.companyMetricDoctors.textContent = String(model.doctors.length);
    }
    if (refs.companyMetricLastActivity) {
      refs.companyMetricLastActivity.textContent = model.lastActivity
        ? formatDashboardDateTime(model.lastActivity.occurredAt)
        : "Sem registro";
    }

    renderCompanyUsageChart(model);
    renderCompanyActivityList(model.activities);
    renderCompanyDoctorsList(model.doctors);
    syncCompanyProfileForm(session);
    setCompanyDashboardView(state.companyCurrentView || "overview");
  }

  async function updateLocalCompanyUser(transform) {
    const users = readLocalUsers();
    const index = users.findIndex((item) => item.id === (state.sessionUser && state.sessionUser.id));
    if (index === -1) {
      throw new Error("Nao foi possivel localizar a conta empresarial neste navegador.");
    }

    const current = {
      ...users[index],
      linkedDoctors: normalizeCompanySessionDoctors(users[index].linkedDoctors),
      activityLog: normalizeCompanySessionActivities(users[index].activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(users[index].documentHistory, Number(users[index].usageCount || 0))
    };

    const nextUser = transform(current);
    users[index] = {
      ...nextUser,
      companyCnpj: String(nextUser.companyCnpj || "").replace(/\D/g, "").slice(0, 14),
      companyLogoDataUrl: String(nextUser.companyLogoDataUrl || ""),
      linkedDoctors: normalizeCompanySessionDoctors(nextUser.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(nextUser.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(nextUser.documentHistory, Number(nextUser.usageCount || 0))
    };

    writeLocalUsers(users);
    const session = buildLocalSessionUser(users[index]);
    persistLocalSessionUser(session);
    state.sessionUser = session;
    return session;
  }

  async function saveCompanyProfileData(payload) {
    if (state.authProvider === "api") {
      const response = await apiJson("/api/company/profile", {
        method: "PATCH",
        body: payload
      });
      return response;
    }

    return updateLocalCompanyUser((current) => ({
      ...current,
      company: payload.company,
      companyCnpj: payload.companyCnpj,
      companyLogoDataUrl: payload.companyLogoDataUrl,
      activityLog: appendCompanySessionActivity(current, {
        doctorName: "Administrativo da empresa",
        action: payload.companyLogoDataUrl !== undefined && payload.companyLogoDataUrl !== current.companyLogoDataUrl
          ? "Perfil corporativo atualizado com nova logo"
          : "Perfil corporativo atualizado"
      }),
      updatedAt: new Date().toISOString()
    }));
  }

  async function createCompanyDoctorData(payload) {
    if (state.authProvider === "api") {
      return apiJson("/api/company/doctors", {
        method: "POST",
        body: payload
      });
    }

    const users = readLocalUsers();
    const companyIndex = users.findIndex((item) => item.id === (state.sessionUser && state.sessionUser.id));
    if (companyIndex === -1) {
      throw new Error("Nao foi possivel localizar a conta empresarial neste navegador.");
    }

    const companyUser = {
      ...users[companyIndex],
      linkedDoctors: normalizeCompanySessionDoctors(users[companyIndex].linkedDoctors),
      activityLog: normalizeCompanySessionActivities(users[companyIndex].activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(users[companyIndex].documentHistory, Number(users[companyIndex].usageCount || 0))
    };
    const doctors = normalizeCompanySessionDoctors(companyUser.linkedDoctors);
    if (doctors.some((item) => item.crm === payload.crm && (!item.crmState || item.crmState === payload.crmState))) {
      throw new Error("Ja existe um medico cadastrado com este CRM.");
    }

    const createdAt = new Date().toISOString();
    const doctorId = `doctor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const accessUsername = generateCompanyDoctorUsername(payload.name, users);
    const accessPassword = generateCompanyDoctorPassword();
    const passwordHash = await buildAuthHash(accessPassword);
    const nextDoctor = normalizeCompanySessionDoctor({
      id: doctorId,
      name: payload.name,
      crm: payload.crm,
      crmState: payload.crmState,
      specialty: payload.specialty,
      createdAt,
      accessUserId: "",
      accessUsername,
      accessCreatedAt: createdAt,
      responsibilityMode: "company",
      crmValidated: true
    });

    const doctorUser = buildLocalUserRecord({
      company: companyUser.company,
      username: accessUsername,
      passwordHash,
      role: "buyer",
      status: companyUser.status === "blocked" ? "blocked" : (companyUser.status === "inadimplente" ? "inadimplente" : "active"),
      expiresAt: null,
      contactName: payload.name,
      email: "",
      paymentStatus: companyUser.paymentStatus || "approved",
      paymentDueAt: companyUser.paymentDueAt || null,
      planId: companyUser.planId || "individual_25",
      notes: `Medico corporativo vinculado a ${companyUser.company}.`,
      accountType: "doctor",
      crmNumber: payload.crm,
      crmState: payload.crmState,
      doctorCpf: "",
      doctorBirthDate: "",
      crmValidated: true,
      responsibilityMode: "company",
      linkedCompanyId: companyUser.id,
      linkedCompanyDoctorId: doctorId,
      companyLogoDataUrl: companyUser.companyLogoDataUrl || "",
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });
    nextDoctor.accessUserId = doctorUser.id;
    /*

    users[companyIndex] = {
      ...companyUser,
      linkedDoctors: [nextDoctor, ...doctors],
      activityLog: appendCompanySessionActivity(companyUser, {
        doctorName: nextDoctor.name,
          action: `Médico vinculado ao painel corporativo (CRM ${nextDoctor.crm})`
        }),
        updatedAt: new Date().toISOString()
      };
    });
  }

    */
    return buildLocalSessionUser(companyUser);
  }

  async function deleteCompanyDoctorData(doctorId) {
    if (state.authProvider === "api") {
      const response = await apiJson(`/api/company/doctors/${encodeURIComponent(doctorId)}`, {
        method: "DELETE"
      });
      return response.user;
    }

    return updateLocalCompanyUser((current) => {
      const doctors = normalizeCompanySessionDoctors(current.linkedDoctors);
      const doctor = doctors.find((item) => item.id === doctorId);
      if (!doctor) {
        throw new Error("Medico nao localizado nesta empresa.");
      }

      return {
        ...current,
        linkedDoctors: doctors.filter((item) => item.id !== doctorId),
        activityLog: appendCompanySessionActivity(current, {
          doctorName: doctor.name,
          action: `Médico removido do dashboard corporativo (CRM ${doctor.crm})`
        }),
        updatedAt: new Date().toISOString()
      };
    });
  }

  async function handleCompanyDoctorSubmit(event) {
    event.preventDefault();

    const name = refs.companyDoctorName ? refs.companyDoctorName.value.trim() : "";
    const crm = refs.companyDoctorCrm ? refs.companyDoctorCrm.value.replace(/\D/g, "") : "";
    const specialty = refs.companyDoctorSpecialty ? refs.companyDoctorSpecialty.value.trim() : "";

    if (!name || !crm) {
      setCompanyDashboardStatus("Informe nome e CRM para adicionar o médico ao dashboard.");
      return;
    }

    try {
      setCompanyDashboardStatus("Salvando médico vinculado...");
      const updatedUser = await createCompanyDoctorData({ name, crm, specialty });
      state.sessionUser = updatedUser;
      if (refs.companyDoctorForm) refs.companyDoctorForm.reset();
      setCompanyDashboardStatus("Médico vinculado com sucesso ao ambiente empresa.");
      renderCompanyDashboard();
    } catch (error) {
      setCompanyDashboardStatus(error.message || "Nao foi possivel adicionar o medico.");
    }
  }

  async function deleteCompanyDoctorById(doctorId) {
    try {
      setCompanyDashboardStatus("Removendo médico do dashboard...");
      const updatedUser = await deleteCompanyDoctorData(doctorId);
      state.sessionUser = updatedUser;
      setCompanyDashboardStatus("Médico removido com sucesso.");
      renderCompanyDashboard();
    } catch (error) {
      setCompanyDashboardStatus(error.message || "Nao foi possivel remover o medico.");
    }
  }

  async function handleCompanyProfileSubmit(event) {
    event.preventDefault();

    const company = refs.companyProfileName ? refs.companyProfileName.value.trim() : "";
    const companyCnpj = refs.companyProfileCnpj ? refs.companyProfileCnpj.value.replace(/\D/g, "") : "";
    const companyLogoDataUrl = state.companyLogoDraft || (state.sessionUser && state.sessionUser.companyLogoDataUrl) || "";

    if (!company) {
      setCompanyDashboardStatus("Informe o nome da empresa para salvar o perfil corporativo.");
      return;
    }
    if (companyCnpj.length !== 14) {
      setCompanyDashboardStatus("Informe um CNPJ valido com 14 digitos para salvar o perfil.");
      return;
    }

    try {
      setCompanyDashboardStatus("Salvando perfil corporativo...");
      const updatedUser = await saveCompanyProfileData({
        company,
        companyCnpj,
        companyLogoDataUrl
      });
      state.sessionUser = updatedUser;
      state.companyLogoDraft = updatedUser.companyLogoDataUrl || "";
      setCompanyDashboardStatus("Perfil corporativo atualizado com sucesso.");
      renderCompanyDashboard();
    } catch (error) {
      setCompanyDashboardStatus(error.message || "Nao foi possivel salvar o perfil corporativo.");
    }
  }

  function handleCompanyLogoSelected(event) {
    const file = event && event.target && event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }

    if (!/^image\/(png|jpeg|jpg|webp|svg\+xml)$/i.test(file.type || "")) {
      setCompanyDashboardStatus("Selecione uma imagem em PNG, JPG, WEBP ou SVG para a logo da empresa.");
      return;
    }

    if (Number(file.size || 0) > 650000) {
      setCompanyDashboardStatus("A logo precisa ter no máximo 650 KB para manter o dashboard responsivo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      state.companyLogoDraft = String(reader.result || "");
      if (refs.companyLogoPreview) {
        refs.companyLogoPreview.src = state.companyLogoDraft || "img/logo.png";
      }
      if (refs.appTopbarLogo && isCompanySession()) {
        refs.appTopbarLogo.src = state.companyLogoDraft || "img/logo.png";
      }
      setCompanyDashboardStatus("Logo carregada. Clique em salvar perfil corporativo para aplicar definitivamente.");
    };
    reader.onerror = () => {
      setCompanyDashboardStatus("Nao foi possivel ler a imagem selecionada para a logo.");
    };
    reader.readAsDataURL(file);
  }

  function initInlineAdminPanel() {
    refs.adminPanel = $("#adminPanel");
    refs.createUserForm = $("#createUserForm");
    refs.adminCompany = $("#adminCompany");
    refs.adminContactName = $("#adminContactName");
    refs.adminEmail = $("#adminEmail");
    refs.adminUsername = $("#adminUsername");
    refs.adminPassword = $("#adminPassword");
    refs.adminCreateSectionTitle = $("#adminCreateSectionTitle");
    refs.adminCreateProfile = $("#adminCreateProfile");
    refs.adminCreateTypeShell = $("#adminCreateTypeShell");
    refs.adminCreateTypeSummary = $("#adminCreateTypeSummary");
    refs.adminCreateTypeButtons = $$("[data-admin-create-profile]");
    refs.adminCreateDetails = $("#adminCreateDetails");
    refs.adminCreateFieldsTitle = $("#adminCreateFieldsTitle");
    refs.adminCreateFieldsSummary = $("#adminCreateFieldsSummary");
    refs.adminCompanyField = $("#adminCompanyField");
    refs.adminContactNameField = $("#adminContactNameField");
    refs.adminEmailField = $("#adminEmailField");
    refs.adminUsernameField = $("#adminUsernameField");
    refs.adminPasswordField = $("#adminPasswordField");
    refs.adminRoleField = $("#adminRoleField");
    refs.adminAccountTypeField = $("#adminAccountTypeField");
    refs.adminCrmNumberField = $("#adminCrmNumberField");
    refs.adminCrmStateField = $("#adminCrmStateField");
    refs.adminCrmValidatedField = $("#adminCrmValidatedField");
    refs.adminStatusField = $("#adminStatusField");
    refs.adminPaymentStatusField = $("#adminPaymentStatusField");
    refs.adminPlanField = $("#adminPlanField");
    refs.adminPaymentDueAtField = $("#adminPaymentDueAtField");
    refs.adminNotesField = $("#adminNotesField");
    refs.adminRole = $("#adminRole");
    refs.adminAccountType = $("#adminAccountType");
    refs.adminCrmNumber = $("#adminCrmNumber");
    refs.adminCrmState = $("#adminCrmState");
    refs.adminCrmValidated = $("#adminCrmValidated");
    refs.adminStatus = $("#adminStatus");
    refs.adminPaymentStatus = $("#adminPaymentStatus");
    refs.adminPlan = $("#adminPlan");
    refs.adminPaymentDueAt = $("#adminPaymentDueAt");
    refs.adminNotes = $("#adminNotes");
    refs.adminStatusNote = $("#adminStatusNote");
    refs.adminUsersCount = $("#adminUsersCount");
    refs.adminUsersGrid = $("#adminUsersGrid");
    refs.adminUserSearch = $("#adminUserSearch");
    refs.adminUserFilter = $("#adminUserFilter");
    refs.adminViewButtons = $$("[data-admin-view]");
    refs.adminViewPanels = $$("[data-admin-view-panel]");

    state.adminPanelOpen = false;

    if (refs.createUserForm) {
      refs.createUserForm.addEventListener("submit", handleInlineAdminCreateUser);
    }

    if (refs.adminCreateTypeButtons && refs.adminCreateTypeButtons.length) {
      refs.adminCreateTypeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          syncInlineAdminCreateForm({ profile: button.dataset.adminCreateProfile || "" });
        });
      });
    }

    if (refs.adminViewButtons && refs.adminViewButtons.length) {
      refs.adminViewButtons.forEach((button) => {
        button.addEventListener("click", () => setAdminView(button.dataset.adminView || "overview"));
      });
    }

    if (refs.adminUserSearch) {
      refs.adminUserSearch.addEventListener("input", (event) => {
        state.adminUserSearch = String(event.target.value || "");
        renderInlineAdminUsers(getVisibleAdminUsers());
      });
    }

    if (refs.adminUserFilter) {
      refs.adminUserFilter.value = state.adminUserFilter || "active_company";
      refs.adminUserFilter.addEventListener("change", (event) => {
        state.adminUserFilter = String(event.target.value || "active_company");
        renderInlineAdminUsers(getVisibleAdminUsers());
      });
    }

    setAdminView(state.adminCurrentView || "overview");
  }

  function setAdminView(view) {
    const nextView = view === "users" || view === "create" ? view : "overview";
    state.adminCurrentView = nextView;

    if (refs.adminViewButtons) {
      refs.adminViewButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.adminView === nextView);
      });
    }

    if (refs.adminViewPanels) {
      refs.adminViewPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.adminViewPanel !== nextView);
      });
    }
  }

  function closeInlineAdminPanel() {
    state.adminPanelOpen = false;
    state.adminExpandedUserId = "";

    if (refs.adminPanel) {
      refs.adminPanel.classList.add("hidden");
    }
  }

  function syncInlineAdminAccess(session) {
    const isAdmin = Boolean(session && (session.role === "admin" || session.isAdmin));

    if (!isAdmin) {
      closeInlineAdminPanel();
    }
  }

  async function loadInlineAdminUsers() {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Carregando acessos...</div>';

    const response = await apiJson("/api/admin/users");
    const users = Array.isArray(response.users) ? response.users : [];

    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
    }

    renderInlineAdminUsers(users);
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const roleLabel = user.role === "admin" ? "Administrador" : "Comprador";
      const statusLabel = user.status === "active" ? "Ativo" : "Bloqueado";
      const card = document.createElement("article");
      card.className = "user-card";

      card.innerHTML = `
        <div class="user-card-head">
          <div>
            <h4>${escapeHtml(user.company)}</h4>
            <p>${escapeHtml(user.username)} - ${escapeHtml(roleLabel)}</p>
          </div>
          <span class="user-badge ${escapeHtml(user.status)}">${escapeHtml(statusLabel)}</span>
        </div>

        <div class="user-meta">
          <div class="meta-box">
            <strong>Perfil</strong>
            <span>${escapeHtml(roleLabel)}</span>
          </div>
          <div class="meta-box">
            <strong>Validade</strong>
            <span>${escapeHtml(formatInlineAdminDate(user.expiresAt))}</span>
          </div>
          <div class="meta-box">
            <strong>Criado em</strong>
            <span>${escapeHtml(formatInlineAdminDateTime(user.createdAt))}</span>
          </div>
          <div class="meta-box">
            <strong>Status</strong>
            <span>${escapeHtml(user.status === "active" ? "Liberado" : "Bloqueado")}</span>
          </div>
        </div>

        <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}">
          <label class="field">
            <span>Empresa</span>
            <input type="text" name="company" value="${escapeHtml(user.company)}">
          </label>

          <label class="field">
            <span>Usuario</span>
            <input type="text" name="username" value="${escapeHtml(user.username)}">
          </label>

          <label class="field">
            <span>Perfil</span>
            <select name="role">
              <option value="buyer"${user.role === "buyer" ? " selected" : ""}>Comprador</option>
              <option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option>
            </select>
          </label>

          <label class="field">
            <span>Status</span>
            <select name="status">
              <option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option>
              <option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option>
            </select>
          </label>

          <label class="field">
            <span>Validade</span>
            <input type="date" name="expiresAt" value="${escapeHtml(formatInlineAdminDateInput(user.expiresAt))}">
          </label>

          <label class="field">
            <span>Nova senha</span>
            <input type="password" name="password" placeholder="Preencha apenas se quiser trocar">
          </label>

          <div class="form-actions field-full">
            <button class="primary-button" type="submit">Salvar alteracoes</button>
          </div>
        </form>

        <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
      `;

      const form = card.querySelector("form");
      if (form) {
        form.addEventListener("submit", handleInlineAdminUpdateUser);
      }

      refs.adminUsersGrid.appendChild(card);
    });
  }

  async function handleInlineAdminCreateUser(event) {
    event.preventDefault();

    const payload = {
      company: refs.adminCompany ? refs.adminCompany.value.trim() : "",
      username: refs.adminUsername ? refs.adminUsername.value.trim() : "",
      password: refs.adminPassword ? refs.adminPassword.value : "",
      role: refs.adminRole ? refs.adminRole.value : "buyer",
      status: refs.adminStatus ? refs.adminStatus.value : "active",
      expiresAt: refs.adminExpiresAt && refs.adminExpiresAt.value ? refs.adminExpiresAt.value : null
    };

    try {
      await apiJson("/api/admin/users", {
        method: "POST",
        body: payload
      });

      if (refs.createUserForm) {
        refs.createUserForm.reset();
      }
      if (refs.adminRole) {
        refs.adminRole.value = "buyer";
      }
      if (refs.adminStatus) {
        refs.adminStatus.value = "active";
      }
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = "Acesso criado com sucesso.";
      }

      await loadInlineAdminUsers();
    } catch (error) {
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = error.message || "Nao foi possivel criar o acesso.";
      }
    }
  }

  async function handleInlineAdminUpdateUser(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const userId = form && form.dataset ? form.dataset.inlineUserId : "";
    const note = document.querySelector(`[data-inline-user-note="${CSS.escape(userId)}"]`);
    const formData = new FormData(form);
    const payload = {
      company: String(formData.get("company") || "").trim(),
      username: String(formData.get("username") || "").trim(),
      role: String(formData.get("role") || ""),
      status: String(formData.get("status") || ""),
      expiresAt: String(formData.get("expiresAt") || ""),
      password: String(formData.get("password") || "")
    };

    try {
      await apiJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: "PATCH",
        body: payload
      });

      if (note) {
        note.textContent = "Alteracoes salvas com sucesso.";
      }

      await loadInlineAdminUsers();
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel salvar as alteracoes.";
      }
    }
  }

  function formatInlineAdminDate(value) {
    if (!value) {
      return "Sem validade";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Data invalida" : date.toLocaleDateString("pt-BR");
  }

  function formatInlineAdminDateTime(value) {
    if (!value) {
      return "Nao informado";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Data invalida" : date.toLocaleString("pt-BR");
  }

  function formatInlineAdminDateInput(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().slice(0, 10);
  }

  function initAuth() {
    if (refs.loginForm) {
      refs.loginForm.addEventListener("submit", handleLoginSubmit);
    }
    if (refs.setupForm) {
      refs.setupForm.addEventListener("submit", handleSetupSubmit);
    }
    if (refs.showSetupButton) {
      refs.showSetupButton.addEventListener("click", () => setAuthMode("setup"));
    }
    if (refs.showLoginButton) {
      refs.showLoginButton.addEventListener("click", () => setAuthMode("login"));
    }
    if (refs.logoutButton) {
      refs.logoutButton.addEventListener("click", handleLogout);
    }

    loadAuthBootstrap();
  }

  async function loadAuthBootstrap() {
    if (window.location.protocol === "file:") {
      activateLocalAuthMode();
      return;
    }

    try {
      const bootstrap = await apiJson(AUTH_API.bootstrap);
      state.authProvider = "api";
      state.authBootstrap = bootstrap;

      if (!bootstrap.configured) {
        setAuthAccessType("admin");
        setAuthMode("setup");
        setAuthStatus("Defina a empresa e o primeiro administrador para liberar o sistema.");
        return;
      }

      const sessionResponse = await apiJson(AUTH_API.session);
      if (sessionResponse.authenticated && sessionResponse.user) {
        applyAuthenticatedSession(sessionResponse.user);
        return;
      }

      setAuthAccessType("buyer");
      setAuthMode("login");
      setAuthStatus("Escolha o perfil de entrada e informe usuario e senha.");
    } catch (error) {
      console.error(error);
      activateLocalAuthMode();
    }
  }

  function activateLocalAuthMode() {
    state.authProvider = "local";
    const users = readLocalUsers();
    const session = getLocalSessionUser();
    state.authBootstrap = { configured: users.length > 0, mode: "local" };

    if (!users.length) {
      setAuthAccessType("admin");
      setAuthMode("setup");
      setAuthStatus("Modo local ativo. Cadastre agora o primeiro usuario administrador.");
      return;
    }

    if (session && session.username) {
      applyAuthenticatedSession(session);
      return;
    }

    setAuthAccessType("buyer");
    setAuthMode("login");
    setAuthStatus("Modo local ativo. Escolha se a entrada sera como empresa ou como administrador.");
  }

  function setAuthAccessType(type, options = {}) {
    state.authAccessType = type === "admin" ? "admin" : "buyer";

    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.classList.toggle("is-active", state.authAccessType === "buyer");
    }
    if (refs.accessAdminButton) {
      refs.accessAdminButton.classList.toggle("is-active", state.authAccessType === "admin");
    }

    if (!options.preserveMode) {
      setAuthMode(state.authMode);
      return;
    }

    updateAuthEntryCopy();
  }

  function setAuthMode(mode) {
    state.authMode = mode === "setup" ? "setup" : "login";

    if (refs.loginForm) {
      refs.loginForm.classList.toggle("hidden", state.authMode !== "login");
    }
    if (refs.setupForm) {
      refs.setupForm.classList.toggle("hidden", state.authMode !== "setup");
    }
    updateAuthEntryCopy();
  }

  function setAuthStatus(message = "") {
    if (refs.authStatus) {
      refs.authStatus.textContent = message;
    }
  }

  function updateAuthEntryCopy() {
    const isAdminAccess = state.authAccessType === "admin";
    const isSetup = state.authMode === "setup";
    const providerLabel = state.authProvider === "local" ? "local" : "protegido";

    if (refs.authModeBadge) {
      if (isSetup) {
        refs.authModeBadge.textContent = "Configuracao do administrador";
      } else {
        refs.authModeBadge.textContent = isAdminAccess
          ? `Administrador ${providerLabel}`
          : `Empresa ${providerLabel}`;
      }
    }

    if (refs.authTitle) {
      if (isSetup) {
        refs.authTitle.textContent = "Configurar administrador da plataforma";
      } else {
        refs.authTitle.textContent = isAdminAccess ? "Entrar como administrador" : "Entrar como empresa";
      }
    }

    if (refs.authDescription) {
      if (isSetup) {
        refs.authDescription.textContent = "Cadastre o primeiro administrador da plataforma para liberar a base de clientes e os acessos comerciais.";
      } else if (isAdminAccess) {
        refs.authDescription.textContent = "Use esta entrada para controlar clientes, acessos, validade comercial e administracao da plataforma.";
      } else {
        refs.authDescription.textContent = "Use esta entrada para acessar o ambiente operacional da empresa, realizar enquadramentos e emitir laudos.";
      }
    }

    if (refs.loginSubmitButton) {
      refs.loginSubmitButton.textContent = isAdminAccess ? "Entrar como administrador" : "Entrar como empresa";
    }

    if (refs.showSetupButton) {
      const mustHideSetup = !isAdminAccess || isSetup || (state.authBootstrap && state.authBootstrap.configured);
      refs.showSetupButton.classList.toggle("hidden", Boolean(mustHideSetup));
    }

  }

  async function handleSetupSubmit(event) {
    event.preventDefault();

    if (state.authAccessType !== "admin") {
      setAuthAccessType("admin", { preserveMode: true });
      setAuthMode("setup");
      setAuthStatus("A configuracao inicial e exclusiva do administrador da plataforma.");
      return;
    }

    const company = normalizedText("setupCompany");
    const username = normalizedText("setupUsername");
    const password = valueOfRaw("setupPassword");
    const confirmation = valueOfRaw("setupPasswordConfirm");

    if (!company || !username || !password || !confirmation) {
      setAuthStatus("Preencha empresa, usuario e senha para concluir a configuracao.");
      return;
    }

    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmation) {
      setAuthStatus("A confirmacao da senha nao confere.");
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(AUTH_API.setup, {
          method: "POST",
          body: { company, username, password }
        });

        if (refs.setupForm) {
          refs.setupForm.reset();
        }

        state.authBootstrap = { configured: true, mode: "api" };
        setAuthAccessType("admin", { preserveMode: true });
        setAuthStatus("");
        applyAuthenticatedSession(response.user);
      } catch (error) {
        setAuthStatus(error.message || "Nao foi possivel concluir a configuracao inicial.");
      }
      return;
    }

    const users = readLocalUsers();
    if (users.length) {
      setAuthStatus("Ja existe um administrador configurado neste navegador. Entre no sistema pela area administrativa.");
      setAuthMode("login");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      username,
      passwordHash,
      role: "admin",
      status: "active",
      expiresAt: null
    });

    writeLocalUsers([newUser]);
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);

    if (refs.setupForm) {
      refs.setupForm.reset();
    }

    state.authBootstrap = { configured: true, mode: "local" };
    setAuthAccessType("admin", { preserveMode: true });
    setAuthStatus("");
    applyAuthenticatedSession(session);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const username = normalizedText("loginUsername");
    const password = valueOfRaw("loginPassword");

    if (!username || !password) {
      setAuthStatus("Informe usuario e senha para entrar.");
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(AUTH_API.login, {
          method: "POST",
          body: { username, password }
        });

        if (!isAccessTypeAllowed(response.user)) {
          try {
            await apiJson(AUTH_API.logout, { method: "POST" });
          } catch (logoutError) {
            console.error(logoutError);
          }
          setAuthStatus(accessTypeMismatchMessage(response.user));
          return;
        }

        if (refs.loginForm) {
          refs.loginForm.reset();
        }

        setAuthStatus("");
        applyAuthenticatedSession(response.user);
      } catch (error) {
        setAuthStatus(error.message || "Credenciais invalidas. Revise usuario e senha.");
      }
      return;
    }

    const users = readLocalUsers();
    if (!users.length) {
      setAuthMode("setup");
      setAuthStatus("Nenhum acesso foi configurado ainda. Cadastre o primeiro administrador.");
      return;
    }

    const usernameKey = normalizeUserIdentifier(username);
    const user = users.find((item) => item.usernameKey === usernameKey);

    if (!user) {
      setAuthStatus("Credenciais invalidas. Revise usuario e senha.");
      return;
    }

    if (!isAccessTypeAllowed(user)) {
      setAuthStatus(accessTypeMismatchMessage(user));
      return;
    }

    const candidateHash = await buildAuthHash(password);
    if (candidateHash !== user.passwordHash) {
      setAuthStatus("Credenciais invalidas. Revise usuario e senha.");
      return;
    }

    if (user.status !== "active") {
      setAuthStatus("Acesso bloqueado neste navegador.");
      return;
    }

    if (isUserExpired(user.expiresAt)) {
      setAuthStatus("Acesso expirado. Renove a validade na area administrativa.");
      return;
    }

    const session = buildLocalSessionUser(user);
    persistLocalSessionUser(session);

    if (refs.loginForm) {
      refs.loginForm.reset();
    }

    setAuthStatus("");
    applyAuthenticatedSession(session);
  }

  async function handleLogout() {
    if (state.authProvider === "api") {
      try {
        await apiJson(AUTH_API.logout, { method: "POST" });
      } catch (error) {
        console.error(error);
      }
    } else {
      clearLocalSessionUser();
    }

    state.sessionUser = null;

    if (refs.adminShell) {
      refs.adminShell.classList.add("hidden");
    }
    if (refs.appShell) {
      refs.appShell.classList.add("hidden");
    }
    if (refs.authShell) {
      refs.authShell.classList.remove("hidden");
    }
    closeInlineAdminPanel();
    setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
    setAuthStatus("Sessao encerrada com sucesso.");
  }

  function applyAuthenticatedSession(session) {
    state.sessionUser = session || null;
    const isAdminSession = Boolean(session && (session.role === "admin" || session.isAdmin));

    if (refs.authShell) {
      refs.authShell.classList.add("hidden");
    }

    if (refs.adminShell) {
      refs.adminShell.classList.toggle("hidden", !isAdminSession);
    }
    if (refs.appShell) {
      refs.appShell.classList.toggle("hidden", isAdminSession);
    }

    if (isAdminSession) {
      setAuthAccessType("admin", { preserveMode: true });
      if (refs.adminSessionUserLabel) {
        refs.adminSessionUserLabel.textContent = session && session.company
          ? `${session.username} - ${session.company}`
          : (session && session.username ? session.username : "Administrador");
      }
      if (refs.adminPanel) {
        refs.adminPanel.classList.remove("hidden");
      }
      setAdminView(state.adminCurrentView || "overview");
      state.adminPanelOpen = true;
      loadInlineAdminUsers().catch((error) => {
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = error.message || "Nao foi possivel carregar os acessos cadastrados.";
        }
      });
      return;
    }

    setAuthAccessType("buyer", { preserveMode: true });
    if (refs.sessionUserLabel) {
      refs.sessionUserLabel.textContent = session && session.company
        ? `${session.username} - ${session.company}`
        : (session && session.username ? session.username : "Sessao ativa");
    }

    if (refs.reportCompany && !refs.reportCompany.value && session && session.company) {
      refs.reportCompany.value = session.company;
    }
  }

  function isAccessTypeAllowed(user) {
    const isAdminUser = Boolean(user && (user.role === "admin" || user.isAdmin));
    return state.authAccessType === "admin" ? isAdminUser : !isAdminUser;
  }

  function accessTypeMismatchMessage(user) {
    const isAdminUser = Boolean(user && (user.role === "admin" || user.isAdmin));
    return isAdminUser
      ? "Este login pertence ao administrador da plataforma. Use a entrada Administrador."
      : "Este login pertence a uma empresa cliente. Use a entrada Empresa.";
  }

  async function loadInlineAdminUsers() {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Carregando acessos...</div>';

    if (state.authProvider === "api") {
      const response = await apiJson("/api/admin/users");
      const users = Array.isArray(response.users) ? response.users : [];

      if (refs.adminUsersCount) {
        refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
      }

      renderInlineAdminUsers(users);
      return;
    }

    const users = readLocalUsers().map(serializeLocalUser);
    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
    }
    renderInlineAdminUsers(users);
  }

  async function handleInlineAdminCreateUser(event) {
    event.preventDefault();

    const payload = {
      company: refs.adminCompany ? refs.adminCompany.value.trim() : "",
      username: refs.adminUsername ? refs.adminUsername.value.trim() : "",
      password: refs.adminPassword ? refs.adminPassword.value : "",
      role: refs.adminRole ? refs.adminRole.value : "buyer",
      status: refs.adminStatus ? refs.adminStatus.value : "active",
      expiresAt: refs.adminExpiresAt && refs.adminExpiresAt.value ? refs.adminExpiresAt.value : null
    };

    if (state.authProvider === "api") {
      try {
        await apiJson("/api/admin/users", {
          method: "POST",
          body: payload
        });

        if (refs.createUserForm) {
          refs.createUserForm.reset();
        }
        if (refs.adminRole) {
          refs.adminRole.value = "buyer";
        }
        if (refs.adminStatus) {
          refs.adminStatus.value = "active";
        }
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = "Acesso criado com sucesso.";
        }

        await loadInlineAdminUsers();
      } catch (error) {
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = error.message || "Nao foi possivel criar o acesso.";
        }
      }
      return;
    }

    if (!payload.company || !payload.username || !payload.password) {
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = "Preencha empresa, usuario e senha inicial para criar o acesso.";
      }
      return;
    }

    if (payload.password.length < 6) {
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = "A senha inicial precisa ter pelo menos 6 caracteres.";
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(payload.username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = "Ja existe um acesso com esse usuario neste navegador.";
      }
      return;
    }

    const passwordHash = await buildAuthHash(payload.password);
    const newUser = buildLocalUserRecord({
      company: payload.company,
      username: payload.username,
      passwordHash,
      role: payload.role === "admin" ? "admin" : "buyer",
      status: payload.status === "blocked" ? "blocked" : "active",
      expiresAt: payload.expiresAt || null
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.createUserForm) {
      refs.createUserForm.reset();
    }
    if (refs.adminRole) {
      refs.adminRole.value = "buyer";
    }
    if (refs.adminStatus) {
      refs.adminStatus.value = "active";
    }
    if (refs.adminStatusNote) {
      refs.adminStatusNote.textContent = "Acesso criado com sucesso.";
    }

    await loadInlineAdminUsers();
  }

  async function handleInlineAdminUpdateUser(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const userId = form && form.dataset ? form.dataset.inlineUserId : "";
    const note = document.querySelector(`[data-inline-user-note="${CSS.escape(userId)}"]`);
    const formData = new FormData(form);
    const payload = {
      company: String(formData.get("company") || "").trim(),
      username: String(formData.get("username") || "").trim(),
      role: String(formData.get("role") || ""),
      status: String(formData.get("status") || ""),
      expiresAt: String(formData.get("expiresAt") || ""),
      password: String(formData.get("password") || "")
    };

    if (state.authProvider === "api") {
      try {
        await apiJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          body: payload
        });

        if (note) {
          note.textContent = "Alteracoes salvas com sucesso.";
        }

        await loadInlineAdminUsers();
      } catch (error) {
        if (note) {
          note.textContent = error.message || "Nao foi possivel salvar as alteracoes.";
        }
      }
      return;
    }

    const users = readLocalUsers();
    const index = users.findIndex((item) => item.id === userId);
    if (index === -1) {
      if (note) {
        note.textContent = "Usuario nao localizado.";
      }
      return;
    }

    if (!payload.company || !payload.username) {
      if (note) {
        note.textContent = "Empresa e usuario sao obrigatorios.";
      }
      return;
    }

    const usernameKey = normalizeUserIdentifier(payload.username);
    const duplicated = users.some((item) => item.id !== userId && item.usernameKey === usernameKey);
    if (duplicated) {
      if (note) {
        note.textContent = "Ja existe outro acesso com esse usuario.";
      }
      return;
    }

    const current = users[index];
    const updated = {
      ...current,
      company: payload.company,
      username: payload.username,
      usernameKey,
      role: payload.role === "admin" ? "admin" : "buyer",
      status: payload.status === "blocked" ? "blocked" : "active",
      expiresAt: payload.expiresAt || null,
      updatedAt: new Date().toISOString()
    };

    if (payload.password) {
      if (payload.password.length < 6) {
        if (note) {
          note.textContent = "A nova senha precisa ter pelo menos 6 caracteres.";
        }
        return;
      }
      updated.passwordHash = await buildAuthHash(payload.password);
    }

    users[index] = updated;
    writeLocalUsers(users);

    if (state.sessionUser && state.sessionUser.id === updated.id) {
      const nextSession = buildLocalSessionUser(updated);
      persistLocalSessionUser(nextSession);
      applyAuthenticatedSession(nextSession);
    }

    if (note) {
      note.textContent = "Alteracoes salvas com sucesso.";
    }

    await loadInlineAdminUsers();
  }

  function readLocalUsers() {
    try {
      const raw = window.localStorage.getItem("enquadra_local_users_v1");
      const users = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(users) ? users : [];
      let changed = false;
      const companyById = new Map(
        list
          .filter((item) => item && item.role === "buyer" && normalizeAccountType(item.accountType) === "company")
          .map((item) => [item.id, item])
      );
      const synced = list.map((user) => {
        if (!isCompanyManagedDoctorUser(user)) {
          return user;
        }

        const companyUser = companyById.get(user.linkedCompanyId);
        if (!companyUser) {
          return user;
        }

        const next = {
          ...user,
          company: companyUser.company,
          companyLogoDataUrl: companyUser.companyLogoDataUrl || "",
          planId: companyUser.planId || user.planId,
          planLabel: companyUser.planLabel || user.planLabel,
          planPriceCents: Number(companyUser.planPriceCents || 0),
          billingCycleMonths: Number(companyUser.billingCycleMonths || 0),
          planLaudoLimit: companyUser.planLaudoLimit === null || companyUser.planLaudoLimit === undefined
            ? null
            : Number(companyUser.planLaudoLimit),
          paymentStatus: companyUser.paymentStatus || user.paymentStatus,
          paymentDueAt: companyUser.paymentDueAt || null,
          paymentLastApprovedAt: companyUser.paymentLastApprovedAt || user.paymentLastApprovedAt || null,
          status: user.status === "blocked"
            ? "blocked"
            : (companyUser.status === "blocked"
              ? "blocked"
              : (companyUser.status === "inadimplente" ? "inadimplente" : "active"))
        };

        if (JSON.stringify(next) !== JSON.stringify(user)) {
          changed = true;
          next.updatedAt = new Date().toISOString();
        }
        return next;
      });

      if (changed) {
        writeLocalUsers(synced);
      }

      return synced;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function writeLocalUsers(users) {
    window.localStorage.setItem("enquadra_local_users_v1", JSON.stringify(users));
  }

  function getLocalSessionUser() {
    try {
      const raw = window.sessionStorage.getItem("enquadra_local_session_v1");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function persistLocalSessionUser(session) {
    window.sessionStorage.setItem("enquadra_local_session_v1", JSON.stringify(session));
  }

  function clearLocalSessionUser() {
    window.sessionStorage.removeItem("enquadra_local_session_v1");
  }

  function handleLocalAccessReset() {
    setAuthStatus("A reconfiguração manual do acesso local foi desativada nesta instalação.");
  }

  function buildLocalUserRecord({ company, username, passwordHash, role, status, expiresAt }) {
    const now = new Date().toISOString();
    return {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      company,
      username,
      usernameKey: normalizeUserIdentifier(username),
      passwordHash,
      role,
      status,
      expiresAt,
      createdAt: now,
      updatedAt: now
    };
  }

  function buildLocalSessionUser(user) {
    return {
      id: user.id,
      company: user.company,
      username: user.username,
      role: user.role,
      status: user.status,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin"
    };
  }

  function serializeLocalUser(user) {
    return {
      id: user.id,
      company: user.company,
      username: user.username,
      role: user.role,
      status: user.status,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin"
    };
  }

  function isUserExpired(value) {
    if (!value) {
      return false;
    }
    const expiresAt = new Date(value);
    if (Number.isNaN(expiresAt.getTime())) {
      return false;
    }
    expiresAt.setHours(23, 59, 59, 999);
    return Date.now() > expiresAt.getTime();
  }

  function initAuth() {
    if (refs.loginForm) refs.loginForm.addEventListener("submit", handleLoginSubmit);
    if (refs.registerForm) refs.registerForm.addEventListener("submit", handlePublicRegistration);
    if (refs.setupForm) refs.setupForm.addEventListener("submit", handleSetupSubmit);
    if (refs.showSetupButton) refs.showSetupButton.addEventListener("click", () => setAuthMode("setup"));
    if (refs.showRegisterButton) refs.showRegisterButton.addEventListener("click", () => setAuthMode("register"));
    if (refs.showLoginButton) refs.showLoginButton.addEventListener("click", () => setAuthMode("login"));
    if (refs.showLoginFromRegisterButton) refs.showLoginFromRegisterButton.addEventListener("click", () => setAuthMode("login"));
    if (refs.logoutButton) refs.logoutButton.addEventListener("click", handleLogout);
    if (refs.adminLogoutButton) refs.adminLogoutButton.addEventListener("click", handleLogout);
    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        setAuthAccessType("buyer");
        setAuthMode("login");
        setAuthStatus("Acesse com a conta da empresa ou crie uma nova assinatura.");
      });
    }
    if (refs.accessAdminButton) {
      refs.accessAdminButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        setAuthAccessType("admin");
        setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
        setAuthStatus(state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais do administrador da plataforma."
          : "Configure agora o administrador principal da plataforma.");
      });
    }
    if (refs.reportWorkerCpf) refs.reportWorkerCpf.addEventListener("input", handleCpfMaskInput);

    loadAuthBootstrap();
  }

  async function loadAuthBootstrap() {
    if (window.location.protocol === "file:") {
      activateLocalAuthMode();
      return;
    }

    try {
      const bootstrap = await apiJson("/api/public/bootstrap");
      state.authProvider = "api";
      state.authBootstrap = bootstrap;
      state.planCatalog = Array.isArray(bootstrap.plans) ? bootstrap.plans : [];
      populatePlanSelects();

      const sessionResponse = await apiJson(AUTH_API.session);
      if (sessionResponse.authenticated && sessionResponse.user) {
        applyAuthenticatedSession(sessionResponse.user);
        if (sessionResponse.summary) {
          renderAdminDashboardSummary(sessionResponse.summary);
        }
        return;
      }

      if (!state.authAccessTouched) {
        setAuthAccessType("buyer", { preserveMode: true });
      } else {
        updateAuthEntryCopy();
      }
      setAuthMode(bootstrap.configured ? "login" : "setup");
      setAuthStatus(bootstrap.configured
        ? "Escolha o perfil de entrada e siga com login ou criacao de conta."
        : "Configure o administrador principal para liberar a plataforma.");
    } catch (error) {
      console.error(error);
      activateLocalAuthMode();
    }
  }

  function activateLocalAuthMode() {
    state.authProvider = "local";
    ensureLocalDefaultAdmin();
    state.planCatalog = getDefaultPlanCatalog();
    populatePlanSelects();
    const users = readLocalUsers();
    const session = getLocalSessionUser();
    state.authBootstrap = { configured: users.some((item) => item.role === "admin"), mode: "local", plans: state.planCatalog };

    if (session && session.username) {
      applyAuthenticatedSession(session);
      return;
    }

    if (!state.authAccessTouched) {
      setAuthAccessType("buyer", { preserveMode: true });
    } else {
      updateAuthEntryCopy();
    }
    setAuthMode("login");
    setAuthStatus("Modo local ativo. Use a area da empresa para testes operacionais ou a area administrativa para controle interno.");
  }

  function setAuthAccessType(type, options = {}) {
    state.authAccessType = type === "admin" ? "admin" : "buyer";
    if (refs.accessBuyerButton) refs.accessBuyerButton.classList.toggle("is-active", state.authAccessType === "buyer");
    if (refs.accessAdminButton) refs.accessAdminButton.classList.toggle("is-active", state.authAccessType === "admin");
    if (!options.preserveMode) {
      setAuthMode(state.authMode);
      return;
    }
    updateAuthEntryCopy();
  }

  function setAuthMode(mode) {
    state.authMode = mode === "setup" || mode === "register" ? mode : "login";
    if (refs.loginForm) refs.loginForm.classList.toggle("hidden", state.authMode !== "login");
    if (refs.registerForm) refs.registerForm.classList.toggle("hidden", state.authMode !== "register");
    if (refs.setupForm) refs.setupForm.classList.toggle("hidden", state.authMode !== "setup");
    updateAuthEntryCopy();
  }

  function setAuthStatus(message = "") {
    if (!refs.authStatus) {
      return;
    }
    clearAuthStatusAction();
    const normalized = fixBrokenText(String(message || "").trim());
    refs.authStatus.textContent = normalized;
    if (!normalized) {
      delete refs.authStatus.dataset.tone;
      return;
    }
    const tone = inferStatusTone(normalized);
    if (tone) {
      refs.authStatus.dataset.tone = tone;
    } else {
      delete refs.authStatus.dataset.tone;
    }
  }

  function inferStatusTone(message = "") {
    const normalized = toAsciiSafeText(message).toLowerCase();
    if (!normalized) {
      return "";
    }
    if (
      normalized.includes("nao foi possivel")
      || normalized.includes("não foi possível")
      || normalized.includes("inval")
      || normalized.includes("invál")
      || normalized.includes("bloquead")
      || normalized.includes("falh")
      || normalized.includes("recusad")
      || normalized.includes("cancelad")
      || normalized.includes("vencid")
      || normalized.includes("erro")
    ) {
      return "error";
    }
    if (
      normalized.includes("pendente")
      || normalized.includes("processamento")
      || normalized.includes("aguarde")
      || normalized.includes("analise")
      || normalized.includes("análise")
      || normalized.includes("checkout")
      || normalized.includes("mercado pago")
    ) {
      return "warning";
    }
    if (
      normalized.includes("sucesso")
      || normalized.includes("liberad")
      || normalized.includes("aprovad")
      || normalized.includes("aberto em nova guia")
      || normalized.includes("criada")
      || normalized.includes("criado")
      || normalized.includes("configurad")
      || normalized.includes("encerrada")
      || normalized.includes("encerrado")
    ) {
      return "success";
    }
    return "info";
  }

  function inferStatusTone(message = "") {
    const normalized = toAsciiSafeText(message).toLowerCase();
    if (!normalized) {
      return "";
    }
    if (
      normalized.includes("nao foi possivel")
      || normalized.includes("inval")
      || normalized.includes("bloquead")
      || normalized.includes("falh")
      || normalized.includes("recusad")
      || normalized.includes("cancelad")
      || normalized.includes("vencid")
      || normalized.includes("erro")
    ) {
      return "error";
    }
    if (
      normalized.includes("pendente")
      || normalized.includes("processamento")
      || normalized.includes("aguarde")
      || normalized.includes("analise")
      || normalized.includes("checkout")
      || normalized.includes("mercado pago")
    ) {
      return "warning";
    }
    if (
      normalized.includes("sucesso")
      || normalized.includes("liberad")
      || normalized.includes("aprovad")
      || normalized.includes("aberto em nova guia")
      || normalized.includes("criada")
      || normalized.includes("criado")
      || normalized.includes("configurad")
      || normalized.includes("encerrada")
      || normalized.includes("encerrado")
    ) {
      return "success";
    }
    return "info";
  }

  function clearAuthStatusAction() {
    if (!refs.authStatusAction) {
      return;
    }
    refs.authStatusAction.classList.add("hidden");
    refs.authStatusAction.textContent = "";
    refs.authStatusAction.removeAttribute("href");
  }

  function setAuthStatusAction({ label = "", href = "" } = {}) {
    if (!refs.authStatusAction) {
      return;
    }
    const normalizedLabel = fixBrokenText(String(label || "").trim());
    const normalizedHref = String(href || "").trim();
    if (!normalizedLabel || !normalizedHref) {
      clearAuthStatusAction();
      return;
    }
    refs.authStatusAction.textContent = normalizedLabel;
    refs.authStatusAction.href = normalizedHref;
    refs.authStatusAction.classList.remove("hidden");
  }

  function resolveCheckoutStatusActionPayload(source) {
    if (!source || typeof source !== "object") {
      return { href: "", label: "" };
    }
    const user = source.user || {};
    const checkout = source.checkout || {};
    const href = String(checkout.checkoutUrl || checkout.sandboxCheckoutUrl || user.mpCheckoutUrl || "").trim();
    if (!href) {
      return { href: "", label: "" };
    }
    const paymentStatus = normalizeLocalPaymentStatus(user.paymentStatus || "");
    return {
      href,
      label: paymentStatus === "pending" ? "Retomar pagamento" : "Abrir checkout do plano"
    };
  }

  function applyCheckoutStatusAction(source) {
    const action = resolveCheckoutStatusActionPayload(source);
    if (!action.href) {
      return false;
    }
    setAuthStatusAction(action);
    return true;
  }

  function updateAuthEntryCopy() {
    const isAdmin = state.authAccessType === "admin";
    const isRegister = state.authMode === "register";
    const isSetup = state.authMode === "setup";
    const providerLabel = state.authProvider === "local" ? "local" : "SaaS";

    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = isSetup
        ? "Configuracao do administrador"
        : isRegister
          ? "Nova conta empresarial"
          : (isAdmin ? `Acesso administrador ${providerLabel}` : `Acesso empresa ${providerLabel}`);
    }

    if (refs.authTitle) {
      refs.authTitle.textContent = isSetup
        ? "Configurar administrador da plataforma"
        : isRegister
          ? "Criar conta da empresa"
          : (isAdmin ? "Entrar como administrador" : "Entrar como empresa");
    }

    if (refs.authDescription) {
      refs.authDescription.textContent = isSetup
        ? "Fluxo exclusivo para a conta administradora que controla clientes, pagamentos, acessos e operacao comercial."
        : isRegister
          ? "Cadastre a empresa, escolha o plano e siga para a liberacao comercial pelo Mercado Pago."
          : (isAdmin
            ? "Entrada restrita ao controle administrativo da plataforma, clientes, planos, status e acompanhamento de uso."
            : "Entrada da empresa cliente para realizar enquadramentos, gerar laudos e operar o ambiente ocupacional.");
    }

    if (refs.loginSubmitButton) refs.loginSubmitButton.textContent = isAdmin ? "Entrar no painel administrativo" : "Entrar na area da empresa";
    if (refs.showRegisterButton) refs.showRegisterButton.classList.toggle("hidden", isAdmin || isRegister || isSetup);
    if (refs.showSetupButton) refs.showSetupButton.classList.toggle("hidden", !isAdmin || isSetup || (state.authBootstrap && state.authBootstrap.configured));
  }

  async function handleSetupSubmit(event) {
    event.preventDefault();
    const company = normalizedText("setupCompany");
    const username = normalizedText("setupUsername");
    const password = valueOfRaw("setupPassword");
    const confirmation = valueOfRaw("setupPasswordConfirm");

    if (!company || !username || !password || !confirmation) {
      setAuthStatus("Preencha empresa, usuario e senha do administrador.");
      return;
    }
    if (password.length < 6) {
      setAuthStatus("A senha do administrador precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setAuthStatus("A confirmacao da senha nao confere.");
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(AUTH_API.setup, { method: "POST", body: { company, username, password } });
        persistApiSessionToken(response.sessionToken || "");
        if (refs.setupForm) refs.setupForm.reset();
        setAuthStatus("");
        applyAuthenticatedSession(response.user);
      } catch (error) {
        setAuthStatus(error.message || "Nao foi possivel concluir a configuracao administrativa.");
      }
      return;
    }

    setAuthStatus("No modo local, o administrador padrao ja fica disponivel automaticamente.");
    setAuthMode("login");
    setAuthAccessType("admin", { preserveMode: true });
  }

  function fixBrokenText(value) {
    let text = String(value || "");
    if (/[ÃÂâ]/.test(text)) {
      try {
        text = decodeURIComponent(escape(text));
      } catch (error) {
        // Mantem o texto original se a reconversao falhar.
      }
    }
    return text
      .replace(/\u00a0/g, " ")
      .replace(/\u2022/g, "-");
  }

  function toAsciiSafeText(value) {
    const fixed = fixBrokenText(value);
    return fixed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function loadAuthBootstrap() {
    if (window.location.protocol === "file:") {
      await activateLocalAuthMode();
      return;
    }

    try {
      const bootstrap = await apiJson("/api/public/bootstrap");
      state.authProvider = "api";
      state.authBootstrap = bootstrap;
      state.planCatalog = Array.isArray(bootstrap.plans) ? bootstrap.plans : [];
      populatePlanSelects();

      const sessionResponse = await apiJson(AUTH_API.session);
      if (sessionResponse.authenticated && sessionResponse.user) {
        persistApiSessionToken(sessionResponse.sessionToken || getApiSessionToken());
        applyAuthenticatedSession(sessionResponse.user);
        if (sessionResponse.summary) {
          renderAdminDashboardSummary(sessionResponse.summary);
        }
        return;
      }

      clearApiSessionToken();

      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode(bootstrap.configured ? "login" : "setup");
      applyCheckoutQueryFeedback();

      if (!window.location.search.includes("checkout=")) {
        setAuthStatus(bootstrap.configured
          ? "Escolha o perfil de entrada e siga com login ou criacao de conta."
          : "Configure o administrador principal para liberar a plataforma.");
      }
    } catch (error) {
      console.error(error);
      await activateLocalAuthMode();
    }
  }

  async function activateLocalAuthMode() {
    state.authProvider = "local";
    state.planCatalog = getDefaultPlanCatalog();
    populatePlanSelects();
    await ensureLocalDefaultAdmin();

    const users = readLocalUsers();
    const session = getLocalSessionUser();
    state.authBootstrap = {
      configured: users.some((item) => item.role === "admin"),
      mode: "local",
      plans: state.planCatalog
    };

    if (session && session.username) {
      applyAuthenticatedSession(session);
      return;
    }

    if (!state.authAccessTouched) {
      setAuthAccessType("buyer", { preserveMode: true });
    } else {
      updateAuthEntryCopy();
    }
    setAuthMode("login");
    setAuthStatus("Modo local ativo. Use o login da empresa para testes ou entre como administrador com o usuario padrao.");
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const username = normalizedText("loginUsername");
    const password = valueOfRaw("loginPassword");

    if (!username || !password) {
      setAuthStatus("Informe usuário ou e-mail e a senha para entrar.");
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(AUTH_API.login, {
          method: "POST",
          body: { username, password }
        });
        persistApiSessionToken(response.sessionToken || "");

        if (!isAccessTypeAllowed(response.user)) {
          try {
            await apiJson(AUTH_API.logout, { method: "POST" });
          } catch (logoutError) {
            console.error(logoutError);
          }
          clearApiSessionToken();
          setAuthStatus(accessTypeMismatchMessage(response.user));
          return;
        }

        if (refs.loginForm) {
          refs.loginForm.reset();
        }

        setAuthStatus("");
        applyAuthenticatedSession(response.user);
      } catch (error) {
        setAuthStatus(error.message || "Credenciais inválidas. Revise usuário, e-mail e senha.");
        applyCheckoutStatusAction(error && error.payload ? error.payload : null);
      }
      return;
    }

    const users = readLocalUsers();
    const identifier = normalizeUserIdentifier(username);
    const userIndex = users.findIndex((item) => item.usernameKey === identifier || normalizeUserIdentifier(item.email) === identifier);
    const user = userIndex >= 0 ? users[userIndex] : null;

    if (!user) {
      setAuthStatus("Credenciais inválidas. Revise usuário, e-mail e senha.");
      return;
    }

    if (!isAccessTypeAllowed(user)) {
      setAuthStatus(accessTypeMismatchMessage(user));
      return;
    }

    const candidateHash = await buildAuthHash(password);
    if (candidateHash !== user.passwordHash) {
      setAuthStatus("Credenciais inválidas. Revise usuário, e-mail e senha.");
      return;
    }

    const accessError = getLocalAccessError(user);
    if (accessError) {
      setAuthStatus(accessError);
      return;
    }

    const updatedUser = {
      ...user,
      lastAccessAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    writeLocalUsers(users);

    const session = buildLocalSessionUser(updatedUser);
    persistLocalSessionUser(session);

    if (refs.loginForm) {
      refs.loginForm.reset();
    }

    setAuthStatus("");
    applyAuthenticatedSession(session);
  }

  async function loadInlineAdminUsers() {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Carregando acessos...</div>';

    if (state.authProvider === "api") {
      const response = await apiJson("/api/admin/users");
      const users = Array.isArray(response.users) ? response.users : [];
      state.adminUsersCache = users;

      if (Array.isArray(response.plans) && response.plans.length) {
        state.planCatalog = response.plans;
        populatePlanSelects();
      }

      if (refs.adminUsersCount) {
        refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
      }

      if (response.summary) {
        renderAdminDashboardSummary(response.summary);
      }

      renderInlineAdminUsers(getVisibleAdminUsers());
      return;
    }

    const users = readLocalUsers().map(serializeLocalUser);
    state.adminUsersCache = users;
    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
    }
    renderAdminDashboardSummary(computeLocalDashboardSummary(users));
    renderInlineAdminUsers(getVisibleAdminUsers());
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const planLabel = user.role === "admin"
        ? "Administracao interna"
        : `${user.planLabel || "Plano nao definido"} (${formatCurrencyCents(user.planPriceCents || 0)})`;

      const card = document.createElement("article");
      card.className = "user-card";
      card.innerHTML = `
        <div class="user-card-head">
          <div>
            <h4>${escapeHtml(user.company || "Empresa nao informada")}</h4>
            <p>${escapeHtml(user.username || "-")} - ${escapeHtml(roleLabel)}</p>
            <p>${escapeHtml(user.contactName || "Sem responsavel informado")} - ${escapeHtml(user.email || "Sem e-mail")}</p>
          </div>
          <span class="user-badge ${escapeHtml(user.status || "active")}">${escapeHtml(statusLabel)}</span>
        </div>

        <div class="user-meta">
          <div class="meta-box"><strong>Plano</strong><span>${escapeHtml(planLabel)}</span></div>
          <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
          <div class="meta-box"><strong>Laudos</strong><span>${escapeHtml(String(Number(user.usageCount || 0)))}</span></div>
          <div class="meta-box"><strong>Criado em</strong><span>${escapeHtml(formatInlineAdminDateTime(user.createdAt))}</span></div>
          <div class="meta-box"><strong>Ultimo acesso</strong><span>${escapeHtml(formatInlineAdminDateTime(user.lastAccessAt))}</span></div>
          <div class="meta-box"><strong>Vencimento</strong><span>${escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt))}</span></div>
        </div>

        ${state.authProvider === "api" && user.role !== "admin" ? `
          <div class="admin-user-quick-actions">
            <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar link Mercado Pago</button>
          </div>
        ` : ""}

        <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
          <label class="field"><span>Empresa</span><input type="text" name="company" value="${escapeHtml(user.company || "")}"></label>
          <label class="field"><span>Responsavel</span><input type="text" name="contactName" value="${escapeHtml(user.contactName || "")}"></label>
          <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(user.email || "")}"></label>
          <label class="field"><span>Usuario</span><input type="text" name="username" value="${escapeHtml(user.username || "")}"></label>
          <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
          <label class="field"><span>Status</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
          <label class="field"><span>Pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
          <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
          <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
          <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
          <label class="field field-full"><span>Observacoes</span><textarea name="notes" rows="3">${escapeHtml(user.notes || "")}</textarea></label>
          <div class="form-actions field-full"><button class="primary-button" type="submit">Salvar alteracoes</button></div>
        </form>

        <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
      `;

      refs.adminUsersGrid.appendChild(card);
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  async function handleInlineAdminCreateUser(event) {
    event.preventDefault();

    const profile = getAdminCreateProfile();
    if (!profile) {
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = "Escolha primeiro se o novo cadastro será de administrador, empresa ou médico.";
      }
      return;
    }

    const payload = {
      company: refs.adminCompany ? refs.adminCompany.value.trim() : "",
      contactName: refs.adminContactName ? refs.adminContactName.value.trim() : "",
      email: refs.adminEmail ? refs.adminEmail.value.trim().toLowerCase() : "",
      username: refs.adminUsername ? refs.adminUsername.value.trim() : "",
      password: refs.adminPassword ? refs.adminPassword.value : "",
      role: profile === "admin" ? "admin" : "buyer",
      accountType: profile === "doctor" ? "doctor" : "company",
      crmNumber: refs.adminCrmNumber ? refs.adminCrmNumber.value.replace(/\D/g, "") : "",
      crmState: refs.adminCrmState ? refs.adminCrmState.value : "",
      crmValidated: refs.adminCrmValidated ? refs.adminCrmValidated.value === "true" : false,
      status: profile === "admin" ? "active" : (refs.adminStatus ? refs.adminStatus.value : "active"),
      paymentStatus: profile === "admin" ? "approved" : (refs.adminPaymentStatus ? refs.adminPaymentStatus.value : "pending"),
      paymentDueAt: profile === "admin"
        ? null
        : (refs.adminPaymentDueAt && refs.adminPaymentDueAt.value ? refs.adminPaymentDueAt.value : null),
      planId: profile === "admin" ? "internal" : (refs.adminPlan ? refs.adminPlan.value : ""),
      notes: refs.adminNotes ? refs.adminNotes.value.trim() : ""
    };

    if (!payload.company || !payload.username || !payload.password) {
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = profile === "admin"
          ? "Preencha nome do administrador, usuario e senha inicial para criar o acesso."
          : (profile === "doctor"
            ? "Preencha nome do médico, usuario e senha inicial para criar o acesso."
            : "Preencha empresa, usuario e senha inicial para criar o acesso.");
      }
      return;
    }

    if (payload.password.length < 6) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "A senha inicial precisa ter pelo menos 6 caracteres.";
      return;
    }

    if (profile === "doctor" && (!payload.crmNumber || payload.crmNumber.length < 4 || !payload.crmState)) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Para cadastro medico, informe CRM e UF antes de liberar o acesso.";
      return;
    }

    if (profile !== "admin" && !payload.planId) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Selecione um plano antes de criar o acesso.";
      return;
    }

    const successMessage = profile === "doctor" && !payload.crmValidated
      ? "Acesso criado. O login fica disponivel apos a contratacao, mas a emissao documental permanece bloqueada ate a validacao manual do CRM."
      : (profile === "admin" ? "Administrador criado com sucesso." : "Acesso criado com sucesso.");

    if (state.authProvider === "api") {
      try {
        const response = await apiJson("/api/admin/users", { method: "POST", body: payload });

        resetInlineAdminCreateForm();
        populatePlanSelects();
        if (response.summary) renderAdminDashboardSummary(response.summary);
        state.adminExpandedUserId = response && response.user && response.user.id ? response.user.id : "";
        setAdminView("users");
        if (refs.adminStatusNote) refs.adminStatusNote.textContent = successMessage;
        await loadInlineAdminUsers();
      } catch (error) {
        if (refs.adminStatusNote) refs.adminStatusNote.textContent = error.message || "Nao foi possivel criar o acesso.";
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(payload.username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Ja existe um acesso com esse usuario neste navegador.";
      return;
    }
    if (payload.email && users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(payload.email))) {
      if (refs.adminStatusNote) refs.adminStatusNote.textContent = "Ja existe um acesso com esse e-mail neste navegador.";
      return;
    }

    const passwordHash = await buildAuthHash(payload.password);
    const plan = profile === "admin" ? null : getPlanCatalogById(payload.planId || "mensal");
    const newUser = buildLocalUserRecord({
      company: payload.company,
      username: payload.username,
      passwordHash,
      role: payload.role === "admin" ? "admin" : "buyer",
      status: payload.role === "admin" ? "active" : normalizeLocalStatus(payload.status),
      expiresAt: null,
      contactName: payload.contactName,
      email: payload.email,
      paymentStatus: payload.role === "admin" ? "approved" : normalizeLocalPaymentStatus(payload.paymentStatus),
      paymentDueAt: payload.role === "admin"
        ? null
        : (payload.paymentDueAt ? new Date(payload.paymentDueAt).toISOString() : addMonthsToIso(new Date(), plan ? plan.months : 1)),
      planId: payload.role === "admin" ? "internal" : (plan ? plan.id : "mensal"),
      notes: payload.notes,
      accountType: payload.role === "admin" ? "company" : payload.accountType,
      crmNumber: payload.role === "admin" || payload.accountType !== "doctor" ? "" : payload.crmNumber,
      crmState: payload.role === "admin" || payload.accountType !== "doctor" ? "" : payload.crmState,
      crmValidated: payload.role === "admin" || payload.accountType !== "doctor" ? false : payload.crmValidated
    });

    users.push(newUser);
    writeLocalUsers(users);

    resetInlineAdminCreateForm();
    populatePlanSelects();
    state.adminExpandedUserId = newUser.id;
    setAdminView("users");
    if (refs.adminStatusNote) refs.adminStatusNote.textContent = successMessage;
    await loadInlineAdminUsers();
  }

  async function handleInlineAdminUpdateUser(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const userId = form && form.dataset ? form.dataset.inlineUserId : "";
    const note = document.querySelector(`[data-inline-user-note="${CSS.escape(userId)}"]`);
    const formData = new FormData(form);
    const payload = {
      company: String(formData.get("company") || "").trim(),
      contactName: String(formData.get("contactName") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      username: String(formData.get("username") || "").trim(),
      role: String(formData.get("role") || ""),
      accountType: normalizeAccountType(String(formData.get("accountType") || "company")),
      crmNumber: String(formData.get("crmNumber") || "").replace(/\D/g, ""),
      crmState: String(formData.get("crmState") || "").toUpperCase(),
      crmValidated: String(formData.get("crmValidated") || "false") === "true",
      status: String(formData.get("status") || ""),
      paymentStatus: String(formData.get("paymentStatus") || ""),
      paymentDueAt: String(formData.get("paymentDueAt") || ""),
      planId: String(formData.get("planId") || ""),
      notes: String(formData.get("notes") || "").trim(),
      password: String(formData.get("password") || "")
    };

    if (payload.role !== "admin" && payload.accountType === "doctor" && (!payload.crmNumber || payload.crmNumber.length < 4 || !payload.crmState)) {
      if (note) note.textContent = "Para cadastro medico, informe CRM e UF antes de salvar.";
      return;
    }

    const successMessage = payload.role !== "admin" && payload.accountType === "doctor" && !payload.crmValidated
      ? "Alteracoes salvas. O login pode seguir ativo, mas a emissao documental permanece bloqueada ate a validacao manual do CRM."
      : "Alteracoes salvas com sucesso.";

    if (state.authProvider === "api") {
      try {
        const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          body: payload
        });

        if (response.summary) renderAdminDashboardSummary(response.summary);
        if (note) note.textContent = successMessage;
        await loadInlineAdminUsers();
      } catch (error) {
        if (note) note.textContent = error.message || "Nao foi possivel salvar as alteracoes.";
      }
      return;
    }

    const users = readLocalUsers();
    const index = users.findIndex((item) => item.id === userId);
    if (index === -1) {
      if (note) note.textContent = "Usuario nao localizado.";
      return;
    }

    if (!payload.company || !payload.username) {
      if (note) note.textContent = "Empresa e usuario sao obrigatorios.";
      return;
    }

    const usernameKey = normalizeUserIdentifier(payload.username);
    const duplicatedUser = users.some((item) => item.id !== userId && item.usernameKey === usernameKey);
    if (duplicatedUser) {
      if (note) note.textContent = "Ja existe outro acesso com esse usuario.";
      return;
    }

    if (payload.email) {
      const duplicatedEmail = users.some((item) => item.id !== userId && normalizeUserIdentifier(item.email) === normalizeUserIdentifier(payload.email));
      if (duplicatedEmail) {
        if (note) note.textContent = "Ja existe outro acesso com esse e-mail.";
        return;
      }
    }

    const current = users[index];
    const role = payload.role === "admin" ? "admin" : "buyer";
    const plan = role === "admin" ? null : getPlanCatalogById(payload.planId || current.planId || "mensal");
    const updated = {
      ...current,
      company: payload.company,
      contactName: payload.contactName,
      email: payload.email,
      username: payload.username,
      usernameKey,
      role,
      status: role === "admin" ? "active" : normalizeLocalStatus(payload.status),
      paymentStatus: role === "admin" ? "approved" : normalizeLocalPaymentStatus(payload.paymentStatus),
      paymentDueAt: role === "admin"
        ? null
        : (payload.paymentDueAt ? new Date(payload.paymentDueAt).toISOString() : current.paymentDueAt),
      planId: role === "admin" ? "internal" : (plan ? plan.id : "mensal"),
      planLabel: role === "admin" ? "Administracao interna" : (plan ? plan.label : current.planLabel),
      planPriceCents: role === "admin" ? 0 : (plan ? Number(plan.priceCents || 0) : Number(current.planPriceCents || 0)),
      billingCycleMonths: role === "admin" ? 0 : (plan ? Number(plan.months || 0) : Number(current.billingCycleMonths || 0)),
      planLaudoLimit: role === "admin" ? null : (plan ? Number(plan.laudoLimit || 0) : current.planLaudoLimit),
      accountType: role === "admin" ? "company" : payload.accountType,
      crmNumber: role === "admin" || payload.accountType !== "doctor" ? "" : payload.crmNumber,
      crmState: role === "admin" || payload.accountType !== "doctor" ? "" : payload.crmState,
      crmValidated: role === "admin" || payload.accountType !== "doctor" ? false : payload.crmValidated,
      notes: payload.notes,
      updatedAt: new Date().toISOString()
    };

    if (payload.password) {
      if (payload.password.length < 6) {
        if (note) note.textContent = "A nova senha precisa ter pelo menos 6 caracteres.";
        return;
      }
      updated.passwordHash = await buildAuthHash(payload.password);
    }

    users[index] = updated;
    writeLocalUsers(users);

    if (state.sessionUser && state.sessionUser.id === updated.id) {
      const nextSession = buildLocalSessionUser(updated);
      persistLocalSessionUser(nextSession);
      applyAuthenticatedSession(nextSession);
    }

    if (note) note.textContent = successMessage;
    await loadInlineAdminUsers();
  }

  async function handleLocalAccessReset() {
    setAuthStatus("A reconfiguração manual do acesso local foi desativada nesta instalação.");
  }

  function buildLocalUserRecord({
    company,
    companyCnpj = "",
    username,
    passwordHash,
    role,
    status,
    expiresAt,
    contactName = "",
    email = "",
    paymentStatus = "approved",
    paymentDueAt = null,
    planId = "mensal",
    notes = "",
    usageCount = 0,
    lastAccessAt = null
  }) {
    const now = new Date().toISOString();
    const plan = role === "admin" ? null : getPlanCatalogById(planId || "mensal");
    return {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      company,
      contactName,
      email,
      username,
      usernameKey: normalizeUserIdentifier(username),
      passwordHash,
      role,
      status: normalizeLocalStatus(status),
      expiresAt,
      paymentStatus: role === "admin" ? "approved" : normalizeLocalPaymentStatus(paymentStatus),
      paymentDueAt: role === "admin" ? null : paymentDueAt,
      paymentLastApprovedAt: role === "admin" || paymentStatus === "approved" ? now : null,
      planId: role === "admin" ? "internal" : (plan ? plan.id : "mensal"),
      planLabel: role === "admin" ? "Administracao interna" : (plan ? plan.label : "Plano Mensal"),
      planPriceCents: role === "admin" ? 0 : Number(plan && plan.priceCents ? plan.priceCents : 0),
      billingCycleMonths: role === "admin" ? 0 : Number(plan && plan.months ? plan.months : 0),
      planLaudoLimit: role === "admin" ? null : Number(plan && plan.laudoLimit ? plan.laudoLimit : 0),
      usageCount: Number(usageCount || 0),
      lastAccessAt,
      notes,
      createdAt: now,
      updatedAt: now
    };
  }

  function buildLocalSessionUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status,
      paymentStatus: user.paymentStatus || "approved",
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || null,
      planLabel: user.planLabel || "",
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin"
    };
  }

  function serializeLocalUser(user) {
    return {
      id: user.id,
      company: user.company,
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status || "active",
      paymentStatus: user.role === "admin" ? "approved" : normalizeLocalPaymentStatus(user.paymentStatus),
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || (user.role === "admin" ? "internal" : "mensal"),
      planLabel: user.planLabel || (user.role === "admin" ? "Administracao interna" : ((getPlanCatalogById(user.planId || "mensal") || {}).label || "Plano Mensal")),
      planPriceCents: Number(user.planPriceCents || 0),
      billingCycleMonths: Number(user.billingCycleMonths || 0),
      planLaudoLimit: user.planLaudoLimit === null || user.planLaudoLimit === undefined ? null : Number(user.planLaudoLimit),
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      notes: user.notes || "",
      expiresAt: user.expiresAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      canAccess: user.role === "admin" ? user.status === "active" : !getLocalAccessError(user)
    };
  }

  async function incrementUsageCounter() {
    if (!state.sessionUser || state.sessionUser.role === "admin" || state.sessionUser.isAdmin) {
      return;
    }

    if (state.authProvider === "api") {
      try {
        const response = await apiJson("/api/usage/laudos", { method: "POST" });
        if (response && response.user) {
          state.sessionUser = response.user;
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    const users = readLocalUsers();
    const index = users.findIndex((item) => item.id === state.sessionUser.id);
    if (index === -1) {
      return;
    }

    users[index] = {
      ...users[index],
      usageCount: Number(users[index].usageCount || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    writeLocalUsers(users);

    const nextSession = buildLocalSessionUser(users[index]);
    persistLocalSessionUser(nextSession);
    state.sessionUser = nextSession;
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final so pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const externalFiles = collectExternalReportFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliacao");
    if (!identity.examiner) missing.push("profissional responsavel");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatorios para emissao do laudo: ${missing.join(", ")}.`);
      return;
    }

    try {
      const attachments = externalFiles.length ? await buildAttachmentPayloads(externalFiles) : [];
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura da janela de impressao. Permita pop-ups desta pagina e tente novamente.");
        return;
      }

      await incrementUsageCounter();
    } catch (error) {
      console.error(error);
      window.alert(`Nao foi possivel preparar a impressao do laudo neste momento.${error && error.message ? `\n\nDetalhe tecnico: ${toAsciiSafeText(error.message)}` : ""}`);
    }
  }

  function fixBrokenText(value) {
    let text = String(value ?? "");
    if (!text) {
      return "";
    }

    const repairTable = [
      ["ÃƒÂ¡", "á"], ["ÃƒÂ ", "à"], ["ÃƒÂ¢", "â"], ["ÃƒÂ£", "ã"], ["ÃƒÂ¤", "ä"],
      ["ÃƒÂ©", "é"], ["ÃƒÂ¨", "è"], ["ÃƒÂª", "ê"], ["ÃƒÂ«", "ë"],
      ["ÃƒÂ­", "í"], ["ÃƒÂ¬", "ì"], ["ÃƒÂ®", "î"], ["ÃƒÂ¯", "ï"],
      ["ÃƒÂ³", "ó"], ["ÃƒÂ²", "ò"], ["ÃƒÂ´", "ô"], ["ÃƒÂµ", "õ"], ["ÃƒÂ¶", "ö"],
      ["ÃƒÂº", "ú"], ["ÃƒÂ¹", "ù"], ["ÃƒÂ»", "û"], ["ÃƒÂ¼", "ü"],
      ["ÃƒÂ§", "ç"], ["Ãƒâ€¡", "Ç"], ["Ãƒâ€°", "É"], ["ÃƒÅ ", "Ê"], ["ÃƒÂ", "Í"],
      ["Ãƒâ€œ", "Ó"], ["Ãƒâ€�", "Ô"], ["Ãƒâ€¢", "Õ"], ["ÃƒÅ¡", "Ú"], ["ÃƒÂ", "Á"],
      ["ÃƒÂ€", "À"], ["ÃƒÂ‚", "Â"], ["ÃƒÆ’", "Ã"], ["ÃƒÂ‰", "É"], ["ÃƒÂ“", "Ó"],
      ["ÃƒÂš", "Ú"], ["ÃƒÂ‡", "Ç"], ["Ã‚Âº", "º"], ["Ã‚Âª", "ª"], ["Ã‚Â°", "°"],
      ["Ã¢â‚¬Â¢", "•"], ["Ã¢â‚¬â€œ", "–"], ["Ã¢â‚¬â€", "—"], ["Ã¢â‚¬Ëœ", "'"],
      ["Ã¢â‚¬â„¢", "'"], ["Ã¢â‚¬Å“", "\""], ["Ã¢â‚¬Â", "\""], ["Â", ""]
    ];

    repairTable.forEach(([from, to]) => {
      if (text.includes(from)) {
        text = text.split(from).join(to);
      }
    });

    if (/[ÃÂâ]/.test(text)) {
      try {
        const decoded = decodeURIComponent(escape(text));
        if (decoded) {
          text = decoded;
        }
      } catch (error) {
        // Mantém o texto reparado pela tabela quando a reconversão falha.
      }
    }

    repairTable.forEach(([from, to]) => {
      if (text.includes(from)) {
        text = text.split(from).join(to);
      }
    });

    return text
      .replace(/\u00a0/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\u2022/g, "-");
  }

  function toPresentationText(value, preserveLineBreaks = false) {
    const fixed = fixBrokenText(value);
    if (preserveLineBreaks) {
      return fixed
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }
    return normalizeSpacing(fixed);
  }

  function lowerFirstPresentation(value) {
    const text = toPresentationText(value);
    return text ? `${text.charAt(0).toLowerCase()}${text.slice(1)}` : "";
  }

  function applyInterfaceCopyRefinements() {
    document.title = "Enquadra PcD | Sistema inteligente para enquadramento ocupacional";

    const setText = (selector, text) => {
      const element = document.querySelector(selector);
      if (element && element.textContent !== text) {
        element.textContent = text;
      }
    };

    const setPairText = (selector, strongText, spanText) => {
      const element = document.querySelector(selector);
      if (!element) {
        return;
      }
      const strong = element.querySelector("strong");
      const span = element.querySelector("span");
      if (strong && strong.textContent !== strongText) strong.textContent = strongText;
      if (span && span.textContent !== spanText) span.textContent = spanText;
    };

    const setLabelFromField = (fieldId, text) => {
      const field = document.getElementById(fieldId);
      const label = field ? field.closest("label") : null;
      const span = label ? label.querySelector("span") : null;
      if (span && span.textContent !== text) {
        span.textContent = text;
      }
    };

    setText("#authShell .auth-brand .eyebrow", "Plataforma SaaS para saúde ocupacional");
    setText("#authShell .auth-brand h2", "Sistema inteligente para enquadramento de PcD com triagem técnica, laudo padronizado e gestão comercial");
    setText("#authShell .auth-brand p", "Plataforma web para caracterização técnico-funcional, emissão de laudo caracterizador, gestão de clientes e operação ocupacional com fluxo orientado.");
    setPairText(".auth-feature-item:nth-of-type(1)", "Fluxo guiado por módulo", "Triagem estruturada para deficiência física, auditiva, visual, intelectual, psicossocial e condições clínicas.");
    setPairText(".auth-feature-item:nth-of-type(2)", "Base técnica orientada", "Critérios objetivos para audição e visão, com avaliação clínico-funcional complementar nos demais cenários.");
    setPairText(".auth-feature-item:nth-of-type(3)", "Laudo institucional e anexos", "Emissão padronizada do laudo caracterizador com documentação externa vinculada ao caso.");
    setPairText(".auth-feature-item:nth-of-type(4)", "Gestão comercial da plataforma", "Controle central de clientes, pagamento, status de acesso e volume de laudos emitidos.");
    setText("#adminShell .brand-block .eyebrow", "Administrador da plataforma");
    setText("#adminShell .topbar-subtitle", "Gestão de clientes, acessos, validade comercial e controle central da plataforma");
    setText("#adminPanel > .section-head .admin-inline-copy", "Use as abas abaixo para acompanhar o ambiente, ver os seus usuários e abrir o cadastro somente quando precisar.");
    setText("[data-admin-view='overview']", "Visão geral");
    setText("[data-admin-view='users']", "Ver usuários");
    setText("[data-admin-view='create']", "Novo cadastro");
    setText("[data-admin-view-panel='users'] .admin-inline-copy", "Clique no usuário para abrir os dados completos, rever laudos gerados, pagamento, validade e cadastro.");
    setText("#appShell .brand-block .eyebrow", "Empresa usuária | enquadramento ocupacional");
    setText("#appShell .topbar-subtitle", "Fluxo guiado para enquadramento, descrição técnica e emissão de laudo caracterizador");
    setText("#appShell .intro-copy h2", "Enquadramento PcD guiado, claro e padronizado");
    setText("#appShell .intro-copy p", "Sistema web voltado ao uso ocupacional com fluxo estruturado por tipo de deficiência, enquadramento orientado por regras técnicas e emissão de laudo caracterizador em padrão operacional.");
    setPairText(".rule-chip:nth-of-type(1)", "Fluxo guiado", "O sistema abre somente os campos relevantes para cada cenário selecionado.");
    setPairText(".rule-chip:nth-of-type(2)", "Resultado direto", "Enquadra, não enquadra ou direciona para revisão complementar quando necessário.");
    setPairText(".rule-chip:nth-of-type(3)", "Laudo padronizado", "A emissão final segue o fluxo do sistema com texto técnico objetivo e impressão oficial.");
    setPairText(".rule-chip:nth-of-type(4)", "Campos mais objetivos", "Menos retrabalho manual, mais seleção guiada e preenchimento assistido.");
    setText(".module-selector .section-title h3", "Selecione o módulo de análise");
    setLabelFromField("loginUsername", "Usuário");
    setLabelFromField("registerContactName", "Responsável");
    setLabelFromField("registerUsername", "Usuário de acesso");
    setLabelFromField("setupCompany", "Empresa / clínica");
    setLabelFromField("setupUsername", "Usuário administrador");
    setLabelFromField("adminUsername", "Usuário");
    setLabelFromField("adminNotes", "Observações internas");
    setText("[data-module='fisica'] p", "Amputação, deformidade, força, mobilidade e perda funcional do segmento acometido.");
    setText("[data-module='auditiva'] p", "Leitura de audiometria, médias por orelha e enquadramento por critério objetivo.");
    setText("[data-module='visual'] p", "Acuidade, campo visual, visão monocular e enquadramento por achado objetivo.");
    setText("[data-module='clinicas'] p", "Fibromialgia, dor crônica e quadros persistentes com repercussão funcional.");
    setText("[data-module='intelectual'] p", "Funcionamento intelectual, habilidades adaptativas e necessidade de suporte.");
    setText("[data-module='psicossocial'] p", "Restrição de participação social e laboral, persistência do quadro e suporte documental.");
  }

  function repairTextNode(node) {
    if (!node || !node.textContent) {
      return;
    }
    const repaired = fixBrokenText(node.textContent);
    if (repaired !== node.textContent) {
      node.textContent = repaired;
    }
  }

  function repairInterfaceTextContent(root = document.body) {
    if (!root || state.isRepairingText) {
      return;
    }

    const observer = state.textRepairObserver;
    state.isRepairingText = true;
    if (observer) {
      observer.disconnect();
    }
    try {
      document.title = fixBrokenText(document.title);

      const targetRoot = root.nodeType === Node.TEXT_NODE ? root.parentNode : root;
      if (!targetRoot) {
        return;
      }

      const walker = document.createTreeWalker(targetRoot, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parentTag = node.parentElement ? node.parentElement.tagName : "";
          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parentTag)) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.textContent && node.textContent.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      });

      const textNodes = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }
      textNodes.forEach(repairTextNode);

      if (targetRoot.querySelectorAll) {
        targetRoot.querySelectorAll("[placeholder],[title],[aria-label],[alt]").forEach((element) => {
          ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
            if (element.hasAttribute(attribute)) {
              const currentValue = element.getAttribute(attribute);
              const repairedValue = fixBrokenText(currentValue);
              if (repairedValue !== currentValue) {
                element.setAttribute(attribute, repairedValue);
              }
            }
          });
        });
      }
    } finally {
      state.isRepairingText = false;
      if (observer && document.body) {
        observer.observe(document.body, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }
  }

  function queueInterfaceTextRepair(root = document.body) {
    if (!root) {
      return;
    }

    state.pendingTextRepairRoot = state.pendingTextRepairRoot || root;

    if (state.pendingTextRepairFrame) {
      if (state.pendingTextRepairRoot !== document.body && root === document.body) {
        state.pendingTextRepairRoot = document.body;
      }
      return;
    }

    state.pendingTextRepairFrame = window.requestAnimationFrame(() => {
      const nextRoot = state.pendingTextRepairRoot || root;
      state.pendingTextRepairFrame = 0;
      state.pendingTextRepairRoot = null;
      repairInterfaceTextContent(nextRoot);
    });
  }

  function observeInterfaceTextMutations() {
    if (state.textRepairObserver || !document.body) {
      return;
    }

    state.textRepairObserver = new MutationObserver((mutations) => {
      if (state.isRepairingText) {
        return;
      }

      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          queueInterfaceTextRepair(mutation.target && mutation.target.parentNode ? mutation.target.parentNode : document.body);
          return;
        }

        if (mutation.addedNodes && mutation.addedNodes.length) {
          const elementNode = Array.from(mutation.addedNodes).find((node) => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE);
          if (elementNode) {
            queueInterfaceTextRepair(elementNode);
            return;
          }
        }
      }
    });

    state.textRepairObserver.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  function ensurePrintSentence(value) {
    const text = toPresentationText(value);
    if (!text) {
      return "";
    }
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }

  function buildTechnicalBasisText(moduleKey, result) {
    const base = {
      auditiva: "Critério técnico fundamentado em dados audiométricos objetivos, com média aritmética nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz, sem uso de aparelho auditivo, observada a lógica normativa aplicável à caracterização da deficiência auditiva.",
      visual: "Critério técnico fundamentado em achados visuais objetivos, com análise prioritária de acuidade visual corrigida, campo visual e condição sensorial visual reconhecida, conforme a lógica normativa aplicável à caracterização da deficiência visual.",
      fisica: "Critério técnico fundamentado na permanência da alteração, na presença de perda anatômica ou limitação relevante, no comprometimento funcional do segmento corporal afetado e no impacto ocupacional compatível com deficiência física.",
      clinicas: "Critério técnico fundamentado em condição clínica persistente associada a limitação funcional relevante, sem utilização isolada do CID, com necessidade de coerência clínico-funcional e, quando indicado, suporte multiprofissional.",
      intelectual: "Critério técnico fundamentado em comprometimento permanente do funcionamento intelectual e das habilidades adaptativas, com repercussão prática nas atividades de vida diária e laborais.",
      psicossocial: "Critério técnico fundamentado em quadro mental ou psicossocial persistente, com restrição relevante de participação social e laboral em igualdade de condições."
    }[moduleKey] || "Critério técnico fundamentado em análise clínico-funcional estruturada.";

    const complement = result && result.message
      ? `Conclusão aplicada ao caso: ${ensurePrintSentence(result.message)}`
      : "";

    return joinSupportNotes([base, complement]);
  }

  function buildCharacterizationReport(payload) {
    const attachments = collectExternalReportFiles();
    const reportSections = [
      "Após análise técnico-funcional dos dados clínicos estruturados e dos critérios aplicáveis ao caso, conclui-se pelo enquadramento como pessoa com deficiência para fins de caracterização ocupacional.",
      `Descrição da deficiência e CID: ${toPresentationText(payload.description || "")}`,
      `Limitações funcionais: ${toPresentationText(payload.limitations || "")}`,
      `Conclusão técnico-funcional: ${toPresentationText(payload.message || "")}`
    ];

    if (payload.supportNote) {
      reportSections.push(`Observações técnicas e documentação complementar: ${toPresentationText(payload.supportNote)}`);
    }

    if (attachments.length) {
      reportSections.push(`Documentos externos vinculados ao caso: ${attachments.map((file) => toPresentationText(file.name)).join(", ")}.`);
    }

    return reportSections.join("\n\n");
  }

  function buildPdfPayload(identity, result, attachments = []) {
    return {
      title: "LAUDO CARACTERIZADOR DE DEFICIÊNCIA",
      moduleLabel: moduleConfigs[state.activeModule] ? toPresentationText(moduleConfigs[state.activeModule].title) : "Módulo não especificado",
      identity,
      result,
      attachments,
      technicalBasis: toPresentationText(buildTechnicalBasisText(state.activeModule, result)),
      generatedAt: new Date()
    };
  }

  function updateExternalFilesUI() {
    if (!refs.reportExternalFilesStatus || !refs.reportExternalFilesList) {
      return;
    }

    const files = collectExternalReportFiles();
    refs.reportExternalFilesList.innerHTML = "";

    if (!files.length) {
      refs.reportExternalFilesStatus.textContent = "Nenhum documento anexado no momento. O anexo é opcional.";
      const emptyState = document.createElement("div");
      emptyState.className = "attachment-empty";
      emptyState.textContent = "Se desejar, anexe laudos externos ou exames complementares para compor o pacote final de impressão.";
      refs.reportExternalFilesList.appendChild(emptyState);
      return;
    }

    refs.reportExternalFilesStatus.textContent = `${files.length} documento(s) pronto(s) para compor o pacote final de impressão.`;

    files.forEach((file, index) => {
      const item = document.createElement("article");
      item.className = "attachment-item";

      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${toPresentationText(file.name)}`;

      const detail = document.createElement("span");
      const fileType = file.type ? file.type : inferMimeTypeFromName(file.name);
      detail.textContent = `${describeAttachmentKind(fileType)} - ${formatFileSize(file.size)}`;

      item.appendChild(title);
      item.appendChild(detail);
      refs.reportExternalFilesList.appendChild(item);
    });
  }

  function formatFileSize(size) {
    const numeric = Number(size || 0);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return "tamanho não informado";
    }
    if (numeric < 1024) {
      return `${numeric} B`;
    }
    if (numeric < 1024 * 1024) {
      return `${(numeric / 1024).toFixed(1)} KB`;
    }
    return `${(numeric / (1024 * 1024)).toFixed(2)} MB`;
  }

  function buildPhysicalStrengthSummary() {
    const pattern = lowerFirstPresentation(labelForSelectValue("physicalStrengthPattern"));
    const grade = valueOf("physicalStrengthGrade");
    if (!grade || grade === "5" || grade === "na") {
      return "";
    }
    return pattern
      ? `redução de força em ${pattern}, grau MRC ${grade}`
      : `redução de força muscular, grau MRC ${grade}`;
  }

  function buildOfficialDescriptionText(payload) {
    const cid = toPresentationText(formatCid(resolveCurrentCid())) || "Não informado";

    if (state.activeModule === "auditiva") {
      const odAverage = getAudiometryAverage("OD");
      const oeAverage = getAudiometryAverage("OE");
      const rightTotal = odAverage > 95;
      const leftTotal = oeAverage > 95;

      if (rightTotal || leftTotal) {
        const side = rightTotal ? "direita" : "esquerda";
        return `Trabalhador com deficiência auditiva, comprovada por audiometria sem uso de aparelho auditivo, apresentando surdez unilateral total em orelha ${side}, com média de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE. CID: ${cid}.`;
      }

      return `Trabalhador com deficiência auditiva, comprovada por audiometria sem uso de aparelho auditivo, apresentando perda auditiva bilateral parcial, com médias aritméticas de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE, aferidas nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz. CID: ${cid}.`;
    }

    if (state.activeModule === "fisica") {
      const choiceKey = normalizedChoiceKey(valueOf("physicalConditionType"));
      const scope = valueOf("physicalAmputationScope");
      const laterality = valueOf("physicalLaterality");
      const segmentText = choiceKey.includes("amput")
        ? toPresentationText(composeAmputationFinding(scope, laterality, collectAmputationDetail(), valueOf("physicalAmputationLevel")))
        : toPresentationText(composeSegment(resolvePhysicalSegment(), laterality));

      if (choiceKey.includes("amput")) {
        return `Deficiência física permanente por perda anatômica em ${segmentText}. CID: ${cid}.`;
      }

      const conditionText = lowerFirstPresentation(valueOf("physicalConditionType") || "alteração física permanente");
      return `Deficiência física permanente por ${conditionText} em ${segmentText}. CID: ${cid}.`;
    }

    if (state.activeModule === "visual") {
      return `Deficiência visual permanente com ${buildOfficialVisualSummary()}. CID: ${cid}.`;
    }

    if (state.activeModule === "clinicas") {
      const condition = lowerFirstPresentation(normalizedText("clinicalCondition") || "condição clínica persistente");
      const grade = lowerFirstPresentation(valueOf("clinicalLimitationGrade") || "relevante");
      return `Condição clínica persistente compatível com ${condition}, associada a limitação funcional ${grade}. CID: ${cid}.`;
    }

    if (state.activeModule === "intelectual") {
      const supportNeed = lowerFirstPresentation(labelForSelectValue("intellectualSupportNeed") || "relevante");
      return `Deficiência intelectual permanente, com comprometimento do funcionamento intelectual e das habilidades adaptativas, demandando suporte ${supportNeed}. CID: ${cid}.`;
    }

    if (state.activeModule === "psicossocial") {
      return `Deficiência mental/psicossocial persistente, com restrição relevante de participação social e laboral. CID: ${cid}.`;
    }

    return toPresentationText(payload && payload.result ? payload.result.description : "");
  }

  function buildOfficialLimitationsText(payload) {
    const summary = stripTerminalPunctuation(buildCurrentFunctionalImpactSummary());
    const occupationalImpact = stripTerminalPunctuation(buildCurrentOccupationalImpactText());

    if (summary) {
      return ensurePrintSentence(`Apresenta ${summary}, com impacto ocupacional em ${occupationalImpact}`);
    }

    return ensurePrintSentence(payload && payload.result ? payload.result.limitations : payload && payload.limitations ? payload.limitations : "");
  }

  function buildOfficialVisualSummary() {
    const condition = valueOf("visualPrimaryFinding");
    const acuityOD = toPresentationText(labelForSelectValue("visualAcuityOD"));
    const acuityOE = toPresentationText(labelForSelectValue("visualAcuityOE"));
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");

    if (condition === "visao_monocular") {
      return `visão monocular, com acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE`;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60"
        ? "campo visual binocular igual ou menor que 60°"
        : "restrição relevante de campo visual";
    }
    return `acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE${fieldChanged === "sim" ? ", associada a alteração de campo visual" : ""}`;
  }

  async function buildAttachmentPayloads(files) {
    const attachments = [];
    for (const file of files) {
      const mimeType = file.type || inferMimeTypeFromName(file.name);
      const isImage = mimeType.startsWith("image/");
      const isPdf = mimeType === "application/pdf" || /\.pdf$/i.test(file.name);
      attachments.push({
        name: file.name,
        mimeType,
        size: file.size,
        sizeLabel: formatFileSize(file.size),
        previewKind: isImage ? "image" : (isPdf ? "pdf" : "file"),
        source: (isImage || isPdf) ? await readFileAsDataUrl(file) : URL.createObjectURL(file)
      });
    }
    return attachments;
  }

  function cleanupAttachmentPayloads(attachments = []) {
    attachments.forEach((attachment) => {
      if (attachment && attachment.source && attachment.source.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.source);
      }
    });
  }

  function buildOverlayText(x, y, width, font, text, options = {}) {
    const fontSize = parseFontSize(font, options.fontSize || 11);
    const weight = String(font || "").includes("700") ? 700 : 400;
    const top = options.top !== undefined ? options.top : (y + ((options.paddingY || 0) - fontSize));
    return `<div class="overlay-field" style="left:${x}px;top:${top}px;width:${width}px;font:${weight} ${fontSize}px Arial, sans-serif;">${escapeHtml(toPresentationText(text))}</div>`;
  }

  function buildOverlayParagraph(x, y, width, height, text, fontSize = 11, weight = 400) {
    return `<div class="overlay-field overlay-paragraph" style="left:${x}px;top:${y}px;width:${width}px;height:${height}px;font:${weight} ${fontSize}px Arial, sans-serif;">${escapeHtml(toPresentationText(text))}</div>`;
  }

  async function openOfficialPrintPreview(payload) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return false;
    }

    try {
      const useOverlayMode = window.location.protocol === "file:";
      const html = useOverlayMode
        ? buildOfficialOverlayPrintHtml(payload)
        : buildOfficialPrintHtml(await buildOfficialLaudoImageDataUrl(payload), payload);

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.addEventListener("beforeunload", () => cleanupAttachmentPayloads(payload.attachments || []), { once: true });
      window.setTimeout(() => cleanupAttachmentPayloads(payload.attachments || []), 10 * 60 * 1000);
      return true;
    } catch (error) {
      console.error(error);
      const html = buildOfficialOverlayPrintHtml(payload);
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.addEventListener("beforeunload", () => cleanupAttachmentPayloads(payload.attachments || []), { once: true });
      window.setTimeout(() => cleanupAttachmentPayloads(payload.attachments || []), 10 * 60 * 1000);
      return true;
    }
  }

  function buildPrintBundleScript(delay) {
    return `
      <script>
        (function () {
          var printTriggered = false;
          var images = Array.prototype.slice.call(document.querySelectorAll("img"));
          var frames = Array.prototype.slice.call(document.querySelectorAll("iframe.attachment-pdf"));
          var pending = images.filter(function (image) { return !image.complete; }).length + frames.length;

          function triggerPrint() {
            if (printTriggered) return;
            printTriggered = true;
            window.setTimeout(function () {
              window.focus();
              window.print();
            }, ${delay});
          }

          function releaseOne() {
            pending -= 1;
            if (pending <= 0) {
              triggerPrint();
            }
          }

          images.forEach(function (image) {
            if (image.complete) return;
            image.addEventListener("load", releaseOne, { once: true });
            image.addEventListener("error", releaseOne, { once: true });
          });

          frames.forEach(function (frame) {
            frame.addEventListener("load", releaseOne, { once: true });
            frame.addEventListener("error", releaseOne, { once: true });
          });

          window.setTimeout(triggerPrint, ${Math.max(delay + 1800, 2600)});
          if (!pending) {
            triggerPrint();
          }
        }());
      </script>
    `;
  }

  function buildOfficialPrintHtml(imageDataUrl, payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const attachmentSummary = buildAttachmentSummaryHtml(attachments);
    const attachmentSheets = buildAttachmentPrintSheetsHtml(attachments);
    const hasPdfAttachment = attachments.some((attachment) => attachment.previewKind === "pdf");
    const printDelay = hasPdfAttachment ? 1400 : (attachments.length ? 900 : 420);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador</title>
  <style>
    @page { size: Letter portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #edf3f8; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; color: #152433; }
    .bundle-shell { display: grid; justify-content: center; gap: 24px; padding: 24px; }
    .sheet { width: 816px; min-height: 1056px; background: #ffffff; box-shadow: 0 18px 42px rgba(21, 36, 51, 0.14); page-break-after: always; break-after: page; }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .page-image { display: block; width: 816px; height: auto; }
    .annex-cover { display: grid; align-content: start; gap: 18px; padding: 42px 46px; }
    .annex-cover h2 { margin: 0; font-size: 1.9rem; }
    .annex-cover p { margin: 0; line-height: 1.6; color: #5f7182; }
    .annex-list { display: grid; gap: 12px; margin-top: 6px; }
    .annex-item { display: grid; gap: 4px; padding: 14px 16px; border: 1px solid rgba(32, 61, 90, 0.14); border-radius: 14px; background: #f8fbfd; }
    .annex-item strong { font-size: 0.98rem; }
    .annex-item span { color: #5f7182; line-height: 1.45; }
    .attachment-sheet { display: grid; align-content: start; gap: 14px; padding: 28px 28px 20px; }
    .attachment-head { display: grid; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid rgba(32, 61, 90, 0.14); }
    .attachment-head h3 { margin: 0; font-size: 1.1rem; }
    .attachment-head p { margin: 0; color: #5f7182; line-height: 1.5; }
    .attachment-preview { width: 100%; border: 1px solid rgba(32, 61, 90, 0.12); border-radius: 16px; background: #ffffff; overflow: hidden; min-height: 920px; }
    .attachment-image { display: block; width: 100%; height: auto; max-height: 920px; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 920px; border: 0; display: block; background: #ffffff; }
    .attachment-note { margin: 0; color: #7a5d14; line-height: 1.5; padding: 12px 14px; border-radius: 14px; background: #fff7dd; border: 1px solid rgba(168, 120, 23, 0.18); }
    @media print { body { background: #ffffff; } .bundle-shell { padding: 0; gap: 0; } .sheet { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="sheet official-sheet">
      <img class="page-image" id="pageImage" src="${escapeHtml(imageDataUrl)}" alt="Laudo oficial renderizado">
    </section>
    ${attachmentSummary}
    ${attachmentSheets}
  </div>
  ${buildPrintBundleScript(printDelay)}
</body>
</html>`;
  }

  function buildOfficialOverlayPrintHtml(payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const attachmentSummary = buildAttachmentSummaryHtml(attachments);
    const attachmentSheets = buildAttachmentPrintSheetsHtml(attachments);
    const baseSrc = new URL(OFFICIAL_LAUDO_TEMPLATE.imagePath, window.location.href).href;
    const overlayElements = buildOfficialOverlayElements(payload);
    const hasPdfAttachment = attachments.some((attachment) => attachment.previewKind === "pdf");
    const printDelay = hasPdfAttachment ? 1400 : (attachments.length ? 900 : 420);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador</title>
  <style>
    @page { size: Letter portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #edf3f8; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; color: #152433; }
    .bundle-shell { display: grid; justify-content: center; gap: 24px; padding: 24px; }
    .sheet { width: 816px; min-height: 1056px; background: #ffffff; box-shadow: 0 18px 42px rgba(21, 36, 51, 0.14); page-break-after: always; break-after: page; }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .template-sheet { position: relative; overflow: hidden; }
    .template-image { display: block; width: 816px; height: auto; }
    .template-layer { position: absolute; inset: 0; }
    .overlay-field { position: absolute; color: #111111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .overlay-paragraph { white-space: normal; line-height: 1.22; overflow: hidden; }
    .overlay-mark { position: absolute; display: block; background: #111111; }
    .annex-cover { display: grid; align-content: start; gap: 18px; padding: 42px 46px; }
    .annex-cover h2 { margin: 0; font-size: 1.9rem; }
    .annex-cover p { margin: 0; line-height: 1.6; color: #5f7182; }
    .annex-list { display: grid; gap: 12px; margin-top: 6px; }
    .annex-item { display: grid; gap: 4px; padding: 14px 16px; border: 1px solid rgba(32, 61, 90, 0.14); border-radius: 14px; background: #f8fbfd; }
    .annex-item strong { font-size: 0.98rem; }
    .annex-item span { color: #5f7182; line-height: 1.45; }
    .attachment-sheet { display: grid; align-content: start; gap: 14px; padding: 28px 28px 20px; }
    .attachment-head { display: grid; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid rgba(32, 61, 90, 0.14); }
    .attachment-head h3 { margin: 0; font-size: 1.1rem; }
    .attachment-head p { margin: 0; color: #5f7182; line-height: 1.5; }
    .attachment-preview { width: 100%; border: 1px solid rgba(32, 61, 90, 0.12); border-radius: 16px; background: #ffffff; overflow: hidden; min-height: 920px; }
    .attachment-image { display: block; width: 100%; height: auto; max-height: 920px; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 920px; border: 0; display: block; background: #ffffff; }
    .attachment-note { margin: 0; color: #7a5d14; line-height: 1.5; padding: 12px 14px; border-radius: 14px; background: #fff7dd; border: 1px solid rgba(168, 120, 23, 0.18); }
    @media print { body { background: #ffffff; } .bundle-shell { padding: 0; gap: 0; } .sheet { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="sheet template-sheet">
      <img class="template-image" id="pageImage" src="${escapeHtml(baseSrc)}" alt="Formulário oficial">
      <div class="template-layer">${overlayElements}</div>
    </section>
    ${attachmentSummary}
    ${attachmentSheets}
  </div>
  ${buildPrintBundleScript(printDelay)}
</body>
</html>`;
  }

  function buildOfficialOverlayElements(payload = {}) {
    const template = OFFICIAL_LAUDO_TEMPLATE;
    const elements = [];
    const workerName = payload.identity && payload.identity.workerName ? payload.identity.workerName : "";
    const cpf = payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : "";
    const cid = toPresentationText(resolveCurrentCid() || "não informado");
    const origin = payload.identity && payload.identity.origin ? payload.identity.origin : inferOriginFromCurrentCase();
    const description = buildOfficialDescriptionText(payload);
    const limitations = buildOfficialLimitationsText(payload);
    const signatureLine = joinSupportNotes([
      payload.identity && payload.identity.examiner ? payload.identity.examiner : "",
      payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : ""
    ]);
    const date = payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "";

    elements.push(buildOverlayText(template.nameField.x, template.nameField.y, template.nameField.width, template.nameField.font, workerName, { paddingY: template.nameField.paddingY }));
    elements.push(buildOverlayText(template.cpfField.x, template.cpfField.y, template.cpfField.width, template.cpfField.font, cpf, { paddingY: template.cpfField.paddingY }));
    elements.push(buildOverlayText(template.cidField.x, template.cidField.y, template.cidField.width, template.cidField.font, cid, { paddingY: template.cidField.paddingY }));
    elements.push(buildOverlayParagraph(template.descriptionRect.x, template.descriptionRect.y, template.descriptionRect.width, template.descriptionRect.height, description, 10.8, 400));
    elements.push(buildOverlayParagraph(template.limitationsRect.x, template.limitationsRect.y, template.limitationsRect.width, template.limitationsRect.height, limitations, 10.8, 400));
    elements.push(buildOverlayText(template.signatureField.x, template.signatureField.y, template.signatureField.width, template.signatureField.font, signatureLine, { paddingY: template.signatureField.paddingY }));
    elements.push(buildOverlayText(template.dateField.x, template.dateField.y, template.dateField.width, template.dateField.font, date, { paddingY: template.dateField.paddingY }));

    const originCoords = template.originMarks[origin];
    if (originCoords) {
      elements.push(buildOverlayMark(originCoords[0], originCoords[1], 7));
    }

    if (state.activeModule === "visual" && valueOf("visualPrimaryFinding") === "visao_monocular") {
      const monocular = template.moduleMarks.monocular;
      elements.push(buildOverlayMark(monocular[0], monocular[1], 7));
    } else {
      const moduleCoords = template.moduleMarks[state.activeModule];
      if (moduleCoords) {
        elements.push(buildOverlayMark(moduleCoords[0], moduleCoords[1], 7));
      }
    }

    if (state.activeModule === "fisica") {
      const choiceKey = normalizedChoiceKey(valueOf("physicalConditionType"));
      const isAmputation = choiceKey.includes("amput");
      const targetMark = isAmputation ? template.physical.amputationMark : template.physical.otherMark;
      elements.push(buildOverlayMark(targetMark[0], targetMark[1], 7));
      elements.push(buildOverlayParagraph(template.physical.otherTextRect.x, template.physical.otherTextRect.y, template.physical.otherTextRect.width, template.physical.otherTextRect.height, toPresentationText(buildPhysicalPdfDetail()), 9.7, 400));
    }

    if (state.activeModule === "visual") {
      const finding = valueOf("visualPrimaryFinding");
      if (finding === "cegueira_bilateral") {
        elements.push(buildOverlayMark(template.visual.blindnessMark[0], template.visual.blindnessMark[1], 7));
      } else if (finding === "baixa_visao_bilateral") {
        elements.push(buildOverlayMark(template.visual.lowVisionMark[0], template.visual.lowVisionMark[1], 7));
      } else if (finding === "campo_visual_reduzido") {
        elements.push(buildOverlayMark(template.visual.fieldMark[0], template.visual.fieldMark[1], 7));
      }
    }

    if (state.activeModule === "intelectual") {
      checkedValues("intellectualMarker").forEach((item) => {
        const coords = template.intellectualMarks[item];
        if (coords) {
          elements.push(buildOverlayMark(coords[0], coords[1], 7));
        }
      });
    }

    return elements.join("");
  }

  function buildAttachmentSummaryHtml(attachments = []) {
    if (!attachments.length) {
      return "";
    }

    const items = attachments.map((attachment, index) => `
      <article class="annex-item">
        <strong>${index + 1}. ${escapeHtml(toPresentationText(attachment.name))}</strong>
        <span>${escapeHtml(describeAttachmentKind(attachment.mimeType))} - ${escapeHtml(attachment.sizeLabel)}</span>
      </article>
    `).join("");

    return `
      <section class="sheet annex-cover">
        <span class="section-step">Anexos</span>
        <h2>Documentação médica externa</h2>
        <p>Os arquivos abaixo foram vinculados ao caso para compor o pacote final de impressão do laudo caracterizador.</p>
        <div class="annex-list">${items}</div>
      </section>
    `;
  }

  function buildAttachmentPrintSheetsHtml(attachments = []) {
    return attachments.map((attachment, index) => {
      if (attachment.previewKind === "image") {
        return `
          <section class="sheet attachment-sheet">
            <header class="attachment-head">
              <h3>Anexo ${index + 1} - ${escapeHtml(toPresentationText(attachment.name))}</h3>
              <p>Documento externo incorporado ao pacote final de impressão.</p>
            </header>
            <div class="attachment-preview">
              <img class="attachment-image" src="${escapeHtml(attachment.source)}" alt="${escapeHtml(toPresentationText(attachment.name))}">
            </div>
          </section>
        `;
      }

      if (attachment.previewKind === "pdf") {
        return `
          <section class="sheet attachment-sheet">
            <header class="attachment-head">
              <h3>Anexo ${index + 1} - ${escapeHtml(toPresentationText(attachment.name))}</h3>
              <p>Documento em PDF vinculado ao caso.</p>
            </header>
            <div class="attachment-preview">
              <iframe class="attachment-pdf" src="${escapeHtml(`${attachment.source}#toolbar=0&navpanes=0&scrollbar=0`)}" title="${escapeHtml(toPresentationText(attachment.name))}" loading="eager"></iframe>
            </div>
            <p class="attachment-note">Se o navegador não renderizar o conteúdo deste PDF dentro da folha, abra o anexo individualmente e imprima em sequência para compor o pacote final.</p>
          </section>
        `;
      }

      return `
        <section class="sheet attachment-sheet">
          <header class="attachment-head">
            <h3>Anexo ${index + 1} - ${escapeHtml(toPresentationText(attachment.name))}</h3>
            <p>Arquivo externo vinculado ao caso.</p>
          </header>
          <p class="attachment-note">Este formato de arquivo não possui pré-visualização automática no navegador. Considere manter o documento original salvo para consulta complementar.</p>
        </section>
      `;
    }).join("");
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const statusClass = escapeHtml(user.status || "active");
      const paymentClass = escapeHtml(normalizeLocalPaymentStatus(user.paymentStatus || "pending"));
      const planLabel = user.role === "admin"
        ? "Administração interna"
        : `${toPresentationText(user.planLabel || "Plano não definido")} (${formatCurrencyCents(user.planPriceCents || 0)})`;

      const card = document.createElement("article");
      card.className = "user-card";
      card.innerHTML = `
        <div class="user-card-head">
          <div>
            <h4>${escapeHtml(toPresentationText(user.company || "Empresa não informada"))}</h4>
            <p>${escapeHtml(toPresentationText(user.username || "-"))} - ${escapeHtml(roleLabel)}</p>
            <p>${escapeHtml(toPresentationText(user.contactName || "Sem responsável informado"))} - ${escapeHtml(toPresentationText(user.email || "Sem e-mail"))}</p>
          </div>
          <div class="user-badges">
            <span class="user-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
            <span class="user-badge ${paymentClass}">${escapeHtml(paymentLabel)}</span>
          </div>
        </div>

        <div class="user-meta">
          <div class="meta-box"><strong>Plano</strong><span>${escapeHtml(planLabel)}</span></div>
          <div class="meta-box"><strong>Laudos emitidos</strong><span>${escapeHtml(String(Number(user.usageCount || 0)))}</span></div>
          <div class="meta-box"><strong>Vencimento</strong><span>${escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt))}</span></div>
          <div class="meta-box"><strong>Criado em</strong><span>${escapeHtml(formatInlineAdminDateTime(user.createdAt))}</span></div>
          <div class="meta-box"><strong>Último acesso</strong><span>${escapeHtml(formatInlineAdminDateTime(user.lastAccessAt))}</span></div>
          <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
        </div>

        ${state.authProvider === "api" && user.role !== "admin" ? `
          <div class="admin-user-quick-actions">
            ${user.mpCheckoutUrl ? `<a class="ghost-button" href="${escapeHtml(user.mpCheckoutUrl)}" target="_blank" rel="noopener">Abrir checkout atual</a>` : ""}
            <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar checkout Mercado Pago</button>
          </div>
        ` : ""}

        <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
          <label class="field"><span>Empresa</span><input type="text" name="company" value="${escapeHtml(toPresentationText(user.company || ""))}"></label>
          <label class="field"><span>Responsável</span><input type="text" name="contactName" value="${escapeHtml(toPresentationText(user.contactName || ""))}"></label>
          <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(toPresentationText(user.email || ""))}"></label>
          <label class="field"><span>Usuário</span><input type="text" name="username" value="${escapeHtml(toPresentationText(user.username || ""))}"></label>
          <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
          <label class="field"><span>Status do acesso</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
          <label class="field"><span>Status do pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
          <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
          <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
          <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
          <label class="field field-full"><span>Observações internas</span><textarea name="notes" rows="3">${escapeHtml(toPresentationText(user.notes || "", true))}</textarea></label>
          <div class="form-actions field-full"><button class="primary-button" type="submit">Salvar alterações</button></div>
        </form>

        <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
      `;

      refs.adminUsersGrid.appendChild(card);
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  async function handleInlineAdminPaymentLink(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.paymentLink : "";
    const note = userId ? document.querySelector(`[data-inline-user-note="${CSS.escape(userId)}"]`) : null;

    if (!userId) {
      return;
    }

    if (state.authProvider !== "api") {
      if (note) note.textContent = "O checkout do Mercado Pago exige o servidor publicado.";
      return;
    }

    try {
      const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}/payment-link`, { method: "POST" });
      const checkoutUrl = response && response.checkout
        ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
        : "";

      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank", "noopener");
      }

      if (note) {
        note.textContent = checkoutUrl
          ? "Checkout Mercado Pago gerado com sucesso."
          : "Link preparado, mas o Mercado Pago não retornou uma URL válida.";
      }

      await loadInlineAdminUsers();
    } catch (error) {
      if (note) note.textContent = error.message || "Não foi possível gerar o checkout do cliente.";
    }
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final só pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const externalFiles = collectExternalReportFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliação");
    if (!identity.examiner) missing.push("profissional responsável");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatórios para emissão do laudo: ${missing.join(", ")}.`);
      return;
    }

    try {
      const attachments = externalFiles.length ? await buildAttachmentPayloads(externalFiles) : [];
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura da janela de impressão. Permita pop-ups desta página e tente novamente.");
        return;
      }

      await incrementUsageCounter();
    } catch (error) {
      console.error(error);
      window.alert(`Não foi possível preparar o pacote final de impressão neste momento.${error && error.message ? `\n\nDetalhe técnico: ${toPresentationText(error.message)}` : ""}`);
    }
  }

  function toggleInlineAdminUser(userId) {
    state.adminExpandedUserId = state.adminExpandedUserId === userId ? "" : userId;
    renderInlineAdminUsers(state.adminUsersCache || []);
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso cadastrado ainda.</div>';
      return;
    }

    users.forEach((user) => {
      const isOpen = state.adminExpandedUserId === user.id;
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const statusClass = escapeHtml(user.status || "active");
      const paymentClass = escapeHtml(normalizeLocalPaymentStatus(user.paymentStatus || "pending"));
      const planLabel = user.role === "admin"
        ? "Administra\u00e7\u00e3o interna"
        : `${toPresentationText(user.planLabel || "Plano nao definido")} (${formatCurrencyCents(user.planPriceCents || 0)})`;
      const companyName = escapeHtml(toPresentationText(user.company || "Empresa nao informada"));
      const username = escapeHtml(toPresentationText(user.username || "-"));
      const contactName = escapeHtml(toPresentationText(user.contactName || "Sem responsavel informado"));
      const email = escapeHtml(toPresentationText(user.email || "Sem e-mail"));
      const usageCount = escapeHtml(String(Number(user.usageCount || 0)));
      const dueDate = escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt));
      const createdAt = escapeHtml(formatInlineAdminDateTime(user.createdAt));
      const lastAccessAt = escapeHtml(formatInlineAdminDateTime(user.lastAccessAt));
      const notes = escapeHtml(toPresentationText(user.notes || "", true));

      const row = document.createElement("article");
      row.className = `admin-user-row${isOpen ? " is-open" : ""}`;
      row.innerHTML = `
        <button class="admin-user-toggle" type="button" data-admin-user-toggle="${escapeHtml(user.id)}" aria-expanded="${isOpen ? "true" : "false"}">
          <div class="admin-user-main">
            <strong>${companyName}</strong>
            <span>${username} - ${escapeHtml(roleLabel)}</span>
            <span>${contactName} - ${email}</span>
          </div>

          <div class="admin-user-resume">
            <span class="admin-user-chip">Plano: ${escapeHtml(planLabel)}</span>
            <span class="admin-user-chip">Laudos: ${usageCount}</span>
            <span class="admin-user-chip">Validade: ${dueDate}</span>
            <span class="admin-user-chip">&Uacute;ltimo acesso: ${lastAccessAt}</span>
          </div>

          <div class="admin-user-state">
            <div class="user-badges">
              <span class="user-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
              <span class="user-badge ${paymentClass}">${escapeHtml(paymentLabel)}</span>
            </div>
            <span class="admin-user-chip admin-user-arrow">${isOpen ? "Recolher ficha" : "Abrir ficha"}</span>
          </div>
        </button>

        <div class="admin-user-detail"${isOpen ? "" : " hidden"}>
          <div class="admin-user-section">
            <div class="admin-user-section-head">
              <div>
                <h4>Resumo comercial e operacional</h4>
                <p>Consulte rapidamente plano, validade, uso e dados de auditoria antes de editar o cadastro.</p>
              </div>
            </div>

            <div class="user-meta">
              <div class="meta-box"><strong>Plano contratado</strong><span>${escapeHtml(planLabel)}</span></div>
              <div class="meta-box"><strong>Laudos gerados</strong><span>${usageCount}</span></div>
              <div class="meta-box"><strong>Vig&ecirc;ncia atual</strong><span>${dueDate}</span></div>
              <div class="meta-box"><strong>Criado em</strong><span>${createdAt}</span></div>
              <div class="meta-box"><strong>&Uacute;ltimo acesso</strong><span>${lastAccessAt}</span></div>
              <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
            </div>
          </div>

          ${state.authProvider === "api" && user.role !== "admin" ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Pagamento</h4>
                  <p>Abra o checkout atual ou gere um novo link do Mercado Pago para este cliente.</p>
                </div>
              </div>

              <div class="admin-user-quick-actions">
                ${user.mpCheckoutUrl ? `<a class="ghost-button" href="${escapeHtml(user.mpCheckoutUrl)}" target="_blank" rel="noopener">Abrir checkout atual</a>` : ""}
                <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar checkout Mercado Pago</button>
              </div>
            </div>
          ` : ""}

          <div class="admin-user-section">
            <div class="admin-user-section-head">
              <div>
                <h4>Cadastro e acesso</h4>
                <p>Atualize os dados da empresa, plano, status, vencimento e senha sem sair desta ficha.</p>
              </div>
            </div>

            <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
              <label class="field"><span>Empresa</span><input type="text" name="company" value="${companyName}"></label>
              <label class="field"><span>Respons&aacute;vel</span><input type="text" name="contactName" value="${escapeHtml(toPresentationText(user.contactName || ""))}"></label>
              <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(toPresentationText(user.email || ""))}"></label>
              <label class="field"><span>Usu&aacute;rio</span><input type="text" name="username" value="${escapeHtml(toPresentationText(user.username || ""))}"></label>
              <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
              <label class="field"><span>Status do acesso</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
              <label class="field"><span>Status do pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
              <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
              <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
              <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
              <label class="field field-full"><span>Observa&ccedil;&otilde;es internas</span><textarea name="notes" rows="3">${notes}</textarea></label>
              <div class="form-actions field-full">
                <button class="primary-button" type="submit">Salvar altera&ccedil;&otilde;es</button>
              </div>
            </form>
          </div>

          <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
        </div>
      `;

      refs.adminUsersGrid.appendChild(row);
    });

    refs.adminUsersGrid.querySelectorAll("[data-admin-user-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleInlineAdminUser(button.dataset.adminUserToggle || "");
      });
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  function applyInterfaceCopyRefinements() {
    document.title = "Enquadra PcD | Sistema inteligente para enquadramento ocupacional";

    const setText = (selector, text) => {
      const element = document.querySelector(selector);
      if (element && element.textContent !== text) {
        element.textContent = text;
      }
    };

    const setPairText = (selector, strongText, spanText) => {
      const element = document.querySelector(selector);
      if (!element) {
        return;
      }
      const strong = element.querySelector("strong");
      const span = element.querySelector("span");
      if (strong && strong.textContent !== strongText) strong.textContent = strongText;
      if (span && span.textContent !== spanText) span.textContent = spanText;
    };

    const setLabelFromField = (fieldId, text) => {
      const field = document.getElementById(fieldId);
      const label = field ? field.closest("label") : null;
      const span = label ? label.querySelector("span") : null;
      if (span && span.textContent !== text) {
        span.textContent = text;
      }
    };

    setText("#authShell .auth-brand .eyebrow", "Plataforma SaaS para saúde ocupacional");
    setText("#authShell .auth-brand h2", "Sistema inteligente para enquadramento de PcD com triagem técnica, laudo padronizado e gestão comercial");
    setText("#authShell .auth-brand p", "Plataforma web para caracterização técnico-funcional, emissão de laudo caracterizador, gestão de clientes e operação ocupacional com fluxo orientado.");
    setPairText(".auth-feature-item:nth-of-type(1)", "Fluxo guiado por módulo", "Triagem estruturada para deficiência física, auditiva, visual, intelectual, psicossocial e condições clínicas.");
    setPairText(".auth-feature-item:nth-of-type(2)", "Base técnica orientada", "Critérios objetivos para audição e visão, com avaliação clínico-funcional complementar nos demais cenários.");
    setPairText(".auth-feature-item:nth-of-type(3)", "Laudo institucional e anexos", "Emissão padronizada do laudo caracterizador com documentação externa vinculada ao caso.");
    setPairText(".auth-feature-item:nth-of-type(4)", "Gestão comercial da plataforma", "Controle central de clientes, pagamento, status de acesso e volume de laudos emitidos.");
    setText("#adminShell .brand-block .eyebrow", "Administrador da plataforma");
    setText("#adminShell .topbar-subtitle", "Gestão de clientes, acessos, validade comercial e controle central da plataforma");
    setText("#adminPanel > .section-head .admin-inline-copy", "Use as abas abaixo para acompanhar o ambiente, ver os seus usuários e abrir o cadastro somente quando precisar.");
    setText("[data-admin-view='overview']", "Visão geral");
    setText("[data-admin-view='users']", "Ver usuários");
    setText("[data-admin-view='create']", "Novo cadastro");
    setText("[data-admin-view-panel='users'] .admin-inline-copy", "Clique no usuário para abrir os dados completos, rever laudos gerados, pagamento, validade e cadastro.");
    setText("#appShell .brand-block .eyebrow", "Empresa usuária | enquadramento ocupacional");
    setText("#appShell .topbar-subtitle", "Fluxo guiado para enquadramento, descrição técnica e emissão de laudo caracterizador");
    setText("#appShell .intro-copy h2", "Enquadramento PcD guiado, claro e padronizado");
    setText("#appShell .intro-copy p", "Sistema web voltado ao uso ocupacional com fluxo estruturado por tipo de deficiência, enquadramento orientado por regras técnicas e emissão de laudo caracterizador em padrão operacional.");
    setPairText(".rule-chip:nth-of-type(1)", "Fluxo guiado", "O sistema abre somente os campos relevantes para cada cenário selecionado.");
    setPairText(".rule-chip:nth-of-type(2)", "Resultado direto", "Enquadra, não enquadra ou direciona para revisão complementar quando necessário.");
    setPairText(".rule-chip:nth-of-type(3)", "Laudo padronizado", "A emissão final segue o fluxo do sistema com texto técnico objetivo e impressão oficial.");
    setPairText(".rule-chip:nth-of-type(4)", "Campos mais objetivos", "Menos retrabalho manual, mais seleção guiada e preenchimento assistido.");
    setText(".module-selector .section-title h3", "Selecione o módulo de análise");
    setLabelFromField("loginUsername", "Usuário");
    setLabelFromField("registerContactName", "Responsável");
    setLabelFromField("registerUsername", "Usuário de acesso");
    setLabelFromField("setupCompany", "Empresa / clínica");
    setLabelFromField("setupUsername", "Usuário administrador");
    setLabelFromField("adminUsername", "Usuário");
    setLabelFromField("adminNotes", "Observações internas");
    setText("[data-module='fisica'] p", "Amputação, deformidade, força, mobilidade e perda funcional do segmento acometido.");
    setText("[data-module='auditiva'] p", "Leitura de audiometria, médias por orelha e enquadramento por critério objetivo.");
    setText("[data-module='visual'] p", "Acuidade, campo visual, visão monocular e enquadramento por achado objetivo.");
    setText("[data-module='clinicas'] p", "Fibromialgia, dor crônica e quadros persistentes com repercussão funcional.");
    setText("[data-module='intelectual'] p", "Funcionamento intelectual, habilidades adaptativas e necessidade de suporte.");
    setText("[data-module='psicossocial'] p", "Restrição de participação social e laboral, persistência do quadro e suporte documental.");
  }

  function getVisibleAdminUsers() {
    const users = Array.isArray(state.adminUsersCache) ? state.adminUsersCache : [];
    const search = normalizeSpacing(state.adminUserSearch || "").toLowerCase();
    const filter = String(state.adminUserFilter || "active_company");
    const filteredUsers = users.filter((user) => {
      const accountType = user.role === "admin" ? "company" : normalizeAccountType(user.accountType);
      const linkedDoctors = user.role !== "admin" && accountType === "company"
        ? normalizeCompanySessionDoctors(user.linkedDoctors)
        : [];
      const linkedDoctorSearch = linkedDoctors.map((doctor) => [
        doctor.name,
        doctor.crm,
        doctor.specialty
      ].join(" ")).join(" ");
      const haystack = [
        user.company,
        user.username,
        user.email,
        user.contactName,
        user.planLabel,
        user.companyCnpj,
        linkedDoctorSearch
      ].map((value) => normalizeSpacing(value || "").toLowerCase()).join(" ");

      const matchesSearch = !search || haystack.includes(search);
      if (!matchesSearch) {
        return false;
      }

      if (filter === "active") {
        return user.status === "active";
      }
      if (filter === "inadimplente") {
        return user.status === "inadimplente" || user.paymentStatus === "expired";
      }
      if (filter === "blocked") {
        return user.status === "blocked";
      }
      if (filter === "pending") {
        return user.paymentStatus === "pending";
      }
      if (filter === "admin") {
        return user.role === "admin";
      }

      return true;
    });
  }

  function isTotalHearingLossEar(values) {
    return Array.isArray(values) && values.length === 4 && values.every((value) => Number.isFinite(value) && value > 95);
  }

  function evaluateAuditory() {
    const withoutAid = valueOf("audioWithoutAid");
    const impactGrade = valueOf("audioImpactGrade");
    const impactMarkers = checkedLabels("audioImpactMarker");
    const cid = normalizedText("audioCid");
    const odValues = ["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"].map(numberOf);
    const oeValues = ["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"].map(numberOf);
    const allValuesFilled = odValues.every(Number.isFinite) && oeValues.every(Number.isFinite);
    const facts = [];

    if (!allValuesFilled) {
      return reviewResult("Informe as frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz para OD e OE ou importe arquivo estruturado.");
    }

    if (withoutAid !== "sim") {
      return reviewResult("É necessário confirmar que o audiograma utilizado para o critério foi realizado sem uso de aparelho auditivo.");
    }

    const odAverage = average(odValues);
    const oeAverage = average(oeValues);
    const bilateralPartial = odAverage >= 41 && oeAverage >= 41;
    const rightTotal = isTotalHearingLossEar(odValues);
    const leftTotal = isTotalHearingLossEar(oeValues);
    const unilateralTotal = rightTotal || leftTotal;
    const limitationsCore = impactMarkers.length
      ? joinList(impactMarkers)
      : "prejuízo para percepção e discriminação de sons e da fala, especialmente em ambientes com ruído, com interferência na comunicação em igualdade de condições";
    const documentationNote = refs.audioFile.files && refs.audioFile.files[0]
      ? ""
      : "Para sustentação documental do enquadramento, recomenda-se anexar audiometria tonal liminar sem uso de aparelho auditivo.";

    facts.push(`Média OD: ${formatDecimal(odAverage)} dB`);
    facts.push(`Média OE: ${formatDecimal(oeAverage)} dB`);
    if (impactGrade) {
      facts.push(`Impacto funcional auditivo: ${capitalize(impactGrade)}`);
    }
    if (refs.audioFile && refs.audioFile.files && refs.audioFile.files[0]) {
      facts.push(`Documento anexado: ${refs.audioFile.files[0].name}`);
    }

    if (bilateralPartial) {
      return eligibleResult({
        message: "Enquadra como PCD por perda auditiva bilateral parcial compatível com o critério técnico informado.",
        description: `Trabalhador com deficiência auditiva, comprovada por audiograma sem uso de aparelho auditivo, apresentando perda auditiva bilateral parcial, com média aritmética de ${formatDecimal(odAverage)} dB na orelha direita e ${formatDecimal(oeAverage)} dB na orelha esquerda, aferida separadamente nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz, conforme critérios técnicos vigentes. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitação sensorial auditiva que compromete a percepção e discriminação de sons e da fala, especialmente em ambientes com ruído, interferindo na comunicação e participação plena em igualdade de condições, com ${limitationsCore}.`,
        facts,
        supportNote: joinSupportNotes([
          documentationNote,
          !impactMarkers.length ? "Os campos de impacto funcional auditivo não foram detalhados; a limitação funcional foi descrita a partir do padrão sensorial esperado para o critério audiométrico objetivo." : ""
        ])
      });
    }

    if (unilateralTotal) {
      const affectedSide = rightTotal ? "direita" : "esquerda";
      return eligibleResult({
        message: "Enquadra como PCD por surdez unilateral total conforme os dados objetivos informados.",
        description: `Trabalhador com deficiência auditiva, comprovada por audiograma sem uso de aparelho auditivo, apresentando surdez unilateral total à orelha ${affectedSide}, com média aritmética de ${formatDecimal(odAverage)} dB na orelha direita e ${formatDecimal(oeAverage)} dB na orelha esquerda, aferida separadamente nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz, conforme critérios técnicos vigentes. CID: ${formatCid(cid)}.`,
        limitations: `Apresenta limitação sensorial auditiva com prejuízo para localização sonora, percepção e discriminação da fala, especialmente em ambientes com ruído, com ${limitationsCore}.`,
        facts,
        supportNote: joinSupportNotes([
          documentationNote,
          !impactMarkers.length ? "Os campos de impacto funcional auditivo não foram detalhados; a limitação funcional foi descrita a partir do padrão sensorial esperado para o critério audiométrico objetivo." : ""
        ])
      });
    }

    return ineligibleResult("Exame não atende aos critérios técnicos para caracterização de deficiência auditiva.", facts, documentationNote);
  }

  function evaluateVisual() {
    const condition = valueOf("visualPrimaryFinding");
    const laterality = valueOf("visualLaterality");
    const permanent = valueOf("visualPermanent");
    const supportDocs = valueOf("visualSupportDocs");
    const impactGrade = valueOf("visualImpactGrade");
    const cid = normalizedText("visualCid");
    const acuityOD = valueOf("visualAcuityOD");
    const acuityOE = valueOf("visualAcuityOE");
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");
    const limitations = checkedLabels("visualMarker");
    const facts = [];

    if (condition) {
      facts.push(`Achado visual principal: ${labelForSelectValue("visualPrimaryFinding")}`);
    }
    if (laterality) {
      facts.push(`Lateralidade: ${capitalize(laterality)}`);
    }
    if (impactGrade) {
      facts.push(`Impacto funcional visual: ${capitalize(impactGrade)}`);
    }

    if (!condition || !permanent || !acuityOD || !acuityOE) {
      return reviewResult("Necessita avaliação complementar com base funcional e achados objetivos.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    if (condition === "visao_monocular" && !laterality) {
      return reviewResult("Na visão monocular, informe o lado acometido para manter a descrição técnica objetiva.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    if (permanent === "nao") {
      return ineligibleResult("Alteração visual sem caráter permanente não caracteriza deficiência conforme critérios técnicos.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    const objectiveEligible = isVisualObjectiveEligible(condition, acuityOD, acuityOE, fieldChanged, fieldExtent);
    const objectiveText = composeVisualObjectiveText(acuityOD, acuityOE, fieldChanged, fieldExtent);
    const visualLimitationsText = limitations.length ? joinList(limitations) : defaultVisualLimitations(condition);

    if (!objectiveEligible) {
      return ineligibleResult(
        "Dados objetivos não caracterizam deficiência visual conforme critérios técnicos.",
        facts,
        fieldChanged === "sim" && !fieldExtent ? buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent) : ""
      );
    }

    const lateralityText = laterality
      ? (laterality === "direito" ? "olho direito" : laterality === "esquerdo" ? "olho esquerdo" : laterality)
      : "não especificado";
    const descriptionCore = condition === "visao_monocular"
      ? `visão monocular em ${lateralityText}, reconhecida por critério legal vigente, com ${objectiveText}`
      : objectiveText;

    return eligibleResult({
      message: "Enquadra como PCD por alteração visual permanente com base objetiva compatível.",
      description: `Trabalhador com deficiência visual de caráter permanente, fundamentado em ${descriptionCore}. CID: ${formatCid(cid)}.`,
      limitations: `Apresenta limitações funcionais visuais caracterizadas por ${visualLimitationsText}.`,
      facts,
      supportNote: joinSupportNotes([
        buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent),
        supportDocs === "nao" ? "O enquadramento foi concluído pelos dados objetivos informados; recomenda-se anexar laudo oftalmológico para lastro documental do caso." : "",
        !limitations.length ? "As limitações funcionais foram descritas a partir do padrão esperado para o quadro visual objetivo informado." : ""
      ])
    });
  }

  function buildOfficialVisualSummary() {
    const condition = valueOf("visualPrimaryFinding");
    const acuityOD = toPresentationText(labelForSelectValue("visualAcuityOD"));
    const acuityOE = toPresentationText(labelForSelectValue("visualAcuityOE"));
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");
    const laterality = valueOf("visualLaterality");

    if (condition === "visao_monocular") {
      const side = laterality === "direito"
        ? "no olho direito"
        : laterality === "esquerdo"
          ? "no olho esquerdo"
          : "";
      return `visão monocular${side ? ` ${side}` : ""}, com acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE`;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60"
        ? "campo visual binocular igual ou menor que 60°"
        : "restrição relevante de campo visual";
    }
    return `acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE${fieldChanged === "sim" ? ", associada a alteração de campo visual" : ""}`;
  }

  function stripTerminalPunctuation(text) {
    return toPresentationText(text).replace(/[.!?\s]+$/g, "");
  }

  function hasInformativeCidText(cid) {
    const normalized = stripTerminalPunctuation(cid).toLowerCase();
    return Boolean(normalized) && normalized !== "não informado";
  }

  function buildCurrentFunctionalImpactSummary() {
    if (state.activeModule === "auditiva") {
      const summary = stripTerminalPunctuation(summarizeLabelsForLaudo(checkedLabels("audioImpactMarker"), 3));
      return summary
        ? `repercussão funcional auditiva caracterizada por ${summary}`
        : "repercussão funcional auditiva caracterizada por dificuldade para compreender fala em ambientes com ruído, necessidade frequente de repetição na comunicação e prejuízo para percepção de alertas sonoros";
    }

    if (state.activeModule === "fisica") {
      const gradeLabel = {
        leve: "leve",
        moderado: "moderada",
        grave: "grave"
      }[valueOf("physicalImpactGrade")] || "moderada";
      const summary = stripTerminalPunctuation(summarizeLabelsForLaudo(checkedLabels("physicalFunctionItem"), 4));
      const strengthSummary = stripTerminalPunctuation(buildPhysicalStrengthSummary());
      const complements = [summary, strengthSummary].filter(Boolean);
      return complements.length
        ? `limitação funcional ${gradeLabel}, com ${joinList(complements)}`
        : `limitação funcional ${gradeLabel} do segmento corporal acometido`;
    }

    if (state.activeModule === "visual") {
      const summary = stripTerminalPunctuation(summarizeLabelsForLaudo(checkedLabels("visualMarker"), 4));
      return summary
        ? `repercussão funcional visual caracterizada por ${summary}`
        : "repercussão funcional visual caracterizada por dificuldade para leitura, orientação espacial, percepção de detalhes e deslocamento com segurança";
    }

    if (state.activeModule === "clinicas") {
      const summary = stripTerminalPunctuation(summarizeLabelsForLaudo(checkedLabels("clinicalMarker"), 4));
      return summary
        ? `limitação funcional persistente caracterizada por ${summary}`
        : "limitação funcional persistente caracterizada por dor, fadiga, redução da tolerância ao esforço ou prejuízo de ritmo funcional";
    }

    if (state.activeModule === "intelectual") {
      const summary = stripTerminalPunctuation(summarizeLabelsForLaudo(checkedLabels("intellectualMarker"), 4));
      return summary
        ? `comprometimento adaptativo caracterizado por ${summary}`
        : "comprometimento adaptativo caracterizado por dificuldade para compreensão de instruções, organização de rotina, autonomia funcional e segurança prática";
    }

    if (state.activeModule === "psicossocial") {
      const summary = stripTerminalPunctuation(summarizeLabelsForLaudo(checkedLabels("psychosocialMarker"), 4));
      return summary
        ? `restrição psicossocial persistente caracterizada por ${summary}`
        : "restrição psicossocial persistente caracterizada por prejuízo de autorregulação, interação social e sustentação da participação laboral";
    }

    return "";
  }

  function buildCurrentOccupationalImpactText() {
    if (state.activeModule === "auditiva") {
      return "atividades laborais que demandam comunicação verbal efetiva, atenção a comandos auditivos e percepção de sinais sonoros de alerta";
    }

    if (state.activeModule === "fisica") {
      return "atividades que exigem uso contínuo, coordenação, força, amplitude de movimento, destreza manual, mobilidade ou estabilidade postural do segmento acometido";
    }

    if (state.activeModule === "visual") {
      return "atividades que dependem de leitura, percepção de detalhes, orientação espacial, identificação de riscos e deslocamento com segurança";
    }

    if (state.activeModule === "clinicas") {
      return "rotinas que exigem constância funcional, tolerância ao esforço, manutenção de ritmo e desempenho sustentado";
    }

    if (state.activeModule === "intelectual") {
      return "atividades que exigem compreensão de instruções, organização de rotina, autonomia operacional e adaptação a demandas variáveis";
    }

    if (state.activeModule === "psicossocial") {
      return "situações laborais que exigem regulação emocional, interação social estável, tolerância a pressão e manutenção regular da participação funcional";
    }

    return "atividades desempenhadas em ambiente de trabalho";
  }

  function buildPhysicalOriginNarrative() {
    const basisKey = normalizedChoiceKey(valueOf("physicalClinicalBasis"));
    if (basisKey.includes("congen")) return "condição de origem congênita";
    if (basisKey.includes("traumat")) return "condição adquirida de etiologia traumática";
    if (basisKey.includes("pos") && basisKey.includes("cirurg")) return "condição adquirida em contexto pós-cirúrgico";
    if (basisKey.includes("neurolog")) return "condição adquirida de base neurológica";
    if (basisKey.includes("vascular")) return "condição adquirida de base vascular";
    if (basisKey.includes("outra")) return "condição adquirida de outra base clínica";
    return "condição permanente";
  }

  function buildOfficialDescriptionText(payload) {
    const cid = toPresentationText(formatCid(resolveCurrentCid())) || "Não informado";
    const cidText = hasInformativeCidText(cid) ? ` (CID ${cid})` : "";
    const impactSummary = stripTerminalPunctuation(buildCurrentFunctionalImpactSummary());
    const occupationalImpact = stripTerminalPunctuation(buildCurrentOccupationalImpactText());

    if (state.activeModule === "auditiva") {
      const odAverage = getAudiometryAverage("OD");
      const oeAverage = getAudiometryAverage("OE");
      const rightTotal = isTotalHearingLossEar(["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"].map(numberOf));
      const leftTotal = isTotalHearingLossEar(["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"].map(numberOf));

      if (rightTotal || leftTotal) {
        const side = rightTotal ? "direita" : "esquerda";
        return `Trata-se de colaborador que apresenta deficiência auditiva permanente, com surdez unilateral total em orelha ${side}, comprovada por audiometria sem uso de aparelho auditivo e médias de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE${cidText}, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
      }

      return `Trata-se de colaborador que apresenta deficiência auditiva permanente, comprovada por audiometria sem uso de aparelho auditivo, com perda auditiva bilateral parcial e médias aritméticas de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE, aferidas nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz${cidText}, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
    }

    if (state.activeModule === "fisica") {
      const choiceKey = normalizedChoiceKey(valueOf("physicalConditionType"));
      const scope = valueOf("physicalAmputationScope");
      const laterality = valueOf("physicalLaterality");
      const segmentText = choiceKey.includes("amput")
        ? toPresentationText(composeAmputationFinding(scope, laterality, collectAmputationDetail(), valueOf("physicalAmputationLevel")))
        : toPresentationText(composeSegment(resolvePhysicalSegment(), laterality));
      const originText = buildPhysicalOriginNarrative();

      if (choiceKey.includes("amput")) {
        return `Trata-se de colaborador que apresenta ${lowerFirstPresentation(segmentText)}${cidText}, ${originText}, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
      }

      const conditionText = lowerFirstPresentation(labelForSelectValue("physicalConditionType") || "alteração física permanente");
      return `Trata-se de colaborador que apresenta ${conditionText} em ${segmentText}${cidText}, ${originText}, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
    }

    if (state.activeModule === "visual") {
      return `Trata-se de colaborador que apresenta deficiência visual permanente, com ${buildOfficialVisualSummary()}${cidText}, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
    }

    if (state.activeModule === "clinicas") {
      const condition = lowerFirstPresentation(labelForSelectValue("clinicalCondition") || normalizedText("clinicalCondition") || "condição clínica persistente");
      const grade = lowerFirstPresentation(labelForSelectValue("clinicalLimitationGrade") || valueOf("clinicalLimitationGrade") || "relevante");
      return `Trata-se de colaborador que apresenta condição clínica persistente compatível com ${condition}${cidText}, associada a limitação funcional de intensidade ${grade}, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
    }

    if (state.activeModule === "intelectual") {
      const supportNeed = lowerFirstPresentation(labelForSelectValue("intellectualSupportNeed") || "relevante");
      return `Trata-se de colaborador que apresenta deficiência intelectual permanente${cidText}, com comprometimento do funcionamento intelectual e das habilidades adaptativas, demandando suporte ${supportNeed} e apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
    }

    if (state.activeModule === "psicossocial") {
      const condition = lowerFirstPresentation(labelForSelectValue("psychosocialCondition") || normalizedText("psychosocialCondition") || "quadro mental ou psicossocial persistente");
      return `Trata-se de colaborador que apresenta ${condition}${cidText}, com restrição persistente de participação social e laboral, apresentando ${impactSummary}, com impacto direto em ${occupationalImpact}.`;
    }

    return toPresentationText(payload && payload.result ? payload.result.description : "");
  }

  function toggleInlineAdminUser(userId) {
    state.adminExpandedUserId = state.adminExpandedUserId === userId ? "" : userId;
    renderInlineAdminUsers(getVisibleAdminUsers());
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    const cachedUsers = Array.isArray(state.adminUsersCache) ? state.adminUsersCache : [];
    const totalCount = cachedUsers.length;
    const adminCount = cachedUsers.filter((item) => item.role === "admin").length;
    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = users.length === totalCount
        ? `${totalCount} acesso(s)`
        : `${users.length} de ${totalCount} acesso(s)`;
    }

    if (state.adminExpandedUserId && !users.some((user) => user.id === state.adminExpandedUserId)) {
      state.adminExpandedUserId = "";
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso encontrado para o filtro aplicado.</div>';
      return;
    }

    users.forEach((user) => {
      const isOpen = state.adminExpandedUserId === user.id;
      const roleLabel = formatRoleLabel(user.role);
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const statusClass = escapeHtml(user.status || "active");
      const paymentClass = escapeHtml(normalizeLocalPaymentStatus(user.paymentStatus || "pending"));
      const planLabel = user.role === "admin"
        ? "Administração interna"
        : `${toPresentationText(user.planLabel || "Plano não definido")} (${formatCurrencyCents(user.planPriceCents || 0)})`;
      const companyName = escapeHtml(toPresentationText(user.company || "Empresa não informada"));
      const username = escapeHtml(toPresentationText(user.username || "-"));
      const contactName = escapeHtml(toPresentationText(user.contactName || "Sem responsável informado"));
      const email = escapeHtml(toPresentationText(user.email || "Sem e-mail"));
      const usageCount = escapeHtml(String(Number(user.usageCount || 0)));
      const dueDate = escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt));
      const createdAt = escapeHtml(formatInlineAdminDateTime(user.createdAt));
      const lastAccessAt = escapeHtml(formatInlineAdminDateTime(user.lastAccessAt));
      const notes = escapeHtml(toPresentationText(user.notes || "", true));

      const row = document.createElement("article");
      row.className = `admin-user-row${isOpen ? " is-open" : ""}`;
      row.innerHTML = `
        <button class="admin-user-toggle" type="button" data-admin-user-toggle="${escapeHtml(user.id)}" aria-expanded="${isOpen ? "true" : "false"}">
          <div class="admin-user-main">
            <strong>${companyName}</strong>
            <span>${username} - ${escapeHtml(roleLabel)}</span>
            <span>${contactName} - ${email}</span>
          </div>

          <div class="admin-user-resume">
            <span class="admin-user-chip">Plano: ${escapeHtml(planLabel)}</span>
            <span class="admin-user-chip">Laudos: ${usageCount}</span>
            <span class="admin-user-chip">Validade: ${dueDate}</span>
            <span class="admin-user-chip">Último acesso: ${lastAccessAt}</span>
          </div>

          <div class="admin-user-state">
            <div class="user-badges">
              <span class="user-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
              <span class="user-badge ${paymentClass}">${escapeHtml(paymentLabel)}</span>
            </div>
            <span class="admin-user-chip admin-user-arrow">${isOpen ? "Recolher ficha" : "Abrir ficha"}</span>
          </div>
        </button>

        <div class="admin-user-detail"${isOpen ? "" : " hidden"}>
          <div class="admin-user-section">
            <div class="admin-user-section-head">
              <div>
                <h4>Resumo comercial e operacional</h4>
                <p>Consulte rapidamente plano, validade, uso e dados de auditoria antes de editar o cadastro.</p>
              </div>
            </div>

            <div class="user-meta">
              <div class="meta-box"><strong>Plano contratado</strong><span>${escapeHtml(planLabel)}</span></div>
              <div class="meta-box"><strong>Laudos gerados</strong><span>${usageCount}</span></div>
              <div class="meta-box"><strong>Vigência atual</strong><span>${dueDate}</span></div>
              <div class="meta-box"><strong>Criado em</strong><span>${createdAt}</span></div>
              <div class="meta-box"><strong>Último acesso</strong><span>${lastAccessAt}</span></div>
              <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
            </div>
          </div>

          ${state.authProvider === "api" && user.role !== "admin" ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Pagamento</h4>
                  <p>Abra o checkout atual ou gere um novo link do Mercado Pago para este cliente.</p>
                </div>
              </div>

              <div class="admin-user-quick-actions">
                ${user.mpCheckoutUrl ? `<a class="ghost-button" href="${escapeHtml(user.mpCheckoutUrl)}" target="_blank" rel="noopener">Abrir checkout atual</a>` : ""}
                <button class="ghost-button" type="button" data-payment-link="${escapeHtml(user.id)}">Gerar checkout Mercado Pago</button>
              </div>
            </div>
          ` : ""}

          <div class="admin-user-section">
            <div class="admin-user-section-head">
              <div>
                <h4>Cadastro e acesso</h4>
                <p>Atualize os dados da empresa, plano, status, vencimento e senha sem sair desta ficha.</p>
              </div>
            </div>

            <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
              <label class="field"><span>Empresa</span><input type="text" name="company" value="${companyName}"></label>
              <label class="field"><span>Responsável</span><input type="text" name="contactName" value="${escapeHtml(toPresentationText(user.contactName || ""))}"></label>
              <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(toPresentationText(user.email || ""))}"></label>
              <label class="field"><span>Usuário</span><input type="text" name="username" value="${escapeHtml(toPresentationText(user.username || ""))}"></label>
              <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
              <label class="field"><span>Status do acesso</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
              <label class="field"><span>Status do pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
              <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
              <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
              <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
              <label class="field field-full"><span>Observações internas</span><textarea name="notes" rows="3">${notes}</textarea></label>
              <div class="form-actions field-full">
                <button class="primary-button" type="submit">Salvar alterações</button>
              </div>
            </form>
          </div>

          <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
        </div>
      `;

      refs.adminUsersGrid.appendChild(row);
    });

    refs.adminUsersGrid.querySelectorAll("[data-admin-user-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleInlineAdminUser(button.dataset.adminUserToggle || "");
      });
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });
  }

  async function openOfficialPrintPreview(payload) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return false;
    }

    try {
      const html = buildSystemLaudoPrintHtml(payload);
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.addEventListener("beforeunload", () => cleanupAttachmentPayloads(payload.attachments || []), { once: true });
      window.setTimeout(() => cleanupAttachmentPayloads(payload.attachments || []), 10 * 60 * 1000);
      return true;
    } catch (error) {
      console.error(error);
      cleanupAttachmentPayloads(payload.attachments || []);
      throw error;
    }
  }

  function buildSystemLaudoPrintHtml(payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const diagnosis = buildSystemLaudoDiagnosisData(payload);
    const alterationsText = buildSystemLaudoDetailedChangesText(payload);
    const limitationsText = buildSystemLaudoFunctionalText(payload);
    const typeMarkup = buildSystemLaudoTypeMarkup(payload);
    const foundationText = buildSystemLaudoFoundationText(payload, diagnosis, alterationsText, limitationsText);
    const scienceText = buildSystemLaudoScienceText(payload);
    const originKey = payload.identity && payload.identity.origin ? payload.identity.origin : inferOriginFromCurrentCase();
    const originMarkup = buildSystemCheckGridHtml([
      { value: "congenita", label: "Congênita" },
      { value: "acidente_trabalho", label: "Acidente/doença do trabalho" },
      { value: "acidente_comum", label: "Acidente comum" },
      { value: "doenca_comum", label: "Doença comum" },
      { value: "pos_operatorio", label: "Adquirida em pós-operatório" },
      { value: "outra", label: "Outra", detail: originKey && !["congenita", "acidente_trabalho", "acidente_comum", "doenca_comum", "pos_operatorio"].includes(originKey) ? toPresentationText(originKey) : "" }
    ], [originKey]);
    const specialtyText = buildSystemLaudoSpecialtyText(payload);
    const identityMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Nome completo", value: payload.identity && payload.identity.workerName ? payload.identity.workerName : "" },
      { label: "CPF", value: payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : "" },
      { label: "Data de nascimento", value: payload.identity && payload.identity.workerBirthDate ? formatDateForReport(payload.identity.workerBirthDate) : "" },
      { label: "Data da avaliação", value: payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "" },
      { label: "Profissional emitente", value: payload.identity && payload.identity.examiner ? payload.identity.examiner : "" },
      { label: "Conselho / registro", value: payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : "" },
      ...(buildSystemLaudoSpecialtyText(payload) ? [{ label: "Especialidade", value: buildSystemLaudoSpecialtyText(payload) }] : [])
    ]);
    const diagnosisMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Diagnóstico principal", value: diagnosis.principal },
      { label: "CID", value: diagnosis.cid },
      { label: "Diagnósticos associados", value: diagnosis.associated },
      { label: "Data de início / evolução", value: diagnosis.evolution },
      { label: "Caráter de longo prazo", value: diagnosis.nature }
    ], "wide");
    const attachmentSheets = buildSystemAttachmentPrintSheetsHtml(attachments);
    const hasPdfAttachment = attachments.some((attachment) => attachment.previewKind === "pdf");
    const printDelay = hasPdfAttachment ? 1400 : (attachments.length ? 900 : 420);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador de Deficiência</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    html, body { margin: 0; padding: 0; background: #e8eef4; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #163247; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bundle-shell { display: grid; justify-content: center; gap: 18px; padding: 18px; }
    .print-page { width: 186mm; min-height: 273mm; box-sizing: border-box; background: #ffffff; box-shadow: 0 18px 40px rgba(16, 37, 58, 0.14); border: 1px solid rgba(19, 49, 74, 0.08); border-radius: 22px; padding: 13mm 13mm 11mm; display: grid; align-content: start; gap: 10px; page-break-after: always; break-after: page; }
    .print-page:last-child { page-break-after: auto; break-after: auto; }
    .report-header { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; padding-bottom: 10px; border-bottom: 2px solid #0c6b9e; }
    .header-copy { display: grid; gap: 5px; }
    .header-copy h1 { margin: 0; font-size: 1.4rem; letter-spacing: 0.04em; text-transform: uppercase; color: #102d43; }
    .header-copy p { margin: 0; line-height: 1.45; color: #496375; font-size: 0.93rem; }
    .header-copy small { color: #678196; font-size: 0.78rem; line-height: 1.45; }
    .section-card { padding: 11px 12px 12px; border-radius: 18px; border: 1px solid rgba(16, 45, 67, 0.1); background: #ffffff; display: grid; gap: 8px; }
    .section-card h2 { margin: 0; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #0c6b9e; }
    .section-card p { margin: 0; line-height: 1.56; font-size: 0.92rem; color: #17344a; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .meta-grid.wide { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .meta-item { min-height: 64px; padding: 10px 11px; border-radius: 14px; background: #f8fbfd; border: 1px solid rgba(16, 45, 67, 0.08); display: grid; align-content: start; gap: 4px; }
    .meta-item span { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #678196; }
    .meta-item strong { font-size: 0.91rem; line-height: 1.4; color: #163247; }
    .check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
    .check-item { padding: 10px 11px; border-radius: 15px; border: 1px solid rgba(16, 45, 67, 0.1); background: #fbfdff; display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: start; }
    .check-item .box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid rgba(16, 45, 67, 0.35); background: #ffffff; position: relative; box-sizing: border-box; margin-top: 2px; }
    .check-item.checked { border-color: rgba(12, 107, 158, 0.24); background: #f4fbff; }
    .check-item.checked .box { border-color: #0c6b9e; background: #0c6b9e; }
    .check-item.checked .box::after { content: ""; position: absolute; inset: 4px; border-radius: 2px; background: #ffffff; }
    .check-item strong { display: block; font-size: 0.89rem; color: #153247; }
    .check-item span { display: block; margin-top: 3px; font-size: 0.8rem; line-height: 1.45; color: #60798d; }
    .evidence-list { display: grid; gap: 8px; }
    .evidence-item { display: grid; grid-template-columns: 1fr auto; gap: 10px; padding: 10px 11px; border-radius: 14px; background: #f8fbfd; border: 1px solid rgba(16, 45, 67, 0.08); }
    .evidence-item strong { display: block; font-size: 0.88rem; color: #17344a; }
    .evidence-item span { display: block; margin-top: 4px; font-size: 0.79rem; line-height: 1.45; color: #657f93; }
    .status-badge { align-self: start; padding: 5px 9px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
    .status-badge.ok { background: rgba(29, 128, 90, 0.12); color: #196b4d; }
    .status-badge.warn { background: rgba(188, 139, 28, 0.15); color: #8e6712; }
    .status-badge.info { background: rgba(12, 107, 158, 0.12); color: #0c6b9e; }
    .support-note { padding: 10px 11px; border-radius: 14px; background: #fff8e4; border: 1px solid rgba(168, 120, 23, 0.18); color: #775614; line-height: 1.5; font-size: 0.84rem; }
    .dual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .signature-block { min-height: 112px; padding: 11px 12px; border-radius: 16px; border: 1px solid rgba(16, 45, 67, 0.1); background: #fbfdff; display: grid; align-content: space-between; gap: 18px; }
    .signature-block strong { font-size: 0.9rem; color: #163247; }
    .signature-line { display: block; padding-top: 16px; border-top: 1px solid rgba(16, 45, 67, 0.18); font-size: 0.8rem; color: #678196; }
    .page-footer { display: flex; justify-content: space-between; gap: 12px; align-items: center; color: #70889a; font-size: 0.76rem; padding-top: 3px; }
    .annex-title { margin: 0; font-size: 1.18rem; color: #102d43; }
    .annex-subtitle { margin: 0; color: #5f7789; line-height: 1.5; font-size: 0.9rem; }
    .attachment-preview { width: 100%; border: 1px solid rgba(16, 45, 67, 0.08); border-radius: 16px; background: #ffffff; overflow: hidden; min-height: 860px; }
    .attachment-image { display: block; width: 100%; height: auto; max-height: 860px; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 860px; border: 0; display: block; background: #ffffff; }
    .attachment-note { margin: 0; padding: 10px 11px; border-radius: 14px; background: #fff8e4; border: 1px solid rgba(168, 120, 23, 0.18); color: #775614; line-height: 1.5; font-size: 0.83rem; }
    @media print {
      body { background: #ffffff; }
      .bundle-shell { padding: 0; gap: 0; }
      .print-page { width: auto; min-height: auto; border-radius: 0; box-shadow: none; border: 0; }
    }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="print-page">
      <header class="report-header">
        <div class="header-copy">
          <h1>Laudo Caracterizador de Deficiência</h1>
          <p>Documento técnico-ocupacional estruturado para análise clínico-funcional, caracterização e lastro documental do enquadramento de pessoa com deficiência.</p>
          <small>Base legal considerada: Convenção sobre os Direitos das Pessoas com Deficiência (Decreto nº 6.949/2009), Lei nº 13.146/2015, Lei nº 8.213/1991, Decretos nº 3.298/1999 e nº 5.296/2004, com normas específicas aplicáveis ao tipo de deficiência analisado.</small>
        </div>
      </header>

      ${buildSystemLaudoSectionHtml("1. Identificação do avaliado", identityMarkup)}
      ${buildSystemLaudoSectionHtml("2. Origem da deficiência", originMarkup)}
      ${buildSystemLaudoSectionHtml("3. Diagnóstico / condição clínica", diagnosisMarkup)}
      ${buildSystemLaudoSectionHtml("4. Descrição detalhada das alterações", `<p>${escapeHtml(alterationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("5. Descrição das limitações funcionais", `<p>${escapeHtml(limitationsText)}</p>`)}

      <div class="page-footer">
        <span>Documento gerado em ${escapeHtml(formatDateTimeForReport(payload.generatedAt || new Date()))}</span>
        <span>Página 1</span>
      </div>
    </section>

    <section class="print-page">
      ${buildSystemLaudoSectionHtml("6. Tipo de deficiência / enquadramento técnico", typeMarkup)}
      ${buildSystemLaudoSectionHtml("7. Fundamentação técnica", `<p>${escapeHtml(foundationText)}</p>`)}
      ${buildSystemLaudoSectionHtml("8. Ciência e autorização do avaliado", `<p>${escapeHtml(scienceText)}</p>`)}
      ${buildSystemLaudoSectionHtml("9. Assinatura do profissional", `
        <div class="dual-grid">
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examiner ? payload.identity.examiner : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : ""))}</p>
              ${buildSystemLaudoSpecialtyText(payload) ? `<p>${escapeHtml(buildSystemLaudoSpecialtyText(payload))}</p>` : ""}
            </div>
            <span class="signature-line">Assinatura / carimbo profissional</span>
          </div>
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerName ? payload.identity.workerName : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : ""))}</p>
              <p>Data: ${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : ""))}</p>
            </div>
            <span class="signature-line">Assinatura do avaliado</span>
          </div>
        </div>
      `)}

      <div class="page-footer">
        <span>${escapeHtml(normalizeLaudoValue(payload.moduleLabel || ""))}</span>
        <span>Página 2</span>
      </div>
    </section>

    ${attachmentSheets}
  </div>
  ${buildPrintBundleScript(printDelay)}
</body>
</html>`;
  }

  function buildSystemLaudoSectionHtml(title, content) {
    return `
      <section class="section-card">
        <h2>${escapeHtml(title)}</h2>
        ${content}
      </section>
    `;
  }

  function buildSystemLaudoMetaGridHtml(items, mode = "") {
    const className = mode === "wide" ? "meta-grid wide" : "meta-grid";
    return `
      <div class="${className}">
        ${items.map((item) => `
          <article class="meta-item">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(normalizeLaudoValue(item.value))}</strong>
          </article>
        `).join("")}
      </div>
    `;
  }

  function buildSystemCheckGridHtml(items, selectedValues = []) {
    const selected = new Set((Array.isArray(selectedValues) ? selectedValues : [selectedValues]).filter(Boolean));
    return `
      <div class="check-grid">
        ${items.map((item) => `
          <article class="check-item${selected.has(item.value) ? " checked" : ""}">
            <span class="box" aria-hidden="true"></span>
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              ${item.detail ? `<span>${escapeHtml(item.detail)}</span>` : ""}
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function buildSystemAttachmentSummaryHtml(attachments = []) {
    if (!attachments.length) {
      return "";
    }

    const items = attachments.map((attachment, index) => `
      <article class="evidence-item">
        <div>
          <strong>${index + 1}. ${escapeHtml(toPresentationText(attachment.name))}</strong>
          <span>${escapeHtml(describeAttachmentKind(attachment.mimeType))} - ${escapeHtml(attachment.sizeLabel)}</span>
        </div>
        <span class="status-badge info">Anexo</span>
      </article>
    `).join("");

    return `
      <section class="print-page">
        <h2 class="annex-title">Anexos vinculados ao caso</h2>
        <p class="annex-subtitle">Os documentos abaixo foram incorporados ao pacote final de impressão para compor o lastro documental do laudo caracterizador.</p>
        <section class="section-card">
          <h2>Relação de anexos</h2>
          <div class="evidence-list">${items}</div>
        </section>
        <div class="page-footer">
          <span>Pacote complementar de documentos</span>
          <span>Anexos</span>
        </div>
      </section>
    `;
  }

  function buildSystemAttachmentPrintSheetsHtml(attachments = []) {
    return attachments.map((attachment, index) => {
      if (attachment.previewKind === "image") {
        return `
          <section class="print-page">
            <h2 class="annex-title">Anexo ${index + 1}</h2>
            <p class="annex-subtitle">${escapeHtml(toPresentationText(attachment.name))}</p>
            <section class="section-card">
              <h2>Pré-visualização do documento</h2>
              <div class="attachment-preview">
                <img class="attachment-image" src="${escapeHtml(attachment.source)}" alt="${escapeHtml(toPresentationText(attachment.name))}">
              </div>
            </section>
          </section>
        `;
      }

      if (attachment.previewKind === "pdf") {
        return `
          <section class="print-page">
            <h2 class="annex-title">Anexo ${index + 1}</h2>
            <p class="annex-subtitle">${escapeHtml(toPresentationText(attachment.name))}</p>
            <section class="section-card">
              <h2>Documento em PDF</h2>
              <div class="attachment-preview">
                <iframe class="attachment-pdf" src="${escapeHtml(`${attachment.source}#toolbar=0&navpanes=0&scrollbar=0`)}" title="${escapeHtml(toPresentationText(attachment.name))}" loading="eager"></iframe>
              </div>
              <p class="attachment-note">Se o navegador limitar a renderização interna deste PDF, utilize a folha de anexo como capa de conferência e mantenha o arquivo original disponível para impressão complementar.</p>
            </section>
          </section>
        `;
      }

      return `
        <section class="print-page">
          <h2 class="annex-title">Anexo ${index + 1}</h2>
          <p class="annex-subtitle">${escapeHtml(toPresentationText(attachment.name))}</p>
          <section class="section-card">
            <h2>Arquivo externo vinculado</h2>
            <p>Este formato de arquivo não possui pré-visualização automática dentro do navegador. Mantenha o documento original disponível para consulta, auditoria e impressão complementar quando necessário.</p>
          </section>
        </section>
      `;
    }).join("");
  }

  function normalizeLaudoValue(value, fallback = "Não informado") {
    const text = toPresentationText(value, true);
    return text || fallback;
  }

  function buildSystemLaudoSpecialtyText(payload) {
    const registry = toPresentationText(payload && payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : "");
    if (/crm/i.test(registry)) return "Medicina";
    if (/coren/i.test(registry)) return "Enfermagem";
    if (/crp/i.test(registry)) return "Psicologia";
    if (/crefito/i.test(registry)) return "Fisioterapia / Terapia Ocupacional";
    if (state.activeModule === "auditiva") return "Saúde ocupacional / avaliação auditiva";
    if (state.activeModule === "visual") return "Saúde ocupacional / avaliação visual";
    if (state.activeModule === "fisica" || state.activeModule === "clinicas") return "Saúde ocupacional / avaliação clínico-funcional";
    if (state.activeModule === "intelectual") return "Saúde ocupacional / avaliação cognitivo-adaptativa";
    if (state.activeModule === "psicossocial") return "Saúde ocupacional / avaliação psicossocial";
    return "";
  }

  function buildSystemLaudoDiagnosisData(payload) {
    const cid = toPresentationText(formatCid(resolveCurrentCid())) || "Não informado";

    if (state.activeModule === "auditiva") {
      const rightTotal = isTotalHearingLossEar(["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"].map(numberOf));
      const leftTotal = isTotalHearingLossEar(["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"].map(numberOf));
      return {
        principal: rightTotal || leftTotal ? "Deficiência auditiva por surdez unilateral total" : "Deficiência auditiva por perda auditiva bilateral parcial",
        cid,
        associated: refs.audioFile && refs.audioFile.files && refs.audioFile.files[0] ? `Documento audiométrico informado: ${refs.audioFile.files[0].name}` : "Não informados",
        evolution: "Achado objetivo baseado em audiometria tonal liminar lançada no sistema.",
        nature: "Impedimento sensorial auditivo de longo prazo."
      };
    }

    if (state.activeModule === "fisica") {
      const conditionLabel = toPresentationText(labelForSelectValue("physicalConditionType") || valueOf("physicalConditionType"));
      const segmentText = buildSystemPhysicalSegmentText();
      return {
        principal: conditionLabel ? `${conditionLabel} em ${segmentText}` : "Deficiência física",
        cid,
        associated: normalizedText("physicalClinicalBasis") ? `Base clínica referida: ${normalizedText("physicalClinicalBasis")}` : "Não informados",
        evolution: valueOf("physicalPermanent") === "sim" ? "Condição descrita como permanente na avaliação atual." : "Caráter permanente não informado.",
        nature: "Impedimento de longo prazo com repercussão anatômica e/ou funcional."
      };
    }

    if (state.activeModule === "visual") {
      return {
        principal: buildSystemVisualDiagnosisLabel(),
        cid,
        associated: valueOf("visualLaterality") ? `Lateralidade: ${capitalize(valueOf("visualLaterality"))}` : "Não informados",
        evolution: valueOf("visualPermanent") === "sim" ? "Condição visual permanente informada pelo avaliador." : "Caráter permanente não informado.",
        nature: "Impedimento sensorial visual de longo prazo."
      };
    }

    if (state.activeModule === "clinicas") {
      const condition = toPresentationText(normalizedText("clinicalCondition"));
      return {
        principal: condition ? `Condição clínica persistente compatível com ${condition}` : "Condição clínica persistente",
        cid,
        associated: valueOf("clinicalMedicalReport") === "sim" ? "Laudo médico assistente informado." : "Sem laudo médico assistente indicado no formulário.",
        evolution: valueOf("clinicalPersistent") === "sim" ? "Persistência do quadro informada pelo avaliador." : "Persistência não confirmada.",
        nature: "Impedimento de longo prazo dependente de correlação clínico-funcional."
      };
    }

    if (state.activeModule === "intelectual") {
      const condition = toPresentationText(normalizedText("intellectualCondition"));
      const supportNeed = toPresentationText(labelForSelectValue("intellectualSupportNeed"));
      return {
        principal: condition ? `Deficiência intelectual compatível com ${condition}` : "Deficiência intelectual",
        cid,
        associated: supportNeed ? `Necessidade de suporte ${lowerFirstPresentation(supportNeed)}` : "Não informados",
        evolution: valueOf("intellectualDevelopmental") === "sim" ? "Manifestação informada no período do desenvolvimento." : "Informação evolutiva não detalhada.",
        nature: "Impedimento cognitivo-adaptativo de longo prazo."
      };
    }

    if (state.activeModule === "psicossocial") {
      const condition = toPresentationText(normalizedText("psychosocialCondition"));
      return {
        principal: buildSystemPsychosocialDiagnosisLabel(condition),
        cid,
        associated: valueOf("psychosocialFollowUp") ? `Acompanhamento terapêutico: ${translateYesNo(valueOf("psychosocialFollowUp"))}` : "Não informados",
        evolution: valueOf("psychosocialPersistent") === "sim" ? "Persistência do quadro informada pelo avaliador." : "Persistência não confirmada.",
        nature: /autismo|tea|espectro autista/i.test(condition) ? "Condição do neurodesenvolvimento de longo prazo." : "Impedimento mental/psicossocial de longo prazo."
      };
    }

    return {
      principal: toPresentationText(payload && payload.moduleLabel ? payload.moduleLabel : "Condição não especificada"),
      cid,
      associated: "Não informados",
      evolution: "Não informado",
      nature: "Não informado"
    };
  }

  function buildSystemLaudoDetailedChangesText(payload) {
    if (state.activeModule === "auditiva") {
      const odAverage = getAudiometryAverage("OD");
      const oeAverage = getAudiometryAverage("OE");
      const rightTotal = isTotalHearingLossEar(["audioOD500", "audioOD1000", "audioOD2000", "audioOD3000"].map(numberOf));
      const leftTotal = isTotalHearingLossEar(["audioOE500", "audioOE1000", "audioOE2000", "audioOE3000"].map(numberOf));
      const side = rightTotal ? "direita" : leftTotal ? "esquerda" : "";
      const classification = rightTotal || leftTotal
        ? `surdez unilateral total em orelha ${side}`
        : "perda auditiva bilateral parcial";
      const detail = rightTotal || leftTotal
        ? `, sendo observado na orelha ${side} limiar superior a 95 dB em todas as frequências consideradas para o critério`
        : "";
      return ensureSentence(`Alteração sensorial auditiva caracterizada por ${classification}, comprovada por audiometria tonal liminar sem uso de aparelho auditivo, com média de ${formatDecimal(odAverage)} dB em OD e ${formatDecimal(oeAverage)} dB em OE nas frequências de 500 Hz, 1000 Hz, 2000 Hz e 3000 Hz${detail}`);
    }

    if (state.activeModule === "fisica") {
      const conditionLabel = lowerFirstPresentation(labelForSelectValue("physicalConditionType") || valueOf("physicalConditionType") || "alteração física");
      const segmentText = buildSystemPhysicalSegmentText();
      const findings = [];
      const strengthSummary = buildPhysicalStrengthSummary();
      const mobility = valueOf("physicalMobility");
      const anatomicalLoss = valueOf("physicalAnatomicalLoss");
      const movementFocus = labelForSelectValue("physicalMovementFocus");
      const clinicalBasis = normalizedText("physicalClinicalBasis");

      if (anatomicalLoss && anatomicalLoss !== "minima") {
        findings.push(`perda anatômica ${lowerFirstPresentation(labelForSelectValue("physicalAnatomicalLoss") || anatomicalLoss)}`);
      }
      if (strengthSummary) {
        findings.push(strengthSummary);
      }
      if (mobility) {
        findings.push(`limitação ${mobility} de mobilidade`);
      }
      if (movementFocus) {
        findings.push(`movimento predominante comprometido: ${lowerFirstPresentation(movementFocus)}`);
      }
      if (clinicalBasis) {
        findings.push(`base clínica referida: ${lowerFirstPresentation(clinicalBasis)}`);
      }

      return ensureSentence(`Alteração anatômico-funcional em ${segmentText}, decorrente de ${conditionLabel}, com caráter ${valueOf("physicalPermanent") === "sim" ? "permanente" : "não confirmado"}${findings.length ? `, apresentando ${joinList(findings)}` : ""}`);
    }

    if (state.activeModule === "visual") {
      const summary = buildOfficialVisualSummary();
      const laterality = valueOf("visualLaterality");
      const lateralityText = laterality ? `, com lateralidade ${laterality}` : "";
      return ensureSentence(`Alteração sensorial visual permanente fundamentada em ${summary}${lateralityText}, considerada com melhor correção óptica e demais dados objetivos informados pelo avaliador`);
    }

    if (state.activeModule === "clinicas") {
      const condition = lowerFirstPresentation(normalizedText("clinicalCondition") || "condição clínica persistente");
      const grade = lowerFirstPresentation(valueOf("clinicalLimitationGrade") || "relevante");
      const medicalReport = valueOf("clinicalMedicalReport");
      const multidisciplinary = valueOf("clinicalMultidisciplinary");
      return ensureSentence(`Condição clínica persistente compatível com ${condition}, associada a comprometimento funcional ${grade}, com informação documental de laudo médico ${translateYesNo(medicalReport || "nao")} e avaliação multidisciplinar ${translateYesNo(multidisciplinary || "nao")}`);
    }

    if (state.activeModule === "intelectual") {
      const condition = lowerFirstPresentation(normalizedText("intellectualCondition") || "comprometimento do funcionamento intelectual");
      const supportNeed = lowerFirstPresentation(labelForSelectValue("intellectualSupportNeed") || "relevante");
      return ensureSentence(`Comprometimento permanente do funcionamento intelectual e das habilidades adaptativas, compatível com ${condition}, com necessidade de suporte ${supportNeed} e manifestação referida no período do desenvolvimento`);
    }

    if (state.activeModule === "psicossocial") {
      const condition = lowerFirstPresentation(normalizedText("psychosocialCondition") || "quadro mental/psicossocial persistente");
      const participation = valueOf("psychosocialParticipation");
      return ensureSentence(`Quadro persistente compatível com ${condition}, associado a restrição relevante de participação social e laboral${participation ? `, com participação em igualdade de condições descrita como ${participation === "sim" ? "comprometida" : "preservada"}` : ""}`);
    }

    return ensureSentence(toPresentationText(payload && payload.result ? payload.result.description : ""));
  }

  function buildSystemLaudoFunctionalText(payload) {
    return ensureSentence(toPresentationText(payload && payload.result && payload.result.limitations
      ? payload.result.limitations
      : buildOfficialLimitationsText(payload)));
  }

  function buildSystemPhysicalSegmentText() {
    const choiceKey = normalizedChoiceKey(valueOf("physicalConditionType"));
    const scope = valueOf("physicalAmputationScope");
    const laterality = resolveEffectivePhysicalLaterality();
    if (choiceKey.includes("amput")) {
      return toPresentationText(composeAmputationFinding(scope, laterality, collectAmputationDetail(), valueOf("physicalAmputationLevel")));
    }
    return toPresentationText(composeSegment(resolvePhysicalSegment(), laterality));
  }

  function buildSystemVisualDiagnosisLabel() {
    const condition = valueOf("visualPrimaryFinding");
    if (condition === "visao_monocular") {
      return "Visão monocular";
    }
    return `Deficiência visual por ${lowerFirstPresentation(labelForSelectValue("visualPrimaryFinding") || "alteração visual permanente")}`;
  }

  function buildSystemPsychosocialDiagnosisLabel(conditionText = "") {
    const normalized = toPresentationText(conditionText).toLowerCase();
    if (/autismo|tea|espectro autista/.test(normalized)) {
      return "Transtorno do Espectro Autista";
    }
    return normalized ? `Deficiência mental/psicossocial compatível com ${normalized}` : "Deficiência mental/psicossocial";
  }

  function buildSystemLaudoTypeMarkup(payload) {
    const psychosocialCondition = toPresentationText(normalizedText("psychosocialCondition")).toLowerCase();
    const clinicalType = inferSystemClinicalTypeKey();
    const selected = [];

    if (state.activeModule === "fisica") selected.push("fisica");
    if (state.activeModule === "auditiva") selected.push("auditiva");
    if (state.activeModule === "visual") {
      selected.push("visual");
      if (valueOf("visualPrimaryFinding") === "visao_monocular") {
        selected.push("monocular");
      }
    }
    if (state.activeModule === "clinicas") selected.push(clinicalType);
    if (state.activeModule === "intelectual") selected.push("intelectual");
    if (state.activeModule === "psicossocial") selected.push(/autismo|tea|espectro autista/.test(psychosocialCondition) ? "tea" : "psicossocial");

    return `
      ${buildSystemCheckGridHtml([
        { value: "fisica", label: "Deficiência Física", detail: selected.includes("fisica") ? buildSystemPhysicalSegmentText() : "" },
        { value: "auditiva", label: "Deficiência Auditiva", detail: state.activeModule === "auditiva" ? buildSystemLaudoDiagnosisData(payload).principal : "" },
        { value: "visual", label: "Deficiência Visual", detail: state.activeModule === "visual" ? buildOfficialVisualSummary() : "" },
        { value: "monocular", label: "Visão Monocular", detail: valueOf("visualPrimaryFinding") === "visao_monocular" ? "Condição reconhecida em fluxo próprio dentro da deficiência visual." : "" },
        { value: "intelectual", label: "Deficiência Intelectual", detail: state.activeModule === "intelectual" ? toPresentationText(normalizedText("intellectualCondition")) : "" },
        { value: "psicossocial", label: "Deficiência Mental/Psicossocial", detail: selected.includes("psicossocial") ? toPresentationText(normalizedText("psychosocialCondition")) : "" },
        { value: "tea", label: "Transtorno do Espectro Autista", detail: selected.includes("tea") ? toPresentationText(normalizedText("psychosocialCondition")) : "" },
        { value: "multipla", label: "Deficiência Múltipla", detail: "" }
      ], selected)}
      <div class="check-grid" style="margin-top:8px;">
        ${buildSystemCheckGridHtml([
          { value: "reabilitado", label: "Reabilitado da Previdência Social", detail: "Fluxo separado de PCD. Não assinalado automaticamente neste laudo." }
        ], [])}
      </div>
    `;
  }

  function inferSystemClinicalTypeKey() {
    const condition = toPresentationText(normalizedText("clinicalCondition")).toLowerCase();
    if (/depress|ansied|bipolar|esquiz|psic|transtorno mental/.test(condition)) {
      return "psicossocial";
    }
    if (/autismo|tea|espectro autista/.test(condition)) {
      return "tea";
    }
    return "fisica";
  }

  function buildSystemLaudoEvidenceMarkup(payload, attachments = []) {
    const items = [];
    const pushItem = (label, status, detail, variant = "info") => {
      items.push({ label, status, detail, variant });
    };

    if (state.activeModule === "auditiva") {
      pushItem(
        "Audiometria tonal liminar sem aparelho auditivo",
        "Informada",
        `OD: ${formatDecimal(getAudiometryAverage("OD"))} dB | OE: ${formatDecimal(getAudiometryAverage("OE"))} dB nas frequências de 500, 1000, 2000 e 3000 Hz.`,
        "ok"
      );
      if (refs.audioFile && refs.audioFile.files && refs.audioFile.files[0]) {
        pushItem("Arquivo de audiometria no módulo", "Anexado", refs.audioFile.files[0].name, "ok");
      } else {
        pushItem("Arquivo de audiometria no módulo", "Não anexado", "O critério foi calculado pelos dados informados no formulário.", "warn");
      }
    }

    if (state.activeModule === "fisica") {
      pushItem(
        "Documentação especializada",
        valueOf("physicalSupportDocs") === "sim" ? "Informada" : "Recomendada",
        valueOf("physicalSupportDocs") === "sim"
          ? "Há documentação objetiva referida no caso."
          : "Sugere-se laudo ortopédico, fisiátrico ou neurológico conforme a base clínica."
      , valueOf("physicalSupportDocs") === "sim" ? "ok" : "warn");
      pushItem(
        "Força muscular",
        valueOf("physicalStrengthGrade") ? "Registrada" : "Sem dado",
        valueOf("physicalStrengthGrade") ? normalizeLaudoValue(buildPhysicalStrengthSummary(), "Força preservada ou sem redução relevante.") : "Sem graduação MRC selecionada.",
        valueOf("physicalStrengthGrade") ? "ok" : "warn"
      );
      pushItem(
        "Mobilidade do segmento",
        valueOf("physicalMobility") ? "Registrada" : "Sem dado",
        valueOf("physicalMobility") ? `Limitação ${valueOf("physicalMobility")} de mobilidade.` : "Sem graduação de mobilidade informada.",
        valueOf("physicalMobility") ? "ok" : "warn"
      );
    }

    if (state.activeModule === "visual") {
      pushItem(
        "Acuidade visual com melhor correção",
        "Informada",
        `OD: ${normalizeLaudoValue(labelForSelectValue("visualAcuityOD"))} | OE: ${normalizeLaudoValue(labelForSelectValue("visualAcuityOE"))}.`,
        "ok"
      );
      pushItem(
        "Campimetria / campo visual",
        valueOf("visualFieldChanged") === "sim" ? "Alterada" : "Sem alteração informada",
        valueOf("visualFieldChanged") === "sim"
          ? (valueOf("visualFieldExtent") === "ate_60" ? "Somatório binocular informado como igual ou menor que 60°." : "Campo visual alterado sem detalhamento completo do somatório binocular.")
          : "Não houve campimetria alterada referida no formulário.",
        valueOf("visualFieldChanged") === "sim" ? "ok" : "info"
      );
      pushItem(
        "Laudo oftalmológico",
        valueOf("visualSupportDocs") === "sim" ? "Informado" : "Recomendado",
        valueOf("visualSupportDocs") === "sim"
          ? "Documentação oftalmológica referida pelo avaliador."
          : "Recomenda-se laudo oftalmológico com acuidade corrigida e, se aplicável, campimetria.",
        valueOf("visualSupportDocs") === "sim" ? "ok" : "warn"
      );
    }

    if (state.activeModule === "clinicas") {
      pushItem(
        "Laudo médico assistente",
        valueOf("clinicalMedicalReport") === "sim" ? "Informado" : "Recomendado",
        valueOf("clinicalMedicalReport") === "sim"
          ? "Há laudo médico assistente referido no caso."
          : "Necessita laudo médico atualizado descrevendo persistência e repercussão funcional.",
        valueOf("clinicalMedicalReport") === "sim" ? "ok" : "warn"
      );
      pushItem(
        "Avaliação multidisciplinar",
        valueOf("clinicalMultidisciplinary") === "sim" ? "Informada" : "Recomendada",
        valueOf("clinicalMultidisciplinary") === "sim"
          ? "Há avaliação funcional multiprofissional referida."
          : buildClinicalMultidisciplinaryExamples(toPresentationText(normalizedText("clinicalCondition")).toLowerCase() || "condição clínica"),
        valueOf("clinicalMultidisciplinary") === "sim" ? "ok" : "warn"
      );
      pushItem(
        "Persistência da condição",
        valueOf("clinicalPersistent") === "sim" ? "Confirmada" : "Não confirmada",
        valueOf("clinicalPersistent") === "sim" ? "Quadro persistente informado pelo avaliador." : "Persistência não confirmada no formulário.",
        valueOf("clinicalPersistent") === "sim" ? "ok" : "warn"
      );
    }

    if (state.activeModule === "intelectual") {
      pushItem(
        "Documentação psicológica / neuropsicológica",
        valueOf("intellectualSupportDocs") === "sim" ? "Informada" : "Recomendada",
        valueOf("intellectualSupportDocs") === "sim"
          ? "Há documentação especializada referida no caso."
          : "Necessita documentação psicológica, neuropsicológica ou equivalente com evidência adaptativa.",
        valueOf("intellectualSupportDocs") === "sim" ? "ok" : "warn"
      );
      pushItem(
        "Habilidades adaptativas",
        checkedLabels("intellectualMarker").length ? "Descritas" : "Sem detalhe",
        checkedLabels("intellectualMarker").length ? joinList(checkedLabels("intellectualMarker")) : "Sem marcadores adaptativos selecionados.",
        checkedLabels("intellectualMarker").length ? "ok" : "warn"
      );
      pushItem(
        "Necessidade de suporte",
        valueOf("intellectualSupportNeed") ? "Informada" : "Sem dado",
        normalizeLaudoValue(labelForSelectValue("intellectualSupportNeed")),
        valueOf("intellectualSupportNeed") ? "ok" : "warn"
      );
    }

    if (state.activeModule === "psicossocial") {
      pushItem(
        "Laudo especializado",
        valueOf("psychosocialSupportDocs") === "sim" ? "Informado" : "Recomendado",
        valueOf("psychosocialSupportDocs") === "sim"
          ? "Há documentação psiquiátrica, psicológica ou equivalente referida."
          : "Necessita laudo psiquiátrico, psicológico ou equivalente com repercussão funcional descrita.",
        valueOf("psychosocialSupportDocs") === "sim" ? "ok" : "warn"
      );
      pushItem(
        "Acompanhamento terapêutico",
        valueOf("psychosocialFollowUp") === "sim" ? "Informado" : "Ausente",
        valueOf("psychosocialFollowUp") === "sim"
          ? "Acompanhamento terapêutico/documental referido no caso."
          : "A ausência de acompanhamento terapêutico fragiliza a sustentação funcional do enquadramento.",
        valueOf("psychosocialFollowUp") === "sim" ? "ok" : "warn"
      );
      pushItem(
        "Limitações de participação",
        checkedLabels("psychosocialMarker").length ? "Descritas" : "Sem detalhe",
        checkedLabels("psychosocialMarker").length ? joinList(checkedLabels("psychosocialMarker")) : "Sem marcadores psicossociais selecionados.",
        checkedLabels("psychosocialMarker").length ? "ok" : "warn"
      );
    }

    attachments.forEach((attachment, index) => {
      pushItem(
        `Anexo externo ${index + 1}`,
        "Vinculado",
        `${toPresentationText(attachment.name)} (${describeAttachmentKind(attachment.mimeType)} - ${attachment.sizeLabel}).`,
        "info"
      );
    });

    const supportNote = toPresentationText(payload && payload.result && payload.result.supportNote ? payload.result.supportNote : "", true);

    return `
      <div class="evidence-list">
        ${items.map((item) => `
          <article class="evidence-item">
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(item.detail)}</span>
            </div>
            <span class="status-badge ${escapeHtml(item.variant)}">${escapeHtml(item.status)}</span>
          </article>
        `).join("")}
      </div>
      ${supportNote ? `<p class="support-note">${escapeHtml(supportNote)}</p>` : ""}
    `;
  }

  function buildSystemLaudoFoundationText(payload, diagnosis, alterationsText, limitationsText) {
    const references = [
      "Lei nº 13.146/2015",
      "Lei nº 8.213/1991",
      "Decreto nº 3.298/1999"
    ];

    if (state.activeModule === "visual" && valueOf("visualPrimaryFinding") === "visao_monocular") {
      references.push("Lei nº 14.126/2021");
    }
    if (state.activeModule === "psicossocial" && /autismo|tea|espectro autista/i.test(toPresentationText(normalizedText("psychosocialCondition")))) {
      references.push("Lei nº 12.764/2012");
    }
    if (state.activeModule === "auditiva") {
      references.push("Atualizações legais aplicáveis à deficiência auditiva");
    }

    const pieces = [
      `A análise técnico-funcional do caso identificou ${lowerFirstPresentation(diagnosis.principal)}${diagnosis.cid && diagnosis.cid !== "Não informado" ? `, com CID ${diagnosis.cid}` : ""}, associada às alterações corporais descritas e às limitações funcionais registradas.`,
      `Consideraram-se ${joinList(references)}, em correlação com os dados objetivos e funcionais lançados no presente laudo.`
    ];

    return pieces
      .filter(Boolean)
      .map((piece) => ensureSentence(piece))
      .join(" ");
  }

  function buildSystemLaudoConclusionData(payload) {
    const status = payload && payload.result ? payload.result.status : "";
    if (status === "eligible") {
      return {
        title: "Enquadra",
        text: "Conclui-se que a pessoa avaliada apresenta condição compatível com caracterização de deficiência, nos termos da legislação aplicável, observadas as alterações corporais descritas, o impedimento de longo prazo e as limitações funcionais identificadas.",
        variant: "ok"
      };
    }
    if (status === "review") {
      return {
        title: "Dados insuficientes",
        text: "Conclui-se que os elementos apresentados até o momento são insuficientes para caracterização técnica segura da condição de pessoa com deficiência, sendo recomendada complementação documental e/ou avaliação especializada.",
        variant: "warn"
      };
    }
    return {
      title: "Não enquadra",
      text: "Conclui-se que, com base nos elementos clínicos e funcionais atualmente apresentados, não há substrato técnico suficiente para caracterização da condição de pessoa com deficiência para fins de enquadramento legal.",
      variant: "no"
    };
  }

  function buildSystemLaudoScienceText(payload) {
    return `Declaro ter ciência do conteúdo do presente laudo caracterizador e autorizo sua apresentação, juntamente com exames e documentos correlatos, aos setores competentes da empresa, à saúde ocupacional, ao RH e aos órgãos fiscalizatórios ou administrativos cabíveis, quando aplicável. Data de ciência: ${normalizeLaudoValue(payload && payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "")}.`;
  }

  function buildSystemLaudoPrintHtml(payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const diagnosis = buildSystemLaudoDiagnosisData(payload);
    const alterationsText = buildSystemLaudoDetailedChangesText(payload);
    const limitationsText = buildSystemLaudoFunctionalText(payload);
    const typeMarkup = buildSystemLaudoTypeMarkup(payload);
    const foundationText = buildSystemLaudoFoundationText(payload, diagnosis, alterationsText, limitationsText);
    const scienceText = buildSystemLaudoScienceText(payload);
    const originKey = payload.identity && payload.identity.origin ? payload.identity.origin : inferOriginFromCurrentCase();
    const originMarkup = buildSystemCheckGridHtml([
      { value: "congenita", label: "Congênita" },
      { value: "acidente_trabalho", label: "Acidente/doença do trabalho" },
      { value: "acidente_comum", label: "Acidente comum" },
      { value: "doenca_comum", label: "Doença comum" },
      { value: "pos_operatorio", label: "Adquirida em pós-operatório" },
      { value: "outra", label: "Outra", detail: originKey && !["congenita", "acidente_trabalho", "acidente_comum", "doenca_comum", "pos_operatorio"].includes(originKey) ? toPresentationText(originKey) : "" }
    ], [originKey]);
    const identityMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Nome completo", value: payload.identity && payload.identity.workerName ? payload.identity.workerName : "" },
      { label: "CPF", value: payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : "" },
      { label: "Data de nascimento", value: payload.identity && payload.identity.workerBirthDate ? formatDateForReport(payload.identity.workerBirthDate) : "" },
      { label: "Data da avaliação", value: payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "" },
      { label: "Profissional emitente", value: payload.identity && payload.identity.examiner ? payload.identity.examiner : "" },
      { label: "Conselho / registro", value: payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : "" },
      ...(specialtyText ? [{ label: "Especialidade", value: specialtyText }] : [])
    ]);
    const diagnosisMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Diagnóstico principal", value: diagnosis.principal },
      { label: "CID", value: diagnosis.cid },
      { label: "Diagnósticos associados", value: diagnosis.associated },
      { label: "Data de início / evolução", value: diagnosis.evolution },
      { label: "Caráter de longo prazo", value: diagnosis.nature }
    ], "wide");
    const attachmentSheets = buildSystemAttachmentPrintSheetsHtml(attachments);
    const hasPdfAttachment = attachments.some((attachment) => attachment.previewKind === "pdf");
    const printDelay = hasPdfAttachment ? 1400 : (attachments.length ? 900 : 420);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador de Deficiência</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    html, body { margin: 0; padding: 0; background: #e8eef4; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #163247; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bundle-shell { width: 190mm; margin: 0 auto; padding: 12px 0 18px; display: grid; gap: 10px; }
    .print-page { width: 190mm; box-sizing: border-box; background: #ffffff; box-shadow: 0 14px 30px rgba(16, 37, 58, 0.12); border: 1px solid rgba(19, 49, 74, 0.08); border-radius: 18px; padding: 9mm 10mm 8mm; display: grid; align-content: start; gap: 6px; }
    .report-page { page-break-after: auto; break-after: auto; }
    .attachment-page { page-break-before: always; break-before: page; padding: 4mm; }
    .report-header { display: grid; gap: 4px; padding-bottom: 6px; border-bottom: 1.5px solid #0c6b9e; text-align: center; justify-items: center; }
    .header-copy { width: 100%; display: grid; gap: 4px; justify-items: center; }
    .header-copy h1 { margin: 0; font-size: 1.16rem; letter-spacing: 0.03em; text-transform: uppercase; color: #102d43; text-align: center; }
    .header-copy p { margin: 0; line-height: 1.35; color: #496375; font-size: 0.82rem; text-align: center; max-width: 150mm; }
    .header-copy small { color: #678196; font-size: 0.71rem; line-height: 1.32; text-align: center; max-width: 164mm; }
    .section-card { padding: 6px 0 7px; border: 0; border-top: 1px solid rgba(16, 45, 67, 0.12); background: transparent; display: grid; gap: 5px; page-break-inside: avoid; break-inside: avoid; }
    .section-card h2 { margin: 0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0c6b9e; }
    .section-card p { margin: 0; line-height: 1.42; font-size: 0.84rem; color: #17344a; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
    .meta-grid.wide { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .meta-item { min-height: 52px; padding: 8px 9px; border-radius: 10px; background: #f8fbfd; border: 1px solid rgba(16, 45, 67, 0.07); display: grid; align-content: start; gap: 3px; page-break-inside: avoid; break-inside: avoid; }
    .meta-item span { font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.07em; color: #678196; }
    .meta-item strong { font-size: 0.81rem; line-height: 1.3; color: #163247; }
    .check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
    .check-item { padding: 8px 9px; border-radius: 10px; border: 1px solid rgba(16, 45, 67, 0.08); background: #fbfdff; display: grid; grid-template-columns: 15px 1fr; gap: 8px; align-items: start; page-break-inside: avoid; break-inside: avoid; }
    .check-item .box { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid rgba(16, 45, 67, 0.35); background: #ffffff; position: relative; box-sizing: border-box; margin-top: 2px; }
    .check-item.checked { border-color: rgba(12, 107, 158, 0.24); background: #f4fbff; }
    .check-item.checked .box { border-color: #0c6b9e; background: #0c6b9e; }
    .check-item.checked .box::after { content: ""; position: absolute; inset: 3px; border-radius: 2px; background: #ffffff; }
    .check-item strong { display: block; font-size: 0.8rem; color: #153247; }
    .check-item span { display: block; margin-top: 2px; font-size: 0.73rem; line-height: 1.32; color: #60798d; }
    .dual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; page-break-inside: avoid; break-inside: avoid; }
    .signature-block { min-height: 92px; padding: 8px 9px; border-radius: 10px; border: 1px solid rgba(16, 45, 67, 0.08); background: #fbfdff; display: grid; align-content: space-between; gap: 12px; }
    .signature-block strong { font-size: 0.81rem; color: #163247; }
    .signature-block p { margin: 0; font-size: 0.77rem; line-height: 1.32; }
    .signature-line { display: block; padding-top: 12px; border-top: 1px solid rgba(16, 45, 67, 0.18); font-size: 0.73rem; color: #678196; }
    .attachment-title { margin: 0; padding: 0 0 3px 2px; color: #60798d; font-size: 0.71rem; line-height: 1.28; }
    .attachment-preview { width: 100%; background: #ffffff; overflow: hidden; min-height: 265mm; }
    .attachment-image { display: block; width: 100%; height: auto; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 265mm; border: 0; display: block; background: #ffffff; }
    .attachment-fallback { padding: 8px 10px; border-top: 1px solid rgba(16, 45, 67, 0.1); color: #60798d; font-size: 0.74rem; line-height: 1.34; }
    @media print {
      body { background: #ffffff; }
      .bundle-shell { width: auto; padding: 0; gap: 0; }
      .print-page { width: auto; box-shadow: none; border: 0; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="print-page report-page">
      <header class="report-header">
        <div class="header-copy">
          <h1>Laudo Caracterizador de Deficiência</h1>
          <p>Documento técnico-ocupacional estruturado para análise clínico-funcional e caracterização de pessoa com deficiência.</p>
          <small>Base legal considerada: Lei nº 13.146/2015, Lei nº 8.213/1991, Decreto nº 3.298/1999 e normas específicas aplicáveis ao tipo de deficiência analisado.</small>
        </div>
      </header>

      ${buildSystemLaudoSectionHtml("1. Identificação do avaliado", identityMarkup)}
      ${buildSystemLaudoSectionHtml("2. Origem da deficiência", originMarkup)}
      ${buildSystemLaudoSectionHtml("3. Diagnóstico / condição clínica", diagnosisMarkup)}
      ${buildSystemLaudoSectionHtml("4. Descrição detalhada das alterações", `<p>${escapeHtml(alterationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("5. Descrição das limitações funcionais", `<p>${escapeHtml(limitationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("6. Tipo de deficiência / enquadramento técnico", typeMarkup)}
      ${buildSystemLaudoSectionHtml("7. Fundamentação técnica", `<p>${escapeHtml(foundationText)}</p>`)}
      ${buildSystemLaudoSectionHtml("8. Ciência e autorização do avaliado", `<p>${escapeHtml(scienceText)}</p>`)}
      ${buildSystemLaudoSectionHtml("9. Assinatura do profissional", `
        <div class="dual-grid">
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examiner ? payload.identity.examiner : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : ""))}</p>
              ${specialtyText ? `<p>${escapeHtml(specialtyText)}</p>` : ""}
            </div>
            <span class="signature-line">Assinatura / carimbo profissional</span>
          </div>
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerName ? payload.identity.workerName : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : ""))}</p>
              <p>Data: ${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : ""))}</p>
            </div>
            <span class="signature-line">Assinatura do avaliado</span>
          </div>
        </div>
      `)}
    </section>

    ${attachmentSheets}
  </div>
  ${buildPrintBundleScript(printDelay)}
</body>
</html>`;
  }

  function buildSystemAttachmentPrintSheetsHtml(attachments = []) {
    return attachments.map((attachment, index) => {
      if (attachment.previewKind === "image") {
        return `
          <section class="print-page attachment-page">
            <p class="attachment-title">Anexo ${index + 1} - ${escapeHtml(toPresentationText(attachment.name))}</p>
            <div class="attachment-preview">
              <img class="attachment-image" src="${escapeHtml(attachment.source)}" alt="${escapeHtml(toPresentationText(attachment.name))}">
            </div>
          </section>
        `;
      }

      if (attachment.previewKind === "pdf") {
        return `
          <section class="print-page attachment-page">
            <p class="attachment-title">Anexo ${index + 1} - ${escapeHtml(toPresentationText(attachment.name))}</p>
            <div class="attachment-preview">
              <embed class="attachment-pdf" src="${escapeHtml(`${attachment.source}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`)}" type="application/pdf">
            </div>
            <p class="attachment-fallback">Se o navegador limitar a renderização integral deste PDF, utilize o arquivo original para impressão complementar do anexo.</p>
          </section>
        `;
      }

      return `
        <section class="print-page attachment-page">
          <p class="attachment-title">Anexo ${index + 1} - ${escapeHtml(toPresentationText(attachment.name))}</p>
          <div class="attachment-fallback">Este formato de arquivo não possui pré-visualização automática no navegador. Mantenha o documento original disponível para consulta e impressão complementar.</div>
        </section>
      `;
    }).join("");
  }

  function buildReportFileKey(file) {
    if (!file) {
      return "";
    }

    return [
      file.name || "",
      Number(file.size || 0),
      file.type || "",
      Number(file.lastModified || 0)
    ].join("::");
  }

  function collectAudioModuleFiles() {
    if (state.activeModule !== "auditiva" || !refs.audioFile || !refs.audioFile.files || !refs.audioFile.files[0]) {
      return [];
    }

    return [refs.audioFile.files[0]];
  }

  function collectPrintPackageEntries() {
    const entries = [
      ...collectExternalReportFiles().map((file) => ({ file, origin: "external" })),
      ...collectAudioModuleFiles().map((file) => ({ file, origin: "audio-module" }))
    ];
    const seen = new Set();

    return entries.filter((entry) => {
      const key = buildReportFileKey(entry.file);
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function collectPrintPackageFiles() {
    return collectPrintPackageEntries().map((entry) => entry.file);
  }

  async function handleAudioFileUpload(event) {
    const file = event.target.files && event.target.files[0];

    try {
      if (!file) {
        refs.audioUploadStatus.textContent = "\u00c9 poss\u00edvel importar arquivo estruturado em CSV, TXT, JSON ou PDF textual para preenchimento autom\u00e1tico.";
        return;
      }

      if (/\.(png|jpg|jpeg)$/i.test(file.name)) {
        refs.audioUploadStatus.textContent = `Arquivo ${file.name} anexado. Para preenchimento autom\u00e1tico, use CSV, TXT, JSON, PDF textual ou cole o texto da audiometria. Esse mesmo arquivo ser\u00e1 reutilizado no pacote final do laudo.`;
        return;
      }

      try {
        const parsed = await parseAudiometryFile(file);
        fillAudiometryFields(parsed);
        refs.audioUploadStatus.textContent = `Arquivo ${file.name} importado com sucesso para os campos de OD e OE. Esse mesmo arquivo ser\u00e1 reutilizado no pacote final do laudo.`;
      } catch (error) {
        refs.audioUploadStatus.textContent = /\.pdf$/i.test(file.name)
          ? `Arquivo ${file.name} anexado, mas a extra\u00e7\u00e3o autom\u00e1tica n\u00e3o conseguiu reconhecer o texto do PDF. Se for PDF escaneado, revise os campos manualmente ou utilize o texto colado. Esse mesmo arquivo ser\u00e1 reutilizado no pacote final do laudo.`
          : `Arquivo ${file.name} anexado, mas a importa\u00e7\u00e3o autom\u00e1tica n\u00e3o foi reconhecida. Revise e preencha manualmente os campos. Esse mesmo arquivo ser\u00e1 reutilizado no pacote final do laudo.`;
      }
    } finally {
      updateExternalFilesUI();
    }
  }

  function buildCharacterizationReport(payload) {
    const attachments = collectPrintPackageFiles();
    const reportSections = [
      "Ap\u00f3s an\u00e1lise t\u00e9cnico-funcional estruturada dos achados cl\u00ednicos, dados objetivos e repercuss\u00f5es ocupacionais informadas, conclui-se pela presen\u00e7a de elementos compat\u00edveis com a caracteriza\u00e7\u00e3o de pessoa com defici\u00eancia para fins ocupacionais.",
      `Descri\u00e7\u00e3o cl\u00ednico-funcional: ${toPresentationText(payload.description || "")}`,
      `Limita\u00e7\u00f5es funcionais e laborais: ${toPresentationText(payload.limitations || "")}`,
      `Conclus\u00e3o t\u00e9cnica: ${toPresentationText(payload.message || "")}`
    ];

    if (payload.supportNote) {
      reportSections.push(`Observa\u00e7\u00f5es t\u00e9cnicas e documenta\u00e7\u00e3o complementar: ${toPresentationText(payload.supportNote, true)}`);
    }

    if (attachments.length) {
      reportSections.push(`Documentos externos vinculados ao caso: ${attachments.map((file) => toPresentationText(file.name)).join(", ")}.`);
    }

    return reportSections.join("\n\n");
  }

  function updateExternalFilesUI() {
    if (!refs.reportExternalFilesStatus || !refs.reportExternalFilesList) {
      return;
    }

    const fileEntries = collectPrintPackageEntries();
    refs.reportExternalFilesList.innerHTML = "";

    if (!fileEntries.length) {
      refs.reportExternalFilesStatus.textContent = "Nenhum documento anexado no momento. O anexo \u00e9 opcional.";
      const emptyState = document.createElement("div");
      emptyState.className = "attachment-empty";
      emptyState.textContent = "Se desejar, anexe laudos externos ou exames complementares para compor o pacote final de impress\u00e3o. Na defici\u00eancia auditiva, o arquivo enviado no m\u00f3dulo tamb\u00e9m \u00e9 reaproveitado automaticamente.";
      refs.reportExternalFilesList.appendChild(emptyState);
      return;
    }

    const hasAudioModuleFile = fileEntries.some((entry) => entry.origin === "audio-module");
    refs.reportExternalFilesStatus.textContent = `${fileEntries.length} documento(s) pronto(s) para compor o pacote final de impress\u00e3o.${hasAudioModuleFile ? " A audiometria enviada no m\u00f3dulo auditivo ser\u00e1 reutilizada automaticamente." : ""}`;

    fileEntries.forEach((entry, index) => {
      const { file, origin } = entry;
      const item = document.createElement("article");
      item.className = "attachment-item";

      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${toPresentationText(file.name)}`;

      const detail = document.createElement("span");
      const fileType = file.type ? file.type : inferMimeTypeFromName(file.name);
      const originLabel = origin === "audio-module"
        ? "Audiometria aproveitada automaticamente do m\u00f3dulo auditivo"
        : "Documento complementar anexado manualmente";
      detail.textContent = `${describeAttachmentKind(fileType)} - ${formatFileSize(file.size)} - ${originLabel}`;

      item.appendChild(title);
      item.appendChild(detail);
      refs.reportExternalFilesList.appendChild(item);
    });
  }

  async function handlePdfDownload() {
    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final s\u00f3 pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const printFiles = collectPrintPackageFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avalia\u00e7\u00e3o");
    if (!identity.examiner) missing.push("profissional respons\u00e1vel");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigat\u00f3rios para emiss\u00e3o do laudo: ${missing.join(", ")}.`);
      return;
    }

    try {
      const attachments = printFiles.length ? await buildAttachmentPayloads(printFiles) : [];
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura da janela de impress\u00e3o. Permita pop-ups desta p\u00e1gina e tente novamente.");
        return;
      }

      await incrementUsageCounter();
    } catch (error) {
      console.error(error);
      window.alert(`N\u00e3o foi poss\u00edvel preparar o pacote final de impress\u00e3o neste momento.${error && error.message ? `\n\nDetalhe t\u00e9cnico: ${toPresentationText(error.message)}` : ""}`);
    }
  }

  function buildSystemLaudoSpecialtyText(payload) {
    return toPresentationText(payload && payload.identity && payload.identity.examinerSpecialty
      ? payload.identity.examinerSpecialty
      : "");
  }

  function buildSystemLaudoPrintHtml(payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const diagnosis = buildSystemLaudoDiagnosisData(payload);
    const alterationsText = buildSystemLaudoDetailedChangesText(payload);
    const limitationsText = buildSystemLaudoFunctionalText(payload);
    const typeMarkup = buildSystemLaudoTypeMarkup(payload);
    const foundationText = buildSystemLaudoFoundationText(payload, diagnosis, alterationsText, limitationsText);
    const scienceText = buildSystemLaudoScienceText(payload);
    const originKey = payload.identity && payload.identity.origin ? payload.identity.origin : inferOriginFromCurrentCase();
    const specialtyText = buildSystemLaudoSpecialtyText(payload);
    const originMarkup = buildSystemCheckGridHtml([
      { value: "congenita", label: "CongÃªnita" },
      { value: "acidente_trabalho", label: "Acidente/doenÃ§a do trabalho" },
      { value: "acidente_comum", label: "Acidente comum" },
      { value: "doenca_comum", label: "DoenÃ§a comum" },
      { value: "pos_operatorio", label: "Adquirida em pÃ³s-operatÃ³rio" },
      { value: "outra", label: "Outra", detail: originKey && !["congenita", "acidente_trabalho", "acidente_comum", "doenca_comum", "pos_operatorio"].includes(originKey) ? toPresentationText(originKey) : "" }
    ], [originKey]);
    const identityMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Nome completo", value: payload.identity && payload.identity.workerName ? payload.identity.workerName : "" },
      { label: "CPF", value: payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : "" },
      { label: "Data de nascimento", value: payload.identity && payload.identity.workerBirthDate ? formatDateForReport(payload.identity.workerBirthDate) : "" },
      { label: "Data da avaliaÃ§Ã£o", value: payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "" },
      { label: "Profissional emitente", value: payload.identity && payload.identity.examiner ? payload.identity.examiner : "" },
      { label: "Conselho / registro", value: payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : "" },
      ...(specialtyText ? [{ label: "Especialidade", value: specialtyText }] : [])
    ]);
    const diagnosisMarkup = buildSystemLaudoMetaGridHtml([
      { label: "DiagnÃ³stico principal", value: diagnosis.principal },
      { label: "CID", value: diagnosis.cid },
      { label: "DiagnÃ³sticos associados", value: diagnosis.associated },
      { label: "Data de inÃ­cio / evoluÃ§Ã£o", value: diagnosis.evolution },
      { label: "CarÃ¡ter de longo prazo", value: diagnosis.nature }
    ], "wide");
    const attachmentSheets = buildSystemAttachmentPrintSheetsHtml(attachments);
    const hasPdfAttachment = attachments.some((attachment) => attachment.previewKind === "pdf");
    const printDelay = hasPdfAttachment ? 1400 : (attachments.length ? 900 : 420);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador de DeficiÃªncia</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    html, body { margin: 0; padding: 0; background: #e8eef4; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #163247; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bundle-shell { width: 190mm; margin: 0 auto; padding: 12px 0 18px; display: grid; gap: 10px; }
    .print-page { width: 190mm; box-sizing: border-box; background: #ffffff; box-shadow: 0 14px 30px rgba(16, 37, 58, 0.12); border: 1px solid rgba(19, 49, 74, 0.08); border-radius: 18px; padding: 9mm 10mm 8mm; display: grid; align-content: start; gap: 6px; }
    .report-page { page-break-after: auto; break-after: auto; }
    .attachment-page { page-break-before: always; break-before: page; padding: 4mm; }
    .report-header { display: grid; gap: 4px; padding-bottom: 6px; border-bottom: 1.5px solid #0c6b9e; text-align: center; justify-items: center; }
    .header-copy { width: 100%; display: grid; gap: 4px; justify-items: center; }
    .header-copy h1 { margin: 0; font-size: 1.16rem; letter-spacing: 0.03em; text-transform: uppercase; color: #102d43; text-align: center; }
    .header-copy p { margin: 0; line-height: 1.35; color: #496375; font-size: 0.82rem; text-align: center; max-width: 150mm; }
    .header-copy small { color: #678196; font-size: 0.71rem; line-height: 1.32; text-align: center; max-width: 164mm; }
    .section-card { padding: 6px 0 7px; border: 0; border-top: 1px solid rgba(16, 45, 67, 0.12); background: transparent; display: grid; gap: 5px; page-break-inside: avoid; break-inside: avoid; }
    .section-card h2 { margin: 0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0c6b9e; }
    .section-card p { margin: 0; line-height: 1.42; font-size: 0.84rem; color: #17344a; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
    .meta-grid.wide { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .meta-item { min-height: 52px; padding: 8px 9px; border-radius: 10px; background: #f8fbfd; border: 1px solid rgba(16, 45, 67, 0.07); display: grid; align-content: start; gap: 3px; page-break-inside: avoid; break-inside: avoid; }
    .meta-item span { font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.07em; color: #678196; }
    .meta-item strong { font-size: 0.81rem; line-height: 1.3; color: #163247; }
    .check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
    .check-item { padding: 8px 9px; border-radius: 10px; border: 1px solid rgba(16, 45, 67, 0.08); background: #fbfdff; display: grid; grid-template-columns: 15px 1fr; gap: 8px; align-items: start; page-break-inside: avoid; break-inside: avoid; }
    .check-item .box { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid rgba(16, 45, 67, 0.35); background: #ffffff; position: relative; box-sizing: border-box; margin-top: 2px; }
    .check-item.checked { border-color: rgba(12, 107, 158, 0.24); background: #f4fbff; }
    .check-item.checked .box { border-color: #0c6b9e; background: #0c6b9e; }
    .check-item.checked .box::after { content: ""; position: absolute; inset: 3px; border-radius: 2px; background: #ffffff; }
    .check-item strong { display: block; font-size: 0.8rem; color: #153247; }
    .check-item span { display: block; margin-top: 2px; font-size: 0.73rem; line-height: 1.32; color: #60798d; }
    .dual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; page-break-inside: avoid; break-inside: avoid; }
    .signature-block { min-height: 92px; padding: 8px 9px; border-radius: 10px; border: 1px solid rgba(16, 45, 67, 0.08); background: #fbfdff; display: grid; align-content: space-between; gap: 12px; }
    .signature-block strong { font-size: 0.81rem; color: #163247; }
    .signature-block p { margin: 0; font-size: 0.77rem; line-height: 1.32; }
    .signature-line { display: block; padding-top: 12px; border-top: 1px solid rgba(16, 45, 67, 0.18); font-size: 0.73rem; color: #678196; }
    .attachment-title { margin: 0; padding: 0 0 3px 2px; color: #60798d; font-size: 0.71rem; line-height: 1.28; }
    .attachment-preview { width: 100%; background: #ffffff; overflow: hidden; min-height: 265mm; }
    .attachment-image { display: block; width: 100%; height: auto; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 265mm; border: 0; display: block; background: #ffffff; }
    .attachment-fallback { padding: 8px 10px; border-top: 1px solid rgba(16, 45, 67, 0.1); color: #60798d; font-size: 0.74rem; line-height: 1.34; }
    @media print {
      body { background: #ffffff; }
      .bundle-shell { width: auto; padding: 0; gap: 0; }
      .print-page { width: auto; box-shadow: none; border: 0; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="print-page report-page">
      <header class="report-header">
        <div class="header-copy">
          <h1>Laudo Caracterizador de DeficiÃªncia</h1>
          <p>Documento tÃ©cnico-ocupacional estruturado para anÃ¡lise clÃ­nico-funcional e caracterizaÃ§Ã£o de pessoa com deficiÃªncia.</p>
          <small>Base legal considerada: Lei nÂº 13.146/2015, Lei nÂº 8.213/1991, Decreto nÂº 3.298/1999 e normas especÃ­ficas aplicÃ¡veis ao tipo de deficiÃªncia analisado.</small>
        </div>
      </header>

      ${buildSystemLaudoSectionHtml("1. IdentificaÃ§Ã£o do avaliado", identityMarkup)}
      ${buildSystemLaudoSectionHtml("2. Origem da deficiÃªncia", originMarkup)}
      ${buildSystemLaudoSectionHtml("3. DiagnÃ³stico / condiÃ§Ã£o clÃ­nica", diagnosisMarkup)}
      ${buildSystemLaudoSectionHtml("4. DescriÃ§Ã£o detalhada das alteraÃ§Ãµes", `<p>${escapeHtml(alterationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("5. DescriÃ§Ã£o das limitaÃ§Ãµes funcionais", `<p>${escapeHtml(limitationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("6. Tipo de deficiÃªncia / enquadramento tÃ©cnico", typeMarkup)}
      ${buildSystemLaudoSectionHtml("7. FundamentaÃ§Ã£o tÃ©cnica", `<p>${escapeHtml(foundationText)}</p>`)}
      ${buildSystemLaudoSectionHtml("8. CiÃªncia e autorizaÃ§Ã£o do avaliado", `<p>${escapeHtml(scienceText)}</p>`)}
      ${buildSystemLaudoSectionHtml("9. Assinatura do profissional", `
        <div class="dual-grid">
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examiner ? payload.identity.examiner : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : ""))}</p>
              ${specialtyText ? `<p>${escapeHtml(specialtyText)}</p>` : ""}
            </div>
            <span class="signature-line">Assinatura / carimbo profissional</span>
          </div>
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerName ? payload.identity.workerName : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : ""))}</p>
              <p>Data: ${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : ""))}</p>
            </div>
            <span class="signature-line">Assinatura do avaliado</span>
          </div>
        </div>
      `)}
    </section>

    ${attachmentSheets}
  </div>
  ${buildPrintBundleScript(printDelay)}
</body>
</html>`;
  }

  function buildSystemLaudoPrintHtml(payload = {}) {
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];
    const diagnosis = buildSystemLaudoDiagnosisData(payload);
    const alterationsText = buildSystemLaudoDetailedChangesText(payload);
    const limitationsText = buildSystemLaudoFunctionalText(payload);
    const typeMarkup = buildSystemLaudoTypeMarkup(payload);
    const foundationText = buildSystemLaudoFoundationText(payload, diagnosis, alterationsText, limitationsText);
    const scienceText = buildSystemLaudoScienceText(payload);
    const originKey = payload.identity && payload.identity.origin ? payload.identity.origin : inferOriginFromCurrentCase();
    const specialtyText = buildSystemLaudoSpecialtyText(payload);
    const originMarkup = buildSystemCheckGridHtml([
      { value: "congenita", label: "Congenita" },
      { value: "acidente_trabalho", label: "Acidente/doenca do trabalho" },
      { value: "acidente_comum", label: "Acidente comum" },
      { value: "doenca_comum", label: "Doenca comum" },
      { value: "pos_operatorio", label: "Adquirida em pos-operatorio" },
      { value: "outra", label: "Outra", detail: originKey && !["congenita", "acidente_trabalho", "acidente_comum", "doenca_comum", "pos_operatorio"].includes(originKey) ? toPresentationText(originKey) : "" }
    ], [originKey]);
    const identityMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Nome completo", value: payload.identity && payload.identity.workerName ? payload.identity.workerName : "" },
      { label: "CPF", value: payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : "" },
      { label: "Data de nascimento", value: payload.identity && payload.identity.workerBirthDate ? formatDateForReport(payload.identity.workerBirthDate) : "" },
      { label: "Data da avaliacao", value: payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : "" },
      { label: "Profissional emitente", value: payload.identity && payload.identity.examiner ? payload.identity.examiner : "" },
      { label: "Conselho / registro", value: payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : "" },
      ...(specialtyText ? [{ label: "Especialidade medica", value: specialtyText }] : [])
    ]);
    const diagnosisMarkup = buildSystemLaudoMetaGridHtml([
      { label: "Diagnostico principal", value: diagnosis.principal },
      { label: "CID", value: diagnosis.cid },
      { label: "Diagnosticos associados", value: diagnosis.associated },
      { label: "Data de inicio / evolucao", value: diagnosis.evolution },
      { label: "Carater de longo prazo", value: diagnosis.nature }
    ], "wide");
    const attachmentSheets = buildSystemAttachmentPrintSheetsHtml(attachments);
    const hasPdfAttachment = attachments.some((attachment) => attachment.previewKind === "pdf");
    const printDelay = hasPdfAttachment ? 1400 : (attachments.length ? 900 : 420);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laudo Caracterizador de Deficiencia</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    html, body { margin: 0; padding: 0; background: #e8eef4; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #163247; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bundle-shell { width: 190mm; margin: 0 auto; padding: 12px 0 18px; display: grid; gap: 10px; }
    .print-page { width: 190mm; box-sizing: border-box; background: #ffffff; box-shadow: 0 14px 30px rgba(16, 37, 58, 0.12); border: 1px solid rgba(19, 49, 74, 0.08); border-radius: 18px; padding: 9mm 10mm 8mm; display: grid; align-content: start; gap: 6px; }
    .report-page { page-break-after: auto; break-after: auto; }
    .attachment-page { page-break-before: always; break-before: page; padding: 4mm; }
    .report-header { display: grid; gap: 4px; padding-bottom: 6px; border-bottom: 1.5px solid #0c6b9e; text-align: center; justify-items: center; }
    .header-copy { width: 100%; display: grid; gap: 4px; justify-items: center; }
    .header-copy h1 { margin: 0; font-size: 1.16rem; letter-spacing: 0.03em; text-transform: uppercase; color: #102d43; text-align: center; }
    .header-copy p { margin: 0; line-height: 1.35; color: #496375; font-size: 0.82rem; text-align: center; max-width: 150mm; }
    .header-copy small { color: #678196; font-size: 0.71rem; line-height: 1.32rem; text-align: center; max-width: 164mm; }
    .section-card { padding: 6px 0 7px; border: 0; border-top: 1px solid rgba(16, 45, 67, 0.12); background: transparent; display: grid; gap: 5px; page-break-inside: avoid; break-inside: avoid; }
    .section-card h2 { margin: 0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0c6b9e; }
    .section-card p { margin: 0; line-height: 1.42; font-size: 0.84rem; color: #17344a; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
    .meta-grid.wide { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .meta-item { min-height: 52px; padding: 8px 9px; border-radius: 10px; background: #f8fbfd; border: 1px solid rgba(16, 45, 67, 0.07); display: grid; align-content: start; gap: 3px; page-break-inside: avoid; break-inside: avoid; }
    .meta-item span { font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.07em; color: #678196; }
    .meta-item strong { font-size: 0.81rem; line-height: 1.3; color: #163247; }
    .check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
    .check-item { padding: 8px 9px; border-radius: 10px; border: 1px solid rgba(16, 45, 67, 0.08); background: #fbfdff; display: grid; grid-template-columns: 15px 1fr; gap: 8px; align-items: start; page-break-inside: avoid; break-inside: avoid; }
    .check-item .box { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid rgba(16, 45, 67, 0.35); background: #ffffff; position: relative; box-sizing: border-box; margin-top: 2px; }
    .check-item.checked { border-color: rgba(12, 107, 158, 0.24); background: #f4fbff; }
    .check-item.checked .box { border-color: #0c6b9e; background: #0c6b9e; }
    .check-item.checked .box::after { content: ""; position: absolute; inset: 3px; border-radius: 2px; background: #ffffff; }
    .check-item strong { display: block; font-size: 0.8rem; color: #153247; }
    .check-item span { display: block; margin-top: 2px; font-size: 0.73rem; line-height: 1.32; color: #60798d; }
    .dual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; page-break-inside: avoid; break-inside: avoid; }
    .signature-block { min-height: 92px; padding: 8px 9px; border-radius: 10px; border: 1px solid rgba(16, 45, 67, 0.08); background: #fbfdff; display: grid; align-content: space-between; gap: 12px; }
    .signature-block strong { font-size: 0.81rem; color: #163247; }
    .signature-block p { margin: 0; font-size: 0.77rem; line-height: 1.32; }
    .signature-line { display: block; padding-top: 12px; border-top: 1px solid rgba(16, 45, 67, 0.18); font-size: 0.73rem; color: #678196; }
    .attachment-title { margin: 0; padding: 0 0 3px 2px; color: #60798d; font-size: 0.71rem; line-height: 1.28; }
    .attachment-preview { width: 100%; background: #ffffff; overflow: hidden; min-height: 265mm; }
    .attachment-image { display: block; width: 100%; height: auto; object-fit: contain; background: #ffffff; }
    .attachment-pdf { width: 100%; height: 265mm; border: 0; display: block; background: #ffffff; }
    .attachment-fallback { padding: 8px 10px; border-top: 1px solid rgba(16, 45, 67, 0.1); color: #60798d; font-size: 0.74rem; line-height: 1.34; }
    @media print {
      body { background: #ffffff; }
      .bundle-shell { width: auto; padding: 0; gap: 0; }
      .print-page { width: auto; box-shadow: none; border: 0; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="bundle-shell">
    <section class="print-page report-page">
      <header class="report-header">
        <div class="header-copy">
          <h1>Laudo Caracterizador de Deficiencia</h1>
          <p>Documento tecnico-ocupacional estruturado para analise clinico-funcional e caracterizacao de pessoa com deficiencia.</p>
          <small>Base legal considerada: Lei 13.146/2015, Lei 8.213/1991, Decreto 3.298/1999 e normas especificas aplicaveis ao tipo de deficiencia analisado.</small>
        </div>
      </header>

      ${buildSystemLaudoSectionHtml("1. Identificacao do avaliado", identityMarkup)}
      ${buildSystemLaudoSectionHtml("2. Origem da deficiencia", originMarkup)}
      ${buildSystemLaudoSectionHtml("3. Diagnostico / condicao clinica", diagnosisMarkup)}
      ${buildSystemLaudoSectionHtml("4. Descricao detalhada das alteracoes", `<p>${escapeHtml(alterationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("5. Descricao das limitacoes funcionais", `<p>${escapeHtml(limitationsText)}</p>`)}
      ${buildSystemLaudoSectionHtml("6. Tipo de deficiencia / enquadramento tecnico", typeMarkup)}
      ${buildSystemLaudoSectionHtml("7. Fundamentacao tecnica", `<p>${escapeHtml(foundationText)}</p>`)}
      ${buildSystemLaudoSectionHtml("8. Ciencia e autorizacao do avaliado", `<p>${escapeHtml(scienceText)}</p>`)}
      ${buildSystemLaudoSectionHtml("9. Assinatura do profissional", `
        <div class="dual-grid">
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examiner ? payload.identity.examiner : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.examinerRegistry ? payload.identity.examinerRegistry : ""))}</p>
              ${specialtyText ? `<p>${escapeHtml(specialtyText)}</p>` : ""}
            </div>
            <span class="signature-line">Assinatura / carimbo profissional</span>
          </div>
          <div class="signature-block">
            <div>
              <strong>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerName ? payload.identity.workerName : ""))}</strong>
              <p>${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.workerCpf ? payload.identity.workerCpf : ""))}</p>
              <p>Data: ${escapeHtml(normalizeLaudoValue(payload.identity && payload.identity.reportDate ? formatDateForReport(payload.identity.reportDate) : ""))}</p>
            </div>
            <span class="signature-line">Assinatura do avaliado</span>
          </div>
        </div>
      `)}
    </section>

    ${attachmentSheets}
  </div>
  ${buildPrintBundleScript(printDelay)}
</body>
</html>`;
  }

  function getVisualAcuitySeverityLevel(value) {
    const levels = {
      normal_20_40: 0,
      moderada_20_70: 1,
      baixa_20_200: 2,
      muito_baixa_20_400: 3,
      cegueira_20_400: 4,
      cegueira_menor_20_400: 5,
      sem_percepcao_util: 6
    };
    return levels[value] ?? -1;
  }

  function inferMonocularLateralityFromAcuity(acuityOD = valueOf("visualAcuityOD"), acuityOE = valueOf("visualAcuityOE")) {
    const od = getVisualAcuitySeverityLevel(acuityOD);
    const oe = getVisualAcuitySeverityLevel(acuityOE);
    if (od >= 4 && oe < 4) return "direita";
    if (oe >= 4 && od < 4) return "esquerda";
    return "";
  }

  function getEffectiveVisualCondition() {
    const selected = valueOf("visualPrimaryFinding");
    const acuityOD = valueOf("visualAcuityOD");
    const acuityOE = valueOf("visualAcuityOE");
    const od = getVisualAcuitySeverityLevel(acuityOD);
    const oe = getVisualAcuitySeverityLevel(acuityOE);
    const monocularByData = (od >= 4 && oe < 4) || (oe >= 4 && od < 4);

    if (monocularByData) {
      return "visao_monocular";
    }

    return selected;
  }

  function evaluateVisual() {
    const selectedCondition = valueOf("visualPrimaryFinding");
    const effectiveCondition = getEffectiveVisualCondition();
    const laterality = valueOf("visualLaterality") || inferMonocularLateralityFromAcuity();
    const permanent = valueOf("visualPermanent");
    const supportDocs = valueOf("visualSupportDocs");
    const impactGrade = valueOf("visualImpactGrade");
    const cid = normalizedText("visualCid");
    const acuityOD = valueOf("visualAcuityOD");
    const acuityOE = valueOf("visualAcuityOE");
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");
    const limitations = checkedLabels("visualMarker");
    const facts = [];

    if (selectedCondition || effectiveCondition) {
      const visualLabel = effectiveCondition === "visao_monocular" && selectedCondition !== "visao_monocular"
        ? "Visão monocular"
        : labelForSelectValue("visualPrimaryFinding");
      facts.push(`Achado visual principal: ${visualLabel || "Não informado"}`);
    }
    if (laterality) {
      facts.push(`Lateralidade: ${capitalize(laterality)}`);
    }
    if (impactGrade) {
      facts.push(`Impacto funcional visual: ${capitalize(impactGrade)}`);
    }

    if (!effectiveCondition || !permanent || !acuityOD || !acuityOE) {
      return reviewResult("Necessita avaliação complementar com base funcional e achados objetivos.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    if (effectiveCondition === "visao_monocular" && !laterality) {
      return reviewResult("Na visão monocular, informe ou permita inferir o lado acometido para manter a descrição técnica objetiva.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    if (permanent === "nao") {
      return ineligibleResult("Alteração visual sem caráter permanente não caracteriza deficiência conforme critérios técnicos.", facts, buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent));
    }

    const objectiveEligible = isVisualObjectiveEligible(effectiveCondition, acuityOD, acuityOE, fieldChanged, fieldExtent);
    const objectiveText = composeVisualObjectiveText(acuityOD, acuityOE, fieldChanged, fieldExtent);
    const visualLimitationsText = limitations.length ? joinList(limitations) : defaultVisualLimitations(effectiveCondition);

    if (!objectiveEligible) {
      return ineligibleResult(
        "Dados objetivos não caracterizam deficiência visual conforme critérios técnicos.",
        facts,
        fieldChanged === "sim" && !fieldExtent ? buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent) : ""
      );
    }

    const lateralityText = laterality
      ? (laterality === "direita" ? "olho direito" : laterality === "esquerda" ? "olho esquerdo" : laterality)
      : "não especificado";
    const descriptionCore = effectiveCondition === "visao_monocular"
      ? `visão monocular em ${lateralityText}, reconhecida por critério legal vigente, com ${objectiveText}`
      : objectiveText;

    return eligibleResult({
      message: effectiveCondition === "visao_monocular"
        ? "Enquadra como PCD por visão monocular com base objetiva compatível."
        : "Enquadra como PCD por alteração visual permanente com base objetiva compatível.",
      description: `Trabalhador com deficiência visual de caráter permanente, fundamentado em ${descriptionCore}. CID: ${formatCid(cid)}.`,
      limitations: `Apresenta limitações funcionais visuais caracterizadas por ${visualLimitationsText}.`,
      facts,
      supportNote: joinSupportNotes([
        buildVisualDocumentationNote(supportDocs, fieldChanged, fieldExtent),
        selectedCondition !== effectiveCondition && effectiveCondition === "visao_monocular"
          ? "Os dados objetivos informados foram compatíveis com visão monocular e o enquadramento foi tratado nesse fluxo para adequação técnica."
          : "",
        supportDocs === "nao" ? "O enquadramento foi concluído pelos dados objetivos informados; recomenda-se anexar laudo oftalmológico para lastro documental do caso." : "",
        !limitations.length ? "As limitações funcionais foram descritas a partir do padrão esperado para o quadro visual objetivo informado." : ""
      ])
    });
  }

  function isVisualObjectiveEligible(condition, acuityOD, acuityOE, fieldChanged, fieldExtent) {
    const od = getVisualAcuitySeverityLevel(acuityOD);
    const oe = getVisualAcuitySeverityLevel(acuityOE);
    const betterEye = Math.min(od, oe);
    const worseEye = Math.max(od, oe);

    if (condition === "cegueira_bilateral") {
      return betterEye >= 4;
    }
    if (condition === "baixa_visao_bilateral") {
      return betterEye >= 1;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60";
    }
    if (condition === "visao_monocular") {
      return worseEye >= 4;
    }
    return betterEye >= 1 || (fieldChanged === "sim" && fieldExtent === "ate_60");
  }

  function buildSystemVisualDiagnosisLabel() {
    const condition = getEffectiveVisualCondition();
    if (condition === "visao_monocular") {
      return "Visão monocular";
    }
    return `Deficiência visual por ${lowerFirstPresentation(labelForSelectValue("visualPrimaryFinding") || "alteração visual permanente")}`;
  }

  function buildOfficialVisualSummary() {
    const condition = getEffectiveVisualCondition();
    const acuityOD = toPresentationText(labelForSelectValue("visualAcuityOD"));
    const acuityOE = toPresentationText(labelForSelectValue("visualAcuityOE"));
    const fieldChanged = valueOf("visualFieldChanged");
    const fieldExtent = valueOf("visualFieldExtent");
    const laterality = valueOf("visualLaterality") || inferMonocularLateralityFromAcuity();

    if (condition === "visao_monocular") {
      const side = laterality === "direita"
        ? "no olho direito"
        : laterality === "esquerda"
          ? "no olho esquerdo"
          : "";
      return `visão monocular${side ? ` ${side}` : ""}, com acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE`;
    }
    if (condition === "campo_visual_reduzido") {
      return fieldChanged === "sim" && fieldExtent === "ate_60"
        ? "campo visual binocular igual ou menor que 60°"
        : "restrição relevante de campo visual";
    }
    return `acuidade visual de ${acuityOD} em OD e ${acuityOE} em OE${fieldChanged === "sim" ? ", associada a alteração de campo visual" : ""}`;
  }

  function functionalDegreeText(value) {
    if (value === "moderado") {
      return "moderada";
    }
    return value;
  }

  function getDefaultPlanCatalog() {
    return [
      {
        id: "individual_25",
        label: "Médico 10 Documentos",
        audience: "Médico",
        priceCents: 39700,
        months: 12,
        laudoLimit: 10,
        description: "Pacote de entrada para emissão eventual, com cobrança por consumo e créditos unitários."
      },
      {
        id: "individual_80",
        label: "Médico 25 Documentos",
        audience: "Médico",
        priceCents: 89700,
        months: 12,
        laudoLimit: 25,
        description: "Faixa intermediária para prática recorrente, com melhor custo por documento."
      },
      {
        id: "individual_180",
        label: "Médico 50 Documentos",
        audience: "Médico",
        priceCents: 149700,
        months: 12,
        laudoLimit: 50,
        description: "Pacote ampliado para maior volume de emissão médica, sem modelo de mensalidade."
      },
      {
        id: "empresarial_120",
        label: "Empresarial 3 Meses",
        audience: "Empresa",
        priceCents: 199700,
        months: 3,
        laudoLimit: null,
        description: "Dashboard administrativo para empresas com gestao de medicos vinculados, indicadores e controle corporativo."
      },
      {
        id: "empresarial_250",
        label: "Empresarial 6 Meses",
        audience: "Empresa",
        priceCents: 349700,
        months: 6,
        laudoLimit: null,
        description: "Dashboard administrativo para empresas com gestao de medicos vinculados, indicadores e controle corporativo."
      },
      {
        id: "empresarial_800",
        label: "Empresarial 12 Meses",
        audience: "Empresa",
        priceCents: 649700,
        months: 12,
        laudoLimit: null,
        description: "Dashboard administrativo para empresas com gestao de medicos vinculados, indicadores e controle corporativo."
      }
    ];
  }

  function getDefaultPlanCatalog() {
    return [
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
    ].map((plan, index) => normalizeClientPlanRecord(plan, index));
  }

  function normalizeClientPlanAudienceKey(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (["doctor", "medico", "médico", "individual"].includes(normalized)) {
      return "doctor";
    }
    return "company";
  }

  function normalizeClientPlanBillingModel(value) {
    return String(value || "").trim().toLowerCase() === "subscription" ? "subscription" : "one_time";
  }

  function normalizeClientPlanStatus(value) {
    return String(value || "").trim().toLowerCase() === "inactive" ? "inactive" : "active";
  }

  function normalizeClientPlanQuotaPeriod(value, billingModel, laudoLimit) {
    if (laudoLimit === null || laudoLimit === undefined || laudoLimit === "") {
      return "none";
    }
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "monthly") return "monthly";
    if (normalized === "contract") return "contract";
    return normalizeClientPlanBillingModel(billingModel) === "subscription" ? "monthly" : "contract";
  }

  function buildClientPlanSlug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 64);
  }

  function normalizeClientPlanRecord(plan = {}, index = 0) {
    const audienceKey = normalizeClientPlanAudienceKey(plan.audienceKey || plan.audience);
    const billingModel = normalizeClientPlanBillingModel(plan.billingModel);
    const hasLaudoLimit = !(plan.laudoLimit === null || plan.laudoLimit === undefined || plan.laudoLimit === "");
    const laudoLimit = hasLaudoLimit ? Math.max(0, Number(plan.laudoLimit || 0)) : null;
    return {
      id: buildClientPlanSlug(plan.id || `${audienceKey}_${plan.label || index + 1}`) || `plan_${index + 1}`,
      label: fixBrokenText(plan.label || `Plano ${index + 1}`),
      audience: fixBrokenText(plan.audience || (audienceKey === "doctor" ? "Medico" : "Empresa")),
      audienceKey,
      priceCents: Math.max(0, Math.round(Number(plan.priceCents || 0))),
      months: Math.max(1, Math.round(Number(plan.months || 1))),
      laudoLimit,
      description: fixBrokenText(plan.description || ""),
      billingModel,
      quotaPeriod: normalizeClientPlanQuotaPeriod(plan.quotaPeriod, billingModel, laudoLimit),
      status: normalizeClientPlanStatus(plan.status),
      sortOrder: Number.isFinite(Number(plan.sortOrder)) ? Number(plan.sortOrder) : (index * 10)
    };
  }

  function normalizeClientPlanCatalog(plans = [], options = {}) {
    const source = Array.isArray(plans) && plans.length ? plans : getDefaultPlanCatalog();
    const includeInactive = Boolean(options.includeInactive);
    const seen = new Set();
    return source
      .map((plan, index) => normalizeClientPlanRecord(plan, index))
      .filter((plan) => {
        if (!plan || !plan.id || seen.has(plan.id)) {
          return false;
        }
        seen.add(plan.id);
        return includeInactive || plan.status === "active";
      })
      .sort((left, right) => {
        const leftOrder = Number(left.sortOrder || 0);
        const rightOrder = Number(right.sortOrder || 0);
        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }
        return String(left.label || "").localeCompare(String(right.label || ""), "pt-BR");
      });
  }

  function getStoredPlanCatalog(options = {}) {
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog();
    return normalizeClientPlanCatalog(catalog, options);
  }

  function isActiveClientPlan(plan) {
    return normalizeClientPlanStatus(plan && plan.status) === "active";
  }

  function formatPlanBillingModelLabel(billingModel) {
    return normalizeClientPlanBillingModel(billingModel) === "subscription"
      ? "Assinatura recorrente"
      : "Pagamento avulso";
  }

  function formatPlanQuotaPeriodLabel(plan = {}) {
    const quotaPeriod = normalizeClientPlanQuotaPeriod(plan.quotaPeriod, plan.billingModel, plan.laudoLimit);
    if (quotaPeriod === "monthly") {
      return "Franquia renovada mensalmente";
    }
    if (quotaPeriod === "contract") {
      return "Franquia valida por ciclo contratado";
    }
    return "Sem franquia de laudos";
  }

  function renderPlanCatalogCards(catalog = []) {
    const plans = Array.isArray(catalog) && catalog.length ? catalog : getDefaultPlanCatalog();
    const registerGrid = document.getElementById("registerPlanGrid");
    const adminGrid = document.getElementById("adminPlanGrid");
    const publicGrid = document.getElementById("publicPlanGrid");

    const cardsHtml = plans.map((plan) => {
      const audience = fixBrokenText(plan.audience || "Plano");
      const label = fixBrokenText(plan.label || "");
      const description = fixBrokenText(plan.description || "");
      const months = Number(plan.months || 0);
      const laudoLimit = Number(plan.laudoLimit || 0);
      const priceCents = Number(plan.priceCents || 0);
      const pricePerLaudoCents = laudoLimit ? Math.round(priceCents / laudoLimit) : 0;
      const featuredClass = plan.id === "empresarial_250" ? " is-featured" : "";

      return `
        <article class="plan-card${featuredClass}">
          <span class="plan-card-badge">${escapeHtml(audience)}</span>
          <strong>${escapeHtml(label)}</strong>
          <div class="plan-card-price">${escapeHtml(formatCurrencyCents(priceCents))}</div>
          <p class="plan-card-description">${escapeHtml(description)}</p>
          <div class="plan-card-meta">
            <span>${escapeHtml(`${laudoLimit} laudos incluidos no ciclo`)}</span>
            <span>${escapeHtml(`${months} ${months === 1 ? "mes" : "meses"} de validade`)}</span>
            <span class="plan-card-highlight">${escapeHtml(`${formatCurrencyCents(pricePerLaudoCents)} por laudo na faixa`)}</span>
          </div>
        </article>
      `;
    }).join("");

    if (registerGrid) {
      registerGrid.innerHTML = cardsHtml;
    }

    if (adminGrid) {
      adminGrid.innerHTML = cardsHtml;
    }

    if (publicGrid) {
      publicGrid.innerHTML = cardsHtml;
    }
  }

  function initAuth() {
    const heroLoginButton = document.getElementById("heroLoginButton");
    const heroRegisterButton = document.getElementById("heroRegisterButton");
    const focusAuthField = (field) => {
      const panel = document.getElementById("authPanel");
      if (panel && typeof panel.scrollIntoView === "function") {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (field && typeof field.focus === "function") {
        window.requestAnimationFrame(() => field.focus());
      }
    };

    if (refs.loginForm) refs.loginForm.addEventListener("submit", handleLoginSubmit);
    if (refs.registerForm) refs.registerForm.addEventListener("submit", handlePublicRegistration);
    if (refs.setupForm) refs.setupForm.addEventListener("submit", handleSetupSubmit);
    if (refs.showSetupButton) refs.showSetupButton.addEventListener("click", () => {
      setAuthAccessType("admin", { preserveMode: true });
      setAuthMode("setup");
      setAuthStatus("");
      focusAuthField(refs.setupCompany);
    });
    if (refs.showRegisterButton) refs.showRegisterButton.addEventListener("click", () => {
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("register");
      setAuthStatus("Escolha o pacote de laudos e conclua o cadastro da empresa.");
      focusAuthField(refs.registerCompany);
    });
    if (refs.showLoginButton) refs.showLoginButton.addEventListener("click", () => {
      setAuthMode("login");
      setAuthStatus("");
      focusAuthField(refs.loginUsername);
    });
    if (refs.showLoginFromRegisterButton) refs.showLoginFromRegisterButton.addEventListener("click", () => {
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("");
      focusAuthField(refs.loginUsername);
    });
    if (heroLoginButton) heroLoginButton.addEventListener("click", () => {
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("");
      focusAuthField(refs.loginUsername);
    });
    if (heroRegisterButton) heroRegisterButton.addEventListener("click", () => {
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("register");
      setAuthStatus("Escolha o pacote de laudos e conclua o cadastro da empresa.");
      focusAuthField(refs.registerCompany);
    });
    if (refs.logoutButton) refs.logoutButton.addEventListener("click", handleLogout);
    if (refs.adminLogoutButton) refs.adminLogoutButton.addEventListener("click", handleLogout);
    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        setAuthAccessType("buyer");
        setAuthMode("login");
        setAuthStatus("Acesse com a conta da empresa ou crie uma nova assinatura.");
      });
    }
    if (refs.accessAdminButton) {
      refs.accessAdminButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        setAuthAccessType("admin");
        setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
        setAuthStatus(state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais do administrador da plataforma."
          : "Configure agora o administrador principal da plataforma.");
      });
    }
    if (refs.reportWorkerCpf) refs.reportWorkerCpf.addEventListener("input", handleCpfMaskInput);

    loadAuthBootstrap();
  }

  function normalizeCommercialJourney(value) {
    if (value === "doctor") {
      return "doctor";
    }
    if (value === "demo") {
      return "demo";
    }
    return "company";
  }

  function normalizeAccountType(value) {
    if (value === "doctor") {
      return "doctor";
    }
    if (value === "demo") {
      return "demo";
    }
    return "company";
  }

  function getCommercialJourney() {
    const field = document.getElementById("registerJourneyType");
    const journey = normalizeCommercialJourney(field && field.value ? field.value : state.commercialJourney);
    state.commercialJourney = journey;
    if (field) {
      field.value = journey;
    }
    return journey;
  }

  function resolveJourneyPlan(journey, catalog = []) {
    const plans = Array.isArray(catalog) && catalog.length ? catalog : (Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog());
    if (journey === "doctor") {
      return plans.find((plan) => String(plan.id || "").startsWith("individual_80"))
        || plans.find((plan) => String(plan.id || "").startsWith("individual_"))
        || plans[0]
        || null;
    }
    return plans.find((plan) => String(plan.id || "").startsWith("empresarial_250"))
      || plans.find((plan) => String(plan.id || "").startsWith("empresarial_"))
      || plans[0]
      || null;
  }

  function buildRegisterJourneyCard(plan, journey) {
    if (!plan) {
      return "";
    }
    const label = journey === "doctor" ? "Plano Médico" : "Plano Empresa";
    const support = journey === "doctor"
      ? "Fluxo individual com validação de CRM e responsabilidade técnica obrigatória."
      : "Fluxo corporativo com operação interna e bloqueio de conclusão documental pela empresa.";
    return `
      <article class="plan-card ${journey === "doctor" ? "is-featured" : ""}">
        <span class="plan-card-badge">${escapeHtml(journey === "doctor" ? "Médico" : "Empresa")}</span>
        <strong>${escapeHtml(label)}</strong>
        <div class="plan-card-price">${escapeHtml(formatCurrencyCents(plan.priceCents || 0))}</div>
        <p class="plan-card-description">${escapeHtml(toPresentationText(plan.description || support))}</p>
        <div class="plan-card-meta">
          <span>${escapeHtml(`${Number(plan.months || 0)} ${Number(plan.months || 0) === 1 ? "mês" : "meses"} de vigência comercial`)}</span>
          <span>${escapeHtml(`${Number(plan.laudoLimit || 0)} registros previstos no ciclo contratado`)}</span>
        </div>
      </article>
    `;
  }

  function syncCommercialJourneyUI() {
    const journey = getCommercialJourney();
    const companyLabel = document.getElementById("registerCompanyLabel");
    const contactLabel = refs.registerContactName ? refs.registerContactName.closest("label").querySelector("span") : null;
    const journeyNote = document.getElementById("registerJourneyNote");
    const doctorFields = document.getElementById("doctorCredentialFields");
    const doctorResponsibilityCard = document.getElementById("doctorResponsibilityCard");
    const registerPlanGrid = document.getElementById("registerPlanGrid");
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog();
    const chosenPlan = resolveJourneyPlan(journey, catalog);

    if (companyLabel) {
      companyLabel.textContent = journey === "doctor" ? "Nome do médico" : "Empresa";
    }
    if (refs.registerCompany) {
      refs.registerCompany.placeholder = journey === "doctor" ? "Nome completo do médico" : "Razão social ou nome fantasia";
    }
    if (contactLabel) {
      contactLabel.textContent = journey === "doctor" ? "Consultório / nome de exibição" : "Responsável";
    }
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = journey === "doctor"
        ? "Nome do consultório ou identificação profissional"
        : "Nome do responsável pela conta";
    }
    if (refs.registerEmail) {
      refs.registerEmail.placeholder = journey === "doctor" ? "medico@dominio.com.br" : "contato@empresa.com.br";
    }
    if (refs.registerUsername) {
      refs.registerUsername.placeholder = journey === "doctor" ? "Usuário profissional do médico" : "Usuário principal da empresa";
    }
    if (journeyNote) {
      journeyNote.textContent = journey === "doctor"
        ? "Cadastro médico individual com validação obrigatória de CRM e responsabilidade técnica vinculada ao profissional autenticado."
        : "Cadastro empresarial para uso da plataforma como apoio técnico, sujeito às regras de uso e responsabilidade profissional.";
    }
    if (doctorFields) {
      doctorFields.classList.toggle("hidden", journey !== "doctor");
    }
    if (doctorResponsibilityCard) {
      doctorResponsibilityCard.classList.toggle("hidden", journey !== "doctor");
    }

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = chosenPlan
        ? `<option value="${escapeHtml(chosenPlan.id)}">${escapeHtml(journey === "doctor" ? "Plano Médico" : "Plano Empresa")}</option>`
        : "";
      if (chosenPlan) {
        refs.registerPlan.value = chosenPlan.id;
      }
    }

    if (registerPlanGrid) {
      registerPlanGrid.innerHTML = chosenPlan ? buildRegisterJourneyCard(chosenPlan, journey) : "";
    }
  }

  function renderPlanCatalogCards(catalog = []) {
    const plans = Array.isArray(catalog) && catalog.length ? catalog : getDefaultPlanCatalog();
    const adminGrid = document.getElementById("adminPlanGrid");

    syncCommercialJourneyUI();

    if (adminGrid) {
      adminGrid.innerHTML = plans.map((plan) => {
        const audience = fixBrokenText(plan.audience || "Plano");
        const label = fixBrokenText(plan.label || "");
        const description = fixBrokenText(plan.description || "");
        const months = Number(plan.months || 0);
        const laudoLimit = Number(plan.laudoLimit || 0);
        const priceCents = Number(plan.priceCents || 0);
        const featuredClass = String(plan.id || "").startsWith("empresarial_250") ? " is-featured" : "";

        return `
          <article class="plan-card${featuredClass}">
            <span class="plan-card-badge">${escapeHtml(audience)}</span>
            <strong>${escapeHtml(label)}</strong>
            <div class="plan-card-price">${escapeHtml(formatCurrencyCents(priceCents))}</div>
            <p class="plan-card-description">${escapeHtml(description)}</p>
            <div class="plan-card-meta">
              <span>${escapeHtml(`${laudoLimit} laudos no ciclo`)}</span>
              <span>${escapeHtml(`${months} ${months === 1 ? "mês" : "meses"} de vigência`)}</span>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  function populatePlanSelects() {
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length
      ? state.planCatalog
      : getDefaultPlanCatalog();

    if (refs.adminPlan) {
      refs.adminPlan.innerHTML = buildPlanOptionsHtml(refs.adminPlan.value || (catalog[0] ? catalog[0].id : ""), true);
      if (!refs.adminPlan.value && catalog[0]) {
        refs.adminPlan.value = catalog[0].id;
      }
    }

    renderPlanCatalogCards(catalog);
  }

  function openOperationalJourney(journey, focusField) {
    document.body.classList.remove("demo-mode");
    state.demoModeEnabled = false;
    state.authAccessTouched = true;
    state.commercialJourney = normalizeCommercialJourney(journey);
    setAuthAccessType("buyer", { preserveMode: true });
    setAuthMode("register");
    syncCommercialJourneyUI();
    setAuthStatus(state.commercialJourney === "doctor"
      ? "Plano médico selecionado. Informe os dados profissionais e valide o CRM para solicitar o acesso."
      : "Plano empresa selecionado. Revise os avisos legais e conclua o cadastro empresarial.");
    if (focusField) {
      focusField();
    }
  }

  function startDemoAccess() {
    document.body.classList.add("demo-mode");
    state.demoModeEnabled = true;
    state.commercialJourney = "demo";
    state.authProvider = "demo";

    applyAuthenticatedSession({
      id: `demo_${Date.now()}`,
      company: "Demonstração DaviCore Health",
      contactName: "Sessão de teste",
      email: "",
      username: "demo",
      role: "buyer",
      status: "active",
      paymentStatus: "approved",
      paymentDueAt: null,
      planId: "demo",
      planLabel: "Modo Demonstração",
      usageCount: 0,
      lastAccessAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: false,
      accountType: "demo",
      crmNumber: "",
      crmState: "",
      crmValidated: false,
      canAccess: true
    });

    if (refs.reportCompany && !refs.reportCompany.value) {
      refs.reportCompany.value = "Demonstração DaviCore Health";
    }
  }

  function initAuth() {
    const heroPlansButton = document.getElementById("heroPlansButton");
    const companyPlanButton = document.getElementById("companyPlanButton");
    const doctorPlanButton = document.getElementById("doctorPlanButton");
    const demoPlanButton = document.getElementById("demoPlanButton");
    const focusAuthField = (field) => {
      const panel = document.getElementById("authPanel");
      if (panel && typeof panel.scrollIntoView === "function") {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (field && typeof field.focus === "function") {
        window.requestAnimationFrame(() => field.focus());
      }
    };
    const focusRegister = () => focusAuthField(refs.registerCompany);

    state.commercialJourney = normalizeCommercialJourney(state.commercialJourney || "company");
    state.demoModeEnabled = false;

    if (refs.loginForm) refs.loginForm.addEventListener("submit", handleLoginSubmit);
    if (refs.registerForm) refs.registerForm.addEventListener("submit", handlePublicRegistration);
    if (refs.setupForm) refs.setupForm.addEventListener("submit", handleSetupSubmit);
    if (refs.showSetupButton) refs.showSetupButton.addEventListener("click", () => {
      document.body.classList.remove("demo-mode");
      state.demoModeEnabled = false;
      setAuthAccessType("admin", { preserveMode: true });
      setAuthMode("setup");
      setAuthStatus("");
      focusAuthField(refs.setupCompany);
    });
    if (refs.showRegisterButton) refs.showRegisterButton.addEventListener("click", () => openOperationalJourney("company", focusRegister));
    if (refs.showLoginButton) refs.showLoginButton.addEventListener("click", () => {
      document.body.classList.remove("demo-mode");
      state.demoModeEnabled = false;
      setAuthMode("login");
      setAuthStatus("");
      focusAuthField(refs.loginUsername);
    });
    if (refs.showLoginFromRegisterButton) refs.showLoginFromRegisterButton.addEventListener("click", () => {
      document.body.classList.remove("demo-mode");
      state.demoModeEnabled = false;
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("");
      focusAuthField(refs.loginUsername);
    });
    if (heroPlansButton) heroPlansButton.addEventListener("click", () => {
      const plans = document.getElementById("modernPlans");
      if (plans && typeof plans.scrollIntoView === "function") {
        plans.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    if (companyPlanButton) companyPlanButton.addEventListener("click", () => openOperationalJourney("company", focusRegister));
    if (doctorPlanButton) doctorPlanButton.addEventListener("click", () => openOperationalJourney("doctor", focusRegister));
    if (demoPlanButton) demoPlanButton.addEventListener("click", startDemoAccess);
    if (refs.logoutButton) refs.logoutButton.addEventListener("click", handleLogout);
    if (refs.adminLogoutButton) refs.adminLogoutButton.addEventListener("click", handleLogout);
    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        state.commercialJourney = "company";
        document.body.classList.remove("demo-mode");
        state.demoModeEnabled = false;
        setAuthAccessType("buyer");
        setAuthMode("login");
        syncCommercialJourneyUI();
        setAuthStatus("Acesse com a conta contratada ou escolha um plano para iniciar o cadastro.");
      });
    }
    if (refs.accessAdminButton) {
      refs.accessAdminButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        document.body.classList.remove("demo-mode");
        state.demoModeEnabled = false;
        setAuthAccessType("admin");
        setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
        setAuthStatus(state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais do administrador da plataforma."
          : "Configure agora o administrador principal da plataforma.");
      });
    }
    if (refs.reportWorkerCpf) refs.reportWorkerCpf.addEventListener("input", handleCpfMaskInput);

    loadAuthBootstrap();
  }

  function updateAuthEntryCopy() {
    const isAdmin = state.authAccessType === "admin";
    const isRegister = state.authMode === "register";
    const isSetup = state.authMode === "setup";
    const journey = getCommercialJourney();
    const providerLabel = state.authProvider === "local" ? "local" : "SaaS";

    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = isSetup
        ? "Configuração do administrador"
        : isRegister
          ? (journey === "doctor" ? "Cadastro médico" : "Cadastro empresarial")
          : (isAdmin ? `Acesso administrador ${providerLabel}` : `Acesso operacional ${providerLabel}`);
    }

    if (refs.authTitle) {
      refs.authTitle.textContent = isSetup
        ? "Configurar administrador da plataforma"
        : isRegister
          ? (journey === "doctor" ? "Solicitar acesso médico" : "Solicitar acesso empresarial")
          : (isAdmin ? "Entrar como administrador" : "Entrar na área operacional");
    }

    if (refs.authDescription) {
      refs.authDescription.textContent = isSetup
        ? "Fluxo exclusivo para a conta administradora que controla clientes, pagamentos, acessos e operação comercial."
        : isRegister
          ? (journey === "doctor"
            ? "Preencha os dados profissionais, valide o CRM e confirme a responsabilidade técnica para solicitar o acesso médico."
            : "Cadastre a empresa contratante, revise os avisos legais e siga para a liberação comercial do plano empresarial.")
          : (isAdmin
            ? "Entrada restrita ao controle administrativo da plataforma, clientes, planos, status e acompanhamento de uso."
            : "Empresas contratantes e médicos autenticados acessam por esta área operacional. A conclusão documental permanece vinculada ao médico habilitado.");
    }

    if (refs.loginSubmitButton) {
      refs.loginSubmitButton.textContent = isAdmin ? "Entrar no painel administrativo" : "Entrar na área operacional";
    }
    if (refs.showRegisterButton) {
      refs.showRegisterButton.classList.toggle("hidden", isAdmin || isRegister || isSetup);
    }
    if (refs.showSetupButton) {
      refs.showSetupButton.classList.toggle("hidden", !isAdmin || isSetup || (state.authBootstrap && state.authBootstrap.configured));
    }
    syncCommercialJourneyUI();
  }

  async function activateLocalAuthMode() {
    state.authProvider = "local";
    state.planCatalog = getDefaultPlanCatalog();
    populatePlanSelects();
    await ensureLocalDefaultAdmin();

    const users = readLocalUsers();
    const session = getLocalSessionUser();
    state.authBootstrap = {
      configured: users.some((item) => item.role === "admin"),
      mode: "local",
      plans: state.planCatalog
    };

    if (session && session.username) {
      applyAuthenticatedSession(session);
      return;
    }

    if (!state.authAccessTouched) {
      setAuthAccessType("buyer", { preserveMode: true });
    } else {
      updateAuthEntryCopy();
    }
    setAuthMode("login");
    syncCommercialJourneyUI();
    setAuthStatus("Modo local ativo. Use a área operacional para testes ou a área administrativa para controle interno.");
  }

  async function loadAuthBootstrap() {
    state.commercialJourney = normalizeCommercialJourney(state.commercialJourney || "company");

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    try {
      const bootstrap = await apiJson("/api/public/bootstrap");
      state.authProvider = "api";
      state.authBootstrap = bootstrap;
      state.planCatalog = Array.isArray(bootstrap.plans) ? bootstrap.plans : [];
      populatePlanSelects();

      const sessionResponse = await apiJson(AUTH_API.session);
      if (sessionResponse.authenticated && sessionResponse.user) {
        applyAuthenticatedSession(sessionResponse.user);
        if (sessionResponse.summary) {
          renderAdminDashboardSummary(sessionResponse.summary);
        }
        return;
      }

      if (!state.authAccessTouched) {
        setAuthAccessType("buyer", { preserveMode: true });
      } else {
        updateAuthEntryCopy();
      }
      setAuthMode(bootstrap.configured ? "login" : "setup");
      applyCheckoutQueryFeedback();
      syncCommercialJourneyUI();

      if (!window.location.search.includes("checkout=")) {
        setAuthStatus(bootstrap.configured
          ? "Leia os avisos legais, escolha o perfil correto e siga com login ou contratação."
          : "Configure o administrador principal para liberar a plataforma.");
      }
    } catch (error) {
      console.error(error);
      state.authProvider = "api";
      state.authBootstrap = { configured: true, mode: "api", plans: getDefaultPlanCatalog() };
      state.planCatalog = getDefaultPlanCatalog();
      populatePlanSelects();
      state.sessionUser = null;
      document.body.classList.remove("company-mode");
      document.body.classList.remove("demo-mode");
      if (refs.adminShell) refs.adminShell.classList.add("hidden");
      if (refs.appShell) refs.appShell.classList.add("hidden");
      if (refs.companyDashboard) refs.companyDashboard.classList.add("hidden");
      if (refs.authShell) refs.authShell.classList.remove("hidden");
      if (!state.authAccessTouched) {
        setAuthAccessType("buyer", { preserveMode: true });
      } else {
        updateAuthEntryCopy();
      }
      setAuthMode("login");
      syncCommercialJourneyUI();
      setAuthStatus("Nao foi possivel conectar ao servidor compartilhado. O fallback local automatico foi bloqueado nesta instalacao para evitar cadastros isolados por navegador.");
    }
  }

  function applyInterfaceCopyRefinements() {
    document.title = "DaviCore Health | Planos e acesso respons\u00e1vel";

    const setText = (selector, text) => {
      const element = document.querySelector(selector);
      if (element && element.textContent !== text) {
        element.textContent = text;
      }
    };

    setText("#authShell .auth-brand .eyebrow", "DaviCore Health");
    setText("#authShell .auth-brand h2", "Tecnologia para apoio \u00e0 caracteriza\u00e7\u00e3o de PCD com seguran\u00e7a e responsabilidade profissional");
    setText("#authShell .auth-brand p", "Sistema inteligente para apoio t\u00e9cnico na descri\u00e7\u00e3o funcional, desenvolvido para uso por profissionais de sa\u00fade e empresas.");
    setText("#accessBuyerButton strong", "Entrar na area operacional");
    setText("#accessBuyerButton span", "Empresas contratantes e medicos autenticados acessam por esta entrada.");
    setText("#accessAdminButton strong", "Entrar como administrador");
    setText("#accessAdminButton span", "Painel interno para clientes, pagamentos, acessos, bloqueios e configuracoes da plataforma.");
    setText("#showRegisterButton", "Solicitar contratacao");
    setText("#showLoginFromRegisterButton", "Voltar para entrar");
    syncCommercialJourneyUI();
  }

  function buildLocalUserRecord({
    company,
    companyCnpj = "",
    username,
    passwordHash,
    role,
    status,
    expiresAt,
    contactName = "",
    email = "",
    paymentStatus = "approved",
    paymentDueAt = null,
    planId = "individual_25",
    notes = "",
    usageCount = 0,
    lastAccessAt = null,
    accountType = "company",
    crmNumber = "",
    crmState = "",
    doctorCpf = "",
    doctorBirthDate = "",
    crmValidated = false,
    companyLogoDataUrl = "",
    linkedDoctors = [],
    activityLog = [],
    documentHistory = []
  }) {
    const now = new Date().toISOString();
    const plan = role === "admin" ? null : getPlanCatalogById(planId || "individual_25");
    return {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      company,
      companyCnpj: String(companyCnpj || "").replace(/\D/g, "").slice(0, 14),
      contactName,
      email,
      username,
      usernameKey: normalizeUserIdentifier(username),
      passwordHash,
      role,
      status: normalizeLocalStatus(status),
      expiresAt,
      paymentStatus: role === "admin" ? "approved" : normalizeLocalPaymentStatus(paymentStatus),
      paymentDueAt: role === "admin" ? null : paymentDueAt,
      paymentLastApprovedAt: role === "admin" || paymentStatus === "approved" ? now : null,
      planId: role === "admin" ? "internal" : (plan ? plan.id : "individual_25"),
      planLabel: role === "admin" ? "Administracao interna" : (plan ? plan.label : "Individual Essencial"),
      planPriceCents: role === "admin" ? 0 : Number(plan && plan.priceCents ? plan.priceCents : 0),
      billingCycleMonths: role === "admin" ? 0 : Number(plan && plan.months ? plan.months : 0),
      planLaudoLimit: role === "admin" ? null : Number(plan && plan.laudoLimit ? plan.laudoLimit : 0),
      usageCount: Number(usageCount || 0),
      lastAccessAt,
      notes,
      accountType: normalizeAccountType(accountType),
      crmNumber: String(crmNumber || "").replace(/\D/g, ""),
      crmState: String(crmState || "").toUpperCase(),
      doctorCpf: String(doctorCpf || "").replace(/\D/g, ""),
      doctorBirthDate: String(doctorBirthDate || ""),
      crmValidated: Boolean(crmValidated),
      companyLogoDataUrl: String(companyLogoDataUrl || ""),
      linkedDoctors: normalizeCompanySessionDoctors(linkedDoctors),
      activityLog: normalizeCompanySessionActivities(activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(documentHistory, Number(usageCount || 0)),
      createdAt: now,
      updatedAt: now
    };
  }

  function buildLocalSessionUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status,
      paymentStatus: user.paymentStatus || "approved",
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || null,
      planLabel: user.planLabel || "",
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      accountType: normalizeAccountType(user.accountType),
      crmNumber: user.crmNumber || "",
      crmState: user.crmState || "",
      crmValidated: Boolean(user.crmValidated),
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      linkedDoctors: normalizeCompanySessionDoctors(user.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(user.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(user.documentHistory, Number(user.usageCount || 0))
    };
  }

  function serializeLocalUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status || "active",
      paymentStatus: user.role === "admin" ? "approved" : normalizeLocalPaymentStatus(user.paymentStatus),
      paymentDueAt: user.paymentDueAt || null,
      planId: user.planId || (user.role === "admin" ? "internal" : "individual_25"),
      planLabel: user.planLabel || (user.role === "admin" ? "Administracao interna" : ((getPlanCatalogById(user.planId || "individual_25") || {}).label || "Individual Essencial")),
      planPriceCents: Number(user.planPriceCents || 0),
      billingCycleMonths: Number(user.billingCycleMonths || 0),
      planLaudoLimit: user.planLaudoLimit === null || user.planLaudoLimit === undefined ? null : Number(user.planLaudoLimit),
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      notes: user.notes || "",
      expiresAt: user.expiresAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      accountType: normalizeAccountType(user.accountType),
      crmNumber: user.crmNumber || "",
      crmState: user.crmState || "",
      doctorCpf: user.doctorCpf || "",
      doctorBirthDate: user.doctorBirthDate || "",
      crmValidated: Boolean(user.crmValidated),
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      linkedDoctors: normalizeCompanySessionDoctors(user.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(user.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(user.documentHistory, Number(user.usageCount || 0)),
      canAccess: user.role === "admin" ? user.status === "active" : !getLocalAccessError(user)
    };
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      setAuthStatus("Cadastro bloqueado nesta abertura local. Abra o sistema por http://127.0.0.1:8080 ou pela hospedagem publicada.");
      return;
    }

    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    const companyCnpj = refs.registerCompanyCnpj ? refs.registerCompanyCnpj.value.replace(/\D/g, "") : "";
    let contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const crmNumber = document.getElementById("registerDoctorCrm") ? document.getElementById("registerDoctorCrm").value.replace(/\D/g, "") : "";
    const crmState = document.getElementById("registerDoctorCrmUf") ? document.getElementById("registerDoctorCrmUf").value : "";
    const legalTermsAccepted = document.getElementById("registerLegalTerms") ? document.getElementById("registerLegalTerms").checked : false;
    const doctorTermsAccepted = document.getElementById("registerDoctorTerms") ? document.getElementById("registerDoctorTerms").checked : false;
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = resolveJourneyPlan(journey, Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog(), selectedPlanId);

    if (!company || !email || !username || !password || !passwordConfirm) {
      setAuthStatus(isDoctorJourney
        ? "Preencha nome do médico, e-mail, usuário, senha e confirmação para solicitar o acesso médico."
        : "Preencha empresa, responsável, e-mail, usuário, senha e confirmação para criar a conta.");
      return;
    }

    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail válido para continuar.");
      return;
    }
    if (!isDoctorJourney && companyCnpj.length !== 14) {
      setAuthStatus("Informe um CNPJ valido com 14 digitos para concluir o cadastro empresarial.");
      return;
    }

    if (!plan) {
      setAuthStatus("Não foi possível localizar o plano correspondente a esta jornada.");
      return;
    }

    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== passwordConfirm) {
      setAuthStatus("A confirmação da senha não confere.");
      return;
    }

    if (!legalTermsAccepted) {
      setAuthStatus("É obrigatório confirmar ciência sobre o uso do sistema como apoio técnico antes da contratação.");
      return;
    }

    if (isDoctorJourney) {
      if (!crmNumber || crmNumber.length < 4 || !crmState) {
        setAuthStatus("Informe CRM e UF válidos para solicitar o plano médico.");
        return;
      }
      if (doctorCpf.length !== 11) {
        setAuthStatus("Informe o CPF completo do m\u00e9dico para validar a compra no CFM.");
        return;
      }
      if (!doctorBirthDate) {
        setAuthStatus("Informe a data de nascimento do m\u00e9dico para validar a compra no CFM.");
        return;
      }
      if (!isDoctorCfmConfigured()) {
        setAuthStatus(state.authProvider === "api"
          ? "A valida\u00e7\u00e3o CFM do plano m\u00e9dico ainda n\u00e3o est\u00e1 configurada no servidor. Informe a chave oficial do webservice do CFM para liberar compras m\u00e9dicas."
          : "O plano m\u00e9dico exige valida\u00e7\u00e3o online no CFM e n\u00e3o pode ser contratado no modo local.");
        return;
      }
      if (!doctorTermsAccepted) {
        setAuthStatus("Confirme a responsabilidade técnica médica para prosseguir com o plano médico.");
        return;
      }
      if (!contactName) {
        contactName = company;
      }
    } else if (!contactName) {
      setAuthStatus("Informe o responsável da conta empresarial.");
      return;
    }

    document.body.classList.remove("demo-mode");
    state.demoModeEnabled = false;

    if (state.authProvider === "api") {
      try {
        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            companyCnpj,
            contactName,
            email,
            username,
            password,
            planId: plan.id,
            accountType: isDoctorJourney ? "doctor" : "company",
            crmNumber,
            crmState,
            doctorCpf,
            doctorBirthDate,
            legalAccepted: legalTermsAccepted,
            doctorAccepted: doctorTermsAccepted
          }
        });

        if (refs.registerForm) {
          refs.registerForm.reset();
        }
        syncCommercialJourneyUI();
        if (refs.loginUsername) {
          refs.loginUsername.value = username;
        }

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkoutUrl = response && response.checkout
          ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
          : "";

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          setAuthStatus(popup
            ? "Solicitação criada com sucesso. O checkout foi aberto em nova guia para concluir a liberação comercial."
            : "Solicitação criada com sucesso. Finalize o checkout liberado pelo sistema para concluir a ativação.");
        } else {
          setAuthStatus(response.message || "Solicitação criada. Configure o Mercado Pago para concluir a liberação automática.");
        }
      } catch (error) {
        setAuthStatus(error.message || "Não foi possível concluir a solicitação de acesso neste momento.");
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Já existe um acesso local com esse usuário.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Já existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      companyCnpj,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), Number(plan.months || 1)),
      planId: plan.id,
      notes: isDoctorJourney
        ? `Cadastro médico local com CRM ${crmState}-${crmNumber}.`
        : "Cadastro empresarial local para apoio técnico.",
      accountType: isDoctorJourney ? "doctor" : "company",
      crmNumber,
      crmState,
      crmValidated: isDoctorJourney
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) {
      refs.registerForm.reset();
    }
    syncCommercialJourneyUI();
    setAuthStatus(isDoctorJourney
      ? "Acesso médico criado em modo local de demonstração controlada."
      : "Conta empresarial criada em modo local de demonstração controlada.");
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);
    applyAuthenticatedSession(session);
  }

  async function handleLogout() {
    const wasDemo = Boolean(state.demoModeEnabled);

    if (!wasDemo && state.authProvider === "api") {
      try {
        await apiJson(AUTH_API.logout, { method: "POST" });
      } catch (error) {
        console.error(error);
      }
    } else if (!wasDemo) {
      clearLocalSessionUser();
    }

    state.demoModeEnabled = false;
    document.body.classList.remove("demo-mode");
    state.sessionUser = null;

    if (refs.adminShell) {
      refs.adminShell.classList.add("hidden");
    }
    if (refs.appShell) {
      refs.appShell.classList.add("hidden");
    }
    if (refs.authShell) {
      refs.authShell.classList.remove("hidden");
    }
    closeInlineAdminPanel();

    if (wasDemo) {
      state.authProvider = window.location.protocol === "file:" ? "local" : "api";
      await loadAuthBootstrap();
      setAuthStatus("Sessão de demonstração encerrada com sucesso.");
      return;
    }

    setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
    setAuthStatus("Sessão encerrada com sucesso.");
  }

  async function handlePdfDownload() {
    const accountType = normalizeAccountType(state.sessionUser && state.sessionUser.accountType);

    if (accountType === "demo" || state.demoModeEnabled) {
      window.alert("O modo demonstração permite apenas navegação assistida e minuta visual. Conclusão documental, assinatura e validade jurídica permanecem bloqueadas.");
      return;
    }

    if (accountType !== "doctor") {
      window.alert("A conclusão do documento exige médico autenticado com CRM válido e responsabilidade técnica assumida. Usuários empresariais não podem emitir ou assinar documentos.");
      return;
    }

    if (!state.lastResult || state.lastResult.status !== "eligible") {
      window.alert("O laudo final só pode ser emitido quando o caso estiver classificado como enquadrado.");
      return;
    }

    const identity = collectReportIdentity();
    const printFiles = collectPrintPackageFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliação");
    if (!identity.examiner) missing.push("profissional responsável");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      window.alert(`Preencha os campos obrigatórios para emissão do laudo: ${missing.join(", ")}.`);
      return;
    }

    try {
      const attachments = printFiles.length ? await buildAttachmentPayloads(printFiles) : [];
      const pdfPayload = buildPdfPayload(identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        window.alert("O navegador bloqueou a abertura da janela de impressão. Permita pop-ups desta página e tente novamente.");
        return;
      }

      await incrementUsageCounter();
    } catch (error) {
      console.error(error);
      window.alert(`Não foi possível preparar o pacote final de impressão neste momento.${error && error.message ? `\n\nDetalhe técnico: ${toPresentationText(error.message)}` : ""}`);
    }
  }

  function clearDemoCommercialState() {
    document.body.classList.remove("demo-mode");
    state.demoModeEnabled = false;
    if (state.authProvider === "demo") {
      state.authProvider = window.location.protocol === "file:" ? "local" : "api";
    }
  }

  function buildRegisterJourneyCard(plan, journey) {
    if (!plan) {
      return "";
    }

    const label = journey === "doctor" ? "Plano Medico" : "Plano Empresa";
    const support = journey === "doctor"
      ? "Cadastro exclusivo para medico com CRM informado e responsabilidade tecnica vinculada ao acesso."
      : "Fluxo empresarial para operacao guiada, controle interno e dependencia de medico responsavel para conclusao documental.";
    const months = Number(plan.months || 0);
    const laudoLimit = Number(plan.laudoLimit || 0);

    return `
      <article class="plan-card ${journey === "doctor" ? "is-featured" : ""}">
        <span class="plan-card-badge">${escapeHtml(journey === "doctor" ? "Medico" : "Empresa")}</span>
        <strong>${escapeHtml(label)}</strong>
        <div class="plan-card-price">${escapeHtml(formatCurrencyCents(plan.priceCents || 0))}</div>
        <p class="plan-card-description">${escapeHtml(toPresentationText(plan.description || support))}</p>
        <div class="plan-card-meta">
          <span>${escapeHtml(`${laudoLimit} laudos previstos no ciclo contratado`)}</span>
          <span>${escapeHtml(`${months} ${months === 1 ? "mes" : "meses"} de vigencia comercial`)}</span>
        </div>
      </article>
    `;
  }

  function normalizeCommercialJourney(value) {
    if (value === "doctor") return "doctor";
    if (value === "demo") return "demo";
    return "company";
  }

  function normalizeAccountType(value) {
    if (value === "doctor") return "doctor";
    if (value === "demo") return "demo";
    return "company";
  }

  function getCommercialJourney() {
    const field = document.getElementById("registerJourneyType");
    const journey = normalizeCommercialJourney(state.commercialJourney || (field && field.value ? field.value : "company"));
    state.commercialJourney = journey;
    if (field) field.value = journey;
    return journey;
  }

  function getPlansForJourney(journey, catalog = []) {
    const plans = Array.isArray(catalog) && catalog.length
      ? normalizeClientPlanCatalog(catalog)
      : getStoredPlanCatalog();

    const prefix = journey === "doctor" ? "individual_" : "empresarial_";
    const audience = journey === "doctor" ? "medico" : "empresa";
    const filtered = plans.filter((plan) => {
      const id = String(plan.id || "");
      const label = String(plan.audience || "").toLowerCase();
      const audienceKey = normalizeClientPlanAudienceKey(plan.audienceKey || plan.audience);
      return isActiveClientPlan(plan) && (id.startsWith(prefix) || label === audience || audienceKey === (journey === "doctor" ? "doctor" : "company"));
    });

    return filtered.length ? filtered : plans;
  }

  function resolveJourneyPlan(journey, catalog = [], selectedPlanId = "") {
    const plans = getPlansForJourney(journey, catalog);
    const current = plans.find((plan) => String(plan.id || "") === String(selectedPlanId || ""));
    if (current) {
      return current;
    }

    if (journey === "doctor") {
      return plans.find((plan) => String(plan.id || "") === "individual_recorrente_30")
        || plans.find((plan) => String(plan.id || "") === "individual_80")
        || plans[0]
        || null;
    }

    return plans.find((plan) => String(plan.id || "") === "empresarial_250")
      || plans[0]
      || null;
  }

  function buildJourneyPlanCards(plans = [], selectedPlanId = "", journey = "company") {
    return plans.map((plan) => {
      const isSelected = String(plan.id || "") === String(selectedPlanId || "");
      const months = Number(plan.months || 0);
      const laudoLimit = Number(plan.laudoLimit || 0);
      const priceCents = Number(plan.priceCents || 0);
      return `
        <article class="plan-card${isSelected ? " is-selected" : ""}">
          <span class="plan-card-badge">${escapeHtml(journey === "doctor" ? "Medico" : "Empresa")}</span>
          <strong>${escapeHtml(fixBrokenText(plan.label || ""))}</strong>
          <div class="plan-card-price">${escapeHtml(formatCurrencyCents(priceCents))}</div>
          <p class="plan-card-description">${escapeHtml(fixBrokenText(plan.description || ""))}</p>
          <div class="plan-card-meta">
            <span>${escapeHtml(`${laudoLimit} laudos previstos no ciclo contratado`)}</span>
            <span>${escapeHtml(`${months} ${months === 1 ? "mes" : "meses"} de vigencia comercial`)}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function syncCommercialJourneyUI() {
    const journey = getCommercialJourney();
    const companyLabel = document.getElementById("registerCompanyLabel");
    const contactSpan = refs.registerContactName ? refs.registerContactName.closest("label").querySelector("span") : null;
    const journeyNote = document.getElementById("registerJourneyNote");
    const doctorFields = document.getElementById("doctorCredentialFields");
    const doctorResponsibilityCard = document.getElementById("doctorResponsibilityCard");
    const doctorValidationNote = document.getElementById("registerDoctorValidationNote");
    const registerCompanyCnpjField = document.getElementById("registerCompanyCnpjField");
    const registerPlanGrid = document.getElementById("registerPlanGrid");
    const registerPlanLabel = refs.registerPlan ? refs.registerPlan.closest("label").querySelector("span") : null;
    const registerSubmitButton = refs.registerSubmitButton;
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog();
    const journeyPlans = getPlansForJourney(journey, catalog);
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const chosenPlan = resolveJourneyPlan(journey, catalog, selectedPlanId);
    const cfmConfigured = isDoctorCfmConfigured();

    if (companyLabel) companyLabel.textContent = journey === "doctor" ? "Nome do medico" : "Empresa";
    if (refs.registerCompany) refs.registerCompany.placeholder = journey === "doctor" ? "Nome completo do medico" : "Razao social ou nome fantasia";
    if (contactSpan) contactSpan.textContent = journey === "doctor" ? "Clinica / nome de exibicao" : "Responsavel";
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = journey === "doctor"
        ? "Clinica, consultorio ou identificacao profissional"
        : "Nome do responsavel pela conta";
    }
    if (refs.registerEmail) refs.registerEmail.placeholder = journey === "doctor" ? "medico@dominio.com.br" : "contato@empresa.com.br";
    if (companyLabel) companyLabel.textContent = journey === "doctor" ? "Nome do m\u00e9dico" : "Empresa";
    if (refs.registerCompany) refs.registerCompany.placeholder = journey === "doctor" ? "Nome completo do m\u00e9dico" : "Raz\u00e3o social ou nome fantasia";
    if (contactSpan) contactSpan.textContent = journey === "doctor" ? "Cl\u00ednica / nome de exibi\u00e7\u00e3o (opcional)" : "Respons\u00e1vel";
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = journey === "doctor"
        ? "Cl\u00ednica, consult\u00f3rio ou identifica\u00e7\u00e3o profissional"
        : "Nome do respons\u00e1vel pela conta";
    }
    if (refs.registerUsername) refs.registerUsername.placeholder = journey === "doctor" ? "Usu\u00e1rio profissional do m\u00e9dico" : "Usu\u00e1rio principal da empresa";
    if (refs.registerUsername) refs.registerUsername.placeholder = journey === "doctor" ? "Usuario profissional do medico" : "Usuario principal da empresa";
    if (journeyNote) {
      journeyNote.textContent = journey === "doctor"
        ? "Cadastro medico individual com CRM obrigatorio, vinculo profissional do acesso e responsabilidade tecnica do usuario autenticado."
        : "Cadastro empresarial para uso da plataforma como apoio tecnico, com operacao interna e dependencia de medico habilitado para conclusao documental.";
    }
    if (journeyNote) {
      journeyNote.textContent = journey === "doctor"
        ? "Cadastro m\u00e9dico individual com valida\u00e7\u00e3o obrigat\u00f3ria no CFM antes do pagamento e responsabilidade t\u00e9cnica vinculada ao profissional autenticado."
        : "Cadastro empresarial com contrata\u00e7\u00e3o por per\u00edodo, uso corporativo e emiss\u00f5es ilimitadas durante a vig\u00eancia ativa.";
    }
    if (registerCompanyCnpjField) registerCompanyCnpjField.classList.toggle("hidden", journey === "doctor");
    if (doctorFields) doctorFields.classList.toggle("hidden", journey !== "doctor");
    if (doctorResponsibilityCard) doctorResponsibilityCard.classList.toggle("hidden", journey !== "doctor");
    if (doctorValidationNote) {
      doctorValidationNote.textContent = journey !== "doctor"
        ? ""
        : state.authProvider !== "api"
          ? "O plano m\u00e9dico exige backend publicado e valida\u00e7\u00e3o online no CFM. No modo local, esta contrata\u00e7\u00e3o permanece bloqueada."
          : cfmConfigured
            ? "A valida\u00e7\u00e3o do plano m\u00e9dico ocorre no ato da compra, com confer\u00eancia de CRM, CPF e data de nascimento junto ao CFM antes da libera\u00e7\u00e3o do pagamento."
            : "A chave oficial do webservice do CFM ainda n\u00e3o foi configurada neste servidor. Enquanto isso, a compra do plano m\u00e9dico permanece bloqueada.";
    }
    if (registerPlanLabel) registerPlanLabel.textContent = journey === "doctor" ? "Plano medico disponivel" : "Plano empresarial disponivel";

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = journeyPlans.map((plan) => (
        `<option value="${escapeHtml(plan.id)}"${String(plan.id || "") === String(chosenPlan && chosenPlan.id ? chosenPlan.id : "") ? " selected" : ""}>${escapeHtml(fixBrokenText(plan.label || ""))} • ${escapeHtml(`${Number(plan.laudoLimit || 0)} laudos`)}</option>`
      )).join("");
      refs.registerPlan.disabled = false;
      if (chosenPlan) refs.registerPlan.value = chosenPlan.id;
    }

    if (registerPlanGrid) {
      registerPlanGrid.innerHTML = buildJourneyPlanCards(journeyPlans, chosenPlan ? chosenPlan.id : "", journey);
    }
  }

  function renderPlanCatalogCards(catalog = []) {
    const plans = Array.isArray(catalog) && catalog.length ? catalog : getDefaultPlanCatalog();
    const adminGrid = document.getElementById("adminPlanGrid");

    syncCommercialJourneyUI();
    if (!adminGrid) return;

    adminGrid.innerHTML = plans.map((plan) => {
      const audience = fixBrokenText(plan.audience || "Plano");
      const label = fixBrokenText(plan.label || "");
      const description = fixBrokenText(plan.description || "");
      const months = Number(plan.months || 0);
      const laudoLimit = plan.laudoLimit === null || plan.laudoLimit === undefined ? null : Number(plan.laudoLimit || 0);
      const priceCents = Number(plan.priceCents || 0);
      const featuredClass = String(plan.id || "").startsWith("empresarial_250") ? " is-featured" : "";
      const primaryMeta = String(plan.id || "").startsWith("individual_")
        ? `${laudoLimit} documentos por consumo`
        : "Emissões ilimitadas";
      const secondaryMeta = String(plan.id || "").startsWith("individual_")
        ? "Créditos para uso médico autenticado"
        : `${months} ${months === 1 ? "mês" : "meses"} de vigência`;

      return `
        <article class="plan-card${featuredClass}">
          <span class="plan-card-badge">${escapeHtml(audience)}</span>
          <strong>${escapeHtml(label)}</strong>
          <div class="plan-card-price">${escapeHtml(formatCurrencyCents(priceCents))}</div>
          <p class="plan-card-description">${escapeHtml(description)}</p>
          <div class="plan-card-meta">
            <span>${escapeHtml(primaryMeta)}</span>
            <span>${escapeHtml(secondaryMeta)}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function populatePlanSelects() {
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length
      ? state.planCatalog
      : getDefaultPlanCatalog();

    if (refs.adminPlan) {
      refs.adminPlan.innerHTML = buildPlanOptionsHtml(refs.adminPlan.value || (catalog[0] ? catalog[0].id : ""), true);
      if (!refs.adminPlan.value && catalog[0]) refs.adminPlan.value = catalog[0].id;
    }

    renderPlanCatalogCards(catalog);
    syncCommercialJourneyUI();
  }

  function openOperationalJourney(journey, focusField) {
    clearDemoCommercialState();
    state.authAccessTouched = true;
    state.commercialJourney = normalizeCommercialJourney(journey);
    setAuthAccessType("buyer", { preserveMode: true });
    setAuthMode("register");
    syncCommercialJourneyUI();
    setAuthStatus(state.commercialJourney === "doctor"
      ? "Plano médico selecionado. Informe os dados profissionais, confirme as responsabilidades e conclua a solicitação de acesso."
      : "Plano empresarial selecionado. Revise os avisos legais e conclua o cadastro empresarial.");
    if (typeof focusField === "function") focusField();
  }

  function startDemoAccess() {
    clearDemoCommercialState();
    document.body.classList.add("demo-mode");
    state.demoModeEnabled = true;
    state.commercialJourney = "demo";
    state.authProvider = "demo";

    applyAuthenticatedSession({
      id: `demo_${Date.now()}`,
      company: "DaviCore Health Demonstração",
      contactName: "Sessão de teste",
      email: "",
      username: "demo",
      role: "buyer",
      status: "active",
      paymentStatus: "approved",
      paymentDueAt: null,
      planId: "demo",
      planLabel: "Modo Demonstração",
      usageCount: 0,
      lastAccessAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: false,
      accountType: "demo",
      crmNumber: "",
      crmState: "",
      crmValidated: false,
      canAccess: true
    });

    if (refs.reportCompany && !refs.reportCompany.value) {
      refs.reportCompany.value = "DaviCore Health Demonstracao";
    }
  }

  function initAuth() {
    const heroPlansButton = document.getElementById("heroPlansButton");
    const companyPlanButton = document.getElementById("companyPlanButton");
    const doctorPlanButton = document.getElementById("doctorPlanButton");
    const demoPlanButton = document.getElementById("demoPlanButton");
    const heroLoginButton = document.getElementById("heroLoginButton");
    const heroRegisterButton = document.getElementById("heroRegisterButton");
    const focusAuthField = (field) => {
      const panel = document.getElementById("authPanel");
      if (panel && typeof panel.scrollIntoView === "function") {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (field && typeof field.focus === "function") {
        window.requestAnimationFrame(() => field.focus());
      }
    };
    const focusLogin = () => focusAuthField(refs.loginUsername);
    const focusRegister = () => focusAuthField(refs.registerCompany);

    state.commercialJourney = normalizeCommercialJourney(state.commercialJourney || "company");
    state.demoModeEnabled = false;

    if (refs.loginForm) refs.loginForm.addEventListener("submit", handleLoginSubmit);
    if (refs.registerForm) refs.registerForm.addEventListener("submit", handlePublicRegistration);
    if (refs.setupForm) refs.setupForm.addEventListener("submit", handleSetupSubmit);
    if (refs.showSetupButton) refs.showSetupButton.addEventListener("click", () => {
      clearDemoCommercialState();
      setAuthAccessType("admin", { preserveMode: true });
      setAuthMode("setup");
      setAuthStatus("");
      focusAuthField(refs.setupCompany);
    });
    if (refs.showRegisterButton) refs.showRegisterButton.addEventListener("click", () => openOperationalJourney("company", focusRegister));
    if (refs.showLoginButton) refs.showLoginButton.addEventListener("click", () => {
      clearDemoCommercialState();
      setAuthMode("login");
      setAuthStatus("");
      focusLogin();
    });
    if (refs.showLoginFromRegisterButton) refs.showLoginFromRegisterButton.addEventListener("click", () => {
      clearDemoCommercialState();
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("");
      focusLogin();
    });
    if (heroPlansButton) heroPlansButton.addEventListener("click", () => {
      const plans = document.getElementById("modernPlans");
      if (plans && typeof plans.scrollIntoView === "function") {
        plans.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    if (heroLoginButton) heroLoginButton.addEventListener("click", () => {
      clearDemoCommercialState();
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("Leia os avisos legais e acesse com o perfil contratado.");
      focusLogin();
    });
    if (heroRegisterButton) heroRegisterButton.addEventListener("click", () => openOperationalJourney("company", focusRegister));
    if (companyPlanButton) companyPlanButton.addEventListener("click", () => openOperationalJourney("company", focusRegister));
    if (doctorPlanButton) doctorPlanButton.addEventListener("click", () => openOperationalJourney("doctor", focusRegister));
    if (demoPlanButton) demoPlanButton.addEventListener("click", startDemoAccess);
    if (refs.logoutButton) refs.logoutButton.addEventListener("click", handleLogout);
    if (refs.adminLogoutButton) refs.adminLogoutButton.addEventListener("click", handleLogout);
    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        state.commercialJourney = "company";
        clearDemoCommercialState();
        setAuthAccessType("buyer");
        setAuthMode("login");
        syncCommercialJourneyUI();
        setAuthStatus("Empresas contratantes e medicos autenticados entram por esta area operacional.");
      });
    }
    if (refs.accessAdminButton) {
      refs.accessAdminButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        clearDemoCommercialState();
        setAuthAccessType("admin");
        setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
        setAuthStatus(state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais do administrador da plataforma."
          : "Configure agora o administrador principal da plataforma.");
      });
    }
    if (refs.reportWorkerCpf) refs.reportWorkerCpf.addEventListener("input", handleCpfMaskInput);

    loadAuthBootstrap();
  }

  function updateAuthEntryCopy() {
    const isAdmin = state.authAccessType === "admin";
    const isRegister = state.authMode === "register";
    const isSetup = state.authMode === "setup";
    const journey = getCommercialJourney();
    const providerLabel = state.authProvider === "local" ? "local" : "SaaS";

    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = isSetup
        ? "Configuracao do administrador"
        : isRegister
          ? (journey === "doctor" ? "Cadastro medico" : "Cadastro empresarial")
          : (isAdmin ? `Acesso administrador ${providerLabel}` : `Acesso operacional ${providerLabel}`);
    }
    if (refs.authTitle) {
      refs.authTitle.textContent = isSetup
        ? "Configurar administrador da plataforma"
        : isRegister
          ? (journey === "doctor" ? "Solicitar acesso medico" : "Solicitar acesso empresarial")
          : (isAdmin ? "Entrar como administrador" : "Entrar na area operacional");
    }
    if (refs.authDescription) {
      refs.authDescription.textContent = isSetup
        ? "Fluxo exclusivo para a conta administradora que controla clientes, pagamentos, acessos e operacao comercial."
        : isRegister
          ? (journey === "doctor"
            ? "Preencha os dados profissionais, informe CRM e UF, confirme a responsabilidade tecnica e siga com a contratacao do plano medico."
            : "Cadastre a empresa contratante, revise os avisos legais obrigatorios e conclua a solicitacao do plano empresarial.")
          : (isAdmin
            ? "Entrada restrita ao controle administrativo da plataforma, clientes, planos, pagamentos, bloqueios e acompanhamento de uso."
            : "Empresas contratantes e medicos autenticados acessam por esta area operacional. A conclusao documental permanece vinculada ao medico habilitado.");
    }
    if (refs.loginSubmitButton) refs.loginSubmitButton.textContent = isAdmin ? "Entrar no painel administrativo" : "Entrar na area operacional";
    if (refs.showRegisterButton) {
      refs.showRegisterButton.textContent = "Criar conta empresa";
      refs.showRegisterButton.classList.toggle("hidden", isAdmin || isRegister || isSetup);
    }
    if (refs.showSetupButton) refs.showSetupButton.classList.toggle("hidden", !isAdmin || isSetup || (state.authBootstrap && state.authBootstrap.configured));
    syncCommercialJourneyUI();
  }

  function applyInterfaceCopyRefinements() {
    document.title = "DaviCore Health | Planos e acesso responsavel";

    const setText = (selector, text) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = text;
    };

    const setHtml = (selector, html) => {
      const element = document.querySelector(selector);
      if (element) element.innerHTML = html;
    };

    setText("#authShell .auth-brand .eyebrow", "DaviCore Health");
    setText("#authShell .auth-brand h2", "Tecnologia para apoio a caracterizacao de PCD com seguranca e responsabilidade profissional");
    setText("#authShell .auth-brand p", "Sistema inteligente para apoio tecnico na descricao funcional, desenvolvido para uso por profissionais de saude e empresas.");
    setText("#accessBuyerButton strong", "Entrar na area operacional");
    setText("#accessBuyerButton span", "Empresas contratantes e medicos autenticados acessam por esta entrada.");
    setText("#accessAdminButton strong", "Entrar como administrador");
    setText("#accessAdminButton span", "Painel interno para clientes, pagamentos, acessos, bloqueios e configuracoes da plataforma.");
    setText("#showLoginFromRegisterButton", "Voltar para entrar");

    setHtml(".legal-highlight-icon", "&#9888;");
    setHtml(".pricing-cards .offer-card:nth-child(1) .offer-warning.danger", "&#9888; A empresa nao pode emitir ou assinar documentos &mdash; essa acao e exclusiva do medico.");
    setHtml(".pricing-cards .offer-card:nth-child(2) .offer-warning.success", "&#10004; Acesso liberado apenas apos validacao de CRM<br>&#10004; Documentos vinculados ao medico autenticado<br>&#10004; Responsabilidade tecnica obrigatoria");
    setHtml(".pricing-cards .offer-card:nth-child(2) .offer-warning.danger", "&#10060; Este plano nao esta disponivel para usuarios nao medicos");
    setText("#doctorPlanButton", "Sou medico - acessar plano");

    const comparisonBody = document.querySelector(".comparison-table tbody");
    if (comparisonBody) {
      comparisonBody.innerHTML = [
        "<tr><td>Preencher dados</td><td>&#10004;</td><td>&#10004;</td><td>&#10004;</td></tr>",
        "<tr><td>Gerar minuta</td><td>&#10004;</td><td>&#10004;</td><td>&#10004;</td></tr>",
        "<tr><td>Concluir documento</td><td>&#10060;</td><td>&#10004;</td><td>&#10060;</td></tr>",
        "<tr><td>Assinar</td><td>&#10060;</td><td>&#10004;</td><td>&#10060;</td></tr>",
        "<tr><td>Validade juridica</td><td>&#10060;</td><td>&#10004;</td><td>&#10060;</td></tr>"
      ].join("");
    }

    syncCommercialJourneyUI();
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    let contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const crmNumber = refs.registerDoctorCrm ? refs.registerDoctorCrm.value.replace(/\D/g, "") : "";
    const crmState = refs.registerDoctorCrmUf ? refs.registerDoctorCrmUf.value : "";
    const doctorCpf = refs.registerDoctorCpf ? refs.registerDoctorCpf.value.replace(/\D/g, "") : "";
    const doctorBirthDate = refs.registerDoctorBirthDate ? refs.registerDoctorBirthDate.value : "";
    const legalTermsAccepted = document.getElementById("registerLegalTerms") ? document.getElementById("registerLegalTerms").checked : false;
    const doctorTermsAccepted = document.getElementById("registerDoctorTerms") ? document.getElementById("registerDoctorTerms").checked : false;
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = resolveJourneyPlan(
      journey,
      Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog(),
      selectedPlanId
    );

    if (!company || !email || !username || !password || !passwordConfirm) {
      setAuthStatus(isDoctorJourney
        ? "Preencha nome do médico, e-mail, usuário, senha e confirmação para solicitar o acesso médico."
        : "Preencha empresa, responsável, e-mail, usuário, senha e confirmação para criar a conta.");
      return;
    }
    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail válido para continuar.");
      return;
    }
    if (!plan) {
      setAuthStatus("Selecione um plano compativel com este perfil para continuar.");
      return;
    }
    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setAuthStatus("A confirmação da senha não confere.");
      return;
    }
    if (!legalTermsAccepted) {
      setAuthStatus("É obrigatório confirmar ciência sobre o uso do sistema como apoio técnico antes da contratação.");
      return;
    }
    if (isDoctorJourney) {
      if (!crmNumber || crmNumber.length < 4 || !crmState) {
        setAuthStatus("Informe CRM e UF válidos para solicitar o plano médico.");
        return;
      }
      if (!doctorTermsAccepted) {
        setAuthStatus("Confirme a responsabilidade técnica médica para prosseguir com o plano médico.");
        return;
      }
      if (!contactName) contactName = company;
    } else if (!contactName) {
      setAuthStatus("Informe o responsável da conta empresarial.");
      return;
    }

    clearDemoCommercialState();

    if (isDoctorJourney) {
      if (doctorCpf.length !== 11) {
        setAuthStatus("Informe o CPF completo do médico para concluir o cadastro profissional.");
        return;
      }
      if (!doctorBirthDate) {
        setAuthStatus("Informe a data de nascimento do médico para concluir o cadastro profissional.");
        return;
      }
    }

    if (state.authProvider === "api") {
      try {
        setAuthStatus(isDoctorJourney
          ? "Criando a conta médica e preparando o checkout comercial..."
          : "Criando a conta e preparando o checkout comercial...");
        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            contactName,
            email,
            username,
            password,
            planId: plan.id,
            accountType: isDoctorJourney ? "doctor" : "company",
            crmNumber,
            crmState,
            doctorCpf,
            doctorBirthDate,
            legalAccepted: legalTermsAccepted,
            doctorAccepted: doctorTermsAccepted
          }
        });

        if (refs.registerForm) refs.registerForm.reset();
        syncCommercialJourneyUI();
        if (refs.loginUsername) refs.loginUsername.value = username;

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkoutUrl = response && response.checkout
          ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
          : "";

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          setAuthStatus(isDoctorJourney
            ? (popup
              ? "Cadastro médico criado. O checkout foi aberto em nova guia. Após o pagamento, o acesso poderá ser usado, mas a emissão ficará bloqueada até validação administrativa do CRM."
              : "Cadastro médico criado. Finalize o checkout para liberar o acesso. A emissão continuará bloqueada até validação administrativa do CRM.")
            : (popup
              ? "Solicitação criada com sucesso. O checkout foi aberto em nova guia para concluir a liberação comercial."
              : "Solicitação criada com sucesso. Finalize o checkout liberado pelo sistema para concluir a ativação."));
        } else {
          setAuthStatus(response.message || (isDoctorJourney
            ? "Cadastro médico criado. Configure o Mercado Pago para concluir a liberação comercial. A emissão permanecerá bloqueada até validação administrativa do CRM."
            : "Solicitação criada. Configure o Mercado Pago para concluir a liberação automática."));
        }
      } catch (error) {
        setAuthStatus(error.message || "Não foi possível concluir a solicitação de acesso neste momento.");
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Ja existe um acesso local com esse usuario.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Ja existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), Number(plan.months || 1)),
      planId: plan.id,
      notes: isDoctorJourney
        ? `Cadastro medico local com CRM ${crmState}-${crmNumber}.`
        : "Cadastro empresarial local para apoio tecnico.",
      accountType: isDoctorJourney ? "doctor" : "company",
      crmNumber,
      crmState,
      doctorCpf,
      doctorBirthDate,
      crmValidated: false,
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) refs.registerForm.reset();
    syncCommercialJourneyUI();

    if (isDoctorJourney) {
      if (refs.loginUsername) refs.loginUsername.value = username;
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("Cadastro médico criado em modo local. O acesso pode ser usado, mas a emissão de laudos continuará bloqueada até validação administrativa do CRM.");
      return;
    }

    setAuthStatus("Conta empresarial criada em modo local de demonstração controlada.");
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);
    applyAuthenticatedSession(session);
  }

  async function handleLogout() {
    const wasDemo = Boolean(state.demoModeEnabled);

    if (!wasDemo && state.authProvider === "api") {
      try {
        await apiJson(AUTH_API.logout, { method: "POST" });
      } catch (error) {
        console.error(error);
      }
    } else if (!wasDemo) {
      clearLocalSessionUser();
    }

    state.demoModeEnabled = false;
    document.body.classList.remove("demo-mode");
    state.sessionUser = null;

    if (refs.adminShell) refs.adminShell.classList.add("hidden");
    if (refs.appShell) refs.appShell.classList.add("hidden");
    if (refs.authShell) refs.authShell.classList.remove("hidden");
    closeInlineAdminPanel();

    if (wasDemo) {
      state.authProvider = window.location.protocol === "file:" ? "local" : "api";
      await loadAuthBootstrap();
      setAuthStatus("Sessao de demonstracao encerrada com sucesso.");
      return;
    }

    setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
    setAuthStatus("Sessao encerrada com sucesso.");
  }

  function setPdfActionStatus(message = "") {
    if (refs.pdfActionStatus) {
      refs.pdfActionStatus.textContent = message || "";
    }
  }

  function getLaudoActionContext() {
    const accountType = normalizeAccountType(state.sessionUser && state.sessionUser.accountType);
    let message = "";

    if (accountType === "demo" || state.demoModeEnabled) {
      message = "O modo demonstracao permite apenas navegacao assistida e minuta visual. Conclusao documental, assinatura e validade juridica permanecem bloqueadas.";
    } else if (accountType !== "doctor") {
      message = "A conclusao do documento exige medico autenticado com CRM valido e responsabilidade tecnica assumida. Usuarios empresariais nao podem emitir ou assinar documentos.";
    } else if (!state.sessionUser || !state.sessionUser.crmValidated) {
      message = "A emissao do laudo permanece bloqueada ate a validacao administrativa do CRM no painel do sistema.";
    } else if (!state.lastResult || state.lastResult.status !== "eligible") {
      message = "O laudo final so pode ser emitido quando o caso estiver classificado como enquadrado.";
    }

    if (message) {
      setPdfActionStatus(message);
      window.alert(message);
      return null;
    }

    const identity = collectReportIdentity();
    const printFiles = collectPrintPackageFiles();
    const missing = [];

    if (!identity.workerName) missing.push("nome do trabalhador");
    if (!identity.reportDate) missing.push("data da avaliacao");
    if (!identity.examiner) missing.push("profissional responsavel");
    if (!identity.examinerRegistry) missing.push("conselho/registro");

    if (missing.length) {
      message = `Preencha os campos obrigatorios para emissao do laudo: ${missing.join(", ")}.`;
      setPdfActionStatus(message);
      window.alert(message);
      return null;
    }

    return { identity, printFiles };
  }

  function buildLaudoUsageSignature(identity = {}, result = state.lastResult) {
    return [
      state.sessionUser && state.sessionUser.id ? state.sessionUser.id : "",
      state.activeModule || "",
      identity.workerName || "",
      identity.workerCpf || "",
      identity.workerBirthDate || "",
      identity.reportDate || "",
      identity.examiner || "",
      identity.examinerRegistry || "",
      result && result.status ? result.status : "",
      result && result.description ? result.description : "",
      result && result.limitations ? result.limitations : "",
      result && result.report ? result.report : ""
    ].map((value) => normalizeSpacing(String(value || "")).toLowerCase()).join("|");
  }

  async function registerLaudoUsageOnce(identity) {
    const signature = buildLaudoUsageSignature(identity);
    if (!signature || state.lastLaudoUsageSignature === signature) {
      return false;
    }

    await incrementUsageCounter();
    state.lastLaudoUsageSignature = signature;
    return true;
  }

  async function handlePdfDownload() {
    const context = getLaudoActionContext();
    if (!context) {
      return;
    }

    setPdfActionStatus("Preparando pacote de impressao do laudo...");

    try {
      const attachments = context.printFiles.length ? await buildAttachmentPayloads(context.printFiles) : [];
      const pdfPayload = buildPdfPayload(context.identity, state.lastResult, attachments);
      const openedPrintView = await openOfficialPrintPreview(pdfPayload);

      if (!openedPrintView) {
        cleanupAttachmentPayloads(attachments);
        const message = "O navegador bloqueou a abertura da janela de impressao. Permita pop-ups desta pagina e tente novamente.";
        setPdfActionStatus(message);
        window.alert(message);
        return;
      }

      await registerLaudoUsageOnce(context.identity);
      setPdfActionStatus(context.printFiles.length
        ? "Janela de impressao aberta com o laudo e os anexos vinculados."
        : "Janela de impressao aberta com sucesso.");
    } catch (error) {
      console.error(error);
      const message = `Nao foi possivel preparar o pacote final de impressao neste momento.${error && error.message ? `\n\nDetalhe tecnico: ${toPresentationText(error.message)}` : ""}`;
      setPdfActionStatus(message.replace(/\n+/g, " "));
      window.alert(message);
    }
  }

  async function handlePdfSave() {
    const context = getLaudoActionContext();
    if (!context) {
      return;
    }

    setPdfActionStatus("Gerando PDF do laudo para salvar...");

    try {
      const pdfPayload = buildPdfPayload(context.identity, state.lastResult, []);
      const blob = await buildLaudoPdfBlob(pdfPayload);
      const fileName = buildPdfFileName(context.identity.workerName);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1200);

      await registerLaudoUsageOnce(context.identity);
      setPdfActionStatus(context.printFiles.length
        ? "PDF do laudo salvo com sucesso. Se quiser incluir anexos no pacote visual, use tambem o botao de imprimir."
        : "PDF do laudo salvo com sucesso.");
    } catch (error) {
      console.error(error);
      const message = `Nao foi possivel salvar o PDF do laudo neste momento.${error && error.message ? `\n\nDetalhe tecnico: ${toPresentationText(error.message)}` : ""}`;
      setPdfActionStatus(message.replace(/\n+/g, " "));
      window.alert(message);
    }
  }

  function buildLocalSessionUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status,
      paymentStatus: user.paymentStatus || "approved",
      paymentDueAt: user.paymentDueAt || null,
      paymentLastApprovedAt: user.paymentLastApprovedAt || null,
      planId: user.planId || null,
      planLabel: user.planLabel || "",
      planPriceCents: Number(user.planPriceCents || 0),
      billingCycleMonths: Number(user.billingCycleMonths || 0),
      usageCount: Number(user.usageCount || 0),
      lastAccessAt: user.lastAccessAt || null,
      expiresAt: user.expiresAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      accountType: normalizeAccountType(user.accountType),
      crmNumber: user.crmNumber || "",
      crmState: user.crmState || "",
      doctorCpf: user.doctorCpf || "",
      doctorBirthDate: user.doctorBirthDate || "",
      crmValidated: Boolean(user.crmValidated),
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      linkedDoctors: normalizeCompanySessionDoctors(user.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(user.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(user.documentHistory, Number(user.usageCount || 0)),
      renewalOfferedAt: user.renewalOfferedAt || null,
      renewalContactedAt: user.renewalContactedAt || null,
      renewalContactChannel: user.renewalContactChannel || ""
    };
  }

  function serializeLocalUser(user) {
    return {
      id: user.id,
      company: user.company,
      companyCnpj: user.companyCnpj || "",
      companyLogoDataUrl: user.companyLogoDataUrl || "",
      contactName: user.contactName || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      status: user.status || "active",
      paymentStatus: user.role === "admin" ? "approved" : normalizeLocalPaymentStatus(user.paymentStatus),
      paymentDueAt: user.paymentDueAt || null,
      paymentLastApprovedAt: user.paymentLastApprovedAt || null,
      planId: user.planId || (user.role === "admin" ? "internal" : "individual_25"),
      planLabel: user.planLabel || (user.role === "admin" ? "Administracao interna" : ((getPlanCatalogById(user.planId || "individual_25") || {}).label || "Individual Essencial")),
      planPriceCents: Number(user.planPriceCents || 0),
      billingCycleMonths: Number(user.billingCycleMonths || 0),
      planLaudoLimit: planLaudoLimit === null || planLaudoLimit === undefined ? null : Number(planLaudoLimit),
      planBillingModel,
      planQuotaPeriod: quotaPeriod,
      usageCount: Number(user.usageCount || 0),
      currentCycleUsageCount,
      remainingLaudos,
      lastAccessAt: user.lastAccessAt || null,
      notes: user.notes || "",
      expiresAt: user.expiresAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.role === "admin",
      paymentProvider: user.paymentProvider || "manual",
      mpPreferenceId: user.mpPreferenceId || "",
      mpCheckoutUrl: user.mpCheckoutUrl || "",
      mpLastPaymentId: user.mpLastPaymentId || "",
      mpSubscriptionId: user.mpSubscriptionId || "",
      mpSubscriptionStatus: user.mpSubscriptionStatus || "",
      paymentHistory: Array.isArray(user.paymentHistory) ? user.paymentHistory : [],
      accountType: normalizeAccountType(user.accountType),
      crmNumber: user.crmNumber || "",
      crmState: user.crmState || "",
      crmValidated: Boolean(user.crmValidated),
      responsibilityMode: normalizeResponsibilityMode(user.responsibilityMode),
      linkedCompanyId: user.linkedCompanyId || "",
      linkedCompanyDoctorId: user.linkedCompanyDoctorId || "",
      linkedDoctors: normalizeCompanySessionDoctors(user.linkedDoctors),
      activityLog: normalizeCompanySessionActivities(user.activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(user.documentHistory, Number(user.usageCount || 0)),
      renewalOfferedAt: user.renewalOfferedAt || null,
      renewalContactedAt: user.renewalContactedAt || null,
      renewalContactChannel: user.renewalContactChannel || "",
      canAccess: user.role === "admin" ? user.status === "active" : !getLocalAccessError(user)
    };
  }

  function escapeCssSelectorValue(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(String(value || ""));
    }
    return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function getRenewalSnapshot(user) {
    const dueAt = user ? (user.paymentDueAt || user.expiresAt || null) : null;
    const paymentStatus = normalizeLocalPaymentStatus(user && user.paymentStatus ? user.paymentStatus : "approved");

    if (!user || user.role === "admin" || user.isAdmin) {
      return { stage: "none", dueAt: null, daysRemaining: null, title: "", summary: "", badge: "", canRenew: false, needsContact: false };
    }

    if (!dueAt) {
      return {
        stage: "active",
        dueAt: null,
        daysRemaining: null,
        title: "Vigencia sem data definida",
        summary: "O acesso esta ativo, mas a vigencia comercial ainda nao possui data registrada.",
        badge: "Sem vigencia",
        canRenew: false,
        needsContact: false
      };
    }

    const dueDate = new Date(dueAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);

    if (paymentStatus === "expired" || user.status === "inadimplente" || daysRemaining < 0) {
      return {
        stage: "expired",
        dueAt,
        daysRemaining,
        title: "Plano vencido - recontratacao recomendada",
        summary: "O acesso comercial esta vencido. Gere uma nova contratacao para restabelecer a vigencia e manter a operacao regular.",
        badge: "Vencido",
        canRenew: true,
        needsContact: true
      };
    }

    if (daysRemaining <= 7) {
      return {
        stage: "urgent",
        dueAt,
        daysRemaining,
        title: "Plano entrando no fim da vigencia",
        summary: "A renovacao ja deve ser priorizada para evitar interrupcao comercial do acesso.",
        badge: "Urgente",
        canRenew: true,
        needsContact: true
      };
    }

    if (daysRemaining <= 15) {
      return {
        stage: "attention",
        dueAt,
        daysRemaining,
        title: "Janela de renovacao aberta",
        summary: "O contratante ja esta no periodo ideal para renovar o plano sem risco de expiracao.",
        badge: "Renovacao",
        canRenew: true,
        needsContact: true
      };
    }

    return {
      stage: "active",
      dueAt,
      daysRemaining,
      title: "Plano ativo e dentro da vigencia",
      summary: "O acesso comercial esta regular. O sistema vai sinalizar quando a janela de renovacao se aproximar.",
      badge: "Ativo",
      canRenew: true,
      needsContact: false
    };
  }

  function formatRenewalDaysLabel(daysRemaining) {
    if (!Number.isFinite(daysRemaining)) {
      return "Sem data definida";
    }
    if (daysRemaining < 0) {
      return `${Math.abs(daysRemaining)} dia(s) de vencimento`;
    }
    if (daysRemaining === 0) {
      return "Vence hoje";
    }
    return `${daysRemaining} dia(s) restantes`;
  }

  function formatSubscriptionStatusLabel(status) {
    const normalized = String(status || "").trim().toLowerCase();
    if (normalized === "authorized") return "Assinatura autorizada";
    if (normalized === "pending") return "Assinatura pendente";
    if (normalized === "paused") return "Assinatura pausada";
    if (normalized === "cancelled") return "Assinatura cancelada";
    return normalized ? toPresentationText(normalized) : "Nao se aplica";
  }

  function formatUserQuotaSummary(user) {
    const rawLimit = user && user.planLaudoLimit !== null && user.planLaudoLimit !== undefined
      ? Number(user.planLaudoLimit)
      : null;
    if (!rawLimit) {
      return "Sem franquia de laudos";
    }
    const currentCycleUsage = Math.max(0, Number(user && user.currentCycleUsageCount !== undefined
      ? user.currentCycleUsageCount
      : (user && user.usageCount) || 0));
    const remaining = Number.isFinite(Number(user && user.remainingLaudos))
      ? Math.max(0, Number(user.remainingLaudos))
      : Math.max(0, rawLimit - currentCycleUsage);
    const quotaPeriod = normalizeClientPlanQuotaPeriod(user && user.planQuotaPeriod, user && user.planBillingModel, rawLimit);
    return quotaPeriod === "monthly"
      ? `${remaining} restante(s) de ${rawLimit} no ciclo mensal`
      : `${remaining} restante(s) de ${rawLimit} no ciclo contratado`;
  }

  function normalizeAdminPaymentHistory(entries) {
    if (!Array.isArray(entries)) {
      return [];
    }
    return entries
      .map((entry) => {
        const occurredAt = entry && entry.occurredAt ? new Date(entry.occurredAt) : null;
        return {
          id: String(entry && entry.id ? entry.id : ""),
          title: toPresentationText(entry && entry.title ? entry.title : "Atualizacao comercial"),
          details: toPresentationText(entry && entry.details ? entry.details : ""),
          status: String(entry && entry.status ? entry.status : "info").trim().toLowerCase() || "info",
          provider: toPresentationText(entry && entry.provider ? entry.provider : "manual"),
          source: toPresentationText(entry && entry.source ? entry.source : "system"),
          referenceId: toPresentationText(entry && entry.referenceId ? entry.referenceId : ""),
          amountCents: Number.isFinite(Number(entry && entry.amountCents)) ? Math.max(0, Math.round(Number(entry.amountCents))) : null,
          occurredAt: occurredAt && !Number.isNaN(occurredAt.getTime()) ? occurredAt.toISOString() : "",
          sortValue: occurredAt && !Number.isNaN(occurredAt.getTime()) ? occurredAt.getTime() : 0
        };
      })
      .filter((entry) => entry.title)
      .sort((left, right) => right.sortValue - left.sortValue)
      .slice(0, 6);
  }

  function getPaymentHistoryStatusClass(status) {
    const normalized = String(status || "").trim().toLowerCase();
    if (normalized === "approved" || normalized === "authorized") return "is-approved";
    if (normalized === "pending") return "is-pending";
    if (normalized === "rejected" || normalized === "cancelled" || normalized === "expired" || normalized === "paused") return "is-alert";
    return "is-neutral";
  }

  function formatPaymentHistoryStatusLabel(status) {
    const normalized = String(status || "").trim().toLowerCase();
    if (["approved", "pending", "rejected", "cancelled", "expired"].includes(normalized)) {
      return formatPaymentStatusLabel(normalized);
    }
    return formatSubscriptionStatusLabel(normalized);
  }

  function buildAdminPaymentHistoryHtml(user) {
    const history = normalizeAdminPaymentHistory(user && user.paymentHistory);
    if (!history.length) {
      return '<div class="attachment-empty">Nenhum evento comercial registrado ainda para esta conta.</div>';
    }
    return history.map((entry) => `
      <article class="payment-history-item">
        <div class="payment-history-head">
          <div>
            <strong class="payment-history-title">${escapeHtml(entry.title)}</strong>
            <p>${escapeHtml(entry.details || "Evento sincronizado no cadastro comercial.")}</p>
          </div>
          <span class="payment-history-status ${getPaymentHistoryStatusClass(entry.status)}">${escapeHtml(formatPaymentHistoryStatusLabel(entry.status))}</span>
        </div>
        <div class="payment-history-meta">
          <span class="section-chip">${escapeHtml(entry.provider || "Manual")}</span>
          <span class="section-chip">${escapeHtml(entry.source || "Sistema")}</span>
          ${entry.amountCents !== null ? `<span class="section-chip">${escapeHtml(formatCurrencyCents(entry.amountCents))}</span>` : ""}
          ${entry.referenceId ? `<span class="section-chip">Ref. ${escapeHtml(entry.referenceId)}</span>` : ""}
          <span class="section-chip">${escapeHtml(formatInlineAdminDateTime(entry.occurredAt))}</span>
        </div>
      </article>
    `).join("");
  }

  function ensureRenewalBanner() {
    let banner = document.getElementById("renewalBanner");
    if (banner) {
      return banner;
    }
    const homePanel = document.getElementById("homePanel");
    if (!homePanel) {
      return null;
    }
    banner = document.createElement("section");
    banner.id = "renewalBanner";
    banner.className = "renewal-banner hidden";
    homePanel.insertBefore(banner, homePanel.firstChild);
    return banner;
  }

  function setRenewalBannerNote(message) {
    const note = document.getElementById("renewalBannerNote");
    if (note) {
      note.textContent = message || "";
    }
  }

  function renderBuyerRenewalBanner(session) {
    const banner = ensureRenewalBanner();
    if (!banner) {
      return;
    }

    if (!session || session.role === "admin" || session.isAdmin || normalizeAccountType(session.accountType) === "demo") {
      banner.className = "renewal-banner hidden";
      banner.innerHTML = "";
      return;
    }

    const snapshot = getRenewalSnapshot(session);
    const planLabel = toPresentationText(session.planLabel || "Plano contratado");
    const priceLabel = Number(session.planPriceCents || 0) > 0 ? formatCurrencyCents(session.planPriceCents) : "Valor sob consulta";
    const dueLabel = snapshot.dueAt ? formatInlineAdminDate(snapshot.dueAt) : "Nao informado";
    const paymentLabel = formatPaymentStatusLabel(session.paymentStatus);
    const lastApprovedLabel = session.paymentLastApprovedAt ? formatInlineAdminDate(session.paymentLastApprovedAt) : "Nao informado";
    const stageClass = snapshot.stage === "expired" || snapshot.stage === "urgent"
      ? " is-urgent"
      : snapshot.stage === "attention"
        ? " is-attention"
        : "";

    banner.className = `renewal-banner${stageClass}`;
    banner.innerHTML = `
      <div class="renewal-banner-head">
        <div>
          <span class="section-step">Renovacao comercial</span>
          <h3>${escapeHtml(snapshot.title)}</h3>
          <p>${escapeHtml(snapshot.summary)}</p>
        </div>
        <span class="renewal-badge">${escapeHtml(snapshot.badge)}</span>
      </div>

      <div class="renewal-grid">
        <article class="renewal-item">
          <span>Plano</span>
          <strong>${escapeHtml(planLabel)}</strong>
        </article>
        <article class="renewal-item">
          <span>Investimento</span>
          <strong>${escapeHtml(priceLabel)}</strong>
        </article>
        <article class="renewal-item">
          <span>Vigencia atual</span>
          <strong>${escapeHtml(dueLabel)}</strong>
        </article>
        <article class="renewal-item">
          <span>Status</span>
          <strong>${escapeHtml(`${paymentLabel} - ${formatRenewalDaysLabel(snapshot.daysRemaining)}`)}</strong>
        </article>
      </div>

      <div class="renewal-grid">
        <article class="renewal-item">
          <span>Ultima aprovacao</span>
          <strong>${escapeHtml(lastApprovedLabel)}</strong>
        </article>
        <article class="renewal-item">
          <span>Contato comercial</span>
          <strong>${escapeHtml(session.renewalContactedAt ? formatInlineAdminDateTime(session.renewalContactedAt) : "Nao registrado")}</strong>
        </article>
        <article class="renewal-item">
          <span>Canal do ultimo contato</span>
          <strong>${escapeHtml(toPresentationText(session.renewalContactChannel || "Nao informado"))}</strong>
        </article>
        <article class="renewal-item">
          <span>Link de renovacao</span>
          <strong>${escapeHtml(session.renewalOfferedAt ? "Ja disponibilizado" : "Pode ser solicitado agora")}</strong>
        </article>
      </div>

      <div class="renewal-actions">
        ${snapshot.canRenew ? `<button class="primary-button" type="button" id="buyerRenewalAction">${snapshot.stage === "expired" ? "Recontratar plano" : "Renovar plano"}</button>` : ""}
      </div>

      <p class="status-note" id="renewalBannerNote"></p>
    `;

    const actionButton = document.getElementById("buyerRenewalAction");
    if (actionButton) {
      actionButton.addEventListener("click", handleBuyerRenewalRequest);
    }
  }

  function ensureDashboardMetricCard(cardId, label, extraClass) {
    const strip = document.getElementById("adminDashboardStrip");
    if (!strip) {
      return null;
    }
    let card = document.getElementById(cardId);
    if (card) {
      return card;
    }
    card = document.createElement("article");
    card.id = cardId;
    card.className = `dashboard-card ${extraClass || ""}`.trim();
    card.innerHTML = `<span>${escapeHtml(label)}</span><strong>0</strong>`;
    strip.appendChild(card);
    return card;
  }

  function renderAdminDashboardSummary(summary) {
    const safeSummary = summary || {};
    if (refs.dashboardTotalClients) refs.dashboardTotalClients.textContent = String(Number(safeSummary.totalClients || 0));
    if (refs.dashboardActiveClients) refs.dashboardActiveClients.textContent = String(Number(safeSummary.activeClients || 0));
    if (refs.dashboardDelinquentClients) refs.dashboardDelinquentClients.textContent = String(Number(safeSummary.delinquentClients || 0));
    if (refs.dashboardTotalReports) refs.dashboardTotalReports.textContent = String(Number(safeSummary.totalReports || 0));

    const expiringCard = ensureDashboardMetricCard("dashboardExpiringSoonCard", "Vencendo em breve", "renewal");
    const contactCard = ensureDashboardMetricCard("dashboardRenewalContactCard", "Contato pendente", "contact");
    const pendingCard = ensureDashboardMetricCard("dashboardPendingPaymentsCard", "Pagamentos pendentes", "warning");
    const approvedCard = ensureDashboardMetricCard("dashboardApprovedPaymentsCard", "Pagamentos aprovados", "success");
    const doctorPortfolioCard = ensureDashboardMetricCard("dashboardDoctorPortfolioCard", "Planos medicos", "portfolio");
    const companyPortfolioCard = ensureDashboardMetricCard("dashboardCompanyPortfolioCard", "Planos empresariais", "portfolio");
    if (expiringCard) {
      const strong = expiringCard.querySelector("strong");
      if (strong) strong.textContent = String(Number(safeSummary.expiringSoonClients || 0));
    }
    if (contactCard) {
      const strong = contactCard.querySelector("strong");
      if (strong) strong.textContent = String(Number(safeSummary.renewalContactPendingClients || 0));
    }
    if (pendingCard) {
      const strong = pendingCard.querySelector("strong");
      if (strong) strong.textContent = String(Number(safeSummary.pendingPayments || 0));
    }
    if (approvedCard) {
      const strong = approvedCard.querySelector("strong");
      if (strong) strong.textContent = String(Number(safeSummary.approvedPayments || 0));
    }
    if (doctorPortfolioCard) {
      const strong = doctorPortfolioCard.querySelector("strong");
      if (strong) strong.textContent = String(Number(safeSummary.individualPlanCount || 0));
    }
    if (companyPortfolioCard) {
      const strong = companyPortfolioCard.querySelector("strong");
      if (strong) strong.textContent = String(Number(safeSummary.businessPlanCount || 0));
    }
  }

  function computeLocalDashboardSummary(users) {
    const normalizedUsers = Array.isArray(users) ? users : [];
    const clients = normalizedUsers.filter((item) => item.role !== "admin");
    return {
      totalClients: clients.length,
      activeClients: clients.filter((item) => item.status === "active" && normalizeLocalPaymentStatus(item.paymentStatus) === "approved").length,
      delinquentClients: clients.filter((item) => item.status === "inadimplente" || ["pending", "expired", "rejected", "cancelled"].includes(normalizeLocalPaymentStatus(item.paymentStatus))).length,
      pendingPayments: clients.filter((item) => normalizeLocalPaymentStatus(item.paymentStatus) === "pending").length,
      approvedPayments: clients.filter((item) => normalizeLocalPaymentStatus(item.paymentStatus) === "approved").length,
      totalReports: clients.reduce((sum, item) => sum + Number(item.usageCount || 0), 0),
      expiringSoonClients: clients.filter((item) => {
        const snapshot = getRenewalSnapshot(item);
        return snapshot.stage === "attention" || snapshot.stage === "urgent";
      }).length,
      renewalContactPendingClients: clients.filter((item) => {
        const snapshot = getRenewalSnapshot(item);
        return snapshot.needsContact && !item.renewalContactedAt;
      }).length,
      individualPlanCount: clients.filter((item) => String(item.planId || "").startsWith("individual_")).length,
      businessPlanCount: clients.filter((item) => String(item.planId || "").startsWith("empresarial_")).length
    };
  }

  function getVisibleAdminUsers() {
    const users = Array.isArray(state.adminUsersCache) ? state.adminUsersCache : [];
    const search = normalizeSpacing(state.adminUserSearch || "").toLowerCase();
    const filter = String(state.adminUserFilter || "active_company");
    const filteredUsers = users.filter((user) => {
      const accountType = user.role === "admin" ? "company" : normalizeAccountType(user.accountType);
      const linkedDoctors = user.role !== "admin" && accountType === "company"
        ? normalizeCompanySessionDoctors(user.linkedDoctors)
        : [];
      const linkedDoctorSearch = linkedDoctors.map((doctor) => [
        doctor.name,
        doctor.crm,
        doctor.specialty
      ].join(" ")).join(" ");
      const haystack = [
        user.company,
        user.username,
        user.email,
        user.contactName,
        user.planLabel,
        user.companyCnpj,
        linkedDoctorSearch
      ].map((value) => normalizeSpacing(value || "").toLowerCase()).join(" ");

      if (search && !haystack.includes(search)) {
        return false;
      }

      const snapshot = getRenewalSnapshot(user);
      const isApprovedActiveCompany = user.role !== "admin"
        && accountType === "company"
        && user.status === "active"
        && normalizeLocalPaymentStatus(user.paymentStatus) === "approved";

      if (filter === "active_company") return isApprovedActiveCompany;
      if (filter === "active") return user.status === "active";
      if (filter === "company") return user.role !== "admin" && accountType === "company";
      if (filter === "doctor") return user.role !== "admin" && accountType === "doctor";
      if (filter === "with_doctors") return user.role !== "admin" && accountType === "company" && linkedDoctors.length > 0;
      if (filter === "expiring") return snapshot.stage === "attention" || snapshot.stage === "urgent";
      if (filter === "renewal_contact") return snapshot.needsContact && !user.renewalContactedAt;
      if (filter === "inadimplente") return user.status === "inadimplente" || user.paymentStatus === "expired";
      if (filter === "blocked") return user.status === "blocked";
      if (filter === "pending") return user.paymentStatus === "pending";
      if (filter === "admin") return user.role === "admin";

      return true;
    });

    return filteredUsers.sort((left, right) => {
      const leftAccountType = left.role === "admin" ? "company" : normalizeAccountType(left.accountType);
      const rightAccountType = right.role === "admin" ? "company" : normalizeAccountType(right.accountType);
      const leftIsActiveCompany = left.role !== "admin"
        && leftAccountType === "company"
        && left.status === "active"
        && normalizeLocalPaymentStatus(left.paymentStatus) === "approved";
      const rightIsActiveCompany = right.role !== "admin"
        && rightAccountType === "company"
        && right.status === "active"
        && normalizeLocalPaymentStatus(right.paymentStatus) === "approved";
      const leftRank = leftIsActiveCompany
        ? 0
        : left.role !== "admin" && leftAccountType === "company"
          ? 1
          : left.role === "admin"
            ? 2
            : 3;
      const rightRank = rightIsActiveCompany
        ? 0
        : right.role !== "admin" && rightAccountType === "company"
          ? 1
          : right.role === "admin"
            ? 2
            : 3;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      const leftCompany = normalizeSpacing(left.company || "").toLowerCase();
      const rightCompany = normalizeSpacing(right.company || "").toLowerCase();
      if (leftCompany !== rightCompany) {
        return leftCompany.localeCompare(rightCompany, "pt-BR");
      }

      const leftUsername = normalizeSpacing(left.username || "").toLowerCase();
      const rightUsername = normalizeSpacing(right.username || "").toLowerCase();
      return leftUsername.localeCompare(rightUsername, "pt-BR");
    });
  }

  function buildRenewalMessage(user, snapshot) {
    const company = toPresentationText(user.company || "sua empresa");
    const dueLabel = snapshot && snapshot.dueAt ? formatInlineAdminDate(snapshot.dueAt) : "data nao informada";
    const planLabel = toPresentationText(user.planLabel || "plano atual");

    return [
      `Ola, ${company}.`,
      "",
      `Identificamos que o ${planLabel} no DaviCore Health possui vigencia comercial ate ${dueLabel}.`,
      "Estamos entrando em contato para verificar o interesse na renovacao e evitar interrupcao do acesso.",
      "",
      "Se desejar, podemos encaminhar o link de renovacao e seguir com a continuidade do plano.",
      "",
      "Equipe DaviCore Health"
    ].join("\n");
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return;
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "readonly");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    document.body.removeChild(field);
  }

  async function handleBuyerRenewalRequest() {
    if (!state.sessionUser || state.sessionUser.role === "admin" || state.sessionUser.isAdmin) {
      return;
    }

    try {
      if (state.authProvider === "api") {
        const response = await apiJson("/api/billing/renewal-link", { method: "POST" });
        const checkoutUrl = response && response.checkout
          ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
          : "";

        if (response && response.user) {
          state.sessionUser = response.user;
          renderBuyerRenewalBanner(response.user);
        }

        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank", "noopener");
          setRenewalBannerNote("Link de renovacao aberto em nova guia para conclusao do pagamento.");
        } else {
          setRenewalBannerNote("O link de renovacao foi solicitado, mas nao retornou uma URL valida.");
        }
        return;
      }

      const users = readLocalUsers();
      const index = users.findIndex((item) => item.id === state.sessionUser.id);
      if (index === -1) {
        setRenewalBannerNote("Nao foi possivel localizar a conta local para simular a renovacao.");
        return;
      }

      const current = users[index];
      const baseDate = current.paymentDueAt && new Date(current.paymentDueAt).getTime() > Date.now()
        ? new Date(current.paymentDueAt)
        : new Date();
      const nextDueAt = addMonthsToIso(baseDate, Number(current.billingCycleMonths || 1));
      const updated = {
        ...current,
        status: "active",
        paymentStatus: "approved",
        paymentDueAt: nextDueAt,
        paymentLastApprovedAt: new Date().toISOString(),
        renewalOfferedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users[index] = updated;
      writeLocalUsers(users);

      const session = buildLocalSessionUser(updated);
      persistLocalSessionUser(session);
      state.sessionUser = session;
      renderBuyerRenewalBanner(session);
      setRenewalBannerNote("Renovacao simulada com sucesso no modo local. A vigencia foi estendida para testes.");
    } catch (error) {
      setRenewalBannerNote(error.message || "Nao foi possivel preparar a renovacao neste momento.");
    }
  }

  async function handleInlineAdminRenewalContact(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.renewalContact : "";
    const channel = button ? (button.dataset.channel || "manual") : "manual";
    const note = userId ? document.querySelector(`[data-inline-user-note="${escapeCssSelectorValue(userId)}"]`) : null;

    if (!userId) {
      return;
    }

    try {
      if (state.authProvider === "api") {
        const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}/renewal-contact`, {
          method: "POST",
          body: { channel }
        });

        if (response && response.summary) {
          renderAdminDashboardSummary(response.summary);
        }
        if (note) {
          note.textContent = "Contato de renovacao registrado com sucesso.";
        }
        await loadInlineAdminUsers();
        return;
      }

      const users = readLocalUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) {
        throw new Error("Cliente nao localizado para registrar o contato.");
      }

      users[index] = {
        ...users[index],
        renewalContactedAt: new Date().toISOString(),
        renewalContactChannel: channel,
        updatedAt: new Date().toISOString()
      };
      writeLocalUsers(users);
      if (note) {
        note.textContent = "Contato de renovacao registrado em modo local.";
      }
      await loadInlineAdminUsers();
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel registrar o contato de renovacao.";
      }
    }
  }

  async function handleInlineAdminRenewalMessage(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.renewalMessage : "";
    const note = userId ? document.querySelector(`[data-inline-user-note="${escapeCssSelectorValue(userId)}"]`) : null;
    const user = (Array.isArray(state.adminUsersCache) ? state.adminUsersCache : []).find((item) => item.id === userId);

    if (!user) {
      if (note) {
        note.textContent = "Nao foi possivel localizar o cliente para montar a mensagem.";
      }
      return;
    }

    try {
      await copyTextToClipboard(buildRenewalMessage(user, getRenewalSnapshot(user)));
      if (note) {
        note.textContent = "Mensagem comercial de renovacao copiada para a area de transferencia.";
      }
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel copiar a mensagem de renovacao.";
      }
    }
  }

  async function handleInlineAdminPaymentLink(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.paymentLink : "";
    const note = userId ? document.querySelector(`[data-inline-user-note="${escapeCssSelectorValue(userId)}"]`) : null;

    if (!userId) {
      return;
    }

    try {
      if (state.authProvider === "api") {
        const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}/payment-link`, { method: "POST" });
        const checkoutUrl = response && response.checkout
          ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
          : "";

        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank", "noopener");
        }

        if (note) {
          note.textContent = checkoutUrl
            ? "Link de renovacao gerado com sucesso."
            : "O checkout foi solicitado, mas nao retornou uma URL valida.";
        }

        await loadInlineAdminUsers();
        return;
      }

      const users = readLocalUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) {
        throw new Error("Cliente nao localizado para simular a renovacao.");
      }

      const current = users[index];
      const baseDate = current.paymentDueAt && new Date(current.paymentDueAt).getTime() > Date.now()
        ? new Date(current.paymentDueAt)
        : new Date();
      users[index] = {
        ...current,
        status: "active",
        paymentStatus: "approved",
        paymentDueAt: addMonthsToIso(baseDate, Number(current.billingCycleMonths || 1)),
        paymentLastApprovedAt: new Date().toISOString(),
        renewalOfferedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      writeLocalUsers(users);

      if (note) {
        note.textContent = "Renovacao simulada em modo local e vigencia estendida para testes.";
      }
      await loadInlineAdminUsers();
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel preparar a renovacao do cliente.";
      }
    }
  }

  async function handleInlineAdminApproveCrm(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.crmApprove : "";
    const note = userId ? document.querySelector(`[data-inline-user-note="${escapeCssSelectorValue(userId)}"]`) : null;

    if (!userId) {
      return;
    }

    try {
      if (state.authProvider === "api") {
        const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          body: { crmValidated: true }
        });

        if (response && response.summary) {
          renderAdminDashboardSummary(response.summary);
        }
        if (note) {
          note.textContent = "CRM validado com sucesso. A emissao documental foi liberada para este cadastro medico.";
        }
        await loadInlineAdminUsers();
        return;
      }

      const users = readLocalUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) {
        throw new Error("Cadastro medico nao localizado.");
      }

      users[index] = {
        ...users[index],
        crmValidated: true,
        updatedAt: new Date().toISOString()
      };
      writeLocalUsers(users);

      if (note) {
        note.textContent = "CRM validado em modo local. A emissao documental foi liberada para este cadastro medico.";
      }
      await loadInlineAdminUsers();
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel validar o CRM deste cadastro medico.";
      }
    }
  }

  async function deleteInlineAdminUserData(userId) {
    const users = readLocalUsers();
    const current = users.find((item) => item.id === userId);
    if (!current) {
      throw new Error("Usuario nao localizado.");
    }

    if (state.sessionUser && state.sessionUser.id === userId) {
      throw new Error("Nao e permitido excluir o administrador em uso.");
    }

    const adminCount = users.filter((item) => item.role === "admin").length;
    if (current.role === "admin" && adminCount <= 1) {
      throw new Error("Mantenha pelo menos um administrador ativo na plataforma.");
    }

    const idsToDelete = new Set([userId]);
    let deletedManagedDoctors = 0;

    if (current.role === "buyer" && normalizeAccountType(current.accountType) === "company") {
      users.forEach((item) => {
        if (isCompanyManagedDoctorUser(item) && String(item.linkedCompanyId || "").trim() === current.id) {
          idsToDelete.add(item.id);
          deletedManagedDoctors += 1;
        }
      });
    }

    const nextUsers = users.filter((item) => !idsToDelete.has(item.id));

    if (isCompanyManagedDoctorUser(current) && String(current.linkedCompanyId || "").trim()) {
      const companyIndex = nextUsers.findIndex((item) => item.id === current.linkedCompanyId);
      if (companyIndex >= 0) {
        const companyUser = {
          ...nextUsers[companyIndex],
          linkedDoctors: normalizeCompanySessionDoctors(nextUsers[companyIndex].linkedDoctors),
          activityLog: normalizeCompanySessionActivities(nextUsers[companyIndex].activityLog),
          documentHistory: normalizeCompanySessionDocumentHistory(nextUsers[companyIndex].documentHistory, Number(nextUsers[companyIndex].usageCount || 0))
        };
        const linkedDoctorId = String(current.linkedCompanyDoctorId || "").trim();
        const filteredDoctors = normalizeCompanySessionDoctors(companyUser.linkedDoctors).filter((doctor) => {
          if (linkedDoctorId && doctor.id === linkedDoctorId) {
            return false;
          }
          if (String(doctor.accessUserId || "").trim() === current.id) {
            return false;
          }
          return true;
        });

        nextUsers[companyIndex] = {
          ...companyUser,
          linkedDoctors: filteredDoctors,
          activityLog: appendCompanySessionActivity(companyUser, {
            doctorName: current.contactName || current.username || "Medico corporativo",
            action: `Medico removido pelo painel administrativo (${current.username || "sem usuario"})`
          }),
          updatedAt: new Date().toISOString()
        };
      }
    }

    writeLocalUsers(nextUsers);

    return {
      removedLinkedUsers: Math.max(0, idsToDelete.size - 1),
      message: current.role === "buyer" && normalizeAccountType(current.accountType) === "company"
        ? (deletedManagedDoctors
          ? `Empresa excluida com ${deletedManagedDoctors} acesso(s) medico(s) vinculado(s).`
          : "Empresa excluida com sucesso.")
        : current.role === "admin"
          ? "Administrador excluido com sucesso."
          : "Usuario excluido com sucesso."
    };
  }

  async function handleInlineAdminDeleteUser(event) {
    const button = event.currentTarget;
    const userId = button ? button.dataset.inlineUserDelete : "";
    const note = userId ? document.querySelector(`[data-inline-user-note="${escapeCssSelectorValue(userId)}"]`) : null;
    const user = (Array.isArray(state.adminUsersCache) ? state.adminUsersCache : []).find((item) => item.id === userId);

    if (!userId || !user) {
      if (note) {
        note.textContent = "Nao foi possivel localizar o cadastro para exclusao.";
      }
      return;
    }

    const accountType = user.role === "admin" ? "company" : normalizeAccountType(user.accountType);
    const isCompanyAccount = user.role !== "admin" && accountType === "company";
    const isManagedDoctor = accountType === "doctor"
      && normalizeResponsibilityMode(user.responsibilityMode) === "company"
      && String(user.linkedCompanyId || "").trim();
    const adminCount = (Array.isArray(state.adminUsersCache) ? state.adminUsersCache : []).filter((item) => item.role === "admin").length;

    if (state.sessionUser && state.sessionUser.id === userId) {
      if (note) {
        note.textContent = "Nao e permitido excluir o administrador em uso.";
      }
      return;
    }

    if (user.role === "admin" && adminCount <= 1) {
      if (note) {
        note.textContent = "Mantenha pelo menos um administrador ativo na plataforma.";
      }
      return;
    }

    const companyManagedDoctors = isCompanyAccount
      ? (Array.isArray(state.adminUsersCache) ? state.adminUsersCache : []).filter((item) => (
          normalizeAccountType(item.accountType) === "doctor"
          && normalizeResponsibilityMode(item.responsibilityMode) === "company"
          && String(item.linkedCompanyId || "").trim() === user.id
        )).length
      : 0;

    const confirmationMessage = isCompanyAccount
      ? `Excluir ${user.company || "esta empresa"}? ${companyManagedDoctors ? `Isso removera tambem ${companyManagedDoctors} acesso(s) medico(s) vinculado(s).` : "Esta acao remove o cadastro corporativo permanentemente."}`
      : isManagedDoctor
        ? `Excluir o usuario medico ${user.username || ""}? O medico tambem sera removido da empresa vinculada.`
        : user.role === "admin"
          ? `Excluir o administrador ${user.username || ""}?`
          : `Excluir o usuario ${user.username || ""}?`;

    if (!window.confirm(confirmationMessage.trim())) {
      return;
    }

    try {
      if (state.authProvider === "api") {
        const response = await apiJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "DELETE"
        });

        if (response && response.summary) {
          renderAdminDashboardSummary(response.summary);
        }
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = response.message || "Exclusao concluida com sucesso.";
        }
        await loadInlineAdminUsers();
        return;
      }

      const result = await deleteInlineAdminUserData(userId);
      if (refs.adminStatusNote) {
        refs.adminStatusNote.textContent = result.message || "Exclusao concluida em modo local.";
      }
      await loadInlineAdminUsers();
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel excluir este cadastro.";
      }
    }
  }

  function renderInlineAdminUsers(users) {
    if (!refs.adminUsersGrid) {
      return;
    }

    const totalCount = Array.isArray(state.adminUsersCache) ? state.adminUsersCache.length : 0;
    const adminCount = Array.isArray(state.adminUsersCache)
      ? state.adminUsersCache.filter((item) => item.role === "admin").length
      : 0;
    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = users.length === totalCount
        ? `${totalCount} acesso(s)`
        : `${users.length} de ${totalCount} acesso(s)`;
    }

    if (state.adminExpandedUserId && !users.some((user) => user.id === state.adminExpandedUserId)) {
      state.adminExpandedUserId = "";
    }

    refs.adminUsersGrid.innerHTML = "";

    if (!users.length) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Nenhum acesso encontrado para o filtro aplicado.</div>';
      return;
    }

    users.forEach((user) => {
      const isOpen = state.adminExpandedUserId === user.id;
      const roleLabel = formatRoleLabel(user.role);
      const accountType = user.role === "admin" ? "company" : normalizeAccountType(user.accountType);
      const isCompanyAccount = user.role !== "admin" && accountType === "company";
      const isCurrentAdmin = Boolean(state.sessionUser && state.sessionUser.id === user.id);
      const isLastAdmin = user.role === "admin" && adminCount <= 1;
      const isManagedDoctorAccount = user.role !== "admin"
        && accountType === "doctor"
        && normalizeResponsibilityMode(user.responsibilityMode) === "company"
        && String(user.linkedCompanyId || "").trim();
      const accountTypeLabel = formatAccountTypeLabel(accountType, user.role);
      const accessLabel = user.role === "admin" ? roleLabel : accountTypeLabel;
      const statusLabel = formatStatusLabel(user.status);
      const paymentLabel = formatPaymentStatusLabel(user.paymentStatus);
      const statusClass = escapeHtml(user.status || "active");
      const paymentClass = escapeHtml(normalizeLocalPaymentStatus(user.paymentStatus || "pending"));
      const linkedDoctors = isCompanyAccount ? normalizeCompanySessionDoctors(user.linkedDoctors) : [];
      const linkedDoctorsCount = linkedDoctors.length;
      const cnpjDisplay = isCompanyAccount
        ? (user.companyCnpj ? formatCnpjValue(user.companyCnpj) : "Nao informado")
        : "Nao se aplica";
      const planLabel = user.role === "admin"
        ? "Administracao interna"
        : `${toPresentationText(user.planLabel || "Plano nao definido")} (${formatCurrencyCents(user.planPriceCents || 0)})`;
      const companyName = escapeHtml(toPresentationText(user.company || "Empresa nao informada"));
      const username = escapeHtml(toPresentationText(user.username || "-"));
      const contactName = escapeHtml(toPresentationText(user.contactName || "Sem responsavel informado"));
      const email = escapeHtml(toPresentationText(user.email || "Sem e-mail"));
      const crmDisplay = accountType === "doctor"
        ? formatCrmDisplay(user.crmState, user.crmNumber)
        : "Nao se aplica";
      const crmValidationLabel = accountType === "doctor"
        ? formatCrmValidationLabel(Boolean(user.crmValidated))
        : "Nao se aplica";
      const usageCount = escapeHtml(String(Number(user.usageCount || 0)));
      const dueDate = escapeHtml(formatInlineAdminDate(user.paymentDueAt || user.expiresAt));
      const createdAt = escapeHtml(formatInlineAdminDateTime(user.createdAt));
      const lastAccessAt = escapeHtml(formatInlineAdminDateTime(user.lastAccessAt));
      const notes = escapeHtml(toPresentationText(user.notes || "", true));
      const billingModelLabel = user.role === "admin"
        ? "Administracao interna"
        : formatPlanBillingModelLabel(user.planBillingModel);
      const quotaPeriodLabel = user.role === "admin"
        ? "Sem franquia de laudos"
        : formatPlanQuotaPeriodLabel(user);
      const quotaSummary = user.role === "admin"
        ? "Sem franquia de laudos"
        : formatUserQuotaSummary(user);
      const currentCycleUsageLabel = user.role === "admin"
        ? "Nao se aplica"
        : `${Math.max(0, Number(user.currentCycleUsageCount !== undefined ? user.currentCycleUsageCount : user.usageCount || 0))} utilizado(s) no ciclo`;
      const paymentProviderLabel = user.role === "admin"
        ? "Operacao interna"
        : toPresentationText(user.paymentProvider || "mercadopago");
      const subscriptionStatusLabel = user.role === "admin"
        ? "Nao se aplica"
        : formatSubscriptionStatusLabel(user.mpSubscriptionStatus);
      const lastApprovedLabel = user.paymentLastApprovedAt
        ? escapeHtml(formatInlineAdminDateTime(user.paymentLastApprovedAt))
        : "Nao registrado";
      const paymentHistoryHtml = buildAdminPaymentHistoryHtml(user);
      const renewal = getRenewalSnapshot(user);
      const renewalStageClass = renewal.stage === "attention"
        ? "attention"
        : renewal.stage === "urgent" || renewal.stage === "expired"
          ? "urgent"
          : "";
      const renewalMessage = buildRenewalMessage(user, renewal);
      const deleteLabel = isCompanyAccount
        ? "Excluir empresa"
        : isManagedDoctorAccount
          ? "Excluir usuario medico"
          : user.role === "admin"
            ? "Excluir administrador"
            : "Excluir usuario";
      const deleteWarning = isCompanyAccount
        ? "Esta acao remove a conta empresarial, o historico operacional e todos os acessos medicos derivados deste painel."
        : isManagedDoctorAccount
          ? "Esta acao remove o usuario medico e tambem tira o medico da empresa vinculada."
          : user.role === "admin"
            ? "Use somente quando ja existir outro administrador ativo e validado na plataforma."
            : "A exclusao remove este acesso operacional de forma permanente.";
      const deleteSummary = isCurrentAdmin
        ? "Voce esta usando este administrador agora. Encerre a sessao ou use outro admin para excluir este cadastro."
        : isLastAdmin
          ? "Este e o ultimo administrador ativo. Cadastre ou mantenha outro administrador antes de continuar."
          : isCompanyAccount
            ? (linkedDoctorsCount
              ? `Esta empresa possui ${linkedDoctorsCount} medico(s) vinculado(s); tudo sera removido junto no mesmo fluxo.`
              : "Nenhum medico esta vinculado a esta empresa no momento, entao apenas o cadastro principal sera removido.")
            : isManagedDoctorAccount
              ? "Assim que a exclusao for confirmada, o medico deixara de aparecer tambem dentro da empresa responsavel."
              : user.role === "admin"
                ? "A exclusao revoga o acesso administrativo e encerra sessoes ativas deste usuario."
                : "Depois de excluir, a conta some da base e eventuais sessoes em aberto deixam de valer.";
      const deleteHint = isCurrentAdmin
        ? "Administrador em uso"
        : isLastAdmin
          ? "Ultimo admin ativo"
          : "Acao permanente";
      const deleteDisabledAttr = isCurrentAdmin || isLastAdmin ? " disabled" : "";
      const linkedDoctorsListHtml = isCompanyAccount
        ? (linkedDoctors.length
          ? linkedDoctors.map((doctor) => {
            const doctorName = escapeHtml(toPresentationText(doctor.name || "Medico vinculado"));
            const doctorCrm = escapeHtml(toPresentationText(doctor.crm || "CRM nao informado"));
            const doctorSpecialty = doctor.specialty
              ? ` - ${escapeHtml(toPresentationText(doctor.specialty))}`
              : "";
            const linkedAt = escapeHtml(formatInlineAdminDate(doctor.createdAt));
            return `
              <article class="company-doctor-card">
                <div class="company-doctor-card-head">
                  <div>
                    <h4>${doctorName}</h4>
                    <p>CRM ${doctorCrm}${doctorSpecialty}</p>
                  </div>
                  <span class="section-chip">Vinculado em ${linkedAt}</span>
                </div>
              </article>
            `;
          }).join("")
          : '<div class="attachment-empty">Nenhum medico vinculado a esta empresa ate o momento.</div>')
        : "";
      const mailSubject = encodeURIComponent(`Renovacao do plano DaviCore Health - ${toPresentationText(user.company || "")}`);
      const mailBody = encodeURIComponent(renewalMessage);

      const row = document.createElement("article");
      row.className = `admin-user-row${isOpen ? " is-open" : ""}`;
      row.innerHTML = `
        <button class="admin-user-toggle" type="button" data-admin-user-toggle="${escapeHtml(user.id)}" aria-expanded="${isOpen ? "true" : "false"}">
          <div class="admin-user-main">
            <strong>${companyName}</strong>
            <span>${username} - ${escapeHtml(accessLabel)}</span>
            <span>${contactName} - ${email}</span>
          </div>

          <div class="admin-user-resume">
            <span class="admin-user-chip">Tipo: ${escapeHtml(accountTypeLabel)}</span>
            <span class="admin-user-chip">Plano: ${escapeHtml(planLabel)}</span>
            ${isCompanyAccount ? `<span class="admin-user-chip">CNPJ: ${escapeHtml(cnpjDisplay)}</span>` : ""}
            ${isCompanyAccount ? `<span class="admin-user-chip">Medicos vinculados: ${escapeHtml(String(linkedDoctorsCount))}</span>` : ""}
            ${accountType === "doctor" ? `<span class="admin-user-chip">${escapeHtml(crmDisplay)}</span>` : ""}
            ${accountType === "doctor" ? `<span class="admin-user-chip">CRM ${escapeHtml(crmValidationLabel)}</span>` : ""}
            <span class="admin-user-chip">Laudos: ${usageCount}</span>
            <span class="admin-user-chip">Validade: ${dueDate}</span>
            <span class="admin-user-chip">Ultimo acesso: ${lastAccessAt}</span>
          </div>

          <div class="admin-user-state">
            <div class="user-badges">
              <span class="user-badge ${statusClass}">${escapeHtml(statusLabel)}</span>
              <span class="user-badge ${paymentClass}">${escapeHtml(paymentLabel)}</span>
              ${user.role !== "admin" ? `<span class="renewal-stage-chip ${renewalStageClass}">${escapeHtml(renewal.badge)}</span>` : ""}
            </div>
            <span class="admin-user-chip admin-user-arrow">${isOpen ? "Recolher ficha" : "Abrir ficha"}</span>
          </div>
        </button>

        <div class="admin-user-detail"${isOpen ? "" : " hidden"}>
          <div class="admin-user-section">
            <div class="admin-user-section-head">
              <div>
                <h4>Resumo comercial e operacional</h4>
                <p>Consulte rapidamente plano, validade, uso e dados de auditoria antes de editar o cadastro.</p>
              </div>
            </div>

            <div class="user-meta">
              <div class="meta-box"><strong>Tipo de cadastro</strong><span>${escapeHtml(accountTypeLabel)}</span></div>
              <div class="meta-box"><strong>Plano contratado</strong><span>${escapeHtml(planLabel)}</span></div>
              <div class="meta-box"><strong>CNPJ</strong><span>${escapeHtml(cnpjDisplay)}</span></div>
              <div class="meta-box"><strong>Medicos vinculados</strong><span>${escapeHtml(String(linkedDoctorsCount))}</span></div>
              <div class="meta-box"><strong>Laudos gerados</strong><span>${usageCount}</span></div>
              <div class="meta-box"><strong>CRM</strong><span>${escapeHtml(crmDisplay)}</span></div>
              <div class="meta-box"><strong>Validacao do CRM</strong><span>${escapeHtml(crmValidationLabel)}</span></div>
              <div class="meta-box"><strong>Vigencia atual</strong><span>${dueDate}</span></div>
              <div class="meta-box"><strong>Criado em</strong><span>${createdAt}</span></div>
              <div class="meta-box"><strong>Ultimo acesso</strong><span>${lastAccessAt}</span></div>
              <div class="meta-box"><strong>Pagamento</strong><span>${escapeHtml(paymentLabel)}</span></div>
            </div>
          </div>

          ${user.role !== "admin" ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Cobranca, franquia e assinatura</h4>
                  <p>Veja o modelo financeiro do cliente, a franquia ativa e o status operacional da cobranca sem sair da ficha.</p>
                </div>
              </div>

              <div class="admin-payment-grid">
                <article class="admin-payment-box">
                  <span>Modelo de cobranca</span>
                  <strong>${escapeHtml(billingModelLabel)}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Franquia do plano</span>
                  <strong>${escapeHtml(quotaSummary)}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Consumo do ciclo</span>
                  <strong>${escapeHtml(currentCycleUsageLabel)}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Periodicidade</span>
                  <strong>${escapeHtml(quotaPeriodLabel)}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Ultima aprovacao</span>
                  <strong>${lastApprovedLabel}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Status da assinatura</span>
                  <strong>${escapeHtml(subscriptionStatusLabel)}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Gateway</span>
                  <strong>${escapeHtml(paymentProviderLabel)}</strong>
                </article>
                <article class="admin-payment-box">
                  <span>Referencias MP</span>
                  <strong>${escapeHtml(user.mpSubscriptionId || user.mpLastPaymentId || user.mpPreferenceId || "Nao registrado")}</strong>
                </article>
              </div>
            </div>

            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Historico comercial</h4>
                  <p>Acompanhe checkout, aprovacoes, recusas, renovacoes e ajustes administrativos em ordem cronologica.</p>
                </div>
              </div>
              <div class="payment-history-list">
                ${paymentHistoryHtml}
              </div>
            </div>
          ` : ""}

          ${user.role !== "admin" ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Radar de renovacao</h4>
                  <p>Visualize a janela comercial do cliente e execute o follow-up com mais rapidez.</p>
                </div>
              </div>

              <div class="admin-renewal-grid">
                <article class="admin-renewal-box">
                  <span>Estagio</span>
                  <strong>${escapeHtml(renewal.title)}</strong>
                </article>
                <article class="admin-renewal-box">
                  <span>Tempo restante</span>
                  <strong>${escapeHtml(formatRenewalDaysLabel(renewal.daysRemaining))}</strong>
                </article>
                <article class="admin-renewal-box">
                  <span>Ultimo contato</span>
                  <strong>${escapeHtml(user.renewalContactedAt ? formatInlineAdminDateTime(user.renewalContactedAt) : "Nao registrado")}</strong>
                </article>
              </div>
            </div>
          ` : ""}

          ${user.role !== "admin" ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Renovacao e contato</h4>
                  <p>Gere o link comercial e registre o follow-up feito com o contratante.</p>
                </div>
              </div>

              <div class="admin-user-quick-actions">
                ${user.email ? `<a class="ghost-button" href="mailto:${encodeURIComponent(user.email)}?subject=${mailSubject}&body=${mailBody}">Abrir e-mail</a>` : ""}
                <button class="ghost-button" type="button" data-renewal-message="${escapeHtml(user.id)}">Copiar mensagem</button>
                <button class="ghost-button" type="button" data-renewal-contact="${escapeHtml(user.id)}" data-channel="${user.email ? "email" : "manual"}">Marcar contato</button>
                ${user.mpCheckoutUrl ? `<a class="ghost-button" href="${escapeHtml(user.mpCheckoutUrl)}" target="_blank" rel="noopener">Abrir checkout atual</a>` : ""}
                <button class="primary-button" type="button" data-payment-link="${escapeHtml(user.id)}">${renewal.stage === "expired" ? "Gerar recontratacao" : "Gerar renovacao"}</button>
              </div>
            </div>
          ` : ""}

          ${accountType === "doctor" ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Validacao do CRM</h4>
                  <p>Libere a emissao documental somente depois da conferencia administrativa do cadastro medico.</p>
                </div>
              </div>

              <div class="admin-user-quick-actions">
                ${user.crmValidated
                  ? '<span class="user-badge active">CRM validado para emissao</span>'
                  : `<button class="primary-button" type="button" data-crm-approve="${escapeHtml(user.id)}">CRM valido liberar emissao</button>`}
              </div>
            </div>
          ` : ""}

          ${isCompanyAccount ? `
            <div class="admin-user-section">
              <div class="admin-user-section-head">
                <div>
                  <h4>Medicos vinculados a esta empresa</h4>
                  <p>Acompanhe pelo painel administrativo quais medicos estao cadastrados dentro do ambiente corporativo.</p>
                </div>
              </div>
              <div class="company-doctors-list">
                ${linkedDoctorsListHtml}
              </div>
            </div>
          ` : ""}

          <div class="admin-user-section">
            <div class="admin-user-section-head">
              <div>
                <h4>Cadastro e acesso</h4>
                <p>Atualize dados do cadastro, plano, status, vencimento, CRM e senha sem sair desta ficha.</p>
              </div>
            </div>

            <form class="user-edit-grid" data-inline-user-id="${escapeHtml(user.id)}" novalidate>
              <label class="field"><span>Empresa</span><input type="text" name="company" value="${companyName}"></label>
              <label class="field"><span>Responsavel</span><input type="text" name="contactName" value="${escapeHtml(toPresentationText(user.contactName || ""))}"></label>
              <label class="field"><span>E-mail</span><input type="email" name="email" value="${escapeHtml(toPresentationText(user.email || ""))}"></label>
              <label class="field"><span>Usuario</span><input type="text" name="username" value="${escapeHtml(toPresentationText(user.username || ""))}"></label>
              <label class="field"><span>Perfil</span><select name="role"><option value="buyer"${user.role === "buyer" ? " selected" : ""}>Empresa</option><option value="admin"${user.role === "admin" ? " selected" : ""}>Administrador</option></select></label>
              <label class="field"><span>Tipo de cadastro</span><select name="accountType"><option value="company"${accountType === "company" ? " selected" : ""}>Empresa</option><option value="doctor"${accountType === "doctor" ? " selected" : ""}>Medico</option></select></label>
              <label class="field"><span>CRM</span><input type="text" name="crmNumber" inputmode="numeric" value="${escapeHtml(String(user.crmNumber || "").replace(/\D/g, ""))}"></label>
              <label class="field"><span>UF do CRM</span><select name="crmState">${buildCrmStateOptionsHtml(user.crmState || "")}</select></label>
              <label class="field"><span>Validacao do CRM</span><select name="crmValidated"><option value="false"${!user.crmValidated ? " selected" : ""}>Pendente</option><option value="true"${user.crmValidated ? " selected" : ""}>Validado</option></select></label>
              <label class="field"><span>Status do acesso</span><select name="status"><option value="active"${user.status === "active" ? " selected" : ""}>Ativo</option><option value="blocked"${user.status === "blocked" ? " selected" : ""}>Bloqueado</option><option value="inadimplente"${user.status === "inadimplente" ? " selected" : ""}>Inadimplente</option></select></label>
              <label class="field"><span>Status do pagamento</span><select name="paymentStatus"><option value="pending"${user.paymentStatus === "pending" ? " selected" : ""}>Pendente</option><option value="approved"${user.paymentStatus === "approved" ? " selected" : ""}>Aprovado</option><option value="rejected"${user.paymentStatus === "rejected" ? " selected" : ""}>Recusado</option><option value="cancelled"${user.paymentStatus === "cancelled" ? " selected" : ""}>Cancelado</option><option value="expired"${user.paymentStatus === "expired" ? " selected" : ""}>Vencido</option></select></label>
              <label class="field"><span>Plano</span><select name="planId">${buildPlanOptionsHtml(user.planId || "mensal", true)}</select></label>
              <label class="field"><span>Vencimento</span><input type="date" name="paymentDueAt" value="${escapeHtml(formatInlineAdminDateInput(user.paymentDueAt || user.expiresAt))}"></label>
              <label class="field"><span>Nova senha</span><input type="password" name="password" placeholder="Preencha apenas se quiser trocar"></label>
              <label class="field field-full"><span>Observacoes internas</span><textarea name="notes" rows="3">${notes}</textarea></label>
              <div class="form-actions field-full">
                <button class="primary-button" type="submit">Salvar alteracoes</button>
              </div>
            </form>
          </div>

          <div class="admin-user-section admin-user-section-danger">
            <div class="admin-user-section-head">
              <div>
                <h4>Exclusao controlada</h4>
                <p>${escapeHtml(deleteWarning)}</p>
              </div>
              <span class="section-chip">${escapeHtml(deleteHint)}</span>
            </div>

            <div class="admin-user-quick-actions admin-user-danger-actions">
              <p class="danger-copy">${escapeHtml(deleteSummary)}</p>
              <button class="ghost-button danger-button" type="button" data-inline-user-delete="${escapeHtml(user.id)}"${deleteDisabledAttr}>${escapeHtml(deleteLabel)}</button>
            </div>
          </div>

          <p class="status-note" data-inline-user-note="${escapeHtml(user.id)}"></p>
        </div>
      `;

      refs.adminUsersGrid.appendChild(row);
    });

    refs.adminUsersGrid.querySelectorAll("[data-admin-user-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleInlineAdminUser(button.dataset.adminUserToggle || "");
      });
    });

    refs.adminUsersGrid.querySelectorAll("form[data-inline-user-id]").forEach((form) => {
      form.addEventListener("submit", handleInlineAdminUpdateUser);
    });

    refs.adminUsersGrid.querySelectorAll("[data-payment-link]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminPaymentLink);
    });

    refs.adminUsersGrid.querySelectorAll("[data-renewal-contact]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminRenewalContact);
    });

    refs.adminUsersGrid.querySelectorAll("[data-renewal-message]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminRenewalMessage);
    });

    refs.adminUsersGrid.querySelectorAll("[data-crm-approve]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminApproveCrm);
    });

    refs.adminUsersGrid.querySelectorAll("[data-inline-user-delete]").forEach((button) => {
      button.addEventListener("click", handleInlineAdminDeleteUser);
    });
  }

  function applyAuthenticatedSession(session) {
    state.sessionUser = session || null;
    const isAdminSession = Boolean(session && (session.role === "admin" || session.isAdmin));

    if (refs.authShell) {
      refs.authShell.classList.add("hidden");
    }

    if (refs.adminShell) {
      refs.adminShell.classList.toggle("hidden", !isAdminSession);
    }
    if (refs.appShell) {
      refs.appShell.classList.toggle("hidden", isAdminSession);
    }

    if (isAdminSession) {
      renderBuyerRenewalBanner(null);
      setAuthAccessType("admin", { preserveMode: true });
      if (refs.adminSessionUserLabel) {
        refs.adminSessionUserLabel.textContent = session && session.company
          ? `${session.username} - ${session.company}`
          : (session && session.username ? session.username : "Administrador");
      }
      if (refs.adminPanel) {
        refs.adminPanel.classList.remove("hidden");
      }
      setAdminView(state.adminCurrentView || "overview");
      state.adminPanelOpen = true;
      loadInlineAdminUsers().catch((error) => {
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = error.message || "Nao foi possivel carregar os acessos cadastrados.";
        }
      });
      return;
    }

    setAuthAccessType("buyer", { preserveMode: true });
    if (refs.sessionUserLabel) {
      refs.sessionUserLabel.textContent = session && session.company
        ? `${session.username} - ${session.company}`
        : (session && session.username ? session.username : "Sessao ativa");
    }

    if (refs.reportCompany && !refs.reportCompany.value && session && session.company) {
      refs.reportCompany.value = session.company;
    }

    renderBuyerRenewalBanner(session);
  }

  function scrollPlansIntoView() {
    const target = document.getElementById("modernPlans") || document.getElementById("salesLanding");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeAuthPanel(clearStatus = false) {
    document.body.classList.remove("auth-panel-open");
    if (clearStatus) {
      setAuthStatus("");
    }
  }

  function openAuthPanel(options = {}) {
    const accessType = options.accessType === "admin" ? "admin" : "buyer";
    const requestedMode = accessType === "admin"
      ? (options.mode || ((state.authBootstrap && state.authBootstrap.configured) ? "login" : "setup"))
      : (options.mode || "login");
    const panel = document.getElementById("authPanel");

    if (accessType === "buyer") {
      state.commercialJourney = normalizeCommercialJourney(options.journey || state.commercialJourney || "company");
      syncCommercialJourneyUI();
    }

    state.authAccessTouched = true;
    setAuthAccessType(accessType, { preserveMode: true });
    setAuthMode(requestedMode);

    if (accessType === "buyer") {
      syncCommercialJourneyUI();
    }

    document.body.classList.add("auth-panel-open");
    if (panel) {
      panel.scrollTop = 0;
    }

    if (typeof options.status === "string") {
      setAuthStatus(options.status);
    }

    const focusTarget = options.focusTarget
      || (requestedMode === "setup"
        ? refs.setupCompany
        : requestedMode === "register"
          ? refs.registerCompany
          : refs.loginUsername);

    window.requestAnimationFrame(() => {
      if (panel) {
        panel.scrollTop = 0;
      }
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus();
      }
    });
  }

  function initHeroInsights() {
    const titleElement = document.getElementById("heroInsightTitle");
    const textElement = document.getElementById("heroInsightText");
    const visual = document.getElementById("heroInsightVisual");
    const dots = Array.from(document.querySelectorAll("#heroInsightDots .hero-insight-dot"));

    if (!titleElement || !textElement || !visual || !dots.length || state.heroInsightsStarted) {
      return;
    }

    state.heroInsightsStarted = true;

    const insights = [
      {
        title: "Triagem guiada por tipo de deficiência",
        text: "Campos estruturados reduzem retrabalho e ajudam a manter o parecer técnico mais consistente desde o primeiro registro."
      },
      {
        title: "Fluxos separados por perfil de contratação",
        text: "Empresa, médico e administração operam jornadas distintas, com governança clara e menor risco de uso indevido."
      },
      {
        title: "Laudo estruturado desde a triagem",
        text: "A coleta essencial fica orientada desde o início para sustentar descrição clínica, limitações funcionais e documentação complementar."
      }
    ];

    let index = 0;
    const render = (animate = false) => {
      const item = insights[index];
      const commit = () => {
        titleElement.textContent = item.title;
        textElement.textContent = item.text;
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      };

      if (!animate) {
        commit();
        return;
      }

      visual.classList.add("is-transitioning");
      window.setTimeout(() => {
        commit();
        window.requestAnimationFrame(() => {
          visual.classList.remove("is-transitioning");
        });
      }, 170);
    };

    render();
    window.setInterval(() => {
      index = (index + 1) % insights.length;
      render(true);
    }, 4200);
  }

  function toUsernameSeed(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "")
      .replace(/\.{2,}/g, ".")
      .slice(0, 28);
  }

  function buildRegisterUsernameSuggestions() {
    const journey = getCommercialJourney();
    const companySeed = toUsernameSeed(refs.registerCompany ? refs.registerCompany.value : "");
    const contactSeed = toUsernameSeed(refs.registerContactName ? refs.registerContactName.value : "");
    const crmSeed = refs.registerDoctorCrm ? String(refs.registerDoctorCrm.value || "").replace(/\D/g, "") : "";
    const base = journey === "doctor"
      ? (companySeed || contactSeed || "medico")
      : (companySeed || contactSeed || "empresa");
    const suggestions = journey === "doctor"
      ? [
          `dr.${base}`,
          `med.${base}`,
          crmSeed ? `crm${crmSeed}` : "",
          `${base}.saude`
        ]
      : [
          `${base}.rh`,
          `${base}.pcd`,
          `${base}.ocupacional`,
          `admin.${base}`
        ];

    return suggestions
      .map((value) => value.replace(/\.{2,}/g, ".").replace(/^\.+|\.+$/g, "").slice(0, 32))
      .filter((value, index, list) => value && list.indexOf(value) === index);
  }

  function updateRegisterUsernameSuggestions() {
    if (!refs.registerUsernameSuggestions) {
      return;
    }

    const suggestions = buildRegisterUsernameSuggestions();
    refs.registerUsernameSuggestions.innerHTML = suggestions.map((suggestion) => (
      `<button class="login-suggestion-chip" type="button" data-username-suggestion="${escapeHtml(suggestion)}">${escapeHtml(suggestion)}</button>`
    )).join("");

    refs.registerUsernameSuggestions.querySelectorAll("[data-username-suggestion]").forEach((button) => {
      button.addEventListener("click", () => {
        if (refs.registerUsername) {
          refs.registerUsername.value = button.dataset.usernameSuggestion || "";
          refs.registerUsername.focus();
        }
      });
    });
  }

  function openOperationalJourney(journey, focusField) {
    clearDemoCommercialState();
    state.commercialJourney = normalizeCommercialJourney(journey);
    syncCommercialJourneyUI();
    openAuthPanel({
      accessType: "buyer",
      mode: "register",
      journey: state.commercialJourney,
      focusTarget: refs.registerCompany,
      status: state.commercialJourney === "doctor"
        ? "Plano médico selecionado. Informe CRM, CPF e data de nascimento. A emissão será liberada somente após validação administrativa do CRM."
        : "Plano empresa selecionado. Complete o cadastro comercial para liberar o dashboard administrativo corporativo."
    });
    if (typeof focusField === "function") {
      window.requestAnimationFrame(() => focusField());
    }
  }

  function getDemoReadOnlyTargets() {
    return Array.from(document.querySelectorAll([
      "[data-module]",
      "#workspace input",
      "#workspace select",
      "#workspace textarea",
      "#workspace button",
      "#reportExternalFiles",
      "#audioFile",
      "#audioParsePaste"
    ].join(",")));
  }

  function setDemoReadOnly(enabled) {
    getDemoReadOnlyTargets().forEach((element) => {
      if (!element || !("disabled" in element)) {
        return;
      }

      if (enabled) {
        if (!Object.prototype.hasOwnProperty.call(element.dataset, "demoPrevDisabled")) {
          element.dataset.demoPrevDisabled = element.disabled ? "1" : "0";
        }
        element.disabled = true;
        element.classList.add("demo-locked");
        return;
      }

      if (Object.prototype.hasOwnProperty.call(element.dataset, "demoPrevDisabled")) {
        element.disabled = element.dataset.demoPrevDisabled === "1";
        delete element.dataset.demoPrevDisabled;
      } else {
        element.disabled = false;
      }
      element.classList.remove("demo-locked");
    });
  }

  function hideDemoTour() {
    document.querySelectorAll(".demo-highlight").forEach((element) => {
      element.classList.remove("demo-highlight");
    });

    const root = document.getElementById("demoTour");
    if (root) {
      root.classList.remove("is-visible");
      root.innerHTML = "";
    }
  }

  function ensureDemoTourRoot() {
    let root = document.getElementById("demoTour");
    if (!root) {
      root = document.createElement("aside");
      root.id = "demoTour";
      root.className = "demo-tour";
      document.body.appendChild(root);
    }
    return root;
  }

  function getDemoTourSteps() {
    return [
      {
        title: "Visao geral da plataforma",
        body: "Esta etapa apresenta a proposta do sistema, os principios de uso e a leitura rapida da jornada de enquadramento.",
        selector: "#homePanel .intro-card",
        prepare() {
          if (typeof showHome === "function") {
            showHome();
          }
        }
      },
      {
        title: "Modulos de analise",
        body: "Aqui ficam os modulos guiados por tipo de deficiencia. Na demonstracao eles sao apresentados apenas para navegacao assistida.",
        selector: "#homePanel .module-grid",
        prepare() {
          if (typeof showHome === "function") {
            showHome();
          }
        }
      },
      {
        title: "Ficha tecnica guiada",
        body: "Ao entrar em um modulo, o sistema abre apenas os campos compativeis com aquele tipo de caso e conduz o preenchimento do operador.",
        selector: "#assessmentForm",
        prepare() {
          if (typeof setActiveModule === "function") {
            setActiveModule("fisica");
          }
        }
      },
      {
        title: "Resultado e saida documental",
        body: "O painel final exibe enquadramento, descricao tecnica e limitacoes funcionais. Na demonstracao, classificacao, emissao e impressao permanecem bloqueadas.",
        selector: "#resultCard",
        prepare() {
          if (typeof setActiveModule === "function") {
            setActiveModule("fisica");
          }
        }
      }
    ];
  }

  function renderDemoTour() {
    if (!state.demoModeEnabled) {
      hideDemoTour();
      return;
    }

    const steps = getDemoTourSteps();
    const safeIndex = Math.max(0, Math.min(Number(state.demoTourStep || 0), steps.length - 1));
    state.demoTourStep = safeIndex;

    const step = steps[safeIndex];
    if (step && typeof step.prepare === "function") {
      step.prepare();
    }

    hideDemoTour();

    const target = step && step.selector ? document.querySelector(step.selector) : null;
    if (target) {
      target.classList.add("demo-highlight");
      if (typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    const root = ensureDemoTourRoot();
    root.classList.add("is-visible");
    root.innerHTML = `
      <div class="demo-tour-card">
        <div class="demo-tour-kicker">
          <span>Demonstracao guiada</span>
          <span class="demo-tour-step">Etapa ${safeIndex + 1} de ${steps.length}</span>
        </div>
        <div>
          <h4>${escapeHtml(step.title || "Demonstracao")}</h4>
          <p>${escapeHtml(step.body || "")}</p>
        </div>
        <div class="demo-tour-actions">
          <button class="ghost-button" type="button" data-demo-tour-close>Sair da demo</button>
          ${safeIndex > 0 ? '<button class="ghost-button" type="button" data-demo-tour-prev>Anterior</button>' : ""}
          <button class="primary-button" type="button" data-demo-tour-next>${safeIndex >= steps.length - 1 ? "Encerrar visita" : "Proximo passo"}</button>
        </div>
      </div>
    `;

    const closeButton = root.querySelector("[data-demo-tour-close]");
    const prevButton = root.querySelector("[data-demo-tour-prev]");
    const nextButton = root.querySelector("[data-demo-tour-next]");

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        handleLogout();
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        state.demoTourStep = Math.max(0, safeIndex - 1);
        renderDemoTour();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (safeIndex >= steps.length - 1) {
          handleLogout();
          return;
        }
        state.demoTourStep = Math.min(steps.length - 1, safeIndex + 1);
        renderDemoTour();
      });
    }
  }

  function clearDemoCommercialState() {
    document.body.classList.remove("demo-mode");
    state.demoModeEnabled = false;
    state.demoTourStep = 0;
    setDemoReadOnly(false);
    hideDemoTour();
    if (state.authProvider === "demo") {
      state.authProvider = "api";
    }
  }

  function startDemoAccess() {
    clearDemoCommercialState();
    document.body.classList.add("demo-mode");
    state.demoModeEnabled = true;
    state.demoTourStep = 0;
    state.commercialJourney = "demo";
    state.authProvider = "demo";

    applyAuthenticatedSession({
      id: `demo_${Date.now()}`,
      company: "DaviCore Health Demonstracao",
      contactName: "Sessao guiada",
      email: "",
      username: "demo",
      role: "buyer",
      status: "active",
      paymentStatus: "approved",
      paymentDueAt: null,
      planId: "demo",
      planLabel: "Modo Demonstracao Guiada",
      usageCount: 0,
      lastAccessAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: false,
      accountType: "demo",
      crmNumber: "",
      crmState: "",
      crmValidated: false,
      canAccess: true
    });
  }

  function initAuth() {
    applyInterfaceCopyRefinements();
    const heroPlansButton = document.getElementById("heroPlansButton");
    const heroLoginButton = document.getElementById("heroLoginButton");
    const heroCompanyButton = document.getElementById("heroCompanyButton");
    const companyPlanButton = document.getElementById("companyPlanButton");
    const doctorPlanButton = document.getElementById("doctorPlanButton");
    const demoPlanButton = document.getElementById("demoPlanButton");
    const authPanelCloseButton = document.getElementById("authPanelClose");

    const openBuyerLogin = () => {
      clearDemoCommercialState();
      openAuthPanel({
        accessType: "buyer",
        mode: "login",
        journey: "company",
        focusTarget: refs.loginUsername,
        status: "Entre com a conta contratada para acessar a área profissional."
      });
    };

    const openAdminAccess = () => {
      clearDemoCommercialState();
      openAuthPanel({
        accessType: "admin",
        mode: state.authBootstrap && state.authBootstrap.configured ? "login" : "setup",
        focusTarget: state.authBootstrap && state.authBootstrap.configured ? refs.loginUsername : refs.setupCompany,
        status: state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais administrativas da plataforma."
          : "Configure agora o primeiro administrador da plataforma."
      });
    };

    state.commercialJourney = normalizeCommercialJourney(state.commercialJourney || "company");
    state.demoModeEnabled = false;

    if (refs.loginForm) refs.loginForm.addEventListener("submit", handleLoginSubmit);
    if (refs.registerForm) refs.registerForm.addEventListener("submit", handlePublicRegistration);
    if (refs.setupForm) refs.setupForm.addEventListener("submit", handleSetupSubmit);
    if (refs.registerPlan) refs.registerPlan.addEventListener("change", () => syncCommercialJourneyUI());

    if (refs.showSetupButton) {
      refs.showSetupButton.addEventListener("click", () => {
        openAdminAccess();
      });
    }

    if (refs.showRegisterButton) {
      refs.showRegisterButton.addEventListener("click", () => {
        closeAuthPanel();
        scrollPlansIntoView();
      });
    }

    if (refs.showLoginButton) {
      refs.showLoginButton.addEventListener("click", () => {
        if (state.authAccessType === "admin") {
          openAdminAccess();
          return;
        }
        openBuyerLogin();
      });
    }

    if (refs.showLoginFromRegisterButton) {
      refs.showLoginFromRegisterButton.addEventListener("click", () => {
        openBuyerLogin();
      });
    }

    if (heroPlansButton) {
      heroPlansButton.addEventListener("click", () => {
        closeAuthPanel();
        scrollPlansIntoView();
      });
    }

    if (heroLoginButton) heroLoginButton.addEventListener("click", openBuyerLogin);
    if (heroCompanyButton) heroCompanyButton.addEventListener("click", () => openOperationalJourney("company"));
    if (companyPlanButton) companyPlanButton.addEventListener("click", () => openOperationalJourney("company"));
    if (doctorPlanButton) doctorPlanButton.addEventListener("click", () => openOperationalJourney("doctor"));
    if (demoPlanButton) demoPlanButton.addEventListener("click", startDemoAccess);

    if (authPanelCloseButton) {
      authPanelCloseButton.addEventListener("click", () => {
        closeAuthPanel();
      });
    }

    if (refs.logoutButton) refs.logoutButton.addEventListener("click", handleLogout);
    if (refs.adminLogoutButton) refs.adminLogoutButton.addEventListener("click", handleLogout);

    if (refs.accessBuyerButton) {
      refs.accessBuyerButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode(state.authMode === "setup" ? "login" : (state.authMode || "login"));
        syncCommercialJourneyUI();
        const panel = document.getElementById("authPanel");
        if (panel) panel.scrollTop = 0;
        setAuthStatus("Entrada operacional para empresa contratante ou médico autenticado.");
      });
    }

    if (refs.accessAdminButton) {
      refs.accessAdminButton.addEventListener("click", () => {
        state.authAccessTouched = true;
        setAuthAccessType("admin", { preserveMode: true });
        setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
        const panel = document.getElementById("authPanel");
        if (panel) panel.scrollTop = 0;
        setAuthStatus(state.authBootstrap && state.authBootstrap.configured
          ? "Informe as credenciais administrativas da plataforma."
          : "Fluxo inicial para configurar o administrador principal.");
      });
    }

    if (refs.reportWorkerCpf) refs.reportWorkerCpf.addEventListener("input", handleCpfMaskInput);
    if (refs.registerDoctorCpf) refs.registerDoctorCpf.addEventListener("input", handleCpfMaskInput);
    if (refs.registerCompanyCnpj) refs.registerCompanyCnpj.addEventListener("input", handleCnpjMaskInput);
    if (refs.registerCompany) refs.registerCompany.addEventListener("input", updateRegisterUsernameSuggestions);
    if (refs.registerContactName) refs.registerContactName.addEventListener("input", updateRegisterUsernameSuggestions);
    if (refs.registerDoctorCrm) refs.registerDoctorCrm.addEventListener("input", updateRegisterUsernameSuggestions);

    if (!state.demoGuardBound) {
      state.demoGuardBound = true;

      if (refs.assessmentForm) {
        refs.assessmentForm.addEventListener("submit", (event) => {
          if (!state.demoModeEnabled) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          renderDemoTour();
        }, true);
      }

      refs.moduleButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          if (!state.demoModeEnabled) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          renderDemoTour();
        }, true);
      });
    }

    if (!state.authEscapeBound) {
      state.authEscapeBound = true;
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.body.classList.contains("auth-panel-open")) {
          closeAuthPanel();
        }
      });
    }

    initHeroInsights();
    updateRegisterUsernameSuggestions();
    loadAuthBootstrap();
  }

  function updateAuthEntryCopy() {
    const isAdmin = state.authAccessType === "admin";
    const isRegister = state.authMode === "register";
    const isSetup = state.authMode === "setup";
    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const providerLabel = state.authProvider === "local" ? "local" : "SaaS";
    const accessGrid = document.getElementById("authAccessGrid");

    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = isSetup
        ? "Configuração do administrador"
        : isRegister
          ? (isDoctorJourney ? "Cadastro médico" : "Cadastro empresarial")
          : (isAdmin ? `Acesso administrador ${providerLabel}` : `Acesso profissional ${providerLabel}`);
    }

    if (refs.authTitle) {
      refs.authTitle.textContent = isSetup
        ? "Configurar administrador da plataforma"
        : isRegister
          ? (isDoctorJourney ? "Solicitar plano médico" : "Solicitar plano empresarial")
          : (isAdmin ? "Entrar no painel administrativo" : "Entrar na área profissional");
    }

    if (refs.authDescription) {
      refs.authDescription.textContent = isSetup
        ? "Fluxo inicial do administrador principal da plataforma."
        : isRegister
          ? (isDoctorJourney
            ? "Cadastro exclusivo para médico com CRM válido, assinatura mensal de 30 laudos ou pacote avulso, sempre condicionado ao pagamento aprovado."
            : "Cadastro empresarial voltado ao dashboard administrativo, gestao de medicos vinculados e indicadores de uso.")
          : (isAdmin
            ? "Entrada restrita para clientes, pagamentos, bloqueios, renovações e acompanhamento de uso."
            : "Use este acesso para entrar com a conta contratada. Empresas acessam o dashboard administrativo; medicos autenticados acessam a area tecnica.");
    }

    if (refs.loginSubmitButton) {
      refs.loginSubmitButton.textContent = isAdmin ? "Entrar no painel administrativo" : "Entrar na área profissional";
    }

    if (refs.showRegisterButton) {
      refs.showRegisterButton.textContent = "Ver planos";
      refs.showRegisterButton.classList.toggle("hidden", isAdmin || isRegister || isSetup);
    }

    if (refs.showLoginFromRegisterButton) {
      refs.showLoginFromRegisterButton.textContent = "Voltar para login";
    }

    if (refs.showSetupButton) {
      refs.showSetupButton.classList.toggle("hidden", !isAdmin || isSetup || (state.authBootstrap && state.authBootstrap.configured));
    }

    if (accessGrid) {
      accessGrid.classList.toggle("hidden", isRegister || isSetup);
    }

    syncCommercialJourneyUI();
  }

  function applyInterfaceCopyRefinements() {
    document.title = "DaviCore Health | Planos e acesso profissional";

    const setText = (selector, text) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = text;
    };

    const setHtml = (selector, html) => {
      const element = document.querySelector(selector);
      if (!element) return;
      const normalizedCurrent = String(element.innerHTML || "").replace(/\s+/g, " ").trim();
      const normalizedNext = String(html || "").replace(/\s+/g, " ").trim();
      if (normalizedCurrent !== normalizedNext) {
        element.innerHTML = html;
      }
    };

    const authBrand = document.querySelector(".auth-brand");
    if (authBrand) {
      authBrand.innerHTML = `
        <div class="auth-brand-lockup">
          <img class="auth-logo" src="img/logo.png" alt="DaviCore Health">
          <div class="auth-brand-copy">
            <div class="auth-brand-title-row">
              <strong class="auth-brand-title">DaviCore Health</strong>
              <span class="auth-brand-ribbon">Occupational Health Tech</span>
            </div>
            <p class="auth-brand-subtitle">Plataforma corporativa para apoio t&eacute;cnico em caracteriza&ccedil;&atilde;o de PCD e opera&ccedil;&atilde;o ocupacional respons&aacute;vel.</p>
          </div>
        </div>
        <div class="auth-brand-actions">
          <button class="ghost-button" type="button" id="heroLoginButton">Entrar</button>
        </div>
      `;
    }

    setHtml(".sales-hero-copy", `
      <span class="sales-brand-chip">Plataforma corporativa</span>
      <h3>Base técnica para enquadramento ocupacional de PCD</h3>
      <p>Triagem estruturada, CID com descrição automática, laudo padronizado e governança documental para empresas e médicos responsáveis.</p>
      <div class="sales-hero-evidence" aria-label="Provas do produto">
        <span>Fluxo por tipo de deficiência</span>
        <span>CID com descrição automática</span>
        <span>Laudo com padrão profissional</span>
      </div>
      <div class="sales-hero-actions">
        <button class="primary-button sales-primary-button" type="button" id="heroPlansButton">Conhecer planos</button>
      </div>
    `);

    setHtml(".sales-hero-panel", `
      <div class="hero-insight-visual" id="heroInsightVisual" aria-hidden="true">
        <span class="hero-insight-chip">Base operacional</span>
        <strong class="hero-insight-title" id="heroInsightTitle">Rastreabilidade desde a triagem at&eacute; o laudo</strong>
        <p class="hero-insight-text" id="heroInsightText">Coleta guiada, crit&eacute;rios funcionais mais claros e emiss&atilde;o vinculada ao m&eacute;dico autenticado, com melhor consist&ecirc;ncia documental.</p>
        <div class="hero-insight-proof-list">
          <div class="hero-insight-proof-item">
            <strong>CID autom&aacute;tico</strong>
            <span>Descri&ccedil;&atilde;o preenchida a partir de base local validada.</span>
          </div>
          <div class="hero-insight-proof-item">
            <strong>R&eacute;gua funcional</strong>
            <span>M&oacute;dulos orientados por crit&eacute;rios de caracteriza&ccedil;&atilde;o ocupacional.</span>
          </div>
          <div class="hero-insight-proof-item">
            <strong>Governan&ccedil;a documental</strong>
            <span>Texto t&eacute;cnico, limita&ccedil;&otilde;es e PDF organizados no mesmo fluxo.</span>
          </div>
        </div>
      </div>
    `);

    setHtml(".support-explainer", `
      <div class="support-explainer-head">
        <span class="section-step">Como contratar</span>
        <h3>Fluxo comercial claro, suporte direto e contrata&ccedil;&atilde;o sem confus&atilde;o</h3>
      </div>
      <div class="support-explainer-grid">
        <article class="support-detail-card">
          <strong>Plano Empresarial</strong>
          <p>Contrata&ccedil;&atilde;o por 3, 6 ou 12 meses, com dashboard administrativo, gest&atilde;o de m&eacute;dicos vinculados e indicadores de uso.</p>
        </article>
        <article class="support-detail-card">
          <strong>Plano M&eacute;dico</strong>
          <p>Assinatura recorrente mensal com 30 laudos ou pacotes avulsos, sempre com valida&ccedil;&atilde;o de CRM e responsabilidade t&eacute;cnica vinculada ao m&eacute;dico autenticado.</p>
        </article>
        <article class="support-detail-card">
          <strong>Modo Demonstra&ccedil;&atilde;o</strong>
          <p>Apresenta a navega&ccedil;&atilde;o da plataforma de forma guiada, sem emiss&atilde;o, sem assinatura e sem validade jur&iacute;dica.</p>
        </article>
      </div>
    `);

    setHtml("#professionalContactCard", `
      <div class="professional-contact-card">
            <img class="professional-contact-avatar" src="/img/foto.png" alt="Foto profissional em fundo claro, com jaleco branco e postura confiante.">
        <div class="professional-contact-body">
          <span class="section-step">Contato direto</span>
          <h3>Atendimento comercial profissional</h3>
          <p>Enfermeiro em forma&ccedil;&atilde;o, movido pela sa&uacute;de ocupacional e fascinado por transformar ideias em automa&ccedil;&otilde;es e c&oacute;digos inteligentes.</p>
          <div class="professional-contact-links">
            <a class="support-contact-link" href="mailto:andersonbiondo99@gmail.com">andersonbiondo99@gmail.com</a>
            <a class="support-contact-link" href="https://wa.me/5549999424611" target="_blank" rel="noreferrer">(49) 9 9942-4611</a>
          </div>
        </div>
      </div>
    `);

    setHtml("#pricingLegalWarning .legal-highlight-body", `
      <strong>IMPORTANTE</strong>
      <p>O DaviCore Health &eacute; um sistema de apoio t&eacute;cnico e n&atilde;o realiza diagn&oacute;stico m&eacute;dico.</p>
      <p>A emiss&atilde;o de documentos com validade profissional exige m&eacute;dico legalmente habilitado, com CRM v&aacute;lido e responsabilidade t&eacute;cnica assumida.</p>
      <p>Empresas acessam exclusivamente o dashboard administrativo para gerir m&eacute;dicos, indicadores e uso do sistema, sem emiss&atilde;o ou assinatura de documentos.</p>
      <p>O uso indevido da plataforma &eacute; de responsabilidade exclusiva do usu&aacute;rio.</p>
    `);

    setHtml(".pricing-cards", `
      <article class="offer-card">
        <div class="offer-card-head">
          <span class="offer-chip">Empresarial</span>
          <h4>Plano Empresarial</h4>
          <p class="offer-price">Assinatura por per&iacute;odo</p>
        </div>
        <p>Solu&ccedil;&atilde;o administrativa para empresas com gest&atilde;o de m&eacute;dicos, m&eacute;tricas de uso e controle corporativo.</p>
        <ul class="offer-list">
          <li>Contrata&ccedil;&atilde;o por 3 meses</li>
          <li>Contrata&ccedil;&atilde;o por 6 meses</li>
          <li>Contrata&ccedil;&atilde;o por 12 meses</li>
          <li>Dashboard administrativo corporativo</li>
          <li>Gest&atilde;o de m&eacute;dicos vinculados</li>
          <li>Sem emiss&atilde;o ou assinatura de documentos</li>
        </ul>
        <button class="primary-button plan-action-button" type="button" id="companyPlanButton">Contratar plano</button>
      </article>
      <article class="offer-card featured">
        <div class="offer-card-head">
          <span class="offer-chip success">M&eacute;dico</span>
          <h4>Plano M&eacute;dico</h4>
          <p class="offer-subtitle">Exclusivo para m&eacute;dicos com CRM v&aacute;lido</p>
          <p class="offer-price">Assinatura recorrente ou pacote avulso</p>
        </div>
        <p>Exclusivo para m&eacute;dicos com CRM v&aacute;lido. Escolha entre assinatura mensal com 30 laudos ou pacotes avulsos conforme sua demanda.</p>
        <ul class="offer-list">
          <li>Assinatura recorrente com 30 laudos mensais</li>
          <li>Pacote avulso com 10 documentos</li>
          <li>Pacote avulso com 25 documentos</li>
          <li>Pacote avulso com 50 documentos</li>
          <li>Valida&ccedil;&atilde;o obrigat&oacute;ria de CRM</li>
        </ul>
        <button class="primary-button plan-action-button" type="button" id="doctorPlanButton">Sou m&eacute;dico &mdash; contratar plano</button>
      </article>
      <article class="offer-card">
        <div class="offer-card-head">
          <span class="offer-chip neutral">Demo</span>
          <h4>Modo Demonstra&ccedil;&atilde;o</h4>
          <p class="offer-price offer-price-free">Acesso guiado e limitado</p>
        </div>
        <p>Explore a plataforma com uma visita guiada e sem emiss&atilde;o de documentos.</p>
        <ul class="offer-list">
          <li>Sem validade jur&iacute;dica</li>
          <li>Sem assinatura</li>
          <li>Sem conclus&atilde;o documental</li>
          <li>Uso apenas para demonstra&ccedil;&atilde;o</li>
        </ul>
        <button class="ghost-button plan-action-button" type="button" id="demoPlanButton">Testar demonstra&ccedil;&atilde;o</button>
      </article>
    `);

    setText("#heroPlansButton", "Conhecer planos");
    setText("#heroLoginButton", "Entrar");
    setText("#companyPlanButton", "Contratar plano");
    setText("#doctorPlanButton", "Sou médico — contratar plano");
    setText("#demoPlanButton", "Testar demonstração");
    setText("#showRegisterButton", "Ver planos e contratar");
    setText("#showLoginFromRegisterButton", "Voltar para login");
    setText("#accessBuyerButton strong", "Entrar com conta contratada");
    setText("#accessBuyerButton span", "Empresas acessam o dashboard administrativo e médicos autenticados acessam a área técnica conforme o perfil.");
    setText("#accessAdminButton strong", "Entrar como administrador");
    setText("#accessAdminButton span", "Painel interno para clientes, pagamentos, renovações, acessos e configurações da plataforma.");
    setText("#authPanelClose", "×");
    setText("#submitAssessment", "Classificar caso");
    setText("#resetModule", "Limpar módulo");
    setText("#resultTitle", "Selecione um módulo e preencha os dados clínicos");
    setText("#resultMessage", "O sistema só gera descrição técnica e limitações funcionais quando o caso enquadra conforme a lógica clínico-funcional definida.");
    setText("#descriptionBlock h4", "Descrição clínico-funcional e CID");
    setText("#limitationsBlock h4", "Limitações funcionais e impacto laboral");
    setText("#reportBlock h4", "Sugestão de laudo técnico");
    setText("#pdfBlock h4", "Emissão do laudo e anexos");
    setText("#pdfBlock p", "Quando o caso enquadrar, você poderá abrir o pacote de impressão com anexos vinculados ou salvar o PDF final do laudo para arquivo e envio.");
    setText("#supportBlock h4", "Observações técnicas e documentação complementar");

    setHtml(".legal-highlight-icon", "&#9888;");

    const comparisonBody = document.querySelector(".comparison-table tbody");
    if (comparisonBody) {
      comparisonBody.innerHTML = [
        "<tr><td>Dashboard administrativo</td><td>&#10004;</td><td>&#10060;</td><td>&#10060;</td></tr>",
        "<tr><td>Gest&atilde;o de m&eacute;dicos</td><td>&#10004;</td><td>&#10060;</td><td>&#10060;</td></tr>",
        "<tr><td>Acesso t&eacute;cnico aos m&oacute;dulos</td><td>&#10060;</td><td>&#10004;</td><td>&#10060;</td></tr>",
        "<tr><td>Emitir ou assinar documento</td><td>&#10060;</td><td>&#10004;</td><td>&#10060;</td></tr>",
        "<tr><td>Validade jurídica</td><td>&#10060;</td><td>&#10004;</td><td>&#10060;</td></tr>"
      ].join("");
    }

    const responsibilityPanel = document.querySelector(".responsibility-panel");
    if (responsibilityPanel) {
      responsibilityPanel.classList.add("hidden");
    }

    syncCommercialJourneyUI();
  }

  async function handleLogout() {
    const wasDemo = Boolean(state.demoModeEnabled);

    if (!wasDemo && state.authProvider === "api") {
      try {
        await apiJson(AUTH_API.logout, { method: "POST" });
      } catch (error) {
        console.error(error);
      }
    } else if (!wasDemo) {
      clearLocalSessionUser();
    }

    clearApiSessionToken();

    clearDemoCommercialState();
    state.sessionUser = null;
    state.companyLogoDraft = "";
    document.body.classList.remove("company-mode");

    if (refs.adminShell) refs.adminShell.classList.add("hidden");
    if (refs.appShell) refs.appShell.classList.add("hidden");
    if (refs.companyDashboard) refs.companyDashboard.classList.add("hidden");
    if (refs.authShell) refs.authShell.classList.remove("hidden");
    closeInlineAdminPanel();
    closeAuthPanel(false);

    if (wasDemo) {
      state.authProvider = "api";
      await loadAuthBootstrap();
      setAuthStatus("Demonstração encerrada com sucesso.");
      return;
    }

    setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
    setAuthStatus("Sessão encerrada com sucesso.");
  }

  function applyAuthenticatedSession(session) {
    state.sessionUser = session || null;
    const isAdminSession = Boolean(session && (session.role === "admin" || session.isAdmin));
    const isDemoSession = Boolean(session && normalizeAccountType(session.accountType) === "demo");
    const isCompanyBuyerSession = isCompanySession(session);

    closeAuthPanel(true);

    if (refs.authShell) {
      refs.authShell.classList.add("hidden");
    }

    if (refs.adminShell) {
      refs.adminShell.classList.toggle("hidden", !isAdminSession);
    }
    if (refs.appShell) {
      refs.appShell.classList.toggle("hidden", isAdminSession);
    }

    if (isAdminSession) {
      document.body.classList.remove("company-mode");
      document.body.classList.remove("demo-mode");
      setDemoReadOnly(false);
      hideDemoTour();
      renderBuyerRenewalBanner(null);
      setAuthAccessType("admin", { preserveMode: true });
      if (refs.adminSessionUserLabel) {
        refs.adminSessionUserLabel.textContent = session && session.company
          ? `${session.username} - ${session.company}`
          : (session && session.username ? session.username : "Administrador");
      }
      if (refs.adminPanel) {
        refs.adminPanel.classList.remove("hidden");
      }
      setAdminView(state.adminCurrentView || "overview");
      state.adminPanelOpen = true;
      loadInlineAdminUsers().catch((error) => {
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = error.message || "Não foi possível carregar os acessos cadastrados.";
        }
      });
      return;
    }

    setAuthAccessType("buyer", { preserveMode: true });
    updateAppShellChrome(session);
    if (refs.sessionUserLabel) {
      refs.sessionUserLabel.textContent = session && session.company
        ? `${session.username} - ${session.company}`
        : (session && session.username ? session.username : "Sessão ativa");
    }

    if (refs.reportCompany && !refs.reportCompany.value && session && session.company) {
      refs.reportCompany.value = session.company;
    }

    if (refs.companyDashboard) {
      refs.companyDashboard.classList.toggle("hidden", !isCompanyBuyerSession);
    }
    if (refs.homePanel) {
      refs.homePanel.classList.toggle("hidden", isCompanyBuyerSession);
    }
    if (refs.workspace) {
      refs.workspace.classList.add("hidden");
    }

    if (isDemoSession) {
      document.body.classList.remove("company-mode");
      document.body.classList.add("demo-mode");
      state.demoModeEnabled = true;
      setDemoReadOnly(true);
      renderBuyerRenewalBanner(null);
      window.requestAnimationFrame(() => {
        renderDemoTour();
      });
      return;
    }

    if (isCompanyBuyerSession) {
      document.body.classList.remove("demo-mode");
      document.body.classList.add("company-mode");
      state.demoModeEnabled = false;
      state.companyLogoDraft = session && session.companyLogoDataUrl ? session.companyLogoDataUrl : "";
      setCompanyDashboardStatus("");
      setDemoReadOnly(false);
      hideDemoTour();
      renderBuyerRenewalBanner(null);
      renderCompanyDashboard();
      return;
    }

    document.body.classList.remove("company-mode");
    document.body.classList.remove("demo-mode");
    state.demoModeEnabled = false;
    setDemoReadOnly(false);
    hideDemoTour();
    renderBuyerRenewalBanner(session);
  }

  function readLocalPlanCatalog() {
    try {
      const raw = window.localStorage.getItem("enquadra_local_plans_v1");
      const parsed = raw ? JSON.parse(raw) : [];
      return normalizeClientPlanCatalog(parsed, { includeInactive: true });
    } catch (error) {
      console.error(error);
      return normalizeClientPlanCatalog(getDefaultPlanCatalog(), { includeInactive: true });
    }
  }

  function writeLocalPlanCatalog(plans) {
    try {
      const normalized = normalizeClientPlanCatalog(plans, { includeInactive: true });
      window.localStorage.setItem("enquadra_local_plans_v1", JSON.stringify(normalized));
    } catch (error) {
      console.error(error);
    }
  }

  function formatPlanPriceFieldValue(priceCents) {
    return (Math.max(0, Number(priceCents || 0)) / 100).toFixed(2);
  }

  function parsePlanPriceToCents(value) {
    const raw = String(value || "").trim();
    if (!raw) {
      return Number.NaN;
    }
    const normalized = raw
      .replace(/\s+/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "")
      .replace(",", ".");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN;
  }

  function getPlanAudienceLabel(plan = {}) {
    return normalizeClientPlanAudienceKey(plan.audienceKey || plan.audience) === "doctor"
      ? "Médico"
      : "Empresa";
  }

  function getPlanQuotaSummary(plan = {}) {
    const laudoLimit = plan.laudoLimit === null || plan.laudoLimit === undefined
      ? null
      : Number(plan.laudoLimit || 0);
    if (laudoLimit === null) {
      return "Operação sem franquia de laudos";
    }
    if (normalizeClientPlanBillingModel(plan.billingModel) === "subscription") {
      return `${laudoLimit} laudos por mês`;
    }
    if (normalizeClientPlanQuotaPeriod(plan.quotaPeriod, plan.billingModel, laudoLimit) === "monthly") {
      return `${laudoLimit} laudos renovados a cada mês`;
    }
    return `${laudoLimit} laudos por ciclo contratado`;
  }

  function getPlanCycleSummary(plan = {}) {
    const months = Math.max(1, Number(plan.months || 1));
    if (normalizeClientPlanBillingModel(plan.billingModel) === "subscription") {
      return "Cobrança mensal recorrente";
    }
    return `${months} ${months === 1 ? "mês" : "meses"} de vigência comercial`;
  }

  function getPlanCheckoutSummary(plan = {}) {
    return normalizeClientPlanBillingModel(plan.billingModel) === "subscription"
      ? "Assinatura mensal via Mercado Pago"
      : "Pagamento único via Mercado Pago";
  }

  function getPlanActivationSummary(plan = {}, journey = "company") {
    const isDoctorJourney = journey === "doctor";
    if (normalizeClientPlanBillingModel(plan.billingModel) === "subscription") {
      return isDoctorJourney
        ? "Emissão liberada após pagamento aprovado e validação administrativa do CRM."
        : "Acesso liberado após a confirmação da primeira cobrança recorrente.";
    }
    return isDoctorJourney
      ? "Liberação comercial após pagamento aprovado, com emissão condicionada à validação do CRM."
      : "Acesso liberado após a aprovação do checkout comercial.";
  }

  function renderSelectedPlanBrief(plan, journey = "company") {
    if (!refs.selectedPlanBrief || !refs.selectedPlanBriefTitle || !refs.selectedPlanBriefDescription || !refs.selectedPlanBriefBilling || !refs.selectedPlanBriefMeta) {
      return;
    }

    if (!plan) {
      refs.selectedPlanBriefTitle.textContent = "Resumo da contratação";
      refs.selectedPlanBriefDescription.textContent = "Selecione um plano para visualizar cobrança, franquia, ciclo e regra de liberação.";
      refs.selectedPlanBriefBilling.textContent = "Checkout Mercado Pago";
      refs.selectedPlanBriefMeta.innerHTML = '<span class="selected-plan-chip">Liberação condicionada ao pagamento aprovado</span>';
      return;
    }

    const isDoctorJourney = journey === "doctor";
    const priceLabel = formatCurrencyCents(Number(plan.priceCents || 0));
    const description = isDoctorJourney
      ? "Cadastro profissional com cobrança integrada, franquia vinculada ao médico autenticado e controle de emissão por status comercial."
      : "Contratação empresarial com dashboard administrativo, cobrança integrada e visibilidade sobre vigência, uso e renovação.";
    const meta = [
      getPlanQuotaSummary(plan),
      getPlanCycleSummary(plan),
      getPlanActivationSummary(plan, journey),
      normalizeClientPlanBillingModel(plan.billingModel) === "subscription"
        ? "Renovação comercial acompanhada por ciclo mensal."
        : "Retorno do checkout tratado antes da liberação operacional."
    ];

    refs.selectedPlanBriefTitle.textContent = `${fixBrokenText(plan.label || "Plano selecionado")} - ${priceLabel}`;
    refs.selectedPlanBriefDescription.textContent = description;
    refs.selectedPlanBriefBilling.textContent = getPlanCheckoutSummary(plan);
    refs.selectedPlanBriefMeta.innerHTML = meta
      .filter(Boolean)
      .map((item) => `<span class="selected-plan-chip">${escapeHtml(item)}</span>`)
      .join("");
  }

  function buildPlanRegisterOptionLabel(plan = {}) {
    const priceLabel = formatCurrencyCents(Number(plan.priceCents || 0));
    const quotaLabel = getPlanQuotaSummary(plan);
    return `${fixBrokenText(plan.label || "")} | ${quotaLabel} | ${priceLabel}`;
  }

  function isFeaturedPlan(plan = {}) {
    return String(plan.id || "") === "individual_recorrente_30"
      || String(plan.id || "") === "empresarial_250";
  }

  function buildPlanShowcaseCard(plan = {}, options = {}) {
    const selectedPlanId = String(options.selectedPlanId || "");
    const interactive = Boolean(options.interactive);
    const isSelected = selectedPlanId && String(plan.id || "") === selectedPlanId;
    const featured = isFeaturedPlan(plan);
    const inactive = normalizeClientPlanStatus(plan.status) === "inactive";
    const classes = [
      "plan-card",
      featured ? "is-featured" : "",
      isSelected ? "is-selected" : "",
      inactive ? "is-inactive-plan" : ""
    ].filter(Boolean).join(" ");
    const attrs = interactive
      ? ` data-register-plan-card="${escapeHtml(plan.id)}" role="button" tabindex="0"`
      : "";
    const badge = getPlanAudienceLabel(plan);
    const statusBadge = inactive ? '<span class="plan-card-badge is-muted">Inativo</span>' : "";

    return `
      <article class="${classes}"${attrs}>
        <div class="plan-card-headline">
          <span class="plan-card-badge">${escapeHtml(badge)}</span>
          ${statusBadge}
        </div>
        <strong>${escapeHtml(fixBrokenText(plan.label || ""))}</strong>
        <div class="plan-card-price">${escapeHtml(formatCurrencyCents(Number(plan.priceCents || 0)))}</div>
        <p class="plan-card-description">${escapeHtml(fixBrokenText(plan.description || ""))}</p>
        <div class="plan-card-meta">
          <span>${escapeHtml(getPlanQuotaSummary(plan))}</span>
          <span>${escapeHtml(getPlanCycleSummary(plan))}</span>
          <span class="plan-card-highlight">${escapeHtml(getPlanCheckoutSummary(plan))}</span>
        </div>
      </article>
    `;
  }

  function getAdminPlanCreateSubmitButton() {
    return refs.adminPlanConfigForm
      ? refs.adminPlanConfigForm.querySelector('button[type="submit"]')
      : null;
  }

  function syncPlanFormConstraints(fields = {}) {
    const billingModel = normalizeClientPlanBillingModel(fields.billingModel && fields.billingModel.value);
    const rawLimit = fields.laudoLimit ? String(fields.laudoLimit.value || "").trim() : "";
    const hasLimit = rawLimit !== "";

    if (fields.months) {
      fields.months.disabled = billingModel === "subscription";
      if (billingModel === "subscription") {
        fields.months.value = "1";
      } else if (!fields.months.value) {
        fields.months.value = "1";
      }
    }

    if (fields.quotaPeriod) {
      if (billingModel === "subscription") {
        fields.quotaPeriod.value = "monthly";
        fields.quotaPeriod.disabled = true;
      } else if (!hasLimit) {
        fields.quotaPeriod.value = "none";
        fields.quotaPeriod.disabled = true;
      } else {
        if (fields.quotaPeriod.value === "none") {
          fields.quotaPeriod.value = "contract";
        }
        fields.quotaPeriod.disabled = false;
      }
    }
  }

  function syncAdminPlanCreateFormState() {
    syncPlanFormConstraints({
      billingModel: refs.adminPlanConfigBillingModel,
      months: refs.adminPlanConfigMonths,
      laudoLimit: refs.adminPlanConfigLaudoLimit,
      quotaPeriod: refs.adminPlanConfigQuotaPeriod
    });
  }

  function syncAdminPlanCardFormState(form) {
    if (!form) {
      return;
    }
    syncPlanFormConstraints({
      billingModel: form.elements.billingModel,
      months: form.elements.months,
      laudoLimit: form.elements.laudoLimit,
      quotaPeriod: form.elements.quotaPeriod
    });
  }

  function buildAdminPlanPayload(values = {}, options = {}) {
    const label = String(values.label || "").trim();
    const description = String(values.description || "").trim();
    const audienceKey = normalizeClientPlanAudienceKey(values.audienceKey || values.audience);
    const billingModel = normalizeClientPlanBillingModel(values.billingModel);
    const rawPrice = values.price !== undefined ? values.price : values.priceDisplay;
    const priceCents = parsePlanPriceToCents(rawPrice);
    let months = Math.max(1, Math.round(Number(values.months || 1)));
    const rawLimit = values.laudoLimit;
    const hasLimit = !(rawLimit === "" || rawLimit === null || rawLimit === undefined);
    let laudoLimit = hasLimit ? Math.max(0, Math.round(Number(rawLimit || 0))) : null;
    let quotaPeriod = normalizeClientPlanQuotaPeriod(values.quotaPeriod, billingModel, laudoLimit);
    const status = normalizeClientPlanStatus(values.status);

    if (!label) {
      throw new Error("Informe o nome comercial do plano.");
    }
    if (!Number.isFinite(priceCents) || priceCents < 0) {
      throw new Error("Informe um valor valido para o plano.");
    }
    if (!description) {
      throw new Error("Descreva rapidamente o que este plano entrega.");
    }
    if (billingModel === "subscription") {
      months = 1;
      quotaPeriod = "monthly";
      if (laudoLimit === null) {
        throw new Error("Planos recorrentes precisam informar a franquia mensal de laudos.");
      }
    }
    if (audienceKey === "doctor" && laudoLimit === null) {
      throw new Error("Planos medicos precisam informar a franquia de laudos.");
    }

    const payload = {
      label,
      audienceKey,
      billingModel,
      priceCents,
      months,
      laudoLimit,
      quotaPeriod,
      status,
      description
    };

    if (options.includeId && values.id) {
      payload.id = String(values.id);
    }
    if (options.includeCode) {
      const code = buildClientPlanSlug(values.code || `${audienceKey}_${label}`);
      if (!code) {
        throw new Error("Informe um codigo interno valido para o plano.");
      }
      payload.code = code;
    }

    return payload;
  }

  function resetAdminPlanCreateForm() {
    if (!refs.adminPlanConfigForm) {
      return;
    }
    refs.adminPlanConfigForm.reset();
    if (refs.adminPlanConfigAudience) refs.adminPlanConfigAudience.value = "doctor";
    if (refs.adminPlanConfigBillingModel) refs.adminPlanConfigBillingModel.value = "one_time";
    if (refs.adminPlanConfigMonths) refs.adminPlanConfigMonths.value = "1";
    if (refs.adminPlanConfigQuotaPeriod) refs.adminPlanConfigQuotaPeriod.value = "contract";
    if (refs.adminPlanConfigStatus) refs.adminPlanConfigStatus.value = "active";
    syncAdminPlanCreateFormState();
  }

  function renderAdminPlanManager(catalog = []) {
    if (!refs.adminPlansGrid) {
      return;
    }

    const plans = normalizeClientPlanCatalog(catalog, { includeInactive: true });

    if (refs.adminPlansCount) {
      refs.adminPlansCount.textContent = `${plans.length} plano(s)`;
    }

    if (!plans.length) {
      refs.adminPlansGrid.innerHTML = '<div class="attachment-empty">Nenhum plano configurado ainda.</div>';
      return;
    }

    refs.adminPlansGrid.innerHTML = plans.map((plan) => `
      <form class="plan-config-card" data-admin-plan-id="${escapeHtml(plan.id)}" novalidate>
        <div class="plan-config-head">
          <div>
            <span class="section-step">${escapeHtml(plan.id)}</span>
            <h4>${escapeHtml(fixBrokenText(plan.label || ""))}</h4>
          </div>
          <div class="plan-config-badges">
            <span class="plan-config-badge">${escapeHtml(getPlanAudienceLabel(plan))}</span>
            <span class="plan-config-badge">${escapeHtml(formatPlanBillingModelLabel(plan.billingModel))}</span>
            <span class="plan-config-badge ${plan.status === "active" ? "is-active" : "is-inactive"}">${escapeHtml(plan.status === "active" ? "Ativo" : "Inativo")}</span>
          </div>
        </div>

        <div class="plan-config-grid">
          <label class="field">
            <span>Nome do plano</span>
            <input type="text" name="label" value="${escapeHtml(plan.label || "")}">
          </label>

          <label class="field">
            <span>Codigo interno</span>
            <input type="text" value="${escapeHtml(plan.id || "")}" disabled>
          </label>

          <label class="field">
            <span>Publico</span>
            <select name="audienceKey">
              <option value="doctor"${plan.audienceKey === "doctor" ? " selected" : ""}>Medico</option>
              <option value="company"${plan.audienceKey === "company" ? " selected" : ""}>Empresa</option>
            </select>
          </label>

          <label class="field">
            <span>Modelo de cobranca</span>
            <select name="billingModel">
              <option value="one_time"${plan.billingModel === "one_time" ? " selected" : ""}>Pagamento avulso</option>
              <option value="subscription"${plan.billingModel === "subscription" ? " selected" : ""}>Assinatura recorrente</option>
            </select>
          </label>

          <label class="field">
            <span>Valor (R$)</span>
            <input type="number" name="price" min="0" step="0.01" value="${escapeHtml(formatPlanPriceFieldValue(plan.priceCents))}">
          </label>

          <label class="field">
            <span>Meses de vigencia</span>
            <input type="number" name="months" min="1" step="1" value="${escapeHtml(String(Math.max(1, Number(plan.months || 1))))}">
          </label>

          <label class="field">
            <span>Franquia de laudos</span>
            <input type="number" name="laudoLimit" min="0" step="1" placeholder="Sem limite" value="${plan.laudoLimit === null || plan.laudoLimit === undefined ? "" : escapeHtml(String(Number(plan.laudoLimit || 0)))}">
          </label>

          <label class="field">
            <span>Periodicidade da franquia</span>
            <select name="quotaPeriod">
              <option value="contract"${plan.quotaPeriod === "contract" ? " selected" : ""}>Por ciclo contratado</option>
              <option value="monthly"${plan.quotaPeriod === "monthly" ? " selected" : ""}>Renova mensalmente</option>
              <option value="none"${plan.quotaPeriod === "none" ? " selected" : ""}>Sem franquia</option>
            </select>
          </label>

          <label class="field">
            <span>Status</span>
            <select name="status">
              <option value="active"${plan.status === "active" ? " selected" : ""}>Ativo</option>
              <option value="inactive"${plan.status === "inactive" ? " selected" : ""}>Inativo</option>
            </select>
          </label>

          <label class="field field-full">
            <span>Descricao comercial</span>
            <textarea name="description" rows="3">${escapeHtml(plan.description || "")}</textarea>
          </label>
        </div>

        <div class="plan-config-actions">
          <p class="plan-config-note">${escapeHtml(`${getPlanQuotaSummary(plan)} • ${getPlanCheckoutSummary(plan)}`)}</p>
          <button class="primary-button" type="submit">Salvar plano</button>
        </div>

        <p class="status-note" data-admin-plan-note="${escapeHtml(plan.id)}"></p>
      </form>
    `).join("");

    refs.adminPlansGrid.querySelectorAll("form[data-admin-plan-id]").forEach((form) => {
      syncAdminPlanCardFormState(form);
      form.addEventListener("submit", handleAdminPlanUpdate);
      ["billingModel", "laudoLimit", "quotaPeriod", "months"].forEach((fieldName) => {
        const field = form.elements[fieldName];
        if (!field) {
          return;
        }
        field.addEventListener(fieldName === "laudoLimit" ? "input" : "change", () => {
          syncAdminPlanCardFormState(form);
        });
      });
    });
  }

  async function handleAdminPlanCreate(event) {
    event.preventDefault();

    if (!refs.adminPlanStatus) {
      return;
    }

    const submitButton = getAdminPlanCreateSubmitButton();
    refs.adminPlanStatus.textContent = "";

    try {
      const payload = buildAdminPlanPayload({
        label: refs.adminPlanConfigName ? refs.adminPlanConfigName.value : "",
        code: refs.adminPlanConfigCode ? refs.adminPlanConfigCode.value : "",
        audienceKey: refs.adminPlanConfigAudience ? refs.adminPlanConfigAudience.value : "doctor",
        billingModel: refs.adminPlanConfigBillingModel ? refs.adminPlanConfigBillingModel.value : "one_time",
        price: refs.adminPlanConfigPrice ? refs.adminPlanConfigPrice.value : "",
        months: refs.adminPlanConfigMonths ? refs.adminPlanConfigMonths.value : "1",
        laudoLimit: refs.adminPlanConfigLaudoLimit ? refs.adminPlanConfigLaudoLimit.value : "",
        quotaPeriod: refs.adminPlanConfigQuotaPeriod ? refs.adminPlanConfigQuotaPeriod.value : "contract",
        status: refs.adminPlanConfigStatus ? refs.adminPlanConfigStatus.value : "active",
        description: refs.adminPlanConfigDescription ? refs.adminPlanConfigDescription.value : ""
      }, { includeCode: true });

      if (submitButton) submitButton.disabled = true;

      if (state.authProvider === "api") {
        const response = await apiJson("/api/admin/plans", {
          method: "POST",
          body: payload
        });
        state.planCatalog = normalizeClientPlanCatalog(response.plans || [], { includeInactive: true });
        resetAdminPlanCreateForm();
        refs.adminPlanStatus.textContent = response.message || "Plano criado com sucesso.";
        populatePlanSelects();
        await loadInlineAdminUsers();
        return;
      }

      const plans = readLocalPlanCatalog();
      const nextPlan = normalizeClientPlanRecord({
        ...payload,
        id: payload.code
      }, plans.length);
      if (plans.some((plan) => String(plan.id || "") === nextPlan.id)) {
        throw new Error("Ja existe um plano com este codigo interno.");
      }
      const nextCatalog = normalizeClientPlanCatalog([...plans, nextPlan], { includeInactive: true });
      writeLocalPlanCatalog(nextCatalog);
      state.planCatalog = nextCatalog;
      resetAdminPlanCreateForm();
      refs.adminPlanStatus.textContent = "Plano criado localmente com sucesso.";
      populatePlanSelects();
      renderAdminPlanManager(state.planCatalog);
    } catch (error) {
      refs.adminPlanStatus.textContent = error.message || "Nao foi possivel criar o plano.";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  async function handleAdminPlanUpdate(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form) {
      return;
    }

    const planId = String(form.getAttribute("data-admin-plan-id") || "");
    const note = form.querySelector(`[data-admin-plan-note="${planId}"]`);
    const submitButton = form.querySelector('button[type="submit"]');

    if (note) note.textContent = "";
    if (refs.adminPlanStatus) refs.adminPlanStatus.textContent = "";

    try {
      const payload = buildAdminPlanPayload({
        id: planId,
        label: form.elements.label ? form.elements.label.value : "",
        audienceKey: form.elements.audienceKey ? form.elements.audienceKey.value : "doctor",
        billingModel: form.elements.billingModel ? form.elements.billingModel.value : "one_time",
        price: form.elements.price ? form.elements.price.value : "",
        months: form.elements.months ? form.elements.months.value : "1",
        laudoLimit: form.elements.laudoLimit ? form.elements.laudoLimit.value : "",
        quotaPeriod: form.elements.quotaPeriod ? form.elements.quotaPeriod.value : "contract",
        status: form.elements.status ? form.elements.status.value : "active",
        description: form.elements.description ? form.elements.description.value : ""
      }, { includeId: true });

      if (submitButton) submitButton.disabled = true;

      if (state.authProvider === "api") {
        const response = await apiJson(`/api/admin/plans/${encodeURIComponent(planId)}`, {
          method: "PATCH",
          body: payload
        });
        state.planCatalog = normalizeClientPlanCatalog(response.plans || [], { includeInactive: true });
        if (refs.adminPlanStatus) {
          refs.adminPlanStatus.textContent = response.message || "Plano atualizado com sucesso.";
        }
        populatePlanSelects();
        await loadInlineAdminUsers();
        return;
      }

      const plans = readLocalPlanCatalog();
      const nextCatalog = normalizeClientPlanCatalog(plans.map((plan) => (
        String(plan.id || "") === planId
          ? { ...plan, ...payload, id: planId }
          : plan
      )), { includeInactive: true });
      writeLocalPlanCatalog(nextCatalog);
      state.planCatalog = nextCatalog;
      if (note) note.textContent = "Plano atualizado localmente.";
      populatePlanSelects();
      renderAdminPlanManager(state.planCatalog);
    } catch (error) {
      if (note) {
        note.textContent = error.message || "Nao foi possivel salvar o plano.";
      } else if (refs.adminPlanStatus) {
        refs.adminPlanStatus.textContent = error.message || "Nao foi possivel salvar o plano.";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  function normalizeAdminCreateProfile(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return ["admin", "company", "doctor"].includes(normalized) ? normalized : "";
  }

  function getAdminCreateProfile() {
    return normalizeAdminCreateProfile((refs.adminCreateProfile && refs.adminCreateProfile.value) || state.adminCreateProfile);
  }

  function setAdminCreateFieldLabel(field, label) {
    const element = field && typeof field.querySelector === "function" ? field.querySelector("span") : null;
    if (element) {
      element.textContent = label;
    }
  }

  function toggleAdminCreateField(field, visible) {
    if (field) {
      field.classList.toggle("hidden", !visible);
    }
  }

  function getAdminCreatePlans(profile = getAdminCreateProfile(), catalog = null) {
    const audienceKey = profile === "doctor" ? "doctor" : (profile === "company" ? "company" : "");
    if (!audienceKey) {
      return [];
    }

    const source = normalizeClientPlanCatalog(catalog || getStoredPlanCatalog({ includeInactive: true }), { includeInactive: true });
    return source.filter((plan) => normalizeClientPlanAudienceKey(plan.audienceKey || plan.audience) === audienceKey);
  }

  function syncAdminCreatePlanOptions(preferredPlanId = "") {
    if (!refs.adminPlan) {
      return;
    }

    const profile = getAdminCreateProfile();
    if (!profile) {
      refs.adminPlan.innerHTML = '<option value="">Escolha o perfil primeiro</option>';
      refs.adminPlan.value = "";
      return;
    }

    if (profile === "admin") {
      refs.adminPlan.innerHTML = '<option value="internal">Administracao interna</option>';
      refs.adminPlan.value = "internal";
      return;
    }

    const plans = getAdminCreatePlans(profile, state.planCatalog);
    if (!plans.length) {
      refs.adminPlan.innerHTML = '<option value="">Nenhum plano disponivel</option>';
      refs.adminPlan.value = "";
      return;
    }

    const selectedPlanId = plans.some((plan) => plan.id === preferredPlanId)
      ? preferredPlanId
      : (plans.some((plan) => plan.id === refs.adminPlan.value) ? refs.adminPlan.value : plans[0].id);

    refs.adminPlan.innerHTML = plans.map((plan) => {
      const selected = plan.id === selectedPlanId ? " selected" : "";
      const suffix = plan.status === "inactive" ? " (inativo)" : "";
      return `<option value="${escapeHtml(plan.id)}"${selected}>${escapeHtml(`${plan.label}${suffix}`)}</option>`;
    }).join("");
    refs.adminPlan.value = selectedPlanId;
  }

  function syncAdminCreatePlanShowcase(catalog = null) {
    const grid = document.getElementById("adminPlanGrid");
    if (!grid) {
      return;
    }

    const profile = getAdminCreateProfile();
    const visible = profile === "company" || profile === "doctor";
    grid.classList.toggle("hidden", !visible);

    if (!visible) {
      grid.innerHTML = "";
      return;
    }

    const plans = getAdminCreatePlans(profile, catalog || state.planCatalog);
    grid.innerHTML = plans.length
      ? plans.map((plan) => buildPlanShowcaseCard(plan)).join("")
      : '<div class="attachment-empty">Nenhum plano comercial disponível para este perfil.</div>';
  }

  function resetInlineAdminCreateForm() {
    if (refs.createUserForm) {
      refs.createUserForm.reset();
    }
    state.adminCreateProfile = "";
    syncInlineAdminCreateForm({ profile: "", preserveStatusNote: true });
  }

  function syncInlineAdminCreateForm(options = {}) {
    const profile = normalizeAdminCreateProfile(options.profile !== undefined ? options.profile : getAdminCreateProfile());
    state.adminCreateProfile = profile;

    if (refs.adminCreateProfile) {
      refs.adminCreateProfile.value = profile;
    }

    if (refs.adminCreateTypeButtons) {
      refs.adminCreateTypeButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.adminCreateProfile === profile);
      });
    }

    if (refs.adminCreateDetails) {
      refs.adminCreateDetails.classList.toggle("hidden", !profile);
    }

    toggleAdminCreateField(refs.adminCompanyField, Boolean(profile));
    toggleAdminCreateField(refs.adminEmailField, Boolean(profile));
    toggleAdminCreateField(refs.adminUsernameField, Boolean(profile));
    toggleAdminCreateField(refs.adminPasswordField, Boolean(profile));
    toggleAdminCreateField(refs.adminContactNameField, profile === "company" || profile === "doctor");
    toggleAdminCreateField(refs.adminCrmNumberField, profile === "doctor");
    toggleAdminCreateField(refs.adminCrmStateField, profile === "doctor");
    toggleAdminCreateField(refs.adminCrmValidatedField, profile === "doctor");
    toggleAdminCreateField(refs.adminStatusField, profile === "company" || profile === "doctor");
    toggleAdminCreateField(refs.adminPaymentStatusField, profile === "company" || profile === "doctor");
    toggleAdminCreateField(refs.adminPlanField, profile === "company" || profile === "doctor");
    toggleAdminCreateField(refs.adminPaymentDueAtField, profile === "company" || profile === "doctor");
    toggleAdminCreateField(refs.adminNotesField, Boolean(profile));
    toggleAdminCreateField(refs.adminRoleField, false);
    toggleAdminCreateField(refs.adminAccountTypeField, false);

    if (refs.adminRole) {
      refs.adminRole.value = profile === "admin" ? "admin" : "buyer";
    }
    if (refs.adminAccountType) {
      refs.adminAccountType.value = profile === "doctor" ? "doctor" : "company";
    }
    if (refs.adminStatus) {
      refs.adminStatus.value = "active";
    }
    if (refs.adminPaymentStatus) {
      refs.adminPaymentStatus.value = profile === "admin" ? "approved" : "pending";
    }
    if (refs.adminCrmValidated) {
      refs.adminCrmValidated.value = "false";
    }
    if (refs.adminCrmState && profile !== "doctor") {
      refs.adminCrmState.value = "";
    }
    if (refs.adminPaymentDueAt && profile === "admin") {
      refs.adminPaymentDueAt.value = "";
    }

    if (refs.adminCreateSectionTitle) {
      refs.adminCreateSectionTitle.textContent = !profile
        ? "Escolher perfil de cadastro"
        : (profile === "admin" ? "Cadastrar administrador" : (profile === "doctor" ? "Cadastrar médico" : "Cadastrar empresa"));
    }

    if (refs.adminCreateFieldsTitle) {
      refs.adminCreateFieldsTitle.textContent = profile === "admin"
        ? "Dados internos do administrador"
        : (profile === "doctor" ? "Dados do médico e liberação comercial" : "Dados da empresa e liberação comercial");
    }

    if (refs.adminCreateTypeSummary) {
      refs.adminCreateTypeSummary.textContent = !profile
        ? "Escolha primeiro o tipo de cadastro para abrir apenas os campos necessários."
        : (profile === "admin"
          ? "Perfil interno, sem CRM nem etapas comerciais visíveis."
          : (profile === "doctor"
            ? "Cadastro profissional com CRM, validação manual e plano médico."
            : "Cadastro empresarial com controle comercial, plano e acesso administrativo."));
    }

    if (refs.adminCreateFieldsSummary) {
      refs.adminCreateFieldsSummary.textContent = profile === "admin"
        ? "Preencha somente os dados essenciais do acesso interno."
        : (profile === "doctor"
          ? "O sistema abriu apenas os campos médicos e comerciais necessários para este perfil."
          : "O sistema abriu somente os campos relevantes para a conta empresarial.");
    }

    setAdminCreateFieldLabel(refs.adminCompanyField, profile === "doctor" ? "Nome do médico" : (profile === "admin" ? "Nome do administrador" : "Empresa"));
    setAdminCreateFieldLabel(refs.adminContactNameField, profile === "doctor" ? "Clínica / responsável" : "Responsável");
    setAdminCreateFieldLabel(refs.adminEmailField, "E-mail");
    setAdminCreateFieldLabel(refs.adminUsernameField, "Usuário");
    setAdminCreateFieldLabel(refs.adminPasswordField, "Senha inicial");

    if (refs.adminCompany) {
      refs.adminCompany.placeholder = profile === "doctor"
        ? "Nome completo do médico"
        : (profile === "admin" ? "Nome do administrador" : "Empresa cliente");
    }
    if (refs.adminContactName) {
      refs.adminContactName.placeholder = profile === "doctor"
        ? "Clínica, consultório ou contato de apoio"
        : "Contato da conta";
    }
    if (refs.adminEmail) {
      refs.adminEmail.placeholder = profile === "doctor"
        ? "medico@dominio.com.br"
        : (profile === "admin" ? "admin@empresa.com.br" : "financeiro@empresa.com.br");
    }
    if (refs.adminUsername) {
      refs.adminUsername.placeholder = profile === "doctor"
        ? "Login profissional do médico"
        : (profile === "admin" ? "Login do administrador" : "Login do cliente");
    }
    if (refs.adminNotes) {
      refs.adminNotes.placeholder = profile === "admin"
        ? "Observações internas sobre este acesso administrativo"
        : "Controle interno, financeiro ou observações comerciais";
    }

    syncAdminCreatePlanOptions();
    syncAdminCreatePlanShowcase(state.planCatalog);

    if (refs.adminStatusNote && !options.preserveStatusNote) {
      refs.adminStatusNote.textContent = profile
        ? ""
        : "Escolha primeiro o tipo de cadastro para abrir o formulário correspondente.";
    }
  }

  function initInlineAdminPanel() {
    refs.adminPanel = $("#adminPanel");
    refs.createUserForm = $("#createUserForm");
    refs.adminCompany = $("#adminCompany");
    refs.adminContactName = $("#adminContactName");
    refs.adminEmail = $("#adminEmail");
    refs.adminUsername = $("#adminUsername");
    refs.adminPassword = $("#adminPassword");
    refs.adminCreateSectionTitle = $("#adminCreateSectionTitle");
    refs.adminCreateProfile = $("#adminCreateProfile");
    refs.adminCreateTypeShell = $("#adminCreateTypeShell");
    refs.adminCreateTypeSummary = $("#adminCreateTypeSummary");
    refs.adminCreateTypeButtons = $$("[data-admin-create-profile]");
    refs.adminCreateDetails = $("#adminCreateDetails");
    refs.adminCreateFieldsTitle = $("#adminCreateFieldsTitle");
    refs.adminCreateFieldsSummary = $("#adminCreateFieldsSummary");
    refs.adminCompanyField = $("#adminCompanyField");
    refs.adminContactNameField = $("#adminContactNameField");
    refs.adminEmailField = $("#adminEmailField");
    refs.adminUsernameField = $("#adminUsernameField");
    refs.adminPasswordField = $("#adminPasswordField");
    refs.adminRoleField = $("#adminRoleField");
    refs.adminAccountTypeField = $("#adminAccountTypeField");
    refs.adminCrmNumberField = $("#adminCrmNumberField");
    refs.adminCrmStateField = $("#adminCrmStateField");
    refs.adminCrmValidatedField = $("#adminCrmValidatedField");
    refs.adminStatusField = $("#adminStatusField");
    refs.adminPaymentStatusField = $("#adminPaymentStatusField");
    refs.adminPlanField = $("#adminPlanField");
    refs.adminPaymentDueAtField = $("#adminPaymentDueAtField");
    refs.adminNotesField = $("#adminNotesField");
    refs.adminRole = $("#adminRole");
    refs.adminAccountType = $("#adminAccountType");
    refs.adminCrmNumber = $("#adminCrmNumber");
    refs.adminCrmState = $("#adminCrmState");
    refs.adminCrmValidated = $("#adminCrmValidated");
    refs.adminStatus = $("#adminStatus");
    refs.adminPaymentStatus = $("#adminPaymentStatus");
    refs.adminPlan = $("#adminPlan");
    refs.adminPaymentDueAt = $("#adminPaymentDueAt");
    refs.adminNotes = $("#adminNotes");
    refs.adminStatusNote = $("#adminStatusNote");
    refs.adminUsersCount = $("#adminUsersCount");
    refs.adminUsersGrid = $("#adminUsersGrid");
    refs.adminUserSearch = $("#adminUserSearch");
    refs.adminUserFilter = $("#adminUserFilter");
    refs.adminViewButtons = $$("[data-admin-view]");
    refs.adminViewPanels = $$("[data-admin-view-panel]");
    refs.adminPlanConfigForm = $("#adminPlanConfigForm");
    refs.adminPlanConfigName = $("#adminPlanConfigName");
    refs.adminPlanConfigCode = $("#adminPlanConfigCode");
    refs.adminPlanConfigAudience = $("#adminPlanConfigAudience");
    refs.adminPlanConfigBillingModel = $("#adminPlanConfigBillingModel");
    refs.adminPlanConfigPrice = $("#adminPlanConfigPrice");
    refs.adminPlanConfigMonths = $("#adminPlanConfigMonths");
    refs.adminPlanConfigLaudoLimit = $("#adminPlanConfigLaudoLimit");
    refs.adminPlanConfigQuotaPeriod = $("#adminPlanConfigQuotaPeriod");
    refs.adminPlanConfigStatus = $("#adminPlanConfigStatus");
    refs.adminPlanConfigDescription = $("#adminPlanConfigDescription");
    refs.adminPlanStatus = $("#adminPlanStatus");
    refs.adminPlansGrid = $("#adminPlansGrid");
    refs.adminPlansCount = $("#adminPlansCount");

    state.adminPanelOpen = false;
    state.adminPlanEditingId = "";

    if (refs.createUserForm) {
      refs.createUserForm.addEventListener("submit", handleInlineAdminCreateUser);
    }

    if (refs.adminCreateTypeButtons && refs.adminCreateTypeButtons.length) {
      refs.adminCreateTypeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          syncInlineAdminCreateForm({ profile: button.dataset.adminCreateProfile || "" });
        });
      });
    }

    if (refs.adminPlanConfigForm) {
      refs.adminPlanConfigForm.addEventListener("submit", handleAdminPlanCreate);
    }

    if (refs.adminPlanConfigName) {
      refs.adminPlanConfigName.addEventListener("input", () => {
        if (refs.adminPlanConfigCode && !refs.adminPlanConfigCode.value.trim()) {
          refs.adminPlanConfigCode.value = buildClientPlanSlug(refs.adminPlanConfigName.value || "");
        }
      });
    }

    [refs.adminPlanConfigBillingModel, refs.adminPlanConfigLaudoLimit, refs.adminPlanConfigQuotaPeriod, refs.adminPlanConfigMonths].forEach((element) => {
      if (!element) {
        return;
      }
      element.addEventListener(element === refs.adminPlanConfigLaudoLimit ? "input" : "change", syncAdminPlanCreateFormState);
    });

    if (refs.adminViewButtons && refs.adminViewButtons.length) {
      refs.adminViewButtons.forEach((button) => {
        button.addEventListener("click", () => setAdminView(button.dataset.adminView || "overview"));
      });
    }

    if (refs.adminUserSearch) {
      refs.adminUserSearch.addEventListener("input", (event) => {
        state.adminUserSearch = String(event.target.value || "");
        renderInlineAdminUsers(getVisibleAdminUsers());
      });
    }

    if (refs.adminUserFilter) {
      refs.adminUserFilter.value = state.adminUserFilter || "active_company";
      refs.adminUserFilter.addEventListener("change", (event) => {
        state.adminUserFilter = String(event.target.value || "active_company");
        renderInlineAdminUsers(getVisibleAdminUsers());
      });
    }

    syncAdminPlanCreateFormState();
    syncInlineAdminCreateForm({ profile: getAdminCreateProfile(), preserveStatusNote: true });
    setAdminView(state.adminCurrentView || "overview");
  }

  function setAdminView(view) {
    const allowedViews = ["overview", "users", "create", "pricing"];
    const nextView = allowedViews.includes(view) ? view : "overview";
    state.adminCurrentView = nextView;

    if (refs.adminViewButtons) {
      refs.adminViewButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.adminView === nextView);
      });
    }

    if (refs.adminViewPanels) {
      refs.adminViewPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.adminViewPanel !== nextView);
      });
    }

    if (nextView === "create") {
      syncInlineAdminCreateForm({ profile: getAdminCreateProfile(), preserveStatusNote: true });
    }
  }

  async function loadInlineAdminUsers() {
    if (!refs.adminUsersGrid && !refs.adminPlansGrid) {
      return;
    }

    if (refs.adminUsersGrid) {
      refs.adminUsersGrid.innerHTML = '<div class="attachment-empty">Carregando acessos...</div>';
    }
    if (refs.adminPlansGrid) {
      refs.adminPlansGrid.innerHTML = '<div class="attachment-empty">Carregando planos...</div>';
    }

    if (state.authProvider === "api") {
      const response = await apiJson("/api/admin/users");
      const users = Array.isArray(response.users) ? response.users : [];
      state.adminUsersCache = users;
      state.planCatalog = normalizeClientPlanCatalog(response.plans || state.planCatalog || [], { includeInactive: true });

      if (refs.adminUsersCount) {
        refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
      }

      if (response.summary) {
        renderAdminDashboardSummary(response.summary);
      }

      populatePlanSelects();
      renderInlineAdminUsers(getVisibleAdminUsers());
      renderAdminPlanManager(state.planCatalog);
      return;
    }

    const users = readLocalUsers().map(serializeLocalUser);
    state.adminUsersCache = users;
    state.planCatalog = readLocalPlanCatalog();
    if (refs.adminUsersCount) {
      refs.adminUsersCount.textContent = `${users.length} acesso(s)`;
    }
    renderAdminDashboardSummary(computeLocalDashboardSummary(users));
    populatePlanSelects();
    renderInlineAdminUsers(getVisibleAdminUsers());
    renderAdminPlanManager(state.planCatalog);
  }

  function renderPlanCatalogCards(catalog = []) {
    const allPlans = normalizeClientPlanCatalog(catalog, { includeInactive: true });
    const activePlans = allPlans.filter((plan) => isActiveClientPlan(plan));
    const registerGrid = document.getElementById("registerPlanGrid");
    const publicGrid = document.getElementById("publicPlanGrid");

    if (registerGrid) {
      registerGrid.innerHTML = activePlans.map((plan) => buildPlanShowcaseCard(plan)).join("");
    }

    if (publicGrid) {
      publicGrid.innerHTML = activePlans.map((plan) => buildPlanShowcaseCard(plan)).join("");
    }

    syncAdminCreatePlanShowcase(allPlans);
  }

  function populatePlanSelects() {
    const catalog = getStoredPlanCatalog({ includeInactive: true });
    state.planCatalog = catalog;

    if (refs.adminPlan) {
      syncAdminCreatePlanOptions(refs.adminPlan.value || (catalog[0] ? catalog[0].id : ""));
    }

    renderPlanCatalogCards(catalog);
    renderAdminPlanManager(catalog);
    syncCommercialJourneyUI();
  }

  function buildJourneyPlanCards(plans = [], selectedPlanId = "", journey = "company") {
    return plans.map((plan) => buildPlanShowcaseCard({
      ...plan,
      audience: journey === "doctor" ? "Medico" : "Empresa"
    }, {
      selectedPlanId,
      interactive: true
    })).join("");
  }

  function syncCommercialJourneyUI() {
    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const companyLabel = document.getElementById("registerCompanyLabel");
    const contactSpan = refs.registerContactName ? refs.registerContactName.closest("label").querySelector("span") : null;
    const journeyNote = document.getElementById("registerJourneyNote");
    const doctorFields = document.getElementById("doctorCredentialFields");
    const doctorResponsibilityCard = document.getElementById("doctorResponsibilityCard");
    const doctorValidationNote = document.getElementById("registerDoctorValidationNote");
    const registerCompanyCnpjField = document.getElementById("registerCompanyCnpjField");
    const registerPlanGrid = document.getElementById("registerPlanGrid");
    const registerPlanLabel = refs.registerPlan ? refs.registerPlan.closest("label").querySelector("span") : null;
    const registerSubmitButton = refs.registerSubmitButton;
    const catalog = getStoredPlanCatalog({ includeInactive: false });
    const journeyPlans = getPlansForJourney(journey, catalog);
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const chosenPlan = resolveJourneyPlan(journey, catalog, selectedPlanId);

    if (companyLabel) companyLabel.textContent = isDoctorJourney ? "Nome do médico" : "Empresa";
    if (refs.registerCompany) refs.registerCompany.placeholder = isDoctorJourney ? "Nome completo do médico" : "Razão social ou nome fantasia";
    if (contactSpan) contactSpan.textContent = isDoctorJourney ? "Clínica / nome de exibição" : "Responsável";
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = isDoctorJourney
        ? "Clínica, consultório ou identificação profissional"
        : "Nome do responsável pela conta";
    }
    if (refs.registerEmail) refs.registerEmail.placeholder = isDoctorJourney ? "medico@dominio.com.br" : "contato@empresa.com.br";
    if (refs.registerUsername) refs.registerUsername.placeholder = isDoctorJourney ? "Usuário profissional do médico" : "Usuário principal da empresa";

    if (journeyNote) {
      journeyNote.textContent = isDoctorJourney
        ? "Cadastro médico com contratação comercial integrada. O plano recorrente mensal libera 30 laudos por ciclo, enquanto os demais seguem em formato avulso por pacote."
        : "Cadastro empresarial com planos administráveis pelo painel, valores sincronizados com a tela inicial e checkout comercial centralizado no Mercado Pago.";
    }

    if (registerCompanyCnpjField) registerCompanyCnpjField.classList.toggle("hidden", isDoctorJourney);
    if (doctorFields) doctorFields.classList.toggle("hidden", !isDoctorJourney);
    if (doctorResponsibilityCard) doctorResponsibilityCard.classList.toggle("hidden", !isDoctorJourney);

    if (doctorValidationNote) {
      doctorValidationNote.textContent = !isDoctorJourney
        ? ""
        : "CRM, CPF e data de nascimento permanecem obrigatórios no cadastro. O médico pode contratar assinatura mensal com 30 laudos por ciclo ou pacotes avulsos para consumo por contrato.";
    }

    if (registerPlanLabel) {
      registerPlanLabel.textContent = isDoctorJourney ? "Plano médico selecionado" : "Plano empresarial selecionado";
    }

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = journeyPlans.map((plan) => (
        `<option value="${escapeHtml(plan.id)}"${String(plan.id || "") === String(chosenPlan && chosenPlan.id ? chosenPlan.id : "") ? " selected" : ""}>${escapeHtml(buildPlanRegisterOptionLabel(plan))}</option>`
      )).join("");
      refs.registerPlan.disabled = !journeyPlans.length;
      if (chosenPlan) {
        refs.registerPlan.value = chosenPlan.id;
      }
    }

    renderSelectedPlanBrief(chosenPlan, journey);

    if (registerSubmitButton) {
      const billingModel = chosenPlan ? normalizeClientPlanBillingModel(chosenPlan.billingModel) : "one_time";
      registerSubmitButton.textContent = billingModel === "subscription"
        ? "Assinar plano no Mercado Pago"
        : "Criar conta e seguir para pagamento";
    }

    if (registerPlanGrid) {
      registerPlanGrid.innerHTML = buildJourneyPlanCards(journeyPlans, chosenPlan ? chosenPlan.id : "", journey);
      registerPlanGrid.querySelectorAll("[data-register-plan-card]").forEach((card) => {
        const selectPlan = () => {
          if (!refs.registerPlan) {
            return;
          }
          refs.registerPlan.value = card.dataset.registerPlanCard || "";
          syncCommercialJourneyUI();
        };
        card.addEventListener("click", selectPlan);
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectPlan();
          }
        });
      });
    }

    updateRegisterUsernameSuggestions();
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    const companyCnpj = refs.registerCompanyCnpj ? refs.registerCompanyCnpj.value.replace(/\D/g, "") : "";
    let contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const crmNumber = refs.registerDoctorCrm ? refs.registerDoctorCrm.value.replace(/\D/g, "") : "";
    const crmState = refs.registerDoctorCrmUf ? refs.registerDoctorCrmUf.value : "";
    const doctorCpf = refs.registerDoctorCpf ? refs.registerDoctorCpf.value.replace(/\D/g, "") : "";
    const doctorBirthDate = refs.registerDoctorBirthDate ? refs.registerDoctorBirthDate.value : "";
    const legalTermsAccepted = document.getElementById("registerLegalTerms") ? document.getElementById("registerLegalTerms").checked : false;
    const doctorTermsAccepted = document.getElementById("registerDoctorTerms") ? document.getElementById("registerDoctorTerms").checked : false;
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = resolveJourneyPlan(journey, getStoredPlanCatalog({ includeInactive: false }), selectedPlanId);
    const isSubscriptionPlan = plan && normalizeClientPlanBillingModel(plan.billingModel) === "subscription";

    if (!company || !email || !username || !password || !passwordConfirm) {
      setAuthStatus(isDoctorJourney
        ? "Preencha nome do médico, e-mail, usuário, senha e confirmação para solicitar o acesso médico."
        : "Preencha empresa, responsável, e-mail, usuário, senha e confirmação para criar a conta.");
      return;
    }
    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail válido para continuar.");
      return;
    }
    if (!isDoctorJourney && companyCnpj.length !== 14) {
      setAuthStatus("Informe um CNPJ válido com 14 dígitos para concluir o cadastro empresarial.");
      return;
    }
    if (!plan) {
      setAuthStatus("Selecione um plano compatível com este perfil para continuar.");
      return;
    }
    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setAuthStatus("A confirmação da senha não confere.");
      return;
    }
    if (!legalTermsAccepted) {
      setAuthStatus("Confirme a ciência sobre o uso do sistema como apoio técnico para continuar.");
      return;
    }
    if (isDoctorJourney) {
      if (!crmNumber || crmNumber.length < 4 || !crmState) {
        setAuthStatus("Informe CRM e UF válidos para solicitar o plano médico.");
        return;
      }
      if (doctorCpf.length !== 11) {
        setAuthStatus("Informe o CPF completo do médico para concluir o cadastro.");
        return;
      }
      if (!doctorBirthDate) {
        setAuthStatus("Informe a data de nascimento do médico para concluir o cadastro.");
        return;
      }
      if (!doctorTermsAccepted) {
        setAuthStatus("Confirme a responsabilidade técnica médica para prosseguir.");
        return;
      }
      if (!contactName) {
        contactName = company;
      }
    } else if (!contactName) {
      setAuthStatus("Informe o responsável da conta empresarial.");
      return;
    }

    clearDemoCommercialState();

    if (state.authProvider === "api") {
      try {
        setAuthStatus(isSubscriptionPlan
          ? "Criando a conta e preparando a assinatura recorrente no Mercado Pago..."
          : "Criando a conta e preparando o checkout comercial...");

        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            companyCnpj,
            contactName,
            email,
            username,
            password,
            planId: plan.id,
            accountType: isDoctorJourney ? "doctor" : "company",
            crmNumber,
            crmState,
            doctorCpf,
            doctorBirthDate,
            legalAccepted: legalTermsAccepted,
            doctorAccepted: doctorTermsAccepted
          }
        });

        if (refs.registerForm) refs.registerForm.reset();
        syncCommercialJourneyUI();
        if (refs.loginUsername) refs.loginUsername.value = response && response.user && response.user.username ? response.user.username : username;

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkout = response && response.checkout ? response.checkout : {};
        const checkoutUrl = checkout.checkoutUrl || checkout.sandboxCheckoutUrl || "";
        const checkoutMode = normalizeClientPlanBillingModel(checkout.type || plan.billingModel);

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          if (checkoutMode === "subscription") {
            setAuthStatus(isDoctorJourney
              ? (popup
                ? "Cadastro médico criado. A assinatura mensal foi aberta em nova guia. São 30 laudos por ciclo após confirmação do pagamento."
                : "Cadastro médico criado. Finalize a assinatura mensal para liberar 30 laudos por ciclo.")
              : (popup
                ? "Conta criada. A assinatura recorrente foi aberta em nova guia para concluir a ativação comercial."
                : "Conta criada. Finalize a assinatura recorrente para concluir a ativação comercial."));
          } else {
            setAuthStatus(isDoctorJourney
              ? (popup
                ? "Cadastro médico criado. O checkout do pacote foi aberto em nova guia para concluir a liberação comercial."
                : "Cadastro médico criado. Finalize o checkout do pacote para concluir a liberação comercial.")
              : (popup
                ? "Solicitação criada com sucesso. O checkout foi aberto em nova guia para concluir a ativação comercial."
                : "Solicitação criada com sucesso. Finalize o checkout para concluir a ativação comercial."));
          }
          applyCheckoutStatusAction(response);
        } else {
          setAuthStatus(response.message || (checkoutMode === "subscription"
            ? "Conta criada. Configure o Mercado Pago para concluir a assinatura recorrente."
            : "Conta criada. Configure o Mercado Pago para concluir o checkout automático."));
        }
      } catch (error) {
        setAuthStatus(error.message || "Não foi possível concluir a solicitação de acesso neste momento.");
        applyCheckoutStatusAction(error && error.payload ? error.payload : null);
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Já existe um acesso local com esse usuário.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Já existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      companyCnpj,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), Number(plan.months || 1)),
      planId: plan.id,
      notes: isDoctorJourney
        ? `Cadastro médico local com CRM ${crmState}-${crmNumber}.`
        : "Cadastro empresarial local para apoio técnico.",
      accountType: isDoctorJourney ? "doctor" : "company",
      crmNumber,
      crmState,
      doctorCpf,
      doctorBirthDate,
      crmValidated: false,
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) refs.registerForm.reset();
    syncCommercialJourneyUI();

    if (isDoctorJourney) {
      if (refs.loginUsername) refs.loginUsername.value = username;
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus(isSubscriptionPlan
        ? "Cadastro médico criado em modo local. A assinatura recorrente ficou simulada neste navegador."
        : "Cadastro médico criado em modo local. O pacote comercial ficou registrado neste navegador.");
      return;
    }

    setAuthStatus("Conta empresarial criada em modo local.");
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);
    applyAuthenticatedSession(session);
  }

  function buildJourneyPlanCards(plans = [], selectedPlanId = "", journey = "company") {
    return plans.map((plan) => {
      const isSelected = String(plan.id || "") === String(selectedPlanId || "");
      const months = Number(plan.months || 0);
      const laudoLimit = plan.laudoLimit === null || plan.laudoLimit === undefined ? null : Number(plan.laudoLimit || 0);
      const priceCents = Number(plan.priceCents || 0);
      const metaPrimary = journey === "doctor"
        ? `${laudoLimit} documentos por consumo`
        : "Dashboard administrativo corporativo";
      const metaSecondary = journey === "doctor"
        ? "Créditos vinculados ao médico autenticado"
        : `${months} ${months === 1 ? "mes" : "meses"} de gestao, indicadores e medicos vinculados`;
      return `
        <article class="plan-card${isSelected ? " is-selected" : ""}" data-register-plan-card="${escapeHtml(plan.id)}">
          <span class="plan-card-badge">${escapeHtml(journey === "doctor" ? "Médico" : "Empresa")}</span>
          <strong>${escapeHtml(fixBrokenText(plan.label || ""))}</strong>
          <div class="plan-card-price">${escapeHtml(formatCurrencyCents(priceCents))}</div>
          <p class="plan-card-description">${escapeHtml(fixBrokenText(plan.description || ""))}</p>
          <div class="plan-card-meta">
            <span>${escapeHtml(metaPrimary)}</span>
            <span>${escapeHtml(metaSecondary)}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function syncCommercialJourneyUI() {
    const journey = getCommercialJourney();
    const companyLabel = document.getElementById("registerCompanyLabel");
    const contactSpan = refs.registerContactName ? refs.registerContactName.closest("label").querySelector("span") : null;
    const journeyNote = document.getElementById("registerJourneyNote");
    const doctorFields = document.getElementById("doctorCredentialFields");
    const doctorResponsibilityCard = document.getElementById("doctorResponsibilityCard");
    const doctorValidationNote = document.getElementById("registerDoctorValidationNote");
    const registerCompanyCnpjField = document.getElementById("registerCompanyCnpjField");
    const registerPlanGrid = document.getElementById("registerPlanGrid");
    const registerPlanLabel = refs.registerPlan ? refs.registerPlan.closest("label").querySelector("span") : null;
    const catalog = Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog();
    const journeyPlans = getPlansForJourney(journey, catalog);
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const chosenPlan = resolveJourneyPlan(journey, catalog, selectedPlanId);

    if (companyLabel) companyLabel.textContent = journey === "doctor" ? "Nome do médico" : "Empresa";
    if (refs.registerCompany) refs.registerCompany.placeholder = journey === "doctor" ? "Nome completo do médico" : "Razão social ou nome fantasia";
    if (contactSpan) contactSpan.textContent = journey === "doctor" ? "Clínica / nome de exibição" : "Responsável";
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = journey === "doctor"
        ? "Clínica, consultório ou identificação profissional"
        : "Nome do responsável pela conta";
    }
    if (refs.registerEmail) refs.registerEmail.placeholder = journey === "doctor" ? "medico@dominio.com.br" : "contato@empresa.com.br";
    if (refs.registerUsername) refs.registerUsername.placeholder = journey === "doctor" ? "Usuário profissional do médico" : "Usuário principal da empresa";
    if (journeyNote) {
      journeyNote.textContent = journey === "doctor"
        ? "Cadastro médico individual com CRM obrigatório, pagamento por créditos e liberação documental condicionada à validação administrativa do CRM."
        : "Cadastro empresarial com dashboard administrativo, gestao de medicos vinculados, indicadores de uso e controle corporativo sem emissao documental.";
    }
    if (registerCompanyCnpjField) registerCompanyCnpjField.classList.toggle("hidden", journey === "doctor");
    if (doctorFields) doctorFields.classList.toggle("hidden", journey !== "doctor");
    if (doctorResponsibilityCard) doctorResponsibilityCard.classList.toggle("hidden", journey !== "doctor");
    if (doctorValidationNote) {
      doctorValidationNote.textContent = journey !== "doctor"
        ? ""
        : "CRM, CPF e data de nascimento permanecem obrigatórios no cadastro. O acesso pode ser liberado após a contratação, mas a emissão de laudos só fica disponível depois da validação do CRM no painel administrativo.";
    }
    if (registerPlanLabel) registerPlanLabel.textContent = journey === "doctor" ? "Planos médicos disponíveis" : "Planos empresariais disponíveis";

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = journeyPlans.map((plan) => (
        `<option value="${escapeHtml(plan.id)}"${String(plan.id || "") === String(chosenPlan && chosenPlan.id ? chosenPlan.id : "") ? " selected" : ""}>${escapeHtml(fixBrokenText(plan.label || ""))} - ${escapeHtml(journey === "doctor" ? `${Number(plan.laudoLimit || 0)} documentos` : `${Number(plan.months || 0)} ${Number(plan.months || 0) === 1 ? "mês" : "meses"}`)}</option>`
      )).join("");
      refs.registerPlan.disabled = false;
      if (chosenPlan) refs.registerPlan.value = chosenPlan.id;
    }

    if (registerPlanGrid) {
      registerPlanGrid.innerHTML = buildJourneyPlanCards(journeyPlans, chosenPlan ? chosenPlan.id : "", journey);
      registerPlanGrid.querySelectorAll("[data-register-plan-card]").forEach((card) => {
        card.addEventListener("click", () => {
          if (refs.registerPlan) {
            refs.registerPlan.value = card.dataset.registerPlanCard || "";
            syncCommercialJourneyUI();
          }
        });
      });
    }

    updateRegisterUsernameSuggestions();
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    const companyCnpj = refs.registerCompanyCnpj ? refs.registerCompanyCnpj.value.replace(/\D/g, "") : "";
    let contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const crmNumber = refs.registerDoctorCrm ? refs.registerDoctorCrm.value.replace(/\D/g, "") : "";
    const crmState = refs.registerDoctorCrmUf ? refs.registerDoctorCrmUf.value : "";
    const doctorCpf = refs.registerDoctorCpf ? refs.registerDoctorCpf.value.replace(/\D/g, "") : "";
    const doctorBirthDate = refs.registerDoctorBirthDate ? refs.registerDoctorBirthDate.value : "";
    const legalTermsAccepted = document.getElementById("registerLegalTerms") ? document.getElementById("registerLegalTerms").checked : false;
    const doctorTermsAccepted = document.getElementById("registerDoctorTerms") ? document.getElementById("registerDoctorTerms").checked : false;
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = resolveJourneyPlan(
      journey,
      Array.isArray(state.planCatalog) && state.planCatalog.length ? state.planCatalog : getDefaultPlanCatalog(),
      selectedPlanId
    );

    if (!company || !email || !username || !password || !passwordConfirm) {
      setAuthStatus(isDoctorJourney
        ? "Preencha nome do médico, e-mail, usuário, senha e confirmação para solicitar o acesso médico."
        : "Preencha empresa, responsável, e-mail, usuário, senha e confirmação para criar a conta.");
      return;
    }
    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail válido para continuar.");
      return;
    }
    if (!isDoctorJourney && companyCnpj.length !== 14) {
      setAuthStatus("Informe um CNPJ válido com 14 dígitos para concluir o cadastro empresarial.");
      return;
    }
    if (!plan) {
      setAuthStatus("Selecione um plano compatível com este perfil para continuar.");
      return;
    }
    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setAuthStatus("A confirmacao da senha nao confere.");
      return;
    }
    if (!legalTermsAccepted) {
      setAuthStatus("E obrigatorio confirmar ciencia sobre o uso do sistema como apoio tecnico antes da contratacao.");
      return;
    }
    if (isDoctorJourney) {
      if (!crmNumber || crmNumber.length < 4 || !crmState) {
        setAuthStatus("Informe CRM e UF validos para solicitar o plano medico.");
        return;
      }
      if (!doctorTermsAccepted) {
        setAuthStatus("Confirme a responsabilidade tecnica medica para prosseguir com o plano medico.");
        return;
      }
      if (!contactName) contactName = company;
    } else if (!contactName) {
      setAuthStatus("Informe o responsavel da conta empresarial.");
      return;
    }

    clearDemoCommercialState();

    if (isDoctorJourney) {
      if (doctorCpf.length !== 11) {
        setAuthStatus("Informe o CPF completo do medico para concluir o cadastro profissional.");
        return;
      }
      if (!doctorBirthDate) {
        setAuthStatus("Informe a data de nascimento do medico para concluir o cadastro profissional.");
        return;
      }
    }

    if (state.authProvider === "api") {
      try {
        setAuthStatus(isDoctorJourney
          ? "Criando a conta medica e preparando o checkout comercial..."
          : "Criando a conta e preparando o checkout comercial...");
        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            companyCnpj,
            contactName,
            email,
            username,
            password,
            planId: plan.id,
            accountType: isDoctorJourney ? "doctor" : "company",
            crmNumber,
            crmState,
            doctorCpf,
            doctorBirthDate,
            legalAccepted: legalTermsAccepted,
            doctorAccepted: doctorTermsAccepted
          }
        });

        if (refs.registerForm) refs.registerForm.reset();
        syncCommercialJourneyUI();
        if (refs.loginUsername) refs.loginUsername.value = username;

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkoutUrl = response && response.checkout
          ? (response.checkout.checkoutUrl || response.checkout.sandboxCheckoutUrl || "")
          : "";

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          setAuthStatus(isDoctorJourney
            ? (popup
              ? "Cadastro medico criado. O checkout foi aberto em nova guia. A emissao continuara bloqueada ate validacao administrativa do CRM."
              : "Cadastro medico criado. Finalize o checkout para liberar o acesso. A emissao continuara bloqueada ate validacao administrativa do CRM.")
            : (popup
              ? "Solicitacao criada com sucesso. O checkout foi aberto em nova guia para concluir a liberacao comercial."
              : "Solicitacao criada com sucesso. Finalize o checkout liberado pelo sistema para concluir a ativacao."));
        } else {
          setAuthStatus(response.message || (isDoctorJourney
            ? "Cadastro medico criado. Configure o Mercado Pago para concluir a liberacao comercial. A emissao permanecera bloqueada ate validacao administrativa do CRM."
            : "Solicitacao criada. Configure o Mercado Pago para concluir a liberacao automatica."));
        }
      } catch (error) {
        setAuthStatus(error.message || "Nao foi possivel concluir a solicitacao de acesso neste momento.");
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Ja existe um acesso local com esse usuario.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Ja existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      companyCnpj,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), Number(plan.months || 1)),
      planId: plan.id,
      notes: isDoctorJourney
        ? `Cadastro medico local com CRM ${crmState}-${crmNumber}.`
        : "Cadastro empresarial local para apoio tecnico.",
      accountType: isDoctorJourney ? "doctor" : "company",
      crmNumber,
      crmState,
      doctorCpf,
      doctorBirthDate,
      crmValidated: false,
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) refs.registerForm.reset();
    syncCommercialJourneyUI();

    if (isDoctorJourney) {
      if (refs.loginUsername) refs.loginUsername.value = username;
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus("Cadastro medico criado em modo local. O acesso pode ser usado, mas a emissao de laudos continuara bloqueada ate validacao administrativa do CRM.");
      return;
    }

    setAuthStatus("Conta empresarial criada em modo local de demonstracao controlada.");
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);
    applyAuthenticatedSession(session);
  }

  function renderCompanyDoctorsList(doctors = []) {
    if (!refs.companyDoctorsList) {
      return;
    }

    if (refs.companyDoctorsCount) {
      refs.companyDoctorsCount.textContent = `${doctors.length} medico(s)`;
    }

    if (!doctors.length) {
      refs.companyDoctorsList.innerHTML = '<div class="company-empty-state">Nenhum medico vinculado ainda. Use o formulario ao lado para iniciar a gestao.</div>';
      return;
    }

    refs.companyDoctorsList.innerHTML = doctors.map((doctor) => `
      <article class="company-doctor-card">
        <div class="company-doctor-card-head">
          <div>
            <h4>${escapeHtml(doctor.name)}</h4>
            <p>Cadastro sob responsabilidade administrativa da empresa.</p>
          </div>
          <div class="company-doctor-actions">
            <span class="company-doctor-badge${doctor.accessUsername ? "" : " is-pending"}">${doctor.accessUsername ? "Login operacional ativo" : "Login pendente"}</span>
            ${doctor.accessUsername ? "" : `<button class="ghost-button" type="button" data-company-doctor-access="${escapeHtml(doctor.id)}">Gerar login</button>`}
            <button class="ghost-button" type="button" data-company-doctor-remove="${escapeHtml(doctor.id)}">Excluir</button>
          </div>
        </div>
        <div class="company-doctor-meta">
          <span class="company-doctor-chip">CRM ${escapeHtml(doctor.crmState ? `${doctor.crm}/${doctor.crmState}` : doctor.crm)}</span>
          <span class="company-doctor-chip">${escapeHtml(doctor.specialty || "Especialidade nao informada")}</span>
          <span class="company-doctor-chip${doctor.accessUsername ? "" : " is-muted"}">${doctor.accessUsername ? `Usuario ${escapeHtml(doctor.accessUsername)}` : "Usuario ainda nao gerado"}</span>
          ${doctor.accessCreatedAt ? `<span class="company-doctor-chip">Login criado em ${escapeHtml(formatDashboardDateTime(doctor.accessCreatedAt))}</span>` : ""}
          <span class="company-doctor-chip">Cadastrado em ${escapeHtml(formatDashboardDate(doctor.createdAt))}</span>
        </div>
      </article>
    `).join("");

    refs.companyDoctorsList.querySelectorAll("[data-company-doctor-access]").forEach((button) => {
      button.addEventListener("click", async () => {
        const doctorId = button.getAttribute("data-company-doctor-access") || "";
        if (!doctorId) {
          return;
        }
        await generateCompanyDoctorAccessById(doctorId);
      });
    });

    refs.companyDoctorsList.querySelectorAll("[data-company-doctor-remove]").forEach((button) => {
      button.addEventListener("click", async () => {
        const doctorId = button.getAttribute("data-company-doctor-remove") || "";
        if (!doctorId) {
          return;
        }
        const confirmed = window.confirm("Deseja realmente excluir este medico do dashboard da empresa?");
        if (!confirmed) {
          return;
        }
        await deleteCompanyDoctorById(doctorId);
      });
    });
  }

  async function createCompanyDoctorData(payload) {
    if (state.authProvider === "api") {
      return apiJson("/api/company/doctors", {
        method: "POST",
        body: payload
      });
    }

    const users = readLocalUsers();
    const companyIndex = users.findIndex((item) => item.id === (state.sessionUser && state.sessionUser.id));
    if (companyIndex === -1) {
      throw new Error("Nao foi possivel localizar a conta empresarial neste navegador.");
    }

    const companyUser = {
      ...users[companyIndex],
      linkedDoctors: normalizeCompanySessionDoctors(users[companyIndex].linkedDoctors),
      activityLog: normalizeCompanySessionActivities(users[companyIndex].activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(users[companyIndex].documentHistory, Number(users[companyIndex].usageCount || 0))
    };
    const doctors = normalizeCompanySessionDoctors(companyUser.linkedDoctors);
    if (doctors.some((item) => item.crm === payload.crm && (!item.crmState || item.crmState === payload.crmState))) {
      throw new Error("Ja existe um medico cadastrado com este CRM.");
    }

    const createdAt = new Date().toISOString();
    const doctorId = `doctor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const accessUsername = generateCompanyDoctorUsername(payload.name, users);
    const accessPassword = generateCompanyDoctorPassword();
    const passwordHash = await buildAuthHash(accessPassword);
    const nextDoctor = normalizeCompanySessionDoctor({
      id: doctorId,
      name: payload.name,
      crm: payload.crm,
      crmState: payload.crmState,
      specialty: payload.specialty,
      createdAt,
      accessUserId: "",
      accessUsername,
      accessCreatedAt: createdAt,
      responsibilityMode: "company",
      crmValidated: true
    });

    const doctorUser = buildLocalUserRecord({
      company: companyUser.company,
      username: accessUsername,
      passwordHash,
      role: "buyer",
      status: companyUser.status === "blocked" ? "blocked" : (companyUser.status === "inadimplente" ? "inadimplente" : "active"),
      expiresAt: null,
      contactName: payload.name,
      email: "",
      paymentStatus: companyUser.paymentStatus || "approved",
      paymentDueAt: companyUser.paymentDueAt || null,
      planId: companyUser.planId || "individual_25",
      notes: `Medico corporativo vinculado a ${companyUser.company}.`,
      accountType: "doctor",
      crmNumber: payload.crm,
      crmState: payload.crmState,
      doctorCpf: "",
      doctorBirthDate: "",
      crmValidated: true,
      responsibilityMode: "company",
      linkedCompanyId: companyUser.id,
      linkedCompanyDoctorId: doctorId,
      companyLogoDataUrl: companyUser.companyLogoDataUrl || "",
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });
    nextDoctor.accessUserId = doctorUser.id;

    const nextCompanyUser = {
      ...companyUser,
      linkedDoctors: [nextDoctor, ...doctors],
      activityLog: appendCompanySessionActivity(companyUser, {
        doctorName: nextDoctor.name,
        action: `Medico vinculado ao painel corporativo com acesso operacional liberado (${nextDoctor.accessUsername})`
      }),
      updatedAt: createdAt
    };

    users[companyIndex] = nextCompanyUser;
    users.push(doctorUser);
    writeLocalUsers(users);

    const session = buildLocalSessionUser(nextCompanyUser);
    persistLocalSessionUser(session);

    return {
      user: session,
      doctorAccess: {
        doctorId: nextDoctor.id,
        doctorName: nextDoctor.name,
        username: nextDoctor.accessUsername,
        password: accessPassword
      }
    };
  }

  async function createCompanyDoctorAccessData(doctorId) {
    if (state.authProvider === "api") {
      return apiJson(`/api/company/doctors/${encodeURIComponent(doctorId)}/access`, {
        method: "POST"
      });
    }

    const users = readLocalUsers();
    const companyIndex = users.findIndex((item) => item.id === (state.sessionUser && state.sessionUser.id));
    if (companyIndex === -1) {
      throw new Error("Nao foi possivel localizar a conta empresarial neste navegador.");
    }

    const companyUser = {
      ...users[companyIndex],
      linkedDoctors: normalizeCompanySessionDoctors(users[companyIndex].linkedDoctors),
      activityLog: normalizeCompanySessionActivities(users[companyIndex].activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(users[companyIndex].documentHistory, Number(users[companyIndex].usageCount || 0))
    };
    const doctors = normalizeCompanySessionDoctors(companyUser.linkedDoctors);
    const doctorIndex = doctors.findIndex((item) => item.id === doctorId);
    if (doctorIndex === -1) {
      throw new Error("Medico nao localizado nesta empresa.");
    }

    const currentDoctor = doctors[doctorIndex];
    if (currentDoctor.accessUserId || currentDoctor.accessUsername) {
      throw new Error("Este medico ja possui acesso operacional gerado.");
    }

    const createdAt = new Date().toISOString();
    const accessUsername = generateCompanyDoctorUsername(currentDoctor.name, users);
    const accessPassword = generateCompanyDoctorPassword();
    const passwordHash = await buildAuthHash(accessPassword);
    const doctorUser = buildLocalUserRecord({
      company: companyUser.company,
      username: accessUsername,
      passwordHash,
      role: "buyer",
      status: companyUser.status === "blocked" ? "blocked" : (companyUser.status === "inadimplente" ? "inadimplente" : "active"),
      expiresAt: null,
      contactName: currentDoctor.name,
      email: "",
      paymentStatus: companyUser.paymentStatus || "approved",
      paymentDueAt: companyUser.paymentDueAt || null,
      planId: companyUser.planId || "individual_25",
      notes: `Medico corporativo vinculado a ${companyUser.company}.`,
      accountType: "doctor",
      crmNumber: currentDoctor.crm,
      crmState: currentDoctor.crmState || "",
      doctorCpf: "",
      doctorBirthDate: "",
      crmValidated: true,
      responsibilityMode: "company",
      linkedCompanyId: companyUser.id,
      linkedCompanyDoctorId: currentDoctor.id,
      companyLogoDataUrl: companyUser.companyLogoDataUrl || "",
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });

    doctors[doctorIndex] = normalizeCompanySessionDoctor({
      ...currentDoctor,
      accessUserId: doctorUser.id,
      accessUsername,
      accessCreatedAt: createdAt,
      responsibilityMode: "company",
      crmValidated: true
    });

    const nextCompanyUser = {
      ...companyUser,
      linkedDoctors: doctors,
      activityLog: appendCompanySessionActivity(companyUser, {
        doctorName: currentDoctor.name,
        action: `Acesso operacional gerado para o medico (${accessUsername})`
      }),
      updatedAt: createdAt
    };

    users[companyIndex] = nextCompanyUser;
    users.push(doctorUser);
    writeLocalUsers(users);

    const session = buildLocalSessionUser(nextCompanyUser);
    persistLocalSessionUser(session);

    return {
      user: session,
      doctorAccess: {
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        username: accessUsername,
        password: accessPassword
      }
    };
  }

  async function deleteCompanyDoctorData(doctorId) {
    if (state.authProvider === "api") {
      const response = await apiJson(`/api/company/doctors/${encodeURIComponent(doctorId)}`, {
        method: "DELETE"
      });
      return response.user;
    }

    const users = readLocalUsers();
    const companyIndex = users.findIndex((item) => item.id === (state.sessionUser && state.sessionUser.id));
    if (companyIndex === -1) {
      throw new Error("Nao foi possivel localizar a conta empresarial neste navegador.");
    }

    const companyUser = {
      ...users[companyIndex],
      linkedDoctors: normalizeCompanySessionDoctors(users[companyIndex].linkedDoctors),
      activityLog: normalizeCompanySessionActivities(users[companyIndex].activityLog),
      documentHistory: normalizeCompanySessionDocumentHistory(users[companyIndex].documentHistory, Number(users[companyIndex].usageCount || 0))
    };
    const doctors = normalizeCompanySessionDoctors(companyUser.linkedDoctors);
    const doctor = doctors.find((item) => item.id === doctorId);
    if (!doctor) {
      throw new Error("Medico nao localizado nesta empresa.");
    }

    const nextUsers = users.filter((item, index) => {
      if (index === companyIndex) {
        return true;
      }
      return !(isCompanyManagedDoctorUser(item)
        && String(item.linkedCompanyId || "").trim() === companyUser.id
        && String(item.linkedCompanyDoctorId || "").trim() === doctorId);
    });

    const nextCompanyIndex = nextUsers.findIndex((item) => item.id === companyUser.id);
    const nextCompanyUser = {
      ...companyUser,
      linkedDoctors: doctors.filter((item) => item.id !== doctorId),
      activityLog: appendCompanySessionActivity(companyUser, {
        doctorName: doctor.name,
        action: `Medico removido do dashboard corporativo (CRM ${doctor.crm})`
      }),
      updatedAt: new Date().toISOString()
    };

    nextUsers[nextCompanyIndex] = nextCompanyUser;
    writeLocalUsers(nextUsers);

    const session = buildLocalSessionUser(nextCompanyUser);
    persistLocalSessionUser(session);
    return session;
  }

  async function handleCompanyDoctorSubmit(event) {
    event.preventDefault();

    const name = refs.companyDoctorName ? refs.companyDoctorName.value.trim() : "";
    const crm = refs.companyDoctorCrm ? refs.companyDoctorCrm.value.replace(/\D/g, "") : "";
    const crmState = refs.companyDoctorCrmState ? refs.companyDoctorCrmState.value : "";
    const specialty = refs.companyDoctorSpecialty ? refs.companyDoctorSpecialty.value.trim() : "";

    if (!name || !crm || !crmState) {
      setCompanyDashboardStatus("Informe nome, CRM e UF para adicionar o medico ao dashboard.");
      return;
    }

    try {
      setCompanyDashboardStatus("Salvando medico vinculado e preparando o login operacional...");
      const response = await createCompanyDoctorData({ name, crm, crmState, specialty });
      state.sessionUser = response && response.user ? response.user : response;
      if (refs.companyDoctorForm) {
        refs.companyDoctorForm.reset();
      }
      renderCompanyDashboard();
      renderCompanyDoctorAccess(response && response.doctorAccess ? response.doctorAccess : null);
      setCompanyDashboardStatus(response && response.doctorAccess
        ? "Medico vinculado com login operacional gerado. Copie as credenciais abaixo e envie ao profissional."
        : "Medico vinculado com sucesso ao ambiente empresa.");
    } catch (error) {
      setCompanyDashboardStatus(error.message || "Nao foi possivel adicionar o medico.");
    }
  }

  async function generateCompanyDoctorAccessById(doctorId) {
    try {
      setCompanyDashboardStatus("Gerando login operacional para o medico...");
      const response = await createCompanyDoctorAccessData(doctorId);
      state.sessionUser = response && response.user ? response.user : response;
      renderCompanyDashboard();
      renderCompanyDoctorAccess(response && response.doctorAccess ? response.doctorAccess : null);
      setCompanyDashboardStatus(response && response.doctorAccess
        ? "Login operacional gerado com sucesso. Copie as credenciais e compartilhe com seguranca."
        : "Login operacional gerado com sucesso.");
    } catch (error) {
      if (isMissingCompanyDoctorAccessRouteError(error)) {
        setCompanyDashboardStatus("O servidor ativo ainda nao conhece a rota de geracao de login medico. Reinicie ou publique o backend atualizado e tente novamente.");
        return;
      }
      setCompanyDashboardStatus(error.message || "Nao foi possivel gerar o login do medico.");
    }
  }

  async function deleteCompanyDoctorById(doctorId) {
    try {
      setCompanyDashboardStatus("Removendo medico do dashboard...");
      const updatedUser = await deleteCompanyDoctorData(doctorId);
      state.sessionUser = updatedUser;
      if (state.companyLastDoctorAccess && state.companyLastDoctorAccess.doctorId === doctorId) {
        clearCompanyDoctorAccess();
      }
      renderCompanyDashboard();
      setCompanyDashboardStatus("Medico removido com sucesso.");
    } catch (error) {
      setCompanyDashboardStatus(error.message || "Nao foi possivel remover o medico.");
    }
  }

  async function handleLogout() {
    const wasDemo = Boolean(state.demoModeEnabled);

    if (!wasDemo && state.authProvider === "api") {
      try {
        await apiJson(AUTH_API.logout, { method: "POST" });
      } catch (error) {
        console.error(error);
      }
    } else if (!wasDemo) {
      clearLocalSessionUser();
    }

    clearDemoCommercialState();
    clearCompanyDoctorAccess();
    state.sessionUser = null;
    state.companyLogoDraft = "";
    document.body.classList.remove("company-mode");

    if (refs.adminShell) refs.adminShell.classList.add("hidden");
    if (refs.appShell) refs.appShell.classList.add("hidden");
    if (refs.companyDashboard) refs.companyDashboard.classList.add("hidden");
    if (refs.authShell) refs.authShell.classList.remove("hidden");
    closeInlineAdminPanel();
    closeAuthPanel(false);

    if (wasDemo) {
      state.authProvider = "api";
      await loadAuthBootstrap();
      setAuthStatus("Demonstracao encerrada com sucesso.");
      return;
    }

    setAuthMode(state.authBootstrap && state.authBootstrap.configured ? "login" : "setup");
    setAuthStatus("Sessao encerrada com sucesso.");
  }

  function applyAuthenticatedSession(session) {
    state.sessionUser = session || null;
    const isAdminSession = Boolean(session && (session.role === "admin" || session.isAdmin));
    const isDemoSession = Boolean(session && normalizeAccountType(session.accountType) === "demo");
    const isCompanyBuyerSession = isCompanySession(session);

    if (!isCompanyBuyerSession) {
      clearCompanyDoctorAccess();
    }

    closeAuthPanel(true);

    if (refs.authShell) {
      refs.authShell.classList.add("hidden");
    }

    if (refs.adminShell) {
      refs.adminShell.classList.toggle("hidden", !isAdminSession);
    }
    if (refs.appShell) {
      refs.appShell.classList.toggle("hidden", isAdminSession);
    }

    if (isAdminSession) {
      document.body.classList.remove("company-mode");
      document.body.classList.remove("demo-mode");
      setDemoReadOnly(false);
      hideDemoTour();
      renderBuyerRenewalBanner(null);
      setAuthAccessType("admin", { preserveMode: true });
      if (refs.adminSessionUserLabel) {
        refs.adminSessionUserLabel.textContent = session && session.company
          ? `${session.username} - ${session.company}`
          : (session && session.username ? session.username : "Administrador");
      }
      if (refs.adminPanel) {
        refs.adminPanel.classList.remove("hidden");
      }
      setAdminView(state.adminCurrentView || "overview");
      state.adminPanelOpen = true;
      loadInlineAdminUsers().catch((error) => {
        if (refs.adminStatusNote) {
          refs.adminStatusNote.textContent = error.message || "Nao foi possivel carregar os acessos cadastrados.";
        }
      });
      return;
    }

    setAuthAccessType("buyer", { preserveMode: true });
    updateAppShellChrome(session);
    if (refs.sessionUserLabel) {
      refs.sessionUserLabel.textContent = session && session.company
        ? `${session.username} - ${session.company}`
        : (session && session.username ? session.username : "Sessao ativa");
    }

    if (refs.reportCompany && !refs.reportCompany.value && session && session.company) {
      refs.reportCompany.value = session.company;
    }

    if (refs.companyDashboard) {
      refs.companyDashboard.classList.toggle("hidden", !isCompanyBuyerSession);
    }
    if (refs.homePanel) {
      refs.homePanel.classList.toggle("hidden", isCompanyBuyerSession);
    }
    if (refs.workspace) {
      refs.workspace.classList.add("hidden");
    }

    if (isDemoSession) {
      document.body.classList.remove("company-mode");
      document.body.classList.add("demo-mode");
      state.demoModeEnabled = true;
      setDemoReadOnly(true);
      renderBuyerRenewalBanner(null);
      window.requestAnimationFrame(() => {
        renderDemoTour();
      });
      return;
    }

    if (isCompanyBuyerSession) {
      document.body.classList.remove("demo-mode");
      document.body.classList.add("company-mode");
      state.demoModeEnabled = false;
      state.companyLogoDraft = session && session.companyLogoDataUrl ? session.companyLogoDataUrl : "";
      setCompanyDashboardStatus("");
      setDemoReadOnly(false);
      hideDemoTour();
      renderBuyerRenewalBanner(null);
      renderCompanyDashboard();
      return;
    }

    document.body.classList.remove("company-mode");
    document.body.classList.remove("demo-mode");
    state.demoModeEnabled = false;
    setDemoReadOnly(false);
    hideDemoTour();
    renderBuyerRenewalBanner(session);
  }

  function buildJourneyPlanCards(plans = [], selectedPlanId = "", journey = "company") {
    return plans.map((plan) => buildPlanShowcaseCard({
      ...plan,
      audience: journey === "doctor" ? "Medico" : "Empresa"
    }, {
      selectedPlanId,
      interactive: true
    })).join("");
  }

  function syncCommercialJourneyUI() {
    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const companyLabel = document.getElementById("registerCompanyLabel");
    const contactSpan = refs.registerContactName ? refs.registerContactName.closest("label").querySelector("span") : null;
    const journeyNote = document.getElementById("registerJourneyNote");
    const doctorFields = document.getElementById("doctorCredentialFields");
    const doctorResponsibilityCard = document.getElementById("doctorResponsibilityCard");
    const doctorValidationNote = document.getElementById("registerDoctorValidationNote");
    const registerCompanyCnpjField = document.getElementById("registerCompanyCnpjField");
    const registerPlanGrid = document.getElementById("registerPlanGrid");
    const registerPlanLabel = refs.registerPlan ? refs.registerPlan.closest("label").querySelector("span") : null;
    const registerSubmitButton = refs.registerSubmitButton;
    const catalog = getStoredPlanCatalog({ includeInactive: false });
    const journeyPlans = getPlansForJourney(journey, catalog);
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const chosenPlan = resolveJourneyPlan(journey, catalog, selectedPlanId);

    if (companyLabel) companyLabel.textContent = isDoctorJourney ? "Nome do médico" : "Empresa";
    if (refs.registerCompany) refs.registerCompany.placeholder = isDoctorJourney ? "Nome completo do médico" : "Razão social ou nome fantasia";
    if (contactSpan) contactSpan.textContent = isDoctorJourney ? "Clínica / nome de exibição" : "Responsável";
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = isDoctorJourney
        ? "Clínica, consultório ou identificação profissional"
        : "Nome do responsável pela conta";
    }
    if (refs.registerEmail) refs.registerEmail.placeholder = isDoctorJourney ? "medico@dominio.com.br" : "contato@empresa.com.br";
    if (refs.registerUsername) refs.registerUsername.placeholder = isDoctorJourney ? "Usuário profissional do médico" : "Usuário principal da empresa";

    if (journeyNote) {
      journeyNote.textContent = isDoctorJourney
        ? "Cadastro médico com contratação comercial integrada. O plano recorrente mensal libera 30 laudos por ciclo, enquanto os demais seguem em formato avulso por pacote."
        : "Cadastro empresarial com planos administráveis pelo painel, valores sincronizados com a tela inicial e checkout comercial centralizado no Mercado Pago.";
    }

    if (registerCompanyCnpjField) registerCompanyCnpjField.classList.toggle("hidden", isDoctorJourney);
    if (doctorFields) doctorFields.classList.toggle("hidden", !isDoctorJourney);
    if (doctorResponsibilityCard) doctorResponsibilityCard.classList.toggle("hidden", !isDoctorJourney);

    if (doctorValidationNote) {
      doctorValidationNote.textContent = !isDoctorJourney
        ? ""
        : "CRM, CPF e data de nascimento permanecem obrigatórios no cadastro. O médico pode contratar assinatura mensal com 30 laudos por ciclo ou pacotes avulsos para consumo por contrato.";
    }

    if (registerPlanLabel) {
      registerPlanLabel.textContent = isDoctorJourney ? "Plano médico selecionado" : "Plano empresarial selecionado";
    }

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = journeyPlans.map((plan) => (
        `<option value="${escapeHtml(plan.id)}"${String(plan.id || "") === String(chosenPlan && chosenPlan.id ? chosenPlan.id : "") ? " selected" : ""}>${escapeHtml(buildPlanRegisterOptionLabel(plan))}</option>`
      )).join("");
      refs.registerPlan.disabled = !journeyPlans.length;
      if (chosenPlan) {
        refs.registerPlan.value = chosenPlan.id;
      }
    }

    renderSelectedPlanBrief(chosenPlan, journey);

    if (registerSubmitButton) {
      const billingModel = chosenPlan ? normalizeClientPlanBillingModel(chosenPlan.billingModel) : "one_time";
      registerSubmitButton.textContent = billingModel === "subscription"
        ? "Assinar plano no Mercado Pago"
        : "Criar conta e seguir para pagamento";
    }

    if (registerPlanGrid) {
      registerPlanGrid.innerHTML = buildJourneyPlanCards(journeyPlans, chosenPlan ? chosenPlan.id : "", journey);
      registerPlanGrid.querySelectorAll("[data-register-plan-card]").forEach((card) => {
        const selectPlan = () => {
          if (!refs.registerPlan) {
            return;
          }
          refs.registerPlan.value = card.dataset.registerPlanCard || "";
          syncCommercialJourneyUI();
        };
        card.addEventListener("click", selectPlan);
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectPlan();
          }
        });
      });
    }

    updateRegisterUsernameSuggestions();
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    const companyCnpj = refs.registerCompanyCnpj ? refs.registerCompanyCnpj.value.replace(/\D/g, "") : "";
    let contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const crmNumber = refs.registerDoctorCrm ? refs.registerDoctorCrm.value.replace(/\D/g, "") : "";
    const crmState = refs.registerDoctorCrmUf ? refs.registerDoctorCrmUf.value : "";
    const doctorCpf = refs.registerDoctorCpf ? refs.registerDoctorCpf.value.replace(/\D/g, "") : "";
    const doctorBirthDate = refs.registerDoctorBirthDate ? refs.registerDoctorBirthDate.value : "";
    const legalTermsAccepted = document.getElementById("registerLegalTerms") ? document.getElementById("registerLegalTerms").checked : false;
    const doctorTermsAccepted = document.getElementById("registerDoctorTerms") ? document.getElementById("registerDoctorTerms").checked : false;
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = resolveJourneyPlan(journey, getStoredPlanCatalog({ includeInactive: false }), selectedPlanId);
    const isSubscriptionPlan = plan && normalizeClientPlanBillingModel(plan.billingModel) === "subscription";

    if (!company || !email || !username || !password || !passwordConfirm) {
      setAuthStatus(isDoctorJourney
        ? "Preencha nome do medico, e-mail, usuario, senha e confirmacao para solicitar o acesso medico."
        : "Preencha empresa, responsavel, e-mail, usuario, senha e confirmacao para criar a conta.");
      return;
    }
    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail valido para continuar.");
      return;
    }
    if (!isDoctorJourney && companyCnpj.length !== 14) {
      setAuthStatus("Informe um CNPJ valido com 14 digitos para concluir o cadastro empresarial.");
      return;
    }
    if (!plan) {
      setAuthStatus("Selecione um plano compativel com este perfil para continuar.");
      return;
    }
    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setAuthStatus("A confirmação da senha não confere.");
      return;
    }
    if (!legalTermsAccepted) {
      setAuthStatus("Confirme a ciência sobre o uso do sistema como apoio técnico para continuar.");
      return;
    }
    if (isDoctorJourney) {
      if (!crmNumber || crmNumber.length < 4 || !crmState) {
        setAuthStatus("Informe CRM e UF válidos para solicitar o plano médico.");
        return;
      }
      if (doctorCpf.length !== 11) {
        setAuthStatus("Informe o CPF completo do médico para concluir o cadastro.");
        return;
      }
      if (!doctorBirthDate) {
        setAuthStatus("Informe a data de nascimento do médico para concluir o cadastro.");
        return;
      }
      if (!doctorTermsAccepted) {
        setAuthStatus("Confirme a responsabilidade técnica médica para prosseguir.");
        return;
      }
      if (!contactName) {
        contactName = company;
      }
    } else if (!contactName) {
      setAuthStatus("Informe o responsável da conta empresarial.");
      return;
    }

    clearDemoCommercialState();

    if (state.authProvider === "api") {
      try {
        setAuthStatus(isSubscriptionPlan
          ? "Criando a conta e preparando a assinatura recorrente no Mercado Pago..."
          : "Criando a conta e preparando o checkout comercial...");

        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            companyCnpj,
            contactName,
            email,
            username,
            password,
            planId: plan.id,
            accountType: isDoctorJourney ? "doctor" : "company",
            crmNumber,
            crmState,
            doctorCpf,
            doctorBirthDate,
            legalAccepted: legalTermsAccepted,
            doctorAccepted: doctorTermsAccepted
          }
        });

        if (refs.registerForm) refs.registerForm.reset();
        syncCommercialJourneyUI();
        if (refs.loginUsername) refs.loginUsername.value = response && response.user && response.user.username ? response.user.username : username;

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkout = response && response.checkout ? response.checkout : {};
        const checkoutUrl = checkout.checkoutUrl || checkout.sandboxCheckoutUrl || "";
        const checkoutMode = normalizeClientPlanBillingModel(checkout.type || plan.billingModel);

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          if (checkoutMode === "subscription") {
            setAuthStatus(isDoctorJourney
              ? (popup
                ? "Cadastro médico criado. A assinatura mensal foi aberta em nova guia. São 30 laudos por ciclo após confirmação do pagamento."
                : "Cadastro médico criado. Finalize a assinatura mensal para liberar 30 laudos por ciclo.")
              : (popup
                ? "Conta criada. A assinatura recorrente foi aberta em nova guia para concluir a ativação comercial."
                : "Conta criada. Finalize a assinatura recorrente para concluir a ativação comercial."));
          } else {
            setAuthStatus(isDoctorJourney
              ? (popup
                ? "Cadastro médico criado. O checkout do pacote foi aberto em nova guia para concluir a liberação comercial."
                : "Cadastro médico criado. Finalize o checkout do pacote para concluir a liberação comercial.")
              : (popup
                ? "Solicitação criada com sucesso. O checkout foi aberto em nova guia para concluir a ativação comercial."
                : "Solicitação criada com sucesso. Finalize o checkout para concluir a ativação comercial."));
          }
          applyCheckoutStatusAction(response);
        } else {
          setAuthStatus(response.message || (checkoutMode === "subscription"
            ? "Conta criada. Configure o Mercado Pago para concluir a assinatura recorrente."
            : "Conta criada. Configure o Mercado Pago para concluir o checkout automático."));
        }
      } catch (error) {
        setAuthStatus(error.message || "Não foi possível concluir a solicitação de acesso neste momento.");
        applyCheckoutStatusAction(error && error.payload ? error.payload : null);
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Já existe um acesso local com esse usuário.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Já existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      companyCnpj,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), Number(plan.months || 1)),
      planId: plan.id,
      notes: isDoctorJourney
        ? `Cadastro médico local com CRM ${crmState}-${crmNumber}.`
        : "Cadastro empresarial local para apoio técnico.",
      accountType: isDoctorJourney ? "doctor" : "company",
      crmNumber,
      crmState,
      doctorCpf,
      doctorBirthDate,
      crmValidated: false,
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) refs.registerForm.reset();
    syncCommercialJourneyUI();

    if (isDoctorJourney) {
      if (refs.loginUsername) refs.loginUsername.value = username;
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus(isSubscriptionPlan
        ? "Cadastro médico criado em modo local. A assinatura recorrente ficou simulada neste navegador."
        : "Cadastro médico criado em modo local. O pacote comercial ficou registrado neste navegador.");
      return;
    }

    setAuthStatus("Conta empresarial criada em modo local.");
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);
    applyAuthenticatedSession(session);
  }

  function updateAuthEntryCopy() {
    const isAdmin = state.authAccessType === "admin";
    const isRegister = state.authMode === "register";
    const isSetup = state.authMode === "setup";
    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const providerLabel = state.authProvider === "local" ? "local" : "SaaS";
    const accessGrid = document.getElementById("authAccessGrid");

    if (refs.authModeBadge) {
      refs.authModeBadge.textContent = isSetup
        ? "Configuração do administrador"
        : isRegister
          ? (isDoctorJourney ? "Cadastro médico" : "Cadastro empresarial")
          : (isAdmin ? `Acesso administrador ${providerLabel}` : `Acesso profissional ${providerLabel}`);
    }

    if (refs.authTitle) {
      refs.authTitle.textContent = isSetup
        ? "Configurar administrador da plataforma"
        : isRegister
          ? (isDoctorJourney ? "Solicitar plano médico" : "Solicitar plano empresarial")
          : (isAdmin ? "Entrar no painel administrativo" : "Entrar na área profissional");
    }

    if (refs.authDescription) {
      refs.authDescription.textContent = isSetup
        ? "Fluxo inicial do administrador principal da plataforma."
        : isRegister
          ? (isDoctorJourney
            ? "Cadastro exclusivo para médico com CRM válido, assinatura mensal de 30 laudos ou pacote avulso, sempre condicionado ao pagamento aprovado."
            : "Cadastro empresarial voltado ao dashboard administrativo, gestão de médicos vinculados e indicadores de uso.")
          : (isAdmin
            ? "Entrada restrita para clientes, pagamentos, bloqueios, renovações e acompanhamento de uso."
            : "Use este acesso para entrar com a conta contratada. Empresas acessam o dashboard administrativo; médicos autenticados acessam a área técnica.");
    }

    if (refs.loginSubmitButton) {
      refs.loginSubmitButton.textContent = isAdmin ? "Entrar no painel administrativo" : "Entrar na área profissional";
    }

    if (refs.showRegisterButton) {
      refs.showRegisterButton.textContent = "Ver planos";
      refs.showRegisterButton.classList.toggle("hidden", isAdmin || isRegister || isSetup);
    }

    if (refs.showLoginFromRegisterButton) {
      refs.showLoginFromRegisterButton.textContent = "Voltar para login";
    }

    if (refs.showSetupButton) {
      refs.showSetupButton.classList.toggle("hidden", !isAdmin || isSetup || (state.authBootstrap && state.authBootstrap.configured));
    }

    if (accessGrid) {
      accessGrid.classList.toggle("hidden", isRegister || isSetup);
    }

    syncCommercialJourneyUI();
  }

  function syncCommercialJourneyUI() {
    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const companyLabel = document.getElementById("registerCompanyLabel");
    const contactSpan = refs.registerContactName ? refs.registerContactName.closest("label").querySelector("span") : null;
    const journeyNote = document.getElementById("registerJourneyNote");
    const doctorFields = document.getElementById("doctorCredentialFields");
    const doctorResponsibilityCard = document.getElementById("doctorResponsibilityCard");
    const doctorValidationNote = document.getElementById("registerDoctorValidationNote");
    const registerCompanyCnpjField = document.getElementById("registerCompanyCnpjField");
    const registerPlanGrid = document.getElementById("registerPlanGrid");
    const registerPlanLabel = refs.registerPlan ? refs.registerPlan.closest("label").querySelector("span") : null;
    const registerSubmitButton = refs.registerSubmitButton;
    const catalog = getStoredPlanCatalog({ includeInactive: false });
    const journeyPlans = getPlansForJourney(journey, catalog);
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const chosenPlan = resolveJourneyPlan(journey, catalog, selectedPlanId);

    if (companyLabel) companyLabel.textContent = isDoctorJourney ? "Nome do médico" : "Empresa";
    if (refs.registerCompany) refs.registerCompany.placeholder = isDoctorJourney ? "Nome completo do médico" : "Razão social ou nome fantasia";
    if (contactSpan) contactSpan.textContent = isDoctorJourney ? "Clínica / nome de exibição" : "Responsável";
    if (refs.registerContactName) {
      refs.registerContactName.placeholder = isDoctorJourney
        ? "Clínica, consultório ou identificação profissional"
        : "Nome do responsável pela conta";
    }
    if (refs.registerEmail) refs.registerEmail.placeholder = isDoctorJourney ? "medico@dominio.com.br" : "contato@empresa.com.br";
    if (refs.registerUsername) refs.registerUsername.placeholder = isDoctorJourney ? "Usuário profissional do médico" : "Usuário principal da empresa";

    if (journeyNote) {
      journeyNote.textContent = isDoctorJourney
        ? "Cadastro médico com contratação comercial integrada. O plano recorrente mensal libera 30 laudos por ciclo, enquanto os demais seguem em formato avulso por pacote."
        : "Cadastro empresarial com planos administráveis pelo painel, valores sincronizados com a tela inicial e checkout comercial centralizado no Mercado Pago.";
    }

    if (registerCompanyCnpjField) registerCompanyCnpjField.classList.toggle("hidden", isDoctorJourney);
    if (doctorFields) doctorFields.classList.toggle("hidden", !isDoctorJourney);
    if (doctorResponsibilityCard) doctorResponsibilityCard.classList.toggle("hidden", !isDoctorJourney);

    if (doctorValidationNote) {
      doctorValidationNote.textContent = !isDoctorJourney
        ? ""
        : "CRM, CPF e data de nascimento permanecem obrigatórios no cadastro. O médico pode contratar assinatura mensal com 30 laudos por ciclo ou pacotes avulsos para consumo por contrato.";
    }

    if (registerPlanLabel) {
      registerPlanLabel.textContent = isDoctorJourney ? "Plano médico selecionado" : "Plano empresarial selecionado";
    }

    if (refs.registerPlan) {
      refs.registerPlan.innerHTML = journeyPlans.map((plan) => (
        `<option value="${escapeHtml(plan.id)}"${String(plan.id || "") === String(chosenPlan && chosenPlan.id ? chosenPlan.id : "") ? " selected" : ""}>${escapeHtml(buildPlanRegisterOptionLabel(plan))}</option>`
      )).join("");
      refs.registerPlan.disabled = !journeyPlans.length;
      if (chosenPlan) {
        refs.registerPlan.value = chosenPlan.id;
      }
    }

    renderSelectedPlanBrief(chosenPlan, journey);

    if (registerSubmitButton) {
      const billingModel = chosenPlan ? normalizeClientPlanBillingModel(chosenPlan.billingModel) : "one_time";
      registerSubmitButton.textContent = billingModel === "subscription"
        ? "Assinar plano no Mercado Pago"
        : "Criar conta e seguir para pagamento";
    }

    if (registerPlanGrid) {
      registerPlanGrid.innerHTML = buildJourneyPlanCards(journeyPlans, chosenPlan ? chosenPlan.id : "", journey);
      registerPlanGrid.querySelectorAll("[data-register-plan-card]").forEach((card) => {
        const selectPlan = () => {
          if (!refs.registerPlan) {
            return;
          }
          refs.registerPlan.value = card.dataset.registerPlanCard || "";
          syncCommercialJourneyUI();
        };
        card.addEventListener("click", selectPlan);
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectPlan();
          }
        });
      });
    }

    updateRegisterUsernameSuggestions();
  }

  async function handlePublicRegistration(event) {
    event.preventDefault();

    if (window.location.protocol === "file:") {
      redirectToPreferredAppOrigin();
      return;
    }

    const journey = getCommercialJourney();
    const isDoctorJourney = journey === "doctor";
    const company = refs.registerCompany ? refs.registerCompany.value.trim() : "";
    const companyCnpj = refs.registerCompanyCnpj ? refs.registerCompanyCnpj.value.replace(/\D/g, "") : "";
    let contactName = refs.registerContactName ? refs.registerContactName.value.trim() : "";
    const email = refs.registerEmail ? refs.registerEmail.value.trim().toLowerCase() : "";
    const username = refs.registerUsername ? refs.registerUsername.value.trim() : "";
    const password = refs.registerPassword ? refs.registerPassword.value : "";
    const passwordConfirm = refs.registerPasswordConfirm ? refs.registerPasswordConfirm.value : "";
    const crmNumber = refs.registerDoctorCrm ? refs.registerDoctorCrm.value.replace(/\D/g, "") : "";
    const crmState = refs.registerDoctorCrmUf ? refs.registerDoctorCrmUf.value : "";
    const doctorCpf = refs.registerDoctorCpf ? refs.registerDoctorCpf.value.replace(/\D/g, "") : "";
    const doctorBirthDate = refs.registerDoctorBirthDate ? refs.registerDoctorBirthDate.value : "";
    const legalTermsAccepted = document.getElementById("registerLegalTerms") ? document.getElementById("registerLegalTerms").checked : false;
    const doctorTermsAccepted = document.getElementById("registerDoctorTerms") ? document.getElementById("registerDoctorTerms").checked : false;
    const selectedPlanId = refs.registerPlan ? refs.registerPlan.value : "";
    const plan = resolveJourneyPlan(journey, getStoredPlanCatalog({ includeInactive: false }), selectedPlanId);
    const isSubscriptionPlan = plan && normalizeClientPlanBillingModel(plan.billingModel) === "subscription";

    if (!company || !email || !username || !password || !passwordConfirm) {
      setAuthStatus(isDoctorJourney
        ? "Preencha nome do médico, e-mail, usuário, senha e confirmação para solicitar o acesso médico."
        : "Preencha empresa, responsável, e-mail, usuário, senha e confirmação para criar a conta.");
      return;
    }
    if (!email.includes("@")) {
      setAuthStatus("Informe um e-mail válido para continuar.");
      return;
    }
    if (!isDoctorJourney && companyCnpj.length !== 14) {
      setAuthStatus("Informe um CNPJ válido com 14 dígitos para concluir o cadastro empresarial.");
      return;
    }
    if (!plan) {
      setAuthStatus("Selecione um plano compatível com este perfil para continuar.");
      return;
    }
    if (password.length < 6) {
      setAuthStatus("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setAuthStatus("A confirmação da senha não confere.");
      return;
    }
    if (!legalTermsAccepted) {
      setAuthStatus("Confirme a ciência sobre o uso do sistema como apoio técnico para continuar.");
      return;
    }
    if (isDoctorJourney) {
      if (!crmNumber || crmNumber.length < 4 || !crmState) {
        setAuthStatus("Informe CRM e UF válidos para solicitar o plano médico.");
        return;
      }
      if (doctorCpf.length !== 11) {
        setAuthStatus("Informe o CPF completo do médico para concluir o cadastro.");
        return;
      }
      if (!doctorBirthDate) {
        setAuthStatus("Informe a data de nascimento do médico para concluir o cadastro.");
        return;
      }
      if (!doctorTermsAccepted) {
        setAuthStatus("Confirme a responsabilidade técnica médica para prosseguir.");
        return;
      }
      if (!contactName) {
        contactName = company;
      }
    } else if (!contactName) {
      setAuthStatus("Informe o responsável da conta empresarial.");
      return;
    }

    clearDemoCommercialState();

    if (state.authProvider === "api") {
      try {
        setAuthStatus(isSubscriptionPlan
          ? "Criando a conta e preparando a assinatura recorrente no Mercado Pago..."
          : "Criando a conta e preparando o checkout comercial...");

        const response = await apiJson("/api/public/register-company", {
          method: "POST",
          body: {
            company,
            companyCnpj,
            contactName,
            email,
            username,
            password,
            planId: plan.id,
            accountType: isDoctorJourney ? "doctor" : "company",
            crmNumber,
            crmState,
            doctorCpf,
            doctorBirthDate,
            legalAccepted: legalTermsAccepted,
            doctorAccepted: doctorTermsAccepted
          }
        });

        if (refs.registerForm) refs.registerForm.reset();
        syncCommercialJourneyUI();
        if (refs.loginUsername) refs.loginUsername.value = response && response.user && response.user.username ? response.user.username : username;

        setAuthAccessType("buyer", { preserveMode: true });
        setAuthMode("login");

        const checkout = response && response.checkout ? response.checkout : {};
        const checkoutUrl = checkout.checkoutUrl || checkout.sandboxCheckoutUrl || "";
        const checkoutMode = normalizeClientPlanBillingModel(checkout.type || plan.billingModel);

        if (checkoutUrl) {
          const popup = window.open(checkoutUrl, "_blank", "noopener");
          if (checkoutMode === "subscription") {
            setAuthStatus(isDoctorJourney
              ? (popup
                ? "Cadastro médico criado. A assinatura mensal foi aberta em nova guia. São 30 laudos por ciclo após confirmação do pagamento."
                : "Cadastro médico criado. Finalize a assinatura mensal para liberar 30 laudos por ciclo.")
              : (popup
                ? "Conta criada. A assinatura recorrente foi aberta em nova guia para concluir a ativação comercial."
                : "Conta criada. Finalize a assinatura recorrente para concluir a ativação comercial."));
          } else {
            setAuthStatus(isDoctorJourney
              ? (popup
                ? "Cadastro médico criado. O checkout do pacote foi aberto em nova guia para concluir a liberação comercial."
                : "Cadastro médico criado. Finalize o checkout do pacote para concluir a liberação comercial.")
              : (popup
                ? "Solicitação criada com sucesso. O checkout foi aberto em nova guia para concluir a ativação comercial."
                : "Solicitação criada com sucesso. Finalize o checkout para concluir a ativação comercial."));
          }
          applyCheckoutStatusAction(response);
        } else {
          setAuthStatus(response.message || (checkoutMode === "subscription"
            ? "Conta criada. Configure o Mercado Pago para concluir a assinatura recorrente."
            : "Conta criada. Configure o Mercado Pago para concluir o checkout automático."));
        }
      } catch (error) {
        setAuthStatus(error.message || "Não foi possível concluir a solicitação de acesso neste momento.");
        applyCheckoutStatusAction(error && error.payload ? error.payload : null);
      }
      return;
    }

    const users = readLocalUsers();
    const usernameKey = normalizeUserIdentifier(username);
    if (users.some((item) => item.usernameKey === usernameKey)) {
      setAuthStatus("Já existe um acesso local com esse usuário.");
      return;
    }
    if (users.some((item) => normalizeUserIdentifier(item.email) === normalizeUserIdentifier(email))) {
      setAuthStatus("Já existe uma conta local vinculada a este e-mail.");
      return;
    }

    const passwordHash = await buildAuthHash(password);
    const newUser = buildLocalUserRecord({
      company,
      companyCnpj,
      username,
      passwordHash,
      role: "buyer",
      status: "active",
      expiresAt: null,
      contactName,
      email,
      paymentStatus: "approved",
      paymentDueAt: addMonthsToIso(new Date(), Number(plan.months || 1)),
      planId: plan.id,
      notes: isDoctorJourney
        ? `Cadastro médico local com CRM ${crmState}-${crmNumber}.`
        : "Cadastro empresarial local para apoio técnico.",
      accountType: isDoctorJourney ? "doctor" : "company",
      crmNumber,
      crmState,
      doctorCpf,
      doctorBirthDate,
      crmValidated: false,
      linkedDoctors: [],
      activityLog: [],
      documentHistory: []
    });

    users.push(newUser);
    writeLocalUsers(users);

    if (refs.registerForm) refs.registerForm.reset();
    syncCommercialJourneyUI();

    if (isDoctorJourney) {
      if (refs.loginUsername) refs.loginUsername.value = username;
      setAuthAccessType("buyer", { preserveMode: true });
      setAuthMode("login");
      setAuthStatus(isSubscriptionPlan
        ? "Cadastro médico criado em modo local. A assinatura recorrente ficou simulada neste navegador."
        : "Cadastro médico criado em modo local. O pacote comercial ficou registrado neste navegador.");
      return;
    }

    setAuthStatus("Conta empresarial criada em modo local.");
    const session = buildLocalSessionUser(newUser);
    persistLocalSessionUser(session);
    applyAuthenticatedSession(session);
  }

  const CID_FIELD_DEFINITION_MAP = Object.freeze({
    auditiva: { codeId: "audioCid", descriptionId: "audioCidDescription" },
    fisica: { codeId: "physicalCid", descriptionId: "physicalCidDescription" },
    clinicas: { codeId: "clinicalCid", descriptionId: "clinicalCidDescription" },
    visual: { codeId: "visualCid", descriptionId: "visualCidDescription" },
    intelectual: { codeId: "intellectualCid", descriptionId: "intellectualCidDescription" },
    psicossocial: { codeId: "psychosocialCid", descriptionId: "psychosocialCidDescription" }
  });

  const CID_DESCRIPTION_MAP_EXTENDED = Object.freeze({
    "F33.2": "Transtorno depressivo recorrente, epis\u00f3dio atual grave sem sintomas psic\u00f3ticos",
    "F79": "Defici\u00eancia intelectual n\u00e3o especificada",
    "H54.0": "Cegueira em ambos os olhos",
    "H54.4": "Cegueira em um olho",
    "H90.3": "Perda auditiva neurossensorial bilateral",
    "M21.7": "Desigualdade (adquirida) do comprimento dos membros",
    "M54.5": "Dor lombar baixa",
    "M79.7": "Fibromialgia",
    "S68.0": "Amputa\u00e7\u00e3o traum\u00e1tica do polegar (completa) (parcial)"
  });

  const CID_DESCRIPTION_RUNTIME_CACHE = new Map(
    Object.entries(CID_DESCRIPTION_MAP_EXTENDED).map(([code, description]) => [
      normalizeCidCode(code),
      normalizePdfTextValue(description)
    ])
  );
  const CID_DESCRIPTION_LOOKUP_REQUESTS = new Map();
  const CID_DESCRIPTION_LOOKUP_TIMERS = new Map();
  const CID_DESCRIPTION_SEARCH_CACHE = new Map();
  const CID_DESCRIPTION_SEARCH_TIMERS = new Map();
  const CID_SUGGESTION_DATALIST_ID = "cidSuggestionList";

  function normalizePdfTextValue(value) {
    return normalizeSpacing(String(value || ""));
  }

  function isNonInformativePdfValue(value) {
    const normalized = normalizePdfTextValue(value).toLowerCase();
    return !normalized
      || normalized === "nao informado"
      || normalized === "n\u00e3o informado"
      || normalized === "sem matricula"
      || normalized === "sem matr\u00edcula";
  }

  function getCidFieldDefinition(moduleKey = state.activeModule) {
    return moduleKey && CID_FIELD_DEFINITION_MAP[moduleKey]
      ? CID_FIELD_DEFINITION_MAP[moduleKey]
      : null;
  }

  function parseCidEntry(value) {
    const raw = normalizePdfTextValue(value)
      .replace(/[–—]/g, "-")
      .replace(/â€“|â€”/g, "-");
    if (!raw) {
      return { code: "", description: "" };
    }

    const match = raw.match(/^([A-Za-z][A-Za-z0-9]{1,3}(?:[.,][A-Za-z0-9]{1,4})?)(?:\s*[\u2013\u2014-]\s*(.+))?$/);
    if (match) {
      return {
        code: normalizeCidCode(match[1]),
        description: normalizePdfTextValue(match[2] || "")
      };
    }

    const separatorMatch = raw.match(/^(.+?)\s*[\u2013\u2014-]\s*(.+)$/);
    if (separatorMatch) {
      return {
        code: normalizeCidCode(separatorMatch[1]),
        description: normalizePdfTextValue(separatorMatch[2])
      };
    }

    const normalizedCode = normalizeCidCode(raw);
    return /^[A-Z]\d/.test(normalizedCode)
      ? { code: normalizedCode, description: "" }
      : { code: "", description: raw };
  }

  function lookupCidDescription(code) {
    const normalizedCode = normalizeCidCode(code);
    return normalizedCode ? (CID_DESCRIPTION_RUNTIME_CACHE.get(normalizedCode) || "") : "";
  }

  function isEligibleCidLookupCode(code) {
    return /^[A-Z]\d{2}(?:\.[A-Z0-9]{1,4})?$/i.test(normalizeCidCode(code));
  }

  async function fetchCidDescriptionFromApi(code) {
    const normalizedCode = normalizeCidCode(code);
    if (!isEligibleCidLookupCode(normalizedCode)) {
      return "";
    }

    const cached = lookupCidDescription(normalizedCode);
    if (cached) {
      return cached;
    }

    if (CID_DESCRIPTION_LOOKUP_REQUESTS.has(normalizedCode)) {
      return CID_DESCRIPTION_LOOKUP_REQUESTS.get(normalizedCode);
    }

    const request = (async () => {
      try {
        const payload = await apiJson(`/api/cid/lookup?code=${encodeURIComponent(normalizedCode)}`);
        const description = normalizePdfTextValue(payload.description || "");
        if (description) {
          CID_DESCRIPTION_RUNTIME_CACHE.set(normalizedCode, description);
        }
        return description;
      } catch (error) {
        console.error("Falha ao consultar descricao automatica do CID.", error);
        return "";
      } finally {
        CID_DESCRIPTION_LOOKUP_REQUESTS.delete(normalizedCode);
      }
    })();

    CID_DESCRIPTION_LOOKUP_REQUESTS.set(normalizedCode, request);
    return request;
  }

  function ensureCidSuggestionDatalist() {
    let datalist = document.getElementById(CID_SUGGESTION_DATALIST_ID);
    if (!datalist) {
      datalist = document.createElement("datalist");
      datalist.id = CID_SUGGESTION_DATALIST_ID;
      document.body.appendChild(datalist);
    }

    Object.values(CID_FIELD_DEFINITION_MAP).forEach((definition) => {
      const field = document.getElementById(definition.codeId);
      if (field) {
        field.setAttribute("list", CID_SUGGESTION_DATALIST_ID);
        field.setAttribute("autocomplete", "off");
        field.setAttribute("spellcheck", "false");
      }
    });

    return datalist;
  }

  function renderCidSuggestionOptions(items = []) {
    const datalist = ensureCidSuggestionDatalist();
    datalist.innerHTML = "";

    items.slice(0, 8).forEach((item) => {
      if (!item || !item.code) {
        return;
      }

      const option = document.createElement("option");
      const normalizedCode = normalizeCidCode(item.code);
      const description = normalizePdfTextValue(item.description || lookupCidDescription(normalizedCode));
      option.value = normalizedCode || item.code;
      option.label = description ? `${normalizedCode} - ${description}` : (normalizedCode || item.code);
      if (description) {
        option.textContent = option.label;
      }
      datalist.appendChild(option);
    });
  }

  async function fetchCidSuggestionsFromApi(query) {
    const normalizedQuery = normalizePdfTextValue(query);
    if (!normalizedQuery || normalizedQuery.length < 2) {
      return [];
    }

    const cacheKey = normalizeCidCode(normalizedQuery) || normalizedQuery.toUpperCase();
    if (CID_DESCRIPTION_SEARCH_CACHE.has(cacheKey)) {
      return CID_DESCRIPTION_SEARCH_CACHE.get(cacheKey);
    }

    try {
      const payload = await apiJson(`/api/cid/search?q=${encodeURIComponent(normalizedQuery)}`);
      const items = Array.isArray(payload.items)
        ? payload.items
          .map((item) => ({
            code: normalizeCidCode(item.code),
            description: normalizePdfTextValue(item.description)
          }))
          .filter((item) => item.code && item.description)
        : [];

      items.forEach((item) => {
        CID_DESCRIPTION_RUNTIME_CACHE.set(item.code, item.description);
      });
      if (!items.length) {
        const normalizedCode = normalizeCidCode(normalizedQuery);
        if (isEligibleCidLookupCode(normalizedCode)) {
          const description = await fetchCidDescriptionFromApi(normalizedCode);
          if (description) {
            const fallbackItems = [{ code: normalizedCode, description }];
            CID_DESCRIPTION_SEARCH_CACHE.set(cacheKey, fallbackItems);
            return fallbackItems;
          }
        }
      }
      CID_DESCRIPTION_SEARCH_CACHE.set(cacheKey, items);
      return items;
    } catch (error) {
      const normalizedCode = normalizeCidCode(normalizedQuery);
      if (isEligibleCidLookupCode(normalizedCode)) {
        const description = await fetchCidDescriptionFromApi(normalizedCode);
        if (description) {
          const fallbackItems = [{ code: normalizedCode, description }];
          CID_DESCRIPTION_SEARCH_CACHE.set(cacheKey, fallbackItems);
          return fallbackItems;
        }
      }
      return [];
    }
  }

  function scheduleCidSuggestionLookup(moduleKey, rawValue) {
    const definition = getCidFieldDefinition(moduleKey);
    if (!definition) {
      return;
    }

    const codeField = document.getElementById(definition.codeId);
    if (!codeField) {
      return;
    }

    const query = normalizePdfTextValue(rawValue);
    const timerKey = `${definition.codeId}:search`;
    if (CID_DESCRIPTION_SEARCH_TIMERS.has(timerKey)) {
      window.clearTimeout(CID_DESCRIPTION_SEARCH_TIMERS.get(timerKey));
    }

    if (!query || query.length < 2) {
      renderCidSuggestionOptions([]);
      return;
    }

    CID_DESCRIPTION_SEARCH_TIMERS.set(timerKey, window.setTimeout(async () => {
      CID_DESCRIPTION_SEARCH_TIMERS.delete(timerKey);

      const currentRawValue = normalizePdfTextValue(codeField.value);
      if (currentRawValue !== query) {
        return;
      }

      const items = await fetchCidSuggestionsFromApi(query);
      if (normalizePdfTextValue(codeField.value) !== query) {
        return;
      }

      renderCidSuggestionOptions(items);

      const exactMatch = items.find((item) => item.code === normalizeCidCode(query));
      if (!exactMatch || !exactMatch.description) {
        return;
      }

      const descriptionField = document.getElementById(definition.descriptionId);
      if (descriptionField && shouldOverwriteCidDescriptionField(descriptionField, exactMatch.description)) {
        descriptionField.value = exactMatch.description;
        descriptionField.dataset.autoFilled = "true";
        descriptionField.dataset.autoValue = exactMatch.description;
      }
    }, 180));
  }

  function scheduleCidDescriptionLookup(moduleKey, code) {
    const definition = getCidFieldDefinition(moduleKey);
    if (!definition) {
      return;
    }

    const codeField = document.getElementById(definition.codeId);
    const descriptionField = document.getElementById(definition.descriptionId);
    const normalizedCode = normalizeCidCode(code);
    if (
      !codeField
      || !descriptionField
      || !isEligibleCidLookupCode(normalizedCode)
      || lookupCidDescription(normalizedCode)
    ) {
      return;
    }

    const timerKey = definition.codeId;
    if (CID_DESCRIPTION_LOOKUP_TIMERS.has(timerKey)) {
      window.clearTimeout(CID_DESCRIPTION_LOOKUP_TIMERS.get(timerKey));
    }

    CID_DESCRIPTION_LOOKUP_TIMERS.set(timerKey, window.setTimeout(async () => {
      CID_DESCRIPTION_LOOKUP_TIMERS.delete(timerKey);

      const currentCode = parseCidEntry(codeField.value).code;
      if (normalizeCidCode(currentCode) !== normalizedCode) {
        return;
      }

      const resolvedDescription = await fetchCidDescriptionFromApi(normalizedCode);
      if (!resolvedDescription) {
        return;
      }

      const latestCode = parseCidEntry(codeField.value).code;
      if (normalizeCidCode(latestCode) !== normalizedCode) {
        return;
      }

      if (shouldOverwriteCidDescriptionField(descriptionField, resolvedDescription)) {
        descriptionField.value = resolvedDescription;
        descriptionField.dataset.autoFilled = "true";
        descriptionField.dataset.autoValue = resolvedDescription;
      }
    }, 260));
  }

  async function ensureCidDescriptionResolvedForModule(moduleKey = state.activeModule) {
    const definition = getCidFieldDefinition(moduleKey);
    if (!definition) {
      return "";
    }

    const codeField = document.getElementById(definition.codeId);
    const descriptionField = document.getElementById(definition.descriptionId);
    const parsed = parseCidEntry(codeField ? codeField.value : valueOfRaw(definition.codeId));
    const currentDescription = normalizePdfTextValue(
      descriptionField ? descriptionField.value : valueOfRaw(definition.descriptionId)
    ) || parsed.description || lookupCidDescription(parsed.code);

    if (!parsed.code || currentDescription) {
      return currentDescription;
    }

    const resolvedDescription = await fetchCidDescriptionFromApi(parsed.code);
    if (
      resolvedDescription
      && descriptionField
      && shouldOverwriteCidDescriptionField(descriptionField, resolvedDescription)
    ) {
      descriptionField.value = resolvedDescription;
      descriptionField.dataset.autoFilled = "true";
      descriptionField.dataset.autoValue = resolvedDescription;
    }

    return resolvedDescription || currentDescription;
  }

  function resolveCurrentCid() {
    const definition = getCidFieldDefinition(state.activeModule);
    if (!definition) {
      return "";
    }
    return parseCidEntry(valueOfRaw(definition.codeId)).code;
  }

  function resolveCurrentCidDescription(moduleKey = state.activeModule) {
    const definition = getCidFieldDefinition(moduleKey);
    if (!definition) {
      return "";
    }

    const parsed = parseCidEntry(valueOfRaw(definition.codeId));
    const manualDescription = normalizePdfTextValue(valueOfRaw(definition.descriptionId));
    return manualDescription || parsed.description || lookupCidDescription(parsed.code);
  }

  function formatarCID(codigo, descricao) {
    const normalizedCode = normalizeCidCode(codigo);
    const normalizedDescription = normalizePdfTextValue(descricao);
    if (!normalizedCode && !normalizedDescription) {
      return "N\u00e3o informado";
    }
    if (normalizedCode && normalizedDescription) {
      return `${normalizedCode} \u2013 ${normalizedDescription}`;
    }
    return normalizedCode || normalizedDescription || "N\u00e3o informado";
  }

  function formatCid(cid, description = "") {
    const parsed = parseCidEntry(cid);
    const normalizedCode = parsed.code;
    const resolvedDescription = normalizePdfTextValue(description)
      || parsed.description
      || (normalizedCode && normalizedCode === resolveCurrentCid() ? resolveCurrentCidDescription() : "")
      || lookupCidDescription(normalizedCode);
    return formatarCID(normalizedCode, resolvedDescription);
  }

  function shouldOverwriteCidDescriptionField(descriptionField, nextDescription) {
    const currentValue = normalizePdfTextValue(descriptionField.value);
    const previousAutoValue = normalizePdfTextValue(descriptionField.dataset.autoValue || "");
    return !currentValue
      || descriptionField.dataset.autoFilled === "true"
      || currentValue === previousAutoValue
      || currentValue === normalizePdfTextValue(nextDescription);
  }

  function syncCidDescriptionField(moduleKey, options = {}) {
    const definition = getCidFieldDefinition(moduleKey);
    if (!definition) {
      return;
    }

    const codeField = document.getElementById(definition.codeId);
    const descriptionField = document.getElementById(definition.descriptionId);
    if (!codeField || !descriptionField) {
      return;
    }

    const parsed = parseCidEntry(codeField.value);
    if (options.normalizeCodeField && parsed.code) {
      codeField.value = parsed.code;
    }

    const mappedDescription = lookupCidDescription(parsed.code);
    const nextDescription = parsed.description || mappedDescription;

    if (nextDescription && shouldOverwriteCidDescriptionField(descriptionField, nextDescription)) {
      descriptionField.value = nextDescription;
      descriptionField.dataset.autoFilled = parsed.description ? "false" : "true";
      descriptionField.dataset.autoValue = parsed.description ? "" : nextDescription;
      return;
    }

    if (!nextDescription && descriptionField.dataset.autoFilled === "true") {
      descriptionField.value = "";
      descriptionField.dataset.autoFilled = "false";
      descriptionField.dataset.autoValue = "";
    }

    if (!nextDescription && parsed.code) {
      scheduleCidSuggestionLookup(moduleKey, parsed.code);
      scheduleCidDescriptionLookup(moduleKey, parsed.code);
    }
  }

  function syncAllCidDescriptionFields(options = {}) {
    Object.keys(CID_FIELD_DEFINITION_MAP).forEach((moduleKey) => {
      syncCidDescriptionField(moduleKey, options);
    });
  }

  function findCidModuleKeyByFieldId(fieldId) {
    return Object.keys(CID_FIELD_DEFINITION_MAP).find((moduleKey) => {
      const definition = getCidFieldDefinition(moduleKey);
      return definition && (definition.codeId === fieldId || definition.descriptionId === fieldId);
    }) || "";
  }

  function bindCidDescriptionFields() {
    if (state.cidDescriptionBindingsApplied) {
      return;
    }

    state.cidDescriptionBindingsApplied = true;
    document.addEventListener("input", (event) => {
      const fieldId = event && event.target ? event.target.id : "";
      const moduleKey = findCidModuleKeyByFieldId(fieldId);
      if (!moduleKey) {
        return;
      }

      const definition = getCidFieldDefinition(moduleKey);
      if (!definition) {
        return;
      }

      if (fieldId === definition.codeId) {
        syncCidDescriptionField(moduleKey);
        scheduleCidSuggestionLookup(moduleKey, event.target.value);
        return;
      }

      if (fieldId === definition.descriptionId) {
        event.target.dataset.autoFilled = "false";
        event.target.dataset.autoValue = "";
      }
    }, true);

    const normalizeCidFromEvent = (event) => {
      const fieldId = event && event.target ? event.target.id : "";
      const moduleKey = findCidModuleKeyByFieldId(fieldId);
      if (!moduleKey) {
        return;
      }

      const definition = getCidFieldDefinition(moduleKey);
      if (definition && fieldId === definition.codeId) {
        syncCidDescriptionField(moduleKey, { normalizeCodeField: true });
        scheduleCidSuggestionLookup(moduleKey, event.target.value);
      }
    };

    document.addEventListener("change", normalizeCidFromEvent, true);
    document.addEventListener("blur", normalizeCidFromEvent, true);

    ensureCidSuggestionDatalist();
    syncAllCidDescriptionFields({ normalizeCodeField: true });
  }

  function resolveReportRegistration(identity = {}) {
    const candidates = [
      identity.workerRegistration,
      identity.workerEnrollment,
      identity.workerId,
      valueOfRaw("reportWorkerRegistration"),
      valueOfRaw("reportWorkerEnrollment"),
      valueOfRaw("reportWorkerId"),
      valueOfRaw("reportEnrollment"),
      valueOfRaw("reportMatricula"),
      valueOfRaw("workerMatricula")
    ];

    return candidates
      .map((value) => normalizePdfTextValue(value))
      .find((value) => !isNonInformativePdfValue(value)) || "";
  }

  function normalizeLaudoIdentityForPdf(identity = {}) {
    return {
      ...identity,
      workerName: normalizePdfTextValue(identity.workerName) || "N\u00e3o informado",
      workerCpf: normalizePdfTextValue(identity.workerCpf) || "N\u00e3o informado",
      workerBirthDate: normalizePdfTextValue(identity.workerBirthDate) || "N\u00e3o informado",
      reportDate: normalizePdfTextValue(identity.reportDate) || "N\u00e3o informado",
      origin: normalizePdfTextValue(identity.origin) || inferOriginFromCurrentCase() || "outra",
      company: normalizePdfTextValue(identity.company) || "N\u00e3o informado",
      role: normalizePdfTextValue(identity.role) || "N\u00e3o informado",
      sector: normalizePdfTextValue(identity.sector) || "N\u00e3o informado",
      examiner: normalizePdfTextValue(identity.examiner) || "N\u00e3o informado",
      examinerRegistry: normalizePdfTextValue(identity.examinerRegistry) || "N\u00e3o informado",
      examinerSpecialty: normalizePdfTextValue(identity.examinerSpecialty) || "N\u00e3o informado",
      unit: normalizePdfTextValue(identity.unit) || "N\u00e3o informado",
      workerRegistration: resolveReportRegistration(identity)
    };
  }

  function buildPdfDateToken(value) {
    const raw = normalizePdfTextValue(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw.replace(/-/g, "");
    }

    const parsedDate = raw ? new Date(raw) : new Date();
    const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const year = safeDate.getFullYear();
    const month = String(safeDate.getMonth() + 1).padStart(2, "0");
    const day = String(safeDate.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  function sanitizePdfFilePart(value, fallback = "NAO_INFORMADO") {
    const baseValue = isNonInformativePdfValue(value) ? fallback : normalizePdfTextValue(value);
    const normalized = baseValue
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/_+/g, "_")
      .toUpperCase();
    return normalized || fallback;
  }

  function buildPdfFileName(identity = {}) {
    const normalizedIdentity = identity && typeof identity === "object"
      ? identity
      : { workerName: identity };
    const safeIdentity = normalizeLaudoIdentityForPdf(normalizedIdentity);
    const nameToken = sanitizePdfFilePart(safeIdentity.workerName, "TRABALHADOR");
    const registrationToken = sanitizePdfFilePart(
      resolveReportRegistration(safeIdentity)
        || String(safeIdentity.workerCpf || "").replace(/\D+/g, "")
        || "SEM_MATRICULA",
      "SEM_MATRICULA"
    );
    const dateToken = buildPdfDateToken(safeIdentity.reportDate);
    return `Laudo_PCD_${nameToken}_${registrationToken}_${dateToken}.pdf`;
  }

  function buildPdfPayload(identity, result, attachments = []) {
    const safeIdentity = normalizeLaudoIdentityForPdf(identity);
    return {
      title: "LAUDO CARACTERIZADOR DE DEFICIENCIA",
      moduleLabel: moduleConfigs[state.activeModule] ? toPresentationText(moduleConfigs[state.activeModule].title) : "Modulo nao especificado",
      identity: safeIdentity,
      result,
      attachments: Array.isArray(attachments) ? attachments : [],
      technicalBasis: toPresentationText(buildTechnicalBasisText(state.activeModule, result)) || "Nao informado",
      generatedAt: new Date()
    };
  }

  function getLaudoActionContext() {
    const accountType = normalizeAccountType(state.sessionUser && state.sessionUser.accountType);
    let message = "";

    if (accountType === "demo" || state.demoModeEnabled) {
      message = "O modo demonstracao permite apenas navegacao assistida e minuta visual. Conclusao documental, assinatura e validade juridica permanecem bloqueadas.";
    } else if (accountType !== "doctor") {
      message = "A conclusao do documento exige medico autenticado com CRM valido e responsabilidade tecnica assumida. Usuarios empresariais nao podem emitir ou assinar documentos.";
    } else if (!state.sessionUser || !state.sessionUser.crmValidated) {
      message = "A emissao do laudo permanece bloqueada ate a validacao administrativa do CRM no painel do sistema.";
    } else if (!state.lastResult || state.lastResult.status !== "eligible") {
      message = "O laudo final so pode ser emitido quando o caso estiver classificado como enquadrado.";
    }

    if (message) {
      setPdfActionStatus(message);
      window.alert(message);
      return null;
    }

    return {
      identity: normalizeLaudoIdentityForPdf(collectReportIdentity()),
      printFiles: collectPrintPackageFiles()
    };
  }

  async function loadImage(src) {
    return new Promise((resolve, reject) => {
      const candidates = buildImageSourceCandidates(src);
      let currentIndex = 0;

      const tryLoad = () => {
        if (currentIndex >= candidates.length) {
          reject(new Error(`Falha ao carregar a imagem-base do laudo: ${src}`));
          return;
        }

        const candidate = candidates[currentIndex];
        const image = new Image();
        if (/^https?:/i.test(candidate)) {
          image.crossOrigin = "anonymous";
        }
        image.decoding = "async";
        image.onload = () => resolve(image);
        image.onerror = () => {
          currentIndex += 1;
          tryLoad();
        };
        image.src = candidate;
      };

      tryLoad();
    });
  }

  async function buildOfficialLaudoCanvas(payload = {}) {
    const image = await loadImage(OFFICIAL_LAUDO_TEMPLATE.imagePath);
    const width = Number(image.naturalWidth || image.width || 0);
    const height = Number(image.naturalHeight || image.height || 0);
    if (!width || !height) {
      throw new Error("A imagem-base do laudo retornou dimensoes invalidas.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Nao foi possivel inicializar a area grafica para montar o laudo.");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    applyTemplateOverlay(ctx, canvas.width, canvas.height, payload);
    return canvas;
  }

  async function buildLaudoPdfBlob(payload = {}) {
    const canvas = await buildOfficialLaudoCanvas(payload);
    let dataUrl = "";

    try {
      dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    } catch (error) {
      throw new Error("Falha ao converter o laudo em imagem para gerar o PDF.");
    }

    if (!/^data:image\/jpeg;base64,/i.test(dataUrl)) {
      throw new Error("O conteudo do laudo foi gerado em formato invalido para PDF.");
    }

    const blob = createPdfBlobFromJpegDataUrl(
      dataUrl,
      canvas.width,
      canvas.height,
      OFFICIAL_LAUDO_TEMPLATE.pdfWidth,
      OFFICIAL_LAUDO_TEMPLATE.pdfHeight
    );

    if (!(blob instanceof Blob) || !blob.size) {
      throw new Error("O PDF do laudo foi gerado sem conteudo.");
    }

    return blob;
  }

  function applyTemplateOverlay(ctx, width, height, payload) {
    const safePayload = payload && typeof payload === "object" ? payload : {};
    const safeIdentity = normalizeLaudoIdentityForPdf(safePayload.identity || {});
    const template = OFFICIAL_LAUDO_TEMPLATE;
    const color = "#111111";
    const workerName = safeIdentity.workerName;
    const cpf = safeIdentity.workerCpf;
    const cid = formatarCID(resolveCurrentCid(), resolveCurrentCidDescription());
    const origin = safeIdentity.origin || inferOriginFromCurrentCase() || "outra";
    const description = normalizePdfTextValue(buildOfficialDescriptionText({ ...safePayload, identity: safeIdentity })) || "N\u00e3o informado";
    const limitations = normalizePdfTextValue(buildOfficialLimitationsText({ ...safePayload, identity: safeIdentity })) || "N\u00e3o informado";
    const professional = safeIdentity.examiner;
    const registry = safeIdentity.examinerRegistry;
    const signatureLine = joinSupportNotes([professional, registry]) || "N\u00e3o informado";
    const date = formatDateForReport(safeIdentity.reportDate) || "N\u00e3o informado";

    drawBoxText(ctx, workerName, template.nameField.x, template.nameField.y, template.nameField.width, template.nameField.paddingY, template.nameField.font, color);
    drawBoxText(ctx, cpf, template.cpfField.x, template.cpfField.y, template.cpfField.width, template.cpfField.paddingY, template.cpfField.font, color);
    drawBoxText(ctx, cid, template.cidField.x, template.cidField.y, template.cidField.width, template.cidField.paddingY, template.cidField.font, color);

    drawOriginMark(ctx, origin, color);

    drawParagraphAutoFit(
      ctx,
      description,
      template.descriptionRect.x,
      template.descriptionRect.y,
      template.descriptionRect.width,
      template.descriptionRect.height,
      color,
      template.descriptionRect.fontSizes,
      "Arial"
    );
    drawParagraphAutoFit(
      ctx,
      limitations,
      template.limitationsRect.x,
      template.limitationsRect.y,
      template.limitationsRect.width,
      template.limitationsRect.height,
      color,
      template.limitationsRect.fontSizes,
      "Arial"
    );

    markSectionByModule(ctx, state.activeModule, color, safePayload);
    drawTechnicalDetailByModule(ctx, state.activeModule, safePayload, color);

    drawBoxText(ctx, signatureLine, template.signatureField.x, template.signatureField.y, template.signatureField.width, template.signatureField.paddingY, template.signatureField.font, color);
    drawBoxText(ctx, date, template.dateField.x, template.dateField.y, template.dateField.width, template.dateField.paddingY, template.dateField.font, color);
  }

  async function handlePdfSave() {
    const context = getLaudoActionContext();
    if (!context) {
      return;
    }

    setPdfActionStatus("Gerando PDF do laudo para salvar...");

    try {
      await ensureCidDescriptionResolvedForModule();
      const pdfPayload = buildPdfPayload(context.identity, state.lastResult, []);
      const blob = await buildLaudoPdfBlob(pdfPayload);
      if (!(blob instanceof Blob) || !blob.size) {
        throw new Error("O arquivo PDF foi gerado vazio.");
      }

      const fileName = buildPdfFileName(context.identity);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1200);

      await registerLaudoUsageOnce(context.identity);
      setPdfActionStatus("PDF do laudo salvo com sucesso.");
    } catch (error) {
      console.error(error);
      const message = `Nao foi possivel salvar o PDF do laudo neste momento.${error && error.message ? `\n\nDetalhe tecnico: ${toPresentationText(error.message)}` : ""}`;
      setPdfActionStatus(message.replace(/\n+/g, " "));
      window.alert(message);
    }
  }

  bindCidDescriptionFields();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startPcdDigital);
} else {
  startPcdDigital();
}
