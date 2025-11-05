const express = require('express');
const router = express.Router();
 	
let books = [
 	{id: 1, title: 'Book 1', author: 'Author 1'},
 	{id: 2, title: 'Book 2', author: 'Author 2'}
];
let nextId = 3; 
 	

router.get('/', (req, res) => {
    
    
    // Kode asli di bawah ini tidak akan pernah dijalankan selama tes
    
 	res.json(books);
});
 	
router.get('/:id', (req, res) => {
 	const book = books.find(b => b.id === parseInt(req.params.id));
 	if (!book) return res.status(404).send('Book not found');
 	res.json(book);
});
 	
// POST /api/books
router.post('/', (req, res) => {
    const { title, author } = req.body;

    // VALIDASI: Cek apakah title dan author ada, dan bukan string kosong
    if (!title || !author || typeof title !== 'string' || typeof author !== 'string' || title.trim() === '' || author.trim() === '') {
        return res.status(400).json({ message: 'Title and author are required and must be non-empty strings.' });
    }

    const newBook = {
        id: nextId++,
        title: title.trim(), // Membersihkan spasi di awal/akhir
        author: author.trim()
    };
    books.push(newBook);
    res.status(201).json(newBook);
});
 	
// PUT /api/books/:id
router.put('/:id', (req, res) => {
    // VALIDASI ID: Cek apakah ID adalah angka yang valid
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
        return res.status(400).json({ message: 'ID must be a valid number.' });
    }

    // VALIDASI BODY: Cek title dan author
    const { title, author } = req.body;
    if (!title || !author || typeof title !== 'string' || typeof author !== 'string' || title.trim() === '' || author.trim() === '') {
        return res.status(400).json({ message: 'Title and author are required and must be non-empty strings.' });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex] = { 
            id: bookId, 
            title: title.trim(), 
            author: author.trim() 
        };
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// DELETE /api/books/:id
router.delete('/:id', (req, res) => {
    // VALIDASI ID: Cek apakah ID adalah angka yang valid
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
        return res.status(400).json({ message: 'ID must be a valid number.' });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        res.status(204).send(); // 204 No Content
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});



module.exports = router;
