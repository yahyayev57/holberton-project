const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//Canvas
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

//CSS
(function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
        * { box-sizing: border-box; }
        .ui {
            position: absolute;
            color: white;
            font-size: 35px;
            font-family: "GameFont", monospace;
            user-select: none;
            pointer-events: none;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        }
        #health { top: 10px; left: 15px; }
        #score  { top: 40px; left: 15px; }
        #raid   { top: 70px; left: 15px; }
        #fps    { top: 100px; left: 15px; opacity: .6; }
        #bgToggle {
        position: absolute;
        top: 10px;
        right: 15px;
        padding: 10px 22px;          /* bigger */
        font-family: "GameFont", monospace;
        font-size: 18px;             /* bigger text */
        background: rgba(255,255,255,0.15);
        color: white;
        border: 2px solid rgba(255,255,255,0.35);
        cursor: pointer;
        border-radius: 8px;          /* smoother corners */
        z-index: 10;
    }
    #bgToggle:active { background: rgba(255,255,255,0.3); }
    #pauseBtn {
        position: absolute;
        top: 60px;                   
        right: 15px;
        padding: 10px 22px;
        font-family: "GameFont", monospace;
        font-size: 18px;
        background: rgba(255,255,255,0.15);
        color: white;
        border: 2px solid rgba(255,255,255,0.35);
        cursor: pointer;
        border-radius: 8px;
        z-index: 10;
        display: none;
    }
    #pauseBtn:active { background: rgba(255,255,255,0.3); }
        #joystick {
            position: absolute;
            bottom: 30px;
            left: 30px;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            border: 2px solid rgba(255,255,255,0.2);
            touch-action: none;
            display: none;
        }
        #stick {
            position: absolute;
            width: 60px;
            height: 60px;
            left: 30px;
            top: 30px;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transition: top 0.05s;
        }

        /* ── Shoot button ── */
        #shootBtn {
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 90px;
            height: 90px;
            background: url('./visuals/shoot_button.png') center/cover no-repeat;
            border: none;
            background-color: transparent;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            display: none;
        }
        #blowupGif {
            position: absolute;
            display: none;
            pointer-events: none;
            width: 140px;
            height: 140px;
            transform: translate(-50%, -50%);
            z-index: 20;
        }
        .enemyBlowup {
            position: absolute;
            display: block;
            pointer-events: none;
            width: 70px;
            height: 70px;
            transform: translate(-50%, -50%);
            z-index: 19;
        }
        #gameOver {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: white;
            font-family: "GameFont", monospace;
            z-index: 30;
        }
        #gameOver h1   { font-size: 48px; margin-bottom: 10px; }
        #gameOver .go-info { font-size: 22px; margin: 4px 0; }
        #gameOver button {
            margin-top: 10px;
            padding: 8px 25px;
            font-family: "GameFont", monospace;
            font-size: 16px;
            cursor: pointer;
        }
        #pausePopup {
            position: absolute;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 40;
            background: rgba(0,0,0,0.5);
        }
        #pauseBox {
            background: rgba(20,20,40,0.95);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 12px;
            padding: 30px 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            font-family: "GameFont", monospace;
            color: white;
        }
        #pauseBox h2 { margin: 0 0 8px; font-size: 32px; letter-spacing: 2px; }
        #pauseBox button {
            width: 160px;
            padding: 8px 0;
            font-family: "GameFont", monospace;
            font-size: 16px;
            cursor: pointer;
            background: rgba(255,255,255,0.12);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            transition: background 0.15s;
        }
        #pauseBox button:hover { background: rgba(255,255,255,0.25); }
           .screen {
            position: absolute;
            inset: 0;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: "GameFont", monospace;
            color: white;
            z-index: 50;
        }
        .screen.active { display: flex; }
        #menuScreen { background: transparent; pointer-events: none; }
        #menuScreen .menu-content { pointer-events: all; }
        #menuScreen h1 {
            font-size: clamp(36px, 7vw, 72px);
            text-shadow: 0 0 20px rgba(100,180,255,0.8), 2px 2px 4px #000;
            margin-bottom: 40px;
            letter-spacing: 4px;
        }
        .menu-btn {
            display: block;
            width: 220px;
            padding: 12px 0;
            margin: 8px auto;
            font-family: "GameFont", monospace;
            font-size: 20px;
            text-align: center;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 2px solid rgba(255,255,255,0.35);
            border-radius: 8px;
            cursor: pointer;
            text-shadow: 1px 1px 3px #000;
            transition: background 0.15s, transform 0.1s;
            letter-spacing: 1px;
        }
        .menu-btn:hover  { background: rgba(255,255,255,0.22); transform: scale(1.04); }
        .menu-btn:active { transform: scale(0.97); }
        #diffScreen { background: rgba(0,0,0,0.55); }
        #diffScreen h2 { font-size: 32px; margin-bottom: 30px; letter-spacing: 2px; }
        .diff-row {
            display: flex;
            align-items: center;
            gap: 18px;
            margin: 8px 0;
        }
        .diff-btn {
            width: 160px;
            padding: 10px 0;
            font-family: "GameFont", monospace;
            font-size: 18px;
            color: white;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s;
        }
        .diff-btn:hover { background: rgba(255,255,255,0.22); }
        .diff-btn.easy   { border-color: #4cff88; }
        .diff-btn.medium { border-color: #ffd84c; }
        .diff-btn.hard   { border-color: #ff5555; }
        .diff-hs {
            font-size: 15px;
            color: rgba(255,255,255,0.7);
            min-width: 120px;
            white-space: nowrap;
        }
        #diffBack {
            margin-top: 22px;
            padding: 7px 28px;
            font-family: "GameFont", monospace;
            font-size: 15px;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            cursor: pointer;
        }
        #diffBack:hover { background: rgba(255,255,255,0.22); }
        #htpScreen {
            background: transparent;
            justify-content: flex-start;
            align-items: flex-start;
        }
        #htpBg {
            position: absolute;
            inset: 0;
            object-fit: cover;
            z-index: 0;
        }
        #htpBack {
            position: absolute;
            top: 14px;
            left: 14px;
            z-index: 1;
            padding: 7px 20px;
            font-family: "GameFont", monospace;
            font-size: 15px;
            background: rgba(0,0,0,0.55);
            color: white;
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 6px;
            cursor: pointer;
        }
        #htpBack:hover { background: rgba(0,0,0,0.75); }
    `;
    document.head.appendChild(style);
})();

//HTML
(function injectUI() {
    document.body.insertAdjacentHTML("beforeend", `
        <div id="menuScreen" class="screen active">
            <div class="menu-content" style="text-align:center;">
                <h1>✈ SKY RAID</h1>
                <button class="menu-btn" id="btnPlay">▶  PLAY</button>
                <button class="menu-btn" id="btnHTP"> ?  HOW TO PLAY</button>
                <button class="menu-btn" id="btnExit">✕  EXIT</button>
            </div>
        </div>
        <div id="diffScreen" class="screen">
            <h2>SELECT DIFFICULTY</h2>
            <div class="diff-row">
                <button class="diff-btn easy"   id="btnEasy">EASY</button>
                <span   class="diff-hs"          id="hsEasy"></span>
            </div>
            <div class="diff-row">
                <button class="diff-btn medium"  id="btnMedium">MEDIUM</button>
                <span   class="diff-hs"          id="hsMedium"></span>
            </div>
            <div class="diff-row">
                <button class="diff-btn hard"    id="btnHard">HARD</button>
                <span   class="diff-hs"          id="hsHard"></span>
            </div>
            <button id="diffBack">← Back</button>
        </div>
        <div id="htpScreen" class="screen">
            <img id="htpBg" src="./visuals/htp.png" alt="How To Play">
            <button id="htpBack">← Back</button>
        </div>
        <div id="health" class="ui"></div>
        <div id="score"  class="ui"></div>
        <div id="raid"   class="ui"></div>
        <div id="fps"    class="ui"></div>

        <button id="bgToggle" style="display:none;">🌙 Night</button>
        <button id="pauseBtn">⏸ Pause</button>

        <div id="joystick"><div id="stick"></div></div>
        <button id="shootBtn"></button>

        <img id="blowupGif" src="./visuals/blowup.gif" alt="">

        <div id="pausePopup">
            <div id="pauseBox">
                <h2>PAUSED</h2>
                <button id="btnResume">▶  Resume</button>
                <button id="btnPauseMenu">⌂  Menu</button>
            </div>
        </div>
        <div id="gameOver">
            <h1>GAME OVER</h1>
            <div class="go-info" id="finalScore"></div>
            <div class="go-info" id="highScoreDisplay"></div>
            <button id="restartBtn">Restart</button>
            <button id="goMenuBtn">Menu</button>
        </div>
    `);
})();

//FPS
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;
let lastFrame  = 0;
let fpsCounter = 0;
let fpsTimer   = 0;
let currentFPS = 0;

const assets = [];
function load(src) {
    const img = new Image();
    img.src = src;
    assets.push(img);
    return img;
}

const bgNight   = load("./visuals/night.png");
const bgDay     = load("./visuals/day.jpeg");
const planeImg  = load("./visuals/plane.png");
const enemyImgs = [
    load("./visuals/enemy_1.png"),
    load("./visuals/enemy_2.png"),
    load("./visuals/enemy_3.png")
];
const bulletImg = load("./visuals/bullet.png");
const cloudImg  = load("./visuals/cloud.png");

let isNight   = true;
let currentBg = bgNight;

function playSound(src, vol = 1.0) {
    const s = new Audio(src);
    s.volume = vol;
    s.play().catch(() => {});
}
function playClick()   { playSound("./audio/click.mp3", 0.6); }
function playShoot()   { playSound("./audio/shoot.mp3", 0.45); }
function playHit()     { playSound("./audio/hit.mp3",   0.7); }
function playExplode(vol = 0.9) { playSound("./audio/explode.mp3", vol); }

const blowupEl  = document.getElementById("blowupGif");
let   blowupTid = null;
const BLOWUP_DURATION = 1800;

function showBlowup(sx, sy) {
    blowupEl.style.left    = sx + "px";
    blowupEl.style.top     = sy + "px";
    blowupEl.src = "./visuals/blowup.gif?" + Date.now();
    blowupEl.style.display = "block";
    clearTimeout(blowupTid);
    blowupTid = setTimeout(() => { blowupEl.style.display = "none"; }, BLOWUP_DURATION);
}

function showEnemyBlowup(sx, sy) {
    const img = document.createElement("img");
    img.className  = "enemyBlowup";
    img.src        = "./visuals/blowup.gif?" + Date.now();
    img.style.left = sx + "px";
    img.style.top  = sy + "px";
    document.body.appendChild(img);
    setTimeout(() => img.remove(), BLOWUP_DURATION);
}

const DIFF = {
    easy:   { enemySpeed: 2,   spawnMin: 4000, spawnRand: 3000, enemyCount: [1,2], label: "EASY"   },
    medium: { enemySpeed: 3,   spawnMin: 3000, spawnRand: 2000, enemyCount: [2,3], label: "MEDIUM" },
    hard:   { enemySpeed: 5,   spawnMin: 1800, spawnRand: 1200, enemyCount: [3,5], label: "HARD"   }
};
let currentDiff = "medium";

function getDiffSettings() { return DIFF[currentDiff]; }

function getHighScore(diff) {
    const v = localStorage.getItem("hs_" + diff);
    return v ? parseInt(v) : null;
}
function setHighScore(diff, val) {
    localStorage.setItem("hs_" + diff, val);
}

let currentScreen = "menu";
let menuAnimId    = null;

let menuClouds  = [];
let menuPlane   = { x: -80, y: 0 };
let menuBullets = [];
let menuEnemies = [];
let menuBlowups = []; 
let menuLastEnemy = 0;
let menuAnimTime  = 0;

function showScreen(name) {
    document.getElementById("menuScreen").classList.remove("active");
    document.getElementById("diffScreen").classList.remove("active");
    document.getElementById("htpScreen").classList.remove("active");

    currentScreen = name;

    if (name === "menu") {
        document.getElementById("menuScreen").classList.add("active");
        startMenuAnimation();
        hideGameUI();
    } else if (name === "diff") {
        document.getElementById("diffScreen").classList.add("active");
        refreshDiffHighScores();
        stopMenuAnimation();
    } else if (name === "htp") {
        document.getElementById("htpScreen").classList.add("active");
        stopMenuAnimation();
    } else if (name === "game") {
        stopMenuAnimation();
        showGameUI();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function hideGameUI() {
    ["health","score","raid","fps","bgToggle","pauseBtn","joystick","shootBtn"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

function showGameUI() {
    document.getElementById("health").style.display   = "";
    document.getElementById("score").style.display    = "";
    document.getElementById("raid").style.display     = "";
    document.getElementById("fps").style.display      = "";
    document.getElementById("bgToggle").style.display = "block";
    document.getElementById("pauseBtn").style.display = "block";
    if (navigator.maxTouchPoints > 0) {
        document.getElementById("joystick").style.display  = "block";
        document.getElementById("shootBtn").style.display  = "block";
    }
}

function refreshDiffHighScores() {
    ["easy","medium","hard"].forEach(d => {
        const v = getHighScore(d);
        document.getElementById("hs" + d.charAt(0).toUpperCase() + d.slice(1)).textContent =
            v !== null ? "Best: " + v : "";
    });
}

function startMenuAnimation() {
    menuClouds  = [];
    menuBullets = [];
    menuEnemies = [];
    menuBlowups = [];
    menuPlane   = { x: -80, y: canvas.height * 0.45 };
    menuLastEnemy = 0;

    if (menuAnimId) cancelAnimationFrame(menuAnimId);
    menuAnimTime = performance.now();
    menuAnimFrame(menuAnimTime);
}

function stopMenuAnimation() {
    if (menuAnimId) { cancelAnimationFrame(menuAnimId); menuAnimId = null; }
}

function menuAnimFrame(ts) {
    menuAnimId = requestAnimationFrame(menuAnimFrame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentBg, 0, 0, canvas.width, canvas.height);

    const elapsed = ts - menuAnimTime;

    if (Math.random() < 0.01) {
        menuClouds.push({ x: canvas.width, y: Math.random() * canvas.height, spd: 1 + Math.random() * 1.5 });
    }
    menuClouds.forEach(c => { c.x -= c.spd; });
    menuClouds = menuClouds.filter(c => c.x > -140);
    menuClouds.forEach(c => {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(cloudImg, c.x, c.y, 120, 60);
        ctx.globalAlpha = 1;
    });

    menuPlane.x += 2.5;
    if (menuPlane.x > canvas.width + 100) menuPlane.x = -80;
    ctx.drawImage(planeImg, menuPlane.x, menuPlane.y, 60, 60);

    if (ts - menuLastEnemy > 3000) {
        menuLastEnemy = ts;
        menuEnemies.push({
            x: canvas.width + 20,
            y: menuPlane.y + (Math.random() * 60 - 30),
            type: Math.floor(Math.random() * 3),
            dir: 1
        });
        menuBullets.push({ x: menuPlane.x + 60, y: menuPlane.y + 25 });
    }

    menuBullets.forEach(b => { b.x += 8; });
    menuBullets = menuBullets.filter(b => b.x < canvas.width + 40);

    for (let i = menuEnemies.length - 1; i >= 0; i--) {
        const e = menuEnemies[i];
        e.x -= 2.5;
        ctx.drawImage(enemyImgs[e.type], e.x, e.y, 50, 50);

        for (let j = menuBullets.length - 1; j >= 0; j--) {
            const b = menuBullets[j];
            if (b.x < e.x + 50 && b.x + 20 > e.x &&
                b.y < e.y + 50 && b.y + 10 > e.y) {
                menuBlowups.push({ x: e.x + 25, y: e.y + 25, born: ts });
                menuEnemies.splice(i, 1);
                menuBullets.splice(j, 1);
                break;
            }
        }
        if (menuEnemies[i] && e.x < -70) menuEnemies.splice(i, 1);
    }

    menuBullets.forEach(b => {
        ctx.drawImage(bulletImg, b.x, b.y, 20, 10);
    });

    menuBlowups = menuBlowups.filter(bw => ts - bw.born < 500);
    menuBlowups.forEach(bw => {
        const age  = (ts - bw.born) / 500;
        const r    = 35 * (1 - age);
        ctx.save();
        ctx.globalAlpha = 1 - age;
        const grad = ctx.createRadialGradient(bw.x, bw.y, 0, bw.x, bw.y, r);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(0.3, "#ffb300");
        grad.addColorStop(1, "rgba(255,60,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bw.x, bw.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

document.getElementById("btnPlay").addEventListener("click", () => {
    playClick();
    showScreen("diff");
});
document.getElementById("btnHTP").addEventListener("click", () => {
    playClick();
    showScreen("htp");
});
document.getElementById("btnExit").addEventListener("click", () => {
    playClick();
    window.close();
    document.body.innerHTML = '<div style="color:white;font-family:monospace;text-align:center;margin-top:20vh;font-size:24px;">Thanks for playing!<br>You can close this tab.</div>';
});

document.getElementById("htpBack").addEventListener("click", () => {
    playClick();
    showScreen("menu");
});

document.getElementById("diffBack").addEventListener("click", () => {
    playClick();
    showScreen("menu");
});

["easy","medium","hard"].forEach(d => {
    const id = "btn" + d.charAt(0).toUpperCase() + d.slice(1);
    document.getElementById(id).addEventListener("click", () => {
        playClick();
        currentDiff = d;
        startGame();
    });
});

let player, bullets, enemies, clouds;
let score, raidCount;
let gameOver, paused, playerVisible;
let raidTimer = null;

function resetGame() {
    player        = { x: 100, y: canvas.height / 2, health: 100 };
    bullets       = [];
    enemies       = [];
    clouds        = [];
    score         = 0;
    raidCount     = 0;
    gameOver      = false;
    paused        = false;
    playerVisible = true;
    blowupEl.style.display = "none";
    clearTimeout(blowupTid);
    document.querySelectorAll(".enemyBlowup").forEach(el => el.remove());
}

let cameraY = 0;

const keys = {};
window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if ((e.code === "Space" || e.code === "ControlLeft" || e.code === "ControlRight") && !e.repeat) {
        shoot();
    }
    if (e.code === "Escape" && currentScreen === "game" && !gameOver) {
        togglePause();
    }
    if (["Space","ArrowUp","ArrowDown"].includes(e.code)) e.preventDefault();
});
window.addEventListener("keyup", e => { keys[e.code] = false; });

function getKeyboardMoveY() {
    if (keys["KeyW"] || keys["ArrowUp"])   return -1;
    if (keys["KeyS"] || keys["ArrowDown"]) return  1;
    return 0;
}

//Controls
let joystickMoveY = 0;
let dragging      = false;

const joystick = document.getElementById("joystick");
const stick    = document.getElementById("stick");
const shootBtn = document.getElementById("shootBtn");

function handleJoystick(clientY) {
    const rect = joystick.getBoundingClientRect();
    let y = clientY - rect.top - 60;
    y = Math.max(-40, Math.min(40, y));
    stick.style.top    = (30 + y) + "px";
    joystickMoveY      = y / 40;
}

joystick.addEventListener("mousedown", () => dragging = true);
window.addEventListener("mouseup",  () => { dragging = false; stick.style.top = "30px"; joystickMoveY = 0; });
window.addEventListener("mousemove", e => { if (dragging) handleJoystick(e.clientY); });

joystick.addEventListener("touchstart", e => { e.preventDefault(); dragging = true; }, { passive: false });
window.addEventListener("touchend",   () => { dragging = false; stick.style.top = "30px"; joystickMoveY = 0; });
window.addEventListener("touchmove",  e => { if (dragging) handleJoystick(e.touches[0].clientY); });

function getTotalMoveY() {
    const kb = getKeyboardMoveY();
    return kb !== 0 ? kb : joystickMoveY;
}

shootBtn.addEventListener("mousedown", shoot);
shootBtn.addEventListener("touchstart", e => { e.preventDefault(); shoot(); }, { passive: false });

setInterval(() => {
    if (currentScreen !== "game") return;
    clouds.push({ x: canvas.width, y: Math.random() * canvas.height, speed: 1 + Math.random() * 2 });
}, 1500);

//Raid
function scheduleRaid() {
    const s = getDiffSettings();
    const delay = s.spawnMin + Math.random() * s.spawnRand;
    raidTimer = setTimeout(doRaid, delay);
}

function doRaid() {
    if (gameOver) return;
    const s = getDiffSettings();
    const [minC, maxC] = s.enemyCount;
    const count = minC + Math.floor(Math.random() * (maxC - minC + 1));
    raidCount++;
    for (let i = 0; i < count; i++) {
        enemies.push({
            x:    canvas.width + i * 80,
            y:    Math.random() * (canvas.height - 60),
            type: Math.floor(Math.random() * 3),
            dir:  Math.random() > 0.5 ? 1 : -1
        });
    }
    scheduleRaid();
}

function shoot() {
    if (gameOver || paused || currentScreen !== "game") return;
    bullets.push({ x: player.x + 60, y: player.y + 20 });
    playShoot();
    if (typeof triggerShake === "function") triggerShake(5);
}

document.getElementById("bgToggle").addEventListener("click", () => {
    isNight   = !isNight;
    currentBg = isNight ? bgNight : bgDay;
    document.getElementById("bgToggle").textContent = isNight ? "🌙 Night" : "☀️ Day";
});

document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("btnResume").addEventListener("click", () => { playClick(); resumeGame(); });
document.getElementById("btnPauseMenu").addEventListener("click", () => {
    playClick();
    paused = false;
    document.getElementById("pausePopup").style.display = "none";
    gameOver = true; 
    clearTimeout(raidTimer);
    
    document.getElementById("gameOver").style.display = "none";
    showScreen("menu");
});

function togglePause() {
    if (gameOver) return;
    paused ? resumeGame() : pauseGame();
}

function pauseGame() {
    paused = true;
    document.getElementById("pausePopup").style.display = "flex";
}

function resumeGame() {
    paused = false;
    document.getElementById("pausePopup").style.display = "none";
    lastFrame = performance.now();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    showScreen("game");
    resetGame();
    cameraY = 0;
    raidTimer = setTimeout(doRaid, 1500);
    lastFrame = 0;
    requestAnimationFrame(gameLoop);
}

document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("gameOver").style.display = "none";
    startGame();
});

document.getElementById("goMenuBtn").addEventListener("click", () => {
    document.getElementById("gameOver").style.display = "none";
    showScreen("menu");
});

function gameLoop(timestamp) {
    if (paused) return; 

    if (timestamp - lastFrame < FRAME_TIME) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrame = timestamp;

    fpsCounter++;
    if (timestamp > fpsTimer + 1000) {
        currentFPS = fpsCounter;
        fpsCounter = 0;
        fpsTimer   = timestamp;
    }

    const moveY = getTotalMoveY();
    const spd   = getDiffSettings().enemySpeed;
    const shake = (typeof getShakeOffset === "function") ? getShakeOffset() : { x: 0, y: 0 };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(shake.x, shake.y);

    ctx.drawImage(currentBg, 0, 0, canvas.width, canvas.height);

    cameraY += (player.y - cameraY) * 0.08;
    ctx.translate(0, -cameraY + canvas.height / 2 - 100);

    player.y += moveY * 5;
    player.y  = Math.max(0, Math.min(canvas.height - 60, player.y));
    if (playerVisible) ctx.drawImage(planeImg, player.x, player.y, 60, 60);

    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += 8;
        ctx.drawImage(bulletImg, b.x, b.y, 20, 10);

        let hit = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];
            if (b.x < e.x + 50 && b.x + 20 > e.x &&
                b.y < e.y + 50 && b.y + 10 > e.y) {
                const esx = e.x + 25;
                const esy = (e.y + 25) - cameraY + canvas.height / 2 - 100;
                showEnemyBlowup(esx, esy);
                playExplode(0.45);
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 10;
                hit = true;
                break;
            }
        }
        if (!hit && b.x > canvas.width) bullets.splice(i, 1);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x -= spd;
        e.y += e.dir * 2;
        if (e.y < 0 || e.y > canvas.height - 50) e.dir *= -1;
        ctx.drawImage(enemyImgs[e.type], e.x, e.y, 50, 50);

        if (e.x < player.x + 50 && e.x + 50 > player.x &&
            e.y < player.y + 50 && e.y + 50 > player.y) {
            player.health -= 10;
            playHit();
            if (typeof triggerDamageFlash === "function") triggerDamageFlash();
            enemies.splice(i, 1);
            continue;
        }
        if (e.x < -60) enemies.splice(i, 1);
    }

    clouds.forEach(c => {
        c.x -= c.speed;
        ctx.globalAlpha = 0.4;
        ctx.drawImage(cloudImg, c.x, c.y, 120, 60);
        ctx.globalAlpha = 1;
    });

    ctx.restore();

    if (typeof drawDamageFlash === "function") drawDamageFlash(ctx, canvas);

    document.getElementById("health").innerText = "❤ " + player.health;
    document.getElementById("score").innerText  = "Score: "  + score;
    document.getElementById("raid").innerText   = "Raid: "   + raidCount;
    document.getElementById("fps").innerText    = "FPS: "    + currentFPS;

    if (player.health <= 0 && !gameOver) { triggerDeath(); return; }

    requestAnimationFrame(gameLoop);
}

function triggerDeath() {
    gameOver      = true;
    playerVisible = false;
    clearTimeout(raidTimer);

    const sx = player.x + 30;
    const sy = (player.y + 30) - cameraY + canvas.height / 2 - 100;
    showBlowup(sx, sy);
    playExplode(0.9);
    if (typeof triggerShake === "function") triggerShake(20);

    const startTime = performance.now();

    function deathLoop(ts) {
        if (ts - lastFrame >= FRAME_TIME) {
            lastFrame = ts;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const sh = (typeof getShakeOffset === "function") ? getShakeOffset() : { x: 0, y: 0 };
            ctx.save();
            ctx.translate(sh.x, sh.y);
            ctx.drawImage(currentBg, 0, 0, canvas.width, canvas.height);
            ctx.translate(0, -cameraY + canvas.height / 2 - 100);
            const spd = getDiffSettings().enemySpeed;
            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i];
                e.x -= spd;
                e.y += e.dir * 2;
                if (e.y < 0 || e.y > canvas.height - 50) e.dir *= -1;
                ctx.drawImage(enemyImgs[e.type], e.x, e.y, 50, 50);
                if (e.x < -60) enemies.splice(i, 1);
            }
            clouds.forEach(c => {
                c.x -= c.speed;
                ctx.globalAlpha = 0.35;
                ctx.drawImage(cloudImg, c.x, c.y, 120, 60);
                ctx.globalAlpha = 1;
            });
            ctx.restore();
            if (typeof drawDamageFlash === "function") drawDamageFlash(ctx, canvas);
        }
        if (ts - startTime < BLOWUP_DURATION) requestAnimationFrame(deathLoop);
        else endGame();
    }

    requestAnimationFrame(deathLoop);
}
function endGame() {
    const prev = getHighScore(currentDiff) || 0;
    if (score > prev) setHighScore(currentDiff, score);
    const best = getHighScore(currentDiff);

    document.getElementById("finalScore").innerText      = "Score: " + score;
    document.getElementById("highScoreDisplay").innerText = "Best (" + DIFF[currentDiff].label + "): " + best;
    document.getElementById("gameOver").style.display    = "flex";
    hideGameUI();
}

(function boot() {
    let loaded = 0;
    function checkDone() {
        loaded++;
        if (loaded >= assets.length) {
            showScreen("menu");
        }
    }
    assets.forEach(img => {
        if (img.complete) checkDone();
        else { img.onload = checkDone; img.onerror = checkDone; }
    });
})();
