export default class Base {

    constructor(el, props = {}) {
        this.el = el;
        this.props = props;
        this.init()
            .then(() => this.mount())
            .catch((err) => console.error(err));
    }

    init() {
        this.events();
        return Promise.resolve();
    }

    mount() {
        return Promise.resolve();
    }

    events() {

    }

    // onFocus() {
    //     console.log("onFocus");
    // }

    // onBlur() {
    //     console.log("onBlur");
    // }


}
