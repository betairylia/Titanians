import { ResourceType, ResourceTypes } from "./resource";
import { Town } from "./town";
import { parse as parseCSV } from "papaparse";

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

export interface ResourceData
{
    type: ResourceType,
    initialMaxStacks: number,
    regenBase: number,
    regenFactor: number,
    color: string
}

function ds(s: string, def: string)
{
    return s === '' ? def : s;
}

export function LoadAllData(town: Town)
{
    return new Promise<void>((resolve, reject) =>
    {
        LoadFile("data/Resource.csv").then((csv) =>
        {
            let data = parseCSV<any>(csv, {
                header: true,
            });
            for (const line of data.data.slice(2))
            {
                if ((line.type in ResourceTypes))
                {
                    let data: ResourceData = {
                        type: line.type,
                        initialMaxStacks: Number(ds(line.initialMaxStacks, '0')),
                        regenBase: Number(ds(line.regenBase, '0')),
                        regenFactor: Number(ds(line.regenFactor, '0')),
                        color: ds(line.color, "#000000")
                    };

                    town.resources.resourceData.set(line.type, data);
                    console.log(data);
                }
            }

            resolve();
        })
    });
}