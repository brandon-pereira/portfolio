// import salvattore from 'salvattore';
import Base from './base';

export default class Projects extends Base {

    init() {
        this.projectsContainer = this.el.querySelector(".projects-container");
        this.projects = this.projectsContainer.querySelectorAll('.project-item');
        // console.log(salvattore);;
        // this.salvatotore = salvattore();

        return Promise.resolve();
    }

    mount() {
        console.log("Mounting");
        salvattore.appendElements(this.projectsContainer, Array.from(this.projects));

    }



}