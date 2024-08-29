import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  NgForm,
  Validators,
  FormControl,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

import { Customer } from 'src/app/customer.model';
import { Router } from '@angular/router';
import { HttpserviceService } from 'src/app/httpservice.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs/internal/Subject';


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
  templateUrl: './addpatient.component.html',
  styleUrls: ['./addpatient.component.scss'],
})
export class AddPatientComponent implements OnInit {
  private clickSubject = new Subject<Event>();
  addpatient = 'addpatient';
  customerForm!: FormGroup;
  selectedState: any;
  inputDistrict: any;
  optionsList: any;
  selectedDistrict: any;
  totalCustomers: any;
  genderdropdown=['Boy','Girl'];
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
  customergender:any="";
  isSubmitting = false;
  isAdmin:boolean=false;

  constructor(
    private router: Router,
    private httpservice: HttpserviceService,
    private toastr: ToastrService,
    private loader:NgxSpinnerService,
    private formBuilder: FormBuilder,

  ) {
    //subscribe to the current active page

    this.customerForm = new UntypedFormGroup({
      customephonenumber: new UntypedFormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^\d{10}$/)]),
      customeremail: new UntypedFormControl('',[Validators.email]),
      customerstate:  new UntypedFormControl('',[]),
      customerdistrict :  new UntypedFormControl('',[]),
      customergender: new UntypedFormControl(['',[Validators.required]]),
      customername: new UntypedFormControl(['', Validators.required]),
      
    });
  }

  handleClick(event: Event) {
    event.preventDefault(); // Prevent default form submission
    this.clickSubject.next(event);
  }

  searchText: string = '';

  ngOnInit(): void {
    if(localStorage.getItem('userrole')=='Admin')
    {
      this.isAdmin=true;
    }
   
   this.customerForm = this.formBuilder.group(
    {
      customername: ['', [Validators.required]],
      customephonenumber: ['',[Validators.required] ], 
      customergender: ['', [Validators.required]],     
      customerstate: ['', ], 
      customerdistrict: ['', ],      
      customeremail: ['', [Validators.email]],
    });
    this.customerForm.controls['customerstate'].setValue("TamilNadu");
    this.getAllCustomers();  
  } 

  getAllCustomers() {
    
    this.loader.show();
    this.httpservice.getAllCustomer(this.limit, this.offset).subscribe((response: any) => {
      console.log('get all method...');
      console.log(response);
      if(response.respcode=='00')
      {
        let list = (<any>response).response;
        this.customersList = list;
        console.log(this.customersList.length);
        this.totalCustomers = response.totalcount;
        this.loader.hide();
      }
      else{
        this.loader.hide();
        this.customersList =[];
        this.totalCustomers=0;
        //this.toastr.error(response.respdesc , 'Error!');
      }
     
    },
    (err) => {
      this.loader.hide();
      console.log('Error caught at Subscriber ' , err);
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
            this.toastr.info('Patient deleted Successfully!');
          }
          else{
            this.loader.hide();
            this.toastr.info(savedData.respdesc);
          }
        },
        (err) => {
          this.loader.hide();
          console.log('Error caught at Subscriber ' + err);
          this.toastr.error('Patient deletion failed', 'Error!');
        },
        () => console.log('Processing Complete.')
      );
    }
  }

  updateCustomer(id: number) {
    this.router.navigate(['/user/updatepatient'], {
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
        (response:any) => {
          if (response == null) {
            savedData = [];
          } else {
            console.log('Value Received ' + response);
            console.log(response);
            if(response.respcode=='00')
            {
              let list = (<any>response).response;
              this.customersList = list;
              console.log(this.customersList.length);
              this.totalCustomers = response.totalcount;
              this.loader.hide();
              this.clickedAddCustomer = false;
            }
            else{
              this.loader.hide();
              this.totalCustomers = 0;
              this.clickedAddCustomer = false;
              this.customersList =[];
            }
           }
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
    this.loader.show();
    this.isSubmitting=true;
    if(this.customerForm.valid  && this.customerForm.value['customergender']!=""){
        // Form is valid, perform your desired actions here
        console.log('Form submitted successfully');
        
        
    }else{
       // Form is invalid, mark all fields as touched to display error messages
       console.log('Form invalid');
        Object.values(this.customerForm.controls).forEach(control => {
        control.markAsTouched();
    });
    this.toastr.error(
      'Missing Mandatory Fields'
    );
    this.isSubmitting=false;
    this.loader.hide();
    return ;
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
          this.isSubmitting=false;
          this.toastr.success(
            'Patient Registeration Success'
          );
          this.getAllCustomers();
        }
        else{
          this.loader.hide();
          this.isSubmitting=false;
          this.toastr.error(
           (<any>response).respdesc
          );
        }
       
        this.clickedAddCustomer = false;
        this.customerForm.reset();
      },
      (err) => {
        console.log('Error caught at Subscriber ' , err);
        this.loader.hide();
        this.isSubmitting=false;
        this.toastr.error('Patient registered failed', 'Error!');
        this.clickedAddCustomer = true;
      },
      () => console.log('Processing Complete.')
    
    );
    this.loader.hide();
    this.isSubmitting=false;
    this.getAllCustomers();
  }

  addCustomerButtonClicked() {
    this.customerForm.controls['customergender'].setValue("");
    this.customerForm.controls['customerstate'].setValue("TamilNadu");
    this.clickedAddCustomer = true;
  }
  backToViewCustomers() {
    this.customerForm.reset(); 
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
   this.limit=limit; this.offset=offset;
   this.getAllCustomers();
  }
  
}


