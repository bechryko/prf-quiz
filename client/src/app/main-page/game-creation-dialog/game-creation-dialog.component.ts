import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GameService } from '@prfq-shared/services';

@Component({
   selector: 'prfq-game-creation-dialog',
   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
   templateUrl: './game-creation-dialog.component.html',
   styleUrl: './game-creation-dialog.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCreationDialogComponent {
   private readonly dialogRef = inject(DialogRef<string>);
   private readonly fb = inject(FormBuilder);
   private readonly gameService = inject(GameService);

   public submitted = false;

   public readonly creationForm = this.fb.group({
      name: '',
      description: ''
   });

   public create(): void {
      this.submitted = true;
      const { name, description } = this.creationForm.value;
      this.gameService.createGame(name ?? '', description ?? '').subscribe(id => this.close(id));
   }

   public close(gameId?: string): void {
      this.dialogRef.close(gameId);
   }
}
