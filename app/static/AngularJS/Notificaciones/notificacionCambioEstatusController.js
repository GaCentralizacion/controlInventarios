registrationModule.controller('notificacionCambioEstatusController', function($scope, $rootScope, $location, userFactory, alertFactory, layoutRepository, notificacionRepository) {

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
        var mensaje = '';
        var empresa = $scope.idEmpresa === undefined || $scope.idEmpresa === 0 ? null : $scope.idEmpresa;
        var sucursal = $scope.idSucursal === undefined || $scope.idSucursal === 0 ? null : $scope.idSucursal;
        var vinIngresado = $scope.vin === undefined || $scope.vin === '' ? null : $scope.vin;
        var idUsuarioSolicitante = $scope.userData === undefined ? null : $scope.userData.idUsr;

        if (empresa === null){
            swal('Notificaciones','No se ha seleccionado la empresa.');
        }else if(sucursal === null){
            swal('Notificaciones','No se ha seleccionado la sucursal.');
        }else if (vinIngresado === null){
            swal('Notificaciones','No se ha ingresado un número de serie.');
        }else {
            //Se realiza la llamada al servicio para levantar la notificación
            notificacionRepository.getNotificacion(empresa, sucursal, idUsuarioSolicitante, vinIngresado).then(function(result){
                debugger;
                if (result.data.success !== undefined){
                    mensaje = result.data.msg;
                } else {
                    var resultado = result.data[0];
                     if ( resultado.error === 0){
                        mensaje = 'Se envio la notificación exitosamente.';
                     }else{
                        mensaje = 'Ocurrio un problema al enviar la notificación.'
                     }
                }
                swal('Notificaciones', mensaje);
            },function(error){
                console.log("Error", error);
            });
        }
    }


});
