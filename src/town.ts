import { World } from "miniplex";
import { Entity } from "./entity";
import { strings as L, getStrings } from "./i18n/i18n";
import { AddActivityEntry, activities } from "./activity";
import { AddResourceEntry, ResourceType } from "./resource";
import { UI } from "./UI";

/* Handles the main game logic.
 */

export class Town
{
    public world: World<Entity> = new World<Entity>();
    public archetypes = {
        resources: this.world.with("id", "isResource"),
        activities: this.world.with("id", "isActivity"),
    };

    ui: UI = new UI(this);

    public Init()
    {
        this.ui.Init();
        
        AddResourceEntry(this.world, ResourceType.Fruit, 0, 100);
        AddResourceEntry(this.world, ResourceType.Tree, 1000, 0);

        AddActivityEntry(this.world, activities.GatherFruit);

        console.log(getStrings("bPlantation"));
    }

    public Update()
    {
        // Main loop per tick
        this.ui.Update();
    }
}