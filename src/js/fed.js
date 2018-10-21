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

    // Ridematch expand/collapse panels
    $('.ridematch .panel-collapse').each(function() {
        $(this).click(function(event) {
            if (this == event.target) {
                if ($(this).is('.plus-icon')) {
                    $(this).removeClass('plus-icon');
                    $(this).addClass('minus-icon');
                } else {
                    $(this).removeClass('minus-icon');
                    $(this).addClass('plus-icon');
                }
            }
        });
    });

    //Public Art - Image Map popover
    $('.greenline [data-toggle="popover"]').popover({
        html: true,
        trigger: 'hover',
        placement: 'top'
    });

    $('.blueline [data-toggle="popover"]').popover({
        html: true,
        trigger: 'hover',
        placement: 'bottom'
    });

    $('.park-ride-map [data-toggle="popover"]').popover({
        html: true,
        trigger: 'click',
        constraints: [{
            to: 'scrollParent',
            pin: true
        }]
    });


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
    $('.panel-body-19').appendTo('#detour19 .panel-body');
    $('.panel-body-20').appendTo('#detour20 .panel-body');

    // Community Event Request form - Toggle form based on number of days of event selected
    // $(".number-days").change(function() {
    //     var val = $(this).val();
    //     if(val === "one-day")
    // });
    $("select.number-days").change(function() {
        //console.log("Found number-days");
        $(this).find("option:selected").each(function() {
            var optionValue = $(this).attr("value");
            if (optionValue) {
                $(".event").not("." + optionValue).hide();
                $(".event").find("input").removeAttr("required");
                $("." + optionValue).show();
                $("." + optionValue).find("input").attr("required", "required");
            } else {
                $(".event").hide();
            }
        });
    }).change();

    // File upload validation.  Source: https://www.allphptricks.com/check-file-size-extension-uploading-using-jquery/
    $('#tap_enrollment_submit').prop("disabled", true);
    var a = 0;
    //binds to onchange event of your input field
    $('#photoID').bind('change', function() {
        if ($('#tap_enrollment_submit').attr('disabled', false)) {
            $('#tap_enrollment_submit').attr('disabled', true);
        }
        var ext = $('#photoID').val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            $('#error1').slideDown("slow");
            $('#error2').slideUp("slow");
            a = 0;
        } else {
            var picsize = (this.files[0].size);
            if (picsize > 1000000) {
                $('#error2').slideDown("slow");
                a = 0;
            } else {
                a = 1;
                $('#error2').slideUp("slow");
            }
            $('#error1').slideUp("slow");
            if (a == 1) {
                $('#tap_enrollment_submit').attr('disabled', false);
            }
        }
    });

    // Commuter Choice Awards Form - Copy Nominator to Nominee.
    $(".copy-contact input").change(function() {
        var is_checked = $(this).is(":checked");
        if (!is_checked) {
            $(".nominee-name").val("");
            $(".nominee-phone").val("");
            $(".nominee-email").val("");
        } else {
            $(".nominee-name").val($(".nominator-name").val());
            $(".nominee-phone").val($(".nominator-phone").val());
            $(".nominee-email").val($(".nominator-email").val());
        }
    });

    // Max character count of 500 (used on Commuter Choice Awards Form)
    var maxLength = 500;
    $('textarea.max-chars-500').keyup(function() {
        var length = $(this).val().length;
        var length = maxLength - length;
        $('span#chars').text(length);
    });
});
