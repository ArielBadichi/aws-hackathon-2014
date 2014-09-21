define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        PageSlider  = require('app/utils/pageslider'),
        HomeView    = require('app/views/Home'),

        slider = new PageSlider($('body')),

        homeView = new HomeView();

    return Backbone.Router.extend({

        routes: {
            "": "home",
            //"employees/:id": "employeeDetails",
            //"employees/:id/reports": "reports",
            "signup": "signup",
            "leaderboard": "displayScores"
        },

        home: function () {

            homeView.delegateEvents();

            //localStorage.setItem("smartRecycleUserName", null);
            var userName = localStorage.getItem("smartRecycleUserName");

            if (userName === null || userName === undefined || userName === "null") {
                this.signup();
            } else {
                slider.slidePage(homeView.$el);
            }
        },

        signup: function(){
            require(["app/views/Signup"], function(signupView){
                slider.slidePage(new signupView().$el);
            });
        },

//        employeeDetails: function (id) {
//            require(["app/models/employee", "app/views/Employee"], function (models, EmployeeView) {
//                var employee = new models.Employee({id: id});
//                employee.fetch({
//                    success: function (data) {
//                        slider.slidePage(new EmployeeView({model: data}).$el);
//                    }
//                });
//            });
//        },
//
//        reports: function (id) {
//            require(["app/models/employee", "app/views/Reports"], function (models, ReportsView) {
//                var employee = new models.Employee({id: id});
//                employee.fetch({
//                    success: function (data) {
//                        slider.slidePage(new ReportsView({model: data}).$el);
//                    }
//                });
//            });
//        },

        displayScores: function(){

            require(["app/views/EmployeeList"], function(EmployeeListView){
                slider.slidePage(new EmployeeListView().$el);
            });
        }

    });

});