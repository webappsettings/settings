import CookieControls from "components/cookieControls"

class _404 {
  constructor(){
  }
  render() {
    const tpl =  `
    <div class="container">
      <div class="section-top">
        <a href="#dashboard">Dashboard</a>
      </div>
      <div class="m-t-2 view">
        404
      </div>
    </div>
    `
    return tpl
  }

  clickHandler() {
    
  }

}

export default _404