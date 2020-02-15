/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
let mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
let Book = require('./../models/book');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = function(app) {
  app
    .route('/api/books')
    .get(function(req, res) {
      Book.find({}, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.send(docs);
        }
      });
    })

    .post(function(req, res) {
      var title = req.body.title;
      let b = new Book({title});
      if (title == '') {
        res.send('error missing title');
      } else {
        b.save(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.json({title: doc.title, _id: doc._id});
          }
        });
      }
    })

    .delete(function(req, res) {
      Book.deleteMany({title: /.*/}, function(err) {
        if (err) {
          console.log(err);
        } else {
          res.json({message: 'complete delete successful'});
        }
      });
    });

  app
    .route('/api/books/:id')
    .get(function(req, res) {
      var bookid = req.params.id;
      Book.findById({_id: bookid}, function(err, doc) {
        if (err) {
          res.send('not book found');
        } else {
          res.send(doc);
        }
      });
    })

    .post(async function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      if (comment != '') {
        let b = await Book.findById(bookid, function(err, doc) {
          if (err) {
            res.json({message: 'not book found'});
          } else {
            doc.comments.push(comment);
            res.send(doc);
          }
        });
        let counter = b.commentcount;
        b.comments.push(comment);
        b.commentcount = counter + 1;
        b.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      } else {
        res.json({message: 'You need to add a comment'});
      }
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      Book.findByIdAndDelete({_id: bookid}, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.send('delete successful');
        }
      });
    });
};
