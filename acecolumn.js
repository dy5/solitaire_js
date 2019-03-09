class AceColumn {
	constructor(loc) {
		this.obj = document.createElement("div");
		this.obj.style.position = "absolute";
		this.obj.style.width = "75px";
		this.obj.style.height = "100px";
		this.obj.style.left = loc*75+75*4 + "px";
		this.obj.style.top = "25px";

		this.emptyColumnButton = document.createElement("input");
		this.emptyColumnButton.type = "button";
		this.emptyColumnButton.value = "XX";
		this.emptyColumnButton.style.left = 73/2-25 + "px";
		this.emptyColumnButton.style.top = "20px";
		this.emptyColumnButton.style.width = 50+"px";
		this.emptyColumnButton.style.height = 20+"px";
		this.emptyColumnButton.style.position = "absolute";
		this.emptyColumnButton.parent = this;
		
		this.myPile = new Array();
		this.mySuit = -1;

		this.emptyColumnButton.style.display = "none";
		this.obj.appendChild(this.emptyColumnButton);

	}

	setupOnclick(handler) {
		var self = this;
		this.emptyColumnButton.onclick = function(){handler.doAction(EMPTYACE, self.emptyColumnButton)};
	}


/* Reset the column */
	reset() {
		this.myPile.length = 0; //empty the array
		while (this.obj.firstChild) //empty the column's obj (node)
    		this.obj.removeChild(this.obj.firstChild);
    	this.obj.appendChild(this.emptyColumnButton); //add the empty button back
    	this.emptyColumnButton.style.display = "block";
	}

	/* return the top card of the ace column
	 * if it is empty, returns null */
	getTop() {
		if (this.myPile.length == 0)
			return null;
		else
			return this.myPile[this.myPile.length-1]
	}

/* remove the top card (if any) of the ace column */
	popTop() {
		this.myPile.pop();
		if (this.myPile.length == 0) {
			this.emptyColumnButton.style.display = "block";
			this.mySuit = -1;
		}
	}

/* deselects the (only) selected card of the acecolumn */
	deselectAll() {
		if (this.myPile.length > 0)
			this.getTop().setSelected(false);
	}

/* selects the only selectable card of the ace column */
	selectTop() {
		if (this.myPile.length > 0)
			this.getTop().setSelected(true);		
	}

	/* If a card follows solitaire rules, the ace column accepts
	 * it and returns true.  If not just return false. */

	acceptCard(c) {
		var flag = false;
		if (c.rank.rankInt == 1 && this.isEmpty()) {
			flag = true;
			this.mySuit = c.suit.suitInt;
			this.emptyColumnButton.style.display = "none";

		} else if (this.myPile.length > 0 && c.suit.suitInt == this.mySuit &&
			c.rank.rankInt == this.getTop().rank.rankInt+1) {
			flag = true;
		}

		if (flag) {
			c.outerDiv.onclick = c.aceHandler;
			c.outerDiv.style.position = "absolute";
			c.outerDiv.style.left = "0px";
			c.outerDiv.style.top = "0px";
			c.outerDiv.style.zIndex = this.myPile.length;
			this.myPile.push(c);
			this.obj.appendChild(c.outerDiv);
			c.setParent(this);
		}
		return flag;
	}

	isFull() {
		return this.myPile.length == 13;
	}

	isEmpty() {
		return this.myPile.length == 0;
	}

	setVisible(flag) {
		if (flag)
			this.obj.style.display = "block";
		else
			this.obj.style.display = "none";
	}

}
