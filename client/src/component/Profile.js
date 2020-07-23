// react
import moment from "moment";
import Carousel from "nuka-carousel";
import { Link } from "react-router-dom";
import React, { Component } from "react";
// framework
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";
// icons
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const profileStyles = (theme) => ({
  noOne: {
    padding: 10,
  },
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
  carousel: {
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
  infoTitle: {
    padding: "0px 10px 0px 10px",
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
  receiverColor: {
    color: "#E63946",
  },
});

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  _isMounted = false;

  getMatchList = () => {
    fetch("/api/likes/get/match", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          matchList: res.match.matchList === false ? null : res.match,
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getVisitList = () => {
    fetch("/api/visits/get/list", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          visitList: res.visit.visitList === false ? null : res.visit,
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getLikeList = () => {
    fetch("/api/likes/get/list", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          likeList: res.like.likeList === false ? null : res.like,
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getUserVisits = () => {
    fetch("/api/visits/get", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          visits: res.visit.visitList === false ? null : res.visit,
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getUserLikes = () => {
    fetch("/api/likes/get", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          likes: res.like.likeList === false ? null : res.like,
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getUserBlocked = () => {
    fetch("/api/block/get", {
      method: "POST",
      body: JSON.stringify({ receiver: this.state.id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          blocks: res.block.blockList === false ? null : res.block,
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
          this.getMatchList();
          this.getLikeList();
          this.getVisitList();
          this.getUserVisits();
          this.getUserLikes();
          this.getUserBlocked();
          this.setState({ isLoading: false });
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  unblockUser = (receiver, index) => {
    fetch("/api/block/delete", {
      method: "POST",
      body: JSON.stringify({ receiver: receiver }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.block.deleteBlock === true) {
          let blockList = [...this.state.blocks];
          blockList.splice(index, 1);
          this.setState({
            blocks: !blockList.length ? null : blockList,
          });
          this.props.auth.successMessage("User has been unblocked");
        } else {
          this.props.auth.errorMessage(res.block.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  componentDidMount() {
    this._isMounted = true;
    document.body.style.overflow = "auto";
    this.getLoggedUser();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState({ isLoading: true });
  }

  render() {
    const {
      isLoading,
      username,
      firstname,
      lastname,
      email,
      birthdate,
      gender,
      sexual_orientation,
      tags,
      bio,
      photos,
      popularity,
      connected,
      verified,
      completed,
      last_connection,
      reported_count,
      visits,
      likes,
      blocks,
      country,
      city,
      visitList,
      likeList,
      matchList,
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
          <div className={classes.carousel}>
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
          <div>
            <div className={classes.paperContainer}>
              <Typography className={classes.infoTitle} variant="h6">
                You've stalked
              </Typography>
              <List>
                {visitList ? (
                  visitList.map((data, i) => {
                    return (
                      <ListItem
                        key={data.created_at + data.username}
                        button
                        component={Link}
                        to={{
                          pathname: "/User",
                          state: {
                            id: data.receiver,
                          },
                        }}
                      >
                        <Typography variant="body2">
                          <span className={classes.receiverColor}>
                            {data.username}
                          </span>{" "}
                          stalked on:{" "}
                          <span
                            style={{
                              fontStyle: "italic",
                            }}
                          >
                            {moment(data.created_at).format(
                              "DD/MM/YYYY - HH:mm:ss"
                            )}
                          </span>
                        </Typography>
                      </ListItem>
                    );
                  })
                ) : (
                  <div className={classes.noOne}>You stalked no one.</div>
                )}
              </List>
            </div>
            <div className={classes.paperContainer}>
              <Typography className={classes.infoTitle} variant="h6">
                You've liked
              </Typography>
              <List>
                {likeList ? (
                  likeList.map((data, i) => {
                    return (
                      <ListItem
                        key={data.created_at + data.username}
                        button
                        component={Link}
                        to={{
                          pathname: "/User",
                          state: {
                            id: data.receiver,
                          },
                        }}
                      >
                        <Typography variant="body2">
                          <span className={classes.receiverColor}>
                            {data.username}
                          </span>{" "}
                          liked on:{" "}
                          <span
                            style={{
                              fontStyle: "italic",
                            }}
                          >
                            {moment(data.created_at).format(
                              "DD/MM/YYYY - HH:mm:ss"
                            )}
                          </span>
                        </Typography>
                      </ListItem>
                    );
                  })
                ) : (
                  <div className={classes.noOne}>You liked no one.</div>
                )}
              </List>
            </div>
            <div className={classes.paperContainer}>
              <Typography className={classes.infoTitle} variant="h6">
                Blocked users
              </Typography>
              <List>
                {blocks ? (
                  blocks.map((data, i) => {
                    return (
                      <ListItem key={data.created_at + data.username}>
                        <Typography variant="body2">
                          <span className={classes.receiverColor}>
                            {data.username}
                          </span>
                        </Typography>
                        <IconButton
                          className={classes.unblockButton}
                          aria-label="unblock"
                          size="small"
                          onClick={() => this.unblockUser(data.receiver, i)}
                        >
                          <LockOpenIcon fontSize="inherit" />
                        </IconButton>
                      </ListItem>
                    );
                  })
                ) : (
                  <div className={classes.noOne}>You've blocked no one.</div>
                )}
              </List>
            </div>
          </div>
        </div>
        <div className={classes.rightColumn}>
          <div className={classes.paperContainer}>
            <div className={classes.infoContainer}>
              <div className={classes.infoLeft}>
                <List className={classes.infoList}>
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
                      primary={"Email"}
                      secondary={email}
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
          <div className={classes.paperContainer}>
            <Typography className={classes.infoTitle} variant="h6">
              You've matched with
            </Typography>
            <List>
              {matchList ? (
                matchList.map((data, i) => {
                  return (
                    <ListItem
                      key={data.created_at + data.username}
                      button
                      component={Link}
                      to={{
                        pathname: "/User",
                        state: {
                          id: data.receiverid,
                        },
                      }}
                    >
                      <Typography variant="body2">
                        <span className={classes.receiverColor}>
                          {data.receiver}
                        </span>{" "}
                        and you matched on:{" "}
                        <span
                          style={{
                            fontStyle: "italic",
                          }}
                        >
                          {moment(data.created_at).format(
                            "DD/MM/YYYY - HH:mm:ss"
                          )}
                        </span>
                      </Typography>
                    </ListItem>
                  );
                })
              ) : (
                <div className={classes.noOne}>
                  You matched with no one, that is kinda sad.
                </div>
              )}
            </List>
          </div>
          <div className={classes.paperContainer}>
            <Typography className={classes.infoTitle} variant="h6">
              You've been visited by
            </Typography>
            <List>
              {visits ? (
                visits.map((data, i) => {
                  return (
                    <ListItem
                      key={data.created_at + data.username}
                      button
                      component={Link}
                      to={{
                        pathname: "/User",
                        state: {
                          id: data.sender,
                        },
                      }}
                    >
                      <Typography variant="body2">
                        <span className={classes.receiverColor}>
                          {data.username}
                        </span>{" "}
                        visited your profile on:{" "}
                        <span
                          style={{
                            fontStyle: "italic",
                          }}
                        >
                          {moment(data.created_at).format(
                            "DD/MM/YYYY - HH:mm:ss"
                          )}
                        </span>
                      </Typography>
                    </ListItem>
                  );
                })
              ) : (
                <div className={classes.noOne}>No one... wow, that's sad..</div>
              )}
            </List>
          </div>
          <div className={classes.paperContainer}>
            <Typography className={classes.infoTitle} variant="h6">
              You've been liked by
            </Typography>
            <List>
              {likes ? (
                likes.map((data, i) => {
                  return (
                    <ListItem
                      key={data.created_at + data.username}
                      button
                      component={Link}
                      to={{
                        pathname: "/User",
                        state: {
                          id: data.sender,
                        },
                      }}
                    >
                      <Typography variant="body2">
                        <span className={classes.receiverColor}>
                          {data.username}
                        </span>{" "}
                        liked on:{" "}
                        <span
                          style={{
                            fontStyle: "italic",
                          }}
                        >
                          {moment(data.created_at).format(
                            "DD/MM/YYYY - HH:mm:ss"
                          )}
                        </span>
                      </Typography>
                    </ListItem>
                  );
                })
              ) : (
                <div className={classes.noOne}>No one, no one likes you.</div>
              )}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(profileStyles)(Profile);
