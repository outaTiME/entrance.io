
/**
 * Company Schema.
 */

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});

module.exports = mongoose.model('Company', CompanySchema);
