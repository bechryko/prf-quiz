import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Game, Quiz, QuizQuestion } from '@prfq-shared/models';
import { GameService, RouterService } from '@prfq-shared/services';
import { QuizQuestionComponent } from './quiz-question/quiz-question.component';

@Component({
   selector: 'prfq-quiz',
   imports: [QuizQuestionComponent, MatButtonModule],
   templateUrl: './quiz.component.html',
   styleUrl: './quiz.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent {
   private readonly routerService = inject(RouterService);
   private readonly gameService = inject(GameService);

   public readonly selectedQuiz = input.required<Quiz>();
   public readonly selectedGame = input.required<Game>();

   public started = false;
   public currentQuestionIndex = 0;
   private score = 0;

   public startQuiz(): void {
      this.started = true;
   }

   public nextQuestion(): void {
      this.currentQuestionIndex++;
   }

   public onQuestionAnswered(isCorrect: boolean): void {
      if (isCorrect) {
         this.score += this.currentQuestion.scoreValue;
      }

      if (this.currentQuestionIndex === this.selectedQuiz().questions.length - 1) {
         this.onQuizCompleted();
      } else {
         this.nextQuestion();
      }
   }

   public onQuizCompleted(): void {
      const quizIndex = this.selectedGame().quizzes.indexOf(this.selectedQuiz());
      if (quizIndex === -1) {
         throw new Error('Quiz not found!');
      }

      this.gameService.saveQuizScore(this.selectedGame().id, quizIndex, this.score);
      this.exit();
   }

   public exit(): void {
      this.routerService.openGameOverview(this.selectedGame().id);
   }

   private get currentQuestion(): QuizQuestion {
      return this.selectedQuiz().questions[this.currentQuestionIndex];
   }
}
