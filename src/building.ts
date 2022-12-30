import { ArchetypeBucket, With } from "miniplex";
import { Entity } from "./entity";
import { ResourceType } from "./resource"
import { Town } from "./town"
import { AddActivityEntry, activities } from "./activity";
import { BuildingInfoPanel } from "./UI";

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
}
export type BuildingType = keyof typeof BuildingTypesDef;

export class BuildingHelper
{
    public town: Town;
    public archetypes: Partial<Record<BuildingType, ArchetypeBucket<With<Entity, "isBuilding" | BuildingType>>>> = {};

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
        return BuildingHelper.buildings[type];
    }

    public GetBuildingCost(type: BuildingType): {type: ResourceType, amount: number}[]
    {
        return [];
        // return [{ type: "Wood", amount: 5 }];
    }

    public IsBuildingUnlocked(type: BuildingType): boolean
    {
        // TODO: FIXME: Test only
        return this.town.resources.GetResourceAmount("Fruit") >= 10;
    }

    ///////////////////////////////////////////////
    // Building systems

    public sModifyResources()
    {
        for (const entity of this.town.archetypes.resourceBuildings)
        {
            // TODO: Handle overflow etc.
            let shouldBreak = false;

            // Handle requirements
            for (const line of entity.ChangeResourcePerTick.requires)
            {
                let result = this.town.resources.AddResource(line.type, -line.amount);
                if (result < (1 - 1e-7)) { shouldBreak = true; break; }
            }

            if (shouldBreak) { break; }

            // Handle products
            for (const line of entity.ChangeResourcePerTick.products)
            {
                let result = this.town.resources.AddResource(line.type, line.amount);
                if (result < (1 - 1e-7)) { shouldBreak = true; }
            }
         
            if (shouldBreak) { break; }
        }
    }

    ///////////////////////////////////////////////
    // Building definition / prefabs

    static buildings:Record<BuildingType, Entity> = {
        "Plantation": {
            id: "bPlantation",
            ChangeResourcePerTick: {
                requires: [],
                products: [{ type: "Fruit", amount: 1.0 }]
            },
            Plantation: {}
        },
        "Farm": {
            id: "bFarm",
            Farm: {}
        },
        "LoggingCamp": {
            id: "bLoggingCamp",
            ChangeResourcePerTick: {
                requires: [{ type: "Oak", amount: 0.02 }],
                products: [{ type: "Wood", amount: 0.15 }]
            },
            LoggingCamp: {},
        }
    }
}
