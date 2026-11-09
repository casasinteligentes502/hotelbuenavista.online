# HOTEL BUENA VISTA — SIGNATURE PREMIUM (ES + EN)

**Proyecto web estático listo para subir a GitHub Pages.** Dominio configurado: https://hotelbuenavista.online

## Qué incluye esta versión

- Página principal en español: `index.html`.
- Página en inglés: `en/index.html`.
- Selector ES / EN y modo claro / oscuro.
- Diseño premium adaptable a celular, tableta y escritorio; galería de fotografías, experiencias, promociones, Facebook, Instagram, mapa e integración con WhatsApp.
- **Consulta de disponibilidad con nombre completo y teléfono**, además de fecha de entrada, salida, huéspedes y alojamiento. El mensaje preparado para WhatsApp incluye todos estos datos en el idioma seleccionado.
- CTA de alojamientos que lleva al formulario con la opción ya seleccionada.
- Galerías de servicios que abren dentro de la página, se recorren con flechas, se cierran con X o Esc y no abren pestañas externas para cada foto.
- Portadas sociales Open Graph renovadas: `assets/img/og-buena-vista-es.jpg` y `assets/img/og-buena-vista-en.jpg` (1200×630).
- Imágenes alojadas localmente en `assets/img/` y `assets/img/thumb/`, sin depender de Instagram.
- `privacidad.html` y `en/privacidad.html`, `terminos.html` y `en/terminos.html`.

## Cómo publicar en GitHub Pages

1. Descomprime el ZIP. Su contenido contiene **directamente** `index.html`, `styles.css`, `script.js`, `config.js`, `CNAME`, `en/` y `assets/`.
2. Sube todos estos archivos y carpetas a **la raíz** del repositorio. No subas una carpeta contenedora adicional.
3. En GitHub → Settings → Pages, selecciona la rama y carpeta raíz donde están los archivos.
4. En Custom domain, configura `hotelbuenavista.online`. Ajusta DNS y espera a que GitHub valide el dominio y puedas activar HTTPS.
5. Verifica las versiones ES y EN, el formulario y los enlaces desde una URL `https://` real. En Windows puedes probar abriendo los archivos, pero los enlaces externos como Maps/WhatsApp requieren conexión.

## Reserva por WhatsApp — funcionamiento

El formulario **no consulta inventario ni confirma reservaciones automáticamente**. El huésped escribe su nombre completo y teléfono junto con sus fechas, número de huéspedes y tipo de alojamiento. Al pulsar **Consultar mi estadía** / **Check my dates**, la web crea el enlace `wa.me/50257598151?text=...` y navega a WhatsApp, donde el visitante decide si envía el mensaje. No hay base de datos ni almacenamiento de estos datos en esta web. El navegador podría sugerir autofill según preferencias del visitante.

**Archivos relevantes:** `index.html`, `en/index.html` y `script.js`. Los datos de contacto del hotel se mantienen en `config.js` (campo `whatsApp`); el resto de enlaces directos de WhatsApp también mencionan el número del hotel.

## Promociones, vigencias y tarifas

Los precios navideños históricos **no se anuncian como vigentes** hasta confirmar las fechas de la promoción. Edita `config.js` para activar `seasonal.confirmed = true`, escribir `seasonal.validUntil = "AAAA-MM-DD"` y actualizar los importes autorizados. Las páginas ES y EN comparten la misma configuración. También puedes actualizar el precio y vencimiento del paquete de asado allí. No anuncies tarifas sin confirmación.

## Fotografías

La mayor parte de las fotos proviene del material proporcionado por Hotel Buena Vista. La REV4 contenía imágenes promocionales extra para eventos que fueron incorporadas a su álbum (se identifican como piezas promocionales, no como fotos verificadas de cada instalación). Las fotos originales de alta resolución de cada alojamiento siguen siendo preferibles para una versión final de máximo detalle. Nunca sustituyas una instalación real por una ilustración sin aclararlo.

## Pendientes comerciales reales

- Confirmar fecha de vigencia de promociones y términos de precios.
- Confirmar que las fotos de cada tipo de habitación corresponden a las instalaciones ofrecidas.
- Confirmar pin/coordenadas exactas de Google Maps si deseas incorporar `geo` en Schema.org; no inventar coordenadas.
- Revisar los textos legales con el propietario antes de habilitar pagos o registros en servidor.

## Estructura esencial

```
index.html
styles.css
script.js
config.js
CNAME
robots.txt
sitemap.xml
en/index.html
en/privacidad.html
en/terminos.html
assets/img/
assets/icons/
```

**Fecha de actualización:** 9 de noviembre de 2026.
