/* =============================================================
   1) DATOS DEL TIMELINE — EDITÁ ESTO LIBREMENTE
   -------------------------------------------------------------
   Cada evento es un objeto con:
     fecha:      "AAAA-MM-DD" (si no sabés el mes/día exacto, usá "AAAA-01-01")
     categorias: array con 1 o más categorías, ej: ["Canción"] o
                 ["Canción", "Video Clip"]. Deben coincidir con una clave
                 de CATEGORIAS (más abajo). (Las Eras son la excepción:
                 usan "categoria: \"Era\"" en singular, no toques eso.)
     titulo:     título corto
     teaser:     1 frase que aparece en la tarjeta chica
     descripcion:texto más largo que aparece al hacer click
     foto:       URL de una imagen (dejalo en "" si todavía no tenés la foto:
                 se muestra un placeholder para que sepas dónde va)
     youtube:    ID del video de YouTube (la parte después de "v=" en la URL,
                 son 11 caracteres). Dejalo en "" si no hay video para ese hito.
     datos:      lista de pares { etiqueta, valor } para mostrar como "ficha técnica"
     destacado:  false = solo un punto lleno en la línea (sin tarjeta).
                 Si no lo escribís, por defecto es true (tarjeta completa).
     publico:    opcional, texto tipo "8.000 personas" — aparece entre
                 paréntesis al lado del título (para Conciertos).
     enlace:     opcional, URL de un artículo/nota externa (para Entrevistas
                 sin foto ni video). Si está presente, el click NO abre el
                 modal: te lleva directo a esa URL en una pestaña nueva.
                 Si no hay foto/youtube/enlace, la tarjeta se ve sin
                 miniatura (solo el título).
   ============================================================= */

  const CATEGORIAS = {
    "Era":        { color: "var(--violet)" },
    "Discografía": { color: "var(--lime)" },
    "Conciertos":  { color: "var(--gold)" },
    "Colaboración": { color: "var(--red)" },
    "Prensa":     { color: "var(--red)" },
  };

  // Devuelve el/los color(es) de un array de categorías
  function catColors(categorias){
    return (categorias || []).map(c => CATEGORIAS[c] ? CATEGORIAS[c].color : 'var(--lime)');
  }
  // Devuelve un valor CSS de background: sólido si es 1 categoría,
  // conic-gradient partido en porciones iguales si son 2 o más.
  function catBackground(categorias){
    const colors = catColors(categorias);
    if(colors.length <= 1) return colors[0] || 'var(--lime)';
    const step = 360 / colors.length;
    const stops = colors.map((c, i) => `${c} ${i*step}deg ${(i+1)*step}deg`).join(', ');
    return `conic-gradient(${stops})`;
  }

  /* Las Eras son hitos con categoria:"Era" que además llevan el campo
     "hasta" (fecha de cierre del período). El resto de los hitos se
     agrupan automáticamente bajo la Era vigente según su fecha. */
  const DATA = [
    // ---------- ERAS ----------
    {
      fecha: "2011-01-01", hasta: "2017-12-31", categoria: "Era",
      titulo: "Astor", lugar: "Buenos Aires, Argentina",
      colorEra: "var(--violet)",
      teaser: "Los años en salas de ensayo.",
      descripcion: "<p>Esta era se define por el virtuosismo instrumental y las raíces en el rock, el funk y el reggae. Los artistas, amigos desde los 6 años, formaron la banda Astor y las Flores de Marte, donde CA7RIEL ya destacaba como un guitarrista formado en conservatorio.</p><p>Antes de ser \"Paco Amoroso\", Ulises era el baterista de la banda y CA7RIEL lo llamaba para que fuera su \"secuaz\" en sus proyectos.</p><p class=\"cita-destacada\">\"Cato vive como si no hubiera mañana, y yo soy lo opuesto... soy el que lleva la parte más racional\" —Paco Amoroso</p>",
      foto: "images/era1-astor-y-las-flores-de-marte.jpg", youtube: "",
      datos: [{etiqueta:"Período", valor:"2011–2017"}]
    },
    {
      fecha: "2018-01-01", hasta: "2020-05-31", categoria: "Era",
      titulo: "Nace el mito", lugar: "Buenos Aires, Argentina",
      colorEra: "var(--cyan)",
      teaser: "Hackeo a la escena del trap",
      descripcion: "<p>Es el nacimiento del mito y su irrupción en el trap argentino. CA7RIEL lanza los EPs Povre y Livre, y junto a Paco publican hits virales como \"Ouke\" y \"Jala Jala\". Esta era culmina con el show \"La Celebración\" en el Estadio Obras en diciembre de 2019.</p><p>El video de \"Jala Jala\" fue diseñado específicamente para verse en formato vertical en celulares, simulando que el teléfono estaba hackeado.</p><p class=\"cita-destacada\">\"¿Sabé' lo qué es odiarte y que todo el mundo te ame?\" —CA7RIEL, en su BZRP Session #14</p>",
      foto: "", fotos: ["images/era2-pared-roja.jpg", "images/era2-recital-2019.jpg"], youtube: "",
      creditosFotos: ["", "Foto: Rafael Mario Quinteros"],
      datos: [{etiqueta:"Período", valor:"2018–2020"}]
    },
    {
      fecha: "2020-06-01", hasta: "2021-12-31", categoria: "Era",
      titulo: "FLY SOLO", lugar: "Argentina",
      colorEra: "var(--gray)",
      teaser: "Una pandemia mundial y dos discos icónicos.",
      descripcion: "<p>Durante la pandemia, el dúo se separa para explorar sus identidades individuales. CA7RIEL lanza EL DISKO, una obra de jazz-rock y funk experimental, mientras Paco presenta SAETA, un álbum de pop electrónico y r&b.</p><p>CA7RIEL definió EL DISKO como una \"purga\" de lo que sentía como \"música de mierda\" o \"experimentos sociales\" hechos durante su etapa de trap.</p><p class=\"cita-destacada\">\"Con esto purgué. Realmente todo lo que tenía de sucio dentro mío, lo eliminé\" —CA7RIEL, sobre EL DISKO</p>",
      foto: "", fotos: ["images/era3-parrilla.jpeg", "images/era3-glitch-face.jpg"], youtube: "",
      creditosFotos: ["", "Ilustración: Florencia Daniel"],
      datos: [{etiqueta:"Período", valor:"2020–2021"}]
    },
    {
      fecha: "2022-01-01", hasta: "2023-12-31", categoria: "Era",
      titulo: "Temporada II", lugar: "Argentina",
      colorEra: "var(--orange)",
      teaser: "",
      descripcion: "<p>Marca el regreso oficial del dúo a los escenarios tras sus carreras solistas. Lanzan el single \"Para Afuera\", incursionando en el big room house y la estética de la noche electrónica.</p><p>Presentaron su regreso con una gira titulada literalmente \"Temporada II\", como si su carrera fuera una serie de ficción.</p><p class=\"cita-destacada\">Las fuentes los describen en esta etapa como \"perros sobreestimulados\" que van tras el rastro del placer en un laberinto de beats.</p>",
      foto: "images/era4-auto.jpg", youtube: "",
      datos: [{etiqueta:"Período", valor:"2022–2023"}]
    },
    {
      fecha: "2024-01-01", hasta: "2024-10-03", categoria: "Era",
      titulo: "Baño María: Pop Up", lugar: "Argentina / gira",
      colorEra: "var(--magenta)",
      teaser: "",
      descripcion: "<p>El dúo firma con Sony y lanza Baño María, un disco con una estrategia de marketing agresiva que incluye colaboraciones con Lali y Tini. Es la era de la \"de-generación\" musical, mezclando géneros globales.</p><p>En el Lollapalooza 2024, en lugar de tocar en vivo, se metieron en un jacuzzi en el escenario mientras un DJ pasaba el disco, un gesto que Paco luego calificó como una \"idea horrible\" que hicieron por estrategia.</p><p class=\"cita-destacada\">\"No tiene género, amor, nosotros somos 'de-generados'\" —CA7RIEL</p>",
      foto: "images/era5-bano-maria.webp", youtube: "",
      datos: [{etiqueta:"Período", valor:"Enero – 3 de octubre de 2024"}]
    },
    {
      fecha: "2024-10-04", hasta: "2025-12-31", categoria: "Era",
      titulo: "Papota: The Big Bang Duo", lugar: "Global",
      colorEra: "var(--lime)",
      teaser: "Estallido y expansión global",
      descripcion: "<p>Tras el éxito masivo de su Tiny Desk (que superó en vistas a artistas como Taylor Swift), el dúo alcanza un estatus global. Lanzan el EP Papota, ganan 5 Latin Grammys y adoptan el \"Bait\" como su principal herramienta artística y comunicacional.</p><p>Para anunciar el fin de esta era y el inicio de la siguiente, quemaron sus icónicos atuendos del Tiny Desk en el video de \"GIMME MORE\".</p><p class=\"cita-destacada\">\"Ya no nos percibimos humanos, nos autopercibimos empresas\" —CA7RIEL, al recibir los Latin Grammys</p>",
      foto: "images/era6-papota-globos.jpeg", youtube: "",
      datos: [{etiqueta:"Período", valor:"4 de octubre de 2024 – 2025"}]
    },
    {
      fecha: "2026-01-01", hasta: "2026-12-31", categoria: "Era",
      titulo: "Free Spirits: Global Pop Stars", lugar: "Global",
      colorEra: "var(--gold)",
      teaser: "",
      descripcion: "<p>Tras un supuesto anuncio de burnout y cancelación de su disco TOP OF THE HILLS, regresan con Sting como mentor espiritual. El álbum FREE SPIRITS parodia los centros de retiro espiritual para famosos y explora el peso de la fama.</p><p>El propio Sting aparece en un video explicando que el disco anterior del dúo era tan malo que tuvo que tomarlos como discípulos para \"sanarlos\".</p><p class=\"cita-destacada\">\"Nadie inventa nada nuevo, todo ya está hecho, bebo\" —lírica con la que abren el disco</p>",
      foto: "images/era7-free-spirits.jpeg", youtube: "",
      datos: [{etiqueta:"Período", valor:"2026"}]
    },

    // ---------- HITOS (EP / Concierto / Shortfilm) — EJEMPLOS, completar con info real ----------

    // ========== CARGA 1 (CSV discografia) — Eras 1, 2 y 3 ==========
    // ---- ERA Primera (2011 - 2017): Retoños de grandeza . Los años en las salas de ensayo. [falta texto se agrega despues] ----
    {
      fecha: "2012-11-16", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Astor y las flores de marte - Mazitaguz",
      teaser: "Su primera grabación fue en el estudio de Lito Vitale para presentarse a un concurso.", descripcion: "Track grabado en el estudio de Lito Vitale, para el concurso Vamos Las Bandas 2012.",
      foto: "", youtube: "I-2vt-lrnh0",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2015-07-29", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "xCVE7Ex",
      teaser: "Un rap oscuro, grabado de modo autogestivo en ADG Estudio.", descripcion: "Álbum autogestionado de CA7RIEL en solitario, grabado en ADG Estudio. Géneros: hip-hop underground, boom bap, rap alternativo, lo-fi.",
      foto: "", youtube: "GBThdK-OemE",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2017-10-10", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Vacaciones todo el año",
      teaser: "\"Grabado en casita, mezclado por Lucas Forte.\"", descripcion: "Grabado en casita, mezclado por Lucas Forte.",
      foto: "", youtube: "4lCpDJyPfmo",
      destacado: true, nivel: "mayor"
    },
    // ---- ERA Segunda (2018 - 2019): Nace el mito (2018 - 2019). Hackeo a la escena del trap [falta texto se agrega despues] ----
    {
      fecha: "2018-03-08", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "POVRE",
      teaser: "Intensivo de trap con visión propia grabado en la misma compu que su mamá leia los emails.", descripcion: "EP solista de CA7RIEL, producido junto a Facundo Yalve (Evlay). Géneros: trap experimental, rap, hip-hop alternativo, rock.",
      foto: "", youtube: "6edOkpshG6U",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2018-11-28", categorias: ["Colaboración"], lugar: "Argentina",
      titulo: "No Fue (con Chita)",
      teaser: "", descripcion: "",
      foto: "", youtube: "_5EiaIqB7io",
      destacado: true
    },
    {
      fecha: "2018-11-20", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "LIVRE",
      teaser: "La contracara de POVRE. Funk bien pesado, rock progresivo y espacial.", descripcion: "EP solista de CA7RIEL. Mezclado por Facundo Yalve (Evlay) en apenas media hora. Arte de tapa: Mica Burgos y CA7. Géneros: trap experimental, rap, rock alternativo/industrial, funk.",
      foto: "images/hito-livre-cover.jpg", youtube: "WS0YQF5-cZ4",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2018-11-25", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "JALA JALA",
      teaser: "El video diseñado para celulares explota con una energía punk, irónica e irreverente.", descripcion: "",
      foto: "", youtube: "k0ZSoIO0ZXw",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2019-03-21", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "OUKE",
      teaser: "Rompen las barreras del nicho urbano, un estallido de popularidad en claves de comedia ácida.", descripcion: "Elenco: Paquito, Ca7riel, Lamothe, Pirulo, Lili Blanco, Manu Donnet, Macho Toscani, La Pioji, El Gera 92, Bety y Gustavo. Dirección: Orco Videos.",
      foto: "images/hito-ouke-cover.jpeg", youtube: "7LIERMc27-Q",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2019-07-12", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "OLA MINA XD",
      teaser: "Caóticos, lúdicos, hiperconectados.", descripcion: "",
      foto: "", youtube: "BdRbvvfiBwU",
      destacado: true
    },
    {
      fecha: "2019-11-01", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "MI SOMBRA",
      teaser: "Un refugio en el caos, la búsqueda de un amor devoto e irracional", descripcion: "Producción musical de Facu Yalve, CA7RIEL y Paco Amoroso. Dirigido por Hernán Kacew, producido por Pantera&Co.",
      foto: "", youtube: "c1u3jtg4Skg",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2019-12-12", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "McFly",
      teaser: "Junto con \"Coca Cola\", formó un díptico de canciones que \"rompieron internet\" y tuvo un debut en vivo impecable durante el show en Obras", descripcion: "Producido por Evlay Beats y CA7RIEL. Dirección: Orco Videos.",
      foto: "", youtube: "Bp0-TarxMH0",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2019-12-18", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Cono Hielo",
      teaser: "Fue su último gran lanzamiento de 2019; lo tocaron por primera vez ante el público en Obras y se convirtió en un himno.", descripcion: "Producido por Evlay Beats y Laucha the Kid. Dirección: Orco Videos, dirección de arte de Lucía Lalor.",
      foto: "", youtube: "GJxyBZvAGRc",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2019-04-18", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Paco Amoroso: Bzrp Music Sessions, Vol. 3",
      teaser: "Supero los 80 M de visualizaciones.", descripcion: "Letra de Paco Amoroso, beat de Axel Fiks. Editado y producido por Bizarrap. Superó los 80 millones de visualizaciones.",
      foto: "", youtube: "-smN6ZUHzgk",
      destacado: true
    },
    {
      fecha: "2019-08-30", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Ca7riel: Bzrp Music Sessions, Vol. 14",
      teaser: "Superó los 20 millones de visualizaciones.", descripcion: "Sesión de CA7RIEL con Bizarrap. Superó los 20 millones de visualizaciones.",
      foto: "", youtube: "TzUdpcNV-Q8",
      destacado: true
    },
    {
      fecha: "2019-12-12", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Todo el día",
      teaser: "Es la canción favorita dentro de los fans más jóvenes del dúo.", descripcion: "Canción con Axel Fiks. Producción de Facundo Yalve, dirección de Orco Videos.",
      foto: "", youtube: "kgMRI3yh6_k",
      destacado: true, nivel: "mayor"
    },
    // ---- ERA Tercera (2020 -2021): La separación. Una pandemia mundial y dos discos icónicos. [falta texto se agrega despues] ----
    {
      fecha: "2020-06-17", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "MI DESEO / Las Vegas Strip",
      teaser: "En estos temas Paco Amoroso encuentra profundidad e intensidad lírica diferente a la de sus hits festivos previos", descripcion: "",
      foto: "", youtube: "FlO-W844Lc4",
      destacado: true
    },
    {
      fecha: "2020-11-25", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "FATAL",
      teaser: "La canción favorita de los fans de Paco Amoroso, no esta en el set list desde 2024.", descripcion: "",
      foto: "", youtube: "vW64D12-uAA",
      destacado: true
    },
    {
      fecha: "2020-09-02", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "POLVO",
      teaser: "Fue el primer adelanto del álbum solista de CA7RIEL, EL DISKO, y es descrita como una \"rapsodia dramática\" que funciona como una purga personal. Musicalmente es compleja, con ruidos industriales, sintetizadores \"que descienden al infierno\" y una batería que groovvea de golpe", descripcion: "Incluida en el álbum solista El Disko. Producción musical de Tomy Sainz y CA7RIEL, dirigido por Kevin Zeta.",
      foto: "", youtube: "uenecPEzBTk",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2020-12-05", categorias: ["Colaboración"], lugar: "Argentina",
      titulo: "I Rili Don't Care",
      teaser: "", descripcion: "",
      foto: "", youtube: "vKtphI9tN7Y",
      destacado: true
    },
    {
      fecha: "2021-01-03", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Sabe",
      teaser: "Una canción volcada de lleno al dancehall con fuertes tintes de música urbana y trap, ideal para la temporada veraniega", descripcion: "Dirigido por Orco Videos, producción de Baby Boom.",
      foto: "", youtube: "5bZYHFo7ZSI",
      destacado: true
    },
    {
      fecha: "2021-09-30", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Viuda Negra",
      teaser: "Una de las canciones más icónicas de Saeta con un estilo house pop de los años 90.", descripcion: "Video producido y dirigido por Pampa x Kato. Producción musical de Tadefonk y Alot (Baby Boom).",
      foto: "", youtube: "kLYkKk9U3j0",
      destacado: true
    },
    {
      fecha: "2021-11-04", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Chinga Sport",
      teaser: "Durante su show de Berlin en 2025, Tio la Bomba, el bajista de la banda que los acompaña en esta Era canto una parte de la canción", descripcion: "Con Tío La Bomba. Video de Orco Videos, producción musical de Maxi Sayes y Bruno Donato.",
      foto: "", youtube: "7XBS-dlk_-8",
      destacado: true
    },
    {
      fecha: "2021-11-25", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "SAETA",
      teaser: "“Desde que arrancó la pandemia fue darme cuenta de que existían las melodías, cosa que antes había pasado por alto... Todo el disco pasa por esa búsqueda: la inquietud por cantar” (Paco Amoroso)", descripcion: "Álbum solista de Paco Amoroso. Producción de Tadeo Kopistinski, Alejandro Glikman, Bruno Donato y Maxi Sayes, entre otros. Géneros: electrónica, house, pop experimental, hip-hop/urban.",
      foto: "", youtube: "QoE8jici2Fc",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2021-11-10", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "EL DISKO",
      teaser: "Una obra de once canciones \"deformes\" que mezclan el virtuosismo del jazz rock con la estética del trap. “Realmente todo lo que tenía de sucio dentro mío, lo eliminé. A eso me refiero con pureza” (CA7RIEL sobre el disco)", descripcion: "Álbum solista de CA7RIEL, grabado entre diciembre de 2019 y agosto de 2021. Producción principal de Tomás Sainz y CA7RIEL. Géneros: funk, trap, rock alternativo, electrónica, hip-hop experimental.",
      foto: "images/hito-el-disko.jpg", youtube: "GWYWcDuypRw",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2021-01-28", categorias: ["Colaboración"], lugar: "Argentina",
      titulo: "Muero de Fiesta Este Finde",
      teaser: "", descripcion: "",
      foto: "", youtube: "awzbkFbmfaU",
      destacado: true
    },
    {
      fecha: "2021-11-18", categorias: ["Colaboración"], lugar: "Argentina",
      titulo: "NIÑO GORDO FLACO (con Wos)",
      teaser: "", descripcion: "",
      foto: "", youtube: "wZbd_ODaIwM",
      destacado: true
    },

    // ========== Hitos de eras posteriores (ya cargados antes) ==========

    // ========== CONCIERTOS REALES (Excel) ==========
    {
      fecha: "2025-04-11", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "Coachella 2025 (Día Uno)",
      teaser: "", descripcion: "",
      foto: "", youtube: "tSosB2CdcQk",
      destacado: true
    },
    {
      fecha: "2025-11-23", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "CA7RIEL & PACO AMOROSO | Camp Flog Gnaw Festival 2025",
      teaser: "", descripcion: "",
      foto: "", youtube: "PuLFQ1sBMFg",
      destacado: true
    },
    {
      fecha: "2025-05-01", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "Miami Beach Bandshell",
      teaser: "", descripcion: "",
      foto: "", youtube: "LXXJrK67T1E",
      destacado: true
    },
    {
      fecha: "2025-07-13", categorias: ["Conciertos"], lugar: "Alemania",
      titulo: "Lollapalooza Berlín",
      teaser: "", descripcion: "",
      foto: "", youtube: "DfJx_lUtIvQ",
      destacado: true
    },
    {
      fecha: "2025-07-26", categorias: ["Conciertos"], lugar: "Japón",
      titulo: "Fuji Rock Japón",
      teaser: "", descripcion: "",
      foto: "", youtube: "wKjQmUAUeoc",
      destacado: true
    },
    {
      fecha: "2025-08-01", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "House of Blues Chicago",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      destacado: true
    },
    {
      fecha: "2025-08-02", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "Lollapalooza Chicago (Agregado)",
      teaser: "", descripcion: "",
      foto: "", youtube: "xkvldCjTwkY",
      destacado: true
    },
    {
      fecha: "2025-08-10", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "Outside Lands San Francisco",
      teaser: "", descripcion: "",
      foto: "", youtube: "N9TII_TzC5U",
      destacado: true
    },
    {
      fecha: "2025-08-15", categorias: ["Conciertos"], lugar: "México",
      titulo: "Palacio de los Deportes México",
      teaser: "", descripcion: "",
      foto: "", youtube: "Sv-hLwiw7L8",
      destacado: true
    },
    {
      fecha: "2022-12-23", categorias: ["Conciertos"], lugar: "Argentina",
      titulo: "Estadio Obras Outdoor (Paga Dios World Tour)",
      teaser: "", descripcion: "",
      foto: "", youtube: "zq68YWjiD0A",
      destacado: true
    },
    {
      fecha: "2019-12-20", categorias: ["Conciertos"], lugar: "Argentina",
      titulo: "Estadio Obras Sanitarias (La Celebración)",
      teaser: "Obras es conocido como el  \"Templo del Rock\", el show fue apodado por CA7RIEL como \"Silvio Soldout\" y contó con Esteban Lamothe recreando el video de \"Ouke\" en vivo sobre el escenario", descripcion: "",
      foto: "", youtube: "RUrugzFOYW8",
      destacado: true
    },
    {
      fecha: "2019-08-29", categorias: ["Conciertos"], lugar: "Argentina",
      titulo: "Niceto Club (En vivo con la ATR Band)",
      teaser: "Con su primera banda con dúo. Antes de la UATS tocaron con ATR Vanda.",
      descripcion: "CA7RIEL, Paco Amoroso y la ATR Band en vivo en Niceto. La ATR Band son: Julián Montes (bajo), Mariano \"Yuye\" Domínguez (batería), Guido Rodríguez y Axel Introini (teclados), con Fran Alduncin como baterista invitado.",
      foto: "", youtube: "nvEr6hA6Iak",
      destacado: true
    },
    {
      fecha: "2018-12-13", categorias: ["Conciertos"], lugar: "Argentina",
      titulo: "DAMN! Live Session III (Estudio Vorterix)",
      teaser: "", descripcion: "",
      foto: "", youtube: "vfIEX2c1fs0",
      destacado: true
    },

    // ========== CARGA 2 (CSV discografia) — Eras 4, 5 y 6/7 ==========
    // ---- ERA Cuarta (2022): El regreso más esperado. Temporada II [falta texto se agrega despues] ----
    {
      fecha: "2022-02-17", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "LAION SHUFFLE / PAQUIRRI",
      teaser: "El epílogo y la continuación estética de la etapa solista de Paco Amoroso tras publicar su álbum debut Saeta", descripcion: "",
      foto: "", youtube: "gYMQz3jEPMU",
      destacado: true
    },
    {
      fecha: "2022-03-16", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "PAGA DIOS",
      teaser: "Con sonidos cercanos al liquid funk y el highlife, fue llamada el \"episodio 1\" de su \"Temporada II\"", descripcion: "Producción musical de Neekl. Mezcla de Nico Cotton, masterizado por Jaime Estalella. Video de Juanita, grabado en Buenos Aires.",
      foto: "", youtube: "64r03gcbS1A",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2022-03-22", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "EN EL AFTER",
      teaser: "Para anunciar su lanzamiento publicaron fotos de ellos cuando era chicos. Una canción futurista que mezcla electrónica con toques de chill, propocionada con el pasado.", descripcion: "",
      foto: "", youtube: "JCtFjWR4W6w",
      destacado: true
    },
    {
      fecha: "2022-03-14", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "CA7RIEL & PACO AMOROSO - TEMPORADA ll",
      teaser: "", descripcion: "Producido y dirigido por Pampa x Kato, con dirección creativa de Facundo Cruz.",
      foto: "", youtube: "2ZyDsmqjj5g",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2022-11-03", categorias: ["Colaboración"], lugar: "Argentina",
      titulo: "Don (con Miranda!)",
      teaser: "", descripcion: "",
      foto: "", youtube: "bnkjvpBigVY",
      destacado: true
    },
    {
      fecha: "2022-03-23", categorias: ["Colaboración"], lugar: "Argentina",
      titulo: "El Mal / Cuando Se Apague Todo (con Valdés)",
      teaser: "", descripcion: "",
      foto: "", youtube: "k7q5tWRs1Yc",
      destacado: true
    },
    // ---- ERA Quinta (2024) : Bautismo de estudio. Baño María [falta texto se agrega despues] ----
    {
      fecha: "2024-04-18", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "BAÑO MARÍA",
      teaser: "\"No tiene género, amor, nosotros somos 'de-generados'\" CA7RIEL define la versatilidad del disco, evita etiquetas fijas para saltar entre el trap, el rock y la electrónica. El álbum fue grabado íntegramente en Miami en apenas dos semanas (una en agosto y otra en octubre) en los estudios de Sony. En el Lollapalooza 2024 Buenos Aires en lugar de realizar un show tradicional, el dúo optó por un \"perfomance de bait\" donde se metieron en un jacuzzi en medio del escenario mientras su DJ, Anita B Queen, reproducía el álbum completo", descripcion: "Primer álbum de estudio de larga duración del dúo. Producción de Federico Vindver, Casta, Taiko, XAY, DVLP, Sir Nolan y Slow Mike, entre otros. Géneros: pop latino, house/EDM, trap, R&B, jazz-rock.",
      foto: "", youtube: "iETY_1WGjiU",
      destacado: true
    },
    {
      fecha: "2024-05-01", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "BAÑO MARÍA",
      teaser: "El corto adopta el formato de una buddy film (película de compinches). Sigue a CA7RIEL y Paco Amoroso durante un día completo (24 horas) en el inframundo de la noche porteña de Buenos Aires", descripcion: "El cortometraje funciona como el marco visual y narrativo del álbum: sigue a Cato y Paco a lo largo de una noche desenfrenada, psicodélica y caótica por Buenos Aires, enlazando fragmentos de temas como BABY GANGSTA, DUMBAI y LA QUE PUEDE, PUEDE. Dirigido por Brian Kazez (Pantera Film).",
      foto: "", youtube: "j6hZv58R2tM",
      destacado: true, nivel: "mayor",
      datos: [{etiqueta:"Fecha", valor:"Aproximada (2024 (post-abril))"}]
    },
    {
      fecha: "2024-08-16", categorias: ["Conciertos"], lugar: "Buenos Aires, Argentina",
      titulo: "BAÑO MARÍA",
      teaser: "\"CA7RIEL & Paco Amoroso dan comienzo a su gira con un show explosivo en el Movistar Arena\" fue el titular de Rollins Stones Argentina. Armaron un Jacuzzi gigante en medio de la arena, y volaron por todo el lugar mientras cantaban.", descripcion: "",
      foto: "", youtube: "gHmA1PYH5Io",
      destacado: true
    },
    {
      fecha: "2024-10-04", categorias: ["Conciertos"], lugar: "Washington D.C., EE.UU.",
      titulo: "Quiebra la Matrix: Ca7riel & Paco Amoroso - Tiny Desk Concert",
      teaser: "La sesión que los hizo mundialmente conocidos.",
      descripcion: "Su Tiny Desk se viraliza en redes y acumula más de 16 millones de vistas. El quiebre exacto entre Bautismo de estudio y Big Bang.",
      foto: "images/hito-tiny-desk.jpg", youtube: "9kqnsoY94L8",
      icono: "bolt",
      destacado: true,
      bisagra: true,
      nivel: "mayor",
      datos: [{etiqueta:"Vistas", valor:"16M+"}, {etiqueta:"Plataforma", valor:"NPR Music"}]
    },
    {
      fecha: "2025-03-06", categorias: ["Discografía"], lugar: "",
      titulo: "LA QUE PUEDE, PUEDE / DUMBAI",
      teaser: "", descripcion: "",
      foto: "", youtube: "klMGDp6eeow",
      destacado: true
    },
    {
      fecha: "2025-03-06", categorias: ["Discografía"], lugar: "",
      titulo: "PAPOTA",
      teaser: "", descripcion: "EP y cortometraje audiovisual. Géneros: pop urbano, trap, electro-house, hip-hop satírico.",
      foto: "", youtube: "8Jnrkw2Lzuw",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2025-03-04", categorias: ["Discografía"], lugar: "Uruguay",
      titulo: "PAPOTA",
      teaser: "Dirigido por Martín Piroyansky y se presenta como una comedia negra y sátira absurda de la industria de los artistas prefabricados, el culto a la imagen y las crisis que conlleva el camino a la fama.", descripcion: "Comedia negra y sátira absurda sobre las presiones de la fama masiva tras el Tiny Desk y el éxito de Baño María. Sigue a Cato y Paco en una espiral de obsesión estética y \"síndrome del impostor\", intercalando los 4 tracks inéditos del EP (IMPOSTOR, #TETAS, RE FORRO y EL DÍA DEL AMIGO). Dirigido por Martín Piroyansky.",
      foto: "", youtube: "zYc1qMe_kpc",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2025-11-07", categorias: ["Discografía"], lugar: "Francia",
      titulo: "Beto’s Horns",
      teaser: "Si vas a un concierto aquí es cuando Ca7riel y Paco se tiran al público antes del pogo.", descripcion: "",
      foto: "", youtube: "V0gKh8OA0E0",
      destacado: true
    },
    // ---- ERA Sexta: Big Bang. ( 4 OCT 2024 - 2025) Estallido y expansión global. [falta texto se agrega despues] ----
    {
      fecha: "2026-03-19", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "FREE SPIRITS",
      teaser: "Nuevo álbum: pánico, locura y paz espiritual.",
      descripcion: "Presentan Free Spirits, descrito como un recorrido entre el pánico, la locura y la búsqueda de paz espiritual.",
      foto: "", youtube: "hJrU_B8TYYY",
      destacado: true, nivel: "mayor",
      bisagra: true,
      datos: [{etiqueta:"Tipo", valor:"Álbum de estudio"}]
    },
    {
      fecha: "2026-03-18", categorias: ["Discografía"], lugar: "Los Angeles, Estados Unidos",
      titulo: "FREE SPIRITS",
      teaser: "", descripcion: "Álbum de 12 canciones (~38 minutos). Géneros: rock alternativo, pop experimental, electro-funk, hip-hop satírico.",
      foto: "", youtube: "XA-Cu4YdcpA",
      destacado: true
    },
    {
      fecha: "2026-02-06", categorias: ["Discografía"], lugar: "Los Angeles, Estados Unidos",
      titulo: "FREE SPIRITS",
      teaser: "Cato y Paco ingresan al Free Spirits Wellness Center, una clínica de rehabilitación holística con un tratamiento de 12 pasos, en una sátira de la cultura new age y los retiros wellness de lujo. Escrito y dirigido por Ferina, con Jack Black, Sting y Anderson .Paak.", descripcion: "Cato y Paco ingresan al Free Spirits Wellness Center, una clínica de rehabilitación holística con un tratamiento de 12 pasos, en una sátira de la cultura new age y los retiros wellness de lujo. Escrito y dirigido por Ferina, con Jack Black, Sting y Anderson .Paak.",
      foto: "", youtube: "mHDXyjGcUu0",
      destacado: true, nivel: "mayor"
    },

    // ========== HITOS NUEVOS (PARA_SUBIR.xlsx) ==========
    {
      fecha: "2025-10-01", categorias: ["Conciertos"], lugar: "Basilea, Suiza",
      titulo: "Baloise Session",
      teaser: "Se presentan en el festival suizo Baloise Session.", descripcion: "En octubre de 2025 se presentan en la Baloise Session, un festival de música en Basilea, Suiza.",
      foto: "", youtube: "",
      enlace: "https://www.baloisesession.ch/en/concert/2025-11-05-ca7riel-und-paco-amoroso",
      destacado: true
    },
    {
      fecha: "2025-11-06", categorias: ["Prensa"], lugar: "Berlín, Alemania",
      titulo: "Todo Oro en Ellos, También Oropel: Ca7riel y Paco Amoroso en Berlín.",
      teaser: "Globos en Berlín, el mix latino, y la extraña magia de otro sold out lejos de casa", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/todo-oro-en-ellos-tambi%C3%A9n-oropel-ca7riel-y-paco-amoroso-en-berl%C3%ADn-709480780874",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },
    {
      fecha: "2025-11-05", categorias: ["Discografía"], lugar: "",
      titulo: "GIMME MORE",
      teaser: "El video original se retiró de las plataformas y la canción fue renombrada, un fan lo volvio a subir. Veremos cuanto dura.", descripcion: "Nota: el video original se retiró de las plataformas y la canción fue renombrada — el link puede no funcionar todavía.",
      foto: "", youtube: "twmKBsfLuNA",
      destacado: true
    },
    {
      fecha: "2018-01-01", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "A MI NO",
      teaser: "La favorita del set list.", descripcion: "",
      foto: "", youtube: "BAXSPW4wVM4",
      destacado: true, nivel: "mayor",
      datos: [{etiqueta:"Discográfica", valor:"5020 Records"}]
    },
    {
      fecha: "2019-03-30", categorias: ["Conciertos"], lugar: "Argentina",
      titulo: "CA7RIEL, Paco Amoroso y La ATR Vanda (Lollapalooza 2019)",
      teaser: "", descripcion: "",
      foto: "", youtube: "z4QLVNvUKp8",
      destacado: true
    },
    {
      fecha: "2020-02-01", categorias: ["Conciertos"], lugar: "Argentina",
      titulo: "JALA JALA en vivo (Cosquín Rock 2020)",
      teaser: "", descripcion: "",
      foto: "", youtube: "tCVMkvQW2Yg",
      destacado: true
    },
    {
      fecha: "2020-02-15", categorias: ["Prensa"], lugar: "España",
      titulo: "Cara B se consolida como gran laboratorio de las músicas urbanas",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://elpais.com/ccaa/2020/02/15/catalunya/1581798564_007760.html",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"El País"}]
    },
    {
      fecha: "2020-05-16", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Crimen (cover de Gustavo Cerati)",
      teaser: "", descripcion: "",
      foto: "", youtube: "1nXa31Y1l60",
      destacado: true
    },
    {
      fecha: "2020-09-03", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Los secretos jamás contados de CA7RIEL",
      teaser: "", descripcion: "",
      foto: "", youtube: "mKvq9D0KUCg",
      destacado: true
    },
    {
      fecha: "2020-12-23", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "CA7RIEL: \"La música que hago no tiene género\" | Caja Negra",
      teaser: "", descripcion: "",
      foto: "", youtube: "0KNsY-4NB-Q",
      destacado: true
    },
    {
      fecha: "2021-11-10", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Muy bien",
      teaser: "Una bomba de trap experimental y rock alternativo pesado. Cuenta con una producción sumamente agresiva de Tomy Sainz en la batería y la mezcla del multipremiado Nico Cotton", descripcion: "Del álbum solista El Disko. Video producido por The Movement, producción musical de Tomy Sainz, mezcla de Nico Cotton.",
      foto: "", youtube: "SqWnQFKh45Q",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2021-01-23", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Mil horas (cover, Música Popular Argentina)",
      teaser: "", descripcion: "",
      foto: "", youtube: "an_c4cMgeJ0",
      destacado: true
    },
    {
      fecha: "2022-09-22", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "Para afuera",
      teaser: "Al ritmo altamente bailable del Big house room esta canción es lalanzan al volver de su primera gira por Latinoamerica y Europa.", descripcion: "Producción musical de Evlay, Neekl y Tomy Sainz. Video de Pampa x Kato.",
      foto: "", youtube: "GtEnfS2-2GU",
      destacado: true, nivel: "mayor",
      datos: [{etiqueta:"Discográfica", valor:"5020 Records"}]
    },
    {
      fecha: "2023-01-28", categorias: ["Conciertos"], lugar: "Rosario, Argentina",
      titulo: "Paga Dios World Tour — Rosario",
      teaser: "", descripcion: "",
      foto: "", youtube: "yd3xy4bDmF8",
      destacado: true
    },
    {
      fecha: "2024-05-16", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "CA7RIEL y Paco Amoroso en #ParenLaMano (Vorterix)",
      teaser: "", descripcion: "",
      foto: "", youtube: "5jbmK06UWRo",
      destacado: true
    },
    {
      fecha: "2024-05-31", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Paco Amoroso con Fabián Casas en Picnic Extraterrestre",
      teaser: "", descripcion: "Con la participación especial de Esteban Lamothe.",
      foto: "", youtube: "Pl1U9lO8Afg",
      destacado: true
    },
    {
      fecha: "2025-08-11", categorias: ["Conciertos"], lugar: "San Francisco, Estados Unidos",
      titulo: "Outside Lands Festival 2025 (Full Set)",
      teaser: "", descripcion: "Tercer día del Festival Outside Lands 2025 en San Francisco.",
      foto: "", youtube: "5d-OTDHQfdE",
      destacado: true
    },
    {
      fecha: "2025-10-03", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "CA7RIEL & PACO AMOROSO en OLGA con Migue Granados",
      teaser: "", descripcion: "",
      foto: "", youtube: "tddWEjxNauo",
      destacado: true
    },
    {
      fecha: "2025-11-13", categorias: ["Conciertos"], lugar: "Estados Unidos",
      titulo: "Presentación en los Latin Grammy 2025",
      teaser: "4 canciones en 4 minutos. La escenografía la quemaron en su mítico video retirado de redes Gimme More.", descripcion: "Medley de El Impostor, #TETAS, La Que Puede Puede y El Día del Amigo. (Fecha aproximada — a confirmar.)",
      foto: "", youtube: "2BRAS8vEMzg",
      destacado: true
    },
    {
      fecha: "2026-05-27", categorias: ["Conciertos"], lugar: "Madrid, España",
      titulo: "AutoCine — Madrid",
      teaser: "", descripcion: "",
      foto: "", youtube: "hDrhgjOgQjo",
      destacado: true
    },
    {
      fecha: "2026-06-25", categorias: ["Conciertos"], lugar: "Detroit, Estados Unidos",
      titulo: "Live in Detroit",
      teaser: "", descripcion: "",
      foto: "", youtube: "6OlCUY4QMZc",
      destacado: true
    },
    {
      fecha: "2026-04-29", categorias: ["Colaboración"], lugar: "Suecia",
      titulo: "Blow My Mind (versión de Robyn)",
      teaser: "", descripcion: "",
      foto: "", youtube: "UEM5-0dc-TQ",
      destacado: true
    },
    {
      fecha: "2026-05-04", categorias: ["Discografía"], lugar: "Japon",
      titulo: "BABY GANGSTA / THE FIRST TAKE (con Yu Seki y Kazuki Arai, de King Gnu)",
      teaser: "", descripcion: "",
      foto: "", youtube: "pbK8H3TLOjM",
      destacado: true
    },


    {
      fecha: "2018-01-01", categorias: ["Discografía"], lugar: "",
      titulo: "Piola",
      teaser: "Entraron a la escena con una mirada ácida y crítica.", descripcion: "",
      foto: "", youtube: "lo54JoPlUms",
      destacado: true, nivel: "mayor"
    },
    {
      fecha: "2026-02-13", categorias: ["Discografía"], lugar: "Reino Unido / Argentina",
      titulo: "Hasta Jesús Tuvo un Mal Día (con Sting)",
      teaser: "", descripcion: "",
      foto: "", youtube: "QwKuVaWdVKY",
      destacado: true
    },
    {
      fecha: "2026-03-12", categorias: ["Discografía"], lugar: "Los Angeles, Estados Unidos",
      titulo: "Goo Goo Ga Ga (con Jack Black)",
      teaser: "", descripcion: "",
      foto: "", youtube: "-e-VlkuxMg4",
      destacado: true
    },
    {
      fecha: "2026-03-19", categorias: ["Discografía"], lugar: "Estados Unidos / Argentina",
      titulo: "Ay Ay Ay (con Anderson .Paak)",
      teaser: "", descripcion: "",
      foto: "", youtube: "rTTZMyNe9Ro",
      destacado: true
    },
    {
      fecha: "2026-05-21", categorias: ["Discografía"], lugar: "Alemania / Global",
      titulo: "Vida Loca (A COLORS SHOW)",
      teaser: "", descripcion: "",
      foto: "", youtube: "S8_3kdlLWFA",
      destacado: true
    },
    {
      fecha: "2024-10-22", categorias: ["Discografía"], lugar: "Estados Unidos",
      titulo: "EL DÍA DEL AMIGO (Live on The Tonight Show Starring Jimmy Fallon)",
      teaser: "", descripcion: "",
      foto: "", youtube: "3vAiaASGga8",
      destacado: true
    },
    {
      fecha: "2025-07-28", categorias: ["Prensa"], lugar: "Japón",
      titulo: "Mini Charla y Fan Meet en Tower Records Shibuya (Tokyo)",
      teaser: "", descripcion: "",
      foto: "", youtube: "6qOdUr-EhP8",
      destacado: true
    },
    {
      fecha: "2025-07-25", categorias: ["Discografía"], lugar: "Estados Unidos",
      titulo: "#TETAS (Live From Vevo Studios)",
      teaser: "", descripcion: "",
      foto: "", youtube: "3npXUlQY84E",
      destacado: true
    },
    {
      fecha: "2025-07-31", categorias: ["Discografía"], lugar: "Estados Unidos",
      titulo: "IMPOSTOR (Live From Vevo Studios)",
      teaser: "", descripcion: "",
      foto: "", youtube: "90uEsJ-WL3E",
      destacado: true
    },
    {
      fecha: "2024-09-12", categorias: ["Discografía"], lugar: "Argentina",
      titulo: "BAÑO MARÍA (Película En Vivo - Buenos Aires Completo)",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      destacado: true
    },

    // ========== ARTÍCULOS (Excel 2) — sin conflicto de fecha ==========
    {
      fecha: "2026-05-11", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Ca7riel & Paco Amoroso: Free Spirits zapateando en el castillo de cristal",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://lucesdelsur.substack.com/p/ca7riel-and-paco-amoroso-free-spirits",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Substack (Luces del Sur)"}]
    },
    {
      fecha: "2025-10-21", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "CA7RIEL & PACO AMOROSO: El Año de la Conquista Global",
      teaser: "Vamos a dimensionar en números la bestialidad que se han mandado este dúo, su banda, su equipo, su mánager, su estilista, su fotógrafo.", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/ca7riel-paco-amoroso-el-a%C3%B1o-de-la-conquista-global-62e87e1b0834",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },
    {
      fecha: "2026-02-02", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Ca7riel y Paco Amoroso: ¿Espiritualidad o control de daños?",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/ca7riel-y-paco-amoroso-espiritualidad-o-control-de-da%C3%B1os-8b6089d8774a",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },
    {
      fecha: "2025-11-11", categorias: ["Prensa"], lugar: "Italia",
      titulo: "Milano: Eufóricos y desatados. Ca7riel y Paco Amoroso se coronan en su último concierto pre Latin Grammy",
      teaser: "El caos global de Papota.", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/milano-euf%C3%B3ricos-y-desatados-4d2c71f7eda3",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },
    {
      fecha: "2026-04-05", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "CA7RIEL y Paco Amoroso: Adónde está la libertad",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://desprolijo.substack.com/p/ca7riel-y-paco-amoroso",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Substack (Desprolijo - Sebastián Chaves)"}]
    },
    {
      fecha: "2024-06-15", categorias: ["Prensa"], lugar: "Reino Unido / Global",
      titulo: "Exiliado: The Armour of a Queer Canon (or La Que Puede, Puede)",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://jspzro.medium.com/the-armour-of-a-queer-canon-or-la-que-puede-puede-6e8f4578f332",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Jonathan Pizarro)"}, {etiqueta:"Fecha", valor:"Aproximada (mediados de 2024)"}]
    },
    {
      fecha: "2025-10-16", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "El caos organizado de Ca7riel y Paco Amoroso nos da una noche soñada en casa",
      teaser: "Del Monumental a un show sorpresa en el Arena sin escalas. Agotaron un domingo por la mañana las entradas en una hora", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/el-caos-organizado-de-catriel-y-paco-amoroso-nos-da-una-noche-so%C3%B1ada-en-casa-08ad31c3e4dd",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },
    {
      fecha: "2025-11-19", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Por Qué \"GIMME MORE\" es la Declaración de Muerte (y Renacimiento) de Ca7riel y Paco Amoroso",
      teaser: "Un evento cultural y una performance de autocrítica brutalmente honesta.", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/por-qu%C3%A9-gimme-more-es-la-declaraci%C3%B3n-de-muerte-y-renacimiento-de-ca7riel-y-paco-amoroso-2dc734c50827",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },
    {
      fecha: "2026-02-04", categorias: ["Prensa"], lugar: "EE.UU. / Argentina",
      titulo: "Un máster en trolleo para los astros del caos: Ca7riel y Paco Amoroso",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://medium.com/@lucesdelsur/un-m%C3%A1ster-en-trolleo-para-los-astros-del-caos-ca7riel-y-paco-amoroso-23cd1fafb718",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Medium (Luces del Sur)"}]
    },

    // ========== ENTREVISTAS Y ARTÍCULOS (CSV) ==========
    {
      fecha: "2019-03-19", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Paco Amoroso: \"Quiero ser el punk del futuro\"",
      teaser: "“Siempre tuve la necesidad de ocupar el espacio vacío”, confiesa Ulises Guerriero en un café pálido y vacío de la zona de Tribunales", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.pagina12.com.ar/182106-paco-amoroso-quiero-ser-el-punk-del-futuro/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Página/12 (Suplemento NO)"}]
    },
    {
      fecha: "2019-05-27", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Ca7riel y Paco Amoroso, dos rockeros infiltrados en la escena del trap",
      teaser: "Catriel esta sereno en esta entrevista mientras fuma un porro en alguna vereda de Palermo.", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.lanacion.com.ar/espectaculos/ca7riel-paco-amoroso-dos-rockeros-infiltrados-escena-trap-nid2252040/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"La Nación"}]
    },
    {
      fecha: "2022-09-01", categorias: ["Prensa"], lugar: "Chile",
      titulo: "Hablamos con Ca7riel y Paco Amoroso: “Ni nosotros sabemos cómo definir nuestra música”",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://pousta.com/entrevista-catriel-paco/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Pousta"}]
    },
    {
      fecha: "2022-12-21", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Ca7riel y Paco Amoroso volvieron a juntarse: por qué son el cóctel más explosivo de rap, trap y rock",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.clarin.com/espectaculos/musica/ca7riel-paco-amoroso-volvieron-juntarse-coctel-explosivo-rap-trap-rock_0_hHU3Q28BrA.html",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Clarín"}]
    },
    {
      fecha: "2024-06-01", categorias: ["Prensa"], lugar: "España",
      titulo: "Ca7riel & Paco Amoroso - Y las aventuras del jacuzzi",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://acero.metalmagazine.eu/post/ca7riel-and-paco-amoroso",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Acero Magazine"}]
    },
    {
      fecha: "2024-10-16", categorias: ["Prensa"], lugar: "Chile",
      titulo: "Ca7riel y Paco Amoroso, el dúo argentino que conquistó el Tiny Desk con su propuesta musical",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.latercera.com/culto/2024/10/16/ca7riel-y-paco-amoroso-el-duo-argentino-que-conquisto-el-tiny-desk-con-su-propuesta-musical/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"La Tercera (Culto)"}]
    },
    {
      fecha: "2024-12-06", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Ca7riel & Paco Amoroso: \"Dime con quién te juntas y te diré quién eres\"",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.cronica.com.ar/elcanaldelamusica/noticias/Ca7riel-Paco-Amoroso-Dime-con-quien-te-juntas-y-te-dire-quien-eres-20241206-0021.html",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Crónica (El Canal de la Música)"}]
    },
    {
      fecha: "2020-09-24", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "CA7RIEL: \"Antes de la cuarentena me estaba volviendo loco\"",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.pagina12.com.ar/291451-ca-7-riel-antes-de-la-cuarentena-me-estaba-volviendo-loco/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Página/12 (Ca7riel)"}]
    },
    {
      fecha: "2020-11-20", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Entrevista a Ca7riel: “No confío en la gente”",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.lavoz.com.ar/vos/musica/entrevista-a-ca7riel-no-confio-en-la-gente/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"La Voz del Interior (Ca7riel)"}]
    },
    {
      fecha: "2021-11-29", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Paco Amoroso: \"Este disco solista fue un poco como hacerme adulto\"",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.pagina12.com.ar/386250-paco-amoroso-este-disco-solista-fue-un-poco-como-hacerme-adu/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Página/12 (Paco Amoroso)"}]
    },
    {
      fecha: "2021-12-16", categorias: ["Prensa"], lugar: "Argentina",
      titulo: "Paco Amoroso y \"Saeta\": un tiro al blanco",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://indieclubargentina.com/paco-amoroso-y-saeta-un-tiro-al-blanco/",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Indie Club Argentina (Paco Amoroso)"}]
    },
    {
      fecha: "2022-01-17", categorias: ["Prensa"], lugar: "Uruguay",
      titulo: "Paco Amoroso se pasa del trap al pop electrónico: \"De aquel Paquito quedó poco\"",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.elpais.com.uy/tvshow/musica/paco-amoroso-se-pasa-del-trap-al-pop-electronico-de-aquel-paquito-quedo-poco",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"El País (Paco Amoroso)"}]
    },
    {
      fecha: "2025-11-01", categorias: ["Prensa"], lugar: "Estados Unidos",
      titulo: "CA7RIEL and Paco Amoroso on how their Tiny Desk performance changed their lives",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.youtube.com/watch?v=PHHKyX-rVu4",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Latin GRAMMYs"}]
    },
    {
      fecha: "2026-02-01", categorias: ["Prensa"], lugar: "Estados Unidos",
      titulo: "CA7RIEL & PACO AMOROSO Interview | 2026 GRAMMYs",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.youtube.com/watch?v=VApw_ECeSoU",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Recording Academy / GRAMMYs"}]
    },
    {
      fecha: "2026-02-01", categorias: ["Prensa"], lugar: "Estados Unidos",
      titulo: "CA7RIEL y Paco Amoroso en la Alfombra Roja de los Premios GRAMMY® 2026",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.youtube.com/watch?v=AaHRK8PYjZE",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"Premios GRAMMY® (Alfombra Roja)"}]
    },
    {
      fecha: "2026-04-16", categorias: ["Prensa"], lugar: "España",
      titulo: "CA7RIEL y Paco Amoroso están en su absoluto peak | #LaRevuelta",
      teaser: "", descripcion: "",
      foto: "", youtube: "",
      enlace: "https://www.youtube.com/watch?v=DCuKE2wC-Sw",
      destacado: true,
      datos: [{etiqueta:"Medio", valor:"La Revuelta (RTVE)"}]
    },
  ];
