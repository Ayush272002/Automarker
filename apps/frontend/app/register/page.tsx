'use client';

import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation (can change)
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required!');
      return;
    }

    try {
      console.log('Submitting Registration:', formData);
      // TODO: Replace with API

      setError(null);
      setSuccess(true);
    } catch (err) {
      setError('An error occurred while registering. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: '400px' }}
      >
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Registration successful! You can now <a href="/login">log in</a>.
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
