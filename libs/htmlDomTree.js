/**
 * Counter for ids of all html-divs.
 * @type {number}
 */
var divObjectId = 0;

/**
 * Counter for all path-elements.
 * @type {number}
 */
var pathObjectId = 0;

/**
 * Array of PathReferences.
 * @type {Array}
 */
var allPathConnections = [];

/**
 * Path-object contains the id of the source and the destination div and the corresponding path id.
 * @type {PathReference}
 */
var PathReference = class {
    constructor(pathId, sourceId, destinationId) {
        this.pathId = pathId;
        this.sourceId = sourceId;
        this.destinationId = destinationId;
    }
};

/**
 * Generate a html family tree with divs from JSON.
 * Needs a div with the id "familyTree" to place the tree in html.
 */
function generateTreeFromJSON(jsonTreeData) {

    if (jsonTreeData.hasOwnProperty('family')) {

        var familyDOM = parseFamily(jsonTreeData['family'], null);

        if (document.getElementById("familyTree") == null) {
            alert("no familyTree div to place html dom");
        } else {
            document.getElementById("familyTree").appendChild(familyDOM);
        }

    }


}

//TODO give error messages if json is not correct
/**
 * Recursive creation of a family tree by parsing the JSON-data.
 *
 * @param familyJSON data of a family-object
 * @param pathInputId id of partner-div
 * @returns {HTMLElement} created sub-family-tree
 */
function parseFamily(familyJSON, pathInputId) {

    var familyDOM = createDiv("family", divObjectId++);

    var pathOutputId = divObjectId++;
    var partnerObj = createDiv("partner", pathOutputId);

    var parentsChildCssClass;
    var parentsChildPartnerCssClass;

    if (familyJSON['sex'] == "m") {
        parentsChildCssClass = "person husband";
        parentsChildPartnerCssClass = "person wife";
    } else {
        parentsChildCssClass = "person wife";
        parentsChildPartnerCssClass = "person husband";
    }

    var pathToChildId = divObjectId++;
    var parentsChildObj = createDiv(parentsChildCssClass, pathToChildId);
    parentsChildObj.appendChild(createPersonParagraph(familyJSON));

    var parentsChildPartnerObj = createDiv(parentsChildPartnerCssClass, divObjectId++);
    parentsChildPartnerObj.appendChild(createPersonParagraph(familyJSON['partner']));

    if (familyJSON['sex'] == "m") {
        partnerObj.appendChild(parentsChildObj);
        partnerObj.appendChild(parentsChildPartnerObj);
    } else {
        partnerObj.appendChild(parentsChildPartnerObj);
        partnerObj.appendChild(parentsChildObj);
    }

    familyDOM.appendChild(partnerObj);

    //root element does not need a path
    if (pathInputId != null) {
        allPathConnections.push(new PathReference(createPathHtmlElement(), pathInputId, pathToChildId));
    }

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

/**
 * Creates a html-paragraph with the information about the person contained in the JSON.
 * @param personJSON JSON with the data about the person (name, surname, dateOfBirth)
 * @returns {HTMLElement} html-paragraph-element with person data
 */
function createPersonParagraph(personJSON) {
    var description = document.createElement("P");
    description.className = "personDescription";
    description.innerText = personJSON['name'] + " " + personJSON['surname'] + " " + personJSON['dateOfBirth'];

    return description;
}

/**
 * Creates a path element within the "familyTreePaths" div.
 * @returns {string} id of the new created path.
 */
function createPathHtmlElement() {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = ("path" + pathObjectId++).toString();
    document.getElementById("familyTreePaths").appendChild(path);

    return path.id;
}

/**
 * Creates a html-div with id and class-name.
 * @param className class-name of the div.
 * @param id id of the div
 * @returns {HTMLElement} created html-div
 */
function createDiv(className, id) {
    var familyChildObj = document.createElement("DIV");
    familyChildObj.className = className;
    familyChildObj.id = (id).toString();

    return familyChildObj;
}

/**
 * Generates a family tree from json.
 * Only the divs are created. The svg-paths are not created here.
 */
$(document).ready(function () {
    $.getJSON("familytree-data.json", function (data) {
        generateTreeFromJSON(data);
        drawAllSvgPaths();
    });
});