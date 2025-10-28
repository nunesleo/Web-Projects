// CONSTANTS AND VARIABLES
let gameState = "oneTurn"; // oneTurn, twoTurn, oneWalking, twoWalking
let lastTimestamp;
let animationFrameId;
let turnTime = 0;
let errorRangeThomas = 80;
let errorRangeTyler = 80;

let ballX = 200;
let ballY = 300;
let thomasX = ballX + 10;
let thomasY = ballY + 10;
let tylerX = ballX - 50;
let tylerY = ballY - 50;

let vel = 3;
let angleX = 1;
let angleY = 1;
const ballSize = 10;

let scoreP1 = 0;
let scoreP2 = 0;

const canvas = document.getElementById("game");
const restartButton = document.getElementById("restart");
const supportTyButton = document.getElementById("supportTy");
const booTyButton = document.getElementById("booTy");
const supportThButton = document.getElementById("supportTh");
const booThButton = document.getElementById("booTh");
const p1ScoreField = document.getElementById("p1Score");
const p2ScoreField = document.getElementById("p2Score");
const p1ScoreContainer = document.getElementById("p1ScoreDiv");
const p2ScoreContainer = document.getElementById("p2ScoreDiv");
const ctx = canvas.getContext("2d");
const thomasImage = new Image();
const tylerImage = new Image();
thomasImage.src = "./media/thomas.png";
tylerImage.src = "./media/tyler.png";

thomasImage.onload = function () {
    console.log("Imagem carregada!");
};

tylerImage.onload = function () {
    console.log("Imagem carregada!");
};

const delay = ms => new Promise(res => setTimeout(res, ms));

let lastTurnTimestamp = null;

// FUNCTIONS
function drawScenario() {
    //field
    ctx.fillStyle = "#C3CCE5";
    ctx.fillRect(0, 0, 400, 600);

    //style lines
    ctx.fillStyle = "#082975";
    ctx.fillRect(0, 300, 600, 2);

    ctx.fillStyle = "#7185B6";
    ctx.beginPath();
    ctx.arc(205, 0, 200 / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(205, 600, 200 / 2, 0, Math.PI * 2);
    ctx.fill();

    //goals
    ctx.fillStyle = "#2C2D4A";
    ctx.fillRect(200, 50, 15, 15);
    ctx.fillRect(200, 550, 15, 15);

}

function drawBall() {
    ctx.fillStyle = "#000583";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawThomas() {
    ctx.drawImage(thomasImage, thomasX, thomasY);
}

function drawTyler() {
    ctx.drawImage(tylerImage, tylerX, tylerY);
}

function resetGame() {
    ballX = 200;
    ballY = 300;
    vel = 3;
    angleX = Math.random() * 2 - 1;
    angleY = Math.random() * 2 - 1;

    let magnitude = Math.sqrt(angleX * angleX + angleY * angleY);
    angleX /= magnitude;
    angleY /= magnitude;

    drawScenario();
    drawBall();
    p1ScoreField.textContent = "Tyler: " + scoreP1;
    p2ScoreField.textContent = "Thomas: " + scoreP2;
    lastTimestamp = null;
    if (gameState == "oneTurn") {
        drawTyler();
    } else if (gameState == "twoTurn") {
        drawThomas();
    }
}

function animate(timestamp) {
    if (!lastTurnTimestamp) {
        lastTurnTimestamp = timestamp; 
    }

    const elapsedTime = timestamp - lastTurnTimestamp; 
    if (elapsedTime > 3000) { 
        if (vel > 0) {
            vel -= 0.008;
        } else {
            vel = 0;
        }

        ballX += vel * angleX;
        ballY += vel * angleY;

        // Collision with walls
        if (ballX <= 0 || ballX >= 390) {
            angleX *= -1;
        }
        if (ballY <= 0 || ballY >= 590) {
            angleY *= -1;
        }

        // Collision with P1 goal --> P2 should earn points
        if (ballX >= 190 && ballX <= 215 && ballY >= 40 && ballY <= 65) {
            scoreP2 += 1;
            resetGame();
            return;
        }

        // Collision with P2 goal --> P1 should earn points
        if (ballX >= 190 && ballX <= 215 && ballY >= 540 && ballY <= 565) {
            scoreP1 += 1;
            resetGame();
            return;
        }
    }

    drawScenario();
    drawBall();
    if (gameState == "oneTurn") {
        drawTyler();
    } else if (gameState == "twoTurn") {
        drawThomas();
    }

    lastTimestamp = timestamp;
    window.cancelAnimationFrame(animationFrameId);
    window.requestAnimationFrame(animate);
}


async function throwBallNearTheHole() {
    
    if (gameState == "oneTurn") {
        //Thomas playing
        gameState = "twoTurn";
        lastTurnTimestamp = null; 
        thomasX = ballX + 10;
        thomasY = ballY + 10;

        p2ScoreField.style.fontWeight = "bold";
        p1ScoreField.style.fontWeight = "normal";
        if (Math.random() < 0.1) { // Critical error
            angleX = 200 - ballX + Math.random() * 600 - 300;
            angleY = 50 - ballY + Math.random() * 600 - 300;
        } else {
            angleX = 200 - ballX + Math.random() * errorRangeThomas - errorRangeThomas / 2;
            angleY = 50 - ballY + Math.random() * errorRangeThomas - errorRangeThomas / 2;
        }
        
    } else if (gameState == "twoTurn") {
        //Tyler playing
        gameState = "oneTurn";
        lastTurnTimestamp = null;
        tylerX = ballX - 50;
        tylerY = ballY - 50;
        
        p1ScoreField.style.fontWeight = "bold";
        p2ScoreField.style.fontWeight = "normal";
        if (Math.random() < 0.1) { // Critical error
            angleX = 200 - ballX + Math.random() * 600 - 300;
            angleY = 565 - ballY + Math.random() * 600 - 300;
        } else {
            angleX = 200 - ballX + Math.random() * errorRangeTyler - errorRangeTyler / 2;
            angleY = 565 - ballY + Math.random() * errorRangeTyler - errorRangeTyler / 2;
        }
        
    }

    let magnitude = Math.sqrt(angleX * angleX + angleY * angleY);
    angleX /= magnitude;
    angleY /= magnitude;
    vel = 3;
    animationFrameId = window.requestAnimationFrame(animate);
}

async function playGame() {
    gameState = "twoTurn";
    while (true) {
        await throwBallNearTheHole();
        await delay(7000);
    }
}

// EVENT LISTENERS BUTTONS
restartButton.addEventListener("click", function () {
    resetGame();
    playGame();
});

supportThButton.addEventListener("click", function () {
    if (errorRangeThomas <= 0) {
        errorRangeThomas = 0;
        console.log("This is Thomas's error range: ", errorRangeThomas);
        return;
    }
    errorRangeThomas -= 10;
    console.log("This is Thomas's error range: ", errorRangeThomas);
});

booThButton.addEventListener("click", function () {
    errorRangeThomas += 10;
    console.log("This is Thomas's error range: ", errorRangeThomas);
});

supportTyButton.addEventListener("click", function () {
    if (errorRangeTyler <= 0) {
        errorRangeTyler = 0;
        console.log("This is Tyler's error range: ", errorRangeTyler);
        return;
    }
    errorRangeTyler -= 10;
    console.log("This is Tyler's error range: ", errorRangeTyler);
});

booTyButton.addEventListener("click", function () {
    errorRangeTyler += 10;
    console.log("This is Tyler's error range: ", errorRangeTyler);
});
