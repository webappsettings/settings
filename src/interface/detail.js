import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';
import GlobalArray from "components/globalArray";
import HashControls from 'components/hashControls';

class Detail {
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

      
      <div class="clearfix"></div>
      
      
      <div id="details-all" class="mb-5">
        
        

        
      </div>



    </div> 
    `
    return tpl
  }

  clickHandler() {
    
    var imageURI, fileName, fileChange = false, headings
    let self = this
    let urlHash = new HashControls().getHash().split('?')[0]


    let paramId = GlobalArray.globalArray.paramid
    let paramName = GlobalArray.globalArray.paramname
    $('.breadcrumb-item.active').html('Detail: '+decodeURI(paramName))

    let readdetailParamURL = new CodeComp().mainCode()+'&pagetype=detail&pageid='+paramId+'&action=readpagedatas'

    // console.log('detail=',readdetailParamURL)

    $('.loader').fadeIn()
    $.getJSON(readdetailParamURL, function(callback) {
      // console.log(callback)


      if(callback.result != '{"result":false}') {
        if(callback.result[0] == 'pageremoved'){
          alert('This page removed!')
          new HashControls('dashboard').setHash()
        } else {
          
            headings = callback.result[0];
            // console.log('callbackHeading===',headings)


            self.listDatas.push(callback)

            // console.log('datas==',self.listDatas[0].result[1])
            
            if(!self.listDatas[0].result[1]) {
              // pushData(self.listDatas[0], 'create')
              // elmentPushToModal('create')
            } else {

              pushSubData(self.listDatas[0], 'read')

              // pushData(self.listDatas[0], 'read')
              /*var subDetailAvail = self.listDatas[0].result[2]
              console.log('all_DATAS=',subDetailAvail)*/
              /*if(subDetailAvail) {
                pushSubData(self.listDatas[0], 'read')
              }*/
            }
            
            
        }
      } else {
        new CookieControls().deleteCookie()//Logout
      }



      $('.loader').fadeOut()
    }) 



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
        $(document).on('change', '.fileUpload', function(event) {
          var files = this.files
          var file

          var dataSectionId = $(this).attr('data-section')

          if (files && files.length) {

            // $('.img-place-holder').addClass('hidden');
            // $('.create_image_crop_container').removeClass('hidden');
            // $inputImage.next('span').text('Change Image');

            file = files[0]
            fileChange = true
            fileName = file.name
            $('[for="fileUpload-'+dataSectionId+'"]').text(fileName)
            console.log('mainFILE=',file)

            if (/^image\/\w+$/.test(file.type)) {
              uploadedImageType = file.type
              if (uploadedImageURL) {
                URL.revokeObjectURL(uploadedImageURL)
              }
              uploadedImageURL = URL.createObjectURL(file)

              $('#prevImg-'+dataSectionId).cropper('destroy').attr('src', uploadedImageURL).cropper(options)

              $('[data-section="'+dataSectionId+'"].imageControls').show()

            } else {
              window.alert('Please choose an image file.')
            }
          } 
        });
      }



      $(document).on('click', '.imageControls button', function(event) {
        event.preventDefault()
        var dataSectionId = $(this).parent().attr('data-section')

        // let prevImg = $('.listing-image-preview.'+dataSectionId+' img')
        let prevImg = $('#prevImg-'+dataSectionId)

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
          $('[data-section="'+dataSectionId+'"].fileUpload').val('')
          $('[for="fileUpload-'+dataSectionId+'"]').text('Choose image...')
          fileChange = false
          imageURI = undefined
          prevImg.attr('src','')
          $('[data-section="'+dataSectionId+'"].imageControls').hide()
        }
      });

      

      $(document).on('click', '.subdetailedit', function() {

        let subId = $(this).attr('data-subid')
        let type = $(this).attr('data-type')

        if(type == 'table') {
          $('#'+subId+' .subDynamicElem').prop('contenteditable', true)
        }

        if(type == 'detail') {
          $('#'+subId+' .dynamicElem').prop('readonly', false)
          $('#fileUpload-'+subId).prop('disabled', false)
        }

        
        $(this).addClass('d-none')
        $('.subdetailsave[data-subid="'+subId+'"]').removeClass('d-none')

        $('.subdetailcreate[data-subid="'+subId+'"]').addClass('d-none')
        $('.subdetailcancel[data-subid="'+subId+'"]').removeClass('d-none')
        
        $('#'+subId+' .subtable-create-new').addClass('d-none')

        disableAnotherSections(subId)

      });


      function disableAnotherSections(subId) {
        $('.detail-sections').each(function(index, el) {
          let getSection = $(this).attr('id')
          if(getSection != subId) {
            $(this).addClass('disabled-subdetailsection')
          }
        });
      }

      $(document).on('click', '.subdetailsave', function() {
        let subId = $(this).attr('data-subid')
        let type = $(this).attr('data-type')
        
        if(type == 'table') {
          $('#'+subId+' .subDynamicElem').prop('contenteditable', false)
        }

        $(this).prop('disabled',true)
        $('.subdetailcancel[data-subid="'+subId+'"]').prop('disabled',true)
        subdetailsave('editsubsection',subId)
      });

      $(document).on('click', '.subdetailcreate', function() {
        let subId = $(this).attr('data-subid')
        $('#'+subId+' .subtable-create-new').removeClass('d-none')
        $('.subdetailedit[data-subid="'+subId+'"]').addClass('d-none')

        $(this).addClass('d-none')
        $('.subdetailcreateclose[data-subid="'+subId+'"]').removeClass('d-none')
        $('.subdetailcreatesave[data-subid="'+subId+'"]').removeClass('d-none')

        disableAnotherSections(subId)

      });

      $(document).on('click', '.list-remove', function() {
        var headingIndex = $(this).attr('data-headingindex')
        var rowIndex = $(this).attr('data-rowindex');

        let subId = $(this).attr('data-subid')

        var formdata = new FormData()
        formdata.append('pagename', urlHash)
        formdata.append('subsection', 'subsection')
        formdata.append('pageid', paramId)
        formdata.append('action', 'deleterowbyindex')
        formdata.append('subid', subId)
        formdata.append('rowindex', rowIndex)
        formdata.append('headingindex', headingIndex)

        removeThisSubRow(formdata, subId, rowIndex)

        // console.log(headingIndex + 'rowIndex=='+rowIndex)
      });




      function removeThisSubRow(formdata, subId, rowIndex) {

        

        let result = confirm("Are you sure you want to remove this row?");

        if (result) {

       /* for (var pair of formdata.entries()) {
          console.log(pair[0]+ '= ' + pair[1]); 
        }*/
        

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

            console.log(callback)
            let output = JSON.parse(callback.result)
            console.log('deleted=', output)
            if(output.result) {
              if(output.result != 'pageremoved') {
                // $('[data-tableid="'+subId+'"][data-rowindex="'+rowIndex+'"]').remove()

                
                // console.log('self.listDatas[0]==',self.listDatas[0].result)

                self.listDatas[0].result.splice((rowIndex-1),1);

                pushSubData(self.listDatas[0], 'read')
                

              } else {
                alert('This section already removed!')
              }
            } else {
              alert('This page removed!')
              // new CookieControls().deleteCookie()//Logout
               new HashControls('dashboard').setHash()
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






      var allChangeArry = []

      $(document).on('click', '.subdetailcancel', function() {
        let subId = $(this).attr('data-subid')
        $('#'+subId+' .subDynamicElem').prop('contenteditable', false)
        
        $(this).addClass('d-none')
        $('.subdetailsave[data-subid="'+subId+'"]').addClass('d-none')
        $('.subdetailcreate[data-subid="'+subId+'"]').removeClass('d-none')
        $('.subdetailedit[data-subid="'+subId+'"]').removeClass('d-none')

        pushSubData(self.listDatas[0], 'read')
        allChangeArry = []
        fileChange = false

        $('.disabled-subdetailsection').removeClass('disabled-subdetailsection')

      });


      $(document).on('click', '.subdetailcreateclose', function() {
        let subId = $(this).attr('data-subid')
        $(this).addClass('d-none')
        $('.subdetailcreatesave[data-subid="'+subId+'"]').addClass('d-none')
        $('#'+subId+' .subtable-create-new').addClass('d-none').find('[contenteditable="true"]').text('').removeClass('contenteditable-editing').trigger('change')

        $('.subdetailcreate[data-subid="'+subId+'"]').removeClass('d-none')
        $('.subdetailedit[data-subid="'+subId+'"]').removeClass('d-none')

        $('.disabled-subdetailsection').removeClass('disabled-subdetailsection')
        allChangeArry = []
      }); 



      $(document).on('click', '.subdetailcreatesave', function() {
        let subId = $(this).attr('data-subid')
        
        /*let newRowIndex = $('#'+subId+' table tbody tr:last-of-type').attr('data-rowindex')
        if(!newRowIndex) {
          newRowIndex = $('#'+subId+' table thead tr').attr('data-headingindex')
        }
        newRowIndex = parseInt(newRowIndex)+1*/
        $(this).prop('disabled',true)

        subdetailsave('createsubsection', subId)

        // alert(newRowIndex)

      });

      

      $(document).on("paste", '[contenteditable="true"]', function(e){
        e.preventDefault();
        var text = e.originalEvent.clipboardData.getData("text/plain");
        var temp = document.createElement("div");
        temp.innerHTML = text;
        document.execCommand("insertHTML", false, temp.textContent);
      });

      
      
      $(document).on('change keydown keypress input', '.subdetail-section [contenteditable="true"]', function() {


        if (this.textContent) {
          this.dataset.divPlaceholderContent = 'true';
          $(this).addClass('contenteditable-editing')
        } else {
          delete(this.dataset.divPlaceholderContent);
          $(this).removeClass('contenteditable-editing')
        }


        var thisVal = $(this).text()
       
        let selectRow = $(this).closest('tr')
        var colIndex = $(this).attr('data-colindex')
        var headingindex = selectRow.attr('data-headingindex')
        var rowindex = selectRow.attr('data-rowindex')
        var tableId = selectRow.attr('data-tableid')

        if(typeof rowindex == 'undefined') {
          rowindex = $('#'+tableId+' table tbody tr:last-of-type').attr('data-rowindex')
          headingindex = $('#'+tableId+' table thead tr').attr('data-headingindex')
          if(!rowindex) {
            rowindex = headingindex
          }
          rowindex = parseInt(rowindex)+1
        }
        $('#'+tableId).attr('data-lasteditedrowindex', rowindex);

        addToChangeArry(colIndex,headingindex,rowindex,tableId, thisVal)
          

      });


      $(document).on('change keyup input', '.subdetail-section[data-type="detail"] .dynamicElem', function() {
        // alert($(this).val())
        var _this = $(this)
        var colIndex = _this.attr('data-colindex')
        var headingindex = _this.attr('data-headingindex')
        var rowindex = _this.attr('data-rowindex')

        var tableId = _this.closest('.subdetail-section').attr('data-subid')

        var thisVal = _this.val()

        // console.log(colIndex,headingindex,rowindex,tableId,thisVal)

        /*if(fileChange) {
          thisVal = fileChange
        }*/

        if(_this.hasClass('elm-file')) {
          thisVal = fileName
          colIndex = parseInt(colIndex)+2
          // alert(colIndex)
          // console.log('aaaaa')
        }

        // if(!_this.hasClass('elm-file')) {
           // var thisVal = 
           addToChangeArry(colIndex, headingindex, rowindex, tableId, thisVal)
        // } 
       

      });






      function addToChangeArry(colIndex, headingindex, rowindex, tableId, thisVal) {
        if(typeof allChangeArry[tableId] == 'undefined') {
          allChangeArry[tableId] = {}
          allChangeArry[tableId].headingindex = headingindex
        }

        if(typeof allChangeArry[tableId].row == 'undefined') {
          allChangeArry[tableId].row = {}
        }

        if(typeof allChangeArry[tableId].row[rowindex] == 'undefined') {
          allChangeArry[tableId].row[rowindex] = {}
        }

        if(typeof allChangeArry[tableId].row[rowindex].column == 'undefined') {
          allChangeArry[tableId].row[rowindex].column = {}
        }

        allChangeArry[tableId].row[rowindex].column[colIndex] = thisVal
      }


      function subdetailsave(action, subId) {
        

        console.log('allChangeArry==:',allChangeArry)

        // return false


        var formdata = new FormData()
        formdata.append('pagename', urlHash)
        formdata.append('subsection', 'subsection')
        formdata.append('pageid', paramId)
        formdata.append('action', action)
        formdata.append('subid', subId)


        if(fileChange){
          // alert('prevImg-'+subId)

          let prevImg = $('#prevImg-'+subId)
          imageURI = prevImg.cropper('getCroppedCanvas',{'width':prevImg.parent().outerWidth(),'height':prevImg.parent().outerHeight()}).toDataURL(uploadedImageType)

          // console.log(imageURI)
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


        for (var pair of formdata.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }


        // return false

        if(allChangeArry[subId]) {

          var datarow = JSON.stringify(allChangeArry[subId])
          console.log('datarow==',datarow)
          // return false;
          formdata.append('datarow', datarow)

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

            // console.log('serverCallback=',callback.result["0"]["0"])

            

            pushSubData(self.listDatas[0], 'read')

            if(callback.result != '{"result":false}') {
              if(callback.result == 'pageremoved'){
                alert('This page removed!')
                new HashControls('dashboard').setHash()
              } 
              if(callback.result == 'sectionremoved') {
                alert('Failed!!! Please try again')
              }
              if(callback.result.length >= 1) {

                console.log('changesHere=', allChangeArry[subId])
                console.log('ffffffFinal==',self.listDatas[0])

                $.each(callback.result, function(index, el) {
                 let rowIndex = el[0].rowindex
                 let rowData = el[0].data
                 var crt = 1
                 if(action == 'createsubsection') {
                  crt = 0
                 } 
                 self.listDatas[0].result.splice(parseInt(rowIndex)-1, crt, rowData);
                });
                
                /*if(action == 'createsubsection') {
                  let rowindex = $('#'+subId).attr('data-lasteditedrowindex');
                  self.listDatas[0].result.splice(parseInt(rowindex)-1, 0, callback.result);
                } else {
                    for (var keyr in allChangeArry[subId].row) {
                    
                    var dataRowIndex = keyr;

                    for (var key in allChangeArry[subId].row[dataRowIndex].column) {
                      // alert('row='+dataRowIndex+'    column='+key+ '    value='+allChangeArry[subId].row[dataRowIndex].column[key])
                      self.listDatas[0].result[dataRowIndex-1][key-1] = allChangeArry[subId].row[dataRowIndex].column[key]
                    }
                  }
                }*/

                pushSubData(self.listDatas[0], 'read')
              }

            }

          })
          .fail(function(callback) {
            alert('This action not completed! Please try again')
          })
          .always(function(){

            resetSubSection(subId)         

            $('.loader').fadeOut()
          });
        } else {
          // resetSubSection(subId)
          // alert(subId)
          // $('.subdetailcancel[data-subid="'+subId+'"]').trigger('click')
          
          resetSubSection(subId)
        }
 

    }


    function resetSubSection(subId) {

      allChangeArry = []
      fileChange = false
      
      $('[data-tableid="'+subId+'"]'+' .contenteditable-editing').removeClass('contenteditable-editing')

      $('.disabled-subdetailsection').removeClass('disabled-subdetailsection')

      $('.subdetailsave[data-subid="'+subId+'"]').prop('disabled',false).addClass('d-none')
      $('.subdetailcancel[data-subid="'+subId+'"]').prop('disabled',false).addClass('d-none')
      $('.subdetailedit[data-subid="'+subId+'"]').prop('disabled',false).removeClass('d-none')
      $('.subdetailcreate[data-subid="'+subId+'"]').prop('disabled',false).removeClass('d-none')

      $('.subdetailcreatesave[data-subid="'+subId+'"]').prop('disabled',false).addClass('d-none')
      $('.subdetailcreateclose[data-subid="'+subId+'"]').prop('disabled',false).addClass('d-none')      

    }




  }
}





/*function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}*/


const pushData = (data, action) => {


  console.log('allDATA==',data)
  
  var getListVal, multipleSection

  var headings = data.result[0]

  $.each(data.result, function(ind, el) {

    /*if(ind == 1) {
      multipleSection = false
      getListVal = data.result[ind]

      var getRowId = ''

      var readOnly = ''

      $('#detail-view').attr('data-action',action)
      if(typeof getListVal != 'undefined') {
        getRowId = getListVal[0]
      }
      $('#detail-save-btn').attr({'data-action':action, 'data-rowid':getRowId})
      
      if(action == 'create') {
        $('#detail-save-btn').parent().removeClass('d-none')
      }
      if(action == 'read') {
        readOnly='readonly'
        $('#detail-save-btn').parent().addClass('d-none')
        $('#detail-edit-btn').parent().removeClass('d-none')
      }
      if(action == 'edit') {
        $('#detail-edit-btn').parent().addClass('d-none')
        $('#detail-save-btn').parent().removeClass('d-none')
      }

      $('#detail-view .row').html('')

      // console.log('modal-headings==',headings)


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

        if(typeof getListVal != 'undefined') {
          insertVal = getListVal[index]
        }
        

        let ignoreFields = ['count','time','updatedtime','file','edit','remove','subdetails'];

        if((elm!='_') && ignoreFields.indexOf(func) == -1) {

          var typeElm = ``, fullElm
          if(func.indexOf("[") >= 0) {
            typeElm = func.split("[")[1].slice(0, -1)
          }
          // console.log('func==',typeElm)

          if(typeElm == 'ti' || typeElm ==``) {
            fullElm = `<input type="text" class="form-control dynamicElem" `+readOnly+` placeholder="`+elm+`" value="`+insertVal+`" data-filedname="`+func+`" data-colindex="`+colIndex+`">`
          } 
          if(typeElm == 'ta') {
            fullElm = `<textarea rows="4" class="form-control dynamicElem" `+readOnly+` placeholder="`+elm+`" data-filedname="`+func+`" data-colindex="`+colIndex+`">`+insertVal+`</textarea>`
          }
      

          $('#detail-view .row').append(`
            <div class="col-md-4">
            <div class="form-group input-group-sm mb-3">
            <label>`+elm+`</label>
            `+fullElm+`
            </div>
            </div>
            `)
        }
        if(func=='file') {
          console.log(insertVal)
          // $('[for="fileUpload"]').text('Choose image...')
          let imageId = '', imageName = 'Choose image...'

          if(insertVal != '') {
            imageId = getListVal[index+1]
            imageName = getListVal[index+2]
          }

          $('#detail-view .row').append(`
            <div class="col-md-12" style="display:flex; margin-bottom: 2rem;">
            <div class="listing-image-preview"><img id="previewImage" src="`+insertVal+`"></div>

            <div class="img-section-arrange">
            <div>

            <div class="form-group input-group-sm mb-3">
            <div class="custom-file">
            <input type="file" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" class="custom-file-input dynamicElem elm-`+func+`" id="fileUpload" data-filedname="`+func+`" data-colindex="`+colIndex+`" data-imageid="`+imageId+`">
            <label class="custom-file-label" for="fileUpload">`+imageName+`</label>
            </div>
            </div>

            <div class="imageControls">
            <button type="button" class="btn btn-primary btn-sm" data-method="zoom" data-option="0.1" title="Zoom In"><i class="ion-ios-search-strong"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="zoom" data-option="-0.1" title="Zoom In"><i class="ion-ios-search-strong"></i></button>

            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="-10" data-second-option="0" title="Move Left"><i class="ion-android-arrow-back"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="10" data-second-option="0" title="Move Right"><i class="ion-android-arrow-forward"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="0" data-second-option="-10" title="Move Up"><i class="ion-android-arrow-up"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="0" data-second-option="10" title="Move Down"><i class="ion-android-arrow-down"></i></button>

            <button type="button" class="btn btn-primary btn-sm" data-method="rotate" data-option="45" title="Rotate Left"><i class="ion-refresh"></i></button>
            <button type="button" class="btn btn-danger btn-sm remove-image"><i class="ion-trash-a"></i></button>
            </div>                

            </div>
            </div>
            </div>
            `)
        }
      })
    }

    if(ind > 1) {
      multipleSection = true
      return false
    }*/



  });

  

}






var innerRowIndex = 0

const pushSubData = (data, action, subAvailId) => {



  innerRowIndex = 0

  if(action == 'read') {
    if(!subAvailId) {
      $('.subdetail-section').remove()
    } else {
        $('.subdetail-section[data-subid="'+subAvailId+'"]').remove()
    }
  }

  $('#detail-save-btn').attr({'data-action':action})
      
       

  var globalElm, dataRow, elmHead, dataArry = [], dataOnly = []

  for(var i=0; i<data.result.length; i++) {
    dataRow = true


    if(data.result[i][0].indexOf('table') != -1) {
      globalElm = 'table'
      addToArray()
    }
    if(data.result[i][0].indexOf('detail') != -1) {
      globalElm = 'detail'
      addToArray()
    }

    /*alert(data.result[i][0])
    globalElm = data.result[i][0].split('-')[0]
    addToArray()*/



    function addToArray() {
      dataRow = false
      elmHead = 0

      if(!$.isEmptyObject(dataArry)) {
        runSubSections(dataArry, action)
      }
      dataOnly = []
      dataArry = []

      dataArry.type = globalElm
      dataArry.mainHead = data.result[i]
    }

    if(dataRow && globalElm=='table' || dataRow && globalElm=='detail') {
      dataOnly.push(data.result[i])
      dataArry['data'] = dataOnly
    }


  }

  runSubSections(dataArry, action)
}

var tableHeadIndex

function runSubSections(dataArry, action) {

  console.log('finalDataArry==', dataArry)

  var tableId = dataArry.mainHead[0]
  var caption = dataArry.mainHead[2]

  // var type = tableId.split('-')[0]


  var editCntrlBtns = ``
    if(dataArry.data.length >= 2) {
      editCntrlBtns = `
      <button type="button" class="btn btn-outline-secondary btn-sm subdetailedit" data-type="`+dataArry.type+`" data-subid="`+tableId+`"><i class="ion-edit"></i> Edit</button>
      <button type="button" class="btn btn-outline-secondary btn-sm subdetailcancel d-none" data-subid="`+tableId+`"><i class="ion-close"></i> Cancel</button>
      <button type="button" class="btn btn-success btn-sm subdetailsave d-none" data-type="`+dataArry.type+`" data-subid="`+tableId+`"><i class="ion-checkmark"></i> Save</button>`
    }

    var controlBtns = `<div class="float-right">`+editCntrlBtns+` 
      <button type="button" class="btn btn-success btn-sm subdetailcreate" data-subid="`+tableId+`"><i class="ion-plus"></i> Add New</button>
      <button type="button" class="btn btn-outline-secondary btn-sm subdetailcreateclose d-none" data-subid="`+tableId+`"><i class="ion-close"></i> Close</button>
      <button type="button" class="btn btn-success btn-sm subdetailcreatesave d-none" data-subid="`+tableId+`"><i class="ion-checkmark"></i> Save</button>
    </div>`


    // alert(dataArry.type)


  if(dataArry.type == 'table') {
    

    // alert(dataArry.data.length)
    
        
    if(dataArry.mainHead[1] == '--') {
      $('#details-all').append(`
        <div class="p-4 mb-3 bg-white rounded box-shadow subdetail-section" data-type="`+dataArry.type+`" data-subid="`+tableId+`">
          `+controlBtns+`
          <div id="`+tableId+`" class="detail-sections">
          </div>
        </div>
      `)
    }
    if(dataArry.mainHead[1] == '-' || dataArry.mainHead[1] == '') {
      var hr
      if(dataArry.mainHead[1] == '') {
        hr = ``
      } else {
        hr = `<hr>
        `+controlBtns+`
        `
      }
      $('#details-all .subdetail-section:last-of-type').append(hr+`
        <div id="`+tableId+`" class="detail-sections" data-subid="`+tableId+`">
          <div id="`+tableId+`" class="detail-sections">
          </div>
        </div>
      `)
    }

    innerRowIndex++

    $('#'+tableId).append(`
      <h6>`+caption+`</h6>
      <table class="table"></table>
    `)



    var tableHeading = ``
    var headingVal
    var listsInner


    let ignoreFields = ['count','edit','remove'];


    var lists = ``,headerValues,tableCreateSection

     

    $.each(dataArry.data, function(index, elm) {

      if(index == 0) {

        headerValues = $.map(elm, function (el) {
          return el !== '' ? el : null;
        })

        console.log(headerValues)

        generateHeading(headerValues)

        headerValues = elm

        if(dataArry.data.length < 2) {
            lists += `<tr><td class="text-center" colspan=`+pos+`>No Data</td></tr>`
         }

      } else {

        listsInner = ``


        $.each(elm, function(index1, elm1) {

          var innerColIndex = index1+1
          var func = headerValues[index1]
          var cntrlBtns = ``

          if(func!='') {

            if(func.charAt(0) == '_') {
              func='_'
            } else if(func.indexOf("(") >= 0) {
              func = func.split("(")[1].slice(0, -1)
            }
            
            if(func=='edit') {
              cntrlBtns = `<button class="btn btn-sm btn-outline-primary list-controls list-edit ion-edit" data-headingindex="`+tableHeadIndex+`" data-rowindex="`+(innerRowIndex+1)+`" data-id="`+tableId+`"></button>`
            }
            if(func=='remove') {
              cntrlBtns = `<button class="btn btn-sm btn-outline-danger list-controls list-remove ion-trash-a" data-headingindex="`+tableHeadIndex+`" data-rowindex="`+(innerRowIndex+1)+`" data-subid="`+tableId+`"></button>`
            }

            if(func=='count') {
              listsInner += `<td>`+index+`</td>`
            }

            if(func != '_' && func!='count' && cntrlBtns == ``) {
              listsInner += `<td><div contenteditable="false" class="subDynamicElem" data-colindex="`+innerColIndex+`">`+elm1+`</div></td>`
            }

            if(func != '_' && func!='count' && cntrlBtns != ``) {
              listsInner += `<td>`+cntrlBtns+`</td>`
            }

          } else {
            return false
          }

        })

        innerRowIndex++

        lists += `<tr data-tableid="`+tableId+`" data-headingindex="`+tableHeadIndex+`" data-rowindex="`+innerRowIndex+`">`+listsInner+`</tr>`
        
      } 

    })

    

    
    var tableFooter;
    var pos;
    
    function generateHeading(headingVal) {
    
      pos = 0

      let ignoreFields = ['count','file','edit','remove'];

      innerRowIndex++
      
      $.each(headingVal, function(index, elm) {

          var innerColIndex = index+1
              
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

            tableHeadIndex = innerRowIndex

            tableHeading += `<th data-func="`+func+`">`+elm+`</th>`

            if(ignoreFields.indexOf(func) != -1){
              // getIndex.push(pos)
              elm = `&nbsp;`
            } else {
              elm = `<div contenteditable="true" class="subCreateElem" data-colindex="`+innerColIndex+`" data-placeholder="`+elm+`"></div>`
            }
            pos++

            tableFooter += `<td data-func="`+func+`">`+elm+`</td>`

          }
        
      })
      // console.log('getIndex==',getIndex)
    }


    $('#'+tableId+' table').html(`
      <thead>
        <tr data-tableid="`+tableId+`" data-headingindex="`+tableHeadIndex+`">
          `+tableHeading+`
        </tr>
      </thead>
      <tbody>
        `+lists+`            
      </tbody>
      <tfoot class="subtable-create-new d-none">
        <tr data-tableid="`+tableId+`">
          `+tableFooter+`
        </tr>
      </tfoot>
  `)

  }





  if(dataArry.type == 'detail') {
        /*alert('a')*/

        console.log('dataArry-==a',dataArry)


        //var tableId = dataArry.mainHead[0]
        //var caption = dataArry.mainHead[2]
         innerRowIndex++


        if(dataArry.mainHead[1] == '--') {
            $('#details-all').append(`
              <div class="p-4 mb-3 bg-white rounded box-shadow subdetail-section" data-type="`+dataArry.type+`" data-subid="`+tableId+`">
                <div id="`+tableId+`" class="detail-sections">
                   `+controlBtns+`
                   <div class="row">
                  </div>
                </div>
              </div>
            `)
          }
          if(dataArry.mainHead[1] == '-' || dataArry.mainHead[1] == '') {
            var hr
            if(dataArry.mainHead[1] == '') {
              hr = ``
            } else {
              hr = `<hr>`
            }
            $('#details-all .subdetail-section:last-of-type').append(hr+`
              `+controlBtns+`              
              <div id="`+tableId+`" class="detail-sections" data-subid="`+tableId+`">
                  <div class="row">                  
                </div>
              </div>
            `)
          }

         


  var getListVal
  var headings




  $.each(dataArry.data, function(index, elm) {

    var topIndex = index

    if(index == 0) {
      headings = elm
      innerRowIndex++
      tableHeadIndex = innerRowIndex
    }



    if(index > 0) {

      innerRowIndex++
      var insertVal = ''
      var readOnly = ''

  

        if(action == 'create') {
          $('#detail-save-btn').parent().removeClass('d-none')
        }
        if(action == 'read') {
          var readOnly='readonly'
          $('#detail-save-btn').parent().addClass('d-none')
          $('#detail-edit-btn').parent().removeClass('d-none')
        }
        if(action == 'edit') {
          $('#detail-edit-btn').parent().addClass('d-none')
          $('#detail-save-btn').parent().removeClass('d-none')
        }

        // innerRowIndex++



      $.each(elm, function(index, elm) {


        var heading = headings[index]

        if(heading == '') {
          return false
        }

        var getListVal = elm

        var colIndex = index+1
        
        var tElm,func = ``
        if(heading.charAt(0) == '_') {
          heading='_'
        }
        else if(heading.indexOf("(") >= 0){
          tElm = heading.split("(")
          heading = tElm[0]
          func = tElm[1].slice(0, -1);

        }


        

        if(typeof elm != 'undefined') {
          insertVal = getListVal
        }          




        let ignoreFields = ['count','time','updatedtime','file','edit','remove','subdetails'];

        if((heading!='_') && ignoreFields.indexOf(func) == -1) {

          var typeElm = ``, fullElm
          if(func.indexOf("[") >= 0) {
            typeElm = func.split("[")[1].slice(0, -1)
          }
          // console.log('func==',typeElm)

          if(typeElm == 'ti' || typeElm ==``) {
            fullElm = `<input type="text" class="form-control dynamicElem" `+readOnly+` placeholder="`+heading+`" value="`+insertVal+`" data-filedname="`+func+`" data-colindex="`+colIndex+`" data-rowindex="`+innerRowIndex+`" data-headingindex="`+tableHeadIndex+`">`
          } 
          if(typeElm == 'ta') {
            fullElm = `<textarea rows="4" class="form-control dynamicElem" `+readOnly+` placeholder="`+heading+`" data-filedname="`+func+`" data-colindex="`+colIndex+`" data-rowindex="`+innerRowIndex+`" data-headingindex="`+tableHeadIndex+`">`+insertVal+`</textarea>`
          }


      

          $('#'+tableId+ ' .row').append(`
            <div class="col-md-4">
            <div class="form-group input-group-sm mb-3">
            <label>`+heading+`</label>
            `+fullElm+`
            </div>
            </div>
            `)



        }
        if(func=='file') {
          console.log(insertVal)
          // $('[for="fileUpload"]').text('Choose image...')
          let imageId = '', imageName = 'Choose image...'

          if(insertVal != '') {
            imageId = dataArry.data[topIndex][colIndex]
            imageName = dataArry.data[topIndex][colIndex+1]
          }

          $('#'+tableId+ ' .row').append(`
            <div class="col-md-12" style="display:flex; margin-bottom: 2rem;">
            <div class="listing-image-preview `+tableId+`"><img id="prevImg-`+tableId+`" src="`+insertVal+`"></div>

            <div class="img-section-arrange `+tableId+`">
            <div>

            <div class="form-group input-group-sm mb-3">
              <div class="custom-file">
                <input type="file" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" class="fileUpload custom-file-input dynamicElem elm-`+func+`" id="fileUpload-`+tableId+`" data-section="`+tableId+`" data-filedname="`+func+`" data-colindex="`+colIndex+`" data-rowindex="`+innerRowIndex+`" data-headingindex="`+tableHeadIndex+`" data-imageid="`+imageId+`" disabled="disabled">
                <label class="custom-file-label" for="fileUpload-`+tableId+`">`+imageName+`</label>
              </div>
            </div>

            <div class="imageControls" data-section="`+tableId+`">
            <button type="button" class="btn btn-primary btn-sm" data-method="zoom" data-option="0.1" title="Zoom In"><i class="ion-ios-search-strong"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="zoom" data-option="-0.1" title="Zoom In"><i class="ion-ios-search-strong"></i></button>

            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="-10" data-second-option="0" title="Move Left"><i class="ion-android-arrow-back"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="10" data-second-option="0" title="Move Right"><i class="ion-android-arrow-forward"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="0" data-second-option="-10" title="Move Up"><i class="ion-android-arrow-up"></i></button>
            <button type="button" class="btn btn-primary btn-sm" data-method="move" data-option="0" data-second-option="10" title="Move Down"><i class="ion-android-arrow-down"></i></button>

            <button type="button" class="btn btn-primary btn-sm" data-method="rotate" data-option="45" title="Rotate Left"><i class="ion-refresh"></i></button>
            <button type="button" class="btn btn-danger btn-sm remove-image"><i class="ion-trash-a"></i></button>
            </div>                

            </div>
            </div>
            </div>
            `)
        }



      });

  //end

    
     }

        
  })






  /*$.each(dataArry.data, function(ind, el) {

    
      getListVal = dataArry.data[ind]

      var getRowId = ''

      var readOnly = ''

      $('#detail-view').attr('data-action',action)
      if(typeof getListVal != 'undefined') {
        getRowId = getListVal[0]
      }
      $('#detail-save-btn').attr({'data-action':action, 'data-rowid':getRowId})
      
      if(action == 'create') {
        $('#detail-save-btn').parent().removeClass('d-none')
      }
      if(action == 'read') {
        readOnly='readonly'
        $('#detail-save-btn').parent().addClass('d-none')
        $('#detail-edit-btn').parent().removeClass('d-none')
      }
      if(action == 'edit') {
        $('#detail-edit-btn').parent().addClass('d-none')
        $('#detail-save-btn').parent().removeClass('d-none')
      }

      $('#detail-view .row').html('')

      // console.log('modal-headings==',headings)



    

  });*/







    }












}






export default Detail