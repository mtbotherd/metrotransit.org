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
        $(this).siblings().wrapAll('<div id="blog-wrapper"></div>');
    });

    // Move social icons out of div.blog-wrapper.
    $('.bsocial').unwrap();
    /* End Rider's Almanac Redesign */
});
