const prettier = require("prettier");
let cardinal = require('cardinal');

let code = `
<div><h1></h1></div>
`;

// console.log(cardinal.highlight('/</div>'));
// process.exit();

let html = `
<div><h1 class="foo" v-for="foo" style="color: red;">Foo/</h1>/</div>
`;

let formattedHtml = prettier.format(html);
console.log(formattedHtml);

process.exit();


formattedHtml = formattedHtml.substring(0, formattedHtml.length - 2);

formattedHtml = '/' + formattedHtml.split('\n').forEach(line => {
    // if (line.includes('/')) {
    //     line = '/' + line;
    // }

    console.log(cardinal.highlight(line));
});

let highlighted = cardinal.highlight(html);
