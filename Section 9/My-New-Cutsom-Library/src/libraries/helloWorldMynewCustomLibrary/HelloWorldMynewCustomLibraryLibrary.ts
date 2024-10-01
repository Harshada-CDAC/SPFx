export class HelloWorldMynewCustomLibraryLibrary {
  public name(): string {
    return 'HelloWorldMynewCustomLibraryLibrary';
    
  }

  public getCurrentTime(): string {
    let currentDate: Date;
    let str: string;
    
    currentDate=new Date();
    
    str="<br>Todays Date is: " +currentDate.toDateString();
    str="<br>Todays Time is: " +currentDate.toTimeString();
    
    return(str);
    }
    
}
