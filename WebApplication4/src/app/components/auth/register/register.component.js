var register = {
  templateUrl: './register.html',
  controller: 'RegisterController'
};

angular
  .module('components.auth')
  .component('register', register);
 