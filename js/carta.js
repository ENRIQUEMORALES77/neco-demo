/* =====================================================================
   CARTA DE ALÉRGENOS
   ---------------------------------------------------------------------
   ⚠ DATOS DE EJEMPLO para la demo. Antes de usarla con clientes, cocina
   debe revisar cada plato: los alérgenos dependen de la receta y de los
   proveedores reales.

   Cada plato:
     cat       → categoría (ver CATEGORIAS)
     alergenos → los 14 de declaración obligatoria (Reglamento UE 1169/2011)
     trazas    → "puede contener" (contaminación cruzada)
     dieta     → "vegano", "vegetariano" o ""
     locales   → opcional: lista de locales donde se sirve (si falta, en todos)
   ===================================================================== */
window.CARTA = {
  revisada: "",   // fecha de la última revisión de cocina (AAAA-MM-DD). Vacío = ejemplo sin validar.

  ALERGENOS: {
    gluten:          { ico: "🌾", es: "Gluten",            en: "Gluten", ca: "Gluten", fr: "Gluten", de: "Gluten", it: "Glutine" },
    crustaceos:      { ico: "🦐", es: "Crustáceos",        en: "Crustaceans", ca: "Crustacis", fr: "Crustacés", de: "Krebstiere", it: "Crostacei" },
    huevo:           { ico: "🥚", es: "Huevo",             en: "Egg", ca: "Ou", fr: "Œuf", de: "Ei", it: "Uova" },
    pescado:         { ico: "🐟", es: "Pescado",           en: "Fish", ca: "Peix", fr: "Poisson", de: "Fisch", it: "Pesce" },
    cacahuete:       { ico: "🥜", es: "Cacahuete",         en: "Peanuts", ca: "Cacauet", fr: "Arachides", de: "Erdnüsse", it: "Arachidi" },
    soja:            { ico: "🫘", es: "Soja",              en: "Soy", ca: "Soja", fr: "Soja", de: "Soja", it: "Soia" },
    lacteos:         { ico: "🥛", es: "Lácteos",           en: "Milk", ca: "Lactis", fr: "Lait", de: "Milch", it: "Latte" },
    frutos_cascara:  { ico: "🌰", es: "Frutos de cáscara", en: "Tree nuts", ca: "Fruits de closca", fr: "Fruits à coque", de: "Schalenfrüchte", it: "Frutta a guscio" },
    apio:            { ico: "🥬", es: "Apio",              en: "Celery", ca: "Api", fr: "Céleri", de: "Sellerie", it: "Sedano" },
    mostaza:         { ico: "🟡", es: "Mostaza",           en: "Mustard", ca: "Mostassa", fr: "Moutarde", de: "Senf", it: "Senape" },
    sesamo:          { ico: "⚪", es: "Sésamo",            en: "Sesame", ca: "Sèsam", fr: "Sésame", de: "Sesam", it: "Sesamo" },
    sulfitos:        { ico: "🍷", es: "Sulfitos",          en: "Sulphites", ca: "Sulfits", fr: "Sulfites", de: "Sulfite", it: "Solfiti" },
    altramuces:      { ico: "🌼", es: "Altramuces",        en: "Lupin", ca: "Tramussos", fr: "Lupin", de: "Lupinen", it: "Lupini" },
    moluscos:        { ico: "🦑", es: "Moluscos",          en: "Molluscs", ca: "Mol·luscos", fr: "Mollusques", de: "Weichtiere", it: "Molluschi" },
  },

  CATEGORIAS: {
    arroces:    { es: "Arroces y fideuá",        en: "Rice dishes & fideuá", ca: "Arrossos i fideuà", fr: "Riz et fideuá", de: "Reisgerichte & Fideuá", it: "Riso e fideuá" },
    entrantes:  { es: "Ensaladas y entrantes",   en: "Salads & starters", ca: "Ensalades i entrants", fr: "Salades et entrées", de: "Salate & Vorspeisen", it: "Insalate e antipasti" },
    cuchara:    { es: "Platos de cuchara",       en: "Stews & soups", ca: "Plats de cullera", fr: "Plats mijotés et soupes", de: "Eintöpfe & Suppen", it: "Zuppe e minestre" },
    principales:{ es: "Carnes y pescados",       en: "Meat & fish", ca: "Carns i peixos", fr: "Viandes et poissons", de: "Fleisch & Fisch", it: "Carne e pesce" },
    pasta:      { es: "Pasta y pizza",           en: "Pasta & pizza", ca: "Pasta i pizza", fr: "Pâtes et pizza", de: "Pasta & Pizza", it: "Pasta e pizza" },
    guarnicion: { es: "Guarniciones",            en: "Sides", ca: "Guarnicions", fr: "Accompagnements", de: "Beilagen", it: "Contorni" },
    postres:    { es: "Postres y fruta",         en: "Desserts & fruit", ca: "Postres i fruita", fr: "Desserts et fruits", de: "Desserts & Obst", it: "Dolci e frutta" },
  },

  platos: [
    { cat: "arroces", es: "Paella valenciana", en: "Valencian paella (chicken & rabbit)", ca: "Paella valenciana", fr: "Paella valencienne (poulet et lapin)", de: "Valencianische Paella (Huhn & Kaninchen)", it: "Paella valenciana (pollo e coniglio)", alergenos: [], trazas: [], dieta: "" },
    { cat: "arroces", es: "Paella de marisco", en: "Seafood paella", ca: "Paella de marisc", fr: "Paella aux fruits de mer", de: "Meeresfrüchte-Paella", it: "Paella di mare", alergenos: ["crustaceos", "moluscos", "pescado"], trazas: [], dieta: "" },
    { cat: "arroces", es: "Arroz negro con alioli", en: "Black rice with aioli", ca: "Arròs negre amb allioli", fr: "Riz noir à l'aïoli", de: "Schwarzer Reis mit Aioli", it: "Riso nero con aioli", alergenos: ["moluscos", "crustaceos", "pescado", "huevo"], trazas: [], dieta: "" },
    { cat: "arroces", es: "Fideuá", en: "Fideuá (seafood noodles)", ca: "Fideuà", fr: "Fideuá (vermicelles aux fruits de mer)", de: "Fideuá (Nudeln mit Meeresfrüchten)", it: "Fideuá (spaghettini ai frutti di mare)", alergenos: ["gluten", "crustaceos", "moluscos", "pescado"], trazas: ["huevo"], dieta: "" },
    { cat: "arroces", es: "Arroz al horno", en: "Oven-baked rice", ca: "Arròs al forn", fr: "Riz au four", de: "Ofenreis", it: "Riso al forno", alergenos: ["sulfitos"], trazas: [], dieta: "" },
    { cat: "arroces", es: "Paella de verduras", en: "Vegetable paella", ca: "Paella de verdures", fr: "Paella aux légumes", de: "Gemüse-Paella", it: "Paella di verdure", alergenos: [], trazas: ["apio"], dieta: "vegano" },

    { cat: "entrantes", es: "Ensalada mixta", en: "Mixed salad", ca: "Ensalada mixta", fr: "Salade composée", de: "Gemischter Salat", it: "Insalata mista", alergenos: ["huevo", "pescado"], trazas: ["mostaza"], dieta: "" },
    { cat: "entrantes", es: "Ensaladilla rusa", en: "Russian salad", ca: "Ensaladeta russa", fr: "Salade russe", de: "Russischer Salat", it: "Insalata russa", alergenos: ["huevo", "pescado"], trazas: [], dieta: "" },
    { cat: "entrantes", es: "Hummus con crudités", en: "Hummus with crudités", ca: "Hummus amb crudités", fr: "Houmous et crudités", de: "Hummus mit Rohkost", it: "Hummus con verdure crude", alergenos: ["sesamo"], trazas: [], dieta: "vegano" },
    { cat: "entrantes", es: "Croquetas de jamón", en: "Ham croquettes", ca: "Croquetes de pernil", fr: "Croquettes au jambon", de: "Schinkenkroketten", it: "Crocchette di prosciutto", alergenos: ["gluten", "lacteos", "huevo"], trazas: [], dieta: "" },
    { cat: "entrantes", es: "Calamares a la romana", en: "Fried squid rings", ca: "Calamars a la romana", fr: "Calamars frits", de: "Frittierte Tintenfischringe", it: "Calamari fritti", alergenos: ["gluten", "huevo", "moluscos"], trazas: [], dieta: "" },
    { cat: "entrantes", es: "Tomate con aceite y sal", en: "Tomato with olive oil", ca: "Tomaca amb oli i sal", fr: "Tomate à l'huile d'olive", de: "Tomate mit Olivenöl", it: "Pomodoro con olio e sale", alergenos: [], trazas: [], dieta: "vegano" },

    { cat: "cuchara", es: "Lentejas estofadas", en: "Lentil stew", ca: "Llentilles estofades", fr: "Lentilles mijotées", de: "Linseneintopf", it: "Lenticchie in umido", alergenos: ["apio"], trazas: [], dieta: "" },
    { cat: "cuchara", es: "Crema de verduras", en: "Cream of vegetable soup", ca: "Crema de verdures", fr: "Velouté de légumes", de: "Gemüsecremesuppe", it: "Crema di verdure", alergenos: ["apio", "lacteos"], trazas: [], dieta: "vegetariano" },

    { cat: "principales", es: "Codillo asado", en: "Roast pork knuckle", ca: "Garró rostit", fr: "Jarret de porc rôti", de: "Gebratene Schweinshaxe", it: "Stinco al forno", alergenos: ["mostaza", "sulfitos"], trazas: [], dieta: "" },
    { cat: "principales", es: "Pollo asado al limón", en: "Lemon roast chicken", ca: "Pollastre rostit amb llima", fr: "Poulet rôti au citron", de: "Zitronen-Brathähnchen", it: "Pollo arrosto al limone", alergenos: [], trazas: [], dieta: "" },
    { cat: "principales", es: "Albóndigas en salsa", en: "Meatballs in sauce", ca: "Mandonguilles en salsa", fr: "Boulettes en sauce", de: "Fleischbällchen in Soße", it: "Polpette al sugo", alergenos: ["gluten", "huevo", "apio", "lacteos"], trazas: [], dieta: "" },
    { cat: "principales", es: "Merluza a la plancha", en: "Grilled hake", ca: "Lluç a la planxa", fr: "Merlu à la plancha", de: "Gegrillter Seehecht", it: "Nasello alla piastra", alergenos: ["pescado"], trazas: [], dieta: "" },
    { cat: "principales", es: "Salmón al horno", en: "Baked salmon", ca: "Salmó al forn", fr: "Saumon au four", de: "Ofenlachs", it: "Salmone al forno", alergenos: ["pescado"], trazas: ["mostaza"], dieta: "" },
    { cat: "principales", es: "Mejillones al vapor", en: "Steamed mussels", ca: "Musclos al vapor", fr: "Moules à la vapeur", de: "Gedämpfte Miesmuscheln", it: "Cozze al vapore", alergenos: ["moluscos"], trazas: [], dieta: "" },

    { cat: "pasta", es: "Espaguetis a la boloñesa", en: "Spaghetti bolognese", ca: "Espaguetis a la bolonyesa", fr: "Spaghetti bolognaise", de: "Spaghetti Bolognese", it: "Spaghetti alla bolognese", alergenos: ["gluten", "apio"], trazas: ["huevo"], dieta: "" },
    { cat: "pasta", es: "Macarrones gratinados", en: "Macaroni au gratin", ca: "Macarrons gratinats", fr: "Gratin de macaronis", de: "Überbackene Makkaroni", it: "Maccheroni gratinati", alergenos: ["gluten", "lacteos"], trazas: ["huevo"], dieta: "vegetariano" },
    { cat: "pasta", es: "Pizza margarita", en: "Margherita pizza", ca: "Pizza margarida", fr: "Pizza margherita", de: "Pizza Margherita", it: "Pizza margherita", alergenos: ["gluten", "lacteos"], trazas: ["soja"], dieta: "vegetariano" },

    { cat: "guarnicion", es: "Patatas fritas", en: "French fries", ca: "Creïlles fregides", fr: "Frites", de: "Pommes frites", it: "Patatine fritte", alergenos: [], trazas: ["gluten"], dieta: "vegano" },
    { cat: "guarnicion", es: "Verduras a la plancha", en: "Grilled vegetables", ca: "Verdures a la planxa", fr: "Légumes grillés", de: "Gegrilltes Gemüse", it: "Verdure grigliate", alergenos: [], trazas: [], dieta: "vegano" },

    { cat: "postres", es: "Natillas", en: "Custard", ca: "Natilles", fr: "Crème aux œufs", de: "Vanillecreme", it: "Crema pasticcera", alergenos: ["lacteos", "huevo"], trazas: [], dieta: "vegetariano" },
    { cat: "postres", es: "Flan de huevo", en: "Crème caramel", ca: "Flam d'ou", fr: "Flan aux œufs", de: "Karamellpudding", it: "Crème caramel", alergenos: ["huevo", "lacteos"], trazas: [], dieta: "vegetariano" },
    { cat: "postres", es: "Tarta de chocolate", en: "Chocolate cake", ca: "Pastís de xocolate", fr: "Gâteau au chocolat", de: "Schokoladenkuchen", it: "Torta al cioccolato", alergenos: ["gluten", "huevo", "lacteos", "soja"], trazas: ["frutos_cascara"], dieta: "vegetariano" },
    { cat: "postres", es: "Brownie con nueces", en: "Walnut brownie", ca: "Brownie amb nous", fr: "Brownie aux noix", de: "Walnuss-Brownie", it: "Brownie alle noci", alergenos: ["gluten", "huevo", "lacteos", "frutos_cascara"], trazas: ["cacahuete"], dieta: "vegetariano" },
    { cat: "postres", es: "Helado de vainilla", en: "Vanilla ice cream", ca: "Gelat de vainilla", fr: "Glace à la vanille", de: "Vanilleeis", it: "Gelato alla vaniglia", alergenos: ["lacteos"], trazas: ["frutos_cascara"], dieta: "vegetariano" },
    { cat: "postres", es: "Fruta fresca de temporada", en: "Fresh seasonal fruit", ca: "Fruita fresca de temporada", fr: "Fruits frais de saison", de: "Frisches Obst der Saison", it: "Frutta fresca di stagione", alergenos: [], trazas: [], dieta: "vegano" },
  ],
};
