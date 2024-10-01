import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup,
  PropertyPaneDropdown,
  PropertyPaneCheckbox,
  PropertyPaneLink,

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './PropertyPaneWebPart.module.scss';

export interface IPropertyPaneWebPartProps {
  description: string;
  productname: string;
  productdescription: string;
  productcost: number;
  quantity: number;
  billamount: number;
  discount: number;
  netbillamount: number;


  currentTime: Date;
  IsCertified: boolean;

  Rating: number;
  processortype: string;

  InvoiceFileType: string;

  newProcessorType: string,

  discountCoupon: boolean
}

export default class PropertyPaneWebPart extends BaseClientSideWebPart<IPropertyPaneWebPartProps> {

 
 
 
  protected onInit(): Promise<void>
  {
    return new Promise<void>((resolve, _reject)=> {

    this.properties.currentTime = new Date();  
    this.properties.productname="Mouse";
    this.properties.productdescription="Mouse description";
    this.properties.quantity=500;
    this.properties.productcost=300;

    resolve(undefined);
  
  });
}



protected get disableReactivePropertyChanges(): boolean{
  return false;
}



public render(): void {
    const billAmount = this.properties.productcost * this.properties.quantity;
    const discount = billAmount * 0.1;
    const netBillAmount = billAmount - discount;

    this.properties.billamount = billAmount;
    this.properties.discount = discount;
    this.properties.netbillamount = netBillAmount;

    this.domElement.innerHTML = '';

    this.domElement.innerHTML = `
      <section class="${styles.propertyPane}"> 

        <table>
            <tr>
                <th>Current Date and Time</th>
                <td>${this.properties.currentTime.toLocaleString()}</td> 
          </tr>
          <tr>
            <th>Product Name</th>
            <td>${this.properties.productname}</td>
          </tr>
          <tr>
            <th>Product Description</th>
            <td>${this.properties.productdescription}</td>
          </tr>
          <tr>
            <th>Product Cost</th>
            <td>${this.properties.productcost}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>${this.properties.quantity}</td>
          </tr>
          <tr>
            <th>Bill Amount</th>
            <td>${this.properties.billamount}</td>
          </tr>
          <tr>
            <th>Discount</th>
            <td>${this.properties.discount}</td>
          </tr>
          <tr>
            <th>Net Bill Amount</th>
            <td>${this.properties.netbillamount}</td>
          </tr>

          <tr>
          <th>IS Certified</th>
          <td>${this.properties.IsCertified}</td>
        </tr>

        <tr>
        <th>Rating</th>
        <td>${this.properties.Rating}</td>
        </tr>


        <tr>
        <th>Processor Type</th>
        <td>${this.properties.processortype}</td>
        </tr>


        <tr>
        <th>Invoice File Type</th>
        <td>${this.properties.InvoiceFileType}</td>
        </tr>


        <tr>
        <th>New Processor Type</th>
        <td>${this.properties.newProcessorType}</td>
        </tr>


        <tr>
        <th>Do you have a discount coupon?</th>
        <td>${this.properties.discountCoupon}</td>
        </tr>


  

        </table>
      </section>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: "Product Details",
              groupFields: [
                PropertyPaneTextField('productname', {
                  label: "Product Name",
                  multiline: false,
                  resizable: false,
                  deferredValidationTime: 5000,
                  placeholder: "please enter product name",
                  description: "Name property field"
                }),
                PropertyPaneTextField('productdescription', {
                  label: "Product Description",
                  multiline: true,
                  resizable: false,
                  deferredValidationTime: 5000,
                  placeholder: "please enter product description",
                  description: "Description property field"
                }),
                PropertyPaneTextField('productcost', {
                  label: "Product Cost",
                  multiline: false,
                  resizable: false,
                  deferredValidationTime: 5000,
                  placeholder: "please enter product cost",
                  description: "Cost property field"
                }),
                PropertyPaneTextField('quantity', {
                  label: "Product Quantity",
                  multiline: false,
                  resizable: false,
                  deferredValidationTime: 5000,
                  placeholder: "please enter product quantity",
                  description: "Quantity property field"
                }),


                PropertyPaneToggle('IsCertified',{
                  key: 'Iscertified',
                  label: 'it is Certified?',
                  onText: 'ISI Certified!',
                  offText: 'Not an ISI Certified Product'
                }),

                  PropertyPaneSlider('Rating',{
                    label: 'Select Your Rating',
                    min: 1,
                    max: 10,
                    step: 1,
                    showValue: true,
                    value: 1

                  }),

                PropertyPaneChoiceGroup('processortype',{
                  label: 'Choices',
                  options: [
                    
                    {key: 'I5',text: 'Intel I5'},
                    {key: 'I7',text: 'Intel I7',checked: true},
                    {key: 'I9',text: 'Intel I9'}
                    
                  ]
             

                 }),


                PropertyPaneChoiceGroup('InvoiceFileType', {
                  label: 'Select Invoice File Type',
                  options: [
                    {
                      key: 'MSExcel', text: 'MSExcel',
                      imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNyilNjVC-0SaIDcc4kegAhCMxsWQoneb9sQ&usqp=CAU',
                      imageSize:{ width:32, height:32},
                      selectedImageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNyilNjVC-0SaIDcc4kegAhCMxsWQoneb9sQ&usqp=CAU'
                   
                    },


                    {
                      key: 'OneNote', text: 'OneNote',
                      imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbbCHviHpNmV5t4ynscSCjzje3viG87jjgcHJraLAmx1Q-qNxDcvT7v0dGYfX-gxootK4&usqp=CAU',
                      imageSize:{ width:32, height:32},
                      selectedImageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbbCHviHpNmV5t4ynscSCjzje3viG87jjgcHJraLAmx1Q-qNxDcvT7v0dGYfX-gxootK4&usqp=CAU',
                   
                    },

                  
                    {
                    key: 'MSPowerpoint', text: 'MSPowerpoint',
                    imageSrc: 'data:image/png;base64,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',
                    imageSize:{ width:32, height:32},
                    selectedImageSrc: 'data:image/png;base64,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'
                 
                  },


                  {
                    key: 'MSWord', text: 'MSWord',
                    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbSz-keLWzihGW1cdVdhMpPh4FPcPgF3VptQ&usqp=CAU',
                    imageSize:{ width:32, height:32},
                    selectedImageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbSz-keLWzihGW1cdVdhMpPh4FPcPgF3VptQ&usqp=CAU',
                 
                  }
             ]
            }),

            PropertyPaneDropdown('newProcessorType',{
              label: "New Processor Type",
              options: [
                {key: 'I5',text: 'Intel I5'},
                {key: 'I7',text: 'Intel I7'},
                {key: 'I9',text: 'Intel I9'}
             ],
             selectedKey: 'I5'
            }),

            PropertyPaneCheckbox('discountCoupon',{
              text: 'Do You have a Discount Coupon?',
              checked: false,
              disabled: false
            }),


            PropertyPaneLink('',{
              href:'https://www.amazon.in/',
              text: 'Buy Intel Processor from the best seller',
              target: '_blank',

              popupWindowProps: {
                height: 500,
                width: 500,
                positionWindowPosition: 2,
                title: 'Amazon'

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
