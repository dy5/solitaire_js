
/* A deck of 52 playing cards */
class DeckColumn {
	constructor() {
		this.faceUp = new Array();
		this.faceDown = new Array();
		this.drawNum = 1;
		this.obj = document.createElement("div");
		this.obj.style.width = WIDTH*2 + 10 + WIDTH_PART*2 +"px";
		this.obj.style.height = HEIGHT + "px";
		this.obj.style.position = "absolute";
		this.obj.style.left = "20px";
		this.obj.style.top = "25px";

		this.emptyColumnButton = document.createElement("input");
		this.emptyColumnButton.type = "button";
		this.emptyColumnButton.value = "XX";

		this.emptyColumnButton.style.width = 50+"px";
		this.emptyColumnButton.style.height = 20+"px";
		this.emptyColumnButton.style.position = "absolute";
		this.emptyColumnButton.style.left = WIDTH/2-25 + "px";
		this.emptyColumnButton.style.top = HEIGHT/2-10+"px";
		this.emptyColumnButton.style.display = "none";
		this.emptyColumnButton.parent = this;
		//this.emptyColumnButton.onclick = function(){this.doAction(EMPTYDECKCOLUMN, this.emptyColumnButton)};

	}

	setupOnclick(handler) {
		this.emptyColumnButton.onclick = function(){handler.doAction(EMPTYDECKCOLUMN, this.emptyColumnButton)};
	}

	/* set the draw number */
	setDrawNum(d) {
		this.drawNum = d;
	}

/* Reset the column */
	reset() {
		this.faceDown.length = 0; //empty the array
		this.faceUp.length = 0;
		while (this.obj.firstChild) //empty the column's obj (node)
    		this.obj.removeChild(this.obj.firstChild);
    	this.obj.appendChild(this.emptyColumnButton); //add the empty button
    	this.emptyColumnButton.style.display = "none";
	}

	firstRun() {
		this.resetDeck(0);
	}

	flip() {
		if (this.drawNum==1 || this.faceUp.length + this.faceDown.length < 3)
			return this.drawOne();
		else
			return this.drawThree(3, 10+WIDTH);
	}

	//acceptDealtCard(c, handler1, handler2) {
	acceptDealtCard(c, sol) {
		if (c) {
			// var makeHandler = function(what, who) {
			// 	return function() {
			// 		sol.doAction(what, who);
			// 	};
			// };
			// c.fdHandler = makeHandler(DECKFACEDOWN, c);
			// c.fuHandler = makeHandler(DECKFACEUP, c);
			var obj = c;
			c.imgObj.onclick = c.fdHandler;
			c.imgObj.style.position = "absolute";
			c.imgObj.style.left = "0px";
			c.imgObj.style.top = "0px";
			c.setMode(2);
			this.obj.appendChild(c.imgObj);
			this.faceDown.push(c);
			return true;
		}
		else
			return false;
	}

	selectTop() {
		if (this.faceUp.length>0) {
			this.faceUp[0].setSelected(true);
			return true;
		} else
			return false;
	}

	getSelected() {
		if (this.faceUp.length > 0 && this.faceUp[0].selected) {
			return this.faceUp[0];
		}
		else return null;
	}

	/* remove the selected (top card) of the deck */
	removeSelected() {
		var c = this.getSelected();
		if (c) {
			//this.obj.removeChild(c);
			this.faceUp.splice(this.faceUp.indexOf(c), 1);
		}
		if (this.faceUp.length > 0) {
			this.faceUp[0].setMode(0);
		}
	}

	/* deselect the top card of the deck */
	deselectAll() {
		if (this.faceUp.length > 0) {
			this.faceUp[0].setSelected(false);
			return true;
		}
		return false;
	}

	/* the deck is reset (cards from faceup put into facedown)
	 * except for N cards that are kept in faceup */
	resetDeck(N) {
		var c;
		if (this.faceDown.length > 0 || this.faceUp.length > 0) {
			this.emptyColumnButton.style.display = "none";
			while (this.faceUp.length > N) {
				c = this.faceUp.pop();
				c.setMode(2);
				c.imgObj.style.position = "absolute";
				c.imgObj.style.left = "0px";
				c.imgObj.style.top = "0px";
				c.imgObj.onclick = c.fdHandler;
				//c.imgObj.onclick = function(){this.theHandler.doAction(DECKFACEDOWN, c)};
				this.faceDown.push(c);

			}
			//do we need?
			//this.faceDown[0].setVisitiblealsdfjei(true);

			return true;
		}
		return false;
	}

	/* method for drawing 1 card */
	drawOne() {
		var c;
		if (this.faceDown.length == 0)
			return this.resetDeck(0);
		else {
			//if (this.faceUp.length > 0)
			c = this.faceDown.shift(); //remove element 0
			c.setMode(0);
			c.imgObj.style.position = "absolute";
			c.imgObj.style.left = WIDTH+10+"px";
			c.imgObj.style.top = "0px";
			//c.imgObj.onclick = function(){this.theHandler.doAction(DECKFACEUP, c)};
			c.imgObj.onclick = c.fuHandler;
			this.faceUp.unshift(c); //add to the beginning
			if (this.faceDown.length == 0) {
				this.emptyColumnButton.style.display = "block";
			}
			return true;

		}
	}

	/* method for drawing three cards
	 * Note: if only 2 cards are left in the facedown
	 * pile, this method will draw both of them,
	 * then reset the deck, leaving those 2 and then draw
	 * the third one. This is a recursive function. */

	drawThree(C, cardx) {
		var c, counter = 3-C, i;
		for (i=0; i<this.faceUp.length && i<3 && C==3; i++) {
			this.faceUp[i].imgObj.style.position = "absolute";
			this.faceUp[i].imgObj.style.left = WIDTH+10+"px";
			this.faceUp[i].imgObj.style.top = "0px";
		}

		while(this.faceDown.length > 0 && counter<3) {
			c = this.faceDown.shift();
			c.setMode(4);
			c.imgObj.style.position = "absolute";
			c.imgObj.style.left = cardx+"px";
			c.imgObj.style.top = "0px";
			cardx += WIDTH_PART;
			//c.imgObj.onclick = function(){this.theHandler.doAction(DECKFACEUP, c)};
			c.imgObj.onclick = c.fuHandler;
			this.faceUp.unshift(c);
			counter++;
		}

		if (counter<3) {
			if (this.faceUp.length >= 3)
				this.resetDeck(counter);
			else
				this.resetDeck(0);
			return this.drawThree(3-counter, cardx); //recursive call
		} else {
			if (this.faceUp.length > 0)
				this.faceUp[0].setMode(0);

			if (this.faceDown.length > 0) {
				//facedown element 0 set visible to true?
			} else {
				this.emptyColumnButton.style.display = "block";
			}
		}

		for (i=0; i<this.faceUp.length; i++) {
			this.faceUp[i].imgObj.style.zIndex = this.faceUp.length - i; //set card 0 to be on top, 1 to be next, etc
		}
		return true;
	}

	setVisible(flag) {
		if (flag)
			this.obj.style.display = "block";
		else
			this.obj.style.display = "none";
	}

}



