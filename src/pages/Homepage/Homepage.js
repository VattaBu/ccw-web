import React from 'react';
import './Homepage.css';

class Homepage extends React.Component {
  user = {
    // username: null,
  };
  componentWillMount() {
    if (!localStorage.getItem('user')) {
      this.props.history.replace('/login');
    }
    // else {
    //   this.user = JSON.parse(localStorage.getItem('user'))
    // }
  }

  render() {

    return (
      <div className="root-home-page">
        {/* <h1>
          ยินดีต้อนรับ คุณ { this.user.username }
        </h1> */}
      </div>
    );
  }
}

export default Homepage;
