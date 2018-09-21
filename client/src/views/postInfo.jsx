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
