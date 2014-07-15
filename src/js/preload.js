/**
 * preload.pace.js v0.1.0
 * by Won J. You
 * Wrapper class for Pace
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */

( function( window ) {
	
	'use strict';
	
	//element is the preloader element
	//settings is an object that contains optional choices from the user such as a callback function
	function Preloader(element, svgElement, settings) {
		
		this.defaults = {
				autoHide: true,  //should the preloader automatically disappear
				callback: function(){}, //callback function that is triggered when the wipe out animation is completed
				onLoaded: function(){} //callback function that is triggered when the load is finished  
			};
		
		this.el = element;
		this.$preloader = $(element);
		this.svgElement = svgElement;
		this.settings = $.extend( {}, this.defaults, settings );
		this.checkInterval = null; // our checkInterval
		this.progressCount = 0;
		this.total = 0;
		
		this._init();
	}
	
	Preloader.prototype = {
			
			_init: function(){

				this.isDone = false; //are we done loading yet
				this.autoHide = this.settings.autoHide;
				this.loadElements = this.settings.images;  //the images to preload
				this.total = this.loadElements.length;  // total number of images to load
				this.animInDone = false;
				this.animOutDone = false;
				this.isAnimatingOut = false;
				this.loadElements = this.settings.images;  //the images to preload
				this.total = this.loadElements.length;  // total number of images to load
				
				var self = this;
				console.log(this.svgElement);
				this.svgLoader = new SVGLoader(this.svgElement, 
												{ speedIn : 400, easingIn : mina.easeinout, 
												  animInComplete:function(){self.animInDone = true;},
												  animOutComplete:function(){self.animOutDone = true;}
												} );
			},
			
			_checkReady: function(){
				
				var self = this;

				console.log('waiting for animation');
				//if we are waiting for the load animation, then trigger a loop to check
				if (this.checkInterval == null){
					this.checkInterval = setInterval(function(){
														self._checkAnimation();
													}, 30);
				}
				
			},

			_onComplete: function(){
				console.log('Preloader: onComplete called');
				this.reset();
				
				if( this.settings.callback && typeof this.settings.callback == 'function' ) {
					this.settings.callback();	
				}
			},
			
			_checkAnimation: function(){
				var self = this;
				
				if (self.animInDone && self.animOutDone){
					self._onComplete();
				}
				else if (self.animInDone && self.isDone){
					//show the animation wipe out if it hasn't already started
					var loadPercent = parseFloat(this.$preloader.css("width"))/$(window).width();
					
					if ( !this.isAnimatingOut && loadPercent >= 1){
						self.hide();
						
						if( this.settings.onLoaded && typeof this.settings.onLoaded == 'function' ) {
							this.settings.onLoaded();	
						}
					}
				}
				
			},
			
			reset: function(){
				console.log("Preloader: reset called");
				
				this.isDone = false;
				this.animInDone = false;
				this.animOutDone = false;
				this.isAnimatingOut = false;
				
				this.progressCount=0;
				this.total = 0;
				
				clearInterval(this.checkInterval);
				this.checkInterval = null;
				
				delete this.imgLoader;
			},
			
			setImages: function (images){
				console.log("Preloader: setImages called");
				console.log("images: " + images);
				this.loadElements = images;
				this.total = this.loadElements.length;				
			},
			
			start: function(){
				console.log('\nPreloader: start called');
				var self = this;
				
				this.show();
				self._checkReady();
				this.imgLoader = new imagesLoaded( this.loadElements );
				
				this.imgLoader.on( 'done', function() {
					self.isDone = true;
					//self.checkReady();
				});
				
				this.imgLoader.on( 'progress', function(){self.update();});

			},
			
			show: function (callback) {
			  console.log('\nPreloader: show called');
			  this.svgLoader.show();
			   this.$preloader.css({"display": 'block', "width":"0px"});
			},

			hide: function (callback) {
			  console.log('\nPreloader: hide called');
			  this.$preloader.css({"display":"none"});
			  this.svgLoader.hide();
			  this.isAnimatingOut = true;
			},

			update: function( loader, image ) {
				
				this.progressCount++;
				var progress = this.progressCount/this.total;
				this.updateProgress(progress);
					
				if ( this.progressCount >= this.total ) {
				  console.log('finished loading everything');
				 
				 // this.checkReady();
				}
			},
			
			updateProgress: function(progress) {
			  //console.log('progress: ' + progress);
			  if (progress > 1 || progress < 0) {
				throw 'Progress value should be a number between 0 and 1';
			  }

			  this.$preloader.css({ width: (100 * progress) + '%' });
			}

	};
	

	window.Preloader = Preloader;

})( window );