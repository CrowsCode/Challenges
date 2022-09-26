import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Card, CardActionArea, CardActions, CardMedia, CardContent, Paper, Fade, Backdrop, Typography, Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 150,
    minHeight: 200,
    display: 'flex',
    justifyContent: ' space-between',
    flexDirection: 'column',
    alignItems: 'center'
  },
  // media: {
  //   height: 110,
  // },
  modal: {
    // minHeight: 200,
    // minWidth: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // paper: {
  //   backgroundColor: theme.palette.background.paper,
  //   border: '2px solid #000',
  //   boxShadow: theme.shadows[5],
  //   padding: theme.spacing(2, 4, 3),
  // },
  b_modal_background: {
    backgroundColor: theme.palette.primary.light,
    padding: '20px'
  }
}));

export default function MediaCard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image={require("./images/roblox.jpg")}
            title="Contemplative Reptile"
          />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button size="small" color="primary" onClick={handleOpen}>Expand</Button>
      </CardActions>
   
      <Modal 
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.b_modal_background}>
            {props.children}
          </Paper>
        </Fade>
      </Modal>

    </Card>
  );
}