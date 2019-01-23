require("@babel/polyfill");
window.$ = require('jquery');

$(document).ready( () => {
   $(window).click(function() {
      $(".jf--dropdown").removeClass('jf--visible');
   });
   $(".jf--dropdown").each(function() {
      var t = $(this);
      var first = true;
      function updateValue(dropdown, value, label) {
         $(dropdown).attr('data-value', value);
         console.log($(dropdown).attr('data-value'));
         $($(dropdown).children('.jf--dropdown-text')[0]).text(label);
      }
      if ($(this).children('.jf--dropdown-text').length <= 0) {
         $(this).prepend('<span class="jf--dropdown-text"></span>')
      }
      var index = 0;
      $(this).find(".jf--dropdown-item").each(function() {
         if ($(this).attr("data-value") === "") {
            $(this).attr("data-value", index);
         }
         if (first) {
            if (!$(t).hasClass('jf--no-default')) {
               updateValue(t, $(this).attr('data-value'), $(this).text());
            } else {
               $(t).removeClass('jf--no-default');
            }
            first = false;
         }
         $(this).on('click', function(e) {
            e.stopPropagation();
            updateValue(t, $(this).attr('data-value'), $(this).text());
            $(t).removeClass('jf--visible');
         });
         index++;
      });
      $(this).on('click', function (e) {
         e.stopPropagation();
         $(this).toggleClass('jf--visible');
      });
   });
   $(".jf--password-input-wrapper").each(function() {
      let input = $(this).children('input')[0];
      let btn = $(this).children(".jf--password-show-btn")[0];
      if (btn && input) {
         $(btn).on('click', function() {
            if ($(this).hasClass('jf--visible')) {
               $(input).attr('type', 'password');
            } else {
               $(input).attr('type', 'text');
            }
            $(this).toggleClass('jf--visible');
         })
      }
   });
});