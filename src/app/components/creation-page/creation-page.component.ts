import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-creation-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './creation-page.component.html',
  styleUrl: './creation-page.component.scss',
  providers: [DataService],
})
export class CreationPageComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  //variables
  workTypeCategory: any;
  taskForm!: FormGroup;
  selectedWorkType: any | undefined;
  //variables

  ngOnInit(): void {
    this.getWorkTypeData();
  }

  getWorkTypeData() {
    this.dataService.getWorkTypes().subscribe((res) => {
      this.workTypeCategory = res;
    });
  }

  initForm() {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      //typeOfWork: ['' , Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  onSubmit(): void {
    let payload = {
      userId:1,
      taskName: this.taskForm.value.taskName,
      typeOfWork: this.selectedWorkType,
      description: this.taskForm.value.description,
      date: this.taskForm.value.date,
    };
    if (this.taskForm?.valid) {
      console.log(payload);
      let res: any;
      this.dataService.createJournal(payload).subscribe((res: any)=>{
        res=res
      },(err:any)=>{
        res = err.message
      },()=>{
        alert(res);

      })

      this.taskForm.reset();
    }
  }
}
