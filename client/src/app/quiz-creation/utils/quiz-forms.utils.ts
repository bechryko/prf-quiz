import { FormBuilder, Validators } from '@angular/forms';
import { Quiz } from '@prfq-shared/models';
import { QuizForm, QuizQuestionForm, QuizQuestionOptionForm } from '../models';

export class QuizFormsUtils {
   public static createQuizForm(fb: FormBuilder): QuizForm {
      return fb.group({
         name: ['', [Validators.required, Validators.minLength(1)]],
         description: [''],
         questions: fb.array<QuizQuestionForm>([])
      });
   }

   public static createQuestionForm(fb: FormBuilder): QuizQuestionForm {
      return fb.group({
         title: ['', [Validators.required, Validators.minLength(1)]],
         question: ['', [Validators.required, Validators.minLength(1)]],
         options: fb.array<QuizQuestionOptionForm>([]),
         scoreValue: [1]
      });
   }

   public static transformFormValue(
      formValue: Partial<{
         name: string | null;
         description: string | null;
         questions: Partial<{
            title: string | null;
            question: string | null;
            options: Partial<{
               text: string | null;
               isCorrect: boolean | null;
            }>[];
            scoreValue: number | null;
         }>[];
      }>
   ): Quiz {
      return {
         name: formValue.name ?? '',
         description: formValue.description ?? '',
         questions: (formValue.questions ?? []).map(questionValue => ({
            title: questionValue.title ?? '',
            question: questionValue.question ?? '',
            options: (questionValue.options ?? []).map(optionValue => ({
               text: optionValue.text ?? '',
               isCorrect: Boolean(optionValue.isCorrect)
            })),
            scoreValue: questionValue.scoreValue ?? 1
         })),
         leaderboard: []
      };
   }
}
