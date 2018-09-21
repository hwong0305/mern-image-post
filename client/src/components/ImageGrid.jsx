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
