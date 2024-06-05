import React, { createContext, useContext,useState } from 'react';
import axios from 'axios';
import './login.css';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../../context/authContext.jsx';


function Login() {
    const { isLoggedIn, login, logout } = useAuth();
    const [hasAccountState, setHasAccountState] = useState(true);

    const toggleForm = () => {
        setHasAccountState(!hasAccountState);
    };

    const [formDataUnion, setFormDataUnion] = useState({
        email: '',
        password: '',
        login: ''
    });

    const formChangeHandler = (e) => {
        setFormDataUnion({...formDataUnion, [e.target.name]: e.target.value});
    }

    const navigate = useNavigate();



    const logInUser = async (event) => {
        event.preventDefault();
        const form = event.target.closest('form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let responseData
        await fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user : {
                    email: formDataUnion.email,
                    login: formDataUnion.login,
                    password: formDataUnion.password
                }
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            responseData = data;
            console.log(data);
        }).catch(err => {
            console.log("Something went wrong with server... Is it running???" , err);
        })

        if (responseData.success) {
            login(responseData.token);
            navigate("/");
        }
        else {
            alert("Invalid credentials" + responseData.message);
        }
    }

    const registerUser = async (event) => {
        event.preventDefault();
        const form = event.target.closest('form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let responseData
        await fetch('http://localhost:4000/users/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user : {
                    email: formDataUnion.email,
                    login: formDataUnion.login,
                    password: formDataUnion.password
                }
            })

        }).then(response => {
            return response.json();
        }).then(data => {
            responseData = data;
            console.log(data);
        }).catch(err => {
            console.log("Something went wrong with server... Is it running???" , err);
        })

        if (responseData.success) {
            login(responseData.token);
            // alert("User registered successfully");
            navigate("/");
        }
        else {
            alert("Invalid credentials" + responseData.message);
        }
    };


    return (
        <div className="login-container">
            {hasAccountState ? (
                <form className="login-form">
                    <h2>Zaloguj się</h2>
                    <input
                        name={"email"}
                        value={formDataUnion.email}
                        type="email"
                        onChange={formChangeHandler}
                        placeholder="Email"
                        required
                    />
                    <input
                        name={"password"}
                        value={formDataUnion.password}
                        type="password"
                        onChange={formChangeHandler}
                        placeholder="Password"
                        required
                    />
                    <button
                        type={"submit"}
                        onClick={(event)=> logInUser(event)}
                    >Zaloguj się
                    </button>
                    <p>
                        Nie masz konta? <span className="change" onClick={toggleForm}>Zarejestruj się</span>
                    </p>
                </form>
            ) : (
                <form className="registration-form">
                    <h2>Zarejestruj się</h2>
                    <input
                        name={"login"}
                        value={formDataUnion.login}
                        type="text"
                        onChange={formChangeHandler}
                        placeholder="Username TODO"
                        required
                    />
                    <input
                        name={"email"}
                        value={formDataUnion.email}
                        type="email"
                        onChange={formChangeHandler}
                        placeholder="Email"
                        required
                    />
                    <input
                        name={"password"}
                        value={formDataUnion.password}
                        type="password"
                        onChange={formChangeHandler}
                        placeholder="Password"
                        required
                    />
                    <button
                        type={"submit"}
                        onClick={(event)=> registerUser(event)}
                    >Zarejestruj się
                    </button>
                    <p>
                        Masz już konto? <span className="change" onClick={toggleForm}>Zaloguj się</span>
                    </p>
                </form>
            )}
        </div>
    );
}

export default Login;