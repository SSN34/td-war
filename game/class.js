class Ant {
    constructor(image, strength, position, speed, path) {
        this.image = image;
        this.position = position;
        this.strength = strength;
        this.currentSprite = 0;
        this.speed = speed;
        this.path = path;
        this.visible = true;
        this.angle = 0;
        this.currentSection = 0;
        setInterval(() => {
            this.updateSprite();
        }, 100);
    }

    drawAnt(context) {
        if (!this.visible) {
            return;
        }
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate((this.angle * Math.PI) / 180);
        context.drawImage(
            this.image,
            32 * this.currentSprite,
            0,
            32,
            32,
            -16,
            -16,
            32,
            32
        );
        context.restore();
    }

    updateSprite() {
        this.currentSprite = this.currentSprite == 0 ? 1 : 0;
    }

    updatePosition() {
        if (this.strength < 0) {
            this.visible = false;
            return;
        }
        if (this.currentSection === this.path.length && this.visible) {
            this.position.x = 0;
            this.position.y = 96;
            this.currentSection = 0;
            Game.life--;
            this.visible = false;
        }
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
        context.strokeStyle = "red";
        context.arc(
            this.position.x + 32,
            this.position.y + 32,
            this.range,
            0,
            2 * Math.PI
        );
        // context.stroke();
    }
}

class Gun extends Weapon {
    constructor(image, position, range, power, targets, cost) {
        super(image, position, range);
        this.power = power;
        this.targets = targets;
        this.cost = cost;
        setInterval(() => this.shootTarget(), 100);
    }

    shootTarget() {

        for(let target in this.targets){
            if(this.targets[target]){
                Game.levels[Game.currentLevel].ants[target].strength -= this.power;
                if(Game.levels[Game.currentLevel].ants[target].strength < 0){
                    Game.coins += 20;
                }
                break;
            }
        }

       
    }

    drawWeaponAction(context){
        for(let target in this.targets){
            if(this.targets[target]){
                context.strokeStyle = "red";
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(this.position.x + 32, this.position.y + 32);
                context.lineTo(Game.levels[Game.currentLevel].ants[target].position.x, Game.levels[Game.currentLevel].ants[target].position.y);
                context.stroke();
                break;
            }
        }
    }
}
