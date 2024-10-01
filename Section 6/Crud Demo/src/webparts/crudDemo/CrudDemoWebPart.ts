import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'CrudDemoWebPartStrings';
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IsoSoftwareListItem } from './ISoftwareListItems';

export interface ICrudDemoWebPartProps {
  description: string;
}

export default class CrudDemoWebPart extends BaseClientSideWebPart<ICrudDemoWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <h2>Insert New Record</h2>
        <form>
          <table>
            <tr>
              <td><label for="TXT_softwareID">Software ID:</label></td>
              <td><input type="text" id="TXT_softwareID" /></td>
              <td><input type="button" id="btnRead" value="Read Details"/> </td>
            </tr>
            <tr>
              <td><label for="TXT_softwareTitle">Software Title:</label></td>
              <td><input type="text" id="TXT_softwareTitle" /></td>
            </tr>
            <tr>
              <td><label for="TXT_softwareName">Software Name:</label></td>
              <td><input type="text" id="TXT_softwareName" /></td>
            </tr>
            <tr>
              <td><label for="DDL_vendor">Vendor:</label></td>
              <td>
                <select id="DDL_vendor">
                  <option value="Microsoft">Microsoft</option>
                  <option value="Adobe">Adobe</option>
                  <option value="Google">Google</option>
                  <option value="Apple">Apple</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label for="TXT_version">Version:</label></td>
              <td><input type="text" id="TXT_version" /></td>
            </tr>
            <tr>
              <td><label for="TXT_description">Description:</label></td>
              <td><textarea id="TXT_description" rows="5" cols="30"></textarea></td>
            </tr>
            <tr>

              <td colspan="2" align="center">
                <input type="button" value="Insert Item" id="btnSubmit"/>
                <input type="button" value="Update Item" id="btnUpdate"/>
                <input type="button" value="Delete Item" id="btnDelete"/>



              </td>
            </tr>
          </table>
        </form>
        <div id="divStatus"></div>
      </div>
    `;
    this._bindEvents();
    this.readAllItems();
  }






// Read All items


private readAllItems(): void {
  this._getListItems().then(listItems => {
    // Start the HTML string for the table with CSS styles
    let html: string = `
      <style>
        #divStatus {
          width: 100%;
          height: 100vh; /* Full viewport height */
          overflow: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: lightpink; /* Light pink background for the table */
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2; /* Light gray background for header */
        }
      </style>
      <table>
        <tr>
          <th>Title</th>
          <th>Vendor</th>
          <th>Description</th>
          <th>Name</th>
          <th>Version</th>
        </tr>
    `;

    // Loop through each list item and generate a row in the table
    listItems.forEach(listItem => {
      html += `<tr>
        <td>${listItem.Title}</td>
        <td>${listItem.Vendor}</td>
        <td>${listItem.Description}</td>
        <td>${listItem.SoftwareName}</td>
        <td>${listItem.SoftwareVersion}</td>
      </tr>`;
    });

    // End the table
    html += '</table>';

    // Select the container and insert the HTML
    const listContainer: Element | null = this.domElement.querySelector('#divStatus');
    
    // Check if listContainer is not null before assigning innerHTML
    if (listContainer !== null) {
      listContainer.innerHTML = html;
    } else {
      console.error("Element with id 'divStatus' not found.");
    }
  }).catch(error => {
    console.error("Error retrieving list items: ", error);
  });
}



















private _getListItems(): Promise<IsoSoftwareListItem[]>{
  const url: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Software Catalog')/items";

  return this.context.spHttpClient.get(url,SPHttpClient.configurations.v1)
  .then(response =>{
    return response.json();

  })
  .then(json =>{
    return json.value;

  }) as Promise<IsoSoftwareListItem[]>;

}




  private _bindEvents(): void {
    this.domElement.querySelector('#btnSubmit')?.addEventListener('click', () => { this.addListItem(); });
    this.domElement.querySelector('#btnRead')?.addEventListener('click', () => { this.readListItem(); });
    this.domElement.querySelector('#btnUpdate')?.addEventListener('click', () => { this.updateListItem(); });
    this.domElement.querySelector('#btnDelete')?.addEventListener('click', () => { this.deleteListItem(); });

  }








//delete






private deleteListItem(): void {
  const id = (document.getElementById("TXT_softwareID") as HTMLInputElement).value;
  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Software Catalog')/items(${id})`;

  const headers: any = {
    'Accept': 'application/json;odata.metadata=none',  // Correct Accept header for OData v4
    'IF-MATCH': '*',  // Use "*" to match any ETag
    'X-HTTP-Method': 'DELETE'  // Specifies that the request is a DELETE request
  };

  const spHttpClientOptions: ISPHttpClientOptions = {
    headers: headers
  };

  this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse) => {
      const statusElement = document.getElementById('divStatus') as HTMLDivElement;

      if (response.status === 204) {
        statusElement.innerText = "List item has been deleted successfully.";
      } else {
        response.json().then((error) => {
          statusElement.innerText = `Error: ${response.status} - ${response.statusText}. Details: ${error.error.message || 'No additional details available'}`;
        }).catch(err => {
          statusElement.innerText = 'An error occurred while processing the response.';
        });
      }
    })
    .catch(error => {
      const statusElement = document.getElementById('divStatus') as HTMLDivElement;
      statusElement.innerText = `An error occurred while deleting the list item: ${error.message}`;
    });
}



                                     








//            UPDATE 


private updateListItem(): void {
  const id = (document.getElementById("TXT_softwareID") as HTMLInputElement).value;
  const Title = (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value;
  const softwareName = (document.getElementById('TXT_softwareName') as HTMLInputElement).value;
  const softwareVendor = (document.getElementById('DDL_vendor') as HTMLSelectElement).value;
  const softwareVersion = (document.getElementById('TXT_version') as HTMLInputElement).value;
  const softwareDescription = (document.getElementById('TXT_description') as HTMLTextAreaElement).value;

  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Software Catalog')/items(${id})`;

  const itemBody: any = {
    Title: Title,
    SoftwareName: softwareName,
    Vendor: softwareVendor,
    SoftwareVersion: softwareVersion,
    Description: softwareDescription
  };

  const headers: any = {
        'Accept': 'application/json;odata.metadata=none',  // For OData v4
    "Content-Type": "application/json;odata.metadata=none",  // Updated for OData v4
    "X-HTTP-Method": "MERGE",
    "IF-MATCH": "*"  // Use "*" to match any ETag
  };

  const spHttpClientOptions: ISPHttpClientOptions = {
    headers: headers,
    body: JSON.stringify(itemBody),
  };

  this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse) => {
      const statusElement = document.getElementById('divStatus') as HTMLDivElement;

      if (response.status === 204) {
        statusElement.innerText = "List item has been updated successfully";
      } else {
        response.json().then((error) => {
          statusElement.innerText = `Error: ${response.status} ${response.statusText}. Details: ${error.error.message || 'No details available'}`;
        }).catch(err => {
          statusElement.innerText = 'An error occurred while processing the response.';
        });
      }
    })
    .catch(error => {
      const statusElement = document.getElementById('divStatus') as HTMLDivElement;
      statusElement.innerText = `An error occurred while updating the list item: ${error.message}`;
    });
}





//                        READ

  private readListItem(): void {
    const id = (document.getElementById('TXT_softwareID') as HTMLInputElement).value;

    this._getListItemByID(id).then(listItem => {
      (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value = listItem.Title;
      (document.getElementById('DDL_vendor') as HTMLSelectElement).value = listItem.Vendor;
      (document.getElementById('TXT_description') as HTMLTextAreaElement).value = listItem.Description;
      (document.getElementById('TXT_softwareName') as HTMLInputElement).value = listItem.SoftwareName;
      (document.getElementById('TXT_version') as HTMLInputElement).value = listItem.SoftwareVersion;
    })
    .catch(error => {
      const message = this.domElement.querySelector('#divStatus') as HTMLDivElement;
      message.innerHTML = `Read: could not fetch details. ${error.message}`;
    });
  }

  private _getListItemByID(id: string): Promise<IsoSoftwareListItem> {
    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Software Catalog')/items?$filter=ID eq ${id}`;
  
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((listItems: any) => {
        if (listItems.value.length === 0) {
          throw new Error('No item found with the given ID');
        }
        const untypedItem: any = listItems.value[0];
        const listItem: IsoSoftwareListItem = untypedItem as IsoSoftwareListItem;
        return listItem;
      });
  }
  








//          Add






  private addListItem(): void {
    const softwareTitle = (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value;
    const softwareName = (document.getElementById('TXT_softwareName') as HTMLInputElement).value;
    const softwareVendor = (document.getElementById('DDL_vendor') as HTMLSelectElement).value;
    const softwareVersion = (document.getElementById('TXT_version') as HTMLInputElement).value;
    const softwareDescription = (document.getElementById('TXT_description') as HTMLTextAreaElement).value;
  
    const siteUrl = this.context.pageContext.web.absoluteUrl;
    const listUrl = `${siteUrl}/_api/web/lists/getbytitle('Software Catalog')/items`;
  
    const itemBody: any = {
      Title: softwareTitle,
      SoftwareName: softwareName,
      Vendor: softwareVendor,
      SoftwareVersion: softwareVersion,
      Description: softwareDescription
    };
  
    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify(itemBody),
      headers: {
        'Accept': 'application/json;odata.metadata=none',  // For OData v4
        'Content-Type': 'application/json;odata.metadata=none'
      }
    };
  
    this.context.spHttpClient.post(listUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          (document.getElementById('divStatus') as HTMLDivElement).innerText = 'List item has been created successfully';
          this._clearForm();
        } else {
          response.json().then((error) => {
            console.error('Error details:', error);
            (document.getElementById('divStatus') as HTMLDivElement).innerText = `Error: ${response.status} ${response.statusText}. Details: ${error.error.message || 'No details available'}`;
          }).catch(err => {
            console.error('Error parsing response:', err);
            (document.getElementById('divStatus') as HTMLDivElement).innerText = 'An error occurred while processing the response.';
          });
        }
      })
      .catch(error => {
        console.error('Error adding list item:', error);
        (document.getElementById('divStatus') as HTMLDivElement).innerText = 'An error occurred while adding the list item.';
      });
  }

  private _clearForm(): void {
    (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value = '';
    (document.getElementById('TXT_softwareName') as HTMLInputElement).value = '';
    (document.getElementById('DDL_vendor') as HTMLSelectElement).value = 'Microsoft';
    (document.getElementById('TXT_version') as HTMLInputElement).value = '';
    (document.getElementById('TXT_description') as HTMLTextAreaElement).value = '';
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      // Handle environment message if needed
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams':
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }
          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
  
 
    const { semanticColors } = currentTheme;
 
    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
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
 
 