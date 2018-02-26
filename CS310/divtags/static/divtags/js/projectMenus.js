var tempApplication = Application;
var noOfElements = 0;
var noOfQueries = 0;

$('document').ready(function(){
		var headeroffset = $('#header').offset().top;
		if (headeroffset >= 0) {
	    	$('#header').addClass('sticky-header');
		}
	})
	
	$('#contributer-select').select2({
    	placeholder: "Add/edit project contributers",
    	allowClear: true
    });

    $('#owner-select').select2({});
    
    $('#projectTitleButton').click(function(){
    	$('#projectTitleModal').show()
    });
    $('.close').click(function(){
    	$('#projectTitleModal').hide()
    });
    
    $('#page-menu-button').click(function(){
    	$('#page-menu-options').toggle()
    	$('#element-editor').hide()
    });
    
    function revealExperimentals(id) {
    	var experimentals = document.getElementsByClassName("experimental-version-" + id);
    	for (var i=0; i < experimentals.length; i++) {  
    		experimentals[i].style.display = "";
    	}
    	var revealButton = document.getElementById('reveal-button-'+id);
    	revealButton.outerHTML = '<td id="reveal-button-'+id+'" onclick="hideExperimentals('+id+')"><i id="reveal-arrow-'+id+'" class="icon-caret-down" ></i></td>';
    }
    
    function hideExperimentals(id) {
    	var experimentals = document.getElementsByClassName("experimental-version-" + id);
    	for (var i=0; i < experimentals.length; i++) {  
    		experimentals[i].style.display = "none";
    	}
    	var revealButton = document.getElementById('reveal-button-'+id);
    	revealButton.outerHTML = '<td id="reveal-button-'+id+'" onclick="revealExperimentals('+id+')"><i id="reveal-arrow-'+id+'" class="icon-caret-right" ></i></td>';
    }
    
    window.onclick = function(event) {
	    if (event.target == '#projectTitleModal') {
	        modal.style.display = "none";
	    }
	}

    $('#projectDescButton').click(function(){
    	$('#projectDescModal').show()
    });
    $('.close').click(function(){
    	$('#projectDescModal').hide()
    });
    
    $('.close').click(function(){
    	$('#editTextModal').hide()
    });
    
    window.onclick = function(event) {
	    if (event.target == '#projectDescModal') {
	        modal.style.display = "none";
	    }
	}
    
    function addPage(event) {
    	event.preventDefault();
    	newpage = {"name": "NewPage", "elements": [], "queries": [], "links": [], "pageObject": "none", "multiqueries": [], "forms": [], "background": "#ffffff", "permissions": "public", "homepage":"no", "showinheader":"yes", "showallpages":"yes"};
    	tempApplication['pages'].push(newpage);
    	document.getElementById("project-page-list").innerHTML = "<li id=\"project-page-add\"><a href=\"#\" onclick=\"addPage(event)\" class=\"fixedText\"><i class=\"icon-plus\"></i>&nbsp;Add new page</a></li>";
    	insertPages(tempApplication);
    	var page = document.getElementById("project-page-list").lastChild.childNodes[0].id;
    	var pagenum = parseInt(page.match(/\d+/g), 10);
    	newPage(event, pagenum);
    }
    
    function editPageName(event) {
    	event.preventDefault();
    	var pageId = document.getElementById("page-identifier").value;
    	var pageName = tempApplication.pages[pageId].name;
    	document.getElementById("page-options-name").innerHTML = "<input class=\"form-control\" id=\"new-page-name\" type=\"text\" placeholder=\"New Page Name\" value=\""+pageName+"\"><button class=\"btn btn-default\" onclick=\"savePageNameChange(event)\" style=\"float:right\">Save</button>";
    }
    
    function savePageNameChange(event) {
    	event.preventDefault();
    	var pageId = document.getElementById("page-identifier").value;
    	var newPageName = document.getElementById("new-page-name").value;
    	tempApplication.pages[pageId].name = newPageName;
    	document.getElementById("page-options-name").innerHTML = newPageName + "<span class=\"fixedText\" onclick=\"deletePage(event)\" style=\"display:inline-block; float:right;\"><i class=\"icon-trashcan\"></i></span><span class=\"fixedText\" href=\"#\" onclick=\"editPageName(event)\" style=\"display:inline-block; float:right;\"><i class=\"icon-pencil\"></i></span>"
    	document.getElementById("page-dropdown").innerHTML = "Page: &nbsp; " + newPageName + " &nbsp;&nbsp;&nbsp; <i class=\"icon-caret-down\" style=\"float:right;\"></i>";
    	document.getElementById("page-"+pageId).innerHTML = newPageName;
    	addToHeader();
    }
    
    function deletePage(event) {
    	event.preventDefault();
    	var pageId = document.getElementById("page-identifier").value;
    	var pageName = tempApplication.pages[pageId].name;
    	if (confirm("Are you sure you wish to delete this page: "+pageName))
    	//delete tempApplication.pages[pageId];
    	tempApplication.pages.splice(pageId, 1);
    	document.getElementById("project-page-list").innerHTML = "<li id=\"project-page-add\"><a href=\"#\" onclick=\"addPage(event)\" class=\"fixedText\"><i class=\"icon-plus\"></i>&nbsp;Add new page</a></li>";
    	insertPages(tempApplication);
    	insertElements(tempApplication, 0);
    	//document.getElementById("page-"+pageId).outerHTML = "";
    }
    
    document.getElementById('page-background-colour').addEventListener('input', changeBackgroundColour, false);
    function changeBackgroundColour() {
    	var pageid = document.getElementById("page-identifier").value;
    	tempApplication.pages[pageid].background = document.getElementById('page-background-colour').value;
    	document.getElementById("project-content").style.backgroundColor = tempApplication.pages[pageid].background;
    }
    
    document.getElementById('heading-background-colour').addEventListener('input', changeHeadingBackgroundColour, false);
    function changeHeadingBackgroundColour() {
    	tempApplication.headerBackgroundColour = document.getElementById('heading-background-colour').value;
    	document.getElementById("user-header").style.backgroundColor = tempApplication.headerBackgroundColour;
    }
    
    document.getElementById('heading-text-colour').addEventListener('input', changeHeadingTextColour, false);
    function changeHeadingTextColour() {
    	tempApplication.headerTextColour = document.getElementById('heading-text-colour').value;
    	document.getElementById("user-header").style.color = tempApplication.headerTextColour;
    }
    
    $('#permissions-toggle').change(function() {changePagePermissions();});
    function changePagePermissions() {
    	var pageid = document.getElementById("page-identifier").value;
    	if (document.getElementById('permissions-toggle').checked) {
    		tempApplication.pages[pageid].permissions = "members";
    	} else {
    		tempApplication.pages[pageid].permissions = "public";
    	}
    	addToHeader();
    }
    
    $('#page-object-toggle').change(function() {showPageObject();});
    function showPageObject() {
    	var pageid = document.getElementById("page-identifier").value;
    	if (document.getElementById('page-object-toggle').checked) {
    		document.getElementById('page-object-dropdown').disabled = false;
    		var objectList = "<option disabled selected value=\"objectReset\">Object</option>";
        	for (i in tempApplication.objects) {
        		objectList += "<option value=\""+ tempApplication.objects[i].name + "\">"+ tempApplication.objects[i].name +"</option>";
        	}
        	document.getElementById('page-object-dropdown').innerHTML = objectList;
    	} else {
    		document.getElementById('page-object-dropdown').disabled = true;
    		tempApplication.pages[pageid].pageObject = "none";
    	}
    }
    
    $('#page-object-dropdown').change(function(){
    	var pageobject = document.getElementById('page-object-dropdown').value;
    	var pageid = document.getElementById("page-identifier").value;
    	tempApplication.pages[pageid].pageObject = pageobject;
    });
    
    $('#page-header-toggle').change(function() {changeShowInHeader();});
    function changeShowInHeader() {
    	var pageid = document.getElementById("page-identifier").value;
    	if (document.getElementById('page-header-toggle').checked) {
    		tempApplication.pages[pageid].showinheader = "yes";
    	} else {
    		tempApplication.pages[pageid].showinheader = "no";
    	}
    	addToHeader();
    }
    
    $('#homepage-toggle').click(function() {changeHomepage();});
    function changeHomepage() {
    	var pageid = document.getElementById("page-identifier").value;
		for (i in tempApplication.pages) {
			if (tempApplication.pages[i].permissions == tempApplication.pages[pageid].permissions) {
				tempApplication.pages[i].homepage = "no";
			}
		}
		tempApplication.pages[pageid].homepage = "yes";
		document.getElementById('homepage-toggle').innerHTML = "Homepage Set";
		document.getElementById('homepage-toggle').disabled = true;
    		
    	document.getElementById("project-page-list").innerHTML = "<li id=\"project-page-add\"><a href=\"#\" onclick=\"addPage(event)\" class=\"fixedText\"><i class=\"icon-plus\"></i>&nbsp;Add new page</a></li>";
    	insertPages(tempApplication);
    	console.log(tempApplication);
    }
    
    $('#show-allpages-elements-toggle').change(function() {changeShowAllElements();});
    function changeShowAllElements() {
    	var pageid = document.getElementById("page-identifier").value;
    	if (document.getElementById('show-allpages-elements-toggle').checked) {
    		tempApplication.pages[pageid].showallpages = "yes";
    		var elementToAdd;
    		var container = document.getElementById("outer-container");
    		container.innerHTML = "";
    		for (i in tempApplication.pages[0].elements) {
    			elementToAdd = tempApplication.pages[0].elements[i].content;
    			container.innerHTML += elementToAdd;
    			noOfElements += 1;
    		}
    		for (i in tempApplication.pages[pageid].elements) {
    			elementToAdd = tempApplication.pages[pageid].elements[i].content;
    			container.innerHTML += elementToAdd;
    			noOfElements += 1;
    		}
    	} else {
    		tempApplication.pages[pageid].showallpages = "no";
    		var elementToAdd;
    		var container = document.getElementById("outer-container");
    		container.innerHTML = "";
    		for (i in tempApplication.pages[pageid].elements) {
    			elementToAdd = tempApplication.pages[pageid].elements[i].content;
    			container.innerHTML += elementToAdd;
    			noOfElements += 1;
    		}
    	}
    }
    
    $('#extend-page-btn').click(extendPageLength);
    function extendPageLength() {
    	var containerHeight = $("#project-content").height();
    	document.getElementById("project-content").style.height = containerHeight + 1000 + "px";
    	document.getElementById("outer-container").style.height = containerHeight + 1000 + "px";
    }
    
//    $('#add-attribute-btn').click(function(event){
//    	event.preventDefault();
//    	var $div = $('div[id^="new-attribute"]:last');
//    	var num = parseInt( $div.prop("id").match(/\d+/g), 10 ) +1;
//    	var $newattribute = $div.clone().prop('id', 'new-attribute'+num );
//    	$('#add-attribute-btn').before($newattribute)
//    	$('#new-attribute'+num+' input').prop('name', 'obj_attrib_name'+num);
//    	$('#new-attribute'+num+' select').prop('name', 'obj_attrib_name'+num);
//    	$('#new-attribute'+num+' button').prop('id', 'delete-attribute-btn'+num);
//    	if (num == 2) {
//    		$('#new-attribute'+num).append('<button type="button" class="delete-attribute-btn" id="delete-attribute-btn2" onclick="deleteattribute(this.id)"><i class="icon-trashcan"></i></button>');
//    	}
//    });
//    
//    function deleteattribute(clicked_id){
//    	document.getElementById(clicked_id).closest('div').remove();
//    	console.log("deleting attribute: " + clicked_id);
//    };

	$('#settings-button').click(function(event){
		event.preventDefault();
		$(window).scrollTop(0)
		$('#settings-tab').addClass('project-active-tab')
		$('#content-tab').removeClass('project-active-tab')
		$('#object-tab').removeClass('project-active-tab')
		$('#workflow-tab').removeClass('project-active-tab')
		$('#history-tab').removeClass('project-active-tab')
		$('#components-button').css("display", "none")
		$('#object-button').css("display", "block")
		$('#workflow-button').css("display", "block")
		$('#history-button').css("display", "block")
		$('#settings-side-button').css("display", "block")
		$('#back-to-edit').css("display", "block")
	});
	
	$('#object-button').click(function(event){
		event.preventDefault();
		$(window).scrollTop(0)
		$('#object-tab').addClass('project-active-tab')
		$('#content-tab').removeClass('project-active-tab')
		$('#settings-tab').removeClass('project-active-tab')
		$('#workflow-tab').removeClass('project-active-tab')
		$('#history-tab').removeClass('project-active-tab')
		$('#components-button').css("display", "none")
		$('#object-button').css("display", "block")
		$('#workflow-button').css("display", "block")
		$('#history-button').css("display", "block")
		$('#settings-side-button').css("display", "block")
		$('#back-to-edit').css("display", "block")
	});
	
	$('#workflow-button').click(function(event){
		event.preventDefault();
		$(window).scrollTop(0)
		$('#workflow-tab').addClass('project-active-tab')
		$('#content-tab').removeClass('project-active-tab')
		$('#settings-tab').removeClass('project-active-tab')
		$('#object-tab').removeClass('project-active-tab')
		$('#history-tab').removeClass('project-active-tab')
		$('#components-button').css("display", "none")
		$('#object-button').css("display", "block")
		$('#workflow-button').css("display", "block")
		$('#history-button').css("display", "block")
		$('#settings-side-button').css("display", "block")
		$('#back-to-edit').css("display", "block")
	});
	
	$('#history-button').click(function(event){
		event.preventDefault();
		$(window).scrollTop(0)
		$('#history-tab').addClass('project-active-tab')
		$('#workflow-tab').removeClass('project-active-tab')
		$('#content-tab').removeClass('project-active-tab')
		$('#settings-tab').removeClass('project-active-tab')
		$('#object-tab').removeClass('project-active-tab')
		$('#components-button').css("display", "none")
		$('#object-button').css("display", "block")
		$('#workflow-button').css("display", "block")
		$('#history-button').css("display", "block")
		$('#settings-side-button').css("display", "block")
		$('#back-to-edit').css("display", "block")
	});
	
	$('#settings-side-button').click(function(event){
		event.preventDefault();
		$(window).scrollTop(0)
		$('#settings-tab').addClass('project-active-tab')
		$('#content-tab').removeClass('project-active-tab')
		$('#workflow-tab').removeClass('project-active-tab')
		$('#object-tab').removeClass('project-active-tab')
		$('#history-tab').removeClass('project-active-tab')
		$('#components-button').css("display", "none")
		$('#object-button').css("display", "block")
		$('#workflow-button').css("display", "block")
		$('#history-button').css("display", "block")
		$('#settings-side-button').css("display", "block")
		$('#back-to-edit').css("display", "block")
	});
	
	$('#back-to-edit').click(function(event){
		event.preventDefault();
		$(window).scrollTop(0)
		$('#settings-tab').removeClass('project-active-tab')
		$('#content-tab').addClass('project-active-tab')
		$('#workflow-tab').removeClass('project-active-tab')
		$('#object-tab').removeClass('project-active-tab')
		$('#history-tab').removeClass('project-active-tab')
		$('#components-button').css("display", "block")
		$('#object-button').css("display", "block")
		$('#workflow-button').css("display", "block")
		$('#history-button').css("display", "block")
		$('#settings-side-button').css("display", "block")
		$('#back-to-edit').css("display", "none")
	})

	
