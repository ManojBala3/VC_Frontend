
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Customer } from 'src/app/customer.model'
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpserviceService } from 'src/app/httpservice.service'
import { ToastrService } from 'ngx-toastr';

import {FormControl, 
  FormGroup,
  FormBuilder,
  FormArray,
  Validators} from '@angular/forms';
import { catchError, map, of, switchMap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.scss']
})
export class AddorderComponent implements OnInit {
  addorder = 'vieworder'
  customerForm: UntypedFormGroup
  
  
  totalCustomers: any
  orderForm!: FormGroup;
  listmedicine:any = [];
  searchresponse!: Map<any, any>;
  clickedAddOrderButton: boolean = false
  customersList: any
  searchType: any = "searchType";
  searchValue: any
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  customername: any = "";
  customephonenumber: any;
  customeremail: any;
  customerage:any;
  customergender:any;
  abc:any;
  vitals:any;
  ent:any;
  se:any;
  mindate:any;
  custid:any;
  mornging:boolean=true;
  hc:any;
  showabcothers:boolean=false;
  showvitalsothers:boolean=false;
  showentothers:boolean=false;
  showseothers:boolean=false;
  customermobile:any;

  statushealth = ['Stable', 'Unstable','Others'];
  seOptions = ['CVS/RS/PA/CNS - Normal','Others'];
  genderdropdown = ['Male', 'Female','Transgender'];
  med=['ml','drops','tablet','others']
  itemNameList = [];  
  
  selectedItemName: any = "selectItemName";



  showOrderForm: boolean = false;

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService,private formBuilder: FormBuilder, private loader:NgxSpinnerService,public datepipe: DatePipe) {

    this.customerForm = new UntypedFormGroup({
      customerage: new UntypedFormControl(['', Validators.required]),
      customergender: new UntypedFormControl(['']),
      customeremail: new UntypedFormControl(['']),
      abc: new UntypedFormControl(['', Validators.required]),
      vitals: new UntypedFormControl(['', Validators.required]),
      customername: new UntypedFormControl(['', Validators.required]),
      ent:new UntypedFormControl(['']),
      se:new UntypedFormControl(['']),
      weight:new UntypedFormControl(['']),
      height:new UntypedFormControl(['']),
      hc:new UntypedFormControl(['']),
      customermobile:new UntypedFormControl(['']),
      searchValue:new UntypedFormControl(['']),
      comments:new UntypedFormControl(['']),
    })
  }

  ngOnInit(): void {

// order form starts here

    this.mindate=this.datepipe.transform((new Date), 'yyyy-MM-dd');
    console.log(this.mindate);
    this.orderForm = this.formBuilder.group(
      {
        customername: ['', [Validators.required]],
        customerageyear: [0, [Validators.required]], 
        customeragemonth: [0, [Validators.required]], 
        customerageweek: [0, [Validators.required]], 
        customerageday: [0, [Validators.required]],      
        customeremail: ['', [Validators.email]],
        customergender: ['', [Validators.required]],    
        abc: ['', [Validators.required]],
        vitals: ['', [Validators.required]],
        ent: ['', [Validators.required]],
        se: ['', [Validators.required]],
        weight: [0, [Validators.required]],
        height: [0, [Validators.required]],
        hc: [0, [Validators.required]],
        customermobile: ['', ],
        additionalnote: [null, [Validators.required]],
        comments:    ['', ],
        nextreview:['', Validators.min(this.mindate)],
        products:this.formBuilder.array([],Validators.required)
      }
    )
    // order form end here ------
    this.addProduct();

   // this.orderForm.get('customername')?.disable();
    //this.orderForm.get('customeraddress')?.disable();
    //this.orderForm.get('state')?.disable();
   // this.orderForm.get('district')?.disable();
   // this.orderForm.get('customerzipcode')?.disable();
   // this.orderForm.get('customerphonenumber')?.disable();
   // this.orderForm.get('customerphonenumber2')?.disable();
   // this.orderForm.get('customeremail')?.disable();
    //this.orderForm.get('customeremail')?.disable();
  }


// order form function start here ----------

get products():FormArray{
  return <FormArray> this.orderForm.get('products');
}
addProduct() {
  this.products.push(this.createProduct());
  let lastClone: any = this.products.controls? this.products.controls[this.products.controls.length-1]: '';
  //lastClone.get('itemname').setValue('selectItemName');
  // this.products.controls[this.products.controls.length-1].get('itemprice')?.disable();
  // this.products.controls[this.products.controls.length-1].get('itemtotalPrice')?.disable();
}

removeProduct(index: number) {
  this.products.removeAt(index);
  
}
createProduct():FormGroup{
  this.listmedicine=[];
  return this.formBuilder.group({
    drugname:['',],
    medtype:['',],
    morning:[0,],
    noon:[0,],
    evening:[0,],
    night:[0,],
    beforefood:[false,],
    afterfood:[false,],
    duration:[1,Validators.required],
    addinfo:['',]

  })
}
// order form function end  here ----------

  searchCustomers(){
    this.loader.show();
    if(this.searchValue==null || this.searchValue=='')
    {
      this.toastr.error('Kindly Enter Serach Value', 'Error!');
      this.loader.hide();
      return;
    }
    let savedData: never[];
    let custid;
    let phonenumber;
    if(this.searchType=='patientid')
    {
        custid=this.searchValue;
    }
    if(this.searchType=='phoneNumber')
    {
      phonenumber=this.searchValue
    }
    let data={
      custid:custid,
      mobilenumber:phonenumber
    }
   
    this.httpservice.searchCustomers(this.searchValue,this.searchType,10,0,data).subscribe(
      response => {
        if(response == null){
          savedData = [];
          this.loader.hide();
          this.toastr.error('Some error occurred', 'Error!');
        }else{
          console.log('Value Received ' + response);
          console.log(response)
          savedData = (<any>response).response;
         
        }
        if((<any>response).respcode == '00')
        {
         this.customersList = savedData;
         this.totalCustomers = this.customersList.length;
          if( this.totalCustomers == 1){
            this.custid=this.customersList[0].custid;
            this.orderForm.controls['customername'].setValue(this.customersList[0].custname);
            if(this.customersList[0].custname!=null && this.customersList[0].custname!='')
            {
              this.orderForm.controls['customername'].disable();
            }
            this.orderForm.controls['customergender'].setValue(this.customersList[0].gender);
            if(this.customersList[0].gender!=null && this.customersList[0].gender!='')
            {
              this.orderForm.controls['customergender'].disable();
            }
            this.orderForm.controls['customermobile'].setValue(this.customersList[0].mobileno);
            if(this.customersList[0].mobileno!=null && this.customersList[0].mobileno!='')
            {
              this.orderForm.controls['customermobile'].disable();
            }
            this.orderForm.controls['customeremail'].setValue(this.customersList[0].emailid);
            if(this.customersList[0].emailid!=null && this.customersList[0].emailid!='')
            {
              this.orderForm.controls['customeremail'].disable();
            }
            this.loader.hide();
            this.toastr.success('', 'Success');
          }else{
            this.orderForm.reset();
            this.restform();
            this.loader.hide();
            this.toastr.error('No Records found', 'Error!');
          }
          this.clickedAddOrderButton = false
        }
        else
        {
          this.orderForm.reset();
          this.restform();
          this.clickedAddOrderButton = false
          this.loader.hide();
          this.toastr.error((<any>response).respdesc, 'Error!');
        }
      },
      err => {
        this.loader.hide();
        console.log("Error caught at Subscriber " + err)
        this.toastr.error(this.searchType+' search failed', 'Error!');
      },
      () => console.log("Processing Complete.")
    )
  }

  restform() {
    this.orderForm.reset();
    this.orderForm.controls['abc'].setValue('');
    this.orderForm.controls['vitals'].setValue('');
    this.orderForm.controls['customergender'].setValue('');
    this.orderForm.controls['ent'].setValue('');
    this.orderForm.controls['se'].setValue('');
    this.orderForm.controls['height'].setValue(0);
    this.orderForm.controls['weight'].setValue(0);
    this.orderForm.controls['hc'].setValue(0);
    this.orderForm.controls['customername'].enable();
    this.orderForm.controls['customeragemonth'].enable();
    this.orderForm.controls['customerageweek'].enable();
    this.orderForm.controls['customerageyear'].enable();
    this.orderForm.controls['customerageday'].enable();
    this.orderForm.controls['customergender'].enable();
    this.orderForm.controls['customermobile'].enable();
    this.orderForm.controls['customeremail'].enable();
    this.searchValue="";
    this.custid="";
    this.showabcothers=false;
    this.showentothers=false;
    this.showseothers=false;
    this.showvitalsothers=false;
  }

  backToViewCustomers(){
    this.clickedAddOrderButton = false;
    this.showOrderForm=false;
    this.router.navigate(["/user/vieworder"]);
  }

  addOrderData(formData: any){
   
    if(this.orderForm.valid){
      if(confirm("Are you sure to submit Order ?")) {
      // Form is valid, perform your desired actions here
      console.log('Form submitted successfully');
      this.loader.show();
      let data = formData.value;
      data['custid'] = this.custid;
      console.log(data);

    this.httpservice.savepresc(data).subscribe(
      (response: any) => {
        console.log('Value Received ' + response);
        console.log(response);
        let savedData = (<any>response).respcode;
        if((<any>response).respcode=='00')
        {
          this.loader.hide();
          this.toastr.success('','Order Saved Successfully');
          this.router.navigate(["/user/vieworder"]);
        }
        else{
          this.loader.hide();
          this.toastr.success((<any>response).respdesc,'Error');
          
        }
        
      },
      (err: any) => {
        this.loader.hide();
        console.log('Error caught at Order ' + err);
        this.toastr.error('Order save failed', 'Error!');
      },
      () => console.log('Processing Complete.')
    );
  }

  }else{
    console.log()
     // Form is invalid, mark all fields as touched to display error messages
     console.log(this.orderForm.untouched)
      Object.values(this.orderForm.controls).forEach(control => {
        console.log(control.invalid)
      control.markAsTouched();
  });
  this.toastr.error('Fill all the required details to add order', 'Error!');
 }
 
}

  onChangeItemName(event: any){
   console.log(event);
   let itemName = event.target.value;
  }

  getItemDetailsByName(selectedItemName: any) {
    this.loader.show();
    return this.httpservice.getItemDetailsByName(selectedItemName).pipe(
      map((response: any) => {
        let savedData: any;
        if (response == null) {
          savedData = [];
        } else {
          console.log('Value Received ', response);
          console.log(response);
          savedData = response.data[0];
          this.loader.hide();
        }
        return savedData;
      }),
      catchError((err: any) => {
        this.loader.hide();
        console.log("Error caught at Subscriber ", err);
        return of([]);
      })
    );
  }
  
  clearAddOrderDetails(){
    this.orderForm.reset();
    this.restform();
    this.searchType='searchType';
    this.isSearchValueDisabled = true;
    this.isSearchButtonDisabled = true;
    this.listmedicine=[];
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

  searchmedicine(id:number)
  {
   
    let lastClone: any = this.products.controls? this.products.controls[id]: '';
    var value=lastClone.get('drugname').value;
    if(value==null || value=="" || value.length<4)
    {
      //this.toastr.error('Kindly enter some value to search', 'Error');
      this.listmedicine=[];
      return;
    }
    
    return this.httpservice.searchmed(value).subscribe(
      (response: any) => {
       
        console.log(response)
        if (response.respcode=='00' ) {
          let myMap = new Map();
          for ( let data of (response.common) )
          {
            myMap.set(data.medicinename,data.medicinetype);
          }
          this.searchresponse=myMap;
           this.listmedicine =Array.from(myMap.keys());
  
        } else {  
          this.listmedicine=[]; 
        }
        this.loader.hide();
        return this.listmedicine;
        
      },
      catchError((err: any) => {
        this.loader.hide();
        console.log("Error caught at Subscriber ", err);
        return of([]);
      })
    );
  }

  selectchange(value:any,event:any)
  {
    console.log("changing view for "+value);
    console.log("changing view for "+event.target.value);
    if (event.target.value == "Others")
    {
      if(value=='abc')
      {
        this.showabcothers=true;
        this.orderForm.controls['abc'].setValue('');
      }
      else if(value=='vitals')
      {
        this.showvitalsothers=true;
        this.orderForm.controls['vitals'].setValue('');
      }
      else if(value=='ent')
      {
        this.showentothers=true;
        this.orderForm.controls['ent'].setValue('');
      }
      else if(value=='se')
      {
        this.showseothers=true;
        this.orderForm.controls['se'].setValue('');
      }
  }

  }

  medchange(id:any)
  {
    let lastClone: any = this.products.controls? this.products.controls[id]: '';
    var value=lastClone.get('medtype').value;
    if(value=='others')
    {
      return true;
    }
    else
    {
      return false;
    }
    
  }

  setmedicinetype(id:any)
  {
    console.log(id);
    let lastClone: any = this.products.controls? this.products.controls[id]: '';
    var value=lastClone.get('drugname').value;
    if(value!='' && this.searchresponse!=null)
    {
      if(this.searchresponse.get(value)!=null)
      { 
        console.log(this.searchresponse.get(value));
        if(this.searchresponse.get(value)=="TABLETS")
        {
          lastClone.get('medtype').setValue('tablet');
        }else if(this.searchresponse.get(value)=="OINTMENTS/SOLUTIONS"){
          lastClone.get('medtype').setValue('others');
        }
        else if(this.searchresponse.get(value)=="SYRUPS & DROPS"){
          lastClone.get('medtype').setValue('drops');
        }
        
      }
    }

  }

}
