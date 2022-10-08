//consts
WIDTH = 960;
HEIGHT = 480;

SQUAREUNIT = 45;

GRIDUNIT = 30;

SPEED = 5;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

Draw.ctx = canvas.getContext("2d");

let rectPosition = {
    x: 0,
    y: 90,
};

let targetDistance = 0;

let command = ["R-780", "D-295", "L-655", "T-178", "R-455"];

let currentCommand = 0;

function drawBoard() {
    Draw.Lines(
        [
            [0, 90],
            [810, 90],
            [810, 390],
            [150, 390],
            [150, 210],
            [660, 210],
        ],
        "#15afd0",
        60
    );

    let x = 0;
    let y = 0;

    Draw.ctx.globalAlpha = 0.1;
    while (x < WIDTH) {
        y = 0;
        while (y < HEIGHT) {
            Draw.Rect([x, y, GRIDUNIT, GRIDUNIT], false, "", true);
            y += GRIDUNIT;
        }
        x += GRIDUNIT;
    }
    Draw.ctx.globalAlpha = 1;
}

function reDraw() {
    Draw.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBoard();
    Draw.Rect(
        [
            rectPosition.x,
            rectPosition.y - SQUAREUNIT / 2,
            SQUAREUNIT,
            SQUAREUNIT,
        ],
        "red"
    );

    if (command.length == currentCommand) {
        rectPosition.x = 0;
        rectPosition.y = 90;
        currentCommand = 0;
    }

    let commandValue = command[currentCommand];

    let directionDistance = commandValue.split("-");

    if (targetDistance > directionDistance[1]) {
        targetDistance = 0;
        currentCommand += 1;
    }

    if (directionDistance[0] == "L") {
        rectPosition.x -= SPEED;
    }

    if (directionDistance[0] == "T") {
        rectPosition.y -= SPEED;
    }

    if (directionDistance[0] == "R") {
        rectPosition.x += SPEED;
    }

    if (directionDistance[0] == "D") {
        rectPosition.y += SPEED;
    }
    targetDistance += SPEED;

    requestAnimationFrame(reDraw);
}

reDraw();
