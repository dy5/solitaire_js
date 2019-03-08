
/* A deck of 52 playing cards */
class Deck {
	constructor(sol) {
		this.myPile = new Array();
		this.sol = sol;

	}


	/* Shuffle the cards in the deck */
	shuffle() {
		var i, j, c, idx;
		if (this.myPile.length == 52) { //only shuffle a full deck
			for (i=0; i<3; i++) { //do it 3 times
				for (j=0; j<52; j++) {
					idx = Math.floor(Math.random() * 52); //random between 0 and 51
					c = this.myPile[j]; //old card
					this.myPile[j] = this.myPile[idx]; //replace old with new
					this.myPile[idx] = c; //replace new with old
				}
			}
		}
	}


	/* Return and remove the top card of the deck */
	popTop() {
		if (this.myPile.length > 0)
			return this.myPile.pop();
		else
			return null;
	}




	/* Delete all cards from the deck, and add the
	 * standard unshuffled 52 cards to it.
	 */
	populate() {
		this.myPile.length = 0;
		var r, s;
		for (s=0; s<4; s++)
			for (r=1; r<14; r++) {
				var card = new Card(new Rank(r), new Suit(s));
				card.setUpHandlers(this.sol);
				this.myPile.push(card);

			}
	}

	isEmpty() {
		return this.myPile.length == 0;
	}

}



