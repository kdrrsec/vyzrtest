/* VYZR â€” Drop-off appointment redirect
 * Runs on the Shopify order status (thank you) page.
 * If the order contains a drop-off fulfillment, redirects the customer
 * to the VYZR booking page where they get a personal Calendly link.
 */
(function () {
  try {
    if (typeof Shopify === "undefined" || typeof Shopify.checkout === "undefined") return;

    var items = Shopify.checkout.line_items || [];
    var isDropoff = items.some(function (item) {
      var props = item.properties || {};
      var fulfillment = props["Visor fulfillment"] || "";
      return fulfillment.indexOf("Drop-off") !== -1;
    });

    if (!isDropoff) return;

    var orderId   = String(Shopify.checkout.order_id   || "");
    var orderName = String(Shopify.checkout.order_name || orderId);
    var email     = String(Shopify.checkout.email      || "");

    var base = "https://vyzrtest.vercel.app/book-dropoff";
    var url  =
      base +
      "?order_id="   + encodeURIComponent(orderId) +
      "&order_name=" + encodeURIComponent(orderName) +
      "&email="      + encodeURIComponent(email);

    window.location.replace(url);
  } catch (e) {
    // Never crash the thank you page
  }
})();
