registrationModule.controller('layoutController', function($scope, $rootScope, $location, alertFactory, layoutRepository, cargaInventarioRepository, filterFilter, md5) {
    $scope.idUsuario     = 71; // 1, 71
    $scope.idEmpresa     = 0;
    $scope.idSucursal    = 0;
    $scope.idModelo      = '';
    $scope.idAnio        = '';
    $scope.key           = '';
    $scope.Alert         = [];
    $scope.LayoutSuccess = false;
    $scope.json          = [];

    $scope.Empresas      = [];
    $scope.Sucursales    = [];
    $scope.Modelo        = [];
    $scope.Accesorios    = [];
    $scope.LayoutFile    = [];


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
        myDropzone = new Dropzone("#idDropzone", { url: "/api/layout/upload/"});
        myDropzone.options.myAwesomeDropzone = {
            paramName: "file", // The name that will be used to transfer the file
            maxFilesize: 10, // MB
            addRemoveLinks: true, 
            uploadMultiple: false,
            maxFiles:1,
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                }
                else { done(); }
            }
        };

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

            // console.log( Info );

            if( $scope.Layout === undefined ){
                $scope.Alert.color   = 'danger';
                $scope.Alert.estatus = 'Error';
                $scope.Alert.msg     = 'El Layout que proporcionó no contiene el formato original.';
                $scope.Alert.btn     = 0; // Intentar con otro layout
            }
            else{
                $scope.LayoutSuccess = true;

                // Validamos la empresa
                if( String($scope.LayoutFile[7][0]) === $scope.Empresa.emp_nombre ){
                    console.log( 'Empresa válida' );
                }
                else{
                    console.warn( 'La empresa es incorrecta' );
                }

                // Validamos la Sucursal
                if( String($scope.LayoutFile[7][4]) === $scope.Sucursal.suc_nombre ){
                    console.log( 'Sucursal válida' );
                }
                else{
                    console.warn( 'La sucursal es incorrecta' );
                }

                // Validamos la catalogo
                if( String($scope.LayoutFile[10][1]) === $scope.ModeloAnio.iae_idcatalogo ){
                    console.log( 'Catálogo válida' );
                }
                else{
                    console.warn( 'El catálogo es incorrecto' );
                }

                // Validamos la Modelo
                if( String($scope.LayoutFile[10][3]) === $scope.ModeloAnio.iae_modelo ){
                    console.log( 'Descripción del modelo válida' );
                }
                else{
                    console.warn( 'Descripción del modelo incorrecta' );
                }

                // Validamos la AñoModelo
                if( parseInt($scope.LayoutFile[10][5]) === $scope.ModeloAnio.iae_anomodelo ){
                    console.log( 'Año del modelo válido' );
                }
                else{
                    console.warn( 'Año del modelo incorrecto' );
                }

                // Validamos que los accesorios sean correctos
                var inicio    = 17;
                var sumatoria = 0;
                $scope.Accesorios.forEach( function( item, key ){
                    $scope.Accesorios[ key ].recibida      = $scope.LayoutFile[ inicio ][2] == '' ? 0 : $scope.LayoutFile[ inicio ][2];
                    $scope.Accesorios[ key ].daniada       = $scope.LayoutFile[ inicio ][3] == '' ? 0 : $scope.LayoutFile[ inicio ][3];
                    $scope.Accesorios[ key ].observaciones = $scope.LayoutFile[ inicio ][4];

                    sumatoria += parseInt( $scope.Accesorios[ key ].recibida );
                    sumatoria += parseInt( $scope.Accesorios[ key ].daniada );
                    inicio++;
                });

                // Validamos que la suma de los accesorios sea diferente de 0 de lo contrario el Layout esta vacío
                // Se pasara a criterio del usuario si va a cargar un inventario en 0´s
                alert( sumatoria );

                // Validamos que el VIN proporcionado por el Layout sea correcto, tenga accesorios y/o pertenezca al modelo especificado.
                var idEmpresa  = $scope.Empresa.emp_idempresa;
                var idSucursal = $scope.Sucursal.suc_idsucursal;
                var VIN        = $scope.LayoutFile[10][0];
                cargaInventarioRepository.getAccesoriosInventarioByVin( idEmpresa, idSucursal, VIN ).then(function(result){
                    $scope.VIN = result.data;
                    console.warn( $scope.VIN );
                }, function(error){
                    console.log("Error", error);
                });
            }

            $scope.observaciones = $scope.LayoutFile[ ( inicio + 2 ) ][2];
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.cancelarInventario = function(){
        location.reload();
    }
});
