
class Column {
	constructor(colNum) {
		this.colNum = colNum;
		this.yValue = 0;

		//set up the html object (should be a div for column)
		this.obj = document.createElement("div");
		this.obj.style.width = 77+"px";
		this.obj.style.height = 500+"px";
		this.obj.style.position = "absolute";
		this.obj.style.left = 75*(colNum-1)+50 + "px";
		this.obj.style.top = "150px";

		//this.obj.style.border = "thick solid #0000FF";

		//setup facedown and faceup card arrays
		this.faceDown = new Array();
		this.faceUp = new Array();

		this.emptyColumnButton = document.createElement("input");
		this.emptyColumnButton.type = "button";
		this.emptyColumnButton.value = "XX";

		this.emptyColumnButton.style.width = 50+"px";
		this.emptyColumnButton.style.height = 20+"px";
		this.emptyColumnButton.style.position = "absolute";
		this.emptyColumnButton.style.left = 73/2-25 + "px";
		this.emptyColumnButton.style.top = "20 px";
		this.emptyColumnButton.style.display = "none";
		
		//this.obj.appendChild(this.emptyColumnButton);

	}

	setupOnclick(handler) {
		this.emptyColumnButton.onclick = function(){handler.doAction(EMPTYCOLUMN, this.emptyColumnButton)};
	}
	/* Accepts a card coming from the deck */
	acceptDealtCard(c) {
		if (this.faceDown.length < this.colNum && this.faceUp.length == 0) {
			c.imgObj.style.position = "absolute";
			c.imgObj.style.left = "0px";
			c.imgObj.style.top = this.yValue + "px";
			this.yValue += 5;
			this.faceDown.unshift(c); //add the the beginning of the array
			if (this.faceDown.length == this.colNum)
				c.setMode(2);
			else
				c.setMode(3);
			this.obj.appendChild(c.imgObj);
			return true;
		}
		else
			return false;
	}
/* Reset the column */
	reset() {
		this.faceDown.length = 0; //empty the array
		this.faceUp.length = 0;
		while (this.obj.firstChild) //empty the column's obj (node)
    		this.obj.removeChild(this.obj.firstChild);
    	this.obj.appendChild(this.emptyColumnButton); //add the empty button
    	//this.emptyColumnButton.style.display = "block";
    	this.yValue = 0;
	}



	 /* Returns true if the facedown card needs flipped */
	needsFlipped() {
		return this.faceUp.length == 0 && this.faceDown.length > 0;
	}

	/* flip one card from the faceDown pile to the faceUp pile
	 * only if the faceUp pile is empty */
	flip() {
		if (this.needsFlipped()) {
			var c = this.faceDown.shift(); //remove and grab element 0
			c.setMode(0);
			this.faceUp.push(c);
			this.yValue = HEIGHT_PART_BACK*this.faceDown.length + HEIGHT_PART_FRONT*this.faceUp.length;
			return true;
		}
		else
			return false;
	}

	/* Selects all cards in the column that are ordered
	 * a solitaire fashion such as
	 * Index  Card
	 * 0		5 Diamonds
	 * 1		4 Spades
	 * 2		3 Hearts
	 */
	 selectCardsRelatedTo(c) {
	 	if (this.selectNextCard(c))
	 		return true;
	 	else {
	 		deselectAll();
	 		return false;
	 	}
	 }

	 isLast(c) {
	 	if (this.faceUp.length > 0 && this.faceUp[this.faceUp.length-1] == c)
	 		return true;
	 	else
	 		return false;
	 }

	 /* A recursive function to help select
	 * all the cards that are in a solitaire fashion */
	 selectNextCard(cCurrent) {
	 	var cPrevious;
	 	var cNext;

	 	/* base case: only 1 card */
	 	if (this.faceUp.length == 1) {
	 		cCurrent.setSelected(true);
	 		return true;
	 	}

	 	/* base case, if this is the last card possible */
	 	else if (this.faceUp.length-1 == this.faceUp.indexOf(cCurrent)) {
	 	//else if (this.faceUp[this.faceUp.length-1] == cCurrent) {
	 		//cPrevious = this.faceUp[this.faceUp.length-2];
	 		cPrevious = this.faceUp[this.faceUp.indexOf(cCurrent) - 1];
	 		if (   (  ( cPrevious.suit.isRed() && !cCurrent.suit.isRed())      || /* if red, then black is next */
	 		       (!cPrevious.suit.isRed() && cCurrent.suit.isRed()  ) )      && /* if black, then red is next */
	 			   (cPrevious.rank.rankInt == cCurrent.rank.rankInt + 1)) {       /* current rank is 1 less than previous rank */
	 			cCurrent.setSelected(true);
	 			return true;
	 		} else {
	 			return false;
	 		}
	 	}

	 	/* recursive case */
	 	else {
	 		cNext = this.faceUp[this.faceUp.indexOf(cCurrent)+1];
 			if (   (  ( cCurrent.suit.isRed() && !cNext.suit.isRed())      || /* if red, then black is next */
 		       (!cCurrent.suit.isRed() && cNext.suit.isRed()  ) )      && /* if black, then red is next */
 			   (cCurrent.rank.rankInt == cNext.rank.rankInt + 1)) {       /* current rank is 1 less than previous rank */
				/* this card is valid, but check the next */
 			   	cCurrent.setSelected(true);
 			   	return this.selectNextCard(
 			   		this.faceUp[this.faceUp.indexOf(cCurrent)+1]);
 			} else
 				return false;

	 	}
	 }

	 /* Returns an array containing the column's selected cards */
	 getSelectedCards() {
	 	var result = new Array();
	 	var i = 0;
	 	var c;
	 	for (i=0; i<this.faceUp.length; i++) {
	 		c = this.faceUp[i];
	 		if (c.selected)
	 			result.push(c);
	 	}
	 	return result;
	 }

	/* Deselect all the cards in the column */
	deselectAll() {
		var i = 0;
		for (i=0; i<this.faceUp.length; i++) {
			this.faceUp[i].setSelected(false);
		}
	}

	/* If possible, accept one card and return true.
	 * Otherwise return false */
	acceptCard(c) {
		if (this.faceUp.length > 0) {
			var myBottomCard = this.faceUp[this.faceUp.length-1];
			if (myBottomCard.rank.rankInt == c.rank.rankInt+1 &&
				((myBottomCard.suit.isRed() && !c.suit.isRed() ) ||
				(!myBottomCard.suit.isRed() && c.suit.isRed() ) )   ) {
				myBottomCard.setMode(1);
				c.imgObj.style.left = "0px";
				c.imgObj.style.top = this.yValue + "px";
				this.yValue += 30;
				c.setMode(0);
				this.obj.appendChild(c);
				this.faceUp.push(c);
				return true;
			}
		}
		/* if the column is empty, only accept a king */
		else if (c.rank.rankInt == 13) {
			c.imgObj.style.left = "0px";
			c.imgObj.style.top = "0px";
			this.yValue = 30;
			c.setMode(0);
			this.obj.appendChild(c);
			this.faceUp.push(c);
			this.emptyColumnButton.style.display = "none";
			return true;
		}
		return false; //no conditions met
	}

	/* move cards from one column to another */
	acceptCardsFrom(source) {
		var otherCards = source.getSelectedCards();
		var otherTopCard = otherCards[0];
		var myBottomCard, c, i;

		/* case where column is totally empty and user sends
		 * cards starting with a king */
		if (otherTopCard.rank.rankInt == 13 && this.faceUp.length == 0 && this.faceDown.length == 0) {
			/* accept all the cards */
			for (i=0; i<otherCards.length; i++) {
				c = otherCards[i];
				c.imgObj.style.left = "0px";
				c.imgObj.style.top = this.yValue + "px";
				this.yValue += 30;
				if (i==otherCards.length -1) //last card
					c.setMode(0);
				else
					c.setMode(1);
				this.obj.appendChild(c);
				this.faceUp.push(c);
			}
			this.emptyColumnButton.style.display = "none";
			source.removeSelectedCards();
			return true;
		} else if (this.needsFlipped())
			return false; //need to do a flip
		else if (this.faceUp.length == 0 && this.faceDown.length == 0)
			return false; //both empty but you didn't give a king as in case 1
		else {
			myBottomCard = this.faceUp[this.faceUp.length-1];
			if (myBottomCard.rank.rankInt == otherTopCard.rank.rankInt + 1 &&
				((myBottomCard.suit.isRed() && !otherTopCard.suit.isRed()) ||
				(!myBottomCard.suit.isRed() && otherTopCard.suit.isRed())) ) {
				/* accept all the cards, adding them to the end */
				myBottomCard.setMode(1);
				for (i=0; i<otherCards.length; i++) {
					c = otherCards[i];
					c.imgObj.style.left = "0px";
					c.imgObj.style.top = this.yValue + "px";
					this.yValue += 30;
					if (i==otherCards.length-1)
						c.setMode(0);
					else
						c.setMode(1);
					this.obj.appendChild(c);
					this.faceUp.push(c);
				}
				source.removeSelectedCards();
				return true;
			} 
			else return false;
		}

	}

	removeSelectedCards() {
		var c, i;
		var toBeRemoved = new Array();

		//first find selected, add them to the array and deselect them

		for (i=0; i<this.faceUp.length; i++) {
			c = this.faceUp[i];
			if (c.selected) {
				toBeRemoved.push(c);
				c.setSelected(false);
			}
		}

		//now remove them from faceUp and the internal obj node
		for (i=0; i<toBeRemoved.length; i++) {
			this.faceUp.splice(this.faceUp.indexOf(toBeRemoved[i], 1)); //clever way to remove 1 item at the index of toBeRemoved[i]
			this.obj.removeChild(toBeRemoved[i]);
		}

		if (this.faceUp.length == 0) {
			if (this.faceDown.length > 0)
				this.faceDown[0].setMode(2);
			else
				this.emptyColumnButton.style.display = "block";

		}
		else
			this.faceUp[this.faceUp.length-1].setMode(0);
		/* Reset where cards are printed when you do this */
		this.yValue = HEIGHT_PART_FRONT * this.faceUp.length + HEIGHT_PART_BACK * this.faceDown.length;
	}

	setVisible(flag) {
		if (flag)
			this.obj.style.display = "block";
		else
			this.obj.style.display = "none";
	}






}
