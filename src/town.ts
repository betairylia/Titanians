import { World } from "miniplex";
import { Entity } from "./entity";
import { strings as L, getStrings } from "./i18n/i18n";
import { AddActivityEntry, activities } from "./activity";
import { ResourceHelper, ResourceType } from "./resource";
import { UI } from "./UI";

/* Handles the main game logic.
 */

export class Town
{
    public world: World<Entity> = new World<Entity>();
    public archetypes = {
        resources: this.world.with("id", "isResource"),
        activities: this.world.with("id", "visible", "isActivity"),
        resourceBuildings: this.world.with("isBuilding", "ChangeResourcePerTick"),
    };

    ui: UI = new UI(this);
    resources: ResourceHelper = new ResourceHelper(this);

    public Init()
    {
        this.ui.Init();

        this.resources.AddResourceEntry(ResourceType.Fruit, 0, 100);
        this.resources.AddResourceEntry(ResourceType.Tree, 1000, 0);

        AddActivityEntry(this.world, activities.GatherFruit);

        console.log(getStrings("bPlantation"));
    }

    public UpdateUI()
    {
        this.ui.Update();
    }

    public Tick()
    {
        // Main loop per tick
        this.UpdateUI();
    }
}