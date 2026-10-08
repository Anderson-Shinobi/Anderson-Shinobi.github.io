/* Bilingual EN/PT-BR content for the static portfolio.
   Official course names, project names, technology names and code remain in their original language.
   English content in the HTML is the source of truth and is restored without reloading. */
(() => {
  "use strict";

  const STORAGE_KEY = "shinobi-portfolio-language";
  const PT = {
    "INTERACTIVE LAB / 001": "LABORATÓRIO INTERATIVO / 001",
    "From source to waveform": "Do código ao sinal",
    "Explore a reproducible AVR project with source code, circuit wiring and testable hardware behavior.": "Explore um projeto AVR reproduzível com código-fonte, conexões do circuito e comportamento de hardware verificável.",
    "WOKWI PROJECT LINKED · VALIDATION PENDING": "PROJETO WOKWI VINCULADO · VALIDAÇÃO PENDENTE",
    "Run Simulation": "Executar simulação",
    "Wokwi project link supplied by the author. Open it and press Start Simulation; live behavior and VCD measurements are still awaiting independent verification.": "Link do projeto Wokwi fornecido pelo autor. Abra-o e pressione Start Simulation; o comportamento real e as medições VCD ainda precisam ser verificados de forma independente.",
    "SHINOBI / WOKWI LAB": "SHINOBI / LAB WOKWI",
    "ILLUSTRATIVE · NOT A CAPTURE": "ILUSTRATIVO · NÃO É UMA CAPTURA",
    "AVR · UNO R3 · REGISTER LEVEL": "AVR · UNO R3 · REGISTRADORES",
    "GPIO + hardware PWM on Timer1": "GPIO + PWM por hardware no Timer1",
    "Control an LED through OC1A/D9, toggle the onboard D13 LED, and examine serial messages and logic-analyzer connections — without Arduino HAL calls.": "Controle um LED pelo pino OC1A/D9, alterne o LED integrado D13 e examine as mensagens seriais e conexões do analisador lógico — sem usar funções da HAL do Arduino.",
    "10% · 50% · 90% duty": "Duty cycle de 10% · 50% · 90%",
    "UART 9600 bps": "UART 9600 bps",
    "VCD-ready wiring": "Conexões prontas para VCD",
    "View firmware and circuit": "Ver firmware e circuito",
    "Simulation instructions": "Instruções para simular",
    "Open a new Wokwi Arduino Uno editor": "Abrir novo editor Arduino Uno no Wokwi",
    "Online simulation is not published yet. Import the two source files into Wokwi to run it; results remain to be validated.": "A simulação online ainda não foi publicada. Importe os dois arquivos no Wokwi para executá-la; os resultados ainda precisam ser validados.",
  "Skip to content": "Pular para o conteúdo",
  "EMBEDDED ENGINEERING / PORTFOLIO": "ENGENHARIA EMBARCADA / PORTFÓLIO",
  "Projects": "Projetos",
  "Approach": "Método",
  "Expertise": "Especialidades",
  "About": "Sobre",
  "Let's connect": "Entre em contato",
  "ELECTRONICS · FIRMWARE · SIMULATION": "ELETRÔNICA · FIRMWARE · SIMULAÇÃO",
  "Engineering": "Engenharia",
  "what's beneath": "além do que",
  "the surface": "se vê",
  "Embedded Firmware Developer": "Desenvolvedor de Firmware Embarcado",
  "I build and validate embedded software where hardware behavior matters — from low-level C/C++ and peripherals to automated simulation, telemetry and Linux engineering tools.": "Desenvolvo e valido software embarcado onde o comportamento do hardware importa — de C/C++ de baixo nível e periféricos à simulação automatizada, telemetria e ferramentas de engenharia em Linux.",
  "Explore engineering work": "Conheça meus projetos",
  "View GitHub": "Ver GitHub",
  "REAL PROJECTS": "PROJETOS REAIS",
  "TRACEABLE RESULTS": "RESULTADOS RASTREÁVEIS",
  "NO STOCK METRICS": "SEM MÉTRICAS INVENTADAS",
  "LAB / ENGINEERING WORKFLOW": "LAB / FLUXO DE ENGENHARIA",
  "SHINOBI / BUILD SYSTEMS THAT CAN BE VERIFIED": "SHINOBI / SISTEMAS QUE PODEM SER VERIFICADOS",
  "FROM SIGNAL": "DO SINAL",
  "TO SYSTEM.": "AO SISTEMA.",
  "HARDWARE": "HARDWARE",
  "FIRMWARE": "FIRMWARE",
  "SIMULATE": "SIMULAR",
  "VALIDATE": "VALIDAR",
  "MODELS + MEASUREMENTS": "MODELOS + MEDIÇÕES",
  "ENGINEERING, NOT GUESSWORK": "ENGENHARIA, NÃO ACHISMO",
  "SCROLL TO INVESTIGATE": "ROLE PARA EXPLORAR",
  "SHINOBI ENGINEERING LAB": "LABORATÓRIO DE ENGENHARIA SHINOBI",
  "01 / SELECTED WORK": "01 / PROJETOS SELECIONADOS",
  "Proof over promises": "Provas acima de promessas",
  "Selected public repositories with technical architecture, documented behavior and reproducible engineering work.": "Repositórios públicos selecionados, com arquitetura técnica, comportamento documentado e trabalho de engenharia reproduzível.",
  "All repositories": "Todos os repositórios",
  "All work": "Todos os projetos",
  "Simulation": "Simulação",
  "Tools & Linux": "Ferramentas e Linux",
  "FEATURED / 001": "DESTAQUE / 001",
  "EMBEDDED TELEMETRY": "TELEMETRIA EMBARCADA",
  "PROTOCOL / V1": "PROTOCOLO / V1",
  "TLFRAME · 34 BYTE FRAME": "TLFRAME · QUADRO DE 34 BYTES",
  "VALIDATION: DOCUMENTED PASS": "VALIDAÇÃO: APROVADA E DOCUMENTADA",
  "Portable C++20 binary protocol with host pipeline, Zephyr firmware and Renode Cortex-M4 validation. Deterministic frames, CRC-32 and automated verification.": "Protocolo binário portátil em C++20 com pipeline no host, firmware Zephyr e validação no Renode Cortex-M4. Quadros determinísticos, CRC-32 e verificação automatizada.",
  "Host CTest": "CTest no host",
  "Zephyr tests": "Testes Zephyr",
  "Results documented in the repository README; not live test telemetry.": "Resultados documentados no README do repositório; não são telemetria de testes em tempo real.",
  "Explore source & evidence": "Ver código e evidências",
  "HARDWARE SIMULATION": "SIMULAÇÃO DE HARDWARE",
  "Authorial memory-mapped peripheral model with CONTROL, STATUS and DATA registers, SystemBus integration and automated Robot Framework validation.": "Modelo próprio de periférico mapeado em memória, com registradores CONTROL, STATUS e DATA, integração ao SystemBus e validação automatizada com Robot Framework.",
  "Explore model & tests": "Ver modelo e testes",
  "PRODUCT / 003": "PRODUTO / 003",
  "LINUX DESKTOP": "DESKTOP LINUX",
  "LOCAL-FIRST": "DADOS LOCAIS",
  "Qt6/C++17 household logistics system for stock, procurement, backups and reports. Modular controller/service design and CSV persistence.": "Sistema de logística doméstica em Qt6/C++17 para estoque, compras, backups e relatórios. Arquitetura modular de controladores e serviços, com persistência em CSV.",
  "Explore application": "Conhecer aplicação",
  "UTILITY / 004": "UTILITÁRIO / 004",
  "LINUX AUTOMATION": "AUTOMAÇÃO LINUX",
  "SAFE WORKFLOWS": "FLUXOS SEGUROS",
  "Shell-based utility for safely preparing USB drives for Linux Mint installation, with a focus on predictable system operations.": "Utilitário em Shell para preparar unidades USB com segurança para instalação do Linux Mint, com foco em operações previsíveis.",
  "Explore utility": "Conhecer utilitário",
  "02 / HOW I WORK": "02 / COMO TRABALHO",
  "Don't just run it.": "Não basta executar.",
  "Prove it works.": "É preciso comprovar.",
  "Reliable firmware development starts with assumptions you can challenge and outputs you can check. My laboratories connect electronics, implementation and validation.": "O desenvolvimento confiável de firmware começa com premissas que podem ser questionadas e resultados que podem ser verificados. Meus laboratórios conectam eletrônica, implementação e validação.",
  "See a documented validation pipeline ↗": "Veja um pipeline de validação documentado ↗",
  "Understand the hardware": "Entender o hardware",
  "Study registers, interfaces, timing and electrical constraints before coding.": "Estudar registradores, interfaces, temporização e limites elétricos antes de programar.",
  "Build deterministically": "Desenvolver de forma determinística",
  "Implement controlled, reviewable firmware with clear interfaces.": "Implementar firmware controlado, revisável e com interfaces bem definidas.",
  "Simulate and instrument": "Simular e instrumentar",
  "Use tools such as Renode and telemetry to expose behavior.": "Utilizar ferramentas como Renode e telemetria para observar o comportamento.",
  "Validate and document": "Validar e documentar",
  "Publish evidence, limitations and reproducible test procedures.": "Publicar evidências, limitações e procedimentos de teste reproduzíveis.",
  "03 / TECHNICAL FOCUS": "03 / FOCO TÉCNICO",
  "From registers to systems": "Dos registradores aos sistemas",
  "A multidisciplinary approach connecting firmware, simulation and practical engineering tools.": "Uma abordagem multidisciplinar que conecta firmware, simulação e ferramentas práticas de engenharia.",
  "Low-level firmware": "Firmware de baixo nível",
  "Bare-metal C/C++, drivers, ARM Cortex-M, register-level programming and hardware interfaces.": "C/C++ bare-metal, drivers, ARM Cortex-M, programação em nível de registradores e interfaces de hardware.",
  "Simulation & testing": "Simulação e testes",
  "MMIO modeling, virtual platforms, real-time firmware and repeatable automated validation.": "Modelagem MMIO, plataformas virtuais, firmware de tempo real e validação automatizada reproduzível.",
  "Linux engineering": "Engenharia em Linux",
  "Native tooling, desktop applications, CLI automation and build pipelines.": "Ferramentas nativas, aplicações desktop, automação via CLI e pipelines de compilação.",
  "Hardware diagnostics": "Diagnóstico de hardware",
  "PCB analysis, electronics troubleshooting, fault isolation and measurement-driven reasoning.": "Análise de PCBs, diagnóstico eletrônico, isolamento de falhas e investigação orientada por medições.",
  "Electronics · Instrumentation · Debugging": "Eletrônica · Instrumentação · Depuração",
  "HARDWARE THINKING / SOFTWARE DISCIPLINE": "RACIOCÍNIO DE HARDWARE / DISCIPLINA DE SOFTWARE",
  "04 / THE ENGINEER": "04 / O PROFISSIONAL",
  "Curiosity, measured": "Curiosidade com método",
  "I'm Anderson Nogueira, an embedded firmware developer with a foundation in electronics diagnostics and software engineering. I enjoy converting difficult hardware problems into observable, documented systems.": "Sou Anderson Nogueira, desenvolvedor de firmware embarcado com experiência em diagnóstico eletrônico e engenharia de software. Gosto de transformar problemas difíceis de hardware em sistemas observáveis e documentados.",
  "My academic background spans Electronics, Systems Analysis and Development, postgraduate studies in Electronics Engineering and Robotics, and ongoing undergraduate Physics studies. I use physics and mathematical reasoning to improve the way I design and validate firmware.": "Minha formação inclui Eletrônica, Análise e Desenvolvimento de Sistemas, pós-graduação em Engenharia Eletrônica e Robótica e graduação em Física em andamento. Utilizo a Física e o raciocínio matemático para aprimorar o desenvolvimento e a validação de firmware.",
  "My portfolio is organized around practical work: repositories, experiments, test evidence and transparent technical limitations.": "Meu portfólio é organizado em torno da prática: repositórios, experimentos, evidências de testes e limitações técnicas apresentadas com transparência.",
  "Explore technical training ↗": "Conheça minha formação complementar ↗",
  "05 / CONTINUOUS LEARNING": "05 / APRENDIZADO CONTÍNUO",
  "Study. Build. Verify. Repeat.": "Estudar. Construir. Validar. Repetir.",
  "Courses establish foundations; laboratories demonstrate understanding. Explore my areas of continued training in bare-metal, RTOS, security, DSP and embedded AI.": "Cursos constroem a base; laboratórios demonstram compreensão. Conheça minhas áreas de estudo contínuo em bare-metal, RTOS, segurança, DSP e IA embarcada.",
  "View training catalog ↗": "Ver catálogo de formação ↗",
  "06 / CONTACT": "06 / CONTATO",
  "Have a problem": "Tem um desafio",
  "worth solving?": "que merece solução?",
  "Open to firmware, hardware simulation and Linux tooling conversations. Let's discuss a technically meaningful challenge.": "Disponível para conversas sobre firmware, simulação de hardware e ferramentas em Linux. Vamos discutir um desafio técnico relevante.",
  "FIND ME ONLINE": "ME ENCONTRE ONLINE",
  "Technical training": "Formação técnica",
  "AI-assisted tools support my workflow; validation and engineering responsibility remain human-led.": "Ferramentas assistidas por IA apoiam meu trabalho; a validação e a responsabilidade técnica continuam sob supervisão humana.",
  "SHINOBI ENGINEERING — FROM PHYSICS TO FIRMWARE": "ENGENHARIA SHINOBI — DA FÍSICA AO FIRMWARE",
  "BACK TO TOP ↑": "VOLTAR AO TOPO ↑",
  "TRAINING / CONTINUOUS LEARNING": "FORMAÇÃO / APRENDIZADO CONTÍNUO",
  "Engineering knowledge, applied.": "Conhecimento em engenharia, aplicado.",
  "Embedded Systems, Firmware Engineering, RTOS, Security, Embedded AI and Professional Development.": "Sistemas Embarcados, Engenharia de Firmware, RTOS, Segurança, IA Embarcada e Desenvolvimento Profissional.",
  "Back to Home Certifications": "Voltar à seção de formação",
  "Explore Training Domains": "Explorar áreas de estudo",
  "AI-Assisted Engineering": "Engenharia Assistida por IA",
  "Bare-Metal Firmware Development": "Desenvolvimento de Firmware Bare-Metal",
  "Embedded C and C++": "C e C++ Embarcados",
  "RTOS Engineering": "Engenharia de RTOS",
  "Firmware Security & Reverse Engineering": "Segurança de Firmware e Engenharia Reversa",
  "Wireless & IoT Connectivity": "Conectividade Sem Fio e IoT",
  "Embedded AI & Machine Learning": "IA Embarcada e Aprendizado de Máquina",
  "DSP, Audio & Computer Vision": "DSP, Áudio e Visão Computacional",
  "STM32 Ecosystem": "Ecossistema STM32",
  "Firmware Architecture & Documentation": "Arquitetura e Documentação de Firmware",
  "Hardware Design & Embedded Systems": "Projeto de Hardware e Sistemas Embarcados",
  "© 2026 Anderson Nogueira. Built for GitHub Pages. |": "© 2026 Anderson Nogueira. Desenvolvido para GitHub Pages. |"
};
  const PT_ATTRIBUTES = {
    "Run SHINOBI AVR PWM simulation on Wokwi (opens in new tab)": "Executar simulação SHINOBI AVR PWM no Wokwi (abre em nova aba)",
  "Main navigation": "Navegação principal",
  "Open navigation": "Abrir menu",
  "Close navigation": "Fechar menu",
  "Filter featured projects": "Filtrar projetos em destaque",
  "Anderson Nogueira — back to top": "Anderson Nogueira — voltar ao início",
  "Engineering workflow illustration, not live device telemetry": "Ilustração do fluxo de engenharia, não representa telemetria real de dispositivos",
  "Decorative schematic signal": "Sinal esquemático decorativo",
  "Portrait of Anderson Nogueira": "Retrato de Anderson Nogueira",
  "Embedded Firmware": "Firmware Embarcado",
  "Site language": "Idioma do site"
};
  const PT_META = {
  "index.html": {
    "title": "Anderson Nogueira | Engenheiro de Firmware — Portfólio",
    "description": "Anderson Nogueira — Desenvolvedor de Firmware Embarcado. C/C++, bare-metal, ARM Cortex-M, Zephyr, Renode, diagnóstico eletrônico e laboratórios de engenharia com validação.",
    "og:title": "Anderson Nogueira — Engenharia de Firmware Embarcado",
    "og:description": "Da física ao firmware. Explore sistemas embarcados testados, simulações Renode, telemetria C++ e ferramentas de engenharia em Linux."
  },
  "certifications.html": {
    "title": "Catálogo de Formação Técnica | Anderson Shinobi",
    "description": "Catálogo de estudos em sistemas embarcados, engenharia de firmware, RTOS, segurança e IA embarcada.",
    "og:title": "Catálogo de Formação Técnica | Anderson Shinobi",
    "og:description": "Áreas de formação contínua em sistemas embarcados, engenharia de firmware, RTOS, segurança, IA embarcada e desenvolvimento profissional."
  }
};

  const page = location.pathname.endsWith("certifications.html") ? "certifications.html" : "index.html";
  const buttons = Array.from(document.querySelectorAll(".language-switch [data-language]"));
  const navigationButton = document.querySelector(".nav-toggle");

  const originalText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,pre,code,noscript,.language-switch")) continue;
    const source = node.nodeValue;
    if (Object.prototype.hasOwnProperty.call(PT, source.trim())) {
      originalText.push({ node, source });
    }
  }

  const translatedAttributes = [];
  for (const element of document.querySelectorAll("[aria-label], [alt], [title]")) {
    if (element.closest(".language-switch")) continue;
    for (const name of ["aria-label", "alt", "title"]) {
      const source = element.getAttribute(name);
      if (source && Object.prototype.hasOwnProperty.call(PT_ATTRIBUTES, source)) {
        translatedAttributes.push({ element, name, source });
      }
    }
  }

  const originalMetadata = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? "",
    "og:title": document.querySelector('meta[property="og:title"]')?.content ?? "",
    "og:description": document.querySelector('meta[property="og:description"]')?.content ?? ""
  };

  const safeStoredLanguage = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "pt-BR" ? "pt-BR" : "en";
    } catch {
      return "en";
    }
  };

  const setNavigationLabel = (language) => {
    if (!navigationButton) return;
    const open = navigationButton.getAttribute("aria-expanded") === "true";
    navigationButton.setAttribute("aria-label",
      language === "pt-BR"
        ? (open ? "Fechar menu" : "Abrir menu")
        : (open ? "Close navigation" : "Open navigation"));
  };

  const applyLanguage = language => {
    const selected = language === "pt-BR" ? "pt-BR" : "en";
    document.documentElement.lang = selected;
    document.title = selected === "pt-BR" ? PT_META[page].title : originalMetadata.title;

    for (const item of originalText) {
      const key = item.source.trim();
      const replacement = selected === "pt-BR" ? PT[key] : key;
      const leading = item.source.match(/^\s*/)[0];
      const trailing = item.source.match(/\s*$/)[0];
      item.node.nodeValue = leading + replacement + trailing;
    }
    for (const { element, name, source } of translatedAttributes) {
      element.setAttribute(name, selected === "pt-BR" ? PT_ATTRIBUTES[source] : source);
    }
    for (const name of ["description", "og:title", "og:description"]) {
      const element = name === "description"
        ? document.querySelector('meta[name="description"]')
        : document.querySelector('meta[property="' + name + '"]');
      if (element) {
        element.content = selected === "pt-BR" ? PT_META[page][name] : originalMetadata[name];
      }
    }

    for (const button of buttons) {
      const current = button.dataset.language === selected;
      button.setAttribute("aria-pressed", String(current));
      button.classList.toggle("active", current);
    }
    setNavigationLabel(selected);
    try {
      localStorage.setItem(STORAGE_KEY, selected);
    } catch {
      // The switch still works when storage is unavailable (e.g., private mode).
    }
  };

  for (const button of buttons) {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  }
  if (navigationButton) {
    navigationButton.addEventListener("click", () => setNavigationLabel(document.documentElement.lang));
  }
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) applyLanguage(safeStoredLanguage());
  });

  applyLanguage(safeStoredLanguage());
})();