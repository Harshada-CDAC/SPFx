// src/webparts/annonymousapi/AnnonymousapiWebPart.ts

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnnonymousapiWebPartStrings';
import Annonymousapi from './components/Annonymousapi';
import { IAnnonymousapiProps } from './components/IAnnonymousapiProps';

import { HttpClient } from '@microsoft/sp-http';

export interface IAnnonymousapiWebPartProps {
  description: string;
}

export default class AnnonymousapiWebPart extends BaseClientSideWebPart<IAnnonymousapiWebPartProps> {

  protected onInit(): Promise<void> {
    return this.getUserDetails().then(() => {
      this.render();
    });
  }

  private getUserDetails(): Promise<any> {
    return this.context.httpClient.get(
      'https://jsonplaceholder.typicode.com/users/1',
      HttpClient.configurations.v1
    )
    .then(response => response.json())
    .then(jsonResponse => jsonResponse);
  }

  public render(): void {
    this.getUserDetails().then(response => {
      const element: React.ReactElement<IAnnonymousapiProps> = React.createElement(
        Annonymousapi,
        {
          id: response.id,
          username: response.username,
          name: response.name,
          email: response.email,
          address: `Street: ${response.address.street}, Suite: ${response.address.suite}, City: ${response.address.city}, Zip code: ${response.address.zipcode}`,
          phone: response.phone,
          website: response.website,
          company: response.company.name,
          description: this.properties.description // Optional if needed
        }
      );

      ReactDom.render(element, this.domElement);
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
