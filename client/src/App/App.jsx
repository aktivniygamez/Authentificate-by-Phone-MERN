import axios from 'axios';
import * as React from 'react';
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'



const SendCodePage = ({ error, setPhone, handleSend }) => {
  return (
    <div class="container">
      <label for="phone">
        Введите номер телефона:
        <input
          type="text"
          onChange={(e) => setPhone(e.target.value)}
          placeholder="8 (XXX) XXX-XXXX"
          id="phone"
        />
      </label>
      <p class="error">{error}</p>
      <Link to='/verify'>
        <button onClick={handleSend}>Отправить код</button>
      </Link>
    </div>
  )
}

const VerifyCodePage = ({ phone }) => {
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  console.log(code)

  const handleVerifyCode = () => {
    axios
    .post("http://localhost:5000/verify_code", { phone, code })
    .then(res => {
      if (res.data.success) {
        setError('Вы успешно авторизовались')
      } 
    })
    .catch(e => {
      setError('Код неверный или недействительный')
    })
  }

  return (
    <div сlass="container">
      <label for="code">
        Введите код:
        <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
      </label>
      <p class="error">{error}</p>
      <button onClick={handleVerifyCode}>Отправить</button>
    </div>
  )
}



function App() {
  const [phone, setPhone] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSend = () => {
    axios.post('http://localhost:5000/send_code', { phone })
    .then(res => {
      if (res.data.success) {
        setError('Код отправлен')
      } 
    })
    .catch(e => {
      setError('Ошибка сервера. Попробуйте позже')
    })
  }

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <SendCodePage error={error} setPhone={setPhone} handleSend={handleSend}/>
          }
        />

        <Route
          path='/verify'
          element={
            <VerifyCodePage phone={phone}/>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
