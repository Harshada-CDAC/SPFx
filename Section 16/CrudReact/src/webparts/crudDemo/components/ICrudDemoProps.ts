import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICrudDemoProps {
  description: string;  // Description of the component
  context: WebPartContext;  // Context provided by SPFx
  siteUrl: string;  // URL of the SharePoint site
}
