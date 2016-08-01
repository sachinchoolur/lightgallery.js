![travis](https://travis-ci.org/sachinchoolur/lightgallery.js.svg?branch=master)
![bower](https://img.shields.io/bower/v/lightgallery.js.svg)
![npm](https://img.shields.io/npm/v/lightgallery.js.svg)

# lightGallery
Full featured javascript lightbox gallery. No dependencies.
![lightgallery](https://raw.githubusercontent.com/sachinchoolur/lightgallery.js/gh-pages/lightgallery.png)
Demo
---
[lightGallery demo](http://sachinchoolur.github.io/lightgallery.js/). [Codepen demo](http://codepen.io/sachinchoolur/pen/qNyvGW) 

Main features
---

* Fully responsive.
* Modular architecture with built in plugins.
* Touch and support for mobile devices.
* Mouse drag supports for desktops.
* Double-click/Double-tap to see actual size of the image.
* Animated thumbnails.
* Social media sharing.
* Youtube Vimeo Dailymotion VK and html5 videos Support.
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
 
Browser support
---
lightgallery supports all major browsers including IE 9 and above..


Installation
---
#### Install with Bower

You can install ```lightgallery``` using the [Bower](http://bower.io) package manager.

```sh
$ bower install lightgallery.js --save
```

#### npm

You can also find ```lightgallery``` on [npm](http://npmjs.org).

```sh
$ npm install lightgallery.js
```
#### Download from Github

You can also directly download lightgallery from github.


#### Include CSS and Javascript files
First of all add lightgallery.css in the &lt;head&gt; of the document.
``` html
<head>
    <link type="text/css" rel="stylesheet" href="css/lightgallery.css" /> 
</head>
```
Then include lightgallery.min.js into your document.
If you want to include any lightgallery plugin you can include it after lightgallery.min.js.
``` html
<body>
    ....

    <script src="js/lightgallery.min.js"></script>

    <!-- lightgallery plugins -->
    <script src="js/lg-thumbnail.min.js"></script>
    <script src="js/lg-fullscreen.min.js"></script>
</body>  
```

Lightgallery also supports AMD, CommonJS and ES6 modules 
When you use AMD make sure that lightgallery.js is loaded berfore lightgallery modules.
``` javascript
  require(['./lightgallery'], function() {
    require(["./lg-zoom", "./lg-thumbnail"], function(){
        lightGallery(document.getElementById('lightgallery')); 
    });
  });
``` 
##### The markup
lightgallery does not force you to use any kind of markup. you can use whatever markup you want. But i suggest you to use the following markup. [Here](http://sachinchoolur.github.io/lightgallery.js/demos/html-markup.html) you can find the detailed examples of deferent kind of markups.
``` html
<div id="lightgallery">
  <a href="img/img1.jpg">
      <img src="img/thumb1.jpg" />
  </a>
  <a href="img/img2.jpg">
      <img src="img/thumb2.jpg" />
  </a>
  ...
</div>
```
#### Call the plugin
Finally you need to initiate the gallery by adding the following code.
``` javascript
<script type="text/javascript">
    lightGallery(document.getElementById('lightgallery')); 
</script>
```

#### Support lightgallery
If you like lightgallery please support the project by staring the repository or <a href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&ref_src=twsrc%5Etfw&text=lightgallery%20-%20Full%20featured%20%23javascript%20lightbox%20gallery%2C%20No%20%23jQuery%20-%20http%3A%2F%2Fbit.ly%2F2amlfJe" target="_blank">tweet</a> about this project.


Resources
----
* [API Reference](http://sachinchoolur.github.io/lightgallery.js/docs/api.html)
* [Events](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#events)
* [Methods](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#methods)
* [Data Attributes](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#attributes)
* [Dynamic variables](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#dynamic)
* [Sass variables](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#sass)
* [Module API](http://sachinchoolur.github.io/lightgallery.js/docs/plugin-api.html)

Demos 
----
* Thumbnails
  * [Gallery with animated thumbnails](http://sachinchoolur.github.io/lightgallery.js/demos/) 
  * [Gallery without animated thumbnails](http://sachinchoolur.github.io/lightgallery.js/demos/#normal-thumb) 
* Youtube, Vimeo Video Gallery
  * [Youtube, Vimeo Video Gallery](http://sachinchoolur.github.io/lightgallery.js/demos/videos.html)
  * [Video Gallery Without Poster](http://sachinchoolur.github.io/lightgallery.js/demos/videos.html#video-without-poster)
  * [Video Player Parameters](http://sachinchoolur.github.io/lightgallery.js/demos/videos.html#video-player-param)
  * [Automatically load thumbnails](http://sachinchoolur.github.io/lightgallery.js/demos/videos.html#auto-thumb)
* Html5 Video Gallery
  * [Html5 Video Gallery](http://sachinchoolur.github.io/lightgallery.js/demos/html5-videos.html)
  * [Html5 video gallery with videojs](http://sachinchoolur.github.io/lightgallery.js/demos/html5-videos.html#video-without-poster)
* [Transitions](http://sachinchoolur.github.io/lightgallery.js/demos/transitions.html)
* [Dynamic](http://sachinchoolur.github.io/lightgallery.js/demos/dynamic.html)
* [Events](http://sachinchoolur.github.io/lightgallery.js/demos/events.html)
* [Methods](http://sachinchoolur.github.io/lightgallery.js/demos/methods.html)
* [Iframe. External websites, Google map etc..](http://sachinchoolur.github.io/lightgallery.js/demos/iframe.html)
* [Captions](http://sachinchoolur.github.io/lightgallery.js/demos/captions.html)
* Responsive images
  * [Responsive images](http://sachinchoolur.github.io/lightgallery.js/demos/responsive.html)
  * [Responsive images with html5 srcset](http://sachinchoolur.github.io/lightgallery.js/demos/responsive.html#srcset-demo)
* [Gallery with fixed size](http://sachinchoolur.github.io/lightgallery.js/demos/fixed-size.html)
* [Html Markup](http://sachinchoolur.github.io/lightgallery.js/demos/html-markup.html)
* [Facebook comments](http://sachinchoolur.github.io/lightgallery.js/demos/comment-box.html)
* [Easing](http://sachinchoolur.github.io/lightgallery.js/demos/easing.html)
* [History/hash plugin](http://sachinchoolur.github.io/lightgallery.js/demos/hash.html)
* [Social media share](http://sachinchoolur.github.io/lightgallery.js/demos/share.html)

Built in modules
----
1. [Thumbnail](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-thumbnial)
2. [Autoplay](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-autoplay)
3. [Video](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-video)
4. [Fullscreen](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-fullscreen)
5. [Pager](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-pager)
6. [Zoom](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-zoom)
7. [Hash](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-hash)
7. [Share](http://sachinchoolur.github.io/lightgallery.js/docs/api.html#lg-share)

Support
----
Please use GitHub [issue tracker](https://github.com/sachinchoolur/lightgallery.js/issues/new) in the event that you have come across a bug or glitch. It would also be very helpful if you could add a jsFiddle, which would allow you to demonstrate the problem in question.


Please use [stackoverflow](https://stackoverflow.com/search?q=lightgallery) instead of github issue tracker if you need any help with implementing lightgallery in your project or if you have any personal support requests.

Do you like lightgallery? You can support the project by staring the github repository or [tweet](https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&ref_src=twsrc%5Etfw&text=lightgallery%20-%20Full%20featured%20%23javascript%20lightbox%20gallery%2C%20No%20%23jQuery%20-%20http%3A%2F%2Fbit.ly%2F2amlfJe) about this project.

Follow me on twitter [@sachinchoolur](https://twitter.com/sachinchoolur) for the latest news, updates about this project.

I am re-writing [lightslider](https://github.com/sachinchoolur/lightslider) too in pure javascript, It will be completely compatible with lightgallery. Watch the repository to get latest updates..


