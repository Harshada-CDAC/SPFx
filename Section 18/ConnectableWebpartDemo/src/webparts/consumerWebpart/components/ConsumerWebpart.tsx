import * as React from 'react';
import styles from './ConsumerWebpart.module.scss';
import type { IConsumerWebpartProps } from './IConsumerWebpartProps';
import { IEmployee } from './IEmployee';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
} from 'office-ui-fabric-react';


let _employeeListColumns = [
  {
    key: 'ID',
    name: 'ID',
    fieldName: 'ID',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true
  },
  {
    key: 'Title',
    name: 'Title',
    fieldName: 'Title',
    minWidth: 150,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: 'DeptTitle',
    name: 'DeptTitle',
    fieldName: 'DeptTitle',
    minWidth: 150,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: 'Designation',
    name: 'Designation',
    fieldName: 'Designation',
    minWidth: 150,
    maxWidth: 200,
    isResizable: true
  }
];

export default class ConsumerWebpart extends React.Component<IConsumerWebpartProps, IConsumerWebpartState> {
  
  constructor(props: IConsumerWebpartProps) {
    super(props);
    this.state = {
      status: 'Ready',
      EmployeeListItems: [],
      EmployeeListItem: {
        Id: 0,
        Title: "",
        DeptTitle: "",
        Designation: ""
      },
      DeptTitleId: ""
    };
  }
  
  private _getListItems(): Promise<IEmployee[]> {
    const deptTitleId = this.props.DeptTitleId.tryGetValue();
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('Employees')/items?$filter=DeptTitleId eq '${deptTitleId}'`;
    
    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (!response.ok) {
          throw new Error('Failed to fetch department items');
        }
        return response.json();
      })
      .then((json: { value: IEmployee[]; }) => json.value as IEmployee[]);
  }


  public bindDetailsList(message: string): void {
    this._getListItems()
      .then(listItems => {
        const deptTitleSource = this.props.DeptTitleId.tryGetSource();
        const deptTitleId = deptTitleSource ? deptTitleSource.toString() : '';
  
        this.setState({ 
          EmployeeListItems: listItems, 
          status: message,
          DeptTitleId: deptTitleId 
        });
      })
      .catch(error => {
        console.error("Error fetching list items:", error);
        this.setState({ status: "Error loading items" });
      });
  }
  
  public componentDidMount(): void {
    this.bindDetailsList("All records have been loaded successfully.");
  }
  
  public render(): React.ReactElement<IConsumerWebpartProps> {
    if (this.state.DeptTitleId !== this.props.DeptTitleId.tryGetValue()) {
      this.bindDetailsList("All Records have been loaded successfully");
    }

    return (
      <div className={styles.consumerWebpart}>
        <div>
          <h1>Selected Department is: {this.props.DeptTitleId.tryGetValue()}</h1>
          <div>
            <DetailsList
              items={this.state.EmployeeListItems}
              columns={_employeeListColumns}
              setKey='Id'
              checkboxVisibility={CheckboxVisibility.always}
              selectionMode={SelectionMode.single}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              compact={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
