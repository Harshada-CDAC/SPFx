import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'HelloAcDemoApplicationCustomizerStrings';
import styles from './ACDemo.module.scss';

const LOG_SOURCE: string = 'HelloAcDemoApplicationCustomizer';

export interface IHelloAcDemoApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}

export default class HelloAcDemoApplicationCustomizer
  extends BaseApplicationCustomizer<IHelloAcDemoApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Ensure placeholders render whenever page context changes
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders.bind(this));
    this._renderPlaceHolders();

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    console.log('Available placeholders are: ',
      this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));

    // Render the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {
        onDispose: this._onDispose
      });

      if (!this._topPlaceholder) {
        console.error("The placeholder top was not found.");
        return;
      }

      if (this.properties && this._topPlaceholder.domElement) {
        let topString: string = this.properties.Top || '(Top property was not defined)';
        this._topPlaceholder.domElement.innerHTML = `
          <div class="${styles.acdemoapp}">
            <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.topPlaceholder}">
              <i class="ms-Icon--Info" aria-hidden="true"></i> ${escape(topString)}
            </div>
          </div>`;
      }
    }

    // Render the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, {
        onDispose: this._onDispose
      });

      if (!this._bottomPlaceholder) {
        console.error("The placeholder bottom was not found.");
        return;
      }

      if (this.properties && this._bottomPlaceholder.domElement) {
        let bottomString: string = this.properties.Bottom || '(Bottom property was not defined)';
        this._bottomPlaceholder.domElement.innerHTML = `
          <div class="${styles.acdemoapp}">
            <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.bottomPlaceholder}">
              <i class="ms-Icon--Info" aria-hidden="true"></i> ${escape(bottomString)}
            </div>
          </div>`;
      }
    }
  }

  private _onDispose(): void {
    console.log('Disposed custom top and bottom placeholders');
  }
}
