var NotificacionView = require('../views/reference'),
    NotificacionModel = require('../models/dataAccess')

var Notificacion = function(conf) {
    this.conf = conf || {};

    this.view = new NotificacionView();
    this.model = new NotificacionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Notificacion.prototype.get_crearNotificacion = function(req, res, next) {
    var self = this;
    var Respuesta = {success:false, msg: ''};
    if( req.query.idEmpresa === undefined ){
        self.view.expositor(res, { error: false,
            result: { success: false, msg: 'No se ha proporcionado el id de la empresa' }
        });
    }
    else if( req.query.idSucursal === undefined ){
        self.view.expositor(res, { error: false,
            result: { success: false, msg: 'No se ha proporcionado el id de la sucursal' }
        });
    }
    else if( req.query.solicitante === undefined ){
        self.view.expositor(res, { error: false,
            result: { success: false, msg: 'No se ha proporcionado el id del solicitante' }
        });
    }
    else if( req.query.identificador === undefined ){
        self.view.expositor(res, { error: false,
            result: { success: false, msg: 'No se ha proporcionado el VIN en cuestión' }
        });
    }
    else{
        var params = [{name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
                      {name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
                      {name: 'solicitante', value: req.query.solicitante, type: self.model.types.INT },
                      {name: 'identificador', value: req.query.identificador, type: self.model.types.STRING }];

        self.model.query('SEL_VALIDA_NOTIFICACION_SP', params, function(error, result) {
            var Parametros = result[0];
            if( Parametros.success ){
                var ParamNoti = [{name: 'identificador', value: Parametros.identificador, type: self.model.types.STRING },
                                 {name: 'descripcion', value: Parametros.descripcion, type: self.model.types.STRING },
                                 {name: 'solicitante', value: Parametros.solicitante, type: self.model.types.INT },
                                 {name: 'aprobador', value: Parametros.aprobador, type: self.model.types.INT },
                                 {name: 'idEmpresa', value: Parametros.idEmpresa, type: self.model.types.INT },
                                 {name: 'idSucursal', value: Parametros.idSucursal, type: self.model.types.INT }];

                self.model.query('[Notificacion].[dbo].[INS_APROBACION_INVENTARIO_SP]', ParamNoti, function(errNoti, resNoti) {
                    // console.log("==== errNoti");
                    // console.log(errNoti);
                    // console.log("==== resNoti");
                    // console.log(resNoti);

                    self.view.expositor(res, {
                        error: errNoti,
                        result: resNoti
                    });
                });
                // console.log( ParamNoti );
            }
            else{
                self.view.expositor(res, {
                    error: error,
                    result: Parametros
                });
            }
        });
    }
}

module.exports = Notificacion;
