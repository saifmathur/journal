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
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
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
  editDialog: boolean = false;
  editEntry: any;
  workTypeCategory: any;
  taskForm!: FormGroup;
  selectedWorkType: any | undefined;
  entryDate: any;
  viewDialog: any;
  stats: any;
  constructor(
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {}
  date: Date = new Date();
  entryToDelete: any;
  firstName: any = localStorage.getItem('fullName')?.split(' ').at(0);
  fullName: any = localStorage.getItem('fullName')

  entries: any;
  isModalVisible: boolean = false;
  description: any;
  ngOnInit(): void {
    this.getAllEntriesForUser();
    //this.getJournalStats();
    this.initForm();
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
        this.showToast('success', 'Record Deleted!');
      },
      (err: any) => {
        this.showToast('error', 'Failed to delete.');
      },
      () => {}
    );
  }

  showEdit(entry: any) {
    this.initForm();
    this.editDialog = true;
    this.editEntry = entry;
    this.getWorkTypeData();
    console.log(entry);
    this.selectedWorkType = entry.workType;
    this.entryDate = new Date(entry.date);

    this.description = entry.description;
    console.log(this.description);
    this.taskForm.patchValue({
      taskName: entry.entryTitle,
      workType: entry.workType.workType,
      description: entry.description,
      date: entry.date,
    });
  }

  search(event: AutoCompleteCompleteEvent) {
    this.workTypeCategory = [...this.workTypeCategory];
  }

  initForm() {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      //typeOfWork: ['' , Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  getJournalStats(){
    this.dataService.getJournaStats().subscribe(res=>{
      this.stats = res
    })
  }

  onSubmit(): void {
    let payload = {
      userId: 0,
      taskId: this.editEntry.id,
      taskName: this.taskForm.value.taskName,
      typeOfWork: this.selectedWorkType,
      description: this.description,
      date: this.entryDate,
    };
    console.log(this.entryDate);
    
    if (this.taskForm?.valid) {
      console.log(payload);
      let res: any;
      this.dataService.createJournal(payload).subscribe(
        (res: any) => {},
        (err: any) => {
          this.showToast('success', 'Journal Entry Created!');
        }
      );

      this.taskForm.reset();
      this.editDialog = false;

      setTimeout(() => {
        this.getAllEntriesForUser();
      }, 1000);
    }
  }

  getWorkTypeData() {
    this.dataService.getWorkTypes().subscribe(
      (res) => {
        this.workTypeCategory = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  viewEntry(entry: any) {
    this.editEntry = entry;
    this.viewDialog = true;
  }
}
