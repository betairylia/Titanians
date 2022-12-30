import { Building } from "./building"
import { Resident } from "./resident"
import { ResourceType } from "./resource"
import { Activity } from "./activity"

/* Define an entity type */
export type Entity = 
    Resident
  & Building
  & Activity
  & {
        id: string,
      
        displayName?: string,
        HTMLElement?: { elem: HTMLElement, prevDisplay: string },
        hidden?: true
    }
