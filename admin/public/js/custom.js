function searchFunction() {
    // Declare variables 
    var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("searchTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[2];
          if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                } else {
                  tr[i].style.display = "none";
                }
          } 
        }
  }

// for category Image
  function readURL1(input) {
    if (input.files && input.files[0]) {
     var reader = new FileReader();
     reader.onload = function(e) {
            $('#image-upload-wrap1').hide();
       $('#file-upload-image1').attr('src', e.target.result);
            $('#file-upload-content1').show();
            $('#file-upload-btn1').hide();
       $('#image-title').html(input.files[0].name);
       };
       reader.readAsDataURL(input.files[0]);
   }
      else
      {	
        removeUpload1();
      }
  }

function removeUpload1() {
  $('#file-upload-input1').replaceWith($('#file-upload-input1').clone());
  $('#file-upload-content1').hide();
  $('#file-upload-btn1').show();
  $('#image-upload-wrap1').show();
}
$('#image-upload-wrap1').bind('dragover', function () {
    $('#image-upload-wrap1').addClass('image-dropping');
  });
  $('#image-upload-wrap1').bind('dragleave', function () {
    $('#image-upload-wrap1').removeClass('image-dropping');
});




  function upload(id,y1,z1)
  {
  	$(id).change(function(){
  		$(y1 + ' .pip').css('display','inline');
  		$(y1 + ' .outer').css('display','none');
  		$(y1 + ' .remove').removeClass('display-none');
		readURL(this,z1,y1);
	});	
  	$(id).trigger('click');
  }
  
  
  function readURL(input,img,outer) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $(img).attr('src', e.target.result);
      
          let rmstring = outer + ' .remove'; 
          	
          $(rmstring).click(function(){
          	$(outer + ' .outer .input').replaceWith($(outer + ' .outer .input').clone());
          	$(outer + ' .outer').css('display','inline');
		$(outer + ' .pip').css('display','none');           
          });        
        
        
      }
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }


  
  
  $(document).ready(function(){
  
	var counter = 1; 
    	$('#sub-cat').prop('disabled',true); 	//disable subcategories
    	$('#parentCategory').val("1");		//select 'selectcategory'
	$('[data-toggle="tooltip"]').tooltip();
	var actions = $("table td:last-child").html();
	
	     /*----------------------------------- For Product----------------------------------------------*/
	
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		$(this).attr("disabled", "disabled");
		var index = $("table tbody tr:last-child").index();
		let str = '._' + counter;
		
		let image1 = str + ' .image-upload1';
		let image2 = str + ' .image-upload2';
		let image3 = str + ' .image-upload3';
		let image4 = str + ' .image-upload4';
		
		
		
		
		let y1 = str + ' .img1';
		let y2 = str + ' .img2';
		let y3 = str + ' .img3';
		let y4 = str + ' .img4';

		let z1 = str + ' .image1';
		let z2 = str + ' .image2';
		let z3 = str + ' .image3';
		let z4 = str + ' .image4';
		
		let x1 = 'image1';
		let x2 = 'image2';
		let x3 = 'image3';
		let x4 = 'image4';
								
		
        var row = 
        '<tr class="tr-shadow">'+
                '<td width="9.5%">'+
                    '<select class="form-control" name="colour" id="field1" required>'+
                        '<option value="" selected disabled>Size</option>'+
                        '<option value="XL">XL</option>'+
                        '<option value="L">L</option>'+
                        '<option value="S">S</option>'+
                        '<option value="M">M</option>'+
                        '<option value="XXL">XXL</option>'+
                        '<option value="_3XL">3XL</option>'+
                        '<option value="_4XL">4XL</option>'+
                        '<option value="_5XL">5XL</option>'+
                        '<option value="freeSize">FreeSize</option>'+
                    '</select>'+
                '</td>'+
                '<td width="16%">'+
                    '<select class="form-control" name="category" id="field2" required>'+
                    '<option value="" selected disabled>Select Color</option>'+
                    '<option value="Red">Red</option>'+
                    '<option value="Blue">Blue</option>'+
                    '<option value="White">White</option>'+
                    '<option value="Black">Black</option>'+
                    '<option value="Pink">Pink</option>'+
                '</select>'+
                '</td>'+

                '<td width="12%">'+
                    '<input type="number" class="form-control" id="field3" name="price" min=1 required>'+
                '</td>'+

                '<td width="12%">'+
                    '<input type="number" class="form-control" id="field4" name="stock" min=1 required>'+
                '</td>'+

                '<td width="5%">'+  
                        '<input type="checkbox" name="return"  value="return" id="field5" style="width:15px;height:15px;">'+
                '</td>'+

                '<td width="5%">'+  
                    '<input type="checkbox" name="replace" value="replace" id="field6" style="width:15px;height:15px;">'+
                '</td>'+

                '<td>'+
                    '<div class="row _'+counter+'">'+
                        '<div class="col-sm-3 padding-2 img1 align-center">'+
                            '<span class="outer"><input type="file" class="opacity-0 image-upload1" name="img'+counter+''+counter+'" accept=".jpg,.jpeg,.png" required>'+
                            '<i class="fa fa-plus" onclick="upload(\''+ image1 +'\',\''+ y1 +'\',\''+ z1 +'\');"> <br/><br/>Image1 </i></span>'+
                            "<span class=\"pip\" style=\"display:none; \">" +
				"<img class=\"" + x1 + "\" src=\"\"/> <br/>" +
            			"<br/><span class=\"remove\">Remove</span>" +
            			"</span>"+
                        '</div>'+
                        '<div class="col-sm-3 padding-2 img2 align-center">'+
                            '<span class="outer"><input type="file" class="opacity-0 image-upload2" name="img'+counter+''+counter+'" accept=".jpg,.jpeg,.png">'+
                            '<i class="fa fa-plus" onclick="upload(\''+ image2 +'\',\''+ y2 +'\',\''+ z2 +'\');"> <br/><br/>Image2 </i></span>'+
                            "<span class=\"pip\" style=\"display:none; \">" +
				"<img class=\"" + x2 + "\" src=\"\"/> <br/>" +
            			"<br/><span class=\"remove\">Remove</span>" +
            			"</span>"+
                        '</div>'+
                        '<div class="col-sm-3 padding-2 img3 align-center">'+
                            '<span class="outer"><input type="file" class="opacity-0 image-upload3" name="img'+counter+''+counter+'" accept=".jpg,.jpeg,.png">'+
                            '<i class="fa fa-plus" onclick="upload(\''+ image3 +'\',\''+ y3 +'\',\''+ z3 +'\');"> <br/><br/>Image3 </i></span>'+
                            "<span class=\"pip\" style=\"display:none; \">" +
				"<img class=\"" + x3 + "\" src=\"\"/> <br/>" +
            			"<br/><span class=\"remove\">Remove</span>" +
            			"</span>"+
                        '</div>'+
                        '<div class="col-sm-3 padding-2 img4 align-center">'+
                            '<span class="outer"><input type="file" class="opacity-0 image-upload4" name="img'+counter+''+counter+'" accept=".jpg,.jpeg,.png">'+
                            '<i class="fa fa-plus" onclick="upload(\''+ image4 +'\',\''+ y4 +'\',\''+ z4 +'\');"> <br/><br/>Image4 </i></span>'+
                            "<span class=\"pip\" style=\"display:none; \">" +
				"<img class=\"" + x4 + "\" src=\"\"/> <br/>" +
            			"<br/><span class=\"remove\">Remove</span>" +
            			"</span>"+
                        '</div>'+
                    '</div>'+
                '</td>' + '<td class="align-center"> <i class="fa fa-save add"></i><i class="fa fa-edit edit"> </i>  <br/><i class="fa fa-remove delete"></i></td>'  +
	'</tr>';
	'<tr class="spacer"></tr>'+
    	$("table").append(row);	
    	counter++;	
		$("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
		$("#submit-button").prop('disabled','disabled');
		$(".delete").css('display','none');
        $('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		var input = $(this).parents("tr").find('input');
		var select = $(this).parents("tr").find('select');
        
		if($("#form").valid())
   		{
			input.each(function(){
				if($(this).attr('type') == 'checkbox')
				{
					if($(this).prop('checked'))
					{
						$(this).parent("td").html('Yes');	
					}
					else
					{
						$(this).parent("td").html('No');
					}
				}
				else
				{
					$(this).parent("td").html($(this).val());
				}
			});
			select.each(function(){
			
				$(this).parent("td").html($(this).val());
			
			});
			$("#submit-button").prop('disabled',false);
			$(".delete").css('display','inline');
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}
		
					
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){
	let i=0;		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			
			let value = $(this).text().trim();
			if(i==0)
			{
				$(this).html('<select class="form-control" name="size" required> <option value="" disabled>Size</option> <option value="XL">XL</option> <option value="L">L</option> <option value="S">S</option> <option value="M">M</option><option value="XXL">XXL</option> </select> ');
				$(this).children('select').val(value);	
			}
			else if(i==1)
			{
				$(this).html('<select class="form-control" name="color" required><option value="" disabled>Select Color</option><option value="Red">Red</option><option value="Blue">Blue</option><option value="White">White</option><option value="Black">Black</option><option value="Pink">Pink</option></select>');
				$(this).children('select').val(value);	
			}
			else if(i==4)
			{
				$(this).html('<input type="checkbox" name="return" value="return" style="width:15px;height:15px;">');
				if(value == 'Yes')
				{
					$(this).children('input').prop('checked',true)
				}
				else
				{
					$(this).children('input').prop('checked',false)
				}
			}
			else if(i==5)
			{
				$(this).html('<input type="checkbox" name="replace" value="replace" style="width:15px;height:15px;">');
				if(value == 'Yes')
				{
					$(this).children('input').prop('checked',true)
				}
				else
				{
					$(this).children('input').prop('checked',false)
				}
			}
			else if(i==2 || i==3)
			{
				$(this).html('<input type="text" class="form-control" value="' + value + '">');
			}
			i++;
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$("#submit-button").prop('disabled','disabled');
		$(".delete").css('display','none');
		$(".add-new").attr("disabled", "disabled");
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
    
    $('#form').submit(function(){ 
    	let ivar = 0;  
    	
	$('#item-table tr').each(function(){
		let jvar = 0;
		$(this).find('td').each(function(){
			let value = $(this).text().trim();
			if(jvar<6 && value!="")
			{
				$('#datastore').append('<input class="form-control" type="text" name="field'+ivar+'" value="'+ value +'">');
				ivar++;
			}
			jvar++;
		});
	});
    });
     
     
     /*----------------------------------- For Category----------------------------------------------*/
     $(".add-new-cat").click(function(){
		$(this).attr("disabled", "disabled");
		var index = $("table tbody tr:last-child").index();
        	var row = '<tr>' +
            '<td><input type="text" class="form-control" name="cat-name" id="name"></td>' +
			
			'<td><i class="fa fa-save add-cat"></i>&emsp;<i class="fa fa-edit edit-cat"></i>&emsp;<i class="fa fa-remove delete-cat"></i></td>'
			
			
			 +
        '</tr>';
    	$("table").append(row);		
		$("table tbody tr").eq(index + 1).find(".add-cat, .edit-cat").toggle();
		$("#submit-button").prop('disabled',true);
		$(".delete-cat").css('display','none');
        $('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add-cat", function(){
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add-cat, .edit-cat").toggle();
			$("#submit-button").prop('disabled',false);
			$(".delete-cat").css('display','inline');
			$(".add-new-cat").removeAttr("disabled");
		}		
    });
	// Edit row on edit button click
	$(document).on("click", ".edit-cat", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
		});		
		$(this).parents("tr").find(".add-cat, .edit-cat").toggle();
		$("#submit-button").prop('disabled',true);
		$(".delete-cat").css('display','none');
		$(".add-new-cat").attr("disabled", "disabled");
    });
	// Delete row on delete button click
	$(document).on("click", ".delete-cat", function(){
        $(this).parents("tr").remove();
		$(".add-new-cat").removeAttr("disabled");
    });
    
    
    $('#parentCategory').change(function(){
    	
    	$('#sub-cat').prop('disabled',false); 	//enable subcategories
    	$('.allCat').hide();
    	let classStr = $(this).val().trim();
    	classStr = classStr.replace(/\s/g, ".");
    	let catValue = '.' + classStr
    	$(catValue).show();
    });
    
       
});



