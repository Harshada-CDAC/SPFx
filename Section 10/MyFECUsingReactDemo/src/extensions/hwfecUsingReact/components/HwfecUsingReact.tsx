import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';
import styles from './HwfecUsingReact.module.scss';

export interface IHwfecUsingReactProps {
  text: string;
}

const LOG_SOURCE: string = 'HwfecUsingReact';

export default class HwfecUsingReact extends React.Component<IHwfecUsingReactProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: HwfecUsingReact mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: HwfecUsingReact unmounted');
  }

  public render(): React.ReactElement<{}> {
    // Define the styles before the return statement
    const mystyles = {
      color: 'blue',
      width: `${this.props.text.length * 10}px`, // Example calculation for width based on text length
      background: 'red',
    };

    return (
      <div className={styles.hwfecUsingReact} style={mystyles}>
        {this.props.text}
      </div>
    );
  }
}
