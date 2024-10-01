import * as React from 'react';
import { IAnnonymousApi2Props } from './IAnnonymousApi2Props';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import styles from './AnnonymousApi2.module.scss';

// Define the state interface
interface IAnnonymousApi2State {
  id: string;
  name: string;
  username: string;
  email: string;
  address: string;
  phone: string;
  website: string;
  company: string;
}

export default class AnnonymousApi2 extends React.Component<IAnnonymousApi2Props, IAnnonymousApi2State> {
  constructor(props: IAnnonymousApi2Props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      username: '',
      email: '',
      address: '',
      phone: '',
      website: '',
      company: ''
    };
  }

  public componentDidMount() {
    this.invokeAPIAndSetDataIntoState();
  }

  private invokeAPIAndSetDataIntoState() {
    this.getUserDetails()
      .then(response => {
        this.setState({
          id: response.id || '',
          name: response.name || '',
          username: response.username || '',
          email: response.email || '',
          address: `Street: ${response.address?.street || ''}, Suite: ${response.address?.suite || ''}, City: ${response.address?.city || ''}, Zipcode: ${response.address?.zipcode || ''}`,
          phone: response.phone || '',
          website: response.website || '',
          company: response.company?.name || ''
        });
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }

  private getUserDetails(): Promise<any> {
    const url = `${this.props.apiURL}/${this.props.userID}`;
    return this.props.context.httpClient.get(url, HttpClient.configurations.v1)
      .then((response: HttpClientResponse) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(`Failed to fetch user details. Status: ${response.status}`);
        }
      });
  }

  public render(): React.ReactElement<IAnnonymousApi2Props> {
    return (
      <div className={styles.annonymousApi2}>
        <div><strong>ID:</strong> {this.state.id}</div><br />
        <div><strong>Username:</strong> {this.state.username}</div><br />
        <div><strong>Name:</strong> {this.state.name}</div><br />
        <div><strong>Address:</strong> {this.state.address}</div><br />
        <div><strong>Email:</strong> {this.state.email}</div><br />
        <div><strong>Phone:</strong> {this.state.phone}</div><br />
        <div><strong>Website:</strong> {this.state.website}</div><br />
        <div><strong>Company:</strong> {this.state.company}</div><br />
      </div>
    );
  }
}
