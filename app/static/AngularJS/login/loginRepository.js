var loginURL = global_settings.urlCORS + 'api/login/';

registrationModule.factory('loginRepository', function($http) {
    return {
        getUsuario: function(usuario, password, username) {
            return $http({
                url: loginURL + 'validaLogin/',
                method: "GET",
                params: {
                    usuario: usuario,
                    password: password,
                    username: username
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

    };

});
