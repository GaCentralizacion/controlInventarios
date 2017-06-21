var layoutURL = global_settings.urlCORS + 'api/layout/';


registrationModule.factory('layoutRepository', function($http) {
    return {
        generateLayout: function() {
            return $http({
                url: layoutURL + 'create/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
