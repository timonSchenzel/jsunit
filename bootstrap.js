Vue.component('hello-world', {
    template: `<div>{{ text }}</div>`,

    data() {
        return {
            text: 'Hello World',
        }
    },

    methods: {
        changeText(text) {
            this.text = text;
        },
    }
});
