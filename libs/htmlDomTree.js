var divObjectId = 0;
var pathObjectId = 0;
var allPathConnections = [];
var PathReference = class {
    constructor(pathId, sourceId, destinationId) {
        this.pathId = pathId;
        this.sourceId = sourceId;
        this.destinationId = destinationId;
    }
};

function generateTreeFromJSON() {

    var obj = JSON.parse(jsonTreeData);

    if (obj.hasOwnProperty('family')) {

        var familyDOM = parseFamily(obj['family'], null);

        if (document.getElementById("outer") == null) {
            alert("no outer div to place html dom");
        } else {
            document.getElementById("outer").appendChild(familyDOM);
        }

    }


}

//TODO give error messages if json is not correct
function parseFamily(familyJSON, pathInputId) {

    var familyDOM = document.createElement("DIV");
    familyDOM.className = "family";
    familyDOM.id = (divObjectId++).toString();

    var pathOutputId = divObjectId++;

    var partnerObj = document.createElement("DIV");
    partnerObj.className = "partner";
    partnerObj.id = (pathOutputId).toString();

    var pathToChildId = divObjectId++;

    var parentsChildObj = document.createElement("DIV");
    parentsChildObj.className = "person";
    parentsChildObj.id = (pathToChildId).toString();

    parentsChildObj.appendChild(createPersonParagraph(familyJSON));

    var parentsChildPartnerObj = document.createElement("DIV");
    parentsChildPartnerObj.className = "person";
    parentsChildPartnerObj.id = (divObjectId++).toString();

    parentsChildPartnerObj.appendChild(createPersonParagraph(familyJSON['partner']));

    if (pathInputId != null) {
        allPathConnections.push(new PathReference(createPathHtmlElement(), pathInputId, pathToChildId));
    }

    // TODO correct compare of strings with js
    if (familyJSON['sex'] == "m") {
        partnerObj.appendChild(parentsChildObj);
        partnerObj.appendChild(parentsChildPartnerObj);
    } else {
        partnerObj.appendChild(parentsChildPartnerObj);
        partnerObj.appendChild(parentsChildObj);
    }

    familyDOM.appendChild(partnerObj);

    var childrenJSON = familyJSON['children'];

    for (var childJSON in childrenJSON) {

        if (childrenJSON[childJSON].hasOwnProperty('married')) {
            var subFamilyDOM = parseFamily(childrenJSON[childJSON], pathOutputId);
            familyDOM.appendChild(subFamilyDOM);
        } else {

            var familyChildObj = document.createElement("DIV");
            familyChildObj.className = "family";
            familyChildObj.id = (divObjectId++).toString();

            var singleObj = document.createElement("DIV");
            singleObj.className = "single";
            singleObj.id = (divObjectId++).toString();

            var pathEndingId = divObjectId++;
            var personObj = document.createElement("DIV");
            personObj.className = "person";
            personObj.id = (pathEndingId).toString();

            allPathConnections.push(new PathReference(createPathHtmlElement(), pathOutputId, pathEndingId));

            personObj.appendChild(createPersonParagraph(childrenJSON[childJSON]));
            singleObj.appendChild(personObj);
            familyChildObj.appendChild(singleObj);
            familyDOM.appendChild(familyChildObj);
        }

    }

    return familyDOM;

}

function createPersonParagraph(personJSON) {
    var description = document.createElement("P");
    description.className = "personDescription";
    description.innerText = personJSON['name'] + " " + personJSON['surname'] + " " + personJSON['dateOfBirth'];

    return description;
}

function createPathHtmlElement() {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = ("path" + pathObjectId++).toString();
    document.getElementById("svg1").appendChild(path);

    return path.id;
}

$(document).ready(function () {
    generateTreeFromJSON();
});