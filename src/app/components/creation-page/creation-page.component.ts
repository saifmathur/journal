import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-creation-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './creation-page.component.html',
  styleUrl: './creation-page.component.scss',
  providers: [DataService],
})
export class CreationPageComponent implements OnInit {
  constructor(private dataService: DataService) {}

  //variables
  workTypeCategory:any
  //variables

  ngOnInit(): void {
    this.dataService.getWorkTypes().subscribe((res) => {
      console.log(res);
      this.workTypeCategory = res
    });
  }
}
