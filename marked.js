const highlight = require('cli-highlight').highlight;
const prettier = require("prettier");
global.chalk = require("chalk");
const plain = (codePart) => codePart;
const reporter = new (new require('./src/reporters/Reporter'));
// var marked = require('marked');
// var TerminalRenderer = require('marked-terminal');
// var fs = require('fs');
let theme = {
    /**
     * keyword in a regular Algol-style language
     */
    keyword: chalk.blue,

    /**
     * built-in or library object (constant, class, function)
     */
    built_in: chalk.cyan,

    /**
     * user-defined type in a language with first-class syntactically significant types, like
     * Haskell
     */
    type: chalk.cyan.dim,

    /**
     * special identifier for a built-in value ("true", "false", "null")
     */
    literal: chalk.blue,

    /**
     * number, including units and modifiers, if any.
     */
    number: chalk.green,

    /**
     * literal regular expression
     */
    regexp: chalk.red,

    /**
     * literal string, character
     */
    string: chalk.greenBright,

    /**
     * parsed section inside a literal string
     */
    subst: plain,

    /**
     * symbolic constant, interned string, goto label
     */
    symbol: plain,

    /**
     * class or class-level declaration (interfaces, traits, modules, etc)
     */
    class: chalk.blue,

    /**
     * function or method declaration
     */
    function: chalk.yellow,

    /**
     * name of a class or a function at the place of declaration
     */
    title: plain,

    /**
     * block of function arguments (parameters) at the place of declaration
     */
    params: plain,

    /**
     * comment
     */
    comment: chalk.green,

    /**
     * documentation markup within comments
     */
    doctag: chalk.green,

    /**
     * flags, modifiers, annotations, processing instructions, preprocessor directive, etc
     */
    meta: chalk.grey,

    /**
     * keyword or built-in within meta construct
     */
    'meta-keyword': plain,

    /**
     * string within meta construct
     */
    'meta-string': plain,

    /**
     * heading of a section in a config file, heading in text markup
     */
    section: plain,

    /**
     * XML/HTML tag
     */
    tag: chalk.green,

    /**
     * name of an XML tag, the first word in an s-expression
     */
    name: chalk.green,

    /**
     * s-expression name from the language standard library
     */
    'builtin-name': plain,

    /**
     * name of an attribute with no language defined semantics (keys in JSON, setting names in
     * .ini), also sub-attribute within another highlighted object, like XML tag
     */
    attr: chalk.yellow,

    /**
     * name of an attribute followed by a structured value part, like CSS properties
     */
    attribute: plain,

    /**
     * variable in a config or a template file, environment var expansion in a script
     */
    variable: plain,

    /**
     * list item bullet in text markup
     */
    bullet: plain,

    /**
     * code block in text markup
     */
    code: plain,

    /**
     * emphasis in text markup
     */
    emphasis: chalk.italic,

    /**
     * strong emphasis in text markup
     */
    strong: chalk.bold,

    /**
     * mathematical formula in text markup
     */
    formula: plain,

    /**
     * hyperlink in text markup
     */
    link: chalk.underline,

    /**
     * quotation in text markup
     */
    quote: plain,

    /**
     * tag selector in CSS
     */
    'selector-tag': plain,

    /**
     * #id selector in CSS
     */
    'selector-id': plain,

    /**
     * .class selector in CSS
     */
    'selector-class': plain,

    /**
     * [attr] selector in CSS
     */
    'selector-attr': plain,

    /**
     * :pseudo selector in CSS
     */
    'selector-pseudo': plain,

    /**
     * tag of a template language
     */
    'template-tag': plain,

    /**
     * variable in a template language
     */
    'template-variable': plain,

    /**
     * added or changed line in a diff
     */
    addition: chalk.green,

    /**
     * deleted line in a diff
     */
    deletion: chalk.red,
};

// marked.setOptions({
//   // Define custom renderer
//   renderer: new TerminalRenderer()
// });

// // Show the parsed data
// let content = fs.readFileSync('example_markdown.md', 'utf8');
// console.log(marked(content));

let html = `<div><h1 class="foo" v-for="foo in foos" style="color: red;">Foo</h1></div>`;

let formattedHtml = prettier.format(html);
formattedHtml = formattedHtml.substring(0, formattedHtml.length - 2);

let actualHtml = highlight(formattedHtml, {language: 'html', ignoreIllegals: true, theme});

let html2 = `<div><h1 class="foo" v-for="foo in foos" style="color: red;">Bar</h1></div>`;

let formattedHtml2 = prettier.format(html2);
formattedHtml2 = formattedHtml2.substring(0, formattedHtml2.length - 2);

let expectedHtml = highlight(formattedHtml2, {language: 'html', ignoreIllegals: true, theme});

console.log(actualHtml);
console.log(expectedHtml);

console.log(reporter.visualDifference(actualHtml, expectedHtml));

// console.log(highlight(`
//     [1: 'a', 2: 'b', 3: 'c']
//     `, {language: 'js', ignoreIllegals: true}
// ));
