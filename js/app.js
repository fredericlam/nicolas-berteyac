	
	
	var $grid ; 

	$(document).ready( function(){

		// console.log(" Page loaded ") ;

		window.sr = ScrollReveal();
		sr.reveal('.biography', { duration: 200 });
		sr.reveal('.showreel', { duration: 500 });
		sr.reveal('.work img');
		sr.reveal('.resume');
		sr.reveal('.galery img');
		sr.reveal('.contact li');

		function goToByScroll(item){
		    // Scroll
		    // console.info( item );
		    $('html,body').animate({ scrollTop: $("#"+item).offset().top - 50 } , 1000 );
		}

		$("nav > ul > li > a").click(function(e) { 
		    // Prevent a page reload when a link is pressed
		    e.preventDefault(); 
		    // Call the scroll function
		    goToByScroll( $(this).attr('attr-scroll') );           
		});

		$('.work li').hover(function(){
			$(this).children().toggleClass('shown').stop(0);
		})

		$('.grid').imagesLoaded( function() {
		  	// images have loaded
		  	$grid = $('.grid').isotope({
			  // options
			  itemSelector: '.grid-item'
			});
		});

		/*$(".galery a").fancybox({
			autoDimensions: false , 
			autoSize: false,
			maxHeight: 150 , 
			maxWidtth: 300 , 
			afterShow : function( instance, current ) {
				// $(window).trigger('resize');
				console.info("resize");
			}
		});*/
		
	});

	$( window ).scroll(function() {

  		if( $(this).scrollTop() >= 80 )
  		{
   			$('nav').addClass('navbar-fixed-top').css('margin-top',0) ; 
   			$('footer').addClass('footer-fixed').css('margin-top',0) ; 
  		}
  		else
  		{
  			$('nav').removeClass('navbar-fixed-top').css('margin-top','10px') ; 
  			$('footer').removeClass('footer-fixed')
  		}
	});

	// app
	function filter(item){
		$grid.isotope({ filter: item });
	}