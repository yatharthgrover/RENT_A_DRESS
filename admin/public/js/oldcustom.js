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

  function readURL2(input) {
    if (input.files && input.files[0]) {
     var reader = new FileReader();
     reader.onload = function(e) {
            $('#image-upload-wrap2').hide();
       $('#file-upload-image2').attr('src', e.target.result);
            $('#file-upload-content2').show();
            $('#file-upload-btn2').hide();
       $('#image-title').html(input.files[0].name);
       };
       reader.readAsDataURL(input.files[0]);
   }
      else
      {	
        removeUpload2();
      }
  }

function removeUpload2() {
  $('#file-upload-input2').replaceWith($('#file-upload-input2').clone());
  $('#file-upload-content2').hide();
  $('#file-upload-btn2').show();
  $('#image-upload-wrap2').show();
}
$('#image-upload-wrap2').bind('dragover', function () {
    $('#image-upload-wrap2').addClass('image-dropping');
  });
  $('#image-upload-wrap2').bind('dragleave', function () {
    $('#image-upload-wrap2').removeClass('image-dropping');
});

function readURL3(input) {
  if (input.files && input.files[0]) {
   var reader = new FileReader();
   reader.onload = function(e) {
          $('#image-upload-wrap3').hide();
     $('#file-upload-image3').attr('src', e.target.result);
          $('#file-upload-content3').show();
          $('#file-upload-btn3').hide();
     $('#image-title').html(input.files[0].name);
     };
     reader.readAsDataURL(input.files[0]);
 }
    else
    {	
      removeUpload3();
    }
}

function removeUpload3() {
$('#file-upload-input3').replaceWith($('#file-upload-input3').clone());
$('#file-upload-content3').hide();
$('#file-upload-btn3').show();
$('#image-upload-wrap3').show();
}
$('#image-upload-wrap3').bind('dragover', function () {
  $('#image-upload-wrap3').addClass('image-dropping');
});
$('#image-upload-wrap3').bind('dragleave', function () {
  $('#image-upload-wrap3').removeClass('image-dropping');
});
