$(document).ready(function() {

    window.prettyPrint && prettyPrint()

    // Animated thumbnails
    var $animThumb = $('#aniimated-thumbnials');
    if ($animThumb.length) {
        $animThumb.justifiedGallery({
            border: 6
        }).on('jg.complete', function() {
            lightGallery($animThumb[0], {
                thumbnail: true
            });
        });
    };

    //thumbnails without animation
    var $thumb = $('#thumbnials-without-animation');
    if ($thumb.length) {
        $thumb.justifiedGallery({
            border: 6
        }).on('jg.complete', function() {
            lightGallery($thumb[0], {
                thumbnail: true,
                animateThumb: false,
                showThumbByDefault: false
            });
        });
    };

    // Fixed size
    lightGallery(document.getElementById('fixed-size'), {
        width: '700px',
        height: '470px',
        mode: 'lg-fade',
        addClass: 'fixed-size',
        counter: false,
        download: false,
        startClass: '',
        enableSwipe: false,
        enableDrag: false,
        speed: 500
    });

    lightGallery($('#html5-videos')[0], {
        thumbnail: false
    });

    lightGallery($('#html5-videos-videojs')[0], {
        videojs: true
    });

    lightGallery($('#videos')[0]);
    lightGallery($('#videos-without-poster')[0]);
    lightGallery($('#video-player-param')[0], {
        youtubePlayerParams: {
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            controls: 0
        },
        vimeoPlayerParams: {
            byline: 0,
            portrait: 0,
            color: 'A90707'
        }
    });

    lightGallery($('#video-thumbnails')[0], {
        loadYoutubeThumbnail: true,
        youtubeThumbSize: 'default',
        loadVimeoThumbnail: true,
        vimeoThumbSize: 'thumbnail_medium'
    });

    if (document.getElementById('dynamic')) {
        document.getElementById('dynamic').addEventListener('click', function() {
            lightGallery(document.getElementById('dynamic'), {
                dynamic: true,
                dynamicEl: [{
                    src: '../static/img/1.jpg',
                    thumb: '../static/img/thumb-1.jpg',
                    subHtml: '<h4>Fading Light</h4><p>Classic view from Rigwood Jetty on Coniston Water an old archive shot similar to an old post but a little later on.</p>'
                }, {
                    src: 'https://www.youtube.com/watch?v=Pq9yPrLWMyU',
                    thumb: '../static/img/thumb-v-y-2.jpg',
                    poster: '../static/img/videos/y-video2-cover.jpg',
                    subHtml: '<h4>Bowness Bay</h4><p>A beautiful Sunrise this morning taken En-route to Keswick not one as planned but I\'m extremely happy I was passing the right place at the right time....</p>'
                }, {
                    src: '../static/img/13.jpg',
                    thumb: '../static/img/thumb-13.jpg',
                    subHtml: '<h4>Sunset Serenity</h4><p>A gorgeous Sunset tonight captured at Coniston Water....</p>'
                }, {
                    src: '../static/img/3.jpg',
                    thumb: '../static/img/thumb-3.jpg',
                    subHtml: '<h4>Coniston Calmness</h4><p>Beautiful morning</p>'
                }]
            })
        });
    }

    
    function customTransitions(trans) {
        lightGallery($('#custom-transitions')[0], {
            mode: trans
        });
    }

    customTransitions('lg-slide');

    $('#select-trans').on('change', function() {
        window.lgData[$('#custom-transitions').attr('lg-uid')].destroy(true);
        customTransitions($(this).val());
    });

    function customEasing(ease) {
        lightGallery($('#custom-easing')[0], {
            cssEasing: ease
        });
    }

    customEasing('cubic-bezier(0.680, -0.550, 0.265, 1.550)');

    $('#select-ease').on('change', function() {

        var val = $(this).val();
        prompt('You can copy cubic-bezier from here', val);

        window.lgData[$('#custom-easing').attr('lg-uid')].destroy(true);
        customEasing('cubic-bezier(' + val + ')');
    });

    // Custom events
    var $customEvents = $('#custom-events');
    if ($customEvents.length) {
        lightGallery($customEvents[0]);

        var colours = ['rgb(33, 23, 26)', 'rgb(129, 87, 94)', 'rgb(156, 80, 67)', 'rgb(143, 101, 93)'];
        $customEvents[0].addEventListener('onBeforeSlide', function(event) {        
            document.querySelector('.lg-outer').style.backgroundColor =  colours[event.detail.index];
        });
    }

    
    // Responsive images
    lightGallery(document.getElementById('responsive-images'));
    lightGallery(document.getElementById('srcset-images'));
    
    // methods
    var $methods = document.getElementById('methods');
    var $appendSlide = document.getElementById('appendSlide');
    if ($methods && $appendSlide) {
        var slide = '<li class="col-xs-6 col-sm-4 col-md-3" data-src="../static/img/4.jpg">' +
            '<a href="">' +
            '<img class="img-responsive" src="../static/img/thumb-4.jpg">' +
            '<div class="demo-gallery-poster">' +
            '<img src="../static/img/zoom.png">' +
            '</div>' +
            '</a>' +
            '</li>';
        lightGallery($methods);
        $appendSlide.addEventListener('click', function() {
            $methods.insertAdjacentHTML('beforeend', slide);
            window.lgData[$methods.getAttribute('lg-uid')].destroy(true);
            lightGallery($methods);
        }, false);
    }

    // iframe
    lightGallery(document.getElementById('open-website'), {
        selector: 'this'
    });

    // Google map
    lightGallery(document.getElementById('google-map'), {
        selector: 'this',
        iframeMaxWidth: '80%'
    });

    lightGallery(document.getElementById('captions'));
    lightGallery(document.getElementById('relative-caption'), {
        subHtmlSelectorRelative: true
    });
    lightGallery(document.getElementById('hash'));
    lightGallery(document.getElementById('lg-share-demo'));

    var commentBox = document.getElementById('comment-box');
    if (commentBox) {        
        lightGallery(commentBox, {
            appendSubHtmlTo: '.lg-item',
            addClass: 'fb-comments',
            mode: 'lg-fade',
            download: false,
            enableDrag: false,
            enableSwipe: false
        });
        commentBox.addEventListener('onAfterSlide', function(event) {
            var items = document.querySelectorAll('.lg-outer .lg-item');
            if (!items[event.detail.index].getAttribute('data-fb')) {
                try {
                    items[event.detail.index].setAttribute('data-fb', 'loaded');
                    FB.XFBML.parse();
                } catch (err) {
                    window.addEventListener('fbAsyncInit', function() {
                        items[event.detail.index].setAttribute('data-fb', 'loaded');
                        FB.XFBML.parse();
                    });
                }
            }
        });
    }

    var commentBoxSep = document.getElementById('comment-box-sep');
    if (commentBoxSep) {
        lightGallery(commentBoxSep, {
            addClass: 'fb-comments',
            download: false,
            galleryId: 2
        });
        commentBoxSep.addEventListener('onAfterAppendSubHtml', function() {
            try {
                FB.XFBML.parse();
            } catch (err) {
                window.addEventListener('fbAsyncInit', function() {
                    FB.XFBML.parse();
                });
            }
        });     
    }

});
