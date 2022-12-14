import { useState, useRef } from 'react';
import axios from 'axios';

import './App.css';

const END_POINT = 'http://localhost:8080/';

function App() {
  const countRef = useRef(null);

  const [timer, setTimer] = useState(0)
  const [dataRes, setDataRes] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const handleChangeAccessToken = (e) => setAccessToken(e.target.value.trim());

  const handleStart = () => {
    setIsActive(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsActive(false)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setTimer(0)
  }

  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)

    return timer ? ` (Running ${getMinutes}:${getSeconds})` : '';
  }
  
  const handleSubmit = () => {
    handleReset();
    if (!accessToken || isActive) return;

    handleStart();

    axios.post(END_POINT, { 
      accessToken 
    }).then((res) => {
      setDataRes(res);
      if (res?.data?.data?.status === 429) {
        alert('Quota exceeded for https://xframe.io/');
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      handlePause();
    })
  }

  // const referralArray = [61, 64, 70, 77, 94, 108, 137, 150, 167].map((userId) => {
  //   return `(NULL, '2022-10-24 10:16:24.000000', '2022-10-24 10:16:24.000000', '${userId}', '3', '60101')`;
  // });

  // const insertString = `INSERT INTO referrals (id, created_at, updated_at, ref_id, download_bonus, user_id) VALUES ${referralArray.join(', ')}`;

  return (
    <div className="App"> 
      <label htmlFor="access_token" className="access_token_label">Token:</label> 
      <textarea rows={10} className="access_token" id="access_token" name="access_token" value={accessToken} onChange={handleChangeAccessToken} />
      <button disabled={isActive} className="button_submit" name="submit" onClick={handleSubmit}>Submit<span id="counter" >{formatTime()}</span></button>
      <br />
      <pre>{!!dataRes && JSON.stringify(dataRes, null, 2)}</pre>
      {/* <div>{insertString}</div> */}
    </div>
  );
}

export default App;
