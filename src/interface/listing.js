import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';
import GlobalArray from "components/globalArray";
import HashControls from 'components/hashControls';

class Listing {
  constructor(id){
    this.id = id
    this.googleListingURL = new CodeComp().mainCode()
    this.listDatas = []
  }
  render() {
    const tpl =  `
    <div class="container">
      <div class="section-top">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#dashboard">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page"></li>
          </ol>
        </nav>
      </div>
      
      <div class="float-right"><button type="button" class="btn btn-light btn-sm mb-4" id="listing-create-btn" data-toggle="modal" data-target="#listing-modal">Create New</button></div>
      <div class="clearfix"></div>
      <div class="p-3 mb-5 bg-white rounded box-shadow">
        <div id="listing-view">
          
        </div>
      </div>
    </div> 
    `
    return tpl
  }

  clickHandler() {


    var imageURI, fileName, fileChange = false, headings
    let self = this
    let urlHash = new HashControls().getHash().split('?')[0]

    
    // let paramURL = self.googleListingURL+'&action=read'
    let paramId = GlobalArray.globalArray.paramid
    let paramName = GlobalArray.globalArray.paramname
    $('.breadcrumb-item.active').html('Listing: '+paramName)


    let readlistParamURL = new CodeComp().mainCode()+'&pageid='+paramId+'&action=readpagedatas'


    console.log('listingURL=', JSON.stringify(readlistParamURL))

    $('.loader').fadeIn()
    var tm1 = new Date()
    $.getJSON(readlistParamURL, function(callback) {

      console.log('listAll',callback)
      

      if(callback.result != '{"result":false}') {
        if(callback.result[0] == 'pageremoved'){
          alert('This page removed!')
          new HashControls('dashboard').setHash()
        } else {
          
            headings = callback.result[0];
            console.log('callbackHeading===',headings)

            console.log('callbackDatas===',callback)

            self.listDatas.push(callback)
            pushData(self.listDatas[0])
            var tm2 = new Date()
            console.log('totalTime: ',tm2-tm1)
        }
      } else {
        new CookieControls().deleteCookie()//Logout
      }
      
      
      $('.loader').fadeOut()
    }) 


    function getObjects(obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
          objects.push(obj);
        }
      }
      return objects;
    }
  

    $(document).on('click', '.list-controls', function(event) {
     
      let getId = $(this).attr('data-id')
      let paramId = GlobalArray.globalArray.paramid
      let getRowIndex = $(this).attr('data-rowindex')
      // $('body').attr('selectedid', getId)

      if($(this).hasClass('list-remove')) {

        removeThis(paramId, getId, getRowIndex)
      }
      if($(this).hasClass('list-edit')) {

        // editThis(getId)
        
        $('#listing-okBtn').attr({'data-rowindex':getRowIndex})

        elmentPushToModal('edit', getId)
        
      }
      // $( ".list-controls").unbind( "click" );
    });


    //Remove
    function removeThis(paramId, id, rowIndex) {

      let result = confirm("Are you sure you want to remove this row?");

      if (result) {
        let formdata = new FormData()
        formdata.append('pageid', paramId)
        formdata.append('action', 'deleterow')
        formdata.append('id', id)
        formdata.append('rowindex', rowIndex)

        $.ajax({
           method: 'POST',
           url: new CodeComp().mainCode(),
           data: formdata,
           dataType: 'json',
           contentType: false,
           processData: false,
           beforeSend: function(){
              $('.loader').fadeIn()
            }
          })
          .done(function(callback){
            let output = JSON.parse(callback.result)
            console.log('deleted=', output)
            if(output.result) {
              if(output.result != 'pageremoved') {
                self.listDatas[0].result = jQuery.grep(self.listDatas[0].result, function( elm, index ) {
                  return elm[0] != id
                })
                pushData(self.listDatas[0])
              } else {
                alert('This page removed!')
                new HashControls('dashboard').setHash()
              }
            } else {
              new CookieControls().deleteCookie()//Logout
            } 
          })
          .fail(function(callback) {
            alert('This action not completed! Please try again')
          })
         .always(function(){
            $('.loader').fadeOut()
          });
      }

    }

    

    //Create New
    $(document).on('click', '#listing-create-btn', function() {
      elmentPushToModal('create')
    });
/*
    $(document).on('show.bs.modal', '#listing-modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      alert(recipient)
    })*/

    $(document).on('mousedown', '.img-thumb', function() {
       $('[data-fancybox]').fancybox({
        buttons : [
          'close'
        ],
        protect: true
      });
    });

    $(document).on('click', '.fancybox-slide', function() {
      $.fancybox.close();
    });
    $(window).bind('hashchange',function(e) {
      $.fancybox.close();
    });



    function elmentPushToModal(action, rowId) {

      imageURI = undefined
      fileChange = false
      if(action == 'create') {
        $('#listing-modal').addClass('createList').removeClass('editList').find('.modal-title').text('Create New')
        fileName = ''
        $('#listing-okBtn').attr({'data-action':'create', 'data-rowid':''})
      } else {
        $('#listing-modal').removeClass('createList').addClass('editList').find('.modal-title').text('Edit')
        $('#listing-okBtn').attr({'data-action':'edit', 'data-rowid':rowId})
      }
  
      $('#listing-modal form .row').html('')

      var getListVal
      if(action=='edit') {
          var getListVal = getObjects(self.listDatas[0], 0, rowId)
          let filePosition = headings.indexOf('(file)')
          var imageURL = getListVal[0][filePosition]
          if(imageURL != '') {
            setTimeout(function() {
              imagePush(imageURL)
              /*$('.listing-image-preview').append('<img >')
              $('.listing-image-preview img').attr('src',imageURL)
              $('.listing-image-preview').css('background-image','url('+imageURL+')')*/
            }, 0);
          }
        }

     


      // uploadImg($inputImage, $image, options)


      $.each(headings, function(index, elm) {

        var colIndex = index+1
        
        var tElm,func = ``
        if(elm.charAt(0) == '_') {
          elm='_'
        }
        else if(elm.indexOf("(") >= 0){
          tElm = elm.split("(")
          elm = tElm[0]
          func = tElm[1].slice(0, -1);
        }

        var insertVal = ''

        if(getListVal) {
          insertVal = getListVal[0][index]
        }



        let ignoreFields = ['count','time','updatedtime','file','edit','remove'];

        if((elm!='_') && ignoreFields.indexOf(func) == -1) {
          $('#listing-modal form .row').append(`
            <div class="col-md-6">
                  <div class="form-group input-group-sm mb-3">
                    <label>`+elm+`</label>
                    <input type="text" class="form-control dynamicElem" placeholder="`+elm+`" value="`+insertVal+`" data-filedname="`+func+`" data-colindex="`+colIndex+`">
                  </div>
                </div>
            `)
          }
        if(func=='file') {
          $('#listing-modal form .row').append(`
            <div class="col-md-12">
              <div class="listing-image-preview"><img id="previewImage"></div>
              <div class="form-group input-group-sm mb-3">
                <label>Upload Image</label>
                <input type="file" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" class="dynamicElem elm-`+func+`" id="fileUpload" data-filedname="`+func+`" data-colindex="`+colIndex+`">
                <div class="imageControls">
                  <button type="button" class="btn btn-primary" data-method="zoom" data-option="0.1" title="Zoom In"><i class="ion-ios-search-strong"></i></button>
                  <button type="button" class="btn btn-primary" data-method="zoom" data-option="-0.1" title="Zoom In"><i class="ion-ios-search-strong"></i></button>

                  <button type="button" class="btn btn-primary" data-method="move" data-option="-10" data-second-option="0" title="Move Left"><i class="ion-android-arrow-back"></i></button>
                  <button type="button" class="btn btn-primary" data-method="move" data-option="10" data-second-option="0" title="Move Right"><i class="ion-android-arrow-forward"></i></button>
                  <button type="button" class="btn btn-primary" data-method="move" data-option="0" data-second-option="-10" title="Move Up"><i class="ion-android-arrow-up"></i></button>
                  <button type="button" class="btn btn-primary" data-method="move" data-option="0" data-second-option="10" title="Move Down"><i class="ion-android-arrow-down"></i></button>

                  <button type="button" class="btn btn-primary" data-method="rotate" data-option="45" title="Rotate Left"><i class="ion-refresh"></i></button>
                  <button type="button" class="btn btn-danger remove-image">Remove</button>
                </div>
              </div>
            </div>
          `)
        }
      })
      // $('#listing-modal').modal('show')
    }


    

    function imagePush(imagePath) {
      $('.listing-image-preview img').attr('src',imagePath)

    }

 




    /*$(document).on('change', '#fileUpload', function(event) {
      var inputFiles = this.files;
      if(inputFiles == undefined || inputFiles.length == 0) return;
      var inputFile = inputFiles[0];
      var reader = new FileReader();
      fileChange = true
      fileName = $(this).val().replace(/.*[\/\\]/, '')
      reader.onload = function(event) {
        imageURI = event.target.result
        imagePush(imageURI)
      };
      reader.onerror = function(event) {
        alert("ERROR: " + event.target.error.code);
      };
      reader.readAsDataURL(inputFile);
    });*/


    var uploadedImageType,uploadedImageURL

    var options = {
        viewMode: 3,
        aspectRatio: 1 / 1,
        autoCropArea: 1,
        strict: false,
        guides: false,
        highlight: false,
        dragCrop: false,
        dragMode: 'move',
        cropBoxMovable: false,
        cropBoxResizable: false,
        minContainerWidth: 150,
        minContainerHeight: 150
      };

    var URL = window.URL || window.webkitURL

    if (URL) {
          $(document).on('change', '#fileUpload', function(event) {
          var files = this.files
          var file
          if (files && files.length) {

            // $('.img-place-holder').addClass('hidden');
            // $('.create_image_crop_container').removeClass('hidden');
            // $inputImage.next('span').text('Change Image');

            file = files[0]
            fileChange = true
            fileName = file.name
            console.log('mainFILE=',file)

            if (/^image\/\w+$/.test(file.type)) {
              uploadedImageType = file.type
              if (uploadedImageURL) {
                URL.revokeObjectURL(uploadedImageURL)
              }
              uploadedImageURL = URL.createObjectURL(file)
              $('#previewImage').cropper('destroy').attr('src', uploadedImageURL).cropper(options)

              $('.imageControls').show()

            } else {
              window.alert('Please choose an image file.')
            }
          } 
        });
      }

      $(document).on('click', '.imageControls button', function(event) {
        event.preventDefault()
        let prevImg = $('#previewImage')
        if(!$(this).hasClass('remove-image')){
          let method = $(this).data('method')
          let option = $(this).data('option')
          let secondOption = $(this).data('second-option')
          if(typeof secondOption != 'undefined') {
            prevImg.cropper(method, option,secondOption)
          } else {
            prevImg.cropper(method, option)
          }
        } else {
            prevImg.cropper('destroy')
            $('#fileUpload').val('')
            fileChange = false
            imageURI = undefined
            $('#previewImage').attr('src','')
            $('.imageControls').hide()
        }
        
      });
      
    

    $('#listing-okBtn').off().on('click', function() {

      $('#listing-okBtn').attr('disabled',true)

      var formdata = new FormData()

      formdata.append('pagename', urlHash)

      let paramId = GlobalArray.globalArray.paramid
      formdata.append('pageid', paramId)

      let action = $(this).attr('data-action')
      var rowIndex = parseInt($(this).attr('data-rowindex'))

      if(action == 'create') {
        var timestamp = new Date()
        var rowId = timestamp.toISOString().replace(/\D/g,"").substr(0,14)
        formdata.append('action', 'create')
      } else {
        var rowId = $(this).attr('data-rowid')
        
        formdata.append('action', 'edit')
        formdata.append('rowindex', rowIndex)
      }

      var dataRow = []
      var obj = {}
      dataRow.push(obj)
      obj[1]=rowId
      
      $('.modal.show:visible form .row .dynamicElem:not(#fileUpload)').each(function(index, el) {
        var colindex = $(this).attr('data-colindex')
        var values = $(this).val()
        obj[colindex]=values
      });



      // console.log('fileChange==',fileChange)
      // console.log('imageURI==',imageURI)

      // return false

      // if(fileChange) {
      //   imageURI = $('#previewImage').cropper('getCroppedCanvas',{'width':'100','height':'100'}).toDataURL(uploadedImageType)
      // } else {
      //   imageURI = undefined
      // }
      
     
      imageURI = undefined

      if(fileChange){
        let prevImg = $('#previewImage')
        imageURI = prevImg.cropper('getCroppedCanvas',{'width':prevImg.parent().outerWidth(),'height':prevImg.parent().outerHeight()}).toDataURL(uploadedImageType)

        let filetype = imageURI.substring(5,imageURI.indexOf(';'))

        let img = imageURI.replace(/^.*,/, '')

        formdata.append('filechange', fileChange)
        formdata.append('file', img)
        formdata.append('filename', fileName)
        formdata.append('filetype', filetype)
        formdata.append('foldername', 'listing')

      } else {
        formdata.append('file', '')
      }



      console.log(dataRow)

      // for (var pair of formdata.entries()) {
      //     console.log(pair[0]+ ', ' + pair[1]); 
      // }

  dataRow = JSON.stringify(dataRow)

  formdata.append('coldatas', dataRow)

    console.log(new CodeComp().mainCode())
      $.ajax({
         method: 'POST',
         url: new CodeComp().mainCode(),
         data: formdata,
         dataType: 'json',
         contentType: false,
         processData: false,
         beforeSend: function(){
            $('.loader').fadeIn()
          }
        })
        .done(function(callback){


          let output = JSON.parse(callback.result)
          console.log('created=', output)
          if(output.result) {
            if(output.result != 'pageremoved') {
              if(output.result) {
                if(action == 'create') {
                  self.listDatas[0].result.splice(1, 0, output.result);
                } else {
                  self.listDatas[0].result[rowIndex-1] = output.result
                }
                pushData(self.listDatas[0])
              } else {
                new CookieControls().deleteCookie()//Logout
              }
            } else {
              alert('This page removed!')
              new HashControls('dashboard').setHash()
            }
          } else {
            new CookieControls().deleteCookie()//Logout
          }

         
        })
        .fail(function(callback) {
          alert('This action not completed! Please try again')
       })
       .always(function(){
         $('.loader').fadeOut()
         $('#listing-okBtn').attr('disabled',false)
         $('#listing-modal [data-dismiss="modal"]').trigger('click')
       });



    });

  }
}




var dataTable

const pushData = (data) => {
  var tableHeading = ``
  var lists = ``
  var getIndex = []
    
  var headerValues
  $.each(data.result, function(index, elm) {
    // console.log('med=',elm)

    if(index == 0) {

      headerValues = elm
    } else {
      

      var listsInner = ``
      
      $.each(elm, function(index1, elm1) {
        var imgPath = `images/placeholder.png`
        var imgView = `<img src="`+imgPath+`" alt="" />`
        

        var updatedTimeVal = `-`

        var func = headerValues[index1]
        if(func.charAt(0) == '_') {
          func='_'
        } else if(func.indexOf("(") >= 0) {
          func = func.split("(")[1].slice(0, -1)
        }
        // console.log(func)
        if(func=='count') {
          elm1 = index
        }
        if(func=='updatedtime') {
          if(elm1 == '') {
            elm1 = updatedTimeVal
          }
        }
        if(func=='edit') {
          elm1 = `<button class="btn btn-sm btn-outline-primary list-controls list-edit ion-edit" data-rowindex="`+(index+1)+`" data-id="`+elm[0]+`" data-toggle="modal" data-target="#listing-modal"></button>`
        }
        if(func=='remove') {
          elm1 = `<button class="btn btn-sm btn-outline-danger list-controls list-remove ion-trash-a" data-rowindex="`+(index+1)+`" data-id="`+elm[0]+`"></button>`
        }
        if(func=='file') {
          if(elm1 != '') {
            imgPath = elm1
            imgView = `<a href="`+imgPath+`" data-type="image" data-fancybox><img src="`+imgPath+`" alt="" /></a>`
          }
          elm1 = `<div class="img-thumb">`+imgView+`</div>`
        }

        if(func != '_') {
          listsInner += `<td>`+elm1+`</td>`
        }

        /*listsInner = `<td>`+(index)+`</td>
            <td>`+elm[0]+`</td>
            <td>`+elm[2]+`</td>
            <td>`+elm[3]+`</td>
            <td><div class="img-thumb" `+bgImg+`><img src="`+imgPath+`" alt="" /></div></td>
            <td><a class="list-controls list-edit" data-id=`+elm[1]+`>Edit</a></td>
            <td><a class="list-controls list-remove" data-id=`+elm[1]+` data-mediaid=`+elm[4]+`>Remove</a></td>`*/

      });

      lists += `<tr data-rowid="`+elm[0]+`">
           `+listsInner+` 
          </tr>`

      
      }
    
  });



  generateHeading(headerValues)



  function generateHeading(headingVal) {
    
    var pos = 0

    let ignoreFields = ['file','edit','remove'];
    
    $.each(headingVal, function(index, elm) {
      // if(index != 0) {
        
        var tElm,func = ``
        if(elm.charAt(0) == '_') {
          elm='_'
        } else if(elm.indexOf("(") >= 0){
          tElm = elm.split("(")
          elm = tElm[0]
          func = tElm[1].slice(0, -1)
        }
        if(elm != '_') {
          console.log(elm)
          tableHeading += `<th data-func=`+func+`>`+elm+`</th>`
          if(ignoreFields.indexOf(func) != -1){
            getIndex.push(pos)
          } 
          pos++
        }

        
      
    })
    console.log(getIndex)
  }

  $('#listing-view').html(`
    <table class="listing-table table table-responsive sortable-row clearfix">
      <thead>
        <tr>
          `+tableHeading+`
        </tr>
      </thead>
      <tbody>
        `+lists+`            
      </tbody>
    </table>
  `)


  if(dataTable) {
    dataTable.destroy(); 
  }

 
dataTable = $('.listing-table').DataTable({
  responsive: true,
  order: [],
  columnDefs: [ { orderable: false, targets: getIndex } ]
});
  // [1,4,5]
}



export default Listing