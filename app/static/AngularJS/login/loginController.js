registrationModule.controller('loginController', function($scope, $rootScope, $location, loginRepository, alertFactory) {


    $scope.init = function() {
        $rootScope.mostrarMenu = 0;
    }

    // *************************** Función para logueo de portal *****************
    $scope.login = function(usuario, contrasenia) {
        loginRepository.getUsuario(usuario, contrasenia).then(function(result) {
            if (result.data.length > 0) {
                location.href = '/generaLayout';
            } else {
                alertFactory.info('Valide el usuario y/o contraseña');
            }

        });
    }


});
