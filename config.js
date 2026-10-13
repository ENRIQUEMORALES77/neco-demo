/* =====================================================================
   CONFIGURACIÓN ÚNICA DE LA DEMO
   ---------------------------------------------------------------------
   Todo lo que cambia de un restaurante a otro está aquí: locales,
   Place IDs de Google, horarios, tarifas, enlaces y textos de marca.
   Para adaptar la demo a otro restaurante, duplica este archivo y
   cambia los valores (las claves deben mantenerse).

   Textos bilingües: { es: "...", en: "..." }. Si solo pones un texto
   plano, se usa en los dos idiomas.
   ===================================================================== */

window.CONFIG = {

  /* URL pública donde se publica la página. Se usa para generar los QR
     y las URL de las pegatinas NFC. Termina siempre en "/".
     Ahora: GitHub Pages (pruebas). Con el dominio definitivo:
       baseUrl: "https://xn--reseasnecobuffet-9tb.com/"  (reseñasnecobuffet.com en punycode)
       dominioVisible: "reseñasnecobuffet.com"
     y copiar tools/CNAME.dominio-final a la raíz con el nombre CNAME. */
  baseUrl: "https://enriquemorales77.github.io/neco-demo/",
  dominioVisible: "enriquemorales77.github.io/neco-demo",

  marca: {
    nombre: "Neco Buffet",
    lema: { es: "Buffet libre mediterráneo", en: "Mediterranean all-you-can-eat buffet" },
    logo: "img/logo-neco.png",              // verde, para fondos claros
    logoBlanco: "img/logo-neco-blanco.png", // para fondos oscuros / fotos
    web: "https://necobuffet.com",
    colores: {
      primario: "#6E8273",   // verde salvia de necobuffet.com
      oscuro:   "#0E0E0E",
      fondo:    "#FAF7F2",   // crema cálido
      acento:   "#C8623E",   // terracota (paella, barro)
    },
    pie: "Demo preparada por Enrique Morales",
  },

  contacto: {
    telefono: "963 942 188",
    email: "info@necobuffet.com",
    /* WhatsApp que recibe las quejas privadas y las solicitudes de grupo
       (con prefijo de país, sin "+" ni espacios). Cada local puede tener
       el suyo con su propio campo "whatsapp". Vacío = modo demo (sin envío). */
    whatsapp: "",
  },

  enlaces: {
    platos:    "https://necobuffet.com/nuestros-platos/",
    precios:   "https://necobuffet.com/precios-buffet/",
    instagram: "https://www.instagram.com/neco.buffet/",
    tiktok:    "https://www.tiktok.com/@necobuffet",
    facebook:  "https://www.facebook.com/buffetneco/",
  },

  /* Tarifas públicas (necobuffet.com/precios-buffet, revisadas el 09/10/2026).
     Mismo precio en comida y en cena. Un local puede sobrescribirlas
     con su propio objeto "tarifas". */
  tarifas: {
    adultoLaborable: 14.90,
    adultoFinde:     16.50,   // sábados, domingos y festivos
    nino105:          5.00,   // niños hasta 105 cm
    nino140:          8.50,   // niños de 105 a 140 cm
    bebidaIncluida:  false,
  },

  /* Festivos que aplican la tarifa de fin de semana (formato AAAA-MM-DD).
     Nacionales + Comunitat Valenciana + locales de Valencia ciudad.
     2027 es provisional: revisar cuando se publique el calendario oficial (DOGV). */
  festivos: [
    "2026-10-09", "2026-10-12", "2026-12-08", "2026-12-25",
    "2027-01-01", "2027-01-06", "2027-01-22", "2027-03-19", "2027-03-26",
    "2027-03-29", "2027-04-05", "2027-05-01", "2027-06-24", "2027-08-15",
    "2027-10-09", "2027-10-12", "2027-11-01", "2027-12-06", "2027-12-08",
    "2027-12-25",
  ],

  /* Servicios comunes a todos los locales (necobuffet.com) */
  servicios: [
    { ico: "🍽", es: "Más de 200 platos mediterráneos que rotan cada día", en: "Over 200 Mediterranean dishes, changing every day" },
    { ico: "🌱", es: "Opciones vegetarianas y sin gluten", en: "Vegetarian and gluten-free options" },
    { ico: "🛵", es: "También a domicilio con Glovo y Uber Eats", en: "Also delivered via Glovo and Uber Eats" },
    { ico: "🪑", es: "Sin reserva: por orden de llegada", en: "No booking needed: first come, first served" },
  ],

  /* Formulario de grupos y celebraciones */
  eventos: {
    tipos: ["cumpleanos", "comunion", "bautizo", "boda", "empresa", "grupo", "otro"],
    // Tipos para los que se sugiere el local con espacio exclusivo
    tiposCelebracion: ["comunion", "bautizo", "boda", "empresa"],
    destinatario: "Responsable de eventos",
    maxPersonas: 300,
  },

  /* Contador real (Google Sheets). Si endpoint está vacío, no se envía nada y el
     panel usa datos de ejemplo. Ver README → "Contador real" y tools/apps-script/. */
  contador: {
    endpoint: "",            // URL de la aplicación web de Apps Script (termina en /exec)
    guardarMensajes: true,   // guarda también el texto de las quejas y solicitudes en la hoja
  },

  /* ---------------------------------------------------------------
     LOCALES
     · La clave (ruzafa, saler…) es el valor de ?local= en la URL.
     · placeId: identificador de Google Maps para el enlace de reseña.
       Calculados a partir de las fichas de Maps enlazadas en
       necobuffet.com y comprobados en Google Maps el 09/10/2026.
     · resenaUrl (opcional): si el gerente copia el enlace "Pedir reseñas"
       de su Perfil de Empresa (g.page/r/...), pégalo aquí y tendrá
       prioridad sobre el placeId.
     · horario: dias 0=domingo, 1=lunes … 6=sábado.
     · mesas: número de mesas (solo se usa en el panel y el expositor).
     · cierraFestivos (opcional): true si el local no abre en los festivos de la lista.
     · google: datos reales de Google Maps (nota, nº de reseñas, reparto por estrellas y
       temas más mencionados). Los usan el panel y la presentación. Actualizar a mano
       hasta la fase 2 (API del Perfil de Empresa).
     · whatsapp (opcional): número propio del local; si no, se usa contacto.whatsapp.
     · llegar: metro, bus, tren, parking { corto, texto } y cerca (texto o null si no aplica).
     · accesibilidad: texto sobre acceso adaptado; null = «pregunta al personal».
     · cierres (opcional): periodos de vacaciones [[desde, hasta], ...].
     · destacado / notaPrecios (opcionales): una frase para la cabecera / bajo los precios.
     --------------------------------------------------------------- */
  locales: {
    ruzafa: {
      nombre: "Neco Paseo de Ruzafa",
      corto: "Ruzafa",
      zona: { es: "Centro de Valencia", en: "Valencia city centre" },
      direccion: "Paseo de Ruzafa, 20 · 46002 Valencia",
      placeId: "ChIJm9_aorRIYA0RCtUoq7cHfe0",
      verificado: true,
      resenaUrl: "",
      maps: "https://maps.app.goo.gl/BA9P2bkxVNaug1WE8",
      imagen: "img/ruzafa.webp",
      horario: [
        { dias: [0,1,2,3,4,5,6], servicio: "comida", de: "13:00", a: "16:30" },
        { dias: [0,1,2,3,4],     servicio: "cena",   de: "20:00", a: "23:00" },
        { dias: [5,6],           servicio: "cena",   de: "20:00", a: "23:30" },
      ],
      llegar: {
        metro: { es: "Colón o Xàtiva (líneas 3 y 5)", en: "Colón or Xàtiva (lines 3 & 5)" },
        bus: "6, 8, 9, 10, 13, 15, 19, 28, 35, 62, 71, 81",
        tren: { es: "Estación del Norte, a 200 m", en: "Estación del Norte, 200 m away" },
        parking: { corto: { es: "Parkings públicos cerca", en: "Public car parks nearby" },
                   texto: { es: "Hay aparcamientos públicos en la zona centro.", en: "There are public car parks around the city centre." } },
        cerca: { es: "Plaza del Ayuntamiento, teatros y comercios del centro", en: "Plaza del Ayuntamiento, theatres and city-centre shops" },
      },
      accesibilidad: null,   // a confirmar con el local (acceso en silla de ruedas, aseo adaptado)
      google: {   // dato real de Google Maps (09/10/2026)
        nota: 4.1, resenas: 3639, fecha: "2026-10-09",
        estrellas: { 5: 1835, 4: 948, 3: 436, 2: 193, 1: 227 },
        temas: [["paella", 236], ["fideuá", 28], ["buffet libre", 27], ["dulces", 25], ["saludable", 17], ["surtido", 17], ["precio fijo", 12], ["codillo", 12]],
        // Competencia cercana (Google, 10/10/2026). Las cifras de más de 1.000 reseñas
        // son aproximadas, porque Google las redondea ("6,8 mil").
        competencia: [
          { nombre: "Muerde La Pasta (Ribera)", nota: 4.0, resenas: 6800, tipo: "Buffet italiano", precio: "10-20 €" },
          { nombre: "Dididaodao Buffet Fusión", nota: 4.3, resenas: 3200, tipo: "Buffet asiático", precio: "20-30 €" },
          { nombre: "AOYAMA (Joaquín Costa)", nota: 4.2, resenas: 4000, tipo: "Buffet japonés", precio: "20-30 €" },
          { nombre: "Restaurante Japonés KOBE", nota: 4.4, resenas: 1800, tipo: "Buffet japonés", precio: "20-30 €" },
          { nombre: "Punk BBQ & Sushi", nota: 4.2, resenas: 1300, tipo: "Buffet", precio: "20-30 €" },
        ],
      },
      mesas: 45,
    },

    saler: {
      nombre: "Neco CC El Saler",
      corto: "El Saler",
      zona: { es: "Centro Comercial El Saler", en: "El Saler shopping centre" },
      direccion: "CC El Saler (planta alta) · Av. Profesor López Piñero, 16 · 46013 Valencia",
      placeId: "ChIJ5W8TT-BKYA0R20eR7CG0ZQA",
      verificado: true,
      resenaUrl: "",
      maps: "https://maps.app.goo.gl/Jee9G3zpQutcrrow8",
      imagen: "img/saler.webp",
      horario: [
        { dias: [0,1,2,3,4,5,6], servicio: "comida", de: "13:00", a: "16:30" },
        { dias: [0,1,2,3,4],     servicio: "cena",   de: "20:00", a: "23:00" },
        { dias: [5,6],           servicio: "cena",   de: "20:00", a: "23:30" },
      ],
      destacado: { es: "El primer Neco · desde 1995", en: "The first Neco · since 1995" },
      llegar: {
        metro: null,
        bus: "13, 14, 15, 35, 95 y Orbital",
        tren: null,
        parking: { corto: { es: "Gratis tardes y fines de semana", en: "Free evenings & weekends" },
                   texto: { es: "Aparcamiento gratuito por las tardes y los fines de semana.", en: "Free parking in the evenings and at weekends." } },
        cerca: { es: "A un minuto de la Ciudad de las Artes y las Ciencias y de la Ciudad de la Justicia", en: "One minute from the City of Arts and Sciences" },
      },
      accesibilidad: null,
      google: {   // dato real de Google Maps (09/10/2026)
        nota: 4.0, resenas: 4262, fecha: "2026-10-09",
        estrellas: { 5: 2001, 4: 1106, 3: 574, 2: 253, 1: 328 },
        temas: [["paella", 301], ["fideuá", 45], ["centro comercial", 32], ["Ciencias", 17], ["buffet libre", 16], ["Oceanogràfic", 12], ["codillo", 12], ["precio fijo", 10], ["natillas", 10], ["arroz al horno", 9]],
        // Competencia cercana (Google, 10/10/2026). Las cifras de más de 1.000 reseñas
        // son aproximadas, porque Google las redondea ("6,8 mil").
        competencia: [
          { nombre: "Muerde la Pasta (CC El Saler)", nota: 3.9, resenas: 4400, tipo: "Buffet italiano", precio: "10-20 €" },
          { nombre: "Kamado Asian Food (CC El Saler)", nota: 4.3, resenas: 2100, tipo: "Asiático", precio: "20-30 €" },
          { nombre: "WOK XIAO buffet libre", nota: 4.4, resenas: 1900, tipo: "Buffet asiático", precio: "10-20 €" },
        ],
      },
      mesas: 50,
    },

    alfafar: {
      nombre: "Neco Alfafar",
      corto: "Alfafar",
      zona: { es: "Alfafar", en: "Alfafar" },
      direccion: "CC Parque Albufera · Av. Reyes Católicos, s/n · 46910 Alfafar",
      placeId: "ChIJIbxNX7FOYA0R3XJooKz2h7Q",
      verificado: true,
      resenaUrl: "",
      maps: "https://maps.app.goo.gl/2Df1A5AqvexewhMZ6",
      imagen: "img/alfafar.webp",
      horario: [
        { dias: [0,1,2,3,4,5,6], servicio: "comida", de: "13:15", a: "16:30" },
        { dias: [5,6],           servicio: "cena",   de: "20:00", a: "23:00" },
      ],
      notaHorario: { es: "Cenas solo viernes y sábado.", en: "Dinner on Fridays and Saturdays only." },
      llegar: {
        metro: null,
        bus: { es: "Línea Sedaví – Valencia", en: "Sedaví – Valencia line" },
        tren: null,
        parking: { corto: { es: "Gratis en el centro comercial", en: "Free at the shopping centre" },
                   texto: { es: "Aparcamiento gratuito en el centro comercial Parque Albufera.", en: "Free parking at Parque Albufera shopping centre." } },
        cerca: { es: "MN4, Ikea, Carrefour, Media Markt y Leroy Merlin", en: "MN4, Ikea, Carrefour, Media Markt and Leroy Merlin" },
      },
      accesibilidad: null,
      google: {   // dato real de Google Maps (09/10/2026)
        nota: 4.0, resenas: 1803, fecha: "2026-10-09",
        estrellas: { 5: 763, 4: 535, 3: 305, 2: 91, 1: 109 },
        temas: [["paella", 92], ["fruta", 24], ["fideuá", 16], ["sabor", 9], ["surtido", 8], ["costillas", 8], ["económico", 8], ["saludable", 6], ["oferta", 6]],
        // Competencia cercana (Google, 10/10/2026). Las cifras de más de 1.000 reseñas
        // son aproximadas, porque Google las redondea ("6,8 mil").
        competencia: [
          { nombre: "Colonial Buffet Alfafar", nota: 3.9, resenas: 8400, tipo: "Buffet", precio: "20-30 €" },
          { nombre: "Asador City Wok Alfafar", nota: 3.8, resenas: 6400, tipo: "Buffet wok", precio: "20-30 €" },
          { nombre: "SushiTok Alfafar", nota: 4.2, resenas: 2700, tipo: "Buffet japonés", precio: "20-30 €" },
          { nombre: "Amazing Dinosaurios Buffet", nota: 4.1, resenas: 1500, tipo: "Buffet asiático", precio: "20-30 €" },
          { nombre: "Kaisen Experience Alfafar", nota: 4.3, resenas: 1100, tipo: "Buffet japonés", precio: "20-30 €" },
        ],
      },
      mesas: 40,
    },

    paterna: {
      nombre: "Neco Parque Tecnológico",
      corto: "Paterna",
      zona: { es: "Parque Tecnológico · Paterna", en: "Technology Park · Paterna" },
      direccion: "Ronda Narcís Monturiol, 2 · 46980 Paterna",
      placeId: "ChIJIWJnxEBbYA0Rd4iO3dOSKp8",
      verificado: true,
      resenaUrl: "",
      maps: "https://maps.app.goo.gl/Xjb5Xa6eDLuCFudD8",
      imagen: "img/paterna.webp",
      horario: [
        { dias: [1,2,3,4,5], servicio: "comida", de: "07:30", a: "16:30" },
      ],
      notaHorario: { es: "Cafetería y buffet. Cerrado del 25 de diciembre al 6 de enero.", en: "Café and buffet. Closed from 25 December to 6 January." },
      cierres: [["2026-12-25", "2027-01-06"]],   // vacaciones (AAAA-MM-DD, ambos incluidos)
      notaPrecios: {
        es: "Trabajadores del Parque: buffet + bebida 15,00 € · con café 16,15 €. Neco para llevar: 14,50 €/kg.",
        en: "Technology Park staff: buffet + drink €15.00 · with coffee €16.15. Neco to go: €14.50/kg.",
      },
      llegar: {
        metro: null,
        bus: { es: "Edetania 130 y 131 (desde Valencia) · 1 y 3 (desde Paterna)", en: "Edetania 130 & 131 (from Valencia) · 1 & 3 (from Paterna)" },
        tren: null,
        parking: { corto: { es: "2,5 h gratis", en: "2.5 h free" },
                   texto: { es: "Aparcamiento gratuito 2,5 horas en el Centro de Negocios Destro.", en: "2.5 hours of free parking at Destro Business Centre." } },
        cerca: { es: "Ciudad Deportiva del Valencia CF, Heron City y Kinépolis", en: "Valencia CF training ground, Heron City and Kinépolis" },
      },
      accesibilidad: null,
      espacioCelebraciones: true,   // comuniones, bautizos, bodas, empresa
      cierraFestivos: true,         // SUPOSICIÓN (parque empresarial): confirmar con el local
      google: {   // dato real de Google Maps (09/10/2026)
        nota: 4.0, resenas: 732, fecha: "2026-10-09",
        estrellas: { 5: 306, 4: 238, 3: 124, 2: 38, 1: 26 },
        temas: [["bocadillos", 19], ["paella", 15], ["Parque Tecnológico", 12], ["peso", 8], ["pescado", 6], ["buffet libre", 5], ["saludable", 5]],
        // Competencia cercana (Google, 10/10/2026). Las cifras de más de 1.000 reseñas
        // son aproximadas, porque Google las redondea ("6,8 mil").
        competencia: [
          { nombre: "Restaurante Esteban Montesinos", nota: 4.2, resenas: 852, tipo: "Menú del día", precio: "20-30 €" },
          { nombre: "La terraza del parque", nota: 4.2, resenas: 471, tipo: "Cocina valenciana", precio: "10-20 €" },
          { nombre: "Restaurante De Lucas", nota: 4.5, resenas: 405, tipo: "Cocina valenciana", precio: "10-20 €" },
          { nombre: "Restaurante Norte cafetería", nota: 4.1, resenas: 236, tipo: "Menú del día", precio: "10-30 €" },
        ],
      },
      mesas: 60,
    },
  },
};
