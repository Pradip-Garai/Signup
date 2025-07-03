import React, { useState } from 'react';
import axios from 'axios';
import '../styles/form.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('password', form.password);
    data.append('image', form.image);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', data);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      {form.image && (
        <img src={URL.createObjectURL(form.image)} alt="Preview" className="preview-img" />
      )}
    </div>
  );
};

export default Signup;
