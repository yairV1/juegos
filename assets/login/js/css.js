// ===== Fondo de cuadrícula interactiva =====
const bg = document.createElement('div');
bg.className = 'bg-grid';
document.body.appendChild(bg);

const cols = Math.floor(window.innerWidth / 26);
const rows = Math.floor(window.innerHeight / 26);
for (let i = 0; i < cols * rows; i++) {
  const cell = document.createElement('div');
  cell.className = 'bg-cell';
  bg.appendChild(cell);
}

// Detecta posición del mouse y enciende celdas cercanas
document.addEventListener('mousemove', e => {
  const { clientX: x, clientY: y } = e;
  const cells = document.querySelectorAll('.bg-cell');
  const cellWidth = window.innerWidth / cols;
  const cellHeight = window.innerHeight / rows;
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);
  
  cells.forEach((c, i) => {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const dist = Math.hypot(cx - col, cy - row);
    const glowZone = dist < 2; // radio de brillo
    c.classList.toggle('glow', glowZone);
  });
});
