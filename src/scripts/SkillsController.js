app.controller('SkillsController', function($scope, $http, $rootScope){
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
				child.isOpen = !child.isOpen;
			}
		}
	};
});