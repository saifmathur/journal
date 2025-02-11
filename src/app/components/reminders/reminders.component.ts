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
    },(err:any)=>{

    },()=>{
      this.disableTurnOffAll =
        this.reminders.filter((element: any) => element.active == true).length >
        0
          ? false
          : true;
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
      },()=>{
        this.disableTurnOffAll =
          this.reminders.filter((element: any) => element.active == true)
            .length > 0
            ? false
            : true;
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
    
    console.log(new Date(this.reminderForm.value.reminderTime));
    
    const localTime = new Date(this.reminderForm.value.reminderTime); // User selected value
    const utcTime = new Date(
      localTime.getTime() - localTime.getTimezoneOffset() * 60000
    );
    console.log("Correct time:" + utcTime.toISOString()); // Correct UTC time for backend
    let payload;
    if (!this.reminderToUpdate) {
      payload = {
        userTimeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
        title: this.reminderForm.value.title,
        notes: this.reminderForm.value.notes,
        reminderDate: new Date(
          this.reminderForm.value.reminderDate
        ).toISOString(),
        reminderTime: utcTime.toISOString(),
        priority: this.reminderForm.value.priority?.priority,
        frequency: this.reminderForm.value.frequency?.freqName,

      };
    } else {
      payload = {
        userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reminderId: this.reminderToUpdate.id || null,
        title: this.reminderForm.value.title || this.reminderToUpdate.title,
        notes: this.reminderForm.value.notes || this.reminderToUpdate.notes,
        reminderDate:
          new Date(this.reminderForm.value.reminderDate).toISOString() ||
          new Date(this.reminderToUpdate.reminderDate).toISOString(),
        reminderTime:
          utcTime.toISOString() || this.reminderToUpdate.reminderTime,
        priority:
          this.reminderForm.value.priority.priority ||
          this.reminderToUpdate.priority,
        frequency:
          this.reminderForm.value.frequency?.freqName ||
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

  disableTurnOffAll:boolean = false
  disableAll(){
    this.dataService.disableAllReminders().subscribe(res=>{
      this.reminders = res
    },(err:any)=>{

    },()=>{
      this.disableTurnOffAll = this.reminders.filter((element:any)=>element.active == true).length > 0?false:true
    })
  }
  reminderToUpdate: any;

  editReminder(reminder: any) {
    console.log(reminder);
    const localTime = new Date(reminder.reminderTime); // User selected value
    const utcTime = new Date(
      localTime.getTime() - localTime.getTimezoneOffset() * 60000
    );
    console.log(utcTime.toISOString()); // Correct UTC time for backend
    

    this.showCreateReminderDialog = true;
    let payload = {
      reminderId: reminder.id,
      title: reminder.title,
      notes: reminder.notes,
      reminderDate: reminder.reminderDate,
      reminderTime: utcTime.toISOString(),
      priority: reminder.priority,
      frequency: reminder.frequency,
    };
    console.log(payload);
    this.reminderToUpdate = reminder;

    this.reminderForm.patchValue(payload);
  }
}
