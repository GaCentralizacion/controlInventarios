registrationModule.controller('cargaInventarioController', function($scope, $rootScope, $location, userFactory, alertFactory) {


    $scope.init = function() {
      userFactory.ValidaSesion();
    }


});
