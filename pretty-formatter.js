const prettyFormat = require('pretty-format');
const ReactElement = prettyFormat.plugins.ReactElement;
const ReactTestComponent = prettyFormat.plugins.ReactTestComponent;

const React = require('react');
const renderer = require('react-test-renderer');

const onClick = () => {
    return null;
};
const element = React.createElement('button', {onClick}, 'Hello World');

const formatted1 = prettyFormat(element, {
  plugins: [ReactElement],
  printFunctionName: false,
  indent: 4,
  highlight: true,
  theme: {
      comment: 'gray',
      content: 'reset',
      prop: 'yellow',
      tag: 'cyan',
      value: 'green',
  }
});
const formatted2 = prettyFormat(renderer.create(element).toJSON(), {
  plugins: [ReactTestComponent],
  printFunctionName: false,
  indent: 4,
  highlight: true,
  theme: {
      comment: 'gray',
      content: 'reset',
      prop: 'yellow',
      tag: 'cyan',
      value: 'green',
  }
});

console.log(formatted1);
console.log(formatted2);

console.log(prettyFormat([1, 2, 3], {
    plugins: [ReactElement],
    printFunctionName: false,
    indent: 4,
    highlight: true,
    theme: {
        comment: 'gray',
        content: 'reset',
        prop: 'yellow',
        tag: 'cyan',
        value: 'green',
    }
}));
