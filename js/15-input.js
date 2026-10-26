/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   15-input.js — mouse, teclado e eventos do player de musica
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── INPUT ─────────────────────────────────────────────────────────
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mousedown', e => { if (e.button === 0 && gameState === 'playing') shooting = true; });
window.addEventListener('mouseup',   e => { if (e.button === 0) shooting = false; });
window.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'Escape') { if (gameState === 'playing') pauseGame(); else if (gameState === 'paused') resumeGame(); }
    if (e.key === ' ' && gameState === 'playing') { e.preventDefault(); if (player) player.dash(); }
    if (gameState === 'playing' && player && ['1','2','3'].includes(e.key)) player.switchWeapon(parseInt(e.key)-1);
    if (e.key.toLowerCase() === 'q' && gameState === 'playing') { if (player) player.useSpecial(); }
    if (e.key.toLowerCase() === 'm') { document.getElementById('musicPlayer').classList.toggle('show'); }
    if (e.key === 'Tab' && gameState === 'playing') { e.preventDefault(); minimapVisible = !minimapVisible; document.getElementById('minimapContainer').classList.toggle('show', minimapVisible); }
    if (document.getElementById('musicPlayer').classList.contains('show')) {
        if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'k') { if (isPlaying) pauseSong(); else resumeSong(); }
        if (e.key.toLowerCase() === 'n') { playNextSong(); }
        if (e.key.toLowerCase() === 'b') { playPrevSong(); }
    }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
canvas.addEventListener('contextmenu', e => e.preventDefault());

// Music player buttons
document.getElementById('playPauseBtn').addEventListener('click', () => {
    if (!playlist.length) return;
    if (isPlaying) pauseSong(); else resumeSong();
});
document.getElementById('nextSongBtn').addEventListener('click', () => { if (playlist.length > 0) playNextSong(); });
document.getElementById('prevSongBtn').addEventListener('click', () => { if (playlist.length > 0) playPrevSong(); });
document.getElementById('playlistBtn').addEventListener('click', showPlaylistMenu);

// File input para playlist
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    let loadedCount = 0;
    for (const file of files) {
        if (file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')) {
            try {
                if (!audioContext) initAudioContext();
                const songData = await loadSong(file);
                playlist.push(songData);
                loadedCount++;
            } catch (error) { console.error("Erro ao carregar música:", file.name, error); }
        }
    }
    e.target.value = '';
    if (loadedCount > 0) {
        updateMusicPlayerUI();
        if (gameState === 'menu' && playlist.length > 0 && !isPlaying) playSong(0);
    }
});
