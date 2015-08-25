'use strict';

import angular = require('angular');

var app = angular.module('bradley.birth');

import Menu = require('./Menu');
import Marked = require('./Marked');
app.directive(Menu.DirectiveFactory);
app.directive(Marked.DirectiveFactory);