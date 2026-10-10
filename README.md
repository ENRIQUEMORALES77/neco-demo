# Demo · Reseñas y contacto para Neco Buffet

Demo comercial para Neco Buffet. Cada mesa y la entrada llevan una placa NFC con QR. Al acercar el móvil o escanear el QR, el cliente llega a una página propia del restaurante, no directamente a Google. Desde esa página puede:

- dejar una **reseña en Google** (botón principal),
- enviar un **mensaje privado** al equipo,
- consultar los **platos del día**, los **alérgenos**, los **horarios** y las **redes sociales**,
- pedir un **presupuesto orientativo para grupos y celebraciones**.

Además hay un **panel de gestión** con datos de ejemplo para enseñárselo al gerente.

Es todo HTML, CSS y JavaScript estático: no tiene servidor ni claves de API. Funciona abriendo los archivos en local y también publicado en GitHub Pages.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página de destino (lo que ve el cliente). Se abre con `?local=ruzafa&mesa=12` |
| `panel.html` | **Dashboard de reseñas**: reputación real en Google + actividad de las placas (simulada) |
| `presentacion.html` | **Modo presentación** para la reunión: móvil simulado, QR grande para que el gerente lo pruebe con su móvil y panel |
| `expositor.html` | Plantilla imprimible del expositor de mesa A6, con un QR por local o por mesa |
| `expositores-A6.pdf` / `expositores-4xA4.pdf` | Expositores de entrada de los 4 locales, listos para imprimir |
| `qr/*.svg`, `qr/*.png` | QR de cada local (entrada) |
| `nfc-urls.csv` | La URL que hay que grabar en cada pegatina NFC (entrada + todas las mesas) |
| `config.js` | **Toda** la configuración: locales, Place IDs, horarios, tarifas, festivos y enlaces |
| `js/i18n.js` | Textos de la interfaz en español e inglés |
| `tools/generar_qr.py` | Vuelve a generar los QR y `nfc-urls.csv` a partir de `config.js` |

---

## 1. Probarlo en local

- **Lo más rápido:** abre `index.html` con doble clic. Para ver un local concreto, añade el parámetro en la barra de direcciones: `index.html?local=ruzafa&mesa=12`.
- **Lo más fiel** (como quedará publicado):
  ```bash
  python -m http.server 8080
  ```
  Después abre <http://localhost:8080/?local=ruzafa&mesa=12>.

Parámetros de la URL:

| Parámetro | Valores | Efecto |
|---|---|---|
| `local` | `ruzafa`, `saler`, `alfafar`, `paterna` | Elige el local. Si falta o no existe, se muestra un selector |
| `mesa` | número | Muestra «Mesa 12» y queda registrado en los formularios |
| `src` | `nfc` o `qr` | Indica por dónde ha entrado el cliente, para distinguirlo en el panel |
| `lang` | `es` o `en` | Fuerza el idioma (por defecto, español). El botón ES/EN se recuerda en el móvil |

---

## 2. Publicarlo en GitHub Pages con el dominio `reseñasnecobuffet.com`

**Ahora mismo está publicada en <https://enriquemorales77.github.io/neco-demo/>** (repositorio `ENRIQUEMORALES77/neco-demo`, rama `main`). Los QR, los PDF y `nfc-urls.csv` apuntan a esa dirección.

Para actualizarla basta con hacer *commit* y *push* a `main`: GitHub la vuelve a publicar en 1–2 minutos. Sube el número `?v=` de los `<script>` y `<link>` de los HTML para que los móviles no usen la versión antigua guardada.

Cuando tengáis el dominio definitivo:

1. En `config.js`, cambia `baseUrl` a `https://xn--reseasnecobuffet-9tb.com/` y `dominioVisible` a `reseñasnecobuffet.com`.
2. Copia `tools/CNAME.dominio-final` a la raíz con el nombre `CNAME`. Contiene `xn--reseasnecobuffet-9tb.com`, la forma técnica (*punycode*) de `reseñasnecobuffet.com`. Los navegadores la muestran con la «ñ».
3. Compra el dominio `reseñasnecobuffet.com` en cualquier registrador (admiten la «ñ») y, en su DNS, crea:
   - 4 registros `A` para `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`
   - 1 registro `CNAME` para `www` → `enriquemorales77.github.io`
4. En el repositorio, **Settings → Pages**: escribe el dominio y marca **Enforce HTTPS** cuando aparezca (puede tardar hasta 24 h).
5. Regenera QR, PDF y `nfc-urls.csv` (sección 4, paso 5) **y vuelve a grabar las pegatinas NFC**.

> **Recomendación:** compra también `resenasnecobuffet.com`, sin «ñ», y redirígelo al principal. Así funciona aunque alguien lo teclee sin «ñ». Otra opción gratuita es un subdominio del propio restaurante, como `resenas.necobuffet.com`: basta con un `CNAME` en su DNS. Si cambias de dominio, sigue el paso 5 de la sección 4.

Las páginas llevan `<meta name="robots" content="noindex">` para que Google no las indexe.

---

## 3. Modo presentación (`presentacion.html`)

Pensado para el portátil o la pantalla de la reunión, a pantalla completa:

- **Izquierda:** la página del cliente dentro de un móvil simulado. Es la página real y funciona sin publicar.
- **Centro:** un QR grande con el logo, la nota actual del local en Google y los 3 pasos (placa → botón → reseña publicada en Google Maps). Debajo, adónde va cada cosa: la reseña es pública en Google; el mensaje y la solicitud de grupo son privados.
- **Derecha:** el panel del gerente.
- **Atajos:** `1`–`4` cambian de local, `F` activa la pantalla completa. Arriba se puede cambiar el número de mesa.

**Importante:** el QR tiene que apuntar a una web **publicada**; el móvil del gerente no puede abrir tu portátil. Por defecto usa el dominio de `config.js`. Si todavía no lo has comprado, publica en GitHub Pages y pon esa dirección en **⚙ URL del QR** (se recuerda en ese navegador). Un punto verde junto a la URL indica que responde; si sale ámbar, la web aún no está publicada.

Las notas de Google que se muestran están en `config.js` → `google` de cada local (tomadas el 09/10/2026). Actualízalas antes de la reunión.

## 4. Cambiar de restaurante (o reutilizar la demo)

Todo lo que cambia está en **`config.js`**. Duplica la carpeta y edita:

1. `baseUrl` y `dominioVisible`: el dominio donde se publica, terminado en `/`.
2. `marca`: nombre, lema, logo (`img/…`), colores y texto del pie.
3. `contacto`, `enlaces` (platos, precios, Instagram, TikTok, Facebook), `tarifas` y `festivos`.
   - `contacto.whatsapp` es el número que recibe las quejas privadas y las solicitudes de grupo (formato `34XXXXXXXXX`). Cada local puede tener el suyo con su propio campo `whatsapp`. Si se deja vacío, los formularios vuelven al modo demo (solo enseñan la ficha).
4. `locales`: un bloque por local. **La clave del bloque es el valor de `?local=`.** Cada local lleva:
   - `nombre`, `corto`, `zona`, `direccion` y `maps`.
   - `google`: nota y número de reseñas actuales (solo para la presentación).
   - `placeId`, el identificador de Google para el enlace de reseña (ver más abajo). Si el gerente tiene el enlace corto de su Perfil de Empresa (*Pedir reseñas* → `g.page/r/…`), pégalo en `resenaUrl`: tiene prioridad sobre el `placeId`.
   - `imagen`, la foto de cabecera (pon el archivo en `img/`; de unos 960 px de ancho y en WebP queda ligera).
   - `horario`, una lista de franjas `{ dias: [0..6], servicio: "comida"|"cena", de: "13:00", a: "16:30" }`, donde 0 es domingo.
   - Opcionales: `notaHorario`, `tarifas` (sobrescribe las generales), `cierraFestivos`, `espacioCelebraciones` y `mesas` (para el panel y el expositor).
5. Regenera los QR, el listado NFC y los PDF:
   ```bash
   python -m pip install segno
   ```
   ```bash
   python tools/generar_qr.py --nfc
   ```
   Abre `expositor.html`, elige el local o las mesas y pulsa **Imprimir → Guardar como PDF**.

Los textos de la interfaz (botones, formularios) están en `js/i18n.js`. Para otro idioma, copia el bloque `en`.

### Cómo encontrar el Place ID de un local

- **Opción A:** Google *Place ID Finder* (<https://developers.google.com/maps/documentation/places/web-service/place-id>). Busca el local y copia el código que empieza por `ChIJ…`.
- **Opción B:** el enlace *Pedir reseñas* del Perfil de Empresa de Google. Va en `resenaUrl`.
- **Comprobación:** abre `https://www.google.com/maps/place/?q=place_id:EL_PLACE_ID` y verifica que sale la ficha del local correcto.

Los 4 Place ID de Neco se comprobaron así el 09/10/2026. Todos abren la ficha correcta de «Neco Buffet Mediterráneo» en cada dirección.

---

## 5. Qué grabar en cada pegatina NFC

Formato de la URL: `https://xn--reseasnecobuffet-9tb.com/?local=LOCAL&mesa=N&src=nfc`

| Ubicación | URL para la pegatina NFC |
|---|---|
| Entrada Ruzafa | `https://xn--reseasnecobuffet-9tb.com/?local=ruzafa&src=nfc` |
| Entrada El Saler | `https://xn--reseasnecobuffet-9tb.com/?local=saler&src=nfc` |
| Entrada Alfafar | `https://xn--reseasnecobuffet-9tb.com/?local=alfafar&src=nfc` |
| Entrada Paterna | `https://xn--reseasnecobuffet-9tb.com/?local=paterna&src=nfc` |
| Mesa 12 de Ruzafa (ejemplo) | `https://xn--reseasnecobuffet-9tb.com/?local=ruzafa&mesa=12&src=nfc` |

El listado completo, con la entrada y todas las mesas de cada local, está en **`nfc-urls.csv`** y se abre con Excel. También aparece debajo de cada expositor en `expositor.html`.

- **Pegatinas:** sirven las NTAG213 (144 bytes). La URL más larga ocupa unos 70 bytes. Pon el modelo *on-metal* si van sobre una superficie metálica.
- **Cómo grabarlas:** con la app gratuita **NFC Tools** (Android/iOS): *Escribir → Añadir un registro → URL/URI*, pega la URL y acerca la pegatina.
- **Bloqueo:** después, **bloquéalas** (*Otros → Bloquear etiqueta*) para que nadie pueda reescribirlas. Es irreversible, así que prueba antes la URL.
- **Por qué hay dos URL:** se graba la forma `xn--…` porque es la más compatible. El QR del expositor lleva `src=qr` y la pegatina `src=nfc`, para saber en el panel cuántos clientes usan cada sistema.

---

## 6. Normas de Google: sin «review gating»

La página está diseñada para cumplir la política de contenido de reseñas de Google:

- **Todos los clientes ven el botón de Google, siempre arriba y de la misma forma.** No se pregunta antes «¿qué nota nos darías?» para mandar a Google solo a los contentos.
- El mensaje privado («¿Algo no ha ido bien?») es un **canal adicional** situado debajo. Nunca sustituye ni oculta el botón de Google.
- **No se ofrecen descuentos, regalos ni sorteos a cambio de reseñas.** No lo añadáis en el expositor ni en la página.

---

## 7. Dashboard de reseñas (`panel.html`)

Dos bloques, siempre marcados con su etiqueta: **Dato real** (verde) o **Ejemplo** (ámbar).

**Filtros** (arriba, fijos): **General** o **1★–5★**, y **local**. Afectan a todo el panel. También se filtra pulsando una fila del reparto de estrellas o un tramo de la comparativa.

### Reputación en Google — dato real

Sale de `config.js` → `google` de cada local: nota, número de reseñas, reparto por estrellas y temas. Se tomaron de Google Maps el 09/10/2026.

- **Nota visible y media exacta.** Google redondea a un decimal: Alfafar (3,972) y El Saler (3,985) muestran «4,0», pero están en la parte baja de esa franja.
- **KPI de calidad (vista General):**
  - % de satisfechos (4–5★) y % de críticas (1–2★).
  - Índice neto: % de 5★ menos % de 1–2★.
  - Cuántas 5★ hacen falta para compensar una 1★.
- **KPI con filtro de estrellas:**
  - Peso de esas estrellas en el total y local con más y con menos.
  - Efecto de cada nueva reseña de ese tipo en la media: una 4★ también la baja si la media supera 4.
  - Cuántas 5★ compensan una de ese tipo.
- **Comparativa por local:** reparto en barras 100 %.
- **Objetivos de nota:** cuántas 5★ faltan para que Google muestre la décima siguiente, y cuántas 1★ la harían bajar. El plazo «al ritmo de las placas» usa los datos de ejemplo.
- **De qué hablan los clientes:** los temas que detecta Google y en cuántas reseñas aparecen.

### Actividad de las placas — ejemplo

Son 30 días simulados con `js/datos-demo.js`, con una semilla fija (siempre salen las mismas cifras):

- escaneos, NFC frente a QR, clics a Google, reseñas nuevas y su nota media frente a la histórica,
- % de reseñas respondidas y tiempo medio de respuesta,
- escaneos por día, por local y por mesa,
- reseñas nuevas con botón **Responder** (propone una respuesta según las estrellas, lista para copiar),
- mensajes privados.

### Actualizar los datos reales

Hasta la fase 2, cambia a mano en `config.js` los números de cada local (ficha de Google Maps → *Reseñas*). En la fase 2, la API del Perfil de Empresa los actualiza a diario y permite responder desde el panel.

### Envío por WhatsApp (ya funciona)

Al enviar la queja o la solicitud de grupo se abre WhatsApp en el móvil del cliente con el mensaje ya redactado, hacia el número de `contacto.whatsapp`. El cliente solo pulsa «Enviar». El mensaje llega siempre en español aunque el cliente use la página en inglés (se añade «Idioma del cliente: inglés»). Incluye el local, la mesa, si entró por NFC o por QR, y en los grupos el presupuesto orientativo.

- No necesita servidor ni cuenta de WhatsApp Business. El que envía es el propio cliente.
- La queja deja de ser anónima: el restaurante ve el número de WhatsApp del cliente. La página lo indica («te contestará por WhatsApp»).
- El número configurado queda visible en el código de la página publicada. Para producción, usad el WhatsApp del restaurante, no uno personal.
- Para probarlo desde el ordenador, abre `index.html`: se abre WhatsApp Web o Desktop. Si escribes a tu propio número, el mensaje aparece en el chat contigo mismo.

### Contador real (fase 2, no implementado)

La página ya llama a una función `track(evento, datos)` en `js/app.js`. Ahora mismo no envía nada porque `CONFIG.contador.endpoint` está vacío. Los eventos que registra son `escaneo`, `clic_google`, `clic_platos`, `abrir_*`, `queja` y `grupo`, cada uno con el local, la mesa, el canal (`nfc`/`qr`) y la hora.

Hay dos opciones gratuitas para la fase 2:

1. **Cloudflare Worker + D1 o KV** (plan gratuito: 100.000 peticiones al día).
   - El Worker recibe el `navigator.sendBeacon` y suma contadores por día, local y mesa.
   - Expone un `GET /resumen` que devuelve el mismo formato que `window.DEMO`.
   - `panel.html` sustituye `datos-demo.js` por un `fetch` a ese resumen, protegido con una clave sencilla o con Cloudflare Access.
2. **Google Apps Script + Google Sheets.**
   - Un script publicado como aplicación web (`doPost`) añade una fila por evento a una hoja.
   - Los formularios de queja y de grupos, además, envían un email al gerente o al responsable de eventos con `MailApp`.
   - El panel lee la hoja mediante el `doGet` del script. Es lo más fácil de mantener para el restaurante.

En los dos casos hay que añadir a los formularios una casilla de aceptación y el aviso de privacidad (RGPD), porque se recoge un contacto. Los escaneos no guardan datos personales.

---

## 8. Datos tomados de necobuffet.com (revisados el 09/10/2026)

- **Tarifas:**
  - Adulto: 14,90 € en laborables y 16,50 € en fines de semana y festivos (igual en comida y cena).
  - Niños: 5 € hasta 105 cm y 8,50 € de 105 a 140 cm.
  - Bebida no incluida.
- **Horarios:**
  - Ruzafa y El Saler: todos los días, de 13:00 a 16:30 y de 20:00 a 23:00/23:30.
  - Alfafar: comidas a diario de 13:15 a 16:30 y cenas solo sábados y domingos.
  - Paterna: de lunes a viernes, de 7:30 a 16:30.
- **Celebraciones con espacio exclusivo:** Parque Tecnológico (Paterna).
- **Fotos y logo:** web de Neco, optimizados en `img/`.

### A confirmar con Neco

- **Paterna:**
  - `cierraFestivos: true` es una suposición, por ser un parque empresarial.
  - Su web no publica tarifa de niños; se usa la general.
- **Ruzafa y El Saler:** el cierre de la cena es a las 23:00 o a las 23:30 según el día. La página muestra 23:30 y una nota.
- **Festivos de 2027:** son provisionales hasta que se publique el calendario oficial. Los festivos locales de Alfafar y Paterna no están incluidos.
- **El Saler:** la foto de cabecera es pequeña (408 px). Conviene pedirles una foto mejor.

---

Demo preparada por Enrique Morales.
