(function() {
  const config = 'webpackWillReplaceThisWithConfig';
  let timeline;

  function enableAdsRecorder(animation, config) {
    const animationRecordEvent = new CustomEvent('animation-record');
    const animationCompleteEvent = new CustomEvent('animation-end');
    console.log('ads recorder enabled');
    document.dispatchEvent(new CustomEvent('animation-info', {
      'detail': {
        'duration': animation.duration(),
        'width': config.settings.size.width,
        'height': config.settings.size.height,
      },
    }));

    document.addEventListener('animation-info-received', function(e) {
      console.log('Ok the server received the animation info. now start recording');

      animation.pause(0); //start at 0
      document.dispatchEvent(animationRecordEvent); //send request to record this frame

      document.addEventListener('animation-gotoframe-request', function(e) {

        console.log('animation-gotoframe-request', e.detail)
        animation.pause(e.detail/1000);

        if (e.detail/1000 <= animation.duration()) {
          document.dispatchEvent(animationRecordEvent);
        } else {
          document.dispatchEvent(animationCompleteEvent);
        }
      });
    });
  }

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

    enableAdsRecorder(timeline, config);

    timeline.play();
  }



  window.onload = function() {
    init();
  }

})();
