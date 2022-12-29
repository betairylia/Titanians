import { Building } from "./building"
import { Resident } from "./resident"
import { Resource, ResourceType } from "./resource"
import { Activity } from "./activity"

/* Define an entity type */
export type Entity = 
    Resident
  & Resource
  & Building
  & Activity
  & {
        id: string,
      
        displayName?: string,
        HTMLElement?: { elem: HTMLElement, prevDisplay: string },
        hidden?: true
    }
