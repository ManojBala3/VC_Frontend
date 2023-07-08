import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Customer } from 'src/app/customer.model'
import { DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router';
import { HttpserviceService } from 'src/app/httpservice.service'
import { ToastrService } from 'ngx-toastr';
import {FormControl, 
  FormGroup,
  FormBuilder,
  FormArray,
  Validators} from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
  @Component({
    selector: 'app-updateorder',
    templateUrl: './updateorder.component.html',
    styleUrls: ['./updateorder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
export class UpdateorderComponent implements OnInit {
  updateorder = 'updateorder'
  customerForm: UntypedFormGroup
  selectedState: any
  inputDistrict: any
  optionsList: any
  selectedDistrict: any
  totalCustomers: any
  orderForm: FormGroup;
  viewType: any;
  listmedicine = [];
  clickedAddOrderButton: boolean = false
  customersList: any
  searchType: any = "searchType";
  searchValue: any;
  mindate:any;
  isSearchValueDisabled: any = true;
  isSearchButtonDisabled: any = true;
  customername: any = "";
  customeraddress:any ="";
  customephonenumber: any;
  customeremail: any;
  customerzipcode: any;
  customerId: any;
  orderId: any;
  isOrderDispatchedFlag: any = false;
  showabcothers:boolean=false;
  showvitalsothers:boolean=false;
  showentothers:boolean=false;
  showseothers:boolean=false;
  itemNameList = [];  
  statushealth = ['Stable', 'Unstable','Others'];
  seOptions = ['CVS/RS/PA/CNS - Normal','Others'];
  genderdropdown = ['Male', 'Female','Transgender'];
  med=['ml','drops','tablet','others']
  selectedItemName: any = "selectItemName";


  formGroup: FormGroup;
  showOrderForm: boolean = false;

  
  constructor(private router: Router, private route: ActivatedRoute,private httpservice:HttpserviceService, private toastr: ToastrService,
    private formBuilder: FormBuilder,private loader:NgxSpinnerService,public datepipe: DatePipe,private changeDetection: ChangeDetectorRef)
   {
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
    })
 
    this.orderForm = this.formBuilder.group(
      {
        emailControl: [null, [Validators.required]],
        phoneControl: [null],
        address:this.formBuilder.group({
          streetControl : [],
          postalcodeControl: []
        })
      }
    )

    this.formGroup = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      additionalComponents: new FormArray([])
    });
  }

  ngOnInit(): void {

// order form starts here
this.mindate=this.datepipe.transform((new Date), 'yyyy-MM-dd');
    this.orderForm = this.formBuilder.group(
      {
        customername: [null, [Validators.required]],
        customerageyear: [0, [Validators.required]], 
        customeragemonth: [0, [Validators.required]], 
        customerageweek: [0, [Validators.required]], 
        customerageday: [0, [Validators.required]],     
        customeremail: [null, [Validators.email]],
        customergender: ['', [Validators.required]],    
        abc: ['', [Validators.required]],
        vitals: ['', [Validators.required]],
        ent: ['', [Validators.required]],
        se: ['', [Validators.required]],
        weight: [0, [Validators.required]],
        height: [0, [Validators.required]],
        hc: [0, [Validators.required]],
        customermobile: [null, ],
        additionalnote: [null, [Validators.required]],  
        comments:    ['', ],
        nextreview:['', Validators.min(this.mindate)],  
        products:this.formBuilder.array([],Validators.required)
      }
    )
    // order form end here ------
   
    this.orderForm.get('customername')?.disable();
    this.orderForm.get('customerageyear')?.disable();
    this.orderForm.get('customeragemonth')?.disable();
    this.orderForm.get('customerageweek')?.disable();
    this.orderForm.get('customerageday')?.disable();
    this.orderForm.get('customergender')?.disable();
    this.orderForm.get('customermobile')?.disable();
    this.orderForm.get('customeremail')?.disable();

    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.viewType =  params['viewType'];
    });

    this.getOrderDetailsByID(this.orderId);
    //this.addProduct();
  }

  ngAfterViewChecked(){
    if(this.viewType == "view"){
      this.orderForm.disable();
      this.orderForm.controls['products'].disable();
      const customerId = document.getElementById('customerId') as HTMLInputElement;
  }
  }

  searchmedicine(id:number)
  {
   
    let lastClone: any = this.products.controls? this.products.controls[id]: '';
    var value=lastClone.get('drugname').value;
    console.log(value.length);
    if(value==null || value=="" || value.length<4)
    {
      //this.toastr.error('Kindly enter some value to search', 'Error');
      return;
    }
    
    return this.httpservice.searchmed(value).subscribe(
      (response: any) => {
       
        console.log(response)
        if (response.respcode=='00' ) {
          this.listmedicine=response.common;
        } else {         
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

// order form function start here ----------

get products():FormArray{
  return <FormArray> this.orderForm.get('products');
}
addProduct() {
  this.products.push(this.createProduct());
  let lastClone: any = this.products.controls? this.products.controls[this.products.controls.length-1]: '';
  lastClone.get('itemname').setValue('selectItemName');
}

removeProduct(index: number) {
  this.products.removeAt(index);
}
createProduct():FormGroup{
  return this.formBuilder.group({
    drugname:['',Validators.required],
    medtype:['',Validators.required],
    morning:[0,],
    noon:[0,],
    evening:[0,],
    night:[0,],
    beforefood:[false,],
    afterfood:[false,],
    pid:[0,],
    duration:[1,],
    addinfo:['',]
  })
  
}
// order form function end  here ----------

  
 
  backToViewCustomers(){
    this.clickedAddOrderButton = false;
    this.showOrderForm=false;
    this.router.navigate(["/user/vieworder"]);
  }

  getOrderDetailsByID(orderId: any){
    let savedData: never[];
    this.searchType = "orderId";
    this.loader.show();
    this.httpservice.getviewupdatevisit(this.orderId).subscribe(
      response => {
        if(response == null){
          savedData = [];
          this.loader.hide();
        }else{
          console.log('Value Received ' + response);
          console.log(response)
          savedData = (<any>response).common;
          this.customersList = savedData;
          this.orderForm.controls['customername'].setValue(this.customersList.customername);
          this.orderForm.controls['customeremail'].setValue(this.customersList.customeremail);
          this.orderForm.controls['comments'].setValue(this.customersList.comments);
          this.orderForm.controls['nextreview'].setValue(this.customersList.nextreview);
          this.orderForm.controls['customerageday'].setValue(this.customersList.customerageday);
          this.orderForm.controls['customerageyear'].setValue(this.customersList.customerageyear);
          this.orderForm.controls['customeragemonth'].setValue(this.customersList.customeragemonth);
          this.orderForm.controls['customerageweek'].setValue(this.customersList.customerageweek);
          this.orderForm.controls['customergender'].setValue(this.customersList.customergender);
          this.orderForm.controls['abc'].setValue(this.customersList.abc);
          this.orderForm.controls['vitals'].setValue(this.customersList.vitals);
          this.orderForm.controls['ent'].setValue(this.customersList.ent);
          this.orderForm.controls['se'].setValue(this.customersList.se);
          this.orderForm.controls['weight'].setValue(this.customersList.weight);
          this.orderForm.controls['height'].setValue(this.customersList.height);
          this.orderForm.controls['hc'].setValue(this.customersList.hc);
          this.orderForm.controls['customermobile'].setValue(this.customersList.customermobile);
          this.orderForm.controls['additionalnote'].setValue(this.customersList.additionalnote);

          var secheck = this.seOptions.indexOf(this.orderForm.controls['se'].value);
          if(secheck==-1){this.showseothers=true;}
          var abccheck=this.statushealth.indexOf(this.orderForm.controls['abc'].value);
          if(abccheck==-1){this.showabcothers=true;}
          var vitalscheck=this.statushealth.indexOf(this.orderForm.controls['vitals'].value);
          if(vitalscheck==-1){this.showvitalsothers=true;}
          var entcheck=this.statushealth.indexOf(this.orderForm.controls['ent'].value);
          if(entcheck==-1){this.showentothers=true;}

          let productsFormArray = this.customersList.products;
          for(let data of productsFormArray)
          {
            this.products.push(this.createProduct());
            let lastClone: any = this.products.controls? this.products.controls[this.products.controls.length-1]: '';
            lastClone.get('drugname').setValue(data.drugname);
            lastClone.get('morning').setValue(data.morning);
            lastClone.get('evening').setValue(data.evening);
            lastClone.get('noon').setValue(data.noon);
            lastClone.get('night').setValue(data.night);
            lastClone.get('beforefood').setValue(data.beforefood);
            lastClone.get('afterfood').setValue(data.afterfood);
            lastClone.get('duration').setValue(data.duration);
            lastClone.get('medtype').setValue(data.medtype);
            lastClone.get('pid').setValue(data.pid);
            if(data.medtype=='others' && data.addinfo!='')
            {
              lastClone.get('addinfo').setValue(data.addinfo);
            }
            this.changeDetection.markForCheck();
          }
          this.loader.hide();
        }
       // this.toastr.success(this.searchType+' search success', 'Success!');
      },
      err => {
        this.loader.hide();
        console.log("Error caught at Subscriber " + err)
        this.toastr.error(this.searchType+' search failed', 'Error!');
      },
      () => console.log("Processing Complete.")
    )
  }

  updateOrderData(formData: any){
    if(this.orderForm.valid){
      if(confirm("Are you sure to update the Order ?")) {
      // Form is valid, perform your desired actions here
      this.loader.show();
      console.log('Form submitted successfully');
      let data = formData.value;
      data['visitid'] = this.orderId;
     this.httpservice.updateOrder(data).subscribe(
      (response: any) => {
        console.log('Value Received ' + response);
        console.log(response);
        let savedData = (<any>response).respcode;
        if( (<any>response).respcode=='00')
        {
          this.loader.hide();
          this.toastr.success('Record Updated Successfully');
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
     // Form is invalid, mark all fields as touched to display error messages
      Object.values(this.orderForm.controls).forEach(control => {
      control.markAsTouched();
  });
  this.toastr.error('Fill all the required details to add order', 'Error!');
 }
}

  onChangeItemName(event: any){
   console.log(event);
   let itemName = event.target.value;
  }
 
  clearAddOrderDetails(){
    this.orderForm.reset();
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

}

