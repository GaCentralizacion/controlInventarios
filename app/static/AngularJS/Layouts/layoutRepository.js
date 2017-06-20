var layoutURL = global_settings.urlCORS + 'api/layout/';


registrationModule.factory('layoutRepository', function($http) {
    return {
        generateLayout: function(usuario, password) {
            return $http({
                url: layoutURL + 'create/',
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
