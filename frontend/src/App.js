import React, { useState , useEffect } from 'react';
import './App.css';
import logo from './user.gif';
import man from './images/man.png';
import man1 from './images/man1.png';
import man2 from './images/man2.png';
import women from './images/woman.png';
import women1 from './images/woman1.png';
import women2 from './images/woman2.png';
import Fun from './Dummy';

function App() {
  const [activeForm, setActiveForm] = useState(null); 
  const [slideIndex, setSlideIndex] = useState(0);
  const [showSigninForm, setShowSigninForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showCnfrmPass, setShowCnfrmPass] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSigninClick = () => {
    setActiveForm('signin');
    setShowSigninForm(true);
    setShowSignupForm(false);
    setShowEmail(false);
    setShowCnfrmPass(false);
  };

  const handleSignupClick = () => {
    setActiveForm('signup');
    setShowSigninForm(false);
    setShowSignupForm(true);
    setShowEmail(false);
    setShowCnfrmPass(false);
  };
  
  //login button
  const Login_click = async (event) => {
    event.preventDefault();
    var user = document.getElementById('userID').value;
    var pass = document.getElementById('passID').value;
    console.log(user + " " + pass);
    try{
      const response = await
      fetch('http://localhost:2222/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: user, 
          passWord: pass
        })
    });
    if (response.ok === true) {
      const data = await response.json();
      console.log(data);
      setUsername(user);
      // document.getElementById('userAvatar').innerText = user.charAt(0).toUpperCase();
      window.alert('successfully logged in');
    }else if (response.status === 996) { 
      const data = await response.json();
      console.log(data);
      window.alert('Wrong password! Please try again.');
    } else {
      const data = await response.json();
      console.log(data);
      console.error("Failed to authenticate");
      window.alert('failed to log in');
    }
  } catch(error) {
    console.error("Error:", error);
  }
    document.getElementById('userID').value = '';
    document.getElementById('passID').value = '';
  };

  //Register Button
  const Register_click = async (event) => {
    event.preventDefault();
    var newEMAIL = document.getElementById('N_email').value;
    var newUSER = document.getElementById('N_user').value;
    var newPASS = document.getElementById('N_pass').value;
    console.log({newEMAIL , newUSER , newPASS});
    if(!(newEMAIL.includes('@'))){
      window.alert('Enter a valid Email');
    }else{
      try{
        const response = await
        fetch('http://localhost:2222/register',{
          method:'POST' ,
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            email : newEMAIL , 
            username : newUSER , 
            password : newPASS
          })
        })
        .then((response) => response.text())
        .then((data) => { 
          window.alert("Account Created");
          setActiveForm('signin');
          setShowSigninForm(true);
          setShowSignupForm(false);
          setShowEmail(false);
          setShowCnfrmPass(false);
        });
      }
      catch(error){console.error("Error:",error);}
    }
    document.getElementById('N_email').value = '';
    document.getElementById('N_user').value = '';
    document.getElementById('N_pass').value = '';
  };

  const handleForgotPasswordClick = async (event) => {
    event.preventDefault();
    setShowSigninForm(false);
    setShowSignupForm(false);
    setShowEmail(true);
    setShowCnfrmPass(false);
  };
  const handleClose = async (event) => {
    event.preventDefault();
    setActiveForm('signin');
    setShowSigninForm(true);
    setShowSignupForm(false);
    setShowEmail(false);
    setShowCnfrmPass(false);
  };
  const handleEmailSubmit = async (event) => {
    event.preventDefault(); 
    const email = document.getElementById('send_email').value;
    document.getElementById('send_email').value="";
    if (!email || !email.includes('@')) {
      window.alert('Please enter a valid email address.');
    } else {
      const isEmailFound = await handleResetPassword(email);
      console.log(isEmailFound);
      if (isEmailFound) {
        setActiveForm('cnfrm');
        setShowSigninForm(false);
        setShowSignupForm(false);
        setShowEmail(false);
        setShowCnfrmPass(true);
      } else {
        window.alert('Email not found');
      }
    }
  };  
  
  const handleResetPassword = async (email) => {
    try {
      const response = await fetch('http://localhost:2222/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eemail: email }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return data;
      } else {
        console.log("Error:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };
  
  const confirmed_password = async(event)=>{
    event.preventDefault();
    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;
    document.getElementById('pass1').value="";
    document.getElementById('pass2').value="";
    console.log(pass1);
    if(pass1 === pass2){
      fetch('http://localhost:2222/passwordUpdation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pass_word:pass1 }),
      })
      .then((response) => response.text())
      .then((data) => { 
        window.alert(data);
        setActiveForm('signin');
        setShowSigninForm(true);
        setShowSignupForm(false);
        setShowEmail(false);
        setShowCnfrmPass(false);
      });
    }
  };

  //setting phofile
  const renderAvatarText = () => {
    if (username.length >= 2) {
      const firstChar = username.charAt(0);
      const lastChar = username.charAt(username.length - 1);
      return `${firstChar}${lastChar}`;
    } else if (username.length === 1) {
      return username;
    } else {
      return ""; // Return nothing if username is empty
  }};
  

  return (
    <div>
      <div id="userAvatar" className='avatar'>{renderAvatarText()}</div>
      <center>
          <p className="heading">Hello, User</p>
        <div className="main">
          <div className="btn">
            <button className={`btns ${activeForm === 'signin' ? 'active' : ''}`} onClick={handleSigninClick}>Sign in</button>
            <button className={`btns ${activeForm === 'signup' ? 'active' : ''}`} onClick={handleSignupClick}>Sign up</button>
          </div>
          <br/>
          <div className="loginform" id="form-container">
            {/* {activeForm === 'logo' && <img src={logo} alt="logo" className='main_photo'/>} */}
            <div className="main_class" style={{ display: activeForm ? 'none' : 'block' }}>
              {/* Slideshow */}
              {[man, women, man1, women1, man2 , women2].map((image, index) => (
                <img key={index} src={image} alt="slide" className="myslides" style={{ display: index === slideIndex ? 'block' : 'none' }} />
              ))}
            </div>
            {/* Signin form */}
            {showSigninForm && (
              <form id='loginForm' style={{ display: activeForm === 'signin' ? 'block' : 'none' }}>
                <input type='text' id='userID' placeholder='Username' className="username1" ></input>
                <input type='password' id='passID' placeholder='Password' className="password1"></input>
                  {/*forgot password */}
                <button className="forgot" onClick={handleForgotPasswordClick}>Forgot Password...?</button>
                <button className="loginbtn" onClick={(event) => Login_click(event)}><span>Login</span></button>
              </form>
            )}
            {/* Signup form */}
            {showSignupForm && (
              <form id='signupForm' style={{ display: activeForm === 'signup' ? 'block' : 'none' }}>
                <input type="email" id="N_email" placeholder='Email' className="email" required></input>
                <input type="text" id="N_user" placeholder='Username' className='username2' required></input>
                <input type='password' id="N_pass" placeholder='Password' className='password2' required></input>
                <button className="register" onClick={(event) => Register_click(event)}><span>Register</span></button>
              </form>
            )}
            {showEmail && (
              <form>
                <div className="popup" id='passfor'>
                  <div className="popup-inner">
                    <button className="close-btn" onClick={handleClose}>X</button>
                    <input type="email"  className='Eenter' placeholder="Enter your email" id='send_email'/>
                    <button className='loginbtn' onClick={handleEmailSubmit}>Submit</button>
                  </div>
                </div>
              </form>
            )}
            {showCnfrmPass && (
              <form id='cnfrm'> 
                {/* 'cnfrm' form */}
                <input type='password' className='password1' placeholder='new password' id='pass1'></input>
                <input type='password' className='password1' placeholder='confirm password' id='pass2'></input>
                <button className='loginbtn' onClick={confirmed_password}>Confirm</button>
              </form>
            )}
          </div>
        </div>
      </center>
    </div>
  );
}

export default App;
