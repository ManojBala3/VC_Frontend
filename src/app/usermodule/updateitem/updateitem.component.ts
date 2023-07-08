import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpserviceService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-updateitem',
  templateUrl: './updateitem.component.html',
  styleUrls: ['./updateitem.component.scss']
})
export class UpdateitemComponent implements OnInit {

  updateitem = 'updateitem';
  itemId: any;
  itemPrice: any;
  itemName: any;
  itemForm: UntypedFormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private httpservice:HttpserviceService, private toastr: ToastrService,private loader:NgxSpinnerService) { 
    this.itemForm = new UntypedFormGroup({
      itemId: new UntypedFormControl('', [Validators.required]),
      itemName: new UntypedFormControl('', [Validators.required]),
      itemPrice: new UntypedFormControl(['', Validators.required]),
    });
  }

  ngOnInit(): void {
    this.itemForm.get('itemId')?.disable();

    this.route.queryParams.subscribe(params => {
      this.itemId = params['itemId'];
      this.itemForm.value['itemId'] = this.itemId;
  });
  this.getItemDetailsByID(this.itemId);
  }

  getItemDetailsByID(itemId: any) {
    this.loader.show();
    let data={"custid":itemId};
    this.httpservice.getItemById(data).subscribe((response: any) =>{
              console.log(response);
              let list = (<any>response).meddata;
              this.itemName = list.medicinename;
              this.loader.hide();
       })
  }

  backToListItem(){
    this.router.navigate(["/user/viewitem"]);
  }

 updateItem(){
    if(this.itemForm.valid){
      // Form is valid, perform your desired actions here
      console.log('Form submitted successfully');
      if(confirm("Are you sure to update customer details ?")) {
        this.loader.show();
        let data = {
          "medid": this.itemId,
          "medicinename":this.itemName,
        }
        let savedData;
        this.httpservice.updateItem(this.itemId, data).subscribe(
          response => {
            console.log('Value Received ' + response);
            console.log(response)
            savedData = (<any>response).data;
            this.loader.hide();
            this.toastr.success('Item update success!', 'Success');
            this.router.navigate(['user/viewitem']);
          },
          err => {
            this.loader.hide();
            console.log("Error caught at Subscriber " + err)
            this.toastr.error('Item update failed!', 'Error');
          },
          () => console.log("Processing Complete.")
        )
        }

  }else{
     // Form is invalid, mark all fields as touched to display error messages
      Object.values(this.itemForm.controls).forEach(control => {
      control.markAsTouched();
  });
  this.toastr.error('Item update failed!', 'Error');
}
}
}
