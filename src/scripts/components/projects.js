import Base from './base';
import throttle from '../lib/throttle';

export default class Projects extends Base {

    init() {
        this.$projects = this.el.querySelector('.projects');
        this.$loadMore = this.el.querySelector('.loadMore');
        this.$backButton = this.el.querySelector('[data-back-button]');
        this.$snippet = this.el.querySelector('.project.snippet.skeleton');
        this.$detailed = this.el.querySelector('.project.detailed-view');
        this.numVisibleProjects = this.$projects.children.length;
        this.lightbox = import('./lightbox');
        this.salvattore = import('salvattore'); // TODO: Salvattore auto-initializes when loaded, we should use a different module.
        return super.init();
    }

    events() {
        this.$loadMore.addEventListener('click', this.onLoadMoreClick.bind(this));
        this.$backButton.addEventListener('click', () => this._toggleDetailsView(false))
        this.salvattore.then(salvattore =>
            window.addEventListener("resize", throttle(() => {
                salvattore.recreateColumns(this.$projects); // redraw the grid
            }, 500))
        );
        this.el.querySelectorAll('[data-project-learn-more]').forEach(el => el.addEventListener('click', () => {
            this.showMoreDetails(el.getAttribute('data-project-learn-more'))
        }));

    }

    /**
     * Function to show details on a project (specified by the ID).
     * @param {Number} id
     */
    showMoreDetails(id) {
        console.log("Projects: Show more details for", id);
        this.fetchProjects()
            .then((projects) => {
                // setTimeout(() => this.toggleDetailsView(false), 1000);
                const project = projects.projects[id];
                this.lightbox.then((l) => {
                    console.log(l);
                    l.open()
                });
                this._getDetailsNode(project, projects.statuses);
                this._toggleDetailsView(true);
            })

    }

    onLoadMoreClick() {
        this.$loadMore.classList.add("loading");
        this.showMoreProjects().then(() =>
            setTimeout(() => this.$loadMore.classList.remove("loading"), 500)
        );
    }

    // TODO: Refactor with async await
    showMoreProjects() {
        return Promise.all([this.fetchProjects(), this.salvattore])
            .then(([projects, salvattore]) => {
                const toAdd = projects.projects.slice(this.numVisibleProjects, this.numVisibleProjects + 3);
                this.numVisibleProjects += 3;
                this.$loadMore.classList.toggle('hidden', this.numVisibleProjects >= projects.projects.length);
                return [toAdd, salvattore];
            })
            .then(([toAdd, salvattore]) => [toAdd.map((project) => this._getSnippetNode(project)), salvattore])
            .then(([els, salvattore]) => this._addElementsToGrid(salvattore, this.$projects, els))
    }

    /**
     * Function to build a snippet node from a project
     * @param {Object} project
     * @param {Statuses} statuses
     * @return {Element}
     */
    _getDetailsNode(project, statuses) {
        const $node = this.$detailed;
        // titte, description
        $node.querySelector('[data-project-title]').innerText = project.title;
        $node.querySelector('[data-project-description]').innerHTML = project.description;
        // status
        const status = statuses[project.status];
        const $status = $node.querySelector('[data-project-status]');
        $status.setAttribute('class', status.class);
        $status.innerText = status.title;
        // assets
        const $images = $node.querySelector('[data-project-images]');
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
            $node.querySelector('[data-project-images]').appendChild($asset);
        });
        // Date
        $node.querySelector('[data-project-date]').innerText = this._getFormatedDate(new Date(project.date));
        // TODO: languages
        // const $langs = this.detailed.querySelector('[data-project-languages]');
        // $langs.innerHTML = '';
        // project.languages.forEach((lang) => {
        //     const $lang = document.createElement('span')
        //     $lang.innerText = lang;
        //     $langs.appendChild($lang)
        // });
        return $node;
    }

    /**
     * Function to build a snippet node from a project
     * @param {Object} project
     * @return {Element}
     */
    _getSnippetNode(project, index) {
        const $project = this.$snippet.cloneNode(true);
        $project.classList.remove('skeleton');
        $project.querySelector('[data-project-title]').innerText = project.title;
        $project.querySelector('[data-project-description]').innerHTML = project.shortDescription || project.description;
        $project.querySelector('[data-project-learn-more]').addEventListener('click', () => {
            this.showMoreDetails(index);
        })
        if(project.images && project.images.length) {
            $project.querySelector("img").src = project.images[0].src;
        }
        return $project;
    }

    /**
     * Function to show/hide details view
     * @param {Boolean} isShow
     */
    _toggleDetailsView(isShow) {
        this.$loadMore.classList.add('hidden');
        this.$detailed.animate([
            { left: "100%", opacity: 0},
            { left: 0, opacity: 1}
        ], { duration: 200, fill: "both", direction: isShow ? 'normal' : 'reverse' });
       this.$projects.animate([
            { left: 0, opacity: 1 },
           { left: "-100%", opacity: 0 }
        ], { duration: 200, fill: "both", direction: isShow ? "normal" : "reverse" })
        .onfinish = () => {
            this.$detailed.classList.toggle('hidden');
            this.$projects.classList.toggle('hidden');
            if(!isShow) {
                this.$loadMore.classList.remove('hidden');
            }
        }
    }

    /**
     * Function to format a date into format Weekday, Month Day, Year
     * @param {Date} date Date to format
     * @return {String} Formatted string
     */
    _getFormatedDate(date) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate(0) + ', ' + date.getFullYear();
    }

    /**
     * Function to add elements to the projects grid
     * @param salvatorre
     * @param {Element} grid
     * @param {Array} elements
     */
    _addElementsToGrid(salvattore, grid, elements) {
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