import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '@prfq-shared/services';
import { QuizQuestionForm } from './models';
import { QuizFormsUtils } from './utils';

@Component({
   selector: 'prfq-quiz-creation',
   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
   templateUrl: './quiz-creation.component.html',
   styleUrl: './quiz-creation.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizCreationComponent {
   private readonly fb = inject(FormBuilder);
   private readonly gameService = inject(GameService);
   private readonly route = inject(ActivatedRoute);
   private readonly cdr = inject(ChangeDetectorRef);

   public readonly quizForm = QuizFormsUtils.createQuizForm(this.fb);
   public submitted = false;

   public addQuestion(): void {
      this.questionsControls.push(QuizFormsUtils.createQuestionForm(this.fb));
   }

   public addOption(questionIndex: number): void {
      this.questionsControls.at(questionIndex).controls.options.push(this.fb.group({ text: '', isCorrect: false }));
      this.cdr.detectChanges();
   }

   public createQuiz(): void {
      if (!this.quizForm.valid) {
         return;
      }

      this.submitted = true;
      const quiz = QuizFormsUtils.transformFormValue(this.quizForm.value);
      this.gameService.createQuiz(this.gameId, quiz);
   }

   private get questionsControls(): FormArray<QuizQuestionForm> {
      return this.quizForm.controls.questions;
   }

   private get gameId(): string {
      return this.route.snapshot.paramMap.get('gameId')!;
   }
}
