var toggle = false;

$('#but1').click(function () {
    if ($(this).hasClass("btn-secondary"))
    {
        $(this).removeClass('btn-secondary').addClass('btn-primary');
        $('#but2').removeClass('btn-primary').addClass('btn-secondary');
        if (toggle === false)
        {
            toggle = true;
            $('#menu').animate({marginTop:'10em'},500,'swing');
            $('<hr>').appendTo($('section')).css("width", "30em").addClass('animated zoomIn mt-4');
            $.ajax({
                url : './data/generator.html',
                type : 'GET',
                dataType : 'html',
                success : function(html) {
                    $(html).appendTo("body");
                }
            });
        }
    }
});

$('#but2').click(function () {
    if ($(this).hasClass("btn-secondary"))
    {
        $(this).removeClass('btn-secondary').addClass('btn-primary');
        $('#but1').removeClass('btn-primary').addClass('btn-secondary');
        if (toggle === false)
        {
            $('#menu').animate({marginTop:'10em'},500,'swing');
            $('<hr>').appendTo($('section')).css("width", "20em").addClass('animated zoomIn');
            toggle = true;
        }
    }
});