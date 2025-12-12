/****************************************************
 * 🗓️ MOSTRAR FECHA ACTUAL
 ****************************************************/
const fechaElem = document.getElementById("fecha");
if (fechaElem) {
  const hoy = new Date();
  const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  fechaElem.textContent = hoy.toLocaleDateString("es-AR", opciones);
}

/****************************************************
 * 🏠 BOTÓN RIADIGOS (ir a la página principal)
 ****************************************************/
function irPrincipal() {
  // Cambiar por la URL real del inicio cuando esté lista
  window.location.href = "index.html";
}

/****************************************************
 * 🔍 BOTÓN BUSCAR (ir a buscador)
 ****************************************************/
function irBuscar() {
  window.location.href = "buscar.html";
}

/****************************************************
 * 🏪 SELECTOR DE SUCURSAL
 ****************************************************/
function toggleSelector() {
  const lista = document.getElementById("listaFarmacias");
  lista.style.display = lista.style.display === "block" ? "none" : "block";
}

function seleccionarFarmacia(nombre) {
  document.getElementById("farmaciaSeleccionada").textContent = "Sucursal: " + nombre;
  document.getElementById("listaFarmacias").style.display = "none";
  // Guardar la sucursal seleccionada para usarla al guardar
  localStorage.setItem("sucursalActual", nombre);
}

/****************************************************
 * 💰 FORMATO MONEDA Y CÁLCULO DE TOTALES
 ****************************************************/
const tabla = document.getElementById("tablaSemanal");
if (tabla) {
  tabla.addEventListener("input", (e) => {
    if (e.target.hasAttribute("contenteditable")) {
      const valor = e.target.innerText.replace(/[^\d,.-]/g, "").replace(",", ".");
      e.target.dataset.valor = parseFloat(valor) || 0;
      actualizarTotales();
    }
  });

  tabla.addEventListener("blur", (e) => {
    if (e.target.hasAttribute("contenteditable")) {
      const valor = parseFloat(e.target.dataset.valor || 0);
      e.target.innerText = valor.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    }
  }, true);

  tabla.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const celdas = [...tabla.querySelectorAll("[contenteditable]")];
      const idx = celdas.indexOf(e.target);
      if (idx >= 0 && idx < celdas.length - 1) {
        celdas[idx + 1].focus();
      }
    }
  });
}

/****************************************************
 * 🧮 ACTUALIZAR TOTALES
 ****************************************************/
function actualizarTotales() {
  const filas = [...tabla.querySelectorAll("tbody tr:not(.fila-total)")];
  let totalClover = 0, totalPosnet = 0, totalGeneral = 0;

  filas.forEach((fila) => {
    const c1 = parseFloat(fila.children[1].dataset.valor || 0);
    const c2 = parseFloat(fila.children[2].dataset.valor || 0);
    const suma = c1 + c2;
    fila.children[3].innerText = suma.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
    totalClover += c1;
    totalPosnet += c2;
    totalGeneral += suma;
  });

  document.getElementById("totalClover").innerText = totalClover.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  document.getElementById("totalPosnet").innerText = totalPosnet.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  document.getElementById("totalGeneral").innerText = totalGeneral.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

/****************************************************
 * 💾 GUARDAR SEMANA (estructura global en localStorage)
 ****************************************************/
function guardarTabla() {
  const sucursal = localStorage.getItem("sucursalActual");
  const semana = document.getElementById("semanaInput").value.trim();
  const resumen = document.getElementById("resumenInput").value.trim();

  if (!sucursal) return alert("Seleccioná una sucursal antes de guardar.");
  if (!semana) return alert("Ingresá la semana.");
  if (!resumen) return alert("Ingresá el resumen.");

  // Recolectar datos de la tabla
  const filas = [...tabla.querySelectorAll("tbody tr:not(.fila-total)")];
  const datos = filas.map((fila) => ({
    dia: fila.children[0].innerText,
    clover: parseFloat(fila.children[1].dataset.valor || 0),
    posnet: parseFloat(fila.children[2].dataset.valor || 0),
    total: parseFloat(
      (fila.children[1].dataset.valor || 0) * 1 +
      (fila.children[2].dataset.valor || 0) * 1
    ),
  }));

  const registro = {
    sucursal,
    semana,
    resumen,
    datos,
    totales: {
      clover: parseFloat(document.getElementById("totalClover").innerText.replace(/[^\d.-]/g, "")) || 0,
      posnet: parseFloat(document.getElementById("totalPosnet").innerText.replace(/[^\d.-]/g, "")) || 0,
      general: parseFloat(document.getElementById("totalGeneral").innerText.replace(/[^\d.-]/g, "")) || 0,
    },
    fechaGuardado: new Date().toLocaleString("es-AR"),
  };

  // Guardar en localStorage
  const registros = JSON.parse(localStorage.getItem("cierresRiadigos") || "[]");
  registros.push(registro);
  localStorage.setItem("cierresRiadigos", JSON.stringify(registros));

  alert("✅ Semana guardada correctamente para " + sucursal.toUpperCase());
}

/****************************************************
 * ☁️ GUARDAR EN FIREBASE
 ****************************************************/
import { db, collection, addDoc } from "../config/firebase-config.js";
firebase.initializeApp(firebaseConfig);

async function guardarEnFirebase(registro) {
  try {
    await addDoc(collection(db, "cierres"), registro);
    alert("✅ Semana guardada en la nube correctamente.");
  } catch (e) {
    console.error("❌ Error al guardar en Firebase:", e);
    alert("Error al guardar en la nube. Ver consola.");
  }
}

/****************************************************
 * 💾 MODIFICAR GUARDAR TABLA
 ****************************************************/
async function guardarTabla() {
  const sucursal = localStorage.getItem("sucursalActual");
  const semana = document.getElementById("semanaInput").value.trim();
  const resumen = document.getElementById("resumenInput").value.trim();

  if (!sucursal) return alert("Seleccioná una sucursal antes de guardar.");
  if (!semana) return alert("Ingresá la semana.");
  if (!resumen) return alert("Ingresá el resumen.");

  const filas = [...tabla.querySelectorAll("tbody tr:not(.fila-total)")];
  const datos = filas.map(fila => ({
    dia: fila.children[0].innerText,
    clover: parseFloat(fila.children[1].dataset.valor || 0),
    posnet: parseFloat(fila.children[2].dataset.valor || 0),
    total: parseFloat(fila.children[3].innerText.replace(/[^\d.-]/g, "") || 0)
  }));

  const registro = {
    sucursal,
    semana,
    resumen,
    datos,
    totales: {
      clover: parseFloat(document.getElementById("totalClover").innerText.replace(/[^\d.-]/g, "")) || 0,
      posnet: parseFloat(document.getElementById("totalPosnet").innerText.replace(/[^\d.-]/g, "")) || 0,
      general: parseFloat(document.getElementById("totalGeneral").innerText.replace(/[^\d.-]/g, "")) || 0,
    },
    fechaGuardado: new Date().toLocaleString("es-AR")
  };

  // Guardar localmente
  const registros = JSON.parse(localStorage.getItem("cierresRiadigos") || "[]");
  registros.push(registro);
  localStorage.setItem("cierresRiadigos", JSON.stringify(registros));

  // Guardar también en la nube
  await guardarEnFirebase(registro);
}
