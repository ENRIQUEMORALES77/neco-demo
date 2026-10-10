/* Métricas compartidas por el panel y el informe mensual.
   · Datos reales de Google: config.js → locales[id].google
   · Actividad de las placas: contador real (Google Sheets) si está configurado,
     o datos de ejemplo (window.DEMO) si no. */
(function () {
  var C = window.CONFIG, N = window.NECO;
  var ids = Object.keys(C.locales);
  var CAT = { comida: "Comida", reposicion: "Reposición", limpieza: "Limpieza", espera: "Espera", atencion: "Atención", alergenos: "Alérgenos", otro: "Otro" };
  var dec = function (n, d) { return n.toFixed(d).replace(".", ","); };

  /* ---------- reputación (real) ---------- */
  function agregado(lista) {
    var e = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, n = 0, s = 0;
    lista.forEach(function (id) {
      var g = C.locales[id].google;
      for (var k = 1; k <= 5; k++) { e[k] += g.estrellas[k]; n += g.estrellas[k]; s += k * g.estrellas[k]; }
    });
    return { e: e, n: n, s: s, media: n ? s / n : 0 };
  }

  /* Nota visible (1 decimal) y reseñas necesarias para cambiarla */
  function umbrales(a) {
    var vis = Math.round(a.media * 10) / 10, arriba = vis + .05, abajo = vis - .05;
    return {
      vis: vis,
      n5: Math.max(0, Math.ceil((arriba * a.n - a.s) / (5 - arriba) - 1e-9)),
      n1: Math.floor((a.s - abajo * a.n) / (abajo - 1)) + 1,
    };
  }

  /* Posición del local frente a su competencia cercana */
  function ranking(id) {
    var g = C.locales[id].google, a = agregado([id]);
    var filas = (g.competencia || []).map(function (c) { return { nombre: c.nombre, nota: c.nota, resenas: c.resenas, tipo: c.tipo, neco: false }; });
    filas.push({ nombre: C.locales[id].nombre, nota: Math.round(a.media * 10) / 10, exacta: a.media, resenas: a.n, tipo: "Neco", neco: true });
    filas.sort(function (x, y) { return y.nota - x.nota || y.resenas - x.resenas; });
    var otros = filas.filter(function (f) { return !f.neco; });
    var media = otros.length ? otros.reduce(function (s, f) { return s + f.nota; }, 0) / otros.length : 0;
    var porVolumen = filas.slice().sort(function (x, y) { return y.resenas - x.resenas; });
    return {
      filas: filas, total: filas.length, media: media,
      puesto: filas.findIndex(function (f) { return f.neco; }) + 1,
      puestoVolumen: porVolumen.findIndex(function (f) { return f.neco; }) + 1,
    };
  }

  /* ---------- actividad de las placas ---------- */
  function nuevas(D, lista, k) {
    return D.resenas.filter(function (r) { return lista.indexOf(r.local) !== -1 && (!k || r.estrellas === k); });
  }

  function serieDiaria(D, lista) {
    return D.dias.map(function (iso, i) {
      var r = { iso: iso, escaneos: 0, nfc: 0, qr: 0, clics: 0, resenas: 0, porEstrella: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      lista.forEach(function (id) {
        var d = D.porDia[id][i];
        r.escaneos += d.escaneos; r.nfc += d.nfc; r.qr += d.qr; r.clics += d.clics; r.resenas += d.resenas;
        for (var k = 1; k <= 5; k++) r.porEstrella[k] += d.porEstrella[k];
      });
      return r;
    });
  }

  function embudo(D, lista) {
    var t = serieDiaria(D, lista).reduce(function (s, d) { s.e += d.escaneos; s.c += d.clics; return s; }, { e: 0, c: 0 });
    var r = nuevas(D, lista), resp = r.filter(function (x) { return x.respondida; }).length;
    return [
      { paso: "Escaneos", n: t.e },
      { paso: "Clics a Google", n: t.c },
      { paso: "Reseñas publicadas", n: D.real ? null : r.length },
      { paso: "Respondidas", n: D.real ? null : resp },
    ];
  }

  function temasQueja(D, lista) {
    var t = {};
    D.quejas.forEach(function (q) { if (lista.indexOf(q.local) !== -1) t[q.categoria || "otro"] = (t[q.categoria || "otro"] || 0) + 1; });
    return Object.keys(t).map(function (k) { return { clave: k, nombre: CAT[k] || k, n: t[k] }; }).sort(function (a, b) { return b.n - a.n; });
  }

  /* Matriz día de la semana (0 = domingo) × hora con los escaneos */
  function horas(D, lista) {
    var m = [0, 1, 2, 3, 4, 5, 6].map(function () { return new Array(24).fill(0); });
    lista.forEach(function (id) {
      var h = D.horas[id];
      for (var d = 0; d < 7; d++) for (var x = 0; x < 24; x++) m[d][x] += h[d][x];
    });
    return m;
  }

  /* ---------- recomendaciones automáticas ---------- */
  function recomendaciones(D, lista) {
    var r = [];
    var corto = function (id) { return C.locales[id].corto; };
    lista.forEach(function (id) {
      var a = agregado([id]), u = umbrales(a), q = temasQueja(D, [id]);
      if (u.n1 <= 20) {
        r.push({ prioridad: 1, tipo: "riesgo", texto: corto(id) + " está a solo " + u.n1 + " reseñas de 1★ de bajar a " + dec(u.vis - .1, 1) + " en Google (media exacta " + dec(a.media, 3) + "). Contestad las negativas en menos de 24 h" + (q.length ? " y revisad «" + q[0].nombre.toLowerCase() + "», la queja privada más repetida." : ".") });
      }
      if (u.n5 <= 60) {
        r.push({ prioridad: 2, tipo: "oportunidad", texto: corto(id) + " está a " + u.n5 + " reseñas de 5★ de mostrar un " + dec(u.vis + .1, 1) + ". Con las placas activas y un recordatorio en caja, se puede conseguir en pocas semanas." });
      }
      var rk = ranking(id);
      if (rk.total > 1 && a.media < rk.media - .05) {
        r.push({ prioridad: 3, tipo: "competencia", texto: corto(id) + " (" + dec(a.media, 2) + ") está por debajo de la media de su competencia cercana (" + dec(rk.media, 2) + "): puesto " + rk.puesto + " de " + rk.total + " por nota, pero " + rk.puestoVolumen + "º por número de reseñas. Hay clientela; falta que los contentos escriban." });
      }
      var tot = D.porDia[id].reduce(function (s, d) { s.e += d.escaneos; s.c += d.clics; return s; }, { e: 0, c: 0 });
      if (tot.e > 50 && tot.c / tot.e < .35) {
        r.push({ prioridad: 4, tipo: "accion", texto: "En " + corto(id) + " solo el " + Math.round(tot.c / tot.e * 100) + " % de quienes escanean pulsa el botón de Google. Probad a mencionar la placa en caja o a colocarla más a la vista." });
      }
    });
    if (lista.length > 1) {
      var peor = lista.slice().sort(function (x, y) { var a = agregado([x]), b = agregado([y]); return b.e[1] / b.n - a.e[1] / a.n; })[0], ap = agregado([peor]);
      r.push({ prioridad: 3, tipo: "info", texto: corto(peor) + " acumula la mayor proporción de reseñas de 1★ de la red (" + dec(ap.e[1] / ap.n * 100, 1) + " %). Es el local donde más rinde contestar rápido a las negativas." });
    }
    if (!D.real) {
      var pend = nuevas(D, lista).filter(function (x) { return !x.respondida; });
      var neg = pend.filter(function (x) { return x.estrellas <= 2; }).length;
      if (pend.length) r.push({ prioridad: neg ? 2 : 5, tipo: "accion", texto: pend.length + " reseñas nuevas sin responder" + (neg ? ", " + neg + " de ellas de 1–2★: empezad por esas." : ".") + " Desde el panel se responden con una plantilla en un clic." });
    }
    r.sort(function (x, y) { return x.prioridad - y.prioridad; });
    return r.slice(0, 5);
  }

  /* ---------- carga de datos: contador real o ejemplo ---------- */
  var CLAVE_LS = "neco-panel-clave";
  function leerClave() {
    var p = new URLSearchParams(location.search).get("clave");
    try {
      if (p) localStorage.setItem(CLAVE_LS, p);
      return p || localStorage.getItem(CLAVE_LS) || "";
    } catch (e) { return p || ""; }
  }
  function guardarClave(v) { try { v ? localStorage.setItem(CLAVE_LS, v) : localStorage.removeItem(CLAVE_LS); } catch (e) {} }

  function cargarDatos() {
    var ep = C.contador && C.contador.endpoint;
    var forzarDemo = new URLSearchParams(location.search).get("demo") === "1";
    if (!ep || forzarDemo) return Promise.resolve({ datos: window.DEMO, modo: "demo", motivo: ep ? "forzado" : "sin-endpoint" });
    var clave = leerClave();
    if (!clave) return Promise.resolve({ datos: window.DEMO, modo: "demo", motivo: "sin-clave" });
    return fetch(ep + (ep.indexOf("?") === -1 ? "?" : "&") + "clave=" + encodeURIComponent(clave), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) return { datos: window.DEMO, modo: "demo", motivo: j.error === "clave" ? "clave-incorrecta" : "error" };
        return { datos: desdeContador(j), modo: "real", generado: j.generado };
      })
      .catch(function () { return { datos: window.DEMO, modo: "demo", motivo: "sin-conexion" }; });
  }

  /* Convierte la respuesta del Apps Script al mismo formato que window.DEMO */
  function desdeContador(j) {
    var fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    function partes(t) {
      var o = {};
      fmt.formatToParts(new Date(t)).forEach(function (p) { o[p.type] = p.value; });
      return { iso: o.year + "-" + o.month + "-" + o.day, hora: +o.hour, min: o.minute };
    }
    var hoy = N.ahoraMadrid().iso, dias = [];
    for (var i = 29; i >= 0; i--) dias.push(N.sumarDias(hoy, -i));
    var idx = {}; dias.forEach(function (d, k) { idx[d] = k; });
    var vacio = function () { return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; };
    var porDia = {}, mesas = {}, hs = {};
    ids.forEach(function (id) {
      porDia[id] = dias.map(function (iso) { return { iso: iso, escaneos: 0, nfc: 0, qr: 0, entrada: 0, clics: 0, resenas: 0, porEstrella: vacio() }; });
      mesas[id] = { entrada: 0, mesas: new Array(C.locales[id].mesas || 0).fill(0) };
      hs[id] = [0, 1, 2, 3, 4, 5, 6].map(function () { return new Array(24).fill(0); });
    });
    (j.eventos || []).forEach(function (ev) {
      var t = ev[0], tipo = ev[1], id = ev[2], mesa = ev[3], via = ev[4];
      if (!porDia[id]) return;
      var p = partes(t), k = idx[p.iso];
      if (k == null) return;
      var d = porDia[id][k];
      if (tipo === "escaneo") {
        d.escaneos++;
        if (via === "nfc") d.nfc++; else d.qr++;
        var m = parseInt(mesa, 10);
        if (m && m <= mesas[id].mesas.length) mesas[id].mesas[m - 1]++; else { d.entrada++; mesas[id].entrada++; }
        hs[id][N.fechaDeIso(p.iso).getDay()][p.hora]++;
      } else if (tipo === "clic_google") {
        d.clics++;
      }
    });
    var quejas = (j.mensajes || []).map(function (q) {
      var p = partes(q.t);
      return { iso: p.iso, hora: String(p.hora).padStart(2, "0") + ":" + p.min, local: q.local, mesa: parseInt(q.mesa, 10) || null,
        via: String(q.via || "").toUpperCase(), texto: q.texto, categoria: q.categoria || "otro", contacto: q.contacto, estado: "Pendiente" };
    }).sort(function (a, b) { return (b.iso + b.hora).localeCompare(a.iso + a.hora); });
    return { real: true, dias: dias, porDia: porDia, mesas: mesas, horas: hs, quejas: quejas, resenas: [] };
  }

  window.METRICAS = {
    ids: ids, CAT: CAT, agregado: agregado, umbrales: umbrales, ranking: ranking, nuevas: nuevas, serieDiaria: serieDiaria,
    embudo: embudo, temasQueja: temasQueja, horas: horas, recomendaciones: recomendaciones,
    cargarDatos: cargarDatos, guardarClave: guardarClave, desdeContador: desdeContador,
  };
})();
