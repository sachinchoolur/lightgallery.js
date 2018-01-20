/** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */
(function() {

    if (typeof window.CustomEvent === 'function') {
        return false;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

import utils from './lg-utils';
window.utils = utils;
window.lgData = {
    uid: 0
};

window.lgModules = {};
var defaults = {

    mode: 'lg-slide',

    // Ex : 'ease'
    cssEasing: 'ease',

    //'for jquery animation'
    easing: 'linear',
    speed: 600,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 150,
    hideBarsDelay: 6000,

    useLeft: false,

    closable: true,
    loop: true,
    escKey: true,
    keyPress: true,
    controls: true,
    slideEndAnimatoin: true,
    hideControlOnEnd: false,
    mousewheel: false,

    getCaptionFromTitleOrAlt: true,

    // .lg-item || '.lg-sub-html'
    appendSubHtmlTo: '.lg-sub-html',

    subHtmlSelectorRelative: false,

    /**
     * @desc number of preload slides
     * will exicute only after the current slide is fully loaded.
     *
     * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
     * slide will be loaded in the background after the 4th slide is fully loaded..
     * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
     *
     */
    preload: 1,
    showAfterLoad: true,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',

    // 0, 1
    index: false,

    iframeMaxWidth: '100%',

    download: true,
    counter: true,
    appendCounterTo: '.lg-toolbar',

    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,

    dynamic: false,
    dynamicEl: [],
    galleryId: 1
};

function Plugin(element, options) {

    // Current lightGallery element
    this.el = element;

    // lightGallery settings
    this.s = Object.assign({}, defaults, options);

    // When using dynamic mode, ensure dynamicEl is an array
    if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
        throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
    }

    // lightGallery modules
    this.modules = {};

    // false when lightgallery complete first slide;
    this.lGalleryOn = false;

    this.lgBusy = false;

    // Timeout function for hiding controls;
    this.hideBartimeout = false;

    // To determine browser supports for touch events;
    this.isTouch = ('ontouchstart' in document.documentElement);

    // Disable hideControlOnEnd if sildeEndAnimation is true
    if (this.s.slideEndAnimatoin) {
        this.s.hideControlOnEnd = false;
    }

    this.items = [];

    // Gallery items
    if (this.s.dynamic) {
        this.items = this.s.dynamicEl;
    } else {
        if (this.s.selector === 'this') {
            this.items.push(this.el);
        } else if (this.s.selector !== '') {
            if (this.s.selectWithin) {
                this.items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
            } else {
                this.items = this.el.querySelectorAll(this.s.selector);
            }
        } else {
            this.items = this.el.children;
        }
    }

    // .lg-item

    this.___slide = '';

    // .lg-outer
    this.outer = '';

    this.init();

    return this;
}

Plugin.prototype.init = function() {

    var _this = this;

    // s.preload should not be more than $item.length
    if (_this.s.preload > _this.items.length) {
        _this.s.preload = _this.items.length;
    }

    // if dynamic option is enabled execute immediately
    var _hash = window.location.hash;
    if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {

        _this.index = parseInt(_hash.split('&slide=')[1], 10);

        utils.addClass(document.body, 'lg-from-hash');
        if (!utils.hasClass(document.body, 'lg-on')) {
            utils.addClass(document.body, 'lg-on');
            setTimeout(function() {
                _this.build(_this.index);
            });
        }
    }

    if (_this.s.dynamic) {

        utils.trigger(this.el, 'onBeforeOpen');

        _this.index = _this.s.index || 0;

        // prevent accidental double execution
        if (!utils.hasClass(document.body, 'lg-on')) {
            utils.addClass(document.body, 'lg-on');
            setTimeout(function() {
                _this.build(_this.index);
            });
        }
    } else {

        for (var i = 0; i < _this.items.length; i++) {

            /*jshint loopfunc: true */
            (function(index) {

                // Using different namespace for click because click event should not unbind if selector is same object('this')
                utils.on(_this.items[index], 'click.lgcustom', (e) => {

                    e.preventDefault();

                    utils.trigger(_this.el, 'onBeforeOpen');

                    _this.index = _this.s.index || index;

                    if (!utils.hasClass(document.body, 'lg-on')) {
                        _this.build(_this.index);
                        utils.addClass(document.body, 'lg-on');
                    }
                });

            })(i);

        }

    }

};

Plugin.prototype.build = function(index) {

    var _this = this;

    _this.structure();

    for (var key in window.lgModules) {
        _this.modules[key] = new window.lgModules[key](_this.el);
    }

    // initiate slide function
    _this.slide(index, false, false);

    if (_this.s.keyPress) {
        _this.keyPress();
    }

    if (_this.items.length > 1) {

        _this.arrow();

        setTimeout(function() {
            _this.enableDrag();
            _this.enableSwipe();
        }, 50);

        if (_this.s.mousewheel) {
            _this.mousewheel();
        }
    }

    _this.counter();

    _this.closeGallery();

    utils.trigger(_this.el, 'onAfterOpen');

    // Hide controllers if mouse doesn't move for some period
    utils.on(_this.outer, 'mousemove.lg click.lg touchstart.lg', function() {

        utils.removeClass(_this.outer, 'lg-hide-items');

        clearTimeout(_this.hideBartimeout);

        // Timeout will be cleared on each slide movement also
        _this.hideBartimeout = setTimeout(function() {
            utils.addClass(_this.outer, 'lg-hide-items');
        }, _this.s.hideBarsDelay);

    });

};

Plugin.prototype.structure = function() {
    var list = '';
    var controls = '';
    var i = 0;
    var subHtmlCont = '';
    var template;
    var _this = this;

    document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');
    utils.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms');

    // Create gallery items
    for (i = 0; i < this.items.length; i++) {
        list += '<div class="lg-item"></div>';
    }

    // Create controlls
    if (this.s.controls && this.items.length > 1) {
        controls = '<div class="lg-actions">' +
            '<div class="lg-prev lg-icon">' + this.s.prevHtml + '</div>' +
            '<div class="lg-next lg-icon">' + this.s.nextHtml + '</div>' +
            '</div>';
    }

    if (this.s.appendSubHtmlTo === '.lg-sub-html') {
        subHtmlCont = '<div class="lg-sub-html"></div>';
    }

    template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' +
        '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' +
        '<div class="lg-inner">' + list + '</div>' +
        '<div class="lg-toolbar group">' +
        '<span class="lg-close lg-icon"></span>' +
        '</div>' +
        controls +
        subHtmlCont +
        '</div>' +
        '</div>';

    document.body.insertAdjacentHTML('beforeend', template);
    this.outer = document.querySelector('.lg-outer');
    this.___slide = this.outer.querySelectorAll('.lg-item');

    if (this.s.useLeft) {
        utils.addClass(this.outer, 'lg-use-left');

        // Set mode lg-slide if use left is true;
        this.s.mode = 'lg-slide';
    } else {
        utils.addClass(this.outer, 'lg-use-css3');
    }

    // For fixed height gallery
    _this.setTop();
    utils.on(window, 'resize.lg orientationchange.lg', function() {
        setTimeout(function() {
            _this.setTop();
        }, 100);
    });

    // add class lg-current to remove initial transition
    utils.addClass(this.___slide[this.index], 'lg-current');

    // add Class for css support and transition mode
    if (this.doCss()) {
        utils.addClass(this.outer, 'lg-css3');
    } else {
        utils.addClass(this.outer, 'lg-css');

        // Set speed 0 because no animation will happen if browser doesn't support css3
        this.s.speed = 0;
    }

    utils.addClass(this.outer, this.s.mode);

    if (this.s.enableDrag && this.items.length > 1) {
        utils.addClass(this.outer, 'lg-grab');
    }

    if (this.s.showAfterLoad) {
        utils.addClass(this.outer, 'lg-show-after-load');
    }

    if (this.doCss()) {
        let inner = this.outer.querySelector('.lg-inner');
        utils.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);
        utils.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
    }

    setTimeout(function() {
        utils.addClass(document.querySelector('.lg-backdrop'), 'in');
    });


    setTimeout(function() {
        utils.addClass(_this.outer, 'lg-visible');
    }, this.s.backdropDuration);

    if (this.s.download) {
        this.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
    }

    // Store the current scroll top value to scroll back after closing the gallery..
    this.prevScrollTop = (document.documentElement.scrollTop || document.body.scrollTop)

};

// For fixed height gallery
Plugin.prototype.setTop = function() {
    if (this.s.height !== '100%') {
        let wH = window.innerHeight;
        let top = (wH - parseInt(this.s.height, 10)) / 2;
        let lGallery = this.outer.querySelector('.lg');
        if (wH >= parseInt(this.s.height, 10)) {
            lGallery.style.top = top + 'px';
        } else {
            lGallery.style.top = '0px';
        }
    }
};

// Find css3 support
Plugin.prototype.doCss = function() {
    // check for css animation support
    var support = function() {
        var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
        var root = document.documentElement;
        var i = 0;
        for (i = 0; i < transition.length; i++) {
            if (transition[i] in root.style) {
                return true;
            }
        }
    };

    if (support()) {
        return true;
    }

    return false;
};

/**
 *  @desc Check the given src is video
 *  @param {String} src
 *  @return {Object} video type
 *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
 */
Plugin.prototype.isVideo = function(src, index) {

    /* Disable this check to allow the proper initialization of dynamic HTML5 video slides
    if(!src) {
        throw new Error("Make sure that slide " + index + " has an image/video src");
    }
    */
    
    var html;
    if (this.s.dynamic) {
        html = this.s.dynamicEl[index].html;
    } else {
        html = this.items[index].getAttribute('data-html');
    }

    if (!src && html) {
        return {
            html5: true
        };
    }

    var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
    var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
    var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
    var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

    if (youtube) {
        return {
            youtube: youtube
        };
    } else if (vimeo) {
        return {
            vimeo: vimeo
        };
    } else if (dailymotion) {
        return {
            dailymotion: dailymotion
        };
    } else if (vk) {
        return {
            vk: vk
        };
    }
};

/**
 *  @desc Create image counter
 *  Ex: 1/10
 */
Plugin.prototype.counter = function() {
    if (this.s.counter) {
        this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.items.length + '</span></div>');
    }
};

/**
 *  @desc add sub-html into the slide
 *  @param {Number} index - index of the slide
 */
Plugin.prototype.addHtml = function(index) {
    var subHtml = null;
    var currentEle;
    if (this.s.dynamic) {
        subHtml = this.s.dynamicEl[index].subHtml;
    } else {
        currentEle = this.items[index];
        subHtml = currentEle.getAttribute('data-sub-html');
        if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
            subHtml = currentEle.getAttribute('title');
            if (subHtml && currentEle.querySelector('img')) {
                subHtml = currentEle.querySelector('img').getAttribute('alt');
            }
        }
    }

    if (typeof subHtml !== 'undefined' && subHtml !== null) {

        // get first letter of subhtml
        // if first letter starts with . or # get the html form the jQuery object
        var fL = subHtml.substring(0, 1);
        if (fL === '.' || fL === '#') {
            if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                subHtml = currentEle.querySelector(subHtml).innerHTML;
            } else {
                subHtml = document.querySelector(subHtml).innerHTML;
            }
        }
    } else {
        subHtml = '';
    }

    if (this.s.appendSubHtmlTo === '.lg-sub-html') {
        this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
    } else {
        this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
    }

    // Add lg-empty-html class if title doesn't exist
    if (typeof subHtml !== 'undefined' && subHtml !== null) {
        if (subHtml === '') {
            utils.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
        } else {
            utils.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
        }
    }

    utils.trigger(this.el, 'onAfterAppendSubHtml', {
        index: index
    });
};

/**
 *  @desc Preload slides
 *  @param {Number} index - index of the slide
 */
Plugin.prototype.preload = function(index) {
    var i = 1;
    var j = 1;
    for (i = 1; i <= this.s.preload; i++) {
        if (i >= this.items.length - index) {
            break;
        }

        this.loadContent(index + i, false, 0);
    }

    for (j = 1; j <= this.s.preload; j++) {
        if (index - j < 0) {
            break;
        }

        this.loadContent(index - j, false, 0);
    }
};

/**
 *  @desc Load slide content into slide.
 *  @param {Number} index - index of the slide.
 *  @param {Boolean} rec - if true call loadcontent() function again.
 *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
 */
Plugin.prototype.loadContent = function(index, rec, delay) {

    var _this = this;
    var _hasPoster = false;
    var _img;
    var _src;
    var _poster;
    var _srcset;
    var _sizes;
    var _html;
    var getResponsiveSrc = function(srcItms) {
        var rsWidth = [];
        var rsSrc = [];
        for (var i = 0; i < srcItms.length; i++) {
            var __src = srcItms[i].split(' ');

            // Manage empty space
            if (__src[0] === '') {
                __src.splice(0, 1);
            }

            rsSrc.push(__src[0]);
            rsWidth.push(__src[1]);
        }

        var wWidth = window.innerWidth;
        for (var j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
                _src = rsSrc[j];
                break;
            }
        }
    };

    if (_this.s.dynamic) {

        if (_this.s.dynamicEl[index].poster) {
            _hasPoster = true;
            _poster = _this.s.dynamicEl[index].poster;
        }

        _html = _this.s.dynamicEl[index].html;
        _src = _this.s.dynamicEl[index].src;

        if (_this.s.dynamicEl[index].responsive) {
            var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
            getResponsiveSrc(srcDyItms);
        }

        _srcset = _this.s.dynamicEl[index].srcset;
        _sizes = _this.s.dynamicEl[index].sizes;

    } else {

        if (_this.items[index].getAttribute('data-poster')) {
            _hasPoster = true;
            _poster = _this.items[index].getAttribute('data-poster');
        }

        _html = _this.items[index].getAttribute('data-html');
        _src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');

        if (_this.items[index].getAttribute('data-responsive')) {
            var srcItms = _this.items[index].getAttribute('data-responsive').split(',');
            getResponsiveSrc(srcItms);
        }

        _srcset = _this.items[index].getAttribute('data-srcset');
        _sizes = _this.items[index].getAttribute('data-sizes');

    }

    //if (_src || _srcset || _sizes || _poster) {

    var iframe = false;
    if (_this.s.dynamic) {
        if (_this.s.dynamicEl[index].iframe) {
            iframe = true;
        }
    } else {
        if (_this.items[index].getAttribute('data-iframe') === 'true') {
            iframe = true;
        }
    }

    var _isVideo = _this.isVideo(_src, index);
    if (!utils.hasClass(_this.___slide[index], 'lg-loaded')) {
        if (iframe) {
            _this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
        } else if (_hasPoster) {
            var videoClass = '';
            if (_isVideo && _isVideo.youtube) {
                videoClass = 'lg-has-youtube';
            } else if (_isVideo && _isVideo.vimeo) {
                videoClass = 'lg-has-vimeo';
            } else {
                videoClass = 'lg-has-html5';
            }

            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');

        } else if (_isVideo) {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
            utils.trigger(_this.el, 'hasVideo', {
                index: index,
                src: _src,
                html: _html
            });
        } else {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
        }

        utils.trigger(_this.el, 'onAferAppendSlide', {
            index: index
        });

        _img = _this.___slide[index].querySelector('.lg-object');
        if (_sizes) {
            _img.setAttribute('sizes', _sizes);
        }

        if (_srcset) {
            _img.setAttribute('srcset', _srcset);
            try {
                picturefill({
                    elements: [_img[0]]
                });
            } catch (e) {
                console.error('Make sure you have included Picturefill version 2');
            }
        }

        if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
            _this.addHtml(index);
        }

        utils.addClass(_this.___slide[index], 'lg-loaded');
    }

    utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {

        // For first time add some delay for displaying the start animation.
        var _speed = 0;

        // Do not change the delay value because it is required for zoom plugin.
        // If gallery opened from direct url (hash) speed value should be 0
        if (delay && !utils.hasClass(document.body, 'lg-from-hash')) {
            _speed = delay;
        }

        setTimeout(function() {
            utils.addClass(_this.___slide[index], 'lg-complete');

            utils.trigger(_this.el, 'onSlideItemLoad', {
                index: index,
                delay: delay || 0
            });
        }, _speed);

    });

    // @todo check load state for html5 videos
    if (_isVideo && _isVideo.html5 && !_hasPoster) {
        utils.addClass(_this.___slide[index], 'lg-complete');
    }

    if (rec === true) {
        if (!utils.hasClass(_this.___slide[index], 'lg-complete')) {
            utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {
                _this.preload(index);
            });
        } else {
            _this.preload(index);
        }
    }

    //}
};

/**
*   @desc slide function for lightgallery
    ** Slide() gets call on start
    ** ** Set lg.on true once slide() function gets called.
    ** Call loadContent() on slide() function inside setTimeout
    ** ** On first slide we do not want any animation like slide of fade
    ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
    ** ** Else loadContent() should wait for the transition to complete.
    ** ** So set timeout s.speed + 50
<=> ** loadContent() will load slide content in to the particular slide
    ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
    ** ** preload will execute only when the previous slide is fully loaded (images iframe)
    ** ** avoid simultaneous image load
<=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
    ** loadContent()  <====> Preload();

*   @param {Number} index - index of the slide
*   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
*   @param {Boolean} fromThumb - true if slide function called via thumbnail click
*/
Plugin.prototype.slide = function(index, fromTouch, fromThumb) {

    var _prevIndex = 0;
    for (var i = 0; i < this.___slide.length; i++) {
        if (utils.hasClass(this.___slide[i], 'lg-current')) {
            _prevIndex = i;
            break;
        }
    }

    var _this = this;

    // Prevent if multiple call
    // Required for hsh plugin
    if (_this.lGalleryOn && (_prevIndex === index)) {
        return;
    }

    var _length = this.___slide.length;
    var _time = _this.lGalleryOn ? this.s.speed : 0;
    var _next = false;
    var _prev = false;

    if (!_this.lgBusy) {

        if (this.s.download) {
            var _src;
            if (_this.s.dynamic) {
                _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
            } else {
                _src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));

            }

            if (_src) {
                document.getElementById('lg-download').setAttribute('href', _src);
                utils.removeClass(_this.outer, 'lg-hide-download');
            } else {
                utils.addClass(_this.outer, 'lg-hide-download');
            }
        }

        utils.trigger(_this.el, 'onBeforeSlide', {
            prevIndex: _prevIndex,
            index: index,
            fromTouch: fromTouch,
            fromThumb: fromThumb
        });

        _this.lgBusy = true;

        clearTimeout(_this.hideBartimeout);

        // Add title if this.s.appendSubHtmlTo === lg-sub-html
        if (this.s.appendSubHtmlTo === '.lg-sub-html') {

            // wait for slide animation to complete
            setTimeout(function() {
                _this.addHtml(index);
            }, _time);
        }

        this.arrowDisable(index);

        if (!fromTouch) {

            // remove all transitions
            utils.addClass(_this.outer, 'lg-no-trans');

            for (var j = 0; j < this.___slide.length; j++) {
                utils.removeClass(this.___slide[j], 'lg-prev-slide');
                utils.removeClass(this.___slide[j], 'lg-next-slide');
            }

            if (index < _prevIndex) {
                _prev = true;
                if ((index === 0) && (_prevIndex === _length - 1) && !fromThumb) {
                    _prev = false;
                    _next = true;
                }
            } else if (index > _prevIndex) {
                _next = true;
                if ((index === _length - 1) && (_prevIndex === 0) && !fromThumb) {
                    _prev = true;
                    _next = false;
                }
            }

            if (_prev) {

                //prevslide
                utils.addClass(this.___slide[index], 'lg-prev-slide');
                utils.addClass(this.___slide[_prevIndex], 'lg-next-slide');
            } else if (_next) {

                // next slide
                utils.addClass(this.___slide[index], 'lg-next-slide');
                utils.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
            }

            // give 50 ms for browser to add/remove class
            setTimeout(function() {
                utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');

                //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                utils.addClass(_this.___slide[index], 'lg-current');

                // reset all transitions
                utils.removeClass(_this.outer, 'lg-no-trans');
            }, 50);
        } else {

            var touchPrev = index - 1;
            var touchNext = index + 1;

            if ((index === 0) && (_prevIndex === _length - 1)) {

                // next slide
                touchNext = 0;
                touchPrev = _length - 1;
            } else if ((index === _length - 1) && (_prevIndex === 0)) {

                // prev slide
                touchNext = 0;
                touchPrev = _length - 1;
            }

            utils.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
            utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
            utils.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
            utils.addClass(_this.___slide[touchPrev], 'lg-prev-slide');
            utils.addClass(_this.___slide[touchNext], 'lg-next-slide');
            utils.addClass(_this.___slide[index], 'lg-current');
        }

        if (_this.lGalleryOn) {
            setTimeout(function() {
                _this.loadContent(index, true, 0);
            }, this.s.speed + 50);

            setTimeout(function() {
                _this.lgBusy = false;
                utils.trigger(_this.el, 'onAfterSlide', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb
                });
            }, this.s.speed);

        } else {
            _this.loadContent(index, true, _this.s.backdropDuration);

            _this.lgBusy = false;
            utils.trigger(_this.el, 'onAfterSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
            });
        }

        _this.lGalleryOn = true;

        if (this.s.counter) {
            if (document.getElementById('lg-counter-current')) {
                document.getElementById('lg-counter-current').innerHTML = index + 1;
            }
        }

    }

};

/**
 *  @desc Go to next slide
 *  @param {Boolean} fromTouch - true if slide function called via touch event
 */
Plugin.prototype.goToNextSlide = function(fromTouch) {
    var _this = this;
    if (!_this.lgBusy) {
        if ((_this.index + 1) < _this.___slide.length) {
            _this.index++;
            utils.trigger(_this.el, 'onBeforeNextSlide', {
                index: _this.index
            });
            _this.slide(_this.index, fromTouch, false);
        } else {
            if (_this.s.loop) {
                _this.index = 0;
                utils.trigger(_this.el, 'onBeforeNextSlide', {
                    index: _this.index
                });
                _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
                utils.addClass(_this.outer, 'lg-right-end');
                setTimeout(function() {
                    utils.removeClass(_this.outer, 'lg-right-end');
                }, 400);
            }
        }
    }
};

/**
 *  @desc Go to previous slide
 *  @param {Boolean} fromTouch - true if slide function called via touch event
 */
Plugin.prototype.goToPrevSlide = function(fromTouch) {
    var _this = this;
    if (!_this.lgBusy) {
        if (_this.index > 0) {
            _this.index--;
            utils.trigger(_this.el, 'onBeforePrevSlide', {
                index: _this.index,
                fromTouch: fromTouch
            });
            _this.slide(_this.index, fromTouch, false);
        } else {
            if (_this.s.loop) {
                _this.index = _this.items.length - 1;
                utils.trigger(_this.el, 'onBeforePrevSlide', {
                    index: _this.index,
                    fromTouch: fromTouch
                });
                _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
                utils.addClass(_this.outer, 'lg-left-end');
                setTimeout(function() {
                    utils.removeClass(_this.outer, 'lg-left-end');
                }, 400);
            }
        }
    }
};

Plugin.prototype.keyPress = function() {
    var _this = this;
    if (this.items.length > 1) {
        utils.on(window, 'keyup.lg', function(e) {
            if (_this.items.length > 1) {
                if (e.keyCode === 37) {
                    e.preventDefault();
                    _this.goToPrevSlide();
                }

                if (e.keyCode === 39) {
                    e.preventDefault();
                    _this.goToNextSlide();
                }
            }
        });
    }

    utils.on(window, 'keydown.lg', function(e) {
        if (_this.s.escKey === true && e.keyCode === 27) {
            e.preventDefault();
            if (!utils.hasClass(_this.outer, 'lg-thumb-open')) {
                _this.destroy();
            } else {
                utils.removeClass(_this.outer, 'lg-thumb-open');
            }
        }
    });
};

Plugin.prototype.arrow = function() {
    var _this = this;
    utils.on(this.outer.querySelector('.lg-prev'), 'click.lg', function() {
        _this.goToPrevSlide();
    });

    utils.on(this.outer.querySelector('.lg-next'), 'click.lg', function() {
        _this.goToNextSlide();
    });
};

Plugin.prototype.arrowDisable = function(index) {

    // Disable arrows if s.hideControlOnEnd is true
    if (!this.s.loop && this.s.hideControlOnEnd) {
        let next = this.outer.querySelector('.lg-next');
        let prev = this.outer.querySelector('.lg-prev');
        if ((index + 1) < this.___slide.length) {
            next.removeAttribute('disabled');
            utils.removeClass(next, 'disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
            utils.addClass(next, 'disabled');
        }

        if (index > 0) {
            prev.removeAttribute('disabled');
            utils.removeClass(prev, 'disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
            utils.addClass(next, 'disabled');
        }
    }
};

Plugin.prototype.setTranslate = function(el, xValue, yValue) {
    // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
    if (this.s.useLeft) {
        el.style.left = xValue;
    } else {
        utils.setVendor(el, 'Transform', 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)');
    }
};

Plugin.prototype.touchMove = function(startCoords, endCoords) {

    var distance = endCoords - startCoords;

    if (Math.abs(distance) > 15) {
        // reset opacity and transition duration
        utils.addClass(this.outer, 'lg-dragging');

        // move current slide
        this.setTranslate(this.___slide[this.index], distance, 0);

        // move next and prev slide with current slide
        this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
        this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
    }
};

Plugin.prototype.touchEnd = function(distance) {
    var _this = this;

    // keep slide animation for any mode while dragg/swipe
    if (_this.s.mode !== 'lg-slide') {
        utils.addClass(_this.outer, 'lg-slide');
    }

    for (var i = 0; i < this.___slide.length; i++) {
        if (!utils.hasClass(this.___slide[i], 'lg-current') && !utils.hasClass(this.___slide[i], 'lg-prev-slide') && !utils.hasClass(this.___slide[i], 'lg-next-slide')) {
            this.___slide[i].style.opacity = '0';
        }
    }

    // set transition duration
    setTimeout(function() {
        utils.removeClass(_this.outer, 'lg-dragging');
        if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToNextSlide(true);
        } else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToPrevSlide(true);
        } else if (Math.abs(distance) < 5) {

            // Trigger click if distance is less than 5 pix
            utils.trigger(_this.el, 'onSlideClick');
        }

        for (var i = 0; i < _this.___slide.length; i++) {
            _this.___slide[i].removeAttribute('style');
        }
    });

    // remove slide class once drag/swipe is completed if mode is not slide
    setTimeout(function() {
        if (!utils.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
            utils.removeClass(_this.outer, 'lg-slide');
        }
    }, _this.s.speed + 100);

};

Plugin.prototype.enableSwipe = function() {
    var _this = this;
    var startCoords = 0;
    var endCoords = 0;
    var isMoved = false;

    if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {

        for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[i], 'touchstart.lg', function(e) {
                if (!utils.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
                    e.preventDefault();
                    _this.manageSwipeClass();
                    startCoords = e.targetTouches[0].pageX;
                }
            });
        }

        for (var j = 0; j < _this.___slide.length; j++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[j], 'touchmove.lg', function(e) {
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    e.preventDefault();
                    endCoords = e.targetTouches[0].pageX;
                    _this.touchMove(startCoords, endCoords);
                    isMoved = true;
                }
            });
        }

        for (var k = 0; k < _this.___slide.length; k++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[k], 'touchend.lg', function() {
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords - startCoords);
                    } else {
                        utils.trigger(_this.el, 'onSlideClick');
                    }
                }
            });
        }
    }

};

Plugin.prototype.enableDrag = function() {
    var _this = this;
    var startCoords = 0;
    var endCoords = 0;
    var isDraging = false;
    var isMoved = false;
    if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
        for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[i], 'mousedown.lg', function(e) {
                // execute only on .lg-object
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                        e.preventDefault();

                        if (!_this.lgBusy) {
                            _this.manageSwipeClass();
                            startCoords = e.pageX;
                            isDraging = true;

                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            _this.outer.scrollLeft += 1;
                            _this.outer.scrollLeft -= 1;

                            // *

                            utils.removeClass(_this.outer, 'lg-grab');
                            utils.addClass(_this.outer, 'lg-grabbing');

                            utils.trigger(_this.el, 'onDragstart');
                        }

                    }
                }
            });
        }

        utils.on(window, 'mousemove.lg', function(e) {
            if (isDraging) {
                isMoved = true;
                endCoords = e.pageX;
                _this.touchMove(startCoords, endCoords);
                utils.trigger(_this.el, 'onDragmove');
            }
        });

        utils.on(window, 'mouseup.lg', function(e) {
            if (isMoved) {
                isMoved = false;
                _this.touchEnd(endCoords - startCoords);
                utils.trigger(_this.el, 'onDragend');
            } else if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                utils.trigger(_this.el, 'onSlideClick');
            }

            // Prevent execution on click
            if (isDraging) {
                isDraging = false;
                utils.removeClass(_this.outer, 'lg-grabbing');
                utils.addClass(_this.outer, 'lg-grab');
            }
        });

    }
};

Plugin.prototype.manageSwipeClass = function() {
    var touchNext = this.index + 1;
    var touchPrev = this.index - 1;
    var length = this.___slide.length;
    if (this.s.loop) {
        if (this.index === 0) {
            touchPrev = length - 1;
        } else if (this.index === length - 1) {
            touchNext = 0;
        }
    }

    for (var i = 0; i < this.___slide.length; i++) {
        utils.removeClass(this.___slide[i], 'lg-next-slide');
        utils.removeClass(this.___slide[i], 'lg-prev-slide');
    }

    if (touchPrev > -1) {
        utils.addClass(this.___slide[touchPrev], 'lg-prev-slide');
    }

    utils.addClass(this.___slide[touchNext], 'lg-next-slide');
};

Plugin.prototype.mousewheel = function() {
    var _this = this;
    utils.on(_this.outer, 'mousewheel.lg', function(e) {

        if (!e.deltaY) {
            return;
        }

        if (e.deltaY > 0) {
            _this.goToPrevSlide();
        } else {
            _this.goToNextSlide();
        }

        e.preventDefault();
    });

};

Plugin.prototype.closeGallery = function() {

    var _this = this;
    var mousedown = false;
    utils.on(this.outer.querySelector('.lg-close'), 'click.lg', function() {
        _this.destroy();
    });

    if (_this.s.closable) {

        // If you drag the slide and release outside gallery gets close on chrome
        // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
        utils.on(_this.outer, 'mousedown.lg', function(e) {

            if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap')) {
                mousedown = true;
            } else {
                mousedown = false;
            }

        });

        utils.on(_this.outer, 'mouseup.lg', function(e) {

            if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap') && mousedown) {
                if (!utils.hasClass(_this.outer, 'lg-dragging')) {
                    _this.destroy();
                }
            }

        });

    }

};

Plugin.prototype.destroy = function(d) {

    var _this = this;

    if (!d) {
        utils.trigger(_this.el, 'onBeforeClose');
    }

    document.body.scrollTop = _this.prevScrollTop;
    document.documentElement.scrollTop = _this.prevScrollTop;

    /**
     * if d is false or undefined destroy will only close the gallery
     * plugins instance remains with the element
     *
     * if d is true destroy will completely remove the plugin
     */

    if (d) {
        if (!_this.s.dynamic) {
            // only when not using dynamic mode is $items a jquery collection

            for (var i = 0; i < this.items.length; i++) {
                utils.off(this.items[i], '.lg');
                utils.off(this.items[i], '.lgcustom');
            }
        }

        let lguid = _this.el.getAttribute('lg-uid');
        delete window.lgData[lguid];
        _this.el.removeAttribute('lg-uid');
    }

    // Unbind all events added by lightGallery
    utils.off(this.el, '.lgtm');

    // Distroy all lightGallery modules
    for (var key in window.lgModules) {
        if (_this.modules[key]) {
            _this.modules[key].destroy();
        }
    }

    this.lGalleryOn = false;

    clearTimeout(_this.hideBartimeout);
    this.hideBartimeout = false;
    utils.off(window, '.lg');
    utils.removeClass(document.body, 'lg-on');
    utils.removeClass(document.body, 'lg-from-hash');

    if (_this.outer) {
        utils.removeClass(_this.outer, 'lg-visible');
    }

    utils.removeClass(document.querySelector('.lg-backdrop'), 'in');
    setTimeout(function() {
        try {
            if (_this.outer) {
                _this.outer.parentNode.removeChild(_this.outer);
            }

            if (document.querySelector('.lg-backdrop')) {
                document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
            }

            if (!d) {
                utils.trigger(_this.el, 'onCloseAfter');
            }
        } catch (err) {}

    }, _this.s.backdropDuration + 50);
};

window.lightGallery = function(el, options) {
    if (!el) {
        return;
    }

    try {
        if (!el.getAttribute('lg-uid')) {
            let uid = 'lg' + window.lgData.uid++;
            window.lgData[uid] = new Plugin(el, options);
            el.setAttribute('lg-uid', uid);
        } else {
            try {
                window.lgData[el.getAttribute('lg-uid')].init();
            } catch (err) {
                console.error('lightGallery has not initiated properly');
            }
        }
    } catch (err) {
        console.error('lightGallery has not initiated properly');
    }
};
