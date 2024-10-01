import { Log } from '@microsoft/sp-core-library';
import {
  BaseFieldCustomizer,
  type IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'HelloMyFieldExtensionFieldCustomizerStrings';
import styles from './HelloMyFieldExtensionFieldCustomizer.module.scss';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloMyFieldExtensionFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'HelloMyFieldExtensionFieldCustomizer';

export default class HelloMyFieldExtensionFieldCustomizer
  extends BaseFieldCustomizer<IHelloMyFieldExtensionFieldCustomizerProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Activated HelloMyFieldExtensionFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "HelloMyFieldExtensionFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Validate fieldValue to ensure it is a number and is not null or undefined
    let fieldValue: number;
    if (typeof event.fieldValue === 'number' && !isNaN(event.fieldValue)) {
      fieldValue = event.fieldValue;
    } else {
      fieldValue = 0; // Fallback to 0 if fieldValue is not a number
    }

    // Ensure width is a valid number, clamp between 0 and 100 for percentage
    const width = Math.max(0, Math.min(100, fieldValue));

    // Log values for debugging
    Log.info(LOG_SOURCE, `Rendering cell with fieldValue: ${fieldValue}`);
    Log.info(LOG_SOURCE, `Progress bar width: ${width}%`);

    // Apply styles and render the HTML
    event.domElement.innerHTML = `
      <div class="${styles.helloMyFieldExtension}">
        <div class="${styles.progressBar}" style="width:${width}%; background:red; color:blue;">
          ${fieldValue}%
        </div>
      </div>
    `;
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    super.onDisposeCell(event);
  }
}
