//consts
const WIDTH = 960;
const HEIGHT = 480;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

Draw.ctx = canvas.getContext("2d");

let tank = new Image();
tank.src = "./images/tank.png";

let r = new Image();
r.src = "./images/r.png";


let corner = new Image();
corner.src = "./images/corner.png";

window.addEventListener("load", () => {
    console.log("ye");

    runSprite();

    setInterval(updateCurrentFrame, 100)
});

let currentFrame = 0;

let speed = 0.1;



function runSprite() {
    Draw.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(let i = 0; i < WIDTH; i += 64){
        Draw.ctx.drawImage(r, i, 0);
    }

    Draw.ctx.drawImage(corner, WIDTH - 64, 0);

    Draw.ctx.drawImage(tank, 64 * currentFrame, 0, 64, 64, 50, 0, 64, 64);

    requestAnimationFrame(runSprite);
}

function updateCurrentFrame(){
    currentFrame++;
    if(currentFrame == 4){
        currentFrame = 0;
    }
}