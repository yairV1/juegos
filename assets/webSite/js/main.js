document.addEventListener("DOMContentLoaded", () => {
const juegosContainer = document.getElementById("juegos-container");
const buscarInput = document.getElementById("buscar");
const themeToggle = document.getElementById("theme-toggle");

// Cargar modo guardado
if (localStorage.getItem("modo") === "light") {
document.body.classList.add("light-mode");
themeToggle.textContent = "🌞 Modo Día";
}

// Cambiar tema
themeToggle.addEventListener("click", () => {
document.body.classList.toggle("light-mode");
const modoActual = document.body.classList.contains("light-mode") ? "light" : "dark";
localStorage.setItem("modo", modoActual);
themeToggle.textContent = modoActual === "light" ? "🌞 Modo Día" : "🌙 Modo Noche";
});

// Cargar juegos desde JSON
fetch("juegos.json")
.then(response => response.json())
.then(data => mostrarJuegos(data))
.catch(err => console.error("Error al cargar los juegos:", err));

// Función para mostrar los juegos
function mostrarJuegos(juegos) {
juegosContainer.innerHTML = "";
juegos.forEach(juego => {
const card = document.createElement("div");
card.classList.add("col-md-4", "col-lg-3");
  // Imagen por defecto si falta
  const imagenSrc = juego.imagen && juego.imagen.trim() !== "" 
    ? juego.imagen 
    : "https://via.placeholder.com/300x180/0b0c10/ffffff?text=Sin+Imagen";

  card.innerHTML = `
    <div class="card h-100 text-center p-3 game-card" data-bs-toggle="modal" data-bs-target="#modalJuego">
      <img src="${imagenSrc}" class="card-img-top rounded mb-3" alt="${juego.titulo}">
      <h5 class="card-title">${juego.titulo}</h5>
      <p class="card-text text-secondary">${juego.plataforma}</p>
      <p class="fw-bold text-accent">$${juego.precio}</p>
    </div>
  `;
  card.querySelector(".game-card").addEventListener("click", () => abrirModal(juego));
  juegosContainer.appendChild(card);
});

}

// Mostrar información en el modal
function abrirModal(juego) {
const imagenSrc = juego.imagen && juego.imagen.trim() !== ""
? juego.imagen
: "[https://via.placeholder.com/300x180/0b0c10/ffffff?text=Sin+Imagen](https://via.placeholder.com/300x180/0b0c10/ffffff?text=Sin+Imagen)";
document.getElementById("modalNombre").textContent = juego.titulo;
document.getElementById("modalGenero").textContent = juego.plataforma;
document.getElementById("modalDescripcion").textContent = juego.descripcion;
document.getElementById("modalPrecio").textContent = `$${juego.precio}`;
document.getElementById("modalImagen").src = imagenSrc;
}

// Filtro de búsqueda
buscarInput.addEventListener("input", e => {
const valor = e.target.value.toLowerCase();
fetch("juegos.json")
.then(res => res.json())
.then(data => {
const filtrados = data.filter(juego => juego.titulo.toLowerCase().includes(valor));
mostrarJuegos(filtrados);
});
});
});
