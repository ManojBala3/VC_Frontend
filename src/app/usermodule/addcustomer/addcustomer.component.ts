import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  NgForm,
  Validators,
  FormControl,
} from '@angular/forms';

import { Customer } from 'src/app/customer.model';
import { Router } from '@angular/router';
import { HttpserviceService } from 'src/app/httpservice.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-addcustomer',
  template: `
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.datatables.net/1.10.2/css/jquery.dataTables.css"
    />
    <link
      rel="stylesheet"
      href="https://elenatorro.github.io/allineed/dist/assets/css/allineed.css"
    />

    <!-- jQuery -->
    <script
      type="text/javascript"
      charset="utf8"
      src="https://code.jquery.com/jquery-1.10.2.min.js"
    ></script>

    <!-- DataTables -->
    <script
      type="text/javascript"
      charset="utf8"
      src="https://cdn.datatables.net/1.10.2/js/jquery.dataTables.js"
    ></script>
    <script
      type="text/javascript"
      charset="utf8"
      src="../../../script.js"
    ></script>
  `,
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.scss'],
})
export class AddcustomerComponent implements OnInit {
  addcustomer = 'addcustomer';
  customerForm: UntypedFormGroup;
  selectedState: any;
  inputDistrict: any;
  optionsList: any;
  selectedDistrict: any;
  totalCustomers: any;
  Gender:any=['Male','Female','Transgender'];
  stateList: any;

  clickedAddCustomer: boolean = false;
  customersList: any;
  searchType: any = 'searchType';
  searchValue: any;
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  customername: any = '';
  customeraddress: any = '';
  activePage: any;
  currentPageNumber: number = 1;
  limit: any = 10;
  offset: any = 0;

  constructor(
    private router: Router,
    private httpservice: HttpserviceService,
    private toastr: ToastrService,
    private loader:NgxSpinnerService

  ) {
    //subscribe to the current active page

    this.customerForm = new UntypedFormGroup({
      customephonenumber: new UntypedFormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^\d{10}$/)]),
      customeremail: new UntypedFormControl('',[Validators.email]),
      customerstate:  new UntypedFormControl('',[]),
      customerdistrict :  new UntypedFormControl('',[]),
      customername: new UntypedFormControl(['', Validators.required]),
      customergender: new UntypedFormControl(['', Validators.required]),
    });
  }

  searchText: string = '';

  ngOnInit(): void {
    this.getAllCustomers();   
  } 

  getAllCustomers() {
    
    this.loader.show();
    this.httpservice.getAllCustomer(this.limit, this.offset).subscribe((response: any) => {
      console.log('get all method...');
      console.log(response);
      let list = (<any>response).response;
      this.customersList = list;

      console.log(this.customersList.length);
      this.totalCustomers = response.totalcount;
      this.loader.hide();
    },
    (err) => {
      this.loader.hide();
      console.log('Error caught at Subscriber ' + err);
      this.toastr.error(this.searchType + ' search failed', 'Error!');
    },
    () => console.log('Processing Complete.')
  );
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure to delete ?')) {
      this.loader.show();
      let savedData;
      this.httpservice.deleteCustomer(id).subscribe(
        (response) => {
          console.log(response);
          savedData = (<any>response);
          if(savedData.respcode=='00')
          {
            this.loader.hide();
            this.getAllCustomers();
            this.toastr.info('Customer deleted Successfully!');
          }
          else{
            this.loader.hide();
            this.toastr.info(savedData.respdesc);
          }
        },
        (err) => {
          this.loader.hide();
          console.log('Error caught at Subscriber ' + err);
          this.toastr.error('Customer deletion failed', 'Error!');
        },
        () => console.log('Processing Complete.')
      );
    }
  }

  updateCustomer(id: number) {
    this.router.navigate(['/user/updatecustomer'], {
      queryParams: { customerId: id },
    });
    console.log('success');
  }
  

  searchCustomers(limit?: any, offset?: any) {
    this.loader.show();
    this.offset = offset ? offset : 0;
    this.limit = limit ? limit : 10;
    console.log(this.searchType + this.searchValue, this.limit, this.offset);
    let savedData: never[];
    var namefield;
    var phonenumber;
    var patientid;
    if(this.searchType=="name")
    {
      namefield=this.searchValue;
    }
    if(this.searchType=="phoneNumber")
    {
      phonenumber=this.searchValue
    }
    if(this.searchType=="patientid")
    {
      patientid=this.searchValue
    }
    let data={
      "mobilenumber":phonenumber,
      "name":namefield,
      "custid":patientid
    }
    this.httpservice
      .searchCustomers(this.searchType, this.searchValue, this.limit, this.offset,data)
      .subscribe(
        (response) => {
          if (response == null) {
            savedData = [];
          } else {
            console.log('Value Received ' + response);
            console.log(response);
            savedData = (response as any).response;
            this.totalCustomers = (response as any).totalcount;
          }
          this.customersList = savedData;
          //this.toastr.success(this.searchType + ' search done', 'Success!');
          this.clickedAddCustomer = false;
          this.loader.hide();
        },
        (err) => {
          this.loader.hide();
          console.log('Error caught at Subscriber ' + err);
          this.toastr.error(this.searchType + ' search failed', 'Error!');
        },
        () => console.log('Processing Complete.')
      );
  }

  onSearchTypeChange(event: any) {
    if (event.target.value != 'searchType') {
      this.isSearchValueDisabled = false;
      this.isSearchButtonDisabled = false;
    } else {
      this.isSearchValueDisabled = true;
      this.isSearchButtonDisabled = true;
    }
  }

  clearSearchCustomers() {
    this.searchType = 'searchType';
    this.searchValue = '';
    this.getAllCustomers();
    this.isSearchValueDisabled = true;
    this.isSearchButtonDisabled = true;
  }

  registerCustomer() {

    if(this.customerForm.valid){
        // Form is valid, perform your desired actions here
        console.log('Form submitted successfully');
    }else{
       // Form is invalid, mark all fields as touched to display error messages
        Object.values(this.customerForm.controls).forEach(control => {
        control.markAsTouched();
    });
  }

   
    var email = this.customerForm.value['customeremail'];
    var phoneNumber = this.customerForm.value['customephonenumber'];
    var district = this.customerForm.value['customerdistrict'];
    var state = this.customerForm.value['customerstate'];
    var name = this.customerForm.value['customername'];
    var gender=this.customerForm.value['customergender'];
    let data = {
      custname: name,
      emailid: email,
      mobileno: phoneNumber,
      district: district,
      state: state,
      gender:gender
    };
    this.loader.show();
    this.httpservice.createCustomer(data).subscribe(
      (response) => {
        console.log('Value Received ' + response);
        console.log(response);
        let cust=response;
        if((<any>response)!=null && (<any>response).respcode=='00')
        {
          this.loader.hide();
          this.toastr.success(
            'Customer Registeration Success!'
          );
          
        }
        else{
          this.loader.hide();
          this.toastr.error(
           (<any>response).respdesc
          );
        }
       
        this.clickedAddCustomer = false;
        this.customerForm.reset();
      },
      (err) => {
        console.log('Error caught at Subscriber ' + err);
        this.loader.hide();
        this.toastr.error('Customer registered failed', 'Error!');
        this.clickedAddCustomer = true;
      },
      () => console.log('Processing Complete.')
    
    );
    this.getAllCustomers();
  }

  addCustomerButtonClicked() {
    this.clickedAddCustomer = true;
  }
  backToViewCustomers() {
    this.clickedAddCustomer = false;
  }

  onViewCustomerPaginationPageChange(event: any){
    console.log(event);
    this.offset = (event-1)*10; 
    if(this.searchValue && this.searchValue.trim()){
    this.searchCustomers(this.limit, this.offset);
    }else{
      this.getAllCustomersPagination(this.limit, this.offset);
    }
    this.currentPageNumber = event;
  }

  getAllCustomersPagination(limit: any, offset: any) {
    this.loader.show();
    this.httpservice.getAllCustomer(limit, offset).subscribe((response: any) => {
      console.log('get all method...');
      console.log(response);
      let list = (<any>response).response;
      this.customersList = list;
      this.loader.hide ();
    });
  }
  
}


