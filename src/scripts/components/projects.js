import Base from './base';

export default class Projects extends Base {

    init() {
        this.projectsContainer = this.el.querySelector(".projects");
        this.projects = this.projectsContainer.querySelectorAll('.project');
        this.loadMore = this.el.querySelector('.loadMore');
        return super.init();
    }

    mount() {

    }

    events() {
        this.loadMore.addEventListener('click', () => {
            this.loadMore.classList.toggle('loading');
        });
    }



}