$(document).ready(function() {
    /* MT Police Manual */
    // Expand/collapse nav.
    $('.mtpd-manual-menu li.dropdown').addClass('plus-icon');
    $('.mtpd-manual-menu li.dropdown').children().hide();
    $('.mtpd-manual-menu li.dropdown').each(function() {
        $(this).click(function(event) {
            if (this == event.target) {
                if ($(this).is('.plus-icon')) {
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

    Show content based on nav link clicked.
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

    $("#next").click(function() {
        if ($(".left-col .chapter:visible").next().length != 0)
            $(".left-col .chapter:visible").next().show().prev().hide();
        else {
            $(".left-col .chapter:visible").hide();
            $(".left-col .chapter:first").show();
        }
        return false;
    });

    $("#prev").click(function() {
        if ($(".left-col .chapter:visible").prev().length != 0)
            $(".left-col .chapter:visible").prev().show().next().hide();
        else {
            $(".left-col .chapter:visible").hide();
            $(".left-col .chapter:last").show();
        }
        return false;
    });
    /* End Police Manual */
})
