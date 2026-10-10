/* Funciones compartidas por la página de destino, el panel y el expositor. */
(function () {
  var C = window.CONFIG;

  function loc(v, lang) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[lang] || v.es || "";
  }

  function fmt(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (_, k) {
      return vars && vars[k] != null ? vars[k] : "";
    });
  }

  function eur(n, lang, decimales) {
    var d = decimales == null ? 2 : decimales;
    return new Intl.NumberFormat(lang === "en" ? "en-IE" : "es-ES", {
      style: "currency", currency: "EUR",
      minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: "always",
    }).format(n);
  }

  function num(n, lang) {
    return new Intl.NumberFormat(lang === "en" ? "en-IE" : "es-ES", { useGrouping: "always" }).format(n);
  }

  function aMin(hhmm) {
    var p = hhmm.split(":");
    return +p[0] * 60 + +p[1];
  }

  function isoDe(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function fechaDeIso(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  /* Fecha y hora actuales en Valencia, aunque el móvil del turista
     tenga otra zona horaria. */
  function ahoraMadrid() {
    var partes = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
    var iso = partes.year + "-" + partes.month + "-" + partes.day;
    return { iso: iso, dow: fechaDeIso(iso).getDay(), min: +partes.hour * 60 + +partes.minute };
  }

  function tipoDia(iso) {
    if (C.festivos.indexOf(iso) !== -1) return "festivo";
    var dow = fechaDeIso(iso).getDay();
    return dow === 0 || dow === 6 ? "finde" : "laborable";
  }

  function franjasDia(local, dow) {
    return local.horario
      .filter(function (f) { return f.dias.indexOf(dow) !== -1; })
      .sort(function (a, b) { return aMin(a.de) - aMin(b.de); });
  }

  /* Franjas de una fecha concreta (tiene en cuenta los festivos) */
  function franjasFecha(local, iso) {
    if (local.cierraFestivos && C.festivos.indexOf(iso) !== -1) return [];
    return franjasDia(local, fechaDeIso(iso).getDay());
  }

  function sumarDias(iso, n) {
    var d = fechaDeIso(iso);
    d.setDate(d.getDate() + n);
    return isoDe(d);
  }

  function abreServicio(local, iso, servicio) {
    return franjasFecha(local, iso).some(function (f) { return f.servicio === servicio; });
  }

  /* Estado "abierto ahora / cerrado · abre…" */
  function estadoAhora(local) {
    var a = ahoraMadrid();
    var hoy = franjasFecha(local, a.iso);
    for (var i = 0; i < hoy.length; i++) {
      if (a.min >= aMin(hoy[i].de) && a.min < aMin(hoy[i].a)) return { abierto: true, hasta: hoy[i].a };
    }
    for (var d = 0; d < 15; d++) {
      var iso = sumarDias(a.iso, d);
      var fr = franjasFecha(local, iso);
      for (var j = 0; j < fr.length; j++) {
        if (d > 0 || aMin(fr[j].de) > a.min) return { abierto: false, dias: d, dow: fechaDeIso(iso).getDay(), abre: fr[j].de };
      }
    }
    return { abierto: false };
  }

  /* Presupuesto orientativo de grupo con las tarifas públicas. */
  function presupuesto(localId, iso, servicio, adultos, n105, n140) {
    var local = C.locales[localId];
    var t = Object.assign({}, C.tarifas, local.tarifas || {});
    var td = tipoDia(iso);
    var precioAdulto = td === "laborable" ? t.adultoLaborable : t.adultoFinde;
    var lineas = [
      { clave: "adultos", n: adultos, precio: precioAdulto },
      { clave: "nino105", n: n105, precio: t.nino105 },
      { clave: "nino140", n: n140, precio: t.nino140 },
    ].filter(function (l) { return l.n > 0; });
    lineas.forEach(function (l) { l.subtotal = Math.round(l.n * l.precio * 100) / 100; });
    return {
      abierto: abreServicio(local, iso, servicio),
      tipoDia: td,
      lineas: lineas,
      personas: adultos + n105 + n140,
      total: lineas.reduce(function (s, l) { return s + l.subtotal; }, 0),
    };
  }

  function urlResena(local) {
    return local.resenaUrl || "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(local.placeId);
  }

  function urlLocal(id, mesa, via) {
    var u = C.baseUrl + "?local=" + id;
    if (mesa) u += "&mesa=" + mesa;
    if (via) u += "&src=" + via;
    return u;
  }

  window.NECO = {
    loc: loc, fmt: fmt, eur: eur, num: num, aMin: aMin, isoDe: isoDe, fechaDeIso: fechaDeIso,
    ahoraMadrid: ahoraMadrid, tipoDia: tipoDia, franjasDia: franjasDia, franjasFecha: franjasFecha,
    sumarDias: sumarDias, abreServicio: abreServicio,
    estadoAhora: estadoAhora, presupuesto: presupuesto, urlResena: urlResena, urlLocal: urlLocal,
  };
})();
