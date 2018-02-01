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
            <input type="email" class="form-control" placeholder="Email address" value="a" id="loginEmail">
          </div>
          <div class="form-group">
            <input type="password" class="form-control" placeholder="Password" value="a" id="loginPassword">
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-primary" value="Submit" id="loginBtn">LOG IN
            </button>
          </div>
        </form>
      </div>
    </div>
    `
    return tpl
  }

  clickHandler() {
    $('#loginBtn').on("click", (e) => {

       let loginE = encodeURIComponent($('#loginEmail').val())
       let loginP = $('#loginPassword').val()
      
       new CookieControls(loginE, loginP).toCookie()
    });

  }

}

export default Login