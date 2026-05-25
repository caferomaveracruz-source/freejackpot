/* ============================================================
   FREEJACKPOT INTRO — 3 segundos
   Imagen + destellos ciudad + shimmer texto + rueda fortuna
   ============================================================ */
(function () {

  /* ── Overlay principal ─────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'coins-intro';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9999; overflow:hidden;
    animation: introZoom 3.2s ease forwards;
    cursor:pointer;
  `;

  /* Imagen fondo */
  const bgDiv = document.createElement('div');
  bgDiv.style.cssText = `
    position:absolute; inset:0;
    background:url('assets/images/intro_bg.png') center center / cover no-repeat;
  `;
  overlay.appendChild(bgDiv);

  /* Canvas efectos */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;`;
  overlay.appendChild(canvas);

  /* Canvas rueda (encima) */
  const wheelCanvas = document.createElement('canvas');
  wheelCanvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 0.15s ease;`;
  overlay.appendChild(wheelCanvas);

  /* Estilos CSS */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes introZoom {
      0%   { transform: scale(1.08); }
      100% { transform: scale(1.0); }
    }
    @keyframes shimmerSweep {
      0%   { left: -60%; }
      100% { left: 130%; }
    }
    @keyframes textPulse {
      0%,100% { opacity:1; text-shadow: 0 0 30px rgba(255,200,0,0.9), 0 0 60px rgba(255,100,0,0.6); }
      50%      { opacity:0.85; text-shadow: 0 0 50px rgba(255,220,0,1), 0 0 100px rgba(255,150,0,0.8); }
    }
    @keyframes bienvenido {
      0%   { transform:translateY(30px) scale(0.7); opacity:0; }
      60%  { transform:translateY(-4px) scale(1.05); opacity:1; }
      100% { transform:translateY(0) scale(1); opacity:1; }
    }
  `;
  document.head.appendChild(style);

  /* Shimmer sweep sobre el texto */
  const shimmer = document.createElement('div');
  shimmer.style.cssText = `
    position:absolute; top:30%; height:40%; width:55%;
    background: linear-gradient(105deg,
      transparent 30%,
      rgba(255,255,200,0.18) 50%,
      transparent 70%);
    animation: shimmerSweep 1.4s ease 0.3s infinite;
    pointer-events:none; z-index:3;
  `;
  overlay.appendChild(shimmer);



  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);

  /* Click para saltar */
  overlay.addEventListener('click', () => startWheelAndClose(true));

  /* ── Canvas setup ──────────────────────────────────────── */
  const ctx   = canvas.getContext('2d');
  const wCtx  = wheelCanvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = wheelCanvas.width = window.innerWidth;
    H = canvas.height = wheelCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Destello de ciudad ────────────────────────────────── */
  class CitySparkle {
    constructor() { this.reset(); }
    reset() {
      /* Zona ciudad: parte superior de la imagen */
      this.x    = Math.random() * W;
      this.y    = Math.random() * H * 0.62;
      this.life = 0;
      this.max  = 25 + Math.random() * 45;
      this.sz   = 1.2 + Math.random() * 3.5;
      this.hue  = Math.random() < 0.55 ? '#ffe566'
                : Math.random() < 0.5  ? '#ffffff' : '#ff6eff';
    }
    update() { this.life++; if (this.life > this.max) this.reset(); }
    draw(c) {
      const a = Math.sin((this.life / this.max) * Math.PI);
      const s = this.sz;
      c.save();
      c.globalAlpha = a * 0.85;
      c.fillStyle   = this.hue;
      c.shadowBlur  = 10; c.shadowColor = this.hue;
      c.fillRect(this.x - s*4, this.y - 0.8, s*8, 1.6);
      c.fillRect(this.x - 0.8, this.y - s*4, 1.6, s*8);
      /* Diagonales */
      c.save(); c.translate(this.x, this.y); c.rotate(Math.PI/4);
      c.fillRect(-s*2.5, -0.6, s*5, 1.2);
      c.fillRect(-0.6, -s*2.5, 1.2, s*5);
      c.restore();
      c.restore();
    }
  }

  /* ── Moneda ────────────────────────────────────────────── */
  class Coin {
    constructor(delay) {
      this.delay  = delay || 0;
      this.active = this.delay === 0;
      this.reset(true);
    }
    reset(init = false) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H * -0.9 : -70 - Math.random()*100;
      this.r   = 14 + Math.random() * 26;
      this.vy  = 2.8 + Math.random() * 4.5;
      this.vx  = (Math.random() - 0.5) * 2;
      this.rot = Math.random() * Math.PI * 2;
      this.rs  = (Math.random() - 0.5) * 0.18;
      this.o   = 0.8 + Math.random() * 0.2;
      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.y += this.vy; this.x += this.vx;
      this.rot += this.rs; this.vy += 0.05;
      if (this.y > H + 80) this.reset();
    }
    draw(c) {
      if (!this.active) return;
      const sx = Math.abs(Math.cos(this.rot));
      const rx = Math.max(this.r * sx, 1), ry = this.r;
      c.save();
      c.globalAlpha = this.o;
      c.translate(this.x, this.y);

      c.beginPath();
      c.ellipse(0, 0, rx, ry, 0, 0, Math.PI*2);
      const g = c.createRadialGradient(-rx*.3,-ry*.35,rx*.04, rx*.1,ry*.1,rx*1.3);
      g.addColorStop(0,    '#fffde8');
      g.addColorStop(0.08, '#ffe566');
      g.addColorStop(0.32, '#ffc200');
      g.addColorStop(0.65, '#e08000');
      g.addColorStop(0.85, '#b85a00');
      g.addColorStop(1,    '#7a3500');
      c.fillStyle = g; c.fill();
      c.strokeStyle = 'rgba(255,190,20,0.5)';
      c.lineWidth = 1.5; c.stroke();

      if (sx > 0.28) {
        c.save(); c.clip();
        const sh = c.createRadialGradient(-rx*.42,-ry*.40,0,-rx*.42,-ry*.40,rx*.6);
        sh.addColorStop(0,   'rgba(255,255,240,0.78)');
        sh.addColorStop(0.5, 'rgba(255,240,150,0.22)');
        sh.addColorStop(1,   'rgba(255,220,0,0)');
        c.fillStyle = sh;
        c.fillRect(-rx,-ry,rx*2,ry*2);
        c.restore();
      }
      if (sx > 0.5 && this.r > 20) {
        c.save(); c.clip();
        c.globalAlpha = 0.4*sx;
        c.fillStyle = '#7a3000';
        c.font = `bold ${this.r*.72}px serif`;
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.scale(sx, 1); c.fillText('$', 0, 1);
        c.restore();
      }
      c.restore();
    }
  }

  /* ── Rueda de la Fortuna ───────────────────────────────── */
  const SEGMENTS = 12;
  const SEG_COLORS = [
    '#d40000','#ffd700','#1a6b00','#ffd700',
    '#0033cc','#ffd700','#d40000','#ffd700',
    '#7700cc','#ffd700','#ff6600','#ffd700',
  ];
  const SEG_LABELS = ['777','★','$$$','♠','WILD','♦','FREE','♣','2x','♥','JACKPOT','🎰'];

  function drawWheel(angle, alpha) {
    wCtx.clearRect(0, 0, W, H);
    if (alpha <= 0) return;

    const cx = W / 2, cy = H / 2;
    const R  = Math.min(W, H) * 0.32;
    const step = (Math.PI * 2) / SEGMENTS;

    wCtx.save();
    wCtx.globalAlpha = alpha;

    /* Sombra exterior */
    wCtx.shadowBlur  = 60;
    wCtx.shadowColor = 'rgba(255,180,0,0.8)';

    /* Segmentos */
    for (let i = 0; i < SEGMENTS; i++) {
      const a0 = angle + i * step;
      const a1 = a0 + step;
      wCtx.beginPath();
      wCtx.moveTo(cx, cy);
      wCtx.arc(cx, cy, R, a0, a1);
      wCtx.closePath();
      wCtx.fillStyle = SEG_COLORS[i];
      wCtx.fill();
      wCtx.strokeStyle = '#ffd700';
      wCtx.lineWidth = 3;
      wCtx.stroke();

      /* Texto del segmento */
      wCtx.save();
      wCtx.translate(cx, cy);
      wCtx.rotate(a0 + step / 2);
      wCtx.textAlign    = 'right';
      wCtx.textBaseline = 'middle';
      wCtx.fillStyle    = '#ffffff';
      wCtx.font         = `bold ${R * 0.11}px 'Exo 2', sans-serif`;
      wCtx.shadowBlur   = 4;
      wCtx.shadowColor  = 'rgba(0,0,0,0.7)';
      wCtx.fillText(SEG_LABELS[i], R * 0.88, 0);
      wCtx.restore();
    }

    /* Aro exterior dorado */
    wCtx.beginPath();
    wCtx.arc(cx, cy, R, 0, Math.PI * 2);
    const rim = wCtx.createLinearGradient(cx-R, cy-R, cx+R, cy+R);
    rim.addColorStop(0,   '#fffde8');
    rim.addColorStop(0.3, '#ffd700');
    rim.addColorStop(0.7, '#e08000');
    rim.addColorStop(1,   '#b85a00');
    wCtx.strokeStyle = rim;
    wCtx.lineWidth   = R * 0.07;
    wCtx.shadowBlur  = 20;
    wCtx.shadowColor = '#ffd700';
    wCtx.stroke();

    /* Tornillos decorativos */
    for (let i = 0; i < SEGMENTS; i++) {
      const a = angle + i * step;
      wCtx.beginPath();
      wCtx.arc(cx + Math.cos(a)*R, cy + Math.sin(a)*R, R*0.035, 0, Math.PI*2);
      wCtx.fillStyle = '#fffde8';
      wCtx.shadowBlur = 6; wCtx.shadowColor = '#ffd700';
      wCtx.fill();
    }

    /* Centro hub */
    const hub = wCtx.createRadialGradient(cx, cy, 0, cx, cy, R*0.14);
    hub.addColorStop(0, '#fffde8');
    hub.addColorStop(0.4,'#ffd700');
    hub.addColorStop(1,  '#b85a00');
    wCtx.beginPath();
    wCtx.arc(cx, cy, R*0.14, 0, Math.PI*2);
    wCtx.fillStyle = hub;
    wCtx.shadowBlur = 20; wCtx.shadowColor = '#ffd700';
    wCtx.fill();
    wCtx.strokeStyle = '#fffde8'; wCtx.lineWidth = 3; wCtx.stroke();

    /* Flecha indicadora (arriba) */
    wCtx.save();
    wCtx.translate(cx, cy - R - R*0.04);
    wCtx.fillStyle = '#ff2200';
    wCtx.shadowBlur = 10; wCtx.shadowColor = '#ff0000';
    wCtx.beginPath();
    wCtx.moveTo(0, R*0.12);
    wCtx.lineTo(-R*0.06, -R*0.06);
    wCtx.lineTo(R*0.06, -R*0.06);
    wCtx.closePath();
    wCtx.fill();
    wCtx.restore();

    wCtx.restore();
  }

  /* ── Partículas ────────────────────────────────────────── */
  const COIN_N  = Math.min(55, Math.floor(W*H/11000));
  const SPARK_N = 40;
  const coins    = Array.from({length: COIN_N},   (_, i) => new Coin(i < COIN_N*0.5 ? 0 : Math.random()*1200));
  const sparkles = Array.from({length: SPARK_N},  () => new CitySparkle());

  /* ── Loop ──────────────────────────────────────────────── */
  let animId, startTime = null;
  const DURATION  = 3000;
  const FADE_TIME = 350;
  let phase = 'main';  // 'main' | 'wheel' | 'done'
  let wheelStart = null, wheelAngle = 0, wheelAlpha = 0;

  function startWheelAndClose(instant = false) {
    if (phase !== 'main') return;
    phase = 'wheel';
    wheelStart = null;

    /* Fade rápido de la imagen */
    overlay.style.transition = `opacity ${instant ? 0.25 : FADE_TIME/1000}s ease`;
    overlay.style.opacity = '0';

    /* Mostrar canvas rueda */
    wheelCanvas.style.opacity = '1';
    wheelCanvas.style.transition = 'opacity 0.15s ease';

    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(wheelLoop);

    /* Quitar body overflow después */
    setTimeout(() => {
      document.body.style.overflow = '';
      overlay.remove();
      style.remove();
      window.removeEventListener('resize', resize);
    }, 950);
  }

  function wheelLoop(ts) {
    if (!wheelStart) wheelStart = ts;
    const elapsed = ts - wheelStart;
    const WHEEL_DUR = 850;

    /* Velocidad: rápido al inicio, desacelera */
    const progress = elapsed / WHEEL_DUR;
    const speed    = Math.max(0.02, 0.32 * Math.pow(1 - progress, 1.8));
    wheelAngle    += speed;

    /* Alpha: aparece rápido, se va al final */
    if (elapsed < 120)       wheelAlpha = elapsed / 120;
    else if (elapsed > 600)  wheelAlpha = Math.max(0, 1 - (elapsed-600)/250);
    else                     wheelAlpha = 1;

    drawWheel(wheelAngle, wheelAlpha);

    if (elapsed < WHEEL_DUR) {
      animId = requestAnimationFrame(wheelLoop);
    } else {
      wCtx.clearRect(0, 0, W, H);
      wheelCanvas.remove();
    }
  }

  function mainLoop(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;

    /* Activar monedas con delay */
    coins.forEach(c => { if (!c.active && elapsed >= c.delay) c.active = true; });

    /* Fade final */
    if (elapsed > DURATION - FADE_TIME) {
      const t = (elapsed - (DURATION - FADE_TIME)) / FADE_TIME;
      overlay.style.opacity = String(Math.max(0, 1 - t));
    }

    ctx.clearRect(0, 0, W, H);

    /* Velo muy sutil */
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, W, H);

    sparkles.forEach(s => { s.update(); s.draw(ctx); });
    coins.sort((a,b) => a.r - b.r);
    coins.forEach(c => { c.update(); c.draw(ctx); });

    if (elapsed < DURATION) {
      animId = requestAnimationFrame(mainLoop);
    } else {
      startWheelAndClose();
    }
  }

  /* ── Arrancar ──────────────────────────────────────────── */
  function start() { requestAnimationFrame(mainLoop); }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

})();
