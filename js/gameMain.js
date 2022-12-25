define("game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    class Game {
        constructor() {
            this.n = 0;
            this._lastTimestamp = 0;
            this._lastTick = 0;
            this.tickTimeMS = 100; // 0.1s = 1 tick
        }
        Init() {
            let message = 'Hello, TypeScript!';
            let heading = document.createElement('h1');
            heading.textContent = message;
            document.body.appendChild(heading);
            this.e = document.querySelector("#nFruits");
            let b = document.querySelector("#bFruits");
            b.onclick = (event) => { this.n += 1; };
            // this._lastTimestamp = Date.now();
            this._lastTick = Date.now();
            window.requestAnimationFrame(() => this.Update());
        }
        Update() {
            const deltaTickTime = Date.now() - this._lastTick;
            if (deltaTickTime >= this.tickTimeMS) {
                // Update per tick
                this._lastTick = Date.now() - (deltaTickTime - this.tickTimeMS);
                this.n += 1;
                this.e.innerHTML = this.n.toFixed(2);
            }
            window.requestAnimationFrame(() => this.Update());
        }
    }
    exports.Game = Game;
    let game = new Game();
    game.Init();
});
//# sourceMappingURL=gameMain.js.map