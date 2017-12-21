export default class App {

	constructor() {
		this.html = document.documentElement;
		this.body = document.body;

		// If its a webkit browser add 'webkit' class to HTML.
		if ('webkitTextFillColor' in this.html.style) {
			this.html.classList.add('webkit');
		}
		
		

	}

}