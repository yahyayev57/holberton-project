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
