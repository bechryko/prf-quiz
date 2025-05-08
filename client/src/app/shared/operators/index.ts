// @index("./*", (f, _) => `export { ${_.camelCase(f.path)} } from "${f.path}";`)
export { multicast } from "./multicast";
//@endindex
