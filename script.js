(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const relationshipStart = new Date('2026-01-11T00:00:00+08:00');
  const signals = [
    ['2025.06.23', '相遇坐标', '那天晚风和你的裙摆一样温柔，宇宙的引力从此有了确切的方向。', 'FIRST SIGNAL'],
    ['2026.01.11', '时间有了名字', '从这一天开始，普通的日期也被赋予了值得纪念的光。', 'LOVE LOG'],
    ['未来时空', '仍然会是第一天', '在下一个、下下个光年里，依然会像第一天那样为你着迷。', 'FUTURE NOTE'],
    ['专属注记', '岁岁年年', '愿你的岁岁年年，都有漫天星光和永远不退场的偏爱。', 'ORBIT NOTE'],
    ['永久备份', '无法褪色的章节', '这段时光已被刻入宇宙背景辐射，无可擦除，永不褪色。', 'ARCHIVE'],
    ['深空信号', '唯一值得停靠', '跨越星系的漫长旅途中，你是唯一值得我减速停靠的引力场。', 'SIGNAL 042'],
    ['生日这一天', '北极星', '从那年秋天开始，我的世界便只有你这一颗北极星。生日快乐，花花。', 'NORTH STAR'],
    ['无限靠近', '温柔的常数', '你是我加速膨胀的宇宙里，唯一温柔而笃定的常数。', 'COSMIC']
  ];
  const captions = ['心动存档', '一起走过的晴天', '偷偷收藏的笑', '星光落在肩上', '我们的散步轨迹', '轻轻靠近的瞬间', '夏日的信', '在同一片天空下', '小小的仪式感', '被记住的温柔', '永远的我们'];
  const memorySizes = [[1080, 1440], [1081, 1600], [1200, 1600], [1080, 1440], [1200, 1600], [1200, 1600], [1208, 1600], [957, 1600], [1080, 1510], [1200, 1600], [1214, 1600]];
  const memoryNotes = [
    '那一刻没有盛大配乐，却成了后来所有故事的序章。',
    '晴天很普通，因为和你一起，才被我认真保存。',
    '宇宙里有无数种光，我还是最喜欢你笑起来的那一种。',
    '光落在你肩上，而我的目光刚好在那里停留。',
    '走过的路不需要名字，只要身边的人一直是你。',
    '距离慢慢缩短，两个世界从此共享同一条轨道。',
    '把夏天折成一封信，收件人永远只有一个。',
    '抬头看见同一片天，就像我们从来没有离得很远。',
    '浪漫不是隆重，是每一个小小瞬间都愿意为你用心。',
    '温柔被镜头记住，也被我一遍又一遍放在心里。',
    '这一帧没有终点，它只是我们下一段故事的开始。'
  ];
  const pad = value => String(Math.max(0, value)).padStart(2, '0');

  function renderSignals() {
    const host = $('[data-signals]');
    if (!host) return;
    host.innerHTML = signals.map((item, index) => `<article class="signal-card reveal" data-index="${pad(index + 1)}">
      <div class="signal-top"><span>${item[0]}</span><span>${pad(index + 1)} / ${pad(signals.length)}</span></div>
      <h3>${item[1]}</h3><p>${item[2]}</p><small>${item[3]}</small>
    </article>`).join('');
  }

  function renderGallery() {
    const host = $('[data-gallery]');
    if (!host) return;
    const slides = captions.map((caption, index) => {
      const number = index + 1;
      const src = `https://pop-yu.github.io/lumiere-birthday/images/${number}.jpg`;
      const [width, height] = memorySizes[index];
      const imageSource = index === 0 ? `src="${src}"` : `data-src="${src}"`;
      return `<article class="memory-slide${index === 0 ? ' is-active' : ''}" data-memory-slide="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}" style="--photo-ratio:${width} / ${height}">
        <span class="memory-ambient" aria-hidden="true"><img ${imageSource} alt="" loading="lazy" decoding="async" width="${width}" height="${height}"></span>
        <button class="memory-picture" type="button" data-memory-photo data-photo="${src}" data-caption="${caption}" aria-label="放大完整照片：${caption}" tabindex="${index === 0 ? '0' : '-1'}"><span class="memory-photo-shell"><img ${imageSource} alt="${caption}，完整照片" loading="lazy" decoding="async" fetchpriority="low" width="${width}" height="${height}"></span></button>
        <span class="memory-frame-mark" aria-hidden="true"><i>✦</i><b>${pad(number)}</b></span>
      </article>`;
    }).join('');
    const rail = captions.map((caption, index) => `<button type="button" class="memory-dot${index === 0 ? ' is-active' : ''}" data-memory-jump="${index}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" aria-label="切换到第 ${index + 1} 帧：${caption}"><span>${pad(index + 1)}</span><i></i></button>`).join('');
    const steps = captions.map((_, index) => `<div class="memory-step" data-memory-step="${index}" aria-hidden="true"></div>`).join('');
    host.innerHTML = `<div class="memory-sticky">
      <div class="memory-stack">${slides}</div>
      <div class="memory-copy" aria-live="polite">
        <p class="overline"><span>✦</span> ORIGINAL RATIO / NO CROP <b data-memory-current>01</b></p>
        <h3 data-memory-caption>${captions[0]}</h3>
        <p data-memory-note>${memoryNotes[0]}</p>
        <div class="memory-nav"><button type="button" data-memory-prev aria-label="上一帧">←</button><button type="button" data-memory-next aria-label="下一帧">→</button></div>
      </div>
      <div class="memory-counter" aria-hidden="true"><strong data-memory-counter>01</strong><span>/ ${pad(captions.length)}</span></div>
      <div class="memory-rail" role="tablist" aria-label="选择记忆帧">${rail}</div>
      <div class="memory-progress" aria-hidden="true"><i data-memory-progress></i></div>
      <p class="memory-scroll-cue" aria-hidden="true">SCROLL TO TRAVEL <i></i></p>
    </div><div class="memory-steps">${steps}</div>`;
  }

  function setupMemoryGallery() {
    const host = $('[data-gallery]');
    if (!host) return;
    const slides = $$('[data-memory-slide]', host);
    const photoButtons = $$('[data-memory-photo]', host);
    const dots = $$('[data-memory-jump]', host);
    const steps = $$('[data-memory-step]', host);
    const current = $('[data-memory-current]', host);
    const counter = $('[data-memory-counter]', host);
    const caption = $('[data-memory-caption]', host);
    const note = $('[data-memory-note]', host);
    const copy = $('.memory-copy', host);
    const progress = $('[data-memory-progress]', host);
    const previous = $('[data-memory-prev]', host);
    const next = $('[data-memory-next]', host);
    let active = -1;

    const loadSlide = index => {
      const slide = slides[index];
      if (!slide) return;
      $$('img[data-src]', slide).forEach(image => {
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
      });
    };

    const activate = index => {
      const target = Math.max(0, Math.min(captions.length - 1, index));
      const changed = target !== active;
      [target - 1, target, target + 1].forEach(loadSlide);
      active = target;
      slides.forEach((slide, itemIndex) => {
        const isActive = itemIndex === target;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        if (photoButtons[itemIndex]) photoButtons[itemIndex].tabIndex = isActive ? 0 : -1;
      });
      dots.forEach((dot, itemIndex) => {
        const isActive = itemIndex === target;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
      if (current) current.textContent = pad(target + 1);
      if (counter) counter.textContent = pad(target + 1);
      if (caption) caption.textContent = captions[target];
      if (note) note.textContent = memoryNotes[target];
      if (progress) progress.style.transform = `scaleX(${(target + 1) / captions.length})`;
      if (previous) previous.disabled = target === 0;
      if (next) next.disabled = target === captions.length - 1;
      if (changed && copy && !reducedMotion && typeof copy.animate === 'function') {
        copy.animate([{ opacity: .35, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    };
    const travelTo = index => {
      activate(index);
      steps[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    };

    dots.forEach((dot, index) => dot.addEventListener('click', () => travelTo(index)));
    previous?.addEventListener('click', () => travelTo(active - 1));
    next?.addEventListener('click', () => travelTo(active + 1));
    host.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); travelTo(active - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); travelTo(active + 1); }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) activate(Number(entry.target.dataset.memoryStep));
      }), { threshold: 0, rootMargin: '-46% 0px -46% 0px' });
      steps.forEach(step => observer.observe(step));
    }
    activate(0);
  }

  function updateTime() {
    const now = new Date();
    let years = now.getFullYear() - relationshipStart.getFullYear();
    let months = now.getMonth() - relationshipStart.getMonth();
    let days = now.getDate() - relationshipStart.getDate();
    let hours = now.getHours() - relationshipStart.getHours();
    let minutes = now.getMinutes() - relationshipStart.getMinutes();
    let seconds = now.getSeconds() - relationshipStart.getSeconds();
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) { days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); months--; }
    if (months < 0) { months += 12; years--; }
    Object.entries({ years, months, days, hours, minutes, seconds }).forEach(([key, value]) => {
      const node = $(`[data-count="${key}"]`);
      if (node) node.textContent = pad(value);
    });
  }

  function setupReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) { $$('.reveal').forEach(node => node.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .11, rootMargin: '0px 0px -4% 0px' });
    $$('.reveal').forEach(node => observer.observe(node));
  }

  function setupDialogs() {
    const letter = $('[data-dialog]');
    $$('[data-letter]').forEach(button => button.addEventListener('click', () => letter?.showModal()));
    $('[data-close]')?.addEventListener('click', () => letter?.close());
    letter?.addEventListener('click', event => { if (event.target === letter) letter.close(); });

    const lightbox = $('[data-lightbox]');
    const image = $('[data-lightbox-image]');
    const caption = $('[data-lightbox-caption]');
    document.addEventListener('click', event => {
      const card = event.target.closest('[data-photo]');
      if (!card || !lightbox || !image || !caption) return;
      image.src = card.dataset.photo;
      image.alt = card.dataset.caption || '';
      caption.textContent = card.dataset.caption || '';
      lightbox.showModal();
    });
    $('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
    lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  }

  function setupMotion() {
    const header = $('[data-header]');
    const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    if (reducedMotion) return;
    window.addEventListener('pointermove', event => {
      document.documentElement.style.setProperty('--px', `${event.clientX}px`);
      document.documentElement.style.setProperty('--py', `${event.clientY}px`);
    }, { passive: true });
  }

  function setupCosmos() {
    const canvas = $('#cosmos');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let animation = 0;
    let stars = [];
    let comet = null;
    let galaxyVisible = false;

    const makeStar = () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.15 + .15,
      alpha: Math.random() * .72 + .2, phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - .5) * .000035,
      hue: Math.random() > .82 ? (Math.random() > .5 ? 'gold' : 'blue') : 'white'
    });
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight; ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(190, Math.max(80, Math.round(width * height / 9000))) }, makeStar);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = reducedMotion ? star.alpha : star.alpha * (.65 + Math.sin(frame * .018 + star.phase) * .35);
        if (!reducedMotion) { star.y += star.drift; if (star.y < 0) star.y = 1; if (star.y > 1) star.y = 0; }
        context.beginPath(); context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        context.fillStyle = star.hue === 'gold' ? `rgba(243,206,145,${twinkle})` : star.hue === 'blue' ? `rgba(159,184,255,${twinkle})` : `rgba(241,236,223,${twinkle})`; context.fill();
      }
      if (!reducedMotion && !comet && frame % 520 === 0) comet = { x: width * (.45 + Math.random() * .45), y: -30, life: 0 };
      if (comet) {
        comet.x -= 9; comet.y += 6; comet.life++;
        const gradient = context.createLinearGradient(comet.x, comet.y, comet.x + 120, comet.y - 80);
        gradient.addColorStop(0, 'rgba(241,236,223,.85)'); gradient.addColorStop(1, 'rgba(159,184,255,0)');
        context.beginPath(); context.moveTo(comet.x, comet.y); context.lineTo(comet.x + 120, comet.y - 80); context.strokeStyle = gradient; context.lineWidth = 1; context.stroke();
        if (comet.life > 95 || comet.x < -140) comet = null;
      }
      frame++;
      if (!reducedMotion && !document.hidden && !galaxyVisible) animation = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(animation);
      if (!document.hidden && !reducedMotion && !galaxyVisible) animation = requestAnimationFrame(draw);
    });
    const galaxy = $('[data-galaxy]');
    if (galaxy && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        galaxyVisible = entry.isIntersecting;
        cancelAnimationFrame(animation);
        animation = 0;
        if (!galaxyVisible && !document.hidden && !reducedMotion) animation = requestAnimationFrame(draw);
      }), { threshold: .08 });
      observer.observe(galaxy);
    }
  }

  function setupGalaxyExplorer() {
    const root = $('[data-galaxy]');
    const canvas = $('[data-galaxy-canvas]', root || document);
    const world = $('[data-galaxy-world]', root || document);
    if (!root || !canvas || !world) return;

    const planetData = [
      { id: 'manifesto', index: '01', code: 'PROLOGUE PLANET', name: '序章星', label: 'THE ARRIVAL', description: '宇宙用了很久，才把你送到我眼前。', x: -410, y: -205, size: 132, tone: '#bca8ff', accent: '#7660bd', kind: 'violet', zoom: 1.18 },
      { id: 'chronicle', index: '02', code: 'TIME RING', name: '时间环', label: 'LOVE CHRONOGRAPH', description: '不是倒数，而是每一秒都在继续向你靠近。', x: 470, y: -275, size: 154, tone: '#f3ce91', accent: '#a86e2f', kind: 'ringed', zoom: 1.08 },
      { id: 'signals', index: '03', code: 'SIGNAL STATION', name: '心声站', label: 'EIGHT ECHOES', description: '八次来自深空的回响，把那些想说的话送到你身边。', x: -520, y: 360, size: 142, tone: '#9fb8ff', accent: '#4868c8', kind: 'ocean', zoom: 1.12 },
      { id: 'memories', index: '04', code: 'MEMORY PLANET', name: '回忆星', label: 'ORIGINAL LIGHT', description: '十一帧完整照片，不裁掉属于你的任何一寸光。', x: 555, y: 390, size: 148, tone: '#ffb3c6', accent: '#ad526f', kind: 'rose', zoom: 1.1 }
    ];

    const orbits = [
      [620, 285, -12], [940, 435, 8], [1310, 610, -7], [1780, 790, 13]
    ].map((orbit, index) => `<span class="world-orbit orbit-${index + 1}" style="--ow:${orbit[0]}px;--oh:${orbit[1]}px;--or:${orbit[2]}deg"></span>`).join('');
    const planets = planetData.map((planet, index) => `<span class="celestial-planet planet-${planet.kind}" data-world-planet="${index}" style="--x:${planet.x}px;--y:${planet.y}px;--size:${planet.size}px;--tone:${planet.tone};--accent:${planet.accent}">
      <span class="planet-selection"><i></i><i></i></span>
      <span class="planet-sphere"><i class="planet-atmosphere"></i><i class="planet-surface"></i><i class="planet-night"></i></span>
      ${planet.kind === 'ringed' ? '<span class="planet-ring"></span>' : ''}
      ${planet.kind === 'ocean' ? '<span class="planet-moon"></span>' : ''}
      <span class="planet-label"><small>${planet.index} / ${planet.label}</small><b>${planet.name}</b></span>
    </span>`).join('');

    world.innerHTML = `${orbits}
      <svg class="constellation-map" viewBox="0 0 2100 1500" aria-hidden="true">
        <g><path d="M164 356 286 281 418 344 528 246 664 303"/><path d="M1520 245 1658 322 1782 251 1910 338"/><path d="M1412 1040 1536 916 1681 994 1818 872 1940 936"/></g>
        <g class="constellation-points"><circle cx="164" cy="356" r="4"/><circle cx="286" cy="281" r="3"/><circle cx="418" cy="344" r="5"/><circle cx="528" cy="246" r="3"/><circle cx="664" cy="303" r="4"/><circle cx="1520" cy="245" r="4"/><circle cx="1658" cy="322" r="3"/><circle cx="1782" cy="251" r="5"/><circle cx="1910" cy="338" r="3"/><circle cx="1412" cy="1040" r="3"/><circle cx="1536" cy="916" r="4"/><circle cx="1681" cy="994" r="3"/><circle cx="1818" cy="872" r="5"/><circle cx="1940" cy="936" r="3"/></g>
      </svg>
      <span class="system-core" style="--x:0px;--y:0px"><i class="core-aura"></i><i class="core-sun"></i><i class="core-orbit"></i><b>HUAHUA</b><small>SYSTEM HEART / 2026</small></span>
      <span class="celestial-object black-hole" style="--x:-930px;--y:-470px"><i></i><b>THE QUIET VOID</b><small>GRAVITY / 08</small></span>
      <span class="celestial-object binary-system" style="--x:930px;--y:-500px"><i></i><i></i><b>TWIN LIGHTS</b><small>BINARY / 06</small></span>
      <span class="celestial-object ice-giant" style="--x:-930px;--y:590px"><i></i><b>BLUE HOUR</b><small>ICE GIANT / 07</small></span>
      <span class="celestial-object rose-moon" style="--x:960px;--y:610px"><i></i><b>BLUSH MOON</b><small>MOON / 09</small></span>
      <span class="asteroid-belt" style="--x:40px;--y:45px">${Array.from({ length: 22 }, (_, index) => `<i style="--a:${index * 16.36}deg;--d:${index % 3 * 13}px;--s:${2 + index % 4}px"></i>`).join('')}</span>
      <span class="deep-comet" style="--x:760px;--y:20px"><i></i></span>
      <span class="cosmic-label label-north" style="--x:-730px;--y:-250px"><i></i> PERSEUS VEIL / N–17</span>
      <span class="cosmic-label label-south" style="--x:720px;--y:240px"><i></i> ROSE NEBULA / S–11</span>
      ${planets}`;

    const dockButtons = $$('[data-galaxy-planet]', root);
    const worldPlanets = $$('[data-world-planet]', world);
    const focusIndex = $('[data-galaxy-index]', root);
    const focusCode = $('[data-galaxy-code]', root);
    const focusName = $('[data-galaxy-name]', root);
    const focusDescription = $('[data-galaxy-description]', root);
    const focusLink = $('[data-galaxy-link]', root);
    const coordinate = $('[data-galaxy-coordinate]', root);
    const enterButton = $('[data-galaxy-enter]', root);
    const homeButton = $('[data-galaxy-home]', root);

    let width = 0;
    let height = 0;
    let ratio = 1;
    let visible = false;
    let animation = 0;
    let lastFrame = 0;
    let lastHudUpdate = 0;
    let activePlanet = 0;
    let dragging = false;
    let pointerId = null;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTime = 0;
    let dragDistance = 0;
    let fieldMode = '';
    const camera = { x: 0, y: 0, zoom: .68, targetX: 0, targetY: 0, targetZoom: .68, velocityX: 0, velocityY: 0 };
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
    const initialZoom = () => width < 560 ? .43 : width < 900 ? .54 : .68;
    const signed = value => `${value < 0 ? '−' : '+'}${String(Math.abs(Math.round(value))).padStart(4, '0')}`;
    const seeded = value => {
      const result = Math.sin(value * 127.13 + 311.7) * 43758.5453;
      return result - Math.floor(result);
    };

    let gl = null;
    let fallback = null;
    let program = null;
    let starBuffer = null;
    let starCount = 0;
    let uniforms = null;
    let attributes = null;

    const makeShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const initRenderer = () => {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
      if (!gl) { fallback = canvas.getContext('2d', { alpha: true }); root.classList.add('is-canvas-fallback'); return; }
      const vertex = makeShader(gl.VERTEX_SHADER, `
        precision mediump float;
        attribute vec3 a_position;
        attribute float a_size;
        attribute vec3 a_color;
        attribute float a_phase;
        attribute float a_alpha;
        uniform vec2 u_resolution;
        uniform vec2 u_camera;
        uniform float u_zoom;
        uniform float u_time;
        uniform float u_dpr;
        varying vec3 v_color;
        varying float v_alpha;
        void main(){
          float depth = mix(.16,1.0,a_position.z);
          float drift = (1.0-a_position.z)*8.0;
          vec2 motion = vec2(sin(u_time*.000035+a_phase),cos(u_time*.000028+a_phase))*drift;
          vec2 point = ((a_position.xy+motion)-u_camera*depth)*u_zoom;
          vec2 clip = point/(u_resolution*.5);
          gl_Position = vec4(clip.x,-clip.y,0.0,1.0);
          float pulse = .84+.16*sin(u_time*.0012+a_phase);
          gl_PointSize = max(1.0,a_size*u_dpr*mix(.72,1.16,clamp(u_zoom,0.0,1.0))*pulse);
          v_color = a_color;
          v_alpha = a_alpha;
        }`);
      const fragment = makeShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying vec3 v_color;
        varying float v_alpha;
        void main(){
          float distanceToCenter = distance(gl_PointCoord,vec2(.5));
          float core = 1.0-smoothstep(.08,.5,distanceToCenter);
          float halo = 1.0-smoothstep(.18,.5,distanceToCenter);
          gl_FragColor = vec4(v_color,core*v_alpha+halo*v_alpha*.18);
        }`);
      if (!vertex || !fragment) { gl = null; fallback = canvas.getContext('2d', { alpha: true }); root.classList.add('is-canvas-fallback'); return; }
      program = gl.createProgram();
      gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
      gl.deleteShader(vertex); gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl = null; fallback = canvas.getContext('2d', { alpha: true }); root.classList.add('is-canvas-fallback'); return; }
      gl.useProgram(program);
      attributes = {
        position: gl.getAttribLocation(program, 'a_position'), size: gl.getAttribLocation(program, 'a_size'),
        color: gl.getAttribLocation(program, 'a_color'), phase: gl.getAttribLocation(program, 'a_phase'), alpha: gl.getAttribLocation(program, 'a_alpha')
      };
      uniforms = {
        resolution: gl.getUniformLocation(program, 'u_resolution'), camera: gl.getUniformLocation(program, 'u_camera'),
        zoom: gl.getUniformLocation(program, 'u_zoom'), time: gl.getUniformLocation(program, 'u_time'), dpr: gl.getUniformLocation(program, 'u_dpr')
      };
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.clearColor(0, 0, 0, 0);
      root.classList.add('is-webgl');
    };

    const buildField = () => {
      if (!gl || !program) return;
      const mode = width < 760 ? 'mobile' : 'desktop';
      if (fieldMode === mode && starBuffer) return;
      fieldMode = mode;
      const points = [];
      const add = (x, y, depth, size, color, phase, alpha) => points.push(x, y, depth, size, color[0], color[1], color[2], phase, alpha);
      const white = [.94, .92, .86], gold = [1, .79, .46], blue = [.46, .65, 1], rose = [1, .48, .68], violet = [.58, .45, 1];
      const backgroundCount = mode === 'mobile' ? 780 : 1450;
      const armCount = mode === 'mobile' ? 900 : 1750;
      for (let index = 0; index < backgroundCount; index++) {
        const tone = seeded(index + 71);
        const color = tone > .94 ? rose : tone > .82 ? blue : tone > .72 ? gold : white;
        add((seeded(index + 401) - .5) * 4100, (seeded(index + 811) - .5) * 2850, .12 + seeded(index + 1201) * .58, .65 + seeded(index + 1613) * 2.35, color, seeded(index + 2017) * 6.283, .18 + seeded(index + 2423) * .65);
      }
      for (let index = 0; index < armCount; index++) {
        const progress = seeded(index + 3023);
        const arm = index % 4;
        const radius = 55 + Math.pow(progress, .72) * 1280;
        const angle = progress * 10.8 + arm * Math.PI * .5 + (seeded(index + 3413) - .5) * (.18 + progress * .38) - .28;
        const spread = (seeded(index + 3821) - .5) * (22 + progress * 145);
        const x = Math.cos(angle) * radius + Math.cos(angle + Math.PI * .5) * spread;
        const y = Math.sin(angle) * radius * .49 + Math.sin(angle + Math.PI * .5) * spread * .5;
        const tone = seeded(index + 4211);
        const color = tone > .83 ? gold : tone > .58 ? violet : tone > .36 ? blue : white;
        add(x, y, .56 + seeded(index + 4637) * .42, .8 + (1 - progress) * 2.3 + seeded(index + 5011), color, seeded(index + 5413) * 6.283, .1 + (1 - progress) * .42 + seeded(index + 5813) * .22);
      }
      [[-980,-520,rose],[1020,-480,blue],[-920,640,violet],[980,680,gold]].forEach((cluster, clusterIndex) => {
        const count = mode === 'mobile' ? 38 : 74;
        for (let index = 0; index < count; index++) {
          const angle = seeded(index + clusterIndex * 97 + 6203) * Math.PI * 2;
          const distance = Math.pow(seeded(index + clusterIndex * 131 + 6607), .64) * 145;
          add(cluster[0] + Math.cos(angle) * distance, cluster[1] + Math.sin(angle) * distance * .58, .78, .9 + seeded(index + 7001) * 2.1, cluster[2], angle, .16 + seeded(index + 7411) * .42);
        }
      });
      starCount = points.length / 9;
      if (starBuffer) gl.deleteBuffer(starBuffer);
      starBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
      const stride = 9 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(attributes.position); gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(attributes.size); gl.vertexAttribPointer(attributes.size, 1, gl.FLOAT, false, stride, 3 * 4);
      gl.enableVertexAttribArray(attributes.color); gl.vertexAttribPointer(attributes.color, 3, gl.FLOAT, false, stride, 4 * 4);
      gl.enableVertexAttribArray(attributes.phase); gl.vertexAttribPointer(attributes.phase, 1, gl.FLOAT, false, stride, 7 * 4);
      gl.enableVertexAttribArray(attributes.alpha); gl.vertexAttribPointer(attributes.alpha, 1, gl.FLOAT, false, stride, 8 * 4);
    };

    const drawFallback = () => {
      if (!fallback) return;
      fallback.clearRect(0, 0, width, height);
      fallback.fillStyle = 'rgba(241,236,223,.55)';
      const count = width < 760 ? 260 : 480;
      for (let index = 0; index < count; index++) {
        const x = seeded(index + 31) * width;
        const y = seeded(index + 919) * height;
        const size = .4 + seeded(index + 1411) * 1.35;
        fallback.globalAlpha = .18 + seeded(index + 2111) * .6;
        fallback.fillRect(x, y, size, size);
      }
      fallback.globalAlpha = 1;
    };
    const renderField = time => {
      if (!gl || !program || !starBuffer) { drawFallback(); return; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.camera, camera.x, camera.y);
      gl.uniform1f(uniforms.zoom, camera.zoom);
      gl.uniform1f(uniforms.time, reducedMotion ? 0 : time);
      gl.uniform1f(uniforms.dpr, ratio);
      gl.drawArrays(gl.POINTS, 0, starCount);
    };

    const updateWorld = () => {
      world.style.transform = `translate3d(${-camera.x * camera.zoom}px,${-camera.y * camera.zoom}px,0) scale(${camera.zoom})`;
      root.style.setProperty('--galaxy-zoom', camera.zoom.toFixed(3));
    };
    const updateCoordinate = () => {
      if (coordinate) coordinate.textContent = `X ${signed(camera.x)} / Y ${signed(camera.y)} / Z ${String(Math.round(camera.zoom * 100)).padStart(3, '0')}`;
    };
    const resize = () => {
      const bounds = root.getBoundingClientRect();
      const nextWidth = Math.max(320, Math.round(bounds.width));
      const nextHeight = Math.max(610, Math.round(bounds.height));
      if (width === nextWidth && height === nextHeight) return;
      width = nextWidth; height = nextHeight;
      ratio = Math.min(window.devicePixelRatio || 1, width < 760 ? 1 : 1.25);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      if (fallback) fallback.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!root.classList.contains('is-entered')) camera.zoom = camera.targetZoom = initialZoom();
      buildField(); updateWorld(); renderField(performance.now());
    };

    const setEntered = entered => {
      root.classList.toggle('is-entered', entered);
      if (entered && camera.targetZoom < initialZoom()) camera.targetZoom = initialZoom();
      schedule();
    };
    const updateFocus = index => {
      const planet = planetData[index];
      if (!planet) return;
      activePlanet = index;
      if (focusIndex) focusIndex.textContent = planet.index;
      if (focusCode) focusCode.textContent = planet.code;
      if (focusName) focusName.textContent = planet.name;
      if (focusDescription) focusDescription.textContent = planet.description;
      if (focusLink) focusLink.href = `#${planet.id}`;
      dockButtons.forEach((button, itemIndex) => button.setAttribute('aria-pressed', String(itemIndex === index)));
      worldPlanets.forEach((planetNode, itemIndex) => planetNode.classList.toggle('is-selected', itemIndex === index));
    };
    const selectPlanet = index => {
      const planet = planetData[index];
      if (!planet) return;
      dragging = false; pointerId = null; canvas.classList.remove('is-dragging');
      setEntered(true); updateFocus(index);
      const horizontalOffset = width >= 900 ? width * .09 / planet.zoom : 0;
      const verticalOffset = width < 900 ? 120 / planet.zoom : 0;
      camera.targetX = clamp(planet.x + horizontalOffset, -1120, 1120);
      camera.targetY = clamp(planet.y + verticalOffset, -820, 820);
      camera.targetZoom = width < 560 ? Math.min(.92, planet.zoom) : planet.zoom;
      camera.velocityX = camera.velocityY = 0;
      schedule();
    };
    const resetView = () => {
      dragging = false; pointerId = null; canvas.classList.remove('is-dragging');
      setEntered(true);
      camera.targetX = 0; camera.targetY = 0; camera.targetZoom = initialZoom();
      camera.velocityX = camera.velocityY = 0;
      schedule();
    };
    const changeZoom = amount => {
      setEntered(true);
      camera.targetZoom = clamp(camera.targetZoom + amount, width < 560 ? .36 : .42, 1.45);
      schedule();
    };

    const loop = time => {
      animation = 0;
      if (!visible || document.hidden) return;
      const interval = width < 760 ? 1000 / 30 : 1000 / 60;
      if (time - lastFrame < interval) { animation = requestAnimationFrame(loop); return; }
      lastFrame = time;
      if (reducedMotion && !dragging) {
        camera.x = camera.targetX;
        camera.y = camera.targetY;
        camera.zoom = camera.targetZoom;
      } else if (!dragging) {
        camera.x += (camera.targetX - camera.x) * .095;
        camera.y += (camera.targetY - camera.y) * .095;
      }
      camera.zoom += (camera.targetZoom - camera.zoom) * .085;
      if (Math.abs(camera.targetX - camera.x) < .02) camera.x = camera.targetX;
      if (Math.abs(camera.targetY - camera.y) < .02) camera.y = camera.targetY;
      if (Math.abs(camera.targetZoom - camera.zoom) < .0002) camera.zoom = camera.targetZoom;
      updateWorld(); renderField(time);
      if (time - lastHudUpdate > 140) { updateCoordinate(); lastHudUpdate = time; }
      if (!reducedMotion) animation = requestAnimationFrame(loop);
    };
    function schedule() {
      if (visible && !animation) animation = requestAnimationFrame(loop);
      else if (!visible) { updateWorld(); renderField(performance.now()); }
    }

    enterButton?.addEventListener('click', resetView);
    $$('[data-enter-galaxy]').forEach(link => link.addEventListener('click', () => setEntered(true)));
    dockButtons.forEach((button, index) => button.addEventListener('click', () => selectPlanet(index)));
    worldPlanets.forEach((planet, index) => planet.addEventListener('click', event => { event.stopPropagation(); selectPlanet(index); }));
    homeButton?.addEventListener('click', resetView);
    $$('[data-galaxy-zoom]', root).forEach(button => button.addEventListener('click', () => changeZoom(button.dataset.galaxyZoom === 'in' ? .14 : -.14)));

    canvas.addEventListener('pointerdown', event => {
      setEntered(true);
      dragging = true; dragDistance = 0; pointerId = event.pointerId;
      pointerX = event.clientX; pointerY = event.clientY; pointerTime = performance.now();
      camera.targetX = camera.x; camera.targetY = camera.y; camera.velocityX = camera.velocityY = 0;
      canvas.classList.add('is-dragging'); canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;
      const now = performance.now();
      const deltaX = event.clientX - pointerX;
      const deltaY = event.clientY - pointerY;
      const elapsed = Math.max(8, now - pointerTime);
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
      pointerX = event.clientX; pointerY = event.clientY; pointerTime = now;
      const worldX = -deltaX / camera.zoom;
      const worldY = -deltaY / camera.zoom;
      camera.x = camera.targetX = clamp(camera.x + worldX, -1120, 1120);
      camera.y = camera.targetY = clamp(camera.y + worldY, -820, 820);
      camera.velocityX = worldX * (16.67 / elapsed);
      camera.velocityY = worldY * (16.67 / elapsed);
      updateWorld(); updateCoordinate(); schedule();
    });
    const finishPointer = event => {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false; pointerId = null;
      canvas.classList.remove('is-dragging'); canvas.releasePointerCapture?.(event.pointerId);
      if (dragDistance > 8) {
        camera.targetX = clamp(camera.x + camera.velocityX * 13, -1120, 1120);
        camera.targetY = clamp(camera.y + camera.velocityY * 13, -820, 820);
      }
      schedule();
    };
    canvas.addEventListener('pointerup', finishPointer);
    canvas.addEventListener('pointercancel', finishPointer);
    canvas.addEventListener('wheel', event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      changeZoom(event.deltaY < 0 ? .1 : -.1);
    }, { passive: false });

    root.addEventListener('keydown', event => {
      const step = event.shiftKey ? 130 : 65;
      if (event.key === 'ArrowLeft') camera.targetX = clamp(camera.targetX - step, -1120, 1120);
      else if (event.key === 'ArrowRight') camera.targetX = clamp(camera.targetX + step, -1120, 1120);
      else if (event.key === 'ArrowUp') camera.targetY = clamp(camera.targetY - step, -820, 820);
      else if (event.key === 'ArrowDown') camera.targetY = clamp(camera.targetY + step, -820, 820);
      else if (event.key === '+' || event.key === '=') changeZoom(.12);
      else if (event.key === '-') changeZoom(-.12);
      else if (event.key === '0') resetView();
      else return;
      event.preventDefault(); setEntered(true); schedule();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        visible = entry.isIntersecting;
        document.body.classList.toggle('galaxy-active', visible);
        if (visible) schedule();
        else { cancelAnimationFrame(animation); animation = 0; }
      }), { threshold: .03 });
      observer.observe(root);
    } else { visible = true; }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(root);
    else window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(animation); animation = 0; }
      else schedule();
    });

    initRenderer();
    updateFocus(0);
    resize();
  }

  renderSignals();
  renderGallery();
  setupMemoryGallery();
  setupReveal();
  setupDialogs();
  setupMotion();
  setupCosmos();
  setupGalaxyExplorer();
  updateTime();
  window.setInterval(updateTime, 1000);
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

