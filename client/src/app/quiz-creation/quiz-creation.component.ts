import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GameService, RouterService } from '@prfq-shared/services';
import { QuizQuestionForm } from './models';
import { QuizFormsUtils } from './utils';

@Component({
   selector: 'prfq-quiz-creation',
   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
   templateUrl: './quiz-creation.component.html',
   styleUrl: './quiz-creation.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizCreationComponent {
   private readonly fb = inject(FormBuilder);
   private readonly gameService = inject(GameService);
   private readonly route = inject(ActivatedRoute);
   private readonly routerService = inject(RouterService);
   private readonly snackbar = inject(MatSnackBar);

   public readonly quizForm = QuizFormsUtils.createQuizForm(this.fb);
   public submitted = false;

   public addQuestion(): void {
      this.questionsControls.push(QuizFormsUtils.createQuestionForm(this.fb));
   }

   public addOption(questionIndex: number): void {
      this.questionsControls.at(questionIndex).controls.options.push(this.fb.group({ text: '', isCorrect: false }));
   }

   public createQuiz(): void {
      this.validateForm();
      if (!this.quizForm.valid) {
         return;
      }

      this.submitted = true;
      const quiz = QuizFormsUtils.transformFormValue(this.quizForm.value);
      this.gameService.createQuiz(this.gameId, quiz).subscribe(() => this.routerService.openGameOverview(this.gameId));
   }

   private validateForm(): void {
      const currentFormValue = QuizFormsUtils.transformFormValue(this.quizForm.value);
      if (currentFormValue.questions.length === 0) {
         this.quizForm.setErrors({ 'no-question': true });
         this.snackbar.open('A quiz should have at least one question!', 'Understood', { duration: 2000 });
         return;
      }
      if (currentFormValue.questions.some(question => question.options.length < 2)) {
         this.quizForm.setErrors({ 'too-few-options': true });
         this.snackbar.open('Every question should have at least two options!', 'Understood', { duration: 2500 });
         return;
      }
      if (currentFormValue.questions.some(question => question.options.every(option => !option.isCorrect))) {
         this.quizForm.setErrors({ 'no-correct-option': true });
         this.snackbar.open('Every question should have at least one correct option!', 'Understood', {
            duration: 2500
         });
         return;
      }
   }

   private get questionsControls(): FormArray<QuizQuestionForm> {
      return this.quizForm.controls.questions;
   }

   private get gameId(): string {
      return this.route.snapshot.paramMap.get('gameId')!;
   }
}
