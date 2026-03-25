// import React from "react";
// import styles from "./Login.module.scss";
// import { Button, Checkbox, Form, Input, message } from "antd";
// import { useLoginQuery } from "../../api/userService";
// import { Navigate } from "react-router";

// type loginprops = {
//   state: any;
// };

// const Login = ({ state }: loginprops) => {
//   const loginUser = useLoginQuery();

//   const token = localStorage.getItem("LicenseKey");

//   if (token !== null) {
//     return <Navigate to="/search" />;
//   }

//   const onFinish = (values: any) => {
//     loginUser.mutateAsync(
//       {
//         ...values,
//       },
//       {
//         onSuccess(res) {
//           message.success("Sucessfully Logged in");
//         },
//         onError(res) {
//           console.log(res);

//           message.error("Use Valid Credentials");
//         },
//       }
//     );
//   };

//   const onFinishFailed = (errorInfo: any) => {
//     console.log("Failed:", errorInfo);
//   };

//   return (
//     <div className={styles.parentContainer}>
//       <h1>Welcome to <span>Adjournment.ai</span></h1>
//       <h3>Login into your account by entering your credentials</h3>

//       <div className={styles.loginForm}>
//         <Form
//           name="basic"
//           labelCol={{ span: 5 }}
//           wrapperCol={{ span: 16 }}
//           style={{
//             width: "500px",
//             marginLeft: "0",
//             justifyContent: "flex-start",
//           }}
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//           onFinishFailed={onFinishFailed}
//           autoComplete="off"
//         >
//           <Form.Item
//             label="Contact No"
//             name="mobile"
//             labelAlign="left"
//             rules={[{ required: true, message: "Please Enter your Email" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             name="password"
//             labelAlign="left"
//             rules={[{ required: true, message: "Please input your password!" }]}
//           >
//             <Input.Password />
//           </Form.Item>

//           <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//       <p>
//         don't have an account?{" "}
//         <span
//           onClick={() => {
//             state("Register");
//           }}
//           style={{ color: "rgb(125, 189, 246)" }}
//         >
//           Register Here
//         </span>
//       </p>
//     </div>
//   );
// };

// export default Login;

import React from "react";
import { Button, Form, Input, message } from "antd";
import { useLoginQuery } from "../../api/userService";
import { Navigate } from "react-router";

type loginprops = {
  state: any;
};

const Login = ({ state }: loginprops) => {
  const loginUser = useLoginQuery();

  const token = localStorage.getItem("LicenseKey");

  if (token !== null) {
    return <Navigate to="/search" />;
  }

  const onFinish = (values: any) => {
    loginUser.mutateAsync(
      { ...values },
      {
        onSuccess() {
          message.success("Sucessfully Logged in");
        },
        onError(res) {
          console.log(res);
          message.error("Use Valid Credentials");
        },
      }
    );
  };

  return (
    <div className="flex flex-col justify-center items-start w-full h-screen mx-8">
      <h1 className="my-3 text-[2.5rem] font-bold">
        Welcome to{" "}
        <span className="font-['Tilt_Warp'] text-blue-500">
          Adjournment.ai
        </span>
      </h1>

      <h3 className="mt-3 mb-10 text-lg">
        Login into your account by entering your credentials
      </h3>

      <div className="ml-3">
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{
            width: "500px",
            marginLeft: "0",
            justifyContent: "flex-start",
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Contact No"
            name="mobile"
            labelAlign="left"
            rules={[{ required: true, message: "Please Enter your Email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            labelAlign="left"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      <p className="text-sm mt-2">
        don’t have an account?{" "}
        <span
          className="cursor-pointer text-blue-400"
          onClick={() => state("Register")}
        >
          Register Here
        </span>
      </p>
    </div>
  );
};

export default Login;