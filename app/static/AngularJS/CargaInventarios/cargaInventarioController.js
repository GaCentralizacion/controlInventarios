registrationModule.controller('cargaInventarioController', function($scope, $rootScope, $location, userFactory, alertFactory, layoutRepository, cargaInventarioRepository) {

    $scope.Empresas = [];
    $scope.idEmpresa  = 0;
    $scope.idDivision = 0;
    $scope.idSucursal = 0;
    $scope.Inv = {};
    $scope.MostrarInfo = false;
    $scope.MostrarAccesorios = false;
    $scope.idsDetalle = [];

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
        }
    }

    $scope.buscar = function (){
      var empresa = $scope.idEmpresa;
      var sucursal = $scope.idSucursal;
      var vinBuscar = $scope.vin == '' || $scope.vin == undefined ? null : $scope.vin;

      $scope.Inv = {};
      $scope.MostrarInfo = false;
      $scope.MostrarAccesorios = false;

      if(empresa == 0){
          swal('Carga Inventarios','No se ha seleccionado la empresa.');
      }else if (sucursal == 0 || sucursal == null){
          swal('Carga Inventarios','No se ha seleccionado la sucursal.');
      }else if (vinBuscar == null){
          swal('Carga Inventarios','No se ha ingresado un número de serie.');
      }else{
          cargaInventarioRepository.getAccesoriosInventarioByVin(empresa, sucursal, vinBuscar).then(function(result){
                if (result.data.length > 0){
                    $scope.Inv = result.data[0];
                    $scope.MostrarInfo = true;
                    if ($scope.Inv.detalle.length > 0){
                        $scope.MostrarAccesorios = true;
                    }else{
                        swal('Carga Inventarios','La unidad solicitada no cuenta con accesorios configurados.');
                    }
                }else {
                    swal('Carga Inventarios','No se encontró la unidad solicitada.');
                }
          }, function(error){
              console.log("Error", error);
          });
      }

    }

    $scope.cambiaCant = function(index, recibido){
        if(recibido){
            var cant = $scope.Inv.detalle[index].cantRecibida;
            if (cant == undefined){
                $scope.Inv.detalle[index].cantRecibida = 0;
              }
        }
        else{
            var cant = $scope.Inv.detalle[index].cantDaniados;
            if (cant == undefined){
                $scope.Inv.detalle[index].cantDaniados = 0;
              }
        }
    }

    $scope.guardarInventario = function(){
        console.log("Inventario Accesorios", $scope.Inv);

        var obsGrales = $scope.Inv.Observaciones == null || $scope.Inv.Observaciones == undefined ? '' : $scope.Inv.Observaciones.toUpperCase();
        var invReclama = 0;

        $scope.Inv.detalle.forEach(function(item){
            if (item.iad_cantdefault != item.cantRecibida){
                invReclama = 1;
            }
        });

        var Encabezado  = { vin: $scope.Inv.vin,
                           idUsr: $scope.userData.idUsr,
                           iae_idinventacce: $scope.Inv.iae_idinventacce,
                           idDivision: $scope.idDivision,
                           idEmpresa: $scope.idEmpresa,
                           idSucursal: $scope.idSucursal,
                           idDepartamento: 1,
                           ObservacionesGrales: obsGrales,
                           reclama: invReclama };

        cargaInventarioRepository.insertaEncabezadoInventario(Encabezado).then(function(result){
              if (result.data.length > 0){
                  var idEncabezado =  result.data[0].idEncabezadoInventario;

                  $scope.Inv.detalle.forEach(function(acce, key){
                      var obsAcce = acce.observaciones ==  null || acce.observaciones == undefined ? '' : acce.observaciones.toUpperCase();
                      var estadoAcce = 1;

                      if (acce.cantDaniados == 0){
                          //1 ok, 2 faltante, 4 excedente
                          if (acce.cantRecibida == acce.iad_cantdefault){
                              estadoAcce = 1;
                          } else if (acce.cantRecibida < acce.iad_cantdefault){
                              estadoAcce = 2;
                          } else {
                              estadoAcce = 4;
                          }
                      }else{
                         //3 dañada, 6 dañada faltante, 5 dañada excedente
                         if (acce.cantRecibida == acce.iad_cantdefault){
                             estadoAcce = 3;
                         } else if (acce.cantRecibida < acce.iad_cantdefault){
                             estadoAcce = 6;
                         } else {
                             estadoAcce = 5;
                         }
                      }

                      var Accesorio = { idEncabezado: idEncabezado,
                                       caa_idacce: acce.caa_idacce[0],
                                       recibidos: acce.cantRecibida,
                                       daniados: acce.cantDaniados,
                                       observaciones: obsAcce,
                                       idEstadoAccesorio: estadoAcce };

                      cargaInventarioRepository.insertaDetalleInventario(Accesorio).then(function(result){
                          $scope.idsDetalle.push(result.data[0].idDetalleInventario);
                      }, function(error){
                        console.log("Error", error);
                      });
                  });

                  console.log("id Encabezado: ", idEncabezado);
                  console.log("ids Detalle: ", $scope.idsDetalle);
              }
        }, function(error){
            swal('Carga Inventarios','No se pudo guardar su inventario.');
            console.log("Error", error);
        });
    }

});
