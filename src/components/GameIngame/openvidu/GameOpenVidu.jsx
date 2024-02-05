import React, { useState, useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserAudioComponent from "./UserAudioComponent";

const OPENVIDU_SERVER_URL = "https://i10a304.p.ssafy.io:4443/openvidu/";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const GameOpenVidu = ({ gameId, playerName }) => {
  const [mySessionId, setMySessionId] = useState(gameId);
  const [myUserName, setMyUserName] = useState(playerName);
  const [session, setSession] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

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

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
  };

  const joinSession = async () => {
    // e.preventDefault();
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

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: false,
        publishAudio: true,
        publishVideo: false,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      mySession.publish(publisher);

      const devices = await OV.getDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      const currentVideoDeviceId = publisher.stream.getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId,
      );

      setMainStreamManager(publisher);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);
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
    setPublisher(null);
    setCurrentVideoDevice(null);
  };

  const renderJoinSessionForm = () => {
    return (
      <div id="join">
        <div id="join-dialog" className="jumbotron vertical-center">
          <h1> Join a video session </h1>
          <form className="form-group" onSubmit={joinSession}>
            <p>
              <label>Participant: </label>
              <input
                className="form-control"
                type="text"
                id="userName"
                value={myUserName}
                onChange={handleChangeUserName}
                required
              />
            </p>
            <p>
              <label> Session: </label>
              <input
                className="form-control"
                type="text"
                id="sessionId"
                value={mySessionId}
                onChange={handleChangeSessionId}
                required
              />
            </p>
            <p className="text-center">
              <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
            </p>
          </form>
        </div>
      </div>
    );
  };

  const renderSession = () => {
    return (
      <div id="session">
        <div id="session-header">
          <h1 id="session-title">{mySessionId}</h1>
          <input
            className="btn btn-large btn-danger"
            type="button"
            id="buttonLeaveSession"
            onClick={leaveSession}
            value="Leave session"
          />
        </div>

        {mainStreamManager && (
          <div id="main-video" className="col-md-6">
            <UserAudioComponent streamManager={mainStreamManager} />
          </div>
        )}

        <div id="video-container" className="col-md-6">
          {publisher && (
            <div
              className="stream-container col-md-6 col-xs-6"
              onClick={() => handleMainVideoStream(publisher)}
            >
              <UserAudioComponent streamManager={publisher} />
            </div>
          )}

          {subscribers.map((sub, i) => (
            <div
              key={sub.id}
              className="stream-container col-md-6 col-xs-6"
              onClick={() => handleMainVideoStream(sub)}
            >
              <span>{sub.id}</span>
              <UserAudioComponent streamManager={sub} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div style={{ width: "100%" }}>{session ? renderSession() : renderJoinSessionForm()}</div>;
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
