import { ISoftwareListItem } from "./ISoftwareListItem";
 
export interface ICrudDemoState{
    status:string;
    SoftwareListItems: ISoftwareListItem[];
    SoftwareListItem: ISoftwareListItem;
 
}