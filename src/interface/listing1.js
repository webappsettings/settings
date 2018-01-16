import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';

class Listing1 {
  constructor(id){
    this.id = id
    this.googleListingURL = new CodeComp().mainCode()
    this.listDatas = []
    // this.imageURI = []
  }
  render() {
    const tpl =  `
    <div class="container" id="listing-view">
      Listing 1
    </div> 
    `
    return tpl
  }

  clickHandler() {
    var imageURI, fileName
    let self = this
    let paramURL = self.googleListingURL+'&action=read'
    console.log(paramURL)
    $('.loader').fadeIn()


    $.getJSON(paramURL, function(callback) {
      console.log(callback)
      if(callback) {
        self.listDatas.push(callback)
      } else {
        self.listDatas.push([])
      }
      pushData(self.listDatas[0])
      $('.loader').fadeOut()
    })

    $(document).off().on('click', '.list-controls', function(event) {

      let getId = $(this).attr('data-id')
      $('body').attr('selectedid', getId)

      if($(this).hasClass('list-remove')) {
        removeThis(getId)
      }
      if($(this).hasClass('list-edit')) {
        editThis(getId)
      }
    });

    //Remove
    function removeThis(id) {
      $('.loader').fadeIn()
      let deleteAction = self.googleListingURL+'&id='+id+'&action=delete'
      $.get(deleteAction, function(callback) {
        var localSecureId = new CookieControls().getCookie('localSecureId')
        // console.log(JSON.parse(callback.split(localSecureId)[1]).result)
        alert(JSON.parse(callback.split(localSecureId)[1]).result)
        if(JSON.parse(callback.split(localSecureId)[1]).result) {
          $('.loader').fadeOut()
          self.listDatas[0] = jQuery.grep(self.listDatas[0], function( a ) {
            return a.ID != id;
          })
          pushData(self.listDatas[0])
          // $('[data-id="'+id+'"]').closest('tr').remove()
        }        
      })
    }

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

    function editThis(id) {
      
      var getThisArray = getObjects(self.listDatas[0], 'ID', id)

      console.log(self.listDatas[0])

      $('#listing-modal .modal-title').text('Edit')

      $('#listing-modal #listing-name').val(getThisArray[0].NAME)
      $('#listing-modal #listing-userid').val(getThisArray[0].USER_ID)
      $('#listing-modal').modal('show')
    }

    

    $("#listing-imageupload").on('change', function(event) {
        
        var inputFiles = this.files;
        if(inputFiles == undefined || inputFiles.length == 0) return;
        var inputFile = inputFiles[0];

        var reader = new FileReader();

        fileName = $(this).val().replace(/.*[\/\\]/, '')

        reader.onload = function(event) {
          // console.log(event)
          imageURI = event.target.result

          // self.imageURI.push(event.target.result)
          // console.log(self.imageURI)

        };
        reader.onerror = function(event) {
            alert("ERROR: " + event.target.error.code);
        };

        reader.readAsDataURL(inputFile);

    });

    //Update
    $(document).on('click', '#listing-okBtn', function() {

        let id = $('body').attr('selectedid')


        let getName = $('#listing-modal #listing-name').val()
        let getUserId = $('#listing-modal #listing-userid').val()

        
        var updateAction, newId
        var timestamp = new Date();


        /*var file, 
          reader = new FileReader();*/

          


        if(id == 'new') {

          if(imageURI) {

            // with image

           
            
            var url = self.googleListingURL;

            // postJump()


            var formdata = new FormData();

            // console.log();

            

            // console.log(imageURI.substr(imageURI.indexOf('base64,')+7));

            var filetype = imageURI.substring(5,imageURI.indexOf(';'));

            var img = imageURI.replace(/^.*,/, '');


            newId = timestamp.toISOString().replace(/\D/g,"").substr(0,14)

            // updateAction = self.googleListingURL+'&id='+newId+'&name='+getName+'&userid='+getUserId+'+&action=insert'

            // var localSecureId = new CookieControls().getCookie('localSecureId')

            // formdata.append('localcode', localSecureId);
            formdata.append('action', 'insert');
            formdata.append('id', newId);
            formdata.append('name', getName);
            formdata.append('userid', getUserId);

            formdata.append('group', 'secondary');

            formdata.append('file', img);
            formdata.append('filename', fileName);
            formdata.append('filetype', filetype);
            formdata.append('foldername', 'listing');


            $.ajax({
             method: 'POST',
             url: url,
             data: formdata,
             dataType: 'json',
             contentType: false,
             processData: false,
             beforeSend: function(){
                $('.loader').fadeIn()
              }
            })
            .done(function(d){
              
              // var fileUrl = d.result.match("d/(.*)/view")[1];

               // fileUrl = d.result.substring(d.result.lastIndexOf("d/")+2,d.result.lastIndexOf("/view"));

              // var fileUrl = 'https://drive.google.com/uc?export=view&id='+d.result
              console.log(d)

              var outputDatas = JSON.parse(d.result)
              if(outputDatas.result) {
                var setData = {
                  'TIME_STAMP':outputDatas.currentTime,
                  'ID':outputDatas.id,
                  'NAME':outputDatas.name,
                  'USER_ID':outputDatas.userId,
                  'IMAGE_PATH':outputDatas.imagePath
                }

                console.log('self.listDatas',self.listDatas)

                self.listDatas[0].push(setData)


                pushData(self.listDatas[0])
                $('#listing-modal').modal('hide')
                // $('body').css({'background-image': 'url('+'https://drive.google.com/uc?export=view&id='+imgUrl+')', 'background-repeat': 'no-repeat'})
              }
            })
            .fail(function(d) {
             console.log('fail')
           })
           .always(function(){
             $('.loader').fadeOut()
           });

          
        } else {
          alert('Please add an image')
        }

        } else {
          updateAction = self.googleListingURL+'&id='+id+'&name='+getName+'&userid='+getUserId+'+&action=update'
        }
        
        /*$.get(updateAction, function(callback) {
          var localSecureId = new CookieControls().getCookie('localSecureId')

          console.log(callback)
          if(JSON.parse(callback.split(localSecureId)[1]).result) {
            $('.loader').fadeOut()
            
            if(id == 'new') {
              let getTime = JSON.parse(callback.split(localSecureId)[1]).currentTime
              let getImgSrc = JSON.parse(callback.split(localSecureId)[1]).imgSrc

              let imgCode = getImgSrc.match("d/(.*)/view")[1]

               $('body').css({'background-image': 'url(https://drive.google.com/uc?export=view&id='+imgCode+')', 'background-repeat': 'no-repeat'})
              console.log(imgCode)

              let newRow = {TIME_STAMP: getTime, ID: newId, NAME: getName, USER_ID: getUserId}
              self.listDatas[0].push(newRow)
            } else {
              self.listDatas[0] = jQuery.grep(self.listDatas[0], function( a ) {
                 if(a.ID == id) {
                  a.NAME = getName
                  a.USER_ID = getUserId
                 }
                 return a
              })
            }


            console.log(self.listDatas[0])
            pushData(self.listDatas[0])
            $('#listing-modal').modal('hide')
            
          }        
        })*/
      });

    //Create New
    $(document).on('click', '#listing-create-btn', function() {
      $('#listing-modal .modal-title').text('Create New')
      $('#listing-modal #listing-name').val('')
      $('#listing-modal #listing-userid').val('')
      $('#listing-modal').modal('show')
      
      $('body').attr('selectedid', 'new')
    });
    

  }

}



const pushData = (data) => {
  console.log(data)
  var lists = ''
  $.each(data, function(index, elm) {
    lists += `<tr data-rowid="`+elm.ID+`">
          <td>`+(index+1)+`</td>
          <td>`+elm.TIME_STAMP+`</td>
          <td>`+elm.NAME+`</td>
          <td>`+elm.USER_ID+`</td>
          <td><div class="img-thumb" style="background-image:url(`+elm.IMAGE_PATH+`)"></div></td>
          <td><a class="list-controls list-edit" data-id=`+elm.ID+`>Edit</a></td>
          <td><a class="list-controls list-remove" data-id=`+elm.ID+`>Remove</a></td>
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
        </tr>
      </thead>
      <tbody>
        `+lists+`            
      </tbody>
    </table>
  `)
}



export default Listing1