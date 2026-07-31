(function() {
    'use strict';
    var GF_NAME = '花花';
    var SINCE_DATE = new Date('2026-01-11T00:00:00');
    window.TOTAL_REAL_PHOTOS = 11; // Auto-generated from photo import

    // ============ 星空粒子系统 (智能分级渲染) ============
    var canvas = document.getElementById('starfield-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [], mouse = { x: -1000, y: -1000 }, animationId;
    var isMobile = window.innerWidth < 768;
    var starFrameSkip = 0, starFrameInterval = isMobile ? 2 : 1;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    function initParticles() {
        var area = canvas.width * canvas.height;
        var density = isMobile ? 0.00005 : 0.0001;
        var count = Math.floor(area * density);
        particles = [];
        for (var i = 0; i < count; i++) {
            var p = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.2 + 0.3,
                baseX: 0, baseY: 0,
                speed: Math.random() * 0.025 + 0.008,
                opacity: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() < 0.15,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                trail: []
            };
            p.baseX = p.x;
            p.baseY = p.y;
            particles.push(p);
        }
    }
    function drawStars() {
        starFrameSkip++;
        if (starFrameSkip % starFrameInterval !== 0) { animationId = requestAnimationFrame(drawStars); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var mx = mouse.x, my = mouse.y;
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var dx = mx - p.x, dy = my - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                var force = (1 - dist / 150) * 0.5;
                p.x += dx * force * 0.015;
                p.y += dy * force * 0.015;
            }
            p.x += (p.baseX - p.x) * 0.012;
            p.y += (p.baseY - p.y) * 0.012;
            p.baseX += p.speed * 0.15;
            if (p.baseX > canvas.width + 20) p.baseX = -20;
            if (p.baseX < -20) p.baseX = canvas.width + 20;
            // Twinkle
            var alpha = p.opacity;
            if (p.twinkle) {
                p.twinklePhase += p.twinkleSpeed;
                alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.twinklePhase));
            }
            // Trail (2-point, lightweight)
            p.trail.push({ x: p.x, y: p.y, a: alpha });
            if (p.trail.length > 2) p.trail.shift();
            if (p.trail.length > 1) {
                var t0 = p.trail[0];
                ctx.beginPath();
                ctx.moveTo(t0.x, t0.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = 'rgba(180,150,210,' + (alpha * 0.3) + ')';
                ctx.lineWidth = p.size * 0.6;
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,175,135,' + alpha + ')';
            ctx.fill();
            // Glow on larger stars
            if (p.size > 1.4 && p.twinkle) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212,175,135,' + (alpha * 0.12) + ')';
                ctx.fill();
            }
        }
        animationId = requestAnimationFrame(drawStars);
    }
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
        resizeCanvas();
    });
    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', function(e) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
    resizeCanvas();
    drawStars();

    // ============ 加载器 ============
    var loader = document.getElementById('preamble-loader');
    var fill = document.getElementById('loader-fill');
    var loaderText = document.getElementById('loader-text');
    var loaderPct = document.getElementById('loader-pct');
    var main = document.getElementById('main-content');
    var gate = document.getElementById('universe-gate');
    var progress = 0;

    function simulateLoading() {
        var startTime = Date.now();
        var duration = 1800;
        function tick() {
            var elapsed = Date.now() - startTime;
            progress = Math.min(100, Math.floor((elapsed / duration) * 100));
            fill.style.width = progress + '%';
            loaderPct.textContent = Math.floor(progress);
            if (progress < 100) {
                requestAnimationFrame(function() { setTimeout(tick, 50); });
            } else {
                finishLoading();
            }
        }
        tick();
    }

    function finishLoading() {
        if (loader._finished) return;
        loader._finished = true;
        if (loaderSafetyTimeout) clearTimeout(loaderSafetyTimeout);
        progress = 100;
        fill.style.width = '100%';
        loaderPct.textContent = '100';
        loaderText.textContent = 'STELLAR GATEWAY READY';
        setTimeout(function() {
            loader.classList.add('hidden');
            gate.classList.remove('hidden');
        }, 600);
    }

    simulateLoading();

    var loaderSafetyTimeout = setTimeout(function() {
        if (!loader._finished) {
            finishLoading();
        }
    }, 2500);

    // ============ 宇宙之门 ============
    var musicPlaying = false;
    var startBtn = document.querySelector('#gate-btn, .gate-btn');
    if (startBtn) {
        startBtn.onclick = null;
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (musicPlaying) return;
            musicPlaying = true;
            loader.classList.add('space-fade-out');
            loader.style.pointerEvents = 'none';
            setTimeout(function() {
                loader.classList.add('hidden');
                loader.style.display = 'none';
            }, 800);
            gate.style.opacity = '0';
            gate.style.pointerEvents = 'none';
            setTimeout(function() {
                gate.classList.add('hidden');
                main.classList.remove('hidden');
                main.style.opacity = '1';
                main.style.visibility = 'visible';
                main.style.pointerEvents = 'auto';
                document.body.style.overflow = '';
                initChronograph();
                init3DPlanets();
                initGallery();
                initEchoes();
                initSfx();
                initLerpScroll();
                initPortal();
                try { startAmbientMusic(); } catch(err) { console.warn('[LUMIÈRE] Audio:', err); }
            }, 600);
        }, { once: true });
    }

    // ============ 沉浸式氛围音乐引擎 ============
    var audioCtx, masterGain, reverbNode, musicNodes = [];
    var bassNodes = [], padNodes = [], shimmerNodes = [];
    var chordTimeout, shimmerInterval;

    function initAudioCtx() {
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch(e) { console.warn('[LUMIÈRE] AudioContext not available:', e); return null; }
            if (!audioCtx) return null;
            try {
                masterGain = audioCtx.createGain();
                masterGain.gain.value = 0;
                reverbNode = createReverb();
                masterGain.connect(reverbNode);
                reverbNode.connect(audioCtx.destination);
                var dryGain = audioCtx.createGain();
                dryGain.gain.value = 0.4;
                masterGain.connect(dryGain);
                dryGain.connect(audioCtx.destination);
            } catch(e) {
                console.warn('[LUMIÈRE] Audio routing setup failed:', e);
                audioCtx = null; return null;
            }
        }
        return audioCtx;
    }

    function createReverb() {
        var ctx = initAudioCtx();
        var input = ctx.createGain();
        var output = ctx.createGain();
        output.gain.value = 0.5;
        var delays = [0.037, 0.043, 0.051, 0.059, 0.067, 0.073, 0.081, 0.089];
        for (var i = 0; i < delays.length; i++) {
            var d = ctx.createDelay(1); d.delayTime.value = delays[i];
            var g = ctx.createGain(); g.gain.value = 0.06;
            var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000 + Math.random() * 3000;
            input.connect(d); d.connect(g); g.connect(f); f.connect(output); g.connect(d);
        }
        return { input: input, output: output, connect: function(dest) { output.connect(dest); } };
    }

    function createLayeredVoice(freq, detune, type, filterFreq, gainVal) {
        var ctx = initAudioCtx();
        var osc = ctx.createOscillator(); var gain = ctx.createGain(); var filter = ctx.createBiquadFilter();
        var lfoOsc = ctx.createOscillator(); var lfoGain = ctx.createGain();
        osc.type = type || 'sawtooth'; osc.frequency.value = freq; osc.detune.value = detune || 0;
        filter.type = 'lowpass'; filter.frequency.value = filterFreq || 800; filter.Q.value = 0.4;
        gain.gain.value = 0;
        lfoOsc.type = 'sine'; lfoOsc.frequency.value = 0.02 + Math.random() * 0.06; lfoGain.gain.value = filterFreq * 0.3;
        lfoOsc.connect(lfoGain); lfoGain.connect(filter.frequency);
        osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
        osc.start(); lfoOsc.start();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(gainVal || 0.04, ctx.currentTime + 2);
        return { osc: osc, gain: gain, filter: filter, lfo: lfoOsc, lfoGain: lfoGain };
    }

    function createBassDrone() {
        var ctx = initAudioCtx();
        var osc1 = ctx.createOscillator(); osc1.type = 'triangle'; osc1.frequency.value = 43.65;
        var osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 87.31; osc2.detune.value = 6;
        var osc3 = ctx.createOscillator(); osc3.type = 'sawtooth'; osc3.frequency.value = 43.65; osc3.detune.value = -4;
        var gain = ctx.createGain(); var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 140; filter.Q.value = 0.6;
        gain.gain.value = 0; gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
        osc1.connect(filter); osc2.connect(filter); osc3.connect(filter); filter.connect(gain); gain.connect(masterGain);
        osc1.start(); osc2.start(); osc3.start();
        return { osc1: osc1, osc2: osc2, osc3: osc3, gain: gain, filter: filter };
    }

    var chordProgression = [
        [261.63, 329.63, 392.00, 440.00, 523.25],
        [220.00, 261.63, 329.63, 392.00, 493.88],
        [293.66, 349.23, 440.00, 523.25, 587.33],
        [196.00, 246.94, 293.66, 349.23, 440.00]
    ];
    var chordIdx = 0, currentPads = [], oldPads = [];

    function cyclePadChords() {
        if (!musicPlaying) return;
        var chord = chordProgression[chordIdx % chordProgression.length];
        oldPads = currentPads;
        oldPads.forEach(function(n) { try { if (n.gain) n.gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.5); } catch(e) {} });
        currentPads = [];
        chord.forEach(function(f) {
            currentPads.push(createLayeredVoice(f, 0, 'sawtooth', 500, 0.035));
            currentPads.push(createLayeredVoice(f / 2, 8, 'triangle', 300, 0.03));
            currentPads.push(createLayeredVoice(f * 2, -6, 'sine', 1200, 0.025));
        });
        setTimeout(function() {
            oldPads.forEach(function(n) { try { n.osc && n.osc.stop(); n.lfo && n.lfo.stop(); } catch(e) {} });
            oldPads = [];
        }, 2000);
        for (var i = 0; i < 4; i++) {
            (function(delay) {
                setTimeout(function() {
                    if (!musicPlaying) return;
                    createShimmer(chord[Math.floor(Math.random() * chord.length)] * (2 + Math.random() * 5));
                }, delay);
            })(i * 500 + Math.random() * 500);
        }
        chordIdx++;
        chordTimeout = setTimeout(cyclePadChords, 14000 + Math.random() * 5000);
    }

    function createShimmer(freq) {
        var ctx = initAudioCtx();
        var osc = ctx.createOscillator(); var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter(); var delay = ctx.createDelay(1);
        osc.type = 'sine'; osc.frequency.value = freq;
        filter.type = 'bandpass'; filter.frequency.value = freq; filter.Q.value = 3;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        delay.delayTime.value = 0.25 + Math.random() * 0.5;
        var fb = ctx.createGain(); fb.gain.value = 0.4;
        var wet = ctx.createGain(); wet.gain.value = 0.5;
        osc.connect(filter); filter.connect(gain); gain.connect(delay);
        delay.connect(fb); fb.connect(delay); gain.connect(masterGain); delay.connect(wet); wet.connect(masterGain);
        osc.start(); osc.stop(ctx.currentTime + 3.5);
    }

    function startShimmerCycle() {
        shimmerInterval = setInterval(function() {
            if (!musicPlaying) return;
            var freqs = [1047, 1319, 1568, 1760, 2093, 2349, 2637, 2794, 3136, 3520];
            createShimmer(freqs[Math.floor(Math.random() * freqs.length)]);
        }, 2000 + Math.random() * 3000);
    }

    function startAmbientMusic() {
        initAudioCtx();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 1.5);
        bassNodes = [createBassDrone(), createBassDrone()];
        chordIdx = 0; cyclePadChords(); startShimmerCycle();
        var waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(function(b) { b.classList.add('playing'); });
        var musicBtn = document.getElementById('music-btn');
        musicBtn.addEventListener('click', function() {
            if (!audioCtx) return;
            if (musicPlaying) {
                masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
                clearTimeout(chordTimeout); clearInterval(shimmerInterval);
                waveBars.forEach(function(b) { b.classList.remove('playing'); });
                musicPlaying = false;
                setTimeout(function() {
                    var all = currentPads.concat(oldPads, bassNodes);
                    all.forEach(function(n) { try { if (n.osc) n.osc.stop(); if (n.osc1) { n.osc1.stop(); n.osc2.stop(); n.osc3.stop(); } if (n.lfo) n.lfo.stop(); } catch(e) {} });
                    currentPads = []; oldPads = []; bassNodes = [];
                }, 2000);
            } else {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
                masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.8);
                bassNodes = [createBassDrone()];
                chordIdx = 0; cyclePadChords(); startShimmerCycle();
                waveBars.forEach(function(b) { b.classList.add('playing'); });
                musicPlaying = true;
            }
        });
    }

    // ============ UI 交互音效 ============
    function initSfx() {
        function playSfx(freq, type, dur, vol, filterType, filterFreq) {
            try {
                var c = initAudioCtx(); if (!c) return;
                var o = c.createOscillator(); var g = c.createGain(); var f = filterType ? c.createBiquadFilter() : null;
                o.type = type || 'sine'; o.frequency.setValueAtTime(freq, c.currentTime);
                g.gain.setValueAtTime(vol || 0.08, c.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.3));
                if (f) { f.type = filterType; f.frequency.value = filterFreq || 1000; f.Q.value = 2; o.connect(f); f.connect(g); }
                else { o.connect(g); }
                g.connect(audioCtx.destination); o.start(); o.stop(c.currentTime + dur + 0.1);
            } catch(e) {}
        }
        document.querySelectorAll('.gallery-item, .echo-capsule, .gate-btn, .echo-launch-btn').forEach(function(el) {
            el.addEventListener('mouseenter', function() { playSfx(200 + Math.random()*200, 'sine', 0.25, 0.04, 'lowpass', 400); });
        });
        document.querySelectorAll('button').forEach(function(el) {
            el.addEventListener('click', function() { playSfx(800, 'sine', 0.15, 0.06, 'bandpass', 1200); });
        });
    }

    // ============ 3D 行星渲染引擎 (智能分层优化版) ============
    var planetLeftCanvas, planetRightCanvas;
    var planetLeftCtx, planetRightCtx;
    var planetRotation = 0;
    var planetMouseX = 0, planetMouseY = 0;
    var planetTargetMX = 0, planetTargetMY = 0;
    var planetRenderSkip = 0, planetRenderInterval = isMobile ? 2 : 1;
    var planetCachedTextures = {};

    function createProceduralTexture(isLeft) {
        var cacheKey = isLeft ? 'left' : 'right';
        if (planetCachedTextures[cacheKey]) return planetCachedTextures[cacheKey];
        var w = 256, h = 128; // Half original res for perf
        var off = document.createElement('canvas');
        off.width = w; off.height = h;
        var cx = off.getContext('2d');

        var baseGrad = cx.createLinearGradient(0, 0, w, h);
        baseGrad.addColorStop(0, 'hsl(35, 40%, ' + (isLeft ? '35%' : '40%') + ')');
        baseGrad.addColorStop(0.3, 'hsl(45, 50%, ' + (isLeft ? '45%' : '50%') + ')');
        baseGrad.addColorStop(0.5, 'hsl(55, 60%, ' + (isLeft ? '50%' : '55%') + ')');
        baseGrad.addColorStop(0.7, 'hsl(30, 45%, ' + (isLeft ? '40%' : '45%') + ')');
        baseGrad.addColorStop(1, 'hsl(25, 35%, ' + (isLeft ? '28%' : '32%') + ')');
        cx.fillStyle = baseGrad;
        cx.fillRect(0, 0, w, h);

        // Surface bands
        for (var y = 0; y < h; y += 2) {
            var noise = Math.sin(y * 0.06) * 0.25 + Math.sin(y * 0.15 + 2) * 0.12 + Math.sin(y * 0.04 + 5) * 0.18;
            cx.fillStyle = 'rgba(' + (isLeft ? '180,140,100' : '212,175,135') + ',' + (0.06 + noise * 0.25) + ')';
            cx.fillRect(0, y, w, 2);
        }

        // Crater-like spots (reduced count)
        for (var i = 0; i < 25; i++) {
            var cxx = Math.random() * w, cyy = Math.random() * h;
            var r = Math.random() * 10 + 2;
            var grad = cx.createRadialGradient(cxx, cyy, r * 0.2, cxx, cyy, r);
            grad.addColorStop(0, 'rgba(0,0,0,' + (Math.random() * 0.25 + 0.08) + ')');
            grad.addColorStop(0.6, 'rgba(0,0,0,' + (Math.random() * 0.1) + ')');
            grad.addColorStop(1, 'rgba(255,255,255,' + (Math.random() * 0.04) + ')');
            cx.fillStyle = grad;
            cx.beginPath(); cx.arc(cxx, cyy, r, 0, Math.PI * 2); cx.fill();
        }

        planetCachedTextures[cacheKey] = off;
        return off;
    }

    function render3DPlanet(ctx, size, texture, rotationAngle, lightAngle) {
        // Render at half-res for 4x fewer pixels, then browser scales up via canvas size
        var r = size / 2;
        var cx = r, cy = r;
        var tw = texture.width, th = texture.height;
        var texCtx = texture.getContext('2d');

        // Pre-sample texture once into ImageData for fast random access
        // Actually, getImageData per pixel is slow. Let's pre-read the whole thing.
        var imgData = texCtx.getImageData(0, 0, tw, th);
        var pixels = imgData.data;

        ctx.clearRect(0, 0, size, size);
        var step = 2; // Skip every other pixel = 4x speedup

        for (var y = -r; y < r; y += step) {
            var yNorm = y / r;
            if (Math.abs(yNorm) > 0.97) continue;
            var sliceWidth = Math.sqrt(Math.max(0, r * r - y * y));
            var zNorm = sliceWidth / r;

            for (var x = -sliceWidth; x < sliceWidth; x += step) {
                var z = Math.sqrt(Math.max(0, r * r - x * x - y * y));
                var u = ((Math.atan2(x, z) / (Math.PI * 2) + 0.5 + rotationAngle) % 1 + 1) % 1;
                var v = Math.asin(yNorm) / Math.PI + 0.5;
                var tx = Math.floor(u * (tw - 1));
                var ty = Math.floor(v * (th - 1));
                ty = ty < 0 ? 0 : (ty >= th ? th - 1 : ty);

                var idx = (ty * tw + tx) * 4;
                var pr = pixels[idx], pg = pixels[idx + 1], pb = pixels[idx + 2];

                var nx = x / r, ny = yNorm, nz = z / r;
                var len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                nx /= len; ny /= len; nz /= len;

                var diffuse = Math.max(0, nx * lightAngle.x + ny * lightAngle.y + nz * lightAngle.z);
                diffuse = diffuse * 0.65 + 0.35;

                var halfZ = nz + lightAngle.z + 1;
                var specular = Math.pow(Math.max(0, halfZ / 2), 35) * 0.3;
                var rim = Math.pow(1 - Math.abs(zNorm), 3) * 0.2;

                var rVal = Math.min(255, pr * diffuse + specular * 255 + rim * 255);
                var gVal = Math.min(255, pg * diffuse + specular * 220 + rim * 220);
                var bVal = Math.min(255, pb * diffuse + specular * 180 + rim * 180);

                ctx.fillStyle = 'rgb(' + Math.floor(rVal) + ',' + Math.floor(gVal) + ',' + Math.floor(bVal) + ')';
                ctx.fillRect(cx + x, cy + y, step, step);
            }
        }

        // Atmosphere glow
        var glowGrad = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.18);
        glowGrad.addColorStop(0, 'rgba(212,175,135,0)');
        glowGrad.addColorStop(0.5, 'rgba(212,175,135,0.06)');
        glowGrad.addColorStop(0.8, 'rgba(180,150,210,0.1)');
        glowGrad.addColorStop(1, 'rgba(212,175,135,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2); ctx.fill();
    }

    function init3DPlanets() {
        var leftPlanet = document.getElementById('planet-left');
        var rightPlanet = document.getElementById('planet-right');
        if (!leftPlanet || !rightPlanet) return;

        var planetSize = isMobile ? 90 : 120;
        var canvasSize = planetSize * 2;

        leftPlanet.innerHTML = '';
        rightPlanet.innerHTML = '';

        planetLeftCanvas = document.createElement('canvas');
        planetLeftCanvas.width = canvasSize;
        planetLeftCanvas.height = canvasSize;
        planetLeftCanvas.style.cssText = 'width:100%;height:100%;border-radius:50%;display:block';
        planetLeftCtx = planetLeftCanvas.getContext('2d');

        planetRightCanvas = document.createElement('canvas');
        planetRightCanvas.width = canvasSize;
        planetRightCanvas.height = canvasSize;
        planetRightCanvas.style.cssText = 'width:100%;height:100%;border-radius:50%;display:block';
        planetRightCtx = planetRightCanvas.getContext('2d');

        leftPlanet.appendChild(planetLeftCanvas);
        rightPlanet.appendChild(planetRightCanvas);

        var leftTex = createProceduralTexture(true);
        var rightTex = createProceduralTexture(false);

        var lightDir = { x: 0.55, y: -0.25, z: 0.7 };
        var ll = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z);
        lightDir.x /= ll; lightDir.y /= ll; lightDir.z /= ll;

        var stage = document.getElementById('planets-stage');
        if (stage) {
            stage.addEventListener('mousemove', function(e) {
                var rect = stage.getBoundingClientRect();
                planetTargetMX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                planetTargetMY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            });
            stage.addEventListener('mouseleave', function() { planetTargetMX = 0; planetTargetMY = 0; });
            stage.addEventListener('touchmove', function(e) {
                var rect = stage.getBoundingClientRect();
                planetTargetMX = (e.touches[0].clientX - rect.left - rect.width / 2) / (rect.width / 2);
                planetTargetMY = (e.touches[0].clientY - rect.top - rect.height / 2) / (rect.height / 2);
            }, { passive: true });
            stage.addEventListener('touchend', function() { planetTargetMX = 0; planetTargetMY = 0; });
        }

        function animatePlanets() {
            planetRenderSkip++;
            if (planetRenderSkip % planetRenderInterval !== 0) { requestAnimationFrame(animatePlanets); return; }

            planetMouseX += (planetTargetMX - planetMouseX) * 0.05;
            planetMouseY += (planetTargetMY - planetMouseY) * 0.05;
            planetRotation += 0.004;

            var dynamicLight = {
                x: lightDir.x + planetMouseX * 0.3,
                y: lightDir.y - planetMouseY * 0.3,
                z: lightDir.z
            };
            var dl = Math.sqrt(dynamicLight.x * dynamicLight.x + dynamicLight.y * dynamicLight.y + dynamicLight.z * dynamicLight.z);
            dynamicLight.x /= dl; dynamicLight.y /= dl; dynamicLight.z /= dl;

            render3DPlanet(planetLeftCtx, canvasSize, leftTex, planetRotation, dynamicLight);
            render3DPlanet(planetRightCtx, canvasSize, rightTex, -planetRotation * 0.8, {
                x: -dynamicLight.x, y: dynamicLight.y, z: dynamicLight.z
            });

            var leftW = document.getElementById('left-planet-wrapper');
            var rightW = document.getElementById('right-planet-wrapper');
            if (leftW) leftW.style.transform = 'translate3d(' + (planetMouseX * 12) + 'px, ' + (planetMouseY * 8) + 'px, 0)';
            if (rightW) rightW.style.transform = 'translate3d(' + (-planetMouseX * 12) + 'px, ' + (planetMouseY * 8) + 'px, 0)';

            requestAnimationFrame(animatePlanets);
        }
        animatePlanets();
    }

    // ============ 时光罗盘 (精确日期差，永不出现负数) ============
    function updateChrono() {
        var now = new Date();
        // Precise calendar-based difference — no floating-point, no negatives
        var years = now.getFullYear() - SINCE_DATE.getFullYear();
        var months = now.getMonth() - SINCE_DATE.getMonth();
        var days = now.getDate() - SINCE_DATE.getDate();
        var hours = now.getHours() - SINCE_DATE.getHours();
        var minutes = now.getMinutes() - SINCE_DATE.getMinutes();
        var seconds = now.getSeconds() - SINCE_DATE.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            var prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += prevMonthLastDay;
            months--;
        }
        if (months < 0) { months += 12; years--; }
        // Safety clamp — never show negatives
        years = Math.max(0, years);
        months = Math.max(0, months);
        days = Math.max(0, days);
        hours = Math.max(0, hours);
        minutes = Math.max(0, minutes);
        seconds = Math.max(0, seconds);

        document.getElementById('c-years').textContent = String(years).padStart(2, '0');
        document.getElementById('c-months').textContent = String(months).padStart(2, '0');
        document.getElementById('c-days').textContent = String(days).padStart(2, '0');
        document.getElementById('c-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('c-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('c-seconds').textContent = String(seconds).padStart(2, '0');
        document.getElementById('chrono-since').textContent = 'Since ' + SINCE_DATE.getFullYear() + '.' + String(SINCE_DATE.getMonth()+1).padStart(2,'0') + '.' + String(SINCE_DATE.getDate()).padStart(2,'0');
    }
    function initChronograph() {
        updateChrono();
        setInterval(updateChrono, 1000);
    }

    // ============ 3D 失重空间阵列相册 ============
    function generateCosmicArt(index) {
        var c = document.createElement('canvas');
        c.width = 400; c.height = 500;
        var cx = c.getContext('2d');
        var bgGrad = cx.createRadialGradient(200 + (index%5-2)*40, 200 + (index%3-1)*60, 20, 200, 250, 400);
        var hues = [280, 320, 30, 200, 340, 45, 260, 15, 300, 180, 350, 60];
        var h = hues[index % hues.length];
        bgGrad.addColorStop(0, 'hsla(' + h + ', 70%, 25%, 0.9)');
        bgGrad.addColorStop(0.4, 'hsla(' + ((h+40)%360) + ', 40%, 15%, 0.7)');
        bgGrad.addColorStop(1, '#07070f');
        cx.fillStyle = bgGrad; cx.fillRect(0, 0, 400, 500);
        for (var i = 0; i < 200; i++) {
            cx.beginPath();
            cx.arc(Math.random() * 400, Math.random() * 500, Math.random() * 3 + 0.5, 0, Math.PI * 2);
            cx.fillStyle = 'hsla(' + (h + Math.random()*60 - 30) + ', 60%, ' + (60 + Math.random()*30) + '%, ' + (Math.random() * 0.4) + ')';
            cx.fill();
        }
        var gx = 200 + Math.sin(index * 1.7) * 80, gy = 200 + Math.cos(index * 2.1) * 100;
        var glow = cx.createRadialGradient(gx, gy, 0, gx, gy, 120);
        glow.addColorStop(0, 'hsla(' + h + ', 80%, 80%, 0.9)');
        glow.addColorStop(0.3, 'hsla(' + h + ', 70%, 50%, 0.4)');
        glow.addColorStop(1, 'transparent');
        cx.fillStyle = glow; cx.beginPath(); cx.arc(gx, gy, 120, 0, Math.PI*2); cx.fill();
        cx.strokeStyle = 'hsla(' + h + ', 70%, 70%, 0.3)'; cx.lineWidth = 0.5;
        cx.beginPath(); cx.arc(gx, gy, 80 + (index%3)*15, 0, Math.PI*2); cx.stroke();
        cx.beginPath(); cx.arc(gx, gy, 50 + (index%5)*10, 0, Math.PI*2); cx.stroke();
        return c.toDataURL('image/jpeg', 0.85);
    }

    var galleryPhotos = [];
    var photoPoems = [
        '宇宙广袤，星河璀璨，\n但有你的那一隅，\n才是我唯一想停留的坐标。',
        '你的笑是引力波，\n穿越亿万光年，\n抵达我心底最柔软的地方。',
        '时间在我遇见你之后\n才开始真正流动——\n每一秒都有了意义。',
        '我们之间的距离，\n像是两颗相互环绕的恒星，\n靠近、远离，但永远不会脱离彼此的轨道。',
        '如果宇宙有尽头，\n我希望尽头那端，\n站着你。',
        '你是我所有浪漫方程\n的唯一解。',
        '在我混乱的熵增宇宙里，\n你是唯一的负熵——\n让一切有了秩序。',
        '把对你的思念\n折叠进每一帧相片，\n打开就是整个星河。',
        '平行宇宙里\n有无数个我，\n但每一个都只会爱你。',
        '愿做你环游宇宙时\n那颗永远为你发光的\n北极星。',
        '在这个无限膨胀的宇宙里，\n你是我不变的常数。'
    ];

    function loadImage(src) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { reject(new Error('Not found')); };
            img.src = src;
        });
    }

    function createGalleryItem(src, index) {
        var div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-index', index);

        // Random Z-depth for 3D space array (-150 to 100px)
        var zDepth = (Math.random() * 250 - 150).toFixed(0);
        div.style.setProperty('--z-depth', zDepth + 'px');
        div.style.transform = 'translate3d(0, 0, ' + zDepth + 'px)';

        // Start invisible for entrance animation (IntersectionObserver will trigger)
        div.style.opacity = '0';

        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Memory ' + index;
        img.loading = 'lazy';
        div.appendChild(img);

        // Scan line overlay
        var scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        div.appendChild(scanLine);

        // Frame number overlay
        var frameNum = document.createElement('div');
        frameNum.className = 'gallery-frame-num';
        frameNum.textContent = '#' + String(index).padStart(2, '0');
        div.appendChild(frameNum);

        // Cosmic glow overlay for entrance effect
        var glowOverlay = document.createElement('div');
        glowOverlay.className = 'cosmic-glow-overlay';
        div.appendChild(glowOverlay);

        // Track whether entrance animation has played
        div._entrancePlayed = false;

        // 3D magnetic tilt on hover (GPU accelerated)
        div.addEventListener('mousemove', function(e) {
            if (!div._entrancePlayed) return;
            var rect = div.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var cx = rect.width / 2, cy = rect.height / 2;
            var rx = (y - cy) / cy * 15;
            var ry = (x - cx) / cx * -15;
            div.style.transform = 'translate3d(0, 0, 60px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.04)';
            div.style.zIndex = '200';
            div.style.boxShadow = '0 30px 80px rgba(212,175,135,0.3), 0 0 40px rgba(180,150,210,0.15)';
        });
        div.addEventListener('mouseleave', function() {
            if (!div._entrancePlayed) return;
            div.style.transform = 'translate3d(0, 0, ' + zDepth + 'px) rotateX(0) rotateY(0) scale(1)';
            div.style.zIndex = '';
            div.style.boxShadow = '';
        });

        // Click to open portal
        div.addEventListener('click', function() {
            if (!div._entrancePlayed) return;
            openPortal(src, index);
        });

        return div;
    }

    function initGallery() {
        var grid = document.getElementById('gallery-grid');
        if (!grid) return;

        var totalPhotos = window.TOTAL_REAL_PHOTOS || 11;
        var loaded = 0;

        for (var i = 1; i <= totalPhotos; i++) {
            (function(idx) {
                var src = 'images/' + idx + '.jpg';
                loadImage(src).then(function() {
                    galleryPhotos.push({ src: src, index: idx });
                    loaded++;
                    if (loaded === totalPhotos) renderGallery(grid);
                }).catch(function() {
                    var dataUrl = generateCosmicArt(idx);
                    galleryPhotos.push({ src: dataUrl, index: idx, isGenerated: true });
                    loaded++;
                    if (loaded === totalPhotos) renderGallery(grid);
                });
            })(i);
        }

        function renderGallery(grid) {
            galleryPhotos.sort(function(a, b) { return a.index - b.index; });
            galleryPhotos.forEach(function(photo) {
                var item = createGalleryItem(photo.src, photo.index);
                grid.appendChild(item);
            });

            // Kick off IntersectionObserver entrance animations
            initEntranceAnimations();

            // Event delegation fallback
            grid.addEventListener('click', function(e) {
                var card = e.target.closest('.gallery-item');
                if (!card) return;
                if (!card._entrancePlayed) return;
                var idx = parseInt(card.getAttribute('data-index'));
                if (!idx) return;
                var photo = galleryPhotos.find(function(p) { return p.index === idx; });
                if (photo && !portalActive) {
                    openPortal(photo.src, photo.index);
                }
            });
        }
    }

    // ============ 宇宙尘埃凝结入场动画 (IntersectionObserver) ============
    function initEntranceAnimations() {
        if (!window.IntersectionObserver) {
            // Fallback: just show all items
            document.querySelectorAll('.gallery-item').forEach(function(item) {
                item.style.opacity = '1';
                item._entrancePlayed = true;
            });
            return;
        }

        var entranceObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var item = entry.target;
                    if (item._entrancePlayed) return;
                    item._entrancePlayed = true;

                    var idx = parseInt(item.getAttribute('data-index')) || 0;
                    // Stagger delay: each card in a "row" gets a slightly different delay
                    var staggerDelay = (idx % 4) * 80;

                    // Apply entrance class with delay
                    setTimeout(function() {
                        item.classList.add('cosmic-entrance');
                        // After animation completes, settle into normal state
                        item.addEventListener('animationend', function onAnimEnd(e) {
                            if (e.animationName === 'cosmicMaterialize') {
                                item.classList.remove('cosmic-entrance');
                                item.classList.add('entrance-done');
                                item.style.opacity = '1';
                                item.removeEventListener('animationend', onAnimEnd);
                            }
                        });
                    }, staggerDelay);

                    entranceObserver.unobserve(item);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.gallery-item').forEach(function(item) {
            entranceObserver.observe(item);
        });
    }

    // ============ 3D 深度视差更新 (由 lerp loop 驱动) ============
    function updateGalleryDepth() {
        var items = document.querySelectorAll('.gallery-item');
        var viewH = window.innerHeight;
        var scrollY = smoothScrollY || window.pageYOffset || 0;

        items.forEach(function(item) {
            // Skip items still in entrance animation
            if (!item._entrancePlayed) return;

            var rect = item.getBoundingClientRect();
            var itemCenter = rect.top + rect.height / 2;
            var viewCenter = viewH / 2;

            // Distance from viewport center (-1 to 1)
            var distFromCenter = (itemCenter - viewCenter) / (viewH * 0.7);
            distFromCenter = Math.max(-1, Math.min(1, distFromCenter));

            // Cards far from center drift deeper into Z-space
            var zOffset = Math.abs(distFromCenter) * 120;
            var opacity = 1 - Math.abs(distFromCenter) * 0.5;

            var currentTransform = item.style.transform || '';
            // Only update if not being hovered and entrance is done
            if (currentTransform.indexOf('rotateX') === -1 && item.classList.contains('entrance-done')) {
                var baseZ = parseFloat(item.style.getPropertyValue('--z-depth')) || 0;
                item.style.transform = 'translate3d(0, 0, ' + (baseZ - zOffset) + 'px) scale(' + (1 - Math.abs(distFromCenter) * 0.1) + ')';
                item.style.opacity = opacity;
            }
        });
    }

    // ============ 记忆维度沉浸展厅 ============
    var portalOverlay = document.getElementById('portal-overlay');
    var portalImg = document.getElementById('portal-img');
    var portalMeta = document.getElementById('portal-meta');
    var portalPoem = document.getElementById('portal-poem');
    var portalReturnBtn = document.getElementById('portal-return-btn');
    var portalBg = document.getElementById('portal-bg');
    var portalActive = false;
    var portalSourceEl = null;

    function initPortal() {
        portalReturnBtn.addEventListener('click', closePortal);
        portalBg.addEventListener('click', closePortal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && portalActive) closePortal();
        });
    }

    function openPortal(src, index) {
        if (portalActive) return;
        portalActive = true;
        var items = document.querySelectorAll('.gallery-item');
        portalSourceEl = null;
        items.forEach(function(item) {
            if (item.querySelector('img') && item.querySelector('img').src === src) {
                portalSourceEl = item;
            }
        });
        portalImg.src = src;
        portalMeta.textContent = '[ MEMORY ARCHIVE · FRAME #' + String(index).padStart(3,'0') + ' ]  ◆  ' + SINCE_DATE.getFullYear() + ' ~ ∞';
        portalPoem.textContent = photoPoems[(index - 1) % photoPoems.length];
        main.style.transform = 'scale(0.98)';
        main.style.transition = 'transform 0.6s ease';
        portalOverlay.classList.add('active');
        document.body.style.overflowY = 'hidden';
        document.documentElement.style.overflowY = 'hidden';
        if (portalSourceEl) {
            var rect = portalSourceEl.getBoundingClientRect();
            portalSourceEl.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            portalSourceEl.style.transform = 'translate3d(' +
                (window.innerWidth/2 - rect.left - rect.width/2) + 'px, ' +
                (window.innerHeight/2 - rect.top - rect.height/2) + 'px, 100px) scale(0.01)';
            portalSourceEl.style.opacity = '0';
        }
    }

    function closePortal() {
        if (!portalActive) return;
        portalActive = false;
        main.style.transform = 'scale(1)';
        main.style.transition = 'transform 0.6s ease';
        portalOverlay.classList.remove('active');

        // Fully unlock all scroll constraints
        document.body.style.overflow = '';
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowY = 'auto';

        // Thoroughly reset lerp scroll state to prevent deadlocks
        targetScrollY = currentScrollY;
        scrollDamping = 0.09;
        scrollVelocity = 0;
        scrollStallFrames = 0;
        lastScrollCheck = performance.now();
        lastWheelTime = 0;

        // Restore body height for lerp scroll
        var newH = main.scrollHeight;
        if (newH > 0) document.body.style.height = newH + 'px';

        // Restore lerp-friendly overflow after a microtask delay
        setTimeout(function() {
            document.body.style.overflowY = 'scroll';
            document.body.style.overflowX = 'hidden';
        }, 50);

        if (portalSourceEl) {
            setTimeout(function() {
                portalSourceEl.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                portalSourceEl.style.transform = '';
                portalSourceEl.style.opacity = '1';
            }, 300);
        }
    }

    // ============ 物理惯性视差滚动 (GPU加速版, 多重安全防护, 抗死锁) ============
    var smoothScrollY = 0;
    var currentScrollY = 0;
    var targetScrollY = 0;
    var scrollDamping = 0.09;
    var parallaxBg = document.getElementById('parallax-bg');
    var parallaxMid = document.getElementById('parallax-mid');
    var scrollVelocity = 0;
    var lastWheelTime = 0;
    var lastScrollCheck = 0;
    var scrollStallFrames = 0;

    function clampScroll(val) {
        var maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        return Math.max(0, Math.min(val, maxScroll));
    }

    function initLerpScroll() {
        var initialH = Math.max(main.scrollHeight, window.innerHeight + 100);
        document.body.style.height = initialH + 'px';
        document.body.style.overflowY = 'scroll';
        document.body.style.overflowX = 'hidden';

        // === WHEEL HANDLER — velocity-capped with burst protection ===
        window.addEventListener('wheel', function(e) {
            e.preventDefault();
            var now = performance.now();
            // Clamp per-event delta to prevent trackpad/mouse burst overflow
            var cappedDelta = Math.max(-120, Math.min(120, e.deltaY));
            // If events arrive faster than 16ms apart, blend momentum to smooth bursts
            var dt = now - lastWheelTime;
            if (dt < 16 && dt > 0) {
                scrollVelocity = scrollVelocity * 0.55 + cappedDelta * 0.45;
            } else {
                scrollVelocity = scrollVelocity * 0.3 + cappedDelta * 0.7;
            }
            lastWheelTime = now;
            targetScrollY += scrollVelocity;
            targetScrollY = clampScroll(targetScrollY);
            lastScrollCheck = now;
            scrollStallFrames = 0;
        }, { passive: false });

        // === TOUCH HANDLERS ===
        var touchStartY = 0, touchStartScroll = 0;
        window.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartScroll = targetScrollY;
            scrollStallFrames = 0;
        }, { passive: false });
        window.addEventListener('touchmove', function(e) {
            e.preventDefault();
            var dy = touchStartY - e.touches[0].clientY;
            targetScrollY = touchStartScroll + dy;
            targetScrollY = clampScroll(targetScrollY);
            lastScrollCheck = performance.now();
        }, { passive: false });

        // === RESIZE OBSERVER — keep body height in sync ===
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function() {
                var newH = main.scrollHeight;
                if (newH > 0 && Math.abs(document.body.scrollHeight - newH) > 10) {
                    document.body.style.height = newH + 'px';
                    targetScrollY = clampScroll(targetScrollY);
                    currentScrollY = clampScroll(currentScrollY);
                }
            });
            ro.observe(main);
        }

        // === LERP LOOP — with deadlock detection & auto-recovery ===
        function lerpLoop(ts) {
            var distance = Math.abs(targetScrollY - currentScrollY);

            // DEADLOCK DETECTION: if scroll hasn't converged 600ms after last input
            if (distance > 0.5) {
                if (ts - lastScrollCheck > 600) {
                    // Input has stopped but lerp hasn't converged — force faster damping
                    scrollDamping = 0.3;
                    scrollStallFrames++;
                    if (scrollStallFrames > 10) {
                        // HARD RECOVERY: instant snap + full reset
                        currentScrollY = targetScrollY;
                        scrollVelocity = 0;
                        scrollDamping = 0.09;
                        scrollStallFrames = 0;
                    }
                } else {
                    scrollStallFrames = 0;
                    scrollDamping = 0.09;
                }
            } else {
                // Converged — clean reset
                currentScrollY = targetScrollY;
                scrollVelocity = 0;
                scrollDamping = 0.09;
                scrollStallFrames = 0;
            }

            // Lerp step
            currentScrollY += (targetScrollY - currentScrollY) * scrollDamping;
            if (distance < 0.05) {
                currentScrollY = targetScrollY;
                scrollVelocity = 0;
            }
            smoothScrollY = currentScrollY;

            // GPU-accelerated transforms (compositor-only — never triggers layout/repaint)
            main.style.transform = 'translate3d(0, ' + (-currentScrollY) + 'px, 0)';
            if (parallaxBg) parallaxBg.style.transform = 'translate3d(0, ' + (-currentScrollY * 0.15) + 'px, 0)';
            if (parallaxMid) parallaxMid.style.transform = 'translate3d(0, ' + (-currentScrollY * 0.08) + 'px, 0)';
            canvas.style.transform = 'translate3d(0, ' + (-currentScrollY * 0.03) + 'px, 0)';

            // Drive gallery depth from lerp loop (NOT native scroll event)
            updateGalleryDepth();

            // Fallback height sync for browsers without ResizeObserver
            if (typeof ResizeObserver === 'undefined') {
                var newH = main.scrollHeight;
                if (newH > 0 && Math.abs(document.body.scrollHeight - newH) > 10) {
                    document.body.style.height = newH + 'px';
                    targetScrollY = clampScroll(targetScrollY);
                }
            }

            requestAnimationFrame(lerpLoop);
        }
        requestAnimationFrame(lerpLoop);
    }

    // ============ Starlight Echoes 超维星轨情感回响 ============
    var presetEchoes = [
        { coords: '2025.06.23 · 相遇坐标', author: '时空观测者', body: '那天晚风和你的裙摆一样温柔，宇宙的引力从此有了确切的方向。' },
        { coords: 'LOVE-SYSTEM · 观测日志', author: '星河服务器', body: '爱情恒定引力系数监测正常：双星共振已稳定维持，心动值突破临界点。' },
        { coords: '未来时空 · 2027 见证', author: '未来来客', body: '在下一个、下下个光年里，依然会像第一天那样为你着迷。' },
        { coords: 'Elena\'s Orbit · 专属注记', author: '星河导航员', body: '愿你的岁岁年年，都有漫天星光和永远不退场的偏爱。' },
        { coords: '空间站 · 永久备份', author: '宇宙档案馆', body: '这段时光已被刻入宇宙微波背景辐射，无可擦除，永不褪色。' },
        { coords: 'SIGNAL-042 · 深空信号', author: '旅行者号', body: '跨越星系的漫长旅途中，你是唯一值得我减速停靠的引力场。' },
        { coords: '星历 2026.10.17', author: '守夜人', body: '从那年秋天开始，我的世界便只有你这一颗北极星。生日快乐，花花。' },
        { coords: 'NEUTRON STAR · 致密情感', author: '天体物理学家', body: '对你的喜欢密度已经超过钱德拉塞卡极限——无法再被压缩，只能无限发光。' },
        { coords: 'WORMHOLE · 瞬达心意', author: '维度旅人', body: '穿越虫洞我也要第一时间来到你身边，因为宇宙再大，你才是中心。' },
        { coords: 'COSMIC · 永恒回响', author: '暗能量', body: '你是我加速膨胀的宇宙里，唯一的、温柔的常数。' }
    ];
    var userEchoes = [], echoesData = [];

    function loadEchoes() {
        try {
            var stored = localStorage.getItem('starlight-echoes');
            if (stored) { userEchoes = JSON.parse(stored); }
        } catch(e) { userEchoes = []; }
        echoesData = userEchoes.concat(presetEchoes);
        if (echoesData.length === 0) echoesData = presetEchoes.slice();
    }
    function saveEchoes() {
        try { localStorage.setItem('starlight-echoes', JSON.stringify(userEchoes)); } catch(e) {}
    }

    function createEchoCapsule(echo, isNew) {
        var capsule = document.createElement('div');
        capsule.className = 'echo-capsule';
        if (isNew) { capsule.style.animation = 'none'; capsule.offsetHeight; capsule.style.animation = 'capsuleAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; }
        var coordsEl = document.createElement('div'); coordsEl.className = 'echo-capsule-coords'; coordsEl.textContent = echo.coords;
        var authorEl = document.createElement('div'); authorEl.className = 'echo-capsule-author'; authorEl.textContent = '— ' + echo.author;
        var bodyEl = document.createElement('div'); bodyEl.className = 'echo-capsule-body'; bodyEl.textContent = echo.body;
        var timeEl = document.createElement('div'); timeEl.className = 'echo-capsule-time'; timeEl.textContent = echo.time || '✦ 已入轨';
        capsule.appendChild(coordsEl); capsule.appendChild(authorEl); capsule.appendChild(bodyEl); capsule.appendChild(timeEl);
        return capsule;
    }

    function renderEchoStream() {
        var track = document.getElementById('echoes-track');
        if (!track) return;
        track.innerHTML = '';
        for (var dup = 0; dup < 2; dup++) {
            for (var i = 0; i < echoesData.length; i++) {
                track.appendChild(createEchoCapsule(echoesData[i], false));
            }
        }
    }

    function addEcho(author, body) {
        var now = new Date();
        var ts = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        var echo = { coords: '[ 新信号 · ' + ts + ' ]', author: author || '匿名旅人', body: body, time: '✦ 刚刚入轨' };
        userEchoes.unshift(echo); saveEchoes();
        echoesData = userEchoes.concat(presetEchoes); renderEchoStream();
        return echo;
    }

    function launchEchoParticle(fromEl, callback) {
        var pCanvas = document.getElementById('echo-particle-canvas');
        var pCtx = pCanvas.getContext('2d');
        pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight;
        var rect = fromEl.getBoundingClientRect();
        var sx = rect.left + rect.width / 2, sy = rect.top + rect.height / 2;
        var ex = window.innerWidth / 2, ey = window.innerHeight / 2;
        var particles = [];
        for (var i = 0; i < 30; i++) {
            particles.push({
                x: sx, y: sy, tx: ex, ty: ey,
                size: Math.random() * 4 + 2, life: 1, delay: i * 15,
                color: 'hsla(' + (30 + Math.random()*30) + ', 80%, ' + (60 + Math.random()*30) + '%,'
            });
        }
        var startTime = Date.now();
        function animateParticles() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            var elapsed = Date.now() - startTime, allDone = true;
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                if (elapsed < p.delay) { allDone = false; continue; }
                var t = Math.min(1, (elapsed - p.delay) / 800);
                var midX = (sx + ex) / 2 + (Math.sin(t * Math.PI) * 200);
                var midY = Math.min(sy, ey) - 150 - t * 100;
                var bx = (1-t)*(1-t)*sx + 2*(1-t)*t*midX + t*t*ex;
                var by = (1-t)*(1-t)*sy + 2*(1-t)*t*midY + t*t*ey;
                p.x = bx; p.y = by; p.life = 1 - t;
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
                pCtx.fillStyle = p.color + (p.life * 0.8) + ')'; pCtx.fill();
                if (t > 0.7) {
                    pCtx.beginPath(); pCtx.arc(ex, ey, (1-t) * 80, 0, Math.PI*2);
                    pCtx.strokeStyle = 'rgba(212,175,135,' + ((t - 0.7) / 0.3 * 0.5) + ')';
                    pCtx.lineWidth = 1.5; pCtx.stroke();
                }
                if (t < 1) allDone = false;
            }
            if (!allDone) { requestAnimationFrame(animateParticles); }
            else {
                pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
                pCtx.beginPath(); pCtx.arc(ex, ey, 60, 0, Math.PI*2);
                pCtx.strokeStyle = 'rgba(212,175,135,0.6)'; pCtx.lineWidth = 2; pCtx.stroke();
                setTimeout(function() { pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height); }, 300);
                if (callback) callback();
            }
        }
        requestAnimationFrame(animateParticles);
    }

    function initEchoModal() {
        var overlay = document.getElementById('echo-modal-overlay');
        var closeBtn = document.getElementById('echo-modal-close');
        var submitBtn = document.getElementById('echo-submit-btn');
        var authorInput = document.getElementById('echo-author');
        var messageInput = document.getElementById('echo-message');
        var countEl = document.getElementById('echo-count');
        messageInput.addEventListener('input', function() { countEl.textContent = messageInput.value.length; });
        closeBtn.addEventListener('click', function() { overlay.classList.remove('active'); });
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('active'); });
        submitBtn.addEventListener('click', function() {
            var author = authorInput.value.trim() || '匿名旅人';
            var body = messageInput.value.trim();
            if (!body) return;
            overlay.classList.remove('active');
            launchEchoParticle(submitBtn, function() { addEcho(author, body); });
            authorInput.value = ''; messageInput.value = ''; countEl.textContent = '0';
        });
        var track = document.getElementById('echoes-track');
        if (track) {
            track.addEventListener('mouseenter', function() { track.classList.add('paused'); });
            track.addEventListener('mouseleave', function() { track.classList.remove('paused'); });
        }
    }

    function initEchoes() {
        loadEchoes(); renderEchoStream(); initEchoModal();
        var launchBtn = document.getElementById('echo-launch-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', function() {
                document.getElementById('echo-modal-overlay').classList.add('active');
            });
        }
        var style = document.createElement('style');
        style.textContent = '@keyframes capsuleAppear{0%{opacity:0;transform:translate3d(0,20px,0) scale(0.8)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}}';
        document.head.appendChild(style);
    }

    // ============ 灯箱 ============
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    document.getElementById('lightbox-close').addEventListener('click', function() { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    document.getElementById('lightbox-bg').addEventListener('click', function() { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; } });

    // ============ 初始设定 ============
    document.getElementById('title-name').textContent = GF_NAME;
    document.getElementById('name-label').textContent = GF_NAME;
})();