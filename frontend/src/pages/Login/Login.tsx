import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Basic mock function to hook into a backend OAuth flow later
  const handleGoogleLogin = () => {
    // We will redirect to backend OAuth endpoint
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  const handleBypass = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary bypass for testing Dashboard without backend auth
    setTimeout(() => {
        navigate('/cases');
    }, 500);
  };

  return (
    <Container>

      {/* NAVBAR */}
      <Navbar>
        <Logo>
          <LogoIcon>⚖️</LogoIcon>
          adjournment <LogoSpan>AI</LogoSpan>
        </Logo>
        <BackButton onClick={() => navigate("/")}>
          Back to Home
        </BackButton>
      </Navbar>

      {/* FORM CENTERED */}
      <FormWrapper>
        <StyledWrapper>
          <form className="form" onSubmit={handleBypass}>
            <h2>Sign In to Courtroom</h2>
            <div className="flex-column">
              <label>Email </label>
            </div>
            <div className="inputForm">
              <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
              <input type="email" className="input" placeholder="Enter your Email" required />
            </div>
            <div className="flex-column">
              <label>Password </label>
            </div>
            <div className="inputForm">
              <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>        
              <input type="password" className="input" placeholder="Enter your Password" required />
              <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
            </div>
            <div className="flex-row">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Remember me </label>
              </div>
              <span className="span">Forgot password?</span>
            </div>
            <button type="submit" className="button-submit">Sign In</button>
            
            <p className="p">Don't have an account? <span className="span" onClick={() => navigate('/signup')}>Sign Up</span></p>
            <p className="p line">Or With</p>
            
            <div className="flex-row">
              <button type="button" className="btn google" onClick={handleGoogleLogin}>
                <svg version="1.1" width={20} id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                  <path style={{fill: '#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      	C103.821,274.792,107.225,292.797,113.47,309.408z" />
                  <path style={{fill: '#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" />
                  <path style={{fill: '#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
                  <path style={{fill: '#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      	C318.115,0,375.068,22.126,419.404,58.936z" />
                </svg>
                Google 
              </button>
            </div>
          </form>
        </StyledWrapper>
      </FormWrapper>

      {/* FOOTER */}
      <Footer>
        <LeftFooter>© 2026 Adjournment AI. All rights reserved.</LeftFooter>
        <RightFooter>
          Terms of Service | Privacy Policy | Help Center | Contact Us
        </RightFooter>
      </Footer>

    </Container>
  );
};

export default Login;


/* ================= STYLES ================= */

const Container = styled.div`
  min-height: 100vh;
  background-color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  height: 56px;
  background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  flex-shrink: 0;
`;

const LogoIcon = styled.span`
  margin-right: 6px;
`;

const Logo = styled.div`
  font-size: 17px;
  font-weight: 700;
  display: flex;
  align-items: center;
  letter-spacing: -0.2px;
`;

const LogoSpan = styled.span`
  color: #60a5fa;
  margin-left: 4px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 0;

  &:hover {
    color: white;
  }
`;

const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
`;

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  h2 {
    color: #0f172a;
    font-weight: 800;
    margin-bottom: 20px;
    text-align: center;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
    margin-left: 5px;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-top: 5px;
  }

  .flex-row > div {
    display: flex;
    align-items: center;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 500;
    margin-left: 5px;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 600;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #0f172a;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
    transition: 0.2s;
  }

  .button-submit:hover {
    background-color: #1e293b;
  }

  .p {
    text-align: center;
    color: #475569;
    font-size: 14px;
    margin: 5px 0;
    font-weight: 500;
  }

  .line {
    margin: 15px 0;
    position: relative;
    z-index: 1;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    gap: 10px;
    border: 1px solid #e2e8f0;
    background-color: white;
    color: #334155;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
    background-color: #f8fafc;
  }
`;

const Footer = styled.footer`
  padding: 14px 24px;
  background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #e2e8f0;
  flex-shrink: 0;
`;

const LeftFooter = styled.div``;

const RightFooter = styled.div``;