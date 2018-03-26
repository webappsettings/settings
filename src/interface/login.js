import CookieControls from "components/cookieControls"

class Login {
  constructor(id){
    this.id = id
  }
  render() {
    const tpl =  `
      <form class="form-signin" id="login-form">

        <div class="text-center mb-4">
          <img class="mb-4" src="images/settings-icon.png" alt="" width="72" height="72">
          <h1 class="h3 mb-3 font-weight-normal">Sign in</h1>
        </div>
     
        <div class="form-label-group">
          <input type="text" id="loginEmail" class="form-control" placeholder="User name" name="loginEmail">
          <label for="loginEmail">User name</label>
        </div>

        <div class="form-label-group">
          <input type="password" id="loginPassword" class="form-control" placeholder="Password" name="loginPassword">
          <label for="loginPassword">Password</label>
        </div>
        
        <div class="custom-control custom-checkbox mb-3 checkbox text-left text-muted">
          <input type="checkbox" class="custom-control-input" id="rememberChkBox" value="rememberChkBox">
          <label class="custom-control-label" for="rememberChkBox">Remember me</label>
        </div>

        <button class="btn btn-lg btn-primary btn-block" type="submit" id="loginBtn">Sign in</button>
        <p class="mt-5 mb-3 text-muted text-center">© 2017-2018</p>
      </form>
    `
    return tpl
  }

  clickHandler() {

      var $validator = $("#login-form").validate({
      errorElement: "span",
      rules: {
        'loginEmail': {
          required: true
        },
        'loginPassword': {
          required: true
        }
      },
      messages: {
        'loginEmail': {
          required: "Please enter user name"
        },
        'loginPassword': {
          required: "Please enter password"
        }
      },
      errorPlacement: function(error, element) {
        error.appendTo( element.parent());
      },
      submitHandler: function() {
        let loginE = encodeURIComponent($('#loginEmail').val())
        let loginP = $('#loginPassword').val()      
        new CookieControls(loginE, loginP).toCookie()
        return false
      }
    });


      /*$('#loginEmail,#loginPassword').on("keyup", (e) => {
        if(($('#loginEmail').val()!='') && ($('#loginPassword').val()!='')) {
          $('#loginBtn').prop('disabled',false)
        } else {
            $('#loginBtn').prop('disabled',true)
        }
      });*/





      //Remember
      if (localStorage.chkbox && localStorage.chkbox != '') {
        $('#rememberChkBox').prop('checked', true);
        $('#loginEmail').val(localStorage.username);
        $('#loginPassword').val(localStorage.pass);
      } else {
        $('#rememberChkBox').prop('checked', false);
        $('#loginEmail').val('');
        $('#loginPassword').val('');
      }

      $('#rememberChkBox').on("click", (e) => {
        if ($('#rememberChkBox').is(':checked')) {
          localStorage.username = $('#loginEmail').val();
          localStorage.pass = $('#loginPassword').val();
          localStorage.chkbox = $('#rememberChkBox').val();
        } else {
          localStorage.username = '';
          localStorage.pass = '';
          localStorage.chkbox = '';
        }
      });


    /*$('#loginBtn').on("click", (e) => {

     let loginE = encodeURIComponent($('#loginEmail').val())
     let loginP = $('#loginPassword').val()
    
     new CookieControls(loginE, loginP).toCookie()
    });*/

  }

}

export default Login