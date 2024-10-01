import { DynamicProperty } from "@microsoft/sp-component-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IConsumerWebpartProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  DeptTitleId: DynamicProperty<string>;
}
