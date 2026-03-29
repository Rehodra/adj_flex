import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUniversity,
  FaEnvelope,
  FaStar,
  FaLock,
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      return;
    }

    const user = {
      id: "",
      email: params.get("email") || "",
      name: params.get("name") || "",
      picture: params.get("picture") || "",
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/cases", { replace: true });
  }, [navigate]);

  const handleGoogleSignup = () => {
    const frontendRedirect = `${window.location.origin}/signup`;
    window.location.href = `http://localhost:8000/api/auth/google?frontend_redirect=${encodeURIComponent(frontendRedirect)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      navigate("/cases");
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
          <form className="form" onSubmit={handleSubmit}>
            <h2>Create Your Account</h2>

            <div className="flex-column">
              <label>Full Name</label>
            </div>
            <div className="inputForm">
              <FaUser className="icon" />
              <input className="input" placeholder="Enter your Full Name" required />
            </div>

            <div className="flex-column">
              <label>College / University</label>
            </div>
            <div className="inputForm">
              <FaUniversity className="icon" />
              <input className="input" placeholder="Enter your College / University" required />
            </div>

            <div className="flex-column">
              <label>Email</label>
            </div>
            <div className="inputForm">
              <FaEnvelope className="icon" />
              <input type="email" className="input" placeholder="Enter your Email" required />
            </div>

            <div className="flex-column">
              <label>Legal Specialisation</label>
            </div>
            <div className="inputForm">
              <FaStar className="icon" />
              <input className="input" placeholder="Enter your Legal Specialisation" required />
            </div>

            <div className="flex-column">
              <label>Password</label>
            </div>
            <div className="inputForm">
              <FaLock className="icon" />
              <input type="password" className="input" placeholder="Create Password" required />
            </div>

            <button type="submit" className="button-submit">Get Started</button>

            <p className="p">
              Already have an account?{" "}
              <span className="span" onClick={() => navigate("/authentication")}>Sign In</span>
            </p>

            <p className="p line">Or With</p>

            <div className="flex-row">
              <button type="button" className="btn google" onClick={handleGoogleSignup}>
                <svg version="1.1" width={20} id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                  <path style={{ fill: "#FBBB00" }} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z" />
                  <path style={{ fill: "#518EF8" }} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" />
                  <path style={{ fill: "#28B446" }} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
                  <path style={{ fill: "#F14336" }} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z" />
                </svg>
                Google
              </button>
            </div>

            <p className="p terms">
              By signing up, you agree to our{" "}
              <a href="#">Terms of Service</a>.
            </p>

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

export default Signup;


/* ================= STYLES ================= */

const Container = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
  }

  h2 {
    color: #0f172a;
    font-weight: 800;
    margin-bottom: 20px;
    text-align: center;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
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
    gap: 10px;
    transition: 0.2s ease-in-out;
  }

  .icon {
    color: #94a3b8;
    font-size: 14px;
    flex-shrink: 0;
  }

  .input {
    border: none;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #374151;
    background: transparent;
    font-family: inherit;
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

  .terms {
    margin-top: 12px;
    font-size: 12px;
    color: #94a3b8;

    a {
      color: #2d79f3;
      font-weight: 600;
      text-decoration: none;
    }
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