/**
 * File containing all book queries, mutations and subscriptions
 */

import { PubSub } from 'apollo-server';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import Book from '../../models/book';
import { transformBook } from './merge';

const pubsub = new PubSub();

const BOOK_ADDED = 'BOOK_ADDED';

/**
 * Book Queries
 */
const BookQueries = {
  books: async (parent, args, context) => {
    if (!context.isAuth) {
      throw new Error('Not Authenticated');
    }
    try {
      const books = await Book.find();
      return books.map((book) => {
        return transformBook(book);
      });
    } catch (err) {
      throw err;
    }
  },
  book: async (parent, { bookId }, context) => {
    if (!context.isAuth) {
      throw new Error('Not Authenticated');
    }
    try {
      const book = await Book.findById(bookId);
      return transformBook(book);
    } catch (err) {
      throw err;
    }
  }
};

/**
 * Book Mutations
 */
const BookMutation = {
  createBook: async (parent: any, { bookInput }: any) => {
    try {
      const book = await Book.findOne({
        email: bookInput.email
      });
      if (book) {
        throw new Error('Book already Exists');
      } else {
        console.log(bookInput.password);
        const newBook = new Book({
          _id: new mongoose.Types.ObjectId(),
          email: bookInput.email,
          firstName: bookInput.firstName,
          lastName: bookInput.lastName,
          flat: bookInput.flat,
          permissions: ['member'],
          password: await bcrypt.hash(bookInput.password, 10)
        });
        const savedBook = await newBook.save();
        pubsub.publish(BOOK_ADDED, {
          bookAdded: transformBook(savedBook)
        });
        const token = jwt.sign(
          {
            bookId: savedBook.id,
            name: savedBook.get('firstName'),
            permissions: savedBook.get('permissions')
          },
          config.jwtSecret,
          {
            expiresIn: '1d'
          }
        );
        return {
          bookId: savedBook.id,
          token,
          tokenExpiration: 1
        };
      }
    } catch (error) {
      throw error;
    }
  },
  login: async (parent, { email, password }) => {
    try {
      const book: any = await Book.findOne({ email });
      if (!book) {
        throw new Error('Book does not Exists');
      }

      const valid: boolean = await bcrypt.compare(password, book.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      const token = jwt.sign(
        {
          bookId: book.id,
          name: book.firstName,
          permissions: book.permissions
        },
        config.jwtSecret,
        {
          expiresIn: '1d'
        }
      );
      return {
        bookId: book.id,
        token,
        tokenExpiration: 1
      };
    } catch (err) {
      throw err;
    }
  },
  updateBook: async (parent, { bookId, updateBook }, context) => {
    // If not authenticated throw error
    if (!context.isAuth) {
      throw new Error('Not Authenticated');
    }
    try {
      const book = await Book.findByIdAndUpdate(bookId, updateBook, {
        new: true
      });
      return transformBook(book);
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Book Subscriptions
 */
const BookSubscription = {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
  }
};

export { BookQueries, BookMutation, BookSubscription };
