/**
 * Project done by Yannik Messerli
 * 
 * Upload SVGs and then use Fabricjs to create
 * PNG version of it.
 *
 * Copyright 2015 Yannik Messerli
 * Released under the MIT license
 *
 * Date: 17 Apr 2015
 */
$(document).ready(function(){


	/**
	 * change style when drag over
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	function file_drag_hover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "filehover" : "");
	}


	/**
	 * process each files
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	function file_select_handler(e) {

		
		file_drag_hover(e);

		// get all the files:
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			
			// if svg, then process it
			if (file.type.indexOf("svg") > 0) {
				var reader = new FileReader();
				reader.onload = function(e) {
					
					// draw it:
					draw_svg(atob(e.target.result.replace('data:image/svg+xml;base64,', '')), file);

				}
				reader.readAsDataURL(file);
			}
		}

	}

	// draw svg
	function draw_svg(svg_str, file){
		
		fabric.loadSVGFromString(svg_str, function(objects, options){

			// translate svg to fabric's objects
			var widget = new fabric.PathGroup(objects, options),

			// create new canvas element:
			c = $('<canvas></canvas>'),

			// find size of svg (does it work anytime?)
			s = widget.getBoundingRect();
			
			// hide it
			$('#canvas').append(c);

			// useless, fabric js weirdness
			c.width(s.width);
			c.height(s.height);

			// init fabric on new canvas:
			var canvas = new fabric.Canvas(c[0], {
				width: s.width,
				height: s.height
			});

			// finally draw svg on hidden canvas
		    canvas.add(widget);

		    // get an image from fabric rendering engine:
			var img_data = canvas.toDataURL({
			    format: 'png',
			    multiplier: 2
			});
			
    		// add image to the dom:
			$("#results").html($("#results").html()+'<div class="thumbnail"><div class="caption"><small>Drag image on desktop to save it or right click on it.</small></div><img src="' + img_data + '" alt="'+file.name+'.png"/></div>');

		});
	}



	// initialize
	function init() {

		// svgs select
		$("#fileselect")[0].addEventListener("change", file_select_handler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// svgs drop:
			var filedrag = $("#filedrag")[0];
			filedrag.addEventListener("dragover", file_drag_hover, false);
			filedrag.addEventListener("dragleave", file_drag_hover, false);
			filedrag.addEventListener("drop", file_select_handler, false);
			filedrag.style.display = "block";

			// remove submit button
			$("#submitbutton").css("display", "none");
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		init();
	}else{
		// Browser not supported
		alert("Your browser is not supported");
	}


});
