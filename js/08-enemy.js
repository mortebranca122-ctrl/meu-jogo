/* ═════════════════════════════════════════════════════════════════
   PROTOCOLO VIPER v3.0 — SUPREME EDITION
   08-enemy.js — classe Enemy: comportamentos, dano e desenho
   ⚠ Os modulos compartilham o escopo global: mantenha a ordem numerica.
   ═════════════════════════════════════════════════════════════════ */

// ── ENEMY CLASS ───────────────────────────────────────────────────
class Enemy {
    constructor(type, x, y, waveNum) {
        const def = ENEMY_TYPES[type] || ENEMY_TYPES['basic'];
        const dm = DIFFICULTY_MODS[difficulty];
        const waveScale = 1 + (waveNum||1) * 0.05;
        const enemySpawnMult = dm.enemySpawnMult || 1.0;

        this.type = type;
        this.x = x; this.y = y;
        this.maxHp = def.hp * waveScale * dm.healthMult; this.hp = this.maxHp;
        this.baseSpeed = def.speed * (1+(waveNum||1)*0.01) * dm.enemySpeedMult * enemySpawnMult;
        this.speed = this.baseSpeed;
        this.damage = def.damage * dm.damageMult;
        this.color = def.color; this.size = def.size; this.score = def.score;
        this.shootRate = def.shootRate; this.lastShot = 0;
        this.behavior = def.behavior;
        this.projectileSpeed = def.projectileSpeed || 8;
        this.mineInterval = def.mineInterval || 3000; this.lastMine = 0;
        this.hasOrbiters = def.hasOrbiters || false; this.orbiterAngle = 0;
        this.splits = def.splits || false; this.healRadius = def.healRadius || 0;
        this.enemyName = def.name || type;
        this.angle = 0;
        this.spawnAnim = 0.1;
        this.hitFlash = 0;
        this.stunned = false; this.stunTimer = 0;
        this.burnTimer = 0; this.burnDamage = 0;
    }

    update(dt) {
        if (this.spawnAnim < 1) {
            this.spawnAnim = Math.min(1, this.spawnAnim + dt * 0.003);
            if (player) {
                const dx = player.x - this.x, dy = player.y - this.y;
                const d = Math.max(1, Math.sqrt(dx*dx + dy*dy));
                this.x += (dx/d)*this.baseSpeed*0.5*gameSpeed; this.y += (dy/d)*this.baseSpeed*0.5*gameSpeed;
                this.angle = Math.atan2(dy, dx);
            }
            if (Math.random() < 0.2) createParticles(this.x, this.y, this.color, 1, 0.15, 0.3);
            return;
        }
        if (this.burnTimer > 0) {
            this.burnTimer -= dt;
            if (Math.random() < 0.1) createParticles(this.x, this.y, '#ff4400', 1, 0.3, 0.3);
            this.hp -= this.burnDamage * dt / 1000;
            if (this.hp <= 0) { this.die(); return; }
        }
        if (this.hitFlash > 0) this.hitFlash -= dt;
        if (this.stunned) { this.stunTimer -= dt; if (this.stunTimer <= 0) this.stunned = false; return; }
        if (!player) return;

        // Speed modifiers
        if (player.hasSlowField && dist(this.x, this.y, player.x, player.y) < player.slowFieldRadius) {
            this.speed = this.baseSpeed * (1 - player.slowAmount);
        } else if (gameSpeed < 1) {
            this.speed = this.baseSpeed * gameSpeed;
        } else {
            this.speed = this.baseSpeed;
        }

        // Black hole pull
        for (const bh of blackHoles) {
            const d = dist(this.x, this.y, bh.x, bh.y);
            if (d < 150 && d > 5) { const f = 3/d; this.x += (bh.x-this.x)*f; this.y += (bh.y-this.y)*f; }
        }

        const dx = player.x - this.x, dy = player.y - this.y;
        const d = Math.max(1, Math.sqrt(dx*dx + dy*dy));
        this.angle = Math.atan2(dy, dx);

        switch (this.behavior) {
            case 'chase':
                if (d > 30) { this.x += (dx/d)*this.speed*gameSpeed; this.y += (dy/d)*this.speed*gameSpeed; }
                break;
            case 'kamikaze':
                if (d > 1) { this.x += (dx/d)*this.speed*1.3*gameSpeed; this.y += (dy/d)*this.speed*1.3*gameSpeed; }
                if (d < this.size + player.size) { this.hp = 0; player.takeDamage(this.damage); createExplosion(this.x, this.y, this.color, 1.5); }
                break;
            case 'keepDistance':
                if (d < 200 && d > 1) { this.x -= (dx/d)*this.speed*gameSpeed; this.y -= (dy/d)*this.speed*gameSpeed; }
                else if (d > 300 && d > 1) { this.x += (dx/d)*this.speed*gameSpeed; this.y += (dy/d)*this.speed*gameSpeed; }
                break;
            case 'gravity':
                if (d < 200 && d > 1) { const f = 3/d; player.x += dx*f; player.y += dy*f; }
                break;
            case 'mineLayer':
                if (d > 1) { this.x += (dx/d)*this.speed*0.8*gameSpeed; this.y += (dy/d)*this.speed*0.8*gameSpeed; }
                if (Date.now() - this.lastMine > this.mineInterval) { this.lastMine = Date.now(); mines.push({ x: this.x, y: this.y, damage: this.damage, timer: 5000, size: 10, color: this.color }); }
                break;
            case 'healer':
                if (d < 250 && d > 1) { this.x -= (dx/d)*this.speed*gameSpeed; this.y -= (dy/d)*this.speed*gameSpeed; }
                for (const e of enemies) {
                    if (e !== this && dist(this.x, this.y, e.x, e.y) < this.healRadius) {
                        e.hp = Math.min(e.maxHp, e.hp + 0.5);
                        if (Math.random() < 0.05) chainEffects.push({ x1: this.x, y1: this.y, x2: e.x, y2: e.y, life: 0.2, color: '#88ff88' });
                    }
                }
                break;
            default:
                if (d > 30 && d > 1) { this.x += (dx/d)*this.speed*gameSpeed; this.y += (dy/d)*this.speed*gameSpeed; }
        }

        this.x = clamp(this.x, -50, canvas.width + 50);
        this.y = clamp(this.y, -50, canvas.height + 50);

        if (this.hasOrbiters) this.orbiterAngle += dt * 0.003;
        if (this.shootRate > 0 && Date.now() - this.lastShot > this.shootRate) { this.lastShot = Date.now(); this.shoot(); }
    }

    shoot() {
        if (!player) return;
        const count = this.type === 'tank' ? 3 : 1;
        for (let i = 0; i < count; i++) {
            const sp = count > 1 ? (i-1)*0.3 : 0;
            enemyProjectiles.push({ x: this.x, y: this.y, vx: Math.cos(this.angle+sp)*this.projectileSpeed, vy: Math.sin(this.angle+sp)*this.projectileSpeed, damage: this.damage, size: 5, color: this.color });
        }
    }

    takeDamage(amount, sourceX, sourceY) {
        this.hp -= amount; this.hitFlash = 80;
        if (player && Math.random() < player.stunChance) { this.stunned = true; this.stunTimer = 1000; createFloatingText(this.x, this.y-this.size-10, 'STUN', '#ffff00', 10); }
        createFloatingText(this.x, this.y-this.size, Math.floor(amount).toString(), '#ffffff', 11);
        if (player && player.teslaChains > 0 && sourceX !== undefined) this.chainLightning(sourceX, sourceY, this.x, this.y, player.teslaChains, player.teslaRange);
        if (this.hp <= 0) this.die();
    }

    chainLightning(x1, y1, x2, y2, chains, range) {
        chainEffects.push({ x1, y1, x2, y2, life: 0.3, color: '#00ffff' });
        if (chains > 0) {
            let closest = null, closestDist = range;
            for (const e of enemies) {
                if (e !== this && e.hp > 0) { const d = dist(x2, y2, e.x, e.y); if (d < closestDist) { closestDist = d; closest = e; } }
            }
            if (closest) closest.takeDamage(player.damage * player.damageMult * 0.5, x2, y2);
        }
    }

    die() {
        createExplosion(this.x, this.y, this.color);
        const gained = this.score * (1 + combo*0.1) * (player ? player.scoreMult : 1);
        score += gained; kills++; combo++; comboTimer = Date.now();
        if (combo > maxCombo) maxCombo = combo;

        // Kill feed
        if (player) {
            addKillFeedEntry(this.enemyName, player.weaponData.name, gained, false);
        }

        if (this.splits && this.size > 10) {
            for (let i = 0; i < 2; i++) {
                const n = new Enemy('basic', this.x+rand(-20,20), this.y+rand(-20,20), wave);
                n.size = this.size*0.6; n.maxHp = this.maxHp*0.5; n.hp = n.maxHp; n.color = this.color; n.spawnAnim = 0.8;
                enemies.push(n);
            }
        }
        if (player && Math.random() < player.blackHoleChance) blackHoles.push({ x: this.x, y: this.y, timer: 2000, strength: 2, size: 15, enemy: false });
    }

    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.spawnAnim, this.spawnAnim);
        const col = this.hitFlash > 0 ? '#ffffff' : this.color;
        ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
        if (this.stunned) {
            ctx.strokeStyle = '#ffff00'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0,0,this.size+6,0,Math.PI*2); ctx.stroke();
            // Estrelas de stun
            for (let i = 0; i < 3; i++) {
                const sa = Date.now()/200 + (i/3)*Math.PI*2;
                ctx.fillStyle = '#ffff00';
                ctx.beginPath(); ctx.arc(Math.cos(sa)*(this.size+10), Math.sin(sa)*(this.size+10), 2, 0, Math.PI*2); ctx.fill();
            }
        }
        // Queimando
        if (this.burnTimer > 0) {
            ctx.strokeStyle = '#ff4400'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(0,0,this.size+3,0,Math.PI*2); ctx.stroke();
            ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        if (this.type === 'tank') { ctx.rect(-this.size, -this.size, this.size*2, this.size*2); }
        else if (this.type === 'sniper') { ctx.moveTo(this.size,0); ctx.lineTo(-this.size,-this.size*0.6); ctx.lineTo(-this.size,this.size*0.6); ctx.closePath(); }
        else if (this.type === 'kamikaze') {
            // Forma de diamante
            ctx.moveTo(0, -this.size); ctx.lineTo(this.size, 0); ctx.lineTo(0, this.size); ctx.lineTo(-this.size, 0); ctx.closePath();
        }
        else if (this.type === 'gravity') {
            // Anel
            ctx.arc(0,0,this.size,0,Math.PI*2);
        }
        else { ctx.arc(0,0,this.size,0,Math.PI*2); }
        ctx.fill();

        ctx.fillStyle = '#000'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(0,0,this.size*0.4,0,Math.PI*2); ctx.fill();
        // Olho
        ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(0,0,this.size*0.2,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;

        if (this.hasOrbiters) {
            for (let i = 0; i < 3; i++) {
                const a = this.orbiterAngle + (i/3)*Math.PI*2;
                ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 8;
                ctx.beginPath(); ctx.arc(Math.cos(a)*(this.size+12), Math.sin(a)*(this.size+12), 6, 0, Math.PI*2); ctx.fill();
            }
            ctx.shadowBlur = 0;
        }

        if (this.hp < this.maxHp && this.spawnAnim >= 1) {
            ctx.shadowBlur = 0; ctx.rotate(-this.angle);
            ctx.fillStyle = '#333'; ctx.fillRect(-15, -this.size-10, 30, 3);
            ctx.fillStyle = this.hp > this.maxHp*0.3 ? '#ff0044' : '#ff0000'; ctx.fillRect(-15, -this.size-10, 30*(this.hp/this.maxHp), 3);
        }
        ctx.restore();
    }
}
