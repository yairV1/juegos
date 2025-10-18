// 🎮 Mostrar juegos dentro de la sección "catalogo"

document.addEventListener("DOMContentLoaded", () => {
  const contenedorJuegos = document.getElementById("contenedor-juegos");
  const filtroPlataforma = document.getElementById("filtro-plataforma");

  // Función principal: cargar los datos del JSON
  const cargarJuegos = async () => {
    try {
      fetch("../../assets/data/juegos.json");
      const datos = await respuesta.json();
      mostrarJuegos(datos.juegos);
      configurarFiltro(datos.juegos);
    } catch (error) {
      console.error("Error al cargar los juegos:", error);
      contenedorJuegos.innerHTML = `<p class="text-danger text-center mt-5">Error al cargar los juegos. Intenta nuevamente.</p>`;
    }
  };

  // Mostrar juegos en el contenedor
  const mostrarJuegos = (lista) => {
    contenedorJuegos.innerHTML = "";
    lista.forEach((juego) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "col-lg-3", "mb-4", "fade-in");

      card.innerHTML = `
        <div class="card h-100 shadow-sm border-0 bg-dark text-light game-card">
          <img src="${juego.imagen}" class="card-img-top" alt="${juego.titulo}">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title text-success">${juego.titulo}</h5>
              <p class="card-text small text-secondary">${juego.descripcion}</p>
            </div>
            <div class="mt-3">
              <span class="badge bg-success me-2">${juego.plataforma}</span>
              <p class="fw-bold mt-2">$${juego.precio.toFixed(2)}</p>
              <p class="text-warning mb-1">⭐ ${juego.valoracion}</p>
              <button class="btn btn-outline-success w-100 mt-2">Ver más</button>
            </div>
          </div>
        </div>
      `;
      contenedorJuegos.appendChild(card);
    });
  };

  // Filtro por plataforma
  const configurarFiltro = (lista) => {
    filtroPlataforma.addEventListener("change", (e) => {
      const seleccion = e.target.value;
      if (seleccion === "todos") {
        mostrarJuegos(lista);
      } else {
        const filtrados = lista.filter(
          (juego) => juego.plataforma.toLowerCase() === seleccion.toLowerCase()
        );
        mostrarJuegos(filtrados);
      }
    });
  };

  cargarJuegos();
});
