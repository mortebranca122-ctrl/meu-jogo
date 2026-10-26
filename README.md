<div align="center">

# ▲ PROTOCOLO VIPER v3.0 — SUPREME EDITION

**Shoot'em up espacial neon · 15 naves · 5 dificuldades · 100 ondas · 15 chefes**

*Projeto organizado em arquivos separados por linguagem (HTML / CSS / JS)*

</div>

---

## 🚀 Como jogar

1. Descompacte o `.zip` mantendo as pastas juntas.
2. Dê **duplo clique em `index.html`** — o jogo abre direto no navegador (não precisa de servidor).
3. Escolha a **dificuldade**, a **nave**, a **arma** e sobreviva às 100 ondas!

> 💡 Internet é usada apenas para carregar as fontes (Google Fonts); sem conexão o jogo funciona igual, com fontes do sistema.

---

## 📂 Estrutura do projeto

```
protocolo-viper-v3/
├── index.html                → estrutura da página (canvas, HUD, menus)
│
├── css/                      → estilos separados por área
│   ├── base.css              → reset, variáveis de tema (cores neon), scrollbar
│   ├── hud.css               → HUD em jogo: vida, escudo, dash, armas, habilidade
│   ├── combat-ui.css         → boss, rádio C.A.S.S.I., minimapa, kill feed, dano, ondas
│   ├── menus.css             → menu principal, dificuldade, naves, upgrades, fim de jogo
│   ├── music.css             → player de música e playlist
│   └── responsive.css        → adaptação para telas menores
│
└── js/                       → módulos em ordem de carregamento (escopo global compartilhado)
    ├── 01-config.js          → canvas, CONFIG e modificadores de dificuldade
    ├── 02-icons.js           → ícones SVG (upgrades e naves)
    ├── 03-data.js            → naves, upgrades, inimigos, chefes e mensagens da C.A.S.S.I.
    ├── 04-state.js           → estado global + recorde/volume persistentes
    ├── 05-utils.js           → funções utilitárias (lerp, clamp, dist, rand…)
    ├── 06-effects.js         → partículas, screen shake, kill feed, fundo estelar
    ├── 07-player.js          → classe Player (movimento, dash, tiro, especiais)
    ├── 08-enemy.js           → classe Enemy (comportamentos e desenho)
    ├── 09-boss.js            → classe Boss (5 principais + 10 rotativos, fases)
    ├── 10-combat-objects.js  → projéteis, minas, buracos negros, drones, feixes
    ├── 11-waves.js           → sistema de ondas e spawn de chefes
    ├── 12-ui.js              → HUD, rádio, painel de upgrade e recorde
    ├── 13-music.js           → player de música (playlist local .mp3)
    ├── 14-menus.js           → menus, fluxo de jogo, game over e vitória
    ├── 15-input.js           → mouse, teclado e eventos do player
    ├── 16-engine.js          → resize, menuLoop e gameLoop
    └── 17-init.js            → inicialização e desbloqueio de áudio
```

⚠️ **Atenção ao editar:** os módulos JS compartilham o escopo global e dependem da **ordem numérica** de carregamento declarada no `index.html`.

---

## 🎮 Controles

| Ação | Tecla |
|---|---|
| Mover | `W` `A` `S` `D` |
| Mirar | Mouse |
| Disparar | Clique esquerdo (segurar) |
| Dash | `Espaço` |
| Trocar arma | `1` `2` `3` |
| Habilidade especial | `Q` |
| Pausar | `Esc` |
| Player de música | `M` (abrir) · `P`/`K` play-pause · `N` próxima · `B` anterior |
| Minimapa | `Tab` |

---

## 🛸 As 15 naves

| Nave | Classe | Habilidade |
|---|---|---|
| VIPER MK-I | Equilibrada | Overdrive — velocidade e cadência por 5s |
| PHANTOM X | Ágil/Stealth | Phase Shift — invencibilidade e atravessa inimigos |
| TITAN ZERO | Tanque Pesado | Fortress Mode — escudo impenetrável 4s |
| SPECTER | Assassin | Shadow Step — teleporta atrás do alvo próximo |
| PHOENIX | Regeneração | Rebirth — revive com 50% HP (1x) |
| RAVEN | Drone Master | Drone Swarm — invoca 4 drones de combate |
| WRAITH | Lifesteal | Soul Harvest — drena 20% de vida em área |
| ARES | Berserker | Blood Rage — dano +100% abaixo de 30% HP |
| NOVA | Area Denial | Supernova — explosão massiva 360° |
| CIPHER | Hacker | System Crash — dano + stuno em todos |
| ZERATH | Void Walker | Dimension Rift — portal de projéteis |
| ORION | Sniper | Orbital Strike — laser orbital devastador |
| KHAOS | Randomizer | Entropy Wave — efeito aleatório poderoso |
| ECLIPSE | Time Manipulator | Time Stop — para o tempo por 3s |
| OMEGA | Ultimate | Omega Protocol — todos os buffs de uma vez |

Cada nave tem **3 armas** (as marcadas com **ÚNICO** são exclusivas) e você pode trocar de arma durante o jogo com `1`/`2`/`3`.

---

## 👾 Inimigos e chefes

- **8 tipos de inimigos:** Drone Básico, Kamikaze, Sniper, Tanque, Poço Gravitacional, Lançador de Minas, Escudo Orbital, Divisor, Curandeiro e minions.
- **Chefes principais:** Sentinel Core (onda 10) · Mecha Serpent (25) · Gravity Overlord (50) · Aegis Titan (75) · **NEON TITAN** (100).
- **10 chefes rotativos** a cada 10 ondas: Splitter Prime, Hive Mind, Phantom Wraith, Meteor Lord, Vortex Master, Laser Eye, Vampire Count, Clone Master, Spiral Guard e Time Keeper.

## ⚡ 24 upgrades

A cada 5 ondas você escolhe 1 de 3 upgrades sorteados entre ofensivos (Poder+, Multi-Tiro, Explosivo…), tesla (Corrente Tesla, Campo Elétrico, Paralisia), defensivos (Escudo, Blindagem, Regeneração…), mobilidade (Velocidade+, Dash Extra…) e táticos (Buraco Negro, Combo Lock, Score x2…).

## 🌡️ Dificuldades

| | Dano inimigo | Sua vida | Pontuação |
|---|---|---|---|
| EASY | −40% | +50% | ×0,7 |
| NORMAL | base | base | ×1,0 |
| HARD | +50% | −20% | ×1,5 |
| IMPOSSIBLE | +100% | −40% | ×2,5 |
| HELL | +150% | −60% | ×3,0 (+30% inimigos) |

---

## 🎵 Player de música

Aperte `M` ou use o painel no canto inferior direito, clique em **☰** e adicione seus `.mp3` — tudo roda localmente no navegador, com volume ajustável e persistente.

---

## ✨ Melhorias desta versão organizada

- 📂 **Separação completa por linguagem** — 1 arquivo → `index.html` + 6 CSS + 17 JS, todos comentados e documentados.
- 🏆 **Recorde persistente** — salvo automaticamente no navegador (`localStorage`), exibido no menu principal e nas telas de fim de jogo, com badge **“★ NOVO RECORDE ★”**.
- 🔊 **Volume persistente** — o ajuste do player agora é lembrado entre sessões.
- 🐛 **Correção de bug** — trocar/pausar música não pula mais faixas indevidamente (fix no evento `onended` do AudioBufferSource).
- ✍️ **Português corrigido** — todos os textos receberam acentuação própria (Eliminações, Pontuação, Música, Área…) sem tocar nos nomes técnicos.
- 🎨 **Polido visualmente** — coluna “Recorde” nas telas de fim de jogo, grid de estatísticas adaptável, favicon neon e meta tags.
