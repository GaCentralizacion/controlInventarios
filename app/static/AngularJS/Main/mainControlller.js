registrationModule.controller('mainController', function($scope, $rootScope, $location, localStorageService, alertFactory, userFactory) {

    $scope.init = function() {
            //userFactory.ValidaSesion();
            $scope.userData = userFactory.getUserData();

            if ($scope.userData != undefined){
                $rootScope.mostrarMenu = 1;
            }
        }

    $scope.salir = function() {
        userFactory.logOut();
    }
});
