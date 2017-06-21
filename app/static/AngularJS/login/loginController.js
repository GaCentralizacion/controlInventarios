registrationModule.controller('loginController', function($scope, $rootScope, $location, loginRepository, localStorageService, userFactory, alertFactory) {

    //*******************************Variables*******************************
    $scope.userData = {};

    //**************************Init del controller**************************
    $scope.init = function() {
      $scope.userData = userFactory.getUserData();
      if ($scope.userData != null || $scope.userData != undefined){
        $scope.myFirstModule();
      }else{
        localStorageService.clearAll();
        $rootScope.mostrarMenu = 0;
      }

    }

    // ************************* Función para logueo *************************
    $scope.login = function(usuario, contrasenia, username) {

        loginRepository.getUsuario(usuario, contrasenia, username).then(function(result) {

            if (result.data.length > 0) {
                $scope.userData = userFactory.saveUserData(result.data[0]);
                $scope.myFirstModule();
            } else {
                alertFactory.info('Valide el usuario y/o contraseña');
            }

        });
    }

    //*********función para ir al modulo correspondiente según el perfil*********
    $scope.myFirstModule = function(){
      if ($scope.userData.generadorLayout == true){
          location.href = '/generaLayout';
      }else if ($scope.userData.cargaInventario == true) {
          location.href = '/cargaInventario';
      }else if ($scope.userData.cargaLayout == true){
          location.href = '/cargaLayout';
      } else if ($scope.userData.notificaciones == true) {
          location.href = '/notificaciones';
      }
    }

});
