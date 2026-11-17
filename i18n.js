// Maison du Thé — bascule français / anglais avec traduction automatique.
// En anglais, chaque texte affiché par React (et, sur la carte, chaque texte du DOM)
// est traduit à la volée puis mémorisé dans le navigateur.
// Date du jour (fuseau local, pas UTC) au format AAAA-MM-JJ
window.mdtDayKey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
window.mdtToday = function () { return window.mdtDayKey(new Date()); };
(function () {
  var KEY = 'mdt-lang', CK = 'mdt-tr-fr-en';
  var lang = 'fr';
  try { lang = localStorage.getItem(KEY) || 'fr'; } catch (e) {}
  window.mdtLang = lang;
  window.mdtSetLang = function (l) { try { localStorage.setItem(KEY, l); } catch (e) {} location.reload(); };
  if (lang !== 'en') return;
  document.documentElement.lang = 'en';

  var cache = {};
  try { cache = JSON.parse(localStorage.getItem(CK) || '{}'); } catch (e) {}
  var pending = {}, timer = null, active = 0, failed = 0, saveT = null, listeners = [];
  var MAX_PAR = 6;
  var NO_TR = ['Maison du Thé', '🇫🇷 FR', '🇬🇧 EN', 'FR', 'EN'];

  function want(s) {
    if (typeof s !== 'string') return false;
    var t = s.trim();
    if (t.length < 2 || t.length > 4000) return false;
    if (!/[A-Za-zÀ-ÿ]{2}/.test(t)) return false;
    if (/^[\w.'’-]*\d[\w.'’-]*$/.test(t) && /-/.test(t)) return false;   // codes de sachets
    if (/^https?:\/\//.test(t)) return false;
    if (NO_TR.indexOf(t) >= 0 || (window.mdtNoTr && window.mdtNoTr.indexOf(t) >= 0)) return false;
    if (/^[A-Z0-9]{2,8}$/.test(t)) return false;                         // sigles (PGW, RAV…)
    return true;
  }
  function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { localStorage.setItem(CK, JSON.stringify(cache)); } catch (e) {} }, 800); }
  function notify() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }

  function tr(s) {
    if (!want(s)) return s;
    var t = s.trim();
    var c = cache[t];
    if (c != null) return c === t ? s : s.replace(t, c);
    if (failed < 20) { pending[t] = 1; schedule(); }
    return s;
  }
  window.mdtTr = tr;
  window.mdtOnTranslated = function (f) { listeners.push(f); };

  function schedule() { if (!timer) timer = setTimeout(pump, 60); }
  function pump() {
    timer = null;
    var keys = Object.keys(pending);
    while (active < MAX_PAR && keys.length) {
      var k = keys.shift(); delete pending[k];
      if (cache[k] != null) continue;
      one(k);
    }
    if (Object.keys(pending).length) schedule();
  }
  var doneSinceNotify = 0, notifyT = null;
  function one(text) {
    active++;
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=' + encodeURIComponent(text);
    fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var out = (j && j[0] || []).map(function (x) { return x && x[0] || ''; }).join('');
      cache[text] = out || text; save();
      doneSinceNotify++;
      clearTimeout(notifyT); notifyT = setTimeout(function () { doneSinceNotify = 0; notify(); }, 150);
    }).catch(function () { failed++; if (failed === 20) console.warn('Traduction automatique indisponible pour le moment.'); })
      .then(function () { active--; schedule(); });
  }

  // --- React : on traduit les textes au moment où ils sont créés
  var TPROPS = ['placeholder', 'title', 'aria-label', 'alt'];
  function wrapReact(R) {
    if (!R || R.__mdtWrapped) return;
    var ce = R.createElement;
    R.createElement = function (type, props) {
      var args = Array.prototype.slice.call(arguments);
      if (props && typeof props === 'object') {
        var np = null;
        TPROPS.forEach(function (k) { if (typeof props[k] === 'string' && want(props[k])) { np = np || Object.assign({}, props); np[k] = tr(props[k]); } });
        if (props.children && typeof props.children === 'string' && type !== 'textarea' && type !== 'option' + 'x') { np = np || Object.assign({}, props); np.children = tr(props.children); }
        if (np) args[1] = np;
      }
      if (type !== 'textarea' && type !== 'style' && type !== 'script') {
        for (var i = 2; i < args.length; i++) if (typeof args[i] === 'string') args[i] = tr(args[i]);
      }
      return ce.apply(this, args);
    };
    R.__mdtWrapped = true;
  }
  (function waitReact(n) {
    if (window.React && window.React.createElement) { wrapReact(window.React); return; }
    if (n < 400) setTimeout(function () { waitReact(n + 1); }, 15);
  })(0);
  window.mdtOnTranslated(function () { if (window.__mdtApp && window.__mdtApp.forceUpdate) window.__mdtApp.forceUpdate(); });

  // --- Pages sans React (carte) : on traduit les nœuds texte du DOM
  window.mdtTranslateDom = function (root) {
    var seen = new WeakMap();
    function run(node) {
      var w = document.createTreeWalker(node || document.body, NodeFilter.SHOW_TEXT, null);
      var n; while ((n = w.nextNode())) {
        var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) continue;
        var orig = seen.get(n) || n.nodeValue;
        if (!want(orig)) continue;
        seen.set(n, orig);
        var v = tr(orig); if (v !== n.nodeValue) n.nodeValue = v;
      }
      (node || document.body).querySelectorAll && (node || document.body).querySelectorAll('[placeholder],[title],[aria-label]').forEach(function (el) {
        ['placeholder', 'title', 'aria-label'].forEach(function (a) { var o = el.getAttribute('data-fr-' + a) || el.getAttribute(a); if (o && want(o)) { el.setAttribute('data-fr-' + a, o); el.setAttribute(a, tr(o)); } });
      });
    }
    run(root);
    window.mdtOnTranslated(function () { run(root); });
    new MutationObserver(function () { clearTimeout(window.__mdtMo); window.__mdtMo = setTimeout(function () { run(root); }, 80); }).observe(root || document.body, { childList: true, subtree: true, characterData: false });
  };
})();
