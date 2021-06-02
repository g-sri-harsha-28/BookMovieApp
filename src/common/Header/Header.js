import React, { useState} from "react";
import './Header.css';
import Button from '@material-ui/core/Button';
import logo from '../../assets/logo.svg';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const Header = ( props ) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [usernameRequired, setUserNameRequired] = useState("displayNone");
    const [username, setUserName] = useState("");
    const [loginPasswordRequired, setLoginPasswordRequired] = useState("displayNone");
    const [loginPassword, setLoginPassword] = useState("");
    const [firstnameRequired, setFirstNameRequired ] =useState("displayNone");
    const [firstname, setFirstName] = useState("");
    const [lastnameRequired, setLastNameRequired] = useState("displayNone");
    const [lastname, setLastName] = useState("");
    const [emailRequired, setEmailRequired] = useState("displayNone");
    const [email, setEmail] = useState("");
    const [registerPasswordRequired, setRegisterPasswordRequired] = useState("displayNone");
    const [registerPassword, setRegisterPassword] = useState("");
    const [contactRequired, setContactRequired] = useState("displayNone");
    const [contact, setContact] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("access-token")== null ? false : true);
    const [loginApiError, setLoginApiError] = useState("");

    const openModalHandler = () => {
        setModalIsOpen(true);
        setValue(0);
        setUserNameRequired("displayNone");
        setUserName("");
        setLoginPasswordRequired("displayNone");
        setLoginPassword("");
        setFirstNameRequired("displayNone");
        setFirstName("");
        setLastNameRequired("displayNone");
        setLastName("");
        setEmailRequired("displayNone");
        setEmail("");
        setRegisterPasswordRequired("displayNone");
        setRegisterPassword("");
        setContactRequired("displayNone");
        setContact("");
    }

   const closeModalHandler = () => {
        setModalIsOpen(false);
    }
  
    const tabChangeHandler = (event, value) => {
        setValue(value);      
    }

    const  loginClickHandler = () => {
        username === "" ? setUserNameRequired("displayBlock") : setUserNameRequired("displayNone" );
        loginPassword === "" ? setLoginPasswordRequired("displayBlock") :setLoginPasswordRequired("displayNone");
        setLoginApiError("");
        if(username === "" || loginPassword === "") return;     
        let loginData = null;
        fetch(props.baseUrl + "auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Basic " + window.btoa(username + ":" + loginPassword)

            },
            body: loginData,
        })
        .then(async(response) => {
            if(response.ok){
                sessionStorage.setItem("access-token",response.headers.get("access-token"));
                 return response.json();
        } else{
            let error = await response.json();
            setLoginApiError(error.message);
            throw new Error("Something Went Wrong");
        }
        })
        .then((data) => {
            sessionStorage.setItem("uuid", data.id);
            setLoggedIn(true);
            closeModalHandler();

        }).catch((error) => {});
    };
    const inputUsernameChangeHandler = (e) => {
        setUserName( e.target.value);
    }
    const inputLoginPasswordChangeHandler = (e) => {
        setLoginPassword(e.target.value);
    }
    const registerClickHandler = () => {
        setFirstName === "" ? setFirstNameRequired("displayBlock" ) : setFirstNameRequired("displayNone");
        setLastName === "" ? setLastNameRequired("displayBlock") : setLastNameRequired("displayNone");
        setEmail === "" ? setEmailRequired("displayBlock") : setEmailRequired("displayNone");
        setRegisterPassword === "" ? setRegisterPasswordRequired("displayBlock") : setRegisterPasswordRequired("displayNone");
        setContact === "" ? setContactRequired("displayBlock") : setContactRequired("displayNone");
        let dataSignup = JSON.stringify({
            email_address: email,
            first_name: firstname,
            last_name: lastname,
            mobile_number:contact,
            password: registerPassword
        });
        fetch(props.baseUrl + "signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Basic" + window.btoa(username + ":" + loginPassword)

            },
            body: dataSignup,
        }).then((data) => {setRegistrationSuccess(true)});
    }

    const inputFirstNameChangeHandler = (e) => {
        setFirstName(e.target.value);
    }

    const inputLastNameChangeHandler = (e) => {
        setLastName( e.target.value);
    }

    const inputEmailChangeHandler = (e) => {
        setEmail(e.target.value);
    }

    const inputRegisterPasswordChangeHandler = (e) => {
        setRegisterPassword(e.target.value);
    }

    const inputContactChangeHandler = (e) => {
        setContact(e.target.value);
    }

    const logOutHandler = (e) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");
        console.log(' reached here');
        setLoggedIn(false);
    }

    return (
        <div>
            <header className="header">
                <img src={logo} className="header-logo" alt="Movies App Logo" />
                {!loggedIn ?
                    <div className="btn-login">
                        <Button variant="contained" color="default" onClick={openModalHandler}>
                            Login
                        </Button>
                    </div>
                    :
                    <div className="btn-login">
                        <Button variant="contained" color="default" onClick={logOutHandler}>
                            Logout
                        </Button>
                    </div>
                }
                {props.showBookShowButton === "true" && !loggedIn
                    ? <div className="btn-bookShow">
                        <Button variant="contained" color="primary" onClick={openModalHandler}>
                            Book Show
                        </Button>
                    </div>
                    : ""
                }

                {props.showBookShowButton === "true" && loggedIn
                    ? <div className="btn-bookShow">
                        <Link to={"/bookshow/" + props.id}>
                            <Button variant="contained" color="primary">
                                Book Show
                            </Button>
                        </Link>
                    </div>
                    : ""
                }
            </header>
            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                contentLabel="Login"
                onRequestClose={closeModalHandler}
                style={customStyles}
            >
                <Tabs className="tabs" value={value} onChange={tabChangeHandler}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {value === 0 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" username={username} onChange={inputUsernameChangeHandler} />
                            <FormHelperText className={usernameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="loginPassword">Password</InputLabel>
                            <Input id="loginPassword" type="password" loginpassword={loginPassword} onChange={inputLoginPasswordChangeHandler} />
                            <FormHelperText className={loginPasswordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {loggedIn === true &&
                            <FormControl>
                                <span className="successText">
                                    Login Successful!
                                </span>
                            </FormControl>
                        }
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
                    </TabContainer>
                }

                {value === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" type="text" firstname={firstname} onChange={inputFirstNameChangeHandler} />
                            <FormHelperText className={firstnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" type="text" lastname={lastname} onChange={inputLastNameChangeHandler} />
                            <FormHelperText className={lastnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="text" email={email} onChange={inputEmailChangeHandler} />
                            <FormHelperText className={emailRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="registerPassword">Password</InputLabel>
                            <Input id="registerPassword" type="password" registerpassword={registerPassword} onChange={inputRegisterPasswordChangeHandler} />
                            <FormHelperText className={registerPasswordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input id="contact" type="text" contact={contact} onChange={inputContactChangeHandler} />
                            <FormHelperText className={contactRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {registrationSuccess === true &&
                            <FormControl>
                                <span className="successText">
                                    Registration Successful. Please Login!
                                  </span>
                            </FormControl>
                        }
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={registerClickHandler}>REGISTER</Button>
                    </TabContainer>
                }
            </Modal>
        </div>
    )
}
export default Header;