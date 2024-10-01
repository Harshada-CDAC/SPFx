import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ICalenderEventProps } from './ICalenderEventProps';
import { ICalenderEventDemoState } from './CalenderEventsDemoState';

export default class CalenderEvent extends React.Component<ICalenderEventProps, ICalenderEventDemoState> {
  constructor(props: ICalenderEventProps) {
    super(props);
    this.state = {
      events: []
    };
  }

  public componentDidMount(): void {
    this.props.context.msGraphClientFactory.getClient()
      .then((client: MSGraphClient): void => {
        client
          .api('/me/calendar/events')
          .version("v1.0")
          .select("*")
          .get((error: any, eventsResponse: any, rawResponse?: any) => {
            if (error) {
              console.error("Error fetching events: ", error);
              return;
            }

            const calendarEvents: MicrosoftGraph.Event[] = eventsResponse.value;
            this.setState({ events: calendarEvents });
          });
      })
      .catch(error => {
        console.error("Error initializing Graph client: ", error);
      });
  }

  public render(): React.ReactElement {
    return (
      <div>
        <ul>
          {this.state.events.map((item) => (
            <li key={item.id}>
              {item.subject}, {item.organizer.emailAddress.name},
              {item.start.dateTime.substr(0, 10)},
              {item.start.dateTime.substr(11, 5)},
              {item.end.dateTime.substr(0, 10)},
              {item.end.dateTime.substr(11, 5)}
            </li>
          ))}
        </ul>

        <style>
          {
          table {
            border: 1px solid black;
            background-color: aqua;
          }
          }
        </style>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Organizer Name</th>
              <th>Start Date</th>
              <th>Start Time</th>
              <th>End Date</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.events.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.organizer.emailAddress.name}</td>
                <td>{item.start.dateTime.substr(0, 10)}</td>
                <td>{item.start.dateTime.substr(11, 5)}</td>
                <td>{item.end.dateTime.substr(0, 10)}</td>
                <td>{item.end.dateTime.substr(11, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}