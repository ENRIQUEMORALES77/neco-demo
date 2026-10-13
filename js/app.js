/* Página de destino: lo que ve el cliente al acercar el móvil o escanear el QR.
   Orden fijo e igual para todos: el botón de Google siempre va primero y
   nunca se condiciona a una valoración previa (sin "review gating"). */
(function () {
  var C = window.CONFIG, N = window.NECO;
  var app = document.getElementById("app");

  /* ---------- estado ---------- */
  var params = new URLSearchParams(location.search);
  var idParam = (params.get("local") || "").toLowerCase();
  var mesaParam = (params.get("mesa") || "").replace(/[^0-9a-zA-Z-]/g, "").slice(0, 6);
  var viaParam = (params.get("src") || "").toLowerCase();

  var estado = {
    lang: leerIdioma(),
    localId: C.locales[idParam] ? idParam : null,
    mesa: mesaParam,
    via: viaParam === "nfc" || viaParam === "qr" ? viaParam : "",
    abierto: null,
    queja: { texto: "", contacto: "", categoria: "", enviada: false, ficha: null },
    grupo: null,
  };

  function leerIdioma() {
    var p = (params.get("lang") || "").toLowerCase();
    if (p === "es" || p === "en") return p;
    try { var g = localStorage.getItem("neco-lang"); if (g === "es" || g === "en") return g; } catch (e) {}
    return "es";
  }

  function T(k) { return window.I18N[estado.lang][k]; }
  function L(v) { return N.loc(v, estado.lang); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Contador (fase 2). Sin endpoint configurado no envía nada. */
  function track(evento, datos) {
    var ep = C.contador && C.contador.endpoint;
    var carga = Object.assign({ evento: evento, local: estado.localId, mesa: estado.mesa || "", via: estado.via || "enlace", idioma: estado.lang, t: Date.now() }, datos || {});
    if (!ep || !estado.localId) { if (window.console) console.debug("[demo] evento", carga); return; }
    try { navigator.sendBeacon(ep, JSON.stringify(carga)); } catch (e) {}
  }

  /* ---------- iconos ---------- */
  var I = {
    estrella: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
    google: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.5a8 8 0 0 1-11.7 7.1L4 20l1.3-4.4a8 8 0 1 1 15.2-4.1z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>',
    cubiertos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v5a2 2 0 0 0 4 0V3M7 3v18M17 21V3c-2.2 1.2-3.5 3.8-3.5 7v3H17"/></svg>',
    escudo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M12 8v5M12 16.2v.1"/></svg>',
    tarta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21h16M5 21v-6.5A2.5 2.5 0 0 1 7.5 12h9a2.5 2.5 0 0 1 2.5 2.5V21"/><path d="M5 16.5c1.2.9 2.6.9 3.8 0s2.6-.9 3.7 0 2.6.9 3.7 0 2.6-.9 2.8 0M12 12V9M12 6.6c.9-.8.9-1.8 0-2.8-.9 1-.9 2 0 2.8z"/></svg>',
    reloj: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    euro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 7.2A6.5 6.5 0 1 0 17.5 16.8"/><path d="M5 10.5h8.5M5 13.5h8.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.2a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.5"/></svg>',
    chevron: '<span class="chevron"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></span>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" style="fill:currentColor;stroke:none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>',
  };

  /* ---------- utilidades de fecha ---------- */
  function fechaLarga(iso, lang) {
    return new Intl.DateTimeFormat((lang || estado.lang) === "en" ? "en-GB" : "es-ES", { weekday: "long", day: "numeric", month: "long" }).format(N.fechaDeIso(iso));
  }
  function ahoraTexto(lang) {
    return new Intl.DateTimeFormat((lang || estado.lang) === "en" ? "en-GB" : "es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date());
  }
  var sumarDias = N.sumarDias;

  /* Próximo sábado en que abre el local (o el siguiente día abierto) */
  function fechaPorDefecto(localId, servicio) {
    var local = C.locales[localId], hoy = N.ahoraMadrid().iso, primera = null;
    for (var i = 1; i <= 21; i++) {
      var iso = sumarDias(hoy, i);
      if (!N.abreServicio(local, iso, servicio)) continue;
      if (!primera) primera = iso;
      if (N.fechaDeIso(iso).getDay() === 6) return iso;
    }
    return primera || sumarDias(hoy, 1);
  }

  function tieneCena(local) { return local.horario.some(function (f) { return f.servicio === "cena"; }); }

  function textoEstado(local) {
    var e = N.estadoAhora(local);
    if (e.abierto) return { abierto: true, txt: N.fmt(T("abiertoHasta"), { h: e.hasta }) };
    if (e.abre == null) return { abierto: false, txt: T("cerrado") };
    var dia = e.dias === 0 ? T("hoy") : e.dias === 1 ? T("manana") : T("dias")[e.dow].toLowerCase();
    if (estado.lang === "en" && e.dias > 1) dia = "on " + T("dias")[e.dow];
    return { abierto: false, txt: N.fmt(T("cerradoAbre"), { dia: dia, h: e.abre }) };
  }

  function origenTexto(lang) {
    var t = window.I18N[lang || estado.lang];
    var via = estado.via === "nfc" ? t.viaNfc : estado.via === "qr" ? t.viaQr : t.viaEnlace;
    return estado.mesa ? N.fmt(t.origenMesa, { via: via, mesa: estado.mesa }) : N.fmt(t.origenEntrada, { via: via });
  }

  /* ---------- WhatsApp: los mensajes al restaurante van siempre en español ---------- */
  function numeroWa(localId) {
    var l = C.locales[localId] || {};
    return String(l.whatsapp || (C.contacto && C.contacto.whatsapp) || "").replace(/\D/g, "");
  }
  function urlWa(localId, texto) { return "https://wa.me/" + numeroWa(localId) + "?text=" + encodeURIComponent(texto); }
  function abrirWa(url) {
    var w = window.open(url, "_blank");
    if (!w) location.href = url;
  }
  function burbuja(texto) {
    var html = esc(texto).replace(/\*([^*\n]+)\*/g, "<b>$1</b>");
    var hora = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date());
    return '<div class="ficha"><div class="ficha-cab">' + T("waFicha") + '</div><div class="burbuja-cont"><div class="burbuja">' + html + '<time>' + hora + '</time></div></div></div>';
  }
  function notaIdioma() { return estado.lang === "es" ? "" : "\nIdioma del cliente: inglés"; }

  function textoWaQueja() {
    var q = estado.queja, l = C.locales[estado.localId];
    return "*Neco · Mensaje privado*\n" +
      "Local: " + l.nombre + "\n" +
      "Origen: " + origenTexto("es") + "\n" +
      "Fecha: " + ahoraTexto("es") + "\n" +
      (q.categoria ? "Tema: " + window.I18N.es.cats[q.categoria] + "\n" : "") + "\n" +
      q.texto.trim() + "\n\n" +
      "Contacto: " + (q.contacto.trim() || "este WhatsApp") + notaIdioma();
  }

  function textoWaGrupo() {
    var g = estado.grupo, l = C.locales[g.local], p = g.ultimo, es = window.I18N.es;
    var detalle = g.adultos + (g.adultos === 1 ? " adulto" : " adultos");
    if (g.n105) detalle += ", " + g.n105 + (g.n105 === 1 ? " niño" : " niños") + " hasta 105 cm";
    if (g.n140) detalle += ", " + g.n140 + (g.n140 === 1 ? " niño" : " niños") + " de 105 a 140 cm";
    var tarifa = { laborable: es.gTarifaLaborable, finde: es.gTarifaFinde, festivo: es.gTarifaFestivo }[p.tipoDia].toLowerCase();
    return "*Neco · Solicitud de grupo*\n" +
      "Local: " + l.nombre + "\n" +
      "Tipo: " + es.eventos[g.tipo] + "\n" +
      "Fecha: " + fechaLarga(g.fecha, "es") + " · " + es[g.servicio] + "\n" +
      "Personas: " + p.personas + " (" + detalle + ")\n" +
      "Presupuesto orientativo: *" + N.eur(p.total, "es") + "* (" + tarifa + ", bebida no incluida)\n" +
      "Nombre: " + g.nombre.trim() + "\n" +
      "Contacto: " + g.contacto.trim() + "\n" +
      (g.comentarios.trim() ? "Comentarios: " + g.comentarios.trim() + "\n" : "") +
      "Origen: " + origenTexto("es") + " (" + C.locales[estado.localId].corto + ")" + notaIdioma();
  }

  /* =========================================================
     SELECTOR DE LOCAL (sin ?local=)
     ========================================================= */
  function htmlSelector() {
    var tarjetas = Object.keys(C.locales).map(function (id) {
      var l = C.locales[id], e = textoEstado(l);
      return '<a class="tarjeta" href="?local=' + id + '">' +
        '<img src="' + l.imagen + '" alt="" loading="lazy" width="112" height="104">' +
        '<div><strong>' + esc(l.nombre) + '</strong><span>' + esc(L(l.zona)) + '</span>' +
        '<em class="' + (e.abierto ? "" : "cerrado") + '">' + esc(e.txt) + '</em></div></a>';
    }).join("");
    return '<section class="selector">' +
      '<div class="platos-deco" aria-hidden="true">' +
      ["plato-paella", "plato-ensalada", "plato-fideua", "plato-postres"].map(function (p) { return '<img src="img/' + p + '.webp" alt="">'; }).join("") +
      '</div>' +
      '<h1>' + T("elige") + '</h1><p>' + T("eligeSub") + '</p>' +
      '<div class="tarjetas">' + tarjetas + '</div></section>';
  }

  /* =========================================================
     PÁGINA DEL LOCAL
     ========================================================= */
  function htmlLocal() {
    var l = C.locales[estado.localId], e = textoEstado(l);
    var chips = '<span class="chip ' + (e.abierto ? "" : "cerrado") + '"><span class="punto"></span>' + esc(e.txt) + '</span>';
    if (estado.mesa) chips = '<span class="chip">' + T("mesa") + " " + esc(estado.mesa) + '</span>' + chips;
    if (l.destacado) chips += '<span class="chip">' + esc(L(l.destacado)) + '</span>';

    var html = '' +
      '<section class="hero" style="background-image:url(\'' + l.imagen + '\')">' +
        '<div class="hero-texto"><p class="hero-pre">' + T("bienvenida") + '</p>' +
        '<h1>' + esc(l.nombre) + '</h1><div class="chips">' + chips + '</div></div>' +
      '</section>' +

      '<section class="resena" aria-labelledby="t-resena">' +
        '<div class="estrellas" aria-hidden="true">' + I.estrella + I.estrella + I.estrella + I.estrella + I.estrella + '</div>' +
        '<h2 id="t-resena">' + T("resenaTitulo") + '</h2>' +
        '<p>' + T("resenaTexto") + '</p>' +
        '<a class="boton-google" id="btn-google" href="' + esc(N.urlResena(l)) + '" target="_blank" rel="noopener">' +
          '<span class="g">' + I.google + '</span><span>' + T("resenaBoton") + ' ⭐</span></a>' +
        '<p class="aviso-enlace">' + N.fmt(T("resenaAviso"), { local: esc(l.nombre) }) + '</p>' +
      '</section>' +

      htmlVisita(l) +

      '<nav class="accesos" aria-label="Más opciones">' +
        acceso("queja", I.chat, T("queja"), T("quejaSub"), htmlQueja(), "terracota") +
        '<div class="acceso"><a class="fila" id="btn-platos" href="' + C.enlaces.platos + '" target="_blank" rel="noopener">' +
          '<span class="icono">' + I.cubiertos + '</span>' +
          '<span class="fila-texto"><strong>' + T("platos") + '</strong><span>' + T("platosSub") + '</span></span>' +
          '<span class="miniplatos" aria-hidden="true"><img src="img/plato-paella.webp" alt=""><img src="img/plato-ensalada.webp" alt=""><img src="img/plato-postres.webp" alt=""></span>' +
        '</a></div>' +
        acceso("alergenos", I.escudo, T("alergenos"), T("alergenosSub"),
          '<p>' + T("alergenosTexto") + '</p>' +
          '<a class="boton secundario" id="btn-alergenos" href="alergenos.html?local=' + estado.localId + '&lang=' + estado.lang + '">' + I.escudo.replace('<svg', '<svg style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8"') + T("alergenosVer") + '</a>') +
        acceso("precios", I.euro, T("precios"), T("preciosSub"), htmlPrecios(l)) +
        acceso("grupos", I.tarta, T("grupos"), T("gruposSub"), '<div id="grupo-cont"></div>', "terracota") +
        acceso("horario", I.reloj, T("horario"), esc(l.direccion), htmlHorario(l)) +
      '</nav>' +

      '<section class="redes"><h2>' + T("siguenos") + '</h2><div class="redes-lista">' +
        '<a href="' + C.enlaces.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + I.instagram + '</a>' +
        '<a href="' + C.enlaces.tiktok + '" target="_blank" rel="noopener" aria-label="TikTok">' + I.tiktok + '</a>' +
        '<a href="' + C.enlaces.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + I.facebook + '</a>' +
      '</div></section>';
    return html;
  }

  function acceso(id, icono, titulo, sub, interior, tono) {
    return '<details class="acceso" id="d-' + id + '"' + (estado.abierto === id ? " open" : "") + '>' +
      '<summary><span class="icono ' + (tono || "") + '">' + icono + '</span>' +
      '<span class="fila-texto"><strong>' + titulo + '</strong><span>' + sub + '</span></span>' + I.chevron + '</summary>' +
      '<div class="panel-interior">' + interior + '</div></details>';
  }

  /* ---------- tu visita: precio de hoy, horario, aparcamiento y transporte ---------- */
  function tarifasLocal(l) { return Object.assign({}, C.tarifas, l.tarifas || {}); }

  /* Hoy o, si hoy no abre, el próximo día que abre */
  function proximoDiaAbierto(l) {
    var hoy = N.ahoraMadrid().iso;
    for (var i = 0; i < 15; i++) {
      var iso = N.sumarDias(hoy, i);
      if (N.franjasFecha(l, iso).length) return { iso: iso, hoy: i === 0 };
    }
    return { iso: hoy, hoy: true };
  }

  function htmlVisita(l) {
    var t = tarifasLocal(l), d = proximoDiaAbierto(l), td = N.tipoDia(d.iso);
    var precio = td === "laborable" ? t.adultoLaborable : t.adultoFinde;
    var etqPrecio = d.hoy ? T("precioHoy") : N.fmt(T("precioDia"), { dia: T("dias")[N.fechaDeIso(d.iso).getDay()].toLowerCase() });
    var franjas = N.franjasFecha(l, N.ahoraMadrid().iso).map(function (f) { return f.de + "–" + f.a; });
    var ll = l.llegar || {};
    var transporte = ll.metro ? "🚇 " + L(ll.metro) : ll.bus ? "🚌 " + L(ll.bus) : ll.tren ? "🚆 " + L(ll.tren) : T("comoLlegar");
    var tiles = [
      { abre: "precios", ico: "💶", et: etqPrecio, val: N.eur(precio, estado.lang), sub: T("porAdulto") + " · " + T("tarifa_" + td) },
      { abre: "horario", ico: "🕐", et: T("horarioHoy"), val: franjas.length ? franjas[franjas.length - 1].split("–")[1] : "—", sub: franjas.length ? franjas.join(" · ") : T("cerradoHoy"), valPre: franjas.length ? T("hasta") + " " : "" },
    ];
    if (ll.parking) tiles.push({ abre: "horario", ico: "🅿️", et: T("aparcamiento"), val: L(ll.parking.corto), sub: "" , txt: true });
    tiles.push({ abre: "horario", ico: "📍", et: T("comoLlegar"), val: transporte, sub: "", txt: true });
    return '<section class="visita" aria-label="' + N.fmt(T("tuVisita"), { local: esc(l.nombre) }) + '">' +
      tiles.map(function (x) {
        return '<button type="button" class="v-tile' + (x.txt ? " v-txt" : "") + '" data-abrir="' + x.abre + '">' +
          '<span class="v-et"><span aria-hidden="true">' + x.ico + '</span> ' + esc(x.et) + '</span>' +
          '<span class="v-val">' + (x.valPre ? '<small>' + esc(x.valPre) + '</small>' : '') + esc(x.val) + '</span>' +
          (x.sub ? '<span class="v-sub">' + esc(x.sub) + '</span>' : '') + '</button>';
      }).join("") + '</section>';
  }

  function htmlPrecios(l) {
    var t = tarifasLocal(l), hoy = N.tipoDia(proximoDiaAbierto(l).iso);
    var abreFinde = l.horario.some(function (f) { return f.dias.indexOf(0) !== -1 || f.dias.indexOf(6) !== -1; });
    var filas = [[T("pAdultoLab"), t.adultoLaborable, hoy === "laborable"]];
    if (abreFinde) filas.push([T("pAdultoFinde"), t.adultoFinde, hoy !== "laborable"]);
    filas.push([T("pN105"), t.nino105, false], [T("pN140"), t.nino140, false]);
    return '<table class="horario precios">' + filas.map(function (f) {
      return '<tr class="' + (f[2] ? "hoy" : "") + '"><td>' + esc(f[0]) + (f[2] ? ' <span class="tag-hoy">' + T("hoy") + '</span>' : '') + '</td><td><b>' + N.eur(f[1], estado.lang) + '</b></td></tr>';
    }).join("") + '</table>' +
      '<div class="nota-suave">' + T("pNota") + '</div>' +
      (l.notaPrecios ? '<div class="nota-suave" style="margin-top:8px">' + esc(L(l.notaPrecios)) + '</div>' : '');
  }

  /* ---------- horario, cómo llegar y servicios ---------- */
  function htmlHorario(l) {
    var hoy = N.ahoraMadrid().dow, orden = [1, 2, 3, 4, 5, 6, 0];
    var filas = orden.map(function (d) {
      var fr = N.franjasDia(l, d).map(function (f) { return f.de + "–" + f.a; });
      return '<tr class="' + (d === hoy ? "hoy" : "") + '"><td>' + T("dias")[d] + '</td><td>' + (fr.length ? fr.join(" · ") : '<span style="color:var(--tinta-3)">—</span>') + '</td></tr>';
    }).join("");
    return '<table class="horario">' + filas + '</table>' +
      (l.notaHorario ? '<div class="nota-suave">' + esc(L(l.notaHorario)) + '</div>' : '') +
      '<div class="direccion"><span class="icono">' + I.pin + '</span><span>' + esc(l.direccion) + '</span></div>' +
      '<a class="boton secundario" href="' + l.maps + '" target="_blank" rel="noopener">' + T("comoLlegar") + '</a>' +
      htmlLlegar(l) +
      '<h3 class="sub-h">' + T("servicios") + '</h3><ul class="info-filas">' +
        (C.servicios || []).map(function (x) { return '<li><span aria-hidden="true">' + x.ico + '</span><span>' + esc(L(x)) + '</span></li>'; }).join("") +
      '</ul>';
  }

  function htmlLlegar(l) {
    var ll = l.llegar || {}, filas = [];
    if (ll.metro) filas.push(["🚇", T("metro"), L(ll.metro)]);
    if (ll.bus) filas.push(["🚌", T("bus"), L(ll.bus)]);
    if (ll.tren) filas.push(["🚆", T("tren"), L(ll.tren)]);
    if (ll.parking) filas.push(["🅿️", T("aparcamiento"), L(ll.parking.texto)]);
    filas.push(["♿", T("accesibilidad"), l.accesibilidad ? L(l.accesibilidad) : N.fmt(T("accesoSinDato"), { tel: C.contacto.telefono })]);
    if (ll.cerca) filas.push(["📍", T("cerca"), L(ll.cerca)]);
    return '<ul class="info-filas">' + filas.map(function (f) {
      return '<li><span aria-hidden="true">' + f[0] + '</span><span><b>' + esc(f[1]) + '</b> ' + esc(f[2]) + '</span></li>';
    }).join("") + '</ul>';
  }

  /* ---------- queja privada ---------- */
  function htmlQueja() {
    var q = estado.queja, l = C.locales[estado.localId];
    var wa = !!numeroWa(estado.localId);
    if (q.enviada && q.url) {
      return '<div class="ok"><div class="check">' + I.check + '</div><h3>' + T("waCasi") + '</h3>' +
        '<p>' + N.fmt(T("waQuejaTexto"), { local: esc(l.nombre) }) + '</p>' +
        '<a class="boton wa reabrir" href="' + esc(q.url) + '" target="_blank" rel="noopener">' + I.whatsapp + T("waReabrir") + '</a></div>' +
        burbuja(q.mensajeWa);
    }
    if (q.enviada) {
      return '<div class="ok"><div class="check">' + I.check + '</div><h3>' + T("quejaGracias") + '</h3>' +
        '<p>' + N.fmt(T("quejaGraciasTexto"), { local: esc(l.nombre) }) +
        (q.contacto ? " " + N.fmt(T("quejaGraciasContacto"), { contacto: esc(q.contacto) }) : "") + '</p></div>' +
        htmlFicha(T("fichaQueja"), T("gerente") + " · " + l.nombre, [
          [T("fichaOrigen"), origenTexto()],
          [T("fichaRecibido"), q.ficha],
          [T("fichaTema"), q.categoria ? T("cats")[q.categoria] : "—"],
          [T("fichaContacto"), q.contacto || T("fichaSinContacto")],
        ], q.texto);
    }
    return '<form id="f-queja" novalidate>' +
      '<p style="margin:0 0 12px;color:var(--tinta-2);font-size:15px">' + T(wa ? "quejaIntroWa" : "quejaIntro") + '</p>' +
      '<label class="campo"><span>' + T("quejaTexto") + '</span>' +
        '<textarea name="texto" required maxlength="1500" placeholder="' + T("quejaPlaceholder") + '">' + esc(q.texto) + '</textarea></label>' +
      '<div class="campo"><span>' + T("quejaTema") + '</span><div class="cats" role="group">' +
        Object.keys(T("cats")).map(function (k) {
          return '<button type="button" data-cat="' + k + '" aria-pressed="' + (q.categoria === k) + '">' + T("cats")[k] + '</button>';
        }).join("") + '</div></div>' +
      '<label class="campo"><span>' + T("quejaContacto") + '</span>' +
        '<input name="contacto" autocomplete="email" maxlength="120" value="' + esc(q.contacto) + '"></label>' +
      '<button class="boton' + (wa ? " wa" : "") + '" type="submit"' + (q.texto.trim() ? "" : " disabled") + '>' + (wa ? I.whatsapp + T("quejaEnviarWa") : T("quejaEnviar")) + '</button>' +
      '<p class="pista">' + (wa ? T("waAviso") + " " : "") + T("privacidad") + '</p>' +
      '</form>';
  }

  function htmlFicha(titulo, para, filas, mensaje) {
    var dl = [[T("fichaPara"), para]].concat(filas).map(function (f) {
      return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>';
    }).join("");
    return '<div class="ficha"><div class="ficha-cab">' + T("fichaDemo") + '</div><div class="ficha-cuerpo">' +
      '<div class="ficha-titulo">' + esc(titulo) + ' <span class="etq">DEMO</span></div>' +
      '<dl>' + dl + '</dl>' + (mensaje ? '<div class="mensaje">' + esc(mensaje) + '</div>' : '') + '</div></div>';
  }

  /* ---------- grupos y celebraciones ---------- */
  function nuevoGrupo() {
    return {
      local: estado.localId, servicio: "comida", fecha: fechaPorDefecto(estado.localId, "comida"), fechaTocada: false,
      adultos: 10, n105: 0, n140: 0, tipo: "cumpleanos", nombre: "", contacto: "", comentarios: "",
      enviada: false, intento: false, ficha: null,
    };
  }

  function renderGrupo() {
    var cont = document.getElementById("grupo-cont");
    if (!cont) return;
    var g = estado.grupo;
    if (g.enviada) { cont.innerHTML = htmlGrupoEnviado(); return; }

    var opcLocal = Object.keys(C.locales).map(function (id) {
      return '<option value="' + id + '"' + (id === g.local ? " selected" : "") + '>' + esc(C.locales[id].nombre) + '</option>';
    }).join("");
    var opcTipo = C.eventos.tipos.map(function (t) {
      return '<option value="' + t + '"' + (t === g.tipo ? " selected" : "") + '>' + T("eventos")[t] + '</option>';
    }).join("");
    var hayCena = tieneCena(C.locales[g.local]);

    cont.innerHTML = '<form id="f-grupo" novalidate>' +
      '<label class="campo"><span>' + T("gLocal") + '</span><select name="local">' + opcLocal + '</select></label>' +
      '<label class="campo"><span>' + T("gTipo") + '</span><select name="tipo">' + opcTipo + '</select></label>' +
      '<div id="g-sugerencia"></div>' +
      '<div class="dos">' +
        '<label class="campo"><span>' + T("gFecha") + '</span><input type="date" name="fecha" value="' + g.fecha + '" min="' + N.ahoraMadrid().iso + '"></label>' +
        '<div class="campo"><span>' + T("gServicio") + '</span><div class="segmentado" role="group">' +
          '<button type="button" data-servicio="comida" aria-pressed="' + (g.servicio === "comida") + '">' + T("comida") + '</button>' +
          (hayCena ? '<button type="button" data-servicio="cena" aria-pressed="' + (g.servicio === "cena") + '">' + T("cena") + '</button>' : '') +
        '</div></div>' +
      '</div>' +
      '<div class="contadores">' +
        contador("adultos", T("gAdultos"), "", g.adultos) +
        contador("n105", T("gNinos105"), N.eur(tarifas(g.local).nino105, estado.lang), g.n105) +
        contador("n140", T("gNinos140"), N.eur(tarifas(g.local).nino140, estado.lang), g.n140) +
      '</div>' +
      '<div id="g-resultado"></div>' +
      '<div class="dos">' +
        '<label class="campo"><span>' + T("gNombre") + '</span><input name="nombre" autocomplete="name" maxlength="80" value="' + esc(g.nombre) + '"></label>' +
        '<label class="campo"><span>' + T("gTelefono") + '</span><input name="contacto" autocomplete="tel" maxlength="120" value="' + esc(g.contacto) + '"></label>' +
      '</div>' +
      '<label class="campo"><span>' + T("gComentarios") + '</span><textarea name="comentarios" maxlength="800" style="min-height:72px" placeholder="' + T("gComentariosPh") + '">' + esc(g.comentarios) + '</textarea></label>' +
      '<div id="g-faltan"></div>' +
      (numeroWa(g.local)
        ? '<button class="boton wa" type="submit" id="g-enviar">' + I.whatsapp + T("gEnviarWa") + '</button><p class="pista">' + T("waAviso") + '</p>'
        : '<button class="boton terracota" type="submit" id="g-enviar">' + T("gEnviar") + '</button>') +
      '</form>';
    actualizarGrupo();
  }

  function tarifas(localId) { return Object.assign({}, C.tarifas, C.locales[localId].tarifas || {}); }

  function contador(campo, titulo, sub, valor) {
    var min = campo === "adultos" ? 1 : 0;
    return '<div class="contador"><span>' + titulo + (sub ? '<small>' + sub + '</small>' : '') + '</span>' +
      '<div class="paso"><button type="button" data-paso="' + campo + '" data-d="-1" aria-label="−"' + (valor <= min ? " disabled" : "") + '>−</button>' +
      '<output id="o-' + campo + '">' + valor + '</output>' +
      '<button type="button" data-paso="' + campo + '" data-d="1" aria-label="+">+</button></div></div>';
  }

  function actualizarGrupo() {
    var g = estado.grupo, l = C.locales[g.local];
    var res = document.getElementById("g-resultado"), sug = document.getElementById("g-sugerencia");
    var enviar = document.getElementById("g-enviar"), faltan = document.getElementById("g-faltan");
    if (!res) return;

    // Sugerencia de local con espacio exclusivo para celebraciones
    var celebracion = C.eventos.tiposCelebracion.indexOf(g.tipo) !== -1;
    var idEspacio = Object.keys(C.locales).filter(function (id) { return C.locales[id].espacioCelebraciones; })[0];
    sug.innerHTML = celebracion && idEspacio && idEspacio !== g.local
      ? '<div class="alerta info">' + N.fmt(T("gSugerencia"), { local: "<strong>" + esc(C.locales[idEspacio].nombre) + "</strong>" }) +
        '<br><button type="button" data-usar="' + idEspacio + '">' + T("gUsar") + '</button></div>'
      : "";

    var ok = false;
    if (!g.fecha) {
      res.innerHTML = '<div class="alerta info">' + T("gElige") + '</div>';
    } else if (g.fecha < N.ahoraMadrid().iso) {
      res.innerHTML = '<div class="alerta">' + T("gPasado") + '</div>';
    } else {
      var p = N.presupuesto(g.local, g.fecha, g.servicio, g.adultos, g.n105, g.n140);
      if (!p.abierto) {
        res.innerHTML = '<div class="alerta">' + N.fmt(T("gCerrado"), { local: esc(l.nombre), servicio: T(g.servicio + "Pl") }) + '</div>';
      } else {
        ok = true;
        var etiquetaTarifa = { laborable: T("gTarifaLaborable"), finde: T("gTarifaFinde"), festivo: T("gTarifaFestivo") }[p.tipoDia];
        var nombres = { adultos: T("gAdultos"), nino105: T("gNinos105"), nino140: T("gNinos140") };
        res.innerHTML = '<div class="presupuesto" aria-live="polite"><h3>' + T("gPresupuesto") + '</h3>' +
          '<p class="tarifa">' + etiquetaTarifa + ' · ' + fechaLarga(g.fecha) + ' · ' + T(g.servicio) + '</p>' +
          p.lineas.map(function (li) {
            return '<div class="linea"><span>' + li.n + ' × ' + nombres[li.clave] + ' (' + N.eur(li.precio, estado.lang) + ')</span><span>' + N.eur(li.subtotal, estado.lang) + '</span></div>';
          }).join("") +
          '<div class="total"><span>' + T("gTotal") + ' · ' + p.personas + ' ' + (p.personas === 1 ? T("persona") : T("personas")) + '</span><strong>' + N.eur(p.total, estado.lang) + '</strong></div>' +
          '<small>' + T("gNota") + '</small></div>';
        g.ultimo = p;
      }
    }
    enviar.disabled = !ok;
    faltan.innerHTML = g.intento && ok && !(g.nombre.trim() && g.contacto.trim()) ? '<div class="alerta">' + T("gFaltan") + '</div>' : "";
  }

  function htmlGrupoEnviado() {
    var g = estado.grupo, l = C.locales[g.local], p = g.ultimo;
    if (g.url) {
      return '<div class="ok"><div class="check">' + I.check + '</div><h3>' + T("waCasi") + '</h3>' +
        '<p>' + N.fmt(T("waGrupoTexto"), { local: esc(l.nombre) }) + '</p>' +
        '<a class="boton wa reabrir" href="' + esc(g.url) + '" target="_blank" rel="noopener">' + I.whatsapp + T("waReabrir") + '</a></div>' +
        burbuja(g.mensajeWa);
    }
    var detalle = g.adultos + " " + T("gAdultos").toLowerCase();
    if (g.n105) detalle += " · " + g.n105 + " " + T("gNinos105").toLowerCase();
    if (g.n140) detalle += " · " + g.n140 + " " + T("gNinos140").toLowerCase();
    var filas = [
      [T("fichaOrigen"), origenTexto() + " (" + C.locales[estado.localId].corto + ")"],
      [T("fichaRecibido"), g.ficha],
      [T("fichaTipo"), T("eventos")[g.tipo]],
      [T("fichaFecha"), fechaLarga(g.fecha) + " · " + T(g.servicio)],
      [T("fichaPersonas"), p.personas + " (" + detalle + ")"],
      [T("fichaImporte"), N.eur(p.total, estado.lang)],
      [T("fichaContacto"), g.nombre + " · " + g.contacto],
    ];
    return '<div class="ok"><div class="check">' + I.check + '</div><h3>' + T("gEnviada") + '</h3>' +
      '<p>' + N.fmt(T("gEnviadaTexto"), { local: esc(l.nombre) }) + '</p></div>' +
      htmlFicha(T("fichaGrupo"), C.eventos.destinatario + " · " + l.nombre, filas, g.comentarios);
  }

  /* =========================================================
     RENDER + EVENTOS
     ========================================================= */
  function render() {
    var t = window.I18N[estado.lang];
    document.documentElement.lang = t.htmlLang;
    document.querySelectorAll(".idioma button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === estado.lang));
    });
    var pieLink = document.getElementById("cambiar-local");
    pieLink.textContent = t.cambiarLocal;
    pieLink.hidden = !estado.localId;
    document.getElementById("pie-texto").textContent = C.marca.pie;

    if (!estado.localId) {
      document.title = C.marca.nombre + " · " + t.elige;
      app.innerHTML = htmlSelector();
      return;
    }
    var l = C.locales[estado.localId];
    document.title = l.nombre + " · " + t.resenaTitulo;
    if (!estado.grupo) estado.grupo = nuevoGrupo();
    app.innerHTML = htmlLocal();
    renderGrupo();
  }

  document.querySelector(".idioma").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lang]");
    if (!b || b.getAttribute("data-lang") === estado.lang) return;
    estado.lang = b.getAttribute("data-lang");
    try { localStorage.setItem("neco-lang", estado.lang); } catch (err) {}
    render();
  });

  // Acordeón: solo un apartado abierto a la vez
  app.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d.matches || !d.matches("details.acceso")) return;
    if (d.open) {
      estado.abierto = d.id.slice(2);
      app.querySelectorAll("details.acceso[open]").forEach(function (o) { if (o !== d) o.open = false; });
      track("abrir_" + estado.abierto);
      setTimeout(function () {
        var r = d.getBoundingClientRect();
        if (r.top < 60 || r.top > innerHeight * .6) window.scrollTo({ top: scrollY + r.top - 70, behavior: "smooth" });
      }, 30);
    } else if (estado.abierto === d.id.slice(2)) {
      estado.abierto = null;
    }
  }, true);

  app.addEventListener("click", function (e) {
    if (e.target.closest("#btn-google")) track("clic_google");
    if (e.target.closest("#btn-platos")) track("clic_platos");
    if (e.target.closest("#btn-alergenos")) track("ver_alergenos");

    var ab = e.target.closest("[data-abrir]");
    if (ab) {
      var det = document.getElementById("d-" + ab.getAttribute("data-abrir"));
      if (det) { det.open = true; det.scrollIntoView({ behavior: "smooth", block: "start" }); }
      track("ver_" + ab.getAttribute("data-abrir"));
      return;
    }

    var cat = e.target.closest("[data-cat]");
    if (cat) {
      var k = cat.getAttribute("data-cat");
      estado.queja.categoria = estado.queja.categoria === k ? "" : k;
      cat.parentNode.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === estado.queja.categoria)); });
      return;
    }

    var g = estado.grupo;
    var paso = e.target.closest("[data-paso]");
    if (paso) {
      var campo = paso.getAttribute("data-paso"), min = campo === "adultos" ? 1 : 0;
      g[campo] = Math.max(min, Math.min(C.eventos.maxPersonas, g[campo] + +paso.getAttribute("data-d")));
      document.getElementById("o-" + campo).textContent = g[campo];
      paso.parentNode.querySelector('[data-d="-1"]').disabled = g[campo] <= min;
      actualizarGrupo();
      return;
    }
    var serv = e.target.closest("[data-servicio]");
    if (serv) {
      g.servicio = serv.getAttribute("data-servicio");
      serv.parentNode.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === serv)); });
      actualizarGrupo();
      return;
    }
    var usar = e.target.closest("[data-usar]");
    if (usar) { cambiarLocalGrupo(usar.getAttribute("data-usar")); }
  });

  function cambiarLocalGrupo(id) {
    var g = estado.grupo;
    g.local = id;
    if (!tieneCena(C.locales[id])) g.servicio = "comida";
    if (!g.fechaTocada || !N.abreServicio(C.locales[id], g.fecha, g.servicio)) g.fecha = fechaPorDefecto(id, g.servicio);
    renderGrupo();
  }

  app.addEventListener("input", function (e) {
    var f = e.target.form;
    if (!f) return;
    if (f.id === "f-queja") {
      estado.queja[e.target.name] = e.target.value;
      f.querySelector("button[type=submit]").disabled = !estado.queja.texto.trim();
    }
    if (f.id === "f-grupo" && e.target.name !== "local") {
      estado.grupo[e.target.name] = e.target.value;
      if (e.target.name === "fecha") estado.grupo.fechaTocada = true;
      actualizarGrupo();
    }
  });

  app.addEventListener("change", function (e) {
    if (e.target.name === "local" && e.target.form && e.target.form.id === "f-grupo") cambiarLocalGrupo(e.target.value);
  });

  app.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (f.id === "f-queja") {
      if (!estado.queja.texto.trim()) return;
      estado.queja.enviada = true;
      estado.queja.ficha = ahoraTexto();
      if (numeroWa(estado.localId)) {
        estado.queja.mensajeWa = textoWaQueja();
        estado.queja.url = urlWa(estado.localId, estado.queja.mensajeWa);
        abrirWa(estado.queja.url);
      }
      var guardar = C.contador && C.contador.guardarMensajes !== false;
      track("queja", {
        categoria: estado.queja.categoria,
        texto: guardar ? estado.queja.texto.trim() : "",
        contacto: guardar ? estado.queja.contacto.trim() : (estado.queja.contacto ? "si" : ""),
      });
      document.querySelector("#d-queja .panel-interior").innerHTML = htmlQueja();
    }
    if (f.id === "f-grupo") {
      var g = estado.grupo;
      g.intento = true;
      if (!g.nombre.trim() || !g.contacto.trim()) { actualizarGrupo(); f.querySelector(g.nombre.trim() ? "[name=contacto]" : "[name=nombre]").focus(); return; }
      g.enviada = true;
      g.ficha = ahoraTexto();
      if (numeroWa(g.local)) {
        g.mensajeWa = textoWaGrupo();
        g.url = urlWa(g.local, g.mensajeWa);
        abrirWa(g.url);
      }
      var guardarG = C.contador && C.contador.guardarMensajes !== false;
      track("grupo", {
        categoria: g.tipo, personas: g.ultimo.personas, importe: g.ultimo.total,
        texto: guardarG ? C.locales[g.local].corto + " · " + g.fecha + " · " + g.servicio + (g.comentarios.trim() ? " · " + g.comentarios.trim() : "") : "",
        contacto: guardarG ? g.nombre.trim() + " · " + g.contacto.trim() : "",
      });
      renderGrupo();
      document.getElementById("d-grupos").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  render();
  if (estado.localId) track("escaneo");
})();
