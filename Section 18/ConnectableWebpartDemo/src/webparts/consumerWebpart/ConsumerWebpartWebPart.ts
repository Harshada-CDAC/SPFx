import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneDynamicFieldSet,
  PropertyPaneDynamicField,
  DynamicDataSharedDepth,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ConsumerWebpartWebPartStrings';
import ConsumerWebpart from './components/ConsumerWebpart';
import { IConsumerWebpartProps } from './components/IConsumerWebpartProps';
import { DynamicProperty } from '@microsoft/sp-component-base';

export interface IConsumerWebpartWebPartProps {
  description: string;
  DeptTitleId: DynamicProperty<string>;
}

export default class ConsumerWebpartWebPart extends BaseClientSideWebPart<IConsumerWebpartWebPartProps> {

  public render(): void {
    const { description, DeptTitleId } = this.properties;

    const element: React.ReactElement<IConsumerWebpartProps> = React.createElement(
      ConsumerWebpart,
      {
        description,
        context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        DeptTitleId
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      'DeptTitleId': { dynamicPropertyType: 'string' }
    };
  }protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
             groupFields:[
              PropertyPaneDynamicFieldSet({
               label: 'Select Department ID' ,
               fields: [
                PropertyPaneDynamicField('DeptTitleId',{
                  label: 'Department ID'
                })
               ],
                  sharedConfiguration:{
                  depth: DynamicDataSharedDepth.Property,
                 source:{
                  sourcesLabel: 'Select the web part containing the list of Departments'
                }
              }
            })
              ]
            }
          ]
        }
      ]
    };
  }
}  