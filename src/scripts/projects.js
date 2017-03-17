(function(window, $, ko) {
	function Projects(element) {
		this.$element = $(element);
		this.init();
	}

	Projects.prototype.init = function() {
		this.$loader = this.$element.find('.loading').first();
		this.$content = this.$element.find('.init');
		this.smoothScroll = new SmoothScroll();
		this.projects = [];
		
		this._initView();
		this._fetch();
		this.events();
	};
	
	Projects.prototype.events = function() {
		var self = this;
		
		// Deep link to language (from skills)
		$(this.$element).on('sortBy:language', function(e, lang) {
			self.view.selectedLanguage(lang);
			self.smoothScroll.scrollTo('#projects');
		});
		
		
		// Watch for filtering changes
		var triggerSelectChange = function(val) {
			return self._onSelectChange(val);
		};
	 	this.view.selectedStatus.subscribe(triggerSelectChange);
	 	this.view.selectedDate.subscribe(triggerSelectChange);
	 	this.view.selectedLanguage.subscribe(triggerSelectChange);
	 	this.view.selectedType.subscribe(triggerSelectChange);
	};
	
	/**
	 * Callback when sort by criteria is changed.
	 */
	Projects.prototype._onSelectChange = function () {
		var projects = this.projects;
		var filters = this._getFilters();
		var response = {};
		
		response.projects = this._sortProjects(projects, filters.date);
		response.projects = this._filterProjects(response.projects , filters.status, filters.language, filters.type);
		if(response.projects.length > 3) {
			response.projects = response.projects.slice(0, 3);
			response.hasMore = true;
		} else {
			response.hasMore = false;
		}

		this._updateView(response);
	};
	
	Projects.prototype._loadMore = function(amount) {
		var projects = this.projects;
		var filters = this._getFilters();
		var response = {};
		
		response.projects = this._sortProjects(projects, filters.date);
		response.projects = this._filterProjects(response.projects , filters.status, filters.language, filters.type);
		if(response.projects.length > amount) {
			response.projects = response.projects.slice(0, amount);
			response.hasMore = true;
		} else {
			response.hasMore = false;
		}
		
		this._updateView(response);
	};
	
	Projects.prototype._getFilters = function() {
		// Get Values
		var status = this.view.selectedStatus();
		var date = this.view.selectedDate();
		var language = this.view.selectedLanguage();
		var type = this.view.selectedType();
		
		// Sanitize
		status = status && status.class ? status.class : false;
		date = date && date.val ? date.val : false;
		language = language || false;
		type = type || false;
		
		// Return
		return {
			status: status,
			date: date,
			language: language,
			type: type
		};
	};
	
	/**
	 * Function to process a response from server. 
	 * @param  {object} response Respnse from server
	 */
	Projects.prototype._process = function(data) {
		var response = {};
		response = this._parse(data);
		this.projects = response.projects;
		response.projects = this._sortProjects(response.projects);
		if(response.projects.length > 3) {
			response.projects = response.projects.slice(0, 3);
			response.hasMore = true;
		} else {
			response.hasMore = false;
		}
		this._updateView(response);
		this.$loader.addClass('loaded');
		this.$content.addClass('true');
	};

	
	/**
	 * Function to sort projects by date
	 * @param  {Array} projects Array of projects to sort
	 * @param  {Boolean} asc    To sort ascendng or descending {falsy for desc}
	 * @return {Array}          Sorted array of projects
	 */
	Projects.prototype._sortProjects = function (projects, asc) {
		if(projects) {
			projects.sort(function(a, b) {
				return (a.date - b.date) * ((asc) ? 1 : -1);
			});
			return projects;	
		} else {
			return [];
		}
	};
	
	/**
	 * Function to filter projects down
	 * @param  {Array} projects  Array of projects to filter
	 * @param  {string} status   Status to filter by (or falsy to ignore)
	 * @param  {string} language Language to filter by (or falsy to ignore)
	 * @return {Array}           Array of filtered projects
   * @param  {string} status   Type to filter by (or falsy to ignore)
	 */
	Projects.prototype._filterProjects = function (projects, status, language, type) {
		if(projects) {
			projects = projects.filter(function(val) {
				var statusFilter = status ? val.status.class === status : true;
				var languageFilter = language ? val.languages.indexOf(language) >= 0 : true;
				var typeFilter = type ? val.type === type : true;
				
				return statusFilter && languageFilter && typeFilter;
			});
			return projects;
		} else {
			return [];
		}
	};
	
	/**
	 * Function to fetch projects and call process function 
	 */
	Projects.prototype._fetch = function() {
		var self = this;
		$.ajax({
				url: 'templates/projects.json',
				success: function(response) {
					self._process(response);
				}
		});
	};
	
	/**
	 * Function which delegates updating view
	 * @param  {Object} data.categories New cateories object to applu
	 */
	Projects.prototype._updateView = function (data) {
		if(data.projects) {
			this.view.visibleProjects(data.projects);
		}
		if(data.status) {
			this.view.status(data.status);
		}
		if(data.types) {
			this.view.types(data.types);
		}
		if(typeof data.hasMore !== 'undefined') {
			this.view.hasMore(data.hasMore);
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
		var types = data.types;
		var languages = [];

		for(var i = 0; i < projects.length; i++) {
			projects[i].type = types[projects[i].type];
			projects[i].status = statuses[projects[i].status];
			projects[i].date = new Date(projects[i].date);
			projects[i].formattedDate = this._getFormatedDate(projects[i].date);
			languages = languages.concat(projects[i].languages);
		}
		
		data.languages = this._uniq(languages);
		data.statuses = Object.keys(data.statuses).map(function (key) {return data.statuses[key];});
		data.types = Object.keys(data.types).map(function (key) {return data.types[key];});
	
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
	
	/**
	 * Function to format a date into format Weekday, Month Day, Year
	 * @param {date} date Date to format
	 * @return {string} Formatted string
	 */
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
		var self = this;
		var sortByDate = [
			{title: 'Decending', val: false},
			{title: 'Ascending', val: true},
		];
		this.view = {
			visibleProjects: ko.observable([]),
			statuses: ko.observable([]),
			languages: ko.observable([]),
			types: ko.observable([]),
			dates: sortByDate,
			lightbox: {
				open: ko.observable(false),
				img: ko.observable(''),
				desc: ko.observable(''),
				poster: ko.observable(''),
				isVideo: ko.observable(false),
				style: ko.observable(''),
				isLoaded: ko.observable(false)
			},
			selectedStatus: ko.observable(),
			selectedDate: ko.observable(),
			selectedType: ko.observable(),
			selectedLanguage: ko.observable(),
			hasMore: ko.observable(false),
			filtersVisible: ko.observable(false),
			resetFilters: function() {
				this.selectedStatus(null);
				this.selectedLanguage(null);
				this.selectedDate(null);
			},
			toggleFiltersVisible: function() {
				this.filtersVisible(!this.filtersVisible());
			},
			loadMore: function() {
				self._loadMore(this.visibleProjects().length + 3);
			},
			goToSkill: function(skill) {
				$('#skills').trigger('goToSkill', skill);
			},
			openImage: function() {
				var view = self.view.lightbox;
				// show loader till image loaded 
				view.isLoaded(false);
				var img = new Image();
				img.onload = function() {
					view.isLoaded(true);
				};
				img.src = this.src;
				view.img(this.src);
				view.open(true);
				view.desc(this.title);
				view.poster(this.type === 'video' ? this.poster : '');
				view.isVideo(this.type === 'video');
				view.style(this.styling ? this.styling : '');
			
			},
			closeImage: function() {
				this.lightbox.open(false);
			}
		};
		ko.applyBindings(this.view, this.$element[0]);
	};

	
	window.Projects = Projects;
	
})(window, $, ko);