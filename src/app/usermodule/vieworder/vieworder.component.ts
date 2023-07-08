import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-vieworder',
  templateUrl: './vieworder.component.html',
  styleUrls: ['./vieworder.component.scss']
})
export class VieworderComponent implements OnInit {
  vieworder = 'vieworder'
  ordersList: any;
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  totalOrders: any
  searchType = "searchType";
  searchValue = "";
  currentPageNumber: number = 1;
  limit: any = 10;
  offset: any = 0;

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService,private loader:NgxSpinnerService) {
    
   }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  addCustomerButtonClicked() {
    this.router.navigate(["/user/addorder"]);
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
    this.httpservice.getAllOrders(this.limit, this.offset).subscribe(response => {
      console.log('get all method...');
      console.log(response);
      if((<any>response).respcode=='00')
      {
        let list =(<any>response).common;
        this.ordersList = list;
        this.totalOrders = (<any>response).totalcount;
        this.loader.hide();
      }
      else
      {
        this.loader.hide();
        this.toastr.error('', (<any>response).respdesc);
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
    this.httpservice.searchvisits(data, this.limit, this.offset).subscribe(
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
          
          this.toastr.info((<any>response).respdesc, 'Error');
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

  updateOrder(orderId: number){

    this.router.navigate(['/user/updateorder'], {
      queryParams:
       {orderId: orderId, viewType: 'update'}
    })
    console.log('success');
  }


  cancelOrder(id: number) {
    if(confirm("Are you sure to cancel order ?")) {
      let savedData;
      this.httpservice.cancelOrder(id).subscribe(
        response => {
          console.log(response)
          savedData = (<any>response).data;
          this.toastr.info('Order ID:'+ savedData.orderId, 'Order cancelled!');
        },
        err => {
          console.log("Error caught at Subscriber " + err)
          this.toastr.error('Order deletion failed', 'Error!');
        },
        () => console.log("Processing Complete.")
      )
  }
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
          this.toastr.info('Visit Details Deletetion Success');
          
        },
        err => {
          console.log("Error caught at Subscriber " + err);
          this.loader.hide();
          this.toastr.error('Order ID: '+ id +' deletion failed', 'Error!');
        },
        () => console.log("Processing Complete.")
      )
  }
  }
  

  downloadFullInvoice(orderId: any){
    this.loader.show();
    this.httpservice.downloadFullInvoice(orderId).subscribe(
      response => {
        console.log(response);
        const file  =  new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.loader.hide();
        // You can open the PDF in a new tab or perform any further processing
       window.open(fileURL, '_blank');
      },
      err => {
        console.log("Error caught at Subscriber " + err)
        this.loader.hide();
        this.toastr.error('Order ID: '+ orderId +' download failed', 'Error!');
      },
      () => console.log("Processing Complete.")
    )
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
    this.loader.show();
    this.httpservice.getAllOrders(limit, offset).subscribe((response: any) => {
      console.log('get all method...');
      console.log(response);
      let list = (<any>response).common;
      this.ordersList = list;
      this.loader.hide();
    });
  }

  viewOrder(id: any, type: any){
    this.router.navigate(['/user/updateorder'], {
      queryParams:
       {orderId: id, viewType: type}
    })
    console.log('success');
  }
}
