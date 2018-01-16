import CookieControls from "components/cookieControls"
import GlobalArray from "components/globalArray";

class CodeComp {
  constructor(loginCode){
    this.loginCode = loginCode
  }

  getCode() {
    return 'https://script.google.com/macros/s/'+this.loginCode+'/exec'
  }

  mainCode() {
    // let main = new CookieControls().getCookie('main')
    let main = GlobalArray.globalArray.main
    let localSecureId = new CookieControls().getCookie('localSecureId')
    return 'https://script.google.com/macros/s/'+main+'/exec?localcode='+localSecureId
  }

}

export default CodeComp