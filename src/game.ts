import { Town } from "./town";

export class Game
{
    n: number = 0;
    e: Element;

    private _lastTimestamp: number = 0;
    private _lastTick: number = 0;
    private tickTimeMS: number = 250; // 1 tick time in ms
    private tickTimeMSBase: number = 250; // 1 tick time in ms

    private town: Town;

    constructor()
    {
        this.town = new Town();
    }

    public SetupTestUI()
    {
        // Test functions
        let slider:HTMLInputElement = document.querySelector("#timeSlider");
        var output = document.getElementById("timeScale");

        document.getElementById("time1x").onclick = (evt) =>
        {
            document.querySelector<HTMLInputElement>("#timeSlider").value = "1";
            document.querySelector<HTMLInputElement>("#timeSlider").oninput(null);
        }
        document.getElementById("time10x").onclick = (evt) =>
        {
            document.querySelector<HTMLInputElement>("#timeSlider").value = "10";
            document.querySelector<HTMLInputElement>("#timeSlider").oninput(null);
        }
        output.innerHTML = slider.valueAsNumber.toFixed(1) + "x";
        slider.oninput = function ()
        {
            output.innerHTML = slider.valueAsNumber.toFixed(1) + "x";
            game.tickTimeMS = game.tickTimeMSBase / slider.valueAsNumber;
        }
        document.querySelector<HTMLInputElement>("#timeSlider").oninput(null);
    }

    public Init()
    {
        this.SetupTestUI();

        this.town.Init().then(() =>
        {
            // this._lastTimestamp = Date.now();
            this._lastTick = Date.now();
            window.requestAnimationFrame(() => this.Update());
        });
    }

    public Update()
    {
        const deltaTickTime = Date.now() - this._lastTick;
        if (deltaTickTime >= this.tickTimeMS)
        {
            // Update per tick
            this._lastTick = Date.now() - (deltaTickTime - this.tickTimeMS);

            this.town.Tick();
        }

        window.requestAnimationFrame(() => this.Update());
    }
}

let game: Game = new Game();
game.Init();
