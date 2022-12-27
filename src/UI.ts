import { Town } from "./town";
import { getStrings as L } from "./i18n/i18n";
import { HandleActivity } from "./activity";

export class UI
{
    resourceDiv = document.querySelector("#resources");
    resourcePanels: Map<string, HTMLElement> = new Map<string, HTMLElement>();

    activityDiv = document.querySelector("#activities");
    activityButtons: Map<string, HTMLButtonElement> = new Map<string, HTMLButtonElement>();

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
                let elem = document.createElement('div');
                elem.classList.add('resource');
                this.resourceDiv.appendChild(elem);

                console.log(`Added Resource ${e.id}`);

                this.resourcePanels.set(e.id, elem);
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
                elem.innerHTML = `${L(e.id)}`;

                console.log(`Added Activity ${e.id}`);

                this.activityButtons.set(e.id, elem);
            }
        });

        // TODO: On remove
    }

    public Update()
    {
        this.sUpdateResources();
        this.sUpdateActivities();
    }

    public sUpdateResources()
    {
        for (const entity of this.town.archetypes.resources)
        {
            let elem = this.resourcePanels.get(entity.id);

            // TODO: Update numbers only (seperate divs)
            if ('stack' in entity)
            {
                if (entity.stack.max > 0)
                {
                    elem.innerHTML = `${L(entity.id)} - ${entity.stack.current} / ${entity.stack.max}`;
                    console.log(elem.innerHTML);
                }
                else
                {
                    elem.innerHTML = `${L(entity.id)} - ${entity.stack.current}`;
                }
            }
            else
            {
                elem.innerHTML = `${L(entity.id)}`;
            }
        }
    }

    public sUpdateActivities()
    {
        for (const entity of this.town.archetypes.activities)
        {
            
        }
        // TODO: Remove buttons if activity has been removed
    }
}
