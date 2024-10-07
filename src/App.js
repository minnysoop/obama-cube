import './App.css';
import ParticleEffect from './ParticleEffect';
import { useState, useEffect } from 'react';

function App() {
  const [showText, setShowText] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    // Set interval to toggle text visibility every 3 seconds
    const interval = setInterval(() => {
      setShowText(prev => !prev);
    }, 3000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handlePlayMusic = () => {
    const audio = document.getElementById('background-audio');
    audio.play();
    setIsMusicPlaying(true); // Update state to hide button after music starts
  };

  return (
    <div className="App">
      <ParticleEffect />
      {/* Display "Obama Prism" every three seconds */}
      {showText && <div className="obama-prism-text">OBAMA CUBE</div>}

      {/* Button to play the background music */}
      {!isMusicPlaying && (
        <button className="play-music-button" onClick={handlePlayMusic}>
          Play Music
        </button>
      )}

      {/* Audio element for background music */}
      <audio id="background-audio" loop>
        <source src="/paralyzer.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
