//
// Copyright (C) 2020  Thomas Axelsson
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//


// jQuery license:
//
// Copyright JS Foundation and other contributors, https://js.foundation/
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

SHIFT = 0x1000

reshapeToggle = function () {
  //reshape.editMode = !reshape.editMode;
  if (reshape.editMode) {
    // Need to figure out closing the box vs updating the keyTable vs saving the keyTable
    //document.body.removeChild(reshape.reshapeDialog);
  } else {
    reshape.editMode = true;
    document.body.appendChild(reshape.reshapeDialog);
  };
}

var reshapeInit = function() {
  if (typeof reshapeLoaded === 'undefined') {
    reshape = {};
    loadKeyTable();
    reshape.keymap = new Map();
    packKeymap();
    reshape.editMode = false;
    reshape.remapTarget = undefined;
    reshape.reshapeDialog = createDialog();
    addToggleButton(document.body, true);
    wrapEvents();
    reshapeLoaded = true;
  } else {
    reshapeToggle();
  }
}

// TODO: Replace this by checking the event list now and then during run-time?
var reshapeInitWhenStable = function() {
  reshapeEventCount = 0;
  let timeout = setTimeout(pollStable, 1000);
  
}

function pollStable() {
  let documentEvents = $._data(document, 'events');
  console.log("POLL");
  if (documentEvents && documentEvents.keydown && documentEvents.keydown.length > 0 && 
      documentEvents.keydown.length == reshapeEventCount) {
      console.log("STABLE", documentEvents.keydown.length);
      reshapeInit();
  } else {
    console.log("WAIT");
    reshapeEventCount = documentEvents.keydown.length;
    setTimeout(pollStable, 1000);
  }
}

function loadKeyTable() {
  let json = localStorage.getItem('reshape-keytable');
  if (json == null) {
    reshape.keyTable = [];
  } else {
    reshape.keyTable = JSON.parse(json);
  }
}

function storeKeyTable() {
  localStorage.setItem('reshape-keytable', JSON.stringify(reshape.keyTable));
}

function addToggleButton(target) {
  let toggleDiv = reshapeLogo(true);  
  toggleDiv.style.cursor = 'pointer';
  toggleDiv.onclick = reshapeToggle;
  target.appendChild(toggleDiv);
}

var reshapeLogo = function(dock) {
  let logoDiv = document.createElement('div');
  logoDiv.innerHTML = '↬';
  
  let toggleStyle = logoDiv.style;
  if (dock) {
    toggleStyle.position = 'fixed';
    toggleStyle.bottom = 0;
    toggleStyle.right = 0;
  } else {
    toggleStyle.margin = '5px';
    toggleStyle.display = 'inline-block';
  }
  toggleStyle.background = 'red';
  toggleStyle.fontSize = '20px';
  toggleStyle.clipPath = 'circle()';
  toggleStyle.width = '20px';
  toggleStyle.height = '20px';
  toggleStyle.textAlign = 'center';
  toggleStyle.lineHeight = '16px';
  
  return logoDiv;
}

function logKey(event) {
  console.log(event.which, event.keyCode,
              event.shiftKey, event.key,
              String.fromCharCode(event.which));
}
  
function packKeyinfo(keyinfo) {
  return keyinfo.keycode | (keyinfo.shift ? SHIFT : 0);
}

function unpackKeyinfo(packed) {
  return { 'shift': (packed & SHIFT != 0),
         	 'keycode': packed & ~SHIFT};
}


function packKeymap() {
  reshape.keymap.clear();
  for (let entry of reshape.keyTable) {
    if (entry.old.keycode != null && entry.new.keycode != null) {
    	reshape.keymap.set(packKeyinfo(entry.old), entry);
    }
  }
}



function wrap(e, handler) {
  // NOTE: This function is called for each handler for each key press.
  //e.keyCode=83;e.which=83;e.key="s";
  packed = e.which | (e.shiftKey ? SHIFT : 0);
  if (!reshape.editMode) {
    let keyinfo = reshape.keymap.get(packed);
    if (keyinfo) {
      console.log((e.shiftKey ? 'shift+' : '' ) + e.key + '(' + e.which + ') -> ' + (keyinfo.new.shift ? 'shift+' : '' ) + keyinfo.new.keysym + ' (' + keyinfo.new.keycode + ')');
      e.which = keyinfo.new.keycode;
      e.shiftKey = keyinfo.new.shift;
      //logKey(e)
    }
  	handler(e);
    if (keyinfo && keyinfo.clickSelector) {
      setTimeout(() => {
        let clickTarget = document.querySelector(keyinfo.clickSelector);
      	if (clickTarget) {
          clickTarget.click()
        } else {
        	console.log("No match for click selector:",
                	    keyinfo.clickSelector);
      	}}, 100);
    }
  } else {
    if (reshape.remapTarget && e.which != 16 /*shift key */ && e.which != 18 /* altgr */ && e.which != 17 /* ctrl */ && !e.shiftKey /* We only want the keysym from the non-shifted key */) {
      keyinfo = { 'shift': e.shiftKey, 'keycode': e.which, 'keysym': e.key };
      reshape.remapTarget(keyinfo);
      reshape.remapTarget = undefined;
    }
  }
}


function wrapEvents() {
  let documentEvents = $._data(document, 'events');
  documentEvents.keydown.forEach((jevent) => {
    let h = jevent.handler;
    jevent.handler = (e => wrap(e, h));
   });
}

function keySpan(text) {
  let span = document.createElement('span');
  span.innerText = text;
  span.style.cursor = 'pointer';
  span.style.border = '1px solid gray';
  span.style.backgroundColor = '#eeeeee';
  span.style.padding = '2px 5px 2px 5px';
  span.style.fontSize = '10px';
  span.style.height = '18px';
  span.style.lineHeight = '12px';
  span.style.height = '12px';
  span.style.display = 'inline-block';
  span.style.textAlign = 'center';
  return span;
}

function keyCell(cell, keyinfo) {
  let text = '';
  let shiftSpan = keySpan('shift');
  cell.appendChild(shiftSpan)
  if (!keyinfo.shift) {
    shiftSpan.style.opacity = '0.3';
  }
  let basekeySpan = keySpan(keyText(keyinfo));
  // E.g. "Escape" takes up more space than one letter
  //basekeySpan.style.width = '20px';
 	cell.appendChild(basekeySpan);
  
  basekeySpan.onclick = e => startRemappingKey(keyinfo, basekeySpan);
  basekeySpan.oncontextmenu = e => remapKeyWithCode(keyinfo, basekeySpan);
  shiftSpan.onclick = e => toggleShift(keyinfo, shiftSpan);
  
  return [shiftSpan, basekeySpan]
}

function keyText(keyinfo) {
  if (keyinfo.keysym == null) {
    return '<Unset>';
  }
  //return String.fromCharCode(keyinfo.keycode);
  
  let text = keyinfo.keysym;
  if (keyinfo.keysym == ' ') {
    text = 'Space';
  } else if (keyinfo.keysym.length == 1) {
    /* One letter */
    text = keyinfo.keysym.toUpperCase();
  }
  return text + ' <' + keyinfo.keycode + '>';
}

function toggleShift(keyinfo, shiftSpan) {
    keyinfo.shift = !keyinfo.shift;
    if (keyinfo.shift) {
      shiftSpan.style.opacity = '1';
    } else {
      shiftSpan.style.opacity = '0.3';
    }
}

function startRemappingKey(keyinfo, basekeySpan) {
  basekeySpan.innerHTML = '&nbsp;';
  reshape.remapTarget = function(pressKeyinfo) {
    reshape.remapTarget = undefined;
    keyinfo.keycode = pressKeyinfo.keycode;
    keyinfo.keysym = pressKeyinfo.keysym;
    basekeySpan.innerText = keyText(keyinfo);
  }
}

function remapKeyWithCode(keyinfo, basekeySpan) {
  reshape.remapTarget = undefined;
  let origKeycode = keyinfo.keycode;
  if (origKeycode === null) {
    origKeycode = '';
  }
  while (true) {
    let answer = prompt("Enter the keycode", origKeycode);
    if (!answer) {
      break;
    } 
    let keycode = parseInt(answer);
    if (isNaN(keycode)) {
      alert("Keycode must be a number");
      continue;
    }
    keyinfo.keycode = keycode;
    keyinfo.keysym = '';
    basekeySpan.innerText = keyText(keyinfo);
    break;
  }
  return false;
}

function changeValue(entry, member, input) {
  entry[member] = input.value;
}

function addRow(table, entry) {
  let r = table.insertRow(-1);
  r.style.lineHeight = '25px';
  
  let noteCell = r.insertCell(-1);
  noteCell.style.display = 'inline-flex';
	let noteText = document.createElement('input');
  noteText.type = 'text';
  noteText.style.lineHeight = '10px';
  noteText.style.width = '100px';
  if (entry.note) {
  	noteText.value = entry.note;
  }
  noteText.onchange = () => changeValue(entry, 'note', noteText);
  noteCell.appendChild(noteText);
  
  let oldCell = r.insertCell(-1);
  keyCell(oldCell, entry.old);
  let newCell = r.insertCell(-1);
  keyCell(newCell, entry.new);
  
  let clickCell = r.insertCell(-1);
  clickCell.style.display = 'inline-flex';
	let clickText = document.createElement('input');
  clickText.type = 'text';
  clickText.style.lineHeight = '10px';
  clickText.style.width = '100px';
  if (entry.clickSelector) {
  	clickText.value = entry.clickSelector;
  }
  clickText.onchange = () => changeValue(entry, 'clickSelector', clickText);
  clickCell.appendChild(clickText);
  
  
  let removeCell = r.insertCell(-1);
  // Center button vertically
  removeCell.style.display = 'inline-flex';
  let removeButton = document.createElement('input');
  removeButton.type = 'button';
  removeButton.value = 'Remove';
  removeButton.style.lineHeight = 'normal';
  removeCell.appendChild(removeButton);
  removeButton.onclick = function(e) {
    let pos = reshape.keyTable.indexOf(entry);
    reshape.keyTable.splice(pos, 1);
    table.tBodies[0].removeChild(r);
  };
  
  return r;
}

function rawEdit() {
  let answer = prompt("Copy/paste. Note that inserting bad data will make ReShape work incorrectly. Settings are not saved until you click 'Save'.",
                      JSON.stringify(reshape.keyTable));
  if (answer) {
    reshape.keyTable = JSON.parse(answer);
    populateDialogTable();
  }
}

function createDialog() {
  d=document.createElement('div');
  
  d.appendChild(reshapeLogo());
  
  let titleSpan = document.createElement('span');
  titleSpan.innerHTML = 'ReShape <VERSION>';
  titleSpan.style.fontSize = '16px';
  d.appendChild(titleSpan);
  
  d.id = 'reshape-form'
  d.style.position = 'fixed';
  d.style.marginLeft = 'auto';
  d.style.marginRight = 'auto';
  d.style.top = '100px';
  d.style.backgroundColor = 'white';
  d.style.border = '1px silver solid';
  d.style.padding = '5px';
  // Need space for keys such as "ArrowDown"
  d.style.width = '600px';
  d.style.height = '400px';
  tableDiv = document.createElement('div');
  tableDiv.style.height = '300px';
  tableDiv.style.overflowY = 'auto';
  tableDiv.style.marginBottom = '15px';
  tableDiv.style.marginTop = '10px';
  reshape.dialogTable=document.createElement('table');
  let thead = document.createElement('thead');
  header = thead.insertRow(-1);
  header.style.position = 'sticky';
  header.style.top = '0px';
  header.style.backgroundColor = 'white';
  header.style.zIndex = 10;
  header.style.height = '2em';
  header.innerHTML = '<th>Note</th><th>Listen for keys</th><th>Send keys</th><th>& Click on (CSS selector)</th><th></th>';
  reshape.dialogTable.appendChild(thead);
  populateDialogTable();

  tableDiv.appendChild(reshape.dialogTable);
  d.appendChild(tableDiv)

  addButton = document.createElement('input');
  addButton.type = 'button';
  addButton.value = 'Add Key';
  addButton.onclick = function(e) {
    let entry = {
      'old': { 'shift': false, 'keycode': null, 'keysym': null },
      'new': { 'shift': false, 'keycode': null, 'keysym': null }
    };
    reshape.keyTable.push(entry)
    addRow(reshape.dialogTable, entry).scrollIntoView();
  }
  d.appendChild(addButton);

  tipText = document.createTextNode(' Right click on keys to set custom keycode. ')
  d.appendChild(tipText);
  
  rawButton = document.createElement('input');
  rawButton.type = 'button';
  rawButton.value = 'Edit Raw';
  rawButton.onclick = rawEdit;
  d.appendChild(rawButton);

  closeButton = document.createElement('input');
  closeButton.type = 'button';
  closeButton.value = 'Save & Close';
  closeButton.style.float = 'right';
  closeButton.onclick = function(e) {
    document.body.removeChild(d);
    storeKeyTable();
    packKeymap();
    reshape.editMode = false;
  }
  
  d.appendChild(closeButton);
  return d;
}

function populateDialogTable() {
  if (reshape.dialogTable.tBodies.length > 0) {
    reshape.dialogTable.removeChild(reshape.dialogTable.tBodies[0]);
  }
  let tbody = document.createElement('tbody');
  reshape.dialogTable.appendChild(tbody);
  for (let entry of reshape.keyTable) {
    addRow(tbody, entry);
  }
}
