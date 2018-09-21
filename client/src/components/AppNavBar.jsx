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
