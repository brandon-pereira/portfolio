export default class Base {

    constructor(el, props = {}) {
        this.el = el;
        this.props = props;
        this.init()
            .then(() => this.setLoading(false))
            .catch((err) => console.error(err));
    }

    setLoading(bool) {
        if (this.el.querySelector(".init") && this.el.querySelector(".loading")) {
            this.el.querySelector(".init").classList.toggle("true", !bool);
            this.el.querySelector(".loading").classList.toggle("loaded", !bool);
        }
    }

    init() {
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
