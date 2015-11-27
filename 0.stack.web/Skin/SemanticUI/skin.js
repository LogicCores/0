
window.Library.waitForWindowProperty("contexts", function (contexts) {

    const LIB = window.Library;

    contexts.page.onow("changed:path", function (path) {
		try {
			// TODO: Optionally remember scoll positions of pages and re-apply on nav.
			var menuHeight = $(".main.menu").height();
			var pageContentElm = $("#page-content");
			var pageContentY = pageContentElm.offset().top;
			if (
				mainMenuPinned ||
				/\/Community\//.test(path)
			) {
				$(document).scrollTop(pageContentY - menuHeight * 2);
			}
			$('.main.menu .item').removeClass("active");
			$('.main.menu .item[href="' + path + '"]').addClass("active");
		} catch (err) {
			console.error("suppressed error", err);
		}
	});


    // fix main menu to page on passing
    $('.main.menu').visibility({
      type: 'fixed',
      offset : 48
    });
    $('.overlay').visibility({
      type: 'fixed',
      offset: 80
    });
  
    // lazy load images
    $('.image').visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
    });
  
    $('.menu .item').tab();
  
    $('.definition.popup').popup({
      inline: true
    });


	contexts.auth.onow("changed:authenticated", function (authenticated) {

		if (authenticated) {

			$('#community-menu').visibility({
				type   : 'fixed',
				offset : 0
			});
		}
	});


	var mainMenuPinned = null;

	var onScroll = LIB._.debounce(function () {
		var isPinned = $(".main.menu").hasClass("fixed");
		if (isPinned !== mainMenuPinned) {
			mainMenuPinned = isPinned;
			if (mainMenuPinned) {
				$("body").addClass("main-menu-pinned");
			} else {
				$("body").removeClass("main-menu-pinned");
			}
		}
	}, 100);
	$(document).on('scroll', onScroll);
	onScroll();

});

