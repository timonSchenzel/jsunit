window.Vue = require('vue');

Vue.component('hello-world', {
    template: `
        <div :class="color">
            <h1 v-show="title">{{ title }}</h1>
            <button @click="changeTextFromButton">Change text</button>
            <input v-model="title">
            {{ text }}
        </div>`,

    props: ['color'],

    data() {
        return {
            text: 'Hello World',
            title: null,
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
