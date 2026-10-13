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
    lema: { es: "Buffet libre mediterráneo", en: "Mediterranean all-you-can-eat buffet", ca: "Bufet lliure mediterrani", fr: "Buffet méditerranéen à volonté", de: "Mediterranes All-you-can-eat-Buffet", it: "Buffet libero mediterraneo" },
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
    { ico: "🍽", es: "Más de 200 platos mediterráneos que rotan cada día", en: "Over 200 Mediterranean dishes, changing every day", ca: "Més de 200 plats mediterranis que canvien cada dia", fr: "Plus de 200 plats méditerranéens qui changent chaque jour", de: "Über 200 mediterrane Gerichte, die täglich wechseln", it: "Oltre 200 piatti mediterranei che cambiano ogni giorno" },
    { ico: "🌱", es: "Opciones vegetarianas y sin gluten", en: "Vegetarian and gluten-free options", ca: "Opcions vegetarianes i sense gluten", fr: "Options végétariennes et sans gluten", de: "Vegetarische und glutenfreie Optionen", it: "Opzioni vegetariane e senza glutine" },
    { ico: "🛵", es: "También a domicilio con Glovo y Uber Eats", en: "Also delivered via Glovo and Uber Eats", ca: "També a domicili amb Glovo i Uber Eats", fr: "Aussi en livraison avec Glovo et Uber Eats", de: "Auch per Lieferung mit Glovo und Uber Eats", it: "Anche a domicilio con Glovo e Uber Eats" },
    { ico: "🪑", es: "Sin reserva: por orden de llegada", en: "No booking needed: first come, first served", ca: "Sense reserva: per orde d'arribada", fr: "Sans réservation : par ordre d'arrivée", de: "Keine Reservierung: nach Ankunft", it: "Senza prenotazione: in ordine di arrivo" },
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
      zona: { es: "Centro de Valencia", en: "Valencia city centre", ca: "Centre de València", fr: "Centre de Valence", de: "Zentrum von Valencia", it: "Centro di Valencia" },
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
        metro: { es: "Colón o Xàtiva (líneas 3 y 5)", en: "Colón or Xàtiva (lines 3 & 5)", ca: "Colón o Xàtiva (línies 3 i 5)", fr: "Colón ou Xàtiva (lignes 3 et 5)", de: "Colón oder Xàtiva (Linien 3 und 5)", it: "Colón o Xàtiva (linee 3 e 5)" },
        bus: "6, 8, 9, 10, 13, 15, 19, 28, 35, 62, 71, 81",
        tren: { es: "Estación del Norte, a 200 m", en: "Estación del Norte, 200 m away", ca: "Estació del Nord, a 200 m", fr: "Gare du Nord (Estación del Norte), à 200 m", de: "Bahnhof Estación del Norte, 200 m entfernt", it: "Stazione del Nord, a 200 m" },
        parking: { corto: { es: "Parkings públicos cerca", en: "Public car parks nearby", ca: "Aparcaments públics a prop", fr: "Parkings publics à proximité", de: "Öffentliche Parkhäuser in der Nähe", it: "Parcheggi pubblici vicini" },
                   texto: { es: "Hay aparcamientos públicos en la zona centro.", en: "There are public car parks around the city centre.", ca: "Hi ha aparcaments públics a la zona centre.", fr: "Il y a des parkings publics dans le centre-ville.", de: "Im Zentrum gibt es öffentliche Parkhäuser.", it: "Ci sono parcheggi pubblici in centro." } },
        cerca: { es: "Plaza del Ayuntamiento, teatros y comercios del centro", en: "Plaza del Ayuntamiento, theatres and city-centre shops", ca: "Plaça de l'Ajuntament, teatres i comerços del centre", fr: "Place de la Mairie, théâtres et boutiques du centre", de: "Rathausplatz, Theater und Geschäfte im Zentrum", it: "Piazza del Municipio, teatri e negozi del centro" },
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
      zona: { es: "Centro Comercial El Saler", en: "El Saler shopping centre", ca: "Centre Comercial El Saler", fr: "Centre commercial El Saler", de: "Einkaufszentrum El Saler", it: "Centro commerciale El Saler" },
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
      destacado: { es: "El primer Neco · desde 1995", en: "The first Neco · since 1995", ca: "El primer Neco · des de 1995", fr: "Le premier Neco · depuis 1995", de: "Das erste Neco · seit 1995", it: "Il primo Neco · dal 1995" },
      llegar: {
        metro: null,
        bus: "13, 14, 15, 35, 95 y Orbital",
        tren: null,
        parking: { corto: { es: "Gratis tardes y fines de semana", en: "Free evenings & weekends", ca: "Gratis vesprades i caps de setmana", fr: "Gratuit le soir et le week-end", de: "Gratis abends und am Wochenende", it: "Gratis la sera e nel weekend" },
                   texto: { es: "Aparcamiento gratuito por las tardes y los fines de semana.", en: "Free parking in the evenings and at weekends.", ca: "Aparcament gratuït per les vesprades i els caps de setmana.", fr: "Parking gratuit le soir et le week-end.", de: "Kostenloses Parken abends und am Wochenende.", it: "Parcheggio gratuito la sera e nel fine settimana." } },
        cerca: { es: "A un minuto de la Ciudad de las Artes y las Ciencias y de la Ciudad de la Justicia", en: "One minute from the City of Arts and Sciences", ca: "A un minut de la Ciutat de les Arts i les Ciències i de la Ciutat de la Justícia", fr: "À une minute de la Cité des Arts et des Sciences", de: "Eine Minute von der Stadt der Künste und der Wissenschaften", it: "A un minuto dalla Città delle Arti e delle Scienze" },
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
      zona: { es: "Alfafar", en: "Alfafar", ca: "Alfafar", fr: "Alfafar", de: "Alfafar", it: "Alfafar" },
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
      notaHorario: { es: "Cenas solo viernes y sábado.", en: "Dinner on Fridays and Saturdays only.", ca: "Sopars només divendres i dissabte.", fr: "Dîner uniquement le vendredi et le samedi.", de: "Abendessen nur freitags und samstags.", it: "Cena solo venerdì e sabato." },
      llegar: {
        metro: null,
        bus: { es: "Línea Sedaví – Valencia", en: "Sedaví – Valencia line", ca: "Línia Sedaví – València", fr: "Ligne Sedaví – Valence", de: "Linie Sedaví – Valencia", it: "Linea Sedaví – Valencia" },
        tren: null,
        parking: { corto: { es: "Gratis en el centro comercial", en: "Free at the shopping centre", ca: "Gratis al centre comercial", fr: "Gratuit au centre commercial", de: "Gratis im Einkaufszentrum", it: "Gratis al centro commerciale" },
                   texto: { es: "Aparcamiento gratuito en el centro comercial Parque Albufera.", en: "Free parking at Parque Albufera shopping centre.", ca: "Aparcament gratuït al centre comercial Parque Albufera.", fr: "Parking gratuit au centre commercial Parque Albufera.", de: "Kostenloses Parken im Einkaufszentrum Parque Albufera.", it: "Parcheggio gratuito al centro commerciale Parque Albufera." } },
        cerca: { es: "MN4, Ikea, Carrefour, Media Markt y Leroy Merlin", en: "MN4, Ikea, Carrefour, Media Markt and Leroy Merlin", ca: "MN4, Ikea, Carrefour, Media Markt i Leroy Merlin", fr: "MN4, Ikea, Carrefour, Media Markt et Leroy Merlin", de: "MN4, Ikea, Carrefour, Media Markt und Leroy Merlin", it: "MN4, Ikea, Carrefour, Media Markt e Leroy Merlin" },
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
      zona: { es: "Parque Tecnológico · Paterna", en: "Technology Park · Paterna", ca: "Parc Tecnològic · Paterna", fr: "Parc technologique · Paterna", de: "Technologiepark · Paterna", it: "Parco Tecnologico · Paterna" },
      direccion: "Ronda Narcís Monturiol, 2 · 46980 Paterna",
      placeId: "ChIJIWJnxEBbYA0Rd4iO3dOSKp8",
      verificado: true,
      resenaUrl: "",
      maps: "https://maps.app.goo.gl/Xjb5Xa6eDLuCFudD8",
      imagen: "img/paterna.webp",
      horario: [
        { dias: [1,2,3,4,5], servicio: "comida", de: "07:30", a: "16:30" },
      ],
      notaHorario: { es: "Cafetería y buffet. Cerrado del 25 de diciembre al 6 de enero.", en: "Café and buffet. Closed from 25 December to 6 January.", ca: "Cafeteria i bufet. Tancat del 25 de desembre al 6 de gener.", fr: "Cafétéria et buffet. Fermé du 25 décembre au 6 janvier.", de: "Café und Buffet. Vom 25. Dezember bis 6. Januar geschlossen.", it: "Caffetteria e buffet. Chiuso dal 25 dicembre al 6 gennaio." },
      cierres: [["2026-12-25", "2027-01-06"]],   // vacaciones (AAAA-MM-DD, ambos incluidos)
      notaPrecios: {
        es: "Trabajadores del Parque: buffet + bebida 15,00 € · con café 16,15 €. Neco para llevar: 14,50 €/kg.",
        en: "Technology Park staff: buffet + drink €15.00 · with coffee €16.15. Neco to go: €14.50/kg.",
        ca: "Treballadors del Parc: bufet + beguda 15,00 € · amb café 16,15 €. Neco per a emportar: 14,50 €/kg.",
        fr: "Salariés du Parc : buffet + boisson 15,00 € · avec café 16,15 €. Neco à emporter : 14,50 €/kg.",
        de: "Mitarbeiter des Parks: Buffet + Getränk 15,00 € · mit Kaffee 16,15 €. Neco zum Mitnehmen: 14,50 €/kg.",
        it: "Lavoratori del Parco: buffet + bevanda 15,00 € · con caffè 16,15 €. Neco da asporto: 14,50 €/kg.",
      },
      llegar: {
        metro: null,
        bus: { es: "Edetania 130 y 131 (desde Valencia) · 1 y 3 (desde Paterna)", en: "Edetania 130 & 131 (from Valencia) · 1 & 3 (from Paterna)", ca: "Edetania 130 i 131 (des de València) · 1 i 3 (des de Paterna)", fr: "Edetania 130 et 131 (depuis Valence) · 1 et 3 (depuis Paterna)", de: "Edetania 130 und 131 (ab Valencia) · 1 und 3 (ab Paterna)", it: "Edetania 130 e 131 (da Valencia) · 1 e 3 (da Paterna)" },
        tren: null,
        parking: { corto: { es: "2,5 h gratis", en: "2.5 h free", ca: "2,5 h gratis", fr: "2,5 h gratuites", de: "2,5 Std. gratis", it: "2,5 h gratis" },
                   texto: { es: "Aparcamiento gratuito 2,5 horas en el Centro de Negocios Destro.", en: "2.5 hours of free parking at Destro Business Centre.", ca: "Aparcament gratuït 2,5 hores al Centre de Negocis Destro.", fr: "Parking gratuit 2,5 heures au centre d'affaires Destro.", de: "2,5 Stunden kostenloses Parken im Geschäftszentrum Destro.", it: "Parcheggio gratuito per 2,5 ore al Centro Affari Destro." } },
        cerca: { es: "Ciudad Deportiva del Valencia CF, Heron City y Kinépolis", en: "Valencia CF training ground, Heron City and Kinépolis", ca: "Ciutat Esportiva del València CF, Heron City i Kinépolis", fr: "Centre d'entraînement du Valencia CF, Heron City et Kinépolis", de: "Trainingszentrum des Valencia CF, Heron City und Kinépolis", it: "Centro sportivo del Valencia CF, Heron City e Kinépolis" },
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
