import { ResourceType, ResourceTypes } from "./resource";
import { Town } from "./town";
import { parse as parseCSV } from "papaparse";

import { BuildingType } from "./building";
import { Entity } from "./entity";

function LoadFile(path: string)
{
    return new Promise<string>((res, rej) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                res(xhr.responseText);
            }
        }
        xhr.open('GET', path);
        xhr.send();
    })   
}

//////////////////////////////////////////////////////////////////////////

export interface ResourceData
{
    type?: ResourceType,
    initialMaxStacks?: number,
    regenBase?: number,
    regenFactor?: number,
    color?: string,
    initialUMaxStacks?: number,
    initialUTransferSpeed?: number,
    
    env?: boolean,
}
export type ResourceDataSheet = Record<ResourceType, ResourceData>;

const resourceDataDefaults: ResourceData = {
    initialMaxStacks: 0,
    regenBase: 0,
    regenFactor: 0,
    color: "#000000",
    initialUMaxStacks: 0,
    initialUTransferSpeed: 0,
    env: false
};

//////////////////////////////////////////////////////////////////////////

export interface BuildingData
{
    // How much will the building cost?
    buildCost?: {
        type: ResourceType,
        base: number,

        // Actual cost = base * pow(growth, #buildings)
        growth?: number,
    }[],
    growthAll?: number,

    // When will this building be visible?
    visibleRequirements?: {
        type: ResourceType
    }[] | false,

    prototype?: Entity,
}
export type BuildingDataSheet = Record<BuildingType, BuildingData>;

const BuildingDataDefaults: BuildingData = {
    buildCost: [],
    growthAll: 1.5,
    visibleRequirements: [],
    prototype: {id: "UNKNOWN"}
}

//////////////////////////////////////////////////////////////////////////

function ds(s: string, def: string)
{
    return s === '' ? def : s;
}

export function LoadAllData(town: Town)
{
    return new Promise<void>((resolve, reject) =>
    {
        Promise.all([
            LoadFile("data/resources.json"),
            LoadFile("data/buildings.json"),
        ]).then((parsedJSON) =>
        {
            ////////////////////////////////////////////////
            // Resources

            {
                let resourceJSON = parsedJSON[0];

                let obj: ResourceDataSheet = JSON.parse(resourceJSON);
                if (obj.hasOwnProperty("$schema"))
                {
                    delete (obj as any)["$schema"];
                }

                for (const type in obj)
                {
                    let line = obj[type as ResourceType];
                    let newData: ResourceData = { type: type as ResourceType };
                
                    Object.assign(newData, structuredClone(resourceDataDefaults));
                    Object.assign(newData, structuredClone(line));

                    town.resources.resourceData.set(type as ResourceType, newData);
                    console.log(`Read resource data of ${type}:`, newData);
                }
            }

            ////////////////////////////////////////////////
            // Buildings

            {
                let buildingJSON = parsedJSON[1];
                let obj: BuildingDataSheet = JSON.parse(buildingJSON);
                if (obj.hasOwnProperty("$schema"))
                {
                    delete (obj as any)["$schema"];
                }

                for (const type in obj)
                {
                    let line = obj[type as BuildingType];
                    let newData: BuildingData = {};
                
                    Object.assign(newData, structuredClone(BuildingDataDefaults));
                    Object.assign(newData, structuredClone(line));

                    // Fill cost
                    newData.buildCost.forEach((x) =>
                    {
                        if (typeof x.growth === 'undefined') { x.growth = newData.growthAll; }
                    });

                    // Fill prototype
                    if (!newData.prototype.hasOwnProperty(type))
                    {
                        (newData.prototype as any)[type] = {};
                    }
                    if (!newData.prototype.hasOwnProperty("id") || newData.prototype.id === "UNKNOWN")
                    {
                        newData.prototype.id = "b" + type;
                    }

                    town.buildings.data.set(type as BuildingType, newData);
                    console.log(`Read buliding data of ${type}:`, newData);
                }
            }

            resolve();
        })
    });
}