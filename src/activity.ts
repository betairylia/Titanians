import { World } from "miniplex"
import { Entity } from "./entity"
import { ResourceType } from "./resource"
import { Town } from "./town"

export type Activity = 
{
    isActivity?: true,
    activated?: true,
    AddResourceOnce?: {
        type: ResourceType,
        amount: number
    }
}

export enum Activities 
{
    GatherFruit,
}

export function AddActivityEntry(
    world: World<Entity>,
    prototype: any
)
{
    let entity: any = {};
    Object.assign(entity, prototype);

    entity.isActivity = true;

    return world.add(entity);
}

function AddResourceOnce(act: Entity, town: Town)
{
    if (act.hasOwnProperty("AddResourceOnce"))
    {
        town.resources.AddResource(act.AddResourceOnce.type, act.AddResourceOnce.amount);
    }
}

export function HandleActivity(act: Entity, town: Town)
{
    console.log(act);
    AddResourceOnce(act, town);

    town.UpdateUI();
}

export const activities = {
    GatherFruit: {
        id: "aGatherFruit",
        AddResourceOnce: { type: ResourceType.Fruit, amount: 1.0 },
    } 
} satisfies Record<string, Entity>
