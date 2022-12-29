import { World } from "miniplex"
import { Entity } from "./entity"
import { Town } from "./town"

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

export class ResourceHelper
{
    public town: Town;
    resourceMap: Map<string, Entity>;

    constructor(town: Town)
    {
        this.town = town;
        this.resourceMap = new Map<string, Entity>();
    }

    public AddResourceEntry(
        type: ResourceType,
        current: number,
        max: number
    )
    {
        let id = "r" + ResourceType[type];
        if (!this.resourceMap.has(id))
        {
            let ent = this.town.world.add({
                isResource: true,
                id: id,
                stack: {
                    current: current,
                    max: max
                }
            });
            this.resourceMap.set(id, ent);

            return ent;
        }
    }

    // Returns: % of final added resource (w.r.t. amount)
    public AddResource(
        type: ResourceType,
        amount: number)
    {
        let id = "r" + ResourceType[type];
        if (!this.resourceMap.has(id))
        {
            // TODO: default maximum?
            this.AddResourceEntry(type, 0, 0);
        }
        
        return this.AddResourceByID(id, amount);
    }

    public AddResourceByID(
        id: string,
        amount: number)
    {
        let ent = this.resourceMap.get(id);

        let beforeAdd = ent.stack.current;
        ent.stack.current += amount;
        if (ent.stack.max > 0
         && ent.stack.current >= ent.stack.max)
        {
            ent.stack.current = ent.stack.max;
        }

        return (ent.stack.current - beforeAdd) / amount;
    }

    public GetResource(type: ResourceType)
    {
        let id = "r" + ResourceType[type];
        if (this.resourceMap.has(id))
        {
            return this.resourceMap.get(id);
        }
        return null;
    }
}
