registrationModule.factory('userFactory', function(localStorageService, alertFactory) {
  return{
    getUserData: function(){
      return (localStorageService.get('userData'));
    },
    saveUserData: function(userData){
      if (userData.perfiles.length > 0){
          userData.perfiles.forEach(function(item){
              switch (item.idPerfil) {
                case 1:
                  userData.generadorLayout = true;
                  break;
                case 2:
                  userData.cargaLayout = true;
                  break;
                case 3:
                  userData.cargaInventario = true;
                  break;
                case 4:
                  userData.notificaciones = true;
                  break;
              }
          });
      }else{
          userData.generadorLayout = true;
          userData.cargaLayout = true;
          userData.cargaInventario = true;
          userData.notificaciones = true;
      }
      localStorageService.set('userData',userData);

      return (localStorageService.get('userData'));
    },
    logOut: function(){
      localStorageService.clearAll();
      location.href = '/';
    },
    ValidaSesion: function(){
      var userData = localStorageService.get('userData');

      if (userData == null || userData == undefined){
        location.href = '/';
      }
    }
  }
});
