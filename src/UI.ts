import { Town } from "./town";
import { getStrings as L } from "./i18n/i18n";
import { HandleActivity } from "./activity";
import { BuildingType } from "./building";

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
    artResourceDiv = document.querySelector("#resources #artResources");
    envResourceDiv = document.querySelector("#resources #envResources");
    resourcePanels: Map<string, ResourceInfoPanel> = new Map<string, ResourceInfoPanel>();
    resourceTemplate: HTMLTemplateElement = document.querySelector("#resources").querySelector("template");

    activityDiv = document.querySelector("#activities");
    activityButtons: Map<string, HTMLButtonElement> = new Map<string, HTMLButtonElement>();

    buildingInfoDiv = document.querySelector("#buildings");
    buildingInfoPanels: Map<string, BuildingInfoPanel> = new Map<string, BuildingInfoPanel>();
    buildingInfoTemplate: HTMLTemplateElement = this.buildingInfoDiv.querySelector("template");

    tooltipDiv = document.querySelector("#tooltip");

    town: Town;

    constructor(town: Town)
    {
        this.town = town;
    }

    public Init()
    {
        this.town.resources.onResourceAdded.add((i) =>
        {
            if (!this.resourcePanels.has(i.type))
            {
                let elem = (this.resourceTemplate.content.cloneNode(true) as HTMLElement).querySelector("div");
                elem.classList.add('resource');

                let rData = this.town.resources.resourceData.get(i.type);
                if (rData.env === true)
                {
                    this.envResourceDiv.appendChild(elem);
                }
                else
                {
                    this.artResourceDiv.appendChild(elem);
                }

                // console.log(`Added Resource ${e.id}`);

                let resourcePanel = {
                    container: elem,
                    name: elem.querySelector("#name") as HTMLElement,
                    stack: elem.querySelector("#stack") as HTMLElement,
                    regen: elem.querySelector("#regen") as HTMLElement,
                }

                this.resourcePanels.set(i.type, resourcePanel);
                resourcePanel.name.innerHTML = `${L('r' + i.type)}`;
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
                panel.constructBtn.onclick = (event) =>
                {
                    HandleActivity(e, this.town);
                    this.ShowBuildingTooltip(e.buildingInfo.type);
                }
                panel.constructBtn.onpointerenter = (event) =>
                {
                    this.ShowBuildingTooltip(e.buildingInfo.type);
                }
                panel.constructBtn.onpointerleave = (event) =>
                {
                    this.HideTooltip();
                }

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

    ////////////////////////////////////////////////////////
    // Tooltips

    public ShowTooltip(tip: string)
    {
        this.tooltipDiv.innerHTML = tip;
    }

    public HideTooltip()
    {
        this.tooltipDiv.innerHTML = "";
    }

    public ShowBuildingTooltip(type: BuildingType)
    {
        let tip = "";
        let cost = this.town.buildings.GetBuildingCost(type);
        cost.forEach((x) =>
        {
            tip += `${L('r' + x.type)} x${x.amount.toFixed(2)}<br/>`;
        });

        this.ShowTooltip(tip);
    }

    public Update()
    {
        this.sUpdateResources();
        this.sUpdateBuildingInfo();
    }

    public sUpdateResources()
    {
        for (const info of this.town.resources.resourceMap.values())
        {
            let elem = this.resourcePanels.get(info.type);

            if (info.max > 0)
            {
                elem.stack.innerHTML = `${info.current.toFixed(2)} / ${info.max.toFixed(0)}`;
            }
            else
            {
                elem.stack.innerHTML = `${info.current.toFixed(2)}`;
            }

            let tickMod = info.tickModifyEnvHint;
            if (typeof tickMod === 'undefined') { tickMod = info.tickModify; }

            if (Math.abs(tickMod) > 1e-8)
            {
                let n = tickMod;
                elem.regen.innerHTML = `${(n < 0 ? "" : "+") + n.toFixed(4)} / ${L('tick')}`;
            }
            else
            {
                elem.regen.innerHTML = "";
            }

            // Toggle visibility
            if (info.visible === false)
            {
                elem.container.style.display = 'none';
            }
            else
            {
                elem.container.style.display = 'flex';
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

            // Check if can be constructed
            if (
                this.town.resources.IsAllResourceEnough(
                    this.town.buildings.GetBuildingCost(entity.buildingInfo.type)
            ))
            {
                entity.buildingInfo.ui.constructBtn.disabled = false;
            }
            else
            {
                entity.buildingInfo.ui.constructBtn.disabled = true;
            }
        }
        
        // TODO: Remove buttons if activity has been removed
    }
}
