var layoutURL = global_settings.urlCORS + 'api/layout/';


registrationModule.factory('layoutRepository', function($http) {
    return {
        getEmpresas: function( idUsuario ) {
            return $http({
                url: layoutURL + 'empresaByUser/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAnioModelo: function() {
            return $http({
                url: layoutURL + 'anioModelo/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        generateLayout: function() {
            return $http({
                url: layoutURL + 'create/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
