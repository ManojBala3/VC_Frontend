import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';
import { ViewEncapsulation } from '@angular/compiler';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  
})
export class SpinnerComponent implements OnInit {

  constructor(public loader: LoaderService) { }

  ngOnInit(): void {
  }

}
