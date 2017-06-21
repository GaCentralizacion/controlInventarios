var LayoutView = require('../views/reference'),
    LayoutModel = require('../models/dataAccess')

var Layout = function(conf) {
    this.conf = conf || {};

    this.view = new LayoutView();
    this.model = new LayoutModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Layout.prototype.get_empresaByUser = function(req, res, next) {
    var self = this;

    var params = [{name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.STRING }];

    self.model.query('SEL_EMPRESA_BY_USUARIO_SP', params, function(error, result) {
        var Empresa = result; 
        
        Empresa.forEach( function( item, key ){
            var param_suc = [{name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
                             {name: 'idEmpresa', value: item.emp_idempresa, type: self.model.types.INT }];

            self.model.query('SEL_SUCURSAL_BY_USUARIO_SP', param_suc, function(err, resultado) {
                var Sucursal = resultado;
                Empresa[ key ].Sucursales = Sucursal;

                if( key >= ( Empresa.length - 1) ){
                    self.view.expositor(res, {
                        error: error,
                        result: Empresa
                    });
                }
            });
        });
    });
}

Layout.prototype.get_anioModelo = function(req, res, next) {
    var self = this;

    var params = [];

    self.model.queryAllRecordSet('SEL_ANIO_MODELO_SP', params, function(error, result) {
        var Modelos = result; 
        self.view.expositor(res, {
            error: error,
            result: Modelos
        });
    });
}

Layout.prototype.get_create = function(req, res, next) {
    var self = this;

    var xl = require('excel4node');
    var wb = new xl.Workbook({
        defaultFont: {
            size: 11,
            name: 'Calibri'
        }
    });
    var ws = wb.addWorksheet("Inventario");

    // Estilos usados en el excel
    var sty_th = wb.createStyle({
        font: { bold: true },
        border: { //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_title = wb.createStyle({
        font: { size: 18, bold: true }
    });

    var sty_litle = wb.createStyle({
        font: { size: 8, bold: true }
    });

    var sty_border = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });
    var sty_underline = wb.createStyle({
        border: { 
            left: {style: 'none', },
            right: {style: 'none', },
            top: {style: 'none', },
            bottom: {style: 'thin', }
        }
    });
    
    var json = {
        empresa: 'ANDRADE UNIVERSIDAD SA DE CV',
        sucursal: ['UNIVERSIDAD', 'SAN ANGEL', 'SAN JERONIMO'],
        vin: 'OKJADLJ93JLA902892213',
        No: 11,
        catalogo: 'SWIFTG78YH',
        descripcion: 'SWIFTG78YH 1.2L GLX 5MT',
        anio: 2018,
        historico:{
            folio: 153,
            levantamiento: '19/10/2017 16:20:44597',
            observaciones: 'OBS GEN',
            previa: '',
            usuario: 'ISMAEL MARTINEZ PABLO'
        },
        accesorios:[
            {folio_rev:153, folio_herr:1, descripcion: 'KIT DE HERRAMIENTA'},
            {folio_rev:153, folio_herr:2, descripcion: 'GATO'},
            {folio_rev:153, folio_herr:3, descripcion: 'POLIZA DE GARANTIA'},
            {folio_rev:153, folio_herr:4, descripcion: 'LLANTA DE REFACCION'},
            {folio_rev:153, folio_herr:5, descripcion: 'TAPETES'},
            {folio_rev:153, folio_herr:5, descripcion: 'ANTENA'},
            {folio_rev:153, folio_herr:5, descripcion: 'MANUALES'},
            {folio_rev:153, folio_herr:5, descripcion: 'TARJETA SD'}
        ]};

    // Se asignan los anchos de las columnas
    ws.column(1).setWidth(24);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(27);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(19);
    ws.column(6).setWidth(30);

    // Fila Inicial
    var row = 1;

    // Titulo
    ws.cell(row, 1 ).string( "Inventario de Accesorios" ).style( sty_title );
    row++;
    row++;
    row++;

    // Empresa y sucursales
    ws.cell(row, 1).string( "EMPRESA" ).style( sty_litle );
    ws.cell(row, 5).string( "SUCURSAL" ).style( sty_litle );
    row++;

    ws.cell(row, 1, row, 2, true).string( json.empresa ).style( sty_underline );
    ws.cell(row, 5, row, 6, true).string( '' ).style( sty_underline );
    ws.addDataValidation({
        type: 'list',
        allowBlank: true,
        prompt: 'Elija una sucursal',
        error: 'Sucursal inválida, debe escoger una de la lista.',
        showDropDown: true,
        sqref: 'E' + row,
        formulas: [json.sucursal.join(',')]
    });
    row++;
    row++;

    // Datos generales del inventario
    ws.cell(row, 1).string( "VIN" ).style( sty_litle );
    ws.cell(row, 2).string( "No. INVENTARIO" ).style( sty_litle );
    ws.cell(row, 3).string( "CATÁLOGO" ).style( sty_litle );
    ws.cell(row, 4, row, 5, true).string( "DESCRIPCIÓN" ).style( sty_litle );
    ws.cell(row, 6).string( "AÑO" ).style( sty_litle );
    row++;

    ws.cell(row, 1).string( json.vin );
    ws.cell(row, 2).number( json.No );
    ws.cell(row, 3).string( json.catalogo );
    ws.cell(row, 4, row, 5, true).string( json.descripcion );
    ws.cell(row, 6).number( json.anio );
    row++;
    row++;

    // Datos generales del inventario
    ws.cell(row, 1).string( "FOLIO DE REVISIÓN" ).style( sty_litle );
    ws.cell(row, 2, row, 3, true).string( "FECHA / HORA DE LEVANTAMIENTO" ).style( sty_litle );
    ws.cell(row, 4).string( "OBSERVACIONES GENERALES" ).style( sty_litle );
    ws.cell(row, 5).string( "PREVIA" ).style( sty_litle );
    ws.cell(row, 6).string( "USAURIO" ).style( sty_litle );
    row++;

    ws.cell(row, 1).number( json.historico.folio );
    ws.cell(row, 2, row, 3, true).string( json.historico.levantamiento );
    ws.cell(row, 4).string( json.historico.observaciones );
    ws.cell(row, 5).string( json.historico.previa );
    ws.cell(row, 6).string( json.historico.usuario );
    row++;
    
    row++;
    row++;
    // Se insertan las cabeceras de la tabla
    ws.cell( row, 1 ).string( 'FOLIO DE REVISIÓN' ).style( sty_th );
    ws.cell( row, 2 ).string( 'FOLIO HERRAMIENTA' ).style( sty_th );
    ws.cell( row, 3 ).string( 'DESCRIPCIÓN HERRAMIENTA' ).style( sty_th );
    ws.cell( row, 4 ).string( 'CANTIDAD RECIBIDA' ).style( sty_th );
    ws.cell( row, 5 ).string( 'CANTIDAD DAÑADA' ).style( sty_th );
    ws.cell( row, 6 ).string( 'OBSERVACIONES' ).style( sty_th );
    row++;

    // Se registra de forma dinámica cada uno de los accesorios
    json.accesorios.forEach(function( item, key ){
        ws.cell( row, 1 ).number( item.folio_rev ).style( sty_border );
        ws.cell( row, 2 ).number( item.folio_herr ).style( sty_border );
        ws.cell( row, 3 ).string( item.descripcion ).style( sty_border );
        ws.cell( row, 4 ).string( '' ).style( sty_border );
        ws.cell( row, 5 ).string( '' ).style( sty_border );
        ws.cell( row, 6 ).string( '' ).style( sty_border );
        ws.row( row ).setHeight(20);
        row++;
    });

    // Se escribe el documento de excel
    var nameLayout =  new Date().getTime() + '.xlsx'
    wb.write( 'app/static/Layout/' + nameLayout, function( err, stats ){
        if (err) {
            console.error(err);
            self.view.expositor(res, {
                error: true,
                result: err
            });
        } 

        self.view.expositor(res, {
            error: false,
            result: {Success: true, Msg: 'Se genero el Layout correctamente', Name: nameLayout}
        });

        setTimeout( function(){
            var fs = require("fs");
            fs.unlink('app/static/Layout/' + nameLayout, function(err) {
               if (err) {
                   return console.error(err);
               }
            });            
        }, 5000 );
    });
};


module.exports = Layout;
