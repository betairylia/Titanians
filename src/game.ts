export class Game
{
    n: number = 0;
    e: Element;

    private _lastTimestamp: number = 0;
    private _lastTick: number = 0;
    private tickTimeMS: number = 100; // 0.1s = 1 tick

    constructor()
    {

    }

    public Init()
    {
        let message: string = 'Hello, TypeScript!';

        let heading = document.createElement('h1');
        heading.textContent = message;

        document.body.appendChild(heading);
        this.e = document.querySelector("#nFruits");
        let b:HTMLButtonElement = document.querySelector("#bFruits");
        b.onclick = (event) => { this.n += 1 };

        // this._lastTimestamp = Date.now();
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

            this.n += 1;
            this.e.innerHTML = this.n.toFixed(2);
        }

        window.requestAnimationFrame(() => this.Update());
    }
}

let game: Game = new Game();
game.Init();
