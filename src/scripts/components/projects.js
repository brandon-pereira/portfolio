import Base from './base';

export default class Projects extends Base {

    init() {
        this.container = this.el.querySelector(".projects");
        this.loadMore = this.el.querySelector('.loadMore');
        this.salvattore = import('salvattore');
        return super.init();
    }

    events() {
        this.salvattore.then(salvattore => {
            this.loadMore.addEventListener("click", () => {
                this.loadMore.classList.add("loading");
                const newEl = document.createElement("div");
                salvattore.appendElements(this.container, newEl);
                console.log(newEl);
                this.loadMore.classList.remove("loading");
            });

              window.addEventListener("resize", () => {
                this.salvattore.then(salvattore => {
                  salvattore.recreateColumns(this.container);
                });
              });
        });
    }



}