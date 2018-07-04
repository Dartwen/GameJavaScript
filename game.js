'use strict';

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        if (!vector instanceof Vector) {
            throw Error('Можно прибавлять к вектору только вектор типа Vector');
        }
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    times(multiplier) {
        return new Vector(this.x * multiplier, this.y * multiplier);
    }

}

class Actor {
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        if (!(pos instanceof Vector)) {
            throw new Error('pos не является объектом типа Vector');
        }
        if (!(size instanceof Vector)) {
            throw new Error('size не является объектом типа Vector');
        }
        if (!(speed instanceof Vector)) {
            throw new Error('speed не является объектом типа Vector');
        }

        this.pos = pos;
        this.size = size;
        this.speed = speed;
    }

    act() {
    }

    get left() {
        return this.pos.x;
    }

    get top() {
        return this.pos.y;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    get type() {
        return 'actor';
    }

    isIntersect(movingObj) {
        if (!(movingObj instanceof Actor)) {
            throw new Error('Аргумент должен быть экземпляром класса Actor');
        }

        if (movingObj === this) return false;
        if (movingObj.left >= this.right) return false;
        if (movingObj.right <= this.left) return false;
        if (movingObj.top >= this.bottom) return false;
        if (movingObj.bottom <= this.top) return false;
        if (movingObj.size.x < 0 || movingObj.size.y < 0) return false;

        return true;
    }
}

class Level {
    constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.player = this.actors.find(actor => actor.type === 'player');
        this.height = this.grid.length;
        this.width = this.height > 0 ? Math.max.apply(Math, this.grid.map(function (el) {
            return el.length;
        })) : 0;
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished() {
        if (!(this.status === null && this.finishDelay < 0)) {
            return true;
        }
        return false;
    }

    actorAt(movingObject) {
        if (!(movingObject instanceof Actor) || movingObject === '') {
            throw Error('не объект Actor');
        }
        return this.actors.find(actor => actor.isIntersect(movingObject));
    }

    obstacleAt(pos, size) {
        var leftBorder = Math.floor(pos.x);
        var rightBorder = Math.ceil(pos.x + size.x);
        var topBorder = Math.floor(pos.y);
        var bottomBorder = Math.ceil(pos.y + size.y);

        if (leftBorder < 0 || rightBorder > this.width || topBorder < 0) {
            return "wall";
        }

        if (bottomBorder > this.height) {
            return "lava";
        }

        for (let y = topBorder; y < bottomBorder; y++) {
            for (let x = leftBorder; x < rightBorder; x++) {
                let fieldGame = this.grid[y][x];
                if (fieldGame) {
                    return fieldGame;
                }
            }
        }

    }

    removeActor(obj) {
        var indexObj = this.actors.indexOf(obj);
        if (indexObj !== -1) {
            this.actors.splice(indexObj, 1);
        }
    }

    noMoreActors(type) {
        return !this.actors.some(actor => actor.type === type)
    }

    playerTouched(type, movingObj) {
        if (this.status !== null) {
            return;
        }

        if (['lava', 'fireball'].some((el) => el === type)) {
            return this.status = 'lost';
        }

        if (type === 'coin' && movingObj.type === 'coin') {
            this.removeActor(actor);
            if (this.noMoreActors('coin')) {
                return this.status = 'won';
            }

        }

    }
}

class LevelParser {
    constructor(dictionary){
        this.dictionary = dictionary;
    }

    actorFromSymbol(symbol){
        if (symbol === undefined) {
            return undefined;
        }

        if (Object.keys(this.dictionary).indexOf(symbol) !== -1){
            return this.dictionary[symbol];
        }
        return undefined;
    }


}