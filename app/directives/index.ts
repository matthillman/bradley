'use strict';

import angular = require('angular');

var app = angular.module('bradley.birth');

import Menu = require('./Menu');
app.directive(Menu.DirectiveFactory);
import Marked = require('./Marked');
app.directive(Marked.DirectiveFactory);