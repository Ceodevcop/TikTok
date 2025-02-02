document.addEventListener("DOMContentLoaded", function () {
    const videoFeed = document.getElementById("video-feed");
    const videos = JSON.parse(localStorage.getItem("videos")) || [];

    videos.forEach(videoURL => {
        const video = document.createElement("video");
        video.src = videoURL;
        video.controls = true;
        videoFeed.appendChild(video);
    });
});
