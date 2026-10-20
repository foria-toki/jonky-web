# jonky.com.ar

Landing de JONKY Pasiones Dulces. HTML + CSS + JS, sin dependencias ni compilación.

```
Todos los archivos van sueltos en la raíz del repositorio (sin carpetas),
así se pueden subir arrastrándolos a GitHub desde cualquier navegador.

index.html     la página          styles.css   estilos
main.js        lista de puntos    *.woff2      fuentes
*.webp/*.png/*.jpg  imágenes      vercel.json  configuración
```

## 1. Subir a GitHub (cuenta mensionts)

1. github.com → **New repository** → nombre `jonky-web` → Create.
2. En el repo vacío: **uploading an existing file**.
3. Arrastrá **el contenido** de esta carpeta (no la carpeta en sí) → **Commit changes**.

## 2. Publicar en Vercel

1. vercel.com/new → **Import** el repo `jonky-web`.
2. Framework Preset: **Other**. No hace falta tocar nada más → **Deploy**.
3. Queda online en `jonky-web.vercel.app` (o similar). Revisala ahí antes del paso 3.

Cada cambio que subas al repo se publica solo.

## 3. Conectar jonky.com.ar

1. En Vercel: proyecto → **Settings → Domains** → agregá `jonky.com.ar` y `www.jonky.com.ar`.
2. Vercel te va a mostrar los nameservers: `ns1.vercel-dns.com` y `ns2.vercel-dns.com`.
3. En **nic.ar** (con clave fiscal) → tu dominio → **Delegaciones** → reemplazá las actuales por esos dos.
4. Esperá la propagación (minutos a algunas horas). Vercel activa el HTTPS solo.

> Si el dominio hoy tiene correo u otro servicio funcionando, avisá antes de delegar: al cambiar los nameservers hay que recrear esos registros en Vercel.

## 4. Lista de puntos de encuentro automática (opcional, recomendado)

La página ya trae los 25 puntos escritos en el HTML. Para que se actualice sola desde la planilla:

1. En **JONKY MACRO** creá una pestaña nueva llamada `Web`.
2. En la celda A1 pegá:
   ```
   =QUERY('PdE totales'!A1:H; "select B, C, H where E is not null"; 1)
   ```
   Trae Nombre, Dirección y Categoría de los puntos que tienen fecha de inicio.
   Opcional: agregá a mano una columna `Nombre web` si querés controlar cómo se ve cada nombre.
3. **Archivo → Compartir → Publicar en la web** → elegí **solo la pestaña `Web`** → formato **CSV** → Publicar → copiá el link.
4. En `main.js`, pegá el link en `const PDE_CSV_URL = "";` y subí el cambio a GitHub.

> Publicá solo la pestaña `Web`: el resto de la planilla tiene facturación y no debe quedar pública.

## 5. Google

1. **Search Console** (search.google.com/search-console) → agregar propiedad `jonky.com.ar` → verificar → enviar `https://jonky.com.ar/sitemap.xml`.
2. **Google Business Profile** de JONKY con la web y el WhatsApp.

## Pendientes de contenido

- Pregunta "¿Cómo lo conservo?": está comentada en `index.html`. Cuando tengas el dato, descomentala y sumala también al bloque JSON-LD del `<head>`.
- Mapa embebido: el link actual es una lista de Google Maps, que no se puede incrustar. Si creás el mapa en **Google My Maps**, se puede embeber dentro de la página.
