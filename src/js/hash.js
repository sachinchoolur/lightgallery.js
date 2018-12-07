var hashDefaults = {
    hash: true
};
var Hash = function(element) {
    this.el = element;
    this.core = window.lgData[this.el.getAttribute('lg-uid')];
    this.core.s = Object.assign({}, hashDefaults, this.core.s);
    if (this.core.s.hash) {
        this.oldHash = window.location.hash;
        this.init();
    }

    return this;
};

Hash.prototype.init = function() {
    var _this = this;
    var _hash;

    // Change hash value on after each slide transition
    utils.on(_this.core.el, 'onAfterSlide.lgtm', function(event) {
        window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + event.detail.index;
    });

    // Listen hash change and change the slide according to slide value
    utils.on(window, 'hashchange.lghash', function() {
        _hash = window.location.hash;
        var _idx = parseInt(_hash.split('&slide=')[1], 10);

        // it galleryId doesn't exist in the url close the gallery
        if ((_hash.indexOf('lg=' + _this.core.s.galleryId) > -1)) {
            _this.core.slide(_idx, false, false);
        } else if (_this.core.lGalleryOn) {
            _this.core.destroy();
        }
    });
};

Hash.prototype.destroy = function() {
    if (!this.core.s.hash) {
        return;
    }

    // Reset to old hash value
    if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
        window.location.hash = this.oldHash;
    } else {
        if (history.pushState) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        } else {
            window.location.hash = '';
        }
    }

    utils.off(this.core.el, '.lghash');
};

window.lgModules.hash = Hash;
