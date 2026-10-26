/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   17-init.js — inicializacao (window load) e audio na primeira interacao
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── INIT ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    resizeCanvas();
    initBackground();
    lastTime = performance.now();
    updateMenuHighScore();
    animationId = requestAnimationFrame(menuLoop);

    // Inicializar AudioContext na primeira interação
    const interactionHandler = () => {
        initAudioContext();
        document.removeEventListener('click', interactionHandler);
        document.removeEventListener('keydown', interactionHandler);
        document.removeEventListener('touchstart', interactionHandler);
    };
    document.addEventListener('click', interactionHandler);
    document.addEventListener('keydown', interactionHandler);
    document.addEventListener('touchstart', interactionHandler);

    updateMusicPlayerUI();
    document.getElementById('musicPlayer').style.display = 'block';
});
