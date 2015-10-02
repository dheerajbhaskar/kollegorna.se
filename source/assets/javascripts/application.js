//= require "jquery"
//= require "fitvids"
//= require "waitForImages/dist/jquery.waitforimages.min.js"
//= require "pretty-embed/jquery.prettyembed.min.js"
//= require "gsap"
//= require "packery/dist/packery.pkgd.min.js"
//= require "imagesloaded/imagesloaded.pkgd.min.js"

/*!
 * kollegorna.se js
 */
(function() {

    'use strict';

    TweenMax.set($('.home__language'), { opacity: 0, rotationX: -60, marginTop: '-50px', transformOrigin: 'center 0', transformPerspective: 800 });

    var Kollegorna = {

      init: function() {
        // get labs RSS feed
        this.labsRssFeed();

        this.video();

        this.caseMedia();
      },

      labsRssFeed: function () {
        if ($('.home__labs').length) {
          $.ajax({
            url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('https://labs.kollegorna.se/feed.xml'),
            dataType : 'json',
            success  : function (data) {
              if (data.responseData.feed && data.responseData.feed.entries) {
                $('.home__labs p').after('<ul></ul>');

                $.each(data.responseData.feed.entries, function (i, e) {
                  if (i < 5) {
                    var press_date = new Date(e.publishedDate);
                    $('.home__labs ul').append('<li><a href="' + e.link + '">' + e.title + '</a><time class="t-meta t-meta--small">' + Kollegorna.formatRssDate(press_date) + '</time></li>');
                  }
                });
              }
            }
          });
        }
      },

      formatRssDate: function (d) {
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();

        if ($('html').attr('lang') == 'sv') {
          var month_names = new Array("januari", "februari", "mars",
          "april", "maj", "juni", "juli", "augusti", "september",
          "oktober", "november", "december");

          return curr_date + ' ' + month_names[curr_month] + ' ' + curr_year;
        } else {
          return d.toISOString().substring(0, 10);
        }
      },

      video: function () {
        $('.article__body').fitVids();
      },

      caseMedia: function() {
        if ($('.case__media').length) {
          $('.case__media').fitVids();
          $().prettyEmbed({ useFitVids: true });

          $('.case__media__tweet').each(function(i) {
            var tweet = $(this);
            $.ajax({
              url: "https://api.twitter.com/1/statuses/oembed.json?url="+tweet.attr('data-tweet'),
              dataType: "jsonp",
              success: function(data){
                tweet.html(Kollegorna.caseMediaTweet(data));
              }
            });
          });

          setTimeout(function () {
              $('.case__media').fadeIn('medium');

              var $case_media = $('.case__media').imagesLoaded( function() {
                $case_media.packery({
                  itemSelector: '.case__media__item',
                  gutter: 0
                });
              });

          }, 1300);


        }
      },

      // Make tweets look nice. Remove Twitter widget script and add profile
      // image from avatars.io.
      caseMediaTweet: function(data) {
        var html = $(data.html.bold());
        html.find('script').remove();

        var twitter_handle = (data.author_url.match(/https?:\/\/(www\.)?twitter\.com\/(#!\/)?@?([^\/]*)/)[3]);

        var twitter_profile_image = '<figure class="case__media__tweet__image polaroid polaroid--circle"><img src="//avatars.io/twitter/' + twitter_handle + '?size=large"></figure>';

        html = '<div class="case__media__tweet__content">' + html.html() + '</div>';
        html = twitter_profile_image + html;

        return html;
      },
    };

    document.addEventListener("DOMContentLoaded", function(event) {
        Kollegorna.init();
    });

  var DEFAULT_VALUE = 'en';
  var PREFERRED_LANGUAGE = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || DEFAULT_VALUE;
  console.log(PREFERRED_LANGUAGE);
  if (PREFERRED_LANGUAGE != 'sv' || PREFERRED_LANGUAGE != 'sv-fi') {
    console.log('Language Not Swedish');
  }

  TweenMax.to($('.home__language'), .25, { opacity: 1, marginTop: 0, rotationX: 30, delay: .5, ease:Power1.easeInOut });
  TweenMax.to($('.home__language'), .25, { opacity: 1, marginTop: 0, rotationX: -15, delay: .75, ease:Power1.easeInOut });
  TweenMax.to($('.home__language'), .25, { opacity: 1, marginTop: 0, rotationX: 7, delay: 1, ease:Power1.easeInOut });
  TweenMax.to($('.home__language'), .25, { opacity: 1, marginTop: 0, rotationX: -3, delay: 1.25, ease:Power1.easeInOut });
  TweenMax.to($('.home__language'), .25, { opacity: 1, marginTop: 0, rotationX: 0, delay: 1.5, ease:Power1.easeInOut });
}());
