//@index('./*', (f, _) => `export { ${_.pascalCase(f.name.split('.')[0])} } from '${f.path}';`)
export { Game } from './game';
export { LeaderboardEntry } from './leaderboard-entry';
export { Quiz } from './quiz';
export { User } from './user';
//@endindex

