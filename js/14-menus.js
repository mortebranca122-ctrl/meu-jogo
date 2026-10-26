/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   14-menus.js — menus, selecao de nave, fluxo de jogo, game over e vitoria
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── MENU FUNCTIONS ────────────────────────────────────────────────
function showShipSelect() { document.getElementById('mainMenu').classList.add('hidden'); document.getElementById('shipSelectMenu').classList.remove('hidden'); renderShipGrid(); }
function showControls() { document.getElementById('mainMenu').classList.add('hidden'); document.getElementById('controlsMenu').classList.remove('hidden'); }
function backToMenu() { document.getElementById('shipSelectMenu').classList.add('hidden'); document.getElementById('controlsMenu').classList.add('hidden'); document.getElementById('mainMenu').classList.remove('hidden'); }

function renderShipGrid() {
    const grid = document.getElementById('shipGrid'); grid.innerHTML = '';
    for (let i = 0; i < SHIPS.length; i++) {
        const ship = SHIPS[i];
        const card = document.createElement('div');
        card.className = 'ship-card' + (i === selectedShipIndex ? ' selected' : '');
        card.style.setProperty('--ship-color', ship.color);
        let weaponHTML = '';
        for (let wi = 0; wi < ship.weapons.length; wi++) {
            const w = ship.weapons[wi];
            const isSel = (i === selectedShipIndex && wi === selectedWeaponIndex);
            const isUni = w.isUnique ? ' weapon-btn-unique' : '';
            weaponHTML += '<button class="weapon-btn'+(isSel?' selected':'')+isUni+'" data-ship="'+i+'" data-weapon="'+wi+'">'+w.name+(w.isUnique?' <span class="unique-badge">ÚNICO</span>':'')+'</button>';
        }
        card.innerHTML =
            '<div class="ship-icon-container"><div class="ship-icon">'+ship.icon+'</div></div>' +
            '<div class="ship-name">'+ship.name+'</div><div class="ship-class">'+ship.class+'</div>' +
            '<div class="ship-stats"><div class="ship-stat-item"><div class="ship-stat-label">SPD</div><div class="ship-stat-value">'+ship.stats.speed+'</div></div>' +
            '<div class="ship-stat-item"><div class="ship-stat-label">HP</div><div class="ship-stat-value">'+ship.stats.health+'</div></div></div>' +
            '<div class="ship-special">'+ship.special.name+'</div>' +
            '<div class="weapon-select"><div class="weapon-label">Armas</div>'+weaponHTML+'</div>';
        card.onclick = (e) => {
            if (e.target.classList.contains('weapon-btn') || e.target.closest('.weapon-btn')) {
                const btn = e.target.closest('.weapon-btn') || e.target;
                selectedShipIndex = parseInt(btn.dataset.ship);
                selectedWeaponIndex = parseInt(btn.dataset.weapon);
            } else { selectedShipIndex = i; selectedWeaponIndex = 0; }
            renderShipGrid();
        };
        grid.appendChild(card);
    }
}

// Selecao de dificuldade - ERRO CORRIGIDO: "।click" -> "click"
document.querySelectorAll('.difficulty-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        difficulty = card.dataset.diff;
    });
});

// ── GAME FLOW ─────────────────────────────────────────────────────
function startGame() {
    document.getElementById('shipSelectMenu').classList.add('hidden');
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('minimapContainer').classList.add('show');
    document.getElementById('killFeed').classList.add('show');
    gameState = 'playing';

    player = new Player(selectedShipIndex, selectedWeaponIndex);
    enemies = []; projectiles = []; enemyProjectiles = []; particles = [];
    floatingTexts = []; blackHoles = []; mines = []; traps = [];
    chainEffects = []; drones = []; beams = []; killFeedEntries = [];
    currentBoss = null; bossSpawned = false;
    wave = 1; score = 0; kills = 0; combo = 0; comboTimer = 0; maxCombo = 0;
    betweenWaves = false; gameTime = 0; gameSpeed = 1; minimapVisible = true;

    initBackground();
    updateHealthUI(); updateDashUI(); updateWaveUI(); updateScoreUI(); updateWeaponUI();
    document.getElementById('bossHpContainer').style.display = 'none';
    document.getElementById('killFeed').innerHTML = '';
    spawnWave();
    if (animationId) cancelAnimationFrame(animationId);
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);

    showMusicPlayer();
    if (playlist.length > 0) playSong(0);
}

function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    document.getElementById('pauseMenu').style.display = 'flex';
    if (audioContext && audioContext.state === 'running') audioContext.suspend();
    if (animationId) cancelAnimationFrame(animationId);
}

function resumeGame() {
    gameState = 'playing';
    document.getElementById('pauseMenu').style.display = 'none';
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
}

function restartGame() {
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('upgradePanel').style.display = 'none';
    startGame();
}

function quitToMenu() {
    gameState = 'menu';
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('bossHpContainer').style.display = 'none';
    document.getElementById('upgradePanel').style.display = 'none';
    document.getElementById('minimapContainer').classList.remove('show');
    document.getElementById('killFeed').classList.remove('show');
    document.getElementById('lowHpVignette').classList.remove('active');
    hideMusicPlayer();
    hidePlaylistMenu();
    document.getElementById('mainMenu').classList.remove('hidden');
    updateMenuHighScore();
    player = null; enemies = []; projectiles = []; enemyProjectiles = []; currentBoss = null;
    if (currentSongSource) { try { currentSongSource.stop(); } catch(e) {} }
    isPlaying = false;
    updateMusicPlayerUI();
    initBackground(); lastTime = performance.now();
    animationId = requestAnimationFrame(menuLoop);
}

function gameOver() {
    gameState = 'gameover';
    document.getElementById('finalWave').textContent = wave;
    document.getElementById('finalScore').textContent = Math.floor(score).toLocaleString();
    document.getElementById('finalKills').textContent = kills;
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('lowHpVignette').classList.remove('active');
    commitHighScore(); // salva e exibe recorde
    if (audioContext && audioContext.state === 'running') audioContext.suspend();
    if (animationId) cancelAnimationFrame(animationId);
    // Manter loop de render para background
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameOverLoop);
}

function victory() {
    gameState = 'victory';
    document.getElementById('victoryScore').textContent = Math.floor(score).toLocaleString();
    document.getElementById('victoryKills').textContent = kills;
    const mins = Math.floor(gameTime/60000), secs = Math.floor((gameTime%60000)/1000);
    document.getElementById('victoryTime').textContent = (mins<10?'0':'')+mins+':'+(secs<10?'0':'')+secs;
    document.getElementById('victoryScreen').style.display = 'flex';
    document.getElementById('lowHpVignette').classList.remove('active');
    commitHighScore(); // salva e exibe recorde
    showRadioMessage({ text:"...piloto? Voce... conseguiu. Protocolo completo. A humanidade esta salva.", type:"normal" });
    if (audioContext && audioContext.state === 'running') audioContext.suspend();
    if (animationId) cancelAnimationFrame(animationId);
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameOverLoop);
}

// Loop para telas de fim manterem o background animado
function gameOverLoop(timestamp) {
    if (gameState !== 'gameover' && gameState !== 'victory') return;
    const dt = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;
    ctx.fillStyle = '#020206'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(gameOverLoop);
}
