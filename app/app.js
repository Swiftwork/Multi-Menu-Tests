(function() {
    'use strict';

    /* CONSTRUCTOR */
    var app = angular.module('MultiMenu', ['ui.bootstrap', 'ui.router', 'ngTouch', 'ngStorage', 'frapontillo.bootstrap-switch']);

    /* MAIN CONTROLLER */
    app.controller('MultiMenuController', function($scope, $state, $timeout, $localStorage, $http) {
        var timeout = 200;

        /* Animation style hacks to facilitate auto width */
        var widthStyle = document.createElement('style');
        document.head.appendChild(widthStyle);
        widthStyle = widthStyle.sheet;
        widthStyle.insertRule('.sidebar-right.anim-push.sidebar-open .sidebar-pusher {}', 0);
        widthStyle.insertRule('.sidebar-right.anim-reveal.sidebar-open .sidebar-pusher {}', 0);
        widthStyle.insertRule('.sidebar-left.anim-push.sidebar-open .sidebar-pusher {}', 0);
        widthStyle.insertRule('.sidebar-left.anim-reveal.sidebar-open .sidebar-pusher {}', 0);

        /* Variable: State */
        $scope.$state = $state;

        /* Variable: Stored Settings */
        $scope.settings = $localStorage.$default(generateSettings());

        /* SETTINGS CHANGES */
        $scope.$watch('settings', function() {
            $timeout(function() {
                /* Footer height hacks */
                $scope.footerPadding = $('.footer').outerHeight()
                /* Animation style hacks to facilitate auto width */
                var width = $('.sidebar').outerWidth();
                widthStyle.cssRules[0].style.webkitTransform = 'translate3d(' + width + 'px, 0, 0)';
                widthStyle.cssRules[1].style.webkitTransform = 'translate3d(' + width + 'px, 0, 0)';
                widthStyle.cssRules[2].style.webkitTransform = 'translate3d(-' + width + 'px, 0, 0)';
                widthStyle.cssRules[3].style.webkitTransform = 'translate3d(-' + width + 'px, 0, 0)';
            }, timeout);
            timeout = 0;
        }, true);

        $scope.toggleSidebar = function() {
            if ($scope.settings.toggle === 'sidebar-closed')
                $scope.settings.toggle = 'sidebar-open';
            else
                $scope.settings.toggle = 'sidebar-closed';
        }

        $scope.changeStep = function(step) {
            switch (step) {
                case 'structure':
                    $scope.settings.step = step;
                    $scope.settings.style = 'wireframe';
                    break;
                case 'style':
                    $scope.settings.step = step;
                    $scope.settings.style = 'presentation';
                    break;
                case 'system':
                    $scope.settings.step = step;
                    $scope.settings.style = 'presentation';
                    break;
                case 'save':
                    $scope.settings.step = step;
                    $scope.settings.style = 'presentation';
                    break;
            }
        }

        $scope.changeAltitude = function() {
            switch ($scope.settings.altitude) {
                case 'sidebar-under':
                    if ($scope.settings.animation === 'anim-cover')
                        $scope.settings.animation = 'anim-reveal';
                    break;
                case 'sidebar-equal':
                    break;
                case 'sidebar-over':
                    if ($scope.settings.animation === 'anim-reveal')
                        $scope.settings.animation = 'anim-cover';
                    break;
            }
        }

        $scope.changeSwipe = function(direction) {
            if (!$scope.settings.gestures)
                return;

            if ($scope.settings.placement === 'sidebar-right') {
                if (direction === 'left')
                    $scope.settings.toggle = 'sidebar-open';
                else
                    $scope.settings.toggle = 'sidebar-closed';
            } else {
                if (direction === 'right')
                    $scope.settings.toggle = 'sidebar-open';
                else
                    $scope.settings.toggle = 'sidebar-closed';
            }
        }

        $scope.resetSettings = function() {
            $localStorage.$reset(generateSettings());
        }

        $scope.saveTest = function() {
            $http.post('api.php', $scope.settings).success(function(data) {
                alert(data)
            });
        };
    });

    /* HELPER FUNCTIONS */
    function generateSettings() {
        return {
            id: Math.random().toString(36).substr(2, 9),
            device: WURFL.complete_device_name,
            date: new Date().toLocaleString('sv'),
            step: 'structure',
            style: 'wireframe',
            toggle: 'sidebar-open',
            placement: new Array('sidebar-right', 'sidebar-left')[rand(2)],
            justification: new Array('text-right', 'text-center', 'text-left')[rand(3)],
            iconization: new Array('sidebar-text-only', 'sidebar-icon-only', 'sidebar-text-icon')[rand(3)],
            altitude: new Array('sidebar-under', 'sidebar-equal', 'sidebar-over')[rand(3)],
            fade: new Array(true, false)[rand(2)],
            scrollbar: new Array(true, false)[rand(2)],
            animation: 'anim-push',
            animationtime: 0.3,
            gestures: new Array(true, false)[rand(2)],
            locked: new Array('content-locked', 'content-unlocked')[rand(2)],
            overlay: 0,
            blur: 0,
        };
    }

    function rand(cap1, cap2) {
        var min, max;
        if (typeof cap1 !== 'undefined' && typeof cap2 !== 'undefined') {
            min = cap1;
            max = cap2;
        } else if (typeof cap1 !== 'undefined' && typeof cap2 === 'undefined') {
            min = 0;
            max = cap1;
        } else {
            min = 0;
            max = 1;
        }
        return Math.floor(Math.random() * max) + min;
    }
}());
