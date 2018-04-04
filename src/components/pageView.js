import CookieControls from "components/cookieControls"
import HashControls from 'components/hashControls'
import Allpages from 'interface/allPages'

import GlobalArray from "components/globalArray";


class PageView {
  constructor(page){
    this.page = page
  }
  visible() {
    let self = this
    
        
        if(self.page.indexOf('?') > -1) {
          var getId = getUrlVars(self.page)["id"]
          var getName = getUrlVars(self.page)["name"]
          
          GlobalArray.globalArray['paramid'] = getId
          GlobalArray.globalArray['paramname'] = getName

          console.log(GlobalArray.globalArray)
          self.page = self.page.split('?')[0]
        }

       console.log(self.page)

        
        //get url parameter
        function getUrlVars(myString) {
          var vars = [], hash,
          myString = window.location.href;

          if(window.location.href.indexOf('#')+1) {
            var inHashFull = myString.replace(/\#/g, '&#='),
            start_pos = inHashFull.indexOf('?') + 1,
            hashes = inHashFull.substring(start_pos).split('&');
          } else {
            var hashes = myString.slice(myString.indexOf('?') + 1).split('&');
          }

          for(var i = 0; i < hashes.length; i++)
          {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
          }
          return vars;
        }


      if(self.page == 'login' || self.page == 'dashboard' || self.page == 'listing' || self.page == 'detail') {

        $('.loader').fadeOut()

        if(self.page == 'login') {
          $('body').addClass('login-page')
          $('#navTop').addClass('d-none').removeClass('d-flex')
        } else {
          $('body').removeClass('login-page')
          $('#navTop').removeClass('d-none').addClass('d-flex')
        }
        $('.userName').text(decodeURIComponent(new CookieControls().getCookie('user')))
        
        var tpl =  new Allpages(self.page).render()
        $('.section-view').html(tpl)

        if(self.page != 'login') {
          new Allpages(self.page).clickHandler()
        }
        
      } else if(self.page != '') {
        var tpl =  new Allpages('_404').render()
        new HashControls('404').setHash()
        $('.section-view').html(tpl)
      }
    
      
  }

}

export default PageView