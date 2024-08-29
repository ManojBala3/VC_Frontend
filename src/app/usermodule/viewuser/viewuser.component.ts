import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss']
})
export class ViewuserComponent implements OnInit {

  

  user = "user";
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  searchType = "searchType";
  searchValue = "";
  itemsList: any;
  totalItemsCount: any="0";
  currentPageNumber: number = 1;
  limit: any = 10;
  offset: any = 0;

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService,private loader:NgxSpinnerService) {
    
   }

  ngOnInit(): void {
    this.getAllusers();
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
    let role;
    let username;
    if(this.searchType=='role')
    {
      role=this.searchValue;
    }
    if(this.searchType=='username')
    {
      username=this.searchValue
    }
  
    let data={
      userrole:role,
      username:username
     
    }
    
    this.loader.show();
    this.httpservice.searchuser(data, this.limit, this.offset).subscribe(
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
          let list = (<any>response).common;
          this.itemsList = list;
          this.totalItemsCount =(<any>response).totalcount;
          this.loader.hide();
          this.searchType='searchType';
          this.searchValue='';
          //this.toastr.success(this.searchType+' search success', 'Success!');
        }
       
      },
      err => {
        console.log("Error caught at Subscriber " , err)
        //this.toastr.error(this.searchType+' search failed', 'Error!');
        this.itemsList = [];
        this.totalItemsCount = 0;
        this.loader.hide();
      },
      () => console.log("Processing Complete.")
    )
  }

  deleteItem(id: any){
    if(confirm("Are you sure to delete ?")) {
      this.loader.show();
      let savedData;
      console.log(id);
      this.httpservice.deleteUser(id).subscribe(
        (response: any) => {
          console.log(response)
          savedData = (<any>response).respdesc;
          if( (<any>response).respcode=='00')
          {
            this.loader.hide();
            this.getAllusers();
            this.toastr.info('USER ID:'+ id, ' deleted!');
          }
          else{
            this.loader.hide();
            this.toastr.error('USER ID:'+ id, 'Delete Failed');
          }
          
        },
        err => {
          console.log("Error caught at Subscriber " , err)
          this.loader.hide();
          this.toastr.error('USER ID: '+ id +' deletion failed', 'Error!');
        },
        () => console.log("Processing Complete.")
      )
  }
  }

  adduser(){
    this.router.navigate(["/user/adduser"]);
  }

  clearSearchCustomers(){
    this.searchType = "searchType";
    this.searchValue = "";
    this.getAllusers();
    this.isSearchValueDisabled = true;
    this.isSearchButtonDisabled = true;
  }

  getAllusers() {
    this.loader.show();
    this.httpservice.getAllusers(this.limit, this.offset).subscribe((response: any) => {

      console.log(response);
      if((<any>response).respcode=='00')
      {
        let list = (<any>response).common;
        this.itemsList = list;
        this.totalItemsCount = (<any>response).totalcount;
        this.loader.hide();
      }
      else{
        this.loader.hide();
        //this.toastr.error('',(<any>response).respdesc);
      }
      
    },
    (err) => {
      console.log('Error caught at Subscriber ' , err);
      this.loader.hide();
      this.toastr.error('User Search Failed', 'Error!');
      
    },);
}

getAllItemsPagination(limit: any, offset: any) {
  this.loader.show();
  this.httpservice.getAllusers(limit, offset).subscribe((response: any) => {
    
    if((<any>response).respcode=='00')
    {
      let list = (<any>response).common;
      this.itemsList = list;
      this.totalItemsCount = (<any>response).totalcount;
      this.loader.hide();
    }
    else{
      this.loader.hide();
      this.totalItemsCount=0;
      //this.toastr.error('',(<any>response).respdesc);
    }
    
  },
  (err) => {
    console.log('Error caught at Subscriber ' , err);
    this.loader.hide();
    this.toastr.error('User Search Failed', 'Error!');
    
  },);
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
