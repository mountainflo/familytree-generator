function myFunction() {

    var i = 0;

    var family = document.createElement("DIV");
    family.className = "family";
    family.id = (i++).toString();

    var partner = document.createElement("DIV");
    partner.className = "partner";
    partner.id = (i++).toString();

    var husband = document.createElement("DIV");
    husband.className = "person";
    husband.id = (i++).toString();

    var wife = document.createElement("DIV");
    wife.className = "person";
    wife.id = (i++).toString();

    var family2 = document.createElement("DIV");
    family2.className = "family";
    family2.id = (i++).toString();

    var single = document.createElement("DIV");
    single.className = "single";
    single.id = (i++).toString();

    var person = document.createElement("DIV");
    person.className = "person";
    person.id = (i++).toString();

    family.appendChild(partner);
    partner.appendChild(husband);
    partner.appendChild(wife);
    family.appendChild(family2);
    family2.appendChild(single);
    single.appendChild(person);


    document.getElementById("outer").appendChild(family);

    //TODO creates html-path-element, but it is not visible
    // var path = document.createElement("PATH");
    // path.id = "path1";
    // document.getElementById("svg1").appendChild(path);
}


$(document).ready(function () {
    myFunction();
});