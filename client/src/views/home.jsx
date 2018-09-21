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
