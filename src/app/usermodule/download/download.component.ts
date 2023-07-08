import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  download = 'download';
  searchform:UntypedFormGroup;
  assemblyNamesList: any = "";
  fpsNamesList: any = "";
  villageNamesList: any = "";
  talukNamesList: any = "";

  assemblyName: any ="";
  talukName: any ="";
  villageName: any ="";
  fpsName: any ="";

  errormsg:String = "";
  showerror: String = "";
  showmesssage: String = "";
  message:String = "";  

  constructor(private loader:NgxSpinnerService, private httpservice:HttpserviceService) {
    this.searchform=new UntypedFormGroup({
      assembly:new UntypedFormControl("",[Validators.required]),
      taluk:new UntypedFormControl("",[Validators.required]),
      village:new UntypedFormControl("",[Validators.required]),
      fps:new UntypedFormControl("",[Validators.required]),
    })
    this.searchAssemblyNamesList();
  }

  ngOnInit(): void {
  }

  searchAssemblyNamesList(){
    this.httpservice.searchAssemblyNamesList().subscribe((response: any)=>{
      console.log("response ", response);
      let responseData:any = response;
      this.assemblyNamesList = responseData['assemblyNamesList'];
      this.talukNamesList = responseData['talukNamesList'];
      this.villageNamesList = responseData['villageNamesList'];
      this.fpsNamesList = responseData['fpsNamesList'];
      console.log(this.assemblyNamesList);
  });
}

assemblyChange(e:any) {  
  console.log("selected assembly name : " , e.target.value);
  let data={"assemblyName":e.target.value};
  this.httpservice.searchTalukNamesList(data).subscribe((response: any)=>{
    console.log("response ", response);
    let responseData:any = response;
    this.talukNamesList = responseData['talukNamesList'];
    this.talukNamesList = ['', ... this.talukNamesList]
    console.log(this.talukNamesList);
});  
}  

talukChange(e:any) {  
  console.log("selected taluk name : " , e.target.value);  
  let data={"talukName":e.target.value};
  this.httpservice.searchVillageList(data).subscribe((response: any)=>{
    console.log("response ", response);
    let responseData:any = response;
    this.villageNamesList = responseData['villageNamesList'];
    this.villageNamesList = ['', ... this.villageNamesList];
    console.log(this.villageNamesList);
});  
}

villageChange(e:any) {  
  console.log("selected village name : " , e.target.value);  
  let data={"villageName":e.target.value};
  this.httpservice.searchFpsNamesList(data).subscribe((response: any)=>{
    console.log("response ", response);
    let responseData:any = response;
    this.fpsNamesList = responseData['fpsNamesList'];
    this.fpsNamesList = ['', ...this.fpsNamesList];
    console.log(this.fpsNamesList);
});   
}  

downloadMethod(){
  this.assemblyName = this.searchform.get("assembly")?.value;
  this.talukName = this.searchform.get("taluk")?.value;
  this.villageName = this.searchform.get("village")?.value;
  this.fpsName = this.searchform.get("fps")?.value;
   console.log('download called' , this.assemblyName, this.talukName, this.villageName, this.fpsName);
   
   let data = {"assemblyName" : this.assemblyName, "talukName" : this.talukName, "villageName" : this.villageName, "fpsName": this.fpsName};
   this.httpservice.downloadPDF(data).subscribe(
    (data: any) => {
      var file = new Blob([data], { type: 'application/pdf' })
      var fileURL = URL.createObjectURL(file);

// if you want to open PDF in new tab
      window.open(fileURL); 
      var a         = document.createElement('a');
      a.href        = fileURL; 
      a.target      = '_blank';
      a.download    = this.assemblyName+'_'+this.talukName+'_'+this.villageName+'_'+this.fpsName+'_'+new Date();
      document.body.appendChild(a);
      a.click();
    },
    (error) => {
      console.log('getPDF error: ',error);
    }
  );  
}


}
