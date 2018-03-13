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
      // let paramURL = this.googleURL+"?cb&id="+localSecureId+"&action=vw"
      let formdata = new FormData()
      formdata.append('action', 'vw')
      formdata.append('id', localSecureId)

      $.ajax({
         method: 'POST',
         url: self.googleURL,
         data: formdata,
         dataType: 'json',
         contentType: false,
         processData: false,
         beforeSend: function(){
            $('.loader').fadeIn()
          }
        })
        .done(function(callback){
          callback = JSON.parse(callback.result)

          if(!callback.result) {
          
          self.deleteCookie()
          
          new HashControls('login').setHash()

        } else {

          // console.log(callback)

            GlobalArray.globalArray['main'] = callback.main
            GlobalArray.globalArray['access'] = callback.access

            self.getClientIp(callback.ipapi, callback.ipapixtra)

            console.log(GlobalArray.globalArray)

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
          
           
        })
        .fail(function(callback) {
        })
       .always(function(){
          $('.loader').fadeOut()
        });


      /*$.getJSON(paramURL, function(callback) {


       
        if(!callback.result) {
          
          self.deleteCookie()
          
          new HashControls('login').setHash()

        } else {


            GlobalArray.globalArray['main'] = callback.main
            GlobalArray.globalArray['access'] = callback.access

            console.log(GlobalArray.globalArray)

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
      });*/
      
    } else {
      this.deleteCookie()
      
      new HashControls('login').setHash()
    }

    
  }


  getClientIp(ipapi, ipapixtra) {

      $.getJSON(ipapi, function(callback) {
        if(callback) {
          var callKey
          if(ipapixtra){
            callKey = callback[ipapixtra]
          } else {
            callKey = callback
          }
          let localIp = callKey.replace(/\./g, "-").replace(/\:/g, "_")
          console.log(localIp)

          let formdata = new FormData()

          formdata.append('action', 'ip')
          formdata.append('ip', localIp)

          $.ajax({
           method: 'POST',
           url: new CodeComp().mainCode(),
           data: formdata,
           dataType: 'json',
           contentType: false,
           processData: false
          });
        }
      });
    }


  toCookie() {

    

    var xtraDetails = Object.keys(bowser).filter(function(key) {
        if(bowser[key] === true) {
          return bowser[key]
        }
    });

    
   
    var xtraDetails = JSON.stringify(xtraDetails).replace(/[{}]/g, "").replace(/,/g , "  ").replace(/\"/g, "");
    var browserDetect = bowser.name+"-"+bowser.version+"  "+bowser.osname+((bowser.osversion) ? "-"+bowser.osversion : '')+" "+xtraDetails
    console.log('browserDetect=',browserDetect)

    $('.loader').fadeIn()
    // let param = "?cb&name="+this.loginE+"&id="+this.loginP+"&browserdetect="+browserDetect+"&systemcode="+systemCode+"&action=chk"
    
    let self = this
    // let paramURL = self.googleURL

    // console.log("complete-param: ",paramURL)

    var systemCode = GlobalArray.globalArray.system


    let formdata = new FormData()
    formdata.append('action', 'chk')
    formdata.append('name', self.loginE)
    formdata.append('id', self.loginP)
    formdata.append('browserdetect', browserDetect)
    formdata.append('systemcode', systemCode)
    

    $.ajax({
         method: 'POST',
         url: self.googleURL,
         data: formdata,
         dataType: 'json',
         contentType: false,
         processData: false,
         beforeSend: function(){
            $('.loader').fadeIn()
          }
        })
        .done(function(callback){
          callback = JSON.parse(callback.result)
          
           if(callback.result) {

            GlobalArray.globalArray['main'] = callback.main
            GlobalArray.globalArray['access'] = callback.access

            self.setCookie('localSecureId', callback.result, 20)

            localStorage.setItem('logout-user', 'logout' + self.loginE)

            self.setCookie('user', self.loginE, 20)
            new HashControls('dashboard').setHash()
            // getClientIp(callback.ipapi, callback.ipapixtra)
            self.getClientIp(callback.ipapi, callback.ipapixtra)
          } else {
            alert('Email ID or Password Invalid!!!')
          }
        })
        .fail(function(callback) {
        })
       .always(function(){
          $('.loader').fadeOut()
        });


/*    $.getJSON(paramURL, function(callback) {
      
      if(callback.result) {
        

        GlobalArray.globalArray['main'] = callback.main
        GlobalArray.globalArray['access'] = callback.access

        self.setCookie('localSecureId', callback.result, 20)

        localStorage.setItem('logout-user', 'logout' + self.loginE)

        self.setCookie('user', self.loginE, 20)
        new HashControls('dashboard').setHash()
        getClientIp(callback.ipapi, callback.ipapixtra)
      } else {
        alert('Email ID or Password Invalid!!!')
      }
      $('.loader').fadeOut()
      
    });*/

    

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
      $.getJSON(new CodeComp().mainCode()+'&localcode='+this.getCookie("localSecureId")+'&user='+this.getCookie('user')+'&action=logout')
    }

    localStorage.setItem('logout-user', 'logout' + Math.random());
    this.setCookie('localSecureId',"",-1)
    this.setCookie('user',"",-1)
    this.setCookie('history',"",-1)
    new HashControls('login').setHash()

  }

}

export default CookieControls