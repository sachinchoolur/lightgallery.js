/**!
 * lg-zoom.js | 1.3.0-beta.0 | October 5th 2020
 * http://sachinchoolur.github.io/lg-zoom.js
 * Copyright (c) 2016 Sachin N; 
 * @license GPLv3 
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgZoom = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.lgZoom = mod.exports;
    }
})(this, function () {
    'use strict';

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var getUseLeft = function getUseLeft() {
        var useLeft = false;
        var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        if (isChrome && parseInt(isChrome[2], 10) < 54) {
            useLeft = true;
        }

        return useLeft;
    };

    var zoomDefaults = {
        scale: 1,
        zoom: true,
        actualSize: true,
        enableZoomAfter: 300,
        useLeftForZoom: getUseLeft()
    };

    var Zoom = function Zoom(element) {

        this.el = element;

        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = _extends({}, zoomDefaults, this.core.s);

        if (this.core.s.zoom && this.core.doCss()) {
            this.init();

            // Store the zoomable timeout value just to clear it while closing
            this.zoomabletimeout = false;

            // Set the initial value center
            this.pageX = window.innerWidth / 2;
            this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
        }

        return this;
    };

    Zoom.prototype.init = function () {

        var _this = this;
        var zoomIcons = '<button type="button" aria-label="Zoom in" id="lg-zoom-in" class="lg-icon"></button><button type="button" aria-label="Zoom out" id="lg-zoom-out" class="lg-icon"></button>';

        if (_this.core.s.actualSize) {
            zoomIcons += '<button type="button" aria-label="Actual size" id="lg-actual-size" class="lg-icon"></button>';
        }

        if (_this.core.s.useLeftForZoom) {
            utils.addClass(_this.core.outer, 'lg-use-left-for-zoom');
        } else {
            utils.addClass(_this.core.outer, 'lg-use-transition-for-zoom');
        }

        this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', zoomIcons);

        // Add zoomable class
        utils.on(_this.core.el, 'onSlideItemLoad.lgtmzoom', function (event) {

            // delay will be 0 except first time
            var _speed = _this.core.s.enableZoomAfter + event.detail.delay;

            // set _speed value 0 if gallery opened from direct url and if it is first slide
            if (utils.hasClass(document.body, 'lg-from-hash') && event.detail.delay) {

                // will execute only once
                _speed = 0;
            } else {

                // Remove lg-from-hash to enable starting animation.
                utils.removeClass(document.body, 'lg-from-hash');
            }

            _this.zoomabletimeout = setTimeout(function () {
                utils.addClass(_this.core.___slide[event.detail.index], 'lg-zoomable');
            }, _speed + 30);
        });

        var scale = 1;
        /**
         * @desc Image zoom
         * Translate the wrap and scale the image to get better user experience
         *
         * @param {String} scaleVal - Zoom decrement/increment value
         */
        var zoom = function zoom(scaleVal) {

            var image = _this.core.outer.querySelector('.lg-current .lg-image');
            var _x;
            var _y;

            // Find offset manually to avoid issue after zoom
            var offsetX = (window.innerWidth - image.clientWidth) / 2;
            var offsetY = (window.innerHeight - image.clientHeight) / 2 + (document.documentElement.scrollTop || document.body.scrollTop);

            _x = _this.pageX - offsetX;
            _y = _this.pageY - offsetY;

            var x = (scaleVal - 1) * _x;
            var y = (scaleVal - 1) * _y;

            utils.setVendor(image, 'Transform', 'scale3d(' + scaleVal + ', ' + scaleVal + ', 1)');
            image.setAttribute('data-scale', scaleVal);

            if (_this.core.s.useLeftForZoom) {
                image.parentElement.style.left = -x + 'px';
                image.parentElement.style.top = -y + 'px';
            } else {
                utils.setVendor(image.parentElement, 'Transform', 'translate3d(-' + x + 'px, -' + y + 'px, 0)');
            }

            image.parentElement.setAttribute('data-x', x);
            image.parentElement.setAttribute('data-y', y);
        };

        var callScale = function callScale() {
            if (scale > 1) {
                utils.addClass(_this.core.outer, 'lg-zoomed');
            } else {
                _this.resetZoom();
            }

            if (scale < 1) {
                scale = 1;
            }

            zoom(scale);
        };

        var actualSize = function actualSize(event, image, index, fromIcon) {
            var w = image.clientWidth;
            var nw;
            if (_this.core.s.dynamic) {
                nw = _this.core.s.dynamicEl[index].width || image.naturalWidth || w;
            } else {
                nw = _this.core.items[index].getAttribute('data-width') || image.naturalWidth || w;
            }

            var _scale;

            if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                scale = 1;
            } else {
                if (nw > w) {
                    _scale = nw / w;
                    scale = _scale || 2;
                }
            }

            if (fromIcon) {
                _this.pageX = window.innerWidth / 2;
                _this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
            } else {
                _this.pageX = event.pageX || event.targetTouches[0].pageX;
                _this.pageY = event.pageY || event.targetTouches[0].pageY;
            }

            callScale();
            setTimeout(function () {
                utils.removeClass(_this.core.outer, 'lg-grabbing');
                utils.addClass(_this.core.outer, 'lg-grab');
            }, 10);
        };

        var tapped = false;

        // event triggered after appending slide content
        utils.on(_this.core.el, 'onAferAppendSlide.lgtmzoom', function (event) {

            var index = event.detail.index;

            // Get the current element
            var image = _this.core.___slide[index].querySelector('.lg-image');

            if (!_this.core.isTouch) {
                utils.on(image, 'dblclick', function (event) {
                    actualSize(event, image, index);
                });
            }

            if (_this.core.isTouch) {
                utils.on(image, 'touchstart', function (event) {
                    if (!tapped) {
                        tapped = setTimeout(function () {
                            tapped = null;
                        }, 300);
                    } else {
                        clearTimeout(tapped);
                        tapped = null;
                        actualSize(event, image, index);
                    }

                    event.preventDefault();
                });
            }
        });

        // Update zoom on resize and orientationchange
        utils.on(window, 'resize.lgzoom scroll.lgzoom orientationchange.lgzoom', function () {
            _this.pageX = window.innerWidth / 2;
            _this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
            zoom(scale);
        });

        utils.on(document.getElementById('lg-zoom-out'), 'click.lg', function () {
            if (_this.core.outer.querySelector('.lg-current .lg-image')) {
                scale -= _this.core.s.scale;
                callScale();
            }
        });

        utils.on(document.getElementById('lg-zoom-in'), 'click.lg', function () {
            if (_this.core.outer.querySelector('.lg-current .lg-image')) {
                scale += _this.core.s.scale;
                callScale();
            }
        });

        utils.on(document.getElementById('lg-actual-size'), 'click.lg', function (event) {
            actualSize(event, _this.core.___slide[_this.core.index].querySelector('.lg-image'), _this.core.index, true);
        });

        // Reset zoom on slide change
        utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
            scale = 1;
            _this.resetZoom();
        });

        // Drag option after zoom
        if (!_this.core.isTouch) {
            _this.zoomDrag();
        }

        if (_this.core.isTouch) {
            _this.zoomSwipe();
        }
    };

    Zoom.prototype.getModifier = function (rotateValue, axis, el) {
        var originalRotate = rotateValue;
        rotateValue = Math.abs(rotateValue);
        var transformValues = this.getCurrentTransform(el);
        if (!transformValues) {
            return 1;
        }
        var modifier = 1;
        if (axis === 'X') {
            var flipHorizontalValue = Math.sign(parseFloat(transformValues[0]));
            if (rotateValue === 0 || rotateValue === 180) {
                modifier = 1;
            } else if (rotateValue === 90) {
                if (originalRotate === -90 && flipHorizontalValue === 1 || originalRotate === 90 && flipHorizontalValue === -1) {
                    modifier = -1;
                } else {
                    modifier = 1;
                }
            }
            modifier = modifier * flipHorizontalValue;
        } else {
            var flipVerticalValue = Math.sign(parseFloat(transformValues[3]));
            if (rotateValue === 0 || rotateValue === 180) {
                modifier = 1;
            } else if (rotateValue === 90) {
                var sinX = parseFloat(transformValues[1]);
                var sinMinusX = parseFloat(transformValues[2]);
                modifier = Math.sign(sinX * sinMinusX * originalRotate * flipVerticalValue);
            }
            modifier = modifier * flipVerticalValue;
        }
        return modifier;
    };

    Zoom.prototype.getImageSize = function ($image, rotateValue, axis) {
        var imageSizes = {
            y: 'offsetHeight',
            x: 'offsetWidth'
        };
        if (rotateValue === 90) {
            // Swap axis 
            if (axis === 'x') {
                axis = 'y';
            } else {
                axis = 'x';
            }
        }
        return $image[imageSizes[axis]];
    };

    Zoom.prototype.getDragCords = function (e, rotateValue) {
        if (rotateValue === 90) {
            return {
                x: e.pageY,
                y: e.pageX
            };
        } else {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
    };
    Zoom.prototype.getSwipeCords = function (e, rotateValue) {
        var x = e.targetTouches[0].pageX;
        var y = e.targetTouches[0].pageY;
        if (rotateValue === 90) {
            return {
                x: y,
                y: x
            };
        } else {
            return {
                x: x,
                y: y
            };
        }
    };

    Zoom.prototype.getPossibleDragCords = function ($image, rotateValue) {

        var minY = (this.core.outer.querySelector('.lg').clientHeight - this.getImageSize($image, rotateValue, 'y')) / 2;
        var maxY = Math.abs(this.getImageSize($image, rotateValue, 'y') * Math.abs($image.getAttribute('data-scale')) - this.core.outer.querySelector('.lg').clientHeight + minY);
        var minX = (this.core.outer.querySelector('.lg').clientWidth - this.getImageSize($image, rotateValue, 'x')) / 2;
        var maxX = Math.abs(this.getImageSize($image, rotateValue, 'x') * Math.abs($image.getAttribute('data-scale')) - this.core.outer.querySelector('.lg').clientWidth + minX);
        if (rotateValue === 90) {
            return {
                minY: minX,
                maxY: maxX,
                minX: minY,
                maxX: maxY
            };
        } else {
            return {
                minY: minY,
                maxY: maxY,
                minX: minX,
                maxX: maxX
            };
        }
    };

    Zoom.prototype.getDragAllowedAxises = function ($image, rotateValue) {
        var allowY = this.getImageSize($image, rotateValue, 'y') * $image.getAttribute('data-scale') > this.core.outer.querySelector('.lg').clientHeight;
        var allowX = this.getImageSize($image, rotateValue, 'x') * $image.getAttribute('data-scale') > this.core.outer.querySelector('.lg').clientWidth;
        if (rotateValue === 90) {
            return {
                allowX: allowY,
                allowY: allowX
            };
        } else {
            return {
                allowX: allowX,
                allowY: allowY
            };
        }
    };

    /**
     * 
     * @param {Element} el 
     * @return matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);
     * Get the current transform value
     */
    Zoom.prototype.getCurrentTransform = function (el) {
        if (!el) {
            return 0;
        }
        var st = window.getComputedStyle(el, null);
        var tm = st.getPropertyValue('-webkit-transform') || st.getPropertyValue('-moz-transform') || st.getPropertyValue('-ms-transform') || st.getPropertyValue('-o-transform') || st.getPropertyValue('transform') || 'none';
        if (tm !== 'none') {
            return tm.split('(')[1].split(')')[0].split(',');
        }
        return 0;
    };

    Zoom.prototype.getCurrentRotation = function (el) {
        if (!el) {
            return 0;
        }
        var values = this.getCurrentTransform(el);
        if (values) {
            return Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
            // If you want rotate in 360
            //return (angle < 0 ? angle + 360 : angle);
        }
        return 0;
    };

    // Reset zoom effect
    Zoom.prototype.resetZoom = function () {
        utils.removeClass(this.core.outer, 'lg-zoomed');
        for (var i = 0; i < this.core.___slide.length; i++) {
            if (this.core.___slide[i].querySelector('.lg-img-wrap')) {
                this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('style');
                this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-x');
                this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-y');
            }
        }

        for (var j = 0; j < this.core.___slide.length; j++) {
            if (this.core.___slide[j].querySelector('.lg-image')) {
                this.core.___slide[j].querySelector('.lg-image').removeAttribute('style');
                this.core.___slide[j].querySelector('.lg-image').removeAttribute('data-scale');
            }
        }

        // Reset pagx pagy values to center
        this.pageX = window.innerWidth / 2;
        this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
    };

    Zoom.prototype.zoomSwipe = function () {
        var _this = this;
        var startCoords = {};
        var endCoords = {};
        var isMoved = false;

        // Allow x direction drag
        var allowX = false;

        // Allow Y direction drag
        var allowY = false;

        var rotateValue = 0;
        var rotateEl;

        for (var i = 0; i < _this.core.___slide.length; i++) {

            /*jshint loopfunc: true */
            utils.on(_this.core.___slide[i], 'touchstart.lg', function (e) {

                if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                    var $image = _this.core.___slide[_this.core.index].querySelector('.lg-object');

                    rotateEl = _this.core.___slide[_this.core.index].querySelector('.lg-img-rotate');
                    rotateValue = _this.getCurrentRotation(rotateEl);

                    var dragAllowedAxises = _this.getDragAllowedAxises($image, Math.abs(rotateValue));
                    allowY = dragAllowedAxises.allowY;
                    allowX = dragAllowedAxises.allowX;

                    if (allowX || allowY) {
                        e.preventDefault();
                        startCoords = _this.getSwipeCords(e, Math.abs(rotateValue));
                    }
                }
            });
        }

        for (var j = 0; j < _this.core.___slide.length; j++) {

            /*jshint loopfunc: true */
            utils.on(_this.core.___slide[j], 'touchmove.lg', function (e) {

                if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {

                    var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
                    var distanceX;
                    var distanceY;

                    e.preventDefault();
                    isMoved = true;

                    endCoords = _this.getSwipeCords(e, Math.abs(rotateValue));

                    // reset opacity and transition duration
                    utils.addClass(_this.core.outer, 'lg-zoom-dragging');

                    if (allowY) {
                        distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y) * _this.getModifier(rotateValue, 'Y', rotateEl);
                    } else {
                        distanceY = -Math.abs(_el.getAttribute('data-y'));
                    }

                    if (allowX) {
                        distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x) * _this.getModifier(rotateValue, 'X', rotateEl);
                    } else {
                        distanceX = -Math.abs(_el.getAttribute('data-x'));
                    }

                    if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {

                        if (_this.core.s.useLeftForZoom) {
                            _el.style.left = distanceX + 'px';
                            _el.style.top = distanceY + 'px';
                        } else {
                            utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                        }
                    }
                }
            });
        }

        for (var k = 0; k < _this.core.___slide.length; k++) {

            /*jshint loopfunc: true */
            utils.on(_this.core.___slide[k], 'touchend.lg', function () {
                if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                    if (isMoved) {
                        isMoved = false;
                        utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
                        _this.touchendZoom(startCoords, endCoords, allowX, allowY, rotateValue);
                    }
                }
            });
        }
    };

    Zoom.prototype.zoomDrag = function () {

        var _this = this;
        var startCoords = {};
        var endCoords = {};
        var isDraging = false;
        var isMoved = false;

        // Allow x direction drag
        var allowX = false;

        // Allow Y direction drag
        var allowY = false;

        var rotateValue = 0;
        var rotateEl;

        for (var i = 0; i < _this.core.___slide.length; i++) {

            /*jshint loopfunc: true */
            utils.on(_this.core.___slide[i], 'mousedown.lgzoom', function (e) {

                // execute only on .lg-object
                var $image = _this.core.___slide[_this.core.index].querySelector('.lg-object');

                rotateEl = _this.core.___slide[_this.core.index].querySelector('.lg-img-rotate');
                rotateValue = _this.getCurrentRotation(rotateEl);

                var dragAllowedAxises = _this.getDragAllowedAxises($image, Math.abs(rotateValue));
                allowY = dragAllowedAxises.allowY;
                allowX = dragAllowedAxises.allowX;

                if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                    if (utils.hasClass(e.target, 'lg-object') && (allowX || allowY)) {
                        e.preventDefault();
                        startCoords = _this.getDragCords(e, Math.abs(rotateValue));

                        isDraging = true;

                        // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                        _this.core.outer.scrollLeft += 1;
                        _this.core.outer.scrollLeft -= 1;

                        utils.removeClass(_this.core.outer, 'lg-grab');
                        utils.addClass(_this.core.outer, 'lg-grabbing');
                    }
                }
            });
        }

        utils.on(window, 'mousemove.lgzoom', function (e) {
            if (isDraging) {
                var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
                var distanceX;
                var distanceY;

                isMoved = true;
                endCoords = _this.getDragCords(e, Math.abs(rotateValue));

                // reset opacity and transition duration
                utils.addClass(_this.core.outer, 'lg-zoom-dragging');

                if (allowY) {
                    distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y) * _this.getModifier(rotateValue, 'Y', rotateEl);
                } else {
                    distanceY = -Math.abs(_el.getAttribute('data-y'));
                }

                if (allowX) {
                    distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x) * _this.getModifier(rotateValue, 'X', rotateEl);
                } else {
                    distanceX = -Math.abs(_el.getAttribute('data-x'));
                }

                if (_this.core.s.useLeftForZoom) {
                    _el.style.left = distanceX + 'px';
                    _el.style.top = distanceY + 'px';
                } else {
                    utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                }
            }
        });

        utils.on(window, 'mouseup.lgzoom', function (e) {

            if (isDraging) {
                isDraging = false;
                utils.removeClass(_this.core.outer, 'lg-zoom-dragging');

                // Fix for chrome mouse move on click
                if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
                    endCoords = _this.getDragCords(e, Math.abs(rotateValue));
                    _this.touchendZoom(startCoords, endCoords, allowX, allowY, rotateValue);
                }

                isMoved = false;
            }

            utils.removeClass(_this.core.outer, 'lg-grabbing');
            utils.addClass(_this.core.outer, 'lg-grab');
        });
    };

    Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY, rotateValue) {

        var _this = this;
        var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
        var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
        var rotateEl = _this.core.___slide[_this.core.index].querySelector('.lg-img-rotate');
        var distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x) * _this.getModifier(rotateValue, 'X', rotateEl);
        var distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y) * _this.getModifier(rotateValue, 'Y', rotateEl);
        var possibleDragCords = _this.getPossibleDragCords(image, Math.abs(rotateValue));

        if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
            if (allowY) {
                if (distanceY <= -possibleDragCords.maxY) {
                    distanceY = -possibleDragCords.maxY;
                } else if (distanceY >= -possibleDragCords.minY) {
                    distanceY = -possibleDragCords.minY;
                }
            }

            if (allowX) {
                if (distanceX <= -possibleDragCords.maxX) {
                    distanceX = -possibleDragCords.maxX;
                } else if (distanceX >= -possibleDragCords.minX) {
                    distanceX = -possibleDragCords.minX;
                }
            }

            if (allowY) {
                _el.setAttribute('data-y', Math.abs(distanceY));
            } else {
                distanceY = -Math.abs(_el.getAttribute('data-y'));
            }

            if (allowX) {
                _el.setAttribute('data-x', Math.abs(distanceX));
            } else {
                distanceX = -Math.abs(_el.getAttribute('data-x'));
            }

            if (_this.core.s.useLeftForZoom) {
                _el.style.left = distanceX + 'px';
                _el.style.top = distanceY + 'px';
            } else {
                utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
            }
        }
    };

    Zoom.prototype.destroy = function () {

        var _this = this;

        // Unbind all events added by lightGallery zoom plugin
        utils.off(_this.core.el, '.lgzoom');
        utils.off(window, '.lgzoom');
        for (var i = 0; i < _this.core.___slide.length; i++) {
            utils.off(_this.core.___slide[i], '.lgzoom');
        }

        utils.off(_this.core.el, '.lgtmzoom');
        _this.resetZoom();
        clearTimeout(_this.zoomabletimeout);
        _this.zoomabletimeout = false;
    };

    window.lgModules.zoom = Zoom;
});

},{}]},{},[1])(1)
});
