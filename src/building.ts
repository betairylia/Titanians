import { ArchetypeBucket, With } from "miniplex";
import { Entity } from "./entity";
import { ResourceType } from "./resource"
import { Town } from "./town"
import { AddActivityEntry, activities } from "./activity";
import { BuildingInfoPanel } from "./UI";
import { BuildingData } from "./gamedata";

export type Building = {
    isBuilding?: true,
    buildingInfo?: { type: BuildingType, ui?: BuildingInfoPanel },
    ChangeResourcePerTick?: {
        requires: { type: ResourceType, amount: number }[],
        products: { type: ResourceType, amount: number }[]
    }
} & Partial<typeof BuildingTypesDef>

// Meanings in entities: Variant of each building type
// Building level are global.
export const BuildingTypesDef = {
    Plantation: {},
    Farm: {},
    LoggingCamp: {},
    ForestKeeper: {},
    Bonfire: {},
    House: {},
    Guild: {},
    Atelier: {},
    Academy: {},
    Mine: {}
}
export type BuildingType = keyof typeof BuildingTypesDef;

export class BuildingHelper
{
    public town: Town;
    public archetypes: Partial<Record<BuildingType, ArchetypeBucket<With<Entity, "isBuilding" | BuildingType>>>> = {};
    public data: Map<BuildingType, BuildingData> = new Map<BuildingType, BuildingData>();

    constructor(town: Town)
    {
        this.town = town;
    }

    public Init()
    {
        // Register archetypes for each building type
        // Too magical ... what the hell lol
        (Object.keys(BuildingTypesDef) as Array<BuildingType>).forEach(
            (value) =>
            {
                this.archetypes[value] = this.town.world.with("isBuilding", value);

                // add activities for construct this type of buildings
                // AddActivityEntry(this.town.world, {
                //     id: "aConstruct" + value,
                //     hidden: true,
                //     UseResourceOnce: this.GetBuildingCost(value),
                //     ConstructBuilding: { type: value }
                // });
                this.town.world.add({
                    id: "aConstruct" + value,
                    buildingInfo: { type: value },
                    hidden: true,
                    
                    UseResourceOnce: this.GetBuildingCost(value),
                    ConstructBuilding: { type: value }
                })
            }
        );
    }

    public AddBuilding(prototype: any)
    {
        let entity: any = {};
        Object.assign(entity, prototype);

        entity.isBuilding = true;

        return this.town.world.add(entity);
    }

    public GetBuildingPrototype(type: BuildingType)
    {
        return this.data.get(type).prototype;
    }

    public GetBuildingCost(type: BuildingType): {type: ResourceType, amount: number}[]
    {
        let nBuildings = this.archetypes[type].size;
        let baseCost = this.data.get(type).buildCost;
        return baseCost.map((bc) =>
        {
            return { type: bc.type, amount: bc.base * Math.pow(bc.growth, nBuildings) };
        });
    }

    public IsBuildingUnlocked(type: BuildingType): boolean
    {
        let condition = this.data.get(type).visibleRequirements;
        let result = true;

        if (condition != false)
        {
            condition.forEach(x =>
                {
                    result = result && this.town.resources.GetResource(x.type).visible;
                });
        }
        else
        {
            return condition;
        }

        return result;
    }

    ///////////////////////////////////////////////
    // Building systems

    public sModifyResources()
    {
        for (const entity of this.town.archetypes.resourceBuildings)
        {
            // Check if conditions met (enough inputs and output spaces)
            let minPercentage = 1.0;

            // Handle requirements
            for (const line of entity.ChangeResourcePerTick.requires)
            {
                minPercentage = Math.min(minPercentage, this.town.resources.GetResourceAmount(line.type) / (line.amount));
            }

            // Handle products
            for (const line of entity.ChangeResourcePerTick.products)
            {
                let res = this.town.resources.GetResource(line.type);
                minPercentage = Math.min(minPercentage, (res.max - res.current) / (line.amount));
            }

            if (minPercentage <= 1e-5) { continue; }

            // Consume requirements
            for (const line of entity.ChangeResourcePerTick.requires)
            {
                this.town.resources.AddResource(line.type, -line.amount * minPercentage);
            }

            // Produce products
            for (const line of entity.ChangeResourcePerTick.products)
            {
                this.town.resources.AddResource(line.type, line.amount * minPercentage);
            }
        }
    }
}
