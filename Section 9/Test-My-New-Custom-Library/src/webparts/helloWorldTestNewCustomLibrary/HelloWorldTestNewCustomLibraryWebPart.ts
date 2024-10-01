import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset'; // Needed for escaping

import * as strings from 'HelloWorldTestNewCustomLibraryWebPartStrings';
import * as myLibrary from 'my-new-custom-library'; // Correctly import your custom library
import styles from './HelloWorldTestNewCustomLibraryWebPart.module.scss';

export interface IHelloWorldTestNewCustomLibraryWebPartProps {
  description: string;
}

export default class HelloWorldTestNewCustomLibraryWebPart extends BaseClientSideWebPart<IHelloWorldTestNewCustomLibraryWebPartProps> {

  public render(): void {
    const myInstance = new myLibrary.HelloWorldMynewCustomLibraryLibrary();

    // Use backticks for template literals and properly structure the HTML inside the string
    this.domElement.innerHTML = `
      <p class="${styles.title}">Welcome to SharePoint!</p>
      <p class="${styles.subTitle}">Customize SharePoint experiences using web parts</p>
      <p class="${styles.description}">${escape(this.properties.description)}</p>
      <p>Calling library function:</p>
      <p>${myInstance.getCurrentTime()}</p>
    `;
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
