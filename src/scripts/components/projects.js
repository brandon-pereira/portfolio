import Base from './base';
import throttle from '../lib/throttle';
import animate from '../lib/animate';
import Masonry from '../lib/masonry';

export default class Projects extends Base {

    init() {
        this.$projects = this.el.querySelector('.projects');
        this.$loadMore = this.el.querySelector('.loadMore');
        this.$backButton = this.el.querySelector('[data-back-button]');
        this.$snippet = this.el.querySelector('.project.snippet.skeleton');
        this.$detailed = this.el.querySelector('.project.detailed-view');
        this.$filters = this.el.querySelector('[data-filters]');

        this.masonry = new Masonry(this.$projects, Array.from(this.$projects.children));
        return super.init(import('../../styles/projects.scss'))
            .then(() => {
                this.masonry.recreateColumns(); // Recreate once css loaded
            });
    }

    events() {
        this.$loadMore.addEventListener('click', this.onLoadMoreClick.bind(this));
        this.$backButton.addEventListener('click', () => this._toggleDetailsView(false))
        window.addEventListener("resize", throttle(() => this.masonry.recreateColumns(), 500));
        this.el.querySelectorAll('[data-project-learn-more]').forEach(el => el.addEventListener('click', () => {
            this.showMoreDetails(el.getAttribute('data-project-learn-more'))
        }));
        this.el.addEventListener('goToLang', (e) => this.deeplink(e.detail));
        this.$filters.addEventListener('click', () => this.deeplink(null))
    }

    /**
     * Function to show details on a project (specified by the ID).
     * @param {Number} id
     * @return {Promise}
     */
    showMoreDetails(id) {
        console.info("Projects: Show more details for", id);
        return this.fetchProjects()
            .then((projects) => {
                const project = projects.projects[id];
                this._getDetailsNode(project, projects.statuses);
                this._toggleDetailsView(true);
                this.logEvent('projects', 'read-more', project.title)
            })
    }

    /**
     * Handler for load more button click. Handles loading state and delegates.
     * @return {Promise}
     */
    onLoadMoreClick() {
        this.$loadMore.classList.add("loading");
        return this.showMoreProjects()
            .then(() => {
                this.$loadMore.classList.remove("loading");
                this.logEvent('projects', 'load-more', 'load-more');
            });
    }

    /**
     * Function to show more projects.
     * @return {Promise}
     */
    showMoreProjects() {
        return this.fetchProjects()
            .then(projects => {
                const toAdd = projects.projects.slice(this.numVisibleProjects, this.numVisibleProjects + 3);
                const elements = toAdd.map(project => this._getSnippetNode(project))
                this._addElementsToGrid(elements);
                this.$loadMore.classList.toggle('hidden', this.numVisibleProjects >= projects.projects.length);
            })
    }

    /**
     * Function to delegate out deeplink referrals
     * @param {String} language
     */
    deeplink(language) {
        this.$filters.querySelector('span').innerText = language || '';
        this.$filters.classList.toggle('visible', language);
        console.info("Projects: Filtering projects by", language);
        this._clearGrid()
        this.fetchProjects()
            .then(projects => {
                if(language) {
                    return projects.projects.filter(p => p.languages.includes(language));
                } else {
                    return projects.projects.slice(0, 6);
                }
            })
            .then(toAdd => {
                const elements = toAdd.map(project => this._getSnippetNode(project))
                this._addElementsToGrid(elements);
                this._toggleDetailsView(false);
                this.$loadMore.classList.toggle('hidden', language);
                this.scroll.then(s => s.scrollTo(this.el));
                this.logEvent('projects', 'filter', language)
            })
    }

    /**
     * Function to fetch projects bundle
     * @return Promise
     */
    fetchProjects() {
        return import ('../../content/projects.json')
            .then(projects => {
                projects.projects = projects.projects.map((project, index) => {
                    project.index = index;
                    return project;
                })
                return projects;
            });
    }

    /**
     * Function to show/hide details view
     * TODO: Refactor to not use .animate since browser support sucks
     * @param {Boolean} isShow
     */
    _toggleDetailsView(isShow) {
        this.scroll.then((s) => s.scrollTo(this.el));
        this.$loadMore.classList.toggle('hidden', isShow);
        animate(this.$detailed, [
            { left: "100%", opacity: 0},
            { left: 0, opacity: 1}
        ], { duration: 200, fill: "both", direction: isShow ? 'normal' : 'reverse' });
       animate(this.$projects, [
            { left: 0, opacity: 1 },
            { left: "-100%", opacity: 0 }
        ], { duration: 200, fill: "both", direction: isShow ? "normal" : "reverse" }, () => {
               this.$detailed.classList.toggle('hidden', !isShow);
               this.$projects.classList.toggle('hidden', isShow);
        })
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
     * @param {Element} grid
     * @param {Array} elements
     * @return {Promise}
     */
    _addElementsToGrid(elements) {
        this.masonry.appendElements(elements);
        requestAnimationFrame(() => elements.forEach((el) => el.classList.remove('hidden')));
    }

    /**
     * Function to remove all elements from grid.
     * @param {Element} grid
     * @return {Promise}
     */
    _clearGrid() {
        this.masonry.items = [];
    }

    /**
     * Function to build a snippet node from a project
     * @param {Object} project
     * @param {Statuses} statuses
     * @return {Element}
     */
    _getDetailsNode(project, statuses) {
        console.log("Set details for project", project);
        const $node = this.$detailed;
        // titte, description
        $node.querySelector('[data-project-title]').innerText = project.title;
        if (project.link) {
            $node.querySelector('[data-project-link]').href = project.link;
        } else {
            $node.querySelector('[data-project-title]').removeAttribute('href');
        }
        $node.querySelector('[data-project-description]').innerHTML = project.description;
        // status
        const status = statuses[project.status];
        const $status = $node.querySelector('[data-project-status]');
        $status.setAttribute('class', status.class);
        $status.innerText = status.title;
        // assets
        const $images = $node.querySelector('[data-project-images]');
        $images.innerHTML = ''; // clear
        if (Array.isArray(project.images)) {
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
                $asset.addEventListener('click', () => this.lightbox.then((l) => {
                    l.set(asset);
                    l.open();
                }))
                $node.querySelector('[data-project-images]').appendChild($asset);
            });
        }
        // Date
        $node.querySelector('[data-project-date]').innerText = this._getFormatedDate(new Date(project.date));
        // languages
        const $langs = $node.querySelector('[data-project-languages]');
        $langs.innerHTML = '';
        project.languages.forEach((lang) => {
            const $lang = document.createElement('span');
            $lang.addEventListener('click', () => document.querySelector('#skills').dispatchEvent(new CustomEvent('goToSkill', {
                detail: lang
            })));
            $lang.innerText = lang;
            $langs.appendChild($lang)
        });
        return $node;
    }

    /**
     * Function to build a snippet node from a project
     * @param {Object} project
     * @return {Element}
     */
    _getSnippetNode(project) {
        const $project = this.$snippet.cloneNode(true);
        $project.classList.remove('skeleton');
        $project.querySelector('[data-project-title]').innerText = project.title;
        if (project.link) {
            $project.querySelector('[data-project-link]').href = project.link;
        } else {
            $project.querySelector('[data-project-title]').removeAttribute('href');
        }
        $project.querySelector('[data-project-description]').innerHTML = project.shortDescription || project.description;
        $project.querySelector('[data-project-learn-more]').addEventListener('click', () => this.showMoreDetails(project.index));
        if (project.images && project.images.length) {
            $project.querySelector("img").src = project.images[0].src;
        }
        return $project;
    }

    get numVisibleProjects() {
        return this.masonry.items.length;
    }
}