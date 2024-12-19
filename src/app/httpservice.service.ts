import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {
 



  public local="http://localhost:8080/venbaclinic";
  public server="https://backend.iwoodtechnologies.com/venbaclinic";
  public omsurl = this.server;

  constructor(private http: HttpClient ) { }

  private _refreshrequired = new Subject<void>();  

  get Refreshrequired() {
    return this._refreshrequired;
  }
  
  getAllCustomersPagination(url: any) {
    return this.http.get(url);
  }

  deleteCustomer(id: any){
     return this.http.get( this.omsurl + "/deletecustomer/" + id ).pipe(
      tap(() => {
        this.Refreshrequired.next();

      })
    );
  }

  getAllCustomer(limit: any, offset: any){
    return this.http.get(this.omsurl + "/getdata?limit="+limit+"&offset="+offset);
  }
   
  getCustomerById(id: any){
      return this.http.get(this.omsurl + '/getbycustid/' +id);
  }

  searchCustomers(type: any, value: any, limit: any, offset: any,data:any){
    return this.http.post(this.omsurl +'/getcustdata?limit='+limit+"&offset="+offset,data);
  }

  updateCustomer(data: any){
    return this.http.post(this.omsurl + "/updatecustomer", data).pipe(
      tap(() => {
        this.Refreshrequired.next();
      })
    );
  }
  
  createCustomer(data: any){
     return this.http.post(this.omsurl + "/savecustomer", data).pipe(
      tap(() => {
        this.Refreshrequired.next();
      })
    );
  }

  savepresc(data: any){
    return this.http.post(this.omsurl + "/visit/saveprescrption", data).pipe(
     tap(() => {
       this.Refreshrequired.next();
     })
   );
 }

 checklogin(data: any){
  return this.http.post(this.omsurl + "/user/verifyuser" , data);
 }

 updateOrder(data: any){
  return this.http.post(this.omsurl + "/visit/updateprescrption" , data);
 }

 getAllOrders(limit: any, offset: any){
   return this.http.get(this.omsurl + "/visit/getdata?limit="+limit+"&offset="+offset);
 }

 getAllQueueOrders(limit: any, offset: any){
  return this.http.get(this.omsurl + "/queue/getdata?limit="+limit+"&offset="+offset);
}



 cancelOrder(id: any){
  return this.http.delete( this.omsurl + "/oms/order/cancel/" + id ).pipe(
    tap(() => {
      this.Refreshrequired.next();

    })
  );
 }

 deleteOrder(id: any){
  return this.http.get(this.omsurl + "/visit/deletevisit/" + id ).pipe(
    tap(() => {
      this.Refreshrequired.next();

    })
  );
 }


 searchvisits(data: any,limit: any, offset: any){
    return this.http.post(this.omsurl +'/visit/searchvisit?&limit='+limit+"&offset="+offset,data);
 }

 searchQueuevisits(data: any,limit: any, offset: any){
  return this.http.post(this.omsurl +'/queue/searchvisit?&limit='+limit+"&offset="+offset,data);
}

 getviewupdatevisit(data: any){
  return this.http.get(this.omsurl +'/visit/getfullvistdetails/'+data);
}



  downloadFullInvoice(visitid: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.omsurl + "/generatepdf/" + visitid,{responseType: 'blob'});
  }



  createItem(data: any){
    return this.http.post(this.omsurl + "/medicine/save", data).pipe(
      tap(() => {
        this.Refreshrequired.next();
      })
    );
  }
  createUser(data: any){
    return this.http.post(this.omsurl + "/user/saveuser", data).pipe(
      tap(() => {
        this.Refreshrequired.next();
      })
    );
  }

  getAllItems(limit: any, offset: any){
    return this.http.get(this.omsurl + "/medicine/getdata?limit="+limit+"&offset="+offset);
  }

  getAllusers(limit: any, offset: any){
    return this.http.get(this.omsurl + "/user/getalluser?limit="+limit+"&offset="+offset);
  }

  deleteItem(id: any){
    return this.http.get( this.omsurl + "/medicine/deletecustomer/" + id ).pipe(
      tap(() => {
        this.Refreshrequired.next();
      })
    );
  }

  deleteUser(id: any){
    return this.http.get( this.omsurl + "/user/delete/" + id ).pipe(
      tap(() => {
        this.Refreshrequired.next();
      })
    );
  }

  getItemById(data: any){
    return this.http.post(this.omsurl + "/medicine/getmedicine" , data);
  }

  updateItem(orderId: any, data: any){
    return this.http.post(this.omsurl + "/medicine/updatecustomer", data);
   }

   getItemDetailsByName(name: any){
    return this.http.get(this.omsurl + "/ims/item/get/all?itemName=" + name);
   }

   searchItems(data:any,limit: any, offset: any){
      return this.http.post(this.omsurl +'/medicine/getcustdata?limit='+limit+"&offset="+offset,data);
    }

    searchmed(data:any){
      return this.http.get(this.omsurl +'/medicine/searchmedicine/'+data);
    }

  
    searchuser(data: any,limit: any, offset: any){
      return this.http.post(this.omsurl +'/user/searchuser?&limit='+limit+"&offset="+offset,data);
    }
  


  

}


