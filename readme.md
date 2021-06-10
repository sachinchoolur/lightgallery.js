# lightgallery.js

![travis](https://travis-ci.org/sachinchoolur/lightgallery.js.svg?branch=master)
![bower](https://img.shields.io/bower/v/lightgallery.js.svg)
![npm](https://img.shields.io/npm/v/lightgallery.js.svg)

Full featured JavaScript lightbox gallery. No dependencies.

![lightgallery](https://raw.githubusercontent.com/sachinchoolur/lightgallery.js/gh-pages/lightgallery.png)



## Important notice

- lightgallery.js has been merged with [lightGallery](https://github.com/sachinchoolur/lightGallery). That means, v2 of lightgallery.js is https://www.lightgalleryjs.com/. if you have a lightgallery.js license, this is valid for [lightGallery](https://www.lightgalleryjs.com/) as well. But, since version 2.0 you need to pass the license key as a plugin option. If you alredy have a license, please contact me at contact@lightgallery.js for the license key
- Completely re-wrote from scratch in typescript 
- Moved all modules to the main repo for better maintainability.
- Dropped IE 8 and 9 support. Let me know if you still need support for IE 8 and 9. I’ll consider adding a plugin to add support if there is enough demand.
- [Website](https://www.lightgalleryjs.com/)
- [Docs](https://www.lightgalleryjs.com/docs/getting-started/)
- [Demos](https://www.lightgalleryjs.com/demos/inline/)


##### Any questions, ideas, suggestions about v2? please start a [discussion](https://github.com/sachinchoolur/lightGallery/discussions/988).

### New features
- Pinch to zoom
- Virtual slides
- Swipe to close
- Zoom from the origin
- Inline gallery
- Next-generation image formats support(webp, JPEG XL). etc
- Better customizability
- Better performance on mobile devices.
- Dynamically add, remove slides while the gallery is open
- Comment interface
- and much more.


### How to upgrade

To make the upgrade seamless, v2 follows the API structure as much as possible. But, few settings are removed and a lot of additional settings are added, the way we use public methods is changed slightly and few events are renamed. 

**Initialization** 
V2 doesn’t require jQuery as a dependancy.
```js
lightGallery(document.getElementById('lightgallery'), {
  plugins: [lgZoom, lgThumbnail,]
  speed: 500
  ... other settings
});
```

**Plugins**  To avoid polluting global scope, since v2 plugins has to be passed via settings.
```js
lightGallery(document.getElementById(‘’lightgallery), {
     plugins: [lgZoom, lgAutoplay, lgComment, lgFullscreen , lgHash, lgPager, lgRotate, lgShare, lgThumbnail, lgVideo] 
});
```
- Removed in-built support for Dailymotion VK. We Will be adding separate plugins for DailyMotion and VK support 
- Added Wistia support 
- HTML videos - Videos can be passed via data-video attribute instead of passing it via hidden div 
```HTML
data-video='{"source": [{"src":"/videos/video1.mp4", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}'
```
- Events are renamed - Please take a look at the [documentation](http://sachinchoolur.github.io/lightGallery/v2/docs/events/) 
- Few settings are added, removed, or renamed. 
Rather than listing down all the changes here, I’d recommend going through the current settings that you are using and compare them with the new documentation.   


--- 
--- 
---



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
* Rotate, flip images.
* Accessibility support.
* And many more.

## Browser support

lightgallery supports all major browsers including IE 9 and above.

## Installation

### Install with NPM

You can install `lightgallery.js` using the [npm](https://www.npmjs.com/) package manager.

```sh
npm install lightgallery.js
```

You can also find `lightgallery.js` on [Yarn](https://yarnpkg.com/) and [Bower](http://bower.io).
### Yarn
```sh
yarn add lightgallery.js
```
### Bower

```sh
bower install lightgallery.js --save
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
8. Rotate - [GItHub](https://github.com/sachinchoolur/lg-rotate.js) - [Docs](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-rotate)

License
---

#### Commercial license
If you want to use lightgallery.js to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. [Read more about the commercial license](https://www.lightgalleryjs.com/license/)

#### Open source license

If you are creating an open source application under a license compatible with the GNU GPL license v3, you may use this project under the terms of the GPLv3.

