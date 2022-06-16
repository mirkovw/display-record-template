(function() {
  const config = 'webpackWillReplaceThisWithConfig';
  let timeline;

  const createAnimation = function() {
    const tl = gsap.timeline({paused: true});

    tl.to('.content', { duration: 2, opacity: 1 })

    return tl;
  }

  const handleExit = function() {
    window.open(window.clickTag, '_blank');
    timeline.progress(1);
  }

  const init = function() {
    document.querySelector('.mainExit').addEventListener('click', handleExit);

    // wait for load images
    const allImagesHTMLCollection = document.getElementsByTagName('img');
    for (let image of allImagesHTMLCollection ) {
      // console.log(image.complete)
    }

    // wait for load fonts

    timeline = createAnimation();

    this.adsRecorder = new DisplayAdsRecorder();
    this.adsRecorder.enable(timeline);

    timeline.play();
  }

  class DisplayAdsRecorder {

    constructor() {

    }

    enable(animation) {
      const animationRecordEvent = new CustomEvent('animation-record');
      const animationCompleteEvent = new CustomEvent('animation-end');

      document.dispatchEvent(new CustomEvent('animation-info', {
        'detail': {
          'duration': animation.duration(),
          'width': config.settings.size.width,
          'height': config.settings.size.height,
        },
      }));


      document.addEventListener('animation-info-received', function(e) {
        console.log('Ok the server received the animation info. now start recording');

        animation.getTimeline().pause(0); //start at 0
        document.dispatchEvent(animationRecordEvent); //send request to record this frame

        document.addEventListener('animation-gotoframe-request', function(e) {

          console.log('animation-gotoframe-request')
          animation.pause(e.detail/1000);

          if (e.detail/1000 < animation.duration()) {
            document.dispatchEvent(animationRecordEvent);
          } else {
            document.dispatchEvent(animationCompleteEvent);
          }
        });

        animation.eventCallback('onStart', function() {

        });
      });

    }
  }

  window.onload = function() {
    init();
  }

})();
