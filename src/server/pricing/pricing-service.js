
class PricingService {

    static getTotalPrice (pizza1Qty, pizza2Qty, pizza3Qty, pizza4Qty, pizza5Qty, pizza6Qty, pizza7Qty, pizza8Qty, takeAwayQty, extraToppingsQty, hasValidCode, hasReviewed) {
        const pizza1Price = this.pizza1StdPrice * pizza1Qty;
        const pizza2Price = this.pizza2StdPrice * pizza2Qty;
        const pizza3Price = this.pizza3StdPrice * pizza3Qty;
        const pizza4Price = this.pizza4StdPrice * pizza4Qty;
        const pizza5Price = this.pizza5StdPrice * pizza5Qty;
        const pizza6Price = this.pizza6StdPrice * pizza6Qty;
        const pizza7Price = this.pizza7StdPrice * pizza7Qty;
        const pizza8Price = this.pizza8StdPrice * pizza8Qty;
        const takeAwayPrice = this.takeAwayStdPrice * takeAwayQty;
        const extraToppingsPrice = this.extraToppingsStdPrice * extraToppingsQty;

        let totalPrice = pizza1Price + pizza2Price + pizza3Price + pizza4Price + pizza5Price + pizza6Price + pizza7Price + pizza8Price + takeAwayPrice + extraToppingsPrice;
        return Math.round(totalPrice);
     }

     static getDiscountedPrice (pizza1Qty, pizza2Qty, pizza3Qty, pizza4Qty, pizza5Qty, pizza6Qty, pizza7Qty, pizza8Qty, takeAwayQty, extraToppingsQty, hasValidCode, hasReviewed) {
      const pizza1Price = this.pizza1StdPrice * pizza1Qty;
        const pizza2Price = this.pizza2StdPrice * pizza2Qty;
        const pizza3Price = this.pizza3StdPrice * pizza3Qty;
        const pizza4Price = this.pizza4StdPrice * pizza4Qty;
        const pizza5Price = this.pizza5StdPrice * pizza5Qty;
        const pizza6Price = this.pizza6StdPrice * pizza6Qty;
        const pizza7Price = this.pizza7StdPrice * pizza7Qty;
        const pizza8Price = this.pizza8StdPrice * pizza8Qty;
        const takeAwayPrice = this.takeAwayStdPrice * takeAwayQty;
        const extraToppingsPrice = this.extraToppingsStdPrice * extraToppingsQty;

        let totalPrice = pizza1Price + pizza2Price + pizza3Price + pizza4Price + pizza5Price + pizza6Price + pizza7Price + pizza8Price + takeAwayPrice + extraToppingsPrice;
      if(hasValidCode && hasReviewed == 'y') {
        totalPrice = totalPrice * 0.95;
      }
      else if(hasValidCode || hasReviewed == 'y') {
        totalPrice = totalPrice * 0.95;
      }
      return Math.round(totalPrice);
   }
}
PricingService.pizza1StdPrice = 199;
PricingService.pizza2StdPrice = 189;
PricingService.pizza3StdPrice = 209;
PricingService.pizza4StdPrice = 189;
PricingService.pizza5StdPrice = 199;
PricingService.pizza6StdPrice = 209;
PricingService.pizza7StdPrice = 209;
PricingService.pizza8StdPrice = 239;
PricingService.takeAwayStdPrice = 20;
PricingService.extraToppingsStdPrice = 25;

module.exports = PricingService;