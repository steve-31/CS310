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
    
    window.onclick = function(event) {
	    if (event.target == '#projectDescModal') {
	        modal.style.display = "none";
	    }
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
	
	$('#back-to-edit').click(function(){
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

	
