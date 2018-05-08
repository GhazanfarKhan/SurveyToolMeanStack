/**
 *
 * @ngdoc module
 * @name components.auth
 *
 * @requires ui.router
 * @requires firebase
 *
 * @description
 *
 * This is the auth module. It includes our auth components
 *
 **/
angular
  .module('components.auth', [
    'ui.router',
    'firebase'
  ])
  .config(function ($firebaseRefProvider) {

    var config = {
        apiKey: "AIzaSyDoJ5cW2x9oQniOjA5oR2kjDJBspqnXRmg",
        authDomain: "survey-tool-799d7.firebaseapp.com",
        databaseURL: "https://survey-tool-799d7.firebaseio.com",
        projectId: "survey-tool-799d7",
        storageBucket: "survey-tool-799d7.appspot.com",
        messagingSenderId: "69181653933"
    };

    $firebaseRefProvider
      .registerUrl({
        default: config.databaseURL,
        contacts: config.databaseURL + '/contacts'
      });

    firebase.initializeApp(config);
  })
  .run(function ($transitions, $state, AuthService) {
    $transitions.onStart({
      to: function (state) {
         return !!(state.data && state.data.requiredAuth);
      }
    }, function() {
      return AuthService
        .requireAuthentication()
        .catch(function (response) {
          return $state.target('auth.login');
        });
    });
    $transitions.onStart({
      to: 'auth.*'
    }, function () {
      if (AuthService.isAuthenticated()) {
        return $state.target('app');
      }
    });
  });
