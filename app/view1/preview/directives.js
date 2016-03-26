var genericApp = angular.module('myApp');


genericApp.directive('contactdetailstemplate1',
    [
        '$compile',
        '$templateCache',

    function ($compile, $templateCache) {
        var getTemplateUrl = function () {
            return "view1/preview/form_preview/contactDetails_template1.html";
        };

        return {

            require: '^form',

            // this could become switchable if necessary
            templateUrl: "view1/preview/form_preview/contactDetails_template1.html",

            restrict: 'E',
            scope: { // local $scope
                globalReset: "&",
                contact: "=",
                contactValid: "="
            },

            link: function (scope, element, attrs) {
                scope.$watch('contactDetails.$valid', function (newData, oldData) {
                    // contactDetails is the form data
                    scope.contactValid = scope.contactDetails.$valid
                });


                scope.$watch('globalReset()', function (newData, oldData) {  // second pass has the data
                    // monitors the refresh of the parent and causes a refresh here also
                    console.log("contact reset()");
                    var dataHTML = $templateCache.get(getTemplateUrl());
                    element.html(dataHTML);
                    $compile(element.contents())(scope);
                    scope.formData = {};   // this is the local formData when in the subview
                    scope.formData.contact = scope.contact; // wire back to parent formData


                });


            },   // link

            controller: function ($scope) { // not dollar
                console.log("contact details  controller");
                $scope.emailsMatch = function () {
                    if ($scope.formData === undefined)
                        return true; // may be no structure on first rendering
                    return $scope.formData.contact.email === $scope.formData.contact.email2;
                }

                $scope.resetCurrentEdit = function () {
                    for (var key in $scope.formData.contact) {
                        // check also if property is not inherited from prototype
                        if ($scope.formData.contact.hasOwnProperty(key)) {
                            $scope.formData.contact[key] = "";
                        }
                    }
                    $scope.contact = $scope.formData.contact;
                }
            }
        };
    }]); // contactdetailstemplate1


genericApp.directive('organisationdetailstemplate1',
    [
        '$compile',
        '$templateCache',
        'OrganisationStateTemplate1',
        '$templateRequest',
        '$q',

        function ($compile, $templateCache, orgState, $templateRequest, $q) {

            return {
                restrict: 'E',

                scope: { // local $scope         // its the attribute that is normalised to the value of :
                    organisation: "=",  // the data structure to populate
                    organisationUIText: "=", //text to display etc school etc
                    organisationUISectorNoText: "=", // school roll number etc
                    extraMeta: "=",
                    useTemplate: "=",
                    globalReset: "&",
                    globalRedraw: "&",
                    organisationValid: "="
                },

                link: function (scope, element, attrs) {  // make sure the form has data

                    scope.organisationUIText = scope.organisationUIText || "Organisation";
                    scope.organisationUISectorNoText = scope.organisationUISectorNoText || "Organisation Id";

                    //scope.globalReset =   scope.globalReset || 0;
                    scope.formMeta = {
                        "organisationUIText": scope.organisationUIText,
                        "organisationUISectorNoText": scope.organisationUISectorNoText
                    };


                    var deferred = $q.defer();

                    var resetForm = function () {
                        var fieldsRequired;
                        console.log("organisation resetForm()");
                        fieldsRequired = orgState.fn.setTemplateRequirements(scope.useTemplate);

                        if (scope.organisation == null) { // set the fields based on the template
                            scope.organisation = angular.copy(fieldsRequired);
                        }

                        $templateRequest(orgState.formMeta.template).then(function (html) {
                            var template = angular.element(html); // Convert the html to an actual DOM node
                            element.html(template); // Append it to the directive element

                            scope.formData = {};   // this is the local formData when in the subview
                            scope.formData.organisation = scope.organisation; // wire back to parent formData


                            $compile(template)(scope); // And let Angular $compile it

                            scope.$watch('organisationDetails.$valid', function (newData, oldData) {
                                scope.organisationValid = scope.organisationDetails.$valid
                            });

                            deferred.resolve("ok");

                        }).catch(function (Res) {
                            deferred.reject(Res);
                        });

                        return deferred.promise;
                    }

                    scope.$watch('globalReset()', function (newData, oldData) {  // second pass has the data
                        // monitors the refresh of the parent and causes a refresh here also
                        promiseW = resetForm();
                    });

                    scope.$watch('globalRedraw()', function (newData, oldData) {  // second pass has the data
                        // monitors the refresh of the parent and causes a refresh here also
                        promiseW = resetForm();
                    });


                    if (deferred.promise.state == "pending") {
                        console.log("deferred.pending()");
                    }
                    deferred.promise.then(function () {
                        scope.organisation = scope.formData.organisation;     // wire back to parent view bi-directional
                        deferred = $q.defer();
                    });

                },   // link

                controller: function ($scope) { // not dollar
                    console.log("organisational details  controller");

                    $scope.fn = orgState.fn; // 1:1 name between scope and state

                    $scope.organisationSearch = function () {
                        alert("implement this feature later");
                    }

                    $scope.resetCurrentEdit = function () {
                        for (var key in $scope.formData.organisation) {
                            // check also if property is not inherited from prototype
                            if ($scope.formData.organisation.hasOwnProperty(key)) {
                                $scope.formData.organisation[key] = "";
                            }
                        }
                    }

                    $scope.emailsMatch = function () {
                        if ($scope.formData === undefined)
                            return true; // may be no structure on first rendering
                        return $scope.formData.organisation.email === $scope.formData.organisation.email2;
                    }
                } // controller
            };
        }]); // organisationdetailstemplate1


//**********************

//              workshopattendees  for Workshops

// ************************


// a directive to allow a list of names to be edited used by
//   /#/events

genericApp.directive('workshopattendees', ['$compile', '$templateCache',

    function ($compile, $templateCache) {

// a directive to allow a list of names to be edited
        var getTemplateUrl = function () {
            return "view1/preview/form_preview/workshopattendees_template2.html";
        };

        return {
            // this could become switchable if necessary
            templateUrl: getTemplateUrl,

            restrict: 'E',
            scope: { // local $scope

                // formMeta is now generic to my patters     formMeta :"=",   // information about the form in parent
                globalReset: "&",
                isSavingForm: "=",   // normalised from is-saving-form
                workshopsMeta: "=",     // met
                attendees: '=attendees', // the data we are trying to generate
                attendeePositions: "=",  // for the select option
                attendeesValid: "=", // ng-form name used twice?
                attendeesMax: "="

            },

            link: function (scope, element, attrs) {

                scope.formData = {}; // this view/form not the parent

                scope.attendeesMax = scope.attendeesMax || 10;

                scope.$watch('globalReset()', function (newData, oldData) {  // second pass has the data
                    // monitors the refresh of the parent and causes a refresh here also

                    console.log("workshopattendees reset() " + newData + " was " + oldData);
                    scope.attendees = scope.attendees || [];
                    if (scope.attendees.length == 0) {  // always have one blank attendee row
                        var workshopsSlots = angular.copy(scope.workshopsMeta.data); // blank slots

                        scope.attendees.push({
                            "lastname": "", "firstname": "", "position": "",
                            "choices": workshopsSlots
                        });
                    }

                    if (scope.attendeePositions.length == 0) {
                        scope.attendeePositions = [{"id": 1, "name": "Other"}];
                    }

                    scope.formData.attendees = scope.attendees;

                    var dataHTML = $templateCache.get(getTemplateUrl());
                    element.html(dataHTML);
                    $compile(element.contents())(scope);  // render the html etc.

                    scope.$watch('workshopDetails.$valid', function (newData, oldData) {
                        // workshopdetails is the form data
                        scope.attendeesValid = scope.workshopDetails.$valid
                    });
                });

            },   // link

            controller: function ($scope) { // not dollar
                console.log("workshop attendee controller");

                // put functions here causes issues with

                $scope.attendeeLimitReached = function () {

                    return !($scope.attendees.length < $scope.attendeesMax);
                }

                $scope.addAttendeeRow = function () {

                    var workshopsSlots = angular.copy($scope.workshopsMeta.data); // blank slots

                    $scope.formData.attendees.push({
                        "lastname": "", "firstname": "", "position": "",
                        "choices": workshopsSlots
                    });
                }

                $scope.removeAttendeeRow = function (index) {
                    $scope.formData.attendees.splice(index, 1);

                }
            }


        };
    }]); // workshopattendees


//**********************

//              seminarattendees  for Seminars

// ************************


// a directive to allow a list of names to be edited used by
//   /#/events

genericApp.directive('seminarattendees', ['$compile', '$templateCache', 'ADStateTemplate1',

    function ($compile, $templateCache, adStateTemplate1) {

// a directive to allow a list of names to be edited
        var getTemplateUrl = function () {
            return "view1/preview/form_preview/seminarattendees_template1.html";
        };

        return {
            // this could become switchable if necessary
            templateUrl: getTemplateUrl,

            restrict: 'E',
            scope: { // local $scope
                globalReset: "&",
                _meta: "=meta",
                // formMeta is now generic to my patters     formMeta :"=",   // information about the form in parent
                isSavingForm: "=",   // normalised from is-saving-form
                attendees: '=attendees',
                attendeePositions: '=attendeePositions',

                notifyMe: "&notifyMe",
                attendeeChoices: "=",
                attendeeDetailsOptions: "=",
                attendChildScope: "=",
                attendeesValid: "=", // ng-form name used twice?
                attendeesMax: "="

            },

            link: function (scope, element, attrs) {
                // https://thinkster.io/a-better-way-to-learn-angularjs/scope-vs-scope
                // scope is merged with $scope in the controller  ???
                // so do the dynamic stuff here and merge


                scope.attendeesMax = scope.attendeesMax || 10;

                var previousCounter = -1;
                var previousScope = null;

                scope.$watch('globalReset()', function (newData, oldData) {  // second pass has the data
                    // monitors the refresh of the parent and causes a refresh here also
                    console.log("seminarattendees reset() " + newData + " was " + oldData);

                    // Avoid memory leaks   http://roubenmeschian.com/rubo/?p=51

                    scope.formMeta = {};
                    // before added to the list
                    scope.formMeta.currentEditTemp = {
                        "_meta_order": -1,
                        "lastname": "",
                        "firstname": "",
                        "position": "",
                        "lunch": false
                    };


                    scope.formMeta.currentEditTempIndex = -1;
                    scope.formData = {};
                    scope.formData.attendees = scope.attendees;


                    // positions of attendees from the file override generic positions from the cloud catches the select/option change at top of page
                    if (scope.attendeePositions.length == 0)
                    //if (scope._meta.attendees_meta.positions.length == 0)
                    {
                        scope.attendeePositions = [{"id": 1, "name": "Other"}];
                    }
                    //else {
                    //      // the event configuration is supplying its own specific positions
                    //          scope.attendeePositions = scope._meta.attendees_meta.positions;
                    //      }
                    // take the offerings and prepare them to be available in the selection/options choice.

                    // the filter may be redundant here if this operation is performed when data loaded                     
                    var preparedChoices = scope._meta.offerings.data.filter(function (item) {
                            return item.visible == true
                        })
                        .map(function (item) {
                            return {"_meta_order": item.order, "name": item.lines[0].text + " - " + item.lines[1].text};
                        })


                    //       element.contents().remove();
                    var dataHTML = $templateCache.get(getTemplateUrl());
                    element.html(dataHTML);
                    scope.attendeeChoices = preparedChoices; // this is the list of events presented via select / option
                    $compile(element.contents())(scope);  // render the html etc.       

                    scope.$watch('seminarDetails.$valid', function (newData, oldData) {
                        // seminarDetails is the form data
                        scope.attendeesValid = scope.seminarDetails.$valid
                    });

                }); // watch


            },   // link

            controller: function ($scope) { // not dollar
                console.log("seminar attendee controller");
                $scope.zeroAttendees = "The list of attendee(s) will appear after data entry via the panel on the left. Use 'add attendee' to add to the list.";

                //   $scope.fn = adStateTemplate1.fn; // 1:1 name between scope and state

                // always get the latest state
                //  $scope.formData = adStateTemplate1.formData;
                //  $scope.formMeta = adStateTemplate1.formMeta;
                $scope.attendeeLimitReached = function () {

                    return !($scope.attendees.length < $scope.attendeesMax);
                }


                $scope.removeAttendeeRow = function (dIndex) {
                    if ($scope.formMeta.currentEditTempIndex == dIndex) {
                        $scope.resetCurrentEdit();
                    }
                    $scope.formData.attendees.splice(dIndex, 1);
                };

                $scope.addAttendeeRow = function () {

                    if ($scope.formMeta.currentEditTempIndex == -1) {  // new entry
                        console.log("attendees.length = " + $scope.formData.attendees.length);
                        $scope.formData.attendees.push(angular.copy($scope.formMeta.currentEditTemp));
                    }
                    else { // update existing entry
                        $scope.formData.attendees[$scope.formMeta.currentEditTempIndex] = $scope.formMeta.currentEditTemp;
                    }
                    // always sort after a change ??? 

                    $scope.resetCurrentEdit(); // clear the form for next name
                };


                $scope.resetCurrentEdit = function () {
                    //$scope.formMeta.currentEditTemp = {};
                    $scope.formMeta.currentEditTemp = {
                        "_meta_order": -1,
                        "lastname": "",
                        "firstname": "",
                        "position": "",
                        "lunch": false
                    };

                    $scope.formMeta.currentEditTempIndex = -1;

                    //  $scope.seminarDetails.$pristine = true;
                    $scope.seminarDetails.$setPristine();
                    $scope.seminarDetails.$setUntouched();

                }

                $scope.editAttendeeRow = function (dIndex) {
                    $scope.formMeta.currentEditTempIndex = dIndex;
                    $scope.formMeta.currentEditTemp = $scope.formData.attendees[dIndex];
                };


            }
        };
    }]); // seminarattendees