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
    $('p').filter(function() {
        return $.trim(this.innerHTML) == ""
    }).remove();

    // Wrap all remaining <p> tags in <div id="blog-wrapper"> to control positioning in css.
    $('.ra-redesign .blogtext, .ra-redesign .blogtext > .blogger').each(function() {
        //$(this).siblings().wrapAll('<div id="blog-wrapper"></div>');
    });

    // Move social icons out of div.blog-wrapper.
    $('.bsocial').unwrap();
    /* End Rider's Almanac Redesign */

    // Article details
    //$('#ctl00_mainContent_BlogView1_pnlInnerBody #ctl00_mainContent_BlogView1_bsocial').remove();

    // Inject panel body content into corresponding panel
    $('.panel-body-1').appendTo('#detour1 .panel-body');
    $('.panel-body-2').appendTo('#detour2 .panel-body');
    $('.panel-body-3').appendTo('#detour3 .panel-body');
    $('.panel-body-4').appendTo('#detour4 .panel-body');
    $('.panel-body-5').appendTo('#detour5 .panel-body');
    $('.panel-body-6').appendTo('#detour6 .panel-body');
    $('.panel-body-7').appendTo('#detour7 .panel-body');
    $('.panel-body-8').appendTo('#detour8 .panel-body');
    $('.panel-body-9').appendTo('#detour9 .panel-body');
    $('.panel-body-10').appendTo('#detour10 .panel-body');
    $('.panel-body-11').appendTo('#detour11 .panel-body');
    $('.panel-body-12').appendTo('#detour12 .panel-body');
    $('.panel-body-13').appendTo('#detour13 .panel-body');
    $('.panel-body-14').appendTo('#detour14 .panel-body');
    $('.panel-body-15').appendTo('#detour15 .panel-body');
    $('.panel-body-16').appendTo('#detour16 .panel-body');
    $('.panel-body-17').appendTo('#detour17 .panel-body');
    $('.panel-body-18').appendTo('#detour18 .panel-body');

});