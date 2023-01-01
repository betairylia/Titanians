import { ResourceData } from "../gamedata";
import { ResourceType } from "../resource";

export const resourceDataDefaults: ResourceData = {
    initialMaxStacks: 0,
    regenBase: 0,
    regenFactor: 0,
    color: "#000000",
    initialUMaxStacks: 0,
    initialUTransferSpeed: 0,
    env: false
};

export const resourceData: Record<ResourceType, ResourceData> = {
    "Grass": {"env": true, "regenFactor": 2e-4},
    "Shrub": {"env": true, "regenFactor": 1.3e-4},
    "Oak": {"env": true, "regenFactor": 8e-5},
    "Picea": {"env": true, "regenFactor": 5e-6},

    "Fruit": {"initialMaxStacks": 1000, "initialUTransferSpeed": 0.05},
    "Wood": {"initialMaxStacks": 20},
    "Branch": {"initialMaxStacks": 100},
    
    "Culture": {"initialMaxStacks": 100}
};
