import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import styles from './ISolatedWebpartWebPart.module.scss';
import * as strings from 'ISolatedWebpartWebPartStrings';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';



export interface IISolatedWebpartWebPartProps {
  description: string;
}

export default class ISolatedWebpartWebPart extends BaseClientSideWebPart<IISolatedWebpartWebPartProps> {
  public render(): void {
    this.context.msGraphClientFactory
    .getClient('3') // Specify the Graph API version
    .then((graphClient: MSGraphClientV3): void => {
      graphClient
        .api('/me')
        .get((error: any, user: MicrosoftGraph.User) => {
          if (error) {
            console.error(error);
            this.domElement.innerHTML = `<div>Error fetching user data.</div>`;
            return;
          }
  
            this.domElement.innerHTML = `
              <div>
                <p class="${styles.description}">${this.properties.description || 'No description provided'}</p>
                <p class="${styles.description}">Display Name: ${user.displayName || 'N/A'}</p>
                <p class="${styles.description}">Given Name: ${user.givenName || 'N/A'}</p>
                <p class="${styles.description}">Surname: ${user.surname || 'N/A'}</p>
                <p class="${styles.description}">Email ID: ${user.mail || 'N/A'}</p>
                <p class="${styles.description}">Mobile Phone: ${user.mobilePhone || 'N/A'}</p>
              </div>
            `;
          });
      })
      .catch(error => {
        console.error('Error getting Graph client:', error);
        this.domElement.innerHTML = `<div>Error initializing Graph client.</div>`;
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
            description: strings.PropertyPaneDescription // Ensure this exists in your strings
          },
          groups: [
            {
              groupName: strings.BasicGroupName, // Ensure this exists in your strings
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel // Ensure this exists in your strings
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
