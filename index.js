import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// In-memory store for posts
let posts = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes

// Home Page - Display all posts
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Render the Create Post page
app.get('/create', (req, res) => {
  res.render('create.ejs');
});

// Handle Create Post submission
app.post('/create', (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: Date.now(), title, content };
  posts.push(newPost);
  res.redirect('/');
});

app.get('/posts', (req, res) => {
  res.render('posts.ejs', { posts });
});

// Render a single post by ID
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render('posts.ejs', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Edit a post
app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render('edit.ejs', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.post('/edit/:id', (req, res) => {
  const { title, content } = req.body;
  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (postIndex !== -1) {
    posts[postIndex] = { id: posts[postIndex].id, title, content };
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

// Delete a post
app.post('/delete/:id', (req, res) => {
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
