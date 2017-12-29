import Base from './base';
import throttle from '../lib/throttle';

export default class Projects extends Base {

    init() {
        this.container = this.el.querySelector('.projects');
        this.loadMore = this.el.querySelector('.loadMore');
        this.backButton = this.el.querySelector('[data-back-button]');
        this.skeleton = this.el.querySelector('.project.snippet.skeleton');
        this.detailed = this.el.querySelector('.project.detailed-view');
        this.numVisibleProjects = this.container.children.length;
        this.salvattore = import('salvattore'); // TODO: Salvattore auto-initializes when loaded, we should use a different module.
        return super.init();
    }

    events() {
        this.loadMore.addEventListener('click', this.onLoadMoreClick.bind(this));
        this.backButton.addEventListener('click', () => this._toggleDetailsView(false))
        this.salvattore.then(salvattore =>
            window.addEventListener("resize", throttle(() => {
                salvattore.recreateColumns(this.container); // redraw the grid
            }, 500))
        );
        this.el.querySelectorAll('[data-learn-more]').forEach(el => el.addEventListener('click', () => {
            this.onMoreDetailsClick(el.getAttribute('data-learn-more'))
        }));

        this.onMoreDetailsClick(0);
    }

    onMoreDetailsClick(id) {
        this._toggleDetailsView(true);
        this.fetchProjects()
            .then((projects) => {
                // setTimeout(() => this.toggleDetailsView(false), 1000);
                const project = projects.projects[id];
               return this._getDetailsNode(project, projects.statuses);
            })

    }

    onLoadMoreClick() {
        this.loadMore.classList.add("loading");
        this.showMoreProjects().then(() =>
            setTimeout(() => this.loadMore.classList.remove("loading"), 500)
        );
    }

    // TODO: Refactor with async await
    showMoreProjects() {
        return Promise.all([this.fetchProjects(), this.salvattore])
            .then(([projects, salvattore]) => {
                const toAdd = projects.projects.slice(this.numVisibleProjects, this.numVisibleProjects + 3);
                this.numVisibleProjects += 3;
                if(this.numVisibleProjects >= projects.projects.length) {
                    this.loadMore.classList.add('hidden');
                } else {
                    this.loadMore.classList.remove('hidden');
                }
                return [toAdd, salvattore];
            })
            .then(([toAdd, salvattore]) => [toAdd.map((project) => this._createSnippetNode(project)), salvattore])
            .then(([els, salvattore]) => this.addElementsToGrid(salvattore, this.container, els))
    }

    _getDetailsNode(project, statuses) {
        // titte, description
        this.detailed.querySelector('[data-project-title]').innerText = project.title;
        this.detailed.querySelector('[data-project-description]').innerHTML = project.description;
        // status
        const status = statuses[project.status];
        const $status = this.detailed.querySelector('[data-project-status]');
        $status.setAttribute('class', status.class);
        $status.innerText = status.title;
        // assets
        const $images = this.detailed.querySelector('[data-project-images]');
        $images.innerHTML = ''; // clear
        project.images.forEach((asset) => {
            const type = asset.type || 'img';
            const config = {
                src: asset.src,
                autoplay: true,
                muted: true,
                class: asset.styling
            };
            const $asset = document.createElement(type);
            Object.keys(config).forEach((key) => $asset.setAttribute(key, config[key]));
            this.detailed.querySelector('[data-project-images]').appendChild($asset);
        });
        // Date
        this.detailed.querySelector('[data-project-date]').innerText = new Date(project.date).toString()
        // TODO: languages
        // const $langs = this.detailed.querySelector('[data-project-languages]');
        // $langs.innerHTML = '';
        // project.languages.forEach((lang) => {
        //     const $lang = document.createElement('span')
        //     $lang.innerText = lang;
        //     $langs.appendChild($lang)
        // });


    }

    _getSnippetNode(project) {
        const $project = this.skeleton.cloneNode(true);
        $project.classList.remove('skeleton');
        $project.querySelector('[data-project-title]').innerText = project.title;
        $project.querySelector('[data-project-description]').innerHTML = project.shortDescription || project.description;
        if(project.images && project.images.length) {
            $project.querySelector("img").src = project.images[0].src;
        }
        return $project;
    }

    _toggleDetailsView(isShow) {
        this.detailed.classList.toggle("hidden", !isShow);
        setTimeout(() => this.loadMore.classList.toggle('hidden', isShow), isShow ? 0 : 500); // TODO: this should be a callabck
        this.detailed.animate([
            { left: "100%", opacity: 0, height: 0 },
            { left: 0, opacity: 1, height: "auto" }
        ], { duration: 500, fill: "both", direction: isShow ? 'normal' : 'reverse' });
        this.container.animate([
            { left: 0, height: "auto", opacity: 1 },
            { left: "-100%", height: 0, opacity: 0 }
        ], { duration: 500, fill: "both", direction: isShow ? "normal" : "reverse" });
    }

    /**
     * Function to add elements to the projects grid
     */
    addElementsToGrid(salvattore, grid, elements) {
        salvattore.appendElements(grid, elements);
        requestAnimationFrame(() => elements.forEach((el) => el.classList.remove('hidden')));
    }

    /**
     * Function to fetch projects bundle
     * @return Promise
     */
    fetchProjects() {
        return import('../../content/projects.json')
    }



}