import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharingserviceService } from 'src/app/commonservices/sharingservice.service';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {
  
  user= 'user';
  itemPrice: any;
  username: any;
  userrole:any;
  itemForm: UntypedFormGroup;
  userpassword:any;
  userpassword2:any;
  role:any=['Admin','User'];

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService, private loader:NgxSpinnerService
    ,private sharingservice: SharingserviceService) { 
    this.itemForm = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      userrole: new UntypedFormControl('', [Validators.required]),
      userpassword: new UntypedFormControl('', [Validators.required]),
      userpassword2: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  backToListItem(){
    this.router.navigate(["/user/viewuser"]);
  }

  registeruser(formdata:any){
       console.log(this.itemForm);
       if(this.itemForm.valid){
        // Form is valid, perform your desired actions here
        let data = formdata.value;
        console.log("data",data)
        if(data['userpassword'] !=data['userpassword2']  )
        {
          this.toastr.error('Confirm Password Mismatch', 'Error!');
          return;
        }
        console.log('Form submitted successfully');
    }else{
       // Form is invalid, mark all fields as touched to display error messages
        Object.values(this.itemForm.controls).forEach(control => {
          control.markAsTouched();
    });
    this.toastr.error('Mandatory Fields Missing', 'Error!');
    return;
  }
    let data = formdata.value;
    data['createdby'] = localStorage.getItem('username');
   this.loader.show();
    let savedData;
    this.httpservice.createUser(data).subscribe(
      (response) => {
        console.log('Value Received ' + response);
        console.log(response);
        savedData = (<any>response).medicinename;
        this.toastr.success(
           (<any>response).medicinename,
          'Registeration Success!'
        );
        this.itemForm.reset();
        this.backToListItem();
        this.loader.hide();
      },
      (err) => {
        this.loader.hide();
        console.log('Error caught at Subscriber ' + err);
        this.toastr.error('User registered failed', 'Error!');
      },
      () => console.log('Processing Complete.')
    );
  }


}
