import { Town } from "./town";

export class Game
{
    n: number = 0;
    e: Element;

    private _lastTimestamp: number = 0;
    private _lastTick: number = 0;
    private tickTimeMS: number = 250; // 1 tick time in ms

    private town: Town;

    constructor()
    {
        this.town = new Town();
    }

    public Init()
    {
        // this.e = document.querySelector("#nFruits");
        // let b:HTMLButtonElement = document.querySelector("#bFruits");
        // b.onclick = (event) => { this.n += 1 };

        // this._lastTimestamp = Date.now();
        this.town.Init();
        this._lastTick = Date.now();
        window.requestAnimationFrame(() => this.Update());
    }

    public Update()
    {
        const deltaTickTime = Date.now() - this._lastTick;
        if (deltaTickTime >= this.tickTimeMS)
        {
            // Update per tick
            this._lastTick = Date.now() - (deltaTickTime - this.tickTimeMS);

            // this.n += 1;
            // this.e.innerHTML = this.n.toFixed(2);

            this.town.Update();
        }

        window.requestAnimationFrame(() => this.Update());
    }
}

let game: Game = new Game();
game.Init();
