import { FormGroup } from '@angular/forms';

export type QuizQuestionOptionForm = FormGroup<{
   text: FormControl<string | null>;
   isCorrect: FormControl<boolean | null>;
}>;
