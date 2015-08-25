'use strict';

import angular = require('angular');

var app = angular.module('bradley.birth');

import BC = require('./BradleyController');
app.controller('BradleyController', BC.BradleyController);