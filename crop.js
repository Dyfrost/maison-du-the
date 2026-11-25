// L’Unanimithé — outil de recadrage d’image (photos des thés, sachets, matériel, images du site)
// window.mdtCrop({ src, aspect, title }) → Promise<Blob | null>  (null = annulé)
// src : URL d’image (http, blob: ou data:) ou File/Blob. aspect = largeur / hauteur du cadre (1 = carré).
(function () {
  function loadImg(src) {
    return new Promise(function (res, rej) {
      var i = new Image();
      if (typeof src === 'string' && !/^(blob:|data:)/.test(src)) i.crossOrigin = 'anonymous';
      i.onload = function () { res(i); }; i.onerror = function () { rej(new Error('Image illisible (ou serveur qui refuse le recadrage).')); };
      i.src = src;
    });
  }
  window.mdtCrop = function (opts) {
    opts = opts || {};
    var aspect = opts.aspect > 0 ? opts.aspect : 1;
    var src = opts.src; var revoke = null;
    if (src && typeof src !== 'string') { src = URL.createObjectURL(src); revoke = src; }
    return new Promise(function (resolve) {
      var ov = document.createElement('div');
      ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', opts.title || 'Recadrer la photo');
      ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(20,16,12,.72);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;font-family:var(--font-body,system-ui,sans-serif);';
      var box = document.createElement('div');
      box.style.cssText = 'background:var(--color-bg,#f5ead8);color:var(--color-text,#201e1d);border-radius:26px;padding:18px;display:flex;flex-direction:column;gap:12px;max-width:100%;box-shadow:0 20px 60px rgba(0,0,0,.35);';
      var W = Math.min(window.innerWidth - 68, 460); var H = Math.round(W / aspect);
      if (H > window.innerHeight - 230) { H = window.innerHeight - 230; W = Math.round(H * aspect); }
      box.innerHTML = '<b style="font-size:18px;">' + (opts.title || '✂️ Recadrer la photo') + '</b>' +
        '<span style="font-size:13px;opacity:.75;">Fais glisser l’image pour la placer, zoome avec le curseur (ou la molette). Ce qui est dans le cadre est ce qui sera affiché.</span>' +
        '<div class="mc-frame" style="position:relative;overflow:hidden;border-radius:18px;background:#222;touch-action:none;cursor:grab;width:' + W + 'px;height:' + H + 'px;align-self:center;"><img alt="" draggable="false" style="position:absolute;left:0;top:0;transform-origin:0 0;user-select:none;max-width:none;"><div style="position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 2px rgba(255,255,255,.8);border-radius:18px;"></div><div style="position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px);background-size:33.33% 33.33%;background-position:-1px -1px;"></div></div>' +
        '<label style="display:flex;align-items:center;gap:10px;font-size:14px;">🔍<input class="mc-zoom" type="range" min="1" max="4" step="0.01" value="1" style="flex:1;" aria-label="Zoom"></label>' +
        '<span class="mc-msg" role="status" style="font-size:13px;color:#a8432e;"></span>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;"><button type="button" class="btn btn-ghost mc-cancel">Annuler</button><button type="button" class="btn btn-secondary mc-reset">Recentrer</button><button type="button" class="btn btn-primary mc-ok">✓ Valider le cadrage</button></div>';
      ov.appendChild(box); document.body.appendChild(ov);
      var frame = box.querySelector('.mc-frame'), img = box.querySelector('img'), zoom = box.querySelector('.mc-zoom'), msg = box.querySelector('.mc-msg');
      var nat = null, base = 1, z = 1, tx = 0, ty = 0;
      function clamp() { var s = base * z; var w = nat.w * s, h = nat.h * s; tx = Math.min(0, Math.max(W - w, tx)); ty = Math.min(0, Math.max(H - h, ty)); }
      function paint() { if (!nat) return; clamp(); img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + (base * z) + ')'; }
      function setZoom(nz, cx, cy) { if (!nat) return; nz = Math.max(1, Math.min(4, nz)); if (cx == null) { cx = W / 2; cy = H / 2; } var s0 = base * z, s1 = base * nz; tx = cx - (cx - tx) * s1 / s0; ty = cy - (cy - ty) * s1 / s0; z = nz; zoom.value = String(nz); paint(); }
      function center() { z = 1; zoom.value = '1'; tx = (W - nat.w * base) / 2; ty = (H - nat.h * base) / 2; paint(); }
      function done(v) { try { document.body.removeChild(ov); } catch (e) {} document.removeEventListener('keydown', onKey); if (revoke) URL.revokeObjectURL(revoke); resolve(v); }
      function onKey(e) { if (e.key === 'Escape') done(null); }
      document.addEventListener('keydown', onKey);
      loadImg(src).then(function (i) { img.src = i.src; nat = { w: i.naturalWidth, h: i.naturalHeight, el: i }; base = Math.max(W / nat.w, H / nat.h); img.style.width = nat.w + 'px'; img.style.height = nat.h + 'px'; center(); })
        .catch(function (e) { msg.textContent = e.message; });
      var drag = null;
      frame.addEventListener('pointerdown', function (e) { if (!nat) return; drag = { x: e.clientX, y: e.clientY, tx: tx, ty: ty }; frame.setPointerCapture(e.pointerId); frame.style.cursor = 'grabbing'; });
      frame.addEventListener('pointermove', function (e) { if (!drag) return; tx = drag.tx + e.clientX - drag.x; ty = drag.ty + e.clientY - drag.y; paint(); });
      var up = function () { drag = null; frame.style.cursor = 'grab'; };
      frame.addEventListener('pointerup', up); frame.addEventListener('pointercancel', up);
      frame.addEventListener('wheel', function (e) { e.preventDefault(); var r = frame.getBoundingClientRect(); setZoom(z * (e.deltaY < 0 ? 1.08 : 1 / 1.08), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
      zoom.addEventListener('input', function () { setZoom(parseFloat(zoom.value)); });
      box.querySelector('.mc-reset').onclick = function () { if (nat) center(); };
      box.querySelector('.mc-cancel').onclick = function () { done(null); };
      ov.addEventListener('click', function (e) { if (e.target === ov) done(null); });
      box.querySelector('.mc-ok').onclick = function () {
        if (!nat) return;
        var s = base * z; var sx = -tx / s, sy = -ty / s, sw = W / s, sh = H / s;
        var outW = Math.min(1400, Math.round(sw)), outH = Math.round(outW / aspect);
        if (outW < 300) { outW = Math.round(sw); outH = Math.round(sh); }
        var c = document.createElement('canvas'); c.width = outW; c.height = outH;
        try {
          c.getContext('2d').drawImage(nat.el, sx, sy, sw, sh, 0, 0, outW, outH);
          c.toBlob(function (b) { if (!b) { msg.textContent = 'Recadrage impossible sur cette image.'; return; } done(b); }, 'image/jpeg', 0.86);
        } catch (e) { msg.textContent = 'Recadrage impossible : le serveur de l’image ne l’autorise pas. Ré-envoie la photo depuis ton appareil.'; }
      };
    });
  };
})();
