registrationModule.controller('cargaInventarioController', function($scope, $rootScope, $location, userFactory, alertFactory, layoutRepository, cargaInventarioRepository, filterFilter) {

    $scope.Empresas = [];
    $scope.idEmpresa = 0;
    $scope.idDivision = 0;
    $scope.idSucursal = 0;
    $scope.Inv = {};
    $scope.MostrarInfo = false;
    $scope.MostrarAccesorios = false;
    $scope.puedeGuardar = false;
    $scope.idsDetalle = [];
    $scope.respuestas = 0;

    $scope.MaxAccesoriosRecibida = 0;
    $scope.MaxAccesoriosDañada = 0;
    $scope.VEH_SITUACION = '';

    $scope.print = false;

    $scope.init = function() {
        userFactory.ValidaSesion();
        $scope.userData = userFactory.getUserData();
        $scope.Parametros();
        if ($scope.userData != undefined) {
            $scope.getEmpresas($scope.userData.idUsr);
        }
    }

    $scope.Parametros = function() {
        layoutRepository.parametros().then(function(result) {
            $scope.Parametros = result.data;

            $scope.MaxAccesoriosRecibida = $scope.getParametro('maximoRecibido');
            $scope.MaxAccesoriosDañada = $scope.getParametro('maximoDaniado');
            $scope.VEH_SITUACION = $scope.getParametro('situacionManual');

        }, function(error) {
            console.log("Error", error);
        });
    }

    $scope.getParametro = function(parametro) {
        $scope.arreglo = filterFilter($scope.Parametros, {Parametro: parametro });
        return $scope.arreglo[0].Valor;
    }

    $scope.getEmpresas = function(idUsuario) {
        layoutRepository.getEmpresas(idUsuario).then(function(result) {
            $scope.Empresas = result.data;
        }, function(error) {
            console.log("Error", error);
        });
    }

    $scope.EmpresaSeleccionada = function() {
        if ($scope.indice == null || $scope.indice == undefined) {
            $scope.idEmpresa = 0;
            $scope.idDivision = 0;
        } else {
            $scope.idEmpresa = $scope.Empresas[$scope.indice].emp_idempresa;
            $scope.idDivision = $scope.Empresas[$scope.indice].div_iddivision;

            $scope.emp_nombre = $scope.Empresas[$scope.indice].emp_nombre;
        }
    }

    $scope.CambiaBusqueda = function() {
        $scope.Inv = {};
        $scope.MostrarInfo = false;
        $scope.MostrarAccesorios = false;
        $scope.puedeGuardar = false;
    }

    $scope.seleccionaSucursal = function(){
        $scope.arr_suc = filterFilter($scope.Empresas[$scope.indice].Sucursales, {suc_idsucursal: $scope.idSucursal });
        $scope.suc_nombre = $scope.arr_suc[0].suc_nombre;
    }

    $scope.buscar = function() {
        // console.log($scope.MaxAccesoriosRecibida);
        // console.log($scope.MaxAccesoriosDañada);
        // console.log($scope.VEH_SITUACION);

        var empresa = $scope.idEmpresa;
        var sucursal = $scope.idSucursal;
        var vinBuscar = $scope.vin == '' || $scope.vin == undefined ? null : $scope.vin;

        $scope.Inv = {};
        $scope.MostrarInfo = false;
        $scope.MostrarAccesorios = false;
        $scope.puedeGuardar = false;

        if (empresa == 0) {
            swal('Carga Inventarios', 'No se ha seleccionado la empresa.');
        } else if (sucursal == 0 || sucursal == null) {
            swal('Carga Inventarios', 'No se ha seleccionado la sucursal.');
        } else if (vinBuscar == null) {
            swal('Carga Inventarios', 'No se ha ingresado un número de serie.');
        } else {
            cargaInventarioRepository.getAccesoriosInventarioByVin(empresa, sucursal, vinBuscar).then(function(result) {
                if (result.data.length > 0) {
                    $scope.Inv = result.data[0];
                    $scope.Inv.NoInventario++;
                    if($scope.Inv.VEH_SITUACION == $scope.VEH_SITUACION){
                        if ($scope.Inv.iae_idinventacce != null) {
                            $scope.MostrarInfo = true;
                            if ($scope.Inv.detalle.length > 0) {
                                $scope.MostrarAccesorios = true;
                                $scope.puedeGuardar = true;
                            } else {
                                swal('Carga Inventarios', 'La unidad solicitada no cuenta con accesorios configurados.');
                            }
                        } else {
                            swal('Carga Inventarios', 'La unidad solicitada no cuenta con un catálogo para carga de inventario.');
                        }
                    }
                    else{
                        console.log( 'VEH_SITUACION', $scope.Inv.VEH_SITUACION );
                        swal('Carga Inventarios', 'La unidad solicitada no se encuentra en estatus ' + $scope.VEH_SITUACION);
                    }
                } else {
                    swal('Carga Inventarios', 'No se encontró la unidad solicitada.');
                }
            }, function(error) {
                console.log("Error", error);
            });
        }

    }

    $scope.cambiaCant = function(index, recibido) {
        if (recibido) {
            var cant = $scope.Inv.detalle[index].cantRecibida;
            if (cant === undefined) {
                $scope.Inv.detalle[index].cantRecibida = '';
            }
        } else {
            var cant = $scope.Inv.detalle[index].cantDaniados;
            if (cant === undefined) {
                $scope.Inv.detalle[index].cantDaniados = '';
            }
        }
    }

    $scope.guardarInventario = function() {
        $scope.puedeGuardar = false;
        $scope.idsDetalle = [];
        $scope.respuestas = 0;
        var sumaCantRecibida = 0;
        var verificaCant = true;

        var obsGrales = $scope.Inv.Observaciones == null || $scope.Inv.Observaciones == undefined ? '' : $scope.Inv.Observaciones.toUpperCase();
        var invReclama = 0;

        var errores = [];
        $scope.Inv.detalle.forEach(function(item) {
            // console.log(it);
            if (item.cantRecibida === null || item.cantRecibida === '') {
                item.cantRecibida = 0;
            }
            if (item.cantDaniados === null || item.cantDaniados === '') {
                item.cantDaniados = 0;
            }

            sumaCantRecibida += item.cantRecibida;
            if (item.iad_cantdefault != item.cantRecibida) {
                invReclama = 1;
            }

            if (item.cantRecibida < item.cantDaniados) {
                verificaCant = false;
            }

            // console.log(item.caa_descripacce, item.cantRecibida, $scope.MaxAccesoriosRecibida);
            // console.log(item.caa_descripacce, item.cantDaniados, $scope.MaxAccesoriosDañada);
            if( parseInt(item.cantRecibida) > parseInt($scope.MaxAccesoriosRecibida)){
                console.log( 'cantRecibida es mayor a lo permitido' );
                errores.push('La cantidad recibida es mayor a lo permitido en el accesorio ' + item.caa_descripacce);
            }

            if( parseInt(item.cantDaniados) > parseInt($scope.MaxAccesoriosDañada)){
                errores.push('La cantidad dañada es mayor a lo permitido en el accesorio ' + item.caa_descripacce);
                console.log( 'cantDaniados es mayor a lo permitido' );
            }
        });
        $scope.puedeGuardar = true;

        if (sumaCantRecibida > 0) {
            console.log( errores );
            if( errores.length != 0 ){
                var errorHtml = '<ul>';
                errores.forEach( function( str_error ){
                    errorHtml += '<li>'+ str_error +'</li>';
                });
                errorHtml += '</ul>';
                swal({
                  title: 'Carga Inventarios',
                  text: "No se puede guardar el inventario debido a lo siguiente: <br>" + errorHtml,
                  html: true
                });
                // swal('Carga Inventarios', 'Ocurrio los siguientes puntos: ' + );
                $scope.puedeGuardar = true;
            }

            // return false;

            if (verificaCant) {
                var Encabezado = {
                    vin: $scope.Inv.vin,
                    idUsr: $scope.userData.idUsr,
                    iae_idinventacce: $scope.Inv.iae_idinventacce,
                    idDivision: $scope.idDivision,
                    idEmpresa: $scope.idEmpresa,
                    idSucursal: $scope.idSucursal,
                    ObservacionesGrales: obsGrales,
                    reclama: invReclama
                };

                cargaInventarioRepository.insertaEncabezadoInventario(Encabezado).then(function(result) {
                    if (result.data[0].idEncabezadoInventario !== undefined) {
                        console.log( result.data );
                        $scope.InventarioGuardado = result.data[0];
                        $scope.Inv.NoInventario = $scope.InventarioGuardado.Folio;
                        var idEncabezado = result.data[0].idEncabezadoInventario;

                        $scope.Inv.detalle.forEach(function(acce, key) {
                            var obsAcce = acce.observaciones == null || acce.observaciones == undefined ? '' : acce.observaciones.toUpperCase();
                            var estadoAcce = 1;

                            if (acce.cantDaniados == 0) {
                                //1 ok, 2 faltante, 4 excedente
                                if (acce.cantRecibida == acce.iad_cantdefault) {
                                    estadoAcce = 1;
                                } else if (acce.cantRecibida < acce.iad_cantdefault) {
                                    estadoAcce = 2;
                                } else {
                                    estadoAcce = 4;
                                }
                            } else {
                                //3 dañada, 6 dañada faltante, 5 dañada excedente
                                if (acce.cantRecibida == acce.iad_cantdefault) {
                                    estadoAcce = 3;
                                } else if (acce.cantRecibida < acce.iad_cantdefault) {
                                    estadoAcce = 6;
                                } else {
                                    estadoAcce = 5;
                                }
                            }

                            var Accesorio = {
                                idEncabezado: idEncabezado,
                                caa_idacce: acce.caa_idacce[0],
                                recibidos: acce.cantRecibida,
                                daniados: acce.cantDaniados,
                                observaciones: obsAcce,
                                idEstadoAccesorio: estadoAcce
                            };

                            cargaInventarioRepository.insertaDetalleInventario(Accesorio).then(function(result) {
                                $scope.respuestas += 1;

                                if (result.data[0].idDetalleInventario !== undefined) {
                                    $scope.idsDetalle.push(result.data[0].idDetalleInventario);
                                }

                                if ($scope.respuestas == ($scope.Inv.detalle.length)) {
                                    $scope.validaAccesoriosCompletos(idEncabezado);
                                }
                            }, function(error) {
                                console.log("Error", error);
                                $scope.respuestas += 1;
                                alertFactory.warning('No se pudo guardar el accesorio: ' + acce.caa_descripacce + '.');

                                if ($scope.respuestas == ($scope.Inv.detalle.length)) {
                                    $scope.validaAccesoriosCompletos(idEncabezado);
                                }

                            });
                        });

                    } else {
                        swal('Carga Inventarios', 'No se pudo guardar el inventario.');
                        $scope.puedeGuardar = true;
                    }
                }, function(error) {
                    swal('Carga Inventarios', 'Ocurrio un error al guardar inventario.');
                    console.log("Error", error);
                    $scope.puedeGuardar = true;
                });

            } else {
                swal('Carga Inventarios', 'No puede guardar el inventario, la cantidad de accesorios dañados no puede ser mayor a los accesorios recibidos.');
                $scope.puedeGuardar = true;
            }
        } else {
            swal('Carga Inventarios', 'No puede guardar el inventario, el total de los accesorios recibidos debe ser mayor a 0.');
            $scope.puedeGuardar = true;
        }
    }


    $scope.validaAccesoriosCompletos = function(idEncabezado) {
        if ($scope.idsDetalle.length == $scope.Inv.detalle.length) {
            swal({
                title: "Carga Inventarios",
                text: "Se guardó su inventario exitosamente.",
                showCancelButton: false,
                confirmButtonText: "OK",
            },
            function() {
                $scope.print = true;
                $(".tblPrint").show();
                $(".tblNoPrint").hide();
                // location.reload();
            });
        } else {
            cargaInventarioRepository.eliminaInventario(idEncabezado).then(function(result) {
                swal('Carga Inventarios', 'Se presento un error al guardar en al menos uno de los accesorios y la carga no ha sido procesada.');
                $scope.puedeGuardar = true;
            }, function(error) {
                console.log("Error", error);
                swal('Carga Inventarios', 'Error no controlado.');
            });
        }
    }

});