// -- =============================================
// -- Author:      Sahirely Yam
// -- Create date: 19/06/2017
// -- Description: Is the container of the application
// -- =============================================
var registrationModule = angular.module("registrationModule", ["ngRoute", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning','ui.grid.edit'])
    .config(function($routeProvider, $locationProvider) {

        /*cheange the routes*/
        $routeProvider.when('/', {
            templateUrl: 'AngularJS/Templates/login.html', //example 1
            controller: 'loginController'
        });
        $routeProvider.when('/generaLayout', {
            templateUrl: 'AngularJS/Templates/Layouts.html',
            controller: 'layoutsController'
        });
        $routeProvider.when('/cargaLayout', {
            templateUrl: 'AngularJS/Templates/cargaLayouts.html'
        });
        $routeProvider.when('/cargaInventario', {
            templateUrl: 'AngularJS/Templates/cargaInventario.html',
            controller: 'cargaInventarioController'
        });
        $routeProvider.when('/notificaciones', {
            templateUrl: 'AngularJS/Templates/notificacionCambioEstatus.html'
        });


        $routeProvider.otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed
        });
        changeHeight(); // when page loads
    };
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})
