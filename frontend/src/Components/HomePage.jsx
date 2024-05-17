import React, { useEffect, useState } from 'react';
import './EventCard.css';

export default function HomePage() {
    const [data , setData ] = useState([]);



    return (
        <>
      <div className="fin-con">
          <h1>Добро пожаловать в Finance.com!</h1>
              <p>Finance.com - это инновационный онлайн-сервис, который поможет вам управлять вашими финансами проще и эффективнее. Наш сервис предоставляет широкий спектр инструментов для бюджетирования, отслеживания расходов, управления инвестициями и многое другое.</p>
          
              <h2>Преимущества использования Finance.com:</h2>
              <ul>
            <li>Простота использования: наш интерфейс дружелюбен и интуитивно понятен, что позволяет быстро освоиться даже новым пользователям.</li>
            <li>Безопасность данных: мы придаем большое значение защите ваших личных и финансовых данных, поэтому используем современные методы шифрования и защиты.</li>
            <li>Полный контроль: с Finance.com вы всегда будете в курсе своих финансов. Мы предоставляем детальные отчеты и аналитику, чтобы помочь вам принимать осознанные решения.</li>
              </ul>
              <p>Для начала использования Finance.com, зарегистрируйтесь прямо сейчас!</p>
      </div>
        </>
    );
}

