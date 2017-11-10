var Application = {
	"id": 1,
	"name": "myFirstProject",
	"objects": [
		{ 
			"name": "Customer", "attributes": [
				{ "first_name": "String" }, 
				{ "last_name": "String" },
				{ "id": "primary_key"} 
			] 
		}
	],
	"pages": [
		{ 
			"name": "Home",
			"elements": [
				{ "id": 0, "content": "<h1 class=\"element\" id=\"0\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:150px; left:300px;\">This is a Heading</h1>" },
				{ "id": 1, "content": "<p class=\"element\" id=\"1\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px; top:250px; left:300px;\">Use offset of mouse position before and after to get position of drag and drop</p>" }
			],
		"workflows": [] 
		},
		{ 
			"name": "Second",
			"elements": [
				{ "id": 0, "content": "<h1 class=\"element\" id=\"0\" onclick=\"selectElement(this.id)\" style=\"color:#ff0000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">This is a Heading</h1>" },
				{ "id": 1, "content": "<p class=\"element\" id=\"1\" onclick=\"selectElement(this.id)\" style=\"color:#ff0000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">Use offset of mouse position before and after to get position of drag and drop</p>" }
			],
		"workflows": [] 
		}
	]
}

var noOfElements = 0;

function addContainer(event) {
	event.preventDefault();
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	
	var divElement = "<div class=\"element\" id=\"3\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">This is a Container</div>";
	container.innerHTML += divElement;
	
	console.log("container created");
	
}

function checkSave(jsonInput, pageId) {
	var allElements = document.getElementById("outer-container").childNodes;
	var saveElements = [];
	for (i in allElements) {
		if (typeof allElements[i].outerHTML !== 'undefined'){
			saveElements.push(
					{ 
						"id": parseInt(i),
						"content": allElements[i].outerHTML,
					}
			);
		}
	}
	if (JSON.stringify(saveElements) !== JSON.stringify(jsonInput.pages[pageId].elements)) {
		return true;
	} else {
		return false;
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
	}
	
	var saveButton = document.getElementById("save-button");
	saveButton.innerHTML = "<i class='icon-line-check'></i> Done";
	setTimeout(function() { saveButton.innerHTML = "Save"; }, 2000);
	
	console.log(jsonInput.pages[id].elements);
	var allElements = document.getElementById("outer-container").childNodes;
	var saveElements = [];
	for (i in allElements) {
		if (typeof allElements[i].outerHTML !== 'undefined'){
			saveElements.push(
					{ 
						"id": i,
						"content": allElements[i].outerHTML,
					}
			);
		}
	}
	jsonInput.pages[id].elements = saveElements;
	console.log(jsonInput.pages[id].elements);
}

function newElement() {}

function newPage(event, id) {
	event.preventDefault();
	var pageid = document.getElementById("page-identifier").value;
	if (checkSave(Application, pageid)) {
		if (confirm("You haven't saved your changes, are you sure you would like to navigate away from this page and lose them?")) {
			insertElements(Application, id);
		}
	} else {
		insertElements(Application, id);
	}
}

function insertPages(jsonInput) {
	for (i in jsonInput.pages) {
		var list = document.getElementById("project-page-list");
		var newListItem = document.createElement('li');
		newListItem.innerHTML = '<a class="fixedText" href="#" id="page-1" onclick="newPage(event, '+i+');">' + jsonInput.pages[i].name + '</a>';
		list.appendChild(newListItem);
	}
	
}

window.onload = insertElements(Application, 0);
window.onload = insertPages(Application);

function insertElements(jsonInput, id) {
	
	var dropdown = document.getElementById("page-dropdown");
	dropdown.innerHTML = "Page: &nbsp; " + jsonInput.pages[id].name + " &nbsp;&nbsp;&nbsp; <i class=\"icon-caret-down\" style=\"float:right;\"></i>";
	var container = document.getElementById("outer-container");
	container.innerHTML = "";
	
	var pageid = document.getElementById("page-identifier");
	pageid.value = id;

	var elementToAdd;

	for (i in jsonInput.pages[id].elements) {
		elementToAdd = jsonInput.pages[id].elements[i].content;
		container.innerHTML += elementToAdd;
		noOfElements += 1;
	}
}


function selectElement(id) {
	document.getElementById("element-editor").style.display = 'none';
	var elements = document.getElementsByTagName("*");
	for (var i=0; i < elements.length; i++) {    
	    elements[i].classList.remove("selected-element");
	    $('.resizer').remove();
	    $('.mover').remove();
	}
	
	console.log('selecting element');
	var element = document.getElementById(id);
	element.className +=' selected-element';
	
	document.getElementById("element-editor").style.display = 'block';
	
	document.getElementById('element-size-width').innerHTML = document.getElementById(id).style.width;
	document.getElementById('element-size-height').innerHTML = document.getElementById(id).style.height;
	document.getElementById('element-position-top').innerHTML = document.getElementById(id).style.top;
	document.getElementById('element-position-left').innerHTML = document.getElementById(id).style.left;
	document.getElementById('element-padding-top').value = document.getElementById(id).style.paddingTop;
    document.getElementById('element-padding-right').value = document.getElementById(id).style.paddingRight;
    document.getElementById('element-padding-bottom').value = document.getElementById(id).style.paddingBottom;
    document.getElementById('element-padding-left').value = document.getElementById(id).style.paddingLeft;
	
	var resizerbottomright = document.createElement('div');
    resizerbottomright.className = 'resizer resizerbottomright';
    resizerbottomright.id = id
    element.appendChild(resizerbottomright);
    var mover = document.createElement('div');
    mover.className = 'mover';
    mover.innerHTML = "<i class='icon-move'></i>";
    element.appendChild(mover);
    resizerbottomright.addEventListener('mousedown', initResizeDrag, false);
    mover.addEventListener('mousedown', initMoveDrag, false);
    document.getElementById('element-padding-top').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-right').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-bottom').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-left').addEventListener('keyup', updatePadding, false);
    
	
	var startX, startY, startWidth, startHeight;
	
	function initResizeDrag(e) {
		startX = e.clientX;
		startY = e.clientY;
		startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
		startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
		document.documentElement.addEventListener('mousemove', doResizeDrag, false);
		document.documentElement.addEventListener('mouseup', stopResizeDrag, false);
	}
	
	function doResizeDrag(e) {
		element.style.width = (startWidth + e.clientX - startX) + 'px';
		element.style.height = (startHeight + e.clientY - startY) + 'px';
		document.getElementById('element-size-width').innerHTML = document.getElementById(id).style.width;
		document.getElementById('element-size-height').innerHTML = document.getElementById(id).style.height;
	}
	
	function stopResizeDrag(e) {
		document.documentElement.removeEventListener('mousemove', doResizeDrag, false);    
	    document.documentElement.removeEventListener('mouseup', stopResizeDrag, false);
	}
	
	var startTop, startLeft;
	
	function initMoveDrag(e) {
		startX = e.clientX;
		startY = e.clientY;
		startLeft = parseInt(document.defaultView.getComputedStyle(element).left, 10);
		startTop = parseInt(document.defaultView.getComputedStyle(element).top, 10);
		document.documentElement.addEventListener('mousemove', doMoveDrag, false);
		document.documentElement.addEventListener('mouseup', stopMoveDrag, false);
	}
	
	function doMoveDrag(e) {
		if (startLeft + e.clientX - startX >= 0) {
			element.style.left = (startLeft + e.clientX - startX) + 'px';
		}
		if (startTop + e.clientY - startY >= 0) {
			element.style.top = (startTop + e.clientY - startY) + 'px';
		}
		document.getElementById('element-position-top').innerHTML = document.getElementById(id).style.top;
		document.getElementById('element-position-left').innerHTML = document.getElementById(id).style.left;
	}
	
	function stopMoveDrag(e) {
		document.documentElement.removeEventListener('mousemove', doMoveDrag, false);    
	    document.documentElement.removeEventListener('mouseup', stopMoveDrag, false);
	}
	
	var paddingtop, paddingright, paddingbottom, paddingleft;
	
	function updatePadding() {
		paddingtop = document.getElementById('element-padding-top').value;
		element.style.paddingTop = paddingtop + 'px';
		paddingright = document.getElementById('element-padding-right').value;
		element.style.paddingRight = paddingright + 'px';
		paddingbottom = document.getElementById('element-padding-bottom').value;
		element.style.paddingBottom = paddingbottom + 'px';
		paddingleft = document.getElementById('element-padding-left').value;
		element.style.paddingLeft = paddingleft + 'px';
	}
	
}