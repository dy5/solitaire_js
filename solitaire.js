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
		this.btnDeal.onclick = function(){this.showGame(false)};

		this.btnReset = document.createElement("input");
		this.btnReset.name = "reset";
		this.btnReset.type = "button";
		this.btnReset.value = "Reset";
		this.btnReset.style.width = "75px";
		this.btnReset.style.height = "17px";
		this.btnReset.style.position = "absolute";
		this.btnReset.style.left = "545px";
		this.btnReset.style.top = "0px";
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

	}

	dealGame(type) {
		var i, j, c;
		this.deck.populate();
		console.log(this.deck.myPile.length);
		this.deck.shuffle();

		for (i=0; i<7; i++) {
			this.column[i].reset();
			for (j=0; j<i+1; j++) {
				c = this.deck.popTop();
				this.column[i].acceptDealtCard(c);
			}
			this.column[i].flip();
		}
		this.numFullAces = 0;

		for (i=0; i<4; i++)
			this.aceColumn[i].reset();

		this.deckColumn.reset();

		while (!this.deck.isEmpty()) {
			c = this.deck.popTop();
			this.deckColumn.acceptDealtCard(c);
		}

		this.deckColumn.firstRun();
		this.deckColumn.setDrawNum(type);

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

}