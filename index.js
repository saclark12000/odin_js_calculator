// Keypad setup

const keypadEnum = {
    "0,0":"⌫", "0,1":"", "0,2":"", "0,3":"CLR",
    "1,0":"7", "1,1":"8", "1,2":"9", "1,3":"÷",
    "2,0":"4", "2,1":"5", "2,2":"6", "2,3":"x",
    "3,0":"1", "3,1":"2", "3,2":"3", "3,3":"-",
    "4,0":"0", "4,1":".", "4,2":"=", "4,3":"+",
}

const defaultMessage = "JS Calculator";

function initKeypad(width, height){
    const keypadContainer = document.querySelector('#keypad');
    let keypadGrid = ""
    for (h=0; h<height; h++){
        keypadGrid += "<div class='row' id='row-" + h +"'>";
        for(w=0; w<width; w++){
            let id = h + "," + w
            keypadGrid += "<div class='cell" + (keypadEnum[id] ? " active' onClick='buttonHandler(id)' " : "' ") +  "id='" + id + "'>" + keypadEnum[id] +" </div>"
        }
        keypadGrid += "</div>";
    }
    keypadContainer.innerHTML = keypadGrid;

}

let userInput = {"a":"", "operator":"", "b":"", "allowInput":true, "displayMessage":""};

function buttonHandler(id){
    const currInput = keypadEnum[id];
    console.log( currInput );
    if(currInput.search(/[CLR]/) != -1){
        userInput = {"a":"", "operator":"", "b":"", "allowInput":true, "displayMessage":defaultMessage};
    } else if(userInput["allowInput"]){
        if(currInput.search(/[⌫]/) != -1){
            console.log("⌫")
            if(userInput["a"] != "" && userInput["operator"] != "" && userInput["b"] != ""){
                userInput["b"] = userInput["b"].slice(0, userInput["b"].length - 1);
            } else if(userInput["a"] != "" && userInput["operator"] != "" && userInput["b"] == ""){
                userInput["operator"] = "";
            } else if(userInput["a"] != "" && userInput["operator"] == "" && userInput["b"] == ""){
                userInput["a"] = typeof(userInput["a"]) == "string"
                    ? userInput["a"].slice(0, userInput["a"].length - 1)
                    : userInput["a"];
            } else {
                userInput["displayMessage"] = defaultMessage;
            }
        }else if (currInput.search(/[+,\-,x,÷,\=]/) != -1){
            console.log('operator');
            if (userInput["a"] != "" && userInput["b"] == ""){
                userInput["operator"] = currInput != "=" ? currInput : userInput["operator"];
            } else if (userInput["a"] != "" && userInput["b"] != ""){
                switch(userInput["operator"]) {
                    case "+":
                        console.log('add');
                        userInput["a"] = add(parseFloat(userInput["a"]), parseFloat(userInput["b"]));
                        userInput["operator"] = currInput != "=" ? currInput : "";
                        userInput["b"] = "";
                        break;
                    case "-":
                        console.log('subtract');
                        userInput["a"] = subtract(parseFloat(userInput["a"]), parseFloat(userInput["b"]));
                        userInput["operator"] = currInput != "=" ? currInput : "";
                        userInput["b"] = "";
                        break;
                    case "x":
                        console.log('multiply');
                        userInput["a"] = multiply(parseFloat(userInput["a"]), parseFloat(userInput["b"]));
                        userInput["operator"] = currInput != "=" ? currInput : "";
                        userInput["b"] = "";
                        break;
                    case "÷":
                        console.log('divide');
                        userInput["a"] = divide(parseFloat(userInput["a"]), parseFloat(userInput["b"]));
                        userInput["operator"] = currInput != "=" ? currInput : "";
                        userInput["b"] = "";
                        break;
                    default:
                        console.log('default');
                }
            }
        } else if (currInput.search(/\d/) != -1){ 
            console.log('digit');
            if (userInput["operator"] == "") {
                console.log(typeof(userInput["a"]));
                userInput["a"] = typeof(userInput["a"]) === "string" ? userInput["a"].concat(currInput) : currInput;
            } else {
                userInput["b"] = userInput["b"].concat(currInput);
            }
        } else if (currInput.search(/\./) != -1){ 
            console.log('decimal');
            if (userInput["operator"] == "") {
                if (typeof(userInput["a"]) === "string") {
                    userInput["a"] = userInput["a"].search(/\./) === -1 ? userInput["a"].concat(currInput) : userInput["a"];
                } else {
                    userInput["a"] = currInput;
                }
            } else {
                if (userInput["b"].search(/\./) === -1) {
                    userInput["b"] = userInput["b"].concat(currInput);
                }
            }
        };

        // Display message update
        const message = (`${userInput["a"]} ${userInput["operator"]} ${userInput["b"]} `).trim();
        userInput["displayMessage"] = message != "" ? message : defaultMessage

    } else {
    }
    console.log(userInput);
    initDisplay(userInput["displayMessage"]);
}

function initDisplay(message) {
    const display = document.querySelector('#display');
    console.log('message length: ', message.length)

    if (message.length>=30){
        userInput = {"a":"", "operator":"", "b":"", "allowInput":false, "displayMessage":"Display Error, Press CLR"};
    }

    display.style.fontSize = message.length >= 9 ? "16px" : "32px"
    display.innerHTML = message;
}

function add (...addends) {
	let ans = 0;
	addends.forEach( addend => ans += addend )
	return ans;
}

function subtract (...nums) {
	let ans;
	nums.forEach( subtrahend => {
		if (ans != undefined) {
			ans -= subtrahend;
		} else {
			ans = subtrahend
		}
	})
	return ans;
}

function sum (...addends) {
	let ans = 0;
	addends.forEach( addend => ans += addend )
	return ans;
}

function multiply (...nums) {
	let ans;
	nums.forEach( num => {
		if (ans != undefined) {
			ans *= num;
		} else {
			ans = num
		}
	})
	return ans;
}

function divide (...nums){
    let ans;
    if (nums[1] != 0) {
        nums.forEach( num => {
            if (ans != undefined) {
                ans /= num;
            } else {
                ans = num;
            }
        })
        return ans;
    } else {
        userInput["allowInput"] = false;
        return `Divsion by 0 error, Press CLR`;
    }
}

function power(a,b){
	let ans;
	for(i = 0; i<b; i++){
		if (ans != undefined) {
			ans *= a;
		} else {
			ans = a;
		}
	}
	return ans;
}

function factorial(a) {
	let ans;
	for(i = a; i>0; i--){
		if (ans != undefined) {
			ans *= i;
		} else {
			ans = a;
		}
	}
	return ans ? ans : 1;	
}

initKeypad(4, 5);
initDisplay(defaultMessage);
