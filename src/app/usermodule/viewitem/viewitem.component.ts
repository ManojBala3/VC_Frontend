import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-viewitem',
  templateUrl: './viewitem.component.html',
  styleUrls: ['./viewitem.component.scss']
})
export class ViewitemComponent implements OnInit {

  viewitem = "viewitem";
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  searchType = "searchType";
  searchValue = "";
  itemsList: any;
  totalItemsCount: any;
  currentPageNumber: number = 1;
  limit: any = 10;
  offset: any = 0;

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService,private loader:NgxSpinnerService) {
    
   }

  ngOnInit(): void {
    this.getAllItems();
  }

  onSearchTypeChange(event: any){
    if(event.target.value != "searchType"){
    this.isSearchValueDisabled = false;
    this.isSearchButtonDisabled = false;
    }else{
      this.isSearchValueDisabled = true;
      this.isSearchButtonDisabled = true;
    }
  }

  searchItems(limit?: any, offset?: any){
    this.offset = offset ? offset : 0;
    this.limit = limit ? limit : 10;
    let savedData: any[];
    let data={
      name:this.searchValue
    }
    this.loader.show();
    this.httpservice.searchItems(data, this.limit, this.offset).subscribe(
      (response: any) => {
        if(response == null || (<any>response).respcode !='00'){
          savedData = [];
          this.toastr.info(this.searchType+' search has no data', 'No data!');
          this.itemsList = [];
          this.totalItemsCount = 0;
          this.loader.hide();
        }else{
          console.log('Value Received ' + response);
          console.log(response)
          savedData = (<any>response).medresponse;
          this.itemsList = savedData;
          this.totalItemsCount =(<any>response).totalcount;
          this.loader.hide();
          this.toastr.success(this.searchType+' search success', 'Success!');
        }
       
      },
      err => {
        console.log("Error caught at Subscriber " + err)
        this.toastr.error(this.searchType+' search failed', 'Error!');
        this.itemsList = [];
        this.totalItemsCount = 0;
        this.loader.hide();
      },
      () => console.log("Processing Complete.")
    )
  }

  updateItem(itemId: any){
    this.router.navigate(['/user/updateitem'], {
      queryParams:
       {itemId: itemId}
    })
    console.log('success');
  }

  deleteItem(id: any){
    if(confirm("Are you sure to delete ?")) {
      this.loader.show();
      let savedData;
      console.log(id);
      this.httpservice.deleteItem(id).subscribe(
        (response: any) => {
          console.log(response)
          savedData = (<any>response).respdesc;
          if( (<any>response).respcode=='00')
          {
            this.loader.hide();
            this.getAllItems();
            this.toastr.info('MED ID:'+ id, 'Order deleted!');
          }
          else{
            this.loader.hide();
            this.toastr.error('MED ID:'+ id, 'Delete Failed');
          }
          
        },
        err => {
          console.log("Error caught at Subscriber " + err)
          this.loader.hide();
          this.toastr.error('MED ID: '+ id +' deletion failed', 'Error!');
        },
        () => console.log("Processing Complete.")
      )
  }
  }

  addItemDetails(){
    this.router.navigate(["/user/additem"]);
  }

  clearSearchCustomers(){
    this.searchType = "searchType";
    this.searchValue = "";
    this.getAllItems();
    this.isSearchValueDisabled = true;
    this.isSearchButtonDisabled = true;
  }

  getAllItems() {
    this.loader.show();
    this.httpservice.getAllItems(this.limit, this.offset).subscribe((response: any) => {
      console.log('get all method...');
      console.log(response);
      if((<any>response).respcode=='00')
      {
        let list = (<any>response).medresponse;
        this.itemsList = list;
        this.totalItemsCount = (<any>response).totalcount;
        this.loader.hide();
      }
      else{
        this.loader.hide();
        this.toastr.error('',(<any>response).respdesc);
      }
      
    });
}

getAllItemsPagination(limit: any, offset: any) {
  this.httpservice.getAllItems(limit, offset).subscribe((response: any) => {
    console.log('get all method...');
    console.log(response);
    let list = (<any>response).medresponse;
    this.itemsList = list;
  });
}

  onViewCustomerPaginationPageChange(event: any){
    console.log(event);
    this.offset = (event-1)*10; 
    if(this.searchValue && this.searchValue.trim()){
        this.searchItems(this.limit, this.offset);
      }else{
        this.getAllItemsPagination(this.limit, this.offset);
      }
   
    this.currentPageNumber = event;
  }

}
