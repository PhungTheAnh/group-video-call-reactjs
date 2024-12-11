import {  useState } from 'react';
import agoraLogo from '../public/agora-logo.svg';
import './App.css';
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from 'agora-rtc-react';

function App() {
  const isConnected = useIsConnected(); // Store the user's connection status
  const [calling, setCalling] = useState(false); // Is calling
  const [appId, setAppId] = useState('5d636bc6c717443c90b3608946ee1e51'); // Store the app ID state
  const [channel, setChannel] = useState('Test'); // Store the channel name state
  const [token, setToken] = useState(
    '007eJxTYLC52Oixc9vvrTJTF69sfCvZVxn73KWuKtx0Y3mX/Zrit7kKDKYpZsZmSclmyeaG5iYmxsmWBknGZgYWliZmqamGqaaGKUyR6Q2BjAzGbh8ZGRkgEMRnYQhJLS5hYAAAjVwfTA=='
  ); // Store the token state

  // Use app ID, channel name and token to join the channel.
  // Whether to join the channel depends on the status of calling
  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );

  // Local user
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  usePublish([localMicrophoneTrack, localCameraTrack]);
  // Remote user
  const remoteUsers = useRemoteUsers();
  return (
    <>
      <div className='room'>
        {isConnected ? (
          <div className='user-list'>
            <div className='user'>
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover='https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg'
              >
                <samp className='user-name'>You</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <div className='user' key={user.uid}>
                <RemoteUser
                  cover='https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg'
                  user={user}
                >
                  <samp className='user-name'>{user.uid}</samp>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
          <div className='join-room'>
            <img alt='agora-logo' className='logo' src={agoraLogo} />
            <input
              onChange={(e) => setAppId(e.target.value)}
              placeholder='<Your app ID>'
              value={appId}
            />
            <input
              onChange={(e) => setChannel(e.target.value)}
              placeholder='<Your channel Name>'
              value={channel}
            />
            <input
              onChange={(e) => setToken(e.target.value)}
              placeholder='<Your token>'
              value={token}
            />

            <button
              className={`join-channel ${!appId || !channel ? 'disabled' : ''}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className='control'>
          <div className='left-control'>
            <button className='btn' onClick={() => setMic((a) => !a)}>
              <i className={`i-microphone ${!micOn ? 'off' : ''}`} />
            </button>
            <button className='btn' onClick={() => setCamera((a) => !a)}>
              <i className={`i-camera ${!cameraOn ? 'off' : ''}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone ${calling ? 'btn-phone-active' : ''}`}
            onClick={() => setCalling((a) => !a)}
          >
            {calling ? (
              <i className='i-phone-hangup' />
            ) : (
              <i className='i-mdi-phone' />
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default App;
