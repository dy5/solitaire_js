
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

	setupImages() {
		var img = document.createElement("img");
		img.src = imgPath+"b.gif";


		var div = document.createElement("div");
		div.style.width = WIDTH+"px";
		div.style.height = HEIGHT+"px";
		div.style.backgroundImage = "url('"+imgPath+"allcards.png')";
		var i;
		for (i=0; i<this.myPile.length; i++) {
			var clone = div.cloneNode();
			clone.style.backgroundPosition = (this.myPile[i].rank.rankInt-1)*-1*WIDTH+"px "+this.myPile[i].suit.suitInt*-1*HEIGHT+"px";
			this.myPile[i].frontImg = clone;
			this.myPile[i].backImg = img.cloneNode();
			this.myPile[i].outerDiv.appendChild(clone);
			this.myPile[i].outerDiv.appendChild(this.myPile[i].backImg);
			this.myPile[i].backImg.style.display = "none";
			clone.style.display = "none";
		}
	}

}



