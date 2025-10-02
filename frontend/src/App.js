import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Welcome ${data.user.first_name}! Login successful.`);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
      } else {
        setMessage(data.detail || 'Login failed');
      }
    } catch (error) {
      setMessage('Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessage('');
    setEmail('');
    setPassword('');
    localStorage.removeItem('token');
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const styles = {
    app: { textAlign: 'center', fontFamily: 'Arial, sans-serif' },
    header: { backgroundColor: '#282c34', padding: '40px', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', margin: '20px 0', maxWidth: '300px' },
    input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' },
    button: { padding: '12px 24px', backgroundColor: '#61dafb', color: '#282c34', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    demoButton: { margin: '5px', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    message: { margin: '20px 0', padding: '10px', borderRadius: '4px' },
    success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    userInfo: { backgroundColor: '#f8f9fa', color: '#333', padding: '20px', borderRadius: '8px', margin: '20px 0' }
  };

  if (user) {
    return (
      React.createElement('div', { style: styles.app },
        React.createElement('header', { style: styles.header },
          React.createElement('h1', null, '🧠 Hugo App v2'),
          React.createElement('div', { style: styles.userInfo },
            React.createElement('h2', null, `Welcome, ${user.first_name} ${user.last_name}!`),
            React.createElement('p', null, React.createElement('strong', null, 'Role: '), user.role),
            React.createElement('p', null, React.createElement('strong', null, 'Email: '), user.email)
          ),
          React.createElement('button', { 
            onClick: handleLogout, 
            style: {...styles.button, backgroundColor: '#dc3545'} 
          }, 'Logout'),
          React.createElement('div', { style: {...styles.message, ...styles.success} },
            '✅ Hugo App v2 is successfully installed and running!'
          )
        )
      )
    );
  }

  return (
    React.createElement('div', { style: styles.app },
      React.createElement('header', { style: styles.header },
        React.createElement('h1', null, '🧠 Hugo App v2'),
        React.createElement('p', null, 'Personality-driven team building platform'),
        React.createElement('form', { onSubmit: handleLogin, style: styles.form },
          React.createElement('input', {
            type: 'email',
            placeholder: 'Email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            style: styles.input
          }),
          React.createElement('input', {
            type: 'password',
            placeholder: 'Password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            style: styles.input
          }),
          React.createElement('button', {
            type: 'submit',
            disabled: loading,
            style: styles.button
          }, loading ? 'Logging in...' : 'Login')
        ),
        React.createElement('div', null,
          React.createElement('h3', null, 'Demo Accounts'),
          React.createElement('button', {
            onClick: () => fillDemo('hugo@hugoatwork.com', 'hugo123'),
            style: styles.demoButton
          }, 'Hugo Manager'),
          React.createElement('button', {
            onClick: () => fillDemo('hr@democompany.com', 'hr123'),
            style: styles.demoButton
          }, 'HR Manager'),
          React.createElement('button', {
            onClick: () => fillDemo('user@democompany.com', 'user123'),
            style: styles.demoButton
          }, 'User')
        ),
        message && React.createElement('div', {
          style: {...styles.message, ...(message.includes('Welcome') ? styles.success : styles.error)}
        }, message)
      )
    )
  );
}

export default App;
