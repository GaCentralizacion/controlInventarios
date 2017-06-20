registrationModule.controller('loginController', function($scope, $rootScope, $location, loginRepository, localStorageService, userFactory, alertFactory) {

    //*******************************Variables*******************************
    $scope.userData = {};
    $scope.generadorLayout = false;
    $scope.cargaLayout = false;
    $scope.cargaInventario = false;
    $scope.notificaciones = false;

    //**************************Init del controller**************************
    $scope.init = function() {
        $rootScope.mostrarMenu = 0;
    }

    // ************************* Función para logueo *************************
    $scope.login = function(usuario, contrasenia) {
        loginRepository.getUsuario(usuario, contrasenia).then(function(result) {

            if (result.data.length > 0) {
                $scope.userData = userFactory.saveUserData(result.data);

                if ($scope.userData[0].perfiles.length > 0){
                    $scope.userData[0].perfiles.forEach(function(item){
                        switch (item.idPerfil) {
                          case 1:
                            $scope.generadorLayout = true;
                            break;
                          case 2:
                            $scope.cargaLayout = true;
                            break;
                          case 3:
                            $scope.cargaInventario = true;
                            break;
                          case 4:
                            $scope.notificaciones = true;
                            break;
                        }
                    });
                }else{
                    $scope.generadorLayout = true;
                    $scope.cargaLayout = true;
                    $scope.cargaInventario = true;
                    $scope.notificaciones = true;
                }

                if ($scope.generadorLayout == true){
                    location.href = '/generaLayout';
                }else if ($scope.cargaInventario == true) {
                    location.href = '/cargaInventario';
                }
            } else {
                alertFactory.info('Valide el usuario y/o contraseña');
            }

        });
    }

});
