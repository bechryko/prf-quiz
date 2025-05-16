import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Path } from '@prfq-shared/models';
import { AuthService, RouterService } from '@prfq-shared/services';

@Component({
   selector: 'prfq-profile-tile',
   imports: [MatIconModule, MatButtonModule, MatTooltipModule],
   templateUrl: './profile-tile.component.html',
   styleUrl: './profile-tile.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileTileComponent {
   private readonly authService = inject(AuthService);
   private readonly routerService = inject(RouterService);

   public readonly user = this.authService.user;

   @HostListener('click')
   public onClick(): void {
      this.routerService.navigate(Path.PROFILE);
   }
}
