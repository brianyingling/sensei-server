const { filter, find } = require('lodash');
const books = require('../mocks/books.json');
const Query = require('./Query');
const resolvers = {
    Query,
    Author: {
        books(author) {
            return filter(books, { author: author.name });
        }
    }
}

module.exports = resolvers;