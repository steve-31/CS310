var Application = {
	"id": 1,
	"name": "myFirstProject",
	"objects": [
		{ "name": "Customer", "attributes": [
			{ "first_name": "Char" }, 
			{ "last_name": "Char" },
			{ "id": "primary_key"} 
		] }
	],
	"pages": [
		{ "name": "Home",
			"elements": [
				{ "id": 1, "content": "<h1 class=\"element\" id=\"1\" onclick=\"selectElement(this.id)\" style=\"color:'#000000'; background-color:'rgba(0,0,0,0)'; padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">This is a sandbox application</h1>" },
				{ "id": 2, "content": "<p class=\"element\" id=\"2\" onclick=\"selectElement(this.id)\" style=\"color:'#000000'; background-color:'rgba(0,0,0,0)'; padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\">Use offset of mouse position before and after to get position of drag and drop</p>" }
		],
		"workflows": [] 
		}
	]
}

window.onload = insertElements(Application);

function insertElements(jsonInput) {
	console.log(jsonInput.pages[0].elements[0].content)
	var elementToAdd;

	var container = document.getElementById("outer-container");

	for (i in jsonInput.pages[0].elements) {
		elementToAdd = jsonInput.pages[0].elements[i].content;
		console.log("print");
		container.innerHTML += elementToAdd;
	}
}



function selectElement(id) {
	document.getElementById("element-editor").style.display = 'none';
	var old_element = document.getElementById("element-editor");
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);

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
    console.log(document.getElementById('element-colour-text').value);
    document.getElementById('element-colour-background').value = hexcolourBackground;
	
	var resizerbottomright = document.createElement('div');
    resizerbottomright.className = 'resizer resizerbottomright';
    resizerbottomright.id = id + 'resizer'
    element.appendChild(resizerbottomright);
    var mover = document.createElement('div');
    mover.className = 'mover';
    mover.id = id + 'mover';
    mover.innerHTML = "<i class='icon-move' id='move-icon'></i>";
    element.appendChild(mover);
    resizerbottomright.addEventListener('mousedown', initResizeDrag, false);
    mover.addEventListener('mousedown', initMoveDrag, false);
    document.getElementById('element-padding-top').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-right').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-bottom').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-padding-left').addEventListener('keyup', updatePadding, false);
    document.getElementById('element-colour-text').addEventListener('change', textColour, false);
    document.getElementById('element-colour-background').addEventListener('change', backgroundColour, false);
    
    window.onclick = function(event) {
    	var mover = document.getElementById('icon-move');
    	var resizer = document.getElementById(id + 'resizer');
    	console.log(event.target);
//    	console.log("element contains mover :" + mover.parentNode == element);
    	console.log("element contains resizer :" + element.contains(resizer));
    	console.log(element == event.target);
    	var editor = document.getElementById("element-editor");
    	var inelement = false;
    	if (event.target == element) {
    		inelement = true;
    	}
    	for (var i = 0; i < element.childNodes.length; i++) {
    		if (element.childNodes[i] == event.target) {
    			console.out(element.childNodes[i]);
    			inelement = true;
    		}
    	}
    	for (var i = 0; i < editor.childNodes.length; i++) {
    		if (editor.childNodes[i] == event.target) {
    			inelement = true;
    		}
    	}
	    if (!inelement) {
	    	element.classList.remove("selected-element");
	    	editor.style.display = 'none';
		    $('.resizer').remove();
		    $('.mover').remove();
	    }
	}
	
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
		element.style.width = Math.ceil((startWidth + e.clientX - startX) / 10) * 10 + 'px';
		element.style.height = Math.ceil((startHeight + e.clientY - startY) / 10) * 10 + 'px';
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
		element.style.left = Math.ceil((startLeft + e.clientX - startX) / 10) * 10 + 'px';
		element.style.top = Math.ceil((startTop + e.clientY - startY) / 10) * 10 + 'px';
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
	}
	
	function textColour() {
		console.log('changing text colour')
		var colour = document.getElementById('element-colour-text').value;
		element.style.color = colour;
	}
	
	function backgroundColour() {
		var colour = document.getElementById('element-colour-background').value;
		console.log(colour)
		element.style.backgroundColor = colour;
		document.documentElement.removeEventListener('change', textColour, false);
	    document.documentElement.removeEventListener('change', backgroundColour, false);
	}
	
	function rgb2hex(rgb){
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? '#' + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}
	
}

