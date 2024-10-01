import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ExternalLibrariesWebPartStrings';

import * as $ from 'jquery';
import 'jqueryui'; // Import only the required widget
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './ExternalLibrariesWebPart.module.scss';

export interface IExternalLibrariesWebPartProps {
  description: string;
}

export default class ExternalLibrariesWebPart extends BaseClientSideWebPart<IExternalLibrariesWebPartProps> {

  public constructor() {
    super();
    SPComponentLoader.loadCss('https://ajax.googleapis.com/ajax/libs/jquery/1.12.1/themes/smoothness/jquery-ui.css');
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.externalLibraries}">
        <div class="accordion">
          <h3>Lesson 14 - ECMAScript Implementation</h3>
          <div>
            <ul>
              <li>Overview of ECMAScript</li>
              <li>Using ECMAScript in Application pages</li>
              <li>Using ECMAScript in Web Parts</li>
              <li>Implementing onSuccess Function</li>
              <li>Implementing onFail Function</li>
            </ul>
          </div>
          <h3>Lesson 15 - Silverlight with SharePoint</h3>
          <div>
            <ul>
              <li>Overview of Silverlight Implementation</li>
              <li>Using Load Function to load resources</li>
              <li>Adding fields to a custom list using Silverlight Implementation</li>
              <li>Exception handling with Silverlight Implementation</li>
              <li>Cross Domain Policy</li>
            </ul>
          </div>
          <h3>Lesson 16 - Developing Custom Dialogs</h3>
          <div>
            <ul>
              <li>Create a Custom Dialog for Data Entry</li>
              <li>JavaScript and the Client object Model</li>
              <li>Model Dialogs</li>
              <li>Creating a Custom Dialog</li>
              <li>Controlling the Client Side Behavior and Visibility of the Dialog</li>
              <li>Adding Server Side Functionality to the Dialog</li>
              <li>Deploying and Testing the Dialog User Control</li>
            </ul>
          </div>
        </div>
      </div>`;

    const accordionOptions: JQueryUI.AccordionOptions = {
      animate: true,
      collapsible: false,
      icons: {
        header: 'ui-icon-circle-arrow-e',
        activeHeader: 'ui-icon-circle-arrow-s'
      }
    };

    ($('.accordion', this.domElement) as any).accordion(accordionOptions);
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
