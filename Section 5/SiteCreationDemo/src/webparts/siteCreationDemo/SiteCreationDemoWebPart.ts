import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './SiteCreationDemoWebPart.module.scss';
import * as strings from 'SiteCreationDemoWebPartStrings';

export interface ISiteCreationDemoWebPartProps {
  description: string;
}

export default class SiteCreationDemoWebPart extends BaseClientSideWebPart<ISiteCreationDemoWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <section class="${styles.siteCreationDemo}">
      <h1>Create A New Subsite</h1><br/><br/>

      <p>Please fill out the below details to create a new subsite</p><br/><br/>
     
      Sub Site Title :<br/><input type='text' id='txtSubsiteTitle'/><br/><br/>
      
      Sub Site URL :<br/><input type='text' id='txtSubsiteUrl'/><br/><br/>
  
      Sub Site Description :<br/><textarea id='txtSubSiteDescription' rows="5" cols="30"></textarea><br/><br/>
  
      <input type="button" id="btnCreateSubsite" value="Create a Sub Site"/><br/>
      </section>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.domElement.querySelector('#btnCreateSubsite')?.addEventListener('click', () => {
      this.createSubSite();
    });
  }

  private createSubSite(): void {
    const subSiteTitle: string = (document.getElementById("txtSubsiteTitle") as HTMLInputElement).value;
    const subSiteUrl: string = (document.getElementById("txtSubsiteUrl") as HTMLInputElement).value;
    const subSiteDescription: string = (document.getElementById("txtSubSiteDescription") as HTMLTextAreaElement).value;

    const url: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/webinfos/add`;

    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify({
        parameters: {
          "@odata.type": "SP.WebInfoCreationInformation",
          "Title": subSiteTitle,
          "Url": subSiteUrl,
          "Description": subSiteDescription,
          "Language": 1033,
          "WebTemplate": "STS#0",
          "UseUniquePermissions": true
        }
      })
    };

    this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 200) {
          alert("A new site has been created successfully.");
        } else {
          alert(`Error: ${response.status} - ${response.statusText}`);
        }
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
