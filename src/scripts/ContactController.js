app.controller('ContactController', function($scope, $http){
	$http({
		method: 'GET',
		url: './templates/contact.json'
	}).then(function(response){
		$scope.socialLinks = response.data.socialLinks;
		$scope.contactLinks = response.data.contactLinks;
		$scope.init = true;
	});
});