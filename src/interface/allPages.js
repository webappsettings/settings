import HashControls from 'components/hashControls';

import _404 from "interface/_404"
import Login from "interface/login"
import Dashboard from "interface/dashboard"
import Listing1 from "interface/listing1"

const pages = {
    _404,
    Login,
    Dashboard,
    Listing1
};

class Allpages {
    constructor (className, opts) {
      return new pages[className](opts);
        
    }
}

export default Allpages;