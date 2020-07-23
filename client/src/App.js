// files
import "react-toastify/dist/ReactToastify.css";
// react
import moment from "moment";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from "react-router-dom";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
// framework
import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
// icons
import ChatIcon from "@material-ui/icons/Chat";
import HelpIcon from "@material-ui/icons/Help";
import HomeIcon from "@material-ui/icons/Home";
import MoreIcon from "@material-ui/icons/MoreVert";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
// components
import User from "./component/User";
import Home from "./component/Home";
import Match from "./component/Match";
import Search from "./component/Search";
import SignUp from "./component/SignUp";
import SignIn from "./component/SignIn";
import Recover from "./component/Recover";
import Profile from "./component/Profile";
import Confirm from "./component/Confirm";
import Settings from "./component/Settings";

const appBarStyles = (theme) => ({
  loadMoreButton: {
    width: "100%",
  },
  grow: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "0.5px solid rgba(41, 41, 41, .5)",
  },
  badge: {
    color: "#fff",
    backgroundColor: "#FA7B38",
  },
  title: {
    display: "block",
    padding: 10,
    margin: 5,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 25,
    color: "#292929",
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  titleIcon: {
    verticalAlign: "bottom",
    color: "#E63946",
    fontSize: 25,
  },
  link: {
    padding: 10,
    margin: 5,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 15,
    color: "#545454",
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  linkActive: {
    padding: 10,
    margin: 5,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 15,
    color: "#E63946",
    "&:hover": {
      color: "#FA7B38",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  linkIcon: {
    padding: 8,
    verticalAlign: "middle",
    color: "#545454",
    fontSize: 25,
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
    },
  },
  linkIconActive: {
    padding: 8,
    verticalAlign: "middle",
    color: "#E63946",
    fontSize: 25,
    "&:hover": {
      color: "#FA7B38",
      transition: "0.2s",
    },
  },
  linkMobile: {
    textDecoration: "none",
    color: "#545454",
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  linkMobileActive: {
    textDecoration: "none",
    color: "#E63946",
    "&:hover": {
      color: "#FA7B38",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  showMore: {
    color: "#545454",
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  notifHeader: {
    marginLeft: 10,
    marginRight: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      padding: 10,
      display: "block",
    },
  },
  notifTitle: {
    fontWeight: 600,
    fontSize: 15,
    color: "#292929",
  },
  notifOption: {
    color: "#545454",
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
    },
  },
  popOverRoot: {
    height: "100%",
  },
  popOverPaper: {
    width: 400,
    boxShadow: "none",
    border: "1px solid rgba(41, 41, 41, .2)",
  },
  listItemSeen: {
    backgroundColor: "#fff",
  },
  list: {
    padding: 0,
  },
  listItem: {
    backgroundColor: "#FDC8B7",
  },
  noNotifs: {
    padding: 10,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 15,
    color: "#292929",
  },
});

const auth = {
  isLogged: false,
  isCompleted: false,
  errorMessage(msg) {
    toast.error(msg, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progressStyle: {
        background: "#3B595D",
      },
    });
  },
  successMessage(msg) {
    toast.success(msg, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progressStyle: {
        background: "#3B595D",
      },
    });
  },
  setLogged() {
    auth.isLogged = true;
    handleLocation();
    this.successMessage("You are now logged in!");
  },
  setLoggedOut(cb) {
    auth.isLogged = false;
    this.successMessage("You are now logged out!");
    cb();
  },
  setCompleted() {
    auth.isCompleted = true;
  },
  setNotCompleted() {
    auth.isCompleted = false;
  },
};

const handleLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch("/api/settings/latlon", {
          method: "POST",
          body: JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((res) => {
            if (!res.location.location) {
              auth.errorMessage(res.location.msg);
            }
          })
          .catch((err) => auth.errorMessage(err));
      },
      (e) => {
        if (e.code === 1) {
          fetch("http://ip-api.com/json/")
            .then((res) => {
              if (res.ok) {
                res.json().then((json) => {
                  fetch("/api/settings/latlon", {
                    method: "POST",
                    body: JSON.stringify({ lat: json.lat, lon: json.lon }),
                    headers: { "Content-Type": "application/json" },
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (!res.location.location) {
                        auth.errorMessage(res.location.msg);
                      }
                    })
                    .catch((err) => auth.errorMessage(err));
                });
              }
            })
            .catch(() => {
              auth.errorMessage("Internal error with location settings.");
            });
        } else {
          auth.errorMessage(e.message);
        }
      },
      {
        enableHighAccuracy: true,
      }
    );
  } else {
    auth.errorMessage("Location is not supported on this device.");
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isLogged === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/SignIn",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const MatchRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isCompleted === true && auth.isLogged === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/Settings",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isLogged === false ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class AuthButton extends Component {
  constructor() {
    super();
    this.state = {
      mobileMoreAnchorEl: null,
      notificationsPopover: null,
      limit: 20,
    };
  }

  getNotifs = (limit) => {
    fetch("/api/notifications/get", {
      method: "POST",
      body: JSON.stringify({ limit: limit }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (auth.isLogged && auth.isCompleted) {
          if (res.notification.notifList !== false && res.notification) {
            let len = res.notification.filter((el) => !el.seen);
            let lenMsg = res.notification.filter(
              (el) => !el.seen && el.type === 4
            );
            this.setState({
              notifList: res.notification,
              totalNotifs: len.length > 99 ? 99 : len.length,
              totalNotifsMsg: lenMsg.length > 99 ? 99 : lenMsg.length,
              limit: limit,
            });
          } else {
            this.setState({
              notifList: false,
              totalNotifs: 0,
              totalNotifsMsg: 0,
              limit: limit,
            });
          }
        }
      })
      .catch((err) => auth.errorMessage(err));
  };

  clearNotifs = () => {
    fetch("/api/notifications/clear", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res.notification.clear === true) {
          this.getNotifs(this.state.limit);
        } else {
          auth.errorMessage(res.notification.msg);
        }
      })
      .catch((err) => auth.errorMessage(err));
  };

  loadMoreNotifs = () => {
    this.getNotifs(this.state.limit + 20);
  };

  markAsRead = () => {
    fetch("/api/notifications/read", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res.notification.read === true) {
          this.getNotifs(this.state.limit);
        } else {
          auth.errorMessage(res.notification.msg);
        }
      })
      .catch((err) => auth.errorMessage(err));
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleOpenNotifs = (event) => {
    this.setState({ notificationsPopover: event.currentTarget });
  };

  handleCloseNotifs = () => {
    this.setState({ notificationsPopover: null });
  };

  renderMobileMenu = () => {
    const { classes } = this.props;
    const { pathname } = this.props.location;
    const { totalNotifs, totalNotifsMsg } = this.state;
    return (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={"primary-search-account-menu-mobile"}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.mobileMoreAnchorEl === null ? false : true}
        onClose={this.handleMobileMenuClose}
      >
        {auth.isLogged ? (
          <div>
            <MenuItem
              className={
                pathname === "/" ? classes.linkMobileActive : classes.linkMobile
              }
              component={Link}
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                    this.setState({ mobileMoreAnchorEl: null });
                  });
              }}
              to="/"
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <Typography variant="inherit">HOME</Typography>
            </MenuItem>
            <MenuItem
              className={
                pathname === "/Search"
                  ? classes.linkMobileActive
                  : classes.linkMobile
              }
              component={Link}
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                    this.setState({ mobileMoreAnchorEl: null });
                  });
              }}
              to="/Search"
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <Typography variant="inherit">SEARCH</Typography>
            </MenuItem>
            <MenuItem
              className={
                pathname === "/Match"
                  ? classes.linkMobileActive
                  : classes.linkMobile
              }
              component={Link}
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                    this.setState({ mobileMoreAnchorEl: null });
                  });
              }}
              to="/Match"
            >
              <ListItemIcon>
                <Badge
                  classes={{
                    anchorOriginTopRightRectangle: classes.badge,
                  }}
                  badgeContent={totalNotifsMsg}
                >
                  <ChatIcon />
                </Badge>
              </ListItemIcon>
              <Typography variant="inherit">CHAT</Typography>
            </MenuItem>
            <MenuItem
              className={
                pathname === "/Profile"
                  ? classes.linkMobileActive
                  : classes.linkMobile
              }
              component={Link}
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                    this.setState({ mobileMoreAnchorEl: null });
                  });
              }}
              to="/Profile"
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <Typography variant="inherit">PROFILE</Typography>
            </MenuItem>
            {auth.isCompleted ? (
              <MenuItem onClick={this.handleOpenNotifs}>
                <ListItemIcon>
                  <Badge
                    classes={{
                      anchorOriginTopRightRectangle: classes.badge,
                    }}
                    badgeContent={totalNotifs}
                  >
                    <NotificationsActiveIcon />
                  </Badge>
                </ListItemIcon>
                <Typography className={classes.linkMobile} variant="inherit">
                  NOTIFICATIONS
                </Typography>
              </MenuItem>
            ) : undefined}
            <MenuItem
              className={
                pathname === "/Settings"
                  ? classes.linkMobileActive
                  : classes.linkMobile
              }
              component={Link}
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                    this.setState({ mobileMoreAnchorEl: null });
                  });
              }}
              to="/Settings"
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <Typography variant="inherit">SETTINGS</Typography>
            </MenuItem>
            <MenuItem
              className={classes.linkMobile}
              component={Link}
              onClick={() => {
                fetch("/api/logout")
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.status === true) {
                      auth.setLoggedOut(() => this.props.history.push("/"));
                      this.setState({ mobileMoreAnchorEl: null });
                    } else {
                      auth.errorMessage(res.msg);
                    }
                  });
              }}
              to="/SignIn"
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <Typography variant="inherit">LOGOUT</Typography>
            </MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem
              className={classes.linkMobile}
              component={Link}
              onClick={() => this.setState({ mobileMoreAnchorEl: null })}
              to="/SignUp"
            >
              <IconButton>
                <PersonAddIcon />
              </IconButton>
              <Typography variant="inherit">REGISTER</Typography>
            </MenuItem>
            <MenuItem
              className={classes.linkMobile}
              component={Link}
              onClick={() => this.setState({ mobileMoreAnchorEl: null })}
              to="/SignIn"
            >
              <IconButton>
                <ArrowForwardIosIcon />
              </IconButton>
              <Typography variant="inherit">LOGIN</Typography>
            </MenuItem>
            <MenuItem
              className={classes.linkMobile}
              component={Link}
              onClick={() => this.setState({ mobileMoreAnchorEl: null })}
              to="/Recover"
            >
              <IconButton>
                <HelpIcon />
              </IconButton>
              <Typography variant="inherit">FORGOT MY PASSWORD</Typography>
            </MenuItem>
          </div>
        )}
      </Menu>
    );
  };

  renderLink = () => {
    const { classes } = this.props;
    const { pathname } = this.props.location;
    const { totalNotifs, totalNotifsMsg } = this.state;
    return (
      <div className={classes.sectionDesktop}>
        {auth.isLogged ? (
          <div>
            <Link
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                  });
              }}
              to={"/"}
            >
              <HomeIcon
                className={
                  pathname === "/" ? classes.linkIconActive : classes.linkIcon
                }
              />
            </Link>
            <Link
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                  });
              }}
              to={"/Search"}
            >
              <SearchIcon
                className={
                  pathname === "/Search"
                    ? classes.linkIconActive
                    : classes.linkIcon
                }
              />
            </Link>
            <Link
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                  });
              }}
              to={"/Match"}
            >
              <Badge
                style={{ margin: 8 }}
                classes={{
                  anchorOriginTopRightRectangle: classes.badge,
                }}
                badgeContent={totalNotifsMsg === 0 ? 0 : totalNotifsMsg}
              >
                <ChatIcon
                  style={{ padding: 1 }}
                  className={
                    pathname === "/Match"
                      ? classes.linkIconActive
                      : classes.linkIcon
                  }
                />
              </Badge>
            </Link>
            <Link
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                  });
              }}
              to={"/Profile"}
            >
              <PersonIcon
                className={
                  pathname === "/Profile"
                    ? classes.linkIconActive
                    : classes.linkIcon
                }
              />
            </Link>
            {auth.isCompleted ? (
              <IconButton
                className={classes.linkIcon}
                onClick={this.handleOpenNotifs}
              >
                <Badge
                  classes={{
                    anchorOriginTopRightRectangle: classes.badge,
                  }}
                  badgeContent={totalNotifs === 0 ? 0 : totalNotifs}
                >
                  <NotificationsActiveIcon />
                </Badge>
              </IconButton>
            ) : undefined}
            <Link
              onClick={() => {
                fetch("/api/checkToken")
                  .then((resLogged) => resLogged.json())
                  .then((resLogged) => {
                    auth.isLogged = resLogged.status === false ? false : true;
                  });
              }}
              to={"/Settings"}
            >
              <SettingsIcon
                className={
                  pathname === "/Settings"
                    ? classes.linkIconActive
                    : classes.linkIcon
                }
              />
            </Link>
            <Link
              onClick={() => {
                fetch("/api/logout")
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.status === true) {
                      auth.setLoggedOut(() => this.props.history.push("/"));
                    } else {
                      auth.errorMessage(res.msg);
                    }
                  });
              }}
              to={"/SignIn"}
            >
              <ExitToAppIcon className={classes.linkIcon} />
            </Link>
          </div>
        ) : (
          <div>
            <Link
              className={
                pathname === "/SignUp" ? classes.linkActive : classes.link
              }
              to={"/SignUp"}
            >
              REGISTER
            </Link>
            <Link
              className={
                pathname === "/SignIn" ? classes.linkActive : classes.link
              }
              to={"/SignIn"}
            >
              LOGIN
            </Link>
            <Link
              className={
                pathname === "/Recover" ? classes.linkActive : classes.link
              }
              to={"/Recover"}
            >
              FORGOT MY PASSWORD
            </Link>
          </div>
        )}
      </div>
    );
  };

  componentDidMount() {
    this.getNotifs(20);
    this.interval = setInterval(() => {
      if (auth.isLogged && auth.isCompleted) this.getNotifs(this.state.limit);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes } = this.props;
    const { notifList, notificationsPopover, totalNotifs } = this.state;

    return (
      <div id={"headerMatcha"} className={classes.grow}>
        <AppBar position="static" className={classes.appbar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              <Link
                onClick={() => {
                  fetch("/api/checkToken")
                    .then((resLogged) => resLogged.json())
                    .then((resLogged) => {
                      auth.isLogged = resLogged.status === false ? false : true;
                    });
                }}
                to={auth.isLogged ? "/" : "/SignIn"}
                className={classes.title}
              >
                MATCHA
                <LoyaltyIcon className={classes.titleIcon} />
              </Link>
            </Typography>
            <div className={classes.grow} />
            <this.renderLink></this.renderLink>
            <div className={classes.sectionMobile}>
              <IconButton
                className={classes.showMore}
                aria-controls={"primary-search-account-menu-mobile"}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <this.renderMobileMenu></this.renderMobileMenu>
        {auth.isLogged && auth.isCompleted ? (
          <Popover
            classes={{
              root: classes.popOverRoot,
              paper: classes.popOverPaper,
            }}
            id={notificationsPopover === null ? undefined : "simple-popover"}
            open={notificationsPopover === null ? false : true}
            anchorEl={notificationsPopover}
            onClose={this.handleCloseNotifs}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div>
              <div className={classes.notifHeader}>
                <div className={classes.notifTitle}>NOTIFICATIONS</div>
                <div>
                  <Button
                    className={classes.notifOption}
                    onClick={this.markAsRead}
                    disabled={totalNotifs ? false : true}
                  >
                    Mark as read
                  </Button>
                  <Button
                    disabled={notifList && notifList.length ? false : true}
                    className={classes.notifOption}
                    onClick={this.clearNotifs}
                  >
                    Delete all
                  </Button>
                </div>
              </div>
              <Divider></Divider>
              <List
                className={classes.list}
                component="nav"
                aria-label="main mailbox folders"
              >
                {notifList && notifList.length ? (
                  notifList.map((el) => {
                    let photo = JSON.parse(el.photos)[0];
                    return (
                      <ListItem
                        key={el.created_at + el.username + el.sender}
                        classes={{
                          root: !el.seen
                            ? classes.listItem
                            : classes.listItemSeen,
                        }}
                        button
                      >
                        <ListItemIcon>
                          <Avatar
                            src={
                              photo.startsWith("https://")
                                ? photo
                                : "./src/assets/photos/" + photo
                            }
                            alt={el.username}
                          ></Avatar>
                        </ListItemIcon>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div>
                            <Typography variant="body1" gutterBottom>
                              <Link
                                onClick={this.handleCloseNotifs}
                                to={{
                                  pathname: "/User",
                                  state: {
                                    id: el.sender,
                                  },
                                }}
                              >
                                {el.username}
                              </Link>{" "}
                              {el.type === 1
                                ? "liked your profile."
                                : el.type === 2
                                ? "unliked your profile."
                                : el.type === 3
                                ? "visited your profile."
                                : el.type === 4
                                ? "sent you a message."
                                : el.type === 5
                                ? " and you matched."
                                : el.type === 6
                                ? " and you unmatched."
                                : undefined}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              {moment(el.created_at).format(
                                "DD/MM/YYYY - HH:mm:ss"
                              )}
                            </Typography>
                          </div>
                        </div>
                      </ListItem>
                    );
                  })
                ) : (
                  <div className={classes.noNotifs}>
                    You have no notifications.
                  </div>
                )}
                {notifList && notifList.length > this.state.limit - 1 ? (
                  <Button
                    className={classes.loadMoreButton}
                    variant="outlined"
                    color="secondary"
                    onClick={this.loadMoreNotifs}
                  >
                    LOAD MORE...
                  </Button>
                ) : undefined}
              </List>
            </div>
          </Popover>
        ) : undefined}
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    fetch("/api/checkToken")
      .then((resLogged) => resLogged.json())
      .then((resLogged) => {
        fetch("/api/checkCompleted")
          .then((resCompleted) => resCompleted.json())
          .then((resCompleted) => {
            auth.isLogged = resLogged.status === false ? false : true;
            auth.isCompleted = resCompleted.status === false ? false : true;
            this.setState({ isLoading: false });
          });
      });
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return null;
    }

    const NavBar = withRouter(withStyles(appBarStyles)(AuthButton));

    return (
      <BrowserRouter>
        <div>
          <ToastContainer />
          <NavBar></NavBar>
          <Switch>
            <MatchRoute
              exact
              path="/"
              component={(props) => <Home props={props} auth={auth} />}
            />
            <MatchRoute
              exact
              path="/Match"
              component={(props) => <Match props={props} auth={auth} />}
            />
            <MatchRoute
              exact
              path="/Search"
              component={(props) => <Search props={props} auth={auth} />}
            />
            <PrivateRoute
              exact
              path="/Profile"
              component={(props) => <Profile props={props} auth={auth} />}
            />
            <MatchRoute
              exact
              path="/User"
              component={(props) => <User props={props} auth={auth} />}
            />
            <PrivateRoute
              exact
              path="/Settings"
              component={(props) => (
                <Settings
                  props={props}
                  handleLocation={handleLocation}
                  auth={auth}
                />
              )}
            />
            <PublicRoute
              exact
              path="/SignUp"
              component={(props) => <SignUp props={props} auth={auth} />}
            />
            <PublicRoute
              exact
              path="/SignIn"
              component={(props) => <SignIn props={props} auth={auth} />}
            />
            <PublicRoute
              exact
              path="/Recover"
              component={(props) => <Recover props={props} auth={auth} />}
            />
            <PublicRoute
              exact
              path="/Confirm"
              component={(props) => <Confirm props={props} auth={auth} />}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
