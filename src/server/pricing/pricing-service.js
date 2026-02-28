
class PricingService {

    static getTotalPrice (pizza1Qty, pizza2Qty, pizza3Qty, pizza4Qty, pizza5Qty, pizza6Qty, pizza7Qty, pizza8Qty, takeAwayQty, extraToppingsQty, hasValidCode, hasReviewed, pizza1SliceQty, pizza2SliceQty, pizza3SliceQty, pizza4SliceQty, pizza5SliceQty, pizza6SliceQty, pizza7SliceQty, pizza8SliceQty, takeAwaySliceQty) {
        const pizza1Price = this.pizza1StdPrice * pizza1Qty;
        const pizza2Price = this.pizza2StdPrice * pizza2Qty;
        const pizza3Price = this.pizza3StdPrice * pizza3Qty;
        const pizza4Price = this.pizza4StdPrice * pizza4Qty;
        const pizza5Price = this.pizza5StdPrice * pizza5Qty;
        const pizza6Price = this.pizza6StdPrice * pizza6Qty;
        const pizza7Price = this.pizza7StdPrice * pizza7Qty;
        const pizza8Price = this.pizza8StdPrice * pizza8Qty;
        const takeAwayPrice = this.takeAwayStdPrice * takeAwayQty;

        const pizza1SlicePrice = this.pizzaSliceStdPrice * pizza1SliceQty;
        const pizza2SlicePrice = this.pizzaSliceStdPrice * pizza2SliceQty;
        const pizza3SlicePrice = this.pizzaSliceStdPrice * pizza3SliceQty;
        const pizza4SlicePrice = this.pizzaSliceStdPrice * pizza4SliceQty;
        const pizza5SlicePrice = this.pizzaSliceStdPrice * pizza5SliceQty;
        const pizza6SlicePrice = this.pizzaSliceStdPrice * pizza6SliceQty;
        const pizza7SlicePrice = this.pizzaSliceStdPrice * pizza7SliceQty;
        const pizza8SlicePrice = this.pizza8SliceStdPrice * pizza8SliceQty;
        const takeAwaySlicePrice = this.takeAwaySliceStdPrice * takeAwaySliceQty;
        const extraToppingsPrice = this.extraToppingsStdPrice * extraToppingsQty;

        let totalPrice = pizza1Price + pizza2Price + pizza3Price + pizza4Price + pizza5Price + pizza6Price + pizza7Price + pizza8Price + takeAwayPrice + extraToppingsPrice + pizza1SlicePrice + pizza2SlicePrice + pizza3SlicePrice + pizza4SlicePrice + pizza5SlicePrice + pizza6SlicePrice + pizza7SlicePrice + pizza8SlicePrice + takeAwaySlicePrice;

        return Math.round(totalPrice);
     }

     static getDiscountedPrice (pizza1Qty, pizza2Qty, pizza3Qty, pizza4Qty, pizza5Qty, pizza6Qty, pizza7Qty, pizza8Qty, takeAwayQty, extraToppingsQty, hasValidCode, hasReviewed, pizza1SliceQty, pizza2SliceQty, pizza3SliceQty, pizza4SliceQty, pizza5SliceQty, pizza6SliceQty, pizza7SliceQty, pizza8SliceQty, takeAwaySliceQty) {
      const pizza1Price = this.pizza1StdPrice * pizza1Qty;
        const pizza2Price = this.pizza2StdPrice * pizza2Qty;
        const pizza3Price = this.pizza3StdPrice * pizza3Qty;
        const pizza4Price = this.pizza4StdPrice * pizza4Qty;
        const pizza5Price = this.pizza5StdPrice * pizza5Qty;
        const pizza6Price = this.pizza6StdPrice * pizza6Qty;
        const pizza7Price = this.pizza7StdPrice * pizza7Qty;
        const pizza8Price = this.pizza8StdPrice * pizza8Qty;
        const takeAwayPrice = this.takeAwayStdPrice * takeAwayQty;

        const pizza1SlicePrice = this.pizzaSliceStdPrice * pizza1SliceQty;
        const pizza2SlicePrice = this.pizzaSliceStdPrice * pizza2SliceQty;
        const pizza3SlicePrice = this.pizzaSliceStdPrice * pizza3SliceQty;
        const pizza4SlicePrice = this.pizzaSliceStdPrice * pizza4SliceQty;
        const pizza5SlicePrice = this.pizzaSliceStdPrice * pizza5SliceQty;
        const pizza6SlicePrice = this.pizzaSliceStdPrice * pizza6SliceQty;
        const pizza7SlicePrice = this.pizzaSliceStdPrice * pizza7SliceQty;
        const pizza8SlicePrice = this.pizza8SliceStdPrice * pizza8SliceQty;
        const takeAwaySlicePrice = this.takeAwaySliceStdPrice * takeAwaySliceQty;
        const extraToppingsPrice = this.extraToppingsStdPrice * extraToppingsQty;

        let totalPrice = pizza1Price + pizza2Price + pizza3Price + pizza4Price + pizza5Price + pizza6Price + pizza7Price + pizza8Price + takeAwayPrice + extraToppingsPrice + pizza1SlicePrice + pizza2SlicePrice + pizza3SlicePrice + pizza4SlicePrice + pizza5SlicePrice + pizza6SlicePrice + pizza7SlicePrice + pizza8SlicePrice + takeAwaySlicePrice;
      if(hasValidCode && hasReviewed == 'y') {
        totalPrice = totalPrice * 0.95;
      }
      else if(hasValidCode || hasReviewed == 'y') {
        totalPrice = totalPrice * 0.95;
      }
      return Math.round(totalPrice);
   }
}
// All prices are GST-inclusive (5%)

PricingService.pizza1StdPrice = 219;
PricingService.pizza2StdPrice = 209;   // anchor revised from 189
PricingService.pizza3StdPrice = 229;
PricingService.pizza4StdPrice = 209;
PricingService.pizza5StdPrice = 219;
PricingService.pizza6StdPrice = 229;
PricingService.pizza7StdPrice = 229;
PricingService.pizza8StdPrice = 259;

PricingService.pizzaSliceStdPrice = 35;     // anchor revised from 30
PricingService.pizza8SliceStdPrice = 49;

PricingService.takeAwayStdPrice = 22;
PricingService.takeAwaySliceStdPrice = 6;

PricingService.extraToppingsStdPrice = 28;

module.exports = PricingService;