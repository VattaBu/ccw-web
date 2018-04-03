import React from 'react';
import ReactModal from 'react-modal';
import './ManageUser.css';
import plusIconImage from '../../assets/icon/plus-icon.png';
import deleteIconImage from '../../assets/icon/empty-icon.png';
import editIconImage from '../../assets/icon/edit-icon.png';
// config modal to html
ReactModal.setAppElement('#root');

const API_URL = 'http://localhost:5000/api/';
const plusIcon = { src: plusIconImage, alt: 'plus-icon' };
const editIcon = { src: editIconImage, alt: 'edit-icon' };
const deleteIcon = { src: deleteIconImage, alt: 'delete-icon' };
const form = {
  username: '',
  role_id: -1,
  name: '',
  lastname: '',
  tel: '',
  email: '',
  address: ''
};

class ManageUser extends React.Component {
  state = {
    roles: [],
    projectTypes: [],
    users: [],
    openModalUser: false,
    modeModalUser: 'add',
    userInSelect: {
      address: '',
      email: '',
      lastname: '',
      name: '',
      user_det_id: '',
      role_id: 3,
      tel: '',
      username: '' 
    },
    confirmModal: {
      isOpen: false,
      title: '',
      onOK: () => {},
      onCancel: () => {}
    },
  };

  componentWillMount() {
    // validate is login
    if (!localStorage.getItem("user")) {
      this.props.history.replace('/login');
      return;
    }
    // validate role id
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user.roleID || user.roleID !== 1) {
      this.props.history.replace('/');
      return;
    }
  }

  componentDidMount() {
    this.getRoles(); 
    this.getUsers();
  }

  getRoles() {
    fetch(`${API_URL}roles`)
    .then(response => response.json())
    .then((roles) => {
      this.setState({
        roles
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  setQueryAndSearch(form) {
    let query = [];
    if (form.username) query.push(`username=${form.username}`);
    if (form['role_id'] !== -1) query.push(`role_id=${form['role_id']}`);
    if (form.name) query.push(`name=${form.name}`);
    if (form.lastname) query.push(`lastname=${form.lastname}`);
    if (form.tel) query.push(`tel=${form.tel}`);
    if (form.email) query.push(`email=${form.email}`);
    if (form.address) query.push(`address=${form.address}`);
    
    const queryString = query.join('&').trim();
    this.getUsers(queryString);
  }

  closeModal() {
    this.setState({
      openModalUser: false,
      userInSelect: {
        address: '',
        email: '',
        lastname: '',
        name: '',
        user_det_id: '',
        role_id: 3,
        tel: '',
        username: '' 
      },
    })
  }

  getUsers(queryString = '') {
    fetch(`${API_URL}users?${queryString}`)
    .then(response => response.json())
    .then((users) => {
      this.setState({
        users,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  deleteUser(user) {
    fetch(
      `${API_URL}user/${user.username}/${user['user_det_id']}`, 
      { method: 'delete' }
    )
    .then(() => { this.getUsers() })
    .catch((err) => {
      console.log(err);
    });
  }

  insertUser(user) {
    fetch(
      `${API_URL}user`, 
      { 
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          name: user.name,
          lastname: user.lastname,
          tel: user.tel,
          email: user.email,
          address: user.address,
          password: user.password,
          role_id: user['role_id'],
        })
      }
    )
    .then(() => {
      this.getUsers();
      this.closeModal();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  editUser(user) {
    fetch(
      `${API_URL}user/${user.username}/${user['user_det_id']}`, 
      { 
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user.name,
          lastname: user.lastname,
          tel: user.tel,
          email: user.email,
          address: user.address,
          password: user.password,
          role_id: user['role_id'],
        })
      }
    )
    .then(() => {
      this.getUsers();
      this.closeModal();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    const userModal = (this.state.openModalUser !== 'add')
      ? this.state.userInSelect
      : {
          address: '',
          email: '',
          lastname: '',
          name: '',
          user_det_id: '',
          role_id: 3,
          tel: '',
          username: '' 
        };
    const rolesAsDefualt = [{
      id: -1,
      value: '--- ระบุระดับ ---',
    }, ...this.state.roles];
    const { confirmModal } = this.state;

    return (
      <div>
        <div className="controllerButtons">
          <a className="button icon add-user" >
            <img
              src={plusIcon.src}
              alt={plusIcon.alt}
              onClick={() => {
                this.setState({
                  openModalUser: true,
                  modeModalUser: 'add'
                });
              }}
            />
          </a>
        </div>
        {/* Form */}
        <form>
          <fieldset className="inpurField">
            <legend>Billing Address</legend>
            <div className="inputField" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="csFeild">
                {/* username */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">ชื่อผู้ใช้งาน</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={(e) => {
                            form.username = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">ระดับ</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <select
                          defaultValue={-1}
                          className="select select-app"
                          onChange={(e) => {
                            form['role_id'] = e.target.value;
                          }}
                        >
                          {rolesAsDefualt.map((data) => (
                            <option key={data.id} value={data.id}>
                              {data.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="csFeild">
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">ชื่อ</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={(e) => {
                            form.name = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">สกุล</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={(e) => {
                            form.lastname = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="csFeild">
                {/* tel */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">เบอร์โทร</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={(e) => {
                            form.tel = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </p>
                    </div>
                  </div>
                </div>
                {/* email */}
                <div className="field field-normal">
                  <div className="is-normal">
                    <label className="label">อีเมลล์</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <p className="control">
                        <input
                          className="input input-app"
                          type="text"
                          onChange={(e) => {
                            form.email = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="csFeild">
                {/* address */}
                <div className="field field-textArea">
                  <div className="is-normal">
                    <label className="label">ที่อยู่</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <textarea
                          className="textarea textarea-app"
                          type="text"
                          onChange={(e) => {
                            form.address = e.target.value;
                          }}
                          defaultValue=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
              <a
                className="button is-medium is-link"
                onClick={() => {
                  console.log(555555555555)
                  console.log(form)
                  this.setQueryAndSearch(form);
                }}
              >
                ค้นหา
              </a>
            </div>
          </fieldset>
        </form>
        {/* Form */}
        <div>
          <table className="table is-bordered">
            <thead>
              <tr>
                <th className="index" rowSpan="2">ลำดับ</th>
                <th className="userName" rowSpan="2">ชื่อผู้ใช้งาน</th>
                <th className="rank" rowSpan="2">ระดับ</th>
                <th className="name" rowSpan="2">ชื่อ</th>
                <th className="surname" rowSpan="2">สกุล</th>
                <th className="phoneNumber" rowSpan="2">เบอร์โทร</th>
                <th className="email" rowSpan="2">อีเมลล์</th>
                <th className="address" rowSpan="2">ที่อยู่</th>
                <th className="menu" colSpan="2">เมนู</th>
              </tr>
              <tr>
                <th>แก้ไข</th>
                <th>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {/* use map function for render by loop users */}
              {this.state.users.map((user, index) => (
                <tr key={user.username}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user['role_name']}</td>
                  <td>{user.name}</td>
                  <td>{user.lastname}</td>
                  <td>{user.tel}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td className="edit">
                    <a
                      className="button table edit"
                      onClick={() => {
                        this.setState({
                          userInSelect: user,
                          openModalUser: true,
                          modeModalUser: 'edit',
                        })
                      }}
                    >
                      <img src={editIcon.src} alt={editIcon.alt} />
                    </a>
                  </td>
                  <td className="del">
                    <a
                      className="button table del"
                      onClick={() => {
                        this.setState({
                          confirmModal: {
                            ...this.state.confirmModal,
                            isOpen: true,
                            title: 'ยืนยันการลบข้อมูลผู้ใช้งาน',
                            onOK: () => this.deleteUser(user),
                          }
                        })
                      }}
                    >
                      <img src={deleteIcon.src} alt={deleteIcon.alt} />
                    </a>
                  </td>
                </tr>
              ))}
              {this.state.users.length === 0 && <h1>ไม่พบข้อมูล</h1>}
            </tbody>
          </table>
        </div>
        {/* ModalUser */}
        <ReactModal
          isOpen={this.state.openModalUser}
          aria={{
            labelledby: "user from",
            describedby: "user from"
          }}
          style={{
            overlay: {
              backgroundColor: 'rgba(7, 7, 7, 0.6)',
              zIndex: 1000
            }
          }}
        >
          <div className="root-form-user">
            <h1>{ `${this.state.modeModalUser === 'add' ? 'เพิ่ม' : 'แก้ไข' } ผู้ใช้` }</h1>
            {/* username */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ชื่อผู้ใช้งาน:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      placeholde="กรุณากรอกชื่อผู้ใช้งาน"
                      type="text"
                      onChange={(e) => {
                        userModal.username =  e.target.value;
                      }}
                      disabled={this.state.modeModalUser === 'edit'}
                      defaultValue={userModal.username}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* password */}
            <div className="field">
              <div className="is-normal">
                <label className="label">รหัสผ่าน:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      placeholde="กรุณากรอกรหัสผ่าน"
                      type="text"
                      onChange={(e) => {
                        userModal.password =  e.target.value;
                      }}
                      defaultValue={userModal.password}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* roles */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ระดับ:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <select
                      defaultValue={userModal['role_id']}
                      className="select select-app"
                      onChange={(e) => {
                        userModal['role_id'] =  e.target.value;
                      }}
                    >
                      {this.state.roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* firstname */}
            <div className="field">
              <div className="is-normal">
                <label className="label">ชื่อ:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      placeholde="กรุณากรอกชื่อ"
                      type="text"
                      onChange={(e) => {
                        userModal.name =  e.target.value;
                      }}
                      defaultValue={userModal.name}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* lastname */}
            <div className="field">
              <div className="is-normal">
                <label className="label">สกุล:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      placeholde="กรุณากรอกสกุล"
                      type="text"
                      onChange={(e) => {
                        userModal.lastname =  e.target.value;
                      }}
                      defaultValue={userModal.lastname}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* tel */}
            <div className="field">
              <div className="is-normal">
                <label className="label">เบอร์โทร:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      placeholde="กรุณากรอกเบอร์โทร"
                      type="text"
                      onChange={(e) => {
                        userModal.tel =  e.target.value;
                      }}
                      defaultValue={userModal.tel}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* email */}
            <div className="field">
              <div className="is-normal">
                <label className="label">อีเมลล์:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input input-app"
                      placeholde="กรุณากรอกอีเมลล์"
                      type="text"
                      onChange={(e) => {
                        userModal.email =  e.target.value;
                      }}
                      defaultValue={userModal.email}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="is-normal">
                <label className="label">ที่อยู่:</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <textarea
                      className="textarea textarea-app"
                      placeholder="กรุณากรอกที่อยู่"
                      type="text"
                      onChange={(e) => {
                        userModal.address =  e.target.value;
                      }}
                      defaultValue={userModal.address}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="block-btn-form-user">
              {
                  (this.state.openModalUser) === 'add'
                  ? (
                    <a className="button is-medium is-link" onClick={() => { this.insertUser(userModal); }}>
                      &nbsp; เพิ่ม &nbsp;
                    </a>
                  )
                  : (
                    <a className="button is-medium is-warning" onClick={() => { this.editUser(userModal); }}>
                      &nbsp; แก้ไข &nbsp;
                    </a>
                  )
              }
              <a
                className="button is-medium is-danger"
                onClick={() => { this.closeModal() }}
              >
                ยกเลิก
              </a>
            </div>
          </div>
        </ReactModal>
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
      </div>
    );
  }
}

export default ManageUser;
