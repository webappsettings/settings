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

      <div class="p-4 mb-5 bg-white rounded box-shadow">
        <div id="detail-view">
          <div class="row">
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

    console.log('detail=',readdetailParamURL)

    $('.loader').fadeIn()
    $.getJSON(readdetailParamURL, function(callback) {
      console.log(callback)


      if(callback.result != '{"result":false}') {
        if(callback.result[0] == 'pageremoved'){
          alert('This page removed!')
          new HashControls('dashboard').setHash()
        } else {
          
            headings = callback.result[0];
            console.log('callbackHeading===',headings)


            self.listDatas.push(callback)

            console.log('datas==',self.listDatas[0].result[1])
            
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

        pushData(self.listDatas[0], 'read')


      });




    

  }
}







/*function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}*/


const pushData = (data, action) => {


  // let fileName


  var headings = data.result[0]
  var getListVal = data.result[1]

  console.log('getListVal',getListVal)

  var readOnly = ''

      $('#detail-view').attr('data-mode',action)
      
      if(action == 'create') {
        // $('#listing-modal').addClass('createList').removeClass('editList').find('.modal-title').text('Add Details')
        // fileName = ''
        $('#detail-save-btn').parent().removeClass('d-none')
        // $('#listing-okBtn').attr({'data-action':'create', 'data-rowid':''})
      }
      if(action == 'read') {
          readOnly='readonly'
           $('#detail-save-btn').parent().addClass('d-none')
          $('#detail-edit-btn').parent().removeClass('d-none')
        // $('#listing-modal').removeClass('createList').addClass('editList').find('.modal-title').text('Edit')
        // $('#listing-okBtn').attr({'data-action':'edit', 'data-rowid':rowId})
      }
      if(action == 'edit') {
        $('#detail-edit-btn').parent().addClass('d-none')
        $('#detail-save-btn').parent().removeClass('d-none')
      }

      // $('#listing-modal form .row').html('')
      $('#detail-view .row').html('')

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

        if(typeof getListVal != 'undefined') {
          insertVal = getListVal[index]
        }
        



        let ignoreFields = ['count','time','updatedtime','file','edit','remove','subdetails'];

        if((elm!='_') && ignoreFields.indexOf(func) == -1) {
          
          var typeElm = ``, fullElm
          if(func.indexOf("[") >= 0) {
            typeElm = func.split("[")[1].slice(0, -1)
          }
          console.log('func==',typeElm)

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






  var allDiv = ``
  var headerValues
  var row

  // var cnt = 1
  var setName




  // $.each(data.result, function(index, elm) {

  //   if(index == 0) {
  //     headerValues = elm
  //   } else {

  //     row = ``

      
  //     $.each(elm, function(index1, elm1) {
  //       /*var imgPath = `images/placeholder.png`
  //       var imgView = `<img src="`+imgPath+`" alt="" />`
  //       var updatedTimeVal = `-`*/
  //       var innerDiv = ``
  //       var func = headerValues[index1]
  //       console.log(func)
  //       if(func.charAt(0) == '_') {
  //         func='_'
  //       } else if(func.indexOf("(") >= 0) {
  //         setName = func.split("(")[0]
  //         func = func.split("(")[1].slice(0, -1)
  //       }

  //       if(func != '_') {

  //         if(elm1 != '') {
            
  //           if(func!='address') {
  //             elm1 = `<label>`+setName+`</label>
  //               <input type="text" class="form-control" readonly placeholder="`+setName+`" value="`+elm1+`">`
  //           } 
  //           else {
  //             elm1 = `<label>`+setName+`</label>
  //               <textarea class="form-control" rows="3" readonly placeholder="`+setName+`">`+elm1+`</textarea>`
  //           }

  //           row += `<div class="col-md-4 mb-3">`+elm1+`</div>`

  //           /*innerDiv += `<div class="col-md-4 mb-3">`+elm1+`</div>`
  //           if(cnt % 2 != 0) {
  //             row += `<div class="row">`+innerDiv
  //           } else {
  //             if(cnt == 1) {
  //               row += innerDiv
  //             } else {
  //               row += innerDiv+`</div>`
  //             }
  //           }
  //           cnt++*/
  //         }

  //       }

  //     });

  //   }
    
  // });

  /*if(cnt % 2 == 0) {
    row += `</div>`
  }*/


  // if(typeof row == 'undefined') {
  //   row = `<p class="mb-0 w-100 text-center">No Records Found</p>`
  //   // $('#detail-create-btn').trigger('click')
  // }

  // allDiv += `<div class="form-row">
  // `+row+` 
  // </div>`



  // $('#detail-view').html(allDiv)


}






export default Detail