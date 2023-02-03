
export class Hand {
    constructor() {
      this.cards = [];
    }
  
    addCard(card) {
      this.cards.push(card);
    }

    reset() {
        this.cards = [];
    }
  
    getValue() {
      let value = 0;
      let aces = 0;
      for (let card of this.cards) {
        switch (card.rank) {
          case 'jack':
          case 'queen':
          case 'king':
            value += 10;
            break;
          case 'ace':
            aces += 1;
            value += 11;
            break;
          default:
            value += parseInt(card.rank);
        }
      }
      while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
      }
      return value;
    }
  
    isBust() {
      return this.getValue() > 21;
    }
}