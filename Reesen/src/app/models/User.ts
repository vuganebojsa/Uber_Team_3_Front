
export interface User{
    id?:number;
    name:string;
    surname:string;
    profilePicture:string;
    telephoneNumber:string;
    email:string;
    password?:string;
    blocked?:boolean;
    isActive?:boolean;
    address:string;
    role?:string;
}
export interface PageUsers{
    totalCount: number;
    results: User[];
}