var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var fs = require('fs');
const highlight = require('cli-highlight').highlight;

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

// Show the parsed data
let content = fs.readFileSync('example_markdown.md', 'utf8');
console.log(marked(content));

console.log(highlight(`
    <div>
        <h1 class="bar" style="color: red;">Foo</h1>
    </div>
    `, {language: 'html', ignoreIllegals: true}
));

console.log(highlight(`
    [1: 'a', 2: 'b', 3: 'c']
    `, {language: 'js', ignoreIllegals: true}
));
