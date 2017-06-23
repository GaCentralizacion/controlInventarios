registrationModule.controller('layoutController', function($scope, $rootScope, $location, alertFactory, layoutRepository, filterFilter) {
    $scope.idUsuario  = 71; // 1, 71
    $scope.idEmpresa  = 0;
    $scope.idSucursal = 0;
    $scope.idModelo   = '';
    $scope.idAnio     = '';
    $scope.json       = [];

    $scope.Empresas   = [];
    $scope.Sucursales = [];
    $scope.Anio       = [];
    $scope.Modelo     = [];
    $scope.Accesorios = [];


    $scope.init = function() {
        $scope.getEmpresas( $scope.idUsuario );
        $scope.getAnioModelo(); 
    }

    $scope.getEmpresas = function( idUsuario ){
        layoutRepository.getEmpresas( idUsuario ).then(function(result){
            $scope.Empresas = result.data;
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.getAnioModelo = function(){
        layoutRepository.getAnioModelo().then(function(result){
            $scope.Anio   = result.data[0];
            $scope.Modelo = result.data[1];
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.EmpresaSeleccionada = function(){
        $scope.Sucursales = filterFilter( $scope.Empresas , {emp_idempresa: $scope.idEmpresa} );
        $scope.Cambios();
    }

    $scope.validaInputs = function(){
        console.log( $scope.idAnio );
        if( $scope.idEmpresa == 0 || $scope.idEmpresa === null ){
            alert('No se ha seleccionado la empresa.');
        }
        else if( $scope.idSucursal == 0 || $scope.idSucursal === null ){
            alert('No se ha seleccionado la sucursal.');
        }
        else if( $scope.idModelo == '' || $scope.idModelo === null ){
            alert('No se ha seleccionado el modelo.');
        }
        else if( $scope.idAnio == '' || $scope.idAnio === null){
            alert('No se ha seleccionado el año.');
        }
        else{
            
            var lbl_empresa  = filterFilter( $scope.Empresas , {emp_idempresa: $scope.idEmpresa} );
            var lbl_sucursal = filterFilter( $scope.Sucursales[0].Sucursales , {suc_idsucursal: $scope.idSucursal} );
            var arr_modelo   = filterFilter( $scope.Modelo , {iae_idcatalogo: $scope.idModelo} );

            $scope.Accesorios = [];
            layoutRepository.getAccesorios( $scope.idModelo, $scope.idAnio ).then(function(result){
                var Resultado = result.data[0];
                Resultado.forEach( function( item, key ){
                    $scope.Accesorios.push( {folio_herr: item.caa_idacce, descripcion: item.caa_descripacce} );
                });

                $scope.json = {
                    empresa: lbl_empresa[0].emp_nombre,
                    sucursal: lbl_sucursal[0].suc_nombre,
                    catalogo: arr_modelo[0].iae_idcatalogo,
                    descripcion: arr_modelo[0].iae_modelo,
                    anio: parseInt($scope.idAnio),
                    accesorios: $scope.Accesorios
                };
                // $scope.generateLayout( json );
            }, function(error){
                console.log("Error", error);
            });
        }
    }

    $scope.generateLayout = function(){
    	layoutRepository.generateLayout( $scope.json ).then(function(result){
    		var Resultado = result.data;
    		window.open('Layout/' + Resultado.Name);
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.Erase = function(){
        $scope.idEmpresa  = 0;
        $scope.idSucursal = 0;
        $scope.idModelo   = '';
        $scope.idAnio     = '';
        $scope.json       = [];

        $scope.Accesorios = [];
    }

    $scope.Cambios = function(){
        $scope.Accesorios = [];
    }
});
