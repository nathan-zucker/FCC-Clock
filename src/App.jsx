import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { useEffect } from 'react'
import beep from './assets/beep.wav'
import chip from "./assets/chip.wav"
import click from "./assets/click.wav"


function App() {
  const [breakLength, setBreak] = useState(5*60)
  const [sessionLength, setSessionLength] = useState(25*60)
  const [timerType, setTimerType] = useState('Session')
  const [timer, setTimer] = useState(sessionLength)
  const [active, toggleActive] = useState(false)

//CONVERT S TO MM:SS
  //const formatSeconds = s => (new Date(s * 1000)).toUTCString().match(/(\d\d:\d\d\s)/)[0];
  const formatSeconds = s => {
    let arr = [[0,0],[0,0]];
    let minutes = Math.floor(s / 60)
    let seconds = s % 60
    if (minutes > 9) {
      arr[0] = (Math.floor(s / 60).toString())
    } else {
      arr[0] = ['0'+minutes]
    }
    if (seconds > 9) {
      arr[1] = (s % 60)
    } else {
      arr[1] = ['0'+seconds]
    }
    
    
    return arr.join(':')
  } 
  
//LOAD TIMER
  useEffect(()=>{
    if (active === true) {return}
    const time = sessionLength
    setTimer(time)
  },[sessionLength])

//TICK
  useEffect(()=> {
    let interval = null;
    if (active) {
      interval = setInterval(()=>{
        setTimer((timer)=>timer-1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [active])

  useEffect(()=>{
    if (timer == 0) {
      switchTimer()
    }
  },[timer])

  function switchTimer(){
    //beep
    const audio = document.getElementById('beep');
    audio.play();

    toggleActive(false)
    
    setTimeout(()=>{
    
    switch(timerType){
      case 'Session':
        setTimerType('Break')
        setTimer(breakLength)
        toggleActive(true)
        return;
      case 'Break':
        setTimerType('Session')
        setTimer(sessionLength)
        toggleActive(true)
        return;
      default: return console.error('failed to switch timer')
    };
    
    
    }, 3500)
    

  }

  function reset () {
      toggleActive(false)
      setBreak(5*60)
      setSessionLength(25*60)
      setTimer(25*60);
      setTimerType('Session');
      const audio = document.getElementById("beep")
      audio.pause()
      audio.currentTime = 0;
  }

//RENDER
  return (
    <div className="App">
      <audio id="beep" src={beep} preload="auto"></audio>
      <audio id="chip" src={chip} preload="auto"></audio>
      <audio id="click" src={click} preload="auto"></audio>
      <h1>25 + 5 Clock</h1>
{/** SET BREAK */}
      <div className='timeControls'>
        <h2 id="break-label">break length</h2>
        <button id="break-decrement" onClick={()=>{
            const audio = document.getElementById('chip')
            audio.currentTime = 0;
            audio.play()
            if (breakLength <= 60) {return}
            setBreak(breakLength - 60)
          }}>-</button>
        <h3 id="break-length">{breakLength / 60}</h3>
        <button id="break-increment" onClick={()=>{
          const audio = document.getElementById('chip')
          audio.currentTime = 0;
          audio.play()
          if (breakLength >= 60*60) {return}
          setBreak(breakLength + 60)
        }}>+</button>
      </div>
{/** SET SESSION */}
      <div className='timeControls'>
        <h2 id="session-label">session length</h2>
        <button id="session-decrement" onClick={()=>{
          const audio = document.getElementById('chip')
          audio.currentTime = 0;
          audio.play()
          if (sessionLength <= 60) {return}
          setSessionLength(sessionLength - 60)
        }}>-</button>
        <h3 id="session-length">{sessionLength / 60}</h3>
        <button id="session-increment" onClick={()=>{
          const audio = document.getElementById('chip')
          audio.currentTime = 0;
          audio.play()
          if (sessionLength >= 60*60) {return}
          setSessionLength(sessionLength + 60)
        }}>+</button>
      </div>
{/** MAIN CLOCK */}
      <div>
        <h2 id="timer-label">{timerType}</h2>
        <div id="time-left">{formatSeconds(timer)}</div>
      </div>
{/** MAIN CONTROLS */}
      <div>
        <button id="start_stop" onClick={()=>{
          toggleActive(!active)
          const audio = document.getElementById('click')
          audio.currentTime = 0;
          audio.play()
          }}>start/stop</button>
        <button id="reset" onClick={()=>{
          reset()
          const audio = document.getElementById('click')
          audio.currentTime = 0;
          audio.play()
          }}>reset</button>
      </div>
      
    </div>
  )
}

export default App
