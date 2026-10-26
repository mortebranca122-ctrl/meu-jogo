/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   11-waves.js — sistema de ondas e spawn de chefes
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── WAVE SPAWNING ─────────────────────────────────────────────────
function spawnWave() {
    let count = 4 + Math.floor(wave * 1.2);
    const dm = DIFFICULTY_MODS[difficulty];
    count = Math.ceil(count * (dm.enemySpawnMult || 1.0));

    const types = Object.keys(ENEMY_TYPES);
    const maxTypeIndex = Math.min(types.length, 1 + Math.floor(wave/8));
    for (let i = 0; i < count; i++) {
        const type = types[randInt(0, maxTypeIndex-1)];
        const side = randInt(0,3);
        let x, y;
        if (side === 0) { x = rand(0,canvas.width); y = -30; }
        else if (side === 1) { x = canvas.width+30; y = rand(0,canvas.height); }
        else if (side === 2) { x = rand(0,canvas.width); y = canvas.height+30; }
        else { x = -30; y = rand(0,canvas.height); }
        enemies.push(new Enemy(type, x, y, wave));
    }

    let bossDef = null;
    for (const bd of BOSS_DEFS) { if (bd.wave === wave) { bossDef = bd; break; } }
    if (!bossDef && !bossSpawned && wave % 10 === 0 && wave !== 100) {
        bossDef = Object.assign({}, ROTATION_BOSSES[Math.floor(wave/10) % ROTATION_BOSSES.length]);
    }
    if (bossDef && !bossSpawned) {
        showBossWarning();
        const capturedWave = wave;
        setTimeout(() => {
            if (gameState === 'playing' && wave === capturedWave) {
                currentBoss = new Boss(bossDef, wave);
                bossSpawned = true;
                updateBossUI();
            }
        }, 3500);
    }

    if (CASSI_MESSAGES[wave]) setTimeout(() => { showRadioMessage(CASSI_MESSAGES[wave]); }, 1000);
    showWaveAnnounce(wave);
    updateWaveUI();
}


function checkWaveComplete() {
    if (enemies.length === 0 && !currentBoss && !betweenWaves) {
        betweenWaves = true; waveTimer = Date.now();
        if (wave % CONFIG.upgradeInterval === 0 && wave < CONFIG.maxWaves) setTimeout(() => { if (gameState === 'playing') showUpgradePanel(); }, 1500);
    }
    if (betweenWaves && Date.now() - waveTimer > waveDelay) {
        betweenWaves = false; wave++;
        if (wave > CONFIG.maxWaves) { victory(); return; }
        bossSpawned = false; spawnWave();
    }
}
