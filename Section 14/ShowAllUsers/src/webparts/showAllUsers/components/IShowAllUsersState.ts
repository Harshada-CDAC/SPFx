import {IUser } from "./IUsers";
export interface IShowAllUsersState {
users: Array<IUser>;
searchFor: string;
}
