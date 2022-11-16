import md5 from "../core/utils/md5.js";

class User {
  // user id
  id;
  // user role
  role;
  // username
  username;
  // user password
  password;
  
  constructor() {
  
  }
  
  getId() {
    return this.id;
  }
  
  setId(id) {
    this.id = id;
  }
  
  getRole() {
    return this.role.split(",");
  };
  
  setRole(role) {
    this.role = role ? role.join() : "";
  };
  
  getUsername() {
    return this.username;
  };
  
  setUsername(username) {
    this.username = username;
  };
  
  getPassword() {
    return this.password;
  };
  
  setPassword(password) {
    this.password = md5(md5(password));
  };
}

export default User;
