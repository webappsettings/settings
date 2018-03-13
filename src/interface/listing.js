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
      <div id="listing-view">
        
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

      
      /*let deleteParamURL = new CodeComp().mainCode()+'&pageid='+paramId+'&id='+id+'&rowindex='+rowIndex+'&action=deleterow'

      $.getJSON(deleteParamURL, function(callback) {

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
      })*/

    }

    

    //Create New
    $(document).on('click', '#listing-create-btn', function() {
      elmentPushToModal('create')
    });



    function elmentPushToModal(action, rowId) {

      if(action == 'create') {
        $('#listing-modal .modal-title').text('Create New')
        imageURI = undefined
        fileName = ''
        $('#listing-okBtn').attr({'data-action':'create', 'data-rowid':''})
      } else {
        $('#listing-modal .modal-title').text('Edit')
        $('#listing-okBtn').attr({'data-action':'edit', 'data-rowid':rowId})
      }
  
      $('#listing-modal form').html('')

      var getListVal
      if(action=='edit') {
          var getListVal = getObjects(self.listDatas[0], 0, rowId)
          console.log(getListVal)
        }


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

        if((elm!='_') && (func!='count') && (func!='time') && (func!='file') && (func!='edit') && (func!='remove')) {
          $('#listing-modal form').append(`
            <div class="col-md-6">
                  <div class="form-group">
                    <label>`+elm+`</label>
                    <input type="text" class="form-control dynamicElem" placeholder="`+elm+`" value="`+insertVal+`" data-filedname="`+func+`" data-colindex="`+colIndex+`">
                  </div>
                </div>
            `)
          }
        if(func=='file') {
          $('#listing-modal form').append(`
            <div class="col-md-12">
              <div class="form-group">
                <label>Upload Image</label>
                <input type="file" class="dynamicElem elm-`+func+`" id="fileupload" data-filedname="`+func+`" data-colindex="`+colIndex+`">
              </div>
            </div>
          `)
        }
      })
      $('#listing-modal').modal('show')
    }



    $(document).on('change', '#fileupload', function(event) {
      var inputFiles = this.files;
      if(inputFiles == undefined || inputFiles.length == 0) return;
      var inputFile = inputFiles[0];
      var reader = new FileReader();
      fileChange = true
      fileName = $(this).val().replace(/.*[\/\\]/, '')
      reader.onload = function(event) {
        imageURI = event.target.result
      };
      reader.onerror = function(event) {
        alert("ERROR: " + event.target.error.code);
      };
      reader.readAsDataURL(inputFile);
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
      
      $('.modal.in:visible form .dynamicElem:not(#fileupload)').each(function(index, el) {
        var colindex = $(this).attr('data-colindex')
        var values = $(this).val()
        obj[colindex]=values
      });


      if(imageURI && fileChange){
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
         $('#listing-modal').modal('hide')
       });



    });

  }
}


const pushData = (data) => {
  var tableHeading = ``
  var lists = ``
  
  var headerValues
  $.each(data.result, function(index, elm) {
    // console.log('med=',elm)
    if(index == 0) {

      headerValues = elm
    } else {
      

      var listsInner = ``

      $.each(elm, function(index1, elm1) {
        var imgPath = `images/placeholder.png`
        var bgImg = `style="background-image:url(`+imgPath+`)"`

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
        if(func=='edit') {
          elm1 = `<a class="list-controls list-edit" data-rowindex="`+(index+1)+`" data-id="`+elm[0]+`">Edit</a>`
        }
        if(func=='remove') {
          elm1 = `<a class="list-controls list-remove" data-rowindex="`+(index+1)+`" data-id="`+elm[0]+`">Remove</a>`
        }
        if(func=='file') {
          if(elm1 != '') {
            imgPath = elm1
            bgImg = `style="background-image:url(`+imgPath+`)"`
          }
          elm1 = `<div class="img-thumb" `+bgImg+`><img src="`+imgPath+`" alt="" /></div>`
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
    $.each(headingVal, function(index, elm) {
      // if(index != 0) {
        var tElm,func = ``
        if(elm.charAt(0) == '_') {
          elm='_'
        } else if(elm.indexOf("(") >= 0){
          tElm = elm.split("(")
          elm = tElm[0]
          func = tElm[1].slice(0, -1);
        }
        if(elm != '_') {
          tableHeading += `<th data-func=`+func+`>`+elm+`</th>`
        }
      
    })
  }

  $('#listing-view').html(`
    <div class="pull-right"><button type="button" class="btn btn-primary" id="listing-create-btn">Create New</button></div>
    <div class="clearfix"></div>
    <table class="table table-responsive sortable-row">
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
}



export default Listing