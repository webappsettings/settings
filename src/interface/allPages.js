import HashControls from 'components/hashControls';

import _404 from "interface/_404"
import login from "interface/login"
import dashboard from "interface/dashboard"
import listing from "interface/listing"
import detail from "interface/detail"

const pages = {
    _404,
    login,
    dashboard,
    listing,
    detail
};

class Allpages {
    constructor (className, opts) {
      return new pages[className](opts);
    }
}

export default Allpages;