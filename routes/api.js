/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
let mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });


const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String]
});

const BookModel = mongoose.model("BookModel", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.find({}, function (err, booksFound) {
        if (err) {
          return console.log(err);
        } else if (booksFound) {
          let booksFoundWithCount = booksFound.map(function (book) {
            return {
              _id: book._id,
              title: book.title,
              // comments: book.comments,
              commentcount: book.comments.length
            }
          });
          return res.json(booksFoundWithCount);
        }
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!req.body.title) {
        return res.json("missing required field title");
      }
      let Book = new BookModel({ title: title, comments: [] });
      Book.save(function (err, savedBook) {
        if (err) {
          return console.log(err);
        }
        return res.json(savedBook);
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      BookModel.remove({}, function (err, result) {
        if (err) {
          return console.log(err);
        }
        return res.json("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid, function (err, bookFound) {
        if (err) {
          return console.log(err);
        }
        else if (!bookFound) {
          return res.json("no book exists");
        }
        else if (bookFound) {
          return res.json(bookFound);
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.json("missing required field comment");
      }
      BookModel.findById(bookid, function (err, bookFound) {
        if (err) {
          return console.log(err);
        }
        else if (!bookFound) {
          return res.json("no book exists");
        }
        bookFound.comments.push(comment);
        bookFound.save((err, updatedBook) => {
          if (err) {
            return console.log(err);
          }
          else if (updatedBook) {
            return res.json({
              comments: updatedBook.comments,
              _id: updatedBook._id,
              title: updatedBook.title,
              commentcount: updatedBook.comments.length
            });
          }
          // else if (updatedBook) {
          //   return res.json(updatedBook);
          // }
        });
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookModel.findByIdAndRemove(bookid, (err, bookFound) => {
        if (err) {
          return console.log(err);
        }
        else if (!bookFound) {
          return res.json("no book exists");
        }
        return res.json("delete successful");
      });
    });

};
