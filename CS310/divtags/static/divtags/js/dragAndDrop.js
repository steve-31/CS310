//var tempApplication = Application;

//var noOfElements = 0;
var undoChangeStack = new Array();
var redoChangeStack = new Array();

var homepage = 1;
for (i in Application.pages) {
	if (Application.pages[i].homepage == "yes") {
		homepage = i;
		break;
	}
}


window.onload = insertElements(Application, homepage);
window.onload = insertPages(Application);

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
	var divElement = "<div class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">This is a Container</div>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function addHeading(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<h1 class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">This is a Heading</h1>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function addParagraph(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<p class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">This is a Paragraph</p>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function addBulletList(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<ul class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><li>This is a bulleted List</li><li>You can add points here</li></ul>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function addNumberedList(event) {
	event.preventDefault();
	
	undoChangeStack.push(JSON.stringify(tempApplication));
	
	var container = document.getElementById("outer-container");
	noOfElements += 1;
	var divElement = "<ol class=\"element\" id=\"" + noOfElements + "\" onclick=\"selectElement(this.id)\" style=\"color:#000000; background-color:rgba(0,0,0,0); padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><li>This is a numbered List</li><li>You can add items here</li></ol>";
	container.innerHTML += divElement;
	
	var pageId = document.getElementById("page-identifier").value;
	saveJsonLocal(tempApplication);
}

function saveJsonLocal(jsonInput) {
	var allElements = document.getElementById("outer-container").childNodes;
	var pageId = document.getElementById("page-identifier").value;
	var saveElements = [];
	var allPageElements = [];
	for (var i=0; i < allElements.length; i++) {
//		if (allElements[i].classList == "element selected-element") {
//			currentselectedelement = 
//		}
		var elementtosave = allElements[i].cloneNode(true);
		if (elementtosave.className == "element selected-element") {
			elementtosave.childNodes[1].outerHTML = "";
			elementtosave.childNodes[1].outerHTML = "";
			elementtosave.childNodes[1].outerHTML = "";
			elementtosave.className = "element";
		}
		
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
	for (i in jsonInput.pages) {
		if (jsonInput.pages[i].name != "AllPages") {
			var list = document.getElementById("project-page-list");
			var newListItem = document.createElement('li');
			if (jsonInput.pages[i].homepage == "yes") {
				newListItem.innerHTML = '<a class="fixedText" href="#" id="page-'+i+'" onclick="newPage(event, '+i+');"><i class="icon-home"></i> ' + jsonInput.pages[i].name + '</a>';
			} else {
				newListItem.innerHTML = '<a class="fixedText" href="#" id="page-'+i+'" onclick="newPage(event, '+i+');">' + jsonInput.pages[i].name + '</a>';
			}
			list.appendChild(newListItem);
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
	
	
	document.getElementById("page-options-name").innerHTML = jsonInput.pages[id].name + "<span class=\"fixedText\" onclick=\"deletePage(event)\" style=\"display:inline-block; float:right;\"><i class=\"icon-trashcan\"></i></span><span class=\"fixedText\" href=\"#\" onclick=\"editPageName(event)\" style=\"display:inline-block; float:right;\"><i class=\"icon-pencil\"></i></span>"
	if (tempApplication.pages[id].permissions == "members") {
		$('#permissions-toggle').bootstrapToggle('on');
	} else {
		$('#permissions-toggle').bootstrapToggle('off');
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
	$('#page-menu-options').hide();
});


function selectElement(id) {
	$('#page-menu-options').hide();
	$('#element-menu-button').show();
	document.getElementById("element-editor").style.display = 'none';
	var old_element = document.getElementById("element-editor");
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
	
	var elements = document.getElementsByTagName("*");
	for (var i=0; i < elements.length; i++) {    
	    elements[i].classList.remove("selected-element");
	    $('.resizer').remove();
	    $('.mover').remove();
	    $('.delete').remove();
	}
	
	var element = document.getElementById(id);
	element.className +=' selected-element';
	
	document.getElementById("element-editor").style.display = 'block';
	
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
    var mover = document.createElement('div');
    mover.className = 'mover';
    mover.id = id + 'mover';
    mover.innerHTML = "<i class='icon-move' id='move-icon'></i>";
    element.appendChild(mover);
    resizerbottomright.addEventListener('mousedown', initResizeDrag, false);
    mover.addEventListener('mousedown', initMoveDrag, false);
    deleteButton.addEventListener('mousedown', deleteElement, false);
    document.getElementById('element-padding-top').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-right').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-bottom').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-left').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-colour-text').addEventListener('change', textColour, false);
    document.getElementById('element-colour-background').addEventListener('change', backgroundColour, false);
    document.getElementById('show-all-pages').addEventListener('change', showAllPages, false);
    
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
    	console.log(event.target);
    	console.log(event.target != container);
    	console.log(event.target != container2);
	    if (!inelement) {
	    	element.classList.remove("selected-element");
	    	editor.style.display = 'none';
		    $('.resizer').remove();
		    $('.mover').remove();
		    $('.delete').remove();
		    $('#element-menu-button').hide();
	    }
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
    	document.getElementById(id).outerHTML = "";
    	saveJsonLocal(tempApplication);
    	document.getElementById("element-editor").style.display = 'none';
    }
    
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