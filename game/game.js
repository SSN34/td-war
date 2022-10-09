const Game = {
    currentLevel: 0,
    ctx: undefined,
    groundImages: [],
    ants: [],
    guns: [],
    drawGunRange: false,
    hoverBox: {
        visible: false,
        position: {
            x: -500,
            y: -500,
        },
    },
};

Game.init = function (context) {
    this.ctx = context;
};

const levelGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

Game.load = function () {
    ["images/l1.png"].forEach((x) => {
        let image = new Image();
        image.src = x;

        this.groundImages.push(image);
    });

    [
        "images/ant-5.png",
        "images/ant-2-l.png",
        "images/ant-2-t.png",
        "images/ant-2-r.png",
        "images/ant-2-b.png",
    ].forEach((x, i) => {
        let image = new Image();
        image.src = x;

        this.ants.push(
            new Ant(image, 100 * (i + 1), { x: -64 * i, y: 64 }, 50, [
                "R-832",
                "B-320",
                "L-128",
                "T-192",
                "L-640",
                "B-192",
                "R-384",
            ])
        );
    });

    ["images/gun-1.png"].forEach((x, i) => {
        let image = new Image();
        image.src = x;

        this.guns.push(new Gun(image, { x: 64, y: 0 }, 64, 10));
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!this.hoverBox.visible) {
            return;
        }
        let rect = canvas.getBoundingClientRect();

        let pos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        let index = {
            x: parseInt(pos.x / 64),
            y: parseInt(pos.y / 64),
        };

        if (levelGrid[index.y][index.x] == 1) {
            this.hoverBox.position.x = 64 * index.x;
            this.hoverBox.position.y = 64 * index.y;
        } else {
            this.hoverBox.position.x = -500;
            this.hoverBox.position.y = -500;
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

Game.drawLevel = function () {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.ctx.drawImage(this.groundImages[0], 0, 0);

    if (this.hoverBox.visible) {
        this.drawHoverBox();
    }

    this.guns[0].drawWeapon(this.ctx);

    if (this.drawGunRange) {
        this.guns[0].drawRange(this.ctx);
    }

    this.ants[0].drawAnt(this.ctx);
    this.ants[1].drawAnt(this.ctx);
};

class Ant {
    constructor(image, strength, position, speed, path) {
        this.image = image;
        this.position = position;
        this.strength = strength;
        this.currentSprite = 0;
        this.speed = speed;
        this.path = path;
        this.angle = 0;
        this.currentSection = 0;
        setInterval(() => {
            this.updateSprite();
            this.updatePosition();
        }, 200);
    }

    drawAnt(context) {
        context.save();
        context.translate(this.position.x + 16, this.position.y + 16);
        context.rotate((this.angle * Math.PI) / 180);
        context.drawImage(
            this.image,
            32 * this.currentSprite,
            0,
            32,
            32,
            0,
            0,
            32,
            32
        );
        context.restore();
    }

    updateSprite() {
        this.currentSprite = this.currentSprite == 0 ? 1 : 0;
    }

    updatePosition() {
        let section = this.path[this.currentSection].split("-");

        let direction = section[0];
        let target = section[1];

        switch (direction) {
            case "R":
                this.position.x += this.speed;
                this.angle = 0;
                if (this.position.x > target) {
                    this.currentSection++;
                }
                break;
            case "B":
                this.position.y += this.speed;
                this.angle = 90;
                if (this.position.y > target) {
                    this.currentSection++;
                }
                break;
            case "L":
                this.position.x -= this.speed;
                this.angle = 180;
                if (this.position.x < target) {
                    this.currentSection++;
                }
                break;
            case "T":
                this.position.y -= this.speed;
                this.angle = 270;
                if (this.position.y < target) {
                    this.currentSection++;
                }
                break;

            default:
                break;
        }
    }
}

class Weapon {
    constructor(image, position, range) {
        this.image = image;
        this.position = position;
        this.range = range;
    }

    drawWeapon(context) {
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    drawRange(context) {
        context.fillStyle = "red";
        context.strokeStyle = "red";
        context.lineWidth = "red";
        context.globalAlpha = 0.3;
        context.arc(
            this.position.x + 32,
            this.position.y + 32,
            this.range,
            0,
            2 * Math.PI
        );
        context.fill();
        context.stroke();
        context.globalAlpha = 1;
    }
}

class Gun extends Weapon {
    constructor(image, position, range, power) {
        super(image, position, range);
        this.power = power;
    }
}
