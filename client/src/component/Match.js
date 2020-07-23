// react
import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
// framework
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemText from "@material-ui/core/ListItemText";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContentText from "@material-ui/core/DialogContentText";

// icon
import SendIcon from "@material-ui/icons/Send";
import BlockIcon from "@material-ui/icons/Block";
import PersonIcon from "@material-ui/icons/Person";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const matchStyles = (theme) => ({
  loading: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    color: "#E63946",
  },
  root: {
    flexGrow: 1,
  },
  fullHeight: {
    height: "100%",
  },
  boxMatchList: {
    height: "100%",
    borderRight: "0.5px solid rgba(41, 41, 41, .5)",
  },
  matchesInfos: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  matchList: {
    padding: 0,
    overflow: "auto",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      textAlignLast: "center",
      overflowX: "hidden",
    },
  },
  matchListItem: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#FDC8B7",
    },
  },
  messagesContainer: {
    height: "100%",
    margin: "0 auto",
    display: "flex",
    flexFlow: "column",
  },
  userCard: {
    padding: "10px 0 10px 0",
  },
  userPhotoContainer: {
    textAlign: "-webkit-center",
  },
  userPhoto: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  },
  userHeaderTitle: {
    margin: 0,
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
  userHeaderCaption: {
    color: "#545454",
  },
  userCardMenuItem: {
    textDecoration: "none",
    color: "#545454",
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  footer: {
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignContent: "center",
  },
  footerContainer: {
    display: "flex",
    flexDirection: "row",
  },
  sendIcon: {
    color: "#FA7B38",
  },
  rootSend: {
    width: "100%",
  },
  borderBottom: {
    "&.MuiInput-underline:before": {
      borderBottom: "1px solid #FDC8B7",
    },
    "&.MuiInput-underline:after": {
      borderBottom: "1px solid #FA7B38",
    },
    "&.MuiInput-underline:hover::before": {
      borderBottom: "2px solid #E63946",
    },
    "&.MuiInput-underline:hover::after": {
      borderBottom: "1px solid #E63946",
    },
  },
});

const matchMessagesStyles = (theme) => ({
  root: {
    flex: 1,
    overflow: "auto",
  },
  loadMoreContainer: {
    width: "100%",
    marginBottom: 5,
    height: 40,
  },
  loadMoreButton: {
    width: "100%",
    borderRadius: 0,
    color: "#E63946",
  },
  noMessages: {
    textAlign: "center",
    padding: 30,
    fontWeight: 600,
    fontSize: 15,
  },
  renderMessageContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

const RenderMessageStyles = (theme) => ({
  root: {
    display: "flex",
    width: "70%",
    justifyContent: "flex-end",
  },
  senderDeleteMessage: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
  },
  receiverDeleteMessage: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
  },
  renderMessage: {
    width: "100%",
    wordWrap: "break-word",
    borderRadius: 8,
    margin: 5,
    padding: 5,
  },
  message: {
    margin: 0,
    fontSize: 15,
  },
  messageDate: {
    margin: 0,
    fontSize: 11,
    color: "#656565",
  },
  deleteIcon: {
    color: "#E63946",
  },
});

class RenderMessage extends Component {
  constructor() {
    super();
    this.state = {
      isMouseInside: false,
    };
  }
  _isMounted = false;

  handleMouseOverIn = () => {
    this.setState({ isMouseInside: true });
  };

  handleMouseOverOut = () => {
    this.setState({ isMouseInside: false });
  };

  componentDidMount = () => {
    this._isMounted = true;
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  render() {
    const {
      created_at,
      id,
      message,
      receiver_id,
      sender_id,
    } = this.props.message;
    const { selectedUser, classes } = this.props;
    const { isMouseInside } = this.state;

    return (
      <div
        onMouseEnter={this.handleMouseOverIn}
        onMouseLeave={this.handleMouseOverOut}
        className={classes.root}
        style={{
          alignSelf: sender_id === selectedUser ? "flex-start" : "flex-end",
          textAlign: sender_id === selectedUser ? "left" : "right",
        }}
      >
        {isMouseInside && sender_id !== selectedUser ? (
          <div className={classes.receiverDeleteMessage}>
            <IconButton
              onClick={() => {
                this.props.handleDeleteMessage(id, sender_id, receiver_id);
              }}
            >
              <DeleteForeverIcon
                className={classes.deleteIcon}
              ></DeleteForeverIcon>
            </IconButton>
          </div>
        ) : undefined}
        <Paper
          elevation={0}
          className={classes.renderMessage}
          style={{
            backgroundColor: sender_id === selectedUser ? "#FDC8B7" : "#B3CDCE",
          }}
        >
          <Typography className={classes.message} variant="body1" gutterBottom>
            {message}
          </Typography>
          <Typography
            className={classes.messageDate}
            variant="caption"
            display="block"
            gutterBottom
          >
            {moment(created_at).format("DD/MM/YYYY HH:mm:ss ")}
          </Typography>
        </Paper>
        {isMouseInside && sender_id === selectedUser ? (
          <div className={classes.senderDeleteMessage}>
            <IconButton
              onClick={() => {
                this.props.handleDeleteMessage(id, sender_id, receiver_id);
              }}
            >
              <DeleteForeverIcon
                className={classes.deleteIcon}
              ></DeleteForeverIcon>
            </IconButton>
          </div>
        ) : undefined}
      </div>
    );
  }
}

class MessageWithUser extends Component {
  constructor() {
    super();
    this.state = { msgList: false, limit: 20 };
  }

  _isMounted = false;
  RenderedMessages = withStyles(RenderMessageStyles)(RenderMessage);

  getMessages = (id, limit, refreshed) => {
    if (id) {
      fetch("/api/messages/get", {
        method: "POST",
        body: JSON.stringify({ receiver: id, limit: limit }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message.msgList === false) {
            this.setState({
              msgList: null,
              message: "",
              limit: limit,
            });
          } else {
            if (refreshed === true) {
              let current = JSON.stringify(this.state.msgList);
              let tmp = JSON.stringify(res.message);
              if (current === tmp) {
              } else {
                this.setState({
                  msgList: res.message,
                  message: "",
                  limit: limit,
                });
                if (limit === 20) {
                  let scrollDiv = document.getElementById("scrollMsgList");
                  scrollDiv.scrollTop = scrollDiv.scrollHeight;
                }
              }
            } else {
              this.setState({
                msgList: res.message,
                message: "",
                limit: limit,
              });
              if (limit === 20) {
                let scrollDiv = document.getElementById("scrollMsgList");
                scrollDiv.scrollTop = scrollDiv.scrollHeight;
              }
            }
          }
        })
        .catch((err) => this.props.auth.errorMessage(err));
    }
  };

  loadMoreMessages = () => {
    this.getMessages(this.props.selectedUser, this.state.limit + 20, false);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.selectedUser !== this.props.selectedUser ||
      prevProps.refreshMessages !== this.props.refreshMessages
    ) {
      this.getMessages(this.props.selectedUser, this.state.limit, false);
    }
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getMessages(this.props.selectedUser, this.state.limit);
      this.interval = setInterval(() => {
        this.getMessages(this.props.selectedUser, this.state.limit, true);
      }, 5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this._isMounted = false;
  }

  render() {
    const { selectedUser } = this.props;
    const { msgList } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root} id="scrollMsgList">
        {msgList && msgList.length > this.state.limit - 1 ? (
          <div className={classes.loadMoreContainer}>
            <Button
              className={classes.loadMoreButton}
              variant="outlined"
              color="secondary"
              onClick={this.loadMoreMessages}
            >
              LOAD MORE...
            </Button>
          </div>
        ) : undefined}
        {msgList && msgList.length > 0 ? (
          msgList.map((data, i) => {
            return (
              <div key={data.id} className={classes.renderMessageContainer}>
                <this.RenderedMessages
                  message={data}
                  selectedUser={selectedUser}
                  handleDeleteMessage={this.props.handleDeleteMessage}
                ></this.RenderedMessages>
              </div>
            );
          })
        ) : (
          <div className={classes.noMessages}>
            <Typography variant="h6" gutterBottom>
              No messages sent... Just say "Hi" or something else but don't be
              weird please.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

class Match extends Component {
  constructor() {
    super();
    this.state = {
      optionsPopover: null,
      limit: 20,
      isLoading: true,
      selectedUser: false,
      width: 0,
      height: 0,
      message: "",
      blockUserDialog: false,
      reportUserDialog: false,
      deleteConvDialog: false,
      deleteMessageDialog: false,
      unlikeUserDialog: false,
      isLoggedLiked: true,
      isMouseInside: false,
    };
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  _isMounted = false;
  Messages = withStyles(matchMessagesStyles)(MessageWithUser);

  getMatchList = (refresh) => {
    fetch("/api/likes/get/match", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.match.matchList !== false && refresh !== false) {
          this.getClickedUser(res.match[0].receiverid);
        }
        this.setState({
          matchList: res.match.matchList === false ? null : res.match,
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getLoggedUser = async () => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            id: res.user[0].id,
            username: res.user[0].username,
            firstname: res.user[0].firstname,
            lastname: res.user[0].lastname,
            email: res.user[0].email,
            birthdate: res.user[0].birthdate,
            country: res.user[0].country,
            city: res.user[0].city,
            gender: res.user[0].gender ? res.user[0].gender : "",
            sexual_orientation: res.user[0].sexual_orientation
              ? res.user[0].sexual_orientation
              : "",
            tags: res.user[0].tags ? JSON.parse(res.user[0].tags) : [],
            bio: res.user[0].bio ? res.user[0].bio : "",
            photos: res.user[0].photos ? JSON.parse(res.user[0].photos) : [],
            popularity: res.user[0].popularity,
            connected: res.user[0].connected,
            verified: res.user[0].verified,
            completed: res.user[0].completed,
            last_connection: res.user[0].last_connection,
            reported_count: res.user[0].reported_count
              ? JSON.parse(res.user[0].reported_count)
              : [],
          });
          this.setState({ isLoading: false });
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getClickedUser = (id) => {
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            selectedUser: id,
            clickedUser: {
              id: res.user[0].id,
              username: res.user[0].username,
              firstname: res.user[0].firstname,
              lastname: res.user[0].lastname,
              birthdate: res.user[0].birthdate,
              country: res.user[0].country,
              city: res.user[0].city,
              gender: res.user[0].gender ? res.user[0].gender : "",
              sexual_orientation: res.user[0].sexual_orientation
                ? res.user[0].sexual_orientation
                : "",
              tags: res.user[0].tags ? JSON.parse(res.user[0].tags) : [],
              bio: res.user[0].bio ? res.user[0].bio : "",
              photos: res.user[0].photos ? JSON.parse(res.user[0].photos) : [],
              popularity: res.user[0].popularity,
              connected: res.user[0].connected,
              verified: res.user[0].verified,
              completed: res.user[0].completed,
              last_connection: res.user[0].last_connection,
              reported_count: res.user[0].reported_count
                ? JSON.parse(res.user[0].reported_count)
                : [],
              reported: res.user[0].reported,
            },
          });
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  updateLikes = () => {
    fetch("/api/likes/update", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.selectedUser }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.like.msg) {
          this.setState({
            isLoggedLiked: res.like.update,
            unlikeUserDialog: false,
            selectedUser: false,
          });
          this.getMatchList();
          this.props.auth.successMessage("Like updated");
        } else {
          this.props.auth.errorMessage(res.like.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  blockUser = (e) => {
    e.preventDefault();
    fetch("/api/block/add", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.selectedUser }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.block.block === true) {
          this.setState({ blockUserDialog: false, selectedUser: false });
          this.getMatchList();
          this.props.auth.successMessage(
            this.state.clickedUser.username + " is blocked"
          );
        } else {
          this.props.auth.errorMessage(res.block.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  deleteConversation = (e) => {
    e.preventDefault();
    fetch("/api/messages/delete/all", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.selectedUser }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.delete.delete === true) {
          this.setState({ refreshMessages: true, deleteConvDialog: false });
          this.setState({ refreshMessages: false });
        } else {
          this.props.auth.errorMessage(res.delete.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  deleteMessage = (e) => {
    e.preventDefault();
    fetch("/api/messages/delete", {
      method: "POST",
      body: JSON.stringify({
        receiver: this.state.selectedUser,
        id: this.state.deleteMsgId,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.delete.delete === true) {
          this.setState({
            refreshMessages: true,
            deleteMessageDialog: false,
            deleteMsgId: false,
          });
          this.setState({ refreshMessages: false });
        } else {
          this.props.auth.errorMessage(res.delete.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  reportUser = (e) => {
    e.preventDefault();
    fetch("/api/report/user", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.selectedUser }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.report.report === true) {
          let reported_count = JSON.parse(res.report.reported_count);
          this.props.auth.successMessage(
            this.state.clickedUser.username + " has been reported"
          );
          if (reported_count.length === 10) {
            this.setState({ reportUserDialog: false, selectedUser: false });
            this.getMatchList();
          }
        } else {
          this.props.auth.errorMessage(res.report.msg);
        }
        this.handleCloseReport();
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  handleClickOpenReport = () => {
    this.setState({ reportUserDialog: true, optionsPopover: null });
  };

  handleCloseReport = () => {
    this.setState({ reportUserDialog: false });
  };

  handleClickOpenUnlike = () => {
    this.setState({ unlikeUserDialog: true, optionsPopover: null });
  };

  handleCloseUnlike = () => {
    this.setState({ unlikeUserDialog: false });
  };

  handleClickOpenBlock = () => {
    this.setState({ blockUserDialog: true, optionsPopover: null });
  };

  handleCloseBlock = () => {
    this.setState({ blockUserDialog: false });
  };

  handleClickOpenDelete = () => {
    this.setState({ deleteConvDialog: true, optionsPopover: null });
  };

  handleCloseDelete = () => {
    this.setState({ deleteConvDialog: false });
  };

  handleClickOpenDeleteMsg = (id, sender, receiver) => {
    this.setState({ deleteMessageDialog: true, deleteMsgId: id });
  };

  handleCloseDeleteMsg = () => {
    this.setState({ deleteMessageDialog: false, deleteMsgId: false });
  };

  handleSendMessage = (e) => {
    e.preventDefault();
    let message = this.state.message;
    if (message.length < 300) {
      fetch("/api/messages/send", {
        method: "POST",
        body: JSON.stringify({
          receiver: this.state.selectedUser,
          message: this.state.message,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message.message === true) {
            this.getMatchList();
            this.setState({ refreshMessages: true, message: "" });
            this.setState({ refreshMessages: false });
          } else {
            this.props.auth.errorMessage(res.message.msg);
          }
        })
        .catch((err) => this.props.auth.errorMessage(err));
    } else {
      this.props.auth.errorMessage("Message max length is 300 char.");
    }
  };

  handleSwitchUser = (id) => {
    if (id !== this.state.selectedUser) {
      this.setState({ limit: 20 });
      this.getClickedUser(id);
    }
  };

  handleOpenOption = (event) => {
    this.setState({ optionsPopover: event.currentTarget });
  };

  handleCloseOption = () => {
    this.setState({ optionsPopover: null });
  };

  handleWindowResize() {
    let headerHeight = document.getElementById("headerMatcha").clientHeight;
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - headerHeight,
    });
  }

  MatchList = (props) => {
    const {
      created_at,
      receiver,
      receiver_c,
      receiver_f,
      receiver_l,
      receiver_lc,
      receiverid,
    } = props.user;
    const { classes } = this.props;
    let photo = JSON.parse(props.user.receiver_p)[0];
    return (
      <ListItem
        key={created_at + receiver}
        classes={{ root: classes.matchListItem }}
        onClick={() => {
          this.handleSwitchUser(receiverid);
        }}
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <FiberManualRecordIcon
                style={{
                  fontSize: 15,
                  color: receiver_c ? "#0CCA4A" : "#E63946",
                  verticalAlign: "middle",
                }}
              ></FiberManualRecordIcon>
            }
          >
            <Avatar
              alt={receiver}
              src={
                photo.startsWith("https://")
                  ? photo
                  : "./src/assets/photos/" + photo
              }
            />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          className={classes.matchesInfos}
          primary={receiver_f + " " + receiver_l}
          secondary={receiver_c ? "Connected" : "Last login: " + receiver_lc}
        />
      </ListItem>
    );
  };

  MessageHeader = () => {
    const {
      clickedUser,
      blockUserDialog,
      reportUserDialog,
      deleteConvDialog,
      deleteMessageDialog,
      unlikeUserDialog,
      optionsPopover,
    } = this.state;
    const { classes } = this.props;
    let photo = clickedUser.photos[0];
    return (
      <span>
        <Dialog
          open={deleteMessageDialog}
          onClose={this.handleCloseDeleteMsg}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"DELETE THIS MESSAGE"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this message? It will be deleted
              only if the other user decide to also delete it.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDeleteMsg} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.deleteMessage} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={unlikeUserDialog}
          onClose={this.handleCloseUnlike}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"UNLIKE THIS USER"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to unlike this user? You won't be able to
              chat with him, unless you match him again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseUnlike} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.updateLikes} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteConvDialog}
          onClose={this.handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"DELETE THIS CONVERSATION"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this conversation? It will be
              deleted only if the other user decide to also delete it.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDelete} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteConversation}
              color="secondary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={reportUserDialog}
          onClose={this.handleCloseReport}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"REPORT THIS USER"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to report this user for being a fake
              account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseReport} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.reportUser} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={blockUserDialog}
          onClose={this.handleCloseBlock}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"BLOCK THIS USER"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to block this user? You won't be able to see
              any of his informations
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseBlock} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.blockUser} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Menu
          id={optionsPopover === null ? undefined : "simple-popover"}
          open={optionsPopover === null ? false : true}
          anchorEl={optionsPopover}
          onClose={this.handleCloseOption}
        >
          <MenuItem
            className={classes.userCardMenuItem}
            onClick={this.handleClickOpenBlock}
            aria-label="Block"
          >
            <BlockIcon></BlockIcon>
            Block
          </MenuItem>
          <MenuItem
            className={classes.userCardMenuItem}
            onClick={this.handleClickOpenReport}
            aria-label="Report"
          >
            <ReportProblemIcon></ReportProblemIcon>
            Report
          </MenuItem>
          <MenuItem
            className={classes.userCardMenuItem}
            onClick={this.handleClickOpenDelete}
            aria-label="Delete conversation"
          >
            <DeleteForeverIcon></DeleteForeverIcon>
            Delete conversation
          </MenuItem>
          <MenuItem
            className={classes.userCardMenuItem}
            onClick={this.handleClickOpenUnlike}
            aria-label="Unlike"
          >
            <ThumbDownIcon></ThumbDownIcon>
            Unlike
          </MenuItem>
          <MenuItem
            className={classes.userCardMenuItem}
            component={Link}
            onClick={this.handleCloseOption}
            to={{
              pathname: "/User",
              state: {
                id: clickedUser.id,
              },
            }}
          >
            <PersonIcon></PersonIcon>
            Profile
          </MenuItem>
        </Menu>
        <Grid className={classes.userCard} container>
          <Grid className={classes.userPhotoContainer} item xs={3} sm={2}>
            <Avatar
              className={classes.userPhoto}
              alt={clickedUser.username}
              src={
                photo.startsWith("https://")
                  ? photo
                  : "./src/assets/photos/" + photo
              }
            />
          </Grid>
          <Grid item xs={8} sm={10}>
            <Typography
              className={classes.userHeaderTitle}
              variant="h6"
              gutterBottom
            >
              {clickedUser.firstname +
                ' "' +
                clickedUser.username +
                '" ' +
                clickedUser.lastname}
            </Typography>
            <div
              style={{
                position: "absolute",
                top: window.innerHeight - this.state.height,
                right: 5,
              }}
            >
              <IconButton onClick={this.handleOpenOption}>
                <MoreVertIcon style={{ color: "#E63946" }}></MoreVertIcon>
              </IconButton>
            </div>
            <Typography
              className={classes.userHeaderCaption}
              variant="caption"
              display="block"
              gutterBottom
            >
              {moment().diff(
                moment(clickedUser.birthdate, "DD/MM/YYYY"),
                "years",
                false
              ) +
                " years old. From " +
                clickedUser.country +
                ", " +
                clickedUser.city +
                "."}
            </Typography>
          </Grid>
        </Grid>
      </span>
    );
  };

  MessageFooter = () => {
    const { message } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.footer}>
        <form
          onSubmit={(e) => {
            this.handleSendMessage(e);
          }}
        >
          <div className={classes.footerContainer}>
            <Grid container spacing={0} alignItems="flex-end">
              <Grid item xs={12} sm={12} style={{ margin: 3 }}>
                <Input
                  classes={{
                    root: classes.rootSend,
                    underline: classes.borderBottom,
                  }}
                  placeholder={"Your message..."}
                  value={message}
                  required
                  onChange={(e) => {
                    this.setState({ message: e.target.value });
                  }}
                  endAdornment={
                    <IconButton
                      disabled={!message || message.length > 300 ? true : false}
                      type="submit"
                    >
                      <SendIcon className={classes.sendIcon}></SendIcon>
                    </IconButton>
                  }
                />
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    );
  };

  componentDidMount() {
    this._isMounted = true;
    this.handleWindowResize();
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", this.handleWindowResize);
    this.getLoggedUser();
    if (this._isMounted) {
      this.getMatchList();
      this.interval = setInterval(() => {
        this.getMatchList(false);
      }, 5000);
    }
  }

  componentWillUnmount() {
    this.setState({ isLoading: true });
    clearInterval(this.interval);
    document.body.style.overflow = "auto";
    window.removeEventListener("resize", this.handleWindowResize);
    this._isMounted = false;
  }

  render() {
    const { isLoading, matchList, selectedUser, height } = this.state;
    const { classes } = this.props;

    if (isLoading === true) {
      return (
        <div className={classes.loading}>
          <CircularProgress className={classes.loadingLogo} />
        </div>
      );
    }

    return (
      <div style={{ height: height }} className={classes.root}>
        <Grid className={classes.fullHeight} container>
          <Grid className={classes.fullHeight} item xs={2} sm={2} md={3}>
            <Box
              className={classes.boxMatchList}
              display={{ xs: "block", sm: "block" }}
            >
              <Divider></Divider>
              <List className={classes.matchList}>
                {matchList
                  ? matchList.map((data, i) => {
                      return (
                        <span key={data.receiverid + i}>
                          <this.MatchList user={data}></this.MatchList>
                          <Divider></Divider>
                        </span>
                      );
                    })
                  : undefined}
              </List>
            </Box>
          </Grid>
          <Grid className={classes.fullHeight} item xs={10} sm={10} md={9}>
            <Box className={classes.fullHeight}>
              {!selectedUser ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 30,
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  <h4>CLICK ON ONE OF THE USERS TO TALK TO HIM</h4>
                </div>
              ) : (
                <div className={classes.messagesContainer}>
                  <this.MessageHeader></this.MessageHeader>
                  <Divider></Divider>
                  <this.Messages
                    refreshMessages={this.state.refreshMessages}
                    limit={this.state.limit}
                    handleDeleteMessage={this.handleClickOpenDeleteMsg}
                    selectedUser={selectedUser}
                  ></this.Messages>
                  <Divider></Divider>
                  <this.MessageFooter></this.MessageFooter>
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(matchStyles)(Match);
