// Define the Infra class
class Infra {
  constructor(name, is_perm = false) {
    const cards = {
      Aircraft: { yield: 2 },
      Corn: { yield: 1 },
      "Defense Contracting": { yield: 2 },
      Diamond: { yield: 3 },
      "Fiat Currency": { yield: 5 },
      Finance: { yield: 2 },
      Gold: { yield: 2 },
      "Info Systems": { yield: 1 },
      "Intellectual Property": { yield: 2 },
      Livestock: { yield: 1 },
      "Medical Supplies": { yield: 2 },
      Metal: { yield: 1 },
      Minerals: { yield: 1 },
      Oil: { yield: 4 },
      Potatoes: { yield: 1 },
      "Public Transit": { yield: 1 },
      Rice: { yield: 1 },
      Technology: { yield: 1 },
      Uranium: { yield: 3 },
    };
    const card = cards[name];
    this.name = name;
    this.is_perm = is_perm;
    this.yield = card.yield;
  }
}

// Define the Trade class
class Trade {
  constructor(name, partner) {
    const cards = {
      "Alliance Sharing": { yield: 0 },
      "Bilateral Trade": { yield: 0 },
      "Defense Sharing": { yield: 0 },
      "Economic Entanglement": { yield: 0 },
      "Expanded Commerce": { yield: 0 },
      "Expanded Intel": { yield: 0 },
      "Intelligence Sharing": { yield: 0 },
      "Nuclear Secrets": { yield: 0 },
      "Nuke Pact": { yield: 0 },
      "Peacekeeper Sharing": { yield: 0 },
      "Shared Fates": { yield: 0 },
      "Speedy Proliferation": { yield: 0 },
      "Trade Deal: Corn": { yield: 1 },
      "Trade Deal: Diamond": { yield: 2 },
      "Trade Deal: Info Systems": { yield: 1 },
      "Trade Deal: Livestock": { yield: 1 },
      "Trade Deal: Metal": { yield: 1 },
      "Trade Deal: Minerals": { yield: 1 },
      "Trade Deal: Oil": { yield: 3 },
      "Trade Deal: Potatoes": { yield: 1 },
      "Trade Deal: Public Transit": { yield: 1 },
      "Trade Deal: Rice": { yield: 1 },
      "Trade Deal: Technology": { yield: 1 },
      "Trade Deal: Uranium": { yield: 2 },
      "Ultra-Expanded Intel": { yield: 0 },
    };
    const card = cards[name];
    this.name = name;
    this.yield = card.yield;
    this.partner = partner;
  }
}

const nwRadio = document.getElementById("nw");
const gdpDisplay = document.getElementById("gdp");
const infraDisplay = document.getElementById("infra");
const tradeDisplay = document.getElementById("trade");
const epDisplay = document.getElementById("ep");
const epBar = document.getElementById("ep-bar");

nwRadio.addEventListener("change", refreshGDP);

function getInfra() {
  return JSON.parse(localStorage.getItem("infra")) || [];
}
function getTrade() {
  return JSON.parse(localStorage.getItem("trade")) || [];
}
function getEp() {
  return parseInt(localStorage.getItem("ep") || "-1");
}
function getGDP() {
  return parseInt(localStorage.getItem("gdp") || "-1");
}
function getCap() {
  return parseInt(localStorage.getItem("cap") || "-1");
}
function getLives() {
  return parseInt(localStorage.getItem("lives") || "-1");
}

var box = document.getElementById("messageBox");
function acknowledge() {
  box.classList.remove("hidden");
  box.classList.add("show");
  setTimeout(function () {
    box.classList.remove("show");
    box.classList.add("hidden");
  }, 1000);
}

function refreshGDP() {
  const trade = getTrade();
  const tradeYield = trade.reduce((sum, card) => sum + card.yield, 0);
  var gdp = tradeYield + (nwRadio.checked ? 3 : calculateInfraGDP());
  if (localStorage.getItem("country") === "India" && gdp > 9) {
    gdp = gdp + 2;
  }
  localStorage.setItem("gdp", gdp);
  gdpDisplay.textContent = gdp.toString().padStart(3, " ");
}

function calculateInfraGDP() {
  const infra = getInfra();
  const infraYield = infra.reduce((sum, card) => sum + card.yield, 0);
  return infraYield;
}

function updateInfra(newInfra) {
  const perm = newInfra.is_perm ? "(Perm)" : "";
  const body = `${newInfra.name}${perm} yields ${newInfra.yield}`;

  // Create new div
  let newDiv = document.createElement("div");
  newDiv.className = "infra-item";

  // Create label
  let label = document.createElement("span");
  label.textContent = body;
  newDiv.appendChild(label);

  // Create delete button
  if (!perm) {
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", function () {
      removeInfra(newInfra);
      newDiv.remove(); // This will remove the newDiv when the button is clicked
    });
    newDiv.appendChild(deleteButton);
  }

  // Append the new div to the 'infra' div
  document.getElementById("infra").appendChild(newDiv);

  // Pull Infra from dropdown
  removeSelectedOption(infraDropdown);

  // Refresh GDP for new infra
  refreshGDP();
}

function removeInfra(remInfra) {
  // Remove Infra from the country
  var infra = getInfra();
  for (let i = 0; i < infra.length; i++) {
    if (infra[i].name == remInfra.name) {
      infra.splice(i, 1);
    }
  }
  localStorage.setItem("infra", JSON.stringify(infra));
  refreshGDP();
  var option = document.createElement("option");
  option.text = remInfra.name;
  option.value = remInfra.name;
  infraDropdown.add(option);
}

function addInfra(newInfra) {
  // Add a new Infra to the country
  const infra = getInfra();
  localStorage.setItem("infra", JSON.stringify([...infra, newInfra]));
  updateInfra(newInfra);
}

function removeTrade(remTrade) {
  // Remove Trade from the country
  var trade = getTrade();
  for (let i = 0; i < trade.length; i++) {
    if (trade[i].name == remTrade.name) {
      trade.splice(i, 1);
    }
  }
  localStorage.setItem("trade", JSON.stringify(trade));
  refreshGDP();
}

function addTrade(newTrade) {
  // Add a new Trade to the country
  const trade = getTrade();
  localStorage.setItem("trade", JSON.stringify([...trade, newTrade]));

  updateTrade(newTrade);
}

function updateTrade(newTrade) {
  // Create new div
  let newDiv = document.createElement("div");
  newDiv.className = "trade-item";

  // Create label
  const label = document.createElement("span");
  label.id = newTrade.name;
  newDiv.appendChild(label);
  // Build Bilateral parts
  var body = "";
  if (newTrade.name === "Bilateral Trade") {
    body = `${newTrade.name} yields `;
    // Create input box
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "number");
    inputElement.setAttribute("id", "BilateralTradeValue");
    inputElement.setAttribute("class", "trade-value-input");
    inputElement.setAttribute("min", "0");
    inputElement.setAttribute("value", newTrade.yield);
    inputElement.addEventListener("input", function () {
      const tradeItems = getTrade();
      // Loop through the trade items and update the yield value
      for (let i = 0; i < tradeItems.length; i++) {
        if (tradeItems[i].name === "Bilateral Trade") {
          tradeItems[i].yield = parseInt(BilateralTradeValue.value);
        }
      }
      localStorage.setItem("trade", JSON.stringify(tradeItems));
      refreshGDP();
    });
    newDiv.appendChild(inputElement);
  } else {
    body = `${newTrade.name} yields ${newTrade.yield}`;
  }

  // Update label
  label.textContent = body;

  // Create delete button
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", function () {
    removeTrade(newTrade);
    newDiv.remove(); // This will remove the newDiv when the button is clicked
  });
  newDiv.appendChild(deleteButton);

  // Append the new div to the 'trade' div
  document.getElementById("trade").appendChild(newDiv);

  // Refresh GDP for new trade
  refreshGDP();
}

function refreshEP() {
  // Retrieve the value from localStorage
  var ep = getEp().toString().padStart(3, " ");
  var cap = getCap();
  epDisplay.textContent = `${ep} / ${cap}`;
  epBar.style.width = (ep / cap) * 100 + "%";
}

function removeLife(element) {
  localStorage.setItem("lives", getLives() - 1);
  element.src = 'images/death.png';
  element.alive = false;
  console.log(localStorage.getItem('lives'));
}

function addLife(element) {
  localStorage.setItem("lives", getLives() + 1);
  element.src = "images/lives.png";
  element.alive = true;
  console.log(localStorage.getItem('lives'));
}

function lifeEventHandler(element) {
  if (element.alive) {
    removeLife(element);
  } else {
    addLife(element);
  }
}

function refreshLives() {
  //   <img class="life" src="images/lives.png" onclick="removeLife(this)">
  var lives = getLives();
  const livesContainer = document.getElementById("livesContainer");
  livesContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const img = document.createElement('img');
    img.className = 'life';
    img.addEventListener("click", () => lifeEventHandler(img));
    if (lives <= i) {
      img.src = "images/death.png";
      img.alive = false;
    } else {
      img.src = "images/lives.png";
      img.alive = true;
    }
    livesContainer.appendChild(img);
  }
}

function addToEP(delta) {
  var newEp = getEp() + delta;
  newEp = Math.max(Math.min(newEp, getCap()), 0);
  return newEp;
}

const countrySubmitBtn = document.getElementById("countrySubmitBtn");
const scoresheet = document.getElementById("scoresheet");
const countrySelection = document.getElementById("country-selection");
const countryName = document.getElementById("country-name");
const epUp = document.getElementById("epIncrement");
const epDown = document.getElementById("epDecrement");
const epSubmit = document.getElementById("epSubmit");
const epInput = document.getElementById("epInput");

epUp.addEventListener("click", function () {
  epInput.value = parseInt(epInput.value) + 1;
});

epDown.addEventListener("click", function () {
  epInput.value = parseInt(epInput.value) - 1;
});

epSubmit.addEventListener("click", function () {
  delta = parseInt(epInput.value);
  if (delta != 0) {
    localStorage.setItem("ep", addToEP(delta));
    refreshEP();
    epInput.value = 0;
  }
});

function unlockScoresheet() {
  scoresheet.style.display = "block";
  countrySelection.style.display = "none";
  countryName.textContent = localStorage.getItem("country");
  refreshGDP();
  refreshEP();
  refreshLives();
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("country")) {
    unlockScoresheet();
    const infra = getInfra();
    for (let i = 0; i < infra.length; i++) {
      infraDropdown.value = infra[i].name;
      updateInfra(infra[i]);
    }

    const trade = getTrade();
    for (let i = 0; i < trade.length; i++) {
      updateTrade(trade[i]);
    }

    refreshLives();
  }
});

function setCountry(country) {
  const countryInfra = {
    China: {
      ep: 27,
      cap: 150,
      infra: [
        new Infra("Info Systems", true),
        new Infra("Medical Supplies", true),
      ],
    },
    France: {
      ep: 20,
      cap: 120,
      infra: [new Infra("Livestock", true), new Infra("Aircraft", true)],
    },
    India: {
      ep: 14,
      cap: 120,
      infra: [
        new Infra("Technology", true),
        new Infra("Intellectual Property", true),
      ],
    },
    Israel: {
      ep: 18,
      cap: 120,
      infra: [new Infra("Diamond", true)],
    },
    "North Korea": {
      ep: 10,
      cap: 120,
      infra: [
        new Infra("Metal", true),
        new Infra("Minerals", true),
        new Infra("Rice", true),
      ],
    },
    Pakistan: {
      ep: 16,
      cap: 120,
      infra: [
        new Infra("Corn", true),
        new Infra("Livestock", true),
        new Infra("Rice", true),
      ],
    },
    Russia: {
      ep: 27,
      cap: 120,
      infra: [new Infra("Minerals", true), new Infra("Gold", true)],
    },
    "The UK": {
      ep: 20,
      cap: 120,
      infra: [new Infra("Potatoes", true), new Infra("Finance", true)],
    },
    "The USA": {
      ep: 35,
      cap: 150,
      infra: [new Infra("Corn", true), new Infra("Defense Contracting", true)],
    },
  };

  const countryData = countryInfra[country];
  if (countryData) {
    localStorage.setItem("country", country);
    localStorage.setItem("ep", countryData.ep);
    localStorage.setItem("nwt", true);
    localStorage.setItem("gdp", 3);
    localStorage.setItem("lives", 5);
    localStorage.setItem("cap", countryData.cap);
    localStorage.setItem("trade", "[]");
    for (let i = 0; i < countryData.infra.length; i++) {
      infraDropdown.value = countryData.infra[i].name;
      addInfra(countryData.infra[i]);
    }
  }
}

countrySubmitBtn.addEventListener("click", function () {
  const selectedOption = document.querySelector(
    'input[name="country"]:checked'
  );
  if (selectedOption) {
    setCountry(selectedOption.value);
    unlockScoresheet();
  } else {
    alert("No country selected");
  }
});

function removeSelectedOption(dropdownElement) {
  dropdownElement.remove(dropdownElement.selectedIndex);
  dropdownElement.value = "";
}

const infraButton = document.getElementById("infraButton");
const infraDropdown = document.getElementById("infraDropdown");

infraButton.addEventListener("click", function () {
  const selectedValue = infraDropdown.value;
  if (selectedValue == "") {
    return;
  }
  const infra = getInfra();
  if (infra.filter((infra) => infra.is_perm == false).length > 3) {
    alert("Country is full of inf!");
  } else if (infra.filter((infra) => infra.name == selectedValue).length > 0) {
    alert("Country already has this inf!");
  } else {
    addInfra(new Infra(selectedValue));
  }
});

const tradeButton = document.getElementById("tradeButton");
const tradeDropdown = document.getElementById("tradeDropdown");

tradeButton.addEventListener("click", function () {
  const selectedValue = tradeDropdown.value;
  if (selectedValue == "") {
    return;
  }
  const trade = getTrade();
  if (trade.length > 2) {
    alert("Country is full of trade!");
  } else {
    newTrade = new Trade(selectedValue);
    addTrade(newTrade);
    refreshGDP();
    tradeDropdown.value = "";
  }
});

const newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", function () {
  const confirmed = confirm("Are you sure you want to start a new game?");
  if (confirmed) {
    localStorage.clear();
    location.reload();
  }
});

const collectAllButton = document.getElementById("collectAllButton");
collectAllButton.addEventListener("click", function () {
  const trade = getTrade();
  const gdp = getGDP();

  if (
    trade.some((card) => card.yield === 0 && card.name === "Bilateral Trade")
  ) {
    alert("Please set the yield of your Bilateral Trade");
    return;
  }

  localStorage.setItem("ep", addToEP(gdp));
  refreshEP();
  acknowledge();
});

const collectTradesButton = document.getElementById("collectTradesButton");
collectTradesButton.addEventListener("click", function () {
  const trade = getTrade();

  tradeYield = trade
    .filter((card) => card.name != "Bilateral Trade")
    .reduce((sum, card) => sum + card.yield, 0);

  localStorage.setItem("ep", addToEP(tradeYield));
  refreshEP();
  acknowledge();
});

const recessionButton = document.getElementById("recessionButton");
recessionButton.addEventListener("click", function () {
  const ep = getEp();
  const diff = Math.floor(ep * -.25);

  localStorage.setItem("ep", addToEP(diff));
  refreshEP();
  acknowledge();
});