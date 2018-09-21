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
