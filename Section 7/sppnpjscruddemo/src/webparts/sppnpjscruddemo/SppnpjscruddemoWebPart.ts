import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SppnpjscruddemoWebPartStrings';

import * as pnp from 'sp-pnp-js';

export interface ISppnpjscruddemoWebPartProps {
  description: string;
}

export default class SppnpjscruddemoWebPart extends BaseClientSideWebPart<ISppnpjscruddemoWebPartProps> {

 


  public render(): void {
    this.domElement.innerHTML = `
      <div style="background-color: lightpink; padding: 10px;">
        <table border="1" style="background-color: lightpink;">
          <tr>
            <td><label for="TXT_softwareID">Software ID:</label></td>
            <td><input type="text" id="TXT_softwareID" /></td>
            <td><input type="button" id="btnRead" value="Read Details" /></td>
          </tr>
          <tr>
            <td>Software Title:</td>
            <td><input type="text" id="TXT_softwareTitle" /></td>
          </tr>
          <tr>
            <td>Software Name:</td>
            <td><input type="text" id="TXT_softwareName" /></td>
          </tr>
          <tr>
            <td>Software Vendor:</td>
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
            <td>Software Version:</td>
            <td><input type="text" id="TXT_version" /></td>
          </tr>
          <tr>
            <td>Description:</td>
            <td><textarea id="TXT_description" rows="5" cols="30"></textarea></td>
          </tr>
          <tr>
            <td colspan="2" align="center">
              <input type="button" value="Insert Item" id="btnSubmit" />
              <input type="button" value="Update" id="btnUpdate" />
              <input type="button" value="Delete Item" id="btnDelete" />
              <input type="button" value="Show All Records" id="btnReadAll" />
            </td>
          </tr>
        </table>
        <div id="divStatus"></div>
        <h2>Get All List Items</h2>
        <hr />
        <div id="splistdata"></div>
      </div>
    `;
  
    this._bindEvents();
    this.readAllItems();
  }
  

  private readAllItems(): void {
    let html: string = `<table border="1" width="100%" style="border-collapse: collapse;">`;
    html += `<tr><th>Title</th><th>Vendor</th><th>Name</th><th>Version</th><th>Description</th></tr>`;
  
    pnp.sp.web.lists.getByTitle("Software Catalog").items.get().then((items: any[]) => {
      items.forEach(function (item) {
        html += `
        <tr>
          <td>${item["Title"]}</td>
          <td>${item["Vendor"]}</td>
          <td>${item["SoftwareName"]}</td>
          <td>${item["SoftwareVersion"]}</td>
          <td>${item["Description"]}</td>
        </tr>`;
      });
  
      // End the table
      html += '</table>';
  
      // Find the element and ensure it's not null before assigning
      const allItems: HTMLElement | null = this.domElement.querySelector('#splistdata');
      
      if (allItems) {
        allItems.innerHTML = html;
      } else {
        console.error('Element with ID "splistdata" not found');
      }
  
    }).catch(error => {
      console.error("Error fetching list items: ", error);
    });
  }
  

  



     
  
  
  
  





  private _bindEvents(): void {
    this.domElement.querySelector('#btnSubmit')?.addEventListener('click', () => { this.addListItem(); });
    this.domElement.querySelector('#btnRead')?.addEventListener('click', () => { this.readListItem(); });
    this.domElement.querySelector('#btnUpdate')?.addEventListener('click', () => { this.updateListItem(); });
    this.domElement.querySelector('#btnDelete')?.addEventListener('click', () => { this.deleteListItem(); });
  }




  private deleteListItem(): void {
    // Parse the ID from the input field
    const id = parseInt((document.getElementById('TXT_softwareID') as HTMLInputElement).value, 10);
    
    // Validate if the ID is a valid number
    if (isNaN(id)) {
      alert('Please enter a valid numeric ID.');
      return;
    }
  
    // Log the ID being deleted for debugging purposes
    console.log(`Attempting to delete item with ID: ${id}`);
  
    // Attempt to delete the item from the list
    pnp.sp.web.lists.getByTitle("Software Catalog").items.getById(id).delete()
      .then(() => {
        alert(`Item with ID ${id} has been deleted successfully.`);
        console.log(`Item with ID ${id} deleted successfully.`);
        this._clearForm(); // Clear the form after successful deletion
      })
      .catch(error => {
        console.error(`Error deleting item with ID ${id}: `, error);
        alert(`An error occurred while deleting the item with ID ${id}. Check the console for details.`);
      });
  }
  



 





  private updateListItem(): void {
    const title = (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value;
    const softwareName = (document.getElementById('TXT_softwareName') as HTMLInputElement).value;
    const softwareVendor = (document.getElementById('DDL_vendor') as HTMLSelectElement).value;
    const softwareVersion = (document.getElementById('TXT_version') as HTMLInputElement).value;
    const softwareDescription = (document.getElementById('TXT_description') as HTMLTextAreaElement).value;
  
    const id = parseInt((document.getElementById('TXT_softwareID') as HTMLInputElement).value);
  
    pnp.sp.web.lists.getByTitle("Software Catalog").items.getById(id).update({
      Title: title,
      SoftwareName: softwareName,
      Vendor: softwareVendor,
      SoftwareVersion: softwareVersion,
      Description: softwareDescription
    })
    .then(() => {
      alert("Details Updated");
    })
    .catch(error => {
      console.error("Error updating list item: ", error);
      alert("Failed to update item.");
    });
  }
  












  private readListItem(): void {
    const id = (document.getElementById('TXT_softwareID') as HTMLInputElement).value;
  
    pnp.sp.web.lists.getByTitle("Software Catalog").items.getById(parseInt(id)).get()
      .then((listItem: any) => {
        (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value = listItem.Title;
        (document.getElementById('DDL_vendor') as HTMLSelectElement).value = listItem.Vendor;
        (document.getElementById('TXT_description') as HTMLTextAreaElement).value = listItem.Description;
        (document.getElementById('TXT_softwareName') as HTMLInputElement).value = listItem.SoftwareName;
        (document.getElementById('TXT_version') as HTMLInputElement).value = listItem.SoftwareVersion;
      })
      .catch(error => {
        console.error("Error retrieving list item: ", error);
        alert("Failed to retrieve item.");
      });
  }
  








  private addListItem(): void {
    const softwareTitle = (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value;
    const softwareName = (document.getElementById('TXT_softwareName') as HTMLInputElement).value;
    const softwareVendor = (document.getElementById('DDL_vendor') as HTMLSelectElement).value;
    const softwareVersion = (document.getElementById('TXT_version') as HTMLInputElement).value;
    const softwareDescription = (document.getElementById('TXT_description') as HTMLTextAreaElement).value;

    const listTitle: string = 'Software Catalog';

    pnp.sp.web.lists.getByTitle(listTitle).items.add({
      Title: softwareTitle,
      SoftwareName: softwareName,
      Vendor: softwareVendor,
      SoftwareVersion: softwareVersion,
      Description: softwareDescription
    })
    .then(() => {
      alert("Item added successfully.");
      this._clearForm();
    })
    .catch(error => {
      console.error("Error adding item: ", error);
      alert("Failed to add item.");
    });
  }

  private _clearForm(): void {
    (document.getElementById('TXT_softwareTitle') as HTMLInputElement).value = '';
    (document.getElementById('TXT_softwareName') as HTMLInputElement).value = '';
    (document.getElementById('DDL_vendor') as HTMLSelectElement).value = 'Microsoft'; // Default value
    (document.getElementById('TXT_version') as HTMLInputElement).value = '';
    (document.getElementById('TXT_description') as HTMLTextAreaElement).value = '';
  }

  public onInit(): Promise<void> {
    return super.onInit().then(() => {
      pnp.setup({
        spfxContext: this.context
      });
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
