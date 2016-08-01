
/*
 *@todo remove function from window and document. Update on and off functions
 */
window.getAttribute = function(label) {
    return window[label];
};

window.setAttribute = function(label, value) {
    window[label] = value;
};

document.getAttribute = function(label) {
    return document[label];
};

document.setAttribute = function(label, value) {
    document[label] = value;
};

var utils = {
    wrap: function(el, className) {
        if (!el) {
            return;
        }

        var wrapper = document.createElement('div');
        wrapper.className = className;
        el.parentNode.insertBefore(wrapper, el);
        el.parentNode.removeChild(el);
        wrapper.appendChild(el);
    },

    addClass: function(el, className) {
        if (!el) {
            return;
        }

        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    },

    removeClass: function(el, className) {
        if (!el) {
            return;
        }

        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },

    hasClass: function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }

        return false;
    },

    // ex Transform
    // ex TransitionTimingFunction
    setVendor: function(el, property, value) {
        if (!el) {
            return;
        }

        el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
        el.style['webkit' + property] = value;
        el.style['moz' + property] = value;
        el.style['ms' + property] = value;
        el.style['o' + property] = value;
    },

    trigger: function(el, event, detail = null) {
        if (!el) {
            return;
        }

        let customEvent = new CustomEvent(event, {
            detail: detail
        });
        el.dispatchEvent(customEvent);
    },

    Listener: {
        uid: 0
    },
    on: function(el, events, fn) {
        if (!el) {
            return;
        }

        events.split(' ').forEach(event => {
            var _id = el.getAttribute('lg-event-uid') || '';
            utils.Listener.uid++;
            _id += '&' + utils.Listener.uid;
            el.setAttribute('lg-event-uid', _id);
            utils.Listener[event + utils.Listener.uid] = fn;
            el.addEventListener(event.split('.')[0], fn, false);
        });
    },

    off: function(el, event) {
        if (!el) {
            return;
        }

        var _id = el.getAttribute('lg-event-uid');
        if (_id) {
            _id = _id.split('&');
            for (var i = 0; i < _id.length; i++) {
                if (_id[i]) {
                    var _event = event + _id[i];
                    if (_event.substring(0, 1) === '.') {
                        for (var key in utils.Listener) {
                            if (utils.Listener.hasOwnProperty(key)) {
                                if (key.split('.').indexOf(_event.split('.')[1]) > -1) {
                                    el.removeEventListener(key.split('.')[0], utils.Listener[key]);
                                    el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
                                    delete utils.Listener[key];
                                }
                            }
                        }
                    } else {
                        el.removeEventListener(_event.split('.')[0], utils.Listener[_event]);
                        el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
                        delete utils.Listener[_event];
                    }
                }
            }
        }
    },

    param: function(obj) {
        return Object.keys(obj).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        }).join('&');
    }
};

export
default utils;
