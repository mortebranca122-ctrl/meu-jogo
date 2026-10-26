/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   04-state.js — estado global do jogo, input, audio e recorde persistente
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── GAME STATE ────────────────────────────────────────────────────
let gameState = 'menu';
let selectedShipIndex = 0;
let selectedWeaponIndex = 0;
let difficulty = 'normal';
let lastTime = 0;
let gameSpeed = 1;
let globalTime = 0;
let animationId = null;

let player = null;
let enemies = [];
let projectiles = [];
let enemyProjectiles = [];
let particles = [];
let floatingTexts = [];
let blackHoles = [];
let mines = [];
let traps = [];
let drones = [];
let chainEffects = [];
let beams = [];

let wave = 1;
let score = 0;
let kills = 0;
let combo = 0;
let comboTimer = 0;
let maxCombo = 0;
let waveTimer = 0;
let waveDelay = 3500;
let betweenWaves = false;
let currentBoss = null;
let bossSpawned = false;
let gameTime = 0;
let minimapVisible = false;

let mouse = { x: 0, y: 0 };
let keys = {};
let shooting = false;

let screenShake = { x: 0, y: 0, intensity: 0 };
let bgStars = [];
let bgNebulas = [];

// FPS tracking
let fpsFrames = 0;
let fpsLastTime = performance.now();
let fpsDisplay = 0;

// Kill feed
let killFeedEntries = [];
const MAX_KILL_FEED = 6;

// Music Player
let audioContext = null;
let gainNode = null;
let currentSong = null;
let currentSongSource = null;
let playlist = [];
let currentSongIndex = 0;
let isPlaying = false;
// Volume persistido entre sessoes (localStorage)
let volume = (() => {
    try {
        const v = parseFloat(localStorage.getItem('viper_v3_volume'));
        return (!isNaN(v) && v >= 0 && v <= 1) ? v : 0.7;
    } catch (e) { return 0.7; }
})();

// ── RECORDE PERSISTENTE (localStorage) ────────────────────────────
const HIGHSCORE_KEY = 'viper_v3_highscore';

function loadStoredNumber(key, fallback) {
    try {
        const v = parseInt(localStorage.getItem(key), 10);
        return isNaN(v) ? fallback : v;
    } catch (e) { return fallback; }
}

let highScore = loadStoredNumber(HIGHSCORE_KEY, 0);

