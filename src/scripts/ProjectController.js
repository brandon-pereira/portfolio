app.controller('ProjectController', function($filter, $scope, $http, $sce, $rootScope, $anchorScroll){
	$http({
		method: 'GET',
		url: './templates/projects.json'
	}).then(function(response){
		var status = response.data.status;
		var projects = response.data.projects;
		var languages = [];
		for(var i = 0; i < projects.length; i++) {
			projects[i].type = status[parseInt(projects[i].type)];
			projects[i].date = new Date(projects[i].date);
			projects[i].description = $sce.trustAsHtml(projects[i].description);
			for(var x = 0; x < status.length; x++) {
				if(status[x].class === projects[i].status) {
					projects[i].status = status[x];
					break;
				}
			}
			for(var y = 0; y < projects[i].languages.length; y++) {	
				var lang = projects[i].languages[y];
				var found = false;
				for(var z = 0; z < languages.length; z++) {
					if(languages[z].class === lang){
						found = true;
						break;
					}
				}
				if(!found) languages.push({"title": lang, "class": lang});	
			}
		}
		status.unshift({"title": "Status", "class": undefined});
		languages.unshift({"title": "Language", "class": undefined});
		$scope.status = status;
		$scope.projects = projects;
		$scope.languages = languages;
		$scope.init = true;
	});
	$scope.init = false;
	$scope.visibleProjects = 3;
	$scope.inView = false;
	$scope.searchProjects = function(searchBy){
		$scope.sortBy = {
			'date':searchBy.date || true,
			'status':searchBy.status || undefined,
			'lang':searchBy.language || undefined
		};
	};
	$scope.searchProjects({});
	$rootScope.$on('searchProjects', function (event, data) {
		$scope.searchProjects(data);
		$anchorScroll('projects');
	});
	$scope.showModal = function(url, title, imgClasses) {
		$scope.modalImg = url;
		$scope.modalImgTitle = title;
		$scope.modalImgClasses = imgClasses;
		$scope.modalVisible = true;
	};
	$scope.goToLanguage = function(lang) {
		$rootScope.$emit('goToLanguage', lang);
	};
});