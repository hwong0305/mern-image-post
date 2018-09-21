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
