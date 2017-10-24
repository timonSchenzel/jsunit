Vue.component('hello-world', {
    template: `<div :class="color"><button @click="changeTextFromButton">Change text</button>{{ text }}</div>`,

    props: ['color'],

    data() {
        return {
            text: 'Hello World',
        }
    },

    methods: {
        changeText(text) {
            if (text == 'Bad text') {
                return;
            }

            this.text = text;
        },

        changeTextFromButton() {
            this.changeText('From button');
        }
    }
});
