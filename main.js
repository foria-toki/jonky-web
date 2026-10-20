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

cargarPuntos();
