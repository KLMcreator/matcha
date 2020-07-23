// react
import moment from "moment";
import React, { Component } from "react";
// framework
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
// icons
import ErrorIcon from "@material-ui/icons/Error";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const SignUpStyles = theme => ({
  errorCheck: {
    color: "#E63946",
    fontSize: 12,
    marginBottom: 3,
    marginTop: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  iconsMessage: {
    marginRight: 4
  },
  loading: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingLogo: {
    color: "#E63946"
  },
  paperContainer: {
    height: "100%",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      padding: "20px 0px 20px 0px",
      textAlign: "-webkit-center"
    }
  },
  cardSection: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "hsl(0,0%,80%)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: 1,
    width: "60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      width: "90%"
    }
  },
  mainGrid: {
    padding: 40
  },
  elGrid: {
    marginBottom: 15
  },
  rootInputText: {
    fontSize: 13
  },
  rootInput: {
    width: "100%",
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e63946"
    }
  },
  label: {
    "&$focusedLabel": {
      color: "#e63946"
    }
  },
  focusedLabel: {},
  submitButton: {
    width: "100%"
  },
  select: {
    width: "100%",
    fontSize: 13,
    "&:after": {
      borderBottomColor: "#e63946"
    }
  },
  formControl: {
    width: "100%"
  }
});

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: "",
      lastname: "",
      firstname: "",
      gender: "",
      birthday: "",
      email: "",
      password: "",
      confirmedPassword: "",
      pwdMatches: true,
      pwdWhiteSpaces: true,
      lastNameWhiteSpaces: true,
      firstNameWhiteSpaces: true,
      emailWhiteSpaces: true,
      usernameWhiteSpaces: true,
      nameRegExp: true,
      usernameRegex: true,
      pwdRegLet: false,
      pwdRegCap: false,
      pwdRegDig: false,
      pwdRegLen: false
    };
  }

  _isMounted = false;

  checkRegexUsername = str => {
    var accentedCharacters =
      "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
    const checkSpecChar = new RegExp(
      "^[-'A-Z" + accentedCharacters + "a-z0-9 ]+$"
    );
    if (checkSpecChar.test(str) === true) {
      this.setState({ usernameRegex: true });
    } else {
      this.setState({ usernameRegex: false });
    }
  };

  checkRegexLastname = str => {
    var accentedCharacters =
      "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
    const checkSpecChar = new RegExp(
      "^[-'A-Z" + accentedCharacters + "a-z0-9 ]+$"
    );
    if (checkSpecChar.test(str) === true) {
      this.setState({ lastNameRegExp: true });
    } else {
      this.setState({ lastNameRegExp: false });
    }
  };

  checkRegexFirstname = str => {
    var accentedCharacters =
      "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
    const checkSpecChar = new RegExp(
      "^[-'A-Z" + accentedCharacters + "a-z0-9 ]+$"
    );
    if (checkSpecChar.test(str) === true) {
      this.setState({ firstNameRegExp: true });
    } else {
      this.setState({ firstNameRegExp: false });
    }
  };

  checkPasswordMatch = (str1, str2) => {
    if (str1 !== str2) {
      this.setState({ pwdMatches: false });
      return false;
    } else {
      this.setState({ pwdMatches: true });
      return true;
    }
  };

  checkEmailLength = str => {
    if (str.length === str.replace(/\s/g, "").length) {
      this.setState({ emailWhiteSpaces: true });
    } else {
      this.setState({ emailWhiteSpaces: false });
    }
  };

  checkUsernameLength = str => {
    if (str.length === str.replace(/\s/g, "").length) {
      this.setState({ usernameWhiteSpaces: true });
    } else {
      this.setState({ usernameWhiteSpaces: false });
    }
  };

  checkFirstnameLength = str => {
    if (str.length === str.replace(/\s/g, "").length) {
      this.setState({ firstNameWhiteSpaces: true });
    } else {
      this.setState({ firstNameWhiteSpaces: false });
    }
  };

  checkLastnameLength = str => {
    if (str.length === str.replace(/\s/g, "").length) {
      this.setState({ lastNameWhiteSpaces: true });
    } else {
      this.setState({ lastNameWhiteSpaces: false });
    }
  };

  checkPasswordLength = str => {
    if (str.length === str.replace(/\s/g, "").length) {
      this.setState({ pwdWhiteSpaces: true });
    } else {
      this.setState({ pwdWhiteSpaces: false });
    }
  };

  createUser = e => {
    e.preventDefault();
    fetch("/api/signUp", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        email: this.state.email,
        birthDate: moment(
          moment(this.state.birthday, "YYYY-MM-DD").toDate()
        ).format("DD/MM/YYYY"),
        gender: this.state.gender,
        password: this.state.password,
        confirmedPassword: this.state.confirmedPassword
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        if (res.signup.signup) {
          this.props.auth.successMessage("Account created! Check your mails.");
          this.props.props.history.push("/SignIn");
        } else {
          this.props.auth.errorMessage(res.signup.msg);
        }
      })
      .catch(err => this.props.auth.errorMessage(err));
  };

  handleChangeGender = e => {
    this.setState({ gender: e.target.value });
  };

  handleChangeUsername = e => {
    this.setState({ username: e.target.value });
    this.checkUsernameLength(e.target.value);
    this.checkRegexUsername(e.target.value);
  };

  handleChangeLastname = e => {
    this.setState({ lastname: e.target.value });
    this.checkLastnameLength(e.target.value);
    this.checkRegexLastname(e.target.value);
  };

  handleChangeFirstname = e => {
    this.setState({ firstname: e.target.value });
    this.checkFirstnameLength(e.target.value);
    this.checkRegexFirstname(e.target.value);
  };

  handleChangeEmail = e => {
    this.setState({ email: e.target.value });
    this.checkEmailLength(e.target.value);
  };

  handleChangePassword = e => {
    const letters = new RegExp("^(?=.*[a-z])");
    const capitals = new RegExp("^(?=.*[A-Z])");
    const digit = new RegExp("^(?=.*[0-9])");
    const length = new RegExp("^(?=.{8,})");
    this.setState({
      pwdRegLet: letters.test(e.target.value),
      pwdRegCap: capitals.test(e.target.value),
      pwdRegDig: digit.test(e.target.value),
      pwdRegLen: length.test(e.target.value),
      password: e.target.value
    });
    this.checkPasswordMatch(e.target.value, this.state.confirmedPassword);
    this.checkPasswordLength(e.target.value);
  };

  handleChangeConfirmedPassword = e => {
    this.setState({ confirmedPassword: e.target.value });
    this.checkPasswordMatch(this.state.password, e.target.value);
  };

  handleChangeDate = e => {
    this.setState({ birthday: e.target.value });
  };

  componentDidMount = () => {
    this._isMounted = true;
    document.body.style.overflow = "auto";
    this.setState({ isLoading: false });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    this.setState({ isLoading: true });
  };

  render() {
    const {
      isLoading,
      username,
      usernameWhiteSpaces,
      usernameRegex,
      lastname,
      lastNameWhiteSpaces,
      firstname,
      firstNameWhiteSpaces,
      lastNameRegExp,
      firstNameRegExp,
      emailWhiteSpaces,
      email,
      password,
      confirmedPassword,
      birthday,
      gender,
      pwdMatches,
      pwdWhiteSpaces,
      pwdRegLet,
      pwdRegCap,
      pwdRegLen,
      pwdRegDig
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
      <div id="unloggedRoot" className={classes.paperContainer}>
        <Paper className={classes.cardSection} elevation={0}>
          <form
            onSubmit={event => {
              this.createUser(event);
            }}
          >
            <Grid container spacing={1} className={classes.mainGrid}>
              <Grid item xs={12} sm={4} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    }
                  }}
                  required
                  id="usernameTextfield"
                  label="Username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChangeUsername}
                />
                {!usernameWhiteSpaces ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Username must not contain white space.
                  </p>
                ) : (
                  undefined
                )}
                {!usernameRegex ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Username must only contain letters.
                  </p>
                ) : (
                  undefined
                )}
              </Grid>
              <Grid item xs={12} sm={4} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    }
                  }}
                  required
                  id="lastnameTextfield"
                  label="Last Name"
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={this.handleChangeLastname}
                />
                {lastNameWhiteSpaces === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Last name must not contain white space.
                  </p>
                ) : (
                  undefined
                )}
                {lastNameRegExp === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Only letters are allowed for last name.
                  </p>
                ) : (
                  undefined
                )}
              </Grid>
              <Grid item xs={12} sm={4} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    }
                  }}
                  required
                  id="firstnameTextfield"
                  label="First Name"
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={this.handleChangeFirstname}
                />
                {firstNameWhiteSpaces === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    First name must not contain white space.
                  </p>
                ) : (
                  undefined
                )}
                {firstNameRegExp === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Only letters are allowed for first name.
                  </p>
                ) : (
                  undefined
                )}
              </Grid>
              <Grid item xs={12} sm={4} className={classes.elGrid}>
                <FormControl className={classes.formControl}>
                  <InputLabel
                    classes={{
                      root: classes.label,
                      focused: classes.focusedLabel
                    }}
                    id="genderUser"
                  >
                    Gender
                  </InputLabel>
                  <Select
                    required
                    className={classes.select}
                    labelId="genderUser"
                    id="selectGender"
                    value={gender}
                    onChange={this.handleChangeGender}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    },
                    shrink: true
                  }}
                  required
                  label="Birthdate"
                  type="date"
                  id="birthdate"
                  value={birthday}
                  onChange={this.handleChangeDate}
                />
              </Grid>
              <Grid item xs={12} sm={4} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    }
                  }}
                  required
                  id="emailTextfield"
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChangeEmail}
                />
                {emailWhiteSpaces === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Email must not contain white space
                  </p>
                ) : (
                  undefined
                )}
              </Grid>
              <Grid item xs={12} sm={6} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    }
                  }}
                  required
                  id="passwordTextfield"
                  label="Password"
                  autoComplete="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChangePassword}
                />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput
                  }}
                  inputProps={{
                    className: classes.rootInputText
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel
                    }
                  }}
                  required
                  id="confirmedPasswordTextfield"
                  label="Confirmed password"
                  type="password"
                  autoComplete="password"
                  name="confirmedPassword"
                  value={confirmedPassword}
                  onChange={this.handleChangeConfirmedPassword}
                />
              </Grid>
              <Grid item xs={12} className={classes.elGrid}>
                {pwdMatches === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Passwords don't match
                  </p>
                ) : (
                  undefined
                )}
                {pwdWhiteSpaces === false ? (
                  <p className={classes.errorCheck}>
                    <ErrorIcon className={classes.iconsMessage} />
                    Password must not contain white space
                  </p>
                ) : (
                  undefined
                )}
                {pwdRegLet === false ? (
                  <p className={classes.errorCheck}>
                    <RadioButtonUncheckedIcon
                      className={classes.iconsMessage}
                    />
                    Password must contain at least one letter
                  </p>
                ) : (
                  undefined
                )}
                {pwdRegCap === false ? (
                  <p className={classes.errorCheck}>
                    <RadioButtonUncheckedIcon
                      className={classes.iconsMessage}
                    />
                    Password must contain at least one Capital Letter
                  </p>
                ) : (
                  undefined
                )}{" "}
                {pwdRegLen === false ? (
                  <p className={classes.errorCheck}>
                    <RadioButtonUncheckedIcon
                      className={classes.iconsMessage}
                    />
                    Password must contain at least 8 characters
                  </p>
                ) : (
                  undefined
                )}{" "}
                {pwdRegDig === false ? (
                  <p className={classes.errorCheck}>
                    <RadioButtonUncheckedIcon
                      className={classes.iconsMessage}
                    />
                    Password must contain at least one digit
                  </p>
                ) : (
                  undefined
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  className={classes.submitButton}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(SignUpStyles)(SignUp);
