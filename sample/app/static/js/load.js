window.onload = processElements();

function processElements() {
	elements = document.getElementsByClassName("element");
	for (i in elements) {
		elements[i].onclick = null;
	}
	text = document.getElementsByClassName("element-text");
	for (i in text) {
		text[i].contentEditable = false;
	}
}
