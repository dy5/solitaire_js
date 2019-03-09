

var WIDTH = 73, HEIGHT = 97; /* normal card */
var HEIGHT_PART_FRONT = 30; /* part of top of face up card */
var HEIGHT_PART_BACK = 5; /* part of top of face down card */
var WIDTH_PART = 25; /* part of side of draw three card */


//Defines the suits of playing cards
//Let's arbitrarily agree on these values:
//0 = spades
//1 = diamonds
//2 = clubs
//3 = hearts

class Suit {
	constructor(suitInt) {
		this.suitInt = suitInt;
		switch (this.suitInt) {
		case 0: this.suitString = "Clubs"; break;
		case 1: this.suitString = "Diamonds"; break;
		case 2: this.suitString = "Spades"; break;
		case 3: this.suitString = "Hearts"; break;
		default: this.suitString = "Invalid Suit";
		}
		this.suitImgCode = this.suitString.substring(0,1).toLowerCase(); //first letter of suit name to lowercase
	}

	isRed() {
		if (this.suitInt % 2 == 1)
			return true;
		else
			return false;
	}
}

class Rank {
	constructor(rankInt) {
		this.rankInt = rankInt;
		switch (this.rankInt) {
			case 1: this.rankString = "Ace"; break;
			case 10: this.rankString = "Ten"; break;
			case 11: this.rankString = "Jack"; break;
			case 12: this.rankString = "Queen"; break;
			case 13: this.rankString = "King"; break;
			default: this.rankString = String(rankInt);
		}
		this.rankImgCode = this.rankString.substring(0,1).toLowerCase();
	}
}

class Card {
	constructor(rank, suit) {
		this.rank = rank;
		this.suit = suit;
		this.selected = false;
		this.outerDiv = document.createElement("div");
		//this.backImgPath = imgPath + "b.gif";
		//this.frontImgPath = imgPath + this.rank.rankImgCode + this.suit.suitImgCode + ".gif";
		this.parent = null;
	}

	setUpHandlers(sol) {
		var makeHandler = function(what, who) {
			return function() {
				sol.doAction(what, who);
			};
		};
		this.fdHandler = makeHandler(DECKFACEDOWN, this);
		this.fuHandler = makeHandler(DECKFACEUP, this);
		this.aceHandler = makeHandler(ACECOLUMN, this);
		this.colHandler = makeHandler(COLUMN, this);
	}


	setParent(obj) {
		this.parent = obj;
	}

	getParent() {
		return this.parent;
	}
	/* Sets the size and image the card.
	 * 0 is a full size front
	 * 1 is the top part the front
	 * 2 is the full size back
	 * 3 is the top sliver of the back
	 * 4 is the left side of the front
	 */
	setMode(mode) {
		this.theMode = mode;
		switch (mode) {
			case 0:

			this.backImg.style.display="none";
			this.frontImg.style.display = "block";
			this.frontImg.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT+"px, "+0+"px)";
			this.outerDiv.style.height = HEIGHT+"px";
			this.outerDiv.style.width = WIDTH+"px";

			break;
			case 1:
			this.backImg.style.display="none";
			this.frontImg.style.display = "block";
			this.frontImg.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT_PART_FRONT+"px, "+0+"px)";
			this.frontImg.style.position="absolute";
			this.outerDiv.style.height = HEIGHT_PART_FRONT+"px";
			this.outerDiv.style.width = WIDTH+"px";
			break;
			case 2:
			this.frontImg.style.display = "none";
			this.backImg.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT+"px, "+0+"px)";
			this.backImg.style.position="absolute";
			this.backImg.style.display="block";
			this.outerDiv.style.height = HEIGHT+"px";
			this.outerDiv.style.width = WIDTH+"px";
			break;
			case 3:
			this.frontImg.style.display = "none";
			this.backImg.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT_PART_BACK+"px, "+0+"px)";
			this.backImg.style.position="absolute";
			this.backImg.style.display="block";
			this.outerDiv.style.height = HEIGHT_PART_BACK+"px";
			this.outerDiv.style.width = WIDTH+"px";
			break;
			case 4:
			this.backImg.style.display="none";
			this.frontImg.style.display = "block";
			this.frontImg.style.clip="rect("+0+"px, "+WIDTH_PART+"px, "+HEIGHT+"px, "+0+"px)";
			this.frontImg.style.position="absolute";
			this.outerDiv.style.height = HEIGHT+"px";
			this.outerDiv.style.width = WIDTH_PART+"px";
			break;
		default:
			alert("Invalid card mode");
		}
	}

	setSelected(flag) {
		if (flag) {
			this.outerDiv.style.border = "2px solid #0000FF";
			this.selected = true;
		} else {
			this.outerDiv.style.border = "none";
			this.selected = false;
		}
	}


}
