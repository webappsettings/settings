class HashControls {
  constructor(toHash){
    this.toHash = toHash
  }
  setHash() {
    window.location.hash=this.toHash
  }
  getHash() {
    return window.location.hash.slice(1)
  }

}

export default HashControls