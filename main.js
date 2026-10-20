/* JONKY · Pasiones Dulces */

/*
 * Lista de puntos de encuentro desde Google Sheets.
 * Pegá acá el link CSV de la pestaña "Web" publicada (ver README).
 * Si queda vacío o falla, la página muestra la lista escrita en el HTML.
 */
const PDE_CSV_URL = "";

const RUBROS = [
  { titulo: "Carnicerías", match: ["carniceria"] },
  { titulo: "Vinotecas y bebidas", match: ["bebidas", "vinoteca"] },
  { titulo: "Fiambrerías", match: ["fiambreria"] },
  { titulo: "Almacenes y panaderías", match: ["alimentos", "almacen", "panaderia", "despensa"] },
  { titulo: "Restó, bar y más", match: [] } // todo lo demás
];

document.getElementById("anio").textContent = new Date().getFullYear();

const sinTildes = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

function parseCSV(texto) {
  const filas = [];
  let fila = [], campo = "", entreComillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') entreComillas = false;
      else campo += c;
    } else if (c === '"') entreComillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter((f) => f.some((v) => v.trim() !== ""));
}

const MINUSCULAS = new Set(["y", "de", "del", "la", "las", "el", "los"]);
function nombreLindo(n) {
  return n
    .replace(/\/\\\s*\d+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && MINUSCULAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

function rubroDe(categoria) {
  const c = sinTildes(categoria || "");
  return RUBROS.find((r) => r.match.some((m) => c.includes(m))) || RUBROS[RUBROS.length - 1];
}

function el(tag, attrs = {}, hijos = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (k === "text" ? (e.textContent = v) : e.setAttribute(k, v)));
  hijos.forEach((h) => e.appendChild(h));
  return e;
}

async function cargarPuntos() {
  if (!PDE_CSV_URL) return;
  try {
    const res = await fetch(PDE_CSV_URL, { cache: "no-store" });
    if (!res.ok) return;
    const filas = parseCSV(await res.text());
    const cab = filas.shift().map(sinTildes);
    const iWeb = cab.findIndex((h) => h === "nombre web");
    const iN = iWeb >= 0 ? iWeb : cab.findIndex((h) => h.startsWith("nombre"));
    const iD = cab.findIndex((h) => h.startsWith("direccion"));
    const iC = cab.findIndex((h) => h.startsWith("categoria"));
    if (iN < 0 || iD < 0) return;

    const puntos = filas
      .map((f) => ({ nombre: nombreLindo(f[iN] || ""), dir: (f[iD] || "").trim(), cat: iC >= 0 ? f[iC] : "" }))
      .filter((p) => p.nombre);
    if (!puntos.length) return;

    const cont = document.getElementById("pde-rubros");
    cont.replaceChildren();
    RUBROS.forEach((r) => {
      const lista = puntos.filter((p) => rubroDe(p.cat) === r);
      if (!lista.length) return;
      const ul = el("ul", {}, lista.map((p) => {
        const q = encodeURIComponent(`${p.nombre} ${p.dir} Río Cuarto Córdoba`);
        return el("li", {}, [el("a", { href: `https://www.google.com/maps/search/?api=1&query=${q}`, target: "_blank", rel: "noopener" }, [
          el("strong", { text: p.nombre }),
          el("small", { text: p.dir || "Río Cuarto" })
        ])]);
      }));
      const h3 = el("h3", { text: r.titulo + " " }, [el("span", { text: `(${lista.length})` })]);
      cont.appendChild(el("div", { class: "rubro" }, [h3, ul]));
    });
    document.getElementById("pde-total").textContent = puntos.length;
  } catch (e) {
    /* si falla, queda la lista del HTML */
  }
}

/*
 * Mapa de puntos de encuentro (Leaflet + OpenStreetMap).
 * Toma los puntos de la lista de abajo y los ubica con estas coordenadas, por dirección.
 * Un punto nuevo sin coordenadas acá aparece en la lista pero no en el mapa.
 * Si el mapa no carga, queda el botón a Google Maps.
 */
const COORDS = {
  "guardias nacionales 1854": [-33.10636, -64.36723],
  "belgrano 498": [-33.12454, -64.34328],
  "cabrera 175": [-33.11818, -64.34984],
  "buenos aires 491": [-33.12323, -64.35354],
  "moreno 1503": [-33.12261, -64.367],
  "moreno 1401": [-33.12289, -64.36543],
  "san martin 2605": [-33.1151, -64.38257],
  "av marcelo t de alvear 392": [-33.10945, -64.34087],
  "velez sarsfield 243": [-33.12497, -64.3462],
  "ing dinkeldein 2116": [-33.13415, -64.36779],
  "chile 27": [-33.10966, -64.34042],
  "gdor guzman 1001": [-33.11967, -64.35778],
  "gdor guzman 1802": [-33.11676, -64.36994],
  "av marcelo t de alvear 1800": [-33.09517, -64.32549],
  "av guillermo marconi 900": [-33.11473, -64.3539],
  "9 de julio 1098": [-33.12645, -64.35571],
  "sadi carnot 164": [-33.1305, -64.35236],
  "san martin 1894": [-33.11767, -64.37184],
  "pringles 160": [-33.12997, -64.34863],
  "dean funes 658": [-33.12087, -64.35458],
  "av italia 1158": [-33.12811, -64.35096],
  "sarmiento 551": [-33.1233, -64.34289],
  "av italia 1110": [-33.12771, -64.35091],
  "sarmiento 1314": [-33.13091, -64.34528],
  "constitucion 533": [-33.12167, -64.34889]
};
const LEAFLET = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/";
const PIN = '<svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true"><path d="M15 39s13-12.4 13-23.5A13 13 0 0 0 2 15.5C2 26.6 15 39 15 39z" fill="#4A301E" stroke="#F8F4E6" stroke-width="2"/><circle cx="15" cy="15.5" r="5.5" fill="#DA5923"/></svg>';

const clave = (dir) => sinTildes(dir).replace(/[.,]/g, "").replace(/\s+/g, " ");

// Los estilos de Leaflet van antes de styles.css, así los de JONKY les ganan.
function cargarRecurso(tag, attrs) {
  return new Promise((ok, mal) => {
    const e = el(tag, attrs);
    e.onload = ok;
    e.onerror = mal;
    document.head.insertBefore(e, document.querySelector('link[href="/styles.css"]'));
  });
}

function puntosDeLaLista() {
  return [...document.querySelectorAll("#pde-rubros .rubro")].flatMap((r) => {
    const rubro = r.querySelector("h3").firstChild.textContent.trim();
    return [...r.querySelectorAll("li a")].map((a) => {
      const dir = a.querySelector("small").textContent;
      return { nombre: a.querySelector("strong").textContent, dir, rubro, href: a.href, coords: COORDS[clave(dir)] };
    });
  }).filter((p) => p.coords);
}

async function iniciarMapa() {
  const caja = document.getElementById("mapa");
  const lienzo = document.getElementById("mapa-lienzo");
  await Promise.all([
    cargarRecurso("link", { rel: "stylesheet", href: LEAFLET + "leaflet.min.css" }),
    cargarRecurso("script", { src: LEAFLET + "leaflet.min.js" }),
    listaCargada
  ]);
  const puntos = puntosDeLaLista();
  if (!window.L || !puntos.length) return;

  // En el celular el mapa no se arrastra hasta que lo tocás, para no trabar el scroll de la página.
  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const mapa = L.map(lienzo, { scrollWheelZoom: false, dragging: !tactil });
  mapa.attributionControl.setPrefix(false);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(mapa);

  const icono = L.divIcon({ className: "pin", html: PIN, iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -36] });
  puntos.forEach((p) => {
    const popup = el("div", { class: "pin-popup" }, [
      el("strong", { text: p.nombre }),
      el("span", { text: p.dir }),
      el("small", { text: p.rubro }),
      el("a", { href: p.href, target: "_blank", rel: "noopener", text: "Cómo llegar →" })
    ]);
    L.marker(p.coords, { icon: icono, title: `${p.nombre} · ${p.dir}`, alt: p.nombre }).bindPopup(popup).addTo(mapa);
  });
  mapa.fitBounds(L.latLngBounds(puntos.map((p) => p.coords)), { padding: [36, 36] });
  caja.classList.add("mapa--listo");

  if (tactil) {
    const aviso = document.getElementById("mapa-aviso");
    aviso.hidden = false;
    lienzo.addEventListener("click", () => {
      mapa.dragging.enable();
      aviso.hidden = true;
    }, { once: true });
  }
}

const listaCargada = cargarPuntos();

// El mapa se carga recién cuando la sección está por aparecer en pantalla.
const cajaMapa = document.getElementById("mapa");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    obs.disconnect();
    iniciarMapa().catch(() => { /* queda el botón a Google Maps */ });
  }, { rootMargin: "400px" });
  obs.observe(cajaMapa);
} else {
  iniciarMapa().catch(() => {});
}
