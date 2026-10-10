/* Datos SIMULADOS para el panel de la demo (30 días hasta ayer).
   Semilla fija: las cifras son siempre las mismas para el mismo día.
   Los datos REALES de Google (nota, reparto por estrellas, temas) están en config.js.
   En fase 2 este archivo se sustituye por el contador real y la API de Google. */
(function () {
  var C = window.CONFIG, N = window.NECO;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rnd = mulberry32(20261009);
  function entre(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
  function ruido(p) { return 1 + (rnd() * 2 - 1) * p; }
  function elegir(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function ponderado(pares) {
    var total = pares.reduce(function (s, p) { return s + p[1]; }, 0), r = rnd() * total;
    for (var i = 0; i < pares.length; i++) { r -= pares[i][1]; if (r <= 0) return pares[i][0]; }
    return pares[pares.length - 1][0];
  }
  function poisson(l) {
    var L = Math.exp(-l), k = 0, p = 1;
    do { k++; p *= rnd(); } while (p > L);
    return k - 1;
  }

  /* Perfil de cada local: escaneos base, factor por día (dom..sáb), % que pulsa Google,
     % de esos que llega a publicar la reseña y tasa de mensajes privados */
  var perfil = {
    ruzafa:  { base: 88, dia: [1.35, .80, .80, .85, .95, 1.15, 1.45], google: .42, publica: .14, quejas: .005 },
    saler:   { base: 72, dia: [1.50, .72, .72, .75, .80, 1.10, 1.60], google: .38, publica: .12, quejas: .006 },
    alfafar: { base: 44, dia: [1.50, .80, .78, .80, .85, 1.00, 1.50], google: .39, publica: .12, quejas: .005 },
    paterna: { base: 40, dia: [0, 1.0, 1.05, 1.05, 1.0, .80, 0],      google: .31, publica: .15, quejas: .004 },
  };
  /* Reparto de estrellas de las reseñas nuevas: pedirla en la mesa a todos los
     clientes (sin filtrar) suele dar una mezcla algo mejor que la histórica */
  var mezclaNueva = [[5, 64], [4, 22], [3, 7], [2, 3], [1, 4]];

  var hoy = N.ahoraMadrid().iso, dias = [];
  for (var i = 30; i >= 1; i--) dias.push(N.sumarDias(hoy, -i));

  var ids = Object.keys(C.locales);
  var porDia = {}, mesas = {}, horas = {}, quejas = [], resenas = [];

  var textosQueja = [
    ["El arroz de la segunda bandeja estaba frío.", "comida"],
    ["Tardaron bastante en reponer el pescado a la plancha.", "reposicion"],
    ["La mesa estaba pegajosa cuando nos sentamos.", "limpieza"],
    ["Mucha cola en la entrada a las 14:15, más de 20 minutos esperando.", "espera"],
    ["En el baño no había papel.", "limpieza"],
    ["No encontré información de alérgenos en los postres.", "alergenos"],
    ["Hacía mucho calor en la zona del fondo.", "otro"],
    ["Un camarero fue algo brusco al retirar los platos.", "atencion"],
    ["No quedaba paella cuando llegamos a las 15:45.", "reposicion"],
    ["La música estaba demasiado alta para comer tranquilos.", "otro"],
    ["Las patatas estaban muy saladas hoy.", "comida"],
    ["Nos cobraron la bebida dos veces. Lo arreglaron en caja, pero os aviso.", "atencion"],
    ["La máquina de helado no funcionaba.", "comida"],
    ["Echo de menos más opciones veganas.", "otro"],
    ["Pedimos una trona para el bebé y tardaron mucho en traerla.", "atencion"],
    ["Los vasos tenían marcas de cal.", "limpieza"],
    ["Todo bien, pero la fruta estaba algo verde.", "comida"],
    ["Faltaban cubiertos limpios en la zona de postres.", "reposicion"],
  ];

  /* Textos de ejemplo (inventados) para las reseñas nuevas, por estrellas */
  var textosResena = {
    5: ["Paella buenísima y muchísima variedad. Volveremos seguro.", "Muy buena relación calidad-precio y el personal muy atento.",
        "Todo fresco y reponen rápido. El codillo, espectacular.", "Ideal para venir con niños: hay de todo y a buen precio.",
        "Gran variedad de arroces y postres caseros. Repetiremos.", "Comida mediterránea de verdad y un trato de diez."],
    4: ["Buena comida a precio fijo. En hora punta hay algo de cola.", "Muy bien en general; los postres podrían mejorar un poco.",
        "Buen buffet y la paella muy rica. Había bastante ruido.", "Variedad y precio correctos. Volveremos.",
        "Buena atención, aunque al final del turno faltaba algún plato."],
    3: ["Correcto para lo que cuesta, sin más.", "La comida bien, pero tardaban en reponer las bandejas.",
        "Mucha gente y las mesas algo pegajosas.", "El arroz bien; la carne, algo seca."],
    2: ["Mucha espera y poca reposición a última hora.", "Varias bandejas estaban frías.", "Ruido excesivo y mesas sin recoger."],
    1: ["Llegamos a las 15:30 y casi no quedaba comida.", "Mala experiencia con la limpieza de la mesa.",
        "Nos cobraron mal la bebida y nadie lo solucionó."],
  };
  var nombres = ["Laura", "Javier", "Marta", "Carlos", "Lucía", "Pablo", "Ana", "Sergio", "Elena", "Raúl", "Nuria", "Vicent", "Amparo", "Jordi", "Paula", "Andrés", "Rocío", "Toni", "Sarah", "Tom"];
  var iniciales = "GMSLRPCVTBFN";

  /* Reparto de los escaneos de un día por horas, según los servicios que abren */
  var PERFIL_HORAS = {
    desayuno: { 8: .35, 9: .40, 10: .25 },
    comida: { 13: .22, 14: .38, 15: .28, 16: .12 },
    cena: { 20: .14, 21: .42, 22: .34, 23: .10 },
  };
  function repartirHoras(l, iso, total, matriz) {
    var dow = N.fechaDeIso(iso).getDay(), pesos = {};
    var cena = N.abreServicio(l, iso, "cena"), madruga = N.franjasFecha(l, iso).some(function (f) { return N.aMin(f.de) < 600; });
    function suma(perfil, share) { Object.keys(perfil).forEach(function (h) { pesos[h] = (pesos[h] || 0) + perfil[h] * share; }); }
    if (madruga) { suma(PERFIL_HORAS.desayuno, .14); suma(PERFIL_HORAS.comida, .86); }
    else if (cena) { suma(PERFIL_HORAS.comida, dow === 0 || dow === 6 ? .58 : .55); suma(PERFIL_HORAS.cena, dow === 0 || dow === 6 ? .42 : .45); }
    else suma(PERFIL_HORAS.comida, 1);
    var resto = total;
    Object.keys(pesos).forEach(function (h, i, arr) {
      var n = i === arr.length - 1 ? resto : Math.min(resto, Math.round(total * pesos[h] * ruido(.15)));
      matriz[dow][+h] += n; resto -= n;
    });
  }

  function horaServicio(l, iso) {
    return ponderado(N.abreServicio(l, iso, "cena") ? [["13", 3], ["14", 5], ["15", 4], ["21", 3], ["22", 2]] : [["13", 3], ["14", 5], ["15", 4]]) +
      ":" + String(entre(0, 59)).padStart(2, "0");
  }

  ids.forEach(function (id) {
    var l = C.locales[id], pf = perfil[id] || { base: 50, dia: [1, 1, 1, 1, 1, 1, 1], google: .38, publica: .32, quejas: .005 };
    porDia[id] = [];
    horas[id] = [0, 1, 2, 3, 4, 5, 6].map(function () { return new Array(24).fill(0); });
    var totalMesa = 0, totalEntrada = 0;

    dias.forEach(function (iso) {
      var dow = N.fechaDeIso(iso).getDay();
      var abierto = N.franjasFecha(l, iso).length > 0;
      var factor = N.tipoDia(iso) === "festivo" ? pf.dia[0] : pf.dia[dow];
      var esc = abierto ? Math.max(0, Math.round(pf.base * factor * ruido(.16))) : 0;
      var nfc = Math.round(esc * (.6 + rnd() * .06));
      var entrada = Math.round(esc * (.16 + rnd() * .05));
      var clics = Math.round(esc * pf.google * ruido(.12));
      var diasAtras = (N.fechaDeIso(hoy) - N.fechaDeIso(iso)) / 864e5;

      // Reseñas nuevas publicadas en Google tras pulsar el botón
      var nr = poisson(clics * pf.publica), dia = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (var r = 0; r < nr; r++) {
        var est = ponderado(mezclaNueva);
        dia[est]++;
        // Respuesta del propietario: más rápida en las negativas y casi siempre en las antiguas
        var respondida = diasAtras > 3 ? rnd() < (est <= 2 ? .97 : .82) : diasAtras > 1 ? rnd() < .6 : rnd() < .3;
        resenas.push({
          iso: iso, hora: horaServicio(l, iso), local: id, estrellas: est,
          texto: elegir(textosResena[est]),
          autor: elegir(nombres) + " " + iniciales[entre(0, iniciales.length - 1)] + ".",
          respondida: respondida,
          horasRespuesta: respondida ? Math.max(1, Math.round((est <= 2 ? 5 : 20) * Math.exp((rnd() - .5) * 1.4))) : null,
        });
      }
      porDia[id].push({ iso: iso, escaneos: esc, nfc: nfc, qr: esc - nfc, entrada: entrada, clics: clics, resenas: nr, porEstrella: dia });
      totalMesa += esc - entrada; totalEntrada += entrada;
      if (esc) repartirHoras(l, iso, esc, horas[id]);

      // Mensajes privados
      var nq = poisson(esc * pf.quejas);
      for (var q = 0; q < nq; q++) {
        var t = elegir(textosQueja);
        quejas.push({
          iso: iso, hora: horaServicio(l, iso),
          local: id, mesa: rnd() < .85 ? entre(1, l.mesas) : null, via: rnd() < .62 ? "NFC" : "QR",
          texto: t[0], categoria: t[1], contacto: rnd() < .55,
          estado: diasAtras > 4 ? (rnd() < .85 ? "Resuelta" : "Respondida") : diasAtras > 1 ? (rnd() < .6 ? "Respondida" : "Pendiente") : "Pendiente",
        });
      }
    });

    // Reparto por mesa: unas mesas más demandadas que otras (ventana, terraza…)
    var pesos = [];
    for (var m = 0; m < l.mesas; m++) pesos.push(Math.pow(rnd(), 1.6) + .25);
    var sumaPesos = pesos.reduce(function (s, p) { return s + p; }, 0);
    mesas[id] = { entrada: totalEntrada, mesas: pesos.map(function (p) { return Math.round(totalMesa * p / sumaPesos); }) };
  });

  var orden = function (a, b) { return (b.iso + b.hora).localeCompare(a.iso + a.hora); };
  quejas.sort(orden);
  resenas.sort(orden);

  window.DEMO = { real: false, dias: dias, porDia: porDia, mesas: mesas, horas: horas, quejas: quejas, resenas: resenas };
})();
