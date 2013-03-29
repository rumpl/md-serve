$(function () {
  var title = $('#title');
  var content = $('#content');

  window.addEventListener("popstate", function (e) {
    setArticle(location.href);
  });

  function setArticle(url) {
    $.getJSON(url)
      .then(function (data) {
        title.html(data.title);
        content.html(data.article);
        
        setTimeout(function () {
          title.show();
          content.show();
        }, 0);
      });
  }

  $('.article').on('click', function () {
    var href = $(this).attr('href');

    title.hide();
    content.hide();

    history.pushState(null, null, href);
    setArticle(href);

    return false;
  });
});
