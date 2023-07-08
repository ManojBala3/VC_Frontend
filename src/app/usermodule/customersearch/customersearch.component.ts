import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntypedFormControl, UntypedFormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-customersearch',
  templateUrl: './customersearch.component.html',
  styleUrls: ['./customersearch.component.scss']
})
export class CustomersearchComponent implements OnInit 
{
  searchvalue: any = ['SMART CARD NO', 'NAME', 'RATION CARD NO'];
  searchform:UntypedFormGroup;
  errormsg:String="";
  search1='search1';
  page: number = 1;
  searchactivate:boolean=false;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [10, 15, 20];
  message:String="";
  showrecords:boolean=false;
  showerror:boolean=false;
  searchtype:any="";
  search_value:any="";
  countfrom:number=0;
  countto:number=0;
  resultset:any;
  divide:number=0;
  showmesssage:boolean=false;
  constructor(private loader:NgxSpinnerService,private route: Router,private httpservice:HttpserviceService) {
    this.searchform=new UntypedFormGroup({
      fn_search:new UntypedFormControl("",[Validators.required]),
      value:new UntypedFormControl("SMART CARD NO",[Validators.required]),
    })
  }
  ngOnInit(): void {
    this.fetchallrecords();
  }
   
  fetchallrecords()
  {
    //this.loader.show();
    this.resetmessages();
    let data={"limitfrom":this.tableSize,"limitto":this.countto};
    console.log("fetchallrecords request ",data);
    this.httpservice.fetchallrecords(data).subscribe((response: any)=>{
      console.log("response ",response);
      let respdata:any=response;
      if(respdata['responsecode']=="00")
      {
        this.resultset=respdata['rationdetails'];
        this.divide=respdata['totalRecords'];
        console.log("pages ",this.count);
        this.count=this.divide;
        this.loader.hide();
        this.showrecords=false;
      }
      else{
        this.showerrormessage(respdata['responsedesc']);
        this.loader.hide();
      }
    });
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
    
    this.showrecords=false;
   this.showerror=false;
   this.showmesssage=false;
   this.searchtype="";
   this.search_value="";
   this.searchactivate=false;
   

  }
  resettable()
  {
    this.page=1;
    this.count = 0;
    this.countfrom=0;
  }
  clear()
  {
    this.resettable();
    this.searchform.reset();
    this.searchform.patchValue({
      "value": 'SMART CARD NO'
  });
    this.fetchallrecords();
    
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.countfrom=this.tableSize;
    this.countto= (event * this.tableSize)-this.tableSize;
    this.fetchallrecords();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
   
  }

  update(smaertcardno:any,phoneno:any)
  {
    this.loader.show();
    console.log("smaertcardno ",smaertcardno);
    const input= document.getElementById(phoneno) as HTMLInputElement | null;
    this.search_value= this.searchform.get("fn_search")?.value;
    this.searchtype= this.searchform.get("value")?.value;
    console.log("phoneno ",input?.value); 
    if(input?.value!=null && input?.value.length==10)
    {
      let data={"smartcardNumber":smaertcardno,"phoneNumber":input?.value};
      console.log(data)
      this.httpservice.updatephoneno(data).subscribe((response: any)=>{
        let respdata:any=response;
        console.log("response ",response);
        if(respdata['responsecode']=='00')
        {
          this.loader.hide();
          if(this.searchactivate)
          {
            this.searchrecords(false);
          }
          else{
            this.fetchallrecords();
          }
          
          this.showmessage("Record updated successfully");
        }
      });
    }
    else
    {
      this.loader.hide();
      this.showerrormessage("Kindly enter valid phone number")
    }
  }

  searchrecords(frontend:boolean)
  {
    this.loader.show();
    if(frontend)
    {
      this.resettable();
       this.search_value= this.searchform.get("fn_search")?.value;
       this.searchtype= this.searchform.get("value")?.value;  
    }
    console.log(this.search_value+" "+this.searchtype)
    if(this.searchtype!=null && this.searchtype!=""){
      if(this.search_value!=null && this.search_value!=""){
        let data={"searchType":this.searchtype,"searchValue":this.search_value};
        this.httpservice.searchrecords(data).subscribe((response: any)=>{
          console.log("response ",response);
          let respdata:any=response;
          if(respdata['responsecode']=="00")
          {
            this.resultset=respdata['rationdetails'];
            this.divide=respdata['totalRecords'];
            this.searchactivate=true;
            this.count=this.divide;
            this.showrecords=true;
            this.loader.hide();
          }
          else{
            this.showrecords=false;
            this.showerrormessage(respdata['responsedesc']);
            this.loader.hide();
          }
        });
      }
      else{
        this.showrecords=false;
        this.loader.hide();
        this.showerrormessage("Kindly enter search value");
      }
    }
    else{
      this.showrecords=false;
      this.loader.hide();
      this.showerrormessage("Kindly choose search type");
    }
  }

  view()
  {

  }

}
