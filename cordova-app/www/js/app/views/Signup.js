define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Signup.html'),

        template = _.template(tpl);


    return Backbone.View.extend({

        events: {
            "click .signUpBtn": "singIn"
        },

        initialize: function () {
            this.IP = 'http://rcyclo-528772216.us-west-2.elb.amazonaws.com';
            this.render();
        },

        render: function () {
            this.$el.html(template());
        },

        singIn: function(){
            var self = this;
            var userName = self.$el.find('.signUpName').val();
            $.ajax({
                url: self.IP + "/users",
                type: 'post',
                data: { "userName" : userName }
            }).done(function(res) {

                localStorage.setItem("smartRecycleUserName", userName);
                //todo: create qr code her
                ////localStorage.setItem('smartRecycleQR', './pics/qrcode.png');
                window.location = '';

            }).fail(function(err, res){
                alert("failed to sign up");
            });

        }


    });

});