# lightgallery.js

![travis](https://travis-ci.org/sachinchoolur/lightgallery.js.svg?branch=master)
![bower](https://img.shields.io/bower/v/lightgallery.js.svg)
![npm](https://img.shields.io/npm/v/lightgallery.js.svg)

Full featured JavaScript lightbox gallery. No dependencies.

![lightgallery](https://raw.githubusercontent.com/sachinchoolur/lightgallery.js/gh-pages/lightgallery.png)

## Demo

* [lightgallery demo](https://sachinchoolur.github.io/lightgallery.js/)
* [Codepen demo](https://codepen.io/sachinchoolur/pen/qNyvGW)

## Main features

* Fully responsive.
* Modular architecture with built in plugins.
* Touch support for mobile devices.
* Mouse drag supports for desktops.
* Double-click/Double-tap to see actual size of the image.
* Animated thumbnails.
* Social media sharing.
* YouTube, Vimeo, Dailymotion, VK and HTML5 video support.
* 20+ Hardware-Accelerated CSS3 transitions.
* Dynamic mode.
* Full screen support.
* Supports zoom.
* Browser history API.
* Responsive images.
* HTML iframe support.
* Multiple instances on one page.
* Easily customizable via CSS (SCSS) and Settings.
* Smart image preloading and code optimization.
* Keyboard Navigation for desktop.
* Font icon support.
* And many more.

## Browser support

lightgallery supports all major browsers including IE 9 and above.

## Installation

### Install with Bower

You can install `lightgallery` using the [Bower](http://bower.io) package manager.

```sh
bower install lightgallery.js --save
```

### npm

You can also find `lightgallery` on [npm](https://www.npmjs.com/).

```sh
npm install lightgallery.js
```

### CDN

http://www.jsdelivr.com/projects/lightgallery.js

### Download from GitHub

You can also directly download lightgallery from GitHub.

## Include CSS and JavaScript files

First of all add lightgallery.css in the `<head>` of the document.

```html
<head>
    <link rel="stylesheet" href="css/lightgallery.css">
</head>
```

Then include `lightgallery.min.js` into your document.
If you want to include any lightgallery plugin you can include it after `lightgallery.min.js`.

```html
<body>
    ...

    <script src="js/lightgallery.min.js"></script>

    <!-- lightgallery plugins -->
    <script src="js/lg-thumbnail.min.js"></script>
    <script src="js/lg-fullscreen.min.js"></script>
</body>
```

Lightgallery also supports AMD, CommonJS and ES6 modules.
When you use AMD make sure that lightgallery.js is loaded before lightgallery modules.

```js
require(['./lightgallery.js'], function() {
    require(["./lg-zoom.js", "./lg-thumbnail.js"], function(){
        lightGallery(document.getElementById('lightgallery'));
    });
});
```

## The markup

lightgallery does not force you to use any kind of markup. You can use whatever markup you want.
But i suggest you to use the following markup.
[Here](https://sachinchoolur.github.io/lightgallery.js/demos/html-markup.html)
you can find the detailed examples of different kinds of markup.

```html
<div id="lightgallery">
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg">
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg">
    </a>
    ...
</div>
```

## Call the plugin

Finally you need to initiate the gallery by adding the following code.

```js
<script>
    lightGallery(document.getElementById('lightgallery'));
</script>
```

## Support lightgallery

If you like lightgallery please support the project by staring the repository or <a href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&ref_src=twsrc%5Etfw&text=lightgallery%20-%20Full%20featured%20%23javascript%20lightbox%20gallery%2C%20No%20%23jQuery%20-%20http%3A%2F%2Fbit.ly%2F2amlfJe" target="_blank">tweet</a> about this project.

## Resources

* [API Reference](https://sachinchoolur.github.io/lightgallery.js/docs/api.html)
* [Events](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#events)
* [Methods](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#methods)
* [Data Attributes](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#attributes)
* [Dynamic variables](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#dynamic)
* [Sass variables](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#sass)
* [Module API](https://sachinchoolur.github.io/lightgallery.js/docs/plugin-api.html)

## Demos

* Thumbnails
  * [Gallery with animated thumbnails](https://sachinchoolur.github.io/lightgallery.js/demos/)
  * [Gallery without animated thumbnails](https://sachinchoolur.github.io/lightgallery.js/demos/#normal-thumb)
* YouTube, Vimeo Video Gallery
  * [YouTube, Vimeo Video Gallery](https://sachinchoolur.github.io/lightgallery.js/demos/videos.html)
  * [Video Gallery Without Poster](https://sachinchoolur.github.io/lightgallery.js/demos/videos.html#video-without-poster)
  * [Video Player Parameters](https://sachinchoolur.github.io/lightgallery.js/demos/videos.html#video-player-param)
  * [Automatically load thumbnails](https://sachinchoolur.github.io/lightgallery.js/demos/videos.html#auto-thumb)
* HTML5 Video Gallery
  * [HTML5 Video Gallery](https://sachinchoolur.github.io/lightgallery.js/demos/html5-videos.html)
  * [HTML5 video gallery with videojs](https://sachinchoolur.github.io/lightgallery.js/demos/html5-videos.html#video-without-poster)
* [Transitions](https://sachinchoolur.github.io/lightgallery.js/demos/transitions.html)
* [Dynamic](https://sachinchoolur.github.io/lightgallery.js/demos/dynamic.html)
* [Events](https://sachinchoolur.github.io/lightgallery.js/demos/events.html)
* [Methods](https://sachinchoolur.github.io/lightgallery.js/demos/methods.html)
* [Iframe. External websites, Google map etc.](https://sachinchoolur.github.io/lightgallery.js/demos/iframe.html)
* [Captions](https://sachinchoolur.github.io/lightgallery.js/demos/captions.html)
* Responsive images
  * [Responsive images](https://sachinchoolur.github.io/lightgallery.js/demos/responsive.html)
  * [Responsive images with HTML5 srcset](https://sachinchoolur.github.io/lightgallery.js/demos/responsive.html#srcset-demo)
* [Gallery with fixed size](https://sachinchoolur.github.io/lightgallery.js/demos/fixed-size.html)
* [HTML Markup](https://sachinchoolur.github.io/lightgallery.js/demos/html-markup.html)
* [Facebook comments](https://sachinchoolur.github.io/lightgallery.js/demos/comment-box.html)
* [Easing](https://sachinchoolur.github.io/lightgallery.js/demos/easing.html)
* [History/hash plugin](https://sachinchoolur.github.io/lightgallery.js/demos/hash.html)
* [Social media share](https://sachinchoolur.github.io/lightgallery.js/demos/share.html)

## Built in modules

1. Thumbnail - [GItHub](https://github.com/sachinchoolur/lg-thumbnail.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-thumbnial)
2. Autoplay - [GItHub](https://github.com/sachinchoolur/lg-autoplay.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-autoplay)
3. Video - [GItHub](https://github.com/sachinchoolur/lg-video.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-video)
4. Fullscreen - [GItHub](https://github.com/sachinchoolur/lg-fullscreen.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-fullscreen)
5. Pager - [GItHub](https://github.com/sachinchoolur/lg-pager.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-pager)
6. Zoom - [GItHub](https://github.com/sachinchoolur/lg-zoom.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-zoom)
7. Hash - [GItHub](https://github.com/sachinchoolur/lg-hash.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-hash)
8. Share - [GItHub](https://github.com/sachinchoolur/lg-share.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-share)

License
---

#### Commercial license
If you want to use lightgallery.js to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a lightgallery.js Commercial License at [uplabs.com/posts/lightgallery-js](https://www.uplabs.com/posts/lightgallery-js)

#### Open source license

If you are creating an open source application under a license compatible with the GNU GPL license v3, you may use this project under the terms of the GPLv3.

