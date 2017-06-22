registrationModule.controller('cargaInventarioController', function($scope, $rootScope, $location, userFactory, alertFactory, layoutRepository) {

    $scope.Empresas = [];
    $scope.idEmpresa  = 0;
    $scope.idSucursal = 0;
    $scope.accesoriosInv = [];
    $scope.daniado = [];

    $scope.init = function() {
      userFactory.ValidaSesion();
      $scope.userData = userFactory.getUserData();
      if($scope.userData != undefined){
          $scope.getEmpresas( $scope.userData.idUsr);
      }
    }

    $scope.getEmpresas = function( idUsuario ){
        layoutRepository.getEmpresas( idUsuario ).then(function(result){
            $scope.Empresas = result.data;
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.EmpresaSeleccionada = function(){
        if( $scope.indice == null  || $scope.indice == undefined ){
            $scope.idEmpresa = 0;
        }
        else{
            $scope.idEmpresa = $scope.Empresas[ $scope.indice ].emp_idempresa;
        }
    }

    $scope.buscar = function (){
      console.log("Valor del Check", $scope.daniado)
      var empresa = $scope.idEmpresa;
      var sucursal = $scope.idSucursal;
      var vinBuscar = $scope.vin == '' || $scope.vin == undefined ? null : $scope.vin;
      if(empresa == 0 || sucursal == 0 || sucursal == null || vinBuscar == null){
          alertFactory.info('Ingrese los datos completos.');
      }

    }

});
