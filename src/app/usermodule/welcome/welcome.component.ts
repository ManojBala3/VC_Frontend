import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharingserviceService } from 'src/app/commonservices/sharingservice.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{

  search='search';
  username:any="";
  showuser:boolean =false;
  isAdmin: boolean = false;;

  @Input()route:any;
 
  constructor(private router: Router,private sharingservice: SharingserviceService) { }

  ngOnInit(): void 
  {
   console.log(this.route);
    if(this.sharingservice.getusername()!=null && this.sharingservice.getusername()!="")
    {
      this.showuser=true;
      this.username=this.sharingservice.getusername();
      
    }
    
    this.isAdmin = this.sharingservice.isAdmin ? this.sharingservice.isAdmin : false;
  }

}
