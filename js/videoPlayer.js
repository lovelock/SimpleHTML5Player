(function (window, document) {

    var video = document.getElementsByTagName('video')[0],
        videoControls = document.getElementById('video_controls')
        play = document.getElementById('play'),

        progressContainer = document.getElementById('progress'),
        progressHolder = document.getElementById('progress_box'),
        playProgressBar = document.getElementById('play_progress'),

        fullScreenToggleButton = document.getElementById('fullScreen');
        isVideoFullScreen = false;

    var videoPlayer = {
        init: function () {

            var that = this;

            document.documentElement.className = 'js';

            video.removeAttribute('controls');
            console.log('remove all default controls');

            video.addEventListener('loadeddata', this.initializeControls, false);

            this.handleButtonPresses();

            fullScreenToggleButton.addEventListener('click', function () {
                isVideoFullScreen ? that.fullScreenOff() : that.fullScreenOn();
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
        fullScreenOn: function () {
            console.log('fullScreen toggle');
            isVideoFullScreen = true;
            video.style.cssText = 'position: fixed; width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;';

            video.className = 'fullScreenVideo';
            videoControls.className = 'fs-control';
            fullScreenToggleButton.className = 'fs-active control';

            document.addEventListener('keydown', this.checkKeyCode, false);
        },
        fullScreenOff: function () {
            console.log('fullScreen off');
            isVideoFullScreen = false;

            video.style.position = 'static';

            video.className = '';
            videoControls.className = '';
            fullScreenToggleButton.className = 'control';
        },
        checkKeyCode: function (e) {
            e = e || window.event;
            if ((e.keyCode || e.which) === 27) {
                videoPlayer.fullScreenOff();
            }
        },
        trackPlayProgress: function () {
            (function progressTrack() {
                videoPlayer.updatePlayProgress();
                playProgressInterval = setTimeout(progressTrack, 50);
            })();
        },
        updatePlayProgress: function () {
            playProgressBar.style.width = ((video.currentTime / video.duration) * (progressHolder.offsetWidth)) + "px";
        },
        stopTrackingPlayProgress: function () {
            clearTimeout(playProgressInterval);
        },
        videoScrubbing: function () {
            progressHolder.addEventListener('mousedown', function () {
                videoPlayer.stopTrackingPlayProgress();

                videoPlayer.playPause();
                document.onmousemove = function (e) {
                    videoPlayer.setPlayProgress(e.pageX);
                }

                progressHolder.onmouseup = function (e) {
                    document.onmouseup = null;
                    document.onmousemove = null;

                    video.play();
                    videoPlayer.setPlayProgress(e.pageX);
                    videoPlayer.trackPlayProgress();
                }
            }, true);
        },
        setPlayProgress: function (clickX) {
            var newPercent = Math.max(0, Math.min(1, (clickX - this.findPosX(progressHolder)) / progressHolder.offsetWidth));
            video.currentTime = newPercent * video.duration;
            playProgressBar.style.width = newPercent * (progressHolder.offsetWidth) + "px";
        },
        findPosX: function (progressHolder) {
            var curLeft = progressHolder.offsetLeft;
            while(progressHolder = progressHolder.offsetParent) {
                curLeft += progressHolder.offsetLeft;
            }

            return curLeft;
        }
    };

    videoPlayer.init();
}(this, document));
