 
import * as React from 'react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IHelloWorldProps } from './IHelloWorldProps';
import { TextField, Dropdown, PrimaryButton, DefaultButton } from '@fluentui/react';
import { DetailsList, DetailsListLayoutMode, IColumn } from '@fluentui/react/lib/DetailsList';
 
export interface IPersonColValFetchState {
  items: any[];
  title: string;
  age: string; // Added age state
  selectedPerson: number | null;
  selectedLookUp: number | null;
  selectedChoice: string;
  choices: string[];
  numberValue: number | null;
  editingItemId: number | null; // To keep track of the item being edited
}
 
export default class HelloWorld extends React.Component<IHelloWorldProps, IPersonColValFetchState> {
  constructor(props: IHelloWorldProps) {
    super(props);
    this.state = {
      items: [],
      title: '',
      age: '', // Initialize age
      selectedPerson: null,
      selectedLookUp: null,
      selectedChoice: '',
      choices: ['A', 'B', 'C'],
      numberValue: null,
      editingItemId: null, // Initialize for editing
    };
  }
 
  public componentDidMount() {
    sp.setup({
      spfxContext: this.props.context
    });
    this.loadListItems();
  }
 
  loadListItems = () => {
    sp.web.lists.getByTitle("Persons List").items
      .select("Id", "Title", "Age", "NewPeople/Id", "NewPeople/Title", "NewLook/Id", "NewLook/Title", "Numbering", "Status")
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
 
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, age, selectedPerson, selectedLookUp, selectedChoice, numberValue, editingItemId } = this.state;
 
    if (title && age && selectedPerson !== null && selectedLookUp !== null && selectedChoice && numberValue !== null) {
      try {
        if (editingItemId) {
          // Update existing item
          await sp.web.lists.getByTitle("Persons List").items.getById(editingItemId).update({
            Title: title,
            Age: age, // Include age in update
            NewPeopleId: selectedPerson,
            NewLookId: selectedLookUp,
            Status: selectedChoice,
            Numbering: numberValue
          });
          alert("Data updated successfully!");
        } else {
          // Add new item
          await sp.web.lists.getByTitle("Persons List").items.add({
            Title: title,
            Age: age, // Include age in add
            NewPeopleId: selectedPerson,
            NewLookId: selectedLookUp,
            Status: selectedChoice,
            Numbering: numberValue
          });
          alert("Data added successfully!");
        }
 
        this.setState({ title: '', age: '', selectedPerson: null, selectedLookUp: null, selectedChoice: '', numberValue: null, editingItemId: null });
        this.loadListItems(); // Refresh the list
      } catch (error) {
        console.error("Error saving data: ", error);
        alert("Error saving data, please check console for details.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  }
 
  handleEdit = (item: any) => {
    this.setState({
      title: item.Title,
      age: item.Age || '', // Set age for editing
      selectedPerson: item.NewPeople ? item.NewPeople.Id : null,
      selectedLookUp: item.NewLook ? item.NewLook.Id : null,
      selectedChoice: item.Status,
      numberValue: item.Numbering,
      editingItemId: item.Id, // Set the ID of the item being edited
    });
  }
 
  handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await sp.web.lists.getByTitle("Persons List").items.getById(id).delete();
        alert("Item deleted successfully!");
        this.loadListItems(); // Refresh the list
      } catch (error) {
        console.error("Error deleting item: ", error);
        alert("Error deleting item, please check console for details.");
      }
    }
  }
 
  public render(): React.ReactElement<IHelloWorldProps> {
    const columns: IColumn[] = [
      { key: 'column1', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Age', fieldName: 'Age', minWidth: 100, maxWidth: 200, isResizable: true }, // Added Age column
      { key: 'column3', name: 'Person', fieldName: 'NewPeople.Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Lookup', fieldName: 'NewLook.Title', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column5', name: 'Number', fieldName: 'Numbering', minWidth: 50, maxWidth: 100, isResizable: true },
      { key: 'column6', name: 'Choice', fieldName: 'Status', minWidth: 50, maxWidth: 100, isResizable: true },
      {
        key: 'column7',
        name: 'Actions',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        onRender: (item: any) => (
          <div>
            <PrimaryButton text="Edit" onClick={() => this.handleEdit(item)} />
            <DefaultButton text="Delete" onClick={() => this.handleDelete(item.Id)} />
          </div>
        )
      }
    ];
 
    const items = this.state.items.map((item: any) => ({
      Id: item.Id,
      Title: item.Title,
      Age: item.Age || 'N/A', // Display Age
      'NewPeople.Title': item.NewPeople ? item.NewPeople.Title : 'N/A',
      'NewLook.Title': item.NewLook ? item.NewLook.Title : 'N/A',
      Numbering: item.Numbering,
      Status: item.Status
    }));
 
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
  <div style={{ marginBottom: '15px' }}>
    <label>Title:</label>
    <TextField
      placeholder="Enter title"
      value={this.state.title}
      onChange={(e, newValue) => this.setState({ title: newValue || '' })}
      required
    />
  </div>
 
  <div style={{ marginBottom: '15px' }}>
    <label>Age:</label>
    <TextField
      placeholder="Enter age"
      value={this.state.age}
      onChange={(e, newValue) => this.setState({ age: newValue || '' })}
      multiline // Enable multi-line input
      rows={2} // Set initial row count
      required
    />
  </div>
 
  <div style={{ marginBottom: '15px' }}>
    <label>Person:</label>
    <Dropdown
      placeholder="Select a person"
      options={this.state.items.map((item) => ({
        key: item.NewPeople ? item.NewPeople.Id : -1,
        text: item.NewPeople ? item.NewPeople.Title : 'N/A'
      }))}
      onChange={(e, option) => this.setState({ selectedPerson: option?.key as number })}
      required
    />
  </div>
 
  <div style={{ marginBottom: '15px' }}>
    <label>Lookup:</label>
    <Dropdown
      placeholder="Select a lookup item"
      options={this.state.items.map((item) => ({
        key: item.NewLook ? item.NewLook.Id : -1,
        text: item.NewLook ? item.NewLook.Title : 'N/A'
      }))}
      onChange={(e, option) => this.setState({ selectedLookUp: option?.key as number })}
      required
    />
  </div>
 
  <div style={{ marginBottom: '15px' }}>
    <label>Number:</label>
    <TextField
      type="number"
      placeholder="Enter number"
      value={this.state.numberValue !== null ? this.state.numberValue.toString() : ''}
      onChange={(e, newValue) => this.setState({ numberValue: newValue ? Number(newValue) : null })}
      required
    />
  </div>
 
  <div style={{ marginBottom: '15px' }}>
    <label>Choice:</label>
    <Dropdown
      placeholder="Choose an option"
      options={this.state.choices.map(choice => ({
        key: choice,
        text: choice
      }))}
      onChange={(e, option) => this.setState({ selectedChoice: option?.key as string })}
      required
    />
  </div>
 
  <button type="submit">{this.state.editingItemId ? "Update" : "Add"}</button>
</form>
 
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
 
 
 