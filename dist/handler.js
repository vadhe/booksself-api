"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { nanoid } = require("nanoid");
const { dbBooks } = require("./book-store");
const isFinished = (pageCount, readPage) => {
    if (pageCount === readPage)
        return true;
    else
        return false;
};
const storeBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = isFinished(pageCount, readPage);
    const id = nanoid(16);
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt,
        finished,
    };
    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }
    dbBooks.push(newBook);
    const isSuccess = dbBooks.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const paramName = request.query.name;
    if (paramName !== undefined) {
        const dataBook = dbBooks.filter((book) => book.name.toLowerCase().includes(paramName.toLowerCase()))
            .map((book) => ({
            bookId: book.id,
            name: book.name,
            publisher: book.publisher
        }));
        const response = h.response({
            status: "success",
            message: "Buku with Query Name",
            data: {
                books: dataBook
            }
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Buku gagal di tambahkan. Kesalahan internal",
    });
    response.code(500);
    return response;
};
const readBooks = (request, h) => {
    const result = {
        status: "success",
        data: {
            books: dbBooks,
        },
    };
    const response = h.response({
        status: "success",
        data: {
            books: dbBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    return response;
};
const readBook = (request, h) => {
    const { id } = request.params;
    const book = dbBooks.filter((book) => book.id === id)[0];
    if (book !== undefined) {
        const response = h.response({
            status: "success",
            data: {
                book: book,
            },
        });
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};
const editBook = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = dbBooks.findIndex((book) => book.id === id);
    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }
    if (index !== -1 && name) {
        dbBooks[index] = Object.assign(Object.assign({}, dbBooks[index]), { name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading });
        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};
const deleteBook = (request, h) => {
    const { id } = request.params;
    const index = dbBooks.findIndex((book) => book.id === id);
    if (index !== -1) {
        dbBooks.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
module.exports = { storeBook, readBooks, readBook, editBook, deleteBook };
