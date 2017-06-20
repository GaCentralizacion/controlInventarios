var loginURL = global_settings.urlCORS + 'api/login/';


registrationModule.factory('loginRepository', function($http) {
    return {
        getUsuario: function(usuario, password) {
            return $http({
                url: loginURL + 'validaLogin/',
                method: "GET",
                params: {
                    usuario: usuario,
                    password: password
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

    };

});
