	
	
	var $grid ; 

	// functions 

	// @scroll bys
	function goToByScroll(item){
	    // Scroll
	    // console.info( item );
	    $('html,body').animate({ scrollTop: $("#"+item).offset().top - 50 } , 1000 );
	}

	// @filter
	function filter(item){
		$grid.isotope({ filter: item });
	}

	/**
	* Start vue app
	* @author: Frédéric LAM
	*/
	var app = new Vue({
		
		el: '#app',
	  	
	  	// properties
	  	data: {

	  		// apis urls 
	  		apis : {

	  			// https://spreadsheets.google.com/feeds/list/1rK6SLFuzT7kzuf0jffEf8vySfpH4BhizX7xDElq7mIs/o594c14/public/basic?alt=json
	  			'work' : '/data/json/work.json' , 

	  			// https://spreadsheets.google.com/feeds/list/spreadsheetID/1rK6SLFuzT7kzuf0jffEf8vySfpH4BhizX7xDElq7mIs/public/values?alt=json
	  			'resume' : '/data/json/resume.json', 
	  		} , 

	  		// dataset : 
	  		dataset : {
	  			work : [] , 
	  			resume : [] , 
	  		} , 

	  		// intro 
	    	menus 	: [ 'showreel' , 'work' , 'resume' , 'photos' , 'contact' ], 

	    	author	: {
	    		name	: 'Nicolas Berteyac' , 
	    		job 	: 'Director of photography', 
	    		phone	: '+33(0)6 80 54 03 56', 
	    		email	: 'nicolas.berteyac@gmail.com' , 
	    		imdb 	: 'http://www.imdb.fr/name/nm2952837/' ,
	    		insta 	: 'http://www.instagram.com/berteyac' ,  
	    		fb		: 'https://www.facebook.com/nicolas.berteyac' , 
	    	} , 

	    	footer : '' ,
	    	
	    	// showreel
	    	showreel : {
	    		title : 'Showreel - Narrative' , 
	    		iframe_src : 'https://player.vimeo.com/video/700002535'
	    	} , 

	    	// work 
	    	work : {
	    		title : 'Work'
	    	} , 

	    	// resume 
	    	resume : {
	    		title : 'Resume', 
	    		headers : ['Name','Director','Production','Year']
	    	} , 

	    	// work 
	    	contact : {
	    		title : 'contact'
	    	}

	  	}, // end properties 

	  	// created events 
	    created()
	    {
	    	this.footer = `© ${new Date().getFullYear()} - All Rights Reserved - ${this.author.name} - ${this.author.job} - ${this.author.phone} - ${this.author.email}` ; 
	        
	    },  // end create ,

	    // end vue app mounted
	    mounted () {

	    	axios.all([

	    		// work
	    		axios.get( this.apis.work ),
	            // resume
	            axios.get( this.apis.resume ) ,

        	])

	    	// load promises
	    	.then( axios.spread( ( work_promise , resume_promise ) => {
	    		
	    		let obj , groups = [] , cpt_group = 0  ; 

	    		// console.info(work_promise.data.feed.entry) ; 	
	    		work_promise.data.feed.entry.forEach( row =>{
	    			if ( row.content.$t == ''){
	    				obj = { group : true , title : row.title.$t , values : [] } ;
	    				this.dataset.work.push( obj ) ; 
	    			}
	    		}) ;

	    		// console.info( groups , groups[0] ) ; 

	    		work_promise.data.feed.entry.forEach( (row,i) =>{

	    			if ( i != 0 && row.content.$t == '' ) cpt_group++ ;

	    			if ( row.content.$t != ''){
	    				obj = this.rowToObject( row.content.$t ) ;
	    				obj.title = row.title.$t ; 
	    				obj.url = ( obj.url == undefined) ? '' : obj.url ; 
	    				obj.wip = Number(obj.workinprogress) ; 
	    				obj.group = false ;
	    				
	    				this.dataset.work[ cpt_group ].values.push( obj ) ; 
	    			}
	    		}) ;

	    		
				
				// parse resume	    
	    		resume_promise.data.feed.entry.forEach( row =>{

	    			if ( row.content.$t != ''){
	    				obj = this.rowToObject( row.content.$t ) ;
	    				obj.title = row.title.$t ; 
	    				obj.group = false ;
	    			}
	    			else
	    				obj = { group : true , title : row.title.$t } ;

	    			this.dataset.resume.push( obj )  ; 
	    		}) ;

				
				console.info( this.dataset.work[0] ) ; 	    		

	    	})) ;  

	    } ,  // end mounted , 

	    methods : {

	    	/**
	    	* Method converting g spreasheet row to object
	    	*/
	    	rowToObject : ( row ) => {

	    		// director: Karin Albou, production: Karel, year: 2015, category: FEATURE FILM
	    		let obj = {} ,  values = row.split(',') , val = [] ; 
	    		for ( var v in values ){
	    			val = values[v].trim().split(': ') ; 
	    			// console.info("val",val[0].trim(),val[1].trim()) ; 
	    			obj[val[0].trim()] = val[1].trim() ; 
	    		}
	    		return obj ; 
	    	} , 

	    }

	})

	$(document).ready( function(){

		// console.log(" Page loaded ") ;

		window.sr = ScrollReveal();
		sr.reveal('.biography', { duration: 200 });
		sr.reveal('.showreel', { duration: 500 });
		sr.reveal('.work img');
		sr.reveal('.resume');
		sr.reveal('.galery img');
		sr.reveal('.contact li');

		var jsPromise = Promise.resolve( $.ajax('/data/cv.json') ) ;

		jsPromise.then((response)=>{
		  	
		  	// ...
		  	// console.info("response",response) ;
			
		  	let work = d3.nest()
		  		.key( c => c.category )
		  		.entries( response.work )
		  	; 
		  	
		  	let work_html = '' , work_projects = '' ;

		  	work.map( w => {

		  		work_projects = `<ul class="work">` ; 
		  		w.values.map( p => {

		  			// sub elements
		  			let picture_html = ( p.pic == undefined ) ? '' : `<img src="${p.pic}" alt="${p.title}">`;
		  			
		  			let work_in_prog = ( p.work_in_progress == true ) ? `<span class="wip">Work in progress</span>` : '' ; 
		  			
		  			let content_html = `
		  			<h3>${p.name}</h3>
                    <span>${(p.title!=undefined)?p.title:""}</span>
                    <span>${p.by}</span>
                    <span>${(p.prod!=undefined)?p.prod:""}</span>
                    <i class="fa fa-play-circle-o" aria-hidden="true"></i>
		  			`; 

		  			let a_href_html = ( p.url == undefined || p.url == '' ) ? content_html : `<a href="${p.url}" target="_blank">${content_html}</a>`;

		  			work_projects += `
		  			<li>
		  				${picture_html}
                        <div class="mask">
                            ${a_href_html}
                        </div>
                        ${work_in_prog}
                    </li>
		  			`;
		  			return p ; 
		  		})
		  		work_projects += `</ul>` ;


		  		work_html += `<h3>${w.key}</h3>` ; 
		  		work_html += `${work_projects}`;

		  		return w ; 
		  	}) 

		  	// $('#work').append( work_html ) ; 

		  	// action 
		  	setTimeout(() => {
		  		
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

		  	}, 250 )

		})
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

	