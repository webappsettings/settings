import $ from "jquery"
import "../dist/lib/bootstrap/js/bootstrap.js"
import "../dist/lib/jquery-ui/jquery-ui"

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


  // var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  // GlobalArray.globalArray['connection'] = connection

 /* function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    // pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  }

  getUserIP(function(ip){
    GlobalArray.globalArray['ip'] = ip
  });*/

 
  

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