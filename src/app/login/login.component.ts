import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharingserviceService } from '../commonservices/sharingservice.service';
import { HttpserviceService } from '../httpservice.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';



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
    private route: Router,private sharingservice: SharingserviceService,private httpservice:HttpserviceService,private toastr: ToastrService,private loader:NgxSpinnerService) { 

    this.loginform=new UntypedFormGroup({
       
      email:new UntypedFormControl("",[Validators.required]),
      password:new UntypedFormControl("",[Validators.required]),

    })
  }

  ngOnInit(): void {
    localStorage.clear();
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
    let data={"username":username,"userpassword":password};
    console.log(data)
    this.httpservice.checklogin(data).subscribe(response=>{
      this.loader.show();
      console.log("response",response);
      let data:any=response;
      let common:any=data['common'];
      this.sharingservice.isAdmin = false;
      if(data['respcode']=='00')
      {
        localStorage.setItem('username',username+"");
        localStorage.setItem('userrole',common['role']+"");
        this.loader.hide();
        this.route.navigate(['/user/viewqueue']);
      }
      else{
        this.loader.hide();
        this.errormsg="Invalid user"
        this.showerror=true;
      }
    }
    ,
      (err) => {
        this.loader.hide();
        this.loginform.reset();
        console.log('Error caught at Subscriber ' + err);
        this.toastr.error('Server Error ! Kindly try after sometime', '');
      });
    
  }
}
