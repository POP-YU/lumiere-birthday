(function() {
    'use strict';
    var GF_NAME = '花花';
    var SINCE_DATE = new Date('2026-01-11T00:00:00');
    window.TOTAL_REAL_PHOTOS = 11;

    // ═══ 心声发射 · Webhook 对接配置 ═══
    // 在这里填入你的推送通道地址（PushPlus / ServerChan / Formspree 均可）。
    // 留空时不会真正发送，只 console.log 并模拟成功，方便先预览效果。
    // 示例：
    //   PushPlus   https://www.pushplus.plus/send          (payload 需加 token 字段)
    //   ServerChan https://sctapi.ftqq.com/<SENDKEY>.send  (payload 字段为 title + desp)
    var WEBHOOK_URL = 'https://enoa6f6r4m58l.x.pipedream.net/'; // 测试用 RequestBin，之后可替换为正式通道

    // ============ 星空粒子系统 (超轻量优化) ============
    var canvas = document.getElementById('starfield-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [], mouse = { x: -1000, y: -1000 }, animationId;
    var isMobile = window.innerWidth < 768;
    var starFrameSkip = 0, starFrameInterval = isMobile ? 3 : 2;

    function resizeCanvas() {
        // 适配 Retina/高分屏：按 devicePixelRatio 缩放画布物理像素
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles();
    }
    function initParticles() {
        var w = window.innerWidth, h = window.innerHeight;
        var area = w * h;
        var density = isMobile ? 0.000018 : 0.000045;
        var count = Math.floor(area * density);
        count = Math.min(count, isMobile ? 60 : 140);
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 1.6 + 0.3,
                baseX: 0, baseY: 0,
                speed: Math.random() * 0.02 + 0.005,
                opacity: Math.random() * 0.6 + 0.3,
                twinkle: Math.random() < 0.12,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.015 + 0.004
            });
        }
        for (var j = 0; j < particles.length; j++) {
            particles[j].baseX = particles[j].x;
            particles[j].baseY = particles[j].y;
        }
    }
    function drawStars() {
        starFrameSkip++;
        if (starFrameSkip % starFrameInterval !== 0) { animationId = requestAnimationFrame(drawStars); return; }
        var w = window.innerWidth, h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);
        var mx = mouse.x, my = mouse.y;
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var dx = mx - p.x, dy = my - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                var force = (1 - dist / 120) * 0.4;
                p.x += dx * force * 0.01;
                p.y += dy * force * 0.01;
            }
            p.x += (p.baseX - p.x) * 0.01;
            p.y += (p.baseY - p.y) * 0.01;
            p.baseX += p.speed * 0.1;
            if (p.baseX > w + 20) p.baseX = -20;
            if (p.baseX < -20) p.baseX = w + 20;
            var alpha = p.opacity;
            if (p.twinkle) {
                p.twinklePhase += p.twinkleSpeed;
                alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.twinklePhase));
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,175,135,' + alpha + ')';
            ctx.fill();
            if (p.size > 1.2 && p.twinkle) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212,175,135,' + (alpha * 0.08) + ')';
                ctx.fill();
            }
        }
        animationId = requestAnimationFrame(drawStars);
    }
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
        starFrameInterval = isMobile ? 3 : 2;
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
        if (!loader._finished) finishLoading();
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
                var mc = document.getElementById('music-capsule');
                if (mc) mc.classList.add('visible');
                initChronograph();
                init3DPlanets();
                initGallery();
                initEchoes();
                initSfx();
                initLerpScroll();
                initPortal();
                // 音乐系统 — 最重要，立即启动（用户手势内，可绕过自动播放限制）
                try { initMusicSystem(); startBGM(); } catch(err) { console.warn('[LUMIÈRE] Music init:', err); }
            }, 600);
        }, { once: true });
    }

    // ╔══════════════════════════════════════════╗
    // ║    🎵 星河旋律 · 浪漫音乐引擎   🎵      ║
    // ║    A大调五声音阶 · 85BPM · 自动演奏   ║
    // ╚══════════════════════════════════════════╝
    var musicCtx = null;
    var musicMasterGain = null;
    var musicReverb = null;
    var musicDryGain = null;
    var musicActiveOscillators = [];
    var musicTimers = [];
    var musicStarted = false;
    var musicMuted = false;

    // A major pentatonic across 3 octaves (Hz)
    var PENTA = {
        low:  [110.00, 123.47, 138.59, 164.81, 185.00],
        mid:  [220.00, 246.94, 277.18, 329.63, 369.99],
        high: [440.00, 493.88, 554.37, 659.25, 739.99],
        top:  [880.00, 987.77, 1108.73, 1318.51, 1479.98]
    };
    // Chord progression: Amaj7 → F#m7 → Dmaj7 → E7 (using pentatonic-available tones)
    // We'll use root-fifth dyads for the pad
    var CHORD_ROOTS = [PENTA.low[0], PENTA.low[3], PENTA.low[2], PENTA.low[4]]; // A F# D E
    var CHORD_THIRDS = [PENTA.mid[2], PENTA.mid[0], PENTA.mid[3], PENTA.mid[1]]; // C# A F# G#
    var CHORD_DURATION = 8000; // 8 seconds per chord

    // ── 旋律序列 (pentatonic index, octave ref, duration ms) ──
    var MELODY = [
        [2,'mid',600],[3,'mid',300],[4,'mid',400],[2,'mid',300],[0,'mid',800],  // C# E F# C# A
        [1,'mid',400],[2,'mid',300],[3,'mid',600],[1,'mid',400],[0,'mid',500],  // B C# E B A
        [2,'mid',300],[3,'mid',300],[4,'mid',300],[3,'mid',300],[2,'mid',500],[1,'mid',300],[0,'mid',700], // C# E F# E C# B A
        [2,'high',500],[0,'high',300],[4,'mid',600],[3,'mid',300],[2,'mid',300],[1,'mid',300],[0,'mid',900], // C# A F# E C# B A
        [0,'low',400],[2,'low',300],[3,'low',500],[1,'low',400],[0,'low',900],  // A C# E B A (bass melody)
        [1,'mid',600],[2,'mid',400],[3,'mid',700],[2,'mid',400],[0,'mid',300],[1,'mid',300],[2,'mid',1100], // B C# E C# A B C#
        [3,'mid',400],[4,'mid',300],[0,'high',500],[4,'mid',300],[3,'mid',300],[2,'mid',300],[1,'mid',400],[0,'mid',1200] // E F# A F# E C# B A
    ];
    var melodyIdx = 0;
    var chordStep = 0;

    function initMusicCtx() {
        if (musicCtx) return musicCtx;
        try {
            musicCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) { return null; }
        if (!musicCtx) return null;

        musicMasterGain = musicCtx.createGain();
        musicMasterGain.gain.value = 0;

        // 混响
        var convolver = musicCtx.createConvolver();
        var reverbIR = createReverbIR(musicCtx);
        convolver.buffer = reverbIR;

        var reverbGain = musicCtx.createGain();
        reverbGain.gain.value = 0.45;
        musicMasterGain.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(musicCtx.destination);

        // 干声
        musicDryGain = musicCtx.createGain();
        musicDryGain.gain.value = 0.55;
        musicMasterGain.connect(musicDryGain);
        musicDryGain.connect(musicCtx.destination);

        return musicCtx;
    }

    function createReverbIR(ctx) {
        var len = ctx.sampleRate * 2.5;
        var buf = ctx.createBuffer(2, len, ctx.sampleRate);
        for (var ch = 0; ch < 2; ch++) {
            var data = buf.getChannelData(ch);
            for (var i = 0; i < len; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
            }
        }
        return buf;
    }

    // 创建温暖的单音 (带轻微失谐叠加)
    function createWarmVoice(freq, type, gainVal, filterFreq, filterQ) {
        var ctx = musicCtx;
        type = type || 'sawtooth';
        // 主振荡器 + 失谐副振荡器
        var osc1 = ctx.createOscillator(); osc1.type = type; osc1.frequency.value = freq;
        var osc2 = ctx.createOscillator(); osc2.type = type; osc2.frequency.value = freq * 1.003;
        var osc3 = ctx.createOscillator(); osc3.type = 'sine'; osc3.frequency.value = freq * 0.5;

        var voiceGain = ctx.createGain(); voiceGain.gain.value = 0;
        var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = filterFreq || 1800; filter.Q.value = filterQ || 0.5;

        // 慢速滤波器 LFO 调制
        var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08 + Math.random() * 0.12;
        var lfoGain = ctx.createGain(); lfoGain.gain.value = filterFreq ? filterFreq * 0.4 : 600;
        lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
        lfo.start();

        osc1.connect(filter); osc2.connect(filter); osc3.connect(filter);
        filter.connect(voiceGain);
        voiceGain.connect(musicMasterGain);

        osc1.start(); osc2.start(); osc3.start();

        voiceGain.gain.setValueAtTime(0, ctx.currentTime);
        voiceGain.gain.linearRampToValueAtTime(gainVal || 0.06, ctx.currentTime + 0.8);

        musicActiveOscillators.push(osc1, osc2, osc3, lfo);
        return { gain: voiceGain, osc: [osc1, osc2, osc3], lfo: lfo, filter: filter };
    }

    // 播放一个音符
    function playNote(freq, duration, vol, type, attack) {
        var ctx = musicCtx;
        var t = ctx.currentTime;
        vol = vol || 0.07;
        attack = attack || 0.03;

        var osc = ctx.createOscillator(); osc.type = type || 'sine'; osc.frequency.value = freq;
        var gain = ctx.createGain(); gain.gain.setValueAtTime(0, t);
        var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 2500; filter.Q.value = 0.6;

        gain.gain.linearRampToValueAtTime(vol, t + attack);
        gain.gain.setValueAtTime(vol, t + duration * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(filter); filter.connect(gain);
        gain.connect(musicMasterGain);
        osc.start(t); osc.stop(t + duration + 0.05);
        musicActiveOscillators.push(osc);
    }

    // 播放和弦铺垫
    function playChordPad(root, third, duration) {
        var voices = [];
        // 根音八度叠层
        voices.push(createWarmVoice(root, 'sawtooth', 0.04, 400, 0.4));
        voices.push(createWarmVoice(root * 2, 'triangle', 0.03, 600, 0.3));
        // 三音
        voices.push(createWarmVoice(third, 'sawtooth', 0.035, 500, 0.4));
        voices.push(createWarmVoice(third * 2, 'triangle', 0.025, 700, 0.3));
        // 五音 (高八度)
        voices.push(createWarmVoice(root * 3, 'sine', 0.02, 1000, 0.3));

        // duration 后淡出
        var ctx = musicCtx;
        var t = ctx.currentTime;
        setTimeout(function() {
            voices.forEach(function(v) {
                try { v.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2); } catch(e) {}
            });
        }, duration - 2000);

        // 清理
        setTimeout(function() {
            voices.forEach(function(v) {
                try { v.osc.forEach(function(o) { o.stop(); }); v.lfo.stop(); } catch(e) {}
            });
            // 从活跃列表移除
            voices.forEach(function(v) {
                v.osc.forEach(function(o) {
                    var idx = musicActiveOscillators.indexOf(o);
                    if (idx >= 0) musicActiveOscillators.splice(idx, 1);
                });
                var idx2 = musicActiveOscillators.indexOf(v.lfo);
                if (idx2 >= 0) musicActiveOscillators.splice(idx2, 1);
            });
        }, duration + 2000);

        return voices;
    }

    // 旋律循环
    function playMelodyStep() {
        if (!musicPlaying || musicMuted) {
            melodyIdx = (melodyIdx + 1) % MELODY.length;
            musicTimers.push(setTimeout(playMelodyStep, 200));
            return;
        }

        var note = MELODY[melodyIdx];
        var freq = PENTA[note[1]][note[0]];
        var dur = note[2];
        var vol = (note[1] === 'high' || note[1] === 'top') ? 0.045 : (note[1] === 'low' ? 0.06 : 0.055);

        // 主旋律音 + 轻柔的八度和声
        playNote(freq, dur / 1000, vol, 'sine', 0.02);
        if (note[1] !== 'low') {
            playNote(freq * 2, dur / 1000, vol * 0.3, 'triangle', 0.04);
        }

        // 偶尔添加泛音闪烁
        if (Math.random() < 0.25) {
            playNote(freq * 3, dur / 1000 * 0.4, vol * 0.15, 'sine', 0.08);
        }

        melodyIdx = (melodyIdx + 1) % MELODY.length;
        musicTimers.push(setTimeout(playMelodyStep, dur + 50));
    }

    // 和弦进行循环
    var currentPadVoices = [];
    function playChordCycle() {
        if (!musicPlaying || musicMuted) {
            chordStep = (chordStep + 1) % CHORD_ROOTS.length;
            musicTimers.push(setTimeout(playChordCycle, CHORD_DURATION));
            return;
        }

        // 清理旧铺垫
        var ctx = musicCtx;
        currentPadVoices.forEach(function(v) {
            try { v.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.5); } catch(e) {}
        });
        setTimeout(function() {
            currentPadVoices.forEach(function(v) {
                try { v.osc.forEach(function(o) { o.stop(); }); v.lfo.stop(); } catch(e) {}
            });
            currentPadVoices = [];
        }, 1800);

        var root = CHORD_ROOTS[chordStep];
        var third = CHORD_THIRDS[chordStep];
        currentPadVoices = playChordPad(root, third, CHORD_DURATION);

        chordStep = (chordStep + 1) % CHORD_ROOTS.length;
        musicTimers.push(setTimeout(playChordCycle, CHORD_DURATION));
    }

    // 低音线
    function playBassLine() {
        if (!musicPlaying || musicMuted) {
            musicTimers.push(setTimeout(playBassLine, 4000));
            return;
        }

        var root = CHORD_ROOTS[chordStep];
        var ctx = musicCtx;

        // Walking bass pattern
        var bassPattern = [
            [root, 800], [root, 400], [root * 1.5, 400], [root, 400],
            [root * 0.75, 600], [root, 400], [root * 1.5, 500], [root * 1.33, 500]
        ];

        var t = ctx.currentTime;
        var accum = 0;
        bassPattern.forEach(function(step) {
            var freq = step[0], dur = step[1] / 1000;
            var osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = freq;
            var gain = ctx.createGain();
            var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 350;
            gain.gain.setValueAtTime(0, t + accum);
            gain.gain.linearRampToValueAtTime(0.06, t + accum + 0.02);
            gain.gain.setValueAtTime(0.06, t + accum + dur * 0.6);
            gain.gain.exponentialRampToValueAtTime(0.001, t + accum + dur);
            osc.connect(filter); filter.connect(gain); gain.connect(musicMasterGain);
            osc.start(t + accum); osc.stop(t + accum + dur + 0.05);
            musicActiveOscillators.push(osc);
            accum += dur;
        });

        musicTimers.push(setTimeout(playBassLine, 4000));
    }

    // 星光闪烁 (高频点缀)
    function playStardust() {
        if (!musicPlaying || musicMuted) {
            musicTimers.push(setTimeout(playStardust, 1500 + Math.random() * 2000));
            return;
        }
        var idx = Math.floor(Math.random() * PENTA.top.length);
        var freq = PENTA.top[idx];
        playNote(freq, 0.8 + Math.random() * 1.5, 0.012 + Math.random() * 0.02, 'sine', 0.06);
        musicTimers.push(setTimeout(playStardust, 1500 + Math.random() * 3000));
    }

    // ═══ 统一的 BGM 播放器 ═══
    // 策略：优先播放 <audio> 黑胶音源(music/music.mp3)，
    // 若音源缺失/加载失败则无缝回退到 WebAudio 星河旋律引擎。
    var bgmAudio = null;
    var audioFailed = false;
    var audioAttempted = false;
    var audioPlaying = false;
    var engineActive = false;

    function setVinylPlaying(on) {
        var btn = document.getElementById('music-btn');
        if (btn) {
            btn.classList.toggle('playing', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
    }

    function setBGMVisuals(on) {
        setVinylPlaying(on);
        var tip = document.getElementById('music-tooltip');
        if (!tip) return;
        if (!on) { tip.textContent = 'PAUSED'; tip.classList.add('paused'); }
        else if (audioFailed) { tip.textContent = 'STARLIGHT SYMPHONY'; tip.classList.remove('paused'); }
        else { tip.textContent = 'COSMIC WAVES'; tip.classList.remove('paused'); }
    }

    function resumeEngine() {
        if (!musicCtx) return;
        musicMuted = false;
        musicMasterGain.gain.linearRampToValueAtTime(0.75, musicCtx.currentTime + 0.8);
        musicTimers.push(setTimeout(playMelodyStep, 200));
        musicTimers.push(setTimeout(playChordCycle, 100));
        musicTimers.push(setTimeout(playBassLine, 200));
        musicTimers.push(setTimeout(playStardust, 200));
        engineActive = true;
        setBGMVisuals(true);
    }

    function initEngineOnce() {
        if (musicStarted) return;
        musicStarted = true;
        var c = initMusicCtx();
        if (!c) { setBGMVisuals(false); return; }
        if (c.state === 'suspended') { try { c.resume(); } catch(e) {} }
        musicMasterGain.gain.setValueAtTime(0, c.currentTime);
        musicMasterGain.gain.linearRampToValueAtTime(0.75, c.currentTime + 2);
        chordStep = 0; melodyIdx = 0;
        musicTimers.push(setTimeout(playMelodyStep, 600));
        musicTimers.push(setTimeout(playChordCycle, 300));
        musicTimers.push(setTimeout(playBassLine, 900));
        musicTimers.push(setTimeout(playStardust, 2000));
        engineActive = true;
        setBGMVisuals(true);
    }

    function startEngine() {
        if (!musicCtx) return;
        if (!musicStarted) { initEngineOnce(); return; }
        if (engineActive) { musicMuted = false; return; }
        // 暂停后恢复：重新拉起所有循环
        resumeEngine();
    }

    // 播放 <audio> 黑胶音源（含微信 JSBridge 场景统一入口）
    function playAudioSource() {
        if (!bgmAudio) return false;
        var playPromise = bgmAudio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(function() {
                audioFailed = false;
                setBGMVisuals(true);
            }).catch(function() {
                // 音源缺失/格式不支持/被拦截 → 标记失败，让 startBGM 走引擎回退
                audioFailed = true;
                if (musicPlaying) {
                    startEngine();
                } else {
                    // 门内触发以外的失败（如微信自动播放被拦）：重置状态，等用户手势重试
                    audioPlaying = false;
                    setBGMVisuals(false);
                }
            });
        } else {
            setBGMVisuals(true);
        }
        return true;
    }

    // 极简 BGM Toast：淡入 → 上浮 → 淡出 → 4s 后销毁
    function showBgmToast() {
        var existing = document.querySelector('.bgm-toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'bgm-toast';
        toast.textContent = '🎵 正在接收专属星河频段…';
        document.body.appendChild(toast);
        // 强制回流以触发入场动画
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 700);
        }, 4000);
    }

    // 初始化音频播放（由"开启宇宙"按钮在用户手势内触发，绕过自动播放限制）
    function startBGM() {
        showBgmToast();
        var c = initMusicCtx();
        if (c && c.state === 'suspended') { try { c.resume(); } catch(e) {} }
        // 已有可用音源 → 恢复播放（绝不重复启动引擎造成双声）
        if (bgmAudio && !audioFailed && audioAttempted) {
            playAudioSource();
            return;
        }
        if (bgmAudio && !audioFailed && !audioAttempted) {
            audioAttempted = true;
            playAudioSource();
            return;
        }
        // 无 <audio> 或已标记失败 → 直接走引擎
        startEngine();
    }

    function pauseBGM() {
        if (bgmAudio && !audioFailed) {
            try { bgmAudio.pause(); } catch(e) {}
        } else if (musicCtx) {
            // 引擎淡出并挂起所有循环
            musicMuted = true;
            musicMasterGain.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 1.2);
            musicTimers.forEach(function(t) { clearTimeout(t); });
            musicTimers = [];
            var t = musicCtx.currentTime;
            musicActiveOscillators.forEach(function(o) { try { o.stop(t + 0.1); } catch(e) {} });
            musicActiveOscillators = [];
            currentPadVoices = [];
            engineActive = false;
        }
    }

    function initMusicSystem() {
        bgmAudio = document.getElementById('bgm-audio');
        var musicBtn = document.getElementById('music-btn');
        if (!musicBtn) return;

        // 移除旧监听器（避免重复绑定）
        var newBtn = musicBtn.cloneNode(true);
        musicBtn.parentNode.replaceChild(newBtn, musicBtn);
        musicBtn = newBtn;

        musicBtn.addEventListener('click', function() {
            if (!audioPlaying) {
                audioPlaying = true;
                startBGM();
            } else {
                audioPlaying = false;
                setBGMVisuals(false);
                pauseBGM();
            }
        });
    }

    // ═══ 微信 JSBridge 自动播放（朋友圈 / 微信内置浏览器专用）═══
    // 微信在页面加载时即触发 WeixinJSBridgeReady，此刻立即拉起 BGM 的 <audio>，
    // 让音乐在用户触摸"开启宇宙"之前就开始。musicPlaying 保持 false，
    // 门按钮点击仍正常放行；音乐状态由独立的 audioPlaying 管理。
    // 注意：仅在微信内置浏览器(UA 含 MicroMessenger)内尝试，避免污染普通浏览器状态。
    var isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    var wechatAudioTried = false;
    function tryWeChatAutoplay() {
        if (wechatAudioTried || !isWeChat) return;
        wechatAudioTried = true;
        bgmAudio = document.getElementById('bgm-audio');
        if (!bgmAudio) return;
        audioPlaying = true;
        audioAttempted = true;
        playAudioSource();
    }
    if (isWeChat) {
        if (typeof window.WeixinJSBridge !== 'undefined') {
            tryWeChatAutoplay();
        } else {
            document.addEventListener('WeixinJSBridgeReady', tryWeChatAutoplay, false);
            // 兜底：微信 JSBridge 就绪事件偶发丢失，再加一次 onload 重试
            window.addEventListener('load', function() {
                setTimeout(tryWeChatAutoplay, 1200);
            }, false);
        }
    }

    // ============ UI 交互音效 ============
    function initSfx() {
        function playSfx(freq, type, dur, vol) {
            try {
                if (!musicCtx) return;
                if (musicCtx.state === 'suspended') musicCtx.resume();
                var o = musicCtx.createOscillator(); var g = musicCtx.createGain();
                o.type = type || 'sine'; o.frequency.setValueAtTime(freq, musicCtx.currentTime);
                g.gain.setValueAtTime(vol || 0.06, musicCtx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, musicCtx.currentTime + (dur || 0.25));
                o.connect(g); g.connect(musicCtx.destination);
                o.start(); o.stop(musicCtx.currentTime + dur + 0.1);
            } catch(e) {}
        }
        document.querySelectorAll('.constellation-item, .echo-capsule, .gate-btn, .echo-launch-btn').forEach(function(el) {
            el.addEventListener('mouseenter', function() { playSfx(300 + Math.random()*200, 'sine', 0.2, 0.03); });
        });
        document.querySelectorAll('button').forEach(function(el) {
            el.addEventListener('click', function() { playSfx(800, 'sine', 0.12, 0.05); });
        });
    }

    // ============ 3D 行星渲染 (大幅降频优化) ============
    var planetLeftCanvas, planetRightCanvas;
    var planetLeftCtx, planetRightCtx;
    var planetRotation = 0;
    var planetMouseX = 0, planetMouseY = 0;
    var planetTargetMX = 0, planetTargetMY = 0;
    var planetRenderSkip = 0;
    var planetCachedTextures = {};
    // 降频：desktop每4帧渲染一次，mobile每7帧
    var planetRenderInterval = isMobile ? 7 : 4;

    function createProceduralTexture(isLeft) {
        var cacheKey = isLeft ? 'left' : 'right';
        if (planetCachedTextures[cacheKey]) return planetCachedTextures[cacheKey];
        var w = 256, h = 128;
        var off = document.createElement('canvas');
        off.width = w; off.height = h;
        var cx = off.getContext('2d');
        var baseGrad = cx.createLinearGradient(0, 0, w, h);
        baseGrad.addColorStop(0, 'hsl(35, 40%, ' + (isLeft ? '35%' : '40%') + ')');
        baseGrad.addColorStop(0.3, 'hsl(45, 50%, ' + (isLeft ? '45%' : '50%') + ')');
        baseGrad.addColorStop(0.5, 'hsl(55, 60%, ' + (isLeft ? '50%' : '55%') + ')');
        baseGrad.addColorStop(0.7, 'hsl(30, 45%, ' + (isLeft ? '40%' : '45%') + ')');
        baseGrad.addColorStop(1, 'hsl(25, 35%, ' + (isLeft ? '28%' : '32%') + ')');
        cx.fillStyle = baseGrad; cx.fillRect(0, 0, w, h);
        for (var y = 0; y < h; y += 2) {
            var noise = Math.sin(y * 0.06) * 0.25 + Math.sin(y * 0.15 + 2) * 0.12 + Math.sin(y * 0.04 + 5) * 0.18;
            cx.fillStyle = 'rgba(' + (isLeft ? '180,140,100' : '212,175,135') + ',' + (0.06 + noise * 0.25) + ')';
            cx.fillRect(0, y, w, 2);
        }
        for (var i = 0; i < 25; i++) {
            var cxx = Math.random() * w, cyy = Math.random() * h;
            var r = Math.random() * 10 + 2;
            var grad = cx.createRadialGradient(cxx, cyy, r * 0.2, cxx, cyy, r);
            grad.addColorStop(0, 'rgba(0,0,0,' + (Math.random() * 0.25 + 0.08) + ')');
            grad.addColorStop(0.6, 'rgba(0,0,0,' + (Math.random() * 0.1) + ')');
            grad.addColorStop(1, 'rgba(255,255,255,' + (Math.random() * 0.04) + ')');
            cx.fillStyle = grad; cx.beginPath(); cx.arc(cxx, cyy, r, 0, Math.PI * 2); cx.fill();
        }
        planetCachedTextures[cacheKey] = off;
        return off;
    }

    function render3DPlanet(ctx, size, texture, rotationAngle, lightAngle) {
        var r = size / 2, cx = r, cy = r;
        var tw = texture.width, th = texture.height;
        var texCtx = texture.getContext('2d');
        var imgData = texCtx.getImageData(0, 0, tw, th);
        var pixels = imgData.data;
        ctx.clearRect(0, 0, size, size);
        var step = 3;

        for (var y = -r; y < r; y += step) {
            var yNorm = y / r;
            if (Math.abs(yNorm) > 0.97) continue;
            var sliceWidth = Math.sqrt(Math.max(0, r * r - y * y));
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
                var rim = Math.pow(1 - Math.abs(z / r), 3) * 0.2;
                var rVal = Math.min(255, pr * diffuse + specular * 255 + rim * 255);
                var gVal = Math.min(255, pg * diffuse + specular * 220 + rim * 220);
                var bVal = Math.min(255, pb * diffuse + specular * 180 + rim * 180);
                ctx.fillStyle = 'rgb(' + Math.floor(rVal) + ',' + Math.floor(gVal) + ',' + Math.floor(bVal) + ')';
                ctx.fillRect(cx + x, cy + y, step, step);
            }
        }
        var glowGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.15);
        glowGrad.addColorStop(0, 'rgba(212,175,135,0)');
        glowGrad.addColorStop(0.5, 'rgba(212,175,135,0.05)');
        glowGrad.addColorStop(1, 'rgba(212,175,135,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); ctx.fill();
    }

    function init3DPlanets() {
        var leftPlanet = document.getElementById('planet-left');
        var rightPlanet = document.getElementById('planet-right');
        if (!leftPlanet || !rightPlanet) return;

        var planetSize = isMobile ? 90 : 120;
        var canvasSize = planetSize * 2;

        // 只清除旧的 3D 表面 canvas，保留头像 <img>（avatar-planet 模式）
        var existingLeft = leftPlanet.querySelector('canvas'); if (existingLeft) existingLeft.remove();
        var existingRight = rightPlanet.querySelector('canvas'); if (existingRight) existingRight.remove();

        planetLeftCanvas = document.createElement('canvas');
        planetLeftCanvas.width = canvasSize; planetLeftCanvas.height = canvasSize;
        planetLeftCanvas.style.cssText = 'width:100%;height:100%;border-radius:50%;display:block';
        planetLeftCtx = planetLeftCanvas.getContext('2d');

        planetRightCanvas = document.createElement('canvas');
        planetRightCanvas.width = canvasSize; planetRightCanvas.height = canvasSize;
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
            // 大幅降频：仅在需要时渲染
            if (planetRenderSkip % planetRenderInterval !== 0) { requestAnimationFrame(animatePlanets); return; }

            planetMouseX += (planetTargetMX - planetMouseX) * 0.04;
            planetMouseY += (planetTargetMY - planetMouseY) * 0.04;
            planetRotation += 0.004 * planetRenderInterval;

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
            if (leftW) leftW.style.transform = 'translate3d(' + (planetMouseX * 10) + 'px, ' + (planetMouseY * 6) + 'px, 0)';
            if (rightW) rightW.style.transform = 'translate3d(' + (-planetMouseX * 10) + 'px, ' + (planetMouseY * 6) + 'px, 0)';

            requestAnimationFrame(animatePlanets);
        }
        animatePlanets();
    }

    // ============ 时光罗盘 ============
    // 老虎机滚动数字：value 变化时，旧数字向上卷出、新数字卷入
    function setChrono(id, v) {
        var el = document.getElementById(id);
        if (!el) return;
        var val = String(v).padStart(2, '0');
        var last = el.getAttribute('data-last');
        if (last === val) return;
        el.setAttribute('data-last', val);
        // 首次渲染：直接填入，无动画
        if (last === null) { el.textContent = val; return; }

        // 构建双面板滚动结构
        var wrap = document.createElement('span');
        wrap.className = 'chrono-roll';
        var out = document.createElement('span'); out.className = 'chrono-roll-out'; out.textContent = last;
        var inr = document.createElement('span'); inr.className = 'chrono-roll-in'; inr.textContent = val;
        wrap.appendChild(out); wrap.appendChild(inr);
        el.textContent = '';
        el.appendChild(wrap);
        // 触发动画后清理，让下一轮从干净状态开始
        setTimeout(function() {
            if (el.getAttribute('data-last') !== val) return; // 已被新值覆盖
            el.textContent = val;
        }, 520);
    }

    function updateChrono() {
        var now = new Date();
        var years = now.getFullYear() - SINCE_DATE.getFullYear();
        var months = now.getMonth() - SINCE_DATE.getMonth();
        var days = now.getDate() - SINCE_DATE.getDate();
        var hours = now.getHours() - SINCE_DATE.getHours();
        var minutes = now.getMinutes() - SINCE_DATE.getMinutes();
        var seconds = now.getSeconds() - SINCE_DATE.getSeconds();

        // 借位处理：秒 → 分 → 时 → 日 → 月 → 年 逐级补齐
        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            // new Date(y, m, 0).getDate() 即"本月第0天"= 上月最后一天，
            // 自动正确处理闰年2月(28/29)与大小月(30/31)
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            months--;
        }
        if (months < 0) { months += 12; years--; }

        years = Math.max(0, years); months = Math.max(0, months); days = Math.max(0, days);
        hours = Math.max(0, hours); minutes = Math.max(0, minutes); seconds = Math.max(0, seconds);

        setChrono('c-years', years); setChrono('c-months', months); setChrono('c-days', days);
        setChrono('c-hours', hours); setChrono('c-minutes', minutes); setChrono('c-seconds', seconds);
        var sinceEl = document.getElementById('chrono-since');
        if (sinceEl) sinceEl.textContent = 'Since ' + SINCE_DATE.getFullYear() + '.' + String(SINCE_DATE.getMonth()+1).padStart(2,'0') + '.' + String(SINCE_DATE.getDate()).padStart(2,'0');
    }
    function initChronograph() {
        updateChrono();
        setInterval(updateChrono, 1000);
    }

    // ============ 相册数据 ============
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
        div.className = 'constellation-item';
        div.setAttribute('data-index', index);

        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Memory ' + index;
        img.loading = 'lazy';
        img.draggable = false;
        div.appendChild(img);

        var frame = document.createElement('div');
        frame.className = 'const-frame';
        frame.textContent = '#' + String(index).padStart(2, '0') + ' · CONSTELLATION';
        div.appendChild(frame);

        div.addEventListener('click', function(e) {
            e.stopPropagation();
            openPortal(src, index);
        });
        return div;
    }

    // ═══════ 惯性拖拽星象图引擎 (Inertia-Draggable Constellation) ═══════
    var constellation = {
        viewport: null, canvas: null, items: [],
        dragX: 0, dragY: 0,          // 当前偏移
        targetX: 0, targetY: 0,      // 目标偏移（含惯性速度）
        velX: 0, velY: 0,            // 惯性速度
        dragging: false, pointerId: null,
        lastX: 0, lastY: 0,          // 上一帧指针位置
        bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
        mouse: { x: -9999, y: -9999 }, // 视口内光标，用于磁性吸附
        raf: 0
    };

    function initConstellation() {
        constellation.viewport = document.getElementById('gallery-viewport');
        constellation.canvas = document.getElementById('constellation-canvas');
        if (!constellation.viewport || !constellation.canvas) return;

        constellation.items = [];
        var grid = constellation.canvas;
        grid.innerHTML = '';

        var totalPhotos = window.TOTAL_REAL_PHOTOS || 11;
        var loaded = 0;
        for (var i = 1; i <= totalPhotos; i++) {
            (function(idx) {
                var src = 'images/' + idx + '.jpg';
                loadImage(src).then(function() {
                    galleryPhotos.push({ src: src, index: idx });
                    loaded++;
                    if (loaded === totalPhotos) renderConstellation();
                }).catch(function() {
                    var dataUrl = generateCosmicArt(idx);
                    galleryPhotos.push({ src: dataUrl, index: idx, isGenerated: true });
                    loaded++;
                    if (loaded === totalPhotos) renderConstellation();
                });
            })(i);
        }

        function renderConstellation() {
            galleryPhotos.sort(function(a, b) { return a.index - b.index; });
            var W = constellation.canvas.clientWidth || 3000;
            var H = constellation.canvas.clientHeight || 2000;
            var padX = W * 0.1, padY = H * 0.1;
            // 用伪随机网格散布照片，避免重叠，又不显呆板
            var cols = 4, rows = 3;
            var cellW = (W - padX * 2) / cols, cellH = (H - padY * 2) / rows;
            galleryPhotos.forEach(function(photo, k) {
                var item = createGalleryItem(photo.src, photo.index);
                var col = k % cols, row = Math.floor(k / cols);
                var jx = (col + 0.5) * cellW + padX + (Math.sin(k * 12.9898) * 0.5) * cellW * 0.35;
                var jy = (row + 0.5) * cellH + padY + (Math.cos(k * 78.233) * 0.5) * cellH * 0.35;
                // 尺寸微变化
                var scaleV = 0.8 + ((k * 37) % 5) * 0.09;
                item.style.left = jx + 'px';
                item.style.top = jy + 'px';
                item.style.transform = 'translate3d(0,0,0) scale(' + scaleV.toFixed(2) + ')';
                item._scale = scaleV;
                item._jx = jx; item._jy = jy;
                grid.appendChild(item);
                constellation.items.push(item);
            });
            // 布局完成后再算边界与居中（clientWidth 此时才可靠）
            computeBounds();
            centerConstellation();
            bindConstellationEvents();
            requestAnimationFrame(constellationLoop);
        }
    }

    function computeBounds() {
        var vpW = constellation.viewport.clientWidth, vpH = constellation.viewport.clientHeight;
        var cW = constellation.canvas.clientWidth, cH = constellation.canvas.clientHeight;
        // 有效偏移范围：[-range, 0]，居中 = -range/2
        constellation.bounds.minX = -(cW - vpW);
        constellation.bounds.maxX = 0;
        constellation.bounds.minY = -(cH - vpH);
        constellation.bounds.maxY = 0;
        constellation.bounds.init = cW > 0 && cH > 0;
    }

    function centerConstellation() {
        constellation.dragX = (constellation.bounds.minX + constellation.bounds.maxX) / 2;
        constellation.dragY = (constellation.bounds.minY + constellation.bounds.maxY) / 2;
        constellation.targetX = constellation.dragX;
        constellation.targetY = constellation.dragY;
        constellation.velX = 0; constellation.velY = 0;
    }

    function bindConstellationEvents() {
        var vp = constellation.viewport;

        function pointerStart(x, y, pid) {
            constellation.dragging = true;
            constellation.pointerId = pid;
            constellation.lastX = x; constellation.lastY = y;
            constellation.velX = 0; constellation.velY = 0;
            vp.classList.add('dragging');
            if (vp.setPointerCapture) { try { vp.setPointerCapture(pid); } catch(e) {} }
        }
        function pointerMove(x, y) {
            if (!constellation.dragging) {
                // 悬停跟踪由 viewport 的 mousemove 处理器负责（viewport 相对坐标）
                // 此处 window 级处理器不再写 mouse，避免与 viewport 坐标系混用
                return;
            }
            var dx = x - constellation.lastX, dy = y - constellation.lastY;
            constellation.lastX = x; constellation.lastY = y;
            // 目标位置随拖动移动；用帧时间归一化速度
            constellation.targetX += dx;
            constellation.targetY += dy;
            constellation.velX = dx; constellation.velY = dy;
        }
        function pointerEnd() {
            if (!constellation.dragging) return;
            constellation.dragging = false;
            constellation.pointerId = null;
            vp.classList.remove('dragging');
        }

        // Mouse
        vp.addEventListener('mousedown', function(e) {
            e.preventDefault();
            pointerStart(e.clientX, e.clientY, 'm');
        });
        window.addEventListener('mousemove', function(e) {
            pointerMove(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', pointerEnd);

        // Touch
        vp.addEventListener('touchstart', function(e) {
            e.preventDefault();
            var t = e.touches[0];
            pointerStart(t.clientX, t.clientY, t.identifier);
        }, { passive: false });
        vp.addEventListener('touchmove', function(e) {
            e.preventDefault();
            var t = e.touches[0];
            pointerMove(t.clientX, t.clientY);
        }, { passive: false });
        vp.addEventListener('touchend', pointerEnd);
        vp.addEventListener('touchcancel', pointerEnd);

        // 视口内光标位置（磁性吸附基准）
        vp.addEventListener('mousemove', function(e) {
            var r = vp.getBoundingClientRect();
            constellation.mouse.x = e.clientX - r.left;
            constellation.mouse.y = e.clientY - r.top;
        });
        vp.addEventListener('mouseleave', function() {
            constellation.mouse.x = -9999; constellation.mouse.y = -9999;
        });

        // 点击拖拽后不触发放大
        vp.addEventListener('click', function(e) {
            if (Math.abs(constellation.velX) + Math.abs(constellation.velY) > 0.5) e.stopPropagation();
        });

        // 窗口缩放时重算边界（防抖）
        var resizeT = null;
        window.addEventListener('resize', function() {
            clearTimeout(resizeT);
            resizeT = setTimeout(function() {
                computeBounds();
                constellation.targetX = Math.max(constellation.bounds.minX, Math.min(constellation.bounds.maxX, constellation.targetX));
                constellation.targetY = Math.max(constellation.bounds.minY, Math.min(constellation.bounds.maxY, constellation.targetY));
            }, 150);
        });
    }

    // 弹性回弹边界：越界部分按 25% 比例透出，再回弹归位
    function elasticClamp(v, min, max) {
        if (v < min) return min + (v - min) * 0.25;
        if (v > max) return max + (v - max) * 0.25;
        return v;
    }

    function constellationLoop() {
        // 自愈：若首帧画布尺寸为0（布局未完成），重算边界
        if (!constellation.bounds.init && constellation.viewport.clientWidth > 0) {
            computeBounds();
        }
        var b = constellation.bounds;
        var elastic = false;

        // 惯性：释放后持续减速滑行
        if (!constellation.dragging) {
            constellation.targetX += constellation.velX;
            constellation.targetY += constellation.velY;
            constellation.velX *= 0.92;   // 摩擦系数
            constellation.velY *= 0.92;
            if (Math.abs(constellation.velX) < 0.05) constellation.velX = 0;
            if (Math.abs(constellation.velY) < 0.05) constellation.velY = 0;
        }

        // 边界检测：硬边界+弹性
        if (constellation.targetX < b.minX) { constellation.targetX = elasticClamp(constellation.targetX, b.minX, b.maxX); constellation.velX *= 0.8; elastic = true; }
        if (constellation.targetX > b.maxX) { constellation.targetX = elasticClamp(constellation.targetX, b.minX, b.maxX); constellation.velX *= 0.8; elastic = true; }
        if (constellation.targetY < b.minY) { constellation.targetY = elasticClamp(constellation.targetY, b.minY, b.maxY); constellation.velY *= 0.8; elastic = true; }
        if (constellation.targetY > b.maxY) { constellation.targetY = elasticClamp(constellation.targetY, b.minY, b.maxY); constellation.velY *= 0.8; elastic = true; }

        // 弹性回弹时：目标回到边界内
        if (elastic) {
            constellation.targetX = Math.max(b.minX, Math.min(b.maxX, constellation.targetX));
            constellation.targetY = Math.max(b.minY, Math.min(b.maxY, constellation.targetY));
        }

        // Lerp 平滑跟随（无拖拽时也让位置收敛到目标）
        constellation.dragX += (constellation.targetX - constellation.dragX) * 0.14;
        constellation.dragY += (constellation.targetY - constellation.dragY) * 0.14;

        // 应用 GPU transform
        constellation.canvas.style.transform = 'translate3d(' + constellation.dragX.toFixed(2) + 'px,' + constellation.dragY.toFixed(2) + 'px,0)';

        // 磁性吸附：靠近光标的照片轻微偏移（只改 transform，不改布局）
        var mx = constellation.mouse.x, my = constellation.mouse.y;
        var vpR = constellation.viewport.getBoundingClientRect();
        var baseX = constellation.dragX, baseY = constellation.dragY;
        for (var i = 0; i < constellation.items.length; i++) {
            var it = constellation.items[i];
            // 屏幕坐标 = 画布偏移 + 自身位置
            var sx = baseX + it._jx + it.clientWidth / 2;
            var sy = baseY + it._jy + it.clientHeight / 2;
            var dxm = mx - sx, dym = my - sy;
            var dist2 = dxm * dxm + dym * dym;
            var pull = 0;
            if (dist2 < 3600) { // 60px 半径
                pull = (1 - Math.sqrt(dist2) / 60) * 10;
            }
            var mdx = dxm / (Math.sqrt(dist2) || 1) * pull * 0.6;
            var mdy = dym / (Math.sqrt(dist2) || 1) * pull * 0.6;
            // 组合磁性位移 + tilt 旋转（从 CSS 变量读取，拖拽与倾斜互不覆盖）
            var trx = it.style.getPropertyValue('--tilt-rx') || '0deg';
            var tryy = it.style.getPropertyValue('--tilt-ry') || '0deg';
            it.style.transform = 'translate3d(' + mdx.toFixed(2) + 'px,' + mdy.toFixed(2) + 'px,0) scale(' + it._scale + ') perspective(1000px) rotateX(' + trx + ') rotateY(' + tryy + ')';
        }

        constellation.raf = requestAnimationFrame(constellationLoop);
    }

    function initGallery() {
        initConstellation();
    }

    // ============ 宇宙尘埃凝结入场动画 ============
    function initEntranceAnimations() {
        // 星象图模式：入场时视口整体淡入
        var vp = document.getElementById('gallery-viewport');
        if (vp) {
            vp.style.opacity = '0';
            vp.style.transform = 'translateY(24px)';
            setTimeout(function() {
                vp.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1)';
                vp.style.opacity = '1';
                vp.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    // ============ 3D 深度视差更新 ============
    function updateGalleryDepth() {
        // 星象图由惯性引擎驱动，无需额外深度变换
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
        var items = document.querySelectorAll('.constellation-item');
        portalSourceEl = null;
        items.forEach(function(item) {
            if (item.querySelector('img') && item.querySelector('img').src === src) portalSourceEl = item;
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
        document.body.style.overflow = '';
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowY = 'auto';

        // 彻底重置滚动状态
        targetScrollY = currentScrollY;
        scrollDamping = 0.09;
        scrollVelocity = 0;
        scrollStallFrames = 0;
        lastScrollCheck = performance.now();
        lastWheelTime = 0;

        var newH = main.scrollHeight;
        if (newH > 0) document.body.style.height = newH + 'px';

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

    // ============ 物理惯性视差滚动 (多重安全防护, 全时健康监测) ============
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
    var scrollHealthTimer = null;

    function clampScroll(val) {
        var maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        return Math.max(0, Math.min(val, maxScroll));
    }

    function initLerpScroll() {
        var initialH = Math.max(main.scrollHeight, window.innerHeight + 100);
        document.body.style.height = initialH + 'px';
        document.body.style.overflowY = 'scroll';
        document.body.style.overflowX = 'hidden';

        // Wheel handler — velocity-capped
        window.addEventListener('wheel', function(e) {
            if (portalActive) return;
            e.preventDefault();
            var now = performance.now();
            var cappedDelta = Math.max(-100, Math.min(100, e.deltaY));
            var dt = now - lastWheelTime;
            if (dt < 16 && dt > 0) {
                scrollVelocity = scrollVelocity * 0.5 + cappedDelta * 0.5;
            } else {
                scrollVelocity = scrollVelocity * 0.25 + cappedDelta * 0.75;
            }
            lastWheelTime = now;
            targetScrollY += scrollVelocity;
            targetScrollY = clampScroll(targetScrollY);
            lastScrollCheck = now;
            scrollStallFrames = 0;
        }, { passive: false });

        // Touch handlers
        var touchStartY = 0, touchStartScroll = 0;
        window.addEventListener('touchstart', function(e) {
            if (portalActive) return;
            touchStartY = e.touches[0].clientY;
            touchStartScroll = targetScrollY;
            scrollStallFrames = 0;
        }, { passive: false });
        window.addEventListener('touchmove', function(e) {
            if (portalActive) return;
            e.preventDefault();
            var dy = touchStartY - e.touches[0].clientY;
            targetScrollY = touchStartScroll + dy;
            targetScrollY = clampScroll(targetScrollY);
            lastScrollCheck = performance.now();
        }, { passive: false });

        // ResizeObserver
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

        // === 滚动健康监测：每2秒检查一次系统是否存活 ===
        scrollHealthTimer = setInterval(function() {
            var now = performance.now();
            var distance = Math.abs(targetScrollY - currentScrollY);
            // 如果超过3秒没有收到输入信号，且lerp还在收敛中 → 强制复位
            if (distance > 0.5 && now - lastScrollCheck > 3000) {
                currentScrollY = targetScrollY;
                scrollVelocity = 0;
                scrollDamping = 0.09;
                scrollStallFrames = 0;
            }
            // 如果overflowY被意外修改(比如被portal残留修改)，恢复正确值
            if (!portalActive && document.body.style.overflowY !== 'scroll') {
                document.body.style.overflowY = 'scroll';
                document.body.style.overflowX = 'hidden';
            }
            // 确保body高度与内容匹配
            var contentH = main.scrollHeight;
            if (contentH > 0 && Math.abs(parseInt(document.body.style.height) - contentH) > 50) {
                document.body.style.height = contentH + 'px';
                targetScrollY = clampScroll(targetScrollY);
                currentScrollY = clampScroll(currentScrollY);
            }
        }, 2000);

        function lerpLoop(ts) {
            // Portal打开时跳过滚动更新，保持主内容在当前位置
            if (portalActive) {
                requestAnimationFrame(lerpLoop);
                return;
            }

            var distance = Math.abs(targetScrollY - currentScrollY);

            // 死锁检测与恢复
            if (distance > 0.5) {
                if (ts - lastScrollCheck > 500) {
                    scrollDamping = 0.3;
                    scrollStallFrames++;
                    if (scrollStallFrames > 8) {
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
                currentScrollY = targetScrollY;
                scrollVelocity = 0;
                scrollDamping = 0.09;
                scrollStallFrames = 0;
            }

            currentScrollY += (targetScrollY - currentScrollY) * scrollDamping;
            if (distance < 0.05) { currentScrollY = targetScrollY; scrollVelocity = 0; }
            smoothScrollY = currentScrollY;

            // GPU transforms (compositor-only)
            main.style.transform = 'translate3d(0, ' + (-currentScrollY) + 'px, 0)';
            if (parallaxBg) parallaxBg.style.transform = 'translate3d(0, ' + (-currentScrollY * 0.15) + 'px, 0)';
            if (parallaxMid) parallaxMid.style.transform = 'translate3d(0, ' + (-currentScrollY * 0.08) + 'px, 0)';
            canvas.style.transform = 'translate3d(0, ' + (-currentScrollY * 0.03) + 'px, 0)';

            updateGalleryDepth();

            // Fallback height sync
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

    // ============ Starlight Echoes ============
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
        try { var stored = localStorage.getItem('starlight-echoes'); if (stored) userEchoes = JSON.parse(stored); } catch(e) { userEchoes = []; }
        echoesData = userEchoes.concat(presetEchoes);
        if (echoesData.length === 0) echoesData = presetEchoes.slice();
    }
    function saveEchoes() { try { localStorage.setItem('starlight-echoes', JSON.stringify(userEchoes)); } catch(e) {} }

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
            particles.push({ x: sx, y: sy, tx: ex, ty: ey, size: Math.random() * 4 + 2, life: 1, delay: i * 15, color: 'hsla(' + (30 + Math.random()*30) + ', 80%, ' + (60 + Math.random()*30) + '%,' });
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
                p.x = (1-t)*(1-t)*sx + 2*(1-t)*t*midX + t*t*ex;
                p.y = (1-t)*(1-t)*sy + 2*(1-t)*t*midY + t*t*ey;
                p.life = 1 - t;
                pCtx.beginPath(); pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
                pCtx.fillStyle = p.color + (p.life * 0.8) + ')'; pCtx.fill();
                if (t < 1) allDone = false;
            }
            if (!allDone) { requestAnimationFrame(animateParticles); }
            else { pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height); if (callback) callback(); }
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
        var btnText = null; // 发射按钮内的主文本节点
        messageInput.addEventListener('input', function() { countEl.textContent = messageInput.value.length; });
        closeBtn.addEventListener('click', function() { overlay.classList.remove('active'); });
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('active'); });

        // 找到按钮的主文本 <span class="echo-btn-text">
        var textSpan = submitBtn.querySelector('.echo-btn-text');

        function setBtnText(t) { if (textSpan) textSpan.textContent = t; }
        function setBtnBusy(busy) {
            submitBtn.disabled = busy;
            submitBtn.classList.toggle('busy', busy);
        }

        // 提交字段标准化：ServerChan 用 desp，PushPlus 用 content
        function buildPayload(author, body) {
            var isServerChan = /ftqq\.com|sct\.ftqq|sctapi/.test(WEBHOOK_URL);
            var isPushPlus = /pushplus\.plus/.test(WEBHOOK_URL);
            if (isServerChan) {
                return { title: '✦ 来自 ' + author + ' 的心声', desp: body };
            }
            if (isPushPlus) {
                return { token: '', title: '✦ 来自 ' + author + ' 的心声', content: body };
            }
            // 通用/自定义 webhook
            return { title: '来自花花的心声', content: body };
        }

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (submitBtn.disabled) return;
            var author = authorInput.value.trim() || '匿名旅人';
            var body = messageInput.value.trim();
            if (!body) return;

            // 发射中…
            setBtnBusy(true);
            setBtnText('发射中…');

            function onSuccess() {
                // 关闭弹窗 → 粒子动画 → 落地的发光胶囊
                overlay.classList.remove('active');
                launchEchoParticle(submitBtn, function() {
                    addEcho(author, body);
                    setBtnText('发射成功 ✨');
                    setTimeout(function() {
                        setBtnBusy(false);
                        setBtnText('✦ 发射入轨 ✦');
                    }, 2000);
                });
                authorInput.value = ''; messageInput.value = ''; countEl.textContent = '0';
            }

            function onFail() {
                setBtnText('引力异常，发射失败');
                setBtnBusy(false);
                setTimeout(function() { setBtnText('✦ 发射入轨 ✦'); }, 2500);
            }

            // 未配置 webhook → 模拟成功（仅打印日志）
            if (!WEBHOOK_URL) {
                console.log('[STARLIGHT-ECHO] 未配置 WEBHOOK_URL，模拟发送成功。', buildPayload(author, body));
                setTimeout(onSuccess, 400);
                return;
            }

            var payload = buildPayload(author, body);
            var initOpts = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                mode: 'cors'
            };

            // PushPlus 若未填 token 则提示补全；其他通道直接发
            if (/pushplus\.plus/.test(WEBHOOK_URL) && !payload.token) {
                onFail();
                return;
            }

            fetch(WEBHOOK_URL, initOpts)
                .then(function(res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.text().catch(function() { return ''; });
                })
                .then(function() { onSuccess(); })
                .catch(function(err) {
                    console.error('[STARLIGHT-ECHO] 发送失败:', err);
                    onFail();
                });
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

    // ============ 全局点击星辰/爱心爆裂特效 ============
    var BURST_CHARS = ['✦', '❤', '✧', '❀', '·', '⋆'];
    var clickBurstLayer = null;

    function ensureBurstLayer() {
        if (clickBurstLayer) return clickBurstLayer;
        clickBurstLayer = document.createElement('div');
        clickBurstLayer.className = 'click-burst-layer';
        document.body.appendChild(clickBurstLayer);
        return clickBurstLayer;
    }

    function spawnBurst(x, y) {
        var layer = ensureBurstLayer();
        // 固定 3 颗，避免低端机爆量
        var count = 3;
        var isTouch = false;
        for (var i = 0; i < count; i++) {
            var el = document.createElement('span');
            el.className = 'click-burst';
            el.textContent = BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
            var drift = (Math.random() - 0.5) * 26;
            var rise = Math.random() * 34 + 20;
            var scale = 0.6 + Math.random() * 0.9;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.setProperty('--drift', drift.toFixed(1) + 'px');
            el.style.setProperty('--rise', rise.toFixed(1) + 'px');
            el.style.setProperty('--burst-scale', scale.toFixed(2));
            layer.appendChild(el);
            // 动画结束(1s)后销毁，防止内存泄漏
            (function(node) {
                node.addEventListener('animationend', function() {
                    if (node.parentNode) node.parentNode.removeChild(node);
                }, { once: true });
            })(el);
            // 兜底清理：极端情况下动画事件未触发也移除
            setTimeout(function() {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 1600);
        }
    }

    document.addEventListener('click', function(e) {
        var x = e.clientX, y = e.clientY;
        spawnBurst(x, y);
    }, { passive: true });

    document.addEventListener('touchstart', function(e) {
        var t = e.touches[0];
        if (t) spawnBurst(t.clientX, t.clientY);
    }, { passive: true });

    // ============ 自定义混合模式光标 ============
    // ============ 3D 玻璃质感倾斜（Awwwards 式）============
    // 用 CSS 变量驱动 tilt，避免与星象图拖拽 transform 冲突
    function initGlassTilt() {
        // 头像行星：直接应用倾斜
        document.querySelectorAll('.avatar-planet').forEach(function(el) {
            el.addEventListener('mousemove', function(e) {
                var r = el.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width;
                var py = (e.clientY - r.top) / r.height;
                var rx = (py - 0.5) * -12;
                var ry = (px - 0.5) * 14;
                el.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
                el.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
                el.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(1.02,1.02,1.02)';
            });
            el.addEventListener('mouseleave', function() {
                el.style.transform = '';
            });
        });

        // 画廊照片：记录 tilt 到 CSS 变量，拖拽循环每帧组合
        var vp = document.getElementById('gallery-viewport');
        if (vp) {
            vp.addEventListener('mousemove', function(e) {
                var item = e.target.closest('.constellation-item');
                if (!item) return;
                var r = item.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width;
                var py = (e.clientY - r.top) / r.height;
                var rx = (py - 0.5) * -10;
                var ry = (px - 0.5) * 12;
                item.style.setProperty('--tilt-rx', rx.toFixed(2) + 'deg');
                item.style.setProperty('--tilt-ry', ry.toFixed(2) + 'deg');
                item.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
                item.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
            });
            vp.addEventListener('mouseleave', function() {
                var it = e && e.target;
                var item = it && it.closest ? it.closest('.constellation-item') : null;
                if (item) { item.style.setProperty('--tilt-rx', '0deg'); item.style.setProperty('--tilt-ry', '0deg'); }
            });
        }
    }

    function initCustomCursor() {
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return; // 触屏设备跳过
        var cursor = document.getElementById('custom-cursor');
        if (!cursor) return;
        var tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty;
        var target = null;

        window.addEventListener('mousemove', function(e) {
            tx = e.clientX; ty = e.clientY;
            // 磁性吸附：靠近头像/画廊照片时放大
            var el = e.target;
            var snapEl = el && (el.closest('.avatar-img') || el.closest('.constellation-item') ||
                                el.closest('.avatar-planet'));
            var cls = 'magnetic';
            if (snapEl) {
                var r = snapEl.getBoundingClientRect();
                // 平滑磁吸到目标中心
                tx = r.left + r.width / 2;
                ty = r.top + r.height / 2;
                cursor.classList.add(cls);
            } else {
                cursor.classList.remove(cls);
            }
        });
        window.addEventListener('mousedown', function() { cursor.classList.add('down'); });
        window.addEventListener('mouseup', function() { cursor.classList.remove('down'); });

        (function loop() {
            x += (tx - x) * 0.18;
            y += (ty - y) * 0.18;
            cursor.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
            requestAnimationFrame(loop);
        })();
    }
    initGlassTilt();
    initCustomCursor();

    // ============ 初始设定 ============
    document.getElementById('title-name').textContent = GF_NAME;
    document.getElementById('name-label').textContent = GF_NAME;

})();