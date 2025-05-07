const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// In-memory "database"
const users = {
    1: { id: 1, username: 'alice', password: 'pass123', role: 'user', email: 'alice@example.com' },
    2: { id: 2, username: 'bob', password: 'bobpass', role: 'user', email: 'bob@example.com' },
    3: { id: 3, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com' }
};

// Modify your routes to include currentUser:

app.get('/', (req, res) => {
    res.render('index', { currentUser: null }); // No user logged in at home
});

app.get('/login', (req, res) => {
    res.render('login', { currentUser: null, error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = Object.values(users).find(u => u.username === username && u.password === password);
    
    if (user) {
        res.redirect(`/profile/${user.id}`);
    } else {
        res.render('login', { currentUser: null, error: 'Invalid credentials' });
    }
});

app.get('/profile/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.render('profile', { user, currentUser: user }); // Pass the logged-in user
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/admin', (req, res) => {
    res.render('admin', { 
        users: Object.values(users),
        currentUser: null // Or implement real auth later
    });
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));