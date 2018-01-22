(function ($) {
  namespace("admin");

  admin = (function () {

    var init = function() {

      bindDelete();
    };

    var bindDelete = function() {
      $('button[data-delete-id]').click(function() {
        var campaignid = $(this).data('delete-id');
        $('#campaignid').val(campaignid);
        $('form').attr('action', '/campaign/delete');
        $('form').submit();
      })
    };

    return {
      init: init
    };


  })();

})(jQuery);