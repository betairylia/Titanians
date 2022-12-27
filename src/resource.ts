import { World } from "miniplex"
import { Entity } from "./entity"

export type Resource = {
    isResource?: true
    stack?: {
        current: number
        max: number
    }
}

export enum ResourceType
{
    Fruit,
    Tree
}

export function AddResourceEntry(
    world: World<Entity>,
    type: ResourceType,
    current: number,
    max: number
)
{
    return world.add({
        isResource: true,
        id: "r" + ResourceType[type],
        stack: {
            current: current,
            max: max
        }
    });
}
