import CookieControls from "components/cookieControls"

class Login {
  constructor(id){
    this.id = id
  }
  render() {
    const tpl =  `
    <div class="container">
      <div class="login-form">
        <form>
          <div class="form-group">
            <input type="email" class="form-control" placeholder="Email address" value="" id="loginEmail">
          </div>
          <div class="form-group">
            <input type="password" class="form-control" placeholder="Password" value="" id="loginPassword">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary" value="Submit" id="loginBtn" disabled="disabled">LOG IN
            </button>
          </div>
        </form>
      </div>
    </div>
    `
    return tpl
  }

  clickHandler() {

    // $(document).on('click', '#listing-create-btn', function() {

      $('#loginEmail,#loginPassword').on("keyup", (e) => {
        if(($('#loginEmail').val()!='') && ($('#loginPassword').val()!='')) {
          $('#loginBtn').prop('disabled',false)
        } else {
            $('#loginBtn').prop('disabled',true)
        }
        
      });


    $('#loginBtn').on("click", (e) => {

       let loginE = encodeURIComponent($('#loginEmail').val())
       let loginP = $('#loginPassword').val()
      
       new CookieControls(loginE, loginP).toCookie()
    });

  }

}

export default Login