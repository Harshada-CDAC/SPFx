import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import HwWebpartWithReact from './components/HwWebpartWithReact';
import { IHwWebpartWithReactProps } from './components/IHwWebpartWithReactProps';

export interface IHwWebpartWithReactWebPartProps {
  description: string;
}

export default class HwWebpartWithReactWebPart extends BaseClientSideWebPart<IHwWebpartWithReactWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IHwWebpartWithReactProps> = React.createElement(
      HwWebpartWithReact,
      {
        absoluteurl: this.context.pageContext.web.absoluteUrl,
        sitetitle: this.context.pageContext.web.title,
        relativeurl: this.context.pageContext.web.serverRelativeUrl,
        username: this.context.pageContext.user.displayName,
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
            description: 'Configure the web part'
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
