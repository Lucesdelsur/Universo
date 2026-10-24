/* =============================================================
   TARJETA PARA COMPARTIR EL RESULTADO DEL TEST
   -------------------------------------------------------------
   Dibuja una imagen vertical de 1080 × 1920 (tamaño historia de
   Instagram) con el resultado del test, en un <canvas>.
   Uso: await dibujarTarjeta(canvas, numeroDeEra, resultado, idioma)
   ============================================================= */
(function(){
  const W = 1080, H = 1920, M = 72;           // ancho, alto, margen lateral
  const ROJO = '#D71920', TINTA = '#111111', GRIS = '#5C5C5C', LINEA = '#E3E3E3';

  // Color de cada Era (el mismo de la portada) y color del texto encima.
  const ERAS = {
    1: { color: '#FFC72C', texto: '#111111' },
    2: { color: '#C6D92E', texto: '#111111' },
    3: { color: '#2E7D32', texto: '#FFFFFF' },
    4: { color: '#F4772E', texto: '#111111' },
    5: { color: '#B0141C', texto: '#FFFFFF' },
    6: { color: '#1E4FBF', texto: '#FFFFFF' },
    7: { color: '#F3EFE7', texto: '#111111' },
  };
  // Foto de cada tarjeta (por defecto, la de la vista previa de esa Era).
  // "y" = qué parte de la foto se ve: 0 arriba, 0.5 centro, 1 abajo.
  const FOTOS = { 6: { src: 'images/hito-tiny-desk.jpg', y: 0 } };

  const TXT = {
    es: { pregunta: '¿EN QUÉ ERA ESTÁS HOY?', marca: 'CA7RIEL & PACO AMOROSO · UNIVERSO',
          receta: 'PRESCRIPCIÓN MÉDICA OFICIAL', cancion: 'Canción del día', bebida: 'Bebida del día',
          accesorio: 'Accesorio del día', peligro: 'Nivel de peligro social', pie: '¿Y vos? Hacé el test en' },
    en: { pregunta: 'WHICH ERA ARE YOU IN TODAY?', marca: 'CA7RIEL & PACO AMOROSO · UNIVERSE',
          receta: 'OFFICIAL MEDICAL PRESCRIPTION', cancion: 'Song of the day', bebida: 'Drink of the day',
          accesorio: 'Accessory of the day', peligro: 'Social danger level', pie: 'Your turn? Take the test at' },
  };
  const SITIO = 'lucesdelsur.github.io/Universo';

  const F = {
    display: (px) => `900 ${px}px Merriweather, Georgia, serif`,
    cuerpo:  (px) => `italic 400 ${px}px Lora, Georgia, serif`,
    ui:      (px, w = 700) => `${w} ${px}px Inter, Helvetica, Arial, sans-serif`,
  };

  let fuentesListas = null;
  function cargarFuentes(){
    if(!document.fonts || !document.fonts.load) return Promise.resolve();
    if(!fuentesListas){
      fuentesListas = Promise.all([
        document.fonts.load(F.display(90)), document.fonts.load(F.cuerpo(40)),
        document.fonts.load(F.ui(30, 700)), document.fonts.load(F.ui(30, 600)),
      ]).catch(() => {});
    }
    return fuentesListas;
  }

  const fotos = {};
  function cargarFoto(src){
    if(!fotos[src]){
      fotos[src] = new Promise(res => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
      });
    }
    return fotos[src];
  }

  // Corta un texto en líneas que entren en "ancho".
  function lineas(ctx, texto, ancho){
    const palabras = String(texto).split(/\s+/);
    const out = []; let actual = '';
    palabras.forEach(p => {
      const prueba = actual ? actual + ' ' + p : p;
      if(ctx.measureText(prueba).width > ancho && actual){ out.push(actual); actual = p; }
      else actual = prueba;
    });
    if(actual) out.push(actual);
    return out;
  }

  function espaciado(ctx, texto, x, y, sep, alinear){
    // Texto con letter-spacing (canvas no lo tiene en todos los navegadores).
    const letras = [...texto];
    const total = letras.reduce((a, l) => a + ctx.measureText(l).width, 0) + sep * (letras.length - 1);
    let cx = alinear === 'center' ? x - total / 2 : x;
    const prev = ctx.textAlign; ctx.textAlign = 'left';
    letras.forEach(l => { ctx.fillText(l, cx, y); cx += ctx.measureText(l).width + sep; });
    ctx.textAlign = prev;
    return total;
  }

  window.dibujarTarjeta = async function(canvas, era, res, idioma){
    const t = TXT[idioma === 'en' ? 'en' : 'es'];
    const meta = ERAS[era] || ERAS[1];
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    await cargarFuentes();
    const cfgFoto = FOTOS[era] || { src: `images/og/era${era}.jpg`, y: 0.3 };
    const foto = await cargarFoto(cfgFoto.src);

    // Fondo
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);

    // Franja superior con el color de la Era
    const BANDA = 190;
    ctx.fillStyle = meta.color; ctx.fillRect(0, 0, W, BANDA);
    ctx.fillStyle = meta.texto; ctx.textBaseline = 'alphabetic';
    ctx.font = F.ui(24); ctx.globalAlpha = .85;
    espaciado(ctx, t.marca, W / 2, 70, 3.5, 'center');
    ctx.globalAlpha = 1;
    ctx.font = F.display(54); ctx.textAlign = 'center';
    ctx.fillText(t.pregunta, W / 2, 148, W - 2 * M);

    // Foto de la Era
    const FY = BANDA, FH = 470;
    if(foto){
      const escala = Math.max(W / foto.width, FH / foto.height);
      const sw = W / escala, sh = FH / escala;
      ctx.drawImage(foto, (foto.width - sw) / 2, (foto.height - sh) * cfgFoto.y, sw, sh, 0, FY, W, FH);
    } else {
      ctx.fillStyle = meta.color; ctx.fillRect(0, FY, W, FH);
    }

    // Etiqueta roja
    let y = FY + FH + 64;
    ctx.font = F.ui(26);
    const anchoReceta = [...t.receta].reduce((a, l) => a + ctx.measureText(l).width, 0) + 3 * (t.receta.length - 1);
    ctx.fillStyle = ROJO; ctx.fillRect(M, y - 40, anchoReceta + 40, 56);
    ctx.fillStyle = '#FFFFFF'; espaciado(ctx, t.receta, M + 20, y - 2, 3, 'left');

    // Número y nombre de la Era
    const [numero, ...resto] = String(res.title).split(/\s+[–-]\s+/);
    const nombre = resto.join(' – ') || numero;
    y += 92;
    ctx.textAlign = 'left'; ctx.fillStyle = ROJO; ctx.font = F.ui(34);
    espaciado(ctx, numero.toUpperCase(), M, y, 6, 'left');

    let tam = 104;
    ctx.font = F.display(tam);
    while(ctx.measureText(nombre).width > W - 2 * M && tam > 74){ tam -= 4; ctx.font = F.display(tam); }
    const lineasNombre = lineas(ctx, nombre, W - 2 * M);
    ctx.fillStyle = TINTA;
    lineasNombre.forEach((l, i) => ctx.fillText(l, M, y + 18 + tam * (i + 1)));
    y += 18 + tam * lineasNombre.length;

    // Filas de datos, ancladas abajo (sobre el pie)
    const PIE = 150;
    const filas = [
      [t.cancion, res.cancion, false],
      [t.bebida, res.bebida, false],
      [t.accesorio, res.accesorio, false],
      [t.peligro, res.peligro, true],
    ];
    const VAL = 34, LH = 44;
    ctx.font = F.ui(VAL, 600);
    const alturas = filas.map(([, v, roja]) => 30 + 16 + lineas(ctx, v, W - 2 * M - (roja ? 24 : 0)).length * LH + 26);
    const totalFilas = alturas.reduce((a, b) => a + b, 0);
    let fy = H - PIE - 40 - totalFilas;

    // Diagnóstico: ocupa el espacio que queda, achicando la letra si hace falta
    const zonaTop = y + 54, zonaBot = fy - 36;
    let dt = 44, dl;
    do {
      ctx.font = F.cuerpo(dt);
      dl = lineas(ctx, `“${res.diag}”`, W - 2 * M);
      if(dl.length * dt * 1.42 <= zonaBot - zonaTop) break;
      dt -= 2;
    } while(dt > 28);
    ctx.fillStyle = '#333333';
    dl.forEach((l, i) => ctx.fillText(l, M, zonaTop + dt + i * dt * 1.42));

    filas.forEach(([etq, val, roja], i) => {
      ctx.fillStyle = LINEA; ctx.fillRect(M, fy, W - 2 * M, 2);
      const x = M + (roja ? 24 : 0);
      ctx.fillStyle = GRIS; ctx.font = F.ui(22);
      espaciado(ctx, etq.toUpperCase(), x, fy + 46, 2.5, 'left');
      ctx.fillStyle = roja ? ROJO : TINTA; ctx.font = F.ui(VAL, 600);
      const ls = lineas(ctx, val, W - 2 * M - (roja ? 24 : 0));
      ls.forEach((l, j) => ctx.fillText(l, x, fy + 46 + 16 + LH * (j + 1) - 6));
      if(roja){ ctx.fillStyle = ROJO; ctx.fillRect(M, fy + 18, 6, alturas[i] - 32); }
      fy += alturas[i];
    });

    // Pie rojo con la dirección del sitio
    ctx.fillStyle = ROJO; ctx.fillRect(0, H - PIE, W, PIE);
    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
    ctx.font = F.ui(28, 600); ctx.globalAlpha = .9;
    ctx.fillText(t.pie, W / 2, H - PIE + 60);
    ctx.globalAlpha = 1; ctx.font = F.ui(40);
    ctx.fillText(SITIO, W / 2, H - PIE + 112);
    ctx.textAlign = 'left';
    return canvas;
  };
})();
