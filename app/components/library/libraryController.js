website.controller('libraryController', function($scope, libraryInfos) {
    $scope.userAppsInfos = libraryInfos.data.Users;
});
