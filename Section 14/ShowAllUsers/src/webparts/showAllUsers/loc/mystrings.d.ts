declare interface IShowAllUsersWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  SearchFor: string;
  SearchForValidationErrorMessage:string;

}

declare module 'ShowAllUsersWebPartStrings' {
  const strings: IShowAllUsersWebPartStrings;
  export = strings;
}
