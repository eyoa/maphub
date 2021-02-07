
const getActiveKeys = function(params) {
  // get array of keys with actual values
    if (params){
      const keys = Object.keys(params).filter(key =>{
        if (!params[key]) {
          return false;
        }
        return key;
      });
      return keys;
    }
    return [];
}

module.exports = getActiveKeys;
