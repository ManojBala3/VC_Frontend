import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-additem',
  templateUrl: './addmedicine.component.html',
  styleUrls: ['./addmedicine.component.scss']
})
export class AddMedicineComponent implements OnInit {

  addmedicine= 'viewmedicine';
  itemPrice: any;
  itemName: any;
  medicinetype:any;
  itemForm: UntypedFormGroup;
  medtype:any=['TABLETS','SYRUPS & DROPS','OINTMENTS/SOLUTIONS'];

  constructor(private router: Router, private httpservice:HttpserviceService, private toastr: ToastrService, private loader:NgxSpinnerService) { 
    this.itemForm = new UntypedFormGroup({
      itemName: new UntypedFormControl('', [Validators.required]),
      medicinetype: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  backToListItem(){
    this.router.navigate(["/user/viewmedicine"]);
  }

  registerItem(){
       console.log(this.itemForm);
       if(this.itemForm.valid){
        // Form is valid, perform your desired actions here
        console.log('Form submitted successfully');
    }else{
       // Form is invalid, mark all fields as touched to display error messages
        Object.values(this.itemForm.controls).forEach(control => {
          control.markAsTouched();
    });
    this.toastr.error('Mandatory Fields Missing', 'Error!');
    return;
  }

    let data = {
      medicinename: this.itemName,
      medicinetype: this.itemForm.value['medicinetype']
    }
   this.loader.show();
    let savedData;
    this.httpservice.createItem(data).subscribe(
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
        this.toastr.error('Item registered failed', 'Error!');
      },
      () => console.log('Processing Complete.')
    );
  }

}
