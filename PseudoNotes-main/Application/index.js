const { create } = require("domain");
const { ipcRenderer } = require("electron");
const fs = require("fs");

let currentFilePath = "";

let isClass = true;

let isrename = false;

let currFold = "";

let openedFilePath = "";

let lastItemRightclicked;

if (!fs.existsSync("./classes")){
    fs.mkdirSync("./classes");
}

  window.addEventListener("click",function() {
	document.getElementById("context-menu").classList.remove("active");
  });

// get textarea div
const textElem = document.getElementById("texthere");

// context menu

document.getElementById('delete').addEventListener('click', () => {
	console.log("dafsdfasdf");
	if(isClass === true) {
		fs.rmdirSync(currentFilePath, { recursive: true });
	} else {
		fs.unlinkSync(currentFilePath + ".docx");
	}

	lastItemRightclicked.remove();
});

document.getElementById('rename').addEventListener('click', () => {
	isrename = true;
	const popup = document.getElementById("popup");
	openPopup(popup);
});

// when a file is saved
ipcRenderer.on("saveFile", (event) => {
	
    const valueOfTexthere = textElem.innerHTML;
	if(openedFilePath != "") {
		fs.writeFileSync(openedFilePath, valueOfTexthere, "utf-8");
	}
});

// get textarea div
let output = document.getElementById('texthere');
let buttons = document.getElementsByClassName('tool--btn');

// when a text button is clicked
for (let btn of buttons) {
	btn.addEventListener('click', () => {
		let cmd = btn.dataset['command'];
		if(cmd === 'createlink') {
			let url = prompt("Enter the link here: ", "http:\/\/");
			document.execCommand(cmd, false, url);
		} else {
			document.execCommand(cmd, false, null);
		}
        output.focus();
	});
}

let filebar = document.getElementById("filebar");

//create file buttons

function generate() {
	let newClass = document.createElement("button");

	newClass.addEventListener('click', () => {
		const popup = document.getElementById("popup");
		openPopup(popup);
	});

	newClass.id = "new_class";

	newClass.innerHTML = "New Class +";

	filebar.appendChild(newClass);

	fs.readdir('./classes/', (err, files) => {
		files.forEach(file => {
	  
		  let button = document.createElement("button");
		  button.className = "class";
		  button.innerHTML = file;
		  filebar.appendChild(button);
	  
		  //when class is right clicked

		  button.addEventListener("contextmenu", function(event) {
			event.preventDefault();
			lastItemRightclicked = button;
			currentFilePath = "./classes/" + lastItemRightclicked.innerHTML;
			console.log(currentFilePath);
			var contextElement = document.getElementById("context-menu");
			contextElement.style.top = event.clientY + "px";
			contextElement.style.left = event.clientX + "px";
			contextElement.classList.add("active");
		  });

		  
		  //when class is clicked
		  button.addEventListener('click', () => {
			const valueOfTexthere = textElem.innerHTML;
			if (openedFilePath != "") {
				fs.writeFileSync(openedFilePath, valueOfTexthere, "utf-8");
			}

			  isClass = false;
	  
			  console.log("1");
	  
			  filebar.innerHTML = "";
	  
			  currFold = button.innerHTML;
	  
			  let newText = document.createElement("button");
			  newText.classList = "newFile";
			  newText.innerHTML = "New File";
	  
			  let back = document.createElement("button");
			  back.classList = "back";
			  back.innerHTML = "Back";
	  
			  filebar.appendChild(back);
			  filebar.appendChild(newText);
	  
			  back.addEventListener("click", () => {
					const valueOfTexthere = textElem.innerHTML;
					if(openedFilePath != "") {
						fs.writeFileSync(openedFilePath, valueOfTexthere, "utf-8");
					}

					isClass = true;
				  	filebar.innerHTML = "";
				  	generate();
			  });
	  
			  newText.addEventListener("click", () => {
				  const popup = document.getElementById("popup");
				  openPopup(popup);
			  });
			  //load the files onto the side bar
	  
			  try {
				  fs.readdir('./classes/' + file, (err, files) => {
					try {
					  	files.forEach(file1 => {
							let button = document.createElement("button");
							button.className = "note";
							button.innerHTML = file1.substring(0, file1.indexOf("."));
							filebar.appendChild(button);

							//when file is right clicked
							button.addEventListener("contextmenu",function(event){
								event.preventDefault();
								lastItemRightclicked = button;
								currentFilePath = "./classes/" + currFold + "/" + button.innerHTML;
								console.log(currentFilePath);
								var contextElement = document.getElementById("context-menu");
								contextElement.style.top = event.clientY + "px";
								contextElement.style.left = event.clientX + "px";
								contextElement.classList.add("active");
							  });

							//when file is clicked
							button.addEventListener("click", () => {
								if(currentFilePath != "") {
									const valueOfTexthere = textElem.innerHTML;
									console.log(valueOfTexthere + "777" + currentFilePath);
									fs.writeFileSync(currentFilePath, valueOfTexthere, "utf-8");
								}
								currentFilePath = "./classes/" + currFold + "/" + file1;
							  	console.log("./classes/" + currFold + "/" + file1);
							  	textElem.innerHTML = "";
							  	textElem.innerHTML = fs.readFileSync("./classes/" + currFold + "/" + file1, "utf8");
								openedFilePath = "./classes/" + currFold + "/" + file1;
						  	});
					  	});
				  	} catch (err) {

					}
				});
	  
	  
			  } catch (err) {
				  
			  }
		  });
		});
	  });
}

generate();

const overlay = document.getElementById("overlay");

function openPopup(popup) {
	if(popup == null) {
		return;
	};

	popup.classList.add("active");
	overlay.classList.add("active");

	document.getElementById("poparea").focus();
};

//when click outside textarea
overlay.addEventListener('click', () => {
	const popup = document.getElementById("popup");
	closePopup(popup);
});

// when enter is clicked
document.addEventListener("keyup", function(event) {
	const popup = document.getElementById("popup");
    if (event.keyCode === 13 & popup.classList.contains('active')) {
		const createClass = document.getElementById("poparea").value;
		if (isrename === true) {
			console.log(currentFilePath);

			if (isClass === true) {
				fs.renameSync(currentFilePath, currentFilePath.substring(0, currentFilePath.lastIndexOf("/") + 1) + createClass);
				currentFilePath = currentFilePath.substring(0, currentFilePath.lastIndexOf("/") + 1) + createClass;
				lastItemRightclicked.innerHTML = createClass;
				currFold = lastItemRightclicked.innerHTML;
			} else {
				fs.renameSync(currentFilePath + ".docx", currentFilePath.substring(0, currentFilePath.lastIndexOf("/") + 1) + createClass + ".docx");
				currentFilePath = currentFilePath.substring(0, currentFilePath.lastIndexOf("/") + 1) + createClass;
				lastItemRightclicked.innerHTML = createClass;
			}

			console.log(currentFilePath);
			isrename = false;
			
			closePopup(popup);
		} else if (isClass === true) {
			console.log(isClass);
			try {
				fs.mkdirSync("./classes/" + createClass);

				let button = document.createElement("button");
				button.className = "class";
				button.innerHTML = createClass;
				filebar.appendChild(button);

				//when class is right clicked

				button.addEventListener("contextmenu", function(event){
					event.preventDefault();
					lastItemRightclicked = button;
					currentFilePath = "./classes/" + button.innerHTML;
					console.log(currentFilePath);
					var contextElement = document.getElementById("context-menu");
					contextElement.style.top = event.clientY + "px";
					contextElement.style.left = event.clientX + "px";
					contextElement.classList.add("active");
				});

				//when class is clicked
				button.addEventListener('click', () => {
					isClass = false;

					console.log("1");

					filebar.innerHTML = "";

					currFold = button.innerHTML;

					let newText1 = document.createElement("button");
					newText1.classList = "newFile";
					newText1.innerHTML = "New File";

					let back1 = document.createElement("button");
					back1.classList = "back";
					back1.innerHTML = "Back";

					filebar.appendChild(back1);
					filebar.appendChild(newText1);

					newText1.addEventListener("click", () => {
						const popup = document.getElementById("popup");
						openPopup(popup);
					});

					back1.addEventListener("click", () => {
						const valueOfTexthere = textElem.innerHTML;
						if (openedFilePath != "") {
							fs.writeFileSync(openedFilePath, valueOfTexthere, "utf-8");
						}
						
						isClass = true;
						filebar.innerHTML = "";
						generate();
					});

					//load the files onto the side bar
					try {
						fs.readdir('./classes/' + currFold, (err, files) => {
							try {
								files.forEach(file => {
									let button1 = document.createElement("button");
									button1.className = "note";
									button1.innerHTML = file;
									filebar.appendChild(button1);

									//when file is right clicked
									button.addEventListener("contextmenu",function(event){
										event.preventDefault();
										lastItemRightclicked = button;
										currentFilePath = "./classes/" + currFold + "/" + button.innerHTML;
										console.log(currentFilePath);
										var contextElement = document.getElementById("context-menu");
										contextElement.style.top = event.clientY + "px";
										contextElement.style.left = event.clientX + "px";
										contextElement.classList.add("active");
									});

									//when file is clicked
									button1.addEventListener("click", () => {
										if(currentFilePath != "") {
											const valueOfTexthere = textElem.innerHTML;
											console.log(currentFilePath + "777" + valueOfTexthere);
											fs.writeFileSync(currentFilePath, valueOfTexthere, "utf-8");
										}
										currentFilePath = "./classes/" + currFold + "/" + file + ".docx";
										textElem.innerHTML = "";
										openedFilePath = "./classes/" + currFold + "/" + file;
										textElem.innerHTML = fs.readFileSync("./classes/" + currFold + "/" + file, "utf8");
									});
								});
							} catch(err) {

							}
						});
						
					} catch(err) {
				}
					
			});
			closePopup(popup);
			} catch {
				console.log("NOTTTTTT");
				const txt = document.getElementById("poparea");
				txt.value = "CLASS ALREADY EXISTS";
			}
			
		} else {
				// create file
				fs.writeFileSync("./classes/" + currFold + "/" + createClass + ".docx", "");
				let button = document.createElement("button");
				button.className = "note";
				button.innerHTML = createClass;
				filebar.appendChild(button);
				
				if (currentFilePath != "") {
					const valueOfTexthere = textElem.innerHTML;
					console.log(currentFilePath + "777" + valueOfTexthere);
					fs.writeFileSync(currentFilePath, valueOfTexthere, "utf-8");
				}
				currentFilePath = "./classes/" + currFold + "/" + createClass + ".docx";
				console.log("./classes/" + currFold + "/" + createClass);
				textElem.innerHTML = "";
				openedFilePath = "./classes/" + currFold + "/" + createClass + ".docx";
				textElem.innerHTML = fs.readFileSync("./classes/" + currFold + "/" + createClass + ".docx", "utf8");


				//when right click menu
				button.addEventListener("contextmenu",function(event){
					event.preventDefault();
					lastItemRightclicked = button;
					currentFilePath = "./classes/" + currFold + "/" + button.innerHTML;
					console.log(currentFilePath);
					var contextElement = document.getElementById("context-menu");
					contextElement.style.top = event.clientY + "px";
					contextElement.style.left = event.clientX + "px";
					contextElement.classList.add("active");
				  });

				//when click file
				button.addEventListener("click", () => {
					if (currentFilePath != "") {
						const valueOfTexthere = textElem.innerHTML;
						console.log(currentFilePath + "777" + valueOfTexthere);
						fs.writeFileSync(currentFilePath, valueOfTexthere, "utf-8");
					}
					currentFilePath = "./classes/" + currFold + "/" + createClass + ".docx";
					console.log("./classes/" + currFold + "/" + createClass);
					textElem.innerHTML = "";
					openedFilePath = "./classes/" + currFold + "/" + createClass + ".docx";
					textElem.innerHTML = fs.readFileSync("./classes/" + currFold + "/" + createClass + ".docx", "utf8");
				});
				closePopup(popup);
			
		}
	}
});

function closePopup(popup) {
	if(popup == null) {
		return;
	};

	popup.classList.remove("active");
	overlay.classList.remove("active");

	document.getElementById("poparea").value = "";
};