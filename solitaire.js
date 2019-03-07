//State enum:
var NOTHINGSELECTED = 0;
var COLUMNSELECTED = 1;
var ACESELECTED = 2;
var DECKSELECTED = 3;
var PREGAME = 4;

//WhatClicked enum:
var ACECOLUMN = 0;
var COLUMN = 1;
var EMPTYCOLUMN = 2;
var EMPTYACE = 3;
var DECKFACEUP = 4;
var DECKFACEDOWN = 5;
var EMPTYDECKCOLUMN = 6;

//need card.getParent
//need empty button.getParent
class Solitaire {
	constructor() {
		//set up the html object (should be a div for column)
		this.obj = document.createElement("div");
		this.obj.style.width = "625px";
		this.obj.style.height = "600px";
		this.obj.style.position = "absolute";
		this.obj.style.left = "0px";
		this.obj.style.top = "0px";

		//this.obj.style.border = "thick solid #0000FF";

		//setup facedown and faceup card arrays
		this.column = new Array();
		this.aceColumn = new Array();
		this.deck = new Deck();
		this.deckColumn = new DeckColumn();
		this.obj.appendChild(this.deckColumn.obj);

		/* initialize columns */
		var i, j, c, tmp;
		for (i=0; i<7; i++) {
			tmp = new Column(i+1);
			this.column.push(tmp);
			this.obj.appendChild(tmp.obj);
		}

		/* initialize ace columns */
		for (i=0; i<4; i++) {
			tmp = new AceColumn(i);
			this.aceColumn.push(tmp);
			this.obj.appendChild(tmp.obj);
		}

		/* initalize the deck column */
		this.obj.appendChild(this.deckColumn.obj);

		/* initialize the beginning menu */
		this.drawOne = document.createElement("input");
		this.drawOne.name = "game_type";
		this.drawOne.type = "radio";
		this.drawOne.value = 1;
		this.drawThree = document.createElement("input");
		this.drawThree.name = "game_type";
		this.drawThree.type = "radio";
		this.drawThree.value = 3;
		this.btnDeal = document.createElement("input");
		this.btnDeal.name = "deal";
		this.btnDeal.type = "button";
		this.btnDeal.value = "Deal";
		var self = this;
		this.btnDeal.onclick = function(){self.doAction("deal", self.btnDeal)};
		//this.btnDeal.onclick = self.doAction;
		//console.log(this.btnDeal.onclick);

		this.btnReset = document.createElement("input");
		this.btnReset.name = "reset";
		this.btnReset.type = "button";
		this.btnReset.value = "Reset";
		this.btnReset.style.width = "75px";
		this.btnReset.style.height = "17px";
		this.btnReset.style.position = "absolute";
		this.btnReset.style.left = "545px";
		this.btnReset.style.top = "0px";
		this.btnReset.onclick = function(){self.doAction("reset", null)};
		//this.btnReset.onclick = this.dealGame(1);


		this.selectPanel = document.createElement("p");
		this.selectPanel.style.border = "thick solid #0000FF";
		this.selectPanel.style.width = "200px";
		this.selectPanel.style.height = "100px";
		this.selectPanel.style.position = "absolute";
		this.selectPanel.style.left = "200px";
		this.selectPanel.style.top = "200px";

		this.selectPanel.appendChild(this.drawOne);
		this.selectPanel.appendChild(this.drawThree);
		this.selectPanel.appendChild(this.btnDeal);

		this.obj.appendChild(this.selectPanel);
		this.obj.appendChild(this.btnReset);

		this.setNewState(PREGAME, null);
		this.numFullAces = 0;

	}

	dealGame(type) {
		var self = this;
		var i, j;
		this.deck.populate();
		//console.log(this.deck.myPile.length);
		this.deck.shuffle();
		var makeHandler = function(what, who) {
			return function() {
				self.doAction(what, who);
			};
		};

		for (i=0; i<7; i++) {
			this.column[i].reset();
			for (j=0; j<i+1; j++) {
				var c = this.deck.popTop();
				c.setParent(self.column[i]);
				var makeHandler
				//c.imgObj.onclick = function(){self.doAction(COLUMN, c);};
				c.imgObj.onclick = makeHandler(COLUMN, c);
				this.column[i].acceptDealtCard(c);
				//console.log(c);
			}
			this.column[i].flip();
			this.column[i].setupOnclick(self); //help him set up his empty buttons
		}
		this.numFullAces = 0;

		for (i=0; i<4; i++) {
			this.aceColumn[i].reset();
			this.aceColumn[i].setupOnclick(self); //help him set up his empty buttons
		}

		this.deckColumn.reset();

		while (!this.deck.isEmpty()) {
			var c = this.deck.popTop();
			c.setParent(self.deckColumn);
			this.deckColumn.acceptDealtCard(c, makeHandler(DECKFACEDOWN, c), makeHandler(DECKFACEUP, c)); //send in "this" so he can set his onclick up
		}

		this.deckColumn.firstRun();
		this.deckColumn.setDrawNum(type);
		this.deckColumn.setupOnclick(self); //help him set up his empty buttons

	}

	showGame(flag) {
		var i;
		for (i=0; i<7; i++) {
			this.column[i].setVisible(flag);
		}
		for (i=0; i<4; i++) {
			this.aceColumn[i].setVisible(flag);
		}
		this.deckColumn.setVisible(flag);
		//this.btnReset
		this.setSelectPanelVisible(!flag);
	}

	setSelectPanelVisible(flag) {
		if (flag)
			this.selectPanel.style.display = "block";
		else
			this.selectPanel.style.display = "none";
	}

	doAction(whatClicked, obj) {
		var col1, col2, acecol, btn, card;
		console.log("WhatClicked: "+whatClicked+" Obj: "+obj+" Current State: "+this.state);
		console.log(obj);

		if (whatClicked == "reset") {
			this.setNewState(PREGAME, null);
			return;
		}

		switch (this.state) {
			case NOTHINGSELECTED: //nothing is selected
				switch (whatClicked) {
					case COLUMN: //if nothing is selected and user clicked a column
						card = obj;
						if (card.theMode != 3)
							this.setNewState(COLUMNSELECTED, card);
						else
							this.setNewState(NOTHINGSELECTED, null);
						break;
					case ACECOLUMN: //if nothing is selected and user clicked an acecolumn
						card = obj;
						this.setNewState(ACESELECTED, card);
						break;
					case EMPTYDECKCOLUMN:
						this.deckColumn.flip();
						this.setNewState(NOTHINGSELECTED, null);
						break;
					case DECKFACEDOWN:
						this.deckColumn.flip();
						this.setNewState(NOTHINGSELECTED, null);
						break;
					case DECKFACEUP:
						card = obj;
						if (card.theMode == 0)
							this.setNewState(DECKSELECTED, card);
						else
							this.setNewState(NOTHINGSELECTED, null);
						break;
					default:
						this.setNewState(NOTHINGSELECTED, null);
				} //end inner switch
				break;

			case COLUMNSELECTED: //cards in a column are selected
				switch (whatClicked) {
					case COLUMN:
						card = obj;
						col1 = this.oldCard.getParent(); //source
						col2 = card.getParent(); //destination
						if (card == this.oldCard && col2.isLast(card)) { //double clicked same card
							if (this.moveAce(null, this.oldCard)) //move to correct ace and return true if did
								col1.removeSelectedCards();
						}
						else
							this.move(col1, col2); //TRY to move, will return false if fails
						break;
					case ACECOLUMN:
						card = obj;
						col1 = this.oldCard.getParent();
						acecol = card.getParent();
						if (this.moveAce(acecol, oldCard))
							col1.removeSelectedCards();
						break;
					case EMPTYCOLUMN:
						btn = obj;
						col1 = this.oldCard.getParent();
						col2 = btn.getParent();
						this.move(col1, col2);
						break;
					case EMPTYACE:
						btn = obj;
						col1 = this.oldCard.getParent();
						acecol = btn.getParent();
						if (this.moveAce(acecol, oldCard))
							col1.removeSelectedCards();
						break;
				} //end of inner switch
				this.setNewState(NOTHINGSELECTED, null);
				break;
			case ACESELECTED: //card in ace column is selected
				switch (whatClicked) {
					case COLUMN:
						card = obj;
						col1 = card.getParent();
						acecol = this.oldCard.getParent();
						this.moveFromAce(acecol, col1);
						break;
					case EMPTYCOLUMN:
						btn = obj;
						col1 = btn.getParent();
						acecol = this.oldCard.getParent();
						this.moveFromAce(acecol, col1);
						break;
					case EMPTYACE:
						btn = obj;
						acecol = btn.getParent();
						var source = this.oldCard.getParent();
						this.moveFromAcetoAce(source, acecol);
						break;
				} //end of inner switch
				this.setNewState(NOTHINGSELECTED, null);
				break;
			case DECKSELECTED: //card in the deck column is selected
				switch (whatClicked) {
					case COLUMN:
						card = obj;
						col1 = card.getParent();
						if (this.moveCardtoCol(this.oldCard, col1))
							this.deckColumn.removeSelected();
						break;
					case EMPTYCOLUMN:
						btn = obj;
						col1 = btn.getParent();
						if (this.moveCardtoCol(this.oldCard, col1))
							this.deckColumn.removeSelected();
						break;
					case ACECOLUMN:
						card = obj;
						acecol = card.getParent();
						if (this.moveAce(acecol, this.oldCard))
							this.deckColumn.removeSelected();
						break;
					case EMPTYACE:
						btn = obj;
						acecol = btn.getParent();
						if (this.moveAce(acecol, this.oldCard))
							this.deckColumn.removeSelected();
						break;
					case DECKFACEUP: //double clicked card in deck column
						if (this.moveAce(null, this.oldCard))
							this.deckColumn.removeSelected();
						break;
				} //end of inner switch
				this.setNewState(NOTHINGSELECTED, null);
				break;
			case PREGAME:
				var k;
				if (this.drawOne.selected)
					k = 1;
				else
					k = 3;
				this.dealGame(k);
				this.showGame(true);
				this.setNewState(NOTHINGSELECTED, null);
				break;
		} //end of outer switch

	} //end of doAction

	setNewState(state, card) {
		this.state = state;
		var col, acecol, i;
		switch (state) {
			case NOTHINGSELECTED:
				for (i=0; i<7; i++)
					this.column[i].deselectAll();
				for (i=0; i<4; i++)
					this.aceColumn[i].deselectAll();
				this.deckColumn.deselectAll();
				this.oldCard = null;
				if (this.numFullAces == 4)
					this.declareWinner();
				break;
			case COLUMNSELECTED:
				this.oldCard = card;
				col = card.getParent();
				if (col.needsFlipped()) {
					col.flip();
					this.setNewState(NOTHINGSELECTED, null);
				}
				else
					col.selectCardsRelatedTo(card);
				break;
			case ACESELECTED:
				this.oldCard = card;
				acecol = card.getParent();
				acecol.selectTop();
				break;
			case DECKSELECTED:
				this.oldCard = card;
				this.deckColumn.selectTop();
				break;
			case PREGAME:
				this.showGame(false);
				break;
		} //end switch
	} //end setNewState

	/* move cards from source column to destination column */
	move(source, dest) {
		return dest.acceptCardsFrom(source);
	}

	/* move one card (from the deck column) to a column */	
	moveCardtoCol(sourceCard, dest) {
		return dest.acceptCard(sourceCard);
	}

	/* move card to ace. if acecol is null, move it to the correct one */
	moveAce(acecol, card) {
		var flag = false;

		if (acecol == null) { //try to put it in first one that accepts it
			var i;
			for (i=0; i<4; i++) {
				flag = this.aceColumn[i].acceptCard(card);
				if (flag)
					break;
			}
			if (i<4 && this.aceColumn[i].isFull())
				this.numFullAces++;
		} else { //try to put in specified one
			flag = acecol.acceptCard(card);
			if (acecol.isFull())
				this.numFullAces++;
		}
		return flag;
	}
	/* move cards from the acecolumn to the column */
	moveFromAce(acecol, col) {
		if (col.acceptCard(acecol.getTop())) {
			if (acecol.getTop().rank.rankInt == 13) //idiot pulled a king off
				this.numFullAces--;
			acecol.popTop();
			return true;
		} else 
			return false;
	}

	/* move card (must be an ace!) from one acecolumn to another */
	moveFromAcetoAce(source, dest) {
		if (this.moveAce(dest, source.getTop())) {
			source.popTop();
			return true;
		}
		return false;
	}

	/* display an alert or someting declaring the user the winner */
	declareWinner() {
		alert('You WON!!!');
		this.setNewState(PREGAME, null);
	}






} //end of class

