import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpserviceService } from 'src/app/httpservice.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-updatepatient',
  templateUrl: './updatepatient.component.html',
  styleUrls: ['./updatepatient.component.scss']
})
export class UpdatePatientComponent implements OnInit {
  addpatient = 'addcpatient'
  customerForm: UntypedFormGroup;
  selectedState: any
  inputDistrict: any
  optionsList: any
  Gender:any=['Boy','Girl']
  selectedDistrict: any
  ddistrict: any="";
  state: any="";
  stateList: any;
  customerId: any;
  customeremail: any;
  customername: any;
  customerphonenumber: any;
  customerdistrict:any;
  customerdob:any;
  customerstate:any;
  customergender:any;
  customerid:any;

  constructor(private router: Router,private route: ActivatedRoute, private service: HttpserviceService,private toastr: ToastrService,private loader:NgxSpinnerService) {
    this.customerForm = new UntypedFormGroup({
      customerphonenumber: new UntypedFormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^\d{10}$/)]),
      customeremail: new UntypedFormControl('',[Validators.email]),
      customerdob: new UntypedFormControl(['', Validators.required]),
      customername: new UntypedFormControl(['', Validators.required]),
      customerid: new UntypedFormControl([' ']),
      customerstate:new UntypedFormControl(['']),
      customerdistrict:new UntypedFormControl(['']),
      customergender: new UntypedFormControl(['', Validators.required]),
    }) 
  }

  ngOnInit(): void {
   // this.customerForm.get('customerId')?.disable();

    this.route.queryParams.subscribe(params => {
      this.customerId = params['customerId'];
      this.customerForm.value['customerId'] = this.customerId;
  });
  this.getCustomerDetailsByID(this.customerId);

  
  }

  

  getCustomerDetailsByID(id: any){
    this.loader.show();
       this.service.getCustomerById(id).subscribe((response: any) =>{
              console.log(response);
              let customerDetail = (<any>response).custdata;
              this.customername = customerDetail.custname;
              this.customerphonenumber = customerDetail.mobileno;
              this.customeremail = customerDetail.emailid;
              this.customerstate=customerDetail.state;
              console.log(customerDetail.stringdob);
              this.customerdob=customerDetail.stringdob;
              this.customerForm.controls['customerdob'].setValue(customerDetail.dob);
              this.customerdistrict=customerDetail.district;
              this.customergender= customerDetail.gender;
              this.customerid=customerDetail.customerid;
              this.loader.hide();
       })
  }

  updateCustomer(id: any) {

    if(this.customerForm.valid){
      // Form is valid, perform your desired actions here
      console.log('Form submitted successfully');
      if(confirm("Are you sure to update customer details ?")) {
        this.loader.show();
    console.log(this.customerForm.value['customerphonenumber']);
        var email = this.customerForm.value['customeremail'];
        var phoneNumber = this.customerForm.value['customerphonenumber'];
        var district = this.customerForm.value['customerdistrict'];
        var state = this.customerForm.value['customerstate'];
        var name = this.customerForm.value['customername'];
        var dob1=this.customerForm.value['customerdob'];
        var gender=this.customerForm.value['customergender'];

        let data = {
         custname: name,
         emailid: email,
         mobileno: phoneNumber,
         district: district,
         state: state,
         dob:dob1,
         custid:id,
         gender:gender
        };
        console.log(data);
        let savedData;
        this.service.updateCustomer(data).subscribe(
          response => {
            console.log('Value Received ' + response);
            console.log(response)
            savedData = (<any>response).respcode;
            if((<any>response).respcode=='00')
            {
              this.loader.hide();
              this.toastr.success('Customer update success!', 'Success');
              this.router.navigate(['user/addpatient']);
            }
            else{
              this.loader.hide();
              this.toastr.error((<any>response).respdesc, 'Error');
            }
           
          },
          err => {
            this.loader.hide();
            console.log("Error caught at Subscriber " + err)
            this.toastr.error('Customer update failed!', 'Error');
          },
          () => console.log("Processing Complete.")
        )
        }

  }else{
     // Form is invalid, mark all fields as touched to display error messages
      Object.values(this.customerForm.controls).forEach(control => {
      control.markAsTouched();
  });
  this.toastr.error('Customer update failed!', 'Error');
}
    
  }

  backToViewCustomers(){
    this.router.navigate(['user/addpatient']);
  }

}
