angular.module('ssapp.services')

	//出差报告管理
    .service('finacialserver', ['$http', '$q', 'ConfigService', 'commonService', function ($http, $q, ConfigService, commonService) {
        return {
            finacialS: function () {
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