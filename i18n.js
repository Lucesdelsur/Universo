/* =============================================================
   IDIOMA (castellano / inglés)
   -------------------------------------------------------------
   - El botón ES/EN aparece solo en el menú de arriba.
   - La elección se recuerda al pasar de una página a otra.
   - Los textos en inglés viven en i18n-en.js, que solo se descarga
     cuando alguien elige inglés. Si falta una traducción, se muestra
     el texto original en castellano.
   ============================================================= */
(function(){
  function leerIdioma(){
    try{ var v = localStorage.getItem('lang'); if(v === 'en' || v === 'es') return v; }catch(e){}
    var m = /(?:^|;)lang=(en|es)(?:;|$)/.exec(window.name || '');
    return m ? m[1] : 'es';
  }
  var LANG = leerIdioma();
  window.LANG = LANG;
  document.documentElement.lang = LANG;
  if(LANG === 'en') document.write('<script src="i18n-en.js"><\/script>');

  // Traduce un texto generado por JavaScript (se busca por su versión en castellano).
  window.t = function(es){
    if(LANG !== 'en' || !window.I18N_EN) return es;
    var v = window.I18N_EN.ui[es];
    return v == null ? es : v;
  };

  // Traduce nombres de países y ciudades ("Berlín, Alemania" -> "Berlin, Germany").
  function normalizar(s){
    return String(s).toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }
  var lugaresNorm = null;
  window.tPlace = function(s){
    if(LANG !== 'en' || !window.I18N_EN || !s) return s;
    if(!lugaresNorm){
      lugaresNorm = {};
      var p = window.I18N_EN.places;
      Object.keys(p).forEach(function(k){ lugaresNorm[normalizar(k)] = p[k]; });
    }
    return String(s).split(/(\s*,\s*|\s*\/\s*)/).map(function(parte){
      var v = lugaresNorm[normalizar(parte)];
      return v == null ? parte : v;
    }).join('');
  };

  window.localeFecha = LANG === 'en' ? 'en-US' : 'es-AR';

  window.setLang = function(l){
    try{ localStorage.setItem('lang', l); }catch(e){}
    window.name = 'lang=' + l;
    location.reload();
  };

  var css = document.createElement('style');
  css.textContent =
    '.lang-toggle{font-family:"Inter",system-ui,sans-serif;font-weight:700;font-size:.75rem;letter-spacing:.1em;' +
    'background:#fff;color:#111;border:1px solid #111;padding:5px 9px;line-height:1;cursor:pointer;}' +
    '.lang-toggle:hover{background:#D71920;border-color:#D71920;color:#fff;}' +
    '.lang-toggle:focus-visible{outline:2px solid #D71920;outline-offset:2px;}' +
    '@media (max-width:420px){#site-nav{gap:18px !important;}}';
  document.head.appendChild(css);

  function aplicar(){
    if(LANG === 'en' && window.I18N_EN){
      var dic = window.I18N_EN.static;
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var v = dic[el.getAttribute('data-i18n')];
        if(v != null) el.innerHTML = v;
      });
    }
    var nav = document.getElementById('site-nav');
    if(nav && !nav.querySelector('.lang-toggle')){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-toggle';
      b.textContent = LANG === 'en' ? 'ES' : 'EN';
      b.setAttribute('aria-label', LANG === 'en' ? 'Ver el sitio en castellano' : 'View the site in English');
      b.addEventListener('click', function(){ window.setLang(LANG === 'en' ? 'es' : 'en'); });
      nav.appendChild(b);
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicar);
  else aplicar();
})();
