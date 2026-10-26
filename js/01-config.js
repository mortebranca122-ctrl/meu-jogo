/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   01-config.js — referencias de canvas, CONFIG e modificadores de dificuldade
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');

// ── CONFIG ──────────────────────────────────────────────────────
const CONFIG = { canvas: { width: 0, height: 0 }, difficulty: 'normal', maxWaves: 100, upgradeInterval: 5 };
const Math_PI2 = Math.PI * 2;

const DIFFICULTY_MODS = {
    easy:       { damageMult: 0.6,  healthMult: 1.5, enemySpeedMult: 0.8, scoreMult: 0.7, enemySpawnMult: 0.8 },
    normal:     { damageMult: 1.0,  healthMult: 1.0, enemySpeedMult: 1.0, scoreMult: 1.0, enemySpawnMult: 1.0 },
    hard:       { damageMult: 1.5,  healthMult: 0.8, enemySpeedMult: 1.2, scoreMult: 1.5, enemySpawnMult: 1.2 },
    impossible: { damageMult: 2.0,  healthMult: 0.6, enemySpeedMult: 1.5, scoreMult: 2.5, enemySpawnMult: 1.4 },
    hell:       { damageMult: 2.5,  healthMult: 0.4, enemySpeedMult: 1.8, scoreMult: 3.0, enemySpawnMult: 1.8 }
};
