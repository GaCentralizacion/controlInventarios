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
        getAccesorios: function( modelo, anio ) {
            return $http({
                url: layoutURL + 'accesorios/',
                method: "GET",
                params:{
                    modelo: modelo,
                    anio: anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertLayout: function( idEmpresa, idSucursal, Modelo, Anio, idUsuario, key ) {
            return $http({
                url: layoutURL + 'guardaLayout/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    Modelo: Modelo,
                    Anio: Anio,
                    idUsuario: idUsuario,
                    key, key
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        generateLayout: function( json ) {
            return $http({
                url: layoutURL + 'create/',
                method: "GET",
                params: {
                    jsonData: json
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        readLayout: function( LayoutName ) {
            return $http({
                url: layoutURL + 'readLayout/',
                method: "GET",
                params: {
                    LayoutName: LayoutName
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaLayout: function( key ) {
            return $http({
                url: layoutURL + 'validaLayout/',
                method: "GET",
                params: {
                    Key: key
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
