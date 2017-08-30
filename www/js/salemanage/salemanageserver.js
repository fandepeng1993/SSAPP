angular.module('ssapp.services')

 .service('salemanageserver', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            salemanage: function () {
            }                 
        };
    }])
     .filter('currencys', function () {
        return function (input,cal) {
            return cal+input;
        };
    })
     .filter('formatnumber', function () {
        return function (input) {
            return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
    });