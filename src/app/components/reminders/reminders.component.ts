import { Component, OnInit } from '@angular/core';
import { compImports } from '../../app.component.imports';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss',
  imports: [...compImports, ...moduleImports, ...primengmodules],
  providers: [AuthService, DataService, ConfirmationService],
  standalone: true,
})
export class RemindersComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.getAllReminders();
  }

  getAllReminders() {
    this.dataService.getRemindersForUser().subscribe((res) => {
      this.reminders = res;
    });
  }

  reminderForm!: FormGroup;
  reminders: any = [];
  showCreateReminderDialog: boolean = false;
  reminderDate: any;
  items: any = [
    {
      priority: 'High',
    },
    {
      priority: 'Medium',
    },
    {
      priority: 'Low',
    },
  ];

  frequencyitems: any = [
    {
      freqName: 'Daily',
    },
    {
      freqName: 'Weekly',
    },
    {
      freqName: 'Monthly',
    },
  ];
  priority: any;
  frequency: any;
  search(event: AutoCompleteCompleteEvent) {
    this.items = [...this.items];
  }
  searchFreq(event: AutoCompleteCompleteEvent) {
    this.frequencyitems = [...this.frequencyitems];
  }

  getSeverity(
    priority: string
  ): 'info' | 'success' | 'secondary' | 'warn' | 'danger' | 'primary' {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warn';
      case 'low':
        return 'success';
      case 'active':
        return 'info';
      case 'disabled':
        return 'secondary';
      default:
        return 'primary';
    }
  }

  changeReminderState(reminder: any) {
    // reminder.isActive = !reminder.isActive
    let res1: Object;
    this.dataService.changeReminderActiveState(reminder.id).subscribe(
      (res) => {
        this.reminders = res.reminders;
        this.showToast('info', 'Reminder state changed!');
      },
      (err: any) => {
        this.showToast('error', 'Failed to change reminder state!');
      }
    );
  }

  showReminderDialog() {
    this.reminderForm.reset();
    this.showCreateReminderDialog = true;
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

  initForm() {
    this.reminderForm = this.formBuilder.group({
      title: ['', Validators.required],
      notes: [''],
      reminderDate: ['', Validators.required],
      reminderTime: ['', Validators.required],
      priority: ['', Validators.required],
      frequency: [''],
    });
  }
  onSubmit(): void {
    let payload;
    if (!this.reminderToUpdate) {
      payload = {
        title: this.reminderForm.value.title,
        notes: this.reminderForm.value.notes,
        reminderDate: new Date(this.reminderForm.value.reminderDate).toISOString(),
        reminderTime: this.reminderForm.value.reminderTime,
        priority: this.reminderForm.value.priority?.priority,
        frequency: this.reminderForm.value.frequency?.freqName,
      };
    } else {
      payload = {
        reminderId: this.reminderToUpdate.id || null,
        title: this.reminderForm.value.title || this.reminderToUpdate.title,
        notes: this.reminderForm.value.notes || this.reminderToUpdate.notes,
        reminderDate:
          new Date(this.reminderForm.value.reminderDate).toISOString() ||
          new Date(this.reminderToUpdate.reminderDate).toISOString(),
        reminderTime:
          this.reminderForm.value.reminderTime ||
          this.reminderToUpdate.reminderTime,
        priority:
          this.reminderForm.value.priority.priority ||
          this.reminderToUpdate.priority,
        frequency:
          this.reminderForm.value.frequency.freqName ||
          this.reminderToUpdate.frequency,
      };
    }
    if (this.reminderForm?.valid) {
      console.log(payload);

      if (
        this.reminderForm.value.reminderDate < new Date() ||
        this.reminderForm.value.reminderTime < new Date().getTime()
      ) {
        this.showToast('warn', 'Please select a valid date and time');
      }
      this.createUpdateReminder(payload);
      //console.log(this.reminderForm.value);
    }
    this.showCreateReminderDialog = false;
    this.reminderToUpdate = null;
  }

  createUpdateReminder(payload: any) {
    this.dataService.createReminder(payload).subscribe(
      (res: any) => {
        this.reminders = res;
      },
      (err: any) => {
        this.showToast('error', 'Failed to create.');
      },
      () => {
        this.showToast('success', 'Reminder Created!');
        this.reminderForm.reset();
      }
    );
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
        this.dataService.deleteReminder(id).subscribe((res) => {
          this.reminders = res;
        });
      },
      reject: () => {},
    });
  }

  reminderToUpdate: any;

  editReminder(reminder: any) {
    console.log(reminder);
    const datetime = new Date(
      `${reminder.reminderDate}T${reminder.reminderTime}`
    ).toISOString();

    this.showCreateReminderDialog = true;
    let payload = {
      reminderId: reminder.id,
      title: reminder.title,
      notes: reminder.notes,
      reminderDate: datetime,
      reminderTime: datetime,
      priority: reminder.priority,
      frequency: reminder.frequency,
    };
    console.log(payload);
    this.reminderToUpdate = reminder;

    this.reminderForm.patchValue(payload);
  }
}
