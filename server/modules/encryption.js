var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var encryption = {
  encryptPassword: function(password) {
      var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      return bcrypt.hashSync(password, salt);
  },
  comparePassword: function(candidatePassword, storedPassword) {
      console.log('comparing passwords');
      console.log(candidatePassword, storedPassword);
      return bcrypt.compareSync(candidatePassword, storedPassword);
  }
};

module.exports = encryption;