import React from 'react';
import './Login.css';

const API_URL = 'http://localhost:5000/api/';

class LoginPage extends React.Component {
  username = ''
  password = ''

  login() {
    fetch(`${API_URL}login`, { 
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username.value,
        password: this.password.value,
      })
    }).then(res => res.json())
    .then((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      console.log(localStorage.getItem("user"));
      this.props.history.push('/');
    })
    .catch((err) => {
      alert('login fail');
    })
  }

  render() {
    return (
      <div>
        <form className="form-login-user">
          <div className="input-field">
            <div className="field">
              <div className="is-normal">
                <label className="label">ชื่อผู้ใช้งาน</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="text"
                      placeholder="กรุณากรอกชื่อผู้ใช้งาน"
                      ref={(input) => { this.username = input  }}
                      defaultValue=""
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="is-normal">
                <label className="label">รหัสผ่าน</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      type="password"
                      placeholder="กรุณากรอกรหัสผ่าน"
                      ref={(input) => { this.password = input  }}
                      defaultValue=""
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="controllerButton">
            <a 
              className="button is-medium is-link"
              onClick={() => this.login()}
            >
              ลงชื่อเข้าใช้
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginPage;
