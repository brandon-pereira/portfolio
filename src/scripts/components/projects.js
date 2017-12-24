import Base from './base';
import throttle from 'lodash.throttle';

export default class Projects extends Base {

    init() {
        this.container = this.el.querySelector('.projects');
        this.currentlyVisibleProjects = this.container.children.length;
        this.loadMore = this.el.querySelector('.loadMore');
        this.skeleton = this.el.querySelector('.project.skeleton');
        this.salvattore = import('salvattore'); // TODO: Salvattore auto-initializes when loaded, we should use a different module.
        this._projects = null // Projects cache
        return super.init();
    }

    events() {
        this.loadMore.addEventListener('click', this.onLoadMoreClick.bind(this));

        this.salvattore.then(salvattore =>
            window.addEventListener("resize", throttle(() => {
                salvattore.recreateColumns(this.container); // redraw the grid
            }, 1000))
        );
    }

    onLoadMoreClick() {
        this.loadMore.classList.add("loading");
        this.showMoreProjects().then(() =>
            setTimeout(() => this.loadMore.classList.remove("loading"), 500)
        );
    }

    showMoreProjects() {
        return Promise.all([this.fetchProjects(), this.salvattore])
            .then(([projects, salvattore]) => {
                const toAdd = projects.projects.slice(this.currentlyVisibleProjects, this.currentlyVisibleProjects + 3);
                this.currentlyVisibleProjects += 3;
                if(this.currentlyVisibleProjects >= projects.projects.length) {
                    console.log("the end");
                    this.loadMore.classList.add('hidden');
                } else {
                    this.loadMore.classList.remove('hidden');
                }
                return [toAdd, salvattore];
            })
            .then(([toAdd, salvattore]) => {
                return [toAdd.map((project) => this.createProjectNode(project)), salvattore];
            })
            .then(([els, salvattore]) => this.addElementsToGrid(salvattore, this.container, els))
            // .then((projects) => this.addElementsToGrid())
    }

    createProjectNode(project) {
        const $project = this.skeleton.cloneNode(true);
        $project.classList.remove('hidden', 'skeleton');
        $project.querySelector('[data-project-title]').innerText = project.title;
        $project.querySelector('[data-project-description]').innerHTML = project.shortDescription || project.description;
        if(project.images && project.images.length) {
            $project.querySelector("img").src = project.images[0].src;
        }
        return $project;
    }

    addElementsToGrid(salvattore, grid, elements) {
        salvattore.appendElements(grid, elements);
    }

    fetchProjects() {
        if(this._projects) {
            return Promise.resolve(this._projects);
        } else {
            return import('../../content/projects.json')
                .then((projects) => {
                    this._projects = projects;
                    return this._projects;
                })
        }
    }



}