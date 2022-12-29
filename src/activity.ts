import { World } from "miniplex"
import { Entity } from "./entity"
import { ResourceType } from "./resource"
import { Town } from "./town"
import { BuildingType } from "./building"

export type Activity = 
{
    isActivity?: true,
    activated?: true,
    
    // Activities
    UseResourceOnce?: {
        type: ResourceType,
        amount: number
    }[],
    AddResourceOnce?: {
        type: ResourceType,
        amount: number
    }[],
    ConstructBuilding?: {
        type: BuildingType,
    }
}

export enum Activities 
{
    GatherFruit,
}

export function AddActivityEntry(
    world: World<Entity>,
    prototype: Entity
)
{
    let entity: any = {};
    Object.assign(entity, prototype);

    entity.isActivity = true;

    return world.add(entity);
}

///////////////////////////////////////////////
// Activity activation helpers / systems
// As we don't want activations to be actived only during ticks,
// so we ignored the ECS scheme of handling user inputs.
//
// i.e., in some ECS designs, user input is handled by an "INPUT"
// component, which modifies itself upon recieving inputs.
// After that, a system queries for "INPUT + X" entities and update
// component "X" with attributes contained in "INPUT".

export function HandleActivity(act: Entity, town: Town)
{
    console.log(act);

    if (UseResourceOnce(act, town))
    {
        AddResourceOnce(act, town);
        ConstructBuilding(act, town);
    }

    town.UpdateUI();
}

function AddResourceOnce(act: Entity, town: Town)
{
    if (act.hasOwnProperty("AddResourceOnce"))
    {
        for (const line of act.AddResourceOnce)
        {
            town.resources.AddResource(line.type, line.amount, false);
        }
    }
}

function UseResourceOnce(act: Entity, town: Town)
{
    // First check if resources are enough
    if (act.hasOwnProperty("UseResourceOnce"))
    {
        for (const line of act.UseResourceOnce)
        {
            // If no enough resources, abort this action
            if (town.resources.GetResource(line.type).resourceInfo.current < line.amount) { return false; }
        }
    }

    // Actually consumes the resources
    if (act.hasOwnProperty("UseResourceOnce"))
    {
        for (const line of act.UseResourceOnce)
        {
            town.resources.AddResource(line.type, -line.amount, false);
        }
    }

    return true;
}

function ConstructBuilding(act: Entity, town: Town)
{
    if (act.hasOwnProperty("ConstructBuilding"))
    {
        // Construct new building
        town.buildings.AddBuilding(town.buildings.GetBuildingPrototype(act.ConstructBuilding.type));

        // Update building cost
        if (act.hasOwnProperty("UseResourceOnce"))
        {
            act.UseResourceOnce = town.buildings.GetBuildingCost(act.ConstructBuilding.type);
        }
    }
}

///////////////////////////////////////////////
// Activity definition / prefabs

export const activities = {
    GatherFruit: {
        id: "aGatherFruit",
        AddResourceOnce: [{ type: "Fruit", amount: 1.0 }],
    } 
} satisfies Record<string, Entity>
