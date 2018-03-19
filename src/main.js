import $ from "jquery"
window.jQuery = $
import Fingerprint2 from "../dist/lib/fingerprint2.min"
import "../dist/lib/bowser"
import "../dist/lib/bootstrap/js/bootstrap"
import "../dist/lib/jquery-ui/jquery-ui"
import "../dist/lib/jquery.validate.min"
import "../dist/lib/cropper.js"
require('../dist/lib/jquery.fancybox.min');


import CookieControls from "components/cookieControls"
import HashControls from 'components/hashControls';
import PageView from 'components/pageView';
import GlobalArray from "components/globalArray";

import Login from 'interface/login';
import Allpages from 'interface/allPages';





const load = () => {

  $(window).bind( 'online',function(e) {
    $('body').removeClass('offline-mode')
  });

  $(window).bind( 'offline',function(e) {
    $('body').addClass('offline-mode')
  });

  
  window.addEventListener('storage', function(event){
    if (event.key == 'logout-user') { 
      location.reload()
    }
  });

let urlHash = new HashControls().getHash()

  let prevHistory = new CookieControls().getCookie('history')

  
  var getSystemCode = new Fingerprint2();
  getSystemCode.get(function(result, components) {

    console.log(result)
    GlobalArray.globalArray.system = result

    if(!urlHash) {
      if(prevHistory) {
        new CookieControls().checkCookie(prevHistory)
      } else {
        new CookieControls().checkCookie()
      }
    } else {
      if(urlHash=='login') {
        new PageView('login').visible()
        new Login().clickHandler()
      } else {
        new CookieControls().checkCookie()
      }
    }
    
  });
  
  

    $('#logoutBtn').on("click", (e) => {
     new CookieControls().deleteCookie()
    });



    $(window).bind( 'hashchange',function(e) {


      let toPage = new HashControls().getHash()

      let loginOk = login()

      if(loginOk) {
        if(toPage == 'login') {
          var urlHash = new HashControls().getHash()

          new HashControls('dashboard').setHash()
          new PageView('dashboard').visible()
          
          window.location.href;
          location.reload();         
        }
        if(toPage != '404' && toPage != 'login') {
          setTimeout(function() {
            new CookieControls().setCookie('history', toPage)
          }, 10);
          
        }
        new PageView(toPage).visible()
      } else {
        new PageView('login').visible()
        new Login().clickHandler()
      }

    });




    function login() {
      if((new CookieControls().getCookie('localSecureId')) && (new CookieControls().getCookie('user'))) {
        return GlobalArray.globalArray.main
        // return new CookieControls().getCookie('main')
      }
      
    }
    
    

}

window.onload = load