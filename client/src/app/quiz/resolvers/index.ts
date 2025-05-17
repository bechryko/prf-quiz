// @index("./*", (f, _) => `export { ${_.camelCase(f.path)} } from '${f.path}';`)
export { selectedGameResolver } from './selected-game.resolver';
export { selectedQuizResolver } from './selected-quiz.resolver';
//@endindex
