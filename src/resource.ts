import { World } from "miniplex"
import { Entity } from "./entity"
import { Town } from "./town"
import { ResourceData } from "./gamedata"
import { Event } from "@hmans/event";

// export type Resource = {
//     isResource?: true,
//     renewable?: true,
//     resourceInfo?: {
//         type: ResourceType,
//         current: number,
//         max: number,
//         tickModify: number
//     }
// }

export type ResourceInfo = {
    type: ResourceType,
    current: number,
    max: number,
    tickModify: number
}

export type EnvironmentInfo = {
    amount: number,
    capacity: number
}

export const ResourceTypes =
{
    "Grass": 0,
    "Shrub": 0,
    "Oak": 0,
    "Picea": 0,

    "Fruit": 0,
    "Wood": 0,
}
export type ResourceType = keyof typeof ResourceTypes;

export class ResourceHolder
{
    public town: Town;

    public resourceData: Map<ResourceType, ResourceData> = new Map<ResourceType, ResourceData>();
    
    resourceMap: Map<ResourceType, ResourceInfo> = new Map<ResourceType, ResourceInfo>();
    static resourceMapUniversal: Map<ResourceType, ResourceInfo> = new Map<ResourceType, ResourceInfo>();

    public environment: EnvironmentInfo = {
        amount: 0,
        capacity: 1000,
    }

    public onResourceAdded: Event<ResourceInfo> = new Event<ResourceInfo>();
    public onResourceRemoved: Event<ResourceInfo> = new Event<ResourceInfo>();

    constructor(town: Town)
    {
        this.town = town;
    }

    private AddResourceEntry(
        type: ResourceType,
    )
    {
        if (!this.resourceMap.has(type))
        {
            let max: number = this.resourceData.get(type).initialMaxStacks;

            let info = {
                type: type,
                current: 0,
                max: max,
                tickModify: 0
            };
            this.resourceMap.set(type, info);

            // Also creates universal info if not presented
            if (!ResourceHolder.resourceMapUniversal.has(type))
            {
                let max: number = this.resourceData.get(type).initialUMaxStacks;

                let info = {
                    type: type,
                    current: 0,
                    max: max,
                    tickModify: 0
                };
                ResourceHolder.resourceMapUniversal.set(type, info);
            }

            this.onResourceAdded.emit(info);
            return info;
        }
    }

    public IsResourceEnough(
        type: ResourceType,
        amount: number
    )
    {
        let res = this.GetResource(type);
        return amount <= res.current;
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
            this.AddResourceEntry(type);
        }

        let info = this.resourceMap.get(type);
        
        // We are using resource; we may need to use universal resources.
        if (amount < 0)
        {
            // If local resource is not enough
            if (info.current < (-amount))
            {
                let uInfo = ResourceHolder.resourceMapUniversal.get(type);
                let uBefore = uInfo.current;
                uInfo.current += amount;
                if (uInfo.current < 0)
                {
                    uInfo.current = 0;
                }

                amount -= (uInfo.current - uBefore);
            }
        }

        let beforeAdd = info.current;
        info.current += amount;
        
        if (this.resourceData.get(type).env === true)
        {
            this.environment.amount += amount;
            if (this.environment.amount > this.environment.capacity)
            {
                info.current -= (this.environment.amount - this.environment.capacity);
                this.environment.amount = this.environment.capacity;
            }
        }

        if (info.max > 0
         && info.current >= info.max)
        {
            info.current = info.max;
        }

        if (info.current < 0)
        {
            info.current = 0;
        }

        if (tick)
        {
            info.tickModify += info.current - beforeAdd;
        }

        return (info.current - beforeAdd) / amount;
    }

    public GetResource(type: ResourceType): ResourceInfo
    {
        if (this.resourceMap.has(type))
        {
            // Combine universal
            if (ResourceHolder.resourceMapUniversal.has(type))
            {
                let uInfo = ResourceHolder.resourceMapUniversal.get(type);
                let lInfo = this.resourceMap.get(type);
                return {
                    type: type,
                    current: uInfo.current + lInfo.current,
                    max: uInfo.max + lInfo.max,
                    tickModify: lInfo.tickModify
                };
            }
            // No universal data, why tho?
            else
            {
                console.warn(`Universal data not found for resource ${type}. It might be a bug.`);
                return this.resourceMap.get(type);
            }
        }
        return null;
    }

    public GetResourceAmount(type: ResourceType)
    {
        if (this.resourceMap.has(type))
        {
            return this.resourceMap.get(type).current;
        }
        return 0;
    }

    ///////////////////////////////////////////////
    // Resource systems

    public sRefreshResource()
    {
        for (const info of this.resourceMap.values())
        {
            info.tickModify = 0;

            let type = info.type;
            if (this.resourceData.has(type))
            {
                let data = this.resourceData.get(type);
                let regenAmount = data.regenBase + data.regenFactor * info.current;

                this.AddResource(info.type, regenAmount);
            }
        }
    }

    public sTransferUniversalResource()
    {
        // TODO: Implement me
    }
}
