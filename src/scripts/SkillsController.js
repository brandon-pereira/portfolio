app.controller('SkillsController', function($scope, $http, $rootScope, $anchorScroll){
	$http({
		method: 'GET',
		url: './templates/skills.json'
	}).then(function(response){
		var categorys = response.data.skills;
		var levels = response.data.skillLevels;
		for(var i = 0; i < categorys.length; i++) {
			var category = categorys[i].skills;
			for(var j = 0; j < category.length; j++) {
				var skill = category[j];
				skill.skillLevel = levels[skill.skillLevel];
			}
		}
		$scope.skills = response.data.skills;
		$scope.skillLevels = response.data.skillLevels;
		$scope.init = true;
	});
	$scope.searchProjects = function(searchBy){
		$rootScope.$emit('searchProjects', searchBy);
	};
	$scope.openTab = function(parent, child){
		for(var i = 0; i < parent.length; i++) {
			var sibling = parent[i];
			if(!angular.equals(sibling, child)){
				sibling.isOpen = false;
			} else {
				child.isOpen = true;
			}
		}
	};
	$scope.goToLanguage = function(lang) {
		var categories = $scope.skills;
		for(var i = 0; i < categories.length; i++) {
			var skills = categories[i].skills;
			for(var j = 0; j < skills.length; j++) {
				if(skills[j].id === lang) {
					$scope.openTab(categories, categories[i]);
					$scope.openTab(skills, skills[j]);
					return true;
				}
			}
		}
		return false;
	};
	$rootScope.$on('goToLanguage', function (event, data) {
		$scope.goToLanguage(data);
		$anchorScroll('skills');
	});
});