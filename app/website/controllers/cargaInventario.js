var cargaInView = require('../views/reference'),
    cargaInModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var cargaInventario = function(conf) {
    this.conf = conf || {};

    this.view = new cargaInView();
    this.model = new cargaInModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

cargaInventario.prototype.get_insEncabezadoInventario = function(req, res, next){
    var self = this;

    var params = [{name: 'vin', value: req.query.vin , type: self.model.types.STRING},
                  {name: 'idUsr', value: req.query.idUsr , type: self.model.types.INT},
                  {name: 'iae_idinventacce', value: req.query.iae_idinventacce , type: self.model.types.INT},
                  {name: 'idDivision', value: req.query.idDivision , type: self.model.types.INT},
                  {name: 'idEmpresa', value: req.query.idEmpresa , type: self.model.types.INT},
                  {name: 'idSucursal', value: req.query.idSucursal , type: self.model.types.INT},
                  {name: 'idDepartamento', value: req.query.idDepartamento , type: self.model.types.INT},
                  {name: 'ObservacionesGrales', value: req.query.ObservacionesGrales , type: self.model.types.STRING},
                  {name: 'reclama', value: req.query.reclama , type: self.model.types.INT}];

    self.model.query('INS_ENCABEZADO_INVENTARIO_SP', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

cargaInventario.prototype.get_insDetalleInventario = function(req, res, next){
    var self = this;

    var params = [{name: 'idEncabezado', value: req.query.idEncabezado, type: self.model.types.INT},
                  {name: 'caa_idacce', value: req.query.caa_idacce, type: self.model.types.INT},
                  {name: 'recibidos', value: req.query.recibidos, type: self.model.types.INT},
                  {name: 'daniados', value: req.query.daniados, type: self.model.types.INT},
                  {name: 'observaciones', value: req.query.observaciones, type: self.model.types.STRING},
                  {name: 'idEstadoAccesorio', value: req.query.idEstadoAccesorio, type: self.model.types.INT}];

    self.model.query('INS_DETALLE_INVENTARIO_SP', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

cargaInventario.prototype.get_accesoriosInventarioByVin = function(req, res, next) {

    var self = this;

    var params = [{name: 'idempresa', value: req.query.idEmpresa, type: self.model.types.INT },
                  {name: 'idsucursal', value: req.query.idSucursal, type: self.model.types.INT },
                  {name: 'vin', value: req.query.vin, type: self.model.types.STRING }];

    self.model.query('SEL_ENCABEZADO_BY_VIN_SP', params, function(error, result) {
        if (result.length > 0){
            var encabezado = result;
            var idinventacce = encabezado[0].iae_idinventacce;

            var params2 = [{name: 'idempresa', value: req.query.idEmpresa, type: self.model.types.INT },
                           {name: 'idsucursal', value: req.query.idSucursal, type: self.model.types.INT },
                           {name: 'idinventacce', value: idinventacce, type: self.model.types.INT }];

            self.model.query('SEL_DETALLE_SP', params2, function(e, resultado) {
                encabezado[0].detalle = resultado;
                self.view.expositor(res, {
                    error: e,
                    result: encabezado
                });
            });

        }else{
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }
    });
};


module.exports = cargaInventario;
