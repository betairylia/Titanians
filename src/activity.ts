import { World } from "miniplex"
import { Entity } from "./entity"
import { ResourceType } from "./resource"
import { Town } from "./town"

export type Activity = 
{
    isActivity?: true,
    activated?: true,
    AddResource?: {
        id: string,
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

export const activities = {
    GatherFruit: {
        id: "aGatherFruit",
        AddResource: { id: "rFruit", amount: 1.0 },
    } 
} satisfies Record<string, Entity>

export function HandleActivity(act: Entity, town: Town)
{
    console.log(act);
}
