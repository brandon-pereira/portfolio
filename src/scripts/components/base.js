export default class Base {

    constructor(el, props ={}, opts = {}, defaultOpts = {}) {
        this.el = el;
        this.props = props;
        this.opts = Object.assign({}, opts, defaultOpts);
        this.init()
            .then(() => this.mount())
            .catch((err) => console.error(err));
    }

    init() {
        return Promise.resolve();
    }

    mount() {
        return Promise.resolve();
    }

    onFocus() {
        console.log("onFocus");
    }

    onBlur() {
        console.log("onBlur");
    }


}
