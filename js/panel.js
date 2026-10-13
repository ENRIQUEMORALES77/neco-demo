/* Dashboard de reseñas.
   · Reputación en Google: datos REALES de config.js (locales[id].google).
   · Actividad de las placas: contador real (Google Sheets) o datos de ejemplo.
   Filtros globales: local y estrellas (0 = general). Gráficas SVG sin librerías. */
(function () {
  var C = window.CONFIG, N = window.NECO, M = window.METRICAS;
  var ids = M.ids, D = window.DEMO, carga = { modo: "demo", motivo: "cargando" };
  var filtro = "todos", est = 0, localMesas = ids[0], localRival = ids[0];
  var COL = { 1: "#B9473A", 2: "#E08E6D", 3: "#CFC8BB", 4: "#93AE9A", 5: "#4F6154" };
  var RAMPA = ["#EEF2EF", "#D3DED6", "#B2C5B7", "#8FA997", "#6E8273", "#55685A", "#3D4C41"];
  var $ = function (id) { return document.getElementById(id); };
  var tip = $("tip");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var num = function (n) { return N.num(n, "es"); };
  var dec = function (n, d) { return n.toFixed(d).replace(".", ","); };
  var pct = function (a, b, d) { return b ? dec(a / b * 100, d || 0) + " %" : "–"; };
  var fCorta = function (iso) { return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(N.fechaDeIso(iso)).replace(".", ""); };
  var fDia = function (iso) { return new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" }).format(N.fechaDeIso(iso)).replace(/\./g, ""); };
  var activos = function () { return filtro === "todos" ? ids : [filtro]; };
  var etqEst = function (k) { return k + "★"; };
  var agregado = M.agregado, umbrales = M.umbrales;
  var nuevas = function (lista, k) { return M.nuevas(D, lista, k); };
  var esReal = function () { return carga.modo === "real"; };

  /* ======================= filtros ======================= */
  function renderFiltros() {
    var b = [["todos", "Todos"]].concat(ids.map(function (id) { return [id, C.locales[id].corto]; }));
    $("filtros").innerHTML = b.map(function (x) {
      return '<button type="button" data-f="' + x[0] + '" aria-pressed="' + (filtro === x[0]) + '">' + esc(x[1]) + '</button>';
    }).join("");
    var e = [[0, "General"], [5, "5★"], [4, "4★"], [3, "3★"], [2, "2★"], [1, "1★"]];
    $("f-estrellas").innerHTML = e.map(function (x) {
      return '<button type="button" data-e="' + x[0] + '" aria-pressed="' + (est === x[0]) + '">' +
        (x[0] ? '<i style="background:' + COL[x[0]] + '"></i>' : '') + x[1] + '</button>';
    }).join("");
    var q = new URLSearchParams();
    if (filtro !== "todos") q.set("local", filtro);
    if (!esReal()) q.set("demo", "1");
    $("btn-informe").href = "informe.html" + (q.toString() ? "?" + q : "");
  }
  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-f]");
    if (f) { filtro = f.getAttribute("data-f"); if (filtro !== "todos") { localMesas = filtro; localRival = filtro; } render(); return; }
    var s = e.target.closest("[data-e]");
    if (s) { var v = +s.getAttribute("data-e"); est = est === v && v ? 0 : v; render(); return; }
    var r = e.target.closest("[data-responder]");
    if (r) { var box = r.closest(".qj").querySelector(".respuesta"); box.hidden = !box.hidden; return; }
    var cp = e.target.closest("[data-copiar]");
    if (cp) {
      var ta = cp.closest(".respuesta").querySelector("textarea");
      ta.select();
      (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).catch(function () { document.execCommand("copy"); });
      cp.textContent = "Copiado ✓";
      setTimeout(function () { cp.textContent = "Copiar respuesta"; }, 1600);
    }
  });

  /* ======================= REPUTACIÓN (REAL) ======================= */
  function renderReal() {
    var lista = activos(), a = agregado(lista), u = umbrales(a);
    $("fecha-real").textContent = "Dato real · Google Maps · " + N.fechaDeIso(C.locales[ids[0]].google.fecha).toLocaleDateString("es-ES");
    var ambito = filtro === "todos" ? "los 4 locales" : C.locales[filtro].nombre;

    if (!est) {
      $("hero-nota").innerHTML =
        '<p class="hn-et">Nota en Google · ' + esc(ambito) + '</p>' +
        '<p class="hn-val">' + dec(u.vis, 1) + '<span class="hn-est">' + estrellasHtml(a.media) + '</span></p>' +
        '<p class="hn-sub">Media exacta <b>' + dec(a.media, 3) + '</b> · ' + num(a.n) + ' reseñas</p>';
    } else {
      $("hero-nota").innerHTML =
        '<p class="hn-et">Reseñas de ' + etqEst(est) + ' · ' + esc(ambito) + '</p>' +
        '<p class="hn-val">' + num(a.e[est]) + '<span class="hn-pct">' + pct(a.e[est], a.n, 1) + '</span></p>' +
        '<p class="hn-sub">del total de ' + num(a.n) + ' reseñas · nota media ' + dec(a.media, 2) + '</p>';
    }

    var k;
    if (!est) {
      var sat = a.e[4] + a.e[5], cri = a.e[1] + a.e[2], neto = (a.e[5] - cri) / a.n * 100;
      k = [
        ["Clientes satisfechos", pct(sat, a.n), "Reseñas de 4 y 5★ (" + num(sat) + ")", ""],
        ["Críticas", pct(cri, a.n), "Reseñas de 1 y 2★ (" + num(cri) + ")", cri / a.n > .12 ? "mal" : ""],
        ["Índice neto de reseñas", (neto > 0 ? "+" : "") + dec(neto, 0), "% de 5★ menos % de 1–2★ (de −100 a +100)", ""],
        ["Una reseña de 1★ se compensa con", dec((a.media - 1) / (5 - a.media), 1) + " de 5★", "Para mantener la nota media actual", ""],
      ];
    } else {
      var share = function (id) { var x = agregado([id]); return x.e[est] / x.n; };
      var orden = ids.slice().sort(function (p, q) { return share(q) - share(p); });
      var red = agregado(ids), efecto = (est - a.media) / (a.n + 1), ultimo = orden[orden.length - 1];
      var t4 = est < a.media
        ? ["Para compensar una de " + etqEst(est), dec((a.media - est) / (5 - a.media), 1) + " de 5★", "Hacen falta para que la nota no baje", ""]
        : ["Para subir la nota visible", num(u.n5) + " de 5★", "De " + dec(u.vis, 1) + " a " + dec(u.vis + .1, 1) + " en " + esc(ambito), ""];
      k = [
        filtro !== "todos"
          ? ["Peso en el total", pct(a.e[est], a.n, 1), "Red completa: " + pct(red.e[est], red.n, 1), ""]
          : est === 5
            ? ["5★ por cada crítica", dec(a.e[5] / (a.e[1] + a.e[2]), 1), "Reseñas de 5★ por cada una de 1–2★", ""]
            : ["Por cada 100 de 5★", num(Math.round(a.e[est] / a.e[5] * 100)) + " de " + etqEst(est), "Proporción frente a las mejores reseñas", ""],
        ["Local con más " + etqEst(est), C.locales[orden[0]].corto, dec(share(orden[0]) * 100, 1) + " % de sus reseñas · menos: " + C.locales[ultimo].corto + " (" + dec(share(ultimo) * 100, 1) + " %)", ""],
        ["Efecto de cada nueva " + etqEst(est), (efecto > 0 ? "+" : "−") + dec(Math.abs(efecto), 5), efecto > 0 ? "Sube la nota media" : "Baja la nota media" + (est === 4 ? " (aunque sea buena)" : ""), efecto < 0 ? "mal" : "bien"],
        t4,
      ];
    }
    $("kpis-real").innerHTML = k.map(kpi).join("");

    renderHisto(a);
    renderComparativa();
    renderObjetivos();
    renderRivales();
    renderTemas(lista);
  }

  function estrellasHtml(media) {
    var w = Math.max(0, Math.min(100, media / 5 * 100));
    return '<span class="est-fondo" aria-hidden="true">★★★★★<span class="est-relleno" style="width:' + w + '%">★★★★★</span></span>';
  }

  function kpi(x) {
    return '<div class="kpi' + (x[3] ? " kpi-" + x[3] : "") + '"><div class="k-et">' + x[0] + '</div><div class="k-val">' + x[1] + '</div><div class="k-sub">' + x[2] + '</div></div>';
  }

  function renderHisto(a) {
    var max = Math.max(a.e[1], a.e[2], a.e[3], a.e[4], a.e[5]) || 1;
    $("g-histo").innerHTML = '<div class="histo">' + [5, 4, 3, 2, 1].map(function (k) {
      var tenue = est && est !== k;
      return '<button type="button" class="h-fila' + (est === k ? " activa" : "") + (tenue ? " tenue" : "") + '" data-e="' + k + '" aria-pressed="' + (est === k) + '">' +
        '<span class="h-et">' + k + ' ★</span>' +
        '<span class="h-pista"><span class="h-barra" style="width:' + (a.e[k] / max * 100) + '%;background:' + COL[k] + '"></span></span>' +
        '<span class="h-val">' + num(a.e[k]) + '</span><span class="h-pct">' + pct(a.e[k], a.n) + '</span></button>';
    }).join("") + '</div>';
  }

  function renderComparativa() {
    $("comp-sub").textContent = est ? "Porcentaje de reseñas de " + etqEst(est) + " en cada local" : "Cómo se reparten las estrellas en cada local";
    $("g-comp").innerHTML = '<div class="comp">' + ids.map(function (id) {
      var a = agregado([id]), tenueLocal = filtro !== "todos" && filtro !== id;
      var segs = [5, 4, 3, 2, 1].map(function (k) {
        return '<span class="seg' + (est && est !== k ? " tenue" : "") + '" data-tip-local="' + id + '" data-tip-k="' + k + '" style="width:' + (a.e[k] / a.n * 100) + '%;background:' + COL[k] + '"></span>';
      }).join("");
      var derecha = est ? pct(a.e[est], a.n, 1) : dec(a.media, 2) + " ★";
      return '<div class="c-fila' + (tenueLocal ? " tenue" : "") + '"><span class="c-nombre">' + esc(C.locales[id].corto) + '<small>' + num(a.n) + ' reseñas</small></span>' +
        '<span class="c-barra">' + segs + '</span><span class="c-val">' + derecha + '</span></div>';
    }).join("") + '</div>';
    var ley = [5, 4, 3, 2, 1].map(function (k) { return '<span><i class="sw sw-est" style="background:' + COL[k] + '"></i>' + etqEst(k) + '</span>'; }).join("");
    $("ley-est").innerHTML = ley;
    $("ley-est-2").innerHTML = esReal() ? "" : est ? '<span><i class="sw sw-est" style="background:' + COL[est] + '"></i>' + etqEst(est) + '</span>' : ley;
  }
  $("g-comp").addEventListener("pointermove", function (e) {
    var s = e.target.closest("[data-tip-k]");
    if (!s) return ocultarTip();
    var id = s.getAttribute("data-tip-local"), k = +s.getAttribute("data-tip-k"), a = agregado([id]);
    verTip(e, '<b>' + esc(C.locales[id].corto) + ' · ' + etqEst(k) + '</b>' + num(a.e[k]) + ' reseñas (' + pct(a.e[k], a.n, 1) + ')');
  });
  $("g-comp").addEventListener("pointerleave", ocultarTip);
  $("g-comp").addEventListener("click", function (e) {
    var s = e.target.closest("[data-tip-k]");
    if (s) { var v = +s.getAttribute("data-tip-k"); est = est === v ? 0 : v; render(); }
  });

  function renderObjetivos() {
    var filas = activos().map(function (id) {
      var a = agregado([id]), u = umbrales(a);
      var nr = nuevas([id]), m = nr.length, sm = nr.reduce(function (s, r) { return s + r.estrellas; }, 0);
      var arriba = u.vis + .05, plazo = esReal() ? "fase 2" : "–";
      if (m && sm / m > arriba) {
        var meses = (arriba * a.n - a.s) / (sm - arriba * m);
        plazo = meses <= 0 ? "ya" : meses < 1 ? "≈ " + Math.max(1, Math.round(meses * 30 / 7)) + " semanas" : meses < 12 ? "≈ " + dec(meses, 1) + " meses" : "≈ " + dec(meses / 12, 1) + " años";
      }
      var posicion = (a.media - (u.vis - .05)) / .1 * 100;
      return '<tr><td><b>' + esc(C.locales[id].corto) + '</b></td>' +
        '<td class="num"><b>' + dec(u.vis, 1) + '</b></td>' +
        '<td class="num">' + dec(a.media, 3) + '</td>' +
        '<td><div class="franja"><span style="left:' + Math.max(2, Math.min(98, posicion)) + '%"></span></div>' +
        '<small class="franja-et"><span>' + dec(u.vis - .05, 2) + '</span><span>' + dec(u.vis + .05, 2) + '</span></small></td>' +
        '<td class="num"><b>' + num(u.n5) + '</b> de 5★<br><small>para ver ' + dec(u.vis + .1, 1) + '</small></td>' +
        '<td class="num' + (u.n1 < 25 ? " txt-mal" : "") + '"><b>' + num(u.n1) + '</b> de 1★<br><small>para caer a ' + dec(u.vis - .1, 1) + '</small></td>' +
        '<td class="num">' + plazo + '<br><small class="tag-ej-txt">' + (esReal() ? "con API Google" : "ejemplo") + '</small></td></tr>';
    }).join("");
    $("t-objetivos").innerHTML = '<table class="tabla"><thead><tr><th>Local</th><th class="num">Visible</th><th class="num">Exacta</th><th>Posición dentro de la nota</th>' +
      '<th class="num">Para subir</th><th class="num">Margen antes de bajar</th><th class="num">Al ritmo de las placas</th></tr></thead><tbody>' + filas + '</tbody></table>';
  }

  /* Competencia: diagrama de puntos sobre una escala de 3,5 a 5 */
  function renderRivales() {
    var sel = $("rival-sel");
    sel.innerHTML = ids.map(function (id) { return '<option value="' + id + '"' + (id === localRival ? " selected" : "") + '>' + esc(C.locales[id].corto) + '</option>'; }).join("");
    $("rival-sel-cont").hidden = filtro !== "todos";
    var rk = M.ranking(localRival), lo = 3.5, hi = 5;
    $("rival-sub").textContent = "Puesto " + rk.puesto + " de " + rk.total + " por nota · " + rk.puestoVolumen + "º por número de reseñas · media de la zona " + dec(rk.media, 2);
    var marcas = [3.5, 4, 4.5, 5].map(function (v) { return '<span style="left:' + ((v - lo) / (hi - lo) * 100) + '%">' + dec(v, 1) + '</span>'; }).join("");
    var mediaX = (rk.media - lo) / (hi - lo) * 100;
    $("g-rivales").innerHTML = '<div class="rivales">' + rk.filas.map(function (f) {
      var x = Math.max(0, Math.min(100, (f.nota - lo) / (hi - lo) * 100));
      return '<div class="r-fila' + (f.neco ? " neco" : "") + '"><span class="r-nombre">' + esc(f.nombre) + '<small>' + esc(f.tipo) + '</small></span>' +
        '<span class="r-pista"><i class="r-media" style="left:' + mediaX + '%"></i><i class="r-punto" style="left:' + x + '%"></i></span>' +
        '<span class="r-val"><b>' + dec(f.nota, 1) + '</b><small>' + (f.resenas >= 1000 && !f.neco ? "≈" : "") + num(f.resenas) + '</small></span></div>';
    }).join("") + '<div class="r-fila r-eje"><span></span><span class="r-pista">' + marcas + '</span><span></span></div></div>' +
      '<p class="nota-graf"><i class="r-media-ley"></i> media de la competencia · cifras con «≈»: Google las redondea</p>';
  }
  $("rival-sel").addEventListener("change", function (e) { localRival = e.target.value; renderRivales(); });

  function renderTemas(lista) {
    var t = {};
    lista.forEach(function (id) {
      (C.locales[id].google.temas || []).forEach(function (x) {
        var clave = x[0].toLowerCase();
        t[clave] = t[clave] || { nombre: x[0], n: 0 };
        t[clave].n += x[1];
      });
    });
    var arr = Object.keys(t).map(function (k) { return t[k]; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 14);
    var max = arr.length ? arr[0].n : 1, total = agregado(lista).n;
    $("temas-sub").textContent = "Temas que Google detecta en las reseñas y en cuántas aparecen" + (est ? " (Google no los separa por estrellas)" : "");
    $("temas").innerHTML = arr.map(function (x) {
      return '<span class="tema" style="--w:' + (x.n / max * 100) + '%"><b>' + esc(x.nombre) + '</b><span>' + num(x.n) + ' · ' + pct(x.n, total, 1) + '</span></span>';
    }).join("");
  }

  /* ======================= ACTIVIDAD DE LAS PLACAS ======================= */
  function renderEstadoContador() {
    var t = $("periodo"), caja = $("estado-contador"), ley = $("tag-placas-ley");
    var rango = fCorta(D.dias[0]) + " – " + fCorta(D.dias[D.dias.length - 1]);
    if (esReal()) {
      t.className = ley.className = "tag tag-real";
      t.textContent = "Real · contador · últimos 30 días · " + rango;
      ley.textContent = "Real · contador";
      caja.innerHTML = '<p class="aviso-contador ok">Conectado al contador real (Google Sheets) · actualizado a las ' +
        new Date(carga.generado || Date.now()).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) +
        '. Las reseñas nuevas y las respuestas llegarán con la API de Google (fase 2).</p>';
      return;
    }
    t.className = ley.className = "tag tag-ej";
    t.textContent = "Ejemplo · últimos 30 días · " + rango;
    ley.textContent = "Ejemplo · simulado";
    var ep = C.contador && C.contador.endpoint;
    var msg = { "sin-clave": "El contador está configurado. Escribe la clave del panel para ver los datos reales.",
      "clave-incorrecta": "La clave no es correcta. Escríbela otra vez.",
      "sin-conexion": "No se ha podido conectar con el contador; se muestran datos de ejemplo.",
      "error": "El contador ha respondido con un error; se muestran datos de ejemplo." }[carga.motivo];
    caja.innerHTML = ep && msg
      ? '<form class="aviso-contador" id="f-clave"><span>' + msg + '</span><input type="password" id="clave" placeholder="Clave del panel" autocomplete="current-password"><button type="submit">Conectar</button></form>'
      : "";
    var f = $("f-clave");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      M.guardarClave($("clave").value.trim());
      iniciar();
    });
  }

  function renderPlacas() {
    var serie = M.serieDiaria(D, activos());
    renderEstadoContador();
    var t = serie.reduce(function (s, d) { s.e += d.escaneos; s.n += d.nfc; s.c += d.clics; return s; }, { e: 0, n: 0, c: 0 });
    var quejas = D.quejas.filter(function (q) { return activos().indexOf(q.local) !== -1; });
    var pend = quejas.filter(function (q) { return q.estado === "Pendiente"; }).length;
    var tiles = [
      ["Escaneos", num(t.e), pct(t.n, t.e) + " NFC · " + pct(t.e - t.n, t.e) + " QR", ""],
      ["Clics a Google", num(t.c), pct(t.c, t.e) + " de los escaneos", ""],
    ];
    if (esReal()) {
      var fase2 = ["", "—", "Con la API de Google (fase 2)", ""];
      tiles.push(["Reseñas nuevas"].concat(fase2.slice(1)), ["Nota de las reseñas nuevas"].concat(fase2.slice(1)),
        ["Mensajes privados", num(quejas.length), pend + " por atender", pend ? "mal" : ""],
        ["Escaneos por día", dec(t.e / D.dias.length, 1), "Media de los últimos 30 días", ""]);
    } else {
      var todas = nuevas(activos()), sel = nuevas(activos(), est);
      var media = todas.length ? todas.reduce(function (s, r) { return s + r.estrellas; }, 0) / todas.length : 0;
      var hist = agregado(activos()).media;
      var resp = sel.filter(function (r) { return r.respondida; });
      var horas = resp.length ? resp.reduce(function (s, r) { return s + r.horasRespuesta; }, 0) / resp.length : 0;
      tiles.push(
        [est ? "Reseñas nuevas de " + etqEst(est) : "Reseñas nuevas", num(sel.length), est ? pct(sel.length, todas.length) + " de las nuevas" : pct(todas.length, t.c) + " de los clics acaban en reseña", ""],
        ["Nota de las reseñas nuevas", dec(media, 2) + " ★", (media >= hist ? "+" : "") + dec(media - hist, 2) + " vs histórica (" + dec(hist, 2) + ")", media >= hist ? "bien" : "mal"],
        [est ? "Respondidas (" + etqEst(est) + ")" : "Respondidas", pct(resp.length, sel.length), sel.length - resp.length ? (sel.length - resp.length) + " sin responder" : "Todas respondidas", sel.length && resp.length / sel.length < .8 ? "mal" : ""],
        ["Tiempo medio de respuesta", resp.length ? (horas < 24 ? dec(horas, 0) + " h" : dec(horas / 24, 1) + " días") : "–", "Objetivo: < 24 h (< 6 h en negativas)", horas > 24 ? "mal" : ""]);
    }
    $("kpis-placas").innerHTML = tiles.map(kpi).join("");

    renderEmbudo();
    renderHoras();
    renderDias(serie);
    renderResenasDia(serie);
    renderLocales();
    renderMesas();
    renderListaResenas();
    renderTemasQueja();
    renderQuejas(quejas);
  }

  function renderEmbudo() {
    var pasos = M.embudo(D, activos()), base = pasos[0].n || 1;
    $("g-embudo").innerHTML = '<div class="embudo">' + pasos.map(function (p, i) {
      var previo = i ? pasos[i - 1].n : null;
      if (p.n == null) {
        return '<div class="e-fila fase2-fila"><span class="e-paso">' + p.paso + '</span><span class="e-pista"><span class="e-vacia">Con la API de Google (fase 2)</span></span><span class="e-val">—</span></div>';
      }
      var conv = previo ? pct(p.n, previo) + " del paso anterior" : "100 %";
      return '<div class="e-fila"><span class="e-paso">' + p.paso + '</span>' +
        '<span class="e-pista"><span class="e-barra" style="width:' + Math.max(1.5, p.n / base * 100) + '%"></span></span>' +
        '<span class="e-val"><b>' + num(p.n) + '</b><small>' + conv + '</small></span></div>';
    }).join("") + '</div>' +
      (pasos[2].n != null ? '<p class="nota-graf">De cada 100 personas que escanean, <b>' + Math.round(pasos[2].n / base * 100) + '</b> publican una reseña en Google.</p>' : '');
  }

  function renderHoras() {
    var m = M.horas(D, activos()), dias = [1, 2, 3, 4, 5, 6, 0], nombres = ["L", "M", "X", "J", "V", "S", "D"];
    var h0 = 7, h1 = 23, max = 0, pico = null;
    dias.forEach(function (d) { for (var h = h0; h <= h1; h++) if (m[d][h] > max) { max = m[d][h]; pico = [d, h]; } });
    var largos = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    $("horas-sub").textContent = max ? "Hora punta: " + largos[pico[0]] + " a las " + pico[1] + ":00 · " + num(max) + " escaneos en 30 días" : "Sin escaneos en este periodo";
    var cab = '<span></span>';
    for (var h = h0; h <= h1; h++) cab += '<span class="hm-h">' + (h % 2 ? "" : h) + '</span>';
    $("g-horas").innerHTML = '<div class="hm" style="--cols:' + (h1 - h0 + 1) + '">' + cab + dias.map(function (d, i) {
      var fila = '<span class="hm-d">' + nombres[i] + '</span>';
      for (var h = h0; h <= h1; h++) {
        var v = m[d][h], k = v ? Math.min(RAMPA.length - 1, 1 + Math.floor(v / max * (RAMPA.length - 2) + .0001)) : 0;
        fila += '<span class="hm-c" data-d="' + d + '" data-h="' + h + '" data-v="' + v + '" style="background:' + (v ? RAMPA[k] : "#F6F2EB") + '"></span>';
      }
      return fila;
    }).join("") + '</div>' +
      '<div class="mesas-pie"><span>Útil para saber cuándo recordar la placa en caja</span><span class="escala">Menos ' + RAMPA.slice(1).map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + ' Más</span></div>';
  }
  $("g-horas").addEventListener("pointermove", function (e) {
    var c = e.target.closest(".hm-c");
    if (!c) return ocultarTip();
    var largos = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    verTip(e, '<b>' + largos[+c.getAttribute("data-d")] + ' · ' + c.getAttribute("data-h") + ':00</b>' + num(+c.getAttribute("data-v")) + ' escaneos en 30 días');
  });
  $("g-horas").addEventListener("pointerleave", ocultarTip);

  function pasoBonito(max, n) {
    var bruto = max / n, mag = Math.pow(10, Math.floor(Math.log10(bruto))), r = bruto / mag;
    return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
  }

  /* Marco común de las dos gráficas diarias: fondo de fines de semana, rejilla y eje X */
  function ejes(serie, cont, max) {
    var W = Math.max(300, cont.clientWidth), H = W < 520 ? 210 : 240;
    var m = { t: 14, r: 40, b: 26, l: 34 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    var paso = Math.max(1, pasoBonito(max || 1, 4)), techo = Math.ceil((max || 1) / paso) * paso;
    var banda = iw / serie.length;
    var g = {
      m: m, ih: ih, bw: Math.min(16, banda * .64),
      x: function (i) { return m.l + banda * i + banda / 2; },
      y: function (v) { return m.t + ih - v / techo * ih; },
    };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '">';
    serie.forEach(function (d, i) {
      if (N.tipoDia(d.iso) !== "laborable") s += '<rect class="finde" x="' + (g.x(i) - banda / 2) + '" y="' + m.t + '" width="' + banda + '" height="' + ih + '"/>';
    });
    for (var v = 0; v <= techo; v += paso) {
      s += '<line class="rejilla" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + g.y(v) + '" y2="' + g.y(v) + '"/>' +
        '<text class="eje" x="' + (m.l - 8) + '" y="' + (g.y(v) + 4) + '" text-anchor="end">' + num(v) + '</text>';
    }
    var primerLunes = (8 - N.fechaDeIso(serie[0].iso).getDay()) % 7;
    serie.forEach(function (d, i) {
      if (N.fechaDeIso(d.iso).getDay() === 1 || (i === 0 && primerLunes >= 4)) s += '<text class="eje" x="' + g.x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + fCorta(d.iso) + '</text>';
    });
    g.svg = s;
    g.hits = serie.map(function (d, i) { return '<rect class="hit" data-i="' + i + '" x="' + (g.x(i) - banda / 2) + '" y="' + m.t + '" width="' + banda + '" height="' + ih + '"/>'; }).join("");
    return g;
  }

  /* Columna con las esquinas superiores redondeadas (opcional) */
  function barra(x0, y0, base, bw, redondeo) {
    var r = redondeo ? Math.min(4, base - y0) : 0;
    return 'M' + x0 + ',' + base + 'V' + (y0 + r) + (r ? 'Q' + x0 + ',' + y0 + ' ' + (x0 + r) + ',' + y0 : '') +
      'H' + (x0 + bw - r) + (r ? 'Q' + (x0 + bw) + ',' + y0 + ' ' + (x0 + bw) + ',' + (y0 + r) : '') + 'V' + base + 'Z';
  }

  function conHover(cont, serie, html) {
    var svg = cont.querySelector("svg");
    function mostrar(e) {
      var h = e.target.closest(".hit");
      if (!h) return;
      var i = +h.getAttribute("data-i");
      cont.querySelectorAll("path[data-i]").forEach(function (b) { b.classList.toggle("tenue", +b.getAttribute("data-i") !== i); });
      verTip(e, html(serie[i]));
    }
    svg.addEventListener("pointermove", mostrar);
    svg.addEventListener("pointerdown", mostrar);
    svg.addEventListener("pointerleave", function () {
      ocultarTip();
      cont.querySelectorAll("path.tenue").forEach(function (b) { b.classList.remove("tenue"); });
    });
  }

  function renderDias(serie) {
    var cont = $("g-dias"), max = Math.max.apply(null, serie.map(function (d) { return d.escaneos; }));
    var g = ejes(serie, cont, max), s = g.svg, base = g.m.t + g.ih;
    serie.forEach(function (d, i) {
      if (d.escaneos) s += '<path class="barra-d" data-i="' + i + '" d="' + barra(g.x(i) - g.bw / 2, g.y(d.escaneos), base, g.bw, true) + '"/>';
    });
    s += '<polyline class="linea-d" points="' + serie.map(function (d, i) { return g.x(i).toFixed(1) + "," + g.y(d.clics).toFixed(1); }).join(" ") + '"/>';
    var u = serie.length - 1;
    s += '<circle class="punto-d" cx="' + g.x(u) + '" cy="' + g.y(serie[u].clics) + '" r="4.5"/>' +
      '<text class="etq-fin" x="' + (g.x(u) + 9) + '" y="' + (g.y(serie[u].clics) + 4) + '">' + num(serie[u].clics) + '</text>';
    cont.innerHTML = s + g.hits + '</svg>';
    conHover(cont, serie, function (d) {
      return '<b>' + fDia(d.iso) + (N.tipoDia(d.iso) === "festivo" ? " · festivo" : "") + '</b>' +
        '<div class="fila"><span><i style="background:var(--serie-1)"></i>Escaneos</span><span>' + num(d.escaneos) + '</span></div>' +
        '<div class="fila"><span><i style="background:var(--serie-2)"></i>Clics a Google</span><span>' + num(d.clics) + ' (' + pct(d.clics, d.escaneos) + ')</span></div>' +
        '<div class="fila" style="opacity:.7"><span>NFC / QR</span><span>' + num(d.nfc) + ' / ' + num(d.qr) + '</span></div>';
    });
    $("t-dias").innerHTML = '<table><thead><tr><th>Fecha</th><th class="num">Escaneos</th><th class="num">NFC</th><th class="num">QR</th><th class="num">Clics Google</th>' + (esReal() ? '' : '<th class="num">Reseñas</th>') + '</tr></thead><tbody>' +
      serie.slice().reverse().map(function (d) {
        return '<tr><td>' + fDia(d.iso) + '</td><td class="num">' + num(d.escaneos) + '</td><td class="num">' + num(d.nfc) + '</td><td class="num">' + num(d.qr) + '</td><td class="num">' + num(d.clics) + '</td>' + (esReal() ? '' : '<td class="num">' + num(d.resenas) + '</td>') + '</tr>';
      }).join("") + '</tbody></table>';
  }

  function renderResenasDia(serie) {
    var cont = $("g-resenas");
    $("t-resenas-dia").textContent = est ? "Reseñas nuevas de " + etqEst(est) + " por día" : "Reseñas nuevas por día";
    if (esReal()) { cont.innerHTML = '<p class="vacio-fase2">Las reseñas nuevas se leerán automáticamente de Google con la API del Perfil de Empresa (fase 2).</p>'; return; }
    var ks = est ? [est] : [5, 4, 3, 2, 1];
    var total = function (d) { return ks.reduce(function (s, k) { return s + d.porEstrella[k]; }, 0); };
    var g = ejes(serie, cont, Math.max.apply(null, serie.map(total))), s = g.svg;
    serie.forEach(function (d, i) {
      var acum = 0, x0 = g.x(i) - g.bw / 2, visibles = ks.filter(function (k) { return d.porEstrella[k]; });
      visibles.forEach(function (k, j) {
        var y1 = g.y(acum), y0 = g.y(acum + d.porEstrella[k]);
        // 2 px de separación entre segmentos; solo el de arriba lleva las esquinas redondeadas
        s += '<path data-i="' + i + '" class="seg-d" fill="' + COL[k] + '" d="' + barra(x0, y0, j ? y1 - 2 : y1, g.bw, j === visibles.length - 1) + '"/>';
        acum += d.porEstrella[k];
      });
    });
    cont.innerHTML = s + g.hits + '</svg>';
    conHover(cont, serie, function (d) {
      return '<b>' + fDia(d.iso) + '</b>' + ks.map(function (k) {
        return '<div class="fila"><span><i style="background:' + COL[k] + '"></i>' + etqEst(k) + '</span><span>' + d.porEstrella[k] + '</span></div>';
      }).join("") + (est ? "" : '<div class="fila" style="opacity:.8"><span>Total</span><span>' + d.resenas + '</span></div>');
    });
  }

  function renderLocales() {
    var datos = ids.map(function (id) {
      return { id: id, t: D.porDia[id].reduce(function (s, d) { s.e += d.escaneos; s.c += d.clics; return s; }, { e: 0, c: 0 }) };
    });
    var max = Math.max.apply(null, datos.map(function (d) { return d.t.e; })) || 1;
    $("g-locales").innerHTML = '<div class="bl">' + datos.map(function (d) {
      var tenue = filtro !== "todos" && filtro !== d.id;
      return '<div class="bl-nombre">' + esc(C.locales[d.id].corto) + '<small>' + num(d.t.c) + ' clics a Google</small></div>' +
        '<div class="bl-pista"><div class="bl-barra' + (tenue ? " tenue" : "") + '" style="width:' + (d.t.e / max * 78) + '%"></div>' +
        '<span class="bl-valor">' + num(d.t.e) + ' <span>· ' + pct(d.t.c, d.t.e) + '</span></span></div>';
    }).join("") + '</div>';
  }

  function renderMesas() {
    var sel = $("mesas-sel");
    sel.innerHTML = ids.map(function (id) { return '<option value="' + id + '"' + (id === localMesas ? " selected" : "") + '>' + esc(C.locales[id].corto) + '</option>'; }).join("");
    $("mesas-sel-cont").hidden = filtro !== "todos";
    var dm = D.mesas[localMesas], max = Math.max.apply(null, dm.mesas) || 1;
    var orden = dm.mesas.map(function (v, i) { return [i + 1, v]; }).sort(function (a, b) { return b[1] - a[1]; });
    var sinUso = dm.mesas.filter(function (v) { return v <= max * .15; }).length;
    $("mesas-sub").textContent = C.locales[localMesas].nombre + " · " + dm.mesas.length + " mesas";
    $("g-mesas").innerHTML = '<div class="mesas">' + dm.mesas.map(function (v, i) {
      var k = Math.min(RAMPA.length - 1, Math.floor(v / max * (RAMPA.length - 1) + .0001));
      return '<div class="mesa" data-m="' + (i + 1) + '" data-v="' + v + '" style="background:' + RAMPA[k] + ';color:' + (k >= 4 ? "#fff" : "var(--tinta-2)") + '">' + (i + 1) + '</div>';
    }).join("") + '</div>' +
      '<div class="mesas-pie"><span>Más escaneadas: <b>' + orden.slice(0, 3).map(function (o) { return "mesa " + o[0]; }).join(", ") + '</b> · Entrada: <b>' + num(dm.entrada) + '</b>' +
      (sinUso ? ' · <span class="txt-aviso">' + sinUso + ' mesas casi sin escaneos: revisad la placa</span>' : '') + '</span>' +
      '<span class="escala">Menos ' + RAMPA.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + ' Más</span></div>';
  }
  $("mesas-sel").addEventListener("change", function (e) { localMesas = e.target.value; renderMesas(); });
  $("g-mesas").addEventListener("pointermove", function (e) {
    var c = e.target.closest(".mesa");
    if (!c) return ocultarTip();
    verTip(e, '<b>Mesa ' + c.getAttribute("data-m") + '</b>' + num(+c.getAttribute("data-v")) + ' escaneos en 30 días');
  });
  $("g-mesas").addEventListener("pointerleave", ocultarTip);

  function plantilla(r) {
    var nombre = r.autor.split(" ")[0], local = C.locales[r.local].nombre;
    if (r.estrellas >= 4) return "¡Muchas gracias, " + nombre + "! Nos alegra mucho que disfrutaras en " + local + ". Te esperamos pronto.";
    if (r.estrellas === 3) return "Gracias por tu opinión, " + nombre + ". Tomamos nota de lo que comentas para mejorar. Esperamos verte pronto en " + local + ".";
    return "Sentimos mucho tu experiencia, " + nombre + ". No es lo que queremos para nuestros clientes. ¿Nos escribes a " + C.contacto.email + " para que podamos hablarlo? Gracias por avisarnos.";
  }

  function renderListaResenas() {
    $("t-lista-resenas").textContent = est ? "Reseñas nuevas de " + etqEst(est) : "Reseñas nuevas";
    if (esReal()) { $("l-resenas").innerHTML = '<p class="vacio-fase2">Con la API del Perfil de Empresa (fase 2) aquí aparecerán las reseñas nuevas de Google, con su plantilla de respuesta.</p>'; return; }
    var sel = nuevas(activos(), est);
    $("l-resenas").innerHTML = sel.length ? sel.slice(0, 40).map(function (r) {
      var estado = r.respondida
        ? '<span class="estado e-resuelta">Respondida en ' + (r.horasRespuesta < 24 ? r.horasRespuesta + " h" : Math.round(r.horasRespuesta / 24) + " d") + '</span>'
        : '<span class="estado e-pendiente">Sin responder</span>';
      return '<article class="qj"><div class="qj-cab"><span class="estrellas-txt" aria-label="' + r.estrellas + ' estrellas"><span>' + "★".repeat(r.estrellas) + '</span>' + "★".repeat(5 - r.estrellas) + '</span>' +
        '<b>' + esc(r.autor) + '</b><span>' + fDia(r.iso) + ' · ' + esc(C.locales[r.local].corto) + '</span>' + estado + '</div>' +
        '<p>' + esc(r.texto) + '</p>' +
        (r.respondida ? '' : '<button type="button" class="mini-boton" data-responder>Responder</button>' +
          '<div class="respuesta" hidden><textarea rows="3">' + esc(plantilla(r)) + '</textarea><button type="button" class="mini-boton" data-copiar>Copiar respuesta</button><small>En la fase 2 se publica directamente en Google desde aquí.</small></div>') +
        '</article>';
    }).join("") : '<p class="sub">Sin reseñas nuevas en este periodo.</p>';
  }

  function renderTemasQueja() {
    var t = M.temasQueja(D, activos()), max = t.length ? t[0].n : 1, total = t.reduce(function (s, x) { return s + x.n; }, 0);
    $("g-temas-queja").innerHTML = t.length ? '<div class="tq">' + t.map(function (x) {
      return '<span class="tq-n">' + x.nombre + '</span><span class="tq-pista"><span style="width:' + (x.n / max * 100) + '%"></span></span><span class="tq-v">' + x.n + ' · ' + pct(x.n, total) + '</span>';
    }).join("") + '</div>' : "";
  }

  function renderQuejas(q) {
    $("l-quejas").innerHTML = q.length ? q.map(function (x) {
      return '<article class="qj"><div class="qj-cab"><b>' + fDia(x.iso) + ' · ' + x.hora + '</b><span>' + esc(C.locales[x.local].corto) +
        (x.mesa ? ' · mesa ' + x.mesa : ' · entrada') + ' · ' + esc(x.via) + '</span><span class="cat">' + (M.CAT[x.categoria] || "Otro") + '</span>' +
        '<span class="estado e-' + x.estado.toLowerCase() + '">' + x.estado + '</span></div>' +
        '<p>' + esc(x.texto || "") + '</p>' +
        '<div class="qj-cab" style="margin-top:4px">' + (x.contacto ? "Dejó contacto para respuesta" : "Anónimo") + '</div></article>';
    }).join("") : '<p class="sub">Sin mensajes en este periodo.</p>';
  }

  /* ======================= tooltip ======================= */
  function verTip(e, html) {
    tip.innerHTML = html; tip.hidden = false;
    var r = tip.getBoundingClientRect(), xx = e.clientX + 14, yy = e.clientY - r.height - 12;
    if (xx + r.width > innerWidth - 8) xx = e.clientX - r.width - 14;
    if (yy < 8) yy = e.clientY + 16;
    tip.style.left = Math.max(8, xx) + "px"; tip.style.top = yy + "px";
  }
  function ocultarTip() { tip.hidden = true; }
  addEventListener("scroll", ocultarTip, { passive: true });

  /* ======================= render ======================= */
  function render() {
    renderFiltros();
    renderReal();
    renderPlacas();
  }
  function iniciar() {
    M.cargarDatos().then(function (r) { carga = r; D = r.datos; render(); });
  }
  var rt;
  addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { var s = M.serieDiaria(D, activos()); renderDias(s); renderResenasDia(s); }, 120);
  });
  render();      // primero con los datos de ejemplo, para que no haya pantalla en blanco
  iniciar();     // y después, si hay contador, con los reales
})();
