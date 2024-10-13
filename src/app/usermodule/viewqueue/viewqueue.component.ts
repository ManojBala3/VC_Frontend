import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharingserviceService } from 'src/app/commonservices/sharingservice.service';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-viewqueue',
  templateUrl: './viewqueue.component.html',
  styleUrls: ['./viewqueue.component.scss']
})
export class ViewqueueComponent implements OnInit {

  viewqueue = 'viewqueue'
  ordersList: any;
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  totalOrders: any="0"
  searchType = "searchType";
  searchValue = "";
  currentPageNumber: number = 1;
  limit: any = 10;
  offset: any = 0;
  isAdmin:boolean=false;

  constructor(private router: Router, private httpservice:HttpserviceService,private sharingservice: SharingserviceService, private toastr: ToastrService,private loader:NgxSpinnerService) {
    
   }

   ngOnInit(): void {
    if(sessionStorage.getItem('userrole')=='Admin')
    {
      this.isAdmin=true;
    }
    this.getAllCustomers();
  }

  
  addCustomerButtonClicked() {
    this.sharingservice.setbackbutton("/user/viewqueue");
    this.router.navigate(["/user/addvisit"]);
  }

  clearSearchCustomers(){
    this.searchType = "searchType";
    this.searchValue = "";
    this.getAllCustomers();
    this.isSearchValueDisabled = true;
    this.isSearchButtonDisabled = true;
  }

  getAllCustomers(){
    this.loader.show();
    this.httpservice.getAllQueueOrders(this.limit, this.offset).subscribe(response => {
      console.log('get all method...');
      console.log(response);
      if((<any>response).respcode=='00')
      {
        let list =(<any>response).common;
        this.ordersList = list;
        for(let data of this.ordersList)
        {
         var value="";
         if(data['age_year']!=null && data['age_year']!=0)
         {
          value=value+data['age_year']+'Y'+" ";
         }
         if(data['age_month']!=null && data['age_month']!=0)
         {
          value=value+data['age_month']+'M'+" ";
         }
         if(data['age_week']!=null && data['age_week']!=0)
         {
          value=value+data['age_week']+'W'+" ";
         }
         if(data['age_day']!=null && data['age_day']!=0)
         {
          value=value+data['age_day']+'D'+" ";
         }
         data['age']=value;
        }
        this.totalOrders = (<any>response).totalcount;
        this.loader.hide();
      }
      else
      {
        this.loader.hide();
        this.ordersList = [];
        this.totalOrders=0;
        //this.toastr.error('', (<any>response).respdesc);
      }  
  }
  ,err => {
    console.log("Error caught at Subscriber " + err)
    this.toastr.error(this.searchType+' search failed', 'Error!');
    this.ordersList = [];
    this.totalOrders = 0;
    this.loader.hide();
  },
  () => console.log("Processing Complete.")
)
  }

  searchVisits(limit?: any, offset?: any)
  {
    this.loader.show();
    if(this.searchValue==null || this.searchValue=='')
    {
      this.toastr.error('Kindly Enter Serach Value', 'Error!');
      this.loader.hide();
      return;
    }
    this.offset = offset ? offset : 0;
    this.limit = limit ? limit : 10;
    let savedData: any[];
    let name;
    let phonenumber;
    let customerid;
    if(this.searchType=='name')
    {
        name=this.searchValue;
    }
    if(this.searchType=='phonenumber')
    {
      phonenumber=this.searchValue
    }
    if(this.searchType=='patientid')
    {
      customerid=this.searchValue
    }
    let data={
      name:name,
      mobilenumber:phonenumber,
      custid:customerid
    }
    this.httpservice.searchQueuevisits(data, this.limit, this.offset).subscribe(
      response => {
        console.log(response)
        if((<any>response).respcode=='00')
        {
            console.log('Value Received ' + response);
            savedData = (<any>response).common;
            
            this.ordersList = savedData;
            this.totalOrders =(<any>response).totalcount;
            this.toastr.success(this.searchType+' search success', 'Success!');
            this.searchType='';
            this.searchValue='';
            this.isSearchValueDisabled = true;
            this.isSearchButtonDisabled = true;
            this.loader.hide();
        }
        else{
          savedData = [];
          
          //this.toastr.info((<any>response).respdesc, 'Error');
          this.ordersList = [];
          this.totalOrders = 0;
          this.loader.hide();
        }
      },
      err => {
        console.log("Error caught at Subscriber " + err)
        this.toastr.error(this.searchType+' search failed', 'Error!');
        this.ordersList = [];
        this.totalOrders = 0;
        this.loader.hide();
      },
      () => console.log("Processing Complete.")
    )
  }

  updatevisit(visitid: number){

    this.sharingservice.setbackbutton("/user/viewqueue");
    this.router.navigate(['/user/updatevisit'], {
      queryParams:
       {orderId: visitid, viewType: 'update', navigationType: 'editQueue'}
    })
    console.log('success');
  }

  deleteVisit(id: number) {
    if(confirm("Are you sure to delete ?")) {
      this.loader.show();
      let savedData;
      this.httpservice.deleteOrder(id).subscribe(
        response => {
          console.log(response)
          savedData = (<any>response).rescode;
          this.loader.hide();
          this.getAllCustomers();
          this.toastr.info('Successfully Deleted');
          
        },
        err => {
          console.log("Error caught at Subscriber " + err);
          this.loader.hide();
          this.toastr.error('Queue ID: '+ id +' deletion failed', 'Error!');
        },
        () => console.log("Processing Complete.")
      )
  }
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

  onViewCustomerPaginationPageChange(event: any){
    console.log(event);
    this.offset = (event-1)*10; 
    if(this.searchValue && this.searchValue.trim()){
      this.searchVisits(this.limit, this.offset);
      }else{
        this.getAllCustomersPagination(this.limit, this.offset);
      }
   
    this.currentPageNumber = event;
  }

  getAllCustomersPagination(limit: any, offset: any) {
    this.limit=limit;this.offset=offset;
    this.getAllCustomers();
  }

  viewVisit(id: any, type: any){
    this.router.navigate(['/user/updatevisit'], {
      queryParams:
       {orderId: id, viewType: type}
    })
    console.log('success');
  }
}


