// Maison du Thé — tea pets en pixel art et enclos animé du salon.
(function () {
  // ---------- Photo -> sprite pixel art (PNG en data URL) ----------
  function loadImg(src) {
    return new Promise(function (res, rej) {
      var i = new Image();
      if (!/^data:/.test(src)) i.crossOrigin = 'anonymous';
      i.onload = function () { res(i); };
      i.onerror = rej;
      i.src = src;
    });
  }
  function dist(a, b) { var dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2]; return Math.sqrt(dr * dr + dg * dg + db * db); }

  async function makeSprite(src, opt) {
    opt = opt || {};
    var OUT = opt.size || 32, WORK = 96, TOL = opt.tolerance || 46, COLORS = opt.colors || 12;
    var img = await loadImg(src);
    // 1. carré centré, petite résolution de travail
    var s = Math.min(img.naturalWidth, img.naturalHeight);
    var c = document.createElement('canvas'); c.width = c.height = WORK;
    var x = c.getContext('2d', { willReadFrequently: true });
    x.imageSmoothingQuality = 'high';
    x.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, WORK, WORK);
    var d = x.getImageData(0, 0, WORK, WORK), px = d.data, N = WORK * WORK;
    var col = function (i) { return [px[i * 4], px[i * 4 + 1], px[i * 4 + 2]]; };
    // 2. fond : remplissage depuis les bords, par proximité de couleur avec le voisin et avec les couleurs du bord
    var border = [];
    for (var k = 0; k < WORK; k++) { border.push(col(k), col((WORK - 1) * WORK + k), col(k * WORK), col(k * WORK + WORK - 1)); }
    var bg = new Uint8Array(N), stack = [];
    for (var k2 = 0; k2 < WORK; k2++) { stack.push(k2, (WORK - 1) * WORK + k2, k2 * WORK, k2 * WORK + WORK - 1); }
    var nearBorder = function (cc) { for (var j = 0; j < border.length; j += 3) { if (dist(cc, border[j]) < TOL) return true; } return false; };
    while (stack.length) {
      var p = stack.pop(); if (bg[p]) continue;
      var cp = col(p); if (!nearBorder(cp)) continue;
      bg[p] = 1;
      var px0 = p % WORK, py0 = (p / WORK) | 0;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dv) {
        var nx = px0 + dv[0], ny = py0 + dv[1]; if (nx < 0 || ny < 0 || nx >= WORK || ny >= WORK) return;
        var q = ny * WORK + nx; if (!bg[q] && dist(col(q), cp) < TOL * 0.75) stack.push(q);
      });
    }
    // garde la plus grande zone d'objet (évite les miettes)
    var lab = new Int32Array(N), best = 0, bestId = 0, idc = 0;
    for (var i0 = 0; i0 < N; i0++) {
      if (bg[i0] || lab[i0]) continue; idc++; var cnt = 0, st = [i0]; lab[i0] = idc;
      while (st.length) { var u = st.pop(); cnt++; var ux = u % WORK, uy = (u / WORK) | 0;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dv) { var nx = ux + dv[0], ny = uy + dv[1]; if (nx < 0 || ny < 0 || nx >= WORK || ny >= WORK) return; var q = ny * WORK + nx; if (!bg[q] && !lab[q]) { lab[q] = idc; st.push(q); } }); }
      if (cnt > best) { best = cnt; bestId = idc; }
    }
    var fg = new Uint8Array(N); for (var i1 = 0; i1 < N; i1++) fg[i1] = (lab[i1] === bestId && best > N * 0.03) ? 1 : 0;
    if (!best || best < N * 0.03) { for (var i2 = 0; i2 < N; i2++) fg[i2] = 1; } // rien de détouré : on garde tout
    // 3. cadrage sur l'objet
    var minX = WORK, minY = WORK, maxX = 0, maxY = 0;
    for (var i3 = 0; i3 < N; i3++) if (fg[i3]) { var xx = i3 % WORK, yy = (i3 / WORK) | 0; if (xx < minX) minX = xx; if (yy < minY) minY = yy; if (xx > maxX) maxX = xx; if (yy > maxY) maxY = yy; }
    var bw = maxX - minX + 1, bh = maxY - minY + 1, inner = OUT - 4, sc = inner / Math.max(bw, bh);
    var tw = Math.max(1, Math.round(bw * sc)), th = Math.max(1, Math.round(bh * sc));
    var ox = Math.floor((OUT - tw) / 2), oy = OUT - 2 - th;
    // 4. échantillonnage moyen par bloc
    var cells = [];
    for (var ty = 0; ty < th; ty++) for (var tx = 0; tx < tw; tx++) {
      var x0 = minX + Math.floor(tx / sc), x1 = Math.max(x0 + 1, minX + Math.floor((tx + 1) / sc)), y0 = minY + Math.floor(ty / sc), y1 = Math.max(y0 + 1, minY + Math.floor((ty + 1) / sc));
      var r = 0, g = 0, b = 0, n = 0, f = 0, tot = 0;
      for (var yy2 = y0; yy2 < y1 && yy2 < WORK; yy2++) for (var xx2 = x0; xx2 < x1 && xx2 < WORK; xx2++) { var ii = yy2 * WORK + xx2; tot++; if (fg[ii]) { f++; r += px[ii * 4]; g += px[ii * 4 + 1]; b += px[ii * 4 + 2]; n++; } }
      if (n && f / tot >= 0.45) cells.push({ x: ox + tx, y: oy + ty, c: [r / n, g / n, b / n] });
    }
    // 5. palette réduite (k-moyennes) et couleurs un peu plus vives
    var pal = [];
    for (var pi = 0; pi < COLORS && pi < cells.length; pi++) pal.push(cells[Math.floor(pi * cells.length / Math.min(COLORS, cells.length))].c.slice());
    for (var it = 0; it < 8; it++) {
      var acc = pal.map(function () { return [0, 0, 0, 0]; });
      cells.forEach(function (ce) { var bi = 0, bd = 1e9; pal.forEach(function (pc, j) { var dd = dist(pc, ce.c); if (dd < bd) { bd = dd; bi = j; } }); ce.k = bi; acc[bi][0] += ce.c[0]; acc[bi][1] += ce.c[1]; acc[bi][2] += ce.c[2]; acc[bi][3]++; });
      pal = pal.map(function (pc, j) { return acc[j][3] ? [acc[j][0] / acc[j][3], acc[j][1] / acc[j][3], acc[j][2] / acc[j][3]] : pc; });
    }
    var vivid = function (cc) { var m = (cc[0] + cc[1] + cc[2]) / 3; return cc.map(function (v) { return Math.max(0, Math.min(255, Math.round(m + (v - m) * 1.25))); }); };
    // 6. dessin + contour sombre
    var o = document.createElement('canvas'); o.width = o.height = OUT;
    var ox2 = o.getContext('2d'); var od = ox2.createImageData(OUT, OUT), op = od.data;
    var filled = new Uint8Array(OUT * OUT);
    cells.forEach(function (ce) { var cc = vivid(pal[ce.k]); var q = (ce.y * OUT + ce.x); filled[q] = 1; op[q * 4] = cc[0]; op[q * 4 + 1] = cc[1]; op[q * 4 + 2] = cc[2]; op[q * 4 + 3] = 255; });
    for (var yy3 = 0; yy3 < OUT; yy3++) for (var xx3 = 0; xx3 < OUT; xx3++) {
      var q2 = yy3 * OUT + xx3; if (filled[q2]) continue;
      var near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (dv) { var nx = xx3 + dv[0], ny = yy3 + dv[1]; return nx >= 0 && ny >= 0 && nx < OUT && ny < OUT && filled[ny * OUT + nx]; });
      if (near) { op[q2 * 4] = 38; op[q2 * 4 + 1] = 28; op[q2 * 4 + 2] = 22; op[q2 * 4 + 3] = 255; }
    }
    ox2.putImageData(od, 0, 0);
    return o.toDataURL('image/png');
  }
  window.mdtMakeSprite = makeSprite;

  // ---------- Enclos animé ----------
  var pens = new WeakMap();
  function setupPen(el) {
    var st = pens.get(el);
    if (!st) { st = { pets: {}, sig: '' }; pens.set(el, st); }
    var data; try { data = JSON.parse(el.getAttribute('data-pets') || '[]'); } catch (e) { data = []; }
    var sig = data.map(function (p) { return p.id + p.sprite.length + p.name; }).join('|');
    if (sig === st.sig) return st;
    st.sig = sig;
    var W = el.clientWidth || 600, H = el.clientHeight || 260;
    var keep = {};
    data.forEach(function (p) {
      keep[p.id] = 1;
      var pet = st.pets[p.id];
      if (!pet) {
        var w = document.createElement('button');
        w.type = 'button'; w.className = 'tp-pet';
        w.setAttribute('aria-label', p.name + ' (' + p.owner + ')');
        w.innerHTML = '<span class="tp-shadow"></span><span class="tp-body"></span><span class="tp-tag"></span>';
        w.addEventListener('click', function () { if (window.__mdtApp) window.__mdtApp.setState({ view: 'gearItem', gearId: p.id }); });
        el.appendChild(w);
        pet = st.pets[p.id] = { el: w, x: 20 + Math.random() * Math.max(10, W - 100), y: 40 + Math.random() * Math.max(10, H - 110), tx: 0, ty: 0, wait: Math.random() * 60, dir: Math.random() < .5 ? -1 : 1, hop: Math.random() * 6 };
        pet.tx = pet.x; pet.ty = pet.y;
      }
      var body = pet.el.querySelector('.tp-body');
      body.innerHTML = p.sprite ? '<img alt="" src="' + p.sprite + '">' : '<span class="tp-emoji">🐸</span>';
      pet.el.querySelector('.tp-tag').textContent = p.name + ' · ' + p.owner;
    });
    Object.keys(st.pets).forEach(function (id) { if (!keep[id]) { st.pets[id].el.remove(); delete st.pets[id]; } });
    return st;
  }
  function tick() {
    document.querySelectorAll('.tp-pen').forEach(function (el) {
      var st = setupPen(el);
      var W = el.clientWidth, H = el.clientHeight;
      Object.keys(st.pets).forEach(function (id) {
        var p = st.pets[id];
        if (p.wait > 0) { p.wait--; if (p.wait <= 0) { p.tx = 16 + Math.random() * Math.max(10, W - 96); p.ty = 36 + Math.random() * Math.max(10, H - 104); } }
        else {
          var dx = p.tx - p.x, dy = p.ty - p.y, dd = Math.sqrt(dx * dx + dy * dy);
          if (dd < 1.5) { p.wait = 40 + Math.random() * 160; }
          else { var sp = 0.9; p.x += dx / dd * sp; p.y += dy / dd * sp; if (Math.abs(dx) > 1) p.dir = dx > 0 ? 1 : -1; p.hop += 0.35; }
        }
        var bob = p.wait > 0 ? 0 : Math.abs(Math.sin(p.hop)) * 5;
        p.el.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + (p.y - bob).toFixed(1) + 'px)';
        p.el.style.zIndex = String(Math.round(p.y));
        var body = p.el.firstChild.nextSibling; if (body) body.style.transform = 'scaleX(' + p.dir + ')';
      });
    });
    requestAnimationFrame(tick);
  }
  var css = document.createElement('style');
  css.textContent = [
    '.tp-pen { position: relative; overflow: hidden; height: 300px; border-radius: 22px; image-rendering: pixelated;',
    '  background-color: #8fbf5a; background-image: linear-gradient(45deg, rgba(0,0,0,.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.05) 75%), linear-gradient(45deg, rgba(0,0,0,.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.05) 75%);',
    '  background-size: 24px 24px; background-position: 0 0, 12px 12px; box-shadow: inset 0 0 0 6px #7a5432, inset 0 0 0 10px #a97a4a; }',
    '.tp-pen::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 26px; background: repeating-linear-gradient(90deg, #a97a4a 0 8px, #7a5432 8px 10px, transparent 10px 30px); opacity: .9; }',
    '.tp-deco { position: absolute; font-size: 22px; pointer-events: none; filter: saturate(.9); }',
    '.tp-pet { position: absolute; left: 0; top: 0; width: 72px; height: 80px; padding: 0; border: none; background: transparent; cursor: pointer; }',
    '.tp-body { position: absolute; left: 4px; top: 0; width: 64px; height: 64px; display: flex; align-items: flex-end; justify-content: center; transition: transform .15s; }',
    '.tp-body img { width: 64px; height: 64px; image-rendering: pixelated; display: block; }',
    '.tp-emoji { font-size: 44px; line-height: 1; }',
    '.tp-shadow { position: absolute; left: 14px; top: 58px; width: 44px; height: 10px; border-radius: 50%; background: rgba(0,0,0,.18); }',
    '.tp-tag { position: absolute; left: 50%; top: 66px; transform: translateX(-50%); white-space: nowrap; font: 600 11px/1.2 var(--font-body, sans-serif); background: rgba(255,255,255,.85); color: #2b2118; padding: 2px 6px; border-radius: 6px; opacity: 0; transition: opacity .15s; pointer-events: none; }',
    '.tp-pet:hover .tp-tag, .tp-pet:focus .tp-tag { opacity: 1; }'
  ].join('\n');
  document.head.appendChild(css);
  requestAnimationFrame(tick);
})();
