# Universo Musical — CA7RIEL & Paco Amoroso

Sitio web sobre la carrera de CA7RIEL & Paco Amoroso, contada como "Las 7 Eras".
Estética editorial (inspirada en Rolling Stone): blanco, tipografía serif, rojo
como acento quirúrgico.

## Estructura del proyecto

```
├── index.html     → Portada: foto principal + test + lista de las 7 Eras
├── era1.html      → Astor (2011–2017) — fondo amarillo
├── era2.html      → Nace el mito (2018–2020) — fondo verde limón
├── era3.html      → FLY SOLO (2020–2021) — fondo verde
├── era4.html      → Temporada II (2022–2023) — fondo naranja
├── era5.html      → Baño María: Pop Up (2024) — fondo rojo
├── era6.html      → Papota: The Big Bang Duo (2024–2025) — fondo azul
├── era7.html      → Free Spirits: Global Pop Stars (2026) — fondo crema
├── datos.js       → TODOS los hitos y las Eras (el único lugar donde se editan)
├── era.js         → La lógica de las páginas de Era (no hace falta tocarlo)
├── era.css        → El diseño de las páginas de Era
├── i18n.js        → El botón ES/EN y la lógica de idioma
├── i18n-en.js     → Todos los textos en inglés
├── tarjeta.js     → Dibuja la imagen para compartir el resultado del test
├── historia.html  → La historia, diagramada como nota de revista
├── mapa.html      → World Tour: mapa de la gira (2024–2026)
└── images/
    ├── og/        → Imágenes de 1200×630 para la vista previa al compartir cada página
    └── …          → Fotos del sitio
```

**Cada página de Era (`eraN.html`) contiene:**
- Hero con **color sólido de fondo** (el que le corresponde a esa Era) — hasta
  que tengamos la foto real de cada una, que reemplaza ese color de fondo
- Contador de shows en esa Era
- Foto + texto de la Era (lado a lado)
- Filtros de categoría
- Línea de tiempo con TODOS los hitos de esa Era (Canción, Álbum, EP, Video
  Clip, Concierto, Shortfilm), en orden cronológico (de más viejo a más nuevo)
- Navegación arriba y abajo: Era anterior / Volver al inicio / Era siguiente

**Para poner la foto real de una Era:** subí la imagen a la carpeta `images/`
y pedile a Claude que la cargue en el campo `foto` del objeto de esa Era
(dentro del array `DATA` en el archivo `datos.js`) — automáticamente
reemplaza el color sólido de fondo por la foto.

---

## Cómo publicarlo gratis con GitHub Pages

### Opción A — Sin usar la terminal (la más simple)

1. Entrá a [github.com](https://github.com) y creá una cuenta si todavía no tenés.
2. Arriba a la derecha, tocá el **"+"** → **"New repository"**.
3. Poné un nombre (por ejemplo `universo-musical`), marcalo como **Public**, y creá el repositorio.
4. Dentro del repositorio, tocá **"Add file" → "Upload files"**.
5. Arrastrá **todos** los archivos y la carpeta `images` completa a esa pantalla.
6. Abajo, tocá **"Commit changes"**.
7. Andá a **Settings** → **Pages** (menú de la izquierda).
8. En "Source", elegí la rama **main**, carpeta **/ (root)**, y guardá.
9. GitHub te va a dar una URL así:
   `https://tu-usuario.github.io/universo-musical/`

### Opción B — Con git (si ya lo usás)

```bash
git init
git add .
git commit -m "Primera versión del sitio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/universo-musical.git
git push -u origin main
```

---

## Cómo editar el contenido

- Los **datos de cada Era** (nombre, período, texto, foto) y **todos los
  hitos** viven en el array `DATA`, dentro de **`datos.js`**. Es un solo
  archivo compartido por las 7 páginas: corregís un dato una vez y se ve en
  todas.
- **Fotos nuevas:** subilas en JPG o WebP, idealmente de menos de 1600 px de
  ancho y menos de 400 KB. Los PNG de captura de pantalla pesan 10 veces más
  y hacen que el sitio cargue lento en el celular.
- El **color de fondo y el contador de shows** de cada Era se definen arriba
  de cada archivo, en `window.PAGE_CONFIG = { ... }`.
- Las **fotos** están en la carpeta `images/`.
- Los **premios** (5 Latin Grammy · 1 Grammy · 7 Gardel) se editan en
  `index.html`, buscá `stat-awards`.

## Versión en inglés

El botón **ES / EN** del menú cambia todo el sitio de idioma y recuerda la
elección al pasar de una página a otra. Los textos en inglés están en
`i18n-en.js`, que solo se descarga cuando alguien elige inglés.

- **Textos fijos de las páginas** (títulos, párrafos de la Historia, menú):
  cada uno tiene una marca `data-i18n="clave"` en el HTML, y su traducción
  está en la sección `static` de `i18n-en.js`.
- **Hitos:** la traducción va en la sección `data`, con la clave
  `"fecha|título en castellano"` (por ejemplo `"2019-03-21|OUKE"`). Podés
  traducir solo algunos campos (`titulo`, `teaser`, `descripcion`).
- **Si falta una traducción, se muestra el texto en castellano**: nada se
  rompe. Cuando sumes un hito nuevo, acordate de agregar su versión en inglés
  (o pedíselo a Claude).
- Los títulos de canciones, discos y notas de prensa quedan en su idioma
  original a propósito.

---

## Cómo verificar el favicon, Open Graph y SEO

Estas tres cosas no se ven "dentro" del sitio en sí — se ven en lugares específicos:

- **Favicon**: mirá la pestaña del navegador cuando tenés el sitio abierto — debería verse un cuadradito rojo con un "7" blanco, en vez del ícono genérico. En el celular, se ve en la pestaña del navegador y si guardás el sitio como acceso directo/marcador.
- **Open Graph** (cómo se ve el link al compartirlo): la forma más directa es pegar el link real de tu sitio (una vez subido) en una herramienta como **[opengraph.xyz](https://www.opengraph.xyz/)** o el **[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)** — ahí ves exactamente la tarjetita (foto + título + descripción) que va a aparecer cuando alguien pegue tu link en WhatsApp, Twitter/X o redes. Ojo: a veces estas plataformas guardan una versión vieja en caché — si cambiás la imagen más adelante, puede tardar en actualizarse ahí, aunque tu sitio ya esté actualizado.
- **SEO**: no se ve de forma inmediata (Google tarda en indexar sitios nuevos, puede llevar días o semanas). Podés confirmar que el código está bien mirando el "código fuente" de la página en el navegador (click derecho → "Ver código fuente de la página") y buscando la línea `<meta name="description"...`.

## Roadmap y decisiones tomadas

Esta sección es un registro de qué se decidió dejar para más adelante, y por qué — para no perder el hilo entre sesiones de trabajo.

### ✅ Ya decidido / implementado

- **Contador de visitas (GoatCounter)**: está conectado, pero **no se muestra ningún número en la página pública** (decisión tomada a propósito). Para ver las estadísticas (visitas, países), entrar a `lucesdelsur.goatcounter.com` con el login de la cuenta. Es privado, solo lo ve quien tenga ese acceso.
- **CSS y datos compartidos** (octubre 2026): antes estaban copiados en los 7 archivos de Era; ahora viven en `era.css`, `datos.js` y `era.js`. Así no se desincronizan y el navegador los descarga una sola vez. Para que una página de Era funcione, esos tres archivos tienen que estar subidos junto a ella.
- **Test "¿En qué Era estás?"**: los empates los gana la Era elegida más recientemente; se puede volver a la pregunta anterior y compartir el resultado (el link `?resultado=N` abre ese resultado en la portada).
- **Compartir resultado** (octubre 2026): el botón genera una imagen de 1080×1920 (tamaño historia de Instagram) con el resultado, dibujada por `tarjeta.js` con la foto de `images/og/eraN.jpg` (la Era 6 usa `images/hito-tiny-desk.jpg`). En el celular abre el menú para compartir; en la compu descarga la imagen.
- **Categorías de filtro**: consolidadas a 4 — Discografía (canciones, álbumes/EPs, cortometrajes), Colaboración, Prensa (entrevistas + artículos), Conciertos.
- **Jerarquía "hito destacado"**: los hitos más importantes de cada Era tienen tratamiento visual más grande (foto e título más grandes, franja con tinte del color de la Era), visible también en celular.

### 🕑 Pendiente para una segunda etapa

- **Página de Premios**: hoy es solo una línea de texto en la portada ("5 Latin Grammy · 1 Grammy · 7 Gardel"). Se evaluará armar una página propia con el detalle de cada premio (año, categoría) más adelante.
- **Página de Colaboradores**: un "quién es quién" del universo (Chita, Wos, Miranda!, Jack Black, Sting, Anderson .Paak, etc.), aprovechando que ya existe el filtro de "Colaboración". Se evaluará cuando el contenido principal esté más avanzado.
- **Layout en grilla para la línea de tiempo**: hoy los hitos van uno debajo del otro (franjas secuenciales). Se está evaluando una alternativa en grilla (varias columnas) para achicar el largo de cada página de Era. Pendiente de mockup antes de implementar.

### ❓ Sin resolver — a la espera de datos

- El texto acortado de cada Era (el usuario lo va a proveer).
- El texto completo de `historia.html` (hoy es un placeholder).
- Varios hitos sin foto, descripción o link — ver la planilla de seguimiento (`hitos-para-completar.xlsx`) para el detalle fila por fila.

## Hecho por

Lucesdelsur
