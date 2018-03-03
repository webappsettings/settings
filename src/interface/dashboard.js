import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';
import HashControls from 'components/hashControls';

import GlobalArray from "components/globalArray";

class Dashboard {
  constructor(id){
    this.id = id
    this.googleListingURL = new CodeComp().mainCode()
    this.listDatas = []
    this.access = GlobalArray.globalArray['access']
  }
  render() {
    const tpl =  `
    <div class="container">
      <div class="col-md-12">
        <button class="btn btn-primary" type="button" id="create-new-dashboard">Create New</button>
      </div>
      <div class="clearfix"></div>
      <div class="m-t-2" id="dashboard-view">        
      </div>
    </div>
    `
    return tpl
  }

  clickHandler() {

    let self = this

    let urlHash = new HashControls().getHash()

    var sortStart, sortStop


    if(self.access == 'full') {
      $("#dashboard-view").sortable({
        start: function(event, ui) {
          sortStart = $('#dashboard-view [data-moduleid='+ui.item[0].dataset.moduleid+']').index()
        },
        stop: function(event, ui) {
          sortStop = $('#dashboard-view [data-moduleid='+ui.item[0].dataset.moduleid+']').index()
          let sortURL = new CodeComp().mainCode()+'&pageid='+urlHash+'&fromid='+(sortStart+1)+'&toid='+(sortStop+1)+'&action=sort'
          console.log(sortURL)
            if(sortStart != sortStop) {
              $('.loader').fadeIn()
              $.getJSON(sortURL, function(callback) {
                console.log(callback)
                let output = JSON.parse(callback.result)
                if(!output.result) {
                  new CookieControls().deleteCookie()//Logout
                } 
                $('.loader').fadeOut()
              })
           }
        }
      });
    }

    

    let readmodulesParamURL = new CodeComp().mainCode()+'&pageid='+urlHash+'&action=readpagedatas'
    $('.loader').fadeIn()

    $.getJSON(readmodulesParamURL, function(callback) {
      console.log('all=',callback)

      /*if(callback) {
        self.listDatas.push(callback)
      } else {
        self.listDatas.push([])
      }
      pushData(self.listDatas[0])*/

      if(callback.result != '{"result":false}') {
        self.listDatas.push(callback)
        pushData(self.listDatas[0])
      } else {
        new CookieControls().deleteCookie()//Logout
      }


      $('.loader').fadeOut()

    })   



    $(document).off().on('click', '.dashboard-remove-btn', function(event) {
      var _this = $(this)
      let id = $(this).attr('data-id')
      let paramURL = new CodeComp().mainCode()+'&moduleid='+id+'&action=removemodule'
      
      console.log(self.listDatas[0].result)
      $.getJSON(paramURL, function(callback) {
        let output = JSON.parse(callback.result)
        console.log(output)
        if(output.result) {
          // _this.closest('.col-md-4').remove();
          self.listDatas[0].result = jQuery.grep(self.listDatas[0].result, function( elm, index ) {
            return elm[0] != id         
          })
          pushData(self.listDatas[0])
        } else {
          new CookieControls().deleteCookie()//Logout
        }
      }); 
    });

    $(document).on('click', '#create-new-dashboard', function(event) {
      $('#dashboard-create-modal .form-control').val('')
      $('#dashboard-create-okBtn').prop('disabled',true)
      $('.field-box').hide()
      $('#dashboard-create-modal').modal('show')
    });

    $(document).on('click', '#dashboard-create-okBtn', function(event) {
      let moduleName = $('#dashboard-create-name').val()
      let moduleType = $('#dashboard-create-type').val()

      let paramURL = new CodeComp().mainCode()+'&modulename='+moduleName+'&moduletype='+moduleType+'&action=createmodule'
      
      console.log(paramURL)

      $.getJSON(paramURL, function(callback) {
        var outputDatas = JSON.parse(callback.result)
        if(outputDatas.result) {
          console.log(outputDatas)
          self.listDatas[0].result.unshift(outputDatas.result)
          pushData(self.listDatas[0])
        } else {
          new CookieControls().deleteCookie()//Logout
        }
        $('.loader').fadeOut()
      })

      $('#dashboard-create-modal').modal('hide')

    });

    $(document).on('change', '#dashboard-create-type', function(event) {
        // let access = GlobalArray.globalArray['access']
        if(self.access == 'full') {
          if($(this).val()!='') {
            $('.default-fields-box').removeClass('hidden').find('input[type="checkbox"]').prop('checked',true);
            $('.field-box-listing,.field-box-detail').hide()
          } else {
            $('.default-fields-box').addClass('hidden');
          }
          
        }
        dashboardBtnActive()
    });

    $('.default-fields-box input[type="checkbox"]').on('change', function(event) {
      if(!$(this).is(':checked')) {
        if($('#dashboard-create-type').val()=='listing') {
            $('.field-box-detail').hide()
            $('.field-box-listing').show()
          } else if($('#dashboard-create-type').val()=='detail') {
            $('.field-box-listing').hide()
            $('.field-box-detail').show()
          } 
        } else {
          $('.field-box-listing,.field-box-detail').hide()
        }
    });
 
    $(document).on('keyup', '#dashboard-create-name', function(event) {
      dashboardBtnActive()
    });

    $(document).on('keyup', '.field-box:visible .field-new', function(event) {
      if($(this).val() != '') {
        $(this).addClass('filled-field')
      } else {
        $(this).removeClass('filled-field')
      }
      dashboardBtnActive()
    });


    function dashboardBtnActive() {
      if(($('#dashboard-create-name').val() != '') && ($('#dashboard-create-type').val() != '')) {
        // let access = GlobalArray.globalArray['access']
        if(self.access == 'full') {
          if($('.field-box:visible .field-new').length != $('.field-box:visible .field-new.filled-field').length) {
            $('#dashboard-create-okBtn').prop('disabled', true)
          } else {
            $('#dashboard-create-okBtn').prop('disabled', false)
          }
        } else {
          $('#dashboard-create-okBtn').prop('disabled', false)
        }
      } else {
         $('#dashboard-create-okBtn').prop('disabled', true)
      }
    }


  }

}

const pushData = (data) => {
  var lists = ''
  $.each(data.result, function(index, elm) {
    lists += `<div class="col-md-4 module-item" data-moduleid="`+elm[0]+`" data-startindex="`+index+`">
            <div class="panel panel-default">
              <i class="ion-close dashboard-remove-btn" data-id="`+elm[0]+`"></i>
              <div class="panel-body">
                <a href="#`+elm[3]+`?id=`+elm[0]+`&name=`+elm[2]+`" data-type="`+elm[3]+`">`+elm[2]+`</a>
              </div>
            </div>
          </div>`
  })

  $('#dashboard-view').html(lists)
}

export default Dashboard