// react
import moment from "moment";
import Carousel from "nuka-carousel";
import React, { Component } from "react";
// framework
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItem from "@material-ui/core/ListItem";
import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemText from "@material-ui/core/ListItemText";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContentText from "@material-ui/core/DialogContentText";
// icon
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const profileStyles = (theme) => ({
  root: {
    margin: 10,
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  loading: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    color: "#E63946",
  },
  paperContainer: {
    border: "0.5px solid rgba(41, 41, 41, .3)",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingRight: 5,
    [theme.breakpoints.down("sm")]: {
      display: "block",
      paddingRight: 0,
    },
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingLeft: 5,
    [theme.breakpoints.down("sm")]: {
      display: "block",
      paddingLeft: 0,
    },
  },
  buttonUser: {
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
    },
  },
  infoContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      border: "none",
    },
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    flex: 1,
  },
  infoList: {
    padding: 0,
    margin: 10,
  },
  infoListItem: {
    padding: 0,
  },
});

class User extends Component {
  constructor() {
    super();
    this.state = {
      isVisitedLiked: false,
      isLoggedLiked: false,
      isLoggedHasBeenVisited: false,
      isLoading: true,
      blockUserDialog: false,
      reportUserDialog: false,
    };
  }

  _isMounted = false;

  updateVisits = () => {
    fetch("/api/visits/add", {
      method: "POST",
      body: JSON.stringify({ receiver: this.props.props.location.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.visit.visit === true) {
          this.setState({ popularity: this.state.popularity + 5 });
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  updateLikes = () => {
    fetch("/api/likes/update", {
      method: "POST",
      body: JSON.stringify({ receiver: this.props.props.location.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.like.msg) {
          this.setState({
            isLoggedLiked: res.like.update,
            popularity:
              res.like.update === true
                ? this.state.popularity + 50
                : this.state.popularity - 50,
          });
        } else {
          this.props.auth.errorMessage(res.like.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  checkIfUserLiked = () => {
    fetch("/api/likes/checkUser", {
      method: "POST",
      body: JSON.stringify({ sender: this.props.props.location.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.like.checkVisited !== false) {
          this.setState({ isVisitedLiked: res.like.checkVisited[0] });
        }
        if (res.like.msg) {
          this.props.auth.errorMessage(res.like.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  checkIfLoggedLiked = () => {
    fetch("/api/likes/checkLogged", {
      method: "POST",
      body: JSON.stringify({ receiver: this.props.props.location.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.like.checkLogged) {
          this.setState({ isLoggedLiked: res.like.checkLogged });
        }
        if (res.like.msg) {
          this.props.auth.errorMessage(res.like.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  checkIfLoggedHasBeenVisited = () => {
    fetch("/api/visit/checkLogged", {
      method: "POST",
      body: JSON.stringify({ receiver: this.props.props.location.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.visit.checkLogged) {
          this.setState({ isLoggedHasBeenVisited: res.visit.checkLogged[0] });
        }
        if (res.visit.msg) {
          this.props.auth.errorMessage(res.like.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getUserProfile = () => {
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: this.props.props.location.state.id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          if (!res || res.user[0].reported === true) {
            this.props.auth.errorMessage("This account has been disabled.");
            this.props.props.history.push("/");
          } else {
            this.setState({
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
            });
            this.updateVisits();
            this.checkIfLoggedLiked();
            this.checkIfUserLiked();
            this.checkIfLoggedHasBeenVisited();

            this.setState({ isLoading: false });
          }
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  blockUser = (e) => {
    e.preventDefault();
    fetch("/api/block/add", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.block.block === true) {
          this.setState({ blockUserDialog: false });
          this.props.props.history.push("/");
          this.props.auth.successMessage(this.state.username + " is blocked");
        } else {
          this.props.auth.errorMessage(res.block.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  reportUser = (e) => {
    e.preventDefault();
    fetch("/api/report/user", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.report.report === true) {
          let reported_count = JSON.parse(res.report.reported_count);
          this.handleCloseReport();
          this.props.auth.successMessage(
            this.state.username + " has been reported"
          );
          if (reported_count.length === 10) {
            this.props.props.history.push("/");
          } else {
            this.setState({
              reported_count: JSON.parse(res.report.reported_count),
            });
          }
        } else {
          this.props.auth.errorMessage(res.report.msg);
        }
        this.handleCloseReport();
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  handleClickOpenReport = () => {
    this.setState({ reportUserDialog: true });
  };

  handleCloseReport = () => {
    this.setState({ reportUserDialog: false });
  };

  handleClickOpenBlock = () => {
    this.setState({ blockUserDialog: true });
  };

  handleCloseBlock = () => {
    this.setState({ blockUserDialog: false });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps !== this.props) {
      this.setState({ isLoading: true });
      this.getUserProfile();
    }
  };

  componentDidMount() {
    this._isMounted = true;
    document.body.style.overflow = "auto";
    this.getUserProfile();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState({ isLoading: true });
  }

  render() {
    const {
      isLoggedHasBeenVisited,
      isVisitedLiked,
      isLoggedLiked,
      isLoading,
      username,
      firstname,
      lastname,
      birthdate,
      gender,
      sexual_orientation,
      tags,
      bio,
      country,
      city,
      photos,
      popularity,
      connected,
      verified,
      completed,
      last_connection,
      reported_count,
      blockUserDialog,
      reportUserDialog,
    } = this.state;
    const { classes } = this.props;

    if (isLoading === true) {
      return (
        <div className={classes.loading}>
          <CircularProgress className={classes.loadingLogo} />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <div className={classes.leftColumn}>
          <div>
            <Carousel
              defaultControlsConfig={{
                nextButtonText: ">",
                prevButtonText: "<",
                pagingDotsStyle: {
                  fill: "#fff",
                },
              }}
            >
              {photos.map((el, index) =>
                el ? (
                  <img
                    alt={el + username + index}
                    key={el + username + index}
                    src={
                      el.startsWith("https://")
                        ? el
                        : "./src/assets/photos/" + el
                    }
                  />
                ) : undefined
              )}
            </Carousel>
          </div>
        </div>
        <div className={classes.rightColumn}>
          <div className={classes.buttonUser}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.handleClickOpenBlock}
              >
                BLOCK
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.handleClickOpenReport}
              >
                REPORT
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.updateLikes}
              >
                {isLoggedLiked ? "Unlike" : "Like"}
              </Button>
            </div>
          </div>
          <div className={classes.paperContainer}>
            <div className={classes.infoContainer}>
              <div className={classes.infoLeft}>
                <List className={classes.infoList}>
                  {isVisitedLiked ? (
                    <ListItem className={classes.infoListItem}>
                      <ListItemText
                        primary={"Liked your profile"}
                        secondary={moment(isVisitedLiked.created_at).format(
                          "DD/MM/YYYY - HH:mm:ss"
                        )}
                      ></ListItemText>
                    </ListItem>
                  ) : null}
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"First Name"}
                      secondary={firstname}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Last Name"}
                      secondary={lastname}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Username"}
                      secondary={username}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Birthdate"}
                      secondary={birthdate}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Bio"}
                      secondary={bio}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Tags"}
                      secondary={tags.map((data) => {
                        return (
                          <Chip
                            component={"span"}
                            key={data.label + data.value + data.label}
                            label={data.label}
                          />
                        );
                      })}
                    ></ListItemText>
                  </ListItem>
                </List>
              </div>
              <div className={classes.infoRight}>
                <List className={classes.infoList}>
                  {isLoggedHasBeenVisited ? (
                    <ListItem className={classes.infoListItem}>
                      <ListItemText
                        primary={"Visited your profile"}
                        secondary={moment(
                          isLoggedHasBeenVisited.created_at
                        ).format("DD/MM/YYYY - HH:mm:ss")}
                      ></ListItemText>
                    </ListItem>
                  ) : null}
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Gender"}
                      secondary={gender}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Sexual orientation"}
                      secondary={sexual_orientation}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Location"}
                      secondary={country + ", " + city}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Popularity"}
                      secondary={popularity}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={
                        connected === false ? (
                          <span>
                            Last connection
                            <FiberManualRecordIcon
                              style={{
                                fontSize: 11,
                                color: "#E63946",
                                verticalAlign: "middle",
                              }}
                            ></FiberManualRecordIcon>
                          </span>
                        ) : (
                          <span>
                            Connected
                            <FiberManualRecordIcon
                              style={{
                                fontSize: 11,
                                color: "#0CCA4A",
                                verticalAlign: "middle",
                              }}
                            ></FiberManualRecordIcon>
                          </span>
                        )
                      }
                      secondary={connected === false ? last_connection : "Yes"}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Email verified"}
                      secondary={verified === false ? "No" : "Yes"}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Profile completed"}
                      secondary={completed === false ? "No" : "Yes"}
                    ></ListItemText>
                  </ListItem>
                  <ListItem className={classes.infoListItem}>
                    <ListItemText
                      primary={"Number of reports"}
                      secondary={Object.keys(reported_count).length + "/10"}
                    ></ListItemText>
                  </ListItem>
                </List>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    );
  }
}

export default withStyles(profileStyles)(User);
