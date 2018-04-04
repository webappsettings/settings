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

      <div class="float-right"><button type="button" class="btn btn-light btn-sm mb-4" id="detail-create-btn" data-toggle="modal" data-target="#listing-modal">Create New</button></div>
      
      <div class="clearfix"></div>

      <div class="p-3 mb-5 bg-white rounded box-shadow">
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
            pushData(self.listDatas[0])
            
        }
      } else {
        new CookieControls().deleteCookie()//Logout
      }



      $('.loader').fadeOut()
    }) 


    //Create New
    $(document).on('click', '#detail-create-btn', function() {
      elmentPushToModal('create')
    });


    function elmentPushToModal(action, rowId) {
      if(action == 'create') {
        $('#listing-modal').addClass('createList').removeClass('editList').find('.modal-title').text('Create New')
        fileName = ''
        $('#listing-okBtn').attr({'data-action':'create', 'data-rowid':''})
      } else {
        $('#listing-modal').removeClass('createList').addClass('editList').find('.modal-title').text('Edit')
        $('#listing-okBtn').attr({'data-action':'edit', 'data-rowid':rowId})
      }

      $('#listing-modal form .row').html('')

      console.log('modal-headings==',headings)
    }
    

  }
}







/*function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}*/


const pushData = (data) => {


  var allDiv = ``
  var headerValues
  var row

  // var cnt = 1
  var setName




  $.each(data.result, function(index, elm) {

    if(index == 0) {
      headerValues = elm
    } else {

      row = ``

      
      $.each(elm, function(index1, elm1) {
        /*var imgPath = `images/placeholder.png`
        var imgView = `<img src="`+imgPath+`" alt="" />`
        var updatedTimeVal = `-`*/
        var innerDiv = ``
        var func = headerValues[index1]
        console.log(func)
        if(func.charAt(0) == '_') {
          func='_'
        } else if(func.indexOf("(") >= 0) {
          setName = func.split("(")[0]
          func = func.split("(")[1].slice(0, -1)
        }

        if(func != '_') {

          if(elm1 != '') {
            
            if(func!='address') {
              elm1 = `<label>`+setName+`</label>
                <input type="text" class="form-control" readonly placeholder="`+setName+`" value="`+elm1+`">`
            } 
            else {
              elm1 = `<label>`+setName+`</label>
                <textarea class="form-control" rows="3" readonly placeholder="`+setName+`">`+elm1+`</textarea>`
            }

            row += `<div class="col-md-4 mb-3">`+elm1+`</div>`

            /*innerDiv += `<div class="col-md-4 mb-3">`+elm1+`</div>`
            if(cnt % 2 != 0) {
              row += `<div class="row">`+innerDiv
            } else {
              if(cnt == 1) {
                row += innerDiv
              } else {
                row += innerDiv+`</div>`
              }
            }
            cnt++*/
          }

        }

      });

    }
    
  });

  /*if(cnt % 2 == 0) {
    row += `</div>`
  }*/


  if(typeof row == 'undefined') {
    row = `<p class="mb-0 w-100 text-center">No Records Found</p>`
  }

  allDiv += `<div class="form-row">
  `+row+` 
  </div>`



  $('#detail-view').html(allDiv)


}






export default Detail