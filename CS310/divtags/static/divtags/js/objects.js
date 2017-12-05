var currentAttributes = new Array();
var currentObjects = new Array();
var currentConnections = new Array();

window.onload = insertObjects(Application);

function insertObjects(jsonInput) {
	var table = document.getElementById("objects-table");
	table.innerHTML = "";
	
	for (i in jsonInput.objects) {
		currentObjects.push(jsonInput.objects[i].name);
		var objectAttributes = "";
		for (j in jsonInput.objects[i].attributes){
			if (j==0) {
				objectAttributes += jsonInput.objects[i].attributes[j].name + ": " + jsonInput.objects[i].attributes[j].type+" ";
			} else {
				objectAttributes += "<br>" + jsonInput.objects[i].attributes[j].name + ": " + jsonInput.objects[i].attributes[j].type+" ";
			}
			j++;
		}
		var tableRow = "<tr><td>"+jsonInput.objects[i].name+"</td><td>"+jsonInput.objects[i].desc+"</td><td>"+objectAttributes+"</td><td><a onclick=\"viewEditObject(this)\"><i class=\"icon-pencil\"></i></a><a onclick=\"delete_object(this)\"><i class=\"icon-trashcan\"></i></a></td></tr>";
		table.innerHTML += tableRow;
	}
}

function addAttribute(event) {
	event.preventDefault();
	
	var errors = 0;
	
	var name = document.getElementById("attribute-name").value;
	var type = document.getElementById("attribute-type").value;
	var details = document.getElementById("attribute-details").value;
	document.getElementById("attribute-name-errors").innerHTML = "";
	
	for (i in currentAttributes) {
		if (name == currentAttributes[i].name) {
			document.getElementById("attribute-name-errors").innerHTML = "You already have an attribute with this name";
			errors = 1;
		}
	}
	
	if (name == "") {
		document.getElementById("attribute-name-errors").innerHTML = "You have not added a name for your attribute";
		errors = 1;
	}
	if ( (type == "Calculated" || type == "Reference") && details == "") {
		document.getElementById("attribute-details-errors").innerHTML = "You have not added a calculation for the calculated field";
		errors = 1;
	}
	if (errors == 0) {
		if (document.getElementById("attribute-details-errors")){
			document.getElementById("attribute-details-errors").innerHTML = "";
		}
		document.getElementById("attribute-name-errors").innerHTML = "";
		
		var details = document.getElementById("attribute-details").value;
		var table = document.getElementById("attributes-table");
		
		var tableRow = "<tr><td>"+name+"</td><td>"+type+"</td><td>"+details+"</td><td><a onclick=\"editAttribute(this)\"><i class=\"icon-pencil\"></i></a>&nbsp;&nbsp;<a onclick=\"deleteAttribute(this)\"><i class=\"icon-trashcan\"></i></a></td></tr>";
		currentAttributes.push({"name": name, "type": type});
		table.innerHTML += tableRow;
		
		if (type == "Reference") {
			document.getElementById("connections-table").innerHTML += "<tr><td>" + document.getElementById("obj_name").value + "</td><td>" + name + "</td><td>" + details + "</td></tr>";
			currentConnections.push({"thisObject": document.getElementById("obj_name").value, "targetObject": details})
		}
		
		document.getElementById("attribute-name").value = "";
		document.getElementById("attribute-type").value = "";
		document.getElementById("attribute-details").value = "";
		document.getElementById("attribute-details-div").innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
	}
	
	
	
	
}

function deleteAttribute(element) {
	element.parentElement.parentElement.outerHTML = "";
	element = { "name": element.parentElement.parentElement.childNodes[0].innerHTML, "type": element.parentElement.parentElement.childNodes[1].innerHTML };
	var index;
	for (i in currentAttributes) {
		if (currentAttributes[i].name == element.name && currentAttributes[i].type == element.type) {
			index = i;
		}
	}
    if (index !== -1) {
        currentAttributes.splice(index, 1);
    }
}

function editAttribute(element) {
	var tableRow = element.parentElement.parentElement;
	var name = tableRow.childNodes[0].innerHTML;
	var type = tableRow.childNodes[1].innerHTML;
	var details = tableRow.childNodes[2].innerHTML;
	
	document.getElementById("attribute-name").value = name;
	document.getElementById("attribute-type").value = type;
	document.getElementById("attribute-details").value = details;

	deleteAttribute(element);
	
	var detailsDiv = document.getElementById("attribute-details-div");
	
	if (type == "Text") {
		//text - show nothing
		
		detailsDiv.innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
		
	} else if (type == "Number") {
		//number - show nothing

		detailsDiv.innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
		
	} else if (type == "Date") {
		//date - show nothing

		detailsDiv.innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
		
	} else if (type == "Calculated") {
		//calculated - show select2 with parameterised input
		
		detailsDiv.innerHTML = "<span id=\"attribute-details-errors\"></span><input id=\"attribute-details\" type=\"text\" class=\"form-control\" disabled value=\""+details+"\" placeholder=\"Calculation for Field\" style=\"width:100%\">";
		detailsDiv.innerHTML += "<div class=\"col-sm-4\" id=\"calc-operators\">Operators <button id=\"plus-button\" onclick=\"addToCalcField(event, \'+\')\">+</button><button id=\"minus-button\" onclick=\"addToCalcField(event, \'-\')\">-</button><button id=\"times-button\" onclick=\"addToCalcField(event, \'*\')\">*</button><button id=\"divide-button\" onclick=\"addToCalcField(event, \'/\')\">/</button><button id=\"mod-button\" onclick=\"addToCalcField(event, \'mod\')\">mod</button></div>";
		detailsDiv.innerHTML += "<div class=\"col-sm-4\" id=\"calc-constants\">Constant <input id=\"constant-field\" type=\"number\" class=\"form-control\" style=\"width:50%; display:inline;\"><button id=\"calc-add-constant-button\" onclick=\"addConstantToCalcField(event)\">Add</button></div>";
			
		var attributes = "";
		var currentObjectName = document.getElementById('obj_name').value;
		attributes += "<optgroup label=\""+currentObjectName+"\">";
		for (m in currentAttributes) {
			if ( currentAttributes[m].type == "Number"){
				attributes += "<option value=\""+currentAttributes[m].name+"\">"+currentAttributes[m].name+"</option>";
			}
		}
		attributes += "</optgroup>";
		for (i in tempApplication.objects) {
			attributes += "<optgroup label=\""+tempApplication.objects[i].name+"\">";
			for (j in tempApplication.objects[i].attributes) {
				if (tempApplication.objects[i].attributes[j].type == "Number") {
					attributes += "<option value=\""+tempApplication.objects[i].attributes[j].name+"\">"+tempApplication.objects[i].attributes[j].name+"</option>";
				}
			}
			attributes += "</optgroup>";
		}
		
		detailsDiv.innerHTML += "<div id=\"calc-attribute-reference\"class=\" col-sm-4\">Attribute <select id=\"calc-attribute-select\" class=\"form-control\" style=\"width:50%\">"+attributes+"</select><button id=\"calc-add-attribute-button\" onclick=\"addAttributeToCalcField(event)\">Add</button></div>";
		
		$('#calc-attribute-select').select2({
	    });
		
	} else if (type == "Reference") {
		//reference - show select2 with dropdown list of all current objects
		
		var objects = "";
		for (i in tempApplication.objects) {
			objects += "<option value=\""+tempApplication.objects[i].name+"\">"+tempApplication.objects[i].name+"</option>";
		}
		detailsDiv.innerHTML = "<select id=\"attribute-details\" value=\""+details+"\" class=\"form-control\" style=\"width:50%\">"+objects+"</select>";
		
		$('#attribute-details').select2({
	    });
		
	}
}

function inputDetails() {
	var choice = document.getElementById("attribute-type").value;
	var detailsDiv = document.getElementById("attribute-details-div");
	
	if (choice == "Text") {
		//text - show nothing
		
		detailsDiv.innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
		
	} else if (choice == "Number") {
		//number - show nothing

		detailsDiv.innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
		
	} else if (choice == "Date") {
		//date - show nothing

		detailsDiv.innerHTML = "<input id=\"attribute-details\" type=\"hidden\" value=\"\">";
		
	} else if (choice == "Calculated") {
		//calculated - show select2 with parameterised input
		
		detailsDiv.innerHTML = "<span id=\"attribute-details-errors\"></span><input id=\"attribute-details\" type=\"text\" class=\"form-control\" disabled placeholder=\"Calculation for Field\" style=\"width:100%\">";
		detailsDiv.innerHTML += "<div class=\"col-sm-4\" id=\"calc-operators\">Operators <button id=\"plus-button\" onclick=\"addToCalcField(event, \'+\')\">+</button><button id=\"minus-button\" onclick=\"addToCalcField(event, \'-\')\">-</button><button id=\"times-button\" onclick=\"addToCalcField(event, \'*\')\">*</button><button id=\"divide-button\" onclick=\"addToCalcField(event, \'/\')\">/</button><button id=\"mod-button\" onclick=\"addToCalcField(event, \'mod\')\">mod</button></div>";
		detailsDiv.innerHTML += "<div class=\"col-sm-4\" id=\"calc-constants\">Constant <input id=\"constant-field\" type=\"number\" class=\"form-control\" style=\"width:50%; display:inline;\"><button id=\"calc-add-constant-button\" onclick=\"addConstantToCalcField(event)\">Add</button></div>";
			
		var attributes = "";
		var currentObjectName = document.getElementById('obj_name').value;
		console.log(currentObjectName);
		attributes += "<optgroup label=\""+currentObjectName+"\">";
		for (m in currentAttributes) {
			if ( currentAttributes[m].type == "Number"){
				attributes += "<option value=\""+currentAttributes[m].name+"\">"+currentAttributes[m].name+"</option>";
			}
		}
		attributes += "</optgroup>";
		for (i in tempApplication.objects) {
			attributes += "<optgroup label=\""+tempApplication.objects[i].name+"\">";
			for (j in tempApplication.objects[i].attributes) {
				if (tempApplication.objects[i].attributes[j].type == "Number") {
					attributes += "<option value=\""+tempApplication.objects[i].attributes[j].name+"\">"+tempApplication.objects[i].attributes[j].name+"</option>";
				}
			}
			attributes += "</optgroup>";
		}
		
		detailsDiv.innerHTML += "<div id=\"calc-attribute-reference\"class=\" col-sm-4\">Attribute <select id=\"calc-attribute-select\" class=\"form-control\" style=\"width:50%\">"+attributes+"</select><button id=\"calc-add-attribute-button\" onclick=\"addAttributeToCalcField(event)\">Add</button></div>";
		
		$('#calc-attribute-select').select2({
	    });
		
	} else if (choice == "Reference") {
		//reference - show select2 with dropdown list of all current objects
		
		var objects = "";
		for (i in tempApplication.objects) {
			objects += "<option value=\""+tempApplication.objects[i].name+"\">"+tempApplication.objects[i].name+"</option>";
		}
		detailsDiv.innerHTML = "<select id=\"attribute-details\" class=\"form-control\" style=\"width:50%\">"+objects+"</select>";
		
		$('#attribute-details').select2({
	    });
		
	}
}

function addConstantToCalcField(event) {
	event.preventDefault();
	var constant = document.getElementById("constant-field").value;
	addToCalcField(event, constant);
}

function addAttributeToCalcField(event){
	event.preventDefault();
	var attribute = document.getElementById("calc-attribute-select").value;
	addToCalcField(event, attribute);
}

function addToCalcField(event, string) {
	event.preventDefault();
	document.getElementById("attribute-details").value += string + " ";
}

function viewEditObject(element) {
	var objnamesearch = element.parentElement.parentElement.childNodes[0].innerHTML;
	var object;
	for (i in tempApplication.objects) {
		if (tempApplication.objects[i].name == objnamesearch) {
			object = tempApplication.objects[i];
		}
	}
	document.getElementById("attributes-table").innerHTML = "";
	document.getElementById("obj_name").value = object.name;
	document.getElementById("obj_desc").value = object.desc;
	for (i in object.attributes) {
		if (object.attributes[i].type == "primaryKey") {
			document.getElementById("attributes-table").innerHTML += "<tr><td>" + object.attributes[i].name + "</td><td>" + object.attributes[i].type + "</td><td>" + object.attributes[i].details + "</td><td></td></tr>"
		} else {
			document.getElementById("attributes-table").innerHTML += "<tr><td>" + object.attributes[i].name + "</td><td>" + object.attributes[i].type + "</td><td>" + object.attributes[i].details + "</td><td><a onclick=\"editAttribute(this)\"><i class=\"icon-pencil\"></i></a>&nbsp;&nbsp;<a onclick=\"deleteAttribute(this)\"><i class=\"icon-trashcan\"></i></a></td></tr>"
		}
		
	}
	for (i in currentObjects) {
		if (currentObjects[i] == objnamesearch) {
			currentObjects.splice(i, 1);
			break;
		}
	}
	
	document.getElementById("save-object-button").outerHTML = "<button onclick=\"create_object_edit()\" id=\"edit-object-button\" class=\"btn btn-default\">Edit</button><button onclick=\"cancelViewEditObject(event)\" id=\"cancel-edit-object-button\" class=\"btn btn-default\">Cancel</button>";
	document.getElementById("create-object-heading").innerHTML = "Edit An Existing Object";
}

function undoViewEditObject(object) {
	document.getElementById("edit-object-button").outerHTML = "<button id=\"save-object-button\" class=\"btn btn-default\">Save</button>";
	document.getElementById("cancel-edit-object-button").outerHTML = "";
	document.getElementById("create-object-heading").innerHTML = "Create A New Object";
	currentObjects = [];
	document.getElementById("obj_name").value = "";
	document.getElementById("obj_desc").value = "";
	document.getElementById("attributes-table").innerHTML = "<tr><td>primary_key</td><td>primaryKey</td><td></td><td></td></tr>";
	document.getElementById("connections-table").innerHTML = "";
	
//	var objtable = document.getElementById("objects-table");
//	
//	for (var i = 0, row; row = objtable.rows[i]; i++) {
//		if (row.cells[0] == object.name) {
//			row.cells[0].innerHTML = object.name;
//			row.cells[1].innerHTML = object.desc;
//			row.cells[2].innerHTML = "";
//			for (j in object.attributes) {
//				if (j == 0) {
//					row.cells[2].innerHTML += object.attributes[j].name + ": " + object.attributes[j].type;
//				} else {
//					row.cells[2].innerHTML += "<br>" + object.attributes[j].name + ": " + object.attributes[j].type;
//				}
//			}
//		}
//	}
}

function cancelViewEditObject(event) {
	event.preventDefault();
	document.getElementById("edit-object-button").outerHTML = "<button id=\"save-object-button\" class=\"btn btn-default\">Save</button>";
	document.getElementById("cancel-edit-object-button").outerHTML = "";
	document.getElementById("create-object-heading").innerHTML = "Create A New Object";
	currentObjects.push(document.getElementById("obj_name").value);
	document.getElementById("obj_name").value = "";
	document.getElementById("obj_desc").value = "";
	document.getElementById("connections-table").innerHTML = "";
	document.getElementById("attributes-table").innerHTML = "<tr><td>primary_key</td><td>primaryKey</td><td></td><td></td></tr>";
}

function saveObject(jsonObject) {
	var objname = jsonObject.name;
	var objdesc = jsonObject.desc;
	var objattributes = jsonObject.attributes;
	var objtable = document.getElementById("objects-table");
	var attributes = "";
	for (i in objattributes) {
		if (i == 0) {
			attributes += objattributes[i].name + ": " + objattributes[i].type;
		} else {
			attributes += "<br>" + objattributes[i].name + ": " + objattributes[i].type;
		}
	}
	objtable.innerHTML += "<tr><td>" + objname + "</td><td>" + objdesc + "</td><td>" + attributes + "</td><td><a onclick=\"editAttribute(this)\"><i class=\"icon-pencil\"></i></a>&nbsp;&nbsp;<a onclick=\"deleteAttribute(this)\"><i class=\"icon-trashcan\"></i></a></td></tr>";
	
	document.getElementById("obj_name").value = "";
	document.getElementById("obj_desc").value = "";
	document.getElementById("attribute-name").value = "";
	document.getElementById("connections-table").innerHTML = "";
	document.getElementById("attributes-table").innerHTML = "<tr><td>primary_key</td><td>primaryKey</td><td></td><td></td></tr>"
	
	currentAttributes = [];
	currentConnections = [];
}