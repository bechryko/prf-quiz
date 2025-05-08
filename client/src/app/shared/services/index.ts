// @index("./*", (f, _) => `export { ${_.pascalCase(f.path)} } from '${f.path}';`)
export { AuthService } from './auth.service';
export { GameService } from './game.service';
export { RouterService } from './router.service';
//@endindex
