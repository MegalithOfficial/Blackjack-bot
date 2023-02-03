import { Deck } from "./Deck.js";
import { Hand } from "./Hand.js";

export class Blackjack {
    constructor() {
        this.deck = new Deck();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
    }

    startgame() {
        this.playerHand.reset();
        this.dealerHand.reset();
        this.deck.shuffle();
        this.playerHand.addCard(this.deck.deal());
        this.dealerHand.addCard(this.deck.deal());
        this.playerHand.addCard(this.deck.deal());
        this.dealerHand.addCard(this.deck.deal());
    };

    hit(hand) {
        hand.addCard(this.deck.deal());
    };

    playAsDealer() {
        while (this.dealerHand.getValue < 17) {
            this.hit(this.dealerHand);
        };
    };

    getResults() {
        this.playAsDealer();
        if (this.playerHand.isBust()) {
            return { iswon: false, playerValue: this.playerHand.getValue(), dealerValue: this.dealerHand.getValue() };
        } else if (this.dealerHand.isBust()) {
            return { iswon: true, playerValue: this.playerHand.getValue(), dealerValue: this.dealerHand.getValue() };
        } else {
            if (this.playerHand.getValue() > this.dealerHand.getValue()) {
                return { iswon: true, playerValue: this.playerHand.getValue(), dealerValue: this.dealerHand.getValue() };
            } else if (this.playerHand.getValue() < this.dealerHand.getValue()) {
                return { iswon: false, playerValue: this.playerHand.getValue(), dealerValue: this.dealerHand.getValue() };
            } else {
                return { iswon: null, playerValue: this.playerHand.getValue(), dealerValue: this.dealerHand.getValue() };
            };
        };
    };

    getObjectSize(obj) {
        return Object.keys(obj).length;
    };

    refresh() {
        let data = "";
        for(let i = 0; i < this.getObjectSize(this.playerHand.cards) ; ++i) {
          data += `\`${this.playerHand.cards[i].rank} of ${this.playerHand.cards[i].suit}\` `;
        };
        return data;
    }
};