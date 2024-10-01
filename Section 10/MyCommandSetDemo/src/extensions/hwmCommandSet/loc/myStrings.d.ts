declare interface IHwmCommandSetCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'HwmCommandSetCommandSetStrings' {
  const strings: IHwmCommandSetCommandSetStrings;
  export = strings;
}
