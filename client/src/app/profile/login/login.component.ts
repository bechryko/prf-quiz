import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@prfq-shared/services';

@Component({
   selector: 'prfq-login',
   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
   private readonly authService = inject(AuthService);
   private readonly fb = inject(FormBuilder);

   public readonly loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', Validators.required]
   });

   public onSubmit(): void {
      if (!this.loginForm.valid) {
         return;
      }

      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!);
   }
}
