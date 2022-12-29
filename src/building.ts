import { Entity } from "./entity";
import { ResourceType } from "./resource"
import { Town } from "./town"

export type Building = {
    isBuilding?: true,
    buildingInfo?: { count: number, level: number },
    ChangeResourcePerTick?: { type: ResourceType, amount: number }[]
}

export class BuildingHelper
{
    public town: Town;
    buildingMap: Map<string, Entity>;

    constructor(town: Town)
    {
        this.town = town;
        this.buildingMap = new Map<string, Entity>();
    }

    public AddBuildingEntry(
        prototype: any
    )
    {
        let entity: any = {};
        Object.assign(entity, prototype);

        entity.isActivity = true;

        return world.add(entity);
    }
    
    resourceBuildings
}
