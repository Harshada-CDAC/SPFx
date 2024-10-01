import * as React from 'react';
import { IHwReactLifecycleProps } from './IHwReactLifecycleProps';

// Define the state interface
interface IHwReactLifecycleState {
  stageTitle: string;
}

export default class HwReactLifecycle extends React.Component<IHwReactLifecycleProps, IHwReactLifecycleState> {
  constructor(props: IHwReactLifecycleProps) {
    super(props);
    this.state = {
      stageTitle: 'Component Constructor has been called'
    };

    // Bind the method to the class instance
    this.updateState = this.updateState.bind(this);

    console.log("Stage Title from constructor: " + this.state.stageTitle);
  }

  componentDidMount() {
    console.log("componentDidMount has been called. Current stageTitle: " + this.state.stageTitle);
    // Optional: Initial state update
    // this.setState({
    //   stageTitle: 'State Updated after componentDidMount'
    // });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount has been called");
  }

  private updateState() {
    console.log("Button clicked. Updating state...");
    this.setState({
      stageTitle: 'State Updated after button click'
    });
  }

  public render(): React.ReactElement<IHwReactLifecycleProps> {
    return (
      <div>
        <h1>Hello World</h1>
        <h3>{this.state.stageTitle}</h3>
        <button onClick={this.updateState}>Click Here To Update State Data!</button>
      </div>
    );
  }
}
