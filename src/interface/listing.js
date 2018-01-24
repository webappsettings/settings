import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';
import GlobalArray from "components/globalArray";

class Listing {
  constructor(id){
    this.id = id
    this.googleListingURL = new CodeComp().mainCode()
    this.listDatas = []
  }
  render() {
    const tpl =  `
    <div class="container">
      <div id="listing-view">
        Listing
      </div>
    </div> 
    `
    return tpl
  }

  clickHandler() {
    let self = this
    // let paramURL = self.googleListingURL+'&action=read'
    let paramId = GlobalArray.globalArray.paramid

    let readlistParamURL = self.googleListingURL+'&pageid='+paramId+'&action=readpagedatas'

    $('.loader').fadeIn()
    $.getJSON(readlistParamURL, function(callback) {
      console.log('listAll',callback)
      if(callback) {
        self.listDatas.push(callback)
      } else {
        self.listDatas.push([])
      }
      pushData(self.listDatas[0])
      $('.loader').fadeOut()
    }) 
  }
}

$(document).off().on('click', '.list-controls', function(event) {
  let getId = $(this).attr('data-id')
  // $('body').attr('selectedid', getId)

  if($(this).hasClass('list-remove')) {
    removeThis(getId)
  }
  // if($(this).hasClass('list-edit')) {
  //   editThis(getId)
  // }
});


//Remove
function removeThis(id) {
  alert(id)
}


const pushData = (data) => {
  
  var lists = ''
  $.each(data.result, function(index, elm) {
    console.log(elm)
    lists += `<tr data-rowid="`+elm[1]+`">
          <td>`+(index+1)+`</td>
          <td>`+elm[0]+`</td>
          <td>`+elm[2]+`</td>
          <td>`+elm[3]+`</td>
          <td><div class="img-thumb" style="background-image:url(`+elm[4]+`)"></div></td>
          <td><a class="list-controls list-edit" data-id=`+elm[1]+`>Edit</a></td>
          <td><a class="list-controls list-remove" data-id=`+elm[1]+`>Remove</a></td>
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



export default Listing