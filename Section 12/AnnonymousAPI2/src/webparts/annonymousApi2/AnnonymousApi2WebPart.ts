import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnnonymousApi2WebPartStrings';
import AnnonymousApi2 from './components/AnnonymousApi2';
import { IAnnonymousApi2Props } from './components/IAnnonymousApi2Props';

export interface IAnnonymousApi2WebPartProps {
  description: string;
  userID: string;
  apiURL: string;
}

export default class AnnonymousApi2WebPart extends BaseClientSideWebPart<IAnnonymousApi2WebPartProps> {
  private _environmentMessage: string;
  public render(): void {
    const element: React.ReactElement<IAnnonymousApi2Props> = React.createElement(
      AnnonymousApi2,
      {
        description: this.properties.description,
        apiURL: this.properties.apiURL,
        userID: this.properties.userID,
        environmentMessage: this._environmentMessage, // Provide environment message if needed
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        context: this.context // Pass context if needed
      }
    );
  
    ReactDom.render(element, this.domElement);
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
                }),
                PropertyPaneTextField('apiURL', {
                  label: "News API URL"
                }),
                PropertyPaneTextField('userID', {
                  label: "User ID"
                })
              ]
            }
          ]
        }
      ]
    };
  }

}