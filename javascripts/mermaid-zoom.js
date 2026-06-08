/* =========================================================================
   Zoom/pan para diagramas Mermaid.
   - Adiciona um botão "⤢ Ampliar" sobre cada diagrama renderizado.
   - Clicar no diagrama (ou no botão) abre um overlay em tela cheia com:
       • zoom por roda do mouse / pinça (touch)
       • pan arrastando
       • controles +, −, reset e fechar
       • fechar com Esc ou clicando no fundo
   - Vanilla JS, sem dependências externas. Mermaid é renderizado pelo
     Material; aqui apenas observamos os SVGs prontos.
   ========================================================================= */
(function () {
  "use strict";

  var overlay, stage, svgHolder, state;

  function buildOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "mz-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<div class="mz-toolbar">' +
      '  <button type="button" class="mz-btn" data-act="out" title="Diminuir (−)" aria-label="Diminuir">−</button>' +
      '  <button type="button" class="mz-btn" data-act="reset" title="Ajustar à tela" aria-label="Ajustar à tela">⤢</button>' +
      '  <button type="button" class="mz-btn" data-act="in" title="Aumentar (+)" aria-label="Aumentar">+</button>' +
      '  <button type="button" class="mz-btn mz-close" data-act="close" title="Fechar (Esc)" aria-label="Fechar">✕</button>' +
      "</div>" +
      '<div class="mz-stage"><div class="mz-holder"></div></div>' +
      '<div class="mz-hint">Arraste para mover · role para dar zoom · Esc para fechar</div>';
    document.body.appendChild(overlay);

    stage = overlay.querySelector(".mz-stage");
    svgHolder = overlay.querySelector(".mz-holder");
    state = { scale: 1, x: 0, y: 0, dragging: false, sx: 0, sy: 0 };

    overlay.addEventListener("click", function (e) {
      var act = e.target && e.target.getAttribute("data-act");
      if (e.target === overlay) return close();
      if (!act) return;
      if (act === "close") close();
      else if (act === "in") zoomBy(1.25);
      else if (act === "out") zoomBy(0.8);
      else if (act === "reset") fit();
    });

    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.12 : 0.89;
      zoomAt(factor, e.clientX, e.clientY);
    }, { passive: false });

    stage.addEventListener("mousedown", function (e) {
      state.dragging = true;
      state.sx = e.clientX - state.x;
      state.sy = e.clientY - state.y;
      stage.classList.add("is-grabbing");
    });
    window.addEventListener("mousemove", function (e) {
      if (!state.dragging) return;
      state.x = e.clientX - state.sx;
      state.y = e.clientY - state.sy;
      apply();
    });
    window.addEventListener("mouseup", function () {
      state.dragging = false;
      if (stage) stage.classList.remove("is-grabbing");
    });

    // Touch: 1 dedo = pan, 2 dedos = pinça.
    var pinch = null;
    stage.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        state.dragging = true;
        state.sx = e.touches[0].clientX - state.x;
        state.sy = e.touches[0].clientY - state.y;
      } else if (e.touches.length === 2) {
        state.dragging = false;
        pinch = touchDist(e);
      }
    }, { passive: true });
    stage.addEventListener("touchmove", function (e) {
      if (e.touches.length === 2 && pinch) {
        e.preventDefault();
        var d = touchDist(e);
        var mid = touchMid(e);
        zoomAt(d / pinch, mid.x, mid.y);
        pinch = d;
      } else if (e.touches.length === 1 && state.dragging) {
        state.x = e.touches[0].clientX - state.sx;
        state.y = e.touches[0].clientY - state.sy;
        apply();
      }
    }, { passive: false });
    stage.addEventListener("touchend", function (e) {
      if (e.touches.length < 2) pinch = null;
      if (e.touches.length === 0) state.dragging = false;
    });

    document.addEventListener("keydown", function (e) {
      if (overlay.classList.contains("is-open") && e.key === "Escape") close();
    });

    return overlay;
  }

  function touchDist(e) {
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.hypot(dx, dy);
  }
  function touchMid(e) {
    return {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
    };
  }

  function apply() {
    svgHolder.style.transform =
      "translate(" + state.x + "px," + state.y + "px) scale(" + state.scale + ")";
  }

  function clampScale(s) { return Math.min(12, Math.max(0.2, s)); }

  function zoomBy(factor) {
    var r = stage.getBoundingClientRect();
    zoomAt(factor, r.left + r.width / 2, r.top + r.height / 2);
  }

  function zoomAt(factor, clientX, clientY) {
    var newScale = clampScale(state.scale * factor);
    factor = newScale / state.scale;
    var r = stage.getBoundingClientRect();
    var px = clientX - r.left;
    var py = clientY - r.top;
    // Mantém o ponto sob o cursor estável durante o zoom.
    state.x = px - (px - state.x) * factor;
    state.y = py - (py - state.y) * factor;
    state.scale = newScale;
    apply();
  }

  function fit() {
    state.scale = 1;
    state.x = 0;
    state.y = 0;
    apply();
  }

  function open(svg) {
    buildOverlay();
    svgHolder.innerHTML = "";
    var clone = svg.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.maxWidth = "none";
    clone.style.width = "auto";
    clone.style.height = "auto";
    svgHolder.appendChild(clone);
    overlay.classList.add("is-open");
    document.documentElement.classList.add("mz-lock");
    fit();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("mz-lock");
    svgHolder.innerHTML = "";
  }

  // ---- Anexa o botão "Ampliar" a cada diagrama renderizado --------------
  function enhance(container) {
    if (!container || container.dataset.mzReady) return;
    var svg = container.querySelector("svg");
    if (!svg) return; // ainda não renderizado
    container.dataset.mzReady = "1";
    container.classList.add("mz-enhanced");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mz-expand";
    btn.title = "Ampliar diagrama";
    btn.setAttribute("aria-label", "Ampliar diagrama");
    btn.textContent = "⤢ Ampliar";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      open(svg);
    });
    container.appendChild(btn);

    container.addEventListener("click", function () { open(svg); });
  }

  function scan() {
    var nodes = document.querySelectorAll(".mermaid");
    nodes.forEach(function (n) {
      if (n.querySelector("svg")) enhance(n);
    });
  }

  function init() {
    scan();
    // Mermaid renderiza de forma assíncrona; observa o DOM e tenta de novo.
    var obs = new MutationObserver(function () { scan(); });
    obs.observe(document.body, { childList: true, subtree: true });
    var tries = 0;
    var iv = setInterval(function () {
      scan();
      if (++tries > 20) clearInterval(iv);
    }, 400);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
