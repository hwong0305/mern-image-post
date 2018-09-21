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
