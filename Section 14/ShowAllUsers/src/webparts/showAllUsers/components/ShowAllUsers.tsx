import * as React from 'react';
import styles from './ShowAllUsers.module.scss';
import type { IShowAllUsersProps } from './IShowAllUsersProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IShowAllUsersState } from './IShowAllUsersState';
import {
  TextField,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
} from 'office-ui-fabric-react';
import * as strings from 'ShowAllUsersWebPartStrings';

const usersListColumns = [
  {
    key: 'displayName',
    name: 'Display Name',
    fieldName: 'displayName',
    minWidth: 100,
    maxWidth: 150,
    isResizable: true,
  },
  {
    key: 'givenName',
    name: 'Given Name',
    fieldName: 'givenName',
    minWidth: 100,
    maxWidth: 150,
    isResizable: true,
  },
  {
    key: 'surname',
    name: 'Surname',
    fieldName: 'surname',
    minWidth: 100,
    maxWidth: 150,
    isResizable: true,
  },
  {
    key: 'mail',
    name: 'Email',
    fieldName: 'mail',
    minWidth: 150,
    maxWidth: 200,
    isResizable: true,
  },
  {
    key: 'mobilePhone',
    name: 'Mobile Phone',
    fieldName: 'mobilePhone',
    minWidth: 100,
    maxWidth: 150,
    isResizable: true,
  },
  {
    key: 'userPrincipalName',
    name: 'User Principal Name',
    fieldName: 'userPrincipalName',
    minWidth: 150,
    maxWidth: 200,
    isResizable: true,
  },
];

export default class ShowAllUsers extends React.Component<IShowAllUsersProps, IShowAllUsersState> {
  constructor(props: IShowAllUsersProps) {
    super(props);
    this.state = {
      users: [],
      searchFor: '',
    };
  }

  public componentDidMount(): void {
    this.fetchUserDetails();
  }

  private fetchUserDetails(): void {
    this.props.context.msGraphClientFactory.getClient("3").then(client => {
      client.api('users')
        .version('v1.0')  // This might also need to be adjusted based on the actual expected API version
        .select('*')
        .filter(`startswith(givenName,'${escape(this.state.searchFor)}')`)
        .get((error: any, response: any) => {
          if (error) {
            console.error('Message is: ' + error);
            return;
          }
  
          const allUsers = response.value.map((item: any) => ({
            displayName: item.displayName,
            givenName: item.givenName,
            surname: item.surname,
            mail: item.mail,
            mobilePhone: item.mobilePhone,
            userPrincipalName: item.userPrincipalName,
          }));
  
          this.setState({ users: allUsers });
        });
    });
  }
     
  private _onSearchForChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ searchFor: newValue || '' });
  };

  public render(): React.ReactElement<IShowAllUsersProps> {
    return (
      <div className={styles.showAllUsers}>
        <TextField
          label={strings.SearchFor}
          required={true}
          value={this.state.searchFor}
          onChange={this._onSearchForChanged}
        />
        <PrimaryButton
          text='Search'
          title='Search'
          onClick={() => this.fetchUserDetails()}
        />
        {this.state.users.length > 0 && (
          <DetailsList
            items={this.state.users}
            columns={usersListColumns}
            setKey='set'
            checkboxVisibility={CheckboxVisibility.onHover}
            selectionMode={SelectionMode.single}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            compact={true}
          />
        )}
      </div>
    );
  }
}
