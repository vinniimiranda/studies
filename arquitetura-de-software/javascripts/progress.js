/* =========================================================================
   Progresso de leitura para o site de estudo.
   - Marca cada conceito como "estudado" (persistido no navegador via
     localStorage). O toggle aparece no topo de cada página de conceito.
   - Mostra uma barra de progresso por bloco (e total) onde houver o
     elemento <div id="progress-dashboard"></div> (ex.: na página Início).
   - Mostra uma mini-barra do bloco atual no topo de cada página de conceito.
   Tudo client-side, sem dependências externas.
   ========================================================================= */
(function () {
  "use strict";

  var STORE_KEY = "studies:progress:v1";

  var BLOCKS = [
    { dir: "01-fundamentos-arquiteturais", num: "01", label: "Fundamentos", pages: ["01-atributos-de-qualidade", "02-architecture-decision-records-adr", "03-fitness-functions", "04-conway-law-e-inverse-conway-maneuver", "05-c4-model"] },
    { dir: "02-estilos-e-padroes", num: "02", label: "Estilos e padrões", pages: ["01-layered-n-tier-architecture", "02-hexagonal-ports-and-adapters", "03-clean-architecture", "04-onion-architecture", "05-vertical-slice-architecture", "06-modular-monolith", "07-microservices", "08-service-oriented-architecture-soa", "09-event-driven-architecture-eda", "10-space-based-architecture", "11-pipes-and-filters", "12-serverless-faas"] },
    { dir: "03-design-tatico-ddd", num: "03", label: "Design tático (DDD)", pages: ["01-ddd-bounded-contexts-context-mapping-ubiquitous-language", "02-ddd-aggregates-entities-value-objects-domain-events", "03-ddd-context-mapping-patterns-acl-shared-kernel-customer-supplier", "04-cqrs", "05-event-sourcing", "06-saga-pattern", "07-outbox-e-inbox-pattern"] },
    { dir: "04-sistemas-distribuidos", num: "04", label: "Sistemas distribuídos", pages: ["01-teorema-cap-e-pacelc", "02-modelos-de-consistencia", "03-consenso-distribuido-paxos-raft-2pc-3pc", "04-idempotencia-e-semanticas-de-entrega", "05-vector-clocks-e-lamport-timestamps", "06-crdts", "07-service-discovery-e-load-balancing", "08-api-gateway-vs-bff", "09-service-mesh-sidecar", "10-padroes-de-resiliencia", "11-leader-election-sharding-consistent-hashing", "12-quorum-reads-writes-n-r-w", "13-relogios-fisicos-clock-skew-ntp-truetime"] },
    { dir: "05-dados-e-persistencia", num: "05", label: "Dados e persistência", pages: ["01-polyglot-persistence", "02-database-per-service", "03-read-replicas-sharding-particionamento", "04-materialized-views-e-projecoes", "05-cdc-change-data-capture-debezium", "06-data-lake-warehouse-mesh-lakehouse", "07-oltp-vs-olap-lambda-kappa", "08-cache-patterns", "09-acid-vs-base", "10-niveis-de-isolamento-e-anomalias", "11-locking-pessimista-vs-otimista", "12-indices-de-banco-btree-hash-composite-covering", "13-query-optimization-explain-e-n-mais-1", "14-normalizacao-vs-desnormalizacao", "15-sql-vs-nosql"] },
    { dir: "06-mensageria-e-streaming", num: "06", label: "Mensageria e streaming", pages: ["01-message-brokers-vs-log-based-streaming", "02-pubsub-queue-topic-partition-consumer-groups", "03-backpressure", "04-dead-letter-queue-e-poison-messages", "05-stream-processing-kafka-streams-flink-janelas", "06-event-carried-state-transfer-vs-event-notification"] },
    { dir: "07-performance-e-escalabilidade", num: "07", label: "Performance e escalabilidade", pages: ["01-escalabilidade-horizontal-vs-vertical", "02-latencia-vs-throughput-percentis", "03-connection-pooling-thread-pooling-async-io-reactive", "04-leis-little-amdahl-universal-scalability-law"] },
    { dir: "08-seguranca-arquitetural", num: "08", label: "Segurança arquitetural", pages: ["01-zero-trust-architecture", "02-oauth2-oidc-saml-jwt", "03-mtls-entre-servicos", "04-defense-in-depth-least-privilege-secure-by-default", "05-secrets-management-vault-kms", "06-threat-modeling-stride-pasta"] },
    { dir: "09-observabilidade", num: "09", label: "Observabilidade", pages: ["01-tres-pilares-logs-metricas-traces-eventos", "02-distributed-tracing-opentelemetry-jaeger-zipkin", "03-correlation-ids-e-propagacao-de-contexto", "04-sli-slo-sla-error-budgets", "05-use-red-four-golden-signals"] },
    { dir: "10-evolucao-e-praticas", num: "10", label: "Evolução e práticas", pages: ["01-strangler-fig-pattern", "02-branch-by-abstraction-parallel-run-feature-toggles", "03-anti-corruption-layer-em-migracoes", "04-trunk-based-development", "05-gitops-iac-immutable-infrastructure", "06-platform-engineering-e-idps"] },
    { dir: "11-complexidade-algoritmica", num: "11", label: "Complexidade algorítmica", pages: ["01-notacao-assintotica-big-o-theta-omega", "02-pior-melhor-e-caso-medio", "03-complexidade-amortizada", "04-time-vs-space-complexity-tradeoffs", "05-analise-de-recursao-arvore-e-master-theorem"] },
    { dir: "12-estruturas-de-dados", num: "12", label: "Estruturas de dados", pages: ["01-arrays-e-linked-lists", "02-stacks-queues-deque-priority-queue", "03-hash-tables", "04-arvores-de-busca-bst-avl-red-black", "05-b-tree-e-b-plus-tree", "06-heaps", "07-tries", "08-graphs-representacao", "09-skip-list-bloom-filter-lru-lfu", "10-union-find-disjoint-set", "11-segment-tree-e-fenwick-tree"] },
    { dir: "13-algoritmos-essenciais", num: "13", label: "Algoritmos essenciais", pages: ["01-sorting-quicksort-mergesort-heapsort-radix-counting", "02-searching-busca-binaria-e-variacoes", "03-two-pointers-sliding-window-fast-slow", "04-recursao-e-backtracking", "05-divide-and-conquer", "06-greedy-algorithms", "07-dynamic-programming", "08-graph-algorithms", "09-string-algorithms-kmp-rabin-karp-z"] },
    { dir: "14-concorrencia-e-paralelismo", num: "14", label: "Concorrência e paralelismo", pages: ["01-concorrencia-vs-paralelismo-e-context-switching", "02-race-condition-e-critical-section", "03-deadlock-livelock-starvation", "04-primitivas-de-sincronizacao-mutex-semaphore-monitor-spinlock", "05-atomic-cas-lock-free-wait-free", "06-memory-model-happens-before-volatile-barriers-false-sharing", "07-problemas-classicos-producer-consumer-readers-writers-dining-philosophers", "08-thread-pools-e-tuning", "09-async-await-futures-promises-reactive-streams"] },
    { dir: "15-redes-e-protocolos", num: "15", label: "Redes e protocolos", pages: ["01-modelo-osi-e-tcp-ip", "02-tcp-vs-udp", "03-http1-http2-http3-quic", "04-https-tls-handshake-e-certificados", "05-dns-resolution", "06-rest-graphql-grpc-websockets", "07-semantica-http-idempotencia-e-status-codes", "08-cors-csrf-xss", "09-long-polling-sse-websockets"] },
    { dir: "16-system-design", num: "16", label: "System Design", pages: ["01-encurtador-de-url", "02-timeline-rede-social", "03-sistema-de-chat", "04-sistema-de-notificacoes-em-escala", "05-rate-limiter", "06-web-crawler-distribuido", "07-sistema-de-busca", "08-upload-de-arquivos", "09-streaming-de-video", "10-sistema-de-reservas", "11-sistema-de-pagamentos", "12-newsfeed-ranking-e-recomendacao", "13-sistema-de-logs-distribuido", "14-top-k-trending-count-min-sketch"] },
  ];

  // Mapa de chaves válidas ("<dir>/<slug>") -> bloco, para validação rápida.
  var KEY_TO_BLOCK = {};
  BLOCKS.forEach(function (b) {
    b.pages.forEach(function (slug) { KEY_TO_BLOCK[b.dir + "/" + slug] = b; });
  });

  // ---- Persistência ------------------------------------------------------
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function isDone(state, key) { return !!state[key]; }
  function setDone(state, key, val) {
    if (val) state[key] = 1; else delete state[key];
    save(state);
  }

  // ---- Identificação da página atual ------------------------------------
  // URL de conceito: .../<NN-bloco>/<NN-slug>/  (use_directory_urls do MkDocs).
  function currentKey() {
    var segs = location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    for (var i = 0; i < segs.length - 1; i++) {
      var dir = decodeURIComponent(segs[i]);
      var slug = decodeURIComponent(segs[i + 1]);
      var key = dir + "/" + slug;
      if (KEY_TO_BLOCK[key]) return key;
    }
    return null;
  }

  function blockProgress(state, block) {
    var done = 0;
    block.pages.forEach(function (slug) {
      if (isDone(state, block.dir + "/" + slug)) done++;
    });
    return { done: done, total: block.pages.length };
  }
  function totalProgress(state) {
    var done = 0, total = 0;
    BLOCKS.forEach(function (b) {
      var p = blockProgress(state, b);
      done += p.done; total += p.total;
    });
    return { done: done, total: total };
  }

  function pct(done, total) { return total ? Math.round((done / total) * 100) : 0; }

  // ---- Toggle "estudado" no topo de cada conceito -----------------------
  function buildToggle(root, key, state) {
    var block = KEY_TO_BLOCK[key];
    var box = document.createElement("div");
    box.className = "study-toggle";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "study-toggle-btn";

    var mark = document.createElement("span");
    mark.className = "study-toggle-mark";
    var text = document.createElement("span");
    text.className = "study-toggle-text";

    btn.appendChild(mark);
    btn.appendChild(text);

    // Mini barra de progresso do bloco atual.
    var mini = document.createElement("div");
    mini.className = "study-block-mini";

    function render() {
      var done = isDone(state, key);
      box.classList.toggle("is-done", done);
      btn.setAttribute("aria-pressed", done ? "true" : "false");
      mark.textContent = done ? "✓" : "";
      text.textContent = done ? "Estudado" : "Marcar como estudado";

      var p = blockProgress(state, block);
      mini.innerHTML =
        '<span class="study-block-mini-label">Bloco ' + block.num + " · " +
        escapeHtml(block.label) + "</span>" +
        '<span class="study-bar"><span class="study-bar-fill" style="width:' +
        pct(p.done, p.total) + '%"></span></span>' +
        '<span class="study-block-mini-count">' + p.done + "/" + p.total + "</span>";
    }

    btn.addEventListener("click", function () {
      setDone(state, key, !isDone(state, key));
      render();
    });

    box.appendChild(btn);
    box.appendChild(mini);
    render();
    root.insertBefore(box, root.firstChild);
  }

  // ---- Dashboard de progresso (página Início) ---------------------------
  function buildDashboard(host, state) {
    var t = totalProgress(state);
    var html = "";

    html +=
      '<div class="study-dash-overall">' +
      '<div class="study-dash-overall-top">' +
      '<span class="study-dash-overall-title">Progresso total</span>' +
      '<span class="study-dash-overall-count">' + t.done + "/" + t.total +
      " conceitos · " + pct(t.done, t.total) + "%</span>" +
      "</div>" +
      '<span class="study-bar study-bar-lg"><span class="study-bar-fill" style="width:' +
      pct(t.done, t.total) + '%"></span></span>' +
      "</div>";

    html += '<div class="study-dash-blocks">';
    BLOCKS.forEach(function (b) {
      var p = blockProgress(state, b);
      var complete = p.done === p.total;
      html +=
        '<div class="study-dash-block' + (complete ? " is-complete" : "") + '">' +
        '<div class="study-dash-block-head">' +
        '<span class="study-dash-block-name">' + b.num + " · " +
        escapeHtml(b.label) + (complete ? " ✓" : "") + "</span>" +
        '<span class="study-dash-block-count">' + p.done + "/" + p.total + "</span>" +
        "</div>" +
        '<span class="study-bar"><span class="study-bar-fill" style="width:' +
        pct(p.done, p.total) + '%"></span></span>' +
        "</div>";
    });
    html += "</div>";

    html +=
      '<div class="study-dash-actions">' +
      '<button type="button" class="study-dash-reset">Limpar progresso</button>' +
      "</div>";

    host.innerHTML = html;

    host.querySelector(".study-dash-reset").addEventListener("click", function () {
      if (confirm("Limpar todo o progresso de leitura salvo neste navegador?")) {
        Object.keys(state).forEach(function (k) { delete state[k]; });
        save(state);
        buildDashboard(host, state);
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function init() {
    var root = document.querySelector(".md-content__inner.md-typeset") ||
               document.querySelector(".md-typeset");
    if (!root || root.dataset.progressReady) return;
    root.dataset.progressReady = "1";

    var state = load();

    var host = document.getElementById("progress-dashboard");
    if (host) buildDashboard(host, state);

    var key = currentKey();
    if (key) buildToggle(root, key, state);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
