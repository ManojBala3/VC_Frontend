import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingserviceService {

  constructor() { }

  
  private username:any;

  private _isAdmin: boolean = false;
  
  public get isAdmin(): boolean {
    return this._isAdmin;
  }
  public set isAdmin(value: boolean) {
    this._isAdmin = value;
  }
 

  setusername(value:any)
  {
    this.username=value;
  }

  getusername()
  {
    return this.username;
  }
  

}
