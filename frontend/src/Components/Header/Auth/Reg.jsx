import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loggin } from '../../../store/slices/isLoggin';
import { setUser } from '../../../store/slices/user';
import './Reg.css';

const Reg = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (redirect) {
            dispatch(loggin());
            navigate('/'); 
        }
    }, [redirect, dispatch, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', formData);
            alert('Registration successful');
            // Dispatching action to set user data in Redux store
            dispatch(setUser(response.data));
            console.log(response.data);
            setRedirect(true);
        } catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form"> 
                <h2>Registration</h2>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <button type="submit">Регистрация </button>
            </form>
        </div>
    );  
};

export default Reg;
