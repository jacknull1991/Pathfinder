import React from 'react';
import axios from 'axios';
import './login.css';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            errorMsg: '',
            isLoginForm: true,
        };

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.showLoginForm = this.showLoginForm.bind(this);
        this.showRegistrationForm = this.showRegistrationForm.bind(this);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
        this.onSubmitRegister = this.onSubmitRegister.bind(this);
    }

    showLoginForm(e) {
        e.preventDefault();
        this.setState({isLoginForm: true, errorMsg: ''});
    }

    showRegistrationForm(e) {
        e.preventDefault();
        this.setState({isLoginForm: false, errorMsg: ''});
    }

    onChangeUsername(e) {
        this.setState({username: e.target.value, errorMsg: ''});
    }

    onChangeEmail(e) {
        this.setState({email: e.target.value, errorMsg: ''});
    }

    onChangePassword(e) {
        this.setState({password: e.target.value, errorMsg: ''});
    }

    onSubmitLogin(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password
        };

        axios.post('http://localhost:8000/api/user/login', user)
            .then(res => {
                window.location = '/pathfinder';
            })
            .catch(err => {
                if (err.response) { // handle with server response
                    this.setState({errorMsg: err.response.data});
                }
            });
        
    }

    onSubmitRegister(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div className="login-container">
                <div className="panel-login">
                    <div className="panel-header">
                        <a href="#" className={`${this.state.isLoginForm ? "active" : ""}`} onClick={this.showLoginForm}>Login</a>
                        <a href="#" className={`${this.state.isLoginForm ? "" : "active"}`} onClick={this.showRegistrationForm}>Register</a>
                        <hr/>
                    </div>
                    <div className="panel-body">
                        <p className="panel-message">{this.state.errorMsg}</p>
                        {this.state.isLoginForm && 

                        <form onSubmit={this.onSubmitLogin}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Email" required
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}/>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="Password" required
                                    value={this.state.password}
                                    onChange={this.onChangePassword}/>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Login" className="btn btn-primary btn-block"/>
                            </div>
                        </form>
                            
                        }
                        {!this.state.isLoginForm && 
                            
                        <form onSubmit={this.onSubmitRegister}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Username" required
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}/>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Email" required
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}/>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="Password" required
                                    value={this.state.password}
                                    onChange={this.onChangePassword}/>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Register" className="btn btn-success btn-block"/>
                            </div>
                        </form>
                            
                        }
                    </div>
                </div>
            </div>
        )
    }
}