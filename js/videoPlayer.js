(function (window, document) {
    var video = document.getElementsByTagName('video')[0],
        videoContainer = document.getElementById('video_container'),
        videoControls = document.getElementById('video_controls')
        play = document.getElementById('play'),

        progress = document.getElementById('progress'),
        progressBar = document.getElementById('progress-bar'),

        muteButton = document.getElementById('mute'),
        volumeUpButton = document.getElementById('volume_up'),
        volumeDownButton = document.getElementById('volume_down'),

        fullScreenToggleButton = document.getElementById('fullScreen'),
        isFullScreen = !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);

        var fullScreenEnabled = !!(document.fullScreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullScreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

    var videoPlayer = {
        init: function () {

            var that = this;

            document.documentElement.className = 'js';

            video.removeAttribute('controls');
            console.log('remove all default controls');

            video.addEventListener('loadeddata', this.initializeControls, false);

            video.addEventListener('loadedmetadata', function () {
                progress.setAttribute('max', video.duration);
            }, false);

            video.addEventListener('timeupdate', function () {
                if (!progress.getAttribute('max')) {
                    progress.setAttribute('max', video.duration);
                }
                progress.value = video.currentTime;
                progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
            }, false);

            progress.addEventListener('click', function (e) {
                var pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
                video.currentTime = pos * video.duration;
            }, false);

            this.handleButtonPresses();

            if (!fullScreenEnabled) {
                fullScreenToggleButton.style.display = 'none';
            }

            fullScreenToggleButton.addEventListener('click', function () {
                videoPlayer.handleFullscreen();
            }, true);
        },
        initializeControls: function () {
            videoPlayer.showOrHideControls();
        },
        showOrHideControls: function () {
            video.addEventListener('mouseover', function () {
            videoControls.style.opacity = 1;
            }, false);

            videoControls.addEventListener('mouseover', function () {
                videoControls.style.opacity = 1;
            }, false);


            video.addEventListener('mouseout', function () {
                videoControls.style.opacity = 0;
            }, false);

            videoControls.addEventListener('mouseout', function () {
                videoControls.style.opacity = 0;
            }, false);
        },
        handleButtonPresses: function () {
            video.addEventListener('click', this.playPause, false);
            play.addEventListener('click', this.playPause, false);

            video.addEventListener('play', function () {
                play.title = "Pause";
                play.innerHTML = '<span id="pauseButton">&#x2590;&#x2590;</span>';

                videoPlayer.trackPlayProgress();
            }, false);

            video.addEventListener('pause', function () {
                play.title = "Play";
                play.innerHTML = '&#x25BA';

                videoPlayer.stopTrackingPlayProgress();
            }, false);

            video.addEventListener('ended', function () {
                this.currentTime = 0;
                this.pause();
            }, false);

            volumeUpButton.addEventListener('click', function () {
                videoPlayer.alterVolume('+');
            }, false);

            volumeDownButton.addEventListener('click', function () {
                videoPlayer.alterVolume('-');
            }, false);
        },
        playPause: function () {
            if (video.paused || video.ended) {
                if (video.ended) {
                    video.currentTime = 0;
                }

                video.play();
            } else {
                video.pause();
            }
        },
        handleFullscreen: function () {
            if (isFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }

                videoPlayer.setFullscreenData(false);
            } else {
                if (videoContainer.requestFullScreen) {
                    videoContainer.requestFullScreen();
                } else if (videoContainer.mozRequestFullScreen) {
                    videoContainer.mozRequestFullScreen();
                } else if (videoContainer.webkitRequestFullScreen) {
                    videoContainer.webkitRequestFullScreen();
                } else if (videoContainer.msRequestFullscreen) {
                    videoContainer.msRequestFullscreen();
                }

                videoPlayer.setFullscreenData(true);
            }
        },
        setFullscreenData: function (state) {
            videoContainer.setAttribute('data-fullscreen', !!state);
        },
        alterVolume: function (direction) {
            console.log(video.volume);
            var currentVolume = Math.floor(video.volume * 10) / 10;

            if (direction === '+') {
                if (currentVolume < 1) {
                    video.volume += 0.1;
                }
            } else if (direction === '-') {
                if (currentVolume > 0) {
                    video.volume -= 0.1;
                }
            }
        }
    };

    videoPlayer.init();
}(this, document));
