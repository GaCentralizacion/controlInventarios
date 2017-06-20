var LoginView = require('../views/reference'),
    LoginModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var Login = function(conf) {
    this.conf = conf || {};

    this.view = new LoginView();
    this.model = new LoginModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Login.prototype.get_validaLogin = function(req, res, next) {

    var self = this;

    var params = [{name: 'usuario', value: req.query.usuario, type: self.model.types.STRING },
                  {name: 'password', value: req.query.password, type: self.model.types.STRING }];

    self.model.query('SEL_LOGIN_SP', params, function(error, result) {
        if (result.length > 0){
            var UserData = result;
            var idUsuario = UserData[0].idUsuario;

            var params2 = [{name: 'idUsuario', value: idUsuario, type: self.model.types.INT }];

            self.model.query('SEL_PERFILES_USUARIO_SP', params2, function(e, resultado) {
                UserData[0].perfiles = resultado;
                self.view.expositor(res, {
                    error: e,
                    result: UserData
                });s
            });

        }else{
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }
    });
};


module.exports = Login;
