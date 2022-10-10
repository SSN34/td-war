//consts
const WIDTH = 960;
const HEIGHT = 480;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

let lifeEl = document.getElementById('life');


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
    if(Game.life < 1){
        return;
    }

    requestAnimationFrame(run);
}
