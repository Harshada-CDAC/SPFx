import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import autobind from 'autobind-decorator';
 
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
const narrowDropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };
 
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
  IDropdown,
  PrimaryButton,
} from '@fluentui/react';
import { ISoftwareListItem } from './ISoftwareListItem';
import { ICrudDemoProps } from './ICrudDemoProps';
import { ICrudDemoState } from './ICrudDemoState';
import styles from './CrudDemo.module.scss';
 
const _softwareListColumns = [
  { key: 'ID', name: 'ID', fieldName: 'ID', minWidth: 50, maxWidth: 100, isResizable: true },
  { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 50, maxWidth: 100, isResizable: true },
  { key: 'SoftwareName', name: 'SoftwareName', fieldName: 'SoftwareName', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'SoftwareVendor', name: 'SoftwareVendor', fieldName: 'SoftwareVendor', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'SoftwareDescription', name: 'SoftwareDescription', fieldName: 'SoftwareDescription', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'SoftwareVersion', name: 'SoftwareVersion', fieldName: 'SoftwareVersion', minWidth: 100, maxWidth: 200, isResizable: true }
];
 
export default class CrudWithReact2 extends React.Component<ICrudDemoProps, ICrudDemoState> {
  private _selection: Selection;
 
  private _onItemsSelectionChanged = () => {
    this.setState({
      SoftwareListItem: this._selection.getSelection()[0] as ISoftwareListItem,
    });
  };
 
  constructor(props: ICrudDemoProps) {
    super(props);
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
 
  private _getListItems(): Promise<ISoftwareListItem[]> {
    const url: string = `${this.props.siteUrl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`;
    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: { json: () => any; }) => response.json())
      .then((json: { value: any; }) => json.value) as Promise<ISoftwareListItem[]>;
  }
 
  public bindDetailsList(message: string): void {
    this._getListItems().then(listItems => {
      this.setState({ SoftwareListItems: listItems, status: message });
    });
  }
 
  public componentDidMount(): void {
    this.bindDetailsList('All records have been loaded successfully');
  }
 
  @autobind
  public btnAdd_click(): void{
    const url: string=this.props.siteUrl+ "/_api/web/lists/getbytitle('MicrosoftSoftware')/items";
 
    const spHttpClientOptions: ISPHttpClientOptions={
      "body": JSON.stringify(this.state.SoftwareListItem)
    };
    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response:SPHttpClientResponse)=>{
 
      if(response.status===201){
        this.bindDetailsList("Record added and all records were loaded successfully")
 
      }else{
        let errormessage:string="An error has occured i.e" + response.status + "_"+ response.statusText;
        this.setState({status:errormessage})
      }
    })
 
  }
 
  @autobind
  public btnUpdate_click(): void{
 
    let id: number= this.state.SoftwareListItem.Id;
 
    const url: string=this.props.siteUrl+ "/_api/web/lists/getbytitle('MicrosoftSoftware')/items("+id+")";
 
    const headers:any={
      "X-HTTP-Method": "MERGE",
      "IF-MATCH": "*",
    }
 
    const spHttpClientOptions: ISPHttpClientOptions={
      "headers":headers,
      "body":  JSON.stringify(this.state.SoftwareListItem)
    };
    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response:SPHttpClientResponse)=>{
 
      if(response.status===204){
        this.bindDetailsList("Record Updated and all records were loaded successfully")
 
      }else{
        let errormessage:string="An error has occured i.e" + response.status + "_"+ response.statusText;
        this.setState({status:errormessage})
      }
    })
 
  }
 
  @autobind
  public btnDelete_click(): void{
 
    let id: number= this.state.SoftwareListItem.Id;
 
    const url: string=this.props.siteUrl+ "/_api/web/lists/getbytitle('MicrosoftSoftware')/items("+id+")";
 
    const headers:any={
      "X-HTTP-Method": "DELETE",
      "IF-MATCH": "*",
    }
 
    const spHttpClientOptions: ISPHttpClientOptions={
      "headers":headers,
    };
 
    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response:SPHttpClientResponse)=>{
 
      if(response.status===204){
        alert("Record is deleted successfully...")
        this.bindDetailsList("Record Deleted and all records were loaded successfully")
 
      }else{
        let errormessage:string="An error has occured i.e" + response.status + "_"+ response.statusText;
        this.setState({status:errormessage})
      }
    })
 
  }
 
  public render(): React.ReactElement<ICrudDemoProps> {
    const dropdownRef = React.createRef<IDropdown>();
    return (
      <div className={styles.crudDemo}>
        <h2>Software List</h2>
 
 
        {/* <TextField
          label="ID"
          required={false}
          value={this.state.SoftwareListItem.Id.toString()}
          styles={textFieldStyles}
          onChange={e => {
            const value = parseInt(e.currentTarget.value, 10);
            this.setState(prevState => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                Id: value,
              },
            }));
          }}
        /> */}
 
        <TextField
          label="Software Title"
          required={true}
          value={this.state.SoftwareListItem.Title}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState((prevState: { SoftwareListItem: any; }) => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                Title: value,
              },
            }));
            // onchange={(event: React.ChangeEvent<HTMLInputElement>):void=>{this.handleChange(event)}}
          }}
        />
 
        <TextField
          label="Software Name"
          required={true}
          value={this.state.SoftwareListItem.SoftwareName}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState((prevState: { SoftwareListItem: any; }) => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareName: value,
              },
            }));
          }}
        />
 
        <TextField
          label="Software Description"
          required={true}
          value={this.state.SoftwareListItem.SoftwareDescription}
          styles={textFieldStyles}
          onChange={e => {
            const value = e.currentTarget.value;
            this.setState((prevState: { SoftwareListItem: any; }) => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareDescription: value,
              },
            }));
          }}
        />
 
        <TextField
          label="Software Version"
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
          componentRef={dropdownRef}
          placeholder="Select an option"
          label="Software Vendor"
          options={[
            { key: 'Microsoft', text: 'Microsoft' },
            { key: 'Sun', text: 'Sun' },
            { key: 'Oracle', text: 'Oracle' },
            { key: 'Google', text: 'Google' },
          ]}
          defaultSelectedKey={this.state.SoftwareListItem.SoftwareVendor}
          required
          styles={narrowDropdownStyles}
          onChange={(event, option) => {
            this.setState((prevState: { SoftwareListItem: any; }) => ({
              SoftwareListItem: {
                ...prevState.SoftwareListItem,
                SoftwareVendor: option?.text || '',
              },
            }));
          }}
        />
 
        <PrimaryButton
        style={{ marginRight: '10px' }}
          text="Add"
          title="Add"
          onClick={this.btnAdd_click}
        />
 
        <PrimaryButton
        style={{ marginRight: '10px' }}
          text="Update"
          title="Update"
          onClick={this.btnUpdate_click}
        />
 
        <PrimaryButton
          text="Delete"
          title="Delete"
          onClick={this.btnDelete_click}
        />
 
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
 
 
 