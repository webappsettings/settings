import CookieControls from "components/cookieControls"

class Login {
  constructor(id){
    this.id = id
  }
  render() {
    const tpl =  `
      <form class="form-signin shadow-box text-center">
        <img class="mb-4" src="images/settings-icon.png" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Sign in</h1>
        <label for="loginEmail" class="sr-only">Email address</label>
        <input type="email" id="loginEmail" class="form-control" placeholder="Email address" required="" autofocus="">
        <label for="loginPassword" class="sr-only">Password</label>
        <input type="password" id="loginPassword" class="form-control" placeholder="Password" required="">
        <div class="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me"> Remember me
          </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit" id="loginBtn" disabled="disabled">LOG IN</button>
        <p class="mt-5 mb-3 text-muted">© 2017-2018</p>
      </form>
    `
    return tpl
  }

  clickHandler() {

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