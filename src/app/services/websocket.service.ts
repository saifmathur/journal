import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

interface ReportStatusUpdate {
  reportId: number;
  status: string;
  generatedFilePath: string;
}
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client: Client;
  private reportStatusSubject = new BehaviorSubject<ReportStatusUpdate | null>(
    null
  );
  reportStatus$ = this.reportStatusSubject.asObservable();

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://'+environment.hostName+'/ws', // Update with your backend URL
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      webSocketFactory: () => new SockJS('http://'+environment.hostName+'/ws'),
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/status', (message: Message) => {
        const update: ReportStatusUpdate = JSON.parse(message.body);
        this.reportStatusSubject.next(update);
      });
    };

    this.client.activate();
  }
}
