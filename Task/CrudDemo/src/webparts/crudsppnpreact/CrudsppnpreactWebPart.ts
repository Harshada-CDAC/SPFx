import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import HelloWorld from './components/Crudsppnpreact';
import { ICrudsppnpreactProps } from './components/ICrudsppnpreactProps';
import * as strings from 'CrudsppnpreactWebPartStrings';


export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  

  public render(): void {
    const element: React.ReactElement<ICrudsppnpreactProps> = React.createElement(
      HelloWorld,
      {
        description: this.properties.description,
        
        context:this.context
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
