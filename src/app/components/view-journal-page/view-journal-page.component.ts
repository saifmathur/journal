import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { primengmodules } from '../../primeng.imports';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-view-journal-page',
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ...primengmodules,
  ],
  templateUrl: './view-journal-page.component.html',
  styleUrl: './view-journal-page.component.scss',
  providers: [DataService, DatePipe, ConfirmationService],
})
export class ViewJournalPageComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  date: Date = new Date();
  entryToDelete: any;
  firstName: any = localStorage.getItem('fullName')?.split(' ').at(0);

  entries: any;
  isModalVisible: boolean = false;

  ngOnInit(): void {
    this.getAllEntriesForUser();
  }

  getAllEntriesForUser() {
    this.dataService.getJournalEntriesForUser().subscribe((res) => {
      this.entries = res;
    });
  }
  confirmDelete(entry: any) {
    this.entryToDelete = entry;
    this.isModalVisible = true;
  }

  deleteConfirm(event: Event, id: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.deleteEntry(id);
      },
      reject: () => {},
    });
  }
  showToast(
    severity: any = 'info',
    summary: any = '',
    detail: any = '',
    timeout: any = 4000
  ) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      key: 'tl',
    });
    setTimeout(() => {
      this.messageService.clear();
    }, timeout);
  }
 

  deleteEntry(id: any) {
    this.dataService.deleteData(id).subscribe(
      (res) => {
        this.entries = res;
        this.showToast('success','Record Deleted!')
      },
      (err: any) => {
        this.showToast('error', 'Failed to delete.');
      },
      () => {
      }
    );
  }
}
