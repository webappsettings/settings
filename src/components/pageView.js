import CookieControls from "components/cookieControls"
import HashControls from 'components/hashControls'
import Allpages from 'interface/allPages'


class PageView {
  constructor(page){
    this.page = page
  }
  visible() {
    let self = this
    
        self.page = self.page.toLowerCase().replace(/\b[a-z]/g, function(letter) {
         return letter.toUpperCase();
        });
      
        // console.log(self.page)


      

      if(self.page == 'Login' || self.page == 'Dashboard' || self.page == 'Listing1') {

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