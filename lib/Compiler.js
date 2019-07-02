const path = require('path');
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;
const ejs = require('ejs');

class Compiler {

  constructor (config) {
    this.config = config;
    // 入口主模块完整的绝对路径
    this.entryId = '';
    // 入口文件路径
    this.entry = config.entry;
    // 当前工作目录
    this.root = process.cwd();
    // 所有的模块依赖
    this.modules = {};
    this.assets = {};
  }

  run () {
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.emitFile();
  }

  buildModule (modulePath, isEntry) {
    const source = fs.readFileSync(modulePath, 'utf8');
    const moduleName = './' + path.relative(this.root, modulePath);

    if (isEntry) {
      this.entryId = moduleName;
    }

    const {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName));
    this.modules[moduleName] = sourceCode;
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false);
    });
  }

  parse (source, parentPath) {
    const ast = babylon.parse(source);
    const dependencies = [];

    // https://astexplorer.net/
    traverse(ast, {
      CallExpression (p) {
        const node = p.node;
        if (node.callee.name === 'require') {
          node.callee.name = '__zympack_require__';
          let moduleName = node.arguments[0].value;
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js');
          moduleName = './' + path.join(parentPath, moduleName);
          dependencies.push(moduleName);
          node.arguments = [types.stringLiteral(moduleName)];
        }
      }
    });

    const sourceCode = generator(ast).code;
    return {sourceCode, dependencies};
  }

  emitFile () {
    const output = this.config.output;
    const outputPath = path.join(output.path, output.filename);
    const templateStr = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8');
    const { entryId, modules } = this;
    const code = ejs.render(templateStr, { entryId, modules });
    this.assets[outputPath] = code;
    fs.writeFileSync(outputPath, code);
  }

}

module.exports = Compiler;