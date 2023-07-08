import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharingserviceService } from '../commonservices/sharingservice.service';
import { HttpserviceService } from '../httpservice.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username:String="";
  password:String="";
  errormsg:String="invalid user";
  showerror:boolean=false;
  loginform:UntypedFormGroup;
 

  constructor(
    private route: Router,private sharingservice: SharingserviceService,private httpservice:HttpserviceService) { 

    this.loginform=new UntypedFormGroup({
       
      email:new UntypedFormControl("",[Validators.required]),
      password:new UntypedFormControl("",[Validators.required]),

    })
  }

  ngOnInit(): void {
  }

  loginbtn(username:String,password:String)
  {
    this.showerror=false;
    console.log("username   "+username);
    if(username=="")
    {
      this.showerror=true;
      this.errormsg="Email ID cannot be empty";
      return;
    }
    else  if(password==""){
      this.showerror=true;
      this.errormsg="Password cannot be empty";
      return;
    }
    let data={"userName":username,"password":password};
    console.log(data)
    // this.httpservice.checklogin(data).subscribe(response=>{
    //   console.log("response",response);
    //   let data:any=response;
    //   this.sharingservice.isAdmin = false;
    //   if(data["userRole"] == "admin" && data["authorized"]==true){
    //     this.sharingservice.isAdmin = true;
    //   }
    //   if(data["authorized"]==true)
    //   {
    //     this.sharingservice.setusername(username);
    //     this.route.navigate(['/user/search']);
    //   }
    //   else{
    //     this.errormsg="Invalid user"
    //     this.showerror=true;
    //   }
    // });
    
    if(username=="VC001" && password == "vc@789"){
    this.sharingservice.setusername(username);
    this.route.navigate(['/user/addcustomer']);
    }
    
  }
}
