const Game = {
    currentLevel: 0,
    ctx: undefined,
    groundImages: [],
    ants: [],
    guns: [],
    life: 10,
    coins: 100,
    drawGunRange: true,
    hoverBox: {
        visible: false,
        position: {
            x: -500,
            y: -500,
        },
    },
    levels: [],
};

Game.init = function (context) {
    this.ctx = context;
};

Game.isValidGridIndex = function (event) {
    let rect = canvas.getBoundingClientRect();

    let pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };

    let index = {
        x: parseInt(pos.x / 64),
        y: parseInt(pos.y / 64),
    };

    return this.levels[this.currentLevel].levelGrid[index.y][index.x] == 1
        ? index
        : undefined;
};

Game.load = function () {
    ["images/l1.png"].forEach((x) => {
        let image = new Image();
        image.src = x;

        this.groundImages.push(image);
    });

    ["images/ant-5.png", "images/ant-2.png"].forEach((x, i) => {
        let image = new Image();
        image.src = x;

        this.ants.push(image);
    });

    ["images/gun-1.png"].forEach((x, i) => {
        let image = new Image();
        image.src = x;

        this.guns.push(image);
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!this.hoverBox.visible) {
            return;
        }

        let validGridIndex = this.isValidGridIndex(event);

        if (validGridIndex) {
            this.hoverBox.position.x = 64 * validGridIndex.x;
            this.hoverBox.position.y = 64 * validGridIndex.y;
        } else {
            this.hoverBox.position.x = -500;
            this.hoverBox.position.y = -500;
        }
    });

    canvas.addEventListener("click", (event) => {
        let validGridIndex = this.isValidGridIndex(event);

        let weapons = document.getElementsByClassName("weapon");

        [...weapons].forEach((x) => {
                x.classList.remove("selected");
        });

        if (this.hoverBox.visible && validGridIndex) {
            if(this.coins >= 100){
                let gun = new Gun(this.guns[0],{ x: validGridIndex.x * 64, y: validGridIndex.y * 64 }, 200, 10, new Array(this.levels[this.currentLevel].ants.length).fill(false), 100);
                this.levels[this.currentLevel].levelGrid[validGridIndex.y][validGridIndex.x] = 0;
                this.levels[this.currentLevel].activeGuns.push(gun);
                this.coins -= 100;
            }
            this.hoverBox.visible = false;
            this.hoverBox.position = {x : -500, y: -500}
        }
    });
};

Game.drawHoverBox = function () {
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 4;
    this.ctx.globalAlpha = 0.6;
    this.ctx.strokeRect(
        this.hoverBox.position.x,
        this.hoverBox.position.y,
        64,
        64
    );
    this.ctx.globalAlpha = 0.4;
    this.ctx.fillRect(
        this.hoverBox.position.x,
        this.hoverBox.position.y,
        64,
        64
    );
    this.ctx.globalAlpha = 1;
};

Game.createLevels = function () {
    this.levels = [
        {
            ground: Game.groundImages[0],
            levelGrid: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            ants: [],
            activeGuns: [],
        },
    ];

    new Array(10).fill(0).forEach((item, i) => {
        let ant = new Ant(Game.ants[0], 100, { x: -50 * i, y: 96 }, 3, [
            "R-862",
            "B-416",
            "L-740",
            "T-224",
            "L-98",
            "B-416",
            "R-520",
        ]);
        this.levels[0].ants.push(ant);
    });

    new Array(10).fill(0).forEach((item, i) => {
        let ant = new Ant(Game.ants[1], 150, { x: -50 * (i + 30), y: 96 }, 3, [
            "R-862",
            "B-416",
            "L-740",
            "T-224",
            "L-98",
            "B-416",
            "R-520",
        ]);
        this.levels[0].ants.push(ant);
    });
};

Game.drawLevel = function () {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.ctx.drawImage(this.levels[this.currentLevel].ground, 0, 0);

    if (this.hoverBox.visible) {
        this.drawHoverBox();
    }

    this.levels[this.currentLevel].ants.forEach((x, i) => {
        x.drawAnt(this.ctx);
        x.updatePosition(); 
        this.levels[this.currentLevel].activeGuns.forEach((gun) => {
            if(gun.range >= getDistance(gun.position.x, gun.position.y, x.position.x, x.position.y) && x.visible){
                gun.targets[i] = true;
            }else{
                gun.targets[i] = false;
            }
        });   
    });

    this.levels[this.currentLevel].activeGuns.forEach((x) => {
        x.drawWeapon(this.ctx);
        x.drawWeaponAction(this.ctx);
    });
};

function getDistance(x1,y1,x2,y2){
    return Math.pow(Math.pow(x2-x1, 2) + Math.pow(y2 - y1, 2), 1/2);
}