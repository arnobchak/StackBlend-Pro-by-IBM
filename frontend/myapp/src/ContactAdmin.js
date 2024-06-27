import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import "./ContactAdmin.css";
import { ToastContainer, toast } from 'react-toastify';
import { FaEnvelope } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";

export const ContactAdmin = () => {
  const form = useRef();
  const [name, setName] =useState('');
  const [email, setEmail] =useState('');
  const [message, setMessage] =useState('');

  const sendEmail = (e) => {
    e.preventDefault();

  // Validation to check if any field is empty
  if (!name || !email || !message) {
    toast.error('Please fill out all fields');
    return;
  }

    const templateParams={
      from_name: name,
      from_email: email,
      to_name:"Admin",
      message: message,

    }

    emailjs
      .sendForm('service_p170zu8','template_tdord1t', form.current, {
        publicKey: 'WBY-LIlevUKWy66mV',
        templateParams,
      })
      .then(
        (response) => {
          console.log('Email sent successfully', response);
          toast.success('Email sent successfully');
          setName('')
          setEmail('')
          setMessage('')
        },
        (error) => {
          console.log('Error sending email', error.text);
          toast.error('Error sending email');
        },
      );
  };

  return (
      <div className='contact-admin-container'>
        
        <form ref={form} onSubmit={sendEmail}>

      
          <h2><FaEnvelope/> Contact Admin Form</h2>

          
          <input type="text" placeholder='Enter your name' name="from_name" value={name} onChange={(e)=>setName(e.target.value)} />
      
          <input type="email" placeholder='Enter your email'name="from_email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <label>Message</label>
          <textarea name="message" value={message} onChange={(e)=>setMessage(e.target.value)}/>
          <button type="submit" value="Send"><FaEnvelope/> Send</button>

          <div className="form-floating mt-2 d-flex justify-content-center ">
            <a style={{fontWeight:'bold', textDecoration:'none' ,color:'black'}}href="/Manager/Login">
            <IoMdLogIn/>
            Login</a>
          </div>
        </form>

        
        <ToastContainer/>
      </div>
    
  );
};