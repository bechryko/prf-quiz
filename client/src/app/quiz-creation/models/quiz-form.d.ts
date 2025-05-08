import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuizQuestionForm } from './quiz-question-form';

export type QuizForm = FormGroup<{
   name: FormControl<string | null>;
   description: FormControl<string | null>;
   questions: FormArray<QuizQuestionForm>;
}>;
