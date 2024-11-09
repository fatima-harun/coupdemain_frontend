import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  defineComponents(IgcRatingComponent);
