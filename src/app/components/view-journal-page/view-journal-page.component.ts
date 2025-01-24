import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-view-journal-page',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './view-journal-page.component.html',
  styleUrl: './view-journal-page.component.scss',
  providers: [DataService],
})
export class ViewJournalPageComponent implements OnInit {
  constructor(private dataService: DataService) {}

  entries: any;

  ngOnInit(): void {
    this.getAllEntriesForUser()
  }

  getAllEntriesForUser() {
    this.dataService.getJournalEntriesForUser(1).subscribe((res) => {
      this.entries = res;
    });
  }
}
