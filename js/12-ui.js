/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   12-ui.js — atualizacao de HUD, radio, painel de upgrade e recorde
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── UI ────────────────────────────────────────────────────────────
function updateHealthUI() {
    if (!player) return;
    const pct = clamp((player.hp/player.maxHp)*100, 0, 100);
    document.getElementById('healthFill').style.width = pct + '%';
    document.getElementById('healthValue').textContent = Math.ceil(player.hp);
    updateLowHpVignette();
}

function updateDashUI() {
    if (!player) return;
    const c = document.getElementById('dashContainer'); c.innerHTML = '';
    for (let i = 0; i < player.maxDashCharges; i++) {
        const d = document.createElement('div');
        d.className = 'dash-charge' + (i < player.dashCharges ? '' : ' empty');
        c.appendChild(d);
    }
}

function updateWeaponUI() {
    if (!player) return;
    const c = document.getElementById('weaponSlots'); c.innerHTML = '';
    for (let i = 0; i < player.shipData.weapons.length; i++) {
        const w = player.shipData.weapons[i];
        const slot = document.createElement('div');
        slot.className = 'weapon-slot' + (i === player.currentWeapon ? ' active' : '');
        let iconPath = '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>';
        if (w.type === 'beam')     iconPath = '<path d="M12 2v20M2 12h20"/>';
        if (w.type === 'explosive' || w.type === 'nuke') iconPath = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>';
        if (w.type === 'spread')   iconPath = '<path d="M12 5v14M5 12h14"/>';
        if (w.type === 'heal')     iconPath = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>';
        slot.innerHTML = '<span class="weapon-slot-key">'+(i+1)+'</span><svg class="weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'+iconPath+'</svg>';
        c.appendChild(slot);
    }
    document.getElementById('abilityContainer').style.display = player.shipData.special.cooldown > 0 ? 'block' : 'none';
    document.getElementById('abilityLabel').textContent = player.shipData.special.name;
}

function updateWaveUI() { document.getElementById('waveNum').textContent = wave; document.getElementById('maxWaveNum').textContent = CONFIG.maxWaves; document.getElementById('waveProgress').style.width = (wave/CONFIG.maxWaves)*100+'%'; }

function updateScoreUI() { document.getElementById('scoreValue').textContent = Math.floor(score).toLocaleString(); document.getElementById('killsValue').textContent = kills; }

function updateComboUI() {
    const el = document.getElementById('comboDisplay');
    if (combo > 1) { el.textContent = 'x'+combo; el.classList.add('active'); if (combo > 20) el.classList.add('super'); else el.classList.remove('super'); }
    else { el.classList.remove('active','super'); }
}

function updateBossUI() {
    if (currentBoss) {
        document.getElementById('bossHpContainer').style.display = 'block';
        document.getElementById('bossName').textContent = currentBoss.name;
        document.getElementById('bossHpFill').style.width = Math.max(0, (currentBoss.hp/currentBoss.maxHp)*100)+'%';
        // Atualizar fases
        const phasesEl = document.getElementById('bossPhases');
        phasesEl.innerHTML = '';
        for (let i = 1; i <= currentBoss.maxPhases; i++) {
            const dot = document.createElement('div');
            dot.className = 'boss-phase-dot' + (i <= currentBoss.phase ? ' active' : '');
            phasesEl.appendChild(dot);
        }
    }
    else { document.getElementById('bossHpContainer').style.display = 'none'; }
}

function showBossWarning() {
    const el = document.getElementById('bossWarning');
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); addScreenShake(10);
}

function showRadioMessage(msg) {
    const el = document.getElementById('radioMessage');
    document.getElementById('radioText').textContent = msg.text;
    el.className = 'show';
    if (msg.type === 'warning') el.classList.add('warning');
    if (msg.type === 'danger')  el.classList.add('danger');
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => { el.className = ''; }, 5000);
}

function showUpgradePanel() {
    gameState = 'upgrade';
    const grid = document.getElementById('upgradeGrid');
    const available = UPGRADES.slice().sort(() => Math.random()-0.5).slice(0,3);
    grid.innerHTML = '';
    for (const up of available) {
        const card = document.createElement('div');
        card.className = 'upgrade-card ' + up.category;
        card.innerHTML =
            '<div class="upgrade-icon-container"><svg class="upgrade-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            (UPGRADE_ICONS[up.icon] || '') + '</svg></div>' +
            '<div class="upgrade-name">'+up.name+'</div>' +
            '<div class="upgrade-desc">'+up.description+'</div>' +
            '<div class="upgrade-category">'+up.category+'</div>';
        card.onclick = () => {
            up.effect(player);
            document.getElementById('upgradePanel').style.display = 'none';
            gameState = 'playing';
            updateHealthUI(); updateDashUI();
            createParticles(player.x, player.y, '#aa00ff', 25, 1.5, 0.8);
        };
        grid.appendChild(card);
    }
    document.getElementById('upgradePanel').style.display = 'block';
}

// ── RECORDE: helpers de interface ─────────────────────────────────
function updateMenuHighScore() {
    const el = document.getElementById('menuHighScore');
    if (el) el.textContent = highScore.toLocaleString('pt-BR');
}

function commitHighScore() {
    const finalScore = Math.floor(score);
    const isNewRecord = finalScore > highScore;
    if (isNewRecord) {
        highScore = finalScore;
        try { localStorage.setItem(HIGHSCORE_KEY, String(highScore)); } catch (e) {}
    }
    const elGO = document.getElementById('finalRecord');
    if (elGO) elGO.textContent = highScore.toLocaleString('pt-BR');
    const elVT = document.getElementById('victoryRecord');
    if (elVT) elVT.textContent = highScore.toLocaleString('pt-BR');
    const badgeGO = document.getElementById('newRecordBadge');
    if (badgeGO) badgeGO.style.display = isNewRecord ? 'block' : 'none';
    const badgeVT = document.getElementById('newRecordBadgeVictory');
    if (badgeVT) badgeVT.style.display = isNewRecord ? 'block' : 'none';
    updateMenuHighScore();
}

