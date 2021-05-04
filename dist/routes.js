"use strict";
const { ServerRoute, ResponseToolkit } = require("@hapi/hapi");
const { storeBook, readBooks, readBook, editBook, deleteBook } = require("./handler");
const routes = [
    {
        method: "POST",
        path: "/books",
        handler: storeBook,
    },
    {
        method: "GET",
        path: "/books",
        handler: readBooks,
    },
    {
        method: "GET",
        path: "/books/{id}",
        handler: readBook,
    },
    {
        method: "PUT",
        path: "/books/{id}",
        handler: editBook,
    },
    {
        method: "DELETE",
        path: "/books/{id}",
        handler: deleteBook,
    },
];
module.exports = routes;
