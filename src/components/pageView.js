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
    
        // self.page = self.page.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        //  return letter.toUpperCase();
        // });
        
        if(self.page.indexOf('?') > -1) {
          var getId = getUrlVars(self.page)["id"]
          
          GlobalArray.globalArray['paramid'] = getId

          // console.log(GlobalArray.globalArray)
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
      

      if(self.page == 'login' || self.page == 'dashboard' || self.page == 'listing') {

        $('.loader').fadeOut()

        if(self.page == 'Login') {
          $('#navTop').addClass('hidden')
        } else {
          $('#navTop').removeClass('hidden')
        }
        $('.userName').text(decodeURIComponent(new CookieControls().getCookie('user')))
        
        
        new Allpages(self.page).clickHandler()

        var tpl =  new Allpages(self.page).render()

      } else if(self.page != '') {
        var tpl =  new Allpages('_404').render()
        new HashControls('404').setHash()
      }

      



      $('.section-view').html(tpl)
      

      

    
  }

}

export default PageView