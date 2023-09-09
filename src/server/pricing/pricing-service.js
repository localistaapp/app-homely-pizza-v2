
class PricingService {

    static getTotalPrice (pizzzaQty, wrapsQty, breadQty, takeAwayQty, hasValidCode, hasReviewed) {
        const pizzaPrice = this.pizzaStdPrice * pizzzaQty;
        const wrapsPrice = this.wrapsStdPrice * wrapsQty;
        const breadPrice = this.breadStdPrice * breadQty;
        const takeAwayPrive = this.takeAwayStdPrice * takeAwayQty;

        let totalPrice = pizzaPrice + wrapsPrice + breadPrice + takeAwayPrive;
        return Math.round(totalPrice);
     }

     static getDiscountedPrice (pizzzaQty, wrapsQty, breadQty, takeAwayQty, hasValidCode, hasReviewed) {
      const pizzaPrice = this.pizzaStdPrice * pizzzaQty;
      const wrapsPrice = this.wrapsStdPrice * wrapsQty;
      const breadPrice = this.breadStdPrice * breadQty;
      const takeAwayPrive = this.takeAwayStdPrice * takeAwayQty;

      let totalPrice = pizzaPrice + wrapsPrice + breadPrice + takeAwayPrive;
      if(hasValidCode && hasReviewed) {
        totalPrice = totalPrice * 0.8;
      }
      else if(hasValidCode) {
        totalPrice = totalPrice * 0.85;
      }
      return Math.round(totalPrice);
   }
}
PricingService.pizzaStdPrice = 199;
PricingService.wrapsStdPrice = 89;
PricingService.breadStdPrice = 79;
PricingService.takeAwayStdPrice = 19;

module.exports = PricingService;