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
