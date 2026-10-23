/* Escapa comillas para usar textos dentro de atributos HTML (alt, title). */
function escAttr(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }


/* =============================================================
   3) LÓGICA — no hace falta tocar de acá para abajo
   ============================================================= */
  // Configuración de esta página en particular (cada página la define
  // antes de este script, en su propio bloque <script> chico).
  const CFG = window.PAGE_CONFIG || {};

  // Cada hito guarda su título original en "id" (sirve para ubicar la Era de
  // cada página). Si el sitio está en inglés, se aplican las traducciones.
  DATA.forEach(ev => {
    ev.id = ev.id || ev.titulo;
    const tr = (window.LANG === 'en' && window.I18N_EN) ? window.I18N_EN.data[ev.fecha + '|' + ev.titulo] : null;
    if(tr) Object.assign(ev, tr);
    if(window.LANG === 'en'){
      if(ev.lugar) ev.lugar = tPlace(ev.lugar);
      if(ev.creditosFotos) ev.creditosFotos = ev.creditosFotos.map(c => c.replace(/^Foto:/, 'Photo:').replace(/^Ilustración:/, 'Illustration:'));
      if(ev.datos) ev.datos = ev.datos.map(d => ({ etiqueta: t(d.etiqueta), valor: t(d.valor) }));
    }
  });
  const CATS_PERMITIDAS = CFG.categoriasPermitidas || Object.keys(CATEGORIAS).filter(c => c !== 'Era');
  const SOLO_BISAGRA = !!CFG.soloBisagra;

  let activeCats = new Set(CATS_PERMITIDAS);
  function getYear(fecha){ return parseInt(fecha.slice(0,4), 10); }

  const NOMBRES_MES = (window.LANG === 'en' && window.I18N_EN) ? window.I18N_EN.months
    : ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function formatearFecha(iso){
    const [y, m, d] = iso.split('-').map(Number);
    return window.LANG === 'en' ? `${NOMBRES_MES[m-1]} ${d}, ${y}` : `${d} ${NOMBRES_MES[m-1]} ${y}`;
  }

  
  function initFilters(){
    const pillWrap = document.getElementById('cat-pills');
    const clavesAMostrar = CATS_PERMITIDAS;

    function pintarActivo(){
      const todasActivas = activeCats.size === clavesAMostrar.length;
      document.querySelectorAll('.pill').forEach(b => {
        const esActivo = todasActivas || activeCats.has(b.dataset.cat);
        if(esActivo){
          b.classList.add('active');
          b.style.background = CATEGORIAS[b.dataset.cat].color;
          b.style.color = '#fff';
        } else {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--text-dim)';
        }
      });
    }

    clavesAMostrar.forEach(cat => {
      const info = CATEGORIAS[cat];
      if(!info) return;
      const b = document.createElement('button');
      b.className = 'pill active';
      b.textContent = t(cat);
      b.style.setProperty('--cat-color', info.color);
      b.dataset.cat = cat;
      b.addEventListener('click', () => {
        const todasActivas = activeCats.size === clavesAMostrar.length;
        if(todasActivas){
          // Estaban todas activas: aislar esta sola categoría
          activeCats = new Set([cat]);
        } else if(activeCats.size === 1 && activeCats.has(cat)){
          // Ya estaba sola y la volvés a tocar: vuelve a mostrar todo
          activeCats = new Set(clavesAMostrar);
        } else {
          // Estaba aislada otra categoría: pasa a aislar esta
          activeCats = new Set([cat]);
        }
        pintarActivo();
        render();
      });
      pillWrap.appendChild(b);
    });

    pintarActivo();
  }

  function cardThumb(ev){
    if(ev.foto){
      return `<div class="tl-thumb-wrap"><img loading="lazy" decoding="async" src="${ev.foto}" alt="${escAttr(ev.titulo)}">${ev.youtube ? '<div class="tl-play-badge">▶</div>' : ''}</div>`;
    }
    if(ev.youtube){
      // Sin foto propia: usamos la miniatura automática de YouTube, así no hace
      // falta subir una imagen para que la tarjeta se vea con contenido visual.
      return `<div class="tl-thumb-wrap"><img loading="lazy" decoding="async" src="https://img.youtube.com/vi/${ev.youtube}/hqdefault.jpg" alt="${escAttr(ev.titulo)}"><div class="tl-play-badge">▶</div></div>`;
    }
    return `<div class="ph">📷<br>${t('Espacio para tu foto')}</div>`;
  }

  
  function render(){
    const wrap = document.getElementById('timeline');
    wrap.innerHTML = '';

    const erasCompletas = DATA.filter(d => d.categoria === 'Era');

    let hitos = DATA
      .filter(d => d.categoria !== 'Era')
      .filter(d => (d.categorias || []).some(c => activeCats.has(c)));

    // Esta página muestra SOLO los hitos de una Era en particular
    if(CFG.eraSolo){
      hitos = hitos.filter(h => {
        const era = eraDeFecha(h.fecha, erasCompletas);
        return era && era.id === CFG.eraSolo;
      });
    }

    hitos.sort((a, b) => a.fecha.localeCompare(b.fecha));

    if(hitos.length === 0){
      wrap.innerHTML = `<div class="empty-state">${t('No hay hitos con estos filtros.')}<br>${t('Probá sumar categorías.')}</div>`;
      return;
    }

    hitos.forEach((ev, i) => {
      const delay = Math.min(i * 0.04, 0.6);
      wrap.appendChild(renderHito(ev, delay));
    });
  }

  // Encuentra la Era vigente de una fecha: la de fecha de inicio más reciente
  // que sea <= la fecha dada.
  function eraDeFecha(fecha, erasData){
    let found = null;
    erasData.forEach(era => { if(era.fecha <= fecha) { if(!found || era.fecha > found.fecha) found = era; } });
    return found;
  }

  // Al hacer click en un hito, va DIRECTO al link externo (YouTube o el
  // artículo/entrevista) en una pestaña nueva — no abre ningún modal.
  // Solo si un hito no tiene ni video ni link (por ejemplo, un dato de
  // contexto sin fuente propia), se muestra el modal como respaldo.
  function irADestino(ev){
    if(ev.youtube){ window.open(`https://www.youtube.com/watch?v=${ev.youtube}`, '_blank', 'noopener'); }
    else if(ev.enlace){ window.open(ev.enlace, '_blank', 'noopener'); }
    else{ openModal(ev); }
  }

  function renderHito(ev, delay){
    const colores = catColors(ev.categorias);
    const el = document.createElement('div');
    const esMayor = ev.nivel === 'mayor';
    const tieneMedia = !!(ev.foto || ev.youtube);
    const catTags = (ev.categorias || []).map((c, i) =>
      `<span class="tl-cat" style="--tag-color:${colores[i]}">${t(c)}</span>`
    ).join('');
    const infoExtra = `
      ${ev.lugar ? `<div class="tl-lugar">📍 ${ev.lugar}</div>` : ''}
      ${ev.enlace ? `<div class="tl-leer">${t('Leer la nota ↗')}</div>` : ''}
    `;

    if(esMayor){
      el.className = 'tl-card-mayor';
      el.style.animationDelay = `${delay}s`;
      const media = tieneMedia
        ? cardThumb(ev)
        : `<div class="ph">📷<br>${t('Espacio para tu foto')}</div>`;
      el.innerHTML = `
        ${media}
        <div>
          <span class="tl-mayor-badge">${t('★ Hito destacado')}</span><br>
          <span class="tl-date">${formatearFecha(ev.fecha)}</span>${catTags}
          <div class="tl-title">${ev.titulo}${ev.publico ? ` <span class="tl-publico">(${ev.publico})</span>` : ''}</div>
          ${ev.teaser ? `<div class="tl-teaser">${ev.teaser}</div>` : ''}
          ${infoExtra}
        </div>
      `;
    } else if(tieneMedia){
      el.className = 'tl-card';
      el.style.animationDelay = `${delay}s`;
      el.innerHTML = `
        ${cardThumb(ev)}
        <span class="tl-date">${formatearFecha(ev.fecha)}</span>${catTags}
        <div class="tl-title">${ev.titulo}${ev.publico ? ` <span class="tl-publico">(${ev.publico})</span>` : ''}</div>
        ${infoExtra}
      `;
    } else {
      // Sin foto ni video (la mayoría de Prensa): tarjeta "cita" — el teaser
      // ocupa el lugar de la miniatura, en vez de dejar un hueco vacío.
      el.className = 'tl-card cita';
      el.style.animationDelay = `${delay}s`;
      el.innerHTML = `
        <span class="tl-date">${formatearFecha(ev.fecha)}</span>${catTags}
        <div class="tl-teaser-grande">${ev.teaser ? `"${ev.teaser}"` : ev.titulo}</div>
        ${ev.teaser ? `<div class="tl-medio">${ev.titulo}</div>` : ''}
        ${infoExtra}
      `;
    }
    el.addEventListener('click', () => irADestino(ev));
    return el;
  }

  function openModal(ev){
    const categoriasArr = ev.categorias || (ev.categoria ? [ev.categoria] : []);
    const colores = catColors(categoriasArr);
    const color = colores[0] || 'var(--lime)';
    const media = document.getElementById('modal-media');
    const photoBox = document.getElementById('modal-photo');

    // Miniatura siempre visible: prioridad a la foto propia; si no hay,
    // usamos la miniatura automática de YouTube (funciona siempre, incluso
    // si el video tiene restricciones de embebido). El botón "Ver en YouTube"
    // abre el video real en una pestaña nueva — ya no se intenta embeber
    // el reproductor adentro del modal, porque algunos videos lo bloquean
    // (Error 153) y quedaba una pantalla negra en vez de la miniatura.
    let imgSrc = '';
    if(ev.foto) imgSrc = ev.foto;
    else if(ev.youtube) imgSrc = `https://img.youtube.com/vi/${ev.youtube}/hqdefault.jpg`;

    if(imgSrc){
      media.innerHTML = `<img src="${imgSrc}" alt="${escAttr(ev.titulo)}">` +
        (ev.youtube ? `<a class="modal-yt-link" href="https://www.youtube.com/watch?v=${ev.youtube}" target="_blank" rel="noopener">${t('▶ Ver en YouTube')}</a>` : '');
      media.classList.remove('hidden');
    } else {
      media.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-dim);font-family:var(--mono);">${t('📷 Sin foto/video todavía')}</div>`;
    }

    photoBox.classList.add('hidden');
    photoBox.innerHTML = '';

    const catEl = document.getElementById('modal-cat');
    catEl.innerHTML = categoriasArr.map((c, i) =>
      `<span class="modal-cat-chip" style="background:color-mix(in srgb, ${colores[i]} 22%, transparent); color:${colores[i]}">${t(c)}</span>`
    ).join('');
    document.getElementById('modal-date').textContent = ev.hasta
      ? `${getYear(ev.fecha)} – ${getYear(ev.hasta)}`
      : formatearFecha(ev.fecha);
    document.getElementById('modal-title').textContent = ev.titulo + (ev.publico ? ` (${ev.publico})` : '');
    document.getElementById('modal-desc').textContent = ev.descripcion || '';
    document.getElementById('modal-desc').style.display = ev.descripcion ? '' : 'none';

    const datosChips = (ev.datos || []).map(d => `<div class="data-chip">${d.etiqueta}: <b>${d.valor}</b></div>`);
    if(ev.lugar) datosChips.unshift(`<div class="data-chip">📍 <b>${ev.lugar}</b></div>`);
    document.getElementById('modal-data').innerHTML = datosChips.join('');

    document.getElementById('modal-overlay').classList.add('open');
  }
  function closeModal(){ document.getElementById('modal-overlay').classList.remove('open'); }
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => { if(e.target.id === 'modal-overlay') closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  // Completa el encabezado (título, período, foto, texto) leyendo el objeto
  // Era correspondiente directamente de DATA, así el texto vive en un solo
  // lugar (el array DATA) y no se duplica en el HTML.
  function pintarEncabezadoEra(){
    const eras = DATA.filter(d => d.categoria === 'Era').sort((a,b) => a.fecha.localeCompare(b.fecha));
    const idx = eras.findIndex(e => e.id === CFG.eraSolo);
    if(idx === -1) return;
    const era = eras[idx];

    if(CFG.colorEra){
      const hero = document.querySelector('.hero');
      document.body.style.setProperty('--hero-bg', CFG.colorEra);
      hero.style.setProperty('--hero-fg', CFG.colorEraTexto || '#111111');
    }

    document.getElementById('era-eyebrow').textContent = `ERA ${idx + 1}/7`;
    document.getElementById('era-titulo').textContent = era.titulo.toUpperCase();
    document.getElementById('era-shows').textContent = t(CFG.showsAcumulados || '—');
    const rango = era.hasta && getYear(era.fecha) !== getYear(era.hasta)
      ? `${getYear(era.fecha)}–${getYear(era.hasta)}` : `${getYear(era.fecha)}`;
    document.getElementById('era-periodo').textContent = `${rango} · ${era.teaser || ''}`;

    // El bloque de foto(s) + texto se arma acá: si "era.fotos" tiene 2 fotos,
    // van en fila arriba y el texto ocupa el ancho completo debajo. Si solo
    // hay "era.foto" (una sola), se mantiene el layout de siempre (foto al
    // costado del texto).
    const bloque = document.getElementById('era-bloque');
    const listaFotos = (era.fotos && era.fotos.length) ? era.fotos : (era.foto ? [era.foto] : []);
    const listaCreditos = era.creditosFotos || [];
    const textoHTML = era.descripcion || '';

    function creditoHTML(i){
      return listaCreditos[i] ? `<div class="era-foto-credito">${listaCreditos[i]}</div>` : '';
    }

    if(listaFotos.length >= 2){
      bloque.className = 'era-bloque era-bloque-doble';
      bloque.innerHTML = `
        <div class="era-fotos-fila">
          ${listaFotos.slice(0,2).map((f, i) => `<div class="era-foto"><img src="${f}" alt="${escAttr(era.titulo)}">${creditoHTML(i)}</div>`).join('')}
        </div>
        <div class="era-texto">${textoHTML}</div>
      `;
    } else {
      bloque.className = 'era-bloque';
      bloque.innerHTML = `
        <div class="era-foto">${listaFotos[0] ? `<img src="${listaFotos[0]}" alt="${escAttr(era.titulo)}">${creditoHTML(0)}` : t('Sin foto todavía')}</div>
        <div class="era-texto">${textoHTML}</div>
      `;
    }

    const htmlBreadcrumb = eras.map((e, i) => {
      const esActual = i === idx;
      return `<a class="era-crumb${esActual ? ' actual' : ''}" ${esActual ? '' : `href="${CFG.hrefEras[i]}"`}>${i+1}</a>`;
    }).join('');
    document.getElementById('era-breadcrumb').innerHTML = htmlBreadcrumb;
    document.getElementById('era-breadcrumb-bottom').innerHTML = htmlBreadcrumb;

    const prevB = document.getElementById('era-prev-bottom');
    const nextB = document.getElementById('era-next-bottom');
    if(idx > 0){
      prevB.href = CFG.hrefEras[idx-1]; prevB.textContent = `◀ ${eras[idx-1].titulo}`;
    } else {
      prevB.classList.add('vacio'); prevB.textContent = t('◀ Era anterior');
    }
    if(idx < eras.length - 1){
      nextB.href = CFG.hrefEras[idx+1]; nextB.textContent = `${eras[idx+1].titulo} ▶`;
    } else {
      nextB.classList.add('vacio'); nextB.textContent = t('Era siguiente ▶');
    }

    document.title = `${era.titulo} — Universo Musical CA7RIEL & Paco Amoroso`;
  }

  /* ---------- Init ---------- */
  pintarEncabezadoEra();
  initFilters();
  render();

  /* ---------- Footer: fecha de última actualización (automática) ---------- */
  (function setLastUpdate(){
    const el = document.getElementById('last-update');
    if(!el) return;
    const d = new Date(document.lastModified);
    if(isNaN(d.getTime())){ el.textContent = t('sin datos'); return; }
    el.textContent = d.toLocaleDateString(window.localeFecha || 'es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  })();
