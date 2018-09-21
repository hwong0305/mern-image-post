# MERN Shopping List

## Theory and Requirements

This application is built based off Traversy's Media MERN stack video series with a key differences.

1. This application will use firebase for user authentication instead of writing custom code.
2. The React component UI library will be using MATERIAL-UI instead of using ReactStrap.
3. The user state will be kept track of using redux on the front end.
4. The application will host image files with three different aspect ratios.

The purpose of the application is to explore the usage of Google's Firebase Authentication system on the back end while using React as the frontend library.

## Test Application

This application uses the MERN stack combined with Firebase (for fun) to build a simple application that emulates instagram.

To run the application locally, `git clone` into a local directory.

In the root folder run:

```
npm install
```

then change directory into the client folder run:

```
npm install
```

then change directory back to the root folder and run `npm run dev` and the server will start running.

## Tutorial

Layout for the tutorial.

1. [Setup Directory](#1.-Setup-the-Directory)
2. [Setup Back End](#2.-Setup-the-Server-directory)
3. [Setup Front End](#3.-Setup-the-Frontend)
4. Connect Backend to Frontend
5. Deploying to Heroku

### 1. Setup the Directory

```
mkdir mydirectory
npm init
```

Follow the prompt to create the Package.JSON file.

### 2. Setup the Server directory

```
mkdir server
mkdir server/src
```

Change directory into the server

```
cd server
```

Install all the required dependencies for the server.

```
npm install --save express body-parser cors morgan mongoose jsonwebtoken passport firebase passport-jwt
npm install -D nodemon
```

Checkout the code below to setup the server

```
touch src/app.js
```

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebase = require('firebase');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Initailizing the Express Application
const app = express();

// BodyParser middleware for handling JSON response.
app.use(bodyParser.json());

// Logging middleware. This logs any request to the server to the console.
app.use(morgan('combined'));

// For development only.
app.use(cors());
```

Setup the system variables.

```
mkdir src/config
touch src/config/config.js
```

Enter the system variables in the config file as follow.

```javascript
module.exports = {
    port: process.env.PORT || 8081,
    mongoURI: <<mongoURI>>, // MongoDB connection,
    firebase: {} // Firebase Auth Object
};
```

Complete the server setup as follow.

```diff
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebase = require('firebase');
const morgan = require('morgan');
const mongoose = require('mongoose');
+ const config = require('./config/config');
+ const routes = require('./routes');

// Initailizing the Express Application
const app = express();

// BodyParser middleware for handling JSON response.
app.use(bodyParser.json());

// Logging middleware. This logs any request to the server to the console.
app.use(morgan('combined'));

// For development only.
app.use(cors());

+ mongoose.connect(config.mongoURI);
+ const db = mongoose.connection;

+ firebase.initializeApp(config.firebase);

+ db.on('error', console.error.bind(console, 'connection error:'))
+ db.once('connected', () => console.log('MongoDB connected'))

+ app.use('/api', routes); // TODO: complete route file.

+ app.listen(config.port, () =>
+    console.log(`Listening on Port ${config.port}`));
```

Before the routes are generated, what happens in the backend needs to be defined.

First create the required controller files

```
mkdir src/controllers
touch src/controllers/authController.js
touch src/controllers/postController.js
```

The authController file will contain all the functionality from firebase for user authentication: register, login, and logout.

```javascript
const firebase = require('firebase');
const validator = require('validator');

module.exports = {
    async register(req, res) {
        try {
            if (!validator.isEmail(req.body.email)) {
                res.status(400).send({
                    error: 'Invalid Email'
                });
            } else if (req.body.password.length === 0) {
                res.status(400).send({
                    error: 'Invalid Password'
                });
            } else {
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        req.body.email,
                        req.body.password
                    );
                res.send({
                    success: true
                });
            }
        } catch (error) {
            res.status(500).send({
                code: error.code,
                message: error.message
            });
        }
    },

    async login(req, res) {
        try {
            if (!validator.isEmail(req.body.email)) {
                res.status(400).send({
                    error: 'Invalid Email'
                });
            } else if (req.body.password.length === 0) {
                res.status(400).send({
                    error: 'Invalid Password'
                });
            } else {
                const user = await firebase
                    .auth()
                    .signInWithEmailAndPassword(
                        req.body.email,
                        req.body.password
                    );
                const response = await firebase.auth().currentUser.getIdToken();
                const userResponse = {
                    token: response,
                    id: user.user.uid
                };
                res.send(userResponse);
            }
        } catch (error) {
            res.status(500).send({
                code: error.code,
                message: error.message
            });
        }
    },

    async logout(req, res) {
        try {
            await firebase.auth().signOut();
        } catch (err) {
            res.status(500).send({
                message: 'An error occured while signing out'
            });
        }
    }
};
```

All the Mongoose actions are listed in the PostController. Enter the following code for the PostController. This file contains the logic for CRUD (Create, Read, Update, Delete) operations to the database.

```javascript
const Post = require('../models/post');

module.exports = {
    async findAllPosts(req, res) {
        try {
            const posts = await Post.find();
            res.send(posts);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured getting all the posts.'
            });
        }
    },

    async getPosts(req, res) {
        try {
            const posts = await Post.find({
                uid: req.params.id
            });
            res.send(posts);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured getting all the posts.'
            });
        }
    },

    async createPost(req, res) {
        try {
            const post = await Post.create({
                uid: req.body.uid,
                img: req.body.img,
                title: req.body.title,
                author: req.body.author,
                cols: req.body.cols,
                aspectRatio: req.body.aspectRatio,
                description: req.body.description
            });
            res.send(post);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured creating a post'
            });
        }
    },

    async updatePost(req, res) {
        try {
            const post = await Post.findById(req.body._id);
            await post.updateOne({
                img: req.body.img,
                title: req.body.title,
                author: req.body.author,
                cols: req.body.cols,
                aspectRatio: req.body.aspectRatio,
                description: req.body.description
            });
            res.send(post);
        } catch (err) {
            res.status(500).send({
                message: 'An error while updating the post'
            });
        }
    },

    async findPost(req, res) {
        try {
            const post = await Post.findOne({
                _id: req.params.id
            });
            res.send(post);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured getting all the posts'
            });
        }
    },

    async deletePost(req, res) {
        try {
            const post = await Post.findOne({
                _id: req.body._id
            });
            post.remove();
            res.send({
                success: true
            });
        } catch (err) {
            res.status(500).send({
                success: false
            });
        }
    }
};
```

Now, for the backend to receive and respond to requests from the frontend, a routes file needs to be created. The route files contains all the endpoints in which the backend item can be responded too.

For this application, the action logic is stored in the controller and the routes file will call the functions in the controller to implement the actions.

Paste the code below to build the routes file logic. This application is using the express.Router() object.

```
touch src/routes.js
```

```javascript
const express = require('express');
const router = express.Router();

const authController = require('./controllers/authController');
const postController = require('./controllers/postController');
const isAuthenticated = require('./policies/authPolicy');

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/post', postController.findAllPosts);

router.get(
    '/post/:id',
    isAuthenticated.isAuthenticated,
    postController.getPosts
);

router.post(
    '/post/add',
    isAuthenticated.isAuthenticated,
    postController.createPost
);

router.put(
    '/post/update',
    isAuthenticated.isAuthenticated,
    postController.updatePost
);

router.get('/post/find/:id', postController.findPost);

router.delete(
    '/post/delete',
    isAuthenticated.isAuthenticated,
    postController.deletePost
);

router.get('/logout', authController.logout);

module.exports = router;
```

Create the post model.

```
mkdir src/models
touch src/models/posts.js
```

Then populate the files.

```javascript
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    uid: String,
    img: String,
    title: String,
    author: String,
    cols: Number
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
```

Complete the backend by populating the routes files

```diff
const express = require('express');
const router = express.Router();
+ const firebase = require('firebase');
+ const Post = require('./models/post');

- router.post('/users/register', (req, res) => {
+ router.post('/users/register', async (req,res) => {
+    try {
+        const response = await firebase
+            .auth()
+            .createUserWithEmailAndPassword(req.body.email, req.body.password);
+        res.send(response);
+    } catch (error) {
+        res.status(500).send({
+            code: error.code,
+            message: error.message
+        });
+    }
});

- router.post('/users/login', (req, res) => {
+ router.post('/users/login', async (req, res) =>
-    res.send('LOGIN USER');
+    try {
+        const response = await firebase
+            .auth()
+            .signInWithEmailAndPassword(
+                req.body.email, req.body.password);
+        res.send(response);
+    } catch (error) {
+        res.status(500).send({
+            code: error.code,
+            message: error.message
+        });
+    }
});

- router.get('/posts', (req, res) => {
+ router.get('/posts', async (req, res) => {
-   res.send('POST');
+    try {
+        const posts = await Post.find();
+        res.send(posts);
+    } catch (err) {
+        res.status(500).send({
+            message: 'An error occured getting all the posts.'
+        });
+    }
});

- router.get('/post/:id', (req, res) => {
+ router.get('/post/:id', async (req, res) => {
-     res.send('A POST');
+     try {
+         const posts = await Post.find({
+             uid: req.params.id
+         });
+         res.send(posts);
+     } catch (err) {
+         res.status(500).send({
+             message: 'An error occured getting a post.'
+         });
+     }
+ });

- router.post('/posts/add', (req, res) => {
+ router.post('/posts/add', async (req, res) => {
-    res.send('ADD POST');
+    try {
+        const post = await Post.create({
+            uid: req.body.uid,
+            img: req.body.img,
+            title: req.body.title,
+            author: req.body.author,
+            cols: req.body.cols
+        });
+        res.send(post);
+    } catch (err) {
+        res.status(500).send({
+            message: 'An error occured creating a post'
+        });
+    }
});

- router.put('/posts/update', (req, res) => {
+ router.put('/posts/update', async (req, res) => {
-    res.send('UPDATE POST');
+    try {
+        const post = await Post.findById(req.body._id);
+        await post.update({
+            img: req.body.img,
+            title: req.body.title,
+            author: req.body.author,
+            cols: req.body.cols
+        });
+        res.send(post);
+    } catch (err) {
+        res.status(500).send({
+            message: 'An error updated the post'
+        });
+    }
});

- router.delete('/posts/delete', (req, res) => {
+ router.delete('/posts/delete', async (req, res) => {
-    res.send('DELETE POST');
+    try {
+        const post = await Post.findById(req.body._id);
+        await post.remove();
+        res.send({
+            message: 'Success'
+        });
+    } catch (err) {
+        res.status(500).send({
+            message: 'An error occured deleting the post'
+        });
+    }
});

+ module.exports = router;
```

This completes the backend application.

## 3. Setup the Frontend

Change directory back to the project root.

```
cd ..
```

Install Create-React-App. You can skip this step if create-react-app is already installed.

```
npm install -g create-react-app
```

Initailize the React Application in a client folder.

```
create-react-app client
```

This will install React App into the client folder.

Let's change directory into the client folder.

```
cd client
```

Following instructons on the Material-UI [website](https://material-ui.com/getting-started/installation/).

Install the library in the terminal and the icons.

```
npm install @material-ui/core @material-ui/icons
```

Update the `index.js` file by adding the two lines above the `</head>`.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

Create components, views, and service directories in the client folder simliar to the image below. Also create stores module which will contain the logic to redux.

```
client
── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.jsx
    ├── App.test.js
    ├── components
    │   ├── AppNavBar.jsx
    │   ├── ImageGrid.jsx
    │   └── IndividualImage.jsx
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── registerServiceWorker.js
    ├── services
    │   ├── Api.js
    │   ├── postService.js
    │   └── userService.js
    ├── stores
    │   ├── actions
    │   │   └── index.js
    │   └── reducers
    │       └── index.js
    └── views
        ├── createPost.jsx
        ├── editPost.jsx
        ├── home.jsx
        ├── login.jsx
        ├── postInfo.jsx
        ├── register.jsx
        ├── sampleData.js
        └── template.jsx
```

First step of setting up the front end is to install all the dependencies.

Install the React Router DOM

```
npm install react-router-dom
```

Install React-Redux

```
npm install react-redux redux
```

Install Material-Ui

```
npm install @material-ui/core @material-ui/icons
```

Add the following stylesheets to index.html

```html
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

Then, setting up the frontend and the routing

If any further explanation of React is required please click [here](https://reactjs.org/).

This repostiory will be a sample of how the front end is built. Please note, I used the JSX extension because it differntials the files from basic Javascrpt.

This file uses the React-Router module to render the different components for diferent pages. The NavBar is placed at this level so they do not have to be called out in each component.

Note: The documentation for Material-UI can be found [here](https://material-ui.com/)

```jsx
// App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import CreatePost from './views/createPost';
import PostInfo from './views/postInfo';
import EditPost from './views/editPost';
import './App.css';

import AppNavBar from './components/AppNavBar';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <AppNavBar />
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route exact path="/post" component={CreatePost} />
                    <Route exact path="/post/:id" component={PostInfo} />
                    <Route path="/post/edit/:id" component={EditPost} />
                </div>
            </Router>
        );
    }
}

export default App;
```

In this application, the views folder contain the components for each different page. The components folder contain reusable components that can be used in multiple pages or variants of pages.

Below are the list of code for each component

```jsx
// AppNavBar.jsx
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

import { connect } from 'react-redux';
import { Logout } from '../stores/actions';

import userService from '../services/userService';

const styles = {
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
};

class AppNavBar extends Component {
    render() {
        const { classes } = this.props;
        let navButton;
        if (this.props.loggedIn) {
            navButton = (
                <Button
                    color="inherit"
                    onClick={event => {
                        event.preventDefault();
                        userService
                            .logout()
                            .then(response => this.props.Logout())
                            .catch(error =>
                                alert('An error occured while logging out')
                            );
                    }}
                >
                    Sign Out
                </Button>
            );
        } else {
            navButton = (
                <React.Fragment>
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                    <Button color="inherit" component={Link} to="/register">
                        Register
                    </Button>
                </React.Fragment>
            );
        }
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            component={Link}
                            to="/"
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={classes.grow}
                        >
                            Posts
                        </Typography>
                        {navButton}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

AppNavBar.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    loggedIn: state.loggedIn,
    token: state.token
});

const mapDispatchToProps = dispatch => ({
    Logout: () => dispatch(Logout())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AppNavBar));
```

```jsx
// ImageGrid.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginTop: '5%'
    },
    gridList: {
        width: 750,
        height: 'auto'
    },
    subHeader: {
        height: '60px !important',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
};

class ImageGrid extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <GridList
                    cellHeight={250}
                    className={classes.gridList}
                    cols={3}
                >
                    <GridListTile
                        style={{ height: '60px' }}
                        key="Subheader"
                        cols={2}
                    >
                        <ListSubheader component="h1" color="inherit">
                            Instaposts
                        </ListSubheader>
                    </GridListTile>
                    <GridListTile
                        key="Icon"
                        cols={1}
                        className={classes.subHeader}
                    >
                        <IconButton component={Link} to="/post">
                            <AddIcon />
                        </IconButton>
                    </GridListTile>
                    {this.props.dataList.map(data => (
                        <GridListTile key={data.img} cols={data.cols}>
                            <img
                                src={data.img}
                                alt={data.title}
                                style={{ backgroundSize: 'cover' }}
                            />
                            <GridListTileBar
                                actionIcon={
                                    <IconButton
                                        component={Link}
                                        to={`/post/${data._id}`}
                                    >
                                        <InfoIcon style={{ color: 'white' }} />
                                    </IconButton>
                                }
                                actionPosition="right"
                                style={{ opacity: 0.6 }}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        );
    }
}

ImageGrid.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageGrid);
```

Note: in the code above `<React.Fragment> allows the users to render multiple children within one component without creating a wrapper element like div`.

```jsx
// IndividualImage.jsx
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    mediaPortrait: {
        minHeight: 450,
        height: '90%',
        minWidth: 360,
        width: '72%',
        backgroundColor: '#000',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    },
    mediaLandscape: {
        minHeight: 360,
        height: '72%',
        minWidth: 450,
        width: '90%',
        backgroundColor: '#000',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    },
    mediaSquare: {
        minHeight: 450,
        height: '90%',
        minWidth: 450,
        width: '100%',
        backgroundColor: '#000',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }
};

class IndividualImage extends Component {
    render() {
        const { classes } = this.props;
        let image;
        if (this.props.imageClass === 1) {
            image = classes.mediaPortrait;
        } else if (this.props.imageClass === 2) {
            image = classes.mediaLandscape;
        } else {
            image = classes.mediaSquare;
        }
        return (
            <div
                style={{ backgroundImage: `url(${this.props.img})` }}
                className={image}
            />
        );
    }
}

export default withStyles(styles)(IndividualImage);
```

```jsx
// createPost.jsx
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import postService from '../services/postService';

const styles = {
    root: {
        width: '35%',
        textAlign: 'center',
        padding: '30px'
    },
    button: {
        marginTop: '30px'
    }
};

const aspectRatio = [
    {
        value: 1,
        label: 'Portrait'
    },
    {
        value: 2,
        label: 'Landscape'
    },
    {
        value: 3,
        label: 'Square'
    }
];

class createPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: '',
            title: '',
            author: '',
            description: '',
            aspectRatio: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    onSubmit() {
        const submission = {
            uid: this.props.id,
            img: this.state.img,
            title: this.state.title,
            author: this.state.author,
            description: this.state.description,
            aspectRatio: this.state.aspectRatio
        };
        postService
            .addPost(submission)
            .then(response => {
                console.log(response);
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error);
                alert('An error occured adding a post');
            });
    }
    render() {
        const { classes } = this.props;
        if (!this.props.loggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="container">
                <Paper className={classes.root}>
                    <Typography variant="title">Add Post</Typography>
                    <TextField
                        name="img"
                        value={this.state.img}
                        onChange={this.onChange}
                        label="Image Url"
                        fullWidth
                    />
                    <TextField
                        name="title"
                        value={this.state.title}
                        onChange={this.onChange}
                        label="Title"
                        fullWidth
                    />
                    <TextField
                        name="author"
                        value={this.state.author}
                        onChange={this.onChange}
                        label="Author"
                        fullWidth
                    />
                    <TextField
                        name="description"
                        value={this.state.description}
                        onChange={this.onChange}
                        label="Description"
                        fullWidth
                    />
                    <TextField
                        name="aspectRatio"
                        select
                        label="Aspect Ratio"
                        value={this.state.aspectRatio}
                        onChange={this.onChange}
                        fullWidth
                    >
                        {aspectRatio.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={this.onSubmit}
                    >
                        Submit
                    </Button>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
        id: state.id
    };
};

export default connect(mapStateToProps)(withStyles(styles)(createPost));
```

```jsx
// editPost.jsx
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import postService from '../services/postService';

const styles = {
    root: {
        width: '35%',
        textAlign: 'center',
        padding: '30px'
    },
    button: {
        marginTop: '30px'
    }
};

const aspectRatio = [
    {
        value: 1,
        label: 'Portrait'
    },
    {
        value: 2,
        label: 'Landscape'
    },
    {
        value: 3,
        label: 'Square'
    }
];

class editPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            img: '',
            title: '',
            author: '',
            description: '',
            aspectRatio: 0
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    onSubmit() {
        const submission = {
            uid: this.props.token,
            _id: this.state.id,
            img: this.state.img,
            title: this.state.title,
            author: this.state.author,
            description: this.state.description,
            aspectRatio: this.state.aspectRatio
        };
        postService
            .editPost(submission)
            .then(response => this.props.history.goBack())
            .catch(error => console.log(error) || alert('Server error'));
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        postService
            .getPost(id)
            .then(response => {
                response.data.id = id;
                this.setState(response.data);
            })
            .catch(error =>
                alert('An error has occured. Please contact site adminstrator')
            );
    }
    render() {
        const { classes } = this.props;
        if (!this.props.loggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="container">
                <Paper className={classes.root}>
                    <Typography variant="title">Edit Post</Typography>
                    <TextField
                        name="img"
                        value={this.state.img}
                        onChange={this.onChange}
                        label="Image Url"
                        fullWidth
                    />
                    <TextField
                        name="title"
                        value={this.state.title}
                        onChange={this.onChange}
                        label="Title"
                        fullWidth
                    />
                    <TextField
                        name="author"
                        value={this.state.author}
                        onChange={this.onChange}
                        label="Author"
                        fullWidth
                    />
                    <TextField
                        name="description"
                        value={this.state.description}
                        onChange={this.onChange}
                        label="Description"
                        fullWidth
                    />
                    <TextField
                        select
                        name="aspectRatio"
                        label="Aspect Ratio"
                        value={this.state.aspectRatio}
                        onChange={this.onChange}
                        fullWidth
                    >
                        {aspectRatio.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={this.onSubmit}
                    >
                        Submit
                    </Button>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
        token: state.token
    };
};

export default connect(mapStateToProps)(withStyles(styles)(editPost));
```

```jsx
// home.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImageGrid from '../components/ImageGrid';

import postService from '../services/postService';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sample: [],
            loggedIn: true
        };
    }
    async componentDidMount() {
        try {
            console.log(this.props);
            const response = await postService.findPosts(this.props.id);
            this.setState({
                sample: response.data
            });
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let image;
        if (this.props.loggedIn) {
            image = <ImageGrid dataList={this.state.sample} />;
        } else {
            image = <p className="App">Please Sign In!</p>;
        }
        return <div>{image}</div>;
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.loggedIn,
        token: state.token,
        id: state.id
    };
}

export default connect(mapStateToProps)(Home);
```

```jsx
// login.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import Button from '@material-ui/core/Button';

import userService from '../services/userService';
import { connect } from 'react-redux';
import { Login } from '../stores/actions';

const styles = {
    root: {
        width: '35%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px'
    },
    avatar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    avatarIcon: {
        background: 'red'
    },
    button: {
        marginTop: '30px'
    },
    form: {
        width: '100%',
        marginTop: '10px'
    },
    title: {
        marginTop: '10px'
    }
};

export class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async onSubmit() {
        try {
            const response = await userService.login(
                this.state.email,
                this.state.password
            );
            this.props.onLogin(response.data);
            this.props.history.push('/');
        } catch (error) {
            alert('Incorrect Login Information');
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="container">
                <Paper className={classes.root}>
                    <div className={classes.avatar}>
                        <Avatar className={classes.avatarIcon}>
                            <LockIcon />
                        </Avatar>
                    </div>
                    <div>
                        <Typography variant="title" className={classes.title}>
                            Login
                        </Typography>
                    </div>
                    <div className={classes.form}>
                        <TextField
                            label="E-mail"
                            value={this.state.email}
                            onChange={this.onChange}
                            name="email"
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            value={this.state.password}
                            onChange={this.onChange}
                            type="password"
                            name="password"
                            fullWidth
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.onSubmit}
                    >
                        Submit
                    </Button>
                </Paper>
            </div>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        loggedIn: state.loggedIn,
        token: state.token,
        id: state.id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLogin: function(user) {
            dispatch(Login(user));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(LoginForm));
```

```jsx
// postInfo.jsx
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import IndividualImage from '../components/IndividualImage';
import postService from '../services/postService';

const styles = {
    card: {
        boxShadow:
            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        marginTop: 10
    }
};

class PostInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            img: '',
            author: '',
            description: '',
            aspectRatio: ''
        };

        this.deletePost = this.deletePost.bind(this);
    }
    componentWillMount() {
        postService
            .getPost(this.props.match.params.id)
            .then(response => {
                if (
                    this.props.id !== response.data.uid &&
                    this.props.loggedIn
                ) {
                    alert('You do not have access to this picture');
                    this.props.history.goBack();
                }
                this.setState({
                    id: response.data._id,
                    title: response.data.title,
                    img: response.data.img,
                    author: response.data.author,
                    description: response.data.description,
                    aspectRatio: response.data.aspectRatio
                });
            })
            .catch(error => console.log(error));
    }
    deletePost() {
        const { id } = this.state;
        postService
            .deletePost(id)
            .then(response => this.props.history.push('/'))
            .catch(error => alert('An error occured when deleting the post'));
    }
    render() {
        // TODO: Implememt a way for user to select aspect ratio for image. For the purpose of this applicaiton, it will be hardcoded in.
        const { classes } = this.props;
        if (!this.props.loggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="container">
                <Paper className={classes.card}>
                    <IndividualImage
                        imageClass={this.state.aspectRatio}
                        img={this.state.img}
                    />
                    <div>
                        <Button
                            color="primary"
                            component={Link}
                            to={`/post/edit/${this.state.id}`}
                        >
                            Edit
                        </Button>
                        <Button color="secondary" onClick={this.deletePost}>
                            Delete
                        </Button>
                    </div>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loggedIn: state.loggedIn,
    id: state.id
});

export default withStyles(styles)(connect(mapStateToProps)(PostInfo));
```

```jsx
// register.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import Button from '@material-ui/core/Button';

import userService from '../services/userService';

const styles = {
    root: {
        width: '35%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px'
    },
    avatar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    avatarIcon: {
        background: 'red'
    },
    button: {
        marginTop: '30px'
    },
    form: {
        width: '100%',
        marginTop: '10px'
    },
    title: {
        marginTop: '10px'
    }
};

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async onSubmit() {
        try {
            await userService.register(this.state.email, this.state.password);
            this.props.history.push('/login');
        } catch (error) {
            alert('Invalid registration information');
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="container">
                <Paper className={classes.root}>
                    <div className={classes.avatar}>
                        <Avatar className={classes.avatarIcon}>
                            <LockIcon />
                        </Avatar>
                    </div>
                    <div>
                        <Typography variant="title" className={classes.title}>
                            Register
                        </Typography>
                    </div>
                    <div className={classes.form}>
                        <TextField
                            name="email"
                            value={this.state.email}
                            onChange={this.onChange}
                            label="E-mail"
                            fullWidth
                        />
                        <TextField
                            name="password"
                            value={this.state.password}
                            onChange={this.onChange}
                            label="Password"
                            type="password"
                            fullWidth
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onSubmit}
                        className={classes.button}
                    >
                        Submit
                    </Button>
                </Paper>
            </div>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Register);
```

To explain some of the code in the components, the items _mapStateToProps_ and _mapDispatchToProps_ access the redux module which will be defined in the next section.

The _userService_ and _postService_ uses the library axios to connect the frontend to the backend which will be covered in the next section.

First, define the redux parameter files.

1. Define the actions and the action types.

This are the types of interactions defined for redux

```javascript
// actions
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function Login(payload) {
    return {
        type: LOGIN,
        payload
    };
}

export function Logout() {
    return {
        type: LOGOUT
    };
}
```

2. Define the reducer.

The reducer define what each action does. For react, state needs to be immutable so always return a brand new object that is a copy of an exisiting object.

```javascript
import { LOGIN, LOGOUT } from '../actions';

const initialState = {
    loggedIn: false,
    id: null,
    token: null
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                loggedIn: true,
                token: action.payload.token,
                id: action.payload.id
            };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default auth;
```

3. Then we need to make sure the _store_ and _reducer_ is passed to Index.js. The redux store is passed to the application as a Provider.

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import reducers from './stores/reducers';
import { Provider } from 'react-redux';

const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
```

Note: _mapStateToProps_ needs to be called in each component that reads from the store. _mapDispatchToProps_ needs to be called in each component that performs an option.

The code above already contains the logic to connect the backend to the frontend. Here are the code that defines the logic.

## 4. Connect the Backend to the Frontend

Install axios, which is a HTTP library for clients by typing `npm install axios` into the terminal.

Create the base instance for axios.

```javascript
// services/Api.js
import axios from 'axios';

export default () =>
    axios.create({
        baseURL: 'http://localhost:8081'
    });
```

Then define the endpoint to be called for Authentication Actions

```javascript
// userService.js
import Api from './Api';

export default {
    login(email, password) {
        return Api().post('http://localhost:8081/api/login', {
            email,
            password
        });
    },
    register(email, password) {
        return Api().post('http://localhost:8081/api/register', {
            email,
            password
        });
    },
    logout() {
        return Api().get('http;//localhost:8081/api/logout');
    }
};
```

Finally define the endpoint to be called for Post Actions

```javascript
import Api from './Api';

export default {
    getPosts() {
        return Api().get('/api/post');
    },

    findPosts(id) {
        return Api().get(`/api/post/${id}`);
    },

    addPost(submission) {
        return Api().post('/api/post/add', submission);
    },

    getPost(id) {
        return Api().get(`/api/post/find/${id}`);
    },

    deletePost(id) {
        return Api().delete('/api/post/delete/', { data: { _id: id } });
    },

    editPost(submission) {
        return Api().put('/api/post/update', submission);
    }
};
```

Now the app is fully functional.

Finally, setup the package.json for the application to run both the back and front end in one command.

```JSON
{
    "name": "postingapp",
    "version": "1.0.0",
    "description": "A MERN instagram post app.",
    "main": "app.js",
    "scripts": {
        "start": "node src/app",
        "server": "nodemon src/app",
        "client": "npm run start --prefix client",
        "dev": "concurrently \"npm run server\" \"npm run client\""
    },
    "author": "hwong0305",
    "license": "MIT",
    "dependencies": {
        "body-parser": "^1.18.3",
        "concurrently": "^4.0.1",
        "cors": "^2.8.4",
        "express": "^4.16.3",
        "firebase": "^5.5.0",
        "jsonwebtoken": "^8.3.0",
        "mongoose": "^5.2.15",
        "morgan": "^1.9.1",
        "passport": "^0.4.0",
        "passport-jwt": "^4.0.0",
        "validator": "^10.7.1"
    },
    "devDependencies": {
        "nodemon": "^1.18.4"
    }
}
```
