import { World } from "miniplex";
import { Entity } from "./entity";
import { strings as L } from "./i18n/i18n";

/* Handles the main game logic.
 */

export class Town
{
    private world: World<Entity>;

    public Init()
    {
        this.world = new World<Entity>();
        this.world.add({isResource: true, id: "fruit"})

        console.log(L.bPlantation);
    }

    public Update()
    {

    }
}