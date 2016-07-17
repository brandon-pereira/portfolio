(function(window, $, ko) {
	
	function Skills(element) {
		this.$element = $(element);
		this.init();
	}

	Skills.prototype.init = function() {
		this.$loader = this.$element.find('.loading');
		this.$content = this.$element.find('.init');
		// this.$smoothScroll = new SmoothScroll();
		this._initView();
		this._fetch();
		this._events();
	};
	
	Skills.prototype._fetch = function() {
		var self = this;
		$.ajax({
				url: '/templates/skills.json',
 				success: function(response) {
					self._process(response);
				}
		});
	};
	
	Skills.prototype._process = function(response) {
		response = this._setSkillLevels(response);
		this._updateView(response);
		this._events();
		this.$loader.addClass('loaded');
		this.$content.addClass('true');
	};
	
	Skills.prototype._setSkillLevels = function(data) {
		var categorys = data.categories;
		var levels = data.skillLevels;
		for(var i = 0; i < categorys.length; i++) {
			var skills = categorys[i].skills;
			for(var j = 0; j < skills.length; j++) {
				var skill = skills[j];
				skill.skillLevel = levels[skill.skillLevel];
			}
		}
		return data;
	};
	/**
	 * Function to initialize the view model using
	 * knockout. Uses observables.
	 */
	Skills.prototype._initView = function () {
		this.view = {
			categories: ko.observable([]),
			sortByProject: function(id) {
				$('#projects').trigger('sortBy:language', id);
			}
		};
		ko.applyBindings(this.view, this.$element[0]);
	};
	
	/**
	 * Function which delegates updating view
	 * @param  {Object} data.categories New cateories object to applu
	 */
	Skills.prototype._updateView = function (data) {
		if(data.categories) {
			this.view.categories(data.categories);
		}
	};
	
	Skills.prototype._events = function() {
		var self = this;
		this.$element.find('[data-accordion-handler]').on('click', function() {
			self._open($(this).closest('.accordion'));
		});
		
		this.$element.on('goToSkill', function(e, skill) {
			console.log(skill);
		})
	};
	
	Skills.prototype._open = function($element) {
		var self = this;
		$element.siblings().removeClass('open');
		$element.toggleClass('open');
	};
	
	window.Skills = Skills;
	
})(window, $, ko);