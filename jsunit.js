module.exports = {
    reporter: './reporters/DotReporter',
	bootstrap: 'bootstrap',
	vue: {
        require: () => {
            return require('vue');
        },
        referenceName: "Vue"
    },
	files: [
		"tests"
	]
}
