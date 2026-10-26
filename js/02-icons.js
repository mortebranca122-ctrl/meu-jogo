/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   02-icons.js — icones SVG (upgrades e naves)
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── SVG ICONS ────────────────────────────────────────────────────
const UPGRADE_ICONS = {
    power:       '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    fireRate:    '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    pierce:      '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    ricochet:    '<path d="M4 12h4l3-9 3 18 3-9h4"/>',
    explosive:   '<circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="3"/>',
    homing:      '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    tesla:       '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    aura:        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    stun:        '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    shield:      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    armor:       '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    revive:      '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    heal:        '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    hpUp:        '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    speed:       '<polygon points="5 3 19 12 5 21 5 3"/>',
    dashCharge:  '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    dashCooldown:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    blackHole:   '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    slowField:   '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    comboLock:   '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};

// ── SHIP ICONS ───────────────────────────────────────────────────
const SHIP_ICONS = {
    viper:   '<svg viewBox="0 0 100 100"><defs><linearGradient id="viperGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00f5ff"/><stop offset="100%" style="stop-color:#0088aa"/></linearGradient></defs><polygon points="50,10 80,85 50,70 20,85" fill="url(#viperGrad)" stroke="#00f5ff" stroke-width="2"/><circle cx="50" cy="45" r="8" fill="#001"/><circle cx="50" cy="45" r="5" fill="#00f5ff" opacity="0.5"/></svg>',
    phantom: '<svg viewBox="0 0 100 100"><defs><linearGradient id="phantomGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff00ff"/><stop offset="100%" style="stop-color:#aa00aa"/></linearGradient></defs><polygon points="50,5 90,80 50,60 10,80" fill="url(#phantomGrad)" stroke="#ff00ff" stroke-width="2"/><ellipse cx="50" cy="35" rx="12" ry="6" fill="#001"/></svg>',
    titan:   '<svg viewBox="0 0 100 100"><defs><linearGradient id="titanGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff8800"/><stop offset="100%" style="stop-color:#aa5500"/></linearGradient></defs><polygon points="50,15 75,85 50,75 25,85" fill="url(#titanGrad)" stroke="#ff8800" stroke-width="3"/><circle cx="50" cy="42" r="6" fill="#ff8800" opacity="0.6"/></svg>',
    specter: '<svg viewBox="0 0 100 100"><defs><linearGradient id="specterGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#aa00ff"/><stop offset="100%" style="stop-color:#6600aa"/></linearGradient></defs><polygon points="50,8 85,70 50,55 15,70" fill="url(#specterGrad)" stroke="#aa00ff" stroke-width="2"/></svg>',
    phoenix: '<svg viewBox="0 0 100 100"><defs><linearGradient id="phoenixGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff4400"/><stop offset="50%" style="stop-color:#ffaa00"/><stop offset="100%" style="stop-color:#ff2200"/></linearGradient></defs><polygon points="50,5 85,80 50,65 15,80" fill="url(#phoenixGrad)" stroke="#ff4400" stroke-width="2"/></svg>',
    raven:   '<svg viewBox="0 0 100 100"><defs><linearGradient id="ravenGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8800ff"/><stop offset="100%" style="stop-color:#5500aa"/></linearGradient></defs><polygon points="50,12 88,75 50,58 12,75" fill="url(#ravenGrad)" stroke="#8800ff" stroke-width="2"/><polygon points="15,75 5,90 25,70" fill="#8800ff" opacity="0.6"/><polygon points="85,75 95,90 75,70" fill="#8800ff" opacity="0.6"/></svg>',
    wraith:  '<svg viewBox="0 0 100 100"><defs><linearGradient id="wraithGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00ff88"/><stop offset="100%" style="stop-color:#00aa55"/></linearGradient></defs><polygon points="50,10 78,75 50,62 22,75" fill="url(#wraithGrad)" stroke="#00ff88" stroke-width="2"/></svg>',
    ares:    '<svg viewBox="0 0 100 100"><defs><linearGradient id="aresGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff2200"/><stop offset="100%" style="stop-color:#aa1100"/></linearGradient></defs><polygon points="50,8 82,80 50,68 18,80" fill="url(#aresGrad)" stroke="#ff2200" stroke-width="2"/></svg>',
    nova:    '<svg viewBox="0 0 100 100"><defs><linearGradient id="novaGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffee00"/><stop offset="100%" style="stop-color:#ffaa00"/></linearGradient></defs><polygon points="50,5 85,75 50,60 15,75" fill="url(#novaGrad)" stroke="#ffee00" stroke-width="2"/><circle cx="50" cy="35" r="8" fill="#ffee00" opacity="0.6"/></svg>',
    cipher:  '<svg viewBox="0 0 100 100"><defs><linearGradient id="cipherGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00ffaa"/><stop offset="100%" style="stop-color:#00aa66"/></linearGradient></defs><polygon points="50,12 82,72 50,58 18,72" fill="url(#cipherGrad)" stroke="#00ffaa" stroke-width="2"/></svg>',
    zerath:  '<svg viewBox="0 0 100 100"><defs><linearGradient id="zerathGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff0088"/><stop offset="100%" style="stop-color:#aa0055"/></linearGradient></defs><polygon points="50,8 88,78 50,62 12,78" fill="url(#zerathGrad)" stroke="#ff0088" stroke-width="2"/></svg>',
    orion:   '<svg viewBox="0 0 100 100"><defs><linearGradient id="orionGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00aaff"/><stop offset="100%" style="stop-color:#0066aa"/></linearGradient></defs><polygon points="50,10 80,80 50,65 20,80" fill="url(#orionGrad)" stroke="#00aaff" stroke-width="2"/><line x1="25" y1="60" x2="10" y2="70" stroke="#00aaff" stroke-width="2"/><line x1="75" y1="60" x2="90" y2="70" stroke="#00aaff" stroke-width="2"/></svg>',
    khaos:   '<svg viewBox="0 0 100 100"><defs><linearGradient id="khaosGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6600"/><stop offset="100%" style="stop-color:#aa3300"/></linearGradient></defs><polygon points="50,7 85,78 50,62 15,78" fill="url(#khaosGrad)" stroke="#ff6600" stroke-width="2"/><polygon points="50,25 55,40 45,40" fill="#ff6600"/></svg>',
    eclipse: '<svg viewBox="0 0 100 100"><defs><linearGradient id="eclipseGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6600ff"/><stop offset="100%" style="stop-color:#3300aa"/></linearGradient></defs><circle cx="50" cy="45" r="30" fill="url(#eclipseGrad)" stroke="#6600ff" stroke-width="2"/><circle cx="58" cy="45" r="25" fill="#050510"/></svg>',
    omega:   '<svg viewBox="0 0 100 100"><defs><linearGradient id="omegaGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffffff"/><stop offset="100%" style="stop-color:#aaaaff"/></linearGradient></defs><polygon points="50,5 88,85 50,70 12,85" fill="url(#omegaGrad)" stroke="#ffffff" stroke-width="3"/><circle cx="50" cy="40" r="15" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="50" cy="40" r="8" fill="#ffffff" opacity="0.3"/></svg>'
};

// ── SHIPS ────────────────────────────────────────────────────────
