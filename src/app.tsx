import React from "react";

const App: React.FC<{}> = () => {
  const [canShowVideo, setCanShowVideo] = React.useState(false);

  const [toggleVideo, setToggleVideo] = React.useState(false);

  function showVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        setCanShowVideo(true);
        setToggleVideo(true);
        // @ts-ignore
        document.getElementById("video").srcObject = res;
      })
      .catch((err) => {
        setCanShowVideo(false);
        alert("Could not access webcam");
      });
  }

  React.useEffect(() => {}, []);

  return (
    <>
      <button
        onClick={() => {
          if (toggleVideo) {
            setToggleVideo(false);
          } else {
            showVideo();
          }
        }}
      >
        {toggleVideo ? "Hide Video" : "Show Video"}
      </button>
      <section>
        {!canShowVideo ? null : canShowVideo && toggleVideo ? (
          <video id="video" className="video-component" autoPlay></video>
        ) : null}
      </section>
    </>
  );
};

export default App;
