define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        QRCode              = require('qrcode'),
        qrcode              = require('html5-qrcode'),
        //EmployeeListView    = require('app/views/EmployeeList'),
        models              = require('app/models/employee'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);


    return Backbone.View.extend({

        events: {
            "keyup .search-key":    "search",
            "keypress .search-key": "onkeypress"
        },

        initialize: function () {
            this.IP = 'http://rcyclo-528772216.us-west-2.elb.amazonaws.com';

            this.employeeList = new models.EmployeeCollection();

            //localStorage.setItem("smartRecycleUserName", null);
            var userName = localStorage.getItem("smartRecycleUserName");

            if (userName !== null && userName !== undefined && userName !== "null") {
                this.render();
            }



        },

        render: function () {
            this.$el.html(template());

            var self = this;
            this.getUserDetails(function(err, user){
                if(err){
                    console.log(err);
                    alert(err);
                } else {
                    //alert(qrcode);
                    var img = showQRCode(localStorage.getItem("smartRecycleUserName"));
                    //alert(img);
                    self.$el.find('.qrcode-area').html(img);
                    //self.$el.find('.user-qr').find('img').attr('src', localStorage.getItem('smartRecycleQR'));
                    self.$el.find('.user-rank').html(user.totalNumberofBottles);
                    self.$el.find('.user-name').html(user.userName);
                }
                //this.listView = new EmployeeListView({collection: this.employeeList, el: $(".scroller", this.el)});
                return this;
            });


        },

        getUserDetails: function(callback){
            var defaultUser = {
                userName: 'An Error occurred',
                totalNumberofBottles: "we don't know"
            };
            var self = this;

            //alert(self.IP + "/users/" + localStorage.getItem('smartRecycleUserName'));
            $.ajax({
                url: self.IP + "/users/" + localStorage.getItem('smartRecycleUserName'),
                type: 'get'

            }).done(function(res) {
                //alert(JSON.stringify(res));

                callback(null, res);

            }).fail(function(err, res){
                alert("fail");
                callback(null, defaultUser);
            });

        },

        search: function (event) {
            var key = $('.search-key').val();
            this.employeeList.fetch({reset: true, data: {name: key}});
        },

        onkeypress: function (event) {
            if (event.keyCode === 13) { // enter key pressed
                event.preventDefault();
            }
        }

    });

});