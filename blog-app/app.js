const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Helper function to read posts
function readPosts() {
    const data = fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf8');
    return JSON.parse(data);
}

// Helper function to write posts
function writePosts(posts) {
    fs.writeFileSync(
        path.join(__dirname, 'posts.json'),
        JSON.stringify({ posts }, null, 2)
    );
}

// Routes
app.get('/', (req, res) => {
    const { posts } = readPosts();
    res.render('home', { posts });
});

app.get('/posts', (req, res) => {
    const { posts } = readPosts();
    res.render('home', { posts });
});

app.get('/post', (req, res) => {
    const id = parseInt(req.query.id);
    const { posts } = readPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).send('Post not found');
    }
    
    res.render('post', { post });
});

app.get('/add-post', (req, res) => {
    res.render('addPost');
});

app.post('/add-post', (req, res) => {
    const { title, content, author } = req.body;
    const data = readPosts();
    
    const newPost = {
        id: data.posts.length + 1,
        title,
        content,
        author,
        date: new Date().toISOString().split('T')[0]
    };
    
    data.posts.push(newPost);
    writePosts(data.posts);
    
    res.redirect('/posts');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});