import { World } from "miniplex"
import { Entity } from "./entity"
import { Town } from "./town"
import { ResourceData } from "./gamedata"

export type Resource = {
    isResource?: true,
    renewable?: true,
    resourceInfo?: {
        type: ResourceType,
        current: number,
        max: number,
        tickModify: number
    }
}

export const ResourceTypes =
{
    "Fruit": 0,
    "Tree": 0
}
export type ResourceType = keyof typeof ResourceTypes;

export class ResourceHelper
{
    public town: Town;
    resourceMap: Map<ResourceType, Entity> = new Map<ResourceType, Entity>();
    public resourceData: Map<ResourceType, ResourceData> = new Map<ResourceType, ResourceData>();

    constructor(town: Town)
    {
        this.town = town;
    }

    public AddResourceEntry(
        type: ResourceType,
        current: number,
        max: number
    )
    {
        let id = "r" + type;
        if (!this.resourceMap.has(type))
        {
            let ent = this.town.world.add({
                isResource: true,
                id: id,
                resourceInfo: {
                    type: type,
                    current: current,
                    max: max,
                    tickModify: 0
                }
            });
            this.resourceMap.set(type, ent);

            return ent;
        }
    }

    // Returns: % of final added resource (w.r.t. amount)
    public AddResource(
        type: ResourceType,
        amount: number,
        tick: boolean = true)
    {
        if (!this.resourceMap.has(type))
        {
            // TODO: default maximum?
            this.AddResourceEntry(type, 0, 0);
        }

        let ent = this.resourceMap.get(type);

        let beforeAdd = ent.resourceInfo.current;
        ent.resourceInfo.current += amount;
        if (ent.resourceInfo.max > 0
         && ent.resourceInfo.current >= ent.resourceInfo.max)
        {
            ent.resourceInfo.current = ent.resourceInfo.max;
        }

        if (tick)
        {
            ent.resourceInfo.tickModify += ent.resourceInfo.current - beforeAdd;
        }

        return (ent.resourceInfo.current - beforeAdd) / amount;
    }

    public GetResource(type: ResourceType)
    {
        if (this.resourceMap.has(type))
        {
            return this.resourceMap.get(type);
        }
        return null;
    }

    public GetResourceAmount(type: ResourceType)
    {
        if (this.resourceMap.has(type))
        {
            return this.resourceMap.get(type).resourceInfo.current;
        }
        return 0;
    }

    ///////////////////////////////////////////////
    // Resource systems

    public sRefreshResource()
    {
        for (const entity of this.town.archetypes.resources)
        {
            entity.resourceInfo.tickModify = 0;

            let type = entity.resourceInfo.type;
            if (this.resourceData.has(type))
            {
                let data = this.resourceData.get(type);
                let regenAmount = data.regenBase + data.regenFactor * entity.resourceInfo.current;

                this.AddResource(entity.resourceInfo.type, regenAmount);
            }
        }
    }
}
