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
        
        <div class="p-4 mb-3 bg-white rounded box-shadow detail-sections">
          <div id="detail-view">
            <form id="detail-view-create-form">
              <div class="float-right d-none"><button type="button" class="btn btn-outline-secondary btn-sm" id="detail-edit-btn">Edit Details</button></div>
              <div class="float-right d-none"><button type="button" class="btn btn-outline-secondary btn-sm" id="detail-save-btn">Save Details</button></div>
              <div class="row">
              </div>
            </form>
          </div>
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
              pushData(self.listDatas[0], 'create')
              // elmentPushToModal('create')
            } else {
              pushData(self.listDatas[0], 'read')
              var subDetailAvail = self.listDatas[0].result[2]
              console.log('all_DATAS=',subDetailAvail)
              if(subDetailAvail) {
                pushSubData(self.listDatas[0], 'read')
              }
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
            $('[for="fileUpload"]').text(fileName)
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
            $('[for="fileUpload"]').text('Choose image...')
            fileChange = false
            imageURI = undefined
            $('#previewImage').attr('src','')
            $('.imageControls').hide()
        }
        
      });


      $(document).on('click', '#detail-edit-btn', function() {
        pushData(self.listDatas[0], 'edit')
      });

      $(document).on('click', '.subdetailedit', function() {
        // pushData(self.listDatas[0], 'edit')
        let subId = $(this).attr('data-subid')
        $('#'+subId+' .subDynamicElem').prop('contenteditable', true)
        $(this).addClass('d-none')
        $('.subdetailsave[data-subid="'+subId+'"]').removeClass('d-none')
      });

      $(document).on('click', '.subdetailsave', function() {
        let subId = $(this).attr('data-subid')
        $('#'+subId+' .subDynamicElem').prop('contenteditable', false)
        $(this).addClass('d-none')
        $('.subdetailedit[data-subid="'+subId+'"]').removeClass('d-none')
      });


      $(document).on('click', '#detail-save-btn', function() {

        // $(this).prop('disabled',true)

        var formdata = new FormData()

        formdata.append('pagename', urlHash)

        let paramId = GlobalArray.globalArray.paramid
        formdata.append('pageid', paramId)

        let action = $(this).attr('data-action')
        formdata.append('action', action)

        if(action == 'create') {
          var timestamp = new Date()
          var rowId = timestamp.toISOString().replace(/\D/g,"").substr(0,14)
        } else {
          var rowId = $(this).attr('data-rowid')
        }


        var dataRow = []
        var obj = {}
        dataRow.push(obj)
        obj[1]=rowId

        $('#detail-view form .row .dynamicElem:not(#fileUpload)').each(function(index, el) {
          var colindex = $(this).attr('data-colindex')
          var values = $(this).val()
          obj[colindex]=values
        });


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
        

        dataRow = JSON.stringify(dataRow)
        formdata.append('coldatas', dataRow)

        /*for (var pair of formdata.entries()) {
          console.log(pair[0]+ '= ' + pair[1]); 
        }
        */

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
                /*if(action == 'create') {
                  self.listDatas[0].result.splice(1, 0, output.result);
                } else {
                  self.listDatas[0].result[rowIndex-1] = output.result
                }*/

                /*console.log('oldData==', self.listDatas[0])

                console.log('newData==', output.result)*/

                self.listDatas[0].result[1] = output.result
                pushData(self.listDatas[0],'read')

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
       });


        // alert(action)


        // pushData(self.listDatas[0], 'read')


      });    

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

    if(ind == 1) {
      multipleSection = false
      getListVal = data.result[ind]

      var getRowId = ''

      // console.log('getListVal',getListVal)

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
    }

  });

}



var innerRowIndex = 2

const pushSubData = (data, action) => {

  var globalElm, dataRow, elmHead, dataArry = [], dataOnly = []

  for(var i=2; i<data.result.length; i++) {
    dataRow = true

    if(data.result[i][0].indexOf('table') != -1) {
      globalElm = 'table'
      addToArray()
    }
    if(data.result[i][0].indexOf('detail') != -1) {
      globalElm = 'detail'
      addToArray()
    }

    function addToArray() {
      dataRow = false
      elmHead = 0

      if(!$.isEmptyObject(dataArry)) {
        runSubSections(dataArry)
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

  runSubSections(dataArry)
}



function runSubSections(dataArry) {

  console.log('finalDataArry==', dataArry)

  if(dataArry.type == 'table') {
    var tableId = dataArry.mainHead[0]
    var caption = dataArry.mainHead[2]
        
    if(dataArry.mainHead[1] == '--') {
      $('#details-all').append(`
        <div class="p-4 mb-3 bg-white rounded box-shadow detail-sections subdetail-section">
          <div class="float-right">
            <button type="button" class="btn btn-outline-secondary btn-sm subdetailedit" data-subid="`+tableId+`"><i class="ion-edit"></i> Edit</button>
            <button type="button" class="btn btn-secondary btn-sm subdetailsave d-none" data-subid="`+tableId+`"><i class="ion-checkmark"></i> Save</button>
          </div>
          <div id="`+tableId+`">
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
        <div class="float-right">
          <button type="button" class="btn btn-outline-secondary btn-sm subdetailedit" data-subid="`+tableId+`"><i class="ion-edit"></i> Edit</button>
          <button type="button" class="btn btn-secondary btn-sm subdetailsave d-none" data-subid="`+tableId+`"><i class="ion-checkmark"></i> Save</button>
        </div>
        `
      }
      $('#details-all .detail-sections:last-of-type').append(hr+`
        <div class="subdetail-section">
          <div id="`+tableId+`">
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
    var getIndex = []
    var headingVal
    var listsInner


    let ignoreFields = ['count','edit','remove'];


    var lists = ``,headerValues

    $.each(dataArry.data, function(index, elm) {

      if(index == 0) {

        headerValues = $.map(elm, function (el) {
          return el !== '' ? el : null;
        })

        console.log(headerValues)

        generateHeading(headerValues)

        headerValues = elm

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
              cntrlBtns = `<button class="btn btn-sm btn-outline-primary list-controls list-edit ion-edit" data-rowindex="`+(index+1)+`" data-id="`+tableId+`"></button>`
            }
            if(func=='remove') {
              cntrlBtns = `<button class="btn btn-sm btn-outline-danger list-controls list-remove ion-trash-a" data-rowindex="`+(index+1)+`" data-id="`+tableId+`"></button>`
            }


            if(func=='count') {
              // elm1 = index
              listsInner += `<td>`+index+`</td>`
            }

            if(func != '_' && func!='count' && cntrlBtns == ``) {
              // listsInner += `<td>`+elm1+`</td>`
              // listsInner += `<td><textarea type="text" class="form-control" readonly="readonly" value="`+elm1+`">`+elm1+`</textarea></td>`
              listsInner += `<td data-colindex="`+innerColIndex+`"><div contenteditable="false" class="subDynamicElem">`+elm1+`</div></td>`
            }

            if(func != '_' && func!='count' && cntrlBtns != ``) {
              listsInner += `<td>`+cntrlBtns+`</td>`
            }

          } else {
            return false
          }
        })

        innerRowIndex++

        lists += `<tr data-rowindex="`+innerRowIndex+`">`+listsInner+`</tr>`
        
      } 


      
    })


    function generateHeading(headingVal) {
    
      var pos = 0

      let ignoreFields = ['file','edit','remove'];

      innerRowIndex++
      
      $.each(headingVal, function(index, elm) {
              
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


    $('#'+tableId+' table').html(`
      <thead>
        <tr>
          `+tableHeading+`
        </tr>
      </thead>
      <tbody>
        `+lists+`            
      </tbody>
  `)

  }












}






export default Detail