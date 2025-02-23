import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { compImports } from '../../app.component.imports';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FileUploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-analyzer',
  imports: [...compImports, ...moduleImports, ...primengmodules],
  providers: [AuthService, DataService, ConfirmationService],
  standalone: true,
  templateUrl: './analyzer.component.html',
  styleUrl: './analyzer.component.scss',
})
export class AnalyzerComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  analyzeForm!: FormGroup;
  ngOnInit(): void {
    this.initForm();
    this.getAllReports()
    // this.reports = [
    //   {
    //     reportName: 'New report',
    //     fileName: 'SAIF-MATHUR-RESUME.pdf',
    //     reportDate: '23-02-2025',
    //     status: 'In Progress',
    //   },
    //   {
    //     reportName: 'New report',
    //     fileName: 'SAIF-MATHUR-RESUME.pdf',
    //     reportDate: '23-02-2025',
    //     status: 'Report Generated',
    //   },
    //   {
    //     reportName: 'New report',
    //     fileName: 'SAIF-MATHUR-RESUME.pdf',
    //     reportDate: '23-02-2025',
    //     status: 'Report Failed',
    //   },
    // ];
  }

  reports: any;
  searchFreq(event: AutoCompleteCompleteEvent) {}
  showCreateReportDialog: boolean = false;
  search(event: AutoCompleteCompleteEvent) {}

  showAnalyzerDialog() {
    this.analyzeForm.reset();
    this.showCreateReportDialog = true;
  }


  initForm() {
    this.analyzeForm = this.formBuilder.group({
      reportName: ['', Validators.required],
      jobDescription: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  getSeverity(
    priority: string
  ): 'info' | 'success' | 'secondary' | 'warn' | 'danger' | 'primary' {
    switch (priority.toLowerCase()) {
      case 'processing':
        return 'info';
      case 'generated':
        return 'success';
      case 'failed':
        return 'danger';
      case 'queued':
        return 'warn';
      default:
        return 'secondary';
    }
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

  fileToUpload!: File;

  onBasicUploadAuto(event: any) {
    console.log(event);
    this.fileToUpload = event.currentFiles[0];
  }

  getReportName() {
    if (this.analyzeForm.value.reportName==undefined || this.analyzeForm.value.reportName.length == 0) {
      this.analyzeForm.patchValue({
        reportName: 'Report Analysis: ' + this.fileToUpload?.name,
      });
    }
  }

  getAllReports(){
    this.dataService.getAllReports().subscribe(res=>[
      this.reports = res
    ])
  }

  onSubmit(): void {
    this.getReportName()
    console.log(this.fileToUpload);
    console.log(this.analyzeForm);
    const formData = new FormData();
    formData.append('reportName', this.analyzeForm.value.reportName);
    formData.append('jobDescription',this.analyzeForm.value.jobDescription);
    formData.append('resume', this.fileToUpload, this.fileToUpload?.name);
    // console.log(formData.get('resume'));
    
    this.dataService.createReport(formData).subscribe(res=>{
      console.log(res);
      this.reports = res
    })

    this.closeFormAndreset()
  }

  closeFormAndreset(){
    this.analyzeForm.reset()
    this.showCreateReportDialog = false
  }

  downloadFile(report:any){
    this.dataService.downloadReport(report.id).subscribe((res:any)=>{
      const blob = new Blob([res.body!], {
        type: res.body?.type || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.generatedFilePath.split('/').pop() || 'downloaded_file.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}
