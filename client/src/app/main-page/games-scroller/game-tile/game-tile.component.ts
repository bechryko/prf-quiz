import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@prfq-shared/services';
import { Game } from '../../../shared/models';

@Component({
   selector: 'prfq-game-tile',
   imports: [MatButtonModule, MatIconModule, MatTooltipModule],
   templateUrl: './game-tile.component.html',
   styleUrl: './game-tile.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTileComponent {
   private readonly authService = inject(AuthService);

   public readonly game = input.required<Game>();
   public readonly navigateToGameOverview = output();
   public readonly user = this.authService.user;
}
