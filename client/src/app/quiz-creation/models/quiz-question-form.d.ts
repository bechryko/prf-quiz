import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuizQuestionOptionForm } from './quiz-question-option-form';

export type QuizQuestionForm = FormGroup<{
   title: FormControl<string | null>;
   question: FormControl<string | null>;
   options: FormArray<QuizQuestionOptionForm>;
   scoreValue: FormControl<number | null>;
}>;
