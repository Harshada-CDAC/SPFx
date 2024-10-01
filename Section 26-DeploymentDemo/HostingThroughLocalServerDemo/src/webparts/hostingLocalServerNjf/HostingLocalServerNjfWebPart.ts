import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export interface IHostingLocalServerNjfWebPartProps {
  description: string;
}

export default class HostingLocalServerNjfWebPart extends BaseClientSideWebPart<IHostingLocalServerNjfWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div style="text-align: center; font-size: 24px; margin-top: 20px;">
        Welcome tO the Sharepoint Framework
       
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Property Pane"
          },
          groups: [
            {
              groupName: "Basic Settings",
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Description"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
