registrationModule.controller('cargaInventarioController', function($scope, $rootScope, $location, userFactory, alertFactory, layoutRepository, cargaInventarioRepository) {

    $scope.Empresas = [];
    $scope.idEmpresa  = 0;
    $scope.idDivision = 0;
    $scope.idSucursal = 0;
    $scope.Inv = {};

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
            $scope.idDivision = 0;
        }
        else{
            $scope.idEmpresa = $scope.Empresas[ $scope.indice ].emp_idempresa;
            $scope.idDivision = $scope.Empresas[ $scope.indice ].div_iddivision;
            console.log("empresa", $scope.idEmpresa);
            console.log("division", $scope.idDivision);
        }
    }

    $scope.buscar = function (){
      // console.log("Valor del Check", $scope.daniado)
      var empresa = $scope.idEmpresa;
      var sucursal = $scope.idSucursal;
      var vinBuscar = $scope.vin == '' || $scope.vin == undefined ? null : $scope.vin;

      $scope.Inv = {};

      if(empresa == 0 || sucursal == 0 || sucursal == null || vinBuscar == null){
          alertFactory.info('Ingrese los datos completos.');
      }else{
          cargaInventarioRepository.getAccesoriosInventarioByVin(empresa, sucursal, vinBuscar).then(function(result){
                if (result.data.length > 0){
                    $scope.Inv = result.data[0];
                    if (!($scope.Inv.detalle.length > 0)) {
                        alertFactory.info('La unidad no cuenta con accesorios.')
                    }
                }else {
                    alertFactory.info('No se encontró la unidad en la sucursal solicitada.');
                }
          }, function(error){
              console.log("Error", error);
          });
      }

    }

    $scope.guardarInventario = function(){
      console.log('Detalle', $scope.Inv);
    }

});
