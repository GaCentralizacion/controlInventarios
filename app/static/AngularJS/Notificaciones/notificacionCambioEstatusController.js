registrationModule.controller('notificacionCambioEstatusController', function($scope, $rootScope, $location, userFactory, alertFactory) {


    $scope.init = function() {
      userFactory.ValidaSesion();
    }


});
