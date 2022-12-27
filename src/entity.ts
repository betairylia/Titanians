import { Building } from "./building"
import { Resident } from "./resident"
import { Resource } from "./resource"

/* Define an entity type */
export type Entity = 
    Resident
  & Resource
  & Building
  & { id: string }