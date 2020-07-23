// react
import React, { Component } from "react";
// framework
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const ConfirmStyles = (theme) => ({
  loading: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    color: "#E63946",
  },
});

class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  _isMounted = false;

  verifyAccount = () => {
    const params = new URLSearchParams(this.props.props.location.search);
    if (params.has("r") && params.has("u") && params.has("e")) {
      let r = params.get("r");
      let u = params.get("u");
      let e = params.get("e");
      fetch("/api/confirm/account", {
        method: "POST",
        body: JSON.stringify({
          r: r,
          u: u,
          e: e,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (this._isMounted) {
            if (res.confirm.confirm === true) {
              this.props.auth.successMessage("Your account is now confirmed!");
              this.props.props.history.push("/");
            } else {
              this.props.auth.errorMessage(res.confirm.msg);
              this.props.props.history.push("/");
            }
          }
        })
        .catch((err) => this.props.auth.errorMessage(err));
    } else {
      this.props.props.history.push("/");
    }
  };

  componentDidMount() {
    this._isMounted = true;
    this.verifyAccount();
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState({ isLoading: true });
  }

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;

    if (isLoading === true) {
      return (
        <div className={classes.loading}>
          <CircularProgress className={classes.loadingLogo} />
        </div>
      );
    }

    return <div className={classes.paperContainer}></div>;
  }
}

export default withStyles(ConfirmStyles)(Confirm);
