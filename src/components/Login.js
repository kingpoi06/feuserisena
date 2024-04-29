import React, { useState } from 'react';
import { IoPerson, IoKey } from 'react-icons/io5';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://apiuserisena.onrender.com/login', {
        username: username,
        password: password
      });
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(135deg, #00ff88, #007bff)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px'
      }}
    >
      <section className='hero is-fullheight is-fullwidth'>
        <div className='hero-body'>
          <div className='container'>
            <div className='columns is-centered'>
              <div className='column is-5-tablet is-4-desktop is-3-widescreen'>
                <form onSubmit={Auth} className='box'>
                  <h1 className='title has-text-centered'>ISENA FKTP</h1>
                  <p className='has-text-centered'>{msg}</p>
                  <div className='field'>
                    <label className='label'>USERNAME</label>
                    <div className='control has-icons-left'>
                      <input
                        type='text'
                        className='input'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                      />
                      <span className='icon is-small is-left'>
                        <IoPerson />
                      </span>
                    </div>
                  </div>
                  <div className='field'>
                    <label className='label'>PASSWORD</label>
                    <div className='control has-icons-left'>
                      <input
                        type='password'
                        className='input'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='*******'
                      />
                      <span className='icon is-small is-left'>
                        <IoKey />
                      </span>
                    </div>
                  </div>
                  <div className='field'>
                    <button className='button is-success is-fullwidth'>
                      LOGIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
