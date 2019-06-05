const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Custom Instance Methods

// Custom method `setFullName`
// ArticlesSchema.methods.setFullName = function() {
//   // Set the current user's `fullName` to their `firstName` and their `lastName` together
//   this.fullName = this.firstName + " " + this.lastName;
//   // Return the new `fullName`
//   return this.fullName;
// };

// // Custom method `lastUpdatedDate`
// UserSchema.methods.lastUpdatedDate = function() {
//   // Set the current user's `lastUpdated` property to the current date/time
//   this.lastUpdated = Date.now();
//   // Return this new date
//   return this.lastUpdated;
// };

// This creates our model from the above schema, using mongoose's model method
const Articles = mongoose.model("Articles", ArticlesSchema);

// Export the User model
module.exports = Articles;
