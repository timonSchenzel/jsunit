module.exports = class VueComponentTestCase extends TestCase
{
    render(template)
    {
        return new Proxy(VueComponentTester.test(
            this,
            template
        ), {
            get(target, property, receiver)
            {
                if (property == 'page') {
                    return target.vm;
                }

                if (typeof target[property] == 'function') {
                    return function(...args) {
                       return target[property](...args);
                    };
                }

                if (target[property] !== undefined) {
                    return target[property];
                }

                if (typeof target.vm[property] == 'function') {
                    return function(...args) {
                        return target.vm[property](...args);
                    };
                }

                if (target.vm[property] !== undefined) {
                    return target.vm[property];
                }
            },
        });
    }
}
