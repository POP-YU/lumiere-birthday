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
    const context = canvas?.getContext('2d', { alpha: true, desynchronized: true });
    if (!root || !canvas || !context) return;

    const planetData = [
      { id: 'manifesto', index: '01', code: 'PROLOGUE PLANET', name: '序章星', description: '宇宙用了很久，才把你送到我眼前。', x: -340, y: -155, radius: 62, light: '#cfc2ff', color: '#7c68bd', dark: '#272040', glow: 'rgba(188,168,255,.32)' },
      { id: 'chronicle', index: '02', code: 'TIME RING', name: '时间环', description: '不是倒数，而是每一秒都在继续向你靠近。', x: 365, y: -185, radius: 76, light: '#ffe1aa', color: '#b8803f', dark: '#342313', glow: 'rgba(243,206,145,.3)', ring: true },
      { id: 'signals', index: '03', code: 'SIGNAL STATION', name: '心声站', description: '八次来自深空的回响，把那些想说的话送到你身边。', x: -305, y: 255, radius: 68, light: '#d1ddff', color: '#5979d6', dark: '#172345', glow: 'rgba(159,184,255,.3)' },
      { id: 'memories', index: '04', code: 'MEMORY PLANET', name: '回忆星', description: '十一帧完整照片，不裁掉属于你的任何一寸光。', x: 410, y: 245, radius: 72, light: '#ffd4df', color: '#bd718b', dark: '#3b1927', glow: 'rgba(255,179,198,.28)' }
    ];
    const dockButtons = $$('[data-galaxy-planet]', root);
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
    let stars = [];
    let dust = [];
    let screenPlanets = [];
    let activePlanet = 0;
    let dragging = false;
    let dragDistance = 0;
    let pointerId = null;
    let pointerX = 0;
    let pointerY = 0;
    const camera = { x: 0, y: 0, zoom: .82, targetX: 0, targetY: 0, targetZoom: .82 };

    const initialZoom = () => width < 760 ? .48 : width < 1000 ? .64 : .82;
    const selectedZoom = () => width < 760 ? 1.14 : width < 1000 ? 1.28 : 1.42;
    const seeded = value => {
      const result = Math.sin(value * 9283.177 + 19.73) * 43758.5453;
      return result - Math.floor(result);
    };
    const signed = value => String(Math.round(value)).padStart(3, '0');
    const worldToScreen = (x, y, depth = 1) => ({
      x: width / 2 + (x - camera.x * depth) * camera.zoom,
      y: height / 2 + (y - camera.y * depth) * camera.zoom
    });
    const updateCoordinate = () => {
      if (coordinate) coordinate.textContent = `X ${signed(camera.x)} / Y ${signed(camera.y)} / Z ${String(Math.round(camera.zoom * 100)).padStart(3, '0')}`;
    };

    const makeField = () => {
      const starCount = Math.min(220, Math.max(110, Math.round(width * height / 6400)));
      stars = Array.from({ length: starCount }, (_, index) => ({
        x: (seeded(index + 1) - .5) * width * 3.2,
        y: (seeded(index + 411) - .5) * height * 3.2,
        radius: .25 + seeded(index + 877) * 1.15,
        alpha: .18 + seeded(index + 1211) * .65,
        phase: seeded(index + 1601) * Math.PI * 2,
        depth: .16 + seeded(index + 2003) * .62,
        tone: seeded(index + 2401)
      }));
      dust = Array.from({ length: width < 760 ? 64 : 104 }, (_, index) => {
        const progress = index / (width < 760 ? 64 : 104);
        const arm = index % 3;
        const angle = progress * Math.PI * 5.5 + arm * Math.PI * .66;
        const radius = 72 + progress * 380;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * .42,
          radius: .3 + seeded(index + 3011) * 1.2,
          alpha: .08 + (1 - progress) * .24
        };
      });
    };

    const resize = () => {
      const bounds = root.getBoundingClientRect();
      width = Math.max(320, Math.round(bounds.width));
      height = Math.max(640, Math.round(bounds.height));
      ratio = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.25 : 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!root.classList.contains('is-entered')) {
        camera.zoom = camera.targetZoom = initialZoom();
      }
      makeField();
      schedule();
    };

    const drawOrbit = (planet, index) => {
      const center = worldToScreen(0, 0);
      const distance = Math.hypot(planet.x, planet.y) * camera.zoom;
      context.save();
      context.translate(center.x, center.y);
      context.rotate((index - 1.5) * .08);
      context.beginPath();
      context.ellipse(0, 0, distance, distance * .47, 0, 0, Math.PI * 2);
      context.strokeStyle = index === activePlanet && root.classList.contains('is-entered') ? 'rgba(243,206,145,.2)' : 'rgba(241,236,223,.075)';
      context.lineWidth = 1;
      if (context.setLineDash) context.setLineDash(index % 2 ? [3, 8] : []);
      context.stroke();
      if (context.setLineDash) context.setLineDash([]);
      context.restore();
    };

    const drawCenter = time => {
      const center = worldToScreen(0, 0);
      const pulse = reducedMotion ? 1 : 1 + Math.sin(time * .0012) * .06;
      const glow = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, 125 * camera.zoom * pulse);
      glow.addColorStop(0, 'rgba(255,239,198,.88)');
      glow.addColorStop(.14, 'rgba(243,206,145,.34)');
      glow.addColorStop(.55, 'rgba(130,112,220,.1)');
      glow.addColorStop(1, 'rgba(130,112,220,0)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(center.x, center.y, 125 * camera.zoom * pulse, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.arc(center.x, center.y, Math.max(9, 18 * camera.zoom), 0, Math.PI * 2);
      context.fillStyle = '#f7dfae';
      context.shadowBlur = 22;
      context.shadowColor = 'rgba(243,206,145,.75)';
      context.fill();
      context.shadowBlur = 0;
      if (root.classList.contains('is-entered')) {
        context.fillStyle = 'rgba(243,206,145,.72)';
        context.font = '500 9px "Cascadia Mono", monospace';
        context.textAlign = 'center';
        context.fillText('HUAHUA / SYSTEM CORE', center.x, center.y + Math.max(30, 38 * camera.zoom));
      }
    };

    const drawPlanet = (planet, index, time) => {
      const point = worldToScreen(planet.x, planet.y);
      const radius = Math.max(18, planet.radius * camera.zoom);
      if (point.x < -radius * 3 || point.x > width + radius * 3 || point.y < -radius * 3 || point.y > height + radius * 3) return;
      const selected = index === activePlanet && root.classList.contains('is-entered');
      const pulse = reducedMotion ? 1 : 1 + Math.sin(time * .0015 + index) * .04;

      context.save();
      context.translate(point.x, point.y);
      if (selected) {
        context.beginPath();
        context.arc(0, 0, radius * (1.38 + Math.sin(time * .002) * .05), 0, Math.PI * 2);
        context.strokeStyle = 'rgba(243,206,145,.42)';
        context.lineWidth = 1;
        context.stroke();
        context.beginPath();
        context.arc(0, 0, radius * 1.62, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(241,236,223,.12)';
        if (context.setLineDash) context.setLineDash([2, 7]);
        context.stroke();
        if (context.setLineDash) context.setLineDash([]);
      }

      const halo = context.createRadialGradient(0, 0, radius * .35, 0, 0, radius * 2.15);
      halo.addColorStop(0, planet.glow);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(0, 0, radius * 2.15, 0, Math.PI * 2);
      context.fill();

      if (planet.ring) {
        context.save();
        context.rotate(-.24);
        context.beginPath();
        context.ellipse(0, 0, radius * 1.72, radius * .48, 0, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(243,206,145,.5)';
        context.lineWidth = Math.max(1.2, radius * .055);
        context.stroke();
        context.restore();
      }

      const sphere = context.createRadialGradient(-radius * .32, -radius * .38, radius * .08, 0, 0, radius * pulse);
      sphere.addColorStop(0, planet.light);
      sphere.addColorStop(.38, planet.color);
      sphere.addColorStop(1, planet.dark);
      context.beginPath();
      context.arc(0, 0, radius * pulse, 0, Math.PI * 2);
      context.fillStyle = sphere;
      context.shadowBlur = selected ? 30 : 18;
      context.shadowColor = planet.glow;
      context.fill();
      context.shadowBlur = 0;

      context.save();
      context.beginPath();
      context.arc(0, 0, radius * pulse, 0, Math.PI * 2);
      context.clip();
      context.globalAlpha = .13;
      for (let stripe = -2; stripe <= 2; stripe++) {
        context.beginPath();
        context.ellipse(radius * .16, stripe * radius * .25, radius * 1.05, radius * .18, -.16, 0, Math.PI * 2);
        context.strokeStyle = stripe % 2 ? '#fff' : planet.dark;
        context.lineWidth = Math.max(1, radius * .07);
        context.stroke();
      }
      context.restore();

      const moonAngle = time * (.00022 + index * .000035) + index * 1.6;
      const moonX = Math.cos(moonAngle) * radius * 1.65;
      const moonY = Math.sin(moonAngle) * radius * .72;
      context.beginPath();
      context.arc(moonX, moonY, Math.max(2.1, radius * .095), 0, Math.PI * 2);
      context.fillStyle = index % 2 ? 'rgba(243,206,145,.9)' : 'rgba(220,225,255,.88)';
      context.fill();
      context.restore();

      screenPlanets.push({ index, x: point.x, y: point.y, radius: radius * 1.3 });
      if (root.classList.contains('is-entered')) {
        context.fillStyle = selected ? 'rgba(243,206,145,.94)' : 'rgba(241,236,223,.56)';
        context.font = selected ? '600 12px "Songti SC", serif' : '500 11px "Songti SC", serif';
        context.textAlign = 'center';
        context.fillText(`${planet.index} / ${planet.name}`, point.x, point.y + radius + 25);
      }
    };

    const draw = time => {
      camera.x += (camera.targetX - camera.x) * .075;
      camera.y += (camera.targetY - camera.y) * .075;
      camera.zoom += (camera.targetZoom - camera.zoom) * .07;
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const point = worldToScreen(star.x, star.y, star.depth);
        if (point.x < -10 || point.x > width + 10 || point.y < -10 || point.y > height + 10) continue;
        const shimmer = reducedMotion ? 1 : .68 + Math.sin(time * .0015 + star.phase) * .32;
        context.beginPath();
        context.arc(point.x, point.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.tone > .9 ? `rgba(243,206,145,${star.alpha * shimmer})` : star.tone > .8 ? `rgba(159,184,255,${star.alpha * shimmer})` : `rgba(241,236,223,${star.alpha * shimmer})`;
        context.fill();
      }

      const center = worldToScreen(0, 0);
      for (const particle of dust) {
        const point = worldToScreen(particle.x, particle.y);
        context.beginPath();
        context.arc(point.x, point.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(185,174,255,${particle.alpha})`;
        context.fill();
      }
      const coreGlow = context.createRadialGradient(center.x, center.y, 10, center.x, center.y, 420 * camera.zoom);
      coreGlow.addColorStop(0, 'rgba(121,105,214,.09)');
      coreGlow.addColorStop(1, 'rgba(121,105,214,0)');
      context.fillStyle = coreGlow;
      context.beginPath();
      context.arc(center.x, center.y, 420 * camera.zoom, 0, Math.PI * 2);
      context.fill();

      planetData.forEach(drawOrbit);
      drawCenter(time);
      screenPlanets = [];
      planetData.forEach((planet, index) => drawPlanet(planet, index, time));

      if (coordinate && time - lastHudUpdate > 180) {
        updateCoordinate();
        lastHudUpdate = time;
      }
    };

    const loop = time => {
      animation = 0;
      if (!visible || document.hidden) return;
      const frameInterval = width < 760 ? 1000 / 30 : 1000 / 60;
      if (time - lastFrame >= frameInterval) {
        draw(time);
        lastFrame = time;
      }
      animation = requestAnimationFrame(loop);
    };
    function schedule() {
      if (reducedMotion) { draw(performance.now()); return; }
      if (visible && !animation) animation = requestAnimationFrame(loop);
    }

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
    };
    const selectPlanet = index => {
      const planet = planetData[index];
      if (!planet) return;
      setEntered(true);
      updateFocus(index);
      camera.targetX = planet.x;
      camera.targetY = planet.y;
      camera.targetZoom = selectedZoom();
      schedule();
    };
    const resetView = () => {
      setEntered(true);
      camera.targetX = 0;
      camera.targetY = 0;
      camera.targetZoom = initialZoom();
      schedule();
    };
    const changeZoom = amount => {
      setEntered(true);
      camera.targetZoom = Math.max(.42, Math.min(1.75, camera.targetZoom + amount));
      schedule();
    };

    enterButton?.addEventListener('click', () => { setEntered(true); resetView(); });
    $$('[data-enter-galaxy]').forEach(link => link.addEventListener('click', () => setEntered(true)));
    dockButtons.forEach((button, index) => button.addEventListener('click', () => selectPlanet(index)));
    homeButton?.addEventListener('click', resetView);
    $$('[data-galaxy-zoom]', root).forEach(button => button.addEventListener('click', () => changeZoom(button.dataset.galaxyZoom === 'in' ? .16 : -.16)));

    canvas.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && Math.abs(event.movementY || 0) > Math.abs(event.movementX || 0)) return;
      setEntered(true);
      dragging = true;
      dragDistance = 0;
      pointerId = event.pointerId;
      pointerX = event.clientX;
      pointerY = event.clientY;
      canvas.classList.add('is-dragging');
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;
      const deltaX = event.clientX - pointerX;
      const deltaY = event.clientY - pointerY;
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
      pointerX = event.clientX;
      pointerY = event.clientY;
      camera.targetX = Math.max(-760, Math.min(760, camera.targetX - deltaX / camera.zoom));
      camera.targetY = Math.max(-560, Math.min(560, camera.targetY - deltaY / camera.zoom));
      camera.x = camera.targetX;
      camera.y = camera.targetY;
      updateCoordinate();
      schedule();
    });
    const finishPointer = event => {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      canvas.classList.remove('is-dragging');
      canvas.releasePointerCapture?.(event.pointerId);
      if (dragDistance < 12) {
        const bounds = canvas.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const hit = screenPlanets.find(item => Math.hypot(item.x - x, item.y - y) <= item.radius + 14);
        if (hit) selectPlanet(hit.index);
      }
      pointerId = null;
    };
    canvas.addEventListener('pointerup', finishPointer);
    canvas.addEventListener('pointercancel', finishPointer);

    root.addEventListener('keydown', event => {
      const step = event.shiftKey ? 110 : 55;
      if (event.key === 'ArrowLeft') camera.targetX -= step;
      else if (event.key === 'ArrowRight') camera.targetX += step;
      else if (event.key === 'ArrowUp') camera.targetY -= step;
      else if (event.key === 'ArrowDown') camera.targetY += step;
      else if (event.key === '+' || event.key === '=') changeZoom(.14);
      else if (event.key === '-') changeZoom(-.14);
      else if (event.key === '0') resetView();
      else return;
      event.preventDefault();
      setEntered(true);
      schedule();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        visible = entry.isIntersecting;
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

