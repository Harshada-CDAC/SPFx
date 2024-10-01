import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset'; 

export interface IMultiGroupDemoWebPartProps {
  description: string;
  productname: string;
  isCertified: boolean;
}

export default class MultiGroupDemoWebPart extends BaseClientSideWebPart<IMultiGroupDemoWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <section>
        <div>
          <p>${escape(this.properties.description)}</p>

          <p>Customize SharePoint experiences using web part</p>
          <p>${escape(this.properties.productname)}</p>

          <p>Customize SharePoint experiences using web part</p>
          <p>${this.properties.isCertified ? 'Certified' : 'Not Certified'}</p>

          <p>Customize SharePoint experiences using web part</p>
        </div>
      </section>`;
  }

  protected onInit(): Promise<void> {
    return Promise.resolve();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: {
          description: "Page 1"
        },
        groups: [{
          groupName: "My First Group",
          groupFields: [
            PropertyPaneTextField('productname', {
              label: "Product Name 1"
            })
          ]
        }, {
          groupName: "My Second Group",
          groupFields: [
            PropertyPaneToggle('isCertified', {
              label: "Is Certified 1?"
            })
          ]
        }],
        displayGroupsAsAccordion: true
      },

      {
        header: {
          description: "Page 2"
        },
        groups: [{
          groupName: "My First Group",
          groupFields: [
            PropertyPaneTextField('productname', {
              label: "Product Name 2"
            })
          ]
        }, {
          groupName: "My Second Group",
          groupFields: [
            PropertyPaneToggle('isCertified', {
              label: "Is Certified 2?"
            })
          ]
        }],
        displayGroupsAsAccordion: true
      },


      {
        header: {
          description: "Page 3"
        },
        groups: [{
          groupName: "My First Group",
          groupFields: [
            PropertyPaneTextField('productname', {
              label: "Product Name 3"
            })
          ]
        }, {
          groupName: "My Second Group",
          groupFields: [
            PropertyPaneToggle('isCertified', {
              label: "Is Certified 3?"
            })
          ]
        }],
        displayGroupsAsAccordion: true
      },


      {
        header: {
          description: "Page 4"
        },
        groups: [{
          groupName: "My First Group",
          groupFields: [
            PropertyPaneTextField('productname', {
              label: "Product Name 4"
            })
          ]
        }, {
          groupName: "My Second Group",
          groupFields: [
            PropertyPaneToggle('isCertified', {
              label: "Is Certified 4?"
            })
          ]
        }],
        displayGroupsAsAccordion: true
      },


      

    
    
    
    
    
    
    
    ]
    };
  }
}
