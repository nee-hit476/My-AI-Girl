import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

interface SpeechRecognition  extends EventTarget {
  onerror: (event: any) => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onresult: (event: any) => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-ai-girl-client';
  transcript = '';
  listening = false;
  recongnition !: SpeechRecognition;

  constructor () {
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; 

    if (!SpeechRecognitionConstructor) {
      throw new Error('SpeechRecognition is not supported by this browser');
    }

    this.recongnition = new SpeechRecognitionConstructor();
    this.recongnition.lang = 'en-US';
    this.recongnition.interimResults = true;
    this.recongnition.maxAlternatives = 1;
    this.recongnition.continuous = false;

    this.recongnition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.transcript = transcript;
    };
  }
}