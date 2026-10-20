# Instrucciones para Claude Code — web JONKY

Sitio estático (HTML + CSS + JS, sin build). Todos los archivos están en la raíz a propósito: no muevas nada a subcarpetas ni cambies rutas.

## Objetivo
Publicar este sitio en Vercel y conectarlo a jonky.com.ar.

## Pasos
1. Verificar que `index.html`, `styles.css`, `main.js`, las `.woff2` y las imágenes estén en la raíz de esta carpeta.
2. Git + GitHub (cuenta `mensionts`):
   ```bash
   git init && git add . && git commit -m "Web JONKY: landing inicial"
   gh repo create mensionts/jonky-web --public --source . --push
   ```
   Si el repo ya existe: `git remote add origin https://github.com/mensionts/jonky-web.git && git branch -M main && git push -u origin main --force`
   (Preguntar antes de usar `--force` si el repo tiene contenido.)
3. Vercel (equipo `comercial-toki`, proyecto existente `jonky-web`):
   ```bash
   npx vercel link --scope comercial-toki --project jonky-web --yes
   npx vercel --prod
   ```
   En el proyecto: Framework Preset = **Other**, Build Command vacío, Output Directory vacío (raíz), **Root Directory vacío**.
   Si el proyecto está conectado al repo de GitHub, alcanza con el push del paso 2.
4. Verificar la URL de producción: tiene que cargar con fondo durazno, el "JONKY" gigante marrón, la faja naranja y la lista de 25 puntos de encuentro. Revisar que `/styles.css`, `/NewTitle-Bold.woff2` y `/logo-marron.webp` respondan 200.
5. Dominio:
   ```bash
   npx vercel domains add jonky.com.ar --scope comercial-toki
   npx vercel domains add www.jonky.com.ar --scope comercial-toki
   ```
   Indicarle a Facundo que en nic.ar → Delegaciones ponga `ns1.vercel-dns.com` y `ns2.vercel-dns.com`. Antes, confirmar con él si el dominio tiene correo u otro servicio activo.

## No tocar
- Textos, colores y tipografías: siguen el manual de marca de JONKY (Pizca).
- `vercel.json`: redirige www → jonky.com.ar y cachea fuentes/imágenes.

## Pendientes conocidos (ver README.md)
- `main.js` → `PDE_CSV_URL` vacío hasta publicar la pestaña "Web" de la planilla JONKY MACRO.
- Pregunta "¿Cómo lo conservo?" comentada en `index.html` hasta tener el dato.
