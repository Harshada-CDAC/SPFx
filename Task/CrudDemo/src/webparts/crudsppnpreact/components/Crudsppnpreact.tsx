import * as React from 'react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { DetailsList, DetailsListLayoutMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { ICrudsppnpreactProps } from './ICrudsppnpreactProps';

export interface IPersonColValFetchState {
  items: any[];
  newItemTitle: string;
  newItemNumber: number;
  newPerson: string; // For new person input
  newLookup: string; // For new lookup input
  newChoice: string; // For new choice input
}

export default class HelloWorld extends React.Component<ICrudsppnpreactProps, IPersonColValFetchState> {
  getLookupId(newLookup: string) {
    throw new Error('Method not implemented.');
  }
  getPersonId(newPerson: string) {
    throw new Error('Method not implemented.');
  }
  constructor(props: ICrudsppnpreactProps) {
    super(props);
    this.state = {
      items: [],
      newItemTitle: '',
      newItemNumber: 0,
      newPerson: '', // Initialize new person
      newLookup: '', // Initialize new lookup
      newChoice: '', // Initialize new choice
    };
  }

  public componentDidMount() {
    sp.setup({
      spfxContext: this.props.context,
    });
    this.loadListItems();
  }

  loadListItems = () => {
    sp.web.lists.getByTitle("Persons List").items
      .select("Title", "NewPeople/Title", "NewLook/Title", "Numbering", "Status")
      .expand("NewPeople", "NewLook")
      .orderBy("Numbering", false)
      .get()
      .then((data: any) => {
        this.setState({ items: data });
      })
      .catch((error: any) => {
        console.error("Error fetching data: ", error);
      });
  }


  addItem = async () => {
    const { newItemTitle, newItemNumber, newPerson, newLookup, newChoice } = this.state;
    const personId = await this.fetchPersonId(newPerson);
    const lookupId = await this.fetchLookupId(newLookup);

    if (personId === null || lookupId === null) {
        console.error("Person or Lookup ID not found.");
        return;
    }

    try {
        await sp.web.lists.getByTitle("Persons List").items.add({
            Title: newItemTitle,
            Numbering: newItemNumber,
            NewPeopleId: personId,  // Person Column ID
            NewLookId: lookupId,     // Lookup Column ID
            Status: newChoice,
        });
        this.setState({ newItemTitle: '', newItemNumber: 0, newPerson: '', newLookup: '', newChoice: '' });
        this.loadListItems();
    } catch (error) {
        console.error("Error adding item: ", error);
    }
}
  


  fetchPersonId = async (personName: string): Promise<number | null> => {
    try {
        const response = await fetch(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/siteusers?$filter=Title eq '${personName}'`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'Authorization': `Bearer ${this.props.context.token}`
            }
        });

        const data = await response.json();
        return data.d.results.length > 0 ? data.d.results[0].Id : null;
    } catch (error) {
        console.error("Error fetching user ID: ", error);
        return null;
    }
}

fetchLookupId = async (lookupValue: string): Promise<number | null> => {
    try {
        const lookupItems = await sp.web.lists.getByTitle("Lookup List").items.filter(`Title eq '${lookupValue}'`).get();
        return lookupItems.length > 0 ? lookupItems[0].Id : null;
    } catch (error) {
        console.error("Error fetching lookup ID: ", error);
        return null;
    }
}





  public render(): React.ReactElement<IPersonColValFetchState> {
    const columns: IColumn[] = [
      { key: 'column1', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Person Column', fieldName: 'NewPeople.Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'Lookup Column', fieldName: 'NewLook.Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Number', fieldName: 'Numbering', minWidth: 50, maxWidth: 100, isResizable: true },
      { key: 'column5', name: 'Choice', fieldName: 'Status', minWidth: 50, maxWidth: 100, isResizable: true },
    ];

    const items = this.state.items.map((item: { Title: any; NewPeople: { Title: any; }; NewLook: { Title: any; }; Numbering: any; Status: any }) => ({
      Title: item.Title,
      'NewPeople.Title': item.NewPeople?.Title || 'N/A',
      'NewLook.Title': item.NewLook?.Title || 'N/A',
      Numbering: item.Numbering,
      Status: item.Status,
    }));

    return (
      <div>
        <h1>My List</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label>
            Title:
            <input
              type="text"
              value={this.state.newItemTitle}
              placeholder="Enter Title"
              onChange={e => this.setState({ newItemTitle: e.target.value })}
              style={{ marginLeft: '8px' }}
            />
          </label>
          <br />
          <label>
            Number:
            <input
              type="number"
              value={this.state.newItemNumber}
              placeholder="Enter Number"
              onChange={e => this.setState({ newItemNumber: Number(e.target.value) })}
              style={{ marginLeft: '8px' }}
            />
          </label>
          <br />
          <label>
            Person:
            <input
              type="text"
              value={this.state.newPerson}
              placeholder="Enter Person"
              onChange={e => this.setState({ newPerson: e.target.value })}
              style={{ marginLeft: '8px' }}
            />
          </label>
          <br />
          <label>
            Lookup:
            <input
              type="text"
              value={this.state.newLookup}
              placeholder="Enter Lookup"
              onChange={e => this.setState({ newLookup: e.target.value })}
              style={{ marginLeft: '8px' }}
            />
          </label>
          <br />
          <label>
            Choice:
            <input
              type="text"
              value={this.state.newChoice}
              placeholder="Enter Choice"
              onChange={e => this.setState({ newChoice: e.target.value })}
              style={{ marginLeft: '8px' }}
            />
          </label>
          <br />
          <button onClick={this.addItem}>Add Item</button>
        </div>
        
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
      </div>
    );
  }
}
