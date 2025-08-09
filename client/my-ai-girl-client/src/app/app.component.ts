import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import axios from 'axios';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [RouterOutlet, NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-ai-girl-client';
  transcript = '';
  listening = false;
  recongnition !: SpeechRecognition;
  audio: any = '';

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor (private http: HttpClient) {
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

      console.log(transcript);
    };

    this.recongnition.onend = (event: any) => {
      this.listening = false;
    }
  } 

  startListening () {
    this.listening = true;
    this.recongnition.start();
  }

  async stopListening () {
    this.listening = false;
    this.recongnition.stop();
    const girlFriendTranscript: any = await axios.post(`http://localhost:3000/audio/transcript?text=${this.transcript}`);
    console.log(girlFriendTranscript.data.candidates[0].content.parts[0].text);

    const audioURl = await axios.post(`http://localhost:3000/audio/transcript/speaker?text=${girlFriendTranscript.data.candidates[0].content.parts[0].text}`);
    this.audio = new Audio((audioURl as any).data.url);
    this.audioPlayerRef.nativeElement.play();

  }

}