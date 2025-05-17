import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
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
   private readonly snackbar = inject(MatSnackBar);

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
      this.gameService.saveQuizScore(this.selectedQuiz().id, this.score).subscribe(() => {
         this.snackbar.open(
            `Congratulations for completing the quiz ${this.selectedQuiz().name}! Your score was ${this.score} / ${this.maxScore}.`,
            this.score < this.maxScore ? 'Okay...' : 'Yay!',
            { duration: 3000 }
         );
         this.exit();
      });
   }

   public exit(): void {
      this.routerService.openGameOverview(this.selectedGame().id);
   }

   private get currentQuestion(): QuizQuestion {
      return this.selectedQuiz().questions[this.currentQuestionIndex];
   }

   private get maxScore(): number {
      return this.selectedQuiz().questions.reduce((score, question) => score + question.scoreValue, 0);
   }
}
