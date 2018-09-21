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
