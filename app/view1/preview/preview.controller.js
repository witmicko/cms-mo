/**
 * Created by michal on 20/03/16.
 */
'use strict';

angular.module('preview', ['ui.bootstrap'])
.controller('EventsCtrl',
    [
        '$rootScope',
        '$scope',
        '$sce',
        'moment',
        '$state',
        '$location',
        '$anchorScroll',
        'select_options',
        '$http',


        function ($rootScope, $scope, $sce, moment, $state, $location,
                  $anchorScroll, select_options, $http) {
            /*
             * Gets the objects from parse
             */

            // $http({
            //     method: 'GET',
            //     url: ' https://api.parse.com/1/classes/event/',
            //     headers: {
            //         'X-Parse-Application-Id': 'ocaUgciKOBo2udPiIbKZ8NOqsXTrFymyQ0TsH9D8',
            //         'X-Parse-REST-API-Key': 'pa7VBoeOadxLdYfL4CZ7UC5iSBbZsUJAuU2Y9CRA',
            //     }
            // }).then(function successCallback(response) {
            //     console.log(response.data.results);
            //     $scope.eventConfigurations.push(response.data.results);
            //     // this callback will be called asynchronously
            //     // when the response is available
            // }, function errorCallback(response) {
            //     console.log(response);
            //     // called asynchronously if an error occurs
            //     // or server returns response with an error status.
            // });

            $scope.options = select_options;
            $scope.mode = "Testing Mode"; // <-- "Testing Mode" buts in buttons etc
            $scope.trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };

              // this is the list of events for the combo at the top right


            $scope.eventConfigurations = [];
            $scope.eventConfigurations.push(testSeminar().results[0]);
            $scope.eventConfigurations.push(testSeminar().results[0]);
            $scope.eventSelected = $scope.eventConfigurations[0];
            $scope.attendees = getTestData($scope.eventSelected.model_type).attendees;
            $scope.currentEditTemp = {};


            $scope.changeOfEvent = function () {
                console.log("changeOfEvent");
                // $scope.eventSelected = $scope.eventConfigurations[0];
            }; // changeOfEvent

            $scope.showSeminarColumns = function () { // should a column or columns appear, if 0 matches prevent an error with Unavailable as appears in error message
                return $scope.eventSelected.offerings.meta.visible == true
            };
            $scope.columnRange = function (colNo) {
                if ($scope.eventSelected == null) return [];
                $scope.columnRanges = []
                var totalColumns = $scope.eventSelected.offerings.meta.columns; // supplied by the user
                var offeringsCount = $scope.eventSelected.offerings.data.length;
                var perColumn = parseInt(offeringsCount / totalColumns, 10);
                // loses odd vale   return _.chunk($scope.eventSelected.offerings,perColumn)[colNo]
                var column0 = 0;
                if (perColumn * totalColumns < offeringsCount) {
                    column0++;
                }
                if (colNo == 0 && perColumn * totalColumns < offeringsCount) {
                    perColumn++; // first column gets the extra value
                }
                if (colNo == 0) {
                    //  console.log($scope.eventSelected.offerings.slice(0,perColumn));
                    return $scope.eventSelected.offerings.data.slice(0, perColumn);
                }
                else {
                    var start = column0 + colNo * perColumn;
                    //  console.log($scope.eventSelected.offerings.slice(start  ,start + perColumn));
                    return $scope.eventSelected.offerings.data.slice(start, start + perColumn);
                }
            }; // columnRange

            var cache = [];
            $scope.wholescope = JSON.stringify($scope, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
            cache = null; // Enable garbage collection

            //Michal.
            //header
            $scope.header_css=[];
            $scope.header_css_change = function (data) {
                $scope.eventSelected.overview.meta.css = data.join(" ");
            };
            $scope.header_data_css=[];
            $scope.header_data_css_change = function (index, data) {
                // var data = $scope.eventSelected.overview.data[index];
                var data_css = data.size + " " + data.colour + " "+data.align;
                $scope.eventSelected.overview.data[index].css = data_css;
            };
            $scope.deleteHeaderData = function (index) {
                $scope.eventSelected.overview.data.splice(index, 1);
            };
            $scope.new_data = {};
            $scope.addHeaderData = function () {
                var data = {};
                data.visible =$scope.new_data.visible || false;
                data.text =$scope.new_data.text;
                var css1 = $scope.new_data.css1 || "rl_font_1_0";
                var css2 = $scope.new_data.css2 || "rl_text_color_black";
                var css3 = $scope.new_data.css3 || "text-center";
                data.css = css1 + " " + css2 + " " + css3 + " ";
                data.style = $scope.new_data.style || "";
                $scope.eventSelected.overview.data.push(data);
                $scope.new_data = {};
            };
            //offerings
            $scope.offerings_column_css=[];
            $scope.offerings_column_css_change = function (data) {
                $scope.eventSelected.offerings.meta.columnCss = data.join(" ");
            };
            $scope.offerings_item_css=[];
            $scope.offerings_item_css_change = function (data) {
                $scope.eventSelected.offerings.meta.itemCss = data.join(" ");
            };
            $scope.offering_data_index=0;
            $scope.offerings_line_css=[];
            $scope.offerings_line_css_change = function (data_idx, line_idx) {
                var line = $scope.offerings_line_css[data_idx]["_"+line_idx];
                // var data = $scope.eventSelected.overview.data[index];
                var line_css = line.pad + " " + line.font;
                $scope.eventSelected.offerings.data[data_idx].lines[line_idx].css = line_css;
            };
            $scope.deleteOfferingLine = function (data_idx, line_idx) {
                $scope.eventSelected.offerings.data[data_idx].lines.splice(line_idx,1);
            };
            $scope.deleteOfferingData = function (data_idx) {
                $scope.eventSelected.offerings.data.splice(data_idx,1);
            };
            $scope.new_offerings_line = {};
            $scope.addOfferingsLine = function (data_idx) {
                var line = {};
                line.text =$scope.new_offerings_line.text;
                var pad  = $scope.new_offerings_line.pad || "rl_padding_left_15";
                var font = $scope.new_offerings_line.font|| "rl_font_1_5";
                line.css = pad + " " + font;
                line.style = $scope.new_offerings_line.style || "";
                $scope.eventSelected.offerings.data[data_idx].lines.push(line);
                $scope.new_offerings_line = {};
            };
            $scope.new_offerings_item = {};
            $scope.addOfferingsItem = function () {
                var item = {};
                item.status= "";
                item.date= "";
                item.quota= -1;
                item.order= $scope.eventSelected.offerings.data.length+1;
                item.visible= $scope.new_offerings_item.visible || false;
                item.tag = $scope.new_offerings_item.tag || "";
                var line = {}
                line.text =$scope.new_offerings_item.text;
                var pad  = $scope.new_offerings_item.pad || "rl_padding_left_15";
                var font = $scope.new_offerings_item.font|| "rl_font_1_5";
                line.css = pad + " " + font;
                line.style = $scope.new_offerings_item.style || "";

                item.lines = [];
                item.lines.push(line);
                $scope.eventSelected.offerings.data.push(item);
                $scope.new_offerings_item = {};
            };
            $scope.submission_container_css=[];
            $scope.submission_container_change = function (data) {
                $scope.eventSelected.template_meta.submission_container_css = data.join(" ");

            };
            $scope.boolOptions = [
                {value: false, label: 'No'},
                {value: true, label: 'Yes'}
            ];
            $scope.processForm = function (data) {
                console.log(data)
            };

            //date
            $scope.active_start = {
                date: moment($scope.eventSelected.active_start,'DD/MM/YYYY').toDate(),
                opened: false
            };
            $scope.open_active_start = function() {
                $scope.active_start.opened = true;
            };
            $scope.active_finish = {
                date: moment($scope.eventSelected.active_finish,'DD/MM/YYYY').toDate(),
                opened: false
            };
            $scope.open_active_finish = function() {
                $scope.active_finish.opened = true;
            };
            $scope.format = 'dd/MM/yyyy';

            $scope.deleteAttendeePos = function (obj) {
                var index = $scope.eventSelected.attendees_meta.positions.indexOf(obj);
                $scope.eventSelected.attendees_meta.positions.splice(index,1);
                console.log(id);
            };
            $scope.saveAttendeePos = function (obj) {
                var new_name = angular.element('#new_position_name-'+obj.id)[0].value;
                var index = $scope.eventSelected.attendees_meta.positions.indexOf(obj);
                $scope.eventSelected.attendees_meta.positions[index].name = new_name;
            };


            $scope.addAttendeePos = function () {
                var name = angular.element('#newPosition')[0].value;
                var id = $scope.eventSelected.attendees_meta.positions.length+1;
                var pos = {
                    id:id,
                    name:name
                };
                angular.element('#newPosition')[0].value='';
                $scope.eventSelected.attendees_meta.positions.push(pos)
            };

            $scope.goToMeta = function() {
                $location.hash('meta');
                $anchorScroll();
            };
            $scope.goToHeader = function() {
                $location.hash('header');
                $anchorScroll();
            };
            $scope.goToOfferings = function() {
                $location.hash('offerings');
                $anchorScroll();
            };
            $scope.goToOrganisation = function() {
                $location.hash('organisation');
                $anchorScroll();
            };
            $scope.goToContact = function() {
                $location.hash('contact');
                $anchorScroll();
            };
            $scope.goToAttendees = function() {
                $location.hash('attendees');
                $anchorScroll();
            };
            $scope.goToSubmission = function() {
                $location.hash('submission');
                $anchorScroll();
            };


        }]); // EventsCtrl


function testSeminar() { // supply a list for test events for proof of concept, in student verion this will be replace
    // by data legally available from the persistence store (parse/mysql/mongodb etc)
    // relevant bridging api will be needed
    return {
        "results": [
            {
                "id": 1,
                "cId": "xyz001",
                "name": "Seminars",
                "nameLowercase": "seminars",
                "model_type": "Seminar",
                "template_meta": {
                    "copiedFrom": "",
                    "type": "template1_seminar",
                    "panel_hover_css": "rl_hover_straw",
                    "submission_container_css": "rl_rcorners15 rl_brd_clr_green rl_brd_solid rl_box_shadow1",
                    "attendee_edit_hover_css": "rl_hover_lime",
                    "description": "Seminar: 1:N,i.e. One offering, 1+ attendees, used when offering is full session/day and no second or more offerings for the attendee"
                },
                "period": "2015",
                "available": true,
                "active": true,
                "active_start": "06/01/2016",
                "active_finish": "03/02/2015",
                "notes": "_",
                "contact": {
                    "meta": {
                        "enabled": true
                    },
                    "data": {
                        "surname": "",
                        "forename": "",
                        "position": "",
                        "email": "",
                        "email2": "",
                        "phone": ""
                    }
                },
                "organisation": {
                    "meta": {
                        "enabled": true,
                        "template": "organisation_maximum",
                        "ui_text_attendee": "Delegate",
                        "ui_text_to_display": "ZZZZ",
                        "requireContactDetails": true,
                        "allowChooser": true,
                        "allowCountyFilter": true,
                        "addressfilterfield": "County",
                        "sectorNo_text": "ZZZZZ No.",
                        "visible_also": [
                            "visible_address1",
                            "address2",
                            "address3",
                            "postcode",
                            "county_region",
                            "sectorNo",
                            "contact_name",
                            "telephone",
                            "fax"
                        ]
                    },
                    "data": {
                        "orgId": "",
                        "name": "",
                        "email": "",
                        "email2": "",
                        "address": "",
                        "County": ""
                    }
                }
                ,
                "attendees_meta": {
                    "maxNo": 10,
                    "max_per_entry": -1,
                    "request_lunch": true,
                    "request_position": true,
                    "positions": [
                        {
                            "id": 1,
                            "name": "aaaaaaaaaaaaaa"
                        },
                        {
                            "id": 2,
                            "name": "bbbbbbbbbbbbb"
                        },

                        {
                            "id": 3,
                            "name": "ccccccccc"
                        }

                    ]
                },
                "overview": {

                    "meta": {
                        "visible": true,
                        "css": "rl_brd_solid rl_brd_clr_black rl_rcorners20 rl_bkg_color_green",
                        "style": "font-size:1.0em"
                    },
                    "data": [
                        {
                            "visible": true,
                            "text": "Seminars",
                            "css": "rl_font_2_5 rl_text_color_black text-center",
                            "style": ""
                        },
                        {
                            "visible": true,
                            "text": "Booking Form June/July 2015",
                            "css": "rl_font_2_0 rl_text_color_black text-center",
                            "style": ""
                        },
                        {
                            "visible": true,
                            "text": "<span style='font-size:2em'>" +
                                        "Dates: " +
                            "       </span>" +
                            "June 25th, 26th, 27th, 28th, 29th, July 1st, 2nd, 3rd",
                            "css": "rl_font_1_0 rl_text_color_black text-center",
                            "style": ""
                        },

                        {
                            "visible": true,
                            "text": "<span style='font-size:2em'>Venues: </span>Various locations countrywide",
                            "css": "rl_font_1_0 rl_text_color_black text-center",
                            "style": ""
                        },

                        {
                            "visible": true,
                            "text": "<span style='font-size:2em'>Time: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is a two and a half hour programme - times vary.",
                            "css": "rl_font_1_0 rl_text_color_black text-center",
                            "style": ""
                        }
                    ]
                },
                "offerings": {
                    "meta": {
                        "visible": true,
                        "columns": 3,
                        "columnCss": "rl_brd_double rl_bkg_color_blue1 rl_rcorners25",
                        "columnStyle": "padding-bottom:10px;  ",
                        "itemCss": "rl_rcorners15 rl_brd_clr_black rl_brd_solid rl_box_shadow1 rl_margin_top_10",
                        "itemStyle": "border-width: 3px; rl_font_1_5 rl_padding_left_15"
                    },
                    "data": [

                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 1,
                            "visible": true,
                            "tag": "",
                            "lines": [{
                                "text": "Monday 25th June 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "10am-12.30pm aaaaaaaaaa",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }
                            ]


                        }
                        ,

                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 2,
                            "visible": true,
                            "lines": [{
                                "text": "Tuesday 26th June 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm -4.30pm bbbbb, bbbbb",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }
                            ]
                        },

                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 3,
                            "visible": true,
                            "lines": [{
                                "text": "Wednesday 27th June 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm-4.30pm cccccccc Hotel, cccccc",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }]
                        },
                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 4,
                            "visible": true,
                            "lines": [{
                                "text": "Thursday 28th June 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm-4.30pm ddddd, ddddd",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }]
                        },

                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 5,
                            "visible": true,
                            "lines": [{
                                "text": "Friday 29th June 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm -4.30pm eeeeeeeeeee Hotel, eeeeeee",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }]
                        },
                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 6,
                            "visible": true,
                            "lines": [{
                                "text": "Monday 1st July 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "10am-12.30pm ffffff Hotel, ffffff",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }]
                        },
                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 7,
                            "visible": true,
                            "lines": [{
                                "text": "Monday 1st July 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm-4.30pm fffffff Hotel, fffffff",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }]
                        },
                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 8,
                            "visible": true,
                            "lines": [{
                                "text": " Tuesday 2nd July 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm-4.30pm ggggggg, gggggg",
                                    "css": "rl_padding_left_15 rl_font_1_2",
                                    "style": ""
                                }]
                        },


                        {
                            "status": "", "date": "", "quota": -1,
                            "order": 9,
                            "visible": true,
                            "lines": [{
                                "text": " Wednesday 3rd July 2015",
                                "css": "rl_padding_left_15 rl_font_1_5",
                                "style": ""
                            },
                                {
                                    "text": "2pm-4.30pm hhhhhhhh, hhhhhhhhhhhh",
                                    "css": "rl_padding_left_15 rl_font_1_1",
                                    "style": ""
                                }]
                        }

                    ]
                }

            }
        ]
    };
}


function getTestData(required) {
    if (required.toUpperCase() === "seminar".toUpperCase()) {
        return{
            "eventId": "OciNCnAtoC",
            "eventName": "Module 2 2 cols",
            "model_type": "Seminar",
            "confirmation": false,
            "template_type": "template1_workshops",
            "attendees": [
                {
                    "order": 3,
                    "choice": "01/10/2015",
                    "firstname": "Patrick1",
                    "lastname": "Bloggs",
                    "position": "tba",
                    "lunch": false
                },
                {
                    "order": 9,
                    "lastname": "Bloggs",
                    "firstname": "Patrick",
                    "position": "tba",

                    "choice": "bbbbbbbbbb - 07/10/2015",
                    "lunch": true
                }
            ],
            "organisation": {
                "id": "WIT",
                "name": "WIT",
                "email": "wit@wit.ie",
                "email2": "wit@wit.ie",
                "orgContactFirstname": "Joe",
                "orgContactLastname": "Bloggs",
                "address1": "abcdefghijklmnopqrztuvwxyz",
                "address2": "abcdefghijklmnopqrztuvwxyz",
                "address3": "abcdefghijklmnopqrztuvwxyz",
                "address4": "abcdefghijklmnopqrztuvwxyz",
                "postcode": "abcdefghijklmnopqrztuvwxyz",
                "telephone": "051051051",
                "fax": "051050051"
            },
            "contact": {
                "lastname": "Bloggs",
                "firstname": "Patrick",
                "email": "joe@joe.ie",
                "email2": "joe@joe.ie"
            },
            "receiptID": ""
        };
    }
    else if(required.toUpperCase() === "Workshop".toUpperCase()){
        return {
            "eventId": "Nj2HRL2B6F",
            "eventName": "Workshop 1",
            "model_type": "Workshop",
            "confirmation": false,
            "template_type": "template1_workshops",
            "attendees": [
                {
                    "lastname": "Jones222",
                    "firstname": "Paddy",
                    "position": "Delta",
                    "choices": [
                        {
                            "session": "14:30-15:45",
                            "workshop": "TAS2"
                        },
                        {
                            "session": "11:45-12:45",
                            "workshop": "Data Protection"
                        }
                    ]
                },
                {
                    "lastname": "Smith234",
                    "firstname": "Alan",
                    "position": "Rho",
                    "choices": [
                        {
                            "session": "13:30-14:45",
                            "workshop": "TAS"
                        },
                        {
                            "session": "11:45-12:45",
                            "workshop": "Data Protection2"
                        }
                    ]
                }

            ],

            "organisation": {
                "id": "WIT",
                "name": "WIT",
                "email": "wit@wit.ie",
                "email2": "wit@wit.ie",
                "address1": "abcdefghijklmnopqrztuvwxyz",
                "address2": "abcdefghijklmnopqrztuvwxyz",
                "address3": "abcdefghijklmnopqrztuvwxyz",
                "address4": "abcdefghijklmnopqrztuvwxyz",
                "postcode": "qwerty",
                "telephone": "051051051",
                "fax": "051050051",
                "orgContactFirstname": "Joe",
                "orgContactLastname": "Bloggs"
            },
            "contact": {
                "lastname": "Bloggs",
                "firstname": "Joe",
                "email": "joe@joe.ie",
                "email2": "joe@joe.ie"
            },
            "receiptID": ""
        };

    }
}    // getTestData
