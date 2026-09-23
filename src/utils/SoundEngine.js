// ─────────────────────────────────────────────────────────────────────────────
// HOLLYWOOD CINEMATIC AUDIO DIRECTOR — Ritik Soni Creative Portfolio
// Authentic Film Sound Design: Hans Zimmer Drone Bed, IMAX Camera Swoops,
// Acoustic Focus-Pulls & Blockbuster Trailer Impacts.
// ─────────────────────────────────────────────────────────────────────────────

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicBus = null;
    this.sfxBus = null;
    this._compressor = null;
    this._reverb = null;
    this._reverbGain = null;

    // Soundtrack state
    this.isSoundtrackPlaying = false;
    this.isMuted = false;
    this.isPausedForVideo = false;

    // Track buffers & sources
    this._soundtrackBuffers = {
      melancholy: null,
      horizon: null,
      reckoning: null,
    };
    this._soundtrackSources = {
      melancholy: null,
      horizon: null,
      reckoning: null,
    };
    this._soundtrackGains = {
      melancholy: null,
      horizon: null,
      reckoning: null,
    };
    this._soundtrackPanners = {
      melancholy: null,
      horizon: null,
      reckoning: null,
    };

    this._soundtrackUrls = {
      melancholy: '/audio/story-loop/melancholy-maj-a.wav',
      horizon: '/audio/drone-texture/horizon-maj-a.wav',
      reckoning: '/audio/story-loop/reckoning-min-a.wav',
    };

    this._soundtrackVolumes = {
      melancholy: 0.18,
      horizon: 0.028,
      reckoning: 0.18,
    };

    // Progressive Chunked Audio Streaming Elements & Web Audio Nodes
    this._streamingElements = {
      melancholy: null,
      horizon: null,
      reckoning: null,
    };
    this._mediaElementSources = {
      melancholy: null,
      horizon: null,
      reckoning: null,
    };

    // Futuristic Cyber Glitch SFX (/audio/sfx/futuristic-glitch.wav)
    this._glitchUrl = '/audio/sfx/futuristic-glitch.wav?v=3';
    this._glitchBuffer = null;
    this._glitchAudio = null;
    this._gearUrl = '/audio/sfx/gear.wav';
    this._gearBuffer = null;
    this._gearAudio = null;
    this._currentGearSource = null;
    this._currentGearGain = null;
    this._gearScrollTimeout = null;
    this._reckoningAudio = null;

    // Futuristic Cyber Loading Audio (/audio/sfx/futuristic-loading.wav)
    this._futuristicLoadingUrl = '/audio/sfx/futuristic-loading.wav';
    this._futuristicLoadingBuffer = null;
    this._futuristicLoadingAudio = null;
    this._currentLoadingSource = null;
    this._currentLoadingGain = null;

    // Epic A-Minor Key Riser (/audio/sfx/epic-riser-a-min.wav)
    this._epicRiserUrl = '/audio/sfx/epic-riser-a-min.wav?v=2';
    this._epicRiserBuffer = null;
    this._epicRiserAudio = null;
    this._currentRiserSource = null;
    this._currentRiserGain = null;

    // Cinematic Sub-Bass Beat Drop (/audio/sfx/cinematic-beat-drop.wav)
    this._beatDropUrl = '/audio/sfx/cinematic-beat-drop.wav';
    this._beatDropBuffer = null;
    this._beatDropAudio = null;

    // Futuristic Button Click SFX (/audio/sfx/futuristic-click.wav)
    this._futuristicClickUrl = '/audio/sfx/futuristic-click.wav';
    this._futuristicClickBuffer = null;
    this._futuristicClickAudio = null;

    if (typeof window !== 'undefined') {
      try {
        this._gearAudio = new Audio(this._gearUrl);
        this._gearAudio.preload = 'none';
      } catch (e) {}
      try {
        this._glitchAudio = new Audio(this._glitchUrl);
        this._glitchAudio.preload = 'none';
      } catch (e) {}
      try {
        this._reckoningAudio = new Audio(this._soundtrackUrls.reckoning);
        this._reckoningAudio.preload = 'none';
        this._reckoningAudio.loop = true;
      } catch (e) {}
      try {
        this._futuristicLoadingAudio = new Audio(this._futuristicLoadingUrl);
        this._futuristicLoadingAudio.preload = 'none';
      } catch (e) {}
      try {
        this._epicRiserAudio = new Audio(this._epicRiserUrl);
        this._epicRiserAudio.preload = 'none';
      } catch (e) {}
      try {
        this._beatDropAudio = new Audio(this._beatDropUrl);
        this._beatDropAudio.preload = 'none';
      } catch (e) {}
      try {
        this._futuristicClickAudio = new Audio(this._futuristicClickUrl);
        this._futuristicClickAudio.preload = 'auto'; // Tiny 24 KB for instant click feedback
      } catch (e) {}
    }

    // Noise buffer for camera swoops
    this._noiseBuffer = null;

    // Golden Hour interactive audio tracks (/audio/golden-hour/gh1.wav ... gh6.wav)
    this._goldenHourUrls = [
      '/audio/golden-hour/gh1.wav',
      '/audio/golden-hour/gh2.wav',
      '/audio/golden-hour/gh3.wav',
      '/audio/golden-hour/gh4.wav',
      '/audio/golden-hour/gh5.wav',
      '/audio/golden-hour/gh6.wav',
    ];
    this._goldenHourBuffers = [];
    this._lastGhIndex = -1;
    this._lastGhTime = 0;
    this._currentGhSource = null;
    this._currentGhGain = null;

    // SFX throttling
    this._lastHoverTime = 0;
    this._lastSwoopTime = 0;
    this._lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    this._listenersAttached = false;

    // Audio preferences
    this.isMuted = false;
    this.isSoundtrackPlaying = false;
    this._isPreloadingGh = false;
    this._ghLoading = {};

    this.playGearScroll = this.playGearScroll.bind(this);
    this.stopGearScroll = this.stopGearScroll.bind(this);
    this.playViolinMelodyScroll = this.playGearScroll;
    this.playViolinSymphonyScroll = this.playGearScroll;
    this.playMajAScrollNote = this.playGearScroll;
    this.playCinematicScroll = this.playGearScroll;
  }

  _isAdminPage() {
    if (typeof window !== 'undefined' && window.location) {
      const p = window.location.pathname || '';
      return p.startsWith('/admin');
    }
    return false;
  }

  // ── 1. Master Context & Hollywood Signal Flow ───────────────────────────────

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      // Studio Master Compressor / Limiter (Dolby Cinema curve)
      this._compressor = this.ctx.createDynamicsCompressor();
      this._compressor.threshold.value = -16;
      this._compressor.knee.value = 10;
      this._compressor.ratio.value = 5.0;
      this._compressor.attack.value = 0.003;
      this._compressor.release.value = 0.25;
      this._compressor.connect(this.ctx.destination);

      // Master Gain Bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this._compressor);

      // Music Bus (Orchestral Piano & Pads)
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 1.0;
      this.musicBus.connect(this.masterGain);

      // SFX Bus (Camera swoops, focus pulls, trailer hits)
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 1.0;
      this.sfxBus.connect(this.masterGain);

      // 4.5s Convolution Canyon Hall Reverb
      this._reverb = this._buildReverb(4.5, 2.6);
      this._reverbGain = this.ctx.createGain();
      this._reverbGain.gain.value = 0.40;
      this._reverb.connect(this._reverbGain);
      this._reverbGain.connect(this.masterGain);

      // Generate procedural organic noise buffer for camera swoops
      this._noiseBuffer = this._buildPinkNoiseBuffer(2.0);

      // Attach lifecycle listeners (tracks stream progressively in chunks on-demand)
      this._attachLifecycleListeners();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  async loadSingleTrack(key) {
    if (!this.ctx || !this._soundtrackUrls[key]) return null;
    if (this._soundtrackBuffers[key]) return this._soundtrackBuffers[key];
    try {
      const res = await fetch(this._soundtrackUrls[key]);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(arrayBuffer);
      this._soundtrackBuffers[key] = decoded;
      return decoded;
    } catch (e) {
      return null;
    }
  }

  async preloadSoundtracks(targetKey) {
    if (!this.ctx) return;
    if (targetKey) {
      await this.loadSingleTrack(targetKey);
      return;
    }
    // High-efficiency network optimization: load strictly on-demand, never download all 40MB concurrently
    await this.loadSingleTrack('reckoning');
  }

  async preloadGlitch() {
    if (!this.ctx || this._glitchBuffer) return;
    try {
      const res = await fetch(this._glitchUrl);
      const ab = await res.arrayBuffer();
      this._glitchBuffer = await this.ctx.decodeAudioData(ab);
    } catch (e) {}
  }

  async preloadFuturisticLoading() {
    if (!this.ctx || this._futuristicLoadingBuffer) return;
    try {
      const res = await fetch(this._futuristicLoadingUrl);
      const ab = await res.arrayBuffer();
      this._futuristicLoadingBuffer = await this.ctx.decodeAudioData(ab);
    } catch (e) {}
  }

  async preloadEpicRiser() {
    if (!this.ctx || this._epicRiserBuffer) return;
    try {
      const res = await fetch(this._epicRiserUrl);
      const ab = await res.arrayBuffer();
      this._epicRiserBuffer = await this.ctx.decodeAudioData(ab);
    } catch (e) {}
  }

  async preloadBeatDrop() {
    if (!this.ctx || this._beatDropBuffer) return;
    try {
      const res = await fetch(this._beatDropUrl);
      const ab = await res.arrayBuffer();
      this._beatDropBuffer = await this.ctx.decodeAudioData(ab);
    } catch (e) {}
  }

  async preloadFuturisticClick() {
    if (!this.ctx || this._futuristicClickBuffer) return;
    try {
      const res = await fetch(this._futuristicClickUrl);
      const ab = await res.arrayBuffer();
      this._futuristicClickBuffer = await this.ctx.decodeAudioData(ab);
    } catch (e) {}
  }

  async preloadGear() {
    if (!this.ctx || this._gearBuffer) return;
    try {
      const res = await fetch(this._gearUrl);
      const ab = await res.arrayBuffer();
      this._gearBuffer = await this.ctx.decodeAudioData(ab);
    } catch (e) {}
  }

  async preloadGoldenHour() {
    this.initContext();
    if (!this.ctx || this._isPreloadingGh) return;
    this._isPreloadingGh = true;
    const promises = this._goldenHourUrls.map(async (url, idx) => {
      if (this._goldenHourBuffers[idx]) return this._goldenHourBuffers[idx];
      try {
        const res = await fetch(url);
        const ab = await res.arrayBuffer();
        const decoded = await this.ctx.decodeAudioData(ab);
        this._goldenHourBuffers[idx] = decoded;
        return decoded;
      } catch (e) {
        return null;
      }
    });
    await Promise.all(promises);
  }

  _playGhBuffer(buffer, clientX) {
    if (!this.ctx || !buffer) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      if (clientX !== undefined && this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
        panner.pan.value = Math.max(-0.75, Math.min(0.75, norm));
        src.connect(gain);
        gain.connect(panner);
        panner.connect(this.sfxBus || this.masterGain || this.ctx.destination);
      } else {
        src.connect(gain);
        gain.connect(this.sfxBus || this.masterGain || this.ctx.destination);
      }

      src.start(0);
    } catch (e) {}
  }

  // ── 2. The Movie Score Progressive Chunk Streaming ──────────────────────────

  _getStreamingElement(trackName) {
    if (typeof window === 'undefined') return null;
    if (!this._streamingElements) {
      this._streamingElements = {};
    }
    if (!this._streamingElements[trackName] && this._soundtrackUrls[trackName]) {
      const audio = new Audio(this._soundtrackUrls[trackName]);
      audio.loop = true;
      audio.preload = 'auto';
      this._streamingElements[trackName] = audio;
    }
    return this._streamingElements[trackName];
  }

  playTrack(trackName) {
    if (this._isAdminPage()) return;
    if (!this._soundtrackUrls[trackName]) return;

    this.isSoundtrackPlaying = true;
    try {
      localStorage.setItem('ritik_cinematic_soundtrack_enabled', 'true');
    } catch (e) {}

    const audio = this._getStreamingElement(trackName);
    if (!audio) return;

    const targetVol = this._soundtrackVolumes[trackName] || 0.18;
    audio.volume = targetVol;

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}
  }

  stopTrack(trackName) {
    const audio = this._streamingElements && this._streamingElements[trackName];
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    }

    if (trackName === 'reckoning' && this._reckoningAudio) {
      try {
        this._reckoningAudio.pause();
        this._reckoningAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  async startSoundtrack() {
    if (this._isAdminPage()) return;
    this.playTrack('melancholy');
    this.playTrack('horizon');
  }

  stopSoundtrack() {
    this.isSoundtrackPlaying = false;
    try {
      localStorage.setItem('ritik_cinematic_soundtrack_enabled', 'false');
    } catch (e) {}

    if (this.ctx && this.musicBus) {
      const t = this.ctx.currentTime;
      this.musicBus.gain.cancelScheduledValues(t);
      this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, t);
      this.musicBus.gain.linearRampToValueAtTime(0.0001, t + 0.4);
    }

    if (this._streamingElements) {
      Object.keys(this._streamingElements).forEach((key) => {
        const audio = this._streamingElements[key];
        if (audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {}
        }
      });
    }

    if (this._reckoningAudio) {
      try { this._reckoningAudio.pause(); } catch (e) {}
    }
  }

  toggleSoundtrack() {
    if (this.isSoundtrackPlaying) {
      this.stopSoundtrack();
      return false;
    } else {
      this.startSoundtrack();
      return true;
    }
  }

  // ── 3. Video Auto-Ducking ───────────────────────────────────────────────────

  fadeOutMusic(duration = 0.5) {
    this.isPausedForVideo = true;
    if (this.ctx && this.musicBus) {
      const t = this.ctx.currentTime;
      this.musicBus.gain.cancelScheduledValues(t);
      this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, t);
      this.musicBus.gain.linearRampToValueAtTime(0.0001, t + duration);
    }
    if (this._streamingElements) {
      Object.keys(this._streamingElements).forEach((key) => {
        const audio = this._streamingElements[key];
        if (audio && !this._mediaElementSources?.[key]) {
          audio.volume = 0;
        }
      });
    }
    if (this._reckoningAudio) {
      this._reckoningAudio.volume = 0;
    }
  }

  fadeInMusic(duration = 0.8) {
    if (this.isMuted) return;
    this.isPausedForVideo = false;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.musicBus) {
        const t = this.ctx.currentTime;
        this.musicBus.gain.cancelScheduledValues(t);
        this.musicBus.gain.setValueAtTime(Math.max(0.0001, this.musicBus.gain.value), t);
        this.musicBus.gain.linearRampToValueAtTime(1.0, t + duration);
      }
    }
    if (this._streamingElements) {
      Object.keys(this._streamingElements).forEach((key) => {
        const audio = this._streamingElements[key];
        if (audio && !this._mediaElementSources?.[key]) {
          audio.volume = this._soundtrackVolumes[key] || 0.18;
        }
      });
    }
    if (this._reckoningAudio) {
      this._reckoningAudio.volume = this._soundtrackVolumes.reckoning;
    }
  }

  // ── 4. True Cinema Sound Effects ───────────────────────────────────────────

  playCameraSwoop() {
    // Scroll sounds disabled per user request
  }

  /**
   * Cinema Audio Focus-Pull on Hover.
   * Simulates the camera racking focus: an acoustic lowpass filter opens up with a warm harmonic overtone.
   */
  playHover(clientX) {
    if (this.isMuted || this._isAdminPage()) return;
    const now = Date.now();
    if (now - this._lastHoverTime < 110) return;
    this._lastHoverTime = now;

    this.initContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Rich harmonic overtone (A3 220Hz -> A4 440Hz)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.15); // Musical E4 fifth

    // Warm filter opening (focus pull effect)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, t);
    filter.frequency.exponentialRampToValueAtTime(850, t + 0.14);
    filter.frequency.exponentialRampToValueAtTime(220, t + 0.38);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.40);

    osc.connect(filter);
    filter.connect(gain);

    // Panned across stereo spectrum
    if (clientX !== undefined && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
      panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.4;
      gain.connect(panner);
      panner.connect(this.sfxBus);
    } else {
      gain.connect(this.sfxBus);
    }

    if (this._reverb) {
      const revSend = this.ctx.createGain();
      revSend.gain.setValueAtTime(0.40, t);
      gain.connect(revSend);
      revSend.connect(this._reverb);
    }

    osc.start(t);
    osc.stop(t + 0.45);
  }

  /**
   * Blockbuster Playhead Trigger (plays clean Golden Hour note).
   */
  playBraam(clientX) {
    this.playGoldenHour(clientX);
  }

  playSectionTransition(sectionName) {
    // Section transition sounds disabled per user request
  }

  /**
   * Golden Hour Interactive Audio Chime (gh1.wav ... gh6.wav).
   * Warm, lush acoustic musical notes triggered on interactive clicks.
   */
  playGoldenHour(clientX) {
    if (this.isMuted || this._isAdminPage()) return;
    const now = Date.now();
    if (now - this._lastGhTime < 40) return;
    this._lastGhTime = now;

    this.initContext();

    const total = this._goldenHourUrls.length;
    let nextIdx = Math.floor(Math.random() * total);
    if (nextIdx === this._lastGhIndex && total > 1) {
      nextIdx = (nextIdx + 1 + Math.floor(Math.random() * (total - 1))) % total;
    }
    this._lastGhIndex = nextIdx;

    if (!this._isPreloadingGh) {
      this.preloadGoldenHour().catch(() => {});
    }

    // 1. Instant zero-latency playback via decoded Web Audio buffer if ready
    if (this.ctx && this._goldenHourBuffers && this._goldenHourBuffers[nextIdx]) {
      this._playGhBuffer(this._goldenHourBuffers[nextIdx], clientX);
      return;
    }

    // 2. Immediate playback via HTML5 Audio element
    try {
      const chime = new Audio(this._goldenHourUrls[nextIdx]);
      chime.volume = 0.35;
      const p = chime.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } catch (e) {}

    // 3. Load & decode this buffer asynchronously so subsequent clicks are zero-latency
    if (this.ctx && !this._goldenHourBuffers[nextIdx] && (!this._ghLoading || !this._ghLoading[nextIdx])) {
      if (!this._ghLoading) this._ghLoading = {};
      this._ghLoading[nextIdx] = true;
      fetch(this._goldenHourUrls[nextIdx])
        .then((r) => r.arrayBuffer())
        .then((ab) => this.ctx.decodeAudioData(ab))
        .then((decoded) => {
          this._goldenHourBuffers[nextIdx] = decoded;
          this._ghLoading[nextIdx] = false;
        })
        .catch(() => {
          this._ghLoading[nextIdx] = false;
        });
    }
  }

  playClick(clientX) {
    this.playGoldenHour(clientX);
  }

  playLensClick(clientX) {
    this.playGoldenHour(clientX);
  }

  playShutter() {
    this.playGoldenHour();
  }

  /**
   * Cinematic Cyber Glitch SFX (Hollywood / Trailer Grade).
   * 1. Direct Sample Kick: /audio/sfx/glitch 1.wav zero-latency playback.
   * 2. Heavy Sub-Bass Braam: 92Hz -> 26Hz sub-frequency sweep for visceral headphone rattle.
   * 3. Binaural Ping-Pong Noise Stutter: 5 micro-gated static bursts ping-ponging Left & Right across stereo field.
   * 4. Resonant Downward Tape Rip: 1150Hz -> 140Hz harmonic sweep.
   * 5. Mechanical Gear Sync Lock: subtle acoustic mechanical snap (/audio/sfx/gear.wav) at t+0.38s.
   * 6. Canyon Hall Reverb Bloom: 1.6s convolution decay tail creating massive cinematic theater space.
   */
  playGlitch(clientX) {
    if (this.isMuted || this._isAdminPage()) return;
    this.isMuted = false;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // 1. Direct HTML5 Audio playback for guaranteed instant zero-latency response on click
    try {
      if (!this._glitchAudio) {
        this._glitchAudio = new Audio(this._glitchUrl);
      }
      this._glitchAudio.currentTime = 0;
      this._glitchAudio.volume = 1.0;
      const playPromise = this._glitchAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}

    // 2. Cinematic Web Audio Glitch Stack (Pure Cyber Glitch, No Beat Drop)
    if (this.ctx) {
      const t = this.ctx.currentTime;
      const glitchBus = this.ctx.createGain();
      glitchBus.gain.setValueAtTime(1.0, t);

      // --- LAYER A: Decoded Glitch Sample Reinforced ---
      if (this._glitchBuffer) {
        try {
          const src = this.ctx.createBufferSource();
          src.buffer = this._glitchBuffer;
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.9, t);
          src.connect(gain);
          gain.connect(glitchBus);
          src.start(t);
        } catch (e) {}
      }

      // --- LAYER C: 3D Binaural Ping-Pong Stutter (Left/Right Ear Bursts) ---
      if (this._noiseBuffer && this.ctx.createStereoPanner) {
        try {
          const bursts = [
            { start: 0.00, dur: 0.05, pan: -0.6, vol: 0.28, freq: 2800 },
            { start: 0.12, dur: 0.06, pan: 0.65, vol: 0.32, freq: 3400 },
            { start: 0.25, dur: 0.07, pan: -0.45, vol: 0.26, freq: 2200 },
            { start: 0.42, dur: 0.08, pan: 0.5, vol: 0.30, freq: 4000 },
            { start: 0.60, dur: 0.09, pan: 0.0, vol: 0.22, freq: 1600 },
          ];

          bursts.forEach(({ start, dur, pan, vol, freq }) => {
            const nSrc = this.ctx.createBufferSource();
            nSrc.buffer = this._noiseBuffer;
            const bFilter = this.ctx.createBiquadFilter();
            bFilter.type = 'bandpass';
            bFilter.frequency.setValueAtTime(freq, t + start);
            bFilter.Q.value = 4.0;
            const bPanner = this.ctx.createStereoPanner();
            bPanner.pan.setValueAtTime(pan, t + start);
            const bGain = this.ctx.createGain();
            bGain.gain.setValueAtTime(0.0001, t + start);
            bGain.gain.linearRampToValueAtTime(vol, t + start + 0.01);
            bGain.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);

            nSrc.connect(bFilter);
            bFilter.connect(bPanner);
            bPanner.connect(bGain);
            bGain.connect(glitchBus);

            nSrc.start(t + start);
            nSrc.stop(t + start + dur + 0.02);
          });
        } catch (e) {}
      }

      // --- LAYER D: Downward Resonant Tape-Rip Sweep (1150Hz -> 140Hz) ---
      try {
        const sweepOsc = this.ctx.createOscillator();
        sweepOsc.type = 'sawtooth';
        sweepOsc.frequency.setValueAtTime(1150, t);
        sweepOsc.frequency.exponentialRampToValueAtTime(140, t + 0.35);

        const sweepFilter = this.ctx.createBiquadFilter();
        sweepFilter.type = 'lowpass';
        sweepFilter.frequency.setValueAtTime(2600, t);
        sweepFilter.frequency.exponentialRampToValueAtTime(350, t + 0.32);

        const sweepGain = this.ctx.createGain();
        sweepGain.gain.setValueAtTime(0.0001, t);
        sweepGain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        sweepGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

        sweepOsc.connect(sweepFilter);
        sweepFilter.connect(sweepGain);
        sweepGain.connect(glitchBus);
        sweepOsc.start(t);
        sweepOsc.stop(t + 0.4);
      } catch (e) {}

      // Master Glitch Spatial Position
      if (clientX !== undefined && this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
        panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.35;
        glitchBus.connect(panner);
        panner.connect(this.sfxBus || this.masterGain);
      } else {
        glitchBus.connect(this.sfxBus || this.masterGain);
      }

      // Canyon Hall Convolution Reverb Decay Tail (1.6s bloom)
      if (this._reverb) {
        const revSend = this.ctx.createGain();
        revSend.gain.setValueAtTime(0.32, t);
        revSend.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        glitchBus.connect(revSend);
        revSend.connect(this._reverb);
      }
    }
  }

  /**
   * Futuristic Cyber Loading Audio.
   * 4-second synchronized electromagnetic spool-up, accelerating telemetry data blips,
   * resonant plasma flux, and harmonic "SYSTEM READY" confirmation chime at 100%.
   */
  playFuturisticLoading() {
    if (this.isMuted || this._isAdminPage()) return;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Stop any currently running instance first
    this.stopFuturisticLoading(0.05);

    // 1. Instant HTML5 audio playback for zero-latency response
    try {
      if (!this._futuristicLoadingAudio) {
        this._futuristicLoadingAudio = new Audio(this._futuristicLoadingUrl);
      }
      this._futuristicLoadingAudio.currentTime = 0;
      this._futuristicLoadingAudio.volume = 0.85;
      const p = this._futuristicLoadingAudio.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {}

    // 2. High-Fidelity Web Audio API Buffer playback if decoded
    if (this.ctx) {
      const playBuffer = (decodedBuffer) => {
        if (!this.ctx || !decodedBuffer) return;
        try {
          const t = this.ctx.currentTime;
          const src = this.ctx.createBufferSource();
          src.buffer = decodedBuffer;

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.85, t);

          src.connect(gain);
          gain.connect(this.sfxBus || this.masterGain);

          src.start(t);
          this._currentLoadingSource = src;
          this._currentLoadingGain = gain;
        } catch (e) {}
      };

      if (this._futuristicLoadingBuffer) {
        if (this._futuristicLoadingAudio) {
          try { this._futuristicLoadingAudio.pause(); } catch (e) {}
        }
        playBuffer(this._futuristicLoadingBuffer);
      } else {
        fetch(this._futuristicLoadingUrl)
          .then((res) => res.arrayBuffer())
          .then((ab) => this.ctx.decodeAudioData(ab))
          .then((decoded) => {
            this._futuristicLoadingBuffer = decoded;
          })
          .catch(() => {});
      }
    }
  }

  stopFuturisticLoading(fadeTime = 0.25) {
    if (this._futuristicLoadingAudio) {
      try {
        this._futuristicLoadingAudio.pause();
        this._futuristicLoadingAudio.currentTime = 0;
      } catch (e) {}
    }

    if (this._currentLoadingGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this._currentLoadingGain.gain.cancelScheduledValues(t);
        this._currentLoadingGain.gain.setValueAtTime(this._currentLoadingGain.gain.value, t);
        this._currentLoadingGain.gain.linearRampToValueAtTime(0.0001, t + fadeTime);
      } catch (e) {}
    }

    if (this._currentLoadingSource) {
      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        this._currentLoadingSource.stop(t + fadeTime);
      } catch (e) {}
      this._currentLoadingSource = null;
      this._currentLoadingGain = null;
    }
  }

  /**
   * Epic A-Minor Cinematic Key Riser.
   * Plays a 2.4-second building supersaw string chord & sub-bass vortex in A minor,
   * building tension alongside the Reckoning soundtrack until the drop.
   */
  playEpicRiser() {
    if (this.isMuted || this._isAdminPage()) return;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.stopEpicRiser(0.05);

    // 1. Instant HTML5 audio playback for zero-latency response
    try {
      if (!this._epicRiserAudio) {
        this._epicRiserAudio = new Audio(this._epicRiserUrl);
      }
      this._epicRiserAudio.currentTime = 0;
      this._epicRiserAudio.volume = 1.0;
      const p = this._epicRiserAudio.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {}

    // 2. High-Fidelity Web Audio API playback
    if (this.ctx) {
      const playBuffer = (buffer) => {
        if (!this.ctx || !buffer) return;
        try {
          const t = this.ctx.currentTime;
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.95, t);

          src.connect(gain);
          gain.connect(this.sfxBus || this.masterGain);

          src.start(t);
          this._currentRiserSource = src;
          this._currentRiserGain = gain;
        } catch (e) {}
      };

      if (this._epicRiserBuffer) {
        if (this._epicRiserAudio) {
          try { this._epicRiserAudio.pause(); } catch (e) {}
        }
        playBuffer(this._epicRiserBuffer);
      } else {
        fetch(this._epicRiserUrl)
          .then((res) => res.arrayBuffer())
          .then((ab) => this.ctx.decodeAudioData(ab))
          .then((decoded) => {
            this._epicRiserBuffer = decoded;
          })
          .catch(() => {});
      }
    }
  }

  stopEpicRiser(fadeTime = 0.1) {
    if (this._epicRiserAudio) {
      try {
        this._epicRiserAudio.pause();
        this._epicRiserAudio.currentTime = 0;
      } catch (e) {}
    }
    if (this._currentRiserGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this._currentRiserGain.gain.cancelScheduledValues(t);
        this._currentRiserGain.gain.setValueAtTime(this._currentRiserGain.gain.value, t);
        this._currentRiserGain.gain.linearRampToValueAtTime(0.0001, t + fadeTime);
      } catch (e) {}
    }
    if (this._currentRiserSource) {
      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        this._currentRiserSource.stop(t + fadeTime);
      } catch (e) {}
      this._currentRiserSource = null;
      this._currentRiserGain = null;
    }
  }

  /**
   * Cinematic Sub-Bass Beat Drop SFX.
   * 1.1s pre-drop atmospheric suction build + earth-shaking sub-bass trailer braam impact at t = 1.10s.
   */
  playCinematicBeatDrop() {
    if (this.isMuted || this._isAdminPage()) return;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // 1. Zero-latency HTML5 Audio trigger
    try {
      if (!this._beatDropAudio) {
        this._beatDropAudio = new Audio(this._beatDropUrl);
      }
      this._beatDropAudio.currentTime = 0;
      this._beatDropAudio.volume = 1.0;
      const p = this._beatDropAudio.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {}

    // 2. High-Fidelity Web Audio API Playback
    if (this.ctx) {
      if (this._beatDropBuffer) {
        if (this._beatDropAudio) {
          try { this._beatDropAudio.pause(); } catch (e) {}
        }
        try {
          const t = this.ctx.currentTime;
          const src = this.ctx.createBufferSource();
          src.buffer = this._beatDropBuffer;
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(1.0, t);
          src.connect(gain);
          gain.connect(this.sfxBus || this.masterGain);
          src.start(t);
        } catch (e) {}
      } else {
        fetch(this._beatDropUrl)
          .then((res) => res.arrayBuffer())
          .then((ab) => this.ctx.decodeAudioData(ab))
          .then((decoded) => {
            this._beatDropBuffer = decoded;
          })
          .catch(() => {});
      }
    }
  }

  /**
   * Retro CRT Television Power-On Sound Effect.
   * Pure authentic high-voltage cathode ray "sheeeeee" coil sweep.
   * Completely free of clicks, bass thuds, and static noise ("tiss tiss").
   */
  playTvPowerOn() {
    if (this.isMuted || this._isAdminPage()) return;
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const t = this.ctx.currentTime;

      // 1. Primary Cathode Ray Flyback Sweep ("sheeeee...")
      // Smooth frequency ramp from 2,800Hz up to 14,200Hz
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2800, t);
      osc1.frequency.exponentialRampToValueAtTime(14200, t + 0.65);

      gain1.gain.setValueAtTime(0.0001, t);
      gain1.gain.linearRampToValueAtTime(0.032, t + 0.12);
      gain1.gain.setValueAtTime(0.032, t + 0.45);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);

      osc1.connect(gain1);
      gain1.connect(this.sfxBus || this.masterGain);
      osc1.start(t);
      osc1.stop(t + 1.0);

      // 2. Secondary High-Voltage Harmonic Over-Tone (silky vintage CRT picture tube resonance)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(4200, t + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(15600, t + 0.65);

      gain2.gain.setValueAtTime(0.0001, t + 0.05);
      gain2.gain.linearRampToValueAtTime(0.015, t + 0.18);
      gain2.gain.setValueAtTime(0.015, t + 0.45);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc2.connect(gain2);
      gain2.connect(this.sfxBus || this.masterGain);
      osc2.start(t + 0.05);
      osc2.stop(t + 0.95);
    } catch (e) {}
  }



  /**
   * Futuristic Holographic Button Hover SFX.
   * Subtle 35ms crystalline telemetry micro-chirp.
   */
  playFuturisticButtonHover(clientX) {
    if (this.isMuted || this._isAdminPage()) return;
    const now = Date.now();
    if (now - this._lastHoverTime < 70) return;
    this._lastHoverTime = now;

    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1950, t);
      osc1.frequency.exponentialRampToValueAtTime(2450, t + 0.035);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2850, t);
      osc2.frequency.exponentialRampToValueAtTime(3400, t + 0.035);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc1.connect(gain);
      osc2.connect(gain);

      if (clientX !== undefined && this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
        panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.35;
        gain.connect(panner);
        panner.connect(this.sfxBus || this.masterGain);
      } else {
        gain.connect(this.sfxBus || this.masterGain);
      }

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.045);
      osc2.stop(t + 0.045);
    } catch (e) {}
  }

  /**
   * Futuristic Tactile Button Click SFX (/audio/sfx/futuristic-click.wav).
   * High-voltage micro-spark transient + magnetic sub-thud + 880Hz confirmation harmonic.
   */
  playFuturisticButtonClick(clientX) {
    if (this.isMuted || this._isAdminPage()) return;

    // 1. Direct HTML5 Audio playback for guaranteed instant zero-latency response on click
    try {
      if (!this._futuristicClickAudio) {
        this._futuristicClickAudio = new Audio(this._futuristicClickUrl);
      }
      this._futuristicClickAudio.currentTime = 0;
      this._futuristicClickAudio.volume = 0.95;
      const playPromise = this._futuristicClickAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}

    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const t = this.ctx.currentTime;
      const clickBus = this.ctx.createGain();
      clickBus.gain.setValueAtTime(0.85, t);

      // 1. High-voltage spark transient (3400Hz -> 450Hz in 14ms)
      const sparkOsc = this.ctx.createOscillator();
      const sparkGain = this.ctx.createGain();
      sparkOsc.type = 'triangle';
      sparkOsc.frequency.setValueAtTime(3400, t);
      sparkOsc.frequency.exponentialRampToValueAtTime(450, t + 0.015);
      sparkGain.gain.setValueAtTime(0.28, t);
      sparkGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
      sparkOsc.connect(sparkGain);
      sparkGain.connect(clickBus);
      sparkOsc.start(t);
      sparkOsc.stop(t + 0.025);

      // 2. Sub-frequency magnetic haptic thud (140Hz -> 36Hz in 50ms)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, t);
      subOsc.frequency.exponentialRampToValueAtTime(36, t + 0.05);
      subGain.gain.setValueAtTime(0.42, t);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);
      subOsc.connect(subGain);
      subGain.connect(clickBus);
      subOsc.start(t);
      subOsc.stop(t + 0.07);

      // 3. Futuristic confirmation harmonic ping (880Hz A5)
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(880, t);
      pingGain.gain.setValueAtTime(0.18, t);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      pingOsc.connect(pingGain);
      pingGain.connect(clickBus);
      pingOsc.start(t);
      pingOsc.stop(t + 0.1);

      if (clientX !== undefined && this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
        panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.35;
        clickBus.connect(panner);
        panner.connect(this.sfxBus || this.masterGain);
      } else {
        clickBus.connect(this.sfxBus || this.masterGain);
      }
    } catch (e) {}
  }

  playFuturisticClick(clientX) {
    this.playFuturisticButtonClick(clientX);
  }

  /**
   * 35mm Film Border Cinematic Transition Audio.
   * Shutter snap + analog celluloid film advance roll + warm Golden Hour chord + canyon reverb bloom.
   */
  playFilmBorderTransition(clientX) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const filmBus = this.ctx.createGain();
    filmBus.gain.setValueAtTime(0.95, t);

    // 1. 35mm Shutter Click & Mechanical Frame Advance
    try {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, t);
      clickOsc.frequency.exponentialRampToValueAtTime(160, t + 0.04);

      clickGain.gain.setValueAtTime(0.0001, t);
      clickGain.gain.linearRampToValueAtTime(0.45, t + 0.005);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      clickOsc.connect(clickGain);
      clickGain.connect(filmBus);
      clickOsc.start(t);
      clickOsc.stop(t + 0.06);

      // Frame advance gate settling tick (at t+0.55s when sprockets lock)
      const lockOsc = this.ctx.createOscillator();
      const lockGain = this.ctx.createGain();
      lockOsc.type = 'sine';
      lockOsc.frequency.setValueAtTime(850, t + 0.55);
      lockOsc.frequency.exponentialRampToValueAtTime(220, t + 0.62);

      lockGain.gain.setValueAtTime(0.0001, t + 0.55);
      lockGain.gain.linearRampToValueAtTime(0.28, t + 0.56);
      lockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);

      lockOsc.connect(lockGain);
      lockGain.connect(filmBus);
      lockOsc.start(t + 0.55);
      lockOsc.stop(t + 0.68);
    } catch (e) {}

    // 3. Projector Gate Film Roll Whoosh (Analog Celluloid Purr)
    if (this._noiseBuffer) {
      try {
        const nSrc = this.ctx.createBufferSource();
        nSrc.buffer = this._noiseBuffer;

        const bpFilter = this.ctx.createBiquadFilter();
        bpFilter.type = 'bandpass';
        bpFilter.frequency.setValueAtTime(450, t);
        bpFilter.frequency.exponentialRampToValueAtTime(1800, t + 0.25);
        bpFilter.frequency.exponentialRampToValueAtTime(320, t + 0.7);
        bpFilter.Q.value = 2.8;

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.0001, t);
        nGain.gain.linearRampToValueAtTime(0.22, t + 0.15);
        nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);

        nSrc.connect(bpFilter);
        bpFilter.connect(nGain);
        nGain.connect(filmBus);

        nSrc.start(t);
        nSrc.stop(t + 0.8);
      } catch (e) {}
    }

    // 4. Sub-Bass Cinematic Presence Drop (48Hz -> 32Hz)
    try {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(56, t);
      subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.7);

      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.linearRampToValueAtTime(0.32, t + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      subOsc.connect(subGain);
      subGain.connect(filmBus);
      subOsc.start(t);
      subOsc.stop(t + 0.9);
    } catch (e) {}

    // Spatial Panning
    if (clientX !== undefined && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
      panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.3;
      filmBus.connect(panner);
      panner.connect(this.sfxBus || this.masterGain);
    } else {
      filmBus.connect(this.sfxBus || this.masterGain);
    }

    // Canyon Hall Reverb Bloom (1.8s tail into Melancholy)
    if (this._reverb) {
      const revSend = this.ctx.createGain();
      revSend.gain.setValueAtTime(0.35, t);
      revSend.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      filmBus.connect(revSend);
      revSend.connect(this._reverb);
    }
  }

  /**
   * 35mm Celluloid Film Burn Cinematic Transition Audio.
   * Projector tungsten ignite bloom + analog thermal hiss + warm Golden Hour chord + canyon reverb bloom.
   */
  playFilmBurnTransition(clientX) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const burnBus = this.ctx.createGain();
    burnBus.gain.setValueAtTime(0.95, t);

    // 1. Projector Tungsten Ignite Heat Swell (Sub-bass warmth 42Hz -> 58Hz -> 30Hz)
    try {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(42, t);
      subOsc.frequency.exponentialRampToValueAtTime(58, t + 0.3);
      subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.85);

      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.linearRampToValueAtTime(0.38, t + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);

      subOsc.connect(subGain);
      subGain.connect(burnBus);
      subOsc.start(t);
      subOsc.stop(t + 1.05);
    } catch (e) {}

    // 3. Thermal Celluloid Burn Whoosh (Sweeping warm analog hiss 550Hz -> 2200Hz -> 380Hz)
    if (this._noiseBuffer) {
      try {
        const nSrc = this.ctx.createBufferSource();
        nSrc.buffer = this._noiseBuffer;

        const bpFilter = this.ctx.createBiquadFilter();
        bpFilter.type = 'bandpass';
        bpFilter.frequency.setValueAtTime(550, t);
        bpFilter.frequency.exponentialRampToValueAtTime(2200, t + 0.35);
        bpFilter.frequency.exponentialRampToValueAtTime(380, t + 0.9);
        bpFilter.Q.value = 2.2;

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.0001, t);
        nGain.gain.linearRampToValueAtTime(0.24, t + 0.22);
        nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);

        nSrc.connect(bpFilter);
        bpFilter.connect(nGain);
        nGain.connect(burnBus);

        nSrc.start(t);
        nSrc.stop(t + 1.0);
      } catch (e) {}
    }

    // Spatial Panning
    if (clientX !== undefined && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
      panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.3;
      burnBus.connect(panner);
      panner.connect(this.sfxBus || this.masterGain);
    } else {
      burnBus.connect(this.sfxBus || this.masterGain);
    }

    // Canyon Hall Reverb Bloom (1.8s tail into Melancholy)
    if (this._reverb) {
      const revSend = this.ctx.createGain();
      revSend.gain.setValueAtTime(0.38, t);
      revSend.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      burnBus.connect(revSend);
      revSend.connect(this._reverb);
    }
  }

  /**
   * Scroll sounds removed per user request.
   */
  playGearScroll() {}

  stopGearScroll() {
    if (this._gearScrollTimeout) {
      clearTimeout(this._gearScrollTimeout);
      this._gearScrollTimeout = null;
    }

    if (this._currentGearGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        const cur = this._currentGearGain.gain.value;
        this._currentGearGain.gain.cancelScheduledValues(t);
        this._currentGearGain.gain.setValueAtTime(Math.max(0.0001, cur), t);
        this._currentGearGain.gain.linearRampToValueAtTime(0.0001, t + 0.12);
      } catch (e) {}
    }

    if (this._currentGearSource) {
      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        this._currentGearSource.stop(t + 0.13);
      } catch (e) {}
      this._currentGearSource = null;
      this._currentGearGain = null;
    }

    if (this._gearAudio) {
      try {
        this._gearAudio.pause();
        this._gearAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  _playProceduralGlitch(clientX, t) {
    if (!this.ctx) return;
    const glitchMaster = this.ctx.createGain();
    glitchMaster.gain.setValueAtTime(0.85, t);

    if (this._noiseBuffer) {
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = this._noiseBuffer;
      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'bandpass';
      hpFilter.frequency.setValueAtTime(2400, t);
      hpFilter.Q.value = 3.0;
      const noiseGate = this.ctx.createGain();
      noiseGate.gain.setValueAtTime(0.0001, t);
      const bursts = [
        { start: 0.00, dur: 0.04, vol: 0.22 },
        { start: 0.06, dur: 0.03, vol: 0.18 },
        { start: 0.11, dur: 0.05, vol: 0.28 },
        { start: 0.19, dur: 0.07, vol: 0.15 },
      ];
      bursts.forEach(({ start, dur, vol }) => {
        noiseGate.gain.setValueAtTime(vol, t + start);
        noiseGate.gain.setValueAtTime(0.0001, t + start + dur);
      });
      noiseSrc.connect(hpFilter);
      hpFilter.connect(noiseGate);
      noiseGate.connect(glitchMaster);
      noiseSrc.start(t);
      noiseSrc.stop(t + 0.35);
    }

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(840, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.24);
    const oscFilter = this.ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(2200, t);
    oscFilter.frequency.exponentialRampToValueAtTime(400, t + 0.22);
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.0001, t);
    oscGain.linearRampToValueAtTime(0.12, t + 0.02);
    oscGain.exponentialRampToValueAtTime(0.0001, t + 0.26);
    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(glitchMaster);
    osc.start(t);
    osc.stop(t + 0.28);

    if (clientX !== undefined && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      const norm = (clientX / (window.innerWidth || 1)) * 2 - 1;
      panner.pan.value = Math.max(-1, Math.min(1, norm)) * 0.3;
      glitchMaster.connect(panner);
      panner.connect(this.sfxBus || this.masterGain);
    } else {
      glitchMaster.connect(this.sfxBus || this.masterGain);
    }

    if (this._reverb) {
      const revSend = this.ctx.createGain();
      revSend.gain.setValueAtTime(0.18, t);
      glitchMaster.connect(revSend);
      revSend.connect(this._reverb);
    }
  }

  enableEffects() {
    this.isMuted = false;
  }

  /**
   * Continuous mouse-driven spatial stereo panning.
   * Smoothly pans the piano score and atmospheric pad across left/right headphone channels.
   */
  updatePan(clientX, width = window.innerWidth) {
    if (!this.ctx || this.isMuted) return;
    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 1) || 1;
    const normalized = (clientX / w) * 2 - 1; // range [-1.0, 1.0]
    const clamped = Math.max(-1, Math.min(1, normalized));
    const t = this.ctx.currentTime;

    // Melancholy Piano & Strings: dynamic spatial panning (up to +/- 0.50)
    if (this._soundtrackPanners.melancholy?.pan) {
      try {
        this._soundtrackPanners.melancholy.pan.setTargetAtTime(clamped * 0.50, t, 0.08);
      } catch (err) {
        this._soundtrackPanners.melancholy.pan.value = clamped * 0.50;
      }
    }

    // Reckoning Soundtrack: dynamic spatial panning (up to +/- 0.50)
    if (this._soundtrackPanners.reckoning?.pan) {
      try {
        this._soundtrackPanners.reckoning.pan.setTargetAtTime(clamped * 0.50, t, 0.08);
      } catch (err) {
        this._soundtrackPanners.reckoning.pan.value = clamped * 0.50;
      }
    }

    // Horizon Orchestral Pad: counter-balanced stereo field for deep 3D immersion
    if (this._soundtrackPanners.horizon?.pan) {
      try {
        this._soundtrackPanners.horizon.pan.setTargetAtTime(-clamped * 0.28, t, 0.12);
      } catch (err) {
        this._soundtrackPanners.horizon.pan.value = -clamped * 0.28;
      }
    }
  }

  // ── 5. Listeners & Builders ────────────────────────────────────────────────

  _attachLifecycleListeners() {
    if (typeof window === 'undefined' || this._listenersAttached) return;
    this._listenersAttached = true;

    // Mouse movement listener for continuous 3D spatial stereo panning
    let rafId = null;
    const onMouseMove = (e) => {
      if (this._isAdminPage()) return;
      if (!this._isPreloadingGh) {
        this.preloadGoldenHour().catch(() => {});
      }
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        this.updatePan(e.clientX, window.innerWidth);
      });
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Global Golden Hour Pointerdown Interaction
    window.addEventListener('pointerdown', (e) => {
      if (this._isAdminPage()) return;
      if (e.target && (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO')) return;
      if (e.target && e.target.closest && (e.target.closest('.site-loader') || e.target.closest('button[aria-label*="background audio"]'))) return;
      this.playGoldenHour(e.clientX);
    }, { passive: true });

    // Video Play / Pause auto-ducking (ONLY for portfolio video reels, never audio)
    document.addEventListener('play', (e) => {
      if (e.target && e.target.tagName === 'VIDEO') {
        this.fadeOutMusic(0.5);
      }
    }, true);

    document.addEventListener('pause', (e) => {
      if (e.target && e.target.tagName === 'VIDEO') {
        this.fadeInMusic(0.8);
      }
    }, true);

    document.addEventListener('ended', (e) => {
      if (e.target && e.target.tagName === 'VIDEO') {
        this.fadeInMusic(0.8);
      }
    }, true);

    window.addEventListener('ritik:video-play', () => this.fadeOutMusic(0.5));
    window.addEventListener('ritik:video-pause', () => this.fadeInMusic(0.8));
    window.addEventListener('ritik:video-stop', () => this.fadeInMusic(0.8));
  }

  _buildReverb(duration = 4.5, decay = 2.6) {
    if (!this.ctx) return null;
    const sr = this.ctx.sampleRate;
    const length = Math.floor(sr * duration);
    const ir = this.ctx.createBuffer(2, length, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const conv = this.ctx.createConvolver();
    conv.buffer = ir;
    return conv;
  }

  _buildPinkNoiseBuffer(seconds = 2.0) {
    if (!this.ctx) return null;
    const sr = this.ctx.sampleRate;
    const length = Math.floor(sr * seconds);
    const buf = this.ctx.createBuffer(1, length, sr);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buf;
  }
}

export const sound = new SoundEngine();
export default sound;
