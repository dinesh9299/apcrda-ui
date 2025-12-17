// import { useState } from 'react';
// import { Card, Input, Button, Typography, Spin, Alert } from 'antd';
// import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import back1 from '../../images/back-3.jpg';

// const { Title, Text } = Typography;

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const login = async () => {
//     if (!email || !password) {
//       setError('Please enter email and password');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 1️⃣ Login
//       const authRes = await axios.post('http://173.249.6.61:1337/api/auth/local', {
//         identifier: email,
//         password
//       });

//       const token = authRes.data.jwt;

//       // 2️⃣ Get full user with role
//       const meRes = await axios.get('http://173.249.6.61:1337/api/users/me?populate=role', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       // 3️⃣ Store session
//       sessionStorage.setItem('token', token);
//       sessionStorage.setItem('user', JSON.stringify(meRes.data));

//       navigate('/', { replace: true });
//     } catch (err) {
//       setError('Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         // background: 'linear-gradient(135deg, #6f7cf7 0%, #7a5bbf 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundImage: `url(${back1})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'cover',
//         padding: 16
//       }}
//     >
//       <div style={{ width: '100%', maxWidth: 420 }}>
//         {/* HEADER */}
//         <div style={{ textAlign: 'center', color: '#fff', marginBottom: 32 }}>
//           <Title level={2} style={{ color: '#fff', marginBottom: 8 }}>
//             APCRDA Portal
//           </Title>
//           <Text style={{ color: '#e0e7ff' }}>Project Management & Tracking System</Text>
//         </div>

//         {/* CARD */}
//         <Card
//           style={{
//             borderRadius: 16,
//             boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
//             border: 'none'
//           }}
//           bodyStyle={{ padding: 32 }}
//         >
//           <div style={{ textAlign: 'center', marginBottom: 24 }}>
//             <Title level={3} style={{ marginBottom: 4 }}>
//               Welcome Back
//             </Title>
//             <Text type="secondary">Sign in to your account to continue</Text>
//           </div>

//           {error && <Alert message={error} type="error" showIcon closable onClose={() => setError('')} style={{ marginBottom: 16 }} />}

//           <Spin spinning={loading}>
//             {/* EMAIL */}
//             <div style={{ marginBottom: 20 }}>
//               <Text strong>Email Address</Text>
//               <Input
//                 size="large"
//                 placeholder="you@example.com"
//                 prefix={<MailOutlined />}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={{ marginTop: 6 }}
//               />
//             </div>

//             {/* PASSWORD */}
//             <div style={{ marginBottom: 24 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Text strong>Password</Text>
//               </div>

//               <Input.Password
//                 size="large"
//                 placeholder="Enter your password"
//                 prefix={<LockOutlined />}
//                 iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={{ marginTop: 6 }}
//               />
//             </div>

//             {/* BUTTON */}
//             <Button
//               type="primary"
//               size="large"
//               block
//               loading={loading}
//               onClick={login}
//               style={{
//                 height: 44,
//                 borderRadius: 8,
//                 background: 'linear-gradient(135deg, #6f7cf7, #7a5bbf)',
//                 border: 'none',
//                 fontWeight: 600
//               }}
//             >
//               Sign In
//             </Button>
//           </Spin>
//         </Card>

//         {/* FOOTER */}
//         <div style={{ textAlign: 'center', marginTop: 32 }}>
//           <Text style={{ color: '#e0e7ff', fontSize: 13 }}>© 2024 APCRDA Project. All rights reserved.</Text>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import { useState } from 'react';
// import { Card, Input, Button, Typography, Spin, Alert } from 'antd';
// import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import back1 from '../../images/back-3.jpg';

// const { Title, Text } = Typography;

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const login = async () => {
//     if (!email || !password) {
//       setError('Please enter email and password');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const authRes = await axios.post('http://173.249.6.61:1337/api/auth/local', {
//         identifier: email,
//         password
//       });

//       const token = authRes.data.jwt;

//       const meRes = await axios.get('http://173.249.6.61:1337/api/users/me?populate=role', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       sessionStorage.setItem('token', token);
//       sessionStorage.setItem('user', JSON.stringify(meRes.data));

//       navigate('/', { replace: true });
//     } catch (err) {
//       setError('Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundImage: `url(${back1})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         padding: 16,
//         position: 'relative'
//       }}
//     >
//       {/* Optional dark overlay for better readability */}
//       <div
//         style={{
//           position: 'absolute',
//           inset: 0,
//           background: 'rgba(0, 0, 0, 0.3)'
//         }}
//       />

//       <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
//         {/* HEADER */}
//         <div style={{ textAlign: 'center', color: '#fff', marginBottom: 32 }}>
//           <Title level={2} style={{ color: '#fff', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
//             APCRDA Portal
//           </Title>
//           <Text style={{ color: '#e0e7ff', fontSize: 16, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
//             Project Management & Tracking System
//           </Text>
//         </div>

//         {/* GLASSMORPHISM CARD */}
//         <Card
//           style={{
//             borderRadius: 20,
//             // backdropFilter: 'blur(20px)',
//             background: 'rgba(165, 169, 171, 0.3)', // Deep teal glass
//             border: '1px solid rgba(100, 200, 255, 0.2)',
//             boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
//           }}
//           bodyStyle={{ padding: 32 }}
//         >
//           <div style={{ textAlign: 'center', marginBottom: 24 }}>
//             <Title level={3} style={{ marginBottom: 4, color: '#fff' }}>
//               Welcome Back
//             </Title>
//             <Text style={{ color: '#e0e7ff' }}>Sign in to your account to continue</Text>
//           </div>

//           {error && (
//             <Alert
//               message={error}
//               type="error"
//               showIcon
//               closable
//               onClose={() => setError('')}
//               style={{ marginBottom: 16, background: 'rgba(255,59,48,0.2)', border: 'none', color: '#fff' }}
//             />
//           )}

//           <Spin spinning={loading}>
//             {/* EMAIL */}
//             <div style={{ marginBottom: 20 }}>
//               <Text strong style={{ color: '#fff' }}>
//                 Email Address
//               </Text>
//               <Input
//                 size="large"
//                 placeholder="you@example.com"
//                 prefix={<MailOutlined style={{ color: '#fff' }} />}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={{
//                   marginTop: 6,
//                   background: 'rgba(255, 255, 255, 0.1)',
//                   border: '1px solid rgba(255, 255, 255, 0.3)',
//                   color: '#fff'
//                 }}
//                 placeholderStyle={{ color: '#ccc' }}
//               />
//             </div>

//             {/* PASSWORD */}
//             <div style={{ marginBottom: 24 }}>
//               <Text strong style={{ color: '#fff' }}>
//                 Password
//               </Text>
//               <Input.Password
//                 size="large"
//                 placeholder="Enter your password"
//                 prefix={<LockOutlined style={{ color: '#fff' }} />}
//                 iconRender={(visible) =>
//                   visible ? <EyeTwoTone twoToneColor="#fff" /> : <EyeInvisibleOutlined style={{ color: '#fff' }} />
//                 }
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={{
//                   marginTop: 6,
//                   background: 'rgba(255, 255, 255, 0.1)',
//                   border: '1px solid rgba(255, 255, 255, 0.3)',
//                   color: '#fff'
//                 }}
//               />
//             </div>

//             {/* BUTTON */}
//             <Button
//               type="primary"
//               size="large"
//               block
//               loading={loading}
//               onClick={login}
//               style={{
//                 height: 48,
//                 borderRadius: 12,
//                 background: 'linear-gradient(135deg, #6f7cf7, #7a5bbf)',
//                 border: 'none',
//                 fontWeight: 600,
//                 fontSize: 16
//               }}
//             >
//               Sign In
//             </Button>
//           </Spin>
//         </Card>

//         {/* FOOTER */}
//         <div style={{ textAlign: 'center', marginTop: 32 }}>
//           <Text style={{ color: '#e0e7ff', fontSize: 13, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
//             © 2024 APCRDA Project. All rights reserved.
//           </Text>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Card, Input, Button, Typography, Spin, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Assuming 'back1' is the correct path to the background image
import back1 from "../images/back-3.jpg";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const authRes = await axios.post(
        "http://173.249.6.61:1337/api/auth/local",
        {
          identifier: email,
          password,
        }
      );

      const token = authRes.data.jwt;

      const meRes = await axios.get(
        "http://173.249.6.61:1337/api/users/me?populate=role",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(meRes.data));

      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please check your credentials."); // More professional error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${back1})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 16,
        position: "relative",
      }}
    >
      {/* Dark overlay for better readability and contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.45)", // Slightly darker overlay
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", color: "#fff", marginBottom: 40 }}>
          {" "}
          {/* Increased margin */}
          <Title
            level={1}
            style={{
              color: "#fff",
              marginBottom: 4,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {" "}
            {/* Increased title size */}
            APCRDA Portal
          </Title>
          <Text
            style={{
              color: "#e0e7ff",
              fontSize: 18,
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            Project Management & Tracking System
          </Text>
        </div>

        {/* REVISED GLASSMORPHISM CARD */}
        <Card
          style={{
            borderRadius: 16, // Slightly smaller border radius for professionalism
            background: "rgba(255, 255, 255, 0.15)", // Lighter, more transparent white base (clearer glassmorphism)
            backdropFilter: "blur(15px)", // Added backdrop filter explicitly
            border: "1px solid rgba(255, 255, 255, 0.3)", // Clean white border
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", // Standard glass shadow
          }}
          bodyStyle={{ padding: 40 }} // Increased padding
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 4, color: "#fff" }}>
              Welcome Back
            </Title>
            <Text style={{ color: "#e0e7ff" }}>
              Sign in to continue to your dashboard
            </Text>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            {/* EMAIL */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ color: "#fff" }}>
                Email Address
              </Text>
              <Input
                size="large"
                placeholder="Enter your email"
                prefix={<MailOutlined style={{ color: "#ccc" }} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  marginTop: 8,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  borderRadius: 8,
                  height: 50,
                }}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: 32 }}>
              <Text strong style={{ color: "#fff" }}>
                Password
              </Text>
              <Input.Password
                size="large"
                placeholder="Enter your password"
                prefix={<LockOutlined style={{ color: "#ccc" }} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  marginTop: 8,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  borderRadius: 8,
                  height: 50,
                }}
              />
            </div>

            {/* BUTTON */}
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={loading}
              style={{
                height: 50,
                borderRadius: 10,
                background: "linear-gradient(135deg, #007bff, #5a4bba)",
                border: "none",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              Sign In
            </Button>
          </form>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
              style={{
                marginBottom: 20,
                background: "rgba(255, 59, 48, 0.2)", // Error background with low opacity
                border: "1px solid rgba(255, 59, 48, 0.5)",
                color: "#fff",
                borderRadius: 8,
              }}
            />
          )}
        </Card>

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          {" "}
          {/* Increased margin */}
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 14,
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            © 2024 APCRDA Project. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
