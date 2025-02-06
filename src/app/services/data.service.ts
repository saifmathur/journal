// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl; // Replace with your API endpoint

  constructor(private http: HttpClient, private auth: AuthService) {}

  // GET request
  getWorkTypes(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    console.log(headers);

    return this.http.get(`${this.apiUrl}/work/getAllWorkType`, { headers });
  }
  getJournalEntriesForUser(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/journal/getEntries`, { headers });
  }
  getRemindersForUser(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/reminder/getAllReminders`, {
      headers,
    });
  }
  // POST request
  createJournal(payload: {
    userId: number;
    taskName: any;
    typeOfWork: any;
    description: any;
    date: any;
  }): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/journal/createJournalEntry`,
      payload,
      {
        headers: headers,
      }
    );
  }

  // journal/journalStats
  getJournaStats(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/journal/journalStats`, { headers });
  }

  exportAllJournal(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/journal/exportAllEntries`, {
      responseType: 'blob',
      headers: headers,
    });
  }

  // PUT request
  updateData(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/data/${id}`, data);
  }

  // DELETE request
  deleteData(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/journal/deleteEntry/${id}`);
  }

  changeReminderActiveState(id: any) {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<{ reminders: Object; state: boolean }>(
      `${this.apiUrl}/reminder/setReminderActiveOrInactive/${id}`,
      { headers: headers }
    );
  }

  createReminder(payload: {
    title: any;
    notes: any;
    reminderDate: any;
    reminderTime: any;
    priority: any;
    frequency: any;
  }) {
    const headers = this.auth.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/reminder/createReminder`, payload, {
      headers: headers,
    });
  }

  deleteReminder(id: string): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/reminder/delete/${id}`,{headers: headers});
  }
}
