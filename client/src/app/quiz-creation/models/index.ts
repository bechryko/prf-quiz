//@index('./*', (f, _) => `export { ${_.pascalCase(f.name.split('.')[0])} } from '${f.path}';`)
export { QuizForm } from './quiz-form.d';
export { QuizQuestionForm } from './quiz-question-form.d';
export { QuizQuestionOptionForm } from './quiz-question-option-form.d';
//@endindex
