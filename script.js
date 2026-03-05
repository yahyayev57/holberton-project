const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Şəkillər
const minionImg = new Image();
minionImg.src = 'minion.png';

// Səslər
const jumpSound = new Audio('jump.mp3');
const scoreSound = new Audio('score.mp3');
const gameOverSound = new Audio('gameover.mp3');
const winSound = new Audio('win.mp3');
const bonusSound = new Audio('bonus.mp3');

// Oyun dəyişənləri
let gameState = 'START';
let score = 0;
const winningScore = 100;
let gravity = 0.6;

let obstacles = [];
let clouds = [];
let mushrooms = [];

let frameCount = 0;

let player = {
    x: 50,
    y: 330,
    width: 50,
    height: 70,
    velocityY: 0,
    jumpForce: -13,
    jumpCount: 0
};

// BULUD
class Cloud {
    constructor() {
        this.x = canvas.width + Math.random() * 200;
        this.y = Math.random() * 150;
        this.width = 60 + Math.random() * 40;
        this.height = 30 + Math.random() * 20;
        this.speed = 1 + Math.random() * 2;
    }

    update() {
        this.x -= this.speed;

        if (this.x + this.width < 0) {
            this.x = canvas.width + Math.random() * 200;
            this.y = Math.random() * 150;
        }
    }

    draw() {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.height/2, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/3, this.y - 10, this.height/2, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/1.5, this.y, this.height/2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// başlanğıc buludlar
for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud());
}

function resetGame(){

    score = 0;
    obstacles = [];
    mushrooms = [];
    frameCount = 0;

    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.jumpCount = 0;

    gameState = 'PLAYING';
}

function update(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    clouds.forEach(cloud=>{
        cloud.update();
        cloud.draw();
    });

    if(gameState === 'START'){
        drawStartScreen();
    }

    else if(gameState === 'PLAYING'){

        frameCount++;

        // Fizika
        player.velocityY += gravity;
        player.y += player.velocityY;

        if(player.y > canvas.height - player.height){
            player.y = canvas.height - player.height;
            player.velocityY = 0;
            player.jumpCount = 0;
        }

        // Maneə yarat
        if(frameCount % 100 === 0){

            let randomHeight = Math.random() < 0.5 ? 40 : 60;

            obstacles.push({
                x:canvas.width,
                y:canvas.height - randomHeight,
                width:25,
                height:randomHeight,
                speed:6,
                passed:false
            });
        }

        // Göbələk yarat
        if(frameCount % 250 === 0){

            let tooClose = obstacles.some(obs =>
                Math.abs(obs.x - canvas.width) < 60
            );

            if(!tooClose){
                mushrooms.push({
                    x:canvas.width,
                    y:canvas.height - 80,
                    width:30,
                    height:30,
                    speed:6,
                    color:['red','purple','orange'][Math.floor(Math.random()*3)]
                });
            }
        }

        // Maneələr
        for(let i = obstacles.length -1; i>=0; i--){

            obstacles[i].x -= obstacles[i].speed;

            if(obstacles[i].x + obstacles[i].width < player.x && !obstacles[i].passed){

                score++;
                obstacles[i].passed = true;

                scoreSound.currentTime = 0;
                scoreSound.play().catch(()=>{});

                if(score >= winningScore){
                    gameState = 'WIN';

                    winSound.currentTime = 0;
                    winSound.play().catch(()=>{});
                }
            }

            if(
                player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y
            ){

                gameState = 'GAMEOVER';

                gameOverSound.currentTime = 0;
                gameOverSound.play().catch(()=>{});
            }

            if(obstacles[i].x < -50){
                obstacles.splice(i,1);
            }else{
                ctx.fillStyle = '#FF4136';
                ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
            }
        }

        // Göbələklər
        for(let i = mushrooms.length-1; i>=0; i--){

            mushrooms[i].x -= mushrooms[i].speed;

            ctx.fillStyle = mushrooms[i].color;

            ctx.beginPath();
            ctx.arc(
                mushrooms[i].x + mushrooms[i].width/2,
                mushrooms[i].y + mushrooms[i].height/2,
                mushrooms[i].width/2,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Toqquşma
            if(
                player.x < mushrooms[i].x + mushrooms[i].width &&
                player.x + player.width > mushrooms[i].x &&
                player.y < mushrooms[i].y + mushrooms[i].height &&
                player.y + player.height > mushrooms[i].y
            ){

                score += 2;

                bonusSound.currentTime = 0;
                bonusSound.play().catch(()=>{});

                mushrooms.splice(i,1);
            }

            if(mushrooms[i] && mushrooms[i].x < -40){
                mushrooms.splice(i,1);
            }
        }

        // Minion
        if(minionImg.complete){
            ctx.drawImage(minionImg,player.x,player.y,player.width,player.height);
        }

        // Score
        ctx.fillStyle='black';
        ctx.font='bold 20px Arial';
        ctx.textAlign='left';
        ctx.fillText("Score: "+score,20,35);
    }

    else if(gameState === 'GAMEOVER'){
        drawGameOverScreen();
    }

    else if(gameState === 'WIN'){
        drawWinScreen();
    }

    requestAnimationFrame(update);
}

function drawStartScreen(){

    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle='white';
    ctx.textAlign='center';

    ctx.font='bold 40px Arial';
    ctx.fillText('MINION RUN',canvas.width/2,canvas.height/2);

    ctx.font='20px Arial';
    ctx.fillText('Goal: 100 Points | Press SPACE',canvas.width/2,canvas.height/2+40);
}

function drawGameOverScreen(){

    ctx.fillStyle='rgba(139,0,0,0.8)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle='white';
    ctx.textAlign='center';

    ctx.font='bold 45px Arial';
    ctx.fillText('GAME OVER!',canvas.width/2,canvas.height/2-20);

    ctx.font='25px Arial';
    ctx.fillText('Score: '+score,canvas.width/2,canvas.height/2+20);

    ctx.font='18px Arial';
    ctx.fillText('Press SPACE',canvas.width/2,canvas.height/2+70);
}

function drawWinScreen(){

    ctx.fillStyle='rgba(0,128,0,0.8)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle='gold';
    ctx.textAlign='center';

    ctx.font='bold 50px Arial';
    ctx.fillText('BANANA! YOU WIN!',canvas.width/2,canvas.height/2+10);
}

document.addEventListener('keydown',(e)=>{

    if(e.code === 'Space'){

        if(gameState === 'START' || gameState === 'GAMEOVER' || gameState === 'WIN'){
            resetGame();
        }

        else if(gameState === 'PLAYING' && player.jumpCount < 2){

            player.velocityY = player.jumpForce;
            player.jumpCount++;

            jumpSound.currentTime = 0;
            jumpSound.play().catch(()=>{});
        }
    }
});

update();