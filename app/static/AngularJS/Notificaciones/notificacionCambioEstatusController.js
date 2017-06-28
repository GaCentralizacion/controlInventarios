registrationModule.controller('notificacionCambioEstatusController', function($scope, $rootScope, $location, userFactory, alertFactory,  layoutRepository) {

    $scope.Empresas = [];
    $scope.idEmpresa  = 0;
    $scope.idSucursal = 0;

    $scope.init = function() {
      userFactory.ValidaSesion();
      $scope.userData = userFactory.getUserData();
      if($scope.userData !== undefined){
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

    $scope.SolicitarCambioEstatus = function(){
        var empresa = $scope.idEmpresa === undefined || $scope.idEmpresa === 0 ? null : $scope.idEmpresa;
        var sucursal = $scope.idSucursal === undefined || $scope.idSucursal === 0 ? null : $scope.idSucursal;
        var vinIngresado = $scope.vin === undefined || $scope.vin === '' ? null : $scope.vin;
        var idUsuarioSolicitante = $scope.userData === undefined ? null : $scope.userData.idUsr;
        debugger;
        if (empresa === null){
            swal('Notificaciones','No se ha seleccionado la empresa.');
        }else if(sucursal === null){
            swal('Notificaciones','No se ha seleccionado la sucursal.');
        }else if (vinIngresado === null){
            swal('Notificaciones','No se ha ingresado un número de serie.');
        }else {
            //Se realiza la llamada al servicio para levantar la notificación
        }
    }


});
