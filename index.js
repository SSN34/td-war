//consts
WIDTH = 960;
HEIGHT = 480;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

Draw.ctx = canvas.getContext("2d");

let tank = new Image();
tank.src = "./images/tank.png";

window.addEventListener("load", () => {
    console.log("ye");

    runSprite();

    setInterval(updateCurrentFrame, 100)
});

let currentFrame = 0;

let speed = 0.1;

function runSprite() {
    Draw.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    Draw.ctx.drawImage(tank, 64 * currentFrame, 0, 64, 64, 50, HEIGHT - 80 + speed, 64, 64);

    speed-= 1;
    requestAnimationFrame(runSprite);
}

function updateCurrentFrame(){
    currentFrame++;
    if(currentFrame == 6){
        currentFrame = 0;
    }
}