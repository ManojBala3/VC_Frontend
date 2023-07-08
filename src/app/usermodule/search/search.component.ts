import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntypedFormControl, UntypedFormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchform:UntypedFormGroup;
  errormsg:String="";
  search='search';
  count:any="";
  message:String="";
  showrecords:boolean=false;
  showerror:boolean=false;
  showmesssage:boolean=false;
  constructor(private loader:NgxSpinnerService,private route: Router,private httpservice:HttpserviceService) {
    this.searchform=new UntypedFormGroup({
      fn_search:new UntypedFormControl("",[Validators.required]),
      fn_smartcard:new UntypedFormControl("",[]),
      fn_assemblyname:new UntypedFormControl("",[]),
      fn_taluk:new UntypedFormControl("",[]),
      fn_villagename:new UntypedFormControl("",[]),
      fn_fpscode:new UntypedFormControl("",[]),
      fn_fpsname:new UntypedFormControl("",[]),
      fn_rationcardno:new UntypedFormControl("",[]),
      fn_cardtype:new UntypedFormControl("",[]),
      fn_nfsa:new UntypedFormControl("",[]),
      fn_registerno:new UntypedFormControl("",[]),
      fn_dob:new UntypedFormControl("",[]),
      fn_englishname:new UntypedFormControl("",[]),
      fn_tamilname:new UntypedFormControl("",[]),
      fn_fsname:new UntypedFormControl("",[]),
      fn_noofadults:new UntypedFormControl("",[]),
      fn_noofchild:new UntypedFormControl("",[]),
      fn_total:new UntypedFormControl("",[]),
      fn_aadharseed:new UntypedFormControl("",[]),
      fn_cyclindercount:new UntypedFormControl("",[]),
      fn_phone:new UntypedFormControl("",[Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]),
    })
   }

  ngOnInit(): void {
   // this.fetchcountdetails();
   this.showrecords=true;
  }


  submit()
  {
   // this.loader.show();
    this.resetmessages();
    var searchvalue=this.searchform.get("fn_search");
    if(searchvalue?.value!="" && searchvalue?.value!="null")
    {
      console.log("searchvalue "+searchvalue?.value)
      this.httpservice.fetch(searchvalue?.value).subscribe(response=>{
        console.log("response ",response);
        let respdata:any=response;
        if(respdata['responsecode']=='00')
        {
          this.showrecords=true;
          this.searchform.get("fn_smartcard")?.setValue(respdata['smartcardNumber']);
          this.searchform.get("fn_assemblyname")?.setValue(respdata['assemblyName']);
          this.searchform.get("fn_taluk")?.setValue(respdata['talukName']);
          this.searchform.get("fn_villagename")?.setValue(respdata['villageName']);
          this.searchform.get("fn_fpscode")?.setValue(respdata['fpsCode']);
          this.searchform.get("fn_fpsname")?.setValue(respdata['fpsName']);
          this.searchform.get("fn_rationcardno")?.setValue(respdata['rationcardNumber']);
          this.searchform.get("fn_cardtype")?.setValue(respdata['cardType']);
          this.searchform.get("fn_nfsa")?.setValue(respdata['nfsaCardType']);
          this.searchform.get("fn_registerno")?.setValue(respdata['aRegisterNumber']);
          this.searchform.get("fn_dob")?.setValue(respdata['dateOfBirth']);
          this.searchform.get("fn_englishname")?.setValue(respdata['nameEnglish']);
          this.searchform.get("fn_tamilname")?.setValue(respdata['nameTamil']);
          this.searchform.get("fn_fsname")?.setValue(respdata['fatherSpouseNameEnglish']);
          this.searchform.get("fn_noofadults")?.setValue(respdata['numberOfAdult']);
          this.searchform.get("fn_noofchild")?.setValue(respdata['numberOfChild']);
          this.searchform.get("fn_total")?.setValue(respdata['totalMembers']);
          this.searchform.get("fn_aadharseed")?.setValue(respdata['aadharSeeded']);
          this.searchform.get("fn_cyclindercount")?.setValue(respdata['numberOfCylinder']);
          this.searchform.get("fn_phone")?.setValue(respdata['phoneNumber']);
        }
        else{
          this.showerrormessage(respdata['responsedesc']);
        }
      });
    }
    else{
      this.showerrormessage("Kindly enter search value")
    }
    this.loader.hide();
  }

  update()
  {
    this.loader.show();
    this.showerror=false;
    this.showmesssage=false;
    if(this.searchform.get("fn_phone")?.value!=null && this.searchform.get("fn_phone")?.value.length==10)
    {
      let data={"smartcardNumber":this.searchform.get("fn_smartcard")?.value,"phoneNumber":this.searchform.get("fn_phone")?.value};
      console.log(data)
      this.httpservice.updatephoneno(data).subscribe(response=>{
        let respdata:any=response;
        console.log("response ",response);
        if(respdata['responsecode']=='00')
        {
          this.resetmessages();
          this.showmessage("Record updated successfully");
        }
      });
    }
    else
    {
      this.showerrormessage("Kindly enter phone number")
    }
    this.loader.hide();
  }

  showmessage(message:any)
  {
   this.message=message;
   this.showerror=false;
   this.showmesssage=true;
  }
 
  showerrormessage(message:any)
  {
   this.errormsg=message;
   this.showmesssage=false;
   this.showerror=true;
  }
 
  resetmessages()
  {
    this.fetchcountdetails();
    this.showrecords=false;
   this.showerror=false;
   this.showmesssage=false;
  }
  clear()
  {
    this.fetchcountdetails();
    this.resetmessages();
    this.searchform.reset();
  }
  fetchcountdetails()
  {
    this.loader.show();
    this.httpservice.fetchcount().subscribe(response=>{
      console.log("count",response)
      let data:any=response;
      this.count=data['count'];
      this.loader.hide();
    });
  }
}
