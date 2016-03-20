var appEventService = angular.module('ViewStates', []);

//// OrganisationStateTemplate1   for the data state of an organisation sub view
appEventService.service('OrganisationStateTemplate1', function () {

    // used to store state for the organisation's details of the \events attendee list
    var myState = {};
    myState.ds = {};  // datasource for the information on the form
    myState.fn = {}   // functions to be wired back on the form
    myState.formMeta = {}  // data about the state of the data supplied by the user etc
    myState.formData = {}


    var organisationSelections = [{"orgId": 1234, "name": "school1"}, {"orgId": 7234, "name": "school2"}];

    //  myState.formData.organisation = angular.copy(organisationDefaults);
    myState.formData.organisation = {}; // will be set by client


    //formMeta is data about the data and the view configuration
    // it is separate to formData which will be submitted by the user
    myState.formMeta.organisationList = angular.copy(organisationSelections);
    myState.formMeta.organisationType = "Organisation";
    myState.formMeta.templateName = "organisation_minimum"; // default until set by client

    myState.formMeta.organisationchoice = -1; // used for selection option?

    // functions


    myState.fn.appendToMeta = function (key, value) {  // allows specific consumer to add its own meta data
        myState.formMeta[key] = value;
    };

    myState.fn.stringInArray = function (value, tArray) {
        var targetArray = tArray || [];
        return targetArray.indexOf(value) > -1;
    };

    myState.fn.stringInVisibleAlso = function (value) {
        console.log(value);
        var targetArray = myState.formMeta['visibleAlso'] || [];
        return targetArray.indexOf(value) > -1;
    };

    myState.fn.setTemplateRequirements = function (useTemplate) {  // sets three values

        // decide which organisation fields are required and associate this to an html file
        //  var meta = {};

        //   var template = "js/directives/templates/organisations/minimum_org.html";

        myState.formMeta.templateName = useTemplate;

        switch (useTemplate) {
            case "organisation_minimum":
                myState.formMeta.template = "view1/form_preview/minimum_org.html";
                myState.formData.organisation = {
                    "id": "",
                    "name": "",
                    "email": "",
                    "email2": "",
                    "sectorId": ""
                };
                break;
            case "organisation_maximum":
                myState.formMeta.template = "view1/form_preview/maximum_org.html";
                myState.formData.organisation = {
                    "id": "",
                    "name": "",
                    "address1": "",
                    "address2": "",
                    "address3": "",
                    "address4": "",
                    "postcode": "",
                    "county_region": "",
                    "sectorId": "",
                    "contact_name": "",
                    "email": "",
                    "email2": "",
                    "telephone": "",
                    "fax": ""
                };
                break;
            default:
                ;
        }
        ;
        return myState.formData.organisation;
    } // setTemplateStyle

    myState.fn.getTemplateUrl = function (useTemplate) {
        return myState.formMeta.template;
    }


    myState.fn.resetCurrentEdit = function () {
        // myState.formData.organisation = angular.copy(organisationDefaults);
        myState.formData.organisation = myState.fn.setTemplateRequirements(myState.formMeta.templateName);
        return myState.formData.organisation;
    };


    myState.fn.resetCurrentEdit(); // setup the data state

    // end functions

    return myState;
});


///

//// ADStateTemplate1   for attendee details

///


appEventService.service('ADStateTemplate1', function () {

    // used to store state for attendees/delegates of the \events attendee list
    var myState = {};


    var attendeesTest = [{"choice": 7, "lastname": "a", "firstname": "a", "position": "Alpha", "lunch": false},
        {"choice": 8, "lastname": "z", "firstname": "z", "position": "Beta", "lunch": false},
        {"choice": 9, "lastname": "g", "firstname": "g", "position": "Gamma", "lunch": true}
    ];

    // testing	  var attendeeDetailsDefaults = { "_meta_order": 5, "lastname":"aaaa", "firstname": "bbbb", "position":"Delta", "lunch" : false};
    var attendeeDetailsDefaults = {"_meta_order": -1, "lastname": "", "firstname": "", "position": "", "lunch": false};

    myState.fn = {}   // functions to be wired back on the form
    myState.formMeta = {}  // data about the state of the data supplied by the user etc
    myState.formData = {}   // data being supplied by the user
    myState.formData.attendees = [];
    // 		myState.formData.attendees = attendeesTest;   // remove later

    // putting the edit options to meta so formData represents the data state
    // to save i.e. the accepted list of attendees
    myState.formMeta.currentEditTemp = angular.copy(attendeeDetailsDefaults);
    myState.formMeta.currentEditTempIndex = -1;

    // functions

    myState.fn.resetCurrentEdit = function () {
        myState.formMeta.currentEditTemp = angular.copy(attendeeDetailsDefaults);
        myState.formMeta.currentEditTempIndex = -1;
        return myState.formMeta;
    };

    myState.fn.resetCurrentEdit(); // setup the data state

    myState.fn.getAttendees = function () {
        return myState.formData.attendees;
    };

    myState.fn.removeAttendeeRow = function (dIndex) {
        if (myState.formMeta.currentEditTempIndex == dIndex) {
            myState.resetCurrentEdit();
        }
        myState.formData.attendees.splice(dIndex, 1);
    };

    myState.fn.addAttendeeRow = function () {

        if (myState.formMeta.currentEditTempIndex == -1) {  // new entry
            myState.formData.attendees.push(myState.formMeta.currentEditTemp);
        }
        else { // update existing entry
            myState.formData.attendees[myState.formMeta.currentEditTempIndex] = myState.formMeta.currentEditTemp;
        }
        // always sort after a change ???
        myState.fn.resetCurrentEdit(); // clear the form for next name
    };

    myState.fn.editAttendeeRow = function (dIndex) {
        myState.formMeta.currentEditTempIndex = dIndex;
        myState.formMeta.currentEditTemp = angular.copy(myState.formData.attendees[dIndex]);
    };

    // end functions


    return myState;
});

///

//// EventState   for the data state of the \events form

///


appEventService.service("EventState", function () {
    // event state between views and view revisits

    var myState = {};
    myState.DS = {} // the content to render into the page
    myState.formMeta = {}  // data about the state of the data supplied by the user etc
    myState.formData = {}   // data being supplied by the user which will be the eventual submit data
    myState.fn = {}

    // initialisation logic

    //	formDataDefaults.organisation injected later from formMeta.organisation
    var formDataDefaults = {
        "eventId": null,
        "confirmation": false,
        "ype": "",
        "attendees": [],
        "organisation": {},
        "contact": {"lastname": "", "firstname": "", "email": "", "email2": ""},
        "receiptID": ""
    };


    var formMetaDefaults = {
        "eventFormValid": false,
        "isSavingForm": false,
        "isDataEntryMode": true,
        "eventOffset": -1,
        organisation: {},
        "attendeeDetailsDefaults": {"_meta_order": 0, "lastname": "", "firstname": "", "position": "", "lunch": false}
    }

    // functions to be wired back on the form

    myState.DS.eventConfigurations = null;

    var getPaginationFilter = function () {
        // pagination search, set myState.DS.filter.constraints[0].equalTo[0].cId to get active events of
        // a specific customer  OBJECT order important here as using ARRAYS
        return {
            "targetClass": "eventConfigurations",
            "page_no": 1,
            "per_page_limit": 50,
            "constraints": [
                {
                    "equalTo": []
                }
            ],
            "sorting": [
                {
                    "ascending": "name"
                }
            ]
        };

    };

    myState.formMeta.attendeeDetailsDefaults = {
        "_meta_order": 0,
        "lastname": "",
        "firstname": "",
        "position": "",
        "lunch": false
    };

    String.prototype.capitalize = function () {
        // Capital first letter and lowercase the rest
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    };


    myState.fn.resetformMetaDefaults = function () {
        myState.formMeta = angular.copy(formMetaDefaults);
    }

    myState.fn.resetformDataDefaults = function () {
        myState.formData = angular.copy(formDataDefaults);
        myState.formData.organisation = angular.copy(myState.formMeta.organisation);
    }

    myState.fn.resetDefaults = function (offset) {
        myState.formMeta = angular.copy(formMetaDefaults);
        myState.formMeta.eventOffset = offset;
        myState.formData = angular.copy(formDataDefaults);
        // actual organisation object injected on a per use case
        //   myState.formData.organisation = angular.copy(myState.formMeta.organisation);
        myState.formData.organisation = null; // child view will allocate
    }

    myState.fn.getMeta = function () {
        return myState.formMeta;
    }

    myState.fn.getformData = function () {
        return myState.formData
    }

    myState.fn.setAppCustomerId = function (appCustomerId) {
        // order important here
        myState.DS.filter.constraints[0].equalTo[0].cId = appCustomerId;
    }
    myState.fn.getAppCustomerId = function (appCustomerId) {
        // order important here
        return myState.DS.filter.constraints[0].equalTo[0].cId;
    }

    // used in app.run $routeProvider resolver to pass to controller

    myState.formData = formDataDefaults;
    // execute this code

    myState.fn.resetDefaults(-1); // ensure valid state


    ////////////////////////////////////////////
    return myState; // a promise is part of this to check if cloud data available

});

