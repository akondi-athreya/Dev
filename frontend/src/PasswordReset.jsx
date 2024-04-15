import React, { useState } from 'react';

const PasswordResetForm = ({ show, onClose, handleReset }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = () => {
    // Here you can check if the email exists in your MongoDB
    // If email exists, show the password reset form
    // If email does not exist, you can show an alert
    // For simplicity, let's just show the password reset form
    handleReset();
  };

  const handlePasswordReset = () => {
    // Here you can send the password and confirm password to your backend API
    // to update the password in MongoDB
    console.log('Resetting password:', password);
    console.log('Confirming password:', confirmPassword);
    // You can add API call here to update the password
  };

  if (!show) {
    return null;
  }

  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;