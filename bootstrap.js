Vue.component('tester', {
    template: `<slot></slot>`,
});

Vue.component('hello-world', {
    template: `<div :class="color">{{ text }}</div>`,

    props: ['color'],

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
