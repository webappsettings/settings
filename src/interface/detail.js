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

      <div class="float-right d-none"><button type="button" class="btn btn-light btn-sm mb-4" id="detail-edit-btn">Edit Details</button></div>
      <div class="float-right d-none"><button type="button" class="btn btn-light btn-sm mb-4" id="detail-save-btn">Save Details</button></div>

      <div class="clearfix"></div>
      
      
      <div id="details-all" class="mb-5">
        
        <div class="p-4 mb-3 bg-white rounded box-shadow detail-sections">
          <div id="detail-view">
            <form id="detail-view-create-form">
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
            }
            
            
        }
      } else {
        new CookieControls().deleteCookie()//Logout
      }



      $('.loader').fadeOut()
    }) 


    //Create New
    /*$(document).on('click', '#detail-create-btn', function() {
      elmentPushToModal('create')
    });*/




    /*function elmentPushToModal(action, rowId) {

      var getListVal

      
      if(action == 'create') {
        $('#listing-modal').addClass('createList').removeClass('editList').find('.modal-title').text('Add Details')
        fileName = ''
        $('#listing-okBtn').attr({'data-action':'create', 'data-rowid':''})
      } else {
        $('#listing-modal').removeClass('createList').addClass('editList').find('.modal-title').text('Edit')
        $('#listing-okBtn').attr({'data-action':'edit', 'data-rowid':rowId})
      }

      $('#listing-modal form .row').html('')

      console.log('modal-headings==',headings)

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



        let ignoreFields = ['count','time','updatedtime','file','edit','remove','subdetails'];

        if((elm!='_') && ignoreFields.indexOf(func) == -1) {
          $('#detail-view').append(`
            <div class="col-md-6">
            <div class="form-group input-group-sm mb-3">
            <label>`+elm+`</label>
            <input type="text" class="form-control dynamicElem" placeholder="`+elm+`" value="`+insertVal+`" data-filedname="`+func+`" data-colindex="`+colIndex+`">
            </div>
            </div>
            `)
        }
        if(func=='file') {
          $('#detail-view').append(`
            <div class="col-md-12" style="display:flex; margin-bottom: 2rem;">
              <div class="listing-image-preview"><img id="previewImage"></div>
              
              <div class="img-section-arrange">
                <div>

                  <div class="form-group input-group-sm mb-3">
                    <div class="custom-file">
                    <input type="file" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" class="custom-file-input dynamicElem elm-`+func+`" id="fileUpload" data-filedname="`+func+`" data-colindex="`+colIndex+`">
                    <label class="custom-file-label" for="fileUpload">Choose image...</label>
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


    }*/



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


if(multipleSection) {
  var globalElm, dataRow, elmHead, dataArry = [], dataOnly = []
  // var elmType,elmId/*,availTypes = ['table','detail']*/
  // console.log(getListVal)

  for(var i=2; i<data.result.length; i++) {
    // console.log()
    dataRow = true
    if(data.result[i][0].indexOf('table') != -1) {
      dataRow = false
      elmHead = 0
      globalElm = 'table'

      if(!$.isEmptyObject(dataArry)) {
        runSubSections(dataArry)
      }

      dataOnly = []
      dataArry = []

      dataArry.type = globalElm
      dataArry.mainHead = data.result[i]
          
    
    }


    if(data.result[i][0].indexOf('detail') != -1) {
      dataRow = false
      elmHead = 0
      globalElm = 'detail'


      if(dataArry) {
        runSubSections(dataArry)
      }
      dataOnly = []
      dataArry = []


      dataArry.type = globalElm
      dataArry.mainHead = data.result[i]


      // console.log('detailHead=',data.result[i])
      // console.log('detailId',data.result[i][0])
    }


    if(dataRow && globalElm=='table' || dataRow && globalElm=='detail') {



      // console.log('Table data==',data.result[i])
      dataOnly.push(data.result[i])
      dataArry['data']=dataOnly
      // var tableTitle = data.result[i]
      // console.log('tableTitle==',tableTitle)
      /*var td
      $.each(data.result[i], function(index, el) {
        // console.log()
        if(elmHead == 0) {
          td += `<th>`+el+`</th>`
          elmHead ++
        } else {
          td += `<td>`+el+`</td>`
        }
      });
      
      tr += `<tr>`+td+`</tr>`
      
      console.log('tableDatas=',data.result[i])*/
    }


  }

  runSubSections(dataArry)

  // console.log(dataArry)



/*  $.each(data.result, function(index, el) {

    if(index>=2) {

      getListVal = data.result[index]

     
      $.each(availTypes,function(i, type) {
        if(el[0].indexOf(type+'-') != -1) {
          elmType = type
          elmId = el[0]
        }
      });

      singleElm = ``

      $.each(getListVal, function(ix, dt) {
          
        if(getListVal[ix] != "") {

          if(elmType == 'table') {

            if(globalElm != 'table') {
              globalElm = 'table'
            }

            if(globalElm == 'table') {
              singleElm += `<td>`+dt+`</td>`
            }

          }

        } else {
          return false 
        }

      });

      fullElm += `<tr>`+singleElm+`</tr>`
      
    }

  });*/



  // console.log(fullElm)

}


function runSubSections(dataArry) {
  console.log('finalDataArry==', dataArry)

  if(dataArry.type == 'table') {
    var tableId = dataArry.mainHead[0]
    var caption = dataArry.mainHead[2]
        
    if(dataArry.mainHead[1] == '--') {
      $('#details-all').append(`
        <div class="p-4 mb-3 bg-white rounded box-shadow detail-sections">
          <div id="`+tableId+`">
          </div>
        </div>
      `)
    }
    if(dataArry.mainHead[1] == '-') {
      $('#details-all .detail-sections:last-of-type').append(`
        <hr>
        <div id="`+tableId+`">
        </div>
      `)
    }
    $('#'+tableId).append(`
      <h6>`+caption+`</h6>
      <table class="table"></table>
    `)


    let ignoreFields = ['count','time','updatedtime','file','edit','remove','subdetails'];

    $.each(dataArry.data, function(index1, elm1) {
        var tr = ``
        $.each(elm1, function(index2, elm2) {

          if(elm2!='') {
            if((elm2!='_') && ignoreFields.indexOf(elm2) == -1) {
              tr += `<td>`+elm2+`</td>`
            }
          } else {
            return false
          }

        })

      $('#'+tableId+' table').append(`<tr>`+tr+`</tr>`)
    })

  }





}


}






export default Detail