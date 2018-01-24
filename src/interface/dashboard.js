import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';
import HashControls from 'components/hashControls';


import GlobalArray from "components/globalArray";

class Dashboard {
  constructor(id){
    this.id = id
    this.googleListingURL = new CodeComp().mainCode()
    this.dashboardDatas = []
  }
  render() {
    const tpl =  `
    <div class="container">
      <div id="dashboard-view">
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-body">
              <a href="#listing">Listing</a>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary" type="button" id="create-new-dashboard">Create New</button>
    </div>
    `
    return tpl
  }

  clickHandler() {
    let self = this

    let urlHash = new HashControls().getHash()

    let readmodulesParamURL = self.googleListingURL+'&pageid='+urlHash+'&action=readpagedatas'

    $.getJSON(readmodulesParamURL, function(callback) {
      console.log('all=',callback)
      $.each(callback.result, function(index, elm) {
        // var obj = {}
        createModules(elm)
        // console.log(elm[2])
      }); 
    })   



    function createModules(elm) {
      $('#dashboard-view').append(`
          <div class="col-md-4">
            <div class="panel panel-default">
              <i class="ion-close dashboard-remove-btn" data-id="`+elm[1]+`"></i>
              <div class="panel-body">
                <a href="#`+elm[3]+'?id='+elm[1]+`" data-type="`+elm[3]+`">`+elm[2]+`</a>
              </div>
            </div>
          </div>
        `)
      }

    /*const dashboardView = (data) => {
      var lists = ''
    }*/

    $(document).on('click', '.dashboard-remove-btn', function(event) {
      var _this = $(this)
      let getId = $(this).attr('data-id')
      let paramURL = self.googleListingURL+'&moduleid='+getId+'&action=removemodule'
      $.getJSON(paramURL, function(callback) {
        let output = JSON.parse(callback.result)
        console.log(output)
        if(output.result) {
          _this.closest('.col-md-4').remove();
        }
      }); 
    });

    $(document).on('click', '#create-new-dashboard', function(event) {
      $('#dashboard-create-modal').modal('show')
    });

    $(document).on('click', '#dashboard-create-okBtn', function(event) {
      let moduleName = $('#dashboard-create-name').val()
      let moduleType = $('#dashboard-create-type').val()

      let paramURL = self.googleListingURL+'&modulename='+moduleName+'&moduletype='+moduleType+'&action=createmodule'
      
      console.log(paramURL)

      $.getJSON(paramURL, function(callback) {
        if(callback) {
          let datas = JSON.parse(callback.result)
          let elm = []
          elm[0] = datas.currentTime
          elm[1] = datas.id
          elm[2] = moduleName
          elm[3] = moduleType
          createModules(elm)
          $('#dashboard-create-name').val('')
        } else {
          alert('failed')
        }
        $('.loader').fadeOut()
      })

      $('#dashboard-create-modal').modal('hide')

    });



    
  }

}

export default Dashboard