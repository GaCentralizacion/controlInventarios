registrationModule.controller('layoutController', function($scope, $rootScope, $location, alertFactory, layoutRepository) {
    $scope.idUsuario  = 71; // 1, 71
    $scope.indice     = -1;
    $scope.idEmpresa  = 0;
    $scope.idSucursal = 0;

    $scope.Empresas   = [];
    $scope.Anio       = [];
    $scope.Modelo     = [];

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
        if( $scope.indice == -1 ){
            $scope.idEmpresa = 0;
        }
        else{
            $scope.idEmpresa = $scope.Empresas[ $scope.indice ].emp_idempresa;
        }

        // console.log( $scope.Empresas[ $scope.indice ] );

        console.log( "Empresa", $scope.idEmpresa );
        // console.log( "Indice", indice );
    }

    $scope.generateLayout = function(){
    	layoutRepository.generateLayout() .then(function(result){
    		var Resultado = result.data;
    		window.open('Layout/' + Resultado.Name);
        }, function(error){
            console.log("Error", error);
        });
    }
});
