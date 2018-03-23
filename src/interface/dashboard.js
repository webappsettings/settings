import CookieControls from "components/cookieControls"
import CodeComp from 'components/codeComp';
import HashControls from 'components/hashControls';

import GlobalArray from "components/globalArray";

class Dashboard {
  constructor(id){
    this.id = id
    this.googleListingURL = new CodeComp().mainCode()
    this.listDatas = []
    // this.access = GlobalArray.globalArray['access']
  }
  render() {
    const tpl =  `
    <div class="container">
      <div class="col-md-12">
        <button class="btn btn-primary" type="button" id="create-new-dashboard" data-toggle="modal" data-target="#dashboard-create-modal">Create New</button>
      </div>
      <div class="clearfix"></div>
      <div class="card-deck mt-2 mb-3 text-center" id="dashboard-view">
      </div>
    </div>
    `
    return tpl
  }

  clickHandler() {

    let self = this

    let urlHash = new HashControls().getHash().split('?')[0]


    var sortStart, sortStop, createNew = []


    var $validator = $("#dashboard-create-form").validate({
      errorElement: "span",
      rules: {
        'createName': {
          required: true
        },
        'createType': {
          required: true
        }
      },
      messages: {
        'createName': {
          required: "Please enter a module name"
        },
        'createType': {
          required: "Please select module type"
        }

      },
      errorPlacement: function(error, element) {
        if( element.parent().hasClass('input-group')) {
          error.appendTo( element.parent().parent());
        } else {
            error.appendTo( element.parent());
        }
        
      },
      submitHandler: function() {
        // alert('submit')
        createNewModule()
        return false
      }
    });


    $('.field-box .add-new-field').off().on('click', function(event) {
      var getType = $(this).closest('.field-box').data('type')
      let totalL = $('.field-box[data-type="'+getType+'"] .field-new').length

      $('.field-box[data-type="'+getType+'"]').append(`<div class="col-md-6 appended-field">
          <div class="form-group">
            <div class="input-group">
              <input type="text" class="form-control field-new" name="`+getType+`_defineField_`+(totalL+1)+`" placeholder="Add new field">
              <span class="input-group-btn">
                <button class="btn btn-default field-remove" type="button" data-removefield="`+getType+`_defineField_`+(totalL+1)+`"><i class="ion-trash-a text-danger"></i></button>
              </span>
            </div>
          </div>
        </div>`)



      $(`[name="`+getType+`_defineField_`+(totalL+1)+`"]`).rules("add", {
        required: true,
        messages: {
          required: "Please fill this field or remove",
        }
      });

    });

    $('#dashboard-create-type').on('change', function(event) {

        
        if(GlobalArray.globalArray['access'] == 'full') {
          if($(this).val()!='') {
            if(!$('[name="defaultFields"]').is(':checked')) {
              var getType = $(this).val()
                $('.field-box[data-type="'+getType+'"]').show().siblings('.field-box').hide()
            }
            $('.dashboad-additional-datas').show()

            $('.default-field-new').each(function(index, el) {
              $(this).rules("add", {
                required: true,
                messages: {
                  required: "Please fill this field",
                }
              });
            });

          } else {
            $('.dashboad-additional-datas').hide()
          }
        }
    });




    $('.default-fields-box input[type="checkbox"]').on('change', function(event) {
      if(!$(this).is(':checked')) {
        var getType = $('#dashboard-create-type').val()
        $('.field-box[data-type="'+getType+'"]').show().siblings('.field-box').hide()
        } else {
          $('.field-box').hide()
        }
    });




    if(GlobalArray.globalArray['access'] == 'full') {
      $("#dashboard-view").sortable({
        start: function(event, ui) {
          sortStart = $('#dashboard-view [data-moduleid='+ui.item[0].dataset.moduleid+']').index()
        },
        stop: function(event, ui) {
          sortStop = $('#dashboard-view [data-moduleid='+ui.item[0].dataset.moduleid+']').index()

          
          // console.log(sortURL)
            if(sortStart != sortStop) {
              /*let sortURL = new CodeComp().mainCode()+'&pageid='+urlHash+'&fromid='+(sortStart+1)+'&toid='+(sortStop+1)+'&action=sort'
              $('.loader').fadeIn()
              $.getJSON(sortURL, function(callback) {
                console.log(callback)
                let output = JSON.parse(callback.result)
                if(!output.result) {
                  new CookieControls().deleteCookie()//Logout
                } 
                $('.loader').fadeOut()
              })*/

              let formdata = new FormData()
              formdata.append('pagename', urlHash)
              formdata.append('action', 'sort')
              formdata.append('fromid', sortStart+1)
              formdata.append('toid', sortStop+1)

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
                  if(!output.result) {
                    new CookieControls().deleteCookie()//Logout
                  } 
                })
                .fail(function(callback) {
                  alert('This action not completed! Please try again')
                })
               .always(function(){
                  $('.loader').fadeOut()
                }); 


           }
        }
      });
    }


    function createNewModule() {
      let moduleName = $('#dashboard-create-name').val()
      let moduleType = $('#dashboard-create-type').val()

      var customHeaders = []
      var predefinedHeaders = []
  
      // customHeaders[0]='_row'

      if(!$('input[name="defaultFields"]').is(':checked')){
        $('.field-box:visible .field-new').each(function(index, el) {
          let values = $(this).val()
          customHeaders[index]=values
        });

        $('.active-predefined-fields .pre-field-new:checked').each(function(index, el) {
          let values = $(this).val()
          predefinedHeaders[index]=values
        });
      }


      // customHeaders.splice(0, 0, "_row");

      
      console.log(customHeaders)


      predefinedHeaders = JSON.stringify(predefinedHeaders)
      customHeaders = JSON.stringify(customHeaders)

      console.log(predefinedHeaders)

      // return false

      var formdata = new FormData()

      

      formdata.append('predefinedheaders', predefinedHeaders)
      formdata.append('customheaders', customHeaders)

      formdata.append('pagename', urlHash)
      formdata.append('action', 'create')
      formdata.append('modulename', moduleName)
      formdata.append('moduletype', moduleType)

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
        .done(function(outputDatas){

          console.log(outputDatas)

          var outputDatas = JSON.parse(outputDatas.result)

          if(outputDatas.result) {
            console.log(outputDatas)
            self.listDatas[0].result.unshift(outputDatas.result)
            pushData(self.listDatas[0])
          }

          dashboardFormReset()
         
        })
        .fail(function(callback) {
          console.log('Fail',callback)
          alert('This action not completed! Please try again')
       })
       .always(function(){
         $('.loader').fadeOut()
         $('#dashboard-create-modal').modal('hide')
       });
    }


    

    

    let readmodulesParamURL = new CodeComp().mainCode()+'&pageid='+urlHash+'&action=readpagedatas'
    $('.loader').fadeIn()

    $.getJSON(readmodulesParamURL, function(callback) {
      console.log('all=',callback)

      if(callback.result != '{"result":false}') {
        self.listDatas.push(callback)
        pushData(self.listDatas[0])
      } else {
        new CookieControls().deleteCookie()//Logout
      }


      $('.loader').fadeOut()

    })  


    




    $(document).off().on('click', '.dashboard-remove-btn', function(event) {

      let result = confirm("Are you sure you want to remove this module?");

      if (result) {

        let moduleId = $(this).attr('data-id')

        let formdata = new FormData()
        formdata.append('pagename', urlHash)
        formdata.append('action', 'remove')
        formdata.append('moduleid', moduleId)

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
          console.log(output)
          if(output.result) {
            self.listDatas[0].result = jQuery.grep(self.listDatas[0].result, function( elm, index ) {
              return elm[0] != moduleId
            })
            pushData(self.listDatas[0])
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
      }

    });



    $(document).on('click', '#dashboad-reset', function(event) {
      dashboardFormReset()
    }) 


    function dashboardFormReset() {
      $('.dashboad-additional-datas,.field-box').hide()
      $('.appended-field').remove()
      $('#dashboard-create-modal form').trigger('reset')
    }

    

    $(document).on('click', '.field-remove', function(event) {

      let result = confirm("Want to delete?");
      if (result) {
        let getField = $(this).data('removefield')      
        $('[name="'+getField+'"]').closest('.appended-field').remove()
      }
      
    });

  }

}

const pushData = (data) => {
  var lists = ''
  $.each(data.result, function(index, elm) {
    lists += `<div class="card mb-4 box-shadow module-item" data-moduleid="`+elm[0]+`" data-startindex="`+index+`">
              <div class="card-header">
                <h4 class="my-0 font-weight-normal"></h4>
                <i class="ion-close dashboard-remove-btn" data-id="`+elm[0]+`"></i>
              </div>
              <div class="card-body">
                <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ mo</small></h1>
                <ul class="list-unstyled mt-3 mb-4">
                  <li>10 users included</li>
                  <li>2 GB of storage</li>
                  <li>Email support</li>
                  <li>Help center access</li>
                </ul>
                <a href="#`+elm[3]+`?id=`+elm[0]+`&name=`+elm[2]+`" data-type="`+elm[3]+`" class="btn btn-lg btn-block btn-outline-primary">`+elm[2]+`</a>
              </div>
            </div>`
    })

  $('#dashboard-view').html(lists)
}




export default Dashboard