import { Town } from "./town";
import { getStrings as L } from "./i18n/i18n";
import { HandleActivity } from "./activity";

export interface BuildingInfoPanel
{
    container: HTMLElement,
    constructBtn: HTMLButtonElement,
    name: HTMLElement,
    count: HTMLElement
}

export interface ResourceInfoPanel
{
    container: HTMLElement,
    name: HTMLElement,
    stack: HTMLElement,
    regen: HTMLElement,
}

export class UI
{
    resourceDiv = document.querySelector("#resources");
    resourcePanels: Map<string, ResourceInfoPanel> = new Map<string, ResourceInfoPanel>();
    resourceTemplate: HTMLTemplateElement = this.resourceDiv.querySelector("template");

    activityDiv = document.querySelector("#activities");
    activityButtons: Map<string, HTMLButtonElement> = new Map<string, HTMLButtonElement>();

    buildingInfoDiv = document.querySelector("#buildings");
    buildingInfoPanels: Map<string, BuildingInfoPanel> = new Map<string, BuildingInfoPanel>();
    buildingInfoTemplate: HTMLTemplateElement = this.buildingInfoDiv.querySelector("template");

    town: Town;

    constructor(town: Town)
    {
        this.town = town;
    }

    public Init()
    {
        this.town.archetypes.resources.onEntityAdded.add((e) =>
        {
            if (!this.resourcePanels.has(e.id))
            {
                let elem = (this.resourceTemplate.content.cloneNode(true) as HTMLElement).querySelector("div");
                elem.classList.add('resource');
                this.resourceDiv.appendChild(elem);

                // console.log(`Added Resource ${e.id}`);

                let resourcePanel = {
                    container: elem,
                    name: elem.querySelector("#name") as HTMLElement,
                    stack: elem.querySelector("#stack") as HTMLElement,
                    regen: elem.querySelector("#regen") as HTMLElement,
                }
                this.resourcePanels.set(e.id, resourcePanel);
                resourcePanel.name.innerHTML = `${L(e.id)}`;
            }
        })

        this.town.archetypes.activities.onEntityAdded.add((e) =>
        { 
            if (!this.activityButtons.has(e.id))
            {
                let elem = document.createElement('button');
                elem.classList.add('activity');
                this.activityDiv.appendChild(elem);

                elem.onclick = (event) => { HandleActivity(e, this.town) }
                elem.innerHTML = `${L(e.displayName == null ? e.id : e.displayName)}`;

                // console.log(`Added Activity ${e.id}`);

                this.activityButtons.set(e.id, elem);
                this.town.world.addComponent(e, "HTMLElement", { elem: elem, prevDisplay: elem.style.display });
            }
        });

        this.town.archetypes.buildingInfo.onEntityAdded.add((e) =>
        { 
            if (!this.buildingInfoPanels.has(e.id))
            {
                // let elem = document.createElement('button');
                let elem = (this.buildingInfoTemplate.content.cloneNode(true) as HTMLElement).querySelector("div");
                this.buildingInfoDiv.appendChild(elem);
                elem.id = 'info-' + e.buildingInfo.type;

                let panel: BuildingInfoPanel = {
                    container: elem,
                    constructBtn: elem.querySelector("#construct"),
                    name: elem.querySelector("#name"),
                    count: elem.querySelector("#count")
                };

                // TODO: If can construct
                panel.constructBtn.onclick = (event) => { HandleActivity(e, this.town); }
                panel.name.innerHTML = L('b' + e.buildingInfo.type);
                panel.count.innerHTML = "0";

                // console.log(`Added Activity ${e.id}`);

                this.activityButtons.set(e.id, panel.constructBtn);
                this.town.world.addComponent(e, "HTMLElement", { elem: panel.container, prevDisplay: panel.container.style.display });
                e.buildingInfo.ui = panel;
            }
        });

        // TODO: On remove

        // Visibility
        this.town.archetypes.hiddenHTML.onEntityAdded.add((e) =>
        {
            if (e.HTMLElement.elem.style.display != 'none')
            {
                e.HTMLElement.prevDisplay = e.HTMLElement.elem.style.display;
                e.HTMLElement.elem.style.display = 'none';
            }
        });

        this.town.archetypes.visibleHTML.onEntityAdded.add((e) =>
        {
            e.HTMLElement.elem.style.display = e.HTMLElement.prevDisplay;
        });

        // For debugging
        this.town.world.onEntityAdded.add((e) =>
        {
            console.log(`Added ${e.id}`, e);
            // console.log(e);
        })
    }

    public Update()
    {
        this.sUpdateResources();
        this.sUpdateBuildingInfo();
    }

    public sUpdateResources()
    {
        for (const entity of this.town.archetypes.resources)
        {
            let elem = this.resourcePanels.get(entity.id);

            // TODO: Update numbers only (seperate divs)
            if ('resourceInfo' in entity)
            {
                if (entity.resourceInfo.max > 0)
                {
                    elem.stack.innerHTML = `${entity.resourceInfo.current} / ${entity.resourceInfo.max}`;
                }
                else
                {
                    elem.stack.innerHTML = `${entity.resourceInfo.current}`;
                }

                if (entity.resourceInfo.tickModify != 0)
                {
                    let n = entity.resourceInfo.tickModify;
                    elem.regen.innerHTML = `${(n < 0 ? "" : "+") + n.toFixed(2)} / tick`
                }
                else
                {
                    elem.regen.innerHTML = "";
                }
            }
            else
            {

            }
        }
    }

    public sUpdateBuildingInfo()
    {
        for (const entity of this.town.archetypes.buildingInfo)
        {
            if (this.town.buildings.IsBuildingUnlocked(entity.buildingInfo.type))
            {
                this.town.world.removeComponent(entity, "hidden");
            }

            entity.buildingInfo.ui.count.innerHTML = `${this.town.buildings.archetypes[entity.buildingInfo.type].size}`;
            // Not necessary?
            // else
            // {
            //     this.town.world.addComponent(entity, "hidden", true);
            // }
        }
        
        // TODO: Remove buttons if activity has been removed
    }
}
