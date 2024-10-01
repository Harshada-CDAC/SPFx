import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ListCreationDemoWebPart.module.scss';
import * as strings from 'ListCreationDemoWebPartStrings';

import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

export interface IListCreationDemoWebPartProps {
  description: string;
}

export default class ListCreationDemoWebPart extends BaseClientSideWebPart<IListCreationDemoWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.listCreationDemo}">

    <h3>Creating a New List Dynamically</h3><br/><br/>

    <p>Please fill out the below details to create a new list programmatically</p><br/><br/>
   
    New List Name :<br/><input type='text' id='textNewListName'/><br/><br/>
    
    New List Description :<br/><input type='text' id='textNewDescription'/><br/><br/>
    
    <input type="button" id="btnCreateNewList" value="Create a New List"/><br/>

    <div></div>
 
    </section>`;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.domElement.querySelector('#btnCreateNewList')?.addEventListener('click', () => { this.createNewList(); });
  }

  private createNewList(): void {
    const newListName = (document.getElementById("textNewListName") as HTMLInputElement).value;
    const newListDescription = (document.getElementById("textNewDescription") as HTMLInputElement).value;

    const listUrl: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${newListName}')`;

    // Check if the list already exists
    this.context.spHttpClient.get(listUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 200) {
          alert(`A list already exists with the name: ${newListName}`);
          return;
        }

        if (response.status === 404) {
          const url: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists`;
          const listDefinition: any = {
            "Title": newListName,
            "Description": newListDescription,
            "AllowContentTypes": true,
            "BaseTemplate": 105,
            "ContentTypesEnabled": true,
          };

          const spHttpClientOptions: ISPHttpClientOptions = {
            body: JSON.stringify(listDefinition)
          };

          // Create the new list
          this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
            .then((response: SPHttpClientResponse) => {
              if (response.status === 201) {
                alert("A new list has been created successfully.");
              } else {
                alert(`Error Message: ${response.status} - ${response.statusText}`);
              }
            });
        } else {
          alert(`Error Message: ${response.status} - ${response.statusText}`);
        }
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
