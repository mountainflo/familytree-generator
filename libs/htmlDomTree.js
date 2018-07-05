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

    var familyDOM = createDiv("family", divObjectId++);

    var pathOutputId = divObjectId++;
    var partnerObj = createDiv("partner", pathOutputId);

    var pathToChildId = divObjectId++;
    var parentsChildObj = createDiv("person", pathToChildId);
    parentsChildObj.appendChild(createPersonParagraph(familyJSON));

    var parentsChildPartnerObj = createDiv("person", divObjectId++);
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

            var familyChildObj = createDiv("family", divObjectId++);

            var singleObj = createDiv("single", divObjectId++);

            var pathEndingId = divObjectId++;
            var personObj = createDiv("person", pathEndingId);

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

function createDiv(className, id) {
    var familyChildObj = document.createElement("DIV");
    familyChildObj.className = className;
    familyChildObj.id = (id).toString();
    return familyChildObj;
}

$(document).ready(function () {
    generateTreeFromJSON();
});