//consts
const WIDTH = 960;
const HEIGHT = 480;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

let lifeEl = document.getElementById('life');
let walletEl = document.getElementById('wallet');


Game.init(canvas.getContext("2d"));

Game.load();

window.addEventListener("load", () => {

    Game.createLevels();

    console.log("Game Started!!!, Hope you enjoy this :)");

    let weapons = document.getElementsByClassName("weapon");

    [...weapons].forEach(x => {
        x.addEventListener("click", (e) => {

            if(x.classList.contains("selected")){
                x.classList.toggle('selected');
                Game.hoverBox.visible = false;
            }else{
                [...weapons].forEach(y => y.classList.remove('selected'))
                x.classList.toggle('selected');
                Game.hoverBox.visible = true;
            }
        })
    })
    run();
});

function run(){

    Game.ctx.clearRect(0,0,WIDTH, HEIGHT);
    Game.drawLevel();

    lifeEl.innerText = Game.life;

    walletEl.innerText = Game.coins;

    if(Game.levels[Game.currentLevel].ants.filter(x => x.visible).length == 0){
        youWon();
        return;
    }

    if(Game.life < 1){
        gameOver();
        return;
    }

    requestAnimationFrame(run);
}

function gameOver(){
    Game.ctx.globalAlpha = 0.8;
    Game.ctx.fillRect(0,0,WIDTH, HEIGHT);
    Game.ctx.globalAlpha = 1;

    Game.ctx.font = "italic 200px Copperplate, Papyrus, fantasy, monospace";
    Game.ctx.fillStyle = "white";
    Game.ctx.fillText("Game", 50, (HEIGHT / 2) - 50);
    Game.ctx.fillText("Over", 400, HEIGHT - 80);
}

function youWon(){
    Game.ctx.globalAlpha = 0.8;
    Game.ctx.fillStyle = "white";
    Game.ctx.fillRect(0,0,WIDTH, HEIGHT);
    Game.ctx.globalAlpha = 1;

    Game.ctx.font = "italic 200px Copperplate, Papyrus, fantasy, monospace";
    Game.ctx.fillStyle = "green";
    Game.ctx.fillText("Winner", 125, (HEIGHT / 2) + 50);
}
