import React, { Component } from 'react';


class LoginSuccess extends Component {
  constructor(props) {
    super(props);

    console.log('this.props', this.props);
    if(this.props.user && this.props.user.famillyMemberType) {
      this.props.history.push("/list");
    } else {
      this.props.history.push("/profil");
    }
  }
  render() {
    return(<div></div>);
  }
}
export default LoginSuccess;
