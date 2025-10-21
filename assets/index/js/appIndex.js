// app.js
// Módulo responsable de interactividad y placeholder para animación 3D.
// Cuando quieras integrar Three.js, lo haremos aquí.

const btnToggle = document.getElementById('btn-toggle');
const mainNav = document.querySelector('.main-nav');

btnToggle?.addEventListener('click', () => {
  const isOpen = mainNav.style.display === 'block';
  mainNav.style.display = isOpen ? '' : 'block';
});

// Ajustar canvas al tamaño de la ventana (placeholder)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPlaceholder();
  }
  function drawPlaceholder(){
    if (!ctx) return;
    // degradado sutil para que parezca "fondo dinámico"
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0,'rgba(12,6,30,0.8)');
    g.addColorStop(1,'rgba(2,8,20,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // algunas partículas suaves (no costosas)
    for (let i=0;i<80;i++){
      const x = Math.random()*canvas.width;
      const y = Math.random()*canvas.height;
      const r = Math.random()*1.5+0.2;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + (Math.random()*0.06) + ')';
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}
