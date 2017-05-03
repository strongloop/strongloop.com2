$(document).ready(function() {
  $(".js-body").prepend('<nav class="c-nav js-nav"></nav>');
  $(".js-wrapper").append('<div class="_cover js-cover"></div>');

  $(window).trigger('resize');

  // Nav
  $(".js-menu, .js-cover").click(function() {
    if (!$("body").hasClass("js-nav-open")) {
      $("body").addClass("-nav-open");
      $("body").addClass("js-nav-open");
    }
    else {
      $("body").removeClass("-nav-open");
      $("body").removeClass("js-nav-open");
    }
    return false;
  });

  // Kill click delay
  FastClick.attach(document.body);
});

$(window).on("resize",function() {
  var $window = $(window);

  // Transpose menu
  if ($window.width() < 769) {
    if($('.c-nav .js-nav-list').length === 0 ){
      $(".js-masthead-nav .js-nav-list:first").appendTo(".c-nav .js-nav");
      $(".js-github-star").appendTo(".js-nav");
    }
  }
  else {
    if($('.c-masthead .js-nav-list').length === 0 ){
      $(".js-nav .js-nav-list:first").appendTo(".c-masthead .js-masthead-nav");
      $(".js-github-star").appendTo(".js-masthead-container");
    }
    
  }
});

// Stop scrolling when menu is open
$(document).bind("touchmove", function(e) {
  if ($("body").hasClass("js-nav-open")) {
    return e.preventDefault();
  }
  else {
    return true;
  }
});