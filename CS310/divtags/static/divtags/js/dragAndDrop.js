//var tempApplication = Application;

//var noOfElements = 0;
var undoChangeStack = new Array();
var redoChangeStack = new Array();
var intervals = [];

var homepage = 1;
for (i in Application.pages) {
	if (Application.pages[i].permissions == "public"){
		if (Application.pages[i].homepage == "yes") {
			homepage = i;
			break;
		}
	}
}


window.onload = insertElements(Application, homepage);
window.onload = insertPages(Application);
window.onload = populateFormObject();

function printStack(inputStack) {
	console.log("printing stack");
	for (i in inputStack) {
		console.log("---------------------");
		var object = JSON.parse(inputStack[i]);
		for (j in object.pages[0].elements) {
			console.log("---------");
			console.log(object.pages[0].elements[j].content);
		}
	}
}

function undoChange() {
	if (undoChangeStack.length != 0) {
		redoChangeStack.push(JSON.stringify(tempApplication));
		var pageId = document.getElementById("page-identifier").value;
		var newJson = JSON.parse(undoChangeStack.pop());
		insertElements(newJson, pageId);
		saveJsonLocal(tempApplication);
	}
	if (undoChangeStack.length == 0) {
		document.getElementById("undo-change").style.display = "none";
	} else {
		document.getElementById("undo-change").style.display = "block";
	}
	if (redoChangeStack.length == 0) {
		document.getElementById("redo-change").style.display = "none";
	} else {
		document.getElementById("redo-change").style.display = "block";
	}
	
}

function redoChange() {
	if (redoChangeStack.length != 0) {
		undoChangeStack.push(JSON.stringify(tempApplication));
		var pageId = document.getElementById("page-identifier").value;
		var newJson = JSON.parse(redoChangeStack.pop());
		insertElements(newJson, pageId);
		saveJsonLocal(tempApplication);
	} 
	if (undoChangeStack.length == 0) {
		document.getElementById("undo-change").style.display = "none";
	} else {
		document.getElementById("undo-change").style.display = "block";
	}
	if (redoChangeStack.length == 0) {
		document.getElementById("redo-change").style.display = "none";
	} else {
		document.getElementById("redo-change").style.display = "block";
	}
}

function addContainer(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<div class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:100px; height:100px; width:300px;\"><div class=\"element-text\"></div></div>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function addHeading(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<h1 class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:100px;\"><div class=\"element-text\">This is a Heading</div></h1>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function addParagraph(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<div class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:100px;\"><p class=\"element-text\">This is a Paragraph</p></div>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}
//
//function addBulletList(event) {
//	event.preventDefault();
//	
//	undoChangeStack.push(JSON.stringify(tempApplication));
//	
//	var container = document.getElementById("outer-container");
//	noOfElements += 1;
//	var divElement = "<ul class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><li>This is a bulleted List</li><li>You can add points here</li></ul>";
//	container.innerHTML += divElement;
//	
//	var pageId = document.getElementById("page-identifier").value;
//	saveJsonLocal(tempApplication);
//}
//
//function addNumberedList(event) {
//	event.preventDefault();
//	
//	undoChangeStack.push(JSON.stringify(tempApplication));
//	
//	var container = document.getElementById("outer-container");
//	noOfElements += 1;
//	var divElement = "<ol class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><li>This is a numbered List</li><li>You can add items here</li></ol>";
//	container.innerHTML += divElement;
//	
//	var pageId = document.getElementById("page-identifier").value;
//	saveJsonLocal(tempApplication);
//}
//
//function addMenu(event) {
//	event.preventDefault();
//	
//	undoChangeStack.push(JSON.stringify(tempApplication));
//	
//	var container = document.getElementById("outer-container");
//	noOfElements += 1;
//	
//	var pagelist = "";
//	for (i in tempApplication.pages) {
//		if (tempApplication.pages[i].showinheader == "yes") {
//			pagelist += "<li class=\"element\"><a id=\"page"+tempApplication.pages[i].name+"\" href=\"#\" class=\"fixed-text\">"+tempApplication.pages[i].name+"</a></li>"
//		}
//	}
//	console.log(pagelist);
//	
//	var header = "<header id=\"header\" class=\"sticky-header element\"><div id=\"\" class=\"\"><div class=\"container clearfix\"><div id=\"primary-menu-trigger\"><i class=\"icon-reorder\"></i></div><div id=\"logo\"><a href=\"#\" class=\"retina-logo\">Logo</a></div><nav id=\"primary-menu\"><ul class=\"one-page-menu sf-js-enabled\" style=\"touch-action: pan-y;\">"+pagelist+"</ul></nav></div></div></header>"
//	container.innerHTML += header;
//	
//	saveJsonLocal(tempApplication);
//}

function addToHeader() {
	var list = document.getElementById("user-menu-pages-list");
	list.innerHTML = "";
	var pageId = document.getElementById("page-identifier").value;
	if (tempApplication.pages[pageId].permissions == "public") {
		//public pages menu
		for (i in tempApplication.pages) {
			if (tempApplication.pages[i].showinheader == "yes") {
				if (tempApplication.pages[i].permissions == "public") {
					list.innerHTML += "<li>"+tempApplication.pages[i].name+"</li>";
				}
			}
		}
	} else if(tempApplication.pages[pageId].permissions == "members") {
		//members pages menu
		for (i in tempApplication.pages) {
			if (tempApplication.pages[i].showinheader == "yes") {
				if (tempApplication.pages[i].permissions == "members") {
					list.innerHTML += "<li>"+tempApplication.pages[i].name+"</li>";
				}
			}
		}
		list.innerHTML += "<li><i class=\"icon-user2\"></i></li>";
	}
	
}

function addForm(object, type) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	noOfElements += 1;
	var formElements = "";
	var fieldNo = 0;
	var formobject;
	for (i in tempApplication.objects) {
		if (tempApplication.objects[i].name == object) {
			formobject = tempApplication.objects[i];
		}
	}
	for (i in formobject.attributes) {
		if (formobject.attributes[i].type == "Text"){
			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:none\"></i>";
			formElements += "<label>" + formobject.attributes[i].name + "</label><input type=\"text\" class=\"form-control user-form\"/>";
			fieldNo += 1;
		} else if (formobject.attributes[i].type == "Number"){
			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:none\"></i>";
			formElements += "<label>" + formobject.attributes[i].name + "</label><input type=\"number\" class=\"form-control user-form\"/>";
			fieldNo += 1;
		} else if (formobject.attributes[i].type == "Reference"){
			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:none\"></i>";
			formElements += "<label>" + formobject.attributes[i].name + "</label><select class=\"form-control user-form\"/></select>";
			fieldNo += 1;
		} else if (formobject.attributes[i].type == "Date"){
			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:none\"></i>";
			formElements += "<label>" + formobject.attributes[i].name + "</label><input type=\"date\" class=\"form-control user-form\"/>";
			fieldNo += 1;
		}
	}
	formElements += "<button disabled class=\"btn btn-default\">Submit</button>";
	
	var container = document.getElementById("outer-container");
	
	var divElement = "<form class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:100px;\">"+formElements+"</form>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	
	var formFields = [];
	for (i in formobject.attributes) {
		if (formobject.attributes[i].type != "primaryKey" && formobject.attributes[i].type != "Connection"){
			formFields.push(
					{
						"type": formobject.attributes[i].type,
						"label": formobject.attributes[i].name,
						"details": formobject.attributes[i].details
					}
			);
		}
	}
	
	var formJSON = {
			"id": noOfElements,
			"type": type,
			"object": object,
			"fields": formFields
	}
	
	tempApplication.pages[pageId].forms.push(formJSON);
	
	saveJsonLocal(tempApplication);
}

function populateFormObject() {
	var list = document.getElementById("form-objects-list-add");
	for (i in tempApplication.objects) {
		list.innerHTML += "<li><a href=\"#\" onclick=\"addForm(\'"+tempApplication.objects[i].name+"\', \'add\')\">"+tempApplication.objects[i].name+"</a></li>";
	}
	var list = document.getElementById("form-objects-list-update");
	for (i in tempApplication.objects) {
		list.innerHTML += "<li><a href=\"#\" onclick=\"addForm(\""+tempApplication.objects[i].name+"\", \'update\')\">"+tempApplication.objects[i].name+"</a></li>";
	}
	var list = document.getElementById("form-objects-list-verify");
	for (i in tempApplication.objects) {
		list.innerHTML += "<li><a href=\"#\" onclick=\"addForm(\""+tempApplication.objects[i].name+"\", \'verify\')\">"+tempApplication.objects[i].name+"</a></li>";
	}
}

function addMultiQuery(event) {
	document.getElementById("multi-query-builder").style.display = "block";
	var objectList = "<option disabled selected value=\"objectReset\">Object</option>";
	for (i in tempApplication.objects) {
		objectList += "<option value=\""+ tempApplication.objects[i].name + "\">"+ tempApplication.objects[i].name +"</option>";
	}
	document.getElementById("multi-query-object-dropdown").innerHTML = objectList;
}

$('#add-multi-query-btn').click(function(){
	undoChangeStack.push(JSON.stringify(tempApplication));
	var pageId = document.getElementById("page-identifier").value;
	noOfElements += 1;
	var displayFields = $("#multi-query-object-field-dropdown").val();
	var displayFieldsJson = [];
	for (i in displayFields){
		displayFieldsJson.push({"name": displayFields[i]})
	}
	var multiQueryJson;
	if (document.getElementById("multi-query-comparator-select-dropdown").value == "query") {
		multiQueryJson = {
				"id": noOfElements,
				"display": {
					"object": document.getElementById("multi-query-object-dropdown").value,
					"fields": displayFieldsJson
				},
				"query": {
					"object": document.getElementById("multi-query-object-dropdown").value,
					"field": document.getElementById("multi-query-field-dropdown").value,
					"operator": document.getElementById("multi-query-operator-dropdown").value,
					"comparatorType": document.getElementById("multi-query-comparator-select-dropdown").value,
					"comparator": {
						"display": {
							"object": document.getElementById("nested-multi-query-object-dropdown").value,
							"field": document.getElementById("nested-multi-query-object-field-dropdown").value
						},
						"query": {
							"object": document.getElementById("nested-multi-query-object-dropdown").value,
							"field": document.getElementById("nested-multi-query-field-dropdown").value,
							"operator": document.getElementById("nested-multi-query-operator-dropdown").value,
							"comparatorType": document.getElementById("nested-multi-query-comparator-select-dropdown").value,
							"comparator": document.getElementById("nested-multi-query-comparator-dropdown").value
						},
					}
				},
				"limit": document.getElementById("query-limit").value,
				"orderfield": document.getElementById("query-order-by-field").value,
				"orderby": document.getElementById("query-order-by").value,
				"link": document.getElementById("query-link-page").value,
				"headings": document.getElementById("query-display-headings").value
		};
	} else {
		multiQueryJson = {
				"id": noOfElements,
				"display": {
					"object": document.getElementById("multi-query-object-dropdown").value,
					"fields": displayFieldsJson
				},
				"query": {
					"object": document.getElementById("multi-query-object-dropdown").value,
					"field": document.getElementById("multi-query-field-dropdown").value,
					"operator": document.getElementById("multi-query-operator-dropdown").value,
					"comparatorType": document.getElementById("multi-query-comparator-select-dropdown").value,
					"comparator": document.getElementById("multi-query-comparator-dropdown").value
				},
				"limit": document.getElementById("query-limit").value,
				"orderfield": document.getElementById("query-order-by-field").value,
				"orderby": document.getElementById("query-order-by").value,
				"link": document.getElementById("query-link-page").value,
				"headings": document.getElementById("query-display-headings").value
		};
	}
	
	tempApplication['pages'][pageId]['multiqueries'].push(multiQueryJson);
	var container = document.getElementById("outer-container");
	
	var queryTable = "<table class=\"table\">";
	if (multiQueryJson.headings == "yes") {
		queryTable += "<tr>";
		for (i in multiQueryJson.display.fields) {
			queryTable += "<th>"+multiQueryJson.display.fields[i].name+"</th>";
		}
		queryTable += "</tr>";
	}
	if (parseInt(multiQueryJson.limit) != 0) {
		for (var i=0; i<parseInt(multiQueryJson.limit); i++){
			queryTable += "<tr>";
			for (j in multiQueryJson.display.fields) {
				queryTable += "<td>"+multiQueryJson.display.object+"."+multiQueryJson.display.fields[j].name+"</td>";
			}
			queryTable += "</tr>";
		}
	} else {
		for (var i=0; i<10; i++){
			queryTable += "<tr>";
			for (j in multiQueryJson.display.fields) {
				queryTable += "<td>"+multiQueryJson.display.object+"."+multiQueryJson.display.fields[j].name+"</td>";
			}
			queryTable += "</tr>";
		}
	}
	queryTable += "</table>";
	
	
	var divElement = "<div class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:100px;\">" +
			queryTable +
			"</div>";
	container.innerHTML += divElement;
	
	document.getElementById("multi-query-builder").style.display = "none";
	saveJsonLocal(tempApplication);
});

$('#object-query-add-constraint-btn').click(function(){
	var pageId = document.getElementById("page-identifier").value;
	var selectedObjectName = document.getElementById("multi-query-object-dropdown").value;
	var fieldList = "<option disabled selected value=\"fieldReset\">Field</option>";
	for (i in tempApplication.objects) {
		if (selectedObjectName == tempApplication.objects[i].name) {
			for (j in tempApplication.objects[i].attributes){
				fieldList += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
			}
		}
	}
	var newconstraint = '<div class="row object-query-container" id="object-query-field-container">' +
		'<div class="col_one_third object-query-block object-query-even" id="object-query-field">'+
			'<select id="multi-query-field-dropdown">'+fieldList+'</select>' +
		'</div>'+
		'<div class="col_one_third object-query-block object-query-even" id="object-query-operator">'+
			'<select id="multi-query-operator-dropdown">'+
				'<option disabled="" selected="" value="operatorReset">Operator</option>'+
				'<option value="equal">=</option>'+
				'<option value="not-equal">!=</option>'+
				'<option value="lt">&lt;</option>'+
				'<option value="gt">&gt;</option>'+
				'<option value="lte">&lt;=</option>'+
				'<option value="gte">&gt;=</option>'+
				'<option value="in">in</option>'+
			'</select>'+
		'</div>'+
		'<div class="col_one_third col_last object-query-block object-query-even" id="object-query-comparator-select">'+
			'<select id="multi-query-comparator-select-dropdown">'+
				'<option disabled="" selected="" value="comparatorReset">Comparator</option>'+
				'<option class="user-option" value="userId">Current User</option>'+
				'<option value="value">Value</option>'+
				'<option value="query">Nested Search</option>'+
				'<option class="page-option" value="page">Page\'s object</option>'+
			'</select>'+
		'</div>'+
	'</div>'+
	'<div class="row object-query-container" id="object-query-field-container">'+
		'<div class="col_full object-query-block object-query-even" id="multi-query-comparator" style="display:none;">'+
		'</div>'+
	'</div>';
	
	document.getElementById('multi-query-options-container').insertAdjacentHTML('beforebegin', newconstraint);
	
	if (tempApplication.pages[pageId].permissions == "public") {
		var userOptions = document.getElementsByClassName("user-option");
		for (i in userOptions) {
			userOptions[i].disabled = true;
		}
	}
	if (tempApplication.pages[pageId].pageObject == "none") {
		var pageOptions = document.getElementsByClassName("page-option");
		for (i in pageOptions) {
			pageOptions[i].disabled = true;
		}
	}
	
	$('#multi-query-comparator-select-dropdown').change(function() {
		var container = document.getElementById("multi-query-comparator");
		document.getElementById("multi-query-comparator").style.display = "block";
		var comparatorSelection = document.getElementById("multi-query-comparator-select-dropdown").value;
		
		if (comparatorSelection == "userId") {
			var userFields = "";
			for (i in tempApplication.objects) {
				if (tempApplication.objects[i].name == "User") {
					for (j in tempApplication.objects[i].attributes) {
						userFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
					}
				}
			}
			container.innerHTML = "<select id=\"multi-query-comparator-dropdown\"><option disabled selected>Current User</option>" + userFields +"</select>";
			
		} else if(comparatorSelection == "page") {
			var pageFields = "";
			for (i in tempApplication.objects) {
				if (tempApplication.objects[i].name == tempApplication.pages[pageId].pageObject) {
					for (j in tempApplication.objects[i].attributes) {
						pageFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
					}
				}
			}
			container.innerHTML = "<select id=\"multi-query-comparator-dropdown\"><option disabled selected>Current Page</option>" + pageFields +"</select>";
			
		} else if(comparatorSelection == "value") {
			container.innerHTML = "<input type=\"text\" id=\"multi-query-comparator-dropdown\">";
			
		} else if(comparatorSelection == "query") {
			var objectList = "<option disabled selected value=\"objectReset\">Object</option>";
			for (i in tempApplication.objects) {
				objectList += "<option value=\""+ tempApplication.objects[i].name + "\">"+ tempApplication.objects[i].name +"</option>";
			}
			var nestedQuery = '<div class="row object-query-container" id="multi-object-select-container">'+
				'<div class="col_half object-query-block object-query-even" id="multi-query-object">'+
					'<select id="nested-multi-query-object-dropdown">'+objectList+'</select>'+
				'</div>'+
				'<div class="col_half col_last object-query-block object-query-even" id="multi-query-object-field">'+
					'<select id="nested-multi-query-object-field-dropdown"></select>'+
				'</div>'+
			'</div>'+
			'<div class="row object-query-container" id="multi-query-add-constraint-container">'+
				'<button class="button button-green" id="nested-multi-query-add-constraint-btn"><i class="icon-line-plus"></i> Add Constraint</button>'+
			'</div>';
			
			container.innerHTML = nestedQuery;
			
			$('#nested-multi-query-object-dropdown').change(function() {
				var selectedObjectName = document.getElementById("nested-multi-query-object-dropdown").value;
				var fieldList = "<option disabled selected value=\"fieldReset\">Field</option>";
				for (i in tempApplication.objects) {
					if (selectedObjectName == tempApplication.objects[i].name) {
						for (j in tempApplication.objects[i].attributes){
							fieldList += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
						}
					}
				}
				document.getElementById("nested-multi-query-object-field-dropdown").innerHTML = fieldList;
//				document.getElementById("nested-multi-query-field-dropdown").innerHTML = fieldList;
			})
			
			$('#nested-multi-query-add-constraint-btn').click(function(){
				var selectedObjectName = document.getElementById("nested-multi-query-object-dropdown").value;
				var fieldList = "<option disabled selected value=\"fieldReset\">Field</option>";
				for (i in tempApplication.objects) {
					if (selectedObjectName == tempApplication.objects[i].name) {
						for (j in tempApplication.objects[i].attributes){
							fieldList += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
						}
					}
				}
				var newconstraint = '<div class="row object-query-container" id="object-query-field-container">' +
					'<div class="col_one_third object-query-block object-query-even" id="object-query-field">'+
						'<select id="nested-multi-query-field-dropdown">'+fieldList+'</select>' +
					'</div>'+
					'<div class="col_one_third object-query-block object-query-even" id="object-query-operator">'+
						'<select id="nested-multi-query-operator-dropdown">'+
							'<option disabled="" selected="" value="operatorReset">Operator</option>'+
							'<option value="equal">=</option>'+
							'<option value="not-equal">!=</option>'+
							'<option value="lt">&lt;</option>'+
							'<option value="gt">&gt;</option>'+
							'<option value="lte">&lt;=</option>'+
							'<option value="gte">&gt;=</option>'+
							'<option value="in">in</option>'+
						'</select>'+
					'</div>'+
					'<div class="col_one_third col_last object-query-block object-query-even" id="object-query-comparator-select">'+
						'<select id="nested-multi-query-comparator-select-dropdown">'+
							'<option disabled="" selected="" value="comparatorReset">Comparator</option>'+
							'<option class="user-option" value="userId">Current User</option>'+
							'<option value="value">Value</option>'+
							'<option value="query">Nested Search</option>'+
							'<option class="page-option" value="page">Page\'s object</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="row object-query-container" id="object-query-field-container">'+
					'<div class="col_full object-query-block object-query-even" id="nested-multi-query-comparator" style="display:none;">'+
					'</div>'+
				'</div>';
				
				document.getElementById('multi-query-comparator').insertAdjacentHTML('beforeend', newconstraint);
				
				if (tempApplication.pages[pageId].permissions == "public") {
					var userOptions = document.getElementsByClassName("user-option");
					for (i in userOptions) {
						userOptions[i].disabled = true;
					}
				}
				if (tempApplication.pages[pageId].pageObject == "none") {
					var pageOptions = document.getElementsByClassName("page-option");
					for (i in pageOptions) {
						pageOptions[i].disabled = true;
					}
				}
				
				$('#nested-multi-query-comparator-select-dropdown').change(function() {
					var container = document.getElementById("nested-multi-query-comparator");
					document.getElementById("nested-multi-query-comparator").style.display = "block";
					var comparatorSelection = document.getElementById("nested-multi-query-comparator-select-dropdown").value;
					
					if (comparatorSelection == "userId") {
						var userFields = "";
						for (i in tempApplication.objects) {
							if (tempApplication.objects[i].name == "User") {
								for (j in tempApplication.objects[i].attributes) {
									userFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
								}
							}
						}
						container.innerHTML = "<select id=\"nested-multi-query-comparator-dropdown\"><option disabled selected>Current User</option>" + userFields +"</select>";
					
					} else if(comparatorSelection == "page") {
						var pageFields = "";
						for (i in tempApplication.objects) {
							if (tempApplication.objects[i].name == tempApplication.pages[pageId].pageObject) {
								for (j in tempApplication.objects[i].attributes) {
									pageFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
								}
							}
						}
						container.innerHTML = "<select id=\"nested-multi-query-comparator-dropdown\"><option disabled selected>Current Page</option>" + pageFields +"</select>";
						
					} else if(comparatorSelection == "value") {
						container.innerHTML = "<input type=\"text\" id=\"nested-multi-query-comparator-dropdown\">";
						
					}
				});
			});
		}
		
	});
});

$('#cancel-multi-query-btn').click(function(){
	document.getElementById("multi-query-builder").style.display = "none";
});

$('#multi-query-object-dropdown').change(function() {
	var selectedObjectName = document.getElementById("multi-query-object-dropdown").value;
	var fieldList = "<option disabled selected value=\"fieldReset\">Field</option>";
	for (i in tempApplication.objects) {
		if (selectedObjectName == tempApplication.objects[i].name) {
			for (j in tempApplication.objects[i].attributes){
				fieldList += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
			}
		}
	}
	var pageObjectList = "<option disabled selected value=\"none\">None</option>";
	var pagesObjects = 0;
	for (i in tempApplication.pages) {
		if (tempApplication.pages[i].pageObject == selectedObjectName) {
			pageObjectList += "<option value=\""+tempApplication.pages[i].name+"\">"+tempApplication.pages[i].name+"</option>";
			pagesObjects += 1;
		}
	}
	if (pagesObjects !== 0) {
		document.getElementById("query-link-page").disabled = false;
	}
	document.getElementById("query-link-page").innerHTML = pageObjectList;
	document.getElementById("multi-query-object-field-dropdown").innerHTML = fieldList;
//	document.getElementById("multi-query-field-dropdown").innerHTML = fieldList;
	document.getElementById("query-order-by-field").innerHTML = fieldList;
});

function saveJsonLocal(jsonInput) {
	var allElements = document.getElementById("outer-container").childNodes;
	var pageId = document.getElementById("page-identifier").value;
	var saveElements = [];
	var saveForms = [];
	var allPageElements = [];
	var allPageForms = [];
	for (var i=0; i < allElements.length; i++) {
//		if (allElements[i].classList == "element selected-element") {
//			currentselectedelement = 
//		}
		var elementtosave = allElements[i].cloneNode(true);
		if (elementtosave.className == "element selected-element") {
			for (var k=0; k<elementtosave.childNodes.length; k++) {
				if (typeof elementtosave.childNodes[k].outerHTML !== 'undefined') {
					if (elementtosave.childNodes[k].classList.contains("resizer") || elementtosave.childNodes[k].classList.contains("mover") || elementtosave.childNodes[k].classList.contains("delete") || elementtosave.childNodes[k].classList.contains("link") || elementtosave.childNodes[k].classList.contains("refresh")){
						elementtosave.childNodes[k].outerHTML = "";
						k -= 1;
						continue;
					}
					if (elementtosave.childNodes[k].classList.contains("form-field-delete")) {
						elementtosave.childNodes[k].style.display = "none";
					}
				}
			}
//			if (elementtosave.tagName == "FORM") {
//				
//			} else {
//				elementtosave.childNodes[1].outerHTML = "";
//				elementtosave.childNodes[1].outerHTML = "";
//				elementtosave.childNodes[1].outerHTML = "";
//			}
			elementtosave.className = "element";
		}
		//console.log(tempApplication);
		
		if (typeof elementtosave.outerHTML !== 'undefined'){
			if (elementtosave.id.match(/-/g)) {
				allPageElements.push(
						{
							"content": elementtosave.outerHTML,
						}
				);
				
			} else {
				saveElements.push(
						{ 
							"content": elementtosave.outerHTML,
						}
				);
			}
		}
	}
	jsonInput.pages[pageId].elements = saveElements;
	if (jsonInput.pages[pageId].showallpages == "yes") {
		jsonInput.pages[0].elements = allPageElements;
	}
	
	
	if (undoChangeStack.length == 0) {
		document.getElementById("undo-change").style.display = "none";
	} else {
		document.getElementById("undo-change").style.display = "block";
	}
	if (redoChangeStack.length == 0) {
		document.getElementById("redo-change").style.display = "none";
	} else {
		document.getElementById("redo-change").style.display = "block";
	}
}

function newPage(event, id) {
	event.preventDefault();
	var pageid = document.getElementById("page-identifier").value;
	if (checkSave(tempApplication, pageid)) {
		if (confirm("You haven't saved your changes, are you sure you would like to navigate away from this page and lose them?")) {
			//tempApplication = Application;
			undoChangeStack.length = 0;
			redoChangeStack.length = 0;
			if (undoChangeStack.length == 0) {
				document.getElementById("undo-change").style.display = "none";
			} else {
				document.getElementById("undo-change").style.display = "block";
			}
			if (redoChangeStack.length == 0) {
				document.getElementById("redo-change").style.display = "none";
			} else {
				document.getElementById("redo-change").style.display = "block";
			}
			insertElements(tempApplication, id);
		}
	} else {
		insertElements(tempApplication, id);
	}
}

function save() {
	
	
	var id = document.getElementById("page-identifier").value;
	saveJson(Application, id);
}

function saveJson(jsonInput, id) {
	document.getElementById("element-editor").style.display = 'none';
	var selectedElements = document.getElementsByTagName("*");
	for (var i=0; i < selectedElements.length; i++) {    
	    selectedElements[i].classList.remove("selected-element");
	    $('.resizer').remove();
	    $('.mover').remove();
	    $('.delete').remove();
	}
	
	var saveButton = document.getElementById("save-button");
	saveButton.innerHTML = "<i class='icon-line-check'></i> Done";
	setTimeout(function() { saveButton.innerHTML = "Save"; }, 2000);
	
	Application = tempApplication
	
//	var allElements = document.getElementById("outer-container").childNodes;
//	var saveElements = [];
//	for (i in allElements) {
//		if (typeof allElements[i].outerHTML !== 'undefined'){
//			saveElements.push(
//					{ 
//						"id": i,
//						"content": allElements[i].outerHTML,
//					}
//			);
//		}
//	}
//	jsonInput.pages[id].elements = saveElements;
//	console.log(jsonInput.pages[id].elements);
	
//	undoChangeStack.length = 0;
//	redoChangeStack.length = 0;
//	if (undoChangeStack.length == 0) {
//		document.getElementById("undo-change").style.display = "none";
//	} else {
//		document.getElementById("undo-change").style.display = "block";
//	}
//	if (redoChangeStack.length == 0) {
//		document.getElementById("redo-change").style.display = "none";
//	} else {
//		document.getElementById("redo-change").style.display = "block";
//	}
}

function insertPages(jsonInput) {
	var linklist = document.getElementById("page-link-select");
	linklist.innerHTML = "";
	
	for (i in jsonInput.pages) {
		if (jsonInput.pages[i].name != "AllPages") {
			var list = document.getElementById("project-page-list");
			var newListItem = document.createElement('li');
			if (jsonInput.pages[i].homepage == "yes") {
				if (jsonInput.pages[i].permissions == "public") {
					newListItem.innerHTML = '<a class="fixedText" href="#" id="page-'+i+'" onclick="newPage(event, '+i+');"><i class="icon-home"></i> ' + jsonInput.pages[i].name + '</a>';
				} else {
					newListItem.innerHTML = '<a class="fixedText" href="#" id="page-'+i+'" onclick="newPage(event, '+i+');"><i>M</i> ' + jsonInput.pages[i].name + '</a>';
				}
			} else {
				newListItem.innerHTML = '<a class="fixedText" href="#" id="page-'+i+'" onclick="newPage(event, '+i+');">' + jsonInput.pages[i].name + '</a>';
			}
			list.appendChild(newListItem);
			
			
			linklist.innerHTML += "<option value=\""+jsonInput.pages[i].name+"\">"+jsonInput.pages[i].name+"</option>"
		}
	}
}

function insertElements(jsonInput, id) {
	var pageid = document.getElementById("page-identifier");
	pageid.value = id;
	document.getElementById("element-editor").style.display = 'none';
	$('#page-menu-options').hide();
	$('#element-menu-button').hide();
	var dropdown = document.getElementById("page-dropdown");
	dropdown.innerHTML = "Page: &nbsp; " + jsonInput.pages[id].name + " &nbsp;&nbsp;&nbsp; <i class=\"icon-caret-down\" style=\"float:right;\"></i>";
	var container = document.getElementById("outer-container");
	
	if (jsonInput.pages[id].name != "Login" && jsonInput.pages[id].name != "Register") {
		document.getElementById("page-options-name").innerHTML = jsonInput.pages[id].name + "<span class=\"fixedText\" onclick=\"deletePage(event)\" style=\"display:inline-block; float:right;\"><i class=\"icon-trashcan\"></i></span><span class=\"fixedText\" href=\"#\" onclick=\"editPageName(event)\" style=\"display:inline-block; float:right;\"><i class=\"icon-pencil\"></i></span>"
	} else {
		document.getElementById("page-options-name").innerHTML = jsonInput.pages[id].name;
	}
	if (tempApplication.pages[id].permissions == "members") {
		$('#permissions-toggle').bootstrapToggle('on');
	} else {
		$('#permissions-toggle').bootstrapToggle('off');
	}
	if (tempApplication.pages[id].pageObject == "none") {
		$('#page-object-toggle').bootstrapToggle('off');
		document.getElementById('page-object-dropdown').disabled = true;
	} else {
		$('#page-object-toggle').bootstrapToggle('on');
		document.getElementById('page-object-dropdown').disabled = false;
		document.getElementById('page-object-dropdown').value = tempApplication.pages[id].pageObject;
	}
	if (tempApplication.pages[id].homepage == "yes") {
		document.getElementById('homepage-toggle').innerHTML = "Homepage Set";
		document.getElementById('homepage-toggle').disabled = true;
	} else {
		document.getElementById('homepage-toggle').innerHTML = "Set as Homepage";
		document.getElementById('homepage-toggle').disabled = false;
	}
	if (tempApplication.pages[id].showallpages == "yes") {
		$('#show-allpages-elements-toggle').bootstrapToggle('on');
	} else {
		$('#show-allpages-elements-toggle').bootstrapToggle('off');
	}
	if (tempApplication.pages[id].showinheader == "yes") {
		$('#page-header-toggle').bootstrapToggle('on');
	} else {
		$('#page-header-toggle').bootstrapToggle('off');
	}
	document.getElementById('page-background-colour').value = tempApplication.pages[id].background;
	document.getElementById("project-content").style.backgroundColor = tempApplication.pages[id].background;
	
	document.getElementById('heading-background-colour').value = tempApplication.headerBackgroundColour;
	document.getElementById("user-header").style.backgroundColor = tempApplication.headerBackgroundColour;
	
	document.getElementById('heading-text-colour').value = tempApplication.headerTextColour;
	document.getElementById("user-header").style.color = tempApplication.headerTextColour;
	
	addToHeader();
	
	container.innerHTML = "";

	var elementToAdd;
	if (jsonInput.pages[id].showallpages == "yes") {
		for (i in jsonInput.pages[0].elements) {
			elementToAdd = jsonInput.pages[0].elements[i].content;
			container.innerHTML += elementToAdd;
			noOfElements += 1;
		}
	}

	for (j in jsonInput.pages[id].elements) {
		elementToAdd = jsonInput.pages[id].elements[j].content;
		container.innerHTML += elementToAdd;
		noOfElements += 1;
	}
	
	document.getElementById("project-content").style.height = "1000px"
	
	for (k in container.childNodes) {
		if(container.childNodes[k].tagName) {
			var elementTop = 0;
			var elementHeight = 0;
			if (container.childNodes[k].style.top) {
				elementTop = container.childNodes[k].style.top.match(/\d+/g);
				elementTop = parseInt(elementTop[0], 10);
			}
			if (container.childNodes[k].style.height) {
				elementHeight = container.childNodes[k].style.height.match(/\d+/g);
				elementHeight = parseInt(elementHeight[0], 10);
			}
			
			var containerHeight = $("#project-content").height();
			
			while (elementTop + elementHeight > containerHeight) {
				extendPageLength();
				containerHeight = $("#project-content").height()
			}
		}
	}
}

function checkSave(jsonInput, pageId) {
	if (JSON.stringify(Application) !== JSON.stringify(tempApplication)) {
		return true;
	} else {
		return false;
	}
}

$('#element-menu-button').click(function(){
	$('#element-editor').toggle();
	$('#query-builder').hide();
	$('#page-menu-options').hide();
});

$('#object-query-type').change(selectQueryType);

function selectQueryType() {
	var selection = document.getElementById("object-query-type-dropdown").value;
	var container = document.getElementById("object-query-type-container");
	if (selection == "user") {
		if (document.getElementById("object-query-object-container") != null) {
			document.getElementById("object-query-object-container").outerHTML = "";
		}
		if (document.getElementById("object-query-field-container") != null) {
			document.getElementById("object-query-field-container").outerHTML = "";
		}
		if (document.getElementById("object-query-comparator-container") != null) {
			document.getElementById("object-query-comparator-container").outerHTML = "";
		}
		var userFields = "<option disabled selected value=\"userReset\">User Fields</option>";
		for (i in tempApplication.objects) {
			if (tempApplication.objects[i].name == "User") {
				for (j in tempApplication.objects[i].attributes) {
					userFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
				}
			}
		}
		container.innerHTML = "<div class=\"col_full object-query-block object-query-even\" id=\"object-query-user\">" +
				"<select id=\"object-query-user-dropdown\">"+ userFields +"</select></div>";
	} else if (selection == "page") {
		if (document.getElementById("object-query-object-container") != null) {
			document.getElementById("object-query-object-container").outerHTML = "";
		}
		if (document.getElementById("object-query-field-container") != null) {
			document.getElementById("object-query-field-container").outerHTML = "";
		}
		if (document.getElementById("object-query-comparator-container") != null) {
			document.getElementById("object-query-comparator-container").outerHTML = "";
		}
		var pageFields = "<option disabled selected value=\"pageReset\">Page Fields</option>";
		var pageId = document.getElementById("page-identifier").value;
		var pageObject = tempApplication.pages[pageId].pageObject;
		for (i in tempApplication.objects) {
			if (tempApplication.objects[i].name == pageObject) {
				for (j in tempApplication.objects[i].attributes) {
					userFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
				}
			}
		}
		container.innerHTML = "<div class=\"col_full object-query-block object-query-even\" id=\"object-query-page\">" +
				"<select id=\"object-query-page-dropdown\">"+ userFields +"</select></div>";
	} else {
		container.innerHTML = "<div class=\"col_half object-query-block object-query-even\" id=\"object-query-object\"></div>" +
			"<div class=\"col_half col_last object-query-block object-query-even\" id=\"object-query-field-display\">Field</div>"
		container.insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-object-container\"></div>");
		var objectList = "<option disabled selected value=\"objectReset\">Object</option>";
		for (i in tempApplication.objects) {
			objectList += "<option value=\""+ tempApplication.objects[i].name + "\">"+ tempApplication.objects[i].name +"</option>";
		}
		document.getElementById("object-query-object").innerHTML = "<select id=\"object-query-object-dropdown\">"+ objectList +"</select>";
		$('#object-query-object').change(selectObjectType);
	}
	$('#add-object-query-btn').click(addQuery);
}



function selectObjectType() {
	var fieldDisplay = document.getElementById("object-query-field-display");
	var fieldList = "<option disabled selected value=\"fieldReset\">Field</option>";
	var selectedObjectName = document.getElementById("object-query-object-dropdown").value;
	for (i in tempApplication.objects) {
		if (selectedObjectName == tempApplication.objects[i].name) {
			for (j in tempApplication.objects[i].attributes){
				fieldList += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
			}
		}
	}
	fieldDisplay.innerHTML = "<select id=\"object-query-field-display-dropdown\">" + fieldList + "</select>";
	var container = document.getElementById("object-query-object-container");
	if (document.getElementById("object-query-add-constraint-btn") == null){
		container.innerHTML += "<button class=\"button button-green\" id=\"object-query-add-constraint-btn\"><i class=\"icon-line-plus\"></i> Add Constraint</button>";
		$('#object-query-add-constraint-btn').click(populateObjectFieldsQuery);
	}
}

function populateObjectFieldsQuery() {
	var container = document.getElementById("object-query-object-container");
	container.insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-field-container\">" +
			"<div class=\"col_one_third object-query-block object-query-even\" id=\"object-query-field\">Field</div>" +
			"<div class=\"col_one_third object-query-block object-query-even\" id=\"object-query-operator\">" +
				"<select id=\"object-query-operator-dropdown\">" +
					"<option disabled selected value=\"operatorReset\">Operator</option>" +
					"<option value=\"equal\">=</option>" +
					"<option value=\"not-equal\">!=</option>" +
					"<option value=\"lt\">&lt;</option>" +
					"<option value=\"gt\">&gt;</option>" +
					"<option value=\"lte\">&lt;=</option>" +
					"<option value=\"gte\">&gt;=</option>" +
				"</select>" +
			"</div>" +
			"<div class=\"col_one_third col_last object-query-block object-query-even\" id=\"object-query-comparator-select\">" +
				"<select id=\"object-query-comparator-select-dropdown\">" +
					"<option disabled selected value=\"comparatorReset\">Comparator</option>" +
					"<option value=\"userId\">Current User</option>" +
					"<option value=\"value\">Value</option>" +
					"<option value=\"query\">Nested Search</option>" +
					"<option disabled value=\"pageObject\">Page's object</option>" +
				"</select>" +
			"</div>" +
		"</div>");
	
	var fieldList = "<option disabled selected>Field</option>";
	var selectedObjectName = document.getElementById("object-query-object-dropdown").value;
	for (i in tempApplication.objects) {
		if (selectedObjectName == tempApplication.objects[i].name) {
			for (j in tempApplication.objects[i].attributes){
				fieldList += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
			}
		}
	}
	
	document.getElementById("object-query-field").innerHTML = "<select id=\"object-query-field-dropdown\">" + fieldList + "</select>";
	$('#object-query-comparator-select-dropdown').change(selectQueryComparator);
}

function selectQueryComparator() {
	var container = document.getElementById("object-query-field-container");
	var comparatorSelection = document.getElementById("object-query-comparator-select-dropdown").value;
	if (comparatorSelection == "userId") {
		var userFields = "";
		for (i in tempApplication.objects) {
			if (tempApplication.objects[i].name == "User") {
				for (j in tempApplication.objects[i].attributes) {
					userFields += "<option value=\""+ tempApplication.objects[i].attributes[j].name + "\">" + tempApplication.objects[i].attributes[j].name + "</option>";
				}
			}
		}
		container.insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-comparator-container\">" +
				"<div class=\"col_full object-query-block object-query-even\" id=\"object-query-comparator\">" +
					"<select id=\"object-query-comparator-dropdown\">" +
						"<option disabled selected>Current User</option>" +
						userFields +
				"</div>" +
			"</div>")
	} else if(comparatorSelection == "value") {
		container.insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-comparator-container\">" +
				"<div class=\"col_full object-query-block object-query-even\" id=\"object-query-comparator\">" +
					"<input type=\"text\" id=\"object-query-comparator-dropdown\">" +
				"</div>" +
			"</div>")
		
	}
	
}

function addQuery() {
	undoChangeStack.push(JSON.stringify(tempApplication));
	var pageId = document.getElementById("page-identifier").value;
	var failed = false;
	var queryType = document.getElementById("object-query-type-dropdown").value;
	if (queryType == "user") {
		if (document.getElementById("object-query-user-dropdown").value == "userReset") {
			failed = true;
		} else {
			var userField = document.getElementById("object-query-user-dropdown").value;
			var queryJson = {
				"id": noOfQueries,
				"display": {
					"object": "User",
					"field": userField
				},
				"query": {
					"type": "user",
					"object": "User",
					"field": "primary_key",
					"operator": "equal",
					"comparator": "userId"
				}
			};
			tempApplication['pages'][pageId]['queries'].push(queryJson);
			var element = document.getElementsByClassName("selected-element")[0];
			for (i in element.childNodes) {
				if (typeof element.childNodes[i].outerHTML !== 'undefined'){
					if (element.childNodes[i].classList.contains('element-text')) {
						element.childNodes[i].innerHTML += "<span class=\"query\" id=\"query-"+noOfQueries+"\" onclick=\"editQuery(this)\">User." + userField + "</span>";
					}
				}
			}
			//document.getElementById("element-inner-text").innerHTML += "<span class=\"query\" id=\"query-"+noOfQueries+"\" onclick=\"editQuery(this)\">User." + userField + "</span>";
		}
	} else if (queryType == "page") {
		if (document.getElementById("object-query-page-dropdown").value == "pageReset") {
			failed = true;
		} else {
			var pageField = document.getElementById("object-query-page-dropdown").value;
			var pageObject = tempApplication.pages[pageId].pageObject;
			var queryJson = {
				"id": noOfQueries,
				"display": {
					"object": pageObject,
					"field": pageField
				},
				"query": {
					"type": "page",
					"object": pageObject,
					"field": "primary_key",
					"operator": "equal",
					"comparator": "pageId"
				}
			};
			tempApplication['pages'][pageId]['queries'].push(queryJson);
			var element = document.getElementsByClassName("selected-element")[0];
			for (i in element.childNodes) {
				if (typeof element.childNodes[i].outerHTML !== 'undefined'){
					if (element.childNodes[i].classList.contains('element-text')) {
						element.childNodes[i].innerHTML += "<span class=\"query\" id=\"query-"+noOfQueries+"\" onclick=\"editQuery(this)\">"+pageObject+"." + pageField + "</span>";
					}
				}
			}
		}
	} else if(queryType == "search-single" || queryType == "search-multiple") {
		if (document.getElementById("object-query-object-dropdown").value == "objectReset") {
			failed = true;
		} else if (document.getElementById("object-query-field-display-dropdown").value == "fieldReset") {
			failed = true;
		} else {
			var type = document.getElementById("object-query-type-dropdown").value;
			var object = document.getElementById("object-query-object-dropdown").value;
			var displayField = document.getElementById("object-query-field-display-dropdown").value;
			var queryField = document.getElementById("object-query-field-dropdown").value;
			var operator = document.getElementById("object-query-operator-dropdown").value;
			var comparator = document.getElementById("object-query-comparator-dropdown").value;
			var comparatorSelect = document.getElementById("object-query-comparator-select-dropdown").value;
			var queryJson = { 
				"id": noOfQueries,
				"display": {
					"object": object,
					"field": displayField
				},
			  	"query": {
			  		"type": type,
			  		"object": object, 
			  		"field": queryField,
			  		"operator": operator,
			  		"comparator": comparator,
			  		"comparatorType": comparatorSelect
			  	}
			};
			tempApplication['pages'][pageId]['queries'].push(queryJson);
			var element = document.getElementsByClassName("selected-element")[0];
			console.log("test");
			console.log(element);
			for (i in element.childNodes) {
				if (typeof element.childNodes[i].outerHTML !== 'undefined'){
					console.log(element.childNodes[i]);
					if (element.childNodes[i].classList.contains('element-text')) {
						element.childNodes[i].innerHTML += "<span class=\"query\" id=\"query-"+noOfQueries+"\" onclick=\"editQuery(this)\">" + object + "." + displayField + "</span>";
					}
				}
			}
			//document.getElementById("element-inner-text").innerHTML += "<span class=\"query\" id=\"query-"+noOfQueries+"\" onclick=\"editQuery(this)\">" + object + "." + displayField + "</span>";
			document.getElementById("object-query-object-container").outerHTML = "";
			document.getElementById("object-query-field-container").outerHTML = "";
			document.getElementById("object-query-comparator-container").outerHTML = "";
		}
	}
	
	if (!failed) {
		noOfQueries += 1;
		document.getElementById("object-query-type-container").outerHTML = "";
		document.getElementById("object-query-type-select-container").innerHTML = "<div class=\"col_full object-query-block object-query-even\" id=\"object-query-type\">" +
			"<select id=\"object-query-type-dropdown\">"+
				"<option disabled selected value=\"reset\">Search Type</option>"+
				"<option value=\"search-single\">Single Object Search</option>"+
				"<option class=\"user-option\" value=\"user\">Current User Fields</option>"+
				"<option class=\"page-option\" value=\"page\">Current Page Fields</option>"+
			"</select>"+
		"</div>";
		document.getElementById("object-query-type-select-container").insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-type-container\"></div>");
		$('#object-query-type').change(selectQueryType);
		$('#query-builder').hide();
		saveJsonLocal(tempApplication);
	}
}

function editQuery(query) {
	queryId = query.id.match(/\d+/g);
	queryId = queryId[0];
	var pageId = document.getElementById("page-identifier").value;
	var queryJson
	for (i in tempApplication.pages[pageId].queries) {
		if (tempApplication.pages[pageId].queries[i].id == queryId) {
			queryJson = tempApplication.pages[pageId].queries[i];
		}
	}
	$('#query-builder').show();
	if (queryJson.query.type == "User") {
		//then show the user object queries
		document.getElementById("object-query-type-dropdown").value = queryJson.query.type;
		selectQueryType();
		document.getElementById("object-query-user-dropdown").value = queryJson.display.field;
	} else {
		//show the search object queries
		document.getElementById("object-query-type-dropdown").value = queryJson.query.type;
		selectQueryType();
		document.getElementById("object-query-object-dropdown").value = queryJson.display.object;
		selectObjectType();
		document.getElementById("object-query-field-display-dropdown").value = queryJson.display.field;
		populateObjectFieldsQuery();
		document.getElementById("object-query-field-dropdown").value = queryJson.query.field;
		document.getElementById("object-query-operator-dropdown").value = queryJson.query.operator;
		document.getElementById("object-query-comparator-select-dropdown").value = queryJson.query.comparatorType;
		selectQueryComparator();
		document.getElementById("object-query-comparator-dropdown").value = queryJson.query.comparator;
	}
	if (document.getElementById("add-object-query-btn") != null) {
		document.getElementById("add-object-query-btn").outerHTML = "<button class=\"button nobottommargin\" id=\"edit-object-query-btn\" onclick=\"completeEditQuery("+queryId+")\">Edit Object Query</button>";
	}
}

function completeEditQuery(queryId) {
	undoChangeStack.push(JSON.stringify(tempApplication));
	var pageId = document.getElementById("page-identifier").value;
	var textbox = document.getElementById("element-inner-text");
	var query = document.getElementById("query-"+queryId);
	var failed = false;
	var queryType = document.getElementById("object-query-type-dropdown").value;
	if (queryType == "user") {
		if (document.getElementById("object-query-user-dropdown").value == "userReset") {
			failed = true;
		} else {
			var userField = document.getElementById("object-query-user-dropdown").value;
			var queryJson = {
				"id": noOfQueries,
				"display": {
					"object": "User",
					"field": userField
				},
				"query": {
					"type": "user",
					"object": "User",
					"field": "primary_key",
					"operator": "equal",
					"comparator": "userId"
				}
			};
			tempApplication.pages[pageId].queries[queryId] = queryJson;
			query.innerHTML = "User." + userField;
		}
	} else if(queryType == "search") {
		if (document.getElementById("object-query-object-dropdown").value == "objectReset") {
			failed = true;
		} else if (document.getElementById("object-query-field-display-dropdown").value == "fieldReset") {
			failed = true;
		} else {
			var type = document.getElementById("object-query-type-dropdown").value;
			var object = document.getElementById("object-query-object-dropdown").value;
			var displayField = document.getElementById("object-query-field-display-dropdown").value;
			var queryField = document.getElementById("object-query-field-dropdown").value;
			var operator = document.getElementById("object-query-operator-dropdown").value;
			var comparator = document.getElementById("object-query-comparator-dropdown").value;
			var comparatorSelect = document.getElementById("object-query-comparator-select-dropdown").value;
			var queryJson = { 
				"id": noOfQueries,
				"display": {
					"object": object,
					"field": displayField
				},
			  	"query": {
			  		"type": type,
			  		"object": object, 
			  		"field": queryField,
			  		"operator": operator,
			  		"comparator": comparator,
			  		"comparatorType": comparatorSelect
			  	}
			};
			tempApplication.pages[pageId].queries[queryId] = queryJson;
			query.innerHTML = object + "." + displayField;
			document.getElementById("object-query-object-container").outerHTML = "";
			document.getElementById("object-query-field-container").outerHTML = "";
			document.getElementById("object-query-comparator-container").outerHTML = "";
		}
	}
	if (!failed) {
		document.getElementById("object-query-type-container").outerHTML = "";
		document.getElementById("object-query-type-select-container").innerHTML = "<div class=\"col_full object-query-block object-query-even\" id=\"object-query-type\">" +
			"<select id=\"object-query-type-dropdown\">"+
				"<option disabled selected value=\"reset\">Search Type</option>"+
				"<option value=\"search-single\">Single Object Search</option>"+
				"<option class=\"user-option\" value=\"user\">Current User Fields</option>"+
				"<option class=\"page-option\" value=\"page\">Current Page Fields</option>"+
			"</select>"+
		"</div>";
		document.getElementById("object-query-type-select-container").insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-type-container\"></div>");
		document.getElementById("edit-object-query-btn").outerHTML = "<button class=\"button nobottommargin\" id=\"add-object-query-btn\" onclick=\"addQuery()\">Add Object Query</button>";
		$('#object-query-type').change(selectQueryType);
		$('#query-builder').hide();
		saveJsonLocal(tempApplication);
	}
}

function selectElement(id) {
	var pageId = document.getElementById("page-identifier").value;
	$('#page-menu-options').hide();
	$('#element-menu-button').show();
	document.getElementById("element-editor").style.display = 'none';
	document.getElementById("query-builder").style.display = 'none';
	var old_element = document.getElementById("element-editor");
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
	var element = document.getElementById(id);
	
	var elements = document.getElementsByClassName("element");
	for (var i=0; i < elements.length; i++) {    
	    elements[i].classList.remove("selected-element");
	    intervals.forEach(clearInterval);
	    $('.resizer').remove();
	    $('.mover').remove();
	    $('.delete').remove();
	    $('.refresh').remove();
	    $('.link').remove();
	}
	var fieldDeletes = document.getElementsByClassName("form-field-delete");
	for (var i=0; i<fieldDeletes.length; i++) {
		fieldDeletes[i].style.display = "none";
	}
	
	element.className +=' selected-element';
	document.getElementById("element-editor").style.display = 'block';
	
	var innertext;
	for (i in element.childNodes) {
		if (typeof element.childNodes[i].outerHTML !== 'undefined'){
			if (element.childNodes[i].classList.contains('element-text')) {
    			innertext = element.childNodes[i].innerHTML;
			}
		}
	}
	document.getElementById("element-inner-text").innerHTML = innertext;
	var elementwidth = window.getComputedStyle(document.getElementById(id)).getPropertyValue('width').split('px');
	document.getElementById('element-size-width').innerHTML = elementwidth[0];
	var elementheight = window.getComputedStyle(document.getElementById(id)).getPropertyValue('height').split('px');
	document.getElementById('element-size-height').innerHTML = elementheight[0];
	var elementtop = window.getComputedStyle(document.getElementById(id)).getPropertyValue('top').split('px');
	document.getElementById('element-position-top').innerHTML = elementtop[0];
	var elementleft = window.getComputedStyle(document.getElementById(id)).getPropertyValue('left').split('px');
	document.getElementById('element-position-left').innerHTML = elementleft[0];
	var paddingtop = document.getElementById(id).style.paddingTop.split('px');
	document.getElementById('element-padding-top').value = paddingtop[0];
	var paddingright = document.getElementById(id).style.paddingRight.split('px');
    document.getElementById('element-padding-right').value = paddingright[0];
    var paddingbottom = document.getElementById(id).style.paddingBottom.split('px');
    document.getElementById('element-padding-bottom').value = paddingbottom[0];
    var paddingleft = document.getElementById(id).style.paddingLeft.split('px');
    document.getElementById('element-padding-left').value = paddingleft[0];
    var hexcolourText = rgb2hex(document.getElementById(id).style.color).toString();
    var hexcolourBackground = rgb2hex(document.getElementById(id).style.backgroundColor).toString();
    if (!hexcolourText) {
    	hexcolourText = '#000000';
    }
    if (!hexcolourBackground) {
    	hexcolourBackground = '#FFFFFF';
    }
    document.getElementById('element-colour-text').value = hexcolourText;
    document.getElementById('element-colour-background').value = hexcolourBackground;
    
    var testElement = element.cloneNode(true);
    testElement.className = "element";
    document.getElementById("show-all-pages").checked = false;
    for (i in tempApplication.pages[0].elements) {
    	if (tempApplication.pages[0].elements[i].content == testElement.outerHTML) {
    		document.getElementById("show-all-pages").checked = true;
    	}
    }
	
    var deleteButton = document.createElement('div');
    deleteButton.id = id + 'delete';
    deleteButton.className = 'delete';
    deleteButton.innerHTML = '<i class=\"icon-line-cross\"></i>';
    element.appendChild(deleteButton);
	var resizerbottomright = document.createElement('div');
    resizerbottomright.className = 'resizer resizerbottomright';
    resizerbottomright.id = id + 'resizer';
    element.appendChild(resizerbottomright);
    var link = document.createElement('div');
    link.className = 'link';
    link.id = id + 'link';
    link.innerHTML = "<i class='icon-link' id='link-icon'></i>";
    var mover = document.createElement('div');
    mover.className = 'mover';
    mover.id = id + 'mover';
    mover.innerHTML = "<i class='icon-move' id='move-icon'></i>";
    var refresh = document.createElement('div');
    refresh.className = 'refresh';
    refresh.id = id + 'refresh';
    refresh.innerHTML = "<i class='icon-refresh' id='refresh-icon'></i>";
    element.appendChild(mover);
    var editText = document.getElementById("edit-rich-text-btn");
    resizerbottomright.addEventListener('mousedown', initResizeDrag, false);
    mover.addEventListener('mousedown', initMoveDrag, false);
    deleteButton.addEventListener('mousedown', deleteElement, false);
    refresh.addEventListener('mousedown', refreshForm, false);
    link.addEventListener('mousedown', linkelement, false);
    document.getElementById('element-padding-top').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-right').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-bottom').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-left').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-colour-text').addEventListener('change', textColour, false);
    document.getElementById('element-colour-background').addEventListener('change', backgroundColour, false);
    document.getElementById('show-all-pages').addEventListener('change', showAllPages, false);
    
    if (element.nodeName == "FORM") {
    	element.appendChild(refresh);
    	var fieldDeletes = document.getElementsByClassName("form-field-delete");
    	for (i in element.childNodes) {
    		if (typeof element.childNodes[i].outerHTML !== 'undefined') {
	    		if (element.childNodes[i].classList.contains("form-field-delete")) {
	    			element.childNodes[i].style.display = "inline-block";
	    			element.childNodes[i].addEventListener('mousedown', deleteFormFieldInit, false);
	    		}
    		}
    	}
    } else {
    	element.appendChild(link);
    }
    
    window.onclick = function(event) {
    	var mover = document.getElementById('icon-move');
    	var resizer = document.getElementById(id + 'resizer');
    	var deleteButton = document.getElementById(id + 'delete');
    	var container = document.getElementById("project-content");
    	var container2 = document.getElementById("outer-container");
    	var editor = document.getElementById("element-editor");
    	var inelement = false;
    	if (event.target != container && event.target != container2) {
    		inelement = true;
    	}
	    if (!inelement) {
	    	element.classList.remove("selected-element");
	    	editor.style.display = 'none';
	    	document.getElementById("query-builder").style.display = 'none';
	    	intervals.forEach(clearInterval);
		    $('.resizer').remove();
		    $('.mover').remove();
		    $('.delete').remove();
		    $('.refresh').remove();
		    $('.link').remove();
		    $('#element-menu-button').hide();
		    var fieldDeletes = document.getElementsByClassName("form-field-delete");
			for (var i=0; i<fieldDeletes.length; i++) {
				fieldDeletes[i].style.display = "none";
			}
			for (i in element.childNodes) {
				if (typeof element.childNodes[i].outerHTML !== 'undefined'){
					if (element.childNodes[i].classList.contains('element-text')) {
						element.childNodes[i].contentEditable = "false";
					}
				}
			}
	    }
	}
    
    function linkelement() {
    	document.getElementById("elementLinkModal").style.display = 'block';
    	$('.close').click(function(){
        	$('#elementLinkModal').hide()
        });
    	$('#set-link-btn').click(function(){
    		selected = document.getElementById("page-link-select")
    		link = {
        			"id": id, 
        			"page": selected.options[selected.selectedIndex].value
        	}
    		tempApplication.pages[pageId].links.push(link);
        	$('#elementLinkModal').hide()
    	});
    }
    
    function showAllPages(e) {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	var oldelement = document.getElementById(id).cloneNode(true);
    	oldelement.childNodes[1].outerHTML = "";
    	oldelement.childNodes[1].outerHTML = "";
    	oldelement.childNodes[1].outerHTML = "";
    	oldelement.className = "element";
    	var element = oldelement.cloneNode(true);
    	if (document.getElementById('show-all-pages').checked) {
    		element.id = element.id+"-"+document.getElementById("page-identifier").value;
			tempApplication.pages[0].elements.push({"content": element.outerHTML});
			for (i in tempApplication.pages[document.getElementById("page-identifier").value].elements) {
				if (tempApplication.pages[document.getElementById("page-identifier").value].elements[i].content == oldelement.outerHTML) {
					tempApplication.pages[document.getElementById("page-identifier").value].elements.splice(i,1);
				}
			}
			document.getElementById(id).id = id+"-"+document.getElementById("page-identifier").value;
			id = id+"-"+document.getElementById("page-identifier").value
    	} else {
    		for (i in tempApplication.pages[0].elements) {
    			if (tempApplication.pages[0].elements[i].content == oldelement.outerHTML) {
    				tempApplication.pages[0].elements.splice(i,1);
    			}
    		}
    		var elementid = element.id.match(/\d+/g)
    		element.id = elementid[0];
    		tempApplication.pages[elementid[1]].elements.push({"content": element.outerHTML});
    		if (elementid[1] != document.getElementById("page-identifier").value) {
    			document.getElementById(id).outerHTML = "";
    			document.getElementById("element-editor").style.display = 'none';
    		} else {
    			document.getElementById(id).outerHTML = element.outerHTML;
        		id = elementid[0]
    			selectElement(id);
    		}
    	}
    }
    
    function deleteElement(e) {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	for (i in tempApplication.pages[pageId].forms) {
    		if (tempApplication.pages[pageId].forms[i].id == element.id) {
    			tempApplication.pages[pageId].forms.splice(i, 1);
    		}
    	}
    	document.getElementById(id).outerHTML = "";
    	saveJsonLocal(tempApplication);
    	document.getElementById("element-editor").style.display = 'none';
    }

    function refreshForm(e) {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	var form = document.getElementById(id);
    	var formElements = "";
    	var formJson;
    	for (i in tempApplication.pages[pageId].forms) {
    		if (tempApplication.pages[pageId].forms[i].id == element.id) {
    			formJson = tempApplication.pages[pageId].forms[i];
    		}
    	}
    	var formFields = [];
    	var fieldNo = 0;
    	var formobject = formJson.object;
    	for (i in tempApplication.objects[formobject].attributes) {
    		if (tempApplication.objects[object].attributes[i].type != "primaryKey" && tempApplication.objects[object].attributes[i].type != "Connection"){
	    		formFields.push(
	    				{
	    					"type": tempApplication.objects[formobject].attributes[i].type,
	    					"label": tempApplication.objects[formobject].attributes[i].name
	    				}
	    		);
    		}
    		if (tempApplication.objects[formobject].attributes[i].type == "Text"){
    			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:inline-block\"></i>";
    			formElements += "<label> &nbsp;" + tempApplication.objects[formobject].attributes[i].name + "</label><input type=\"text\" class=\"form-control user-form\"/>";
    			fieldNo += 1;
    		} else if (tempApplication.objects[formobject].attributes[i].type == "Number"){
    			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:inline-block\"></i>";
    			formElements += "<label> &nbsp;" + tempApplication.objects[formobject].attributes[i].name + "</label><input type=\"number\" class=\"form-control user-form\"/>";
    			fieldNo += 1;
    		} else if (tempApplication.objects[formobject].attributes[i].type == "Reference"){
    			formElements += "<i class=\"icon-line-cross form-field-delete\" id=\"field"+ fieldNo +"\" style=\"display:inline-block\"></i>";
    			formElements += "<label> &nbsp;" + tempApplication.objects[formobject].attributes[i].name + "</label><select class=\"form-control user-form\"/></select>";
    			fieldNo += 1;
    		}
    	}
    	formElements += "<button disabled class=\"btn btn-default\">Submit</button>";
    	form.innerHTML = formElements;
    	element.appendChild(mover);
    	element.appendChild(deleteButton);
    	element.appendChild(resizerbottomright);
    	element.appendChild(refresh);
    	
    	for (i in tempApplication.pages[pageId].forms) {
    		if (tempApplication.pages[pageId].forms[i].id == element.id) {
    			tempApplication.pages[pageId].forms[i].fields = formFields;
    		}
    	}
    	
    	saveJsonLocal(tempApplication);
    }
    
    function deleteFormFieldInit(event){
    	var field = event.target.id;
    	var fieldNo = parseInt(field.slice(5,10), 10);
    	
    	deleteFormField(fieldNo);
    }
    
    function deleteFormField(fieldNo) {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	element.childNodes[fieldNo*3].classList.remove("form-field-delete");
    	var fieldName = element.childNodes[fieldNo*3+1].innerHTML;
    	element.childNodes[fieldNo*3].style.display = "none";
    	element.childNodes[fieldNo*3+1].style.display = "none";
    	element.childNodes[fieldNo*3+2].style.display = "none";
    	
    	for (i in tempApplication.pages[pageId].forms) {
    		if (tempApplication.pages[pageId].forms[i].id == element.id) {
    			for (j in tempApplication.pages[pageId].forms[i].fields) {
    				if (tempApplication.pages[pageId].forms[i].fields[j].label == fieldName) {
    					tempApplication.pages[pageId].forms[i].fields.splice(j, 1);
    				}
    			}
    		}
    	}
    	
    	saveJsonLocal(tempApplication);
    }
    
    $('#start-query-btn').click(function(){
    	document.getElementById("query-builder").style.display = 'block';
		document.getElementById("object-query-type-container").outerHTML = "";
		document.getElementById("object-query-type-select-container").innerHTML = "<div class=\"col_full object-query-block object-query-even\" id=\"object-query-type\">" +
			"<select id=\"object-query-type-dropdown\">"+
				"<option disabled selected value=\"reset\">Search Type</option>"+
				"<option value=\"search-single\">Single Object Search</option>"+
				"<option class=\"user-option\" value=\"user\">Current User Fields</option>"+
				"<option class=\"page-option\" value=\"page\">Current Page Fields</option>"+
			"</select>"+
		"</div>";
		if (tempApplication.pages[pageId].permissions == "public") {
			var userOptions = document.getElementsByClassName("user-option");
			for (i in userOptions) {
				userOptions[i].disabled = true;
			}
		}
		if (tempApplication.pages[pageId].pageObject == "none") {
			var pageOptions = document.getElementsByClassName("page-option");
			for (i in pageOptions) {
				pageOptions[i].disabled = true;
			}
		}
		document.getElementById("object-query-type-select-container").insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-type-container\"></div>");
		if (document.getElementById("edit-object-query-btn") != null) {
			document.getElementById("edit-object-query-btn").outerHTML = "<button class=\"button nobottommargin\" id=\"add-object-query-btn\" onclick=\"addQuery()\">Add Object Query</button>";
		}
		$('#object-query-type').change(selectQueryType);
    });
    
    $('#cancel-object-query-btn').click(function(){
    	document.getElementById("query-builder").style.display = 'none';
    	document.getElementById("object-query-type-container").outerHTML = "";
    	document.getElementById("object-query-type-select-container").innerHTML = "<div class=\"col_full object-query-block object-query-even\" id=\"object-query-type\">" +
			"<select id=\"object-query-type-dropdown\">"+
				"<option disabled selected value=\"reset\">Search Type</option>"+
				"<option value=\"search-single\">Single Object Search</option>"+
				"<option class=\"user-option\" value=\"user\">Current User Fields</option>"+
				"<option class=\"page-option\" value=\"page\">Current Page Fields</option>"+
			"</select>"+
		"</div>";
		if (tempApplication.pages[pageId].permissions == "public") {
			var userOptions = document.getElementsByClassName("user-option");
			for (i in userOptions) {
				userOptions[i].disabled = true;
			}
		}
		if (tempApplication.pages[pageId].pageObject == "none") {
			var pageOptions = document.getElementsByClassName("page-option");
			for (i in pageOptions) {
				pageOptions[i].disabled = true;
			}
		}
		document.getElementById("object-query-type-select-container").insertAdjacentHTML("afterend", "<div class=\"row object-query-container\" id=\"object-query-type-container\"></div>");
		$('#object-query-type').change(selectQueryType);
    });
    
    $('#element-text-bold-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-bold-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-bold-btn').style.backgroundColor = "rgb(134, 133, 133)";
    	} else {
    		document.getElementById('element-text-bold-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('bold', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-italic-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-italic-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-italic-btn').style.backgroundColor = "rgb(134, 133, 133)";
    	} else {
    		document.getElementById('element-text-italic-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('italic', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-underline-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-underline-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-underline-btn').style.backgroundColor = "rgb(134, 133, 133)";
    	} else {
    		document.getElementById('element-text-underline-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('underline', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-ul-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-ul-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-ul-btn').style.backgroundColor = "rgb(134, 133, 133)";
    	} else {
    		document.getElementById('element-text-ul-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('insertUnorderedList', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-ol-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-ol-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-ol-btn').style.backgroundColor = "rgb(134, 133, 133)";
    	} else {
    		document.getElementById('element-text-ol-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('insertOrderedList', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-link-btn').click(function() {
    	document.getElementById("element-text-link-container").style.display = "block";
    });
    
    $('#element-text-link-button').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	var linkAddress = document.getElementById("element-text-link-input").value;
    	document.getElementById("element-text-link-container").style.display = "none";
    	document.execCommand('createLink', false, linkAddress);
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-unlink-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	document.execCommand('unlink', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-align-left-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-align-left-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-align-left-btn').style.backgroundColor = "rgb(134, 133, 133)";
    		document.getElementById('element-text-align-centre-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-right-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	} else {
    		document.getElementById('element-text-align-left-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-centre-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-right-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('justifyLeft', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-align-centre-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-align-centre-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-align-centre-btn').style.backgroundColor = "rgb(134, 133, 133)";
    		document.getElementById('element-text-align-left-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-right-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	} else {
    		document.getElementById('element-text-align-left-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-centre-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-right-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('justifyCenter', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-align-right-btn').click(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	if (window.getComputedStyle(document.getElementById('element-text-align-right-btn'), null).getPropertyValue('background-color') == "rgb(64, 63, 63)") {
    		document.getElementById('element-text-align-right-btn').style.backgroundColor = "rgb(134, 133, 133)";
    		document.getElementById('element-text-align-left-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-centre-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	} else {
    		document.getElementById('element-text-align-left-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-centre-btn').style.backgroundColor = "rgb(64, 63, 63)";
    		document.getElementById('element-text-align-right-btn').style.backgroundColor = "rgb(64, 63, 63)";
    	}
    	document.execCommand('justifyRight', false, "");
    	saveJsonLocal(tempApplication);
    });
    
    $('#element-text-font-size-dropdown').change(function() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	var size = document.getElementById("element-text-font-size-dropdown").value;
    	document.execCommand('fontSize', false, size);
    	saveJsonLocal(tempApplication);
    });
    
    function copyTextToElement() {
    	undoChangeStack.push(JSON.stringify(tempApplication));
    	var text = document.getElementById("element-inner-text");
    	for (i in element.childNodes) {
    		if (typeof element.childNodes[i].outerHTML !== 'undefined'){
    			if (element.childNodes[i].classList.contains('element-text')) {
    				text.innerHTML = element.childNodes[i].innerHTML;
    			}
    		}
    	}
    	saveJsonLocal(tempApplication);
    }
    
    for (i in element.childNodes) {
		if (typeof element.childNodes[i].outerHTML !== 'undefined'){
			if (element.childNodes[i].classList.contains('element-text')) {
				element.childNodes[i].contentEditable = "true";
			}
		}
	}
    
	var textRefresh = setInterval(copyTextToElement, 3000);
	intervals.push(textRefresh);
    
    
	var startX, startY, startWidth, startHeight;
	
	function initResizeDrag(e) {
		undoChangeStack.push(JSON.stringify(tempApplication));
		startX = e.clientX;
		startY = e.clientY;
		startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
		startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
		document.documentElement.addEventListener('mousemove', doResizeDrag, false);
		document.documentElement.addEventListener('mouseup', stopResizeDrag, false);
	}
	
	function doResizeDrag(e) {
		element.style.width = Math.ceil((startWidth + e.clientX - startX) / 10) * 10 + 'px';
		element.style.height = Math.ceil((startHeight + e.clientY - startY) / 10) * 10 + 'px';
		document.getElementById('element-size-width').innerHTML = document.getElementById(id).style.width;
		document.getElementById('element-size-height').innerHTML = document.getElementById(id).style.height;
	}
	
	function stopResizeDrag(e) {
		document.documentElement.removeEventListener('mousemove', doResizeDrag, false);    
	    document.documentElement.removeEventListener('mouseup', stopResizeDrag, false);
	    
	    var pageId = document.getElementById("page-identifier").value;
		saveJsonLocal(tempApplication);
	}
	
	var startTop, startLeft;
	
	function initMoveDrag(e) {
		undoChangeStack.push(JSON.stringify(tempApplication));
		startX = e.clientX;
		startY = e.clientY;
		startLeft = parseInt(document.defaultView.getComputedStyle(element).left, 10);
		startTop = parseInt(document.defaultView.getComputedStyle(element).top, 10);
		document.documentElement.addEventListener('mousemove', doMoveDrag, false);
		document.documentElement.addEventListener('mouseup', stopMoveDrag, false);
	}
	
	function doMoveDrag(e) {
		if (startLeft + e.clientX - startX >= 0) {
			element.style.left = Math.ceil((startLeft + e.clientX - startX) / 10) * 10 + 'px';
		}
		if (startTop + e.clientY - startY >= 0) {
			element.style.top = Math.ceil((startTop + e.clientY - startY) / 10) * 10 + 'px';
		}
		document.getElementById('element-position-top').innerHTML = document.getElementById(id).style.top;
		document.getElementById('element-position-left').innerHTML = document.getElementById(id).style.left;
	}
	
	function stopMoveDrag(e) {
		document.documentElement.removeEventListener('mousemove', doMoveDrag, false);    
	    document.documentElement.removeEventListener('mouseup', stopMoveDrag, false);
	    
	    var pageId = document.getElementById("page-identifier").value;
		saveJsonLocal(tempApplication);
	}
	
	var paddingtop, paddingright, paddingbottom, paddingleft;
	
	function updatePadding() {
		undoChangeStack.push(JSON.stringify(tempApplication));
		
		paddingtop = document.getElementById('element-padding-top').value;
		paddingtop = paddingtop.split('px');
		element.style.paddingTop = paddingtop[0] + 'px';
		paddingright = document.getElementById('element-padding-right').value;
		element.style.paddingRight = paddingright + 'px';
		paddingbottom = document.getElementById('element-padding-bottom').value;
		element.style.paddingBottom = paddingbottom + 'px';
		paddingleft = document.getElementById('element-padding-left').value;
		element.style.paddingLeft = paddingleft + 'px';
		document.documentElement.removeEventListener('keyup', updatePadding, false);
	    document.documentElement.removeEventListener('keyup', updatePadding, false);
	    document.documentElement.removeEventListener('keyup', updatePadding, false);
	    document.documentElement.removeEventListener('keyup', updatePadding, false);
	    
		saveJsonLocal(tempApplication);
	}
	
	function textColour() {
		undoChangeStack.push(JSON.stringify(tempApplication));
		
		var colour = document.getElementById('element-colour-text').value;
		element.style.color = colour;
		
		saveJsonLocal(tempApplication);
	}
	
	function backgroundColour() {
		undoChangeStack.push(JSON.stringify(tempApplication));
		
		var colour = document.getElementById('element-colour-background').value;
		element.style.backgroundColor = colour;
		document.documentElement.removeEventListener('change', textColour, false);
	    document.documentElement.removeEventListener('change', backgroundColour, false);
	    
	    saveJsonLocal(tempApplication);
	}
	
	function rgb2hex(rgb){
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? '#' + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}
	
}