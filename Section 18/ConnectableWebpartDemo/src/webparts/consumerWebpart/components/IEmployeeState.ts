interface IConsumerWebpartState {
    status: string;
    EmployeeListItems: any[]; // Replace 'any' with the appropriate type if known
    EmployeeListItem: {
      Id: number;
      Title: string;
      DeptTitle: string;
      Designation: string;
    };
    DeptTitleId: string;
  }
  