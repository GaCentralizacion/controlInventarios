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
        //  Encabezado  = { vin: STRING,
        //                  idUsr: INT,
        //                  iae_idinventacce: INT,
        //                  idDivision: INT,
        //                  idEmpresa: INT,
        //                  idSucursal: INT,
        //                  ObservacionesGrales: STRING,
        //                  reclama: INT }
        insertaEncabezadoInventario: function(Encabezado) {
            return $http({
                url: cargaInventarioURL + 'insEncabezadoInventario/',
                method: "GET",
                params: Encabezado,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //  Accesorio = { idEncabezado: INT,
        //                caa_idacce: INT,
        //                recibidos: INT,
        //                daniados: INT,
        //                observaciones: STRING,
        //                idEstadoAccesorio: INT }
        insertaDetalleInventario: function(Accesorio) {
            return $http({
                url: cargaInventarioURL + 'insDetalleInventario/',
                method: "GET",
                params: Accesorio,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});
