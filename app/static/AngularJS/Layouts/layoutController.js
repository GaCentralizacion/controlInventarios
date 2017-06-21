registrationModule.controller('layoutController', function($scope, $rootScope, $location, alertFactory, layoutRepository) {
    $scope.init = function() {

    }

    $scope.generateLayout = function(){
    	layoutRepository.generateLayout() .then(function(result){
    		var Resultado = result.data;
    		window.open('Layout/' + Resultado.Name);
        }, function(error){
            console.log("Error", error);
        });
    }
});
