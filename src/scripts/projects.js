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
		this.events();
	};
	
	Projects.prototype.events = function() {
		var self = this;
		
		var triggerSelectChange = function(val) {
			return self._onSelectChange(val);
		};
		
	 	this.view.selectedStatus.subscribe(triggerSelectChange);
	 	this.view.selectedDate.subscribe(triggerSelectChange);
	 	this.view.selectedLanguage.subscribe(triggerSelectChange);
	};
	
	Projects.prototype._onSelectChange = function (val) {
		var status = this.view.selectedStatus() ? this.view.selectedStatus()[0].class : false;
		var date = this.view.selectedDate() ? this.view.selectedDate()[0].val : false;
		var language = this.view.selectedLanguage() ? this.view.selectedLanguage()[0] : false;
		this._sortProjects(status, date, language);
	};
	
	Projects.prototype._sortProjects = function (status, date, language) {
		console.log("Hello World");
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
		response = this._parse(response);
		this._updateView(response);
		this.$loader.addClass('loaded');
		this.$content.addClass('true');
		console.log("proccessed", response);
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
		if(data.languages) {
			this.view.languages(data.languages);
		}
		if(data.statuses) {
			this.view.statuses(data.statuses);
		}
		
	};
	
	/**
	 * Function to parse resonse from server
	 * @param  {[type]} projects [description]
	 * @return {[type]}          [description]
	 */
	Projects.prototype._parse = function(data) {
		var statuses = data.statuses;
		var projects = data.projects;
		var languages = [];

		for(var i = 0; i < projects.length; i++) {
			projects[i].status = statuses[projects[i].status];
			projects[i].date = this._getFormatedDate(new Date(projects[i].date));
			languages = languages.concat(projects[i].languages);
		}
		
		data.languages = this._uniq(languages);
		data.statuses = Object.keys(data.statuses).map(function (key) {return data.statuses[key];});
		
		return data;
	};
	
	/**
	 * Function which returns only unique elements
	 * @param  {array} array Array to sort
	 * @return {array} pruned array
	 */
	Projects.prototype._uniq = function(array) {
		return array.sort().filter(function(el,i,a) {
        return (i == a.indexOf(el));
    });
	};
	
	Projects.prototype._getFormatedDate = function(date) {
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate(0) + ', ' + date.getFullYear();
	};

	/**
	 * Function to initialize the view model using
	 * knockout. Uses observables.
	 */
	Projects.prototype._initView = function () {
		var sortByDate = [
			{title: 'Decending', val: false},
			{title: 'Ascending', val: true},
		];
		this.view = {
			projects: ko.observable([]),
			statuses: ko.observable([]),
			languages: ko.observable([]),
			dates: sortByDate,
			selectedStatus: ko.observable(),
			selectedDate: ko.observable(),
			selectedLanguage: ko.observable(),
			maxVisible: 1,
			inView: 1
		};
		ko.applyBindings(this.view, this.$element[0]);
	};

	
	window.Projects = Projects;
	
})(window, $, ko);