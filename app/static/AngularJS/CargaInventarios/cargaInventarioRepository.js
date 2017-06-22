var cargaInventarioURL = global_settings.urlCORS + 'api/cargaInventario/';

registrationModule.factory('cargaInventarioRepository', function($http) {
    return {
        getAccesoriosInventarioByVin: function(idEmpresa, idSucursal, vin) {
            return $http({
                url: cargaInventarioURL + 'accesoriosInventarioByVin/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    vin: vin
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

    };

});
