$(document).ready(function() {

	/* Great People */
	// Search feature
	$('input.gp-search-btn').click(function(e) {
		e.preventDefault();
		var name = $('input.gp-name').val();
		var uri = "/great-people-search-results.html?q=" + encodeURI(name);
		window.location = uri;
	});

	// Wrap "read more" link in <p>.
	$('gp-content .morelink').wrap('<p>');
	/* End Great People Redesign */
	
	/* Rider's Almanac redesign */
	// Wrap first blog image (Hero) in div.blogger.
	$('.ra-redesign .blogtext p:first-child:has(img)').each(function() {
		$(this).children().first().wrap('<div class="blogger"></div>');
	});

	// Move hero image outside of <p> and make it first sibling element.
	$('.ra-redesign .blogtext p .blogger').each(function() {
		$(this).parent().before($(this));
	});

	// Remove style attribute from hero images.
	$('.ra-redesign .blogtext .blogger img[style]').removeAttr('style');

	// Remove class from images for proper alignment.
	$('.ra-redesign img').removeClass('floatrightimage');

	// Wrap unwrapped text in <p>.
	$('.blogtext').contents().filter(function() {
		return this.nodeType === 3;
	}).wrap('<p/>');

	//  Remove empty <p> tags.
	$('p').filter(function () { return $.trim(this.innerHTML) == "" }).remove();

	// Wrap all remaining <p> tags in <div id="blog-wrapper"> to control positioning in css.
	$('.ra-redesign .blogtext, .ra-redesign .blogtext > .blogger').each(function() {
		$(this).siblings().wrapAll('<div id="blog-wrapper"></div>');
	});

	// Move social icons out of div.blog-wrapper.
	$('.bsocial').unwrap();
	/* End Rider's Almanac Redesign */

	/* MT Police Manual */
	// Expand/collapse nav.
	$('li.dropdown').addClass('plus-icon');
	$('li.dropdown').children().hide();
	$('li.dropdown').each( function() {
		$(this).click(function(event){
			if (this == event.target) {
				if($(this).is('.plus-icon')) {
					$(this).children().slideDown();
					$(this).removeClass('plus-icon');
					$(this).addClass('minus-icon');
				} else {
					$(this).children().slideUp();
					$(this).removeClass('minus-icon');
					$(this).addClass('plus-icon');
				}
			}
		});
	});

	// Show content based on nav link clicked.
	$('.mtpd-manual-menu a').click(function(e) {
		e.preventDefault();
		$('.chapter').hide();
		$('.mtpd-manual-menu li a').removeClass('active'); // remove any existing 'active' classes.
		$(this).addClass('active'); // add class to currently active link.
		var id = $(this).attr('href'); // Get href of active link.
		$(id).show(); // Show div with matching id of active link href.
	});

	// Paging
    $(".left-col .chapter").each(function(e) {
        if (e != 0)
            $(this).hide();
    });
    
    $("#next").click(function(){
        if ($(".left-col .chapter:visible").next().length != 0)
            $(".left-col .chapter:visible").next().show().prev().hide();
        else {
            $(".left-col .chapter:visible").hide();
            $(".left-col .chapter:first").show();
        }
        return false;
    });

    $("#prev").click(function(){
        if ($(".left-col .chapter:visible").prev().length != 0)
            $(".left-col .chapter:visible").prev().show().next().hide();
        else {
            $(".left-col .chapter:visible").hide();
            $(".left-col .chapter:last").show();
        }
        return false;
    });
    /* End Police Manual */
});