// files
import "rc-slider/assets/index.css";
// react
import moment from "moment";
import Carousel from "nuka-carousel";
import Range from "rc-slider/lib/Range";
import Slider from "rc-slider/lib/Slider";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import { FixedSizeList } from "react-window";
import Select, { createFilter } from "react-select";
// framework
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CircularProgress from "@material-ui/core/CircularProgress";
//icons
import SearchIcon from "@material-ui/icons/Search";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const sortOptions = [
  { value: false, label: "DEFAULT" },
  { value: "ASCAGE", label: "ASC AGE" },
  { value: "DESCAGE", label: "DESC AGE" },
  { value: "ASCPOP", label: "ASC POP" },
  { value: "DESCPOP", label: "DESC POP" },
  { value: "ASCTAGS", label: "ASC MATCHING TAGS" },
  { value: "DESCTAGS", label: "DESC MATCHING TAGS" },
  { value: "ASCLOC", label: "ASC PROXIMITY" },
  { value: "DESCLOC", label: "DESC PROXIMITY" },
];

const homeStyles = (theme) => ({
  root: {
    height: "100%",
    flexGrow: 1,
  },
  optionUsers: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  searchUserPaper: {
    borderColor: "hsl(0,0%,80%)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  searchInput: {
    padding: "0px 0px 0px 20px",
  },
  searchContainer: {
    flex: 1,
    padding: 0,
  },
  loadMoreContainer: {
    width: "100%",
    marginTop: 5,
    height: 40,
  },
  loadMoreButton: {
    width: "100%",
    borderRadius: 0,
    color: "#E63946",
  },
  filterLeft: {
    flex: 1,
    justifyContent: "space-between",
  },
  filterSpace: {
    flex: 1,
  },
  filterRight: {
    flex: 1,
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
  nativeSelect: {
    width: "100%",
    color: "#545454",
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
  renderSection: {
    height: "100%",
  },
  filterContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "0.5px solid rgba(41, 41, 41, .1)",
  },
  filterCenter: {
    textAlign: "-webkit-center",
  },
  rangeWidth: {
    width: "90%",
  },
  captionIcon: {
    color: "#545454",
  },
  userContainer: {
    padding: "10px 10px 0 10px",
  },
  userPaper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "0.5px solid rgba(41, 41, 41, .3)",
  },
  userCardHeaderTitle: {
    textDecoration: "none",
    color: "#292929",
    margin: 0,
    fontWeight: 500,
    "&:hover": {
      color: "#E63946",
      transition: "0.2s",
      textDecoration: "underline",
    },
  },
  userCardHeaderCaption: {
    color: "#545454",
    margin: 0,
    fontSize: 11,
  },
  userCardInfoTitle: {
    fontSize: 13,
    color: "#292929",
    fontWeight: 500,
  },
  paddingTen: {
    padding: 10,
  },
});

const usersStyles = (theme) => ({
  userContainer: {
    padding: "10px 10px 0 10px",
  },
});

const userStyles = (theme) => ({
  userCardInfoTitle: {
    fontSize: 13,
    color: "#292929",
    fontWeight: 500,
  },
  userCardLink: {
    textDecoration: "none",
    color: "#292929",
  },
});

const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * 35;

  return (
    <FixedSizeList
      height={maxHeight}
      itemCount={!children.length || !children ? 0 : children.length}
      itemSize={35}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}> {children[index]} </div>}
    </FixedSizeList>
  );
};

const RenderUser = (props) => {
  const {
    id,
    username,
    firstname,
    lastname,
    gender,
    sexual_orientation,
    bio,
    popularity,
    connected,
    last_connection,
    country,
    city,
    birthdate,
    photos,
  } = props.user;
  const { classes } = props;
  const photo = photos ? JSON.parse(photos) : null;
  return (
    <Card variant="outlined">
      <Carousel
        defaultControlsConfig={{
          nextButtonText: ">",
          prevButtonText: "<",
          pagingDotsStyle: {
            fill: "#fff",
          },
        }}
      >
        {photo.map((el, index) =>
          el ? (
            <img
              onError={(e) => (e.target.src = "")}
              alt={el + username}
              key={el + username}
              src={el.startsWith("https://") ? el : "./src/assets/photos/" + el}
            />
          ) : undefined
        )}
      </Carousel>
      <CardActionArea disableRipple>
        <Link
          className={classes.userCardLink}
          to={{
            pathname: "/User",
            state: {
              id: id,
            },
          }}
        >
          <CardContent
            style={{
              padding: "5px 5px 0px 5px",
            }}
          >
            <Typography variant="subtitle2">
              {firstname + ' "' + username + '" ' + lastname}
            </Typography>
            <Typography variant="body2">
              {moment().diff(moment(birthdate, "DD/MM/YYYY"), "years", false) +
                " years old. From " +
                country +
                ", " +
                city +
                "."}
            </Typography>
            <Divider></Divider>
            <Typography variant="body2" color="textSecondary">
              {bio}
            </Typography>
            <Divider></Divider>
            <Typography gutterBottom variant="body2">
              <span className={classes.userCardInfoTitle}>Gender:</span>{" "}
              {gender}
            </Typography>
            <Typography gutterBottom variant="body2">
              <span className={classes.userCardInfoTitle}>
                Sexual Orientation:
              </span>{" "}
              {sexual_orientation}
            </Typography>
            <Typography gutterBottom variant="body2">
              <span className={classes.userCardInfoTitle}>Score:</span>{" "}
              {popularity} pts
            </Typography>
            <Typography gutterBottom variant="body2">
              <span className={classes.userCardInfoTitle}>
                {connected ? "Connected" : "Last connection:"}
              </span>{" "}
              {connected ? undefined : last_connection}
              <FiberManualRecordIcon
                style={{
                  fontSize: 11,
                  color: connected ? "#0CCA4A" : "#E63946",
                  verticalAlign: "middle",
                }}
              ></FiberManualRecordIcon>
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
};

class RenderUsers extends Component {
  RenderUserStyled = withStyles(userStyles)(RenderUser);
  render() {
    const { users } = this.props;
    const { classes } = this.props;
    return (
      <div className={classes.userContainer}>
        <Grid container spacing={1}>
          {users && users.length > 0 ? (
            users.map((user, i) => {
              return (
                <Grid item key={user.username} xs={12} sm={6} md={4}>
                  <this.RenderUserStyled user={user}></this.RenderUserStyled>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              No users match your tastes... You either are too demanding or
              there's no user in this country...
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

class Home extends Component {
  constructor() {
    super();
    this.state = {
      searchedUser: "",
      isLoading: true,
      sortedBy: false,
      limit: 20,
      users: 0,
      minAge: 0,
      maxAge: 1,
      minPop: 0,
      maxPop: 1,
      minKm: 0,
      maxKm: 1,
      searchAge: [],
      searchPopularity: [],
      searchProximity: [],
      searchTags: [],
      searchWait: 0,
    };
  }

  _isMounted = false;
  RenderUsersStyled = withStyles(usersStyles)(RenderUsers);

  getUsersList = async (limit, prox) => {
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        limit: limit,
        proximity: prox,
        minAge: this.state.searchAge[0],
        maxAge: this.state.searchAge[1],
        minPop: this.state.searchPopularity[0],
        maxPop: this.state.searchPopularity[1],
        country: this.state.loggedUser.country,
        city: this.state.loggedUser.city,
        searchTags:
          this.state.searchTags.length === 0 &&
          this.state.loggedUser.tags.length === 0
            ? this.state.tagList.map((a) => a.label)
            : this.state.searchTags.length === 0
            ? this.state.loggedUser.tags.map((a) => a.label)
            : this.state.searchTags.map((a) => a.label),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          let max = res.users.length
            ? Math.round(
                res.users.reduce(
                  (max, e) => (e.km > max ? e.km : max),
                  res.users[0].km
                ) / 5
              ) * 5
            : 0;
          this.setState({
            searchProximity: max ? max : 0,
            maxKm: max ? max : 0,
            users: res.users,
            defaultUsers: res.users,
            isLoading: false,
            limit: limit,
          });
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getLoggedUser = async () => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            loggedUser: {
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
            },
          });
          this.getUsersList(20, null);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getMinMax = async () => {
    fetch("/api/search/minMax", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          if (res.criteria !== false) {
            let min = moment().diff(res.criteria[0].maxdate, "years", false);
            let max = moment().diff(res.criteria[0].mindate, "years", false);
            this.setState({
              searchAge: [min, max],
              searchPopularity: [
                res.criteria[0].minpop,
                res.criteria[0].maxpop,
              ],
              minAge: min,
              maxAge: max,
              minPop: res.criteria[0].minpop,
              maxPop: res.criteria[0].maxpop,
            });
            this.getLoggedUser();
          }
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  getSettingsList = async () => {
    fetch("/api/settings/list")
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            tagList: JSON.parse(res.list[0].taglist),
          });
          this.getMinMax();
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  loadMoreUsers = () => {
    this.getUsersList(this.state.limit + 20, this.state.searchProximity);
  };

  handleFilterAge = (e) => {
    this.setState({
      searchAge: e,
    });
  };

  handleFilterPop = (e) => {
    this.setState({
      searchPopularity: e,
    });
  };

  handleFilterProximity = (e) => {
    this.setState({
      searchProximity: e,
    });
  };

  handleAppendTags = (tagToAdd) => {
    this.setState({
      searchTags: tagToAdd,
    });
  };

  handleFilterSearch = (e) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
    });
    this.getUsersList(this.state.limit, this.state.searchProximity);
  };

  handleSortList = (e) => {
    const value = e.value;
    const { users } = this.state;
    if (value === false) {
      users.sort((a, b) =>
        a.tagmatch > b.tagmatch
          ? -1
          : a.tagmatch < b.tagmatch
          ? 1
          : 0 || a.km < b.km
          ? -1
          : a.km > b.km
          ? 1
          : 0 || a.popularity < b.popularity
          ? -1
          : a.popularity > b.popularity
          ? 1
          : 0
      );
    } else if (value === "ASCAGE") {
      users.sort((a, b) => {
        let aAge = moment().diff(
          moment(a.birthdate, "DD/MM/YYYY"),
          "years",
          false
        );
        let bAge = moment().diff(
          moment(b.birthdate, "DD/MM/YYYY"),
          "years",
          false
        );
        return aAge < bAge ? -1 : aAge > bAge ? 1 : 0;
      });
    } else if (value === "DESCAGE") {
      users.sort((a, b) => {
        let aAge = moment().diff(
          moment(a.birthdate, "DD/MM/YYYY"),
          "years",
          false
        );
        let bAge = moment().diff(
          moment(b.birthdate, "DD/MM/YYYY"),
          "years",
          false
        );
        return aAge > bAge ? -1 : aAge < bAge ? 1 : 0;
      });
    } else if (value === "ASCPOP") {
      users.sort((a, b) =>
        a.popularity < b.popularity ? -1 : a.popularity > b.popularity ? 1 : 0
      );
    } else if (value === "DESCPOP") {
      users.sort((a, b) =>
        a.popularity > b.popularity ? -1 : a.popularity < b.popularity ? 1 : 0
      );
    } else if (value === "ASCTAGS") {
      users.sort((a, b) =>
        a.tagmatch < b.tagmatch ? -1 : a.tagmatch > b.tagmatch ? 1 : 0
      );
    } else if (value === "DESCTAGS") {
      users.sort((a, b) =>
        a.tagmatch > b.tagmatch ? -1 : a.tagmatch < b.tagmatch ? 1 : 0
      );
    } else if (value === "ASCLOC") {
      users.sort((a, b) => (a.km < b.km ? -1 : a.km > b.km ? 1 : 0));
    } else if (value === "DESCLOC") {
      users.sort((a, b) => (a.km > b.km ? -1 : a.km < b.km ? 1 : 0));
    }
    this.setState({
      sortedBy: value,
    });
  };

  handleSearchUser = (e) => {
    let value = e.target.value;
    let users = this.state.defaultUsers;
    if (e.target.value) {
      let results = users.filter(
        (el) =>
          el.username.toLowerCase().includes(value.toLowerCase()) ||
          el.firstname.toLowerCase().includes(value.toLowerCase()) ||
          el.lastname.toLowerCase().includes(value.toLowerCase())
      );
      this.setState({ searchedUser: value, users: results });
    } else {
      this.setState({ searchedUser: value, users: this.state.defaultUsers });
    }
  };

  RenderFilters = () => {
    const {
      minAge,
      maxAge,
      minPop,
      maxPop,
      maxKm,
      searchAge,
      searchPopularity,
      searchProximity,
      tagList,
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.filterContainer}>
        <form onSubmit={this.handleFilterSearch}>
          <Grid container spacing={1}>
            <Grid className={classes.filterCenter} item xs={12} sm={4}>
              <Typography id="ageSlider" gutterBottom>
                <span className={classes.userCardHeaderTitle}>Age: </span>
                {searchAge[0] + " - " + searchAge[1]}
              </Typography>
              <Range
                className={classes.rangeWidth}
                trackStyle={[{ backgroundColor: "#E63946" }]}
                handleStyle={[
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E",
                  },
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E",
                  },
                ]}
                min={minAge}
                max={maxAge}
                defaultValue={searchAge}
                onChange={this.handleFilterAge}
              />
            </Grid>
            <Grid className={classes.filterCenter} item xs={12} sm={4}>
              <Typography id="popSlider" gutterBottom>
                <span className={classes.userCardHeaderTitle}>
                  Popularity:{" "}
                </span>
                {searchPopularity[0] + " - " + searchPopularity[1]}
              </Typography>
              <Range
                className={classes.rangeWidth}
                defaultValue={searchPopularity}
                min={minPop}
                max={maxPop}
                onChange={this.handleFilterPop}
                trackStyle={[{ backgroundColor: "#E63946" }]}
                handleStyle={[
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E",
                  },
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E",
                  },
                ]}
              />
            </Grid>
            <Grid className={classes.filterCenter} item xs={12} sm={4}>
              <Typography id="popSlider" gutterBottom>
                <span className={classes.userCardHeaderTitle}>
                  Max proximity:{" "}
                </span>
                {searchProximity}km
              </Typography>
              <Slider
                className={classes.rangeWidth}
                trackStyle={[{ backgroundColor: "#E63946" }]}
                handleStyle={[
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E",
                  },
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E",
                  },
                ]}
                step={5}
                min={0}
                max={maxKm}
                value={searchProximity}
                onChange={this.handleFilterProximity}
              />
              {/* <Range
                className={classes.rangeWidth}
                defaultValue={searchProximity}
                min={minKm}
                max={maxKm}
                onChange={this.handleFilterProximity}
                trackStyle={[{ backgroundColor: "#E63946" }]}
                handleStyle={[
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E"
                  },
                  {
                    borderColor: "#292929",
                    backgroundColor: "#F9712E"
                  }
                ]}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <Select
                closeMenuOnSelect={false}
                isMulti
                filterOption={createFilter({
                  ignoreAccents: false,
                })}
                components={{
                  MenuList,
                }}
                isSearchable={true}
                options={tagList}
                key={"changeTags"}
                onChange={this.handleAppendTags}
                placeholder={"Tags: Yours by default"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={() => window.location.reload()}
                className={classes.loadMoreButton}
                variant="outlined"
                color="secondary"
              >
                RESET
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                className={classes.loadMoreButton}
                variant="outlined"
                color="secondary"
              >
                FILTER
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.user !== this.state.user ? false : true;
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.getSettingsList();
    document.body.style.overflow = "auto";
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    this.setState({
      isLoading: true,
    });
  };

  render() {
    const { isLoading, sortedBy, searchedUser, users, limit } = this.state;
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
        <this.RenderFilters></this.RenderFilters>
        <div className={classes.optionUsers}>
          <div className={classes.filterLeft}>
            <Paper
              elevation={0}
              component="form"
              className={classes.searchUserPaper}
            >
              <InputBase
                classes={{
                  root: classes.searchContainer,
                  input: classes.searchInput,
                }}
                value={searchedUser}
                onChange={this.handleSearchUser}
                placeholder="Search user..."
              />
              <Divider
                style={{ height: 28, margin: 4 }}
                orientation="vertical"
              />
              <SearchIcon
                style={{ color: "hsl(0,0%,80%)", padding: "4px 4px 4px 0px" }}
              />
            </Paper>
          </div>
          <div className={classes.filterSpace}></div>
          <div className={classes.filterRight}>
            <Select
              filterOption={createFilter({
                ignoreAccents: false,
              })}
              components={{
                MenuList,
              }}
              isSearchable={false}
              options={sortOptions}
              key={"changeOrder"}
              onChange={this.handleSortList}
              value={"SORT BY: " + sortedBy}
              placeholder={
                sortedBy === "SORT BY: ASCAGE"
                  ? "SORT BY: ASC. AGE"
                  : sortedBy === "DESCAGE"
                  ? "SORT BY: DESC. AGE"
                  : sortedBy === "ASCPOP"
                  ? "SORT BY: ASC. POP"
                  : sortedBy === "DESCPOP"
                  ? "SORT BY: DESC. POP"
                  : sortedBy === "ASCTAGS"
                  ? "SORT BY: ASC. TAGS"
                  : sortedBy === "DESCTAGS"
                  ? "SORT BY: DESC. TAGS"
                  : sortedBy === "ASCLOC"
                  ? "SORT BY: ASC. LOC"
                  : sortedBy === "DESCLOC"
                  ? "SORT BY: DESC. LOC"
                  : "SORT BY: DEFAULT"
              }
            />
          </div>
        </div>
        <this.RenderUsersStyled
          users={users}
          limit={limit}
        ></this.RenderUsersStyled>
        <div>
          {users && users.length > limit - 1 ? (
            <div className={classes.loadMoreContainer}>
              <Button
                className={classes.loadMoreButton}
                variant="outlined"
                color="secondary"
                onClick={this.loadMoreUsers}
              >
                LOAD MORE...
              </Button>
            </div>
          ) : undefined}
        </div>
      </div>
    );
  }
}

export default withStyles(homeStyles)(Home);
