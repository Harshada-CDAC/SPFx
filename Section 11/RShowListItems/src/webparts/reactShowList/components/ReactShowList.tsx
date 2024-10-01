import * as React from 'react';
// import styles from './RShowListItems.module.scss';
// import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { IRShowListItemsProps } from './IReactShowListProps';
 
export interface IListItem {
  Title: string;
  SoftwareName: string;
  ID: number;
}
 
export interface IRShowListItemsState {
  listitems: IListItem[];
}
 
export default class RShowListItems extends React.Component<IRShowListItemsProps, IRShowListItemsState> {
 
  static siteurl: string = "";
 
  public constructor(props: IRShowListItemsProps) {
    super(props);
    this.state = {
      listitems: []  // Initialize as an empty array
    };
    RShowListItems.siteurl = this.props.websiteurl;
  }
 
  public componentDidMount(): void {
    const reactcontexthandler = this;
 
    jquery.ajax({
      url: `${RShowListItems.siteurl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function(resultData) {
        reactcontexthandler.setState({
          listitems: resultData.d.results  // Use 'results' instead of 'result'
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching data: ", textStatus, errorThrown);
      }
    });
  }
 
  public render(): React.ReactElement<IRShowListItemsProps> {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
              <th>Software Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.listitems.map((listitem, index) => {
              const fullurl: string = `${RShowListItems.siteurl}/lists/MicrosoftSoftware/DispForm.aspx?ID=${listitem.ID}`;
              return (
                <tr key={listitem.ID}>
                  <td><a href={fullurl}>{listitem.Title}</a></td>
                  <td>{listitem.ID}</td>
                  <td>{listitem.SoftwareName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
 
        <ol>
          {this.state.listitems.map((listitem, index) => {
            const fullurl: string = `${RShowListItems.siteurl}/lists/MicrosoftSoftware/DispForm.aspx?ID=${listitem.ID}`;
            return (
              <li key={listitem.ID}>
                <a href={fullurl}>
                  <span>{listitem.Title}</span>
                </a>, <span>{listitem.ID}</span>, <span>{listitem.SoftwareName}</span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
 