// @index("./*", (f, _) => `export { ${_.pascalCase(f.path)} } from '${f.path}';`)
export { GameUtils } from './game.utils';
export { HttpRequestUtils } from './http-request.utils';
//@endindex
