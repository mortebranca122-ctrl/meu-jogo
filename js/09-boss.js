/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   09-boss.js — classe Boss: 5 chefes principais + 10 rotativos, fases e padroes
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── BOSS CLASS ────────────────────────────────────────────────────
class Boss {
    constructor(def, waveNum) {
        this.name = def.name; this.pattern = def.pattern; this.isFinal = def.isFinal || false;
        this.x = canvas.width/2; this.y = -100; this.targetY = 120; this.entering = true;
        const dm = DIFFICULTY_MODS[difficulty];
        const scale = 1 + (waveNum||1) * 0.02;
        const bossScale = difficulty === 'hell' ? 1.3 : 1.0;
        this.maxHp = def.hp * scale * dm.healthMult * bossScale; this.hp = this.maxHp;
        this.color = def.color; this.size = def.pattern === 'segmented' ? 25 : 50;
        this.angle = 0; this.speed = 1;
        this.timer = 0; this.attackTimer = 0; this.hitFlash = 0;
        this.phase = 1; this.maxPhases = def.phases || 3;
        this.segments = [];
        if (def.pattern === 'segmented' && def.segments) {
            for (let i = 0; i < def.segments; i++) this.segments.push({ x: this.x, y: this.y + i*30, hp: (def.hp/def.segments)*scale*bossScale });
        }
        this.shieldActive = def.pattern === 'shield';
        this.shieldHp = 300*scale*bossScale; this.shieldMax = 300*scale*bossScale; this.shieldRegenTimer = 0;
    }

    update(dt) {
        if (this.hitFlash > 0) this.hitFlash -= dt;
        this.timer += dt; this.attackTimer += dt; this.angle += 0.015;
        const hpPct = this.hp / this.maxHp;
        if (hpPct < 0.2 && this.phase < 5) { this.phase = 5; this.changePhase(); }
        else if (hpPct < 0.4 && this.phase < 4) { this.phase = 4; this.changePhase(); }
        else if (hpPct < 0.6 && this.phase < 3) { this.phase = 3; this.changePhase(); }
        else if (hpPct < 0.8 && this.phase < 2) { this.phase = 2; this.changePhase(); }
        if (this.entering) { this.y += 2; if (this.y >= this.targetY) { this.entering = false; this.y = this.targetY; } return; }
        this.x = canvas.width/2 + Math.cos(this.timer/800)*200;
        this.y = this.targetY + Math.sin(this.timer/400)*40;
        if (this.pattern === 'shield' && !this.shieldActive) {
            this.shieldRegenTimer += dt;
            if (this.shieldRegenTimer >= 4000) { this.shieldActive = true; this.shieldHp = this.shieldMax; this.shieldRegenTimer = 0; createParticles(this.x, this.y, '#4444ff', 20, 1.5, 0.8); }
        }
        if (!player) return;
        const attackRate = this.isFinal ? Math.max(100, 350 - this.phase*40) : 550;
        if (this.attackTimer > attackRate) { this.attack(); this.attackTimer = 0; }
        for (let i = 0; i < this.segments.length; i++) {
            const target = i === 0 ? this : this.segments[i-1];
            this.segments[i].x += (target.x - this.segments[i].x) * 0.12;
            this.segments[i].y += (target.y - this.segments[i].y) * 0.12;
        }
    }

    changePhase() { addScreenShake(15); createParticles(this.x, this.y, this.color, 30, 2, 1); showRadioMessage({ text:'ALERTA: '+this.name+' mudou para fase '+this.phase+'!', type:"danger" }); }

    attack() {
        const pCount = 6 + this.phase*2;
        switch (this.pattern) {
            case 'spiral': case 'spiralFast': case 'vortex':
                for (let i = 0; i < pCount; i++) { const a = this.angle+(i/pCount)*Math.PI*2; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*4.5, vy: Math.sin(a)*4.5, damage: 15, size: 7, color: this.color }); } break;
            case 'segmented':
                if (player) { const a = angle(this.x, this.y, player.x, player.y); enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*6, vy: Math.sin(a)*6, damage: 18, size: 8, color: this.color }); }
                if (this.segments.length > 2) { const seg = this.segments[randInt(1, this.segments.length-1)]; mines.push({ x: seg.x, y: seg.y, damage: 18, timer: 3000, size: 8, color: '#ffaa00' }); }
                break;
            case 'gravity':
                if (Math.random() < 0.3) blackHoles.push({ x: rand(100, canvas.width-100), y: rand(150, canvas.height-150), timer: 3000, strength: 1.5, size: 12, enemy: true });
                for (let i = 0; i < 4; i++) { const a = (i/4)*Math.PI*2+this.angle; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*3.5, vy: Math.sin(a)*3.5, damage: 25, size: 10, color: this.color }); }
                break;
            case 'shield':
                if (this.shieldActive) { for (let i = 0; i < 8; i++) { const a = (i/8)*Math.PI*2; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*5, vy: Math.sin(a)*5, damage: 14, size: 6, color: this.color }); } }
                else { for (let i = 0; i < 16; i++) { const a = (i/16)*Math.PI*2; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*6.5, vy: Math.sin(a)*6.5, damage: 10, size: 5, color: '#ff0044' }); } }
                break;
            case 'final': this.finalBossAttack(); break;
            default:
                for (let i = 0; i < pCount; i++) { const a = this.angle+(i/pCount)*Math.PI*2; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*4, vy: Math.sin(a)*4, damage: 12, size: 6, color: this.color }); }
        }
    }

    finalBossAttack() {
        if (!player) return;
        switch (this.phase) {
            case 1: for (let i = 0; i < 12; i++) { const a = (i/12)*Math.PI*2+this.angle; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*5, vy: Math.sin(a)*5, damage: 14, size: 6, color: '#ffffff' }); } break;
            case 2: for (let i = 0; i < 16; i++) { const a = (i/16)*Math.PI*2-this.angle*2; enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a)*4, vy: Math.sin(a)*4, damage: 12, size: 5, color: '#ff00ff' }); } break;
            case 3: if (enemies.length < 10) enemies.push(new Enemy('boss_minion', this.x+rand(-50,50), this.y+50, wave)); break;
            case 4:
                for (let i = 0; i < 5; i++) {
                    enemyProjectiles.push({ x: rand(0,canvas.width), y: 0,             vx: 0, vy:  7, damage: 20, size: 8, color: '#ff8800' });
                    enemyProjectiles.push({ x: rand(0,canvas.width), y: canvas.height, vx: 0, vy: -7, damage: 20, size: 8, color: '#ff8800' });
                }
                break;
            case 5: { const a = angle(this.x, this.y, player.x, player.y); for (let i = 0; i < 3; i++) enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(a+rand(-0.1,0.1))*8, vy: Math.sin(a+rand(-0.1,0.1))*8, damage: 10, size: 4, color: '#ffff00' }); break; }
        }
    }

    takeDamage(amount) {
        if (this.shieldActive && this.pattern === 'shield') {
            this.shieldHp -= amount; this.hitFlash = 30;
            createFloatingText(this.x, this.y-40, Math.floor(amount).toString(), '#4444ff');
            if (this.shieldHp <= 0) { this.shieldActive = false; this.shieldRegenTimer = 0; createParticles(this.x, this.y, '#4444ff', 30, 2, 1); addScreenShake(10); }
            return;
        }
        this.hp -= amount; this.hitFlash = 50;
        createFloatingText(this.x, this.y-50, Math.floor(amount).toString(), '#ff0088');
        if (this.segments.length > 0) {
            const last = this.segments[this.segments.length-1];
            last.hp -= amount;
            if (last.hp <= 0) { this.segments.pop(); createExplosion(last.x, last.y, this.color, 0.8); }
        }
        if (this.hp <= 0) this.die();
    }

    die() {
        createExplosion(this.x, this.y, this.color, 4);
        // Múltiplas explosões para drama
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createExplosion(this.x + rand(-60,60), this.y + rand(-40,40), this.color, 1.5);
                addScreenShake(8);
            }, i * 200);
        }
        if (player) score += 10000 * player.scoreMult;
        kills++; currentBoss = null; bossSpawned = false;
        document.getElementById('bossHpContainer').style.display = 'none';
        // Kill feed de boss
        if (player) addKillFeedEntry(this.name, player.weaponData.name, 10000 * (player ? player.scoreMult : 1), true);
        if (this.isFinal) victory();
    }

    draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        const col = this.hitFlash > 0 ? '#ffffff' : this.color;
        // Escudo do boss
        if (this.shieldActive && this.pattern === 'shield') {
            ctx.strokeStyle = '#4444ff'; ctx.lineWidth = 3; ctx.shadowColor = '#4444ff'; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.arc(0,0,this.size+20,0,Math.PI*2); ctx.stroke();
            // Indicador de HP do escudo
            const shieldPct = this.shieldHp / this.shieldMax;
            ctx.strokeStyle = 'rgba(68,68,255,' + (0.3+shieldPct*0.5) + ')'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(0,0,this.size+25, -Math.PI/2, -Math.PI/2 + Math.PI*2*shieldPct); ctx.stroke();
        }
        ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.rotate(this.angle);
        ctx.beginPath();
        if (this.isFinal) {
            for (let i = 0; i < 6; i++) {
                const a = (i/6)*Math.PI*2;
                const r = this.size+Math.sin(Date.now()/200+i)*5;
                if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
                else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
            }
            ctx.closePath();
        }
        else { ctx.arc(0,0,this.size,0,Math.PI*2); }
        ctx.fill();
        ctx.fillStyle = '#000'; ctx.shadowBlur = 0; ctx.beginPath(); ctx.arc(0,0,this.size*0.5,0,Math.PI*2); ctx.fill();
        if (this.isFinal) {
            const pc = ['#00ffff','#00ff88','#ffff00','#ff8800','#ff0044'];
            ctx.fillStyle = pc[this.phase-1]||'#fff'; ctx.shadowColor = pc[this.phase-1]||'#fff'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(0,0,10+Math.sin(Date.now()/150)*3,0,Math.PI*2); ctx.fill();
            // Raios emanando
            for (let i = 0; i < 8; i++) {
                const ra = (i/8)*Math.PI*2 + Date.now()/300;
                ctx.strokeStyle = pc[this.phase-1]||'#fff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
                ctx.beginPath(); ctx.moveTo(Math.cos(ra)*12, Math.sin(ra)*12);
                ctx.lineTo(Math.cos(ra)*(this.size+15), Math.sin(ra)*(this.size+15)); ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
        ctx.shadowBlur = 0;
        ctx.restore();
        for (const seg of this.segments) {
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(seg.x, seg.y, this.size*0.8, 0, Math.PI*2); ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
}
