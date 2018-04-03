import React from "react";
import ReactModal from 'react-modal';
import { NavLink, withRouter } from "react-router-dom";
import logo from "../../assets/icon/logo.png";
import outSide from "../../assets/icon/outside-icon.png";

const logoImg = {
  alt: "Logo project",
  src: logo
};

export const outsideIcon = {
  alt: "outside-icon",
  src: outSide
};

const DropdownReceiptsAndExpense = () => {
  return (
    <div className="navbar-dropdown is-boxed">
      <NavLink className="navbar-item" to="/receipts-and-expense-per-month">
        Per Month
      </NavLink>
      <NavLink className="navbar-item" to="/receipts-and-expense-per-year">
        Per Year
      </NavLink>
    </div>
  );
};

class Navbar extends React.Component {
  state = {
    confirmModal: {
      isOpen: false,
      title: '',
      onOK: () => {},
      onCancel: () => {}
    },
  };

  render() {
    const isLogin = !!localStorage.getItem("user");
    const users = isLogin ? JSON.parse(localStorage.getItem("user")) : "";
    const { history } = this.props;
    const { confirmModal } = this.state;

    return (
      <nav
        style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
        className="navbar is-fixed-top is-dark"
      >
        <div className="navbar-brand">
          <NavLink className="navbar-item" to="">
            <img
              style={{ maxHeight: "4.2rem" }}
              src={logoImg.src}
              alt={logoImg.alt}
            />
          </NavLink>
          <div
            className="navbar-burger burger"
            data-target="navbarExampleTransparentExample"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div id="navbarExampleTransparentExample" className="navbar-menu">
          <div className="navbar-end">
            {isLogin && (
              <NavLink className="navbar-item" to="/projects">
                Project
              </NavLink>
            )}
            {/* <NavLink className="navbar-item" to="">
            Contract
          </NavLink> */}
            {isLogin && (
              <div className="navbar-item has-dropdown is-hoverable">
                <div className="navbar-link" to="">
                  Receipts & Expense
                </div>
                <DropdownReceiptsAndExpense />
              </div>
            )}
            {isLogin &&
              users.roleID === 1 && (
                <NavLink className="navbar-item" to="/manage-users">
                  Manage User
                </NavLink>
              )}
            {/* <NavLink className="navbar-item" to="">
            Setting
          </NavLink> */}
            {isLogin ? (
              <a
                className="navbar-item"
                onClick={() => {
                  this.setState({
                    confirmModal: {
                      ...this.state.confirmModal,
                      isOpen: true,
                      title: 'ยืนยันการออกจากระบบ',
                      onOK: () => {
                        localStorage.setItem("user", "");
                        history.replace("/login");
                      },
                    }
                  })
                }}
              >
                <img src={outsideIcon.src} alt={outsideIcon.alt} />
              </a>
            ) : (
              <NavLink className="navbar-item" to="/login">
                Login
              </NavLink>
            )}
          </div>
        </div>
        <ReactModal
          isOpen={confirmModal.isOpen}
          aria={{
            labelledby: "project from",
            describedby: "project from"
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(7, 7, 7, 0.6)",
              zIndex: 1000
            },
            content: {
              height: "200px",
              margin: "auto 300px"
            }
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ alignSelf: "center" }}>{confirmModal.title}</h1>
            <div className="block-btn-form-user">
              <a
                className="button is-medium is-link"
                onClick={() => {
                  confirmModal.onOK();
                  this.setState({
                    confirmModal: {
                      ...this.state.confirmModal,
                      isOpen: false
                    }
                  });
                }}
              >
                &nbsp; ตกลง &nbsp;
              </a>
              <a
                className="button is-medium is-danger"
                onClick={() => {
                  confirmModal.onCancel();
                  this.setState({
                    confirmModal: {
                      ...this.state.confirmModal,
                      isOpen: false
                    }
                  });
                }}
              >
                ยกเลิก
              </a>
            </div>
          </div>
        </ReactModal>
      </nav>
    );
  }
}

export default withRouter(Navbar);
