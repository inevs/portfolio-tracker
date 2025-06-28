import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppTopbarComponent } from './components/app-topbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppTopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Portfolio Tracker';
}
