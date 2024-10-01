import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ProviderWebpartWebPartStrings';
import ProviderWebpart from './components/ProviderWebpart';
import { IProviderWebpartProps } from './components/IProviderWebpartProps';

import {
  IDynamicDataCallables,
  IDynamicDataPropertyDefinition
} from '@microsoft/sp-dynamic-data';
import { IDepartment } from './components/IDepartment';

export interface IProviderWebpartWebPartProps {
  description: string;
}

export default class ProviderWebpartWebPart extends BaseClientSideWebPart<IProviderWebpartWebPartProps> implements IDynamicDataCallables {
  private _selectedDepartment: IDepartment;

  protected onInit(): Promise<void> {
    this.context.dynamicDataSourceManager.initializeSource(this);
    return Promise.resolve();
  }

  public getPropertyDefinitions(): readonly IDynamicDataPropertyDefinition[] {
    return [
      {
        id: 'id',
        title: 'Selected Department ID'
      },
    ];
  }

  public getPropertyValue(propertyId: string): string | IDepartment {
    switch (propertyId) {
      case 'id':
        return this._selectedDepartment ? this._selectedDepartment.Id.toString() : '';
      default:
        throw new Error('Invalid property ID');
    }
  }

  private handleDepartmentChangeSelected = (department: IDepartment): void => {
    this._selectedDepartment = department;
    this.context.dynamicDataSourceManager.notifyPropertyChanged('id');
    console.log("End of the Handle Event: " + department.Id + " " + department.Title);
  }

  public render(): void {
    const element: React.ReactElement<IProviderWebpartProps> = React.createElement(
      ProviderWebpart,
      {
        description: this.properties.description,
        context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        onDepartmentSelected: this.handleDepartmentChangeSelected
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
