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
    var imageURI, fileName, fileChange = false
    let self = this
    // let paramURL = self.googleListingURL+'&action=read'
    let paramId = GlobalArray.globalArray.paramid
    let paramName = GlobalArray.globalArray.paramname
    $('.breadcrumb-item.active').html('Listing: '+paramName)

    let readlistParamURL = new CodeComp().mainCode()+'&pageid='+paramId+'&action=readpagedatas'


    console.log('listingURL=', JSON.stringify(readlistParamURL))

    $('.loader').fadeIn()
    $.getJSON(readlistParamURL, function(callback) {

      console.log('listAll',callback)
      

      if(callback.result != '{"result":false}') {
        if(callback.result[0] == 'pageremoved'){
          alert('This page removed!')
          new HashControls('dashboard').setHash()
        } else {
            self.listDatas.push(callback)
            pushData(self.listDatas[0])
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
  

    $(document).off().on('click', '.list-controls', function(event) {
      let getId = $(this).attr('data-id')
      let mediaId = $(this).attr('data-mediaid')
      let paramId = GlobalArray.globalArray.paramid
      // $('body').attr('selectedid', getId)

      if($(this).hasClass('list-remove')) {

        removeThis(paramId, getId, mediaId)
      }
      if($(this).hasClass('list-edit')) {
        editThis(getId)
      }
    });


    //Remove
    function removeThis(paramId, id, mediaId) {

      let deleteParamURL = new CodeComp().mainCode()+'&pageid='+paramId+'&id='+id+'&mediaid='+mediaId+'&action=deleterow'
      $.getJSON(deleteParamURL, function(callback) {

        let output = JSON.parse(callback.result)
        console.log('deleted=', output)
        if(output.result) {
          if(output.result != 'pageremoved') {
            self.listDatas[0].result = jQuery.grep(self.listDatas[0].result, function( elm, index ) {
              return elm[1] != id         
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
    }

    //Edit
    function editThis(getId) {
      let getListVal = getObjects(self.listDatas[0], 1, getId)

      $('#listing-modal .modal-title').text('Edit')
      $('#listing-modal #listing-name').val(getListVal[0][2])
      $('#listing-modal #listing-userid').val(getListVal[0][3])
      $('#listing-modal #listing-imageupload').val('')
      imageURI = getListVal[0][6]
      // imageURI = undefined
      fileName = ''
      $('#listing-okBtn').attr({'data-action':'edit', 'data-rowid':getId})
      $('#listing-modal').modal('show')
    }


    //Create New
    $(document).on('click', '#listing-create-btn', function() {
      $('#listing-modal .modal-title').text('Create New')
      $('#listing-modal #listing-name').val('')
      $('#listing-modal #listing-userid').val('')
      $('#listing-modal #listing-imageupload').val('')
      imageURI = undefined
      fileName = ''
      $('#listing-okBtn').attr({'data-action':'create', 'data-rowid':''})
      $('#listing-modal').modal('show')
    });



    $("#listing-imageupload").on('change', function(event) {
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




    $(document).on('click', '#listing-okBtn', function() {
      let paramId = GlobalArray.globalArray.paramid
      let getName = $('#listing-modal #listing-name').val()
      let getUserId = $('#listing-modal #listing-userid').val()

      let action = $(this).attr('data-action')

      var formdata = new FormData()
      
      if(action == 'create') {
        var timestamp = new Date()
        var rowId = timestamp.toISOString().replace(/\D/g,"").substr(0,14)
        formdata.append('action', 'create')
      } else {
        var rowId = $(this).attr('data-rowid')
        formdata.append('action', 'edit')
      }
     

      formdata.append('pageid', paramId)
      formdata.append('id', rowId)
      formdata.append('name', getName)
      formdata.append('userid', getUserId)

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

      // formdata.append('group', 'secondary')

      // var dataAddURL = self.googleListingURL;

      var dataAddURL = new CodeComp().mainCode()

      // console.log('formdata=',formdata)

      for (var pair of formdata.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }

      $.ajax({
         method: 'POST',
         url: dataAddURL,
         data: formdata,
         dataType: 'json',
         contentType: false,
         processData: false,
         beforeSend: function(){
            $('.loader').fadeIn()
          }
        })
        .done(function(callback){
          // console.log('created==',callback)
          var outputDatas = JSON.parse(callback.result)
          console.log(outputDatas.result)
          if(outputDatas.result) {
            fileChange = false
            if(action == 'create') {
              self.listDatas[0].result.unshift(outputDatas.result)
            } else {
              
              console.log('editOriginal=',outputDatas.result)

              $.each(self.listDatas[0].result, function(index, elm) {
                if(elm[1] == outputDatas.result[1]) {
                  self.listDatas[0].result[index] = outputDatas.result
                  // console.log()
                }
              });
              console.log('editOut=',self.listDatas[0].result)
            }
            
            pushData(self.listDatas[0])
          } else {
            new CookieControls().deleteCookie()//Logout
          }
        })
        .fail(function(callback) {
          // console.clear()
          console.log('Fail',callback)
          alert('This page removed!')
          // new HashControls('dashboard').setHash()
       })
       .always(function(){
         $('.loader').fadeOut()
         $('#listing-modal').modal('hide')
       });

    });

  }
}


const pushData = (data) => {
  
  var lists = ''
  $.each(data.result, function(index, elm) {
    // console.log('med=',elm)
    var imgPath = `images/placeholder.png`
    var bgImg = `style="background-image:url(`+imgPath+`)"`

    if(elm[6]) {
      imgPath = elm[6]
      bgImg = `style="background-image:url(`+elm[6]+`)"`
    }
    lists += `<tr data-rowid="`+elm[1]+`">
          <td>`+(index+1)+`</td>
          <td>`+elm[0]+`</td>
          <td>`+elm[2]+`</td>
          <td>`+elm[3]+`</td>
          <td><div class="img-thumb" `+bgImg+`><img src="`+imgPath+`" alt="" /></div></td>
          <td><a class="list-controls list-edit" data-id=`+elm[1]+`>Edit</a></td>
          <td><a class="list-controls list-remove" data-id=`+elm[1]+` data-mediaid=`+elm[4]+`>Remove</a></td>
        </tr>`
  });

  $('#listing-view').html(`
    <div class="pull-right"><button type="button" class="btn btn-primary" id="listing-create-btn">Create New</button></div>
    <div class="clearfix"></div>
    <table class="table table-responsive sortable-row">
      <thead>
        <tr>
          <th>#</th>
          <th>Time</th>
          <th>Name</th>
          <th>User ID</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        `+lists+`            
      </tbody>
    </table>
  `)
}



export default Listing