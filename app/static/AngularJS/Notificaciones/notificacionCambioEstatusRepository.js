var notificacionURL = global_settings.urlCORS + 'api/notificacion/';

registrationModule.factory('notificacionRepository', function($http) {
    return {
        getNotificacion: function(idEmpresa, idSucursal, solicitante, identificador) {
            return $http({
                url: notificacionURL + 'crearNotificacion/',
                method: "GET",
                params: {
                  idEmpresa: idEmpresa,
                  idSucursal: idSucursal,
                  solicitante: solicitante,
                  identificador: identificador
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };

});
