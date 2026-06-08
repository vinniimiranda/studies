/* =========================================================================
   Grafo de dependências entre conceitos — mapa navegável.
   - Lê window.CONCEPT_GRAPH (gerado em graph-data.js).
   - Renderiza com vis-network (carregado sob demanda do CDN) só na página
     que contém <div id="concept-graph">.
   - Recursos: zoom/pan, cores por bloco, legenda com filtro, busca,
     destaque de vizinhos ao clicar, painel lateral e navegação para a
     página do conceito (duplo clique ou botão "Abrir").
   ========================================================================= */
(function () {
  "use strict";

  var VIS_JS = "https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.9/dist/vis-network.min.js";

  // Paleta com 16 cores distintas (uma por bloco).
  var PALETTE = {
    "01": "#6366f1", "02": "#0ea5e9", "03": "#14b8a6", "04": "#22c55e",
    "05": "#84cc16", "06": "#eab308", "07": "#f59e0b", "08": "#ef4444",
    "09": "#ec4899", "10": "#d946ef", "11": "#8b5cf6", "12": "#3b82f6",
    "13": "#06b6d4", "14": "#10b981", "15": "#f97316", "16": "#a855f7",
  };

  function makeUrlFn() {
    var path = location.pathname;
    if (/\.html$/.test(path)) {
      var b = path.replace(/mapa-de-conceitos\.html$/, "");
      return function (id) { return b + id + ".html"; };
    }
    var base = path.replace(/mapa-de-conceitos\/?$/, "");
    return function (id) { return base + id + "/"; };
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("falha ao carregar " + src)); };
      document.head.appendChild(s);
    });
  }

  function init() {
    var host = document.getElementById("concept-graph");
    if (!host || !window.CONCEPT_GRAPH) return;
    if (host.dataset.ready) return;
    host.dataset.ready = "1";

    loadScript(VIS_JS)
      .then(render)
      .catch(function (err) {
        host.innerHTML =
          '<p style="padding:1rem;color:var(--md-default-fg-color--light)">' +
          "Não foi possível carregar a biblioteca do grafo (precisa de internet). " +
          escapeHtml(err.message) + "</p>";
      });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render() {
    var host = document.getElementById("concept-graph");
    var data = window.CONCEPT_GRAPH;
    var urlFor = makeUrlFn();

    // Estrutura da UI: barra de ferramentas + canvas + painel + legenda.
    host.innerHTML =
      '<div class="cg-toolbar">' +
      '  <input type="search" class="cg-search" placeholder="Buscar conceito…" aria-label="Buscar conceito">' +
      '  <button type="button" class="cg-btn" data-act="fit">Ajustar</button>' +
      '  <button type="button" class="cg-btn" data-act="physics">Pausar física</button>' +
      '  <button type="button" class="cg-btn" data-act="reset">Limpar seleção</button>' +
      "</div>" +
      '<div class="cg-main">' +
      '  <div class="cg-canvas"></div>' +
      '  <aside class="cg-panel"><div class="cg-panel-empty">Clique em um conceito para ver suas conexões. ' +
      "Duplo clique abre a página.</div></aside>" +
      "</div>" +
      '<div class="cg-legend"></div>';

    var canvas = host.querySelector(".cg-canvas");
    var panel = host.querySelector(".cg-panel");
    var legend = host.querySelector(".cg-legend");

    var degree = {};
    data.nodes.forEach(function (n) { degree[n.id] = 0; });
    data.edges.forEach(function (e) { degree[e.from]++; degree[e.to]++; });

    var nodes = new vis.DataSet(data.nodes.map(function (n) {
      var d = degree[n.id] || 0;
      return {
        id: n.id,
        label: n.label,
        group: n.block,
        title: "Bloco " + n.block + " · " + n.blockLabel,
        value: 4 + d,
        block: n.block,
        blockLabel: n.blockLabel,
        fullTitle: n.title,
        color: { background: PALETTE[n.block], border: shade(PALETTE[n.block]) },
      };
    }));

    var edges = new vis.DataSet(data.edges.map(function (e, i) {
      return { id: i, from: e.from, to: e.to, value: e.w };
    }));

    var adj = {};
    data.nodes.forEach(function (n) { adj[n.id] = { in: [], out: [] }; });
    data.edges.forEach(function (e) {
      if (adj[e.from]) adj[e.from].out.push(e.to);
      if (adj[e.to]) adj[e.to].in.push(e.from);
    });

    var network = new vis.Network(canvas, { nodes: nodes, edges: edges }, {
      nodes: {
        shape: "dot",
        scaling: { min: 6, max: 34, label: { min: 11, max: 20 } },
        font: { size: 13, color: getCssVar("--md-default-fg-color", "#333"), face: "inherit" },
        borderWidth: 1.5,
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.45 } },
        color: { color: "rgba(130,130,130,0.35)", highlight: "#ff5252", hover: "#ff8a80" },
        smooth: { type: "continuous", roundness: 0.2 },
        width: 0.6,
        selectionWidth: 2,
      },
      physics: {
        solver: "forceAtlas2Based",
        forceAtlas2Based: { gravitationalConstant: -55, centralGravity: 0.012, springLength: 110, springConstant: 0.07, avoidOverlap: 0.5 },
        stabilization: { iterations: 220 },
      },
      interaction: { hover: true, tooltipDelay: 120, navigationButtons: false, keyboard: false },
    });

    var labelOf = {};
    data.nodes.forEach(function (n) { labelOf[n.id] = n.label; });

    function fullReset() {
      var upd = data.nodes.map(function (n) {
        return { id: n.id, color: { background: PALETTE[n.block], border: shade(PALETTE[n.block]) }, opacity: 1 };
      });
      nodes.update(upd);
      edges.update(data.edges.map(function (e, i) {
        return { id: i, color: { color: "rgba(130,130,130,0.35)" }, width: 0.6 };
      }));
    }

    function highlight(id) {
      var keep = {};
      keep[id] = 1;
      adj[id].in.concat(adj[id].out).forEach(function (k) { keep[k] = 1; });
      nodes.update(data.nodes.map(function (n) {
        var on = keep[n.id];
        return {
          id: n.id,
          opacity: on ? 1 : 0.12,
          color: {
            background: on ? PALETTE[n.block] : "rgba(160,160,160,0.25)",
            border: on ? shade(PALETTE[n.block]) : "rgba(160,160,160,0.25)",
          },
        };
      }));
      edges.update(data.edges.map(function (e, i) {
        var on = e.from === id || e.to === id;
        return { id: i, color: { color: on ? "rgba(255,82,82,0.85)" : "rgba(160,160,160,0.06)" }, width: on ? 1.8 : 0.4 };
      }));
    }

    function showPanel(id) {
      var n = nodes.get(id);
      function links(ids, verb) {
        if (!ids.length) return "<p class='cg-none'>—</p>";
        var seen = {};
        return "<ul>" + ids.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; })
          .sort()
          .map(function (x) {
            return '<li><a href="' + urlFor(x) + '">' + escapeHtml(labelOf[x] || x) + "</a> " +
              '<span class="cg-blk">' + x.slice(0, 2) + "</span></li>";
          }).join("") + "</ul>";
      }
      panel.innerHTML =
        '<div class="cg-panel-head">' +
        '<span class="cg-dot" style="background:' + PALETTE[n.block] + '"></span>' +
        '<span class="cg-panel-block">Bloco ' + n.block + " · " + escapeHtml(n.blockLabel) + "</span>" +
        "</div>" +
        '<h3 class="cg-panel-title">' + escapeHtml(n.fullTitle) + "</h3>" +
        '<a class="cg-open" href="' + urlFor(id) + '">Abrir página →</a>' +
        '<div class="cg-panel-sec"><h4>Leva a / referencia (' + adj[id].out.length + ")</h4>" + links(adj[id].out) + "</div>" +
        '<div class="cg-panel-sec"><h4>Pré-requisito de / citado por (' + adj[id].in.length + ")</h4>" + links(adj[id].in) + "</div>";
    }

    network.on("selectNode", function (params) {
      var id = params.nodes[0];
      highlight(id);
      showPanel(id);
    });
    network.on("deselectNode", function () {
      fullReset();
      panel.innerHTML = '<div class="cg-panel-empty">Clique em um conceito para ver suas conexões. Duplo clique abre a página.</div>';
    });
    network.on("doubleClick", function (params) {
      if (params.nodes && params.nodes.length) location.href = urlFor(params.nodes[0]);
    });

    // Toolbar
    var physicsOn = true;
    host.querySelector(".cg-toolbar").addEventListener("click", function (e) {
      var act = e.target.getAttribute("data-act");
      if (!act) return;
      if (act === "fit") network.fit({ animation: true });
      else if (act === "reset") { network.unselectAll(); fullReset(); network.fit({ animation: true }); }
      else if (act === "physics") {
        physicsOn = !physicsOn;
        network.setOptions({ physics: { enabled: physicsOn } });
        e.target.textContent = physicsOn ? "Pausar física" : "Retomar física";
      }
    });

    // Busca
    var search = host.querySelector(".cg-search");
    search.addEventListener("change", function () {
      var q = norm(search.value);
      if (!q) return;
      var hit = data.nodes.find(function (n) { return norm(n.label).indexOf(q) >= 0 || norm(n.title).indexOf(q) >= 0; });
      if (hit) {
        network.selectNodes([hit.id]);
        highlight(hit.id);
        showPanel(hit.id);
        network.focus(hit.id, { scale: 1.1, animation: true });
      }
    });

    // Legenda + filtro por bloco
    var blocks = {};
    data.nodes.forEach(function (n) { blocks[n.block] = n.blockLabel; });
    var hidden = {};
    Object.keys(blocks).sort().forEach(function (b) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "cg-chip";
      chip.innerHTML = '<span class="cg-dot" style="background:' + PALETTE[b] + '"></span>' + b + " · " + escapeHtml(blocks[b]);
      chip.addEventListener("click", function () {
        hidden[b] = !hidden[b];
        chip.classList.toggle("is-off", hidden[b]);
        nodes.update(data.nodes.filter(function (n) { return n.block === b; })
          .map(function (n) { return { id: n.id, hidden: !!hidden[b] }; }));
      });
      legend.appendChild(chip);
    });
  }

  // util
  function norm(s) {
    return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  function getCssVar(name, fb) {
    var v = getComputedStyle(document.body).getPropertyValue(name);
    return (v && v.trim()) || fb;
  }
  function shade(hex) {
    // escurece levemente a cor para a borda
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return hex;
    var r = Math.max(0, parseInt(m[1], 16) - 40);
    var g = Math.max(0, parseInt(m[2], 16) - 40);
    var b = Math.max(0, parseInt(m[3], 16) - 40);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
