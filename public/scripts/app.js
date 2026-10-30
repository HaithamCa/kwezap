$(document).ready(function () {
  $(document).on("click", ".copy-link-btn", function () {
    const btn = $(this);
    const relativeUrl = btn.attr("data-url");
    const fullUrl = window.location.origin + relativeUrl;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl);
    } else {
      const temp = $("<input>");
      $("body").append(temp);
      temp.val(fullUrl).select();
      document.execCommand("copy");
      temp.remove();
    }

    const originalText = btn.text();
    btn.text("Copied Link!");
    setTimeout(() => {
      btn.text(originalText);
    }, 1800);
  });
});
