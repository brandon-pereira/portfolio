export default class Base {

    constructor(el, props = {}) {
        this.el = el;
        this.props = props;
        this.init()
            .then(() => this.mount())
            .catch((err) => console.error(err));
    }

    init() {
        return Promise.resolve();
    }

    mount() {
        this.events();
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
