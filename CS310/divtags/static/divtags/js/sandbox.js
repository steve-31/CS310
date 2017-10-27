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
		element.style.left = (startLeft + e.clientX - startX) + 'px';
		element.style.top = (startTop + e.clientY - startY) + 'px';
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