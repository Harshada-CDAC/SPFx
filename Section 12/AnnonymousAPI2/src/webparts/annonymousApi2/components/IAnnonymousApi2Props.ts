import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAnnonymousApi2Props {
  description: string;
  apiURL: string;
  userID: string;
  environmentMessage: string;
  hasTeamsContext: boolean;
  context: WebPartContext; // Make sure this is included if needed
}
