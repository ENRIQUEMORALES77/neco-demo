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
    gluten:          { ico: "🌾", es: "Gluten",            en: "Gluten" },
    crustaceos:      { ico: "🦐", es: "Crustáceos",        en: "Crustaceans" },
    huevo:           { ico: "🥚", es: "Huevo",             en: "Egg" },
    pescado:         { ico: "🐟", es: "Pescado",           en: "Fish" },
    cacahuete:       { ico: "🥜", es: "Cacahuete",         en: "Peanuts" },
    soja:            { ico: "🫘", es: "Soja",              en: "Soy" },
    lacteos:         { ico: "🥛", es: "Lácteos",           en: "Milk" },
    frutos_cascara:  { ico: "🌰", es: "Frutos de cáscara", en: "Tree nuts" },
    apio:            { ico: "🥬", es: "Apio",              en: "Celery" },
    mostaza:         { ico: "🟡", es: "Mostaza",           en: "Mustard" },
    sesamo:          { ico: "⚪", es: "Sésamo",            en: "Sesame" },
    sulfitos:        { ico: "🍷", es: "Sulfitos",          en: "Sulphites" },
    altramuces:      { ico: "🌼", es: "Altramuces",        en: "Lupin" },
    moluscos:        { ico: "🦑", es: "Moluscos",          en: "Molluscs" },
  },

  CATEGORIAS: {
    arroces:    { es: "Arroces y fideuá",        en: "Rice dishes & fideuá" },
    entrantes:  { es: "Ensaladas y entrantes",   en: "Salads & starters" },
    cuchara:    { es: "Platos de cuchara",       en: "Stews & soups" },
    principales:{ es: "Carnes y pescados",       en: "Meat & fish" },
    pasta:      { es: "Pasta y pizza",           en: "Pasta & pizza" },
    guarnicion: { es: "Guarniciones",            en: "Sides" },
    postres:    { es: "Postres y fruta",         en: "Desserts & fruit" },
  },

  platos: [
    { cat: "arroces", es: "Paella valenciana", en: "Valencian paella (chicken & rabbit)", alergenos: [], trazas: [], dieta: "" },
    { cat: "arroces", es: "Paella de marisco", en: "Seafood paella", alergenos: ["crustaceos", "moluscos", "pescado"], trazas: [], dieta: "" },
    { cat: "arroces", es: "Arroz negro con alioli", en: "Black rice with aioli", alergenos: ["moluscos", "crustaceos", "pescado", "huevo"], trazas: [], dieta: "" },
    { cat: "arroces", es: "Fideuá", en: "Fideuá (seafood noodles)", alergenos: ["gluten", "crustaceos", "moluscos", "pescado"], trazas: ["huevo"], dieta: "" },
    { cat: "arroces", es: "Arroz al horno", en: "Oven-baked rice", alergenos: ["sulfitos"], trazas: [], dieta: "" },
    { cat: "arroces", es: "Paella de verduras", en: "Vegetable paella", alergenos: [], trazas: ["apio"], dieta: "vegano" },

    { cat: "entrantes", es: "Ensalada mixta", en: "Mixed salad", alergenos: ["huevo", "pescado"], trazas: ["mostaza"], dieta: "" },
    { cat: "entrantes", es: "Ensaladilla rusa", en: "Russian salad", alergenos: ["huevo", "pescado"], trazas: [], dieta: "" },
    { cat: "entrantes", es: "Hummus con crudités", en: "Hummus with crudités", alergenos: ["sesamo"], trazas: [], dieta: "vegano" },
    { cat: "entrantes", es: "Croquetas de jamón", en: "Ham croquettes", alergenos: ["gluten", "lacteos", "huevo"], trazas: [], dieta: "" },
    { cat: "entrantes", es: "Calamares a la romana", en: "Fried squid rings", alergenos: ["gluten", "huevo", "moluscos"], trazas: [], dieta: "" },
    { cat: "entrantes", es: "Tomate con aceite y sal", en: "Tomato with olive oil", alergenos: [], trazas: [], dieta: "vegano" },

    { cat: "cuchara", es: "Lentejas estofadas", en: "Lentil stew", alergenos: ["apio"], trazas: [], dieta: "" },
    { cat: "cuchara", es: "Crema de verduras", en: "Cream of vegetable soup", alergenos: ["apio", "lacteos"], trazas: [], dieta: "vegetariano" },

    { cat: "principales", es: "Codillo asado", en: "Roast pork knuckle", alergenos: ["mostaza", "sulfitos"], trazas: [], dieta: "" },
    { cat: "principales", es: "Pollo asado al limón", en: "Lemon roast chicken", alergenos: [], trazas: [], dieta: "" },
    { cat: "principales", es: "Albóndigas en salsa", en: "Meatballs in sauce", alergenos: ["gluten", "huevo", "apio", "lacteos"], trazas: [], dieta: "" },
    { cat: "principales", es: "Merluza a la plancha", en: "Grilled hake", alergenos: ["pescado"], trazas: [], dieta: "" },
    { cat: "principales", es: "Salmón al horno", en: "Baked salmon", alergenos: ["pescado"], trazas: ["mostaza"], dieta: "" },
    { cat: "principales", es: "Mejillones al vapor", en: "Steamed mussels", alergenos: ["moluscos"], trazas: [], dieta: "" },

    { cat: "pasta", es: "Espaguetis a la boloñesa", en: "Spaghetti bolognese", alergenos: ["gluten", "apio"], trazas: ["huevo"], dieta: "" },
    { cat: "pasta", es: "Macarrones gratinados", en: "Macaroni au gratin", alergenos: ["gluten", "lacteos"], trazas: ["huevo"], dieta: "vegetariano" },
    { cat: "pasta", es: "Pizza margarita", en: "Margherita pizza", alergenos: ["gluten", "lacteos"], trazas: ["soja"], dieta: "vegetariano" },

    { cat: "guarnicion", es: "Patatas fritas", en: "French fries", alergenos: [], trazas: ["gluten"], dieta: "vegano" },
    { cat: "guarnicion", es: "Verduras a la plancha", en: "Grilled vegetables", alergenos: [], trazas: [], dieta: "vegano" },

    { cat: "postres", es: "Natillas", en: "Custard", alergenos: ["lacteos", "huevo"], trazas: [], dieta: "vegetariano" },
    { cat: "postres", es: "Flan de huevo", en: "Crème caramel", alergenos: ["huevo", "lacteos"], trazas: [], dieta: "vegetariano" },
    { cat: "postres", es: "Tarta de chocolate", en: "Chocolate cake", alergenos: ["gluten", "huevo", "lacteos", "soja"], trazas: ["frutos_cascara"], dieta: "vegetariano" },
    { cat: "postres", es: "Brownie con nueces", en: "Walnut brownie", alergenos: ["gluten", "huevo", "lacteos", "frutos_cascara"], trazas: ["cacahuete"], dieta: "vegetariano" },
    { cat: "postres", es: "Helado de vainilla", en: "Vanilla ice cream", alergenos: ["lacteos"], trazas: ["frutos_cascara"], dieta: "vegetariano" },
    { cat: "postres", es: "Fruta fresca de temporada", en: "Fresh seasonal fruit", alergenos: [], trazas: [], dieta: "vegano" },
  ],
};
