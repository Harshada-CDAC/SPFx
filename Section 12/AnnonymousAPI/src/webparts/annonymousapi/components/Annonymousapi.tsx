// src/webparts/annonymousapi/components/Annonymousapi.tsx

import * as React from 'react';
import styles from './Annonymousapi.module.scss';
import { IAnnonymousapiProps } from './IAnnonymousapiProps';

export default class Annonymousapi extends React.Component<IAnnonymousapiProps, {}> { 
  public render(): React.ReactElement<IAnnonymousapiProps> {
    return (
      <div className={styles.annonymousapi}>
        <h1>Hello World!</h1>
        <span className={styles.title}>User Details:</span>
        <div><strong>ID:</strong> {this.props.id}</div><br/>
        <div><strong>User Name:</strong> {this.props.username}</div><br/>
        <div><strong>Name:</strong> {this.props.name}</div><br/>
        <div><strong>Address:</strong> {this.props.address}</div><br/>
        <div><strong>Email:</strong> {this.props.email}</div><br/>
        <div><strong>Phone:</strong> {this.props.phone}</div><br/>
        <div><strong>Website:</strong> {this.props.website}</div><br/>
        <div><strong>Company:</strong> {this.props.company}</div><br/>
      </div>
    );
  }
}
