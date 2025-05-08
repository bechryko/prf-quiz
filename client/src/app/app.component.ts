import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileTileComponent } from '@prfq-shared/components';

@Component({
   selector: 'prfq-root',
   imports: [RouterOutlet, ProfileTileComponent],
   templateUrl: './app.component.html',
   styleUrl: './app.component.scss'
})
export class AppComponent {
   title = 'client';
}
