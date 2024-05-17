import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Buy = ({ eventId }) => {
    const user = useSelector(state => state.user);

    const handleBuyTicket = () => {
        const seat = ''; 

        const userId = user.user._id
        if (!userId) {
            console.error('Пользователь не определен');
            return;
        }
        axios.post('http://localhost:4444/tickets', { eventId, userId, seat })
            .then(res => {
                alert('Билет успешно куплен!');
            })
            .catch(err => {
                console.error('Ошибка при покупке билета:', err);
            });
    };

    return (
        <button onClick={handleBuyTicket}>КУПИТЬ</button>
    );
};

export default Buy;
