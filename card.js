

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
		case 0: this.suitString = "Spades"; break;
		case 1: this.suitString = "Diamonds"; break;
		case 2: this.suitString = "Clubs"; break;
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
		this.imgObj = document.createElement("img");
		this.backImgPath = "images/b.gif";
		this.frontImgPath = "images/" + this.rank.rankImgCode + this.suit.suitImgCode + ".gif";
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
		this.imgObj.height = HEIGHT;
		this.imgObj.width = WIDTH;
		switch (mode) {
			case 0:
			this.imgObj.src = this.frontImgPath;
			this.imgObj.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT+"px, "+0+"px)";
			this.imgObj.style.position="absolute";
			break;
			case 1:
			this.imgObj.src = this.frontImgPath;
			this.imgObj.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT_PART_FRONT+"px, "+0+"px)";
			this.imgObj.style.position="absolute";
			break;
			case 2:
			this.imgObj.src = this.backImgPath;
			this.imgObj.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT+"px, "+0+"px)";
			this.imgObj.style.position="absolute";
			break;
			case 3:
			this.imgObj.src = this.backImgPath;
			this.imgObj.style.clip="rect("+0+"px, "+WIDTH+"px, "+HEIGHT_PART_BACK+"px, "+0+"px)";
			this.imgObj.style.position="absolute";
			break;
			case 4:
			this.imgObj.src = this.frontImgPath;
			this.imgObj.style.clip="rect("+0+"px, "+WIDTH_PART+"px, "+HEIGHT+"px, "+0+"px)";
			this.imgObj.style.position="absolute";
			break;
		default:
			alert("Invalid card mode");
		}
	}

	setSelected(flag) {
		if (flag) {
			this.imgObj.style.border = "2px solid #0000FF";
			this.selected = true;
		} else {
			this.imgObj.style.border = "none";
			this.selected = false;
		}
	}




}

// function loadgame() {
// 	var testcardimg = document.getElementById("testcard");
// 	var testcard = new Card(new Rank(1), new Suit(0), testcardimg);
// 	testcard.setMode(0);
// }