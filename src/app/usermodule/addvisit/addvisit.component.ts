
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
import { catchError, map, of, Subject, switchMap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharingserviceService } from 'src/app/commonservices/sharingservice.service';
@Component({
  selector: 'app-addvisit',
  templateUrl: './addvisit.component.html',
  styleUrls: ['./addvisit.component.scss']
})
export class AddVisitComponent implements OnInit {
  private clickSubject = new Subject<Event>();
  addvisit = 'viewvisit'
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
  oldPatientId: any;
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
  isAdmin: boolean = false;

  statushealth = ['Stable', 'Unstable','Others'];
  vitalsdropdown=['Stable','HR: bpm / SPO2: % / T –  F / BP:  mmhg','others']
  entdropdown = ['Clear','Others'];
  seOptions = ['CVS/RS/PA/CNS - Normal','Others'];
  genderdropdown = ['Boy', 'Girl'];
  med=['ml','drops','tablet','others']
  itemNameList = []; 
  advicedropdown=['Plenty of warm fluids & Salt water gargling','Plenty of warm fluids & Bland diet','Plenty of warm fluids']; 
  medicineothersdd=['For local application once  a day for  days',
                    'For local application twice a day for  days',
                    'For local application thrice a day for days',
                    'Mix with 200 ml clean water -  ml after each loose stool and vomiting',
                    ' ml if temperature > 99.4 F with 6 hours gap',
                    '0.5 ml intramuscular stat given',
                    '0.5 ml subcutaneous stat given',
                    '2 ml oral stat given'
                    ];
  selectedItemName: any = "selectItemName";



  showOrderForm: boolean = false;

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService,private formBuilder: FormBuilder, private loader:NgxSpinnerService,public datepipe: DatePipe
    ,private sharingservice: SharingserviceService
  ) {

    this.customerForm = new UntypedFormGroup({
      customerage: new UntypedFormControl(['', Validators.required]),
      customergender: new UntypedFormControl(['']),
      customeremail: new UntypedFormControl(['']),
      oldPatientId: new UntypedFormControl(['']),
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

  handleClick(event: Event) {
    event.preventDefault(); // Prevent default form submission
    this.clickSubject.next(event);
  }

  ngOnInit(): void {

    if(sessionStorage.getItem('userrole')=='Admin')
      {
        this.isAdmin=true;
      }


// order form starts here

    this.mindate=this.datepipe.transform((new Date), 'yyyy-MM-dd');
    console.log(this.mindate);
    this.orderForm = this.formBuilder.group(
      {
        customername: ['', [Validators.required]],
        customerageyear: ['', ], 
        customeragemonth: ['', ], 
        customerageweek: ['', ], 
        customerageday: ['', ],      
        customeremail: ['', ],
        oldPatientId: ['', ],
        customergender: ['', [Validators.required]],    
        abc: ['', [Validators.required]],
        vitals: ['', [Validators.required]],
        ent: ['', [Validators.required]],
        se: ['', [Validators.required]],
        weight: ['', ],
        height: ['', ],
        hc: ['',],
        customermobile: ['',Validators.required ],
        additionalnote: [null, [Validators.required]],
        comments:    ['', ],
        nextreview:['', Validators.min(this.mindate)],
        products:this.formBuilder.array([],Validators.required)
      }
    )
    // order form end here ------
    this.addProduct();
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
    morning:['',],
    noon:['',],
    evening:['',],
    night:['',],
    beforefood:[false,],
    afterfood:[false,],
    duration:["3 days",],
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
            // if(this.customersList[0].custname!=null && this.customersList[0].custname!='')
            // {
            //   this.orderForm.controls['customername'].disable();
            // }
            this.orderForm.controls['customergender'].setValue(this.customersList[0].gender);
            // if(this.customersList[0].gender!=null && this.customersList[0].gender!='')
            // {
            //   this.orderForm.controls['customergender'].disable();
            // }
            this.orderForm.controls['customermobile'].setValue(this.customersList[0].mobileno);
            // if(this.customersList[0].mobileno!=null && this.customersList[0].mobileno!='')
            // {
            //   this.orderForm.controls['customermobile'].disable();
            // }
            this.orderForm.controls['customeremail'].setValue(this.customersList[0].emailid);
            this.orderForm.controls['oldPatientId'].setValue(this.customersList[0].emailid);
            
           /*  if(this.customersList[0].emailid!=null && this.customersList[0].emailid!='')
            {
              this.orderForm.controls['customeremail'].disable();
            } */
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
    this.orderForm.controls['customername'].enable();
    this.orderForm.controls['customeragemonth'].enable();
    this.orderForm.controls['customerageweek'].enable();
    this.orderForm.controls['customerageyear'].enable();
    this.orderForm.controls['customerageday'].enable();
    this.orderForm.controls['customergender'].enable();
    this.orderForm.controls['customermobile'].enable();
    this.orderForm.controls['customeremail'].enable();
    this.orderForm.controls['oldPatientId'].enable();
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
    if(this.sharingservice.getbackbutton()!=null && this.sharingservice.getbackbutton()!="")
      this.router.navigate([this.sharingservice.getbackbutton()]); 
    else
      this.router.navigate(["/user/viewvisit"]);
  }

  addOrderData(formData: any){
   
    if(this.orderForm.valid){
      if(confirm("Confirm Visit ?")) {
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
          this.toastr.success('','Visit Details Saved Successfully');
          this.router.navigate(["/user/viewvisit"]);
        }
        else{
          this.loader.hide();
          this.toastr.success((<any>response).respdesc,'Error');
          return;
        }
        
      },
      (err: any) => {
        this.loader.hide();
        console.log('Error caught at Order ' + err);
        this.toastr.error('Data save failed', 'Error!');
      },
      () => console.log('Processing Complete.')
    );
  }

  }else{
     // Form is invalid, mark all fields as touched to display error messages
     console.log(this.orderForm.untouched)
      Object.values(this.orderForm.controls).forEach(control => {
      control.markAsTouched();
  });
  this.toastr.error('Fill all the required details to add Visit', 'Error!');
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
    if(value==null || value=="" || value.length<2)
    {
      //this.toastr.error('Kindly enter some value to search', 'Error');
      this.listmedicine=[];
      return;
    }
    
    return this.httpservice.searchmed(value).subscribe(
      (response: any) => {
       
        console.log(response)
        if (response.respcode=='00' ) {
          console.log("coming inside");
          let myMap = new Map();
          for ( let data of (response.common) )
          {
            myMap.set(data.medicinename,data.medicinetype);
          }
          this.searchresponse=myMap;
           this.listmedicine =Array.from(myMap.keys());
      console.log("this.listmedicine ",this.listmedicine)
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
    else if(event.target.value == "HR: bpm / SPO2: % / T –  F / BP:  mmhg" && value=='vitals')
    {
      this.showvitalsothers=true;
      this.orderForm.controls['vitals'].setValue('HR: bpm / SPO2: % / T –  F / BP:  mmhg');
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
  resetdropdown(value:any)
  {
    console.log("id ",value);
    if('abc'==value)
    {
      this.showabcothers=false;
      this.orderForm.controls['abc'].setValue('');
    }
    else if(value=='vitals')
    {
      this.showvitalsothers=false;
      this.orderForm.controls['vitals'].setValue('');
    }
    else if(value=='ent')
    {
      this.showentothers=false;
      this.orderForm.controls['ent'].setValue('');
    }
    else if(value=='se')
    {
      this.showseothers=false;
      this.orderForm.controls['se'].setValue('');
    }
  }

  addtoqueue(formData:any)
  {
    if(this.orderForm.controls['customername'].value!="" && this.orderForm.controls['customermobile'].value!="" && this.orderForm.controls['customergender'].value!="")
    {
      this.loader.show();
      let data = formData.value;
      data['custid'] = this.custid;
      data['addqueue']=true;
      console.log(data);
      this.httpservice.savepresc(data).subscribe(
        (response: any) => {
          console.log('Value Received ' + response);
          console.log(response);
          let savedData = (<any>response).respcode;
          if((<any>response).respcode=='00')
          {
            this.loader.hide();
            this.toastr.success('','Patient added to Queue');
            this.router.navigate(["/user/viewvisit"]);
          }
          else{
            this.loader.hide();
            this.toastr.success((<any>response).respdesc,'Error');
            return;
          }
        },
        (err: any) => {
          this.loader.hide();
          console.log('Error caught at Order ' + err);
          this.toastr.error('Data save failed', 'Error!');
        },
        () => console.log('Processing Complete.')
      );
    }
    else{
      console.log("Please ",this.orderForm.controls['customergender'])

      if(this.orderForm.controls['customername'].value=="")
      {
        this.orderForm.controls['customername'].markAsTouched();
      }
      if(this.orderForm.controls['customermobile'].value=="")
      {
        this.orderForm.controls['customermobile'].markAsTouched();
      }
      if(this.orderForm.controls['customergender'].value=="")
      {
        this.orderForm.controls['customergender'].markAsTouched();
      }
      return;
    }
  }

}
