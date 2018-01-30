import $ from "jquery"
import "../dist/lib/bootstrap/js/bootstrap.js"
import "../dist/lib/jquery-ui/jquery-ui"

import CookieControls from "components/cookieControls"
import HashControls from 'components/hashControls';
import PageView from 'components/pageView';
import GlobalArray from "components/globalArray";

import Login from 'interface/login';
import Allpages from 'interface/allPages';

// window.addEventListener('load', function() {
  
// });

const load = () => {



  $(window).bind( 'online',function(e) {
    $('body').removeClass('offline-mode')
  });

  $(window).bind( 'offline',function(e) {
    $('body').addClass('offline-mode')
  });

  var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  if(isMobile.any()) {
    console.log('Device: '+isMobile.any()[0])
  } else {
    var OSName = "Unknown";
    if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) OSName="Windows 10";
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows 2000";
    if (window.navigator.userAgent.indexOf("Mac")            != -1) OSName="Mac/iOS";
    if (window.navigator.userAgent.indexOf("X11")            != -1) OSName="UNIX";
    if (window.navigator.userAgent.indexOf("Linux")          != -1) OSName="Linux";
    console.log('Device: '+OSName)
  }

  


  


  // ----------
  

  let urlHash = new HashControls().getHash()

  let prevHistory = new CookieControls().getCookie('history')

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