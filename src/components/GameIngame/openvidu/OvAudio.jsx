import React, { Component } from "react";

export default class OpenViduAudiocomponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidUpdate(props) {
    if (props && Boolean(this.videoRef)) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentDidMount() {
    if (this.props && Boolean(this.videoRef)) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return <audio autoPlay={true} ref={this.videoRef} width="30px" />;
  }
}
