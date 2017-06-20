registrationModule.controller('mainController', function($scope, $rootScope, $location, localStorageService, alertFactory, userFactory) {
    $scope.generadorLayout = false;
    $scope.cargaLayout = false;
    $scope.cargaInventario = false;
    $scope.notificaciones = false;

    $scope.init = function() {
            //userFactory.ValidaSesion();
            $scope.userData = userFactory.getUserData();

            if ($scope.userData != undefined){
                $rootScope.mostrarMenu = 1;
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
            }
        }

        // ************** Función para cerrar sesión
        // ************** NOTA se limpian todos los localStorage utilizados
    $scope.salir = function() {
        userFactory.logOut();
    }
});
