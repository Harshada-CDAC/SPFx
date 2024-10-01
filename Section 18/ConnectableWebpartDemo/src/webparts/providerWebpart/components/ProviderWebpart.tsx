import * as React from 'react';
import styles from './ProviderWebpart.module.scss';
import type { IProviderWebpartProps } from './IProviderWebpartProps';
import { IDepartment } from './IDepartment';

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
  Selection
} from 'office-ui-fabric-react';

import { SPHttpClient } from '@microsoft/sp-http';

const departmentListColumns = [
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
  }
];

export interface IProviderWebPartDemoState {
  status: string;
  DepartmentListItems: IDepartment[];
  DepartmentListItem: IDepartment | null;
}

export default class ProviderWebpart extends React.Component<IProviderWebpartProps, IProviderWebPartDemoState> {
  private _selection: Selection;

  constructor(props: IProviderWebpartProps) {
    super(props);
    this.state = {
      status: 'Ready',
      DepartmentListItems: [],
      DepartmentListItem: null
    };

    this._selection = new Selection({
      onSelectionChanged: this.onItemSelectionChanged,
    });
  }

  private _getListItems(): Promise<IDepartment[]> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('Departments')/items`;
    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: { ok: any; json: () => any; }) => {
        if (!response.ok) {
          throw new Error('Failed to fetch department items');
        }
        return response.json();
      })
      .then((json: { value: IDepartment[]; }) => json.value as IDepartment[]);
  }

  public bindDetailsList(message: string): void {
    this._getListItems()
      .then(listItems => {
        this.setState({ DepartmentListItems: listItems, status: message });
      })
      .catch(error => {
        console.error('Error fetching department items:', error);
        this.setState({ status: 'Error loading data' });
      });
  }

  public componentDidMount(): void {
    this.bindDetailsList("All records have been loaded successfully.");
  }

  private onItemSelectionChanged = () => {
    const selectedItem = this._selection.getSelection()[0] as IDepartment;
    this.setState({ DepartmentListItem: selectedItem });
    if (selectedItem) {
      this.props.onDepartmentSelected(selectedItem);
    }
  }

  public render(): React.ReactElement<IProviderWebpartProps> {
    return (
      <div className={styles.providerWebpart}>
        <DetailsList
          items={this.state.DepartmentListItems}
          columns={departmentListColumns}
          setKey='Id'
          checkboxVisibility={CheckboxVisibility.always}
          selectionMode={SelectionMode.single}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          compact={true}
          selection={this._selection}
        />
        <div>{this.state.status}</div>
      </div>
    );
  }
}
