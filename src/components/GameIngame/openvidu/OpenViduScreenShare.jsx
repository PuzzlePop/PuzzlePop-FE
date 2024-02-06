import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import { useState, useEffect } from "react";
import UserVideoComponent from "./UserVideoComponent";

const OPENVIDU_SERVER_URL = "https://i10a304.p.ssafy.io:4443/openvidu/";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const OpenViduScreenShare = ({ gameId, playerName }) => {
  const [session, setSession] = useState(undefined);
  const [myUserName, setMyUserName] = useState("Participant" + Math.floor(Math.random() * 100));
  const [mySessionId, setMySessionId] = useState("SessionA");
  const [mainStreamManager, setMainStreamManager] = useState(undefined);

  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

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

  const componentDidMount = () => {
    window.addEventListener("beforeunload", onbeforeunload);
  };

  const componentWillUnmount = () => {
    window.removeEventListener("beforeunload", onbeforeunload);
  };

  const onbeforeunload = (event) => {
    leaveSession();
  };

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
    let subscribers = subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      setSubscribers(subscribers);
    }
  };

  const joinSession = async () => {
    const OV = new OpenVidu();
    const mySession = OV.initSession();

    setSession(mySession);

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
        videoSource: "screen",
        publishAudio: false,
        publishVideo: false,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      mySession.publish(publisher);

      const devices = await OV.getDevices();
      const videoDevices = devices.filter((device) => device.kind === "screen");
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

  const switchCamera = async () => {
    try {
      const OV = new OpenVidu();
      const devices = await OV.getDevices();
      var videoDevices = devices.filter((device) => device.kind === "screen");

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId,
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await session.unpublish(mainStreamManager);

          await session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
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
          <input
            className="btn btn-large btn-success"
            type="button"
            id="buttonSwitchCamera"
            onClick={switchCamera}
            value="Switch Camera"
          />
        </div>

        {mainStreamManager !== undefined ? (
          <div id="main-video" className="col-md-6">
            <UserVideoComponent streamManager={mainStreamManager} />
          </div>
        ) : null}
        <div id="video-container" className="col-md-6">
          {publisher !== undefined ? (
            <div
              className="stream-container col-md-6 col-xs-6"
              onClick={() => handleMainVideoStream(publisher)}
            >
              <UserVideoComponent streamManager={publisher} />
            </div>
          ) : null}
          {subscribers.map((sub, i) => (
            <div
              key={sub.id}
              className="stream-container col-md-6 col-xs-6"
              onClick={() => handleMainVideoStream(sub)}
            >
              <span>{sub.id}</span>
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div style={{ width: "100%" }}>{session && renderSession()}</div>;
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

export default OpenViduScreenShare;
