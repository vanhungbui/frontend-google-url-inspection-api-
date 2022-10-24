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

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const formatDate = (time) => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();

    return `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`;
  }

  const userId = 60195;
  const array = Array(70).fill();

  const dataArray = array.map((_, index) => {
    const today = new Date();
    today.setDate(today.getDate() - (index + 30));
    const reportDate = formatDate(today);
    const viewCount = getRandomInt(1000);
    const downloadCount = getRandomInt(800);
    const collectCount = getRandomInt(200);
    const likeCount = getRandomInt(500);
    const followCount = getRandomInt(100);
    return `(NULL, '2022-10-20 13:31:00.000000', '2022-10-20 13:31:00.000000', '${userId}', '${reportDate}', '${viewCount}', '${downloadCount}', '${collectCount}', '${likeCount}', '${followCount}')`;
  });

  const dataString = `INSERT INTO daily_user_reports (id, created_at, updated_at, user_id, report_date, view_count, download_count, collect_count, like_count, follow_count) VALUES ${dataArray.join(', ')}`;

  return (
    <div className="App"> 
      <label htmlFor="access_token" className="access_token_label">Token:</label> 
      <textarea rows={10} className="access_token" id="access_token" name="access_token" value={accessToken} onChange={handleChangeAccessToken} />
      <button disabled={isActive} className="button_submit" name="submit" onClick={handleSubmit}>Submit<span id="counter" >{formatTime()}</span></button>
      <br />
      <pre>{dataString}</pre>
    </div>
  );
}

export default App;
