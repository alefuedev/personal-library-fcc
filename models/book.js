let mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  comments: [String],
  commentcount: {type: Number, default: 0},
});

let Book = mongoose.model('Book', bookSchema);
module.exports = Book;
