(function(window, $, ko) {
	function Projects(element) {
		this.$element = $(element);
		this.init();
	}

	Projects.prototype.init = function() {
		this.$loader = this.$element.find('.loading');
		this.$content = this.$element.find('.init');
		
		this._initView();
		this._fetch();
		// this._events();
	};
	
	Projects.prototype._fetch = function() {
		var self = this;
		$.ajax({
				url: '/templates/projects.json',
				success: function(response) {
					self._process(response);
				}
		});
	};
	
	Projects.prototype._process = function(response) {
		// console.log(response);
		response = this._parse(response);
		// response = this._setSkillLevels(response);
		this._updateView(response);
		// this._events();
		this.$loader.addClass('loaded');
		this.$content.addClass('true');
	};

	/**
	 * Function which delegates updating view
	 * @param  {Object} data.categories New cateories object to applu
	 */
	Projects.prototype._updateView = function (data) {
		if(data.projects) {
			this.view.projects(data.projects);
		}
		if(data.status) {
			this.view.status(data.status);
		}
	};
	
	/**
	 * Function to parse resonse from server
	 * @param  {[type]} projects [description]
	 * @return {[type]}          [description]
	 */
	Projects.prototype._parse = function(data) {
		var status = data.status;
		var projects = data.projects;
		var languages = [];
		for(var i = 0; i < projects.length; i++) {
			console.log(projects[i]);
			projects[i].type = status[parseInt(projects[i].status)];
			projects[i].date = this._getFormatedDate(new Date(projects[i].date));
			console.log(projects[i].type);
		}
		return data;
	};
	
	Projects.prototype._getFormatedDate = function(date) {
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate(0) + ', ' + date.getFullYear();
	}

	/**
	 * Function to initialize the view model using
	 * knockout. Uses observables.
	 */
	Projects.prototype._initView = function () {
		this.view = {
			projects: ko.observable([]),
			status: ko.observable([]),
			languages: ko.observable([]),
			selectedLanguage: ko.observable()
		};
		ko.applyBindings(this.view, this.$element[0]);
	};

	
	window.Projects = Projects;
	
})(window, $, ko);