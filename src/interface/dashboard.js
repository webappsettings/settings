import CookieControls from "components/cookieControls"

class Dashboard {
  constructor(id){
    this.id = id
  }
  render() {
    const tpl =  `
    <div class="container">
      <div class="col-md-4">
        <div class="panel panel-default">
          <div class="panel-body">
            <a href="#listing1">fgfghfh</a>
          </div>
        </div>
      </div>
    </div>
    `
    return tpl
  }

  clickHandler() {
    
  }

}

export default Dashboard