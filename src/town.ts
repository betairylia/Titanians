import { World } from "miniplex";
import { Entity } from "./entity";
import { strings as L, getStrings } from "./i18n/i18n";
import { AddActivityEntry, activities } from "./activity";
import { ResourceHelper, ResourceType } from "./resource";
import { UI } from "./UI";
import { BuildingHelper } from "./building";
import { LoadAllData } from "./gamedata";

/* Handles the main game logic.
 */

export class Town
{
    public world: World<Entity> = new World<Entity>();
    public archetypes = {
        hiddenHTML: this.world.with("hidden", "HTMLElement"),
        visibleHTML: this.world.with("HTMLElement").without("hidden"),

        resources: this.world.with("id", "isResource"),
        activities: this.world.with("id", "isActivity"),

        resourceBuildings: this.world.with("isBuilding", "ChangeResourcePerTick"),
        buildingInfo: this.world.with("buildingInfo"),
        hiddenBuildingInfo: this.world.with("buildingInfo").with("hidden"),
    };

    ui: UI = new UI(this);
    resources: ResourceHelper = new ResourceHelper(this);
    buildings: BuildingHelper = new BuildingHelper(this);

    public Init()
    {
        return new Promise<void>((resolve, reject) =>
        {
            LoadAllData(this).then(() =>
            {
                this.ui.Init();
                this.buildings.Init();
        
                this.resources.AddResourceEntry("Fruit", 10, 10000);
                this.resources.AddResourceEntry("Tree", 1000, 0);
        
                AddActivityEntry(this.world, activities.GatherFruit);
                resolve();  
            })
        })
    }

    public UpdateUI()
    {
        this.ui.Update();
    }

    public Tick()
    {
        // Main loop per tick
        this.resources.sRefreshResource();

        this.buildings.sModifyResources();

        this.UpdateUI();
    }
}