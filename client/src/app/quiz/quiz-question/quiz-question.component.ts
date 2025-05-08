import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { QuizQuestion } from '@prfq-shared/models';

@Component({
   selector: 'prfq-quiz-question',
   imports: [],
   templateUrl: './quiz-question.component.html',
   styleUrl: './quiz-question.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizQuestionComponent {
   public readonly question = input.required<QuizQuestion>();
   public readonly questionNumber = input.required<number>();
   public readonly totalQuestions = input.required<number>();
   public readonly answered = output<boolean>();

   public answerQuestion(isCorrect?: boolean): void {
      this.answered.emit(Boolean(isCorrect));
   }
}
