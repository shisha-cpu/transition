import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Dashboard.css'; // Import stylesheet
import AddEvent from './AddEvent';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'; // Import Chart.js

export default function Dashboard() {
  const user = useSelector(state => state.user);
  const [userTransactions, setUserTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState(user.user.wallet);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:3000/transactions?userId=${user.user._id}`)
      .then(response => {
        setUserTransactions(response.data);
        setExpenseTransactions(response.data.filter(transaction => transaction.type === 'expense'));
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, [user]);
  
  
  useEffect(() => {
    axios.get(`http://localhost:3000/transactions?userId=${user.user._id}`)
      .then(response => {
        setUserTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, [user]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };
    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };
    return () => {
      ws.close();
    };
  }, []);
  useEffect(() => {
    // Draw chart
    const ctx = document.getElementById('myChart');
    const existingChart = Chart.getChart(ctx);
  
    if (existingChart) {
      existingChart.destroy();
    }
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: userTransactions.map(transaction => new Date(transaction.date).toLocaleDateString()),
        datasets: [{
            label: 'Доходы',
            data: userTransactions.map(transaction => transaction.amount),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }, {
            label: 'Расходы',
            data: expenseTransactions.map(transaction => transaction.amount),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
        
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [userTransactions, expenseTransactions]);
  
  

  const handleAddTransaction = () => {
    axios.post('http://localhost:3000/transactions', {
      userId: user.user._id,
      type,
      amount: parseFloat(amount),
      description
    })
      .then(response => {
        setUserTransactions([...userTransactions, response.data]);
        const updatedWallet = type === 'income' ? wallet + parseFloat(amount) : wallet - parseFloat(amount);
        setWallet(updatedWallet);
        setAmount(0);
        setType('income');
        setDescription('');
      })
      .catch(error => {
        console.error('Error adding transaction:', error);
      });
  };

  return (
    <div className="dashboard-container">
      <h1>Личный кабинет пользователя: {user.user.name}</h1>
      <h3>Денег: {wallet}</h3>

      <div className="transaction-form">
        <h2>Добавить транзакцию</h2>
        <label>
          Тип:
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </label>
        <label>
          Сумма:
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </label>
        <label>
          Описание:
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <button onClick={handleAddTransaction}>Добавить</button>
      </div>

      <div className="transaction-history">
        <h2>История транзакций</h2>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Тип</th>
              <th>Сумма</th>
              <th>Описание</th>
              <th>Время</th>
            </tr>
          </thead>
          <tbody>
  {userTransactions && userTransactions.map(transaction => (
    <tr key={transaction._id}>
      <td>{new Date(transaction.date).toLocaleDateString()}</td>
      <td>{transaction.type === 'income' ? 'Доход' : 'Расход'}</td>
      <td>{transaction.amount}</td>
      <td>{transaction.description}</td>
      <td>{new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      <div className="chart-container"> 
        <canvas id="myChart"></canvas> 
      </div>

    </div>
  );
}
