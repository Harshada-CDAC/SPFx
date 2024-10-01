import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  RowAccessor,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import * as pnp from 'sp-pnp-js';
 
/**
 * Define properties for the command set
 */
export interface IHwmCommandSetCommandSetProperties {
  sampleTextOne: string;
  sampleTextTwo: string;
}
 
const LOG_SOURCE: string = 'HwmCommandSetCommandSet';
 
export default class HwmCommandSetCommandSet extends BaseListViewCommandSet<IHwmCommandSetCommandSetProperties> {
 
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized HwmCommandSetCommandSet');
 
    // Initial state of the command's visibility
    const compareOneCommand = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      compareOneCommand.visible = false;
    }
 
    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);
 
    return Promise.resolve();
  }
 
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        Dialog.alert(this.properties.sampleTextOne)
          .catch(() => {
            // Handle error if needed
            const title: string = event.selectedRows[0].getValueByName("Title");
            const status: string = event.selectedRows[0].getValueByName("Status");
            Dialog.alert(`Project Name: ${title} - Current Status: ${status}% done`);
          });
        break;
      case 'COMMAND_2':
        Dialog.alert(this.properties.sampleTextTwo)
          .catch(() => {
            // Handle error if needed
          });
        break;
      case 'COMMAND_3':
        Dialog.prompt('Project Status Remarks')
          .then((value: string) => {
            return this.updateRemarks(event.selectedRows, value);
          })
          .catch(() => {
            // Handle error if needed
          });
        break;
      default:
        throw new Error('Unknown command');
    }
  }
 
  private updateRemarks(items: readonly RowAccessor[], value: string): void {
    // Convert readonly array to mutable array
    const mutableItems: RowAccessor[] = [...items];
    const batch = pnp.sp.createBatch();
    mutableItems.forEach(item => {
      pnp.sp.web.lists.getByTitle("ProjectStatus").items.getById(item.getValueByName("ID"))
        .inBatch(batch)
        .update({ Remark: value })
        .catch(error => {
          // Handle update error
          console.error(`Error updating item ${item.getValueByName("ID")}:`, error);
        });
    });
 
    batch.execute()
      .then(() => {
        location.reload();
      })
      .catch(error => {
        // Handle batch execute error
        console.error('Error executing batch update:', error);
      });
  }
 
  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');
 
    const compareOneCommand = this.tryGetCommand('COMMAND_1');
    const compareTwoCommand = this.tryGetCommand('COMMAND_2');
    const compareThreeCommand = this.tryGetCommand('COMMAND_3');
 
    if (compareOneCommand) {
      // This command should be visible only if exactly one row is selected
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }
    if (compareTwoCommand) {
      // This command should be visible only if more than one row is selected
      compareTwoCommand.visible = (this.context.listView.selectedRows?.length ?? 0) > 1;
    }
 
    if (compareThreeCommand) {
      // This command should be visible only if more than one row is selected
      compareThreeCommand.visible = (this.context.listView.selectedRows?.length ?? 0) > 1;
    }
 
    // Raise change event to update the command bar
    this.raiseOnChange();
  }
}