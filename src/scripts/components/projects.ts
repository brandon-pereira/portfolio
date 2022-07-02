import Base from './base';
import throttle from '../lib/throttle';
import animate from '../lib/animate';
import Masonry from '../lib/masonry';
import formatDate from '../lib/formatDate';
import { Project } from '../../../content/models/projects';
import Lightbox from '../services/lightbox';

export type DeeplinkPayload = {
  id: string;
  title: string;
};
export type ProjectEvent = CustomEvent<DeeplinkPayload>;

class Projects extends Base {
  $projects: HTMLElement;
  $loadMore: HTMLElement;
  $backButton: HTMLElement;
  $snippet: HTMLElement;
  $detailed: HTMLElement;
  $filters: HTMLElement;
  masonry: Masonry;
  lightbox: typeof Lightbox;

  static numProjectsToAdd = 2;

  static defaultNumProjects = 4;

  async init(): Promise<void> {
    this.$projects = this.el.querySelector('.projects');
    this.$loadMore = this.el.querySelector('.loadMore');
    this.$backButton = this.el.querySelector('[data-back-button]');
    this.$snippet = this.el.querySelector('.project.snippet.skeleton');
    this.$detailed = this.el.querySelector('.project.detailed-view');
    this.$filters = this.el.querySelector('[data-filters]');
    const projects = await this.fetchProjects();
    const toAdd = projects.slice(0, Projects.defaultNumProjects);
    const elements = toAdd.map(project => this._getSnippetNode(project));
    this.masonry = new Masonry({
      container: this.$projects,
      elements: [],
      sizes: [
        [0, 1],
        [600, 2] // medium breakpoint and up show 2 columns
      ]
    });
    this._addElementsToGrid(elements);
    this.el.querySelector('.plus-loader').classList.add('hidden');
    this.$projects.classList.remove('hidden');
    this.$loadMore.classList.toggle(
      'hidden',
      this.numVisibleProjects >= projects.length
    );
    return super.init();
  }

  events(): void {
    this.$loadMore.addEventListener('click', this.onLoadMoreClick.bind(this));
    this.$backButton.addEventListener('click', () =>
      this._toggleDetailsView(false)
    );
    window.addEventListener(
      'resize',
      throttle(() => this.masonry.recreateColumns(), 500)
    );
    this.el.addEventListener('goToLang', (e: ProjectEvent) =>
      this.deeplink(e.detail)
    );
    this.$filters.addEventListener('click', () => this.deeplink());
  }

  /**
   * Function to show details on a project (specified by the ID).
   * @param {Number} id
   * @return {Promise}
   */
  async showMoreDetails(id: string): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      console.info('Projects: Show more details for', id);
    }
    const project = await this.fetchProjects(id);
    this._getDetailsNode(project);
    this._toggleDetailsView(true);
    this.logEvent('projects', 'read-more', project.title);
  }

  /**
   * Handler for load more button click. Handles loading state and delegates.
   * @return {Promise}
   */
  async onLoadMoreClick(): Promise<void> {
    this.$loadMore.classList.add('loading');
    await this.showMoreProjects();
    this.$loadMore.classList.remove('loading');
    this.logEvent('projects', 'load-more', 'load-more');
  }

  /**
   * Function to show more projects.
   * @return {Promise}
   */
  async showMoreProjects(): Promise<void> {
    const projects = await this.fetchProjects();
    const toAdd = projects.slice(
      this.numVisibleProjects,
      this.numVisibleProjects + Projects.numProjectsToAdd
    );
    const elements = toAdd.map(project => this._getSnippetNode(project));
    this._addElementsToGrid(elements);
    this.$loadMore.classList.toggle(
      'hidden',
      this.numVisibleProjects >= projects.length
    );
  }

  /**
   * Function to delegate out deeplink referrals
   * @param {String} language
   */
  async deeplink({ id, title }: Partial<DeeplinkPayload> = {}): Promise<void> {
    this.$filters.querySelector('span').innerText = title || '';
    this.$filters.classList.toggle('visible', !!id);
    if (process.env.NODE_ENV !== 'production') {
      console.info('Projects: Filtering projects by', id, title);
    }
    this._clearGrid();
    let projects = await this.fetchProjects();
    if (id) {
      projects = projects.filter(p => p.languages.some(k => k._id === id));
    } else {
      projects = projects.slice(0, Projects.defaultNumProjects);
    }
    const elements = projects.map(project => this._getSnippetNode(project));
    this._addElementsToGrid(elements);
    this._toggleDetailsView(false);
    this.el.scrollIntoView();
    this.logEvent('projects', 'filter', title);
  }

  /**
   * Function to fetch projects bundle
   * @return Promise
   */
  async fetchProjects(): Promise<Project[]>;
  async fetchProjects(id?: string): Promise<Project>;
  async fetchProjects(id?: string): Promise<Project | Project[]> {
    const projects = (await import(
      '../../../content/data/projects.json'
    )) as Project[];
    const mappedProjects = projects.map((project, index) => {
      project.index = index;
      return project;
    });
    if (!id) {
      return mappedProjects;
    }
    return mappedProjects.find(project => project._id === id);
  }

  /**
   * Function to show/hide details view
   * @param {Boolean} isShow
   */
  _toggleDetailsView(isShow: boolean): void {
    this.el.scrollIntoView();
    this.$loadMore.classList.toggle(
      'hidden',
      isShow || this.$filters.classList.contains('visible')
    );
    animate(
      this.$detailed,
      [
        { left: '100%', opacity: 0 },
        { left: 0, opacity: 1 }
      ],
      { duration: 200, fill: 'both', direction: isShow ? 'normal' : 'reverse' }
    );
    animate(
      this.$projects,
      [
        { left: 0, opacity: 1 },
        { left: '-100%', opacity: 0 }
      ],
      { duration: 200, fill: 'both', direction: isShow ? 'normal' : 'reverse' },
      () => {
        this.$detailed.classList.toggle('hidden', !isShow);
        this.$projects.classList.toggle('hidden', isShow);
        this._setAccessibility(isShow);
      }
    );
  }

  _setAccessibility(isDetailsView: boolean): void {
    const enabledTabIndex = (bool: boolean) => (bool ? 0 : -1);
    this.$detailed.setAttribute('aria-hidden', `${!isDetailsView}`);
    this.$projects.setAttribute('aria-hidden', `${isDetailsView}`);
    this.$projects.querySelectorAll('button').forEach($button => {
      $button.tabIndex = enabledTabIndex(!isDetailsView);
    });
    this.$backButton.tabIndex = enabledTabIndex(isDetailsView);
    this.$loadMore.tabIndex = enabledTabIndex(!isDetailsView);
  }

  /**
   * Function to add elements to the projects grid
   * @param {Element} grid
   * @param {Array} elements
   * @return {Promise}
   */
  _addElementsToGrid(elements: HTMLElement[]): void {
    this.masonry.appendElements(elements);
    requestAnimationFrame(() =>
      elements.forEach(el => el.classList.remove('hidden'))
    );
  }

  /**
   * Function to remove all elements from grid.
   * @param {Element} grid
   * @return {Promise}
   */
  _clearGrid(): void {
    this.masonry.items = [];
  }

  /**
   * Function to build a snippet node from a project
   * @param {Object} project
   * @return {Element}
   */
  _getDetailsNode(project: Project): HTMLElement {
    if (process.env.NODE_ENV !== 'production') {
      console.info('Projects: Set details for project', project);
    }
    const $node = this.$detailed;
    // title, description
    ($node.querySelector('[data-project-title]') as HTMLElement).innerText =
      project.title;
    if (project.link) {
      ($node.querySelector('[data-project-link]') as HTMLLinkElement).href =
        project.link;
    } else {
      $node.querySelector('[data-project-title]').removeAttribute('href');
    }
    $node.querySelector('[data-project-description]').innerHTML =
      project.description;
    if (project.gitUrl) {
      $node.querySelector(
        '[data-project-description]'
      ).innerHTML += `<p><a href="${project.gitUrl}">View project on GitHub</a></p>`;
    }
    // status
    const status = project.status || 'Unavailable';
    const $status = $node.querySelector('[data-project-status]') as HTMLElement;
    $status.setAttribute('class', status.replace(' ', '').toLowerCase());
    $status.innerText = status;
    // assets
    const $images = $node.querySelector('[data-project-images]');
    $images.innerHTML = ''; // clear
    if (Array.isArray(project.images)) {
      project.images.forEach(asset => {
        const type = asset.contentType.startsWith('video') ? 'video' : 'img';
        const config = {
          src: asset.url,
          autoplay: true,
          muted: true,
          'data-lightbox': JSON.stringify(asset)
        } as const;
        const $asset = document.createElement(type);
        Object.keys(config).forEach((key: keyof typeof config) =>
          $asset.setAttribute(key, `${config[key]}`)
        );
        $node.querySelector('[data-project-images]').appendChild($asset);
      });
    }
    this.lightbox.findAndAttachListeners();

    // Date
    ($node.querySelector('[data-project-date]') as HTMLElement).innerText =
      formatDate(new Date(project.date));
    // languages
    const $langs = $node.querySelector('[data-project-languages]');
    $langs.innerHTML = '';
    if (Array.isArray(project.languages) && project.languages.length) {
      project.languages.forEach(lang => {
        const $lang = document.createElement('button');
        $lang.addEventListener('click', () =>
          document.querySelector('#skills').dispatchEvent(
            new CustomEvent('goToSkill', {
              detail: lang._id
            })
          )
        );
        $lang.innerText = lang.name;
        $langs.appendChild($lang);
      });
    }
    return $node;
  }

  /**
   * Function to build a snippet node from a project
   * @param {Object} project
   * @return {Element}
   */
  _getSnippetNode(project: Project): HTMLElement {
    const $project = this.$snippet.cloneNode(true) as HTMLElement;
    $project.classList.remove('skeleton');
    $project.querySelector('[data-project-title]').innerHTML = project.title;
    $project.querySelector('[data-project-title]').removeAttribute('href');
    $project.querySelector('[data-project-description]').innerHTML =
      project.shortDescription || project.description;
    $project.addEventListener('click', () => this.showMoreDetails(project._id));
    if (project.images && project.images.length) {
      const $img = $project.querySelector('img');
      $img.setAttribute('src', project.images[0].url);
      $img.setAttribute('alt', project.title);
    }
    return $project;
  }

  get numVisibleProjects(): number {
    return this.masonry.items.length;
  }
}
export default Projects;
