import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@prfq-shared/services';

@Component({
   selector: 'prfq-register',
   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
   templateUrl: './register.component.html',
   styleUrl: './register.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
   private readonly authService = inject(AuthService);
   private readonly fb = inject(FormBuilder);

   public readonly registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
   });

   public onSubmit(): void {
      const { username, password, confirmPassword } = this.registerForm.value;

      if (password !== confirmPassword) {
         this.registerForm.controls.confirmPassword.setErrors({ notMatching: true });
      }

      if (!this.registerForm.valid) {
         return;
      }

      this.authService.register(username!, password!);
   }
}
