/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   16-engine.js — redimensionamento, menuLoop e gameLoop
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

function resizeCanvas() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    if (bgStars.length === 0) initBackground();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ── MENU LOOP ─────────────────────────────────────────────────────
function menuLoop(timestamp) {
    if (gameState !== 'menu' && gameState !== 'shipselect' && gameState !== 'controls') return;
    const now = performance.now();
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;
    updateFPS(now);
    ctx.fillStyle = '#020206'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    animationId = requestAnimationFrame(menuLoop);
}

// ── MAIN GAME LOOP ────────────────────────────────────────────────
function gameLoop(timestamp) {
    if (gameState !== 'playing' && gameState !== 'upgrade') return;

    const dt = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;
    if (gameState === 'playing') gameTime += dt;
    updateFPS(timestamp);

    // Screen shake
    ctx.save();
    ctx.translate(screenShake.x, screenShake.y);

    // Clear
    ctx.fillStyle = '#020206';
    ctx.fillRect(-20, -20, canvas.width+40, canvas.height+40);

    // Background
    drawBackground();

    if (gameState === 'playing') {
        // Update
        player.update(dt);
        if (shooting) player.shoot();

        for (let i = enemies.length-1; i >= 0; i--) {
            if (enemies[i]) enemies[i].update(dt);
        }
        // Remover inimigos mortos
        for (let i = enemies.length-1; i >= 0; i--) {
            if (enemies[i] && enemies[i].hp <= 0) enemies.splice(i, 1);
        }

        if (currentBoss) { currentBoss.update(dt); updateBossUI(); }

        updateProjectiles(dt);
        updateParticles();
        updateBlackHoles(dt);
        updateMines(dt);
        updateChainEffects(dt);
        updateFloatingTexts(dt);
        updateDrones(dt);
        updateBeams(dt);
        updateScreenShake();

        // Combo decay
        if (Date.now() - comboTimer > 3000 && combo > 0) { combo = Math.max(0, combo-1); comboTimer = Date.now(); }

        // Colisão jogador-inimigo
        if (player && !player.invincible && !player.isDashing) {
            for (const e of enemies) {
                if (e && e.hp > 0 && dist(player.x, player.y, e.x, e.y) < player.size + e.size) player.takeDamage(e.damage*0.5);
            }
        }

        // Draw ordem correta
        drawBlackHoles();
        drawMines();
        drawBeams();
        drawProjectiles();
        for (const e of enemies) { if (e && e.hp > 0) e.draw(); }
        if (currentBoss) currentBoss.draw();
        if (player) player.draw();
        drawDrones();
        drawParticles();
        drawChainEffects();
        drawFloatingTexts();

        // HUD
        updateScoreUI();
        updateComboUI();
        checkWaveComplete();
        drawMinimap();
        updateLowHpVignette();

        // Ability UI
        if (player && player.shipData.special.cooldown > 0) {
            const pct = Math.max(0, 100 - (player.specialTimer / player.shipData.special.cooldown)*100);
            document.getElementById('abilityFill').style.width = pct + '%';
        }
    } else {
        // Estado upgrade: desenhar mundo congelado
        drawBlackHoles(); drawMines(); drawBeams(); drawProjectiles();
        for (const e of enemies) { if (e && e.hp > 0) e.draw(); }
        if (currentBoss) currentBoss.draw();
        if (player) player.draw();
        drawDrones(); drawParticles(); drawChainEffects(); drawFloatingTexts();
        drawMinimap();
    }

    ctx.restore();
    animationId = requestAnimationFrame(gameLoop);
}
