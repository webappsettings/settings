import Allpages from 'interface/allPages';
import HashControls from 'components/hashControls';
import PageView from 'components/pageView';
import CodeComp from 'components/codeComp';

import GlobalArray from "components/globalArray";

class CookieControls {
  constructor(loginE, loginP){
    this.loginE = loginE
    this.loginP = loginP
    this.loginCode = 'AKfycbw12GxJrVm1TiUj_3m-eskmt8oAoNr9-K0tgZq0-X9snIF-hLw'
    this.googleURL = new CodeComp(this.loginCode).getCode()
  }



  checkCookie(prevHistory) {

    let localSecureId = this.getCookie("localSecureId");
    let self = this

    var opened = false


    if (localSecureId != "") {
      let paramURL = this.googleURL+"?cb&id="+localSecureId+"&action=vw"


      $.getJSON(paramURL, function(callback) {


       
        if(!callback.result) {
          
          self.deleteCookie()
          
          new HashControls('login').setHash()

        } else {

            GlobalArray.globalArray['main'] = callback.main

            // alert(callback.main)

            // callback.main != self.getCookie('main') ||

              if(callback.result != decodeURIComponent(self.getCookie('user'))) {
                self.deleteCookie()
                
                new HashControls('login').setHash()
              } else {
                // alert(prevHistory);
                //yes all ok
                if(! prevHistory) {
                  var urlHash = new HashControls().getHash()
                } else {
                  var urlHash = prevHistory
                }
                
                 if(urlHash == '' || urlHash == 'login' || !urlHash) {

                  new HashControls('dashboard').setHash()
                  new PageView('dashboard').visible()
                } else {
                  if(! prevHistory) {
                    
                    if(urlHash=='404'){
                      new HashControls('dashboard').setHash()
                      new PageView('dashboard').visible()
                      opened = true
                    } else {
                      new PageView(urlHash).visible()
                      new HashControls(urlHash).setHash()
                    }
                    
                  }
                  
                }
                if(!opened) {
                  new HashControls(urlHash).setHash()
                }
              }
          

        }
      });
      
    } else {
      this.deleteCookie()
      
      new HashControls('login').setHash()
    }

    
  }




  toCookie() {

    

    $('.loader').fadeIn()
    let param = "?cb&name="+this.loginE+"&id="+this.loginP+"&action=chk"
    let paramURL = this.googleURL+param
    let self = this


    $.getJSON(paramURL, function(callback) {
      
      console.log(callback);
      if(callback.result) {
        console.log(callback.main)
        // console.log(GlobalArray.globalArray)

        GlobalArray.globalArray['main'] = callback.main

        // console.log(GlobalArray.globalArray.main)

        // self.setCookie('main', callback.main, 20)
        self.setCookie('localSecureId', callback.result, 20)
        self.setCookie('user', self.loginE, 20)
        new HashControls('dashboard').setHash()
      } else {
        alert('Email ID or Password Invalid!!!')
      }
      $('.loader').fadeOut()
      
    });  

  }

  setCookie(cname, cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
  }

  getCookie(cname) {
    let name = cname + "="
    let ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }               

  deleteCookie() {
    if(typeof GlobalArray.globalArray['main'] !== 'undefined') {
      $.getJSON(new CodeComp().mainCode()+'&logincode='+this.loginCode+'&localcode='+this.getCookie("localSecureId")+'&user='+this.getCookie('user')+'&action=logout')
    }
    this.setCookie('localSecureId',"",-1)
    this.setCookie('user',"",-1)
    this.setCookie('history',"",-1)
    new HashControls('login').setHash() 

  }

}

export default CookieControls