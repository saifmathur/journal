import { Component, OnInit } from '@angular/core';
import { compImports } from '../../app.component.imports';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss',
  imports: [...compImports, ...moduleImports, ...primengmodules],
  providers: [AuthService, DataService],
  standalone: true,
})
export class RemindersComponent implements OnInit{
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.initForm()
    this.getAllReminders();
  }

  getAllReminders(){
    this.dataService.getRemindersForUser().subscribe(res=>{
      this.reminders = res
    })
  }

  reminderForm!: FormGroup;
  reminders: any = [
    // {
    //   id: 1,
    //   title: 'Create reminders page',
    //   notes: 'Create reminders page with CRUD operations',
    //   reminderDate: '2025-02-05',
    //   reminderTime: '3:00 PM',
    //   frequency: 'Daily',
    //   priority: 'High',
    //   isActive: true,
    // },
    // {
    //   id: 2,
    //   title: 'Create reminders page',
    //   notes: 'Create reminders page with CRUD operations',
    //   reminderDate: '2025-02-05',
    //   reminderTime: '3:00 PM',
    //   frequency: 'Weekly',
    //   priority: 'Low',
    //   isActive: false,
    // },
  ];
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
        return 'info';
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
    this.dataService.changeReminderActiveState(reminder.id).subscribe(res=>{
      this.reminders = res.reminders
      this.showToast('info', 'Reminder state changed!');
    },(err:any)=>{
      this.showToast('error','Failed to change reminder state!')
    })
  }


  showReminderDialog() {
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
    let payload = {
      title: this.reminderForm.value.title,
      notes: this.reminderForm.value.notes,
      reminderDate: this.reminderForm.value.reminderDate,
      reminderTime: this.reminderForm.value.reminderTime,
      priority: this.reminderForm.value.priority?.priority,
      frequency: this.reminderForm.value.frequency?.freqName,
    };
    if (this.reminderForm?.valid) {
      console.log(payload);
      if (
        this.reminderForm.value.reminderDate < new Date() ||
        this.reminderForm.value.reminderTime< new Date().getTime()
      ) {
        this.showToast('warn', 'Please select a valid date and time');
      }
      
      let res: any;
      this.dataService.createReminder(payload).subscribe(
        (res: any) => {
          this.reminders = res
        },
        (err: any) => {
          this.showToast('error', 'Failed to create.');

        },()=>{
          this.showToast('success', 'Reminder Created!');

        }
      );

      this.reminderForm.reset();
    }
    this.showCreateReminderDialog = false;
  }
}
