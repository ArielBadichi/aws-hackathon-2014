define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/EmployeeList.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function () {
            this.IP = 'http://rcyclo-528772216.us-west-2.elb.amazonaws.com';
            this.render();
            //this.collection.on("reset", this.render, this);
        },

        getScores: function(callback){
            var self = this;
            $.ajax({
                url: self.IP + "/leaderboard",
                type: 'get'

            }).done(function(data) {
                callback(data);
            }).fail(function(err, res){
                alert("fail");
            });

        },

        render: function () {

            var self = this;

            this.getScores(function(scores){
                self.$el.html(template({employees: scores}));

                return self;
            });

        }

    });

});