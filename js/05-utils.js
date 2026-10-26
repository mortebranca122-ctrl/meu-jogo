/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   05-utils.js — funcoes utilitarias (lerp, clamp, dist, rand...)
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── UTILS ─────────────────────────────────────────────────────────
const lerp  = (a,b,t) => a + (b-a)*t;
const clamp = (v,min,max) => Math.max(min, Math.min(max, v));
const dist  = (x1,y1,x2,y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);
const angle = (x1,y1,x2,y2) => Math.atan2(y2-y1, x2-x1);
const rand  = (min,max) => Math.random()*(max-min)+min;
const randInt = (min,max) => Math.floor(rand(min,max+1));
const choose  = arr => arr[randInt(0,arr.length-1)];
