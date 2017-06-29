registrationModule.controller('layoutController', function($scope, $rootScope, $location, userFactory, alertFactory, layoutRepository, cargaInventarioRepository, filterFilter, md5) {
    $scope.userData      = userFactory.getUserData();
    $scope.idUsuario     = $scope.userData.idUsr; // 1, 71
    $scope.idEmpresa     = 0;
    $scope.idSucursal    = 0;
    $scope.idModelo      = '';
    $scope.idAnio        = '';
    $scope.key           = '';
    $scope.Alert         = [];
    $scope.LayoutSuccess = false;
    $scope.btnDisabled   = false;
    $scope.json          = [];

    $scope.Empresas      = [];
    $scope.Sucursales    = [];
    $scope.Modelo        = [];
    $scope.Accesorios    = [];
    $scope.LayoutFile    = [];


    $scope.init = function() {
        userFactory.ValidaSesion();
        
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
            $scope.Modelo = result.data[0];
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.EmpresaSeleccionada = function(){
        $scope.Sucursales = filterFilter( $scope.Empresas , {emp_idempresa: $scope.idEmpresa} );
        $scope.Cambios();
    }

    $scope.validaInputs = function(){
        var baseHash = new Date().getTime();
        $scope.key   = md5.createHash( String( baseHash ) );

        if( $scope.idEmpresa == 0 || $scope.idEmpresa === null ){
            swal('Layout','No se ha seleccionado la empresa.');
        }
        else if( $scope.idSucursal == 0 || $scope.idSucursal === null ){
            swal('Layout','No se ha seleccionado la sucursal.');
        }
        else if( $scope.idModelo == '' || $scope.idModelo === null ){
            swal('Layout','No se ha seleccionado el modelo.');
        }
        else if( $scope.idAnio == '' || $scope.idAnio === null){
            swal('Layout','No se ha seleccionado el año.');
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
                    key: $scope.key,
                    empresa: lbl_empresa[0].emp_nombre,
                    sucursal: lbl_sucursal[0].suc_nombre,
                    catalogo: arr_modelo[0].iae_idcatalogo,
                    descripcion: arr_modelo[0].iae_modelo,
                    anio: parseInt($scope.idAnio),
                    accesorios: $scope.Accesorios
                };
            }, function(error){
                console.log("Error", error);
            });
        }
    }

    $scope.generateLayout = function(){
        layoutRepository.insertLayout( $scope.idEmpresa, $scope.idSucursal, $scope.idModelo, $scope.idAnio, $scope.idUsuario, $scope.key ).then(function(result){
            var Layout = result.data;
            layoutRepository.generateLayout( $scope.json ).then(function(result){
                var Resultado = result.data;
                window.open('Layout/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
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

    var myDropzone
    $scope.Dropzone = function(){
        myDropzone = new Dropzone("#idDropzone", { 
            url: "/api/layout/upload/",
            uploadMultiple: 0,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        myDropzone.on("success", function(req, res) {
            var filename = res.filename + '.xlsx';
            $scope.readLayout( filename );

            $(".row_dropzone").hide();
        });
        
    }

    $scope.readLayout = function( filename ){
        layoutRepository.readLayout( filename ).then(function(result){
            var LayoutFile = result.data.data;
            $scope.LayoutFile = LayoutFile;

            var key = LayoutFile[0][5];

            $scope.validaLayout( key );
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.validaLayout = function( key ){
        // var key = 'c7a0fd6b564ae60b81846959bba54839';
        // var key = 'f67ab6f0593791373903f3834f4e190e1';

        layoutRepository.validaLayout( key ).then(function(result){
            var Info = result.data;
            $scope.Layout      = Info[0][0];
            $scope.Empresa     = Info[1][0];
            $scope.Sucursal    = Info[2][0];
            $scope.ModeloAnio  = Info[3][0];
            $scope.Accesorios  = Info[4];

            if( $scope.Layout === undefined ){
                $scope.Alert.color   = 'danger';
                $scope.Alert.estatus = 'Error';
                $scope.Alert.msg     = 'El Layout que proporcionó no contiene el formato original.';
                $scope.Alert.acc     = true;
                $scope.Alert.btn     = 0; // Intentar con otro layout
            }
            else{
                $scope.LayoutSuccess = true;
                var errLayout = [];
                // Validamos la empresa
                if( String($scope.LayoutFile[7][0]) === $scope.Empresa.emp_nombre ){
                    console.log( 'Empresa válida' );
                }
                else{
                    errLayout.push( 'La empresa es incorrecta, debe ser: ' + $scope.Empresa.emp_nombre );
                }

                // Validamos la Sucursal
                if( String($scope.LayoutFile[7][4]) === $scope.Sucursal.suc_nombre ){
                    console.log( 'Sucursal válida' );
                }
                else{
                    errLayout.push( 'La sucursal es incorrecta, debe ser: ' + $scope.Sucursal.suc_nombre );
                }

                // Validamos la catalogo
                if( String($scope.LayoutFile[10][1]) === $scope.ModeloAnio.iae_idcatalogo ){
                    console.log( 'Catálogo válida' );
                }
                else{
                    errLayout.push( 'El catálogo es incorrecto, debe ser: ' + $scope.ModeloAnio.iae_idcatalogo );
                }

                // Validamos la Modelo
                if( String($scope.LayoutFile[10][3]) === $scope.ModeloAnio.iae_modelo ){
                    console.log( 'Descripción del modelo válida' );
                }
                else{
                    errLayout.push( 'Descripción del modelo incorrecta, debe ser: ' + $scope.ModeloAnio.iae_modelo );
                }

                // Validamos la AñoModelo
                if( parseInt($scope.LayoutFile[10][5]) === $scope.ModeloAnio.iae_anomodelo ){
                    console.log( 'Año del modelo válido' );
                }
                else{
                    errLayout.push( 'Año del modelo incorrecto, debe ser: ' + $scope.ModeloAnio.iae_anomodelo );
                }

                // Validamos que los accesorios sean correctos
                var inicio    = 17;
                var sumatoria = 0;
                $scope.reclama = 0;
                $scope.Accesorios.forEach( function( item, key ){
                    $scope.Accesorios[ key ].recibida      = $scope.LayoutFile[ inicio ][2] == '' ? 0 : $scope.LayoutFile[ inicio ][2];
                    $scope.Accesorios[ key ].daniada       = $scope.LayoutFile[ inicio ][3] == '' ? 0 : $scope.LayoutFile[ inicio ][3];
                    $scope.Accesorios[ key ].observaciones = $scope.LayoutFile[ inicio ][4];

                    // Validamos el estatus de reclamacion 
                    if( $scope.Accesorios[ key ].recibida != item.iad_cantdefault ){
                        $scope.reclama = 1;
                    }

                    // Validamos los estatus de cada partida
                    var totalAccePartida = 0;
                    totalAccePartida = parseInt( $scope.Accesorios[ key ].recibida ) + parseInt( $scope.Accesorios[ key ].daniada );

                    if( parseInt( $scope.Accesorios[ key ].daniada ) == 0 ){
                        if( parseInt( $scope.Accesorios[ key ].recibida ) == item.iad_cantdefault ){
                            $scope.Accesorios[ key ].lblestatus = 'OK'; // 1
                            $scope.Accesorios[ key ].estatus = 1; // 1
                        }
                        else if( parseInt( $scope.Accesorios[ key ].recibida ) < item.iad_cantdefault  ){
                            $scope.Accesorios[ key ].lblestatus = 'FALTANTE'; // 2
                            $scope.Accesorios[ key ].estatus = 2; // 2
                        }
                        else{
                            $scope.Accesorios[ key ].lblestatus = 'EXCEDENTE'; // 4
                            $scope.Accesorios[ key ].estatus = 4; // 4
                        }
                    }
                    else{
                        if( parseInt( $scope.Accesorios[ key ].recibida ) == item.iad_cantdefault ){
                            $scope.Accesorios[ key ].lblestatus = 'DAÑADA'; // 3
                            $scope.Accesorios[ key ].estatus = 3; // 3
                        }
                        else if( parseInt( $scope.Accesorios[ key ].recibida ) < item.iad_cantdefault  ){
                            $scope.Accesorios[ key ].lblestatus = 'DAÑADA FALTANTE'; // 6
                            $scope.Accesorios[ key ].estatus = 6; // 6
                        }
                        else{
                            $scope.Accesorios[ key ].lblestatus = 'DAÑADA EXCEDENTE'; // 5
                            $scope.Accesorios[ key ].estatus = 5; // 5
                        }
                    }

                    sumatoria += parseInt( $scope.Accesorios[ key ].recibida );
                    sumatoria += parseInt( $scope.Accesorios[ key ].daniada );
                    if( parseInt( $scope.Accesorios[ key ].daniada ) > parseInt( $scope.Accesorios[ key ].recibida ) )
                        errLayout.push( 'Las cantidades dañadas superan a las recibidas en el accesorio ' + $scope.Accesorios[ key ].caa_descripacce );
                    inicio++;
                });

                // Validamos que la suma de los accesorios sea diferente de 0 de lo contrario el Layout esta vacío
                // Se pasara a criterio del usuario si va a cargar un inventario en 0´s
                if( sumatoria == 0 ){
                    errLayout.push( 'El Layout que proporciona tiene las cantidades en ceros' );
                }

                // Verificamos mediante errLayout si los valores de la cabecera no han sido midiciados
                // el tamaño de la variable errLayout debera valer 0 para garantizar que todos los puntos los ha pasado satisfactoriamente
                if( errLayout.length != 0 ){
                    $scope.Alert.color   = 'warning';
                    $scope.Alert.estatus = 'Advertencia';
                    $scope.Alert.msg     = 'Se han presentado las siguientes Observaciones al momento de validar el Layout:';
                    $scope.Alert.err     = errLayout;
                    $scope.Alert.acc     = true;
                    $scope.Alert.btn     = 0; // 1 Guardar de todos modos
                }
                else{
                    $scope.Alert.color   = 'success';
                    $scope.Alert.estatus = 'Datos Validados';
                    $scope.Alert.msg     = 'Los datos del Layout proporcionado fueron validados correctamente.';
                    $scope.Alert.err     = errLayout;
                    $scope.Alert.acc     = true;
                    $scope.Alert.btn     = 2; // Guardar de todos modos
                }

                // Validamos que el VIN proporcionado por el Layout sea correcto, tenga accesorios y/o pertenezca al modelo especificado.
                var idEmpresa  = $scope.Empresa.emp_idempresa;
                var idSucursal = $scope.Sucursal.suc_idsucursal;
                var VIN        = $scope.LayoutFile[10][0];
                cargaInventarioRepository.getAccesoriosInventarioByVin( idEmpresa, idSucursal, VIN ).then(function(result){
                    $scope.VIN = result.data[0];
                    var errLayout = [];

                    if( $scope.VIN === undefined ){
                        $scope.Alert.color   = 'danger';
                        $scope.Alert.estatus = 'No existe VIN';
                        $scope.Alert.msg     = 'VIN '+ VIN +' no encontrado en base de datos, solicite verificar este campo.';
                        $scope.Alert.acc     = true;
                        $scope.Alert.btn     = 0; // Intentar con otro layout
                    }
                    else{
                        if( $scope.VIN.anioModelo === null && $scope.VIN.catalogo === null && $scope.VIN.modelo === null ){
                            $scope.Alert.color   = 'danger';
                            $scope.Alert.estatus = 'Sin catálogo';
                            $scope.Alert.msg     = 'El VIN que proporciona no cuenta con un catalogo de Accesorios';
                            $scope.Alert.acc     = true;
                            $scope.Alert.btn     = 0; // Intentar con otro layout
                        }
                        else if( ( parseInt( $scope.VIN.anioModelo ) != parseInt( $scope.ModeloAnio.iae_anomodelo ) )
                            || ( $scope.VIN.catalogo != $scope.ModeloAnio.iae_idcatalogo )
                            || ( $scope.VIN.modelo != $scope.ModeloAnio.iae_modelo ) ){

                            errLayout.push( 'CATÁLOGO: ' + $scope.VIN.catalogo );
                            errLayout.push( 'MODELO: ' + $scope.VIN.modelo );
                            errLayout.push( 'AÑO MODELO: ' + $scope.VIN.anioModelo );
                            
                            $scope.Alert.color   = 'danger';
                            $scope.Alert.estatus = 'Advertencia';
                            $scope.Alert.msg     = 'El VIN ' + $scope.VIN.vin + ' pertenece a un modelo distinto al Layout:';
                            $scope.Alert.acc     = true;
                            $scope.Alert.err     = errLayout;
                            $scope.Alert.btn     = 0; // Intentar con otro layout
                        }
                    }
                }, function(error){
                    console.log("Error", error);
                });
            }

            $scope.observaciones = $scope.LayoutFile[ ( inicio + 2 ) ][2];
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.guardarInventario = function(){
        $scope.btnDisabled   = true;
        var Encabezado  = { vin: $scope.VIN.vin,
                           idUsr: $scope.userData.idUsr,
                           iae_idinventacce: $scope.VIN.iae_idinventacce,
                           idDivision: $scope.Empresa.div_iddivision,
                           idEmpresa:  $scope.Empresa.emp_idempresa,
                           idSucursal: $scope.Sucursal.suc_idsucursal,
                           ObservacionesGrales: $scope.observaciones.toUpperCase(),
                           reclama: $scope.reclama
                       };

        cargaInventarioRepository.insertaEncabezadoInventario(Encabezado).then(function(result){
            console.log(result);
            if (result.data[0].idEncabezadoInventario !== undefined){
            // if (result.data.length > 0){
                var idEncabezado  =  result.data[0].idEncabezadoInventario;
                $scope.idsDetalle = [];
                $scope.respuestas = 0;
                $scope.Accesorios.forEach( function( item, key ){
                    var Accesorio = { idEncabezado: idEncabezado,
                                       caa_idacce: item.caa_idacce[0],
                                       recibidos: parseInt( item.recibida ),
                                       daniados: parseInt( item.daniada ),
                                       observaciones: item.observaciones.toUpperCase(),
                                       idEstadoAccesorio: item.estatus };
                    
                    cargaInventarioRepository.insertaDetalleInventario(Accesorio).then(function(result){
                        $scope.respuestas += 1;
                        // if( result.data.length > 0 ){
                        if (result.data[0].idDetalleInventario !== undefined){
                            $scope.idsDetalle.push(result.data[0].idDetalleInventario);
                        }

                        if( $scope.respuestas == $scope.Accesorios.length ){
                            $scope.validaAccesoriosCompletos()
                        }
                    }, function(error){
                        console.log("Error", error);
                        $scope.respuestas += 1;
                        alertFactory.warning('No se pudo guardar el accesorio: ' + acce.caa_descripacce + '.');

                        if ($scope.respuestas == ($scope.Inv.detalle.length)){
                            $scope.validaAccesoriosCompletos();
                        }
                    });
                });
            }
            else{
                swal('Carga Inventarios','No se pudo guardar el inventario.');
            }
        }, function(error){
            swal('Carga Inventarios','No se pudo guardar su inventario.');
            console.log("Error", error);
        });        
    }

    $scope.validaAccesoriosCompletos = function(){
        if( $scope.idsDetalle.length >= $scope.Accesorios.length  ){
            swal({
                title: "Carga Inventarios",
                text: "Se guardó su inventario exitosamente",
                showCancelButton: false,
                confirmButtonText: "OK",
            },
            function(){
                location.reload();
            });
        }
        else{
            cargaInventarioRepository.eliminaInventario(idEncabezado).then(function(result){
                console.log( 'success', result.data[0].success )
                console.log( result )
                swal('Carga Inventarios','Se presento un error al guardar en al menos uno de los accesorios y la carga no ha sido procesada.');
            }, function(error){
                console.log("Error", error);
                swal('Carga Inventarios','Error no controlado.');
            });
        }
    }

    $scope.cancelarInventario = function(){
        location.reload();
    }
});
