// files
import geo from "./../geo.json";
// react
import moment from "moment";
import Carousel from "nuka-carousel";
import React, { Component } from "react";
import { FixedSizeList } from "react-window";
import Select, { createFilter } from "react-select";
// framework
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContentText from "@material-ui/core/DialogContentText";
// icons
import EditIcon from "@material-ui/icons/Edit";

const settingsStyle = (theme) => ({
  root: {
    margin: 10,
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
    marginBottom: 5,
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
    backgroundColor: "#fff",
    borderColor: "hsl(0,0%,80%)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: 1,
    marginRight: 5,
    alignSelf: "start",
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginBottom: 5,
    },
  },
  infoRight: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "hsl(0,0%,80%)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: 1,
    marginLeft: 5,
    alignSelf: "start",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginTop: 5,
    },
  },
  infoList: {
    padding: 0,
    margin: 10,
  },
  infoListItem: {
    padding: 5,
    display: "flex",
  },
  rootInputText: {
    fontSize: 13,
  },
  rootInput: {
    width: "100%",
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e63946",
    },
  },
  label: {
    "&$focusedLabel": {
      color: "#e63946",
    },
  },
  focusedLabel: {},
  fullWidth: {
    width: "100%",
  },
  fullWidthNoPadding: {
    width: "100%",
    padding: 0,
  },
  okButton: {
    color: "#E63946",
  },
});

class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * 35;

    return (
      <FixedSizeList
        height={maxHeight}
        itemCount={!children.length || !children ? 0 : children.length}
        itemSize={35}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </FixedSizeList>
    );
  }
}

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      newUploadPic: null,
      profilePicIndex: null,
      totalPhotos: 0,
      appendTag: null,
      deleteAccountDialog: false,
      geoMeDialog: false,
      countries: false,
      cities: false,
    };
  }

  _isMounted = false;

  getSettingsList = async () => {
    fetch("/api/settings/list")
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          isLoading: false,
          genderList: JSON.parse(res.list[0].genderlist).filter(
            (el) => el.label !== this.state.gender
          ),
          sexualList: JSON.parse(res.list[0].sexuallist).filter(
            (el) => el.label !== this.state.sexual_orientation
          ),
          tagList: JSON.parse(res.list[0].taglist).filter(
            (el) => !this.state.tags.some((ele) => el.label === ele.label)
          ),
        });
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  citiesCountriesSort = (prop) => {
    var sortOrder = 1;

    if (prop[0] === "-") {
      sortOrder = -1;
      prop = prop.substr(1);
    }

    return function (a, b) {
      if (sortOrder === -1) {
        return b[prop].localeCompare(a[prop]);
      } else {
        return a[prop].localeCompare(b[prop]);
      }
    };
  };

  getCountries = () => {
    let geoEntries = Object.entries(geo);
    let countries = [];
    let i = 0;
    let len = geoEntries.length;
    if (this.state.country) {
      let cities = [];
      let pos = -42;
      let userCountry = this.state.country;
      while (i < len) {
        countries.push({ value: i, label: geoEntries[i][0] });
        if (geoEntries[i][0] === userCountry) {
          pos = i;
        }
        i++;
      }
      i = 0;
      len = geoEntries[pos][1].length;
      while (i < len) {
        cities.push({ value: i, label: geoEntries[pos][1][i] });
        i++;
      }
      this.setState({ countries: countries, cities: cities });
    } else {
      while (i < len) {
        countries.push({ value: i, label: geoEntries[i][0] });
        i++;
      }
      this.setState({ countries: countries });
    }
    this.getSettingsList();
  };

  getLoggedUser = async () => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            id: res.user[0].id,
            password: "",
            newPassword: "",
            verifPassword: "",
            username: res.user[0].username,
            firstname: res.user[0].firstname,
            lastname: res.user[0].lastname,
            email: res.user[0].email,
            newEmail: "",
            verifEmail: "",
            birthdate: moment(
              moment(res.user[0].birthdate, "DD/MM/YYYY").toDate()
            ).format("YYYY-MM-DD"),
            country: res.user[0].country ? res.user[0].country : "",
            city: res.user[0].city ? res.user[0].city : "",
            gender: res.user[0].gender ? res.user[0].gender : "",
            sexual_orientation: res.user[0].sexual_orientation
              ? res.user[0].sexual_orientation
              : "",
            tags: res.user[0].tags ? JSON.parse(res.user[0].tags) : [],
            bio: res.user[0].bio ? res.user[0].bio : "",
            photos: JSON.parse(res.user[0].photos),
            totalPhotos:
              JSON.parse(res.user[0].photos).indexOf(null) === -1
                ? 5
                : JSON.parse(res.user[0].photos).indexOf(null),
          });
          this.getCountries();
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  checkIfCompleted = () => {
    fetch("/api/settings/checkIfCompleted", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.isCompleted === true) {
          this.props.auth.setCompleted();
          this.props.auth.successMessage(
            "Your profile is now set as completed!"
          );
        } else {
          this.props.auth.setNotCompleted();
          this.props.auth.errorMessage("Your profile is still not complete!");
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editEmail = (e) => {
    e.preventDefault();
    fetch("/api/settings/email", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        newEmail: this.state.newEmail,
        verifEmail: this.state.verifEmail,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.props.auth.setLoggedOut(() =>
            this.props.props.history.push("/")
          );
          this.props.props.history.push("/");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editPassword = (e) => {
    e.preventDefault();
    fetch("/api/settings/password", {
      method: "POST",
      body: JSON.stringify({
        password: this.state.password,
        newPassword: this.state.newPassword,
        verifPassword: this.state.verifPassword,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.props.auth.setLoggedOut(() =>
            this.props.props.history.push("/")
          );
          this.props.props.history.push("/");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editBirthdate = (e) => {
    e.preventDefault();
    fetch("/api/settings/birthdate", {
      method: "POST",
      body: JSON.stringify({
        birthdate: this.state.birthdate,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.props.auth.successMessage("Birthdate updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editGender = (e) => {
    e.preventDefault();
    if (
      this.state.gender === "Male" &&
      this.state.sexual_orientation === "Lesbian"
    ) {
      this.props.auth.errorMessage(
        "You can't be a male lesbian, male are homosexuals."
      );
    } else {
      fetch("/api/settings/gender", {
        method: "POST",
        body: JSON.stringify({ gender: this.state.gender }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.edit.edit === true) {
            this.props.auth.successMessage("Gender updated.");
          } else {
            this.props.auth.errorMessage(res.edit.msg);
          }
        })
        .catch((err) => this.props.auth.errorMessage(err));
    }
  };

  editSexOr = (e) => {
    e.preventDefault();
    if (
      this.state.gender === "Male" &&
      this.state.sexual_orientation === "Lesbian"
    ) {
      this.props.auth.errorMessage(
        "You can't be a male lesbian, male are homosexuals."
      );
    } else {
      fetch("/api/settings/sexor", {
        method: "POST",
        body: JSON.stringify({
          sexual_orientation: this.state.sexual_orientation,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.edit.edit === true) {
            this.props.auth.successMessage("Sexual orientation updated.");
          } else {
            this.props.auth.errorMessage(res.edit.msg);
          }
        })
        .catch((err) => this.props.auth.errorMessage(err));
    }
  };

  editTags = (e) => {
    e.preventDefault();
    const { addTags } = this.state;
    let userTags = this.state.tags;
    if (addTags && addTags.length) {
      addTags.map((el) => userTags.push(el));
    }
    fetch("/api/settings/tags", {
      method: "POST",
      body: JSON.stringify({ tags: userTags }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.setState({ tags: userTags, addTags: null });
          this.getSettingsList();
          this.checkIfCompleted();
          this.props.auth.successMessage("Tags updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editBio = (e) => {
    e.preventDefault();
    let bio = this.state.bio;
    if (bio.length < 280) {
      fetch("/api/settings/bio", {
        method: "POST",
        body: JSON.stringify({ bio: this.state.bio }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.edit.edit === true) {
            this.props.auth.successMessage("Bio updated.");
          } else {
            this.props.auth.errorMessage(res.edit.msg);
          }
          this.checkIfCompleted();
        })
        .catch((err) => this.props.auth.errorMessage(err));
    } else {
      this.props.auth.errorMessage("Bio max length is 280 char.");
    }
  };

  deleteUser = (e) => {
    fetch("/api/settings/delete/user", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.delete === true) {
          this.setState({ deleteAccountDialog: false });
          this.props.auth.setLoggedOut(() =>
            this.props.props.history.push("/")
          );
          this.props.props.history.push("/");
        } else {
          this.props.auth.errorMessage(res.delete.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  geoLocateMe = (e) => {
    this.props.handleLocation();
    this.handleCloseGeo();
  };

  editFirstname = (e) => {
    e.preventDefault();
    fetch("/api/settings/firstname", {
      method: "POST",
      body: JSON.stringify({ firstname: this.state.firstname }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.props.auth.successMessage("First name updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editLastname = (e) => {
    e.preventDefault();
    fetch("/api/settings/lastname", {
      method: "POST",
      body: JSON.stringify({ lastname: this.state.lastname }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.props.auth.successMessage("Last name updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editFirstProfilePicture = (e) => {
    e.preventDefault();
    let photos = [...this.state.photos];
    let tmp = photos[0];
    photos[0] = photos[this.state.profilePicIndex];
    photos[this.state.profilePicIndex] = tmp;
    fetch("/api/settings/edit/photo", {
      method: "POST",
      body: JSON.stringify({ photos: photos }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.setState({
            profilePicIndex: null,
            photos: photos,
          });
          this.props.auth.successMessage("Main profile picture updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  editLocation = (e) => {
    e.preventDefault();
    fetch("/api/settings/location", {
      method: "POST",
      body: JSON.stringify({
        country: this.state.country,
        city: this.state.city,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.location === true) {
          this.props.auth.successMessage("Location updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
        this.checkIfCompleted();
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  deleteProfilePicture = (e) => {
    e.preventDefault();
    fetch("/api/settings/delete/photo", {
      method: "POST",
      body: JSON.stringify({
        photos: this.state.photos,
        index: this.state.profilePicIndex,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.setState({
            profilePicIndex: null,
            totalPhotos: this.state.totalPhotos - 1,
            photos: res.edit.photos,
          });
          this.props.auth.successMessage("Photo deleted updated.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  addNewProfilePicture = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", this.state.newUploadPic);
    formData.append("photos", JSON.stringify(this.state.newPhotos));
    formData.append("index", this.state.totalPhotos);
    fetch("/api/settings/add/photo", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.edit.edit === true) {
          this.checkIfCompleted();
          this.setState({
            totalPhotos: this.state.totalPhotos + 1,
            photos: res.edit.photos,
            newUploadPic: null,
            newPhotos: null,
          });
          this.props.auth.successMessage("New photo added.");
        } else {
          this.props.auth.errorMessage(res.edit.msg);
        }
        document.getElementById("addProfilePicture").reset();
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  handleChangeCountry = (newCountry) => {
    let cities = Object.entries(geo)[newCountry.value][1];
    let cityList = [];
    let i = 0;
    let len = cities.length;
    while (i < len) {
      cityList.push({ value: i, label: cities[i] });
      i++;
    }
    this.setState({
      country: newCountry.label,
      cities: cityList,
    });
  };

  handleChangeBio = (e) => {
    this.setState({ bio: e.target.value });
  };

  handleChangeFirstName = (e) => {
    this.setState({ firstname: e.target.value });
  };

  handleChangeLastName = (e) => {
    this.setState({ lastname: e.target.value });
  };

  handleChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  handleChangeNewEmail = (e) => {
    this.setState({ newEmail: e.target.value });
  };

  handleChangeVerifyEmail = (e) => {
    this.setState({ verifEmail: e.target.value });
  };

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleChangeNewPassword = (e) => {
    this.setState({ newPassword: e.target.value });
  };

  handleChangeVerifyPassword = (e) => {
    this.setState({ verifPassword: e.target.value });
  };

  handleChangeCity = (newCity) => {
    this.setState({ city: newCity.label });
  };

  handleChangeGender = (newGender) => {
    let newGenderList = this.state.genderList;
    newGenderList = newGenderList.filter((el) => el.label !== newGender.label);
    newGenderList.push({
      value: newGenderList.length
        ? newGenderList[newGenderList.length - 1].value + 1
        : 0,
      label: this.state.gender,
    });
    this.setState({ gender: newGender.label, genderList: newGenderList });
  };

  handleChangeSexOr = (newSexOr) => {
    let newSexOrList = this.state.sexualList;
    newSexOrList = newSexOrList.filter((el) => el.label !== newSexOr.label);
    newSexOrList.push({
      value: newSexOrList.length
        ? newSexOrList[newSexOrList.length - 1].value + 1
        : 0,
      label: this.state.sexual_orientation,
    });
    this.setState({
      sexual_orientation: newSexOr.label,
      sexualList: newSexOrList,
    });
  };

  handleAppendTags = (tagToAdd) => {
    this.setState({ addTags: tagToAdd });
  };

  handleDeleteTags = (tagToDelete) => () => {
    const oldTags = this.state.tags.filter(
      (el) => el.value !== tagToDelete.value
    );
    let newTagList = this.state.tagList;
    newTagList.push(tagToDelete);
    this.setState({ tags: oldTags, tagList: newTagList });
  };

  handleChangeDate = (e) => {
    this.setState({ birthdate: e.target.value });
  };

  handleUploadPic = (e) => {
    if (e.target.files) {
      let newPhotos = [...this.state.photos];
      newPhotos[this.state.totalPhotos] = e.target.files[0].name;
      this.setState({ newUploadPic: e.target.files[0], newPhotos: newPhotos });
    }
  };

  handleClickOpen = () => {
    this.setState({ deleteAccountDialog: true });
  };

  handleClose = () => {
    this.setState({ deleteAccountDialog: false });
  };

  handleClickGeo = () => {
    this.setState({ geoMeDialog: true });
  };

  handleCloseGeo = () => {
    this.setState({ geoMeDialog: false });
  };

  handleSlide = (el) => {
    this.setState({ profilePicIndex: el > 0 ? el : null });
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
      newEmail,
      verifEmail,
      birthdate,
      password,
      newPassword,
      verifPassword,
      gender,
      sexual_orientation,
      tags,
      bio,
      photos,
      genderList,
      sexualList,
      tagList,
      profilePicIndex,
      totalPhotos,
      deleteAccountDialog,
      geoMeDialog,
      country,
      countries,
      city,
      cities,
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
        <div className={classes.paperContainer}>
          <div className={classes.infoContainer}>
            <div className={classes.infoLeft}>
              <List className={classes.infoList}>
                <ListItem
                  style={{ justifyContent: "center" }}
                  className={classes.infoListItem}
                >
                  <Carousel
                    height={"128px"}
                    width={"128px"}
                    afterSlide={this.handleSlide}
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
                          height={128}
                          width={128}
                          src={
                            el.startsWith("https://")
                              ? el
                              : "./src/assets/photos/" + el
                          }
                        />
                      ) : undefined
                    )}
                  </Carousel>
                </ListItem>
                {totalPhotos < 5 ? (
                  <ListItem className={classes.infoListItem}>
                    <form
                      className={classes.fullWidth}
                      id="addProfilePicture"
                      encType="multipart/form-data"
                      onSubmit={this.addNewProfilePicture}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <input
                            className={classes.fullWidth}
                            type="file"
                            id="file"
                            name="file"
                            accept="image/png, image/jpeg"
                            onChange={this.handleUploadPic}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            className={classes.fullWidthNoPadding}
                            variant="outlined"
                            color="secondary"
                            type="submit"
                          >
                            UPLOAD NEW PICTURE
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </ListItem>
                ) : undefined}
                {profilePicIndex !== null && totalPhotos > 1 ? (
                  <ListItem className={classes.infoListItem}>
                    <form
                      className={classes.fullWidth}
                      onSubmit={this.editFirstProfilePicture}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                          <Button
                            className={classes.fullWidthNoPadding}
                            type="submit"
                            variant="outlined"
                            color="secondary"
                          >
                            SET AS DEFAULT
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </ListItem>
                ) : undefined}
                {profilePicIndex !== null && totalPhotos > 1 ? (
                  <ListItem className={classes.infoListItem}>
                    <form
                      className={classes.fullWidth}
                      onSubmit={this.deleteProfilePicture}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                          <Button
                            className={classes.fullWidthNoPadding}
                            variant="outlined"
                            color="secondary"
                            type="submit"
                          >
                            DELETE PICTURE
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </ListItem>
                ) : undefined}
                <ListItem className={classes.infoListItem}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12}>
                      <Button
                        className={classes.fullWidthNoPadding}
                        variant="outlined"
                        color="secondary"
                        onClick={this.handleClickOpen}
                      >
                        DELETE MY ACCOUNT
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12}>
                      <Button
                        className={classes.fullWidthNoPadding}
                        variant="outlined"
                        color="secondary"
                        onClick={this.handleClickGeo}
                      >
                        GEOLOCATE ME
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <form
                        className={classes.fullWidth}
                        onSubmit={this.editFirstname}
                      >
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="firstnametextfield"
                          label="Firstname"
                          type="text"
                          name="firstnametextfield"
                          value={firstname}
                          onChange={this.handleChangeFirstName}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size={"small"}
                                  className={classes.okButton}
                                  type="submit"
                                >
                                  <EditIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <form
                        className={classes.fullWidth}
                        onSubmit={this.editLastname}
                      >
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="lastnametextfield"
                          label="Lastname"
                          type="text"
                          name="lastnametextfield"
                          value={lastname}
                          onChange={this.handleChangeLastName}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size={"small"}
                                  className={classes.okButton}
                                  type="submit"
                                >
                                  <EditIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <form
                        className={classes.fullWidth}
                        onSubmit={this.editBirthdate}
                      >
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="birthdatetextfield"
                          label="Birthdate"
                          type="date"
                          name="birthdatetextfield"
                          value={birthdate}
                          onChange={this.handleChangeDate}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size={"small"}
                                  className={classes.okButton}
                                  type="submit"
                                >
                                  <EditIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <form
                        className={classes.fullWidth}
                        onSubmit={this.editBio}
                      >
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="biotextfield"
                          label="Bio"
                          type="text"
                          name="biotextfield"
                          value={bio}
                          onChange={this.handleChangeBio}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disabled={bio.length < 280 ? false : true}
                                  size={"small"}
                                  className={classes.okButton}
                                  type="submit"
                                >
                                  <EditIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <form className={classes.fullWidth} onSubmit={this.editEmail}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="oldemailtextfield"
                          label="Old Email"
                          type="email"
                          name="oldemailtextfield"
                          value={email}
                          onChange={this.handleChangeEmail}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="newemailtextfield"
                          label="New Email"
                          type="email"
                          name="newemailtextfield"
                          value={newEmail}
                          onChange={this.handleChangeNewEmail}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="verifyemailtextield"
                          label="Verify Email"
                          type="email"
                          name="verifyemailtextield"
                          value={verifEmail}
                          onChange={this.handleChangeVerifyEmail}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          className={classes.fullWidthNoPadding}
                          type="submit"
                          variant="outlined"
                          color="secondary"
                        >
                          EDIT EMAIL
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <form
                    className={classes.fullWidth}
                    onSubmit={this.editPassword}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="oldpwdtextfield"
                          label="Old Password"
                          type="password"
                          name="oldpwdtextfield"
                          value={password}
                          onChange={this.handleChangePassword}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="newpwdtextfield"
                          label="New Password"
                          type="password"
                          name="newpwdtextfield"
                          value={newPassword}
                          onChange={this.handleChangeNewPassword}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          classes={{
                            root: classes.rootInput,
                          }}
                          inputProps={{
                            className: classes.rootInputText,
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.label,
                              focused: classes.focusedLabel,
                            },
                          }}
                          required
                          id="verifypwdtextield"
                          label="Verify Password"
                          type="password"
                          name="verifypwdtextield"
                          value={verifPassword}
                          onChange={this.handleChangeVerifyPassword}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          className={classes.fullWidthNoPadding}
                          type="submit"
                          variant="outlined"
                          color="secondary"
                        >
                          EDIT PASSWORD
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </ListItem>
              </List>
            </div>
            <div className={classes.infoRight}>
              <List className={classes.infoList}>
                <ListItem className={classes.infoListItem}>
                  <form
                    className={classes.fullWidth}
                    onSubmit={this.editLocation}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Select
                          className={classes.fullWidth}
                          filterOption={createFilter({ ignoreAccents: false })}
                          components={{ MenuList }}
                          key={"changeCountries"}
                          placeholder={country ? country : "Your country"}
                          isSearchable={true}
                          onChange={this.handleChangeCountry}
                          options={countries}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Select
                          className={classes.fullWidth}
                          filterOption={createFilter({ ignoreAccents: false })}
                          isSearchable={true}
                          key={"changeCities"}
                          isDisabled={country ? false : true}
                          components={{ MenuList }}
                          options={cities}
                          onChange={this.handleChangeCity}
                          placeholder={city ? city : "Your city"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          className={classes.fullWidthNoPadding}
                          type="submit"
                          variant="outlined"
                          color="secondary"
                        >
                          EDIT LOCATION
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <form
                    className={classes.fullWidth}
                    onSubmit={this.editGender}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12}>
                        <Select
                          className={classes.fullWidth}
                          filterOption={createFilter({ ignoreAccents: false })}
                          components={{ MenuList }}
                          key={"changeGender"}
                          placeholder={gender}
                          isSearchable={true}
                          onChange={this.handleChangeGender}
                          options={genderList}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          className={classes.fullWidthNoPadding}
                          type="submit"
                          variant="outlined"
                          color="secondary"
                        >
                          EDIT GENDER
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <form className={classes.fullWidth} onSubmit={this.editSexOr}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12}>
                        <Select
                          className={classes.fullWidth}
                          filterOption={createFilter({ ignoreAccents: false })}
                          components={{ MenuList }}
                          key={"changeSexOr"}
                          placeholder={sexual_orientation}
                          isSearchable={true}
                          onChange={this.handleChangeSexOr}
                          options={sexualList}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          className={classes.fullWidthNoPadding}
                          type="submit"
                          variant="outlined"
                          color="secondary"
                        >
                          EDIT SEXUAL ORIENTATION
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </ListItem>
                <ListItem className={classes.infoListItem}>
                  <form className={classes.fullWidth} onSubmit={this.editTags}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12}>
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          value={this.state.addTags}
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
                          placeholder={"Add interests to your list..."}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        {tags.map((data) => {
                          return (
                            <Chip
                              key={data.label + data.value + data.label}
                              label={data.label}
                              onDelete={this.handleDeleteTags(data)}
                            />
                          );
                        })}
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          className={classes.fullWidthNoPadding}
                          type="submit"
                          variant="outlined"
                          color="secondary"
                        >
                          EDIT TAGS
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </ListItem>
              </List>
            </div>
          </div>
        </div>
        <Dialog
          open={deleteAccountDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"DELETE ACCOUNT"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your account and all the related
              informations?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.deleteUser} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={geoMeDialog}
          onClose={this.handleCloseGeo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"GEOLOCATE ME"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will re-adjust your location details
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseGeo} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.geoLocateMe} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(settingsStyle)(Settings);
