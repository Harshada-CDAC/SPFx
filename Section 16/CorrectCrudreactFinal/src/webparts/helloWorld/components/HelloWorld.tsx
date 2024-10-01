
import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import autobind from 'autobind-decorator';
import styles from './HelloWorld.module.scss';
import {
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
  Dropdown,
  ITextFieldStyles,
  IDropdownStyles,
  Selection,
  PrimaryButton,
} from '@fluentui/react';
import { ISoftwareListItem } from './ISoftwareListItem';
import { IHelloWorldProps } from './IHelloWorldProps';
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
const narrowDropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };


const _softwareListColumns = [

  { key: 'ID', name: 'ID', fieldName: 'ID', minWidth: 50, maxWidth: 100, isResizable: true },

  { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },

  { key: 'SoftwareName', name: 'Software Name', fieldName: 'SoftwareName', minWidth: 100, maxWidth: 200, isResizable: true },

  { key: 'SoftwareVendor', name: 'Software Vendor', fieldName: 'SoftwareVendor', minWidth: 100, maxWidth: 200, isResizable: true },

  { key: 'SoftwareDescription', name: 'Software Description', fieldName: 'SoftwareDescription', minWidth: 100, maxWidth: 200, isResizable: true },

  { key: 'SoftwareVersion', name: 'Software Version', fieldName: 'SoftwareVersion', minWidth: 100, maxWidth: 200, isResizable: true }

];

import * as strings from 'HelloWorldWebPartStrings';

export interface IHelloWorldState {
  status: string;
  SoftwareListItems: ISoftwareListItem[];
  SoftwareListItem: ISoftwareListItem;
}

export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {
  private _selection: Selection;

  constructor(props: IHelloWorldProps) {
    super(props);

    console.log("Log: Entered Constructor...");
    this.state = {
      status: 'Ready',
      SoftwareListItems: [],
      SoftwareListItem: {
        Id: 0,
        Title: '',
        SoftwareName: '',
        SoftwareDescription: '',
        SoftwareVendor: 'Select an option',
        SoftwareVersion: '',
      },
    };

    this._selection = new Selection({
      onSelectionChanged: this._onItemsSelectionChanged,
    });
  }

  private _onItemsSelectionChanged = () => {
    console.log("Entered into _onItemsSelectionChanged");

    const selectedItem = this._selection.getSelection()[0] as ISoftwareListItem;
    if (selectedItem) {
      console.log("Selected Record is:", selectedItem);
      this.setState({ SoftwareListItem: selectedItem });
    }
  };

  private _getListItems(): Promise<ISoftwareListItem[]> {
    const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`;
    
    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        console.log("Fetched records from REST API...");
        return response.json();
      })
      .then((json: { value: ISoftwareListItem[] }) => {
        console.table(json.value);
        return json.value;
      });
  }

  public bindDetailsList(message: string): void {
    this._getListItems().then(listItems => {
      this.setState({ SoftwareListItems: listItems, status: message });
      console.log("Received data:", listItems);
    });
  }

  public componentDidMount(): void {
    this.bindDetailsList('All records have been loaded successfully');
  }

  @autobind
  public btnAdd_click(): void {
    const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`;
    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify(this.state.SoftwareListItem),
      headers: { 'Content-Type': 'application/json' }
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 201) {
          this.bindDetailsList("Record added and all records were loaded successfully");
        } else {
          this.setState({ status: `Error: ${response.status} - ${response.statusText}` });
        }
      });
  }

  @autobind
  public btnUpdate_click(): void {
    const id: number = this.state.SoftwareListItem.Id;
    const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items(${id})`;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "IF-MATCH": "*",
      'Content-Type': 'application/json'
    };
    const spHttpClientOptions: ISPHttpClientOptions = {
      headers: headers,
      body: JSON.stringify(this.state.SoftwareListItem)
    };

    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 204) {
          this.bindDetailsList("Record updated and all records were loaded successfully");
        } else {
          this.setState({ status: `Error: ${response.status} - ${response.statusText}` });
        }
      });
  }

  @autobind
  public btnDelete_click(): void {
    const id: number = this.state.SoftwareListItem.Id;
    const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items(${id})`;
    const headers: any = {
      "X-HTTP-Method": "DELETE",
      "IF-MATCH": "*",
    };
    const spHttpClientOptions: ISPHttpClientOptions = {
      headers: headers,
    };
  
    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 204) {
          alert("Record deleted successfully.");
          this.bindDetailsList("Record deleted and all records were loaded successfully");
        } else {
          this.setState({ status: `Error: ${response.status} - ${response.statusText}` });
        }
      });
  }
  

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <h2>Software List</h2>

        <TextField
          label={strings.lblID}
          required={true}
          value={this.state.SoftwareListItem.Title}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                Title: value,
              },
            }));
          }}
        />



        <TextField
          label={strings.lblSoftwareTitle}
          required={true}
          value={this.state.SoftwareListItem.Title}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                Title: value,
              },
            }));
          }}
        />

        <TextField
          label={strings.lblSoftwareName}
          required={true}
          value={this.state.SoftwareListItem.SoftwareName}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareName: value,
              },
            }));
          }}
        />

        <TextField
          label={strings.lblSoftwareDescription}
          required={true}
          value={this.state.SoftwareListItem.SoftwareDescription}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareDescription: value,
              },
            }));
          }}
        />

        <TextField
          label={strings.lblSoftwareVersion}
          required={true}
          value={this.state.SoftwareListItem.SoftwareVersion}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareVersion: value,
              },
            }));
          }}
        />

        <Dropdown
          placeholder="Select an option"
          label={strings.lblSoftwareVendor}
          options={[
            { key: 'Microsoft', text: 'Microsoft' },
            { key: 'Sun', text: 'Sun' },
            { key: 'Oracle', text: 'Oracle' },
            { key: 'Google', text: 'Google' },
          ]}
          selectedKey={this.state.SoftwareListItem.SoftwareVendor}
          required
          styles={narrowDropdownStyles}
          onChange={(event, option) => {
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareVendor: option?.text || '',
              },
            }));
          }}
        />

        <PrimaryButton text="Add" onClick={this.btnAdd_click} />
        <PrimaryButton text="Update" onClick={this.btnUpdate_click} />
        <PrimaryButton text="Delete" onClick={this.btnDelete_click} />

        <div id="divStatus">{this.state.status}</div>

        <DetailsList
          items={this.state.SoftwareListItems}
          columns={_softwareListColumns}
          setKey="Id"
          checkboxVisibility={CheckboxVisibility.onHover}
          selectionMode={SelectionMode.single}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          compact={true}
          selection={this._selection}
        />
      </div>
    );
  }
}















//Section 16,22,23

// import * as React from 'react';
// import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
// import autobind from 'autobind-decorator';
// import styles from './HelloWorld.module.scss';
// import {
//   TextField,
//   DetailsList,
//   DetailsListLayoutMode,
//   CheckboxVisibility,
//   SelectionMode,
//   Dropdown,
//   ITextFieldStyles,
//   IDropdownStyles,
//   Selection,
//   PrimaryButton,
// } from '@fluentui/react';
// import { ISoftwareListItem } from './ISoftwareListItem';
// import { IHelloWorldProps } from './IHelloWorldProps';
// const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
// const narrowDropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };


// const _softwareListColumns = [

//   { key: 'ID', name: 'ID', fieldName: 'ID', minWidth: 50, maxWidth: 100, isResizable: true },

//   { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },

//   { key: 'SoftwareName', name: 'Software Name', fieldName: 'SoftwareName', minWidth: 100, maxWidth: 200, isResizable: true },

//   { key: 'SoftwareVendor', name: 'Software Vendor', fieldName: 'SoftwareVendor', minWidth: 100, maxWidth: 200, isResizable: true },

//   { key: 'SoftwareDescription', name: 'Software Description', fieldName: 'SoftwareDescription', minWidth: 100, maxWidth: 200, isResizable: true },

//   { key: 'SoftwareVersion', name: 'Software Version', fieldName: 'SoftwareVersion', minWidth: 100, maxWidth: 200, isResizable: true }

// ];

// export interface IHelloWorldState {
//   status: string;
//   SoftwareListItems: ISoftwareListItem[];
//   SoftwareListItem: ISoftwareListItem;
// }

// export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {
//   private _selection: Selection;

//   constructor(props: IHelloWorldProps) {
//     super(props);

//     console.log("Log: Entered Constructor...");
//     this.state = {
//       status: 'Ready',
//       SoftwareListItems: [],
//       SoftwareListItem: {
//         Id: 0,
//         Title: '',
//         SoftwareName: '',
//         SoftwareDescription: '',
//         SoftwareVendor: 'Select an option',
//         SoftwareVersion: '',
//       },
//     };

//     this._selection = new Selection({
//       onSelectionChanged: this._onItemsSelectionChanged,
//     });
//   }

//   private _onItemsSelectionChanged = () => {
//     console.log("Entered into _onItemsSelectionChanged");

//     const selectedItem = this._selection.getSelection()[0] as ISoftwareListItem;
//     if (selectedItem) {
//       console.log("Selected Record is:", selectedItem);
//       this.setState({ SoftwareListItem: selectedItem });
//     }
//   };

//   private _getListItems(): Promise<ISoftwareListItem[]> {
//     const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`;
    
//     return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
//       .then((response: SPHttpClientResponse) => {
//         console.log("Fetched records from REST API...");
//         return response.json();
//       })
//       .then((json: { value: ISoftwareListItem[] }) => {
//         console.table(json.value);
//         return json.value;
//       });
//   }

//   public bindDetailsList(message: string): void {
//     this._getListItems().then(listItems => {
//       this.setState({ SoftwareListItems: listItems, status: message });
//       console.log("Received data:", listItems);
//     });
//   }

//   public componentDidMount(): void {
//     this.bindDetailsList('All records have been loaded successfully');
//   }

//   @autobind
//   public btnAdd_click(): void {
//     const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`;
//     const spHttpClientOptions: ISPHttpClientOptions = {
//       body: JSON.stringify(this.state.SoftwareListItem),
//       headers: { 'Content-Type': 'application/json' }
//     };

//     this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
//       .then((response: SPHttpClientResponse) => {
//         if (response.status === 201) {
//           this.bindDetailsList("Record added and all records were loaded successfully");
//         } else {
//           this.setState({ status: `Error: ${response.status} - ${response.statusText}` });
//         }
//       });
//   }

//   @autobind
//   public btnUpdate_click(): void {
//     const id: number = this.state.SoftwareListItem.Id;
//     const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items(${id})`;
//     const headers: any = {
//       "X-HTTP-Method": "MERGE",
//       "IF-MATCH": "*",
//       'Content-Type': 'application/json'
//     };
//     const spHttpClientOptions: ISPHttpClientOptions = {
//       headers: headers,
//       body: JSON.stringify(this.state.SoftwareListItem)
//     };

//     this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
//       .then((response: SPHttpClientResponse) => {
//         if (response.status === 204) {
//           this.bindDetailsList("Record updated and all records were loaded successfully");
//         } else {
//           this.setState({ status: `Error: ${response.status} - ${response.statusText}` });
//         }
//       });
//   }

//   @autobind
//   public btnDelete_click(): void {
//     const id: number = this.state.SoftwareListItem.Id;
//     const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items(${id})`;
//     const headers: any = {
//       "X-HTTP-Method": "DELETE",
//       "IF-MATCH": "*",
//     };
//     const spHttpClientOptions: ISPHttpClientOptions = {
//       headers: headers,
//     };
  
//     this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
//       .then((response: SPHttpClientResponse) => {
//         if (response.status === 204) {
//           alert("Record deleted successfully.");
//           this.bindDetailsList("Record deleted and all records were loaded successfully");
//         } else {
//           this.setState({ status: `Error: ${response.status} - ${response.statusText}` });
//         }
//       });
//   }
  

//   public render(): React.ReactElement<IHelloWorldProps> {
//     return (
//       <div className={styles.helloWorld}>
//         <h2>Software List</h2>

//         <TextField
//           label="Software Title"
//           required={true}
//           value={this.state.SoftwareListItem.Title}
//           styles={textFieldStyles}
//           onChange={e => {
//             const value = e.currentTarget.value;
//             this.setState(prevState => ({
//               SoftwareListItem: {
//                 ...prevState.SoftwareListItem,
//                 Title: value,
//               },
//             }));
//           }}
//         />

//         <TextField
//           label="Software Name"
//           required={true}
//           value={this.state.SoftwareListItem.SoftwareName}
//           styles={textFieldStyles}
//           onChange={e => {
//             const value = e.currentTarget.value;
//             this.setState(prevState => ({
//               SoftwareListItem: {
//                 ...prevState.SoftwareListItem,
//                 SoftwareName: value,
//               },
//             }));
//           }}
//         />

//         <TextField
//           label="Software Description"
//           required={true}
//           value={this.state.SoftwareListItem.SoftwareDescription}
//           styles={textFieldStyles}
//           onChange={e => {
//             const value = e.currentTarget.value;
//             this.setState(prevState => ({
//               SoftwareListItem: {
//                 ...prevState.SoftwareListItem,
//                 SoftwareDescription: value,
//               },
//             }));
//           }}
//         />

//         <TextField
//           label="Software Version"
//           required={true}
//           value={this.state.SoftwareListItem.SoftwareVersion}
//           styles={textFieldStyles}
//           onChange={e => {
//             const value = e.currentTarget.value;
//             this.setState(prevState => ({
//               SoftwareListItem: {
//                 ...prevState.SoftwareListItem,
//                 SoftwareVersion: value,
//               },
//             }));
//           }}
//         />

//         <Dropdown
//           placeholder="Select an option"
//           label="Software Vendor"
//           options={[
//             { key: 'Microsoft', text: 'Microsoft' },
//             { key: 'Sun', text: 'Sun' },
//             { key: 'Oracle', text: 'Oracle' },
//             { key: 'Google', text: 'Google' },
//           ]}
//           selectedKey={this.state.SoftwareListItem.SoftwareVendor}
//           required
//           styles={narrowDropdownStyles}
//           onChange={(event, option) => {
//             this.setState(prevState => ({
//               SoftwareListItem: {
//                 ...prevState.SoftwareListItem,
//                 SoftwareVendor: option?.text || '',
//               },
//             }));
//           }}
//         />

//         <PrimaryButton text="Add" onClick={this.btnAdd_click} />
//         <PrimaryButton text="Update" onClick={this.btnUpdate_click} />
//         <PrimaryButton text="Delete" onClick={this.btnDelete_click} />

//         <div id="divStatus">{this.state.status}</div>

//         <DetailsList
//           items={this.state.SoftwareListItems}
//           columns={_softwareListColumns}
//           setKey="Id"
//           checkboxVisibility={CheckboxVisibility.onHover}
//           selectionMode={SelectionMode.single}
//           layoutMode={DetailsListLayoutMode.fixedColumns}
//           compact={true}
//           selection={this._selection}
//         />
//       </div>
//     );
//   }
// }
