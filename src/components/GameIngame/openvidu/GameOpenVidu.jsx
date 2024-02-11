import { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserAudioComponent from "./UserAudioComponent";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue, deepPurple } from "@mui/material/colors";

const OPENVIDU_SERVER_URL = "https://i10a304.p.ssafy.io:4443/openvidu/";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const GameOpenVidu = ({ gameId, playerName, color = "purple" }) => {
  const [mySessionId, setMySessionId] = useState(gameId);
  const [myUserName, setMyUserName] = useState(playerName);
  const [session, setSession] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const publisher = useRef(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [isUnMuted, setIsUnMuted] = useState(true);

  useEffect(() => {
    joinSession();
    const onbeforeunload = (event) => {
      leaveSession();
    };

    window.addEventListener("beforeunload", onbeforeunload);

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, []);

  useEffect(() => {
    if (publisher.current) {
      publisher.current.publishAudio(isUnMuted);
    }
  }, [publisher, isUnMuted]);

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
  };

  const joinSession = async () => {
    const OV = new OpenVidu();
    const mySession = OV.initSession();

    mySession.on("streamCreated", (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const sessionId = await createSession(mySessionId);
      const token = await createToken(sessionId);
      mySession.connect(token, { clientData: myUserName });

      const publisherOV = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: false,
        publishAudio: isUnMuted,
        publishVideo: false,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      mySession.publish(publisherOV);

      setMainStreamManager(publisherOV);
      publisher.current = publisherOV;
    } catch (error) {
      console.log("There was an error connecting to the session:", error.code, error.message);
    }

    setSession(mySession);
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    setSession(null);
    setSubscribers([]);
    setMainStreamManager(null);
    setCurrentVideoDevice(null);
  };

  const toggleMute = () => {
    setIsUnMuted(!isUnMuted);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      redTeam: {
        light: red[300],
        main: red[400],
        dark: red[500],
        darker: red[600],
        contrastText: "#fff",
      },
      blueTeam: {
        light: blue[300],
        main: blue[400],
        dark: blue[500],
        darker: blue[600],
        contrastText: "#fff",
      },
      purple: {
        light: deepPurple[300],
        main: deepPurple[400],
        dark: deepPurple[500],
        darker: deepPurple[600],
        contrastText: "#fff",
      },
    },
  });

  const renderSession = () => {
    return (
      <div id="session">
        <div id="session-header">
          {/* <h1 id="session-title">{mySessionId}</h1> */}
          <ThemeProvider theme={theme}>
            <IconButton
              aria-label="mic"
              color={color}
              onClick={toggleMute}
              sx={{ marginRight: "3px" }}
            >
              {isUnMuted ? <MicOffIcon fontSize="inherit" /> : <MicIcon fontSize="inherit" />}
            </IconButton>
          </ThemeProvider>
          {/* <input
            className="btn btn-large btn-danger"
            type="button"
            id="buttonLeaveSession"
            onClick={leaveSession}
            value="Leave session"
          /> */}
        </div>

        {/* {mainStreamManager && (
          <div id="main-video" className="col-md-6">
            <UserAudioComponent streamManager={mainStreamManager} />
          </div>
        )} */}

        <div id="video-container" className="col-md-6">
          {/* {publisher.current && (
            <div className="stream-container col-md-6 col-xs-6">
              <p>publisher: </p>
              <UserAudioComponent streamManager={publisher.current} />
            </div>
          )} */}

          {subscribers.map((sub, i) => (
            <div key={sub.id} className="stream-container col-md-6 col-xs-6">
              <span>{sub.id}</span>
              <UserAudioComponent streamManager={sub} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div>{session && renderSession()}</div>;
};

async function createSession(sessionId) {
  return new Promise(async (resolve, reject) => {
    const data = { customSessionId: sessionId };
    try {
      const response = await axios.post(OPENVIDU_SERVER_URL + "api/sessions", data, {
        headers: {
          Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });

      setTimeout(() => {
        console.log("Forced return through developer settings");
        console.log(sessionId);
        return resolve(sessionId);
      }, 1000);

      return response.data.id;
    } catch (response) {
      const error = Object.assign({}, response);
      if (error?.response?.status === 409) {
        return resolve(sessionId);
      }
    }
  });
}

async function createToken(sessionId) {
  const response = await axios.post(
    OPENVIDU_SERVER_URL + "api/sessions/" + sessionId + "/connection",
    {},
    {
      headers: {
        Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.token;
}

export default GameOpenVidu;
