import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Path } from '@prfq-shared/models';
import { AuthService, GameService, RouterService } from '@prfq-shared/services';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
   selector: 'prfq-profile',
   imports: [LoginComponent, RegisterComponent, MatButtonModule],
   templateUrl: './profile.component.html',
   styleUrl: './profile.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
   private readonly authService = inject(AuthService);
   private readonly gameService = inject(GameService);
   private readonly routerService = inject(RouterService);

   public readonly user = this.authService.user;
   public readonly participatedGames = this.gameService.getParticipatedGames();

   public toGame(gameId: string): void {
      this.routerService.openGameOverview(gameId);
   }

   public logout(): void {
      this.authService.logout();
   }

   public toMainPage(): void {
      this.routerService.navigate(Path.MAIN);
   }
}
