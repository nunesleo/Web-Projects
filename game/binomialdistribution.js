// CONSTANTS AND VARIABLES
let lastTimestamp;
let animationFrameId;
let turnTime = 0;
let errorRangeTyler = 50;
let rounds = 0;
let percentage = 0;

let ballX = 200;
let ballY = 300;
let tylerX = ballX - 50;
let tylerY = ballY - 50;

let vel = 90;
let angleX = 1;
let angleY = 1;
const ballSize = 10;

let scoreP1 = 0;

const canvas = document.getElementById("game");
const restartButton = document.getElementById("restart");
const p1ScoreField = document.getElementById("p1Score");
const p1ScoreContainer = document.getElementById("p1ScoreDiv");
const ctx = canvas.getContext("2d");
const tylerImage = new Image();
tylerImage.src = "./media/tyler.png";


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
    ctx.fillRect(200, 550, 15, 15);

}

function drawBall() {
    ctx.fillStyle = "#000583";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawTyler() {
    ctx.drawImage(tylerImage, tylerX, tylerY);
}

function resetGame() {
    ballX = 200;
    ballY = 300;
    vel = 90;
    angleX = Math.random() * 2 - 1;
    angleY = Math.random() * 2 - 1;

    let magnitude = Math.sqrt(angleX * angleX + angleY * angleY);
    angleX /= magnitude;
    angleY /= magnitude;

    drawScenario();
    drawBall();

    lastTimestamp = null;
    drawTyler();
}

function animate(timestamp) {
    if (!lastTurnTimestamp) {
        lastTurnTimestamp = timestamp;
    }

    const elapsedTime = timestamp - lastTurnTimestamp;
    if (elapsedTime > 100) {
        if (vel > 0) {
            vel -= 0.24;
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

        // Collision with P2 goal --> P1 should earn points
        if (ballX >= 190 && ballX <= 215 && ballY >= 540 && ballY <= 565) {
            scoreP1 += 1;
            return;
        }
    }

    drawScenario();
    drawBall();
    drawTyler();

    lastTimestamp = timestamp;
    window.cancelAnimationFrame(animationFrameId);
    window.requestAnimationFrame(animate);
}

//Theoretical throw. Too fast to animate
async function calculateThrows() {
    let scoreP1calc = 0;
    const totalThrows = 1000000;
    const errorRangeTyler = 80; 

    for (let i = 0; i < totalThrows; i++) {
        let velcalc = 3;
        let ballXcalc = 200;
        let ballYcalc = 300;
        let angleXcalc, angleYcalc;

        
        if (Math.random() < 0.1) {
            // erro crítico
            angleXcalc = 200 - ballXcalc + Math.random() * 600 - 300;
            angleYcalc = 565 - ballYcalc + Math.random() * 600 - 300;
        } else {
            // erro normal
            angleXcalc = 200 - ballXcalc + Math.random() * errorRangeTyler - errorRangeTyler / 2;
            angleYcalc = 565 - ballYcalc + Math.random() * errorRangeTyler - errorRangeTyler / 2;
        }

        // normaliza o vetor
        let magnitudecalc = Math.sqrt(angleXcalc * angleXcalc + angleYcalc * angleYcalc);
        angleXcalc /= magnitudecalc;
        angleYcalc /= magnitudecalc;

        // movimento da bola
        while (velcalc > 0) {
            velcalc -= 0.008;
            ballXcalc += velcalc * angleXcalc;
            ballYcalc += velcalc * angleYcalc;

            if (ballXcalc <= 0 || ballXcalc >= 390) angleXcalc *= -1;
            if (ballYcalc <= 0 || ballYcalc >= 590) angleYcalc *= -1;

            if (ballXcalc >= 190 && ballXcalc <= 215 && ballYcalc >= 540 && ballYcalc <= 565) {
                scoreP1calc++;
                break;
            }
        }

        // atualiza ocasionalmente o placar
        if (i % 200 === 0) {
            let percentagecalc = (scoreP1calc / (i + 1)) * 100;
            p1ScoreField.textContent =
                "Tyler: " + scoreP1calc + "/" + (i + 1) + " (" + percentagecalc.toFixed(2) + "%)";
            await delay(1); // dá respiro pro navegador
        }
    }

    // resultado final
    let finalPercentage = (scoreP1calc / totalThrows) * 100;
    p1ScoreField.textContent =
        "Tyler: " + scoreP1calc + "/" + totalThrows + " (" + finalPercentage.toFixed(2) + "%)";
}




async function throwBallNearTheHole() {
    lastTurnTimestamp = null;
    tylerX = ballX - 50;
    tylerY = ballY - 50;

    p1ScoreField.style.fontWeight = "bold";
    if (Math.random() < 0.1) { // Critical error
        angleX = 200 - ballX + Math.random() * 600 - 300;
        angleY = 565 - ballY + Math.random() * 600 - 300;
    } else {
        angleX = 200 - ballX + Math.random() * errorRangeTyler - errorRangeTyler / 2;
        angleY = 565 - ballY + Math.random() * errorRangeTyler - errorRangeTyler / 2;
    }


    let magnitude = Math.sqrt(angleX * angleX + angleY * angleY);
    angleX /= magnitude;
    angleY /= magnitude;
    vel = 90;
    animationFrameId = window.requestAnimationFrame(animate);
}

async function playGame() {
    calculateThrows();
    while (rounds < 10000) {
        await throwBallNearTheHole();
        await delay(160);
        rounds++;
        percentage = scoreP1 / rounds * 100;
        resetGame();
    }
}

// EVENT LISTENERS BUTTONS
restartButton.addEventListener("click", function () {
    resetGame();
    playGame();
});






