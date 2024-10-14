import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Coupdemain_front';
}
