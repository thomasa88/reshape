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

SHIFT = 0x1000

if (typeof keyTable === 'undefined') {
keyTable = [];
}

function logKey(event) {
  console.log(event.which, event.keyCode,
             event.shiftKey, event.key,
             String.fromCharCode(event.which))
}
  
function packKeyinfo(keyinfo) {
  return keyinfo.keycode | (keyinfo.shift ? SHIFT : 0);
}

function unpackKeyinfo(packed) {
  return { 'shift': (packed & SHIFT != 0),
         	 'keycode': packed & ~SHIFT};
}

sKEYMAP = new Map();
function packKeymap() {
  sKEYMAP.clear();
  for (let entry of keyTable) {
    if (entry.old.keycode != null && entry.new.keycode != null) {
    	sKEYMAP.set(packKeyinfo(entry.old), entry);
    }
  }
}
packKeymap();

editMode = true;
remapTarget = undefined;

if (typeof trans === 'undefined') {
	trans = new Map();
}

console.log(jQuery.fn.jquery)

function wrap(e, handler) {
  // NOTE: This function is called for each handler for each key press.
  //e.keyCode=83;e.which=83;e.key="s";
  logKey(e)
  packed = e.which | (e.shiftKey ? SHIFT : 0);
  if (!editMode) {
    let keyinfo = sKEYMAP.get(packed);
    if (keyinfo) {
      console.log((e.shiftKey ? 'shift+' : '' ) + e.key + '(' + e.which + ') -> ' + (keyinfo.new.shift ? 'shift+' : '' ) + keyinfo.new.keysym + ' (' + keyinfo.new.keycode + ')');
      e.which = keyinfo.new.keycode;
      e.shiftKey = keyinfo.new.shift;
      logKey(e)
    }
  	handler(e);
    if (keyinfo && keyinfo.clickSelector) {
      setTimeout(() => {
        console.log("INFO", keyinfo)
        let clickTarget = document.querySelector(keyinfo.clickSelector);
      	if (clickTarget) {
          clickTarget.click()
        } else {
        	console.log("No match for click selector:",
                	    keyinfo.clickSelector);
      	}}, 100);
    }
  } else {
    //trans.set(e.which, e.key);
    if (remapTarget && e.which != 16 /*shift key */ && e.which != 18 /* altgr */ && e.which != 17 /* ctrl */ && !e.shiftKey /* We only want the keysym from the non-shifted key */) {
      keyinfo = { 'shift': e.shiftKey, 'keycode': e.which, 'keysym': e.key };
      remapTarget(keyinfo);
      remapTarget = undefined;
    }
  }
}


if (typeof eventsWrapped === 'undefined') {
  eventsWrapped = true;
  j=$._data(document, 'events')
  j.keydown.forEach((jevent, i) => {
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
  remapTarget = function(pressKeyinfo) {
    remapTarget = undefined;
    keyinfo.keycode = pressKeyinfo.keycode;
    keyinfo.keysym = pressKeyinfo.keysym;
    basekeySpan.innerText = keyText(keyinfo);
  }
}

function remapKeyWithCode(keyinfo, basekeySpan) {
  remapTarget = undefined;
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
    let pos = keyTable.indexOf(entry);
    keyTable.splice(pos, 1);
    console.log("R", r, table)
    table.tBodies[0].removeChild(r);
  };
  
  return r;
}

oldForm = document.getElementById('reshape-form');
if (oldForm != null) {
  document.body.removeChild(oldForm);
}

d=document.createElement('div');
d.innerText = 'ReShape';
//d.style.zIndex = 1;
d.id = 'reshape-form'
d.style.position = 'absolute';
d.style.left = '200px';
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
t=document.createElement('table');
header = t.insertRow(-1);
header.style.position = 'sticky';
header.style.top = '0px';
header.style.backgroundColor = 'white';
header.style.zIndex = 10;
header.style.height = '2em';
header.innerHTML = '<th>Note</th><th>Listen for keys</th><th>Send keys</th><th>& Click on (CSS selector)</th><th></th>';
for (let entry of keyTable) {
  addRow(t, entry)
}

tableDiv.appendChild(t);
d.appendChild(tableDiv)

addButton = document.createElement('input');
addButton.type = 'button';
addButton.value = 'Add';
addButton.onclick = function(e) {
  let entry = {
    'old': { 'shift': false, 'keycode': null, 'keysym': null },
    'new': { 'shift': false, 'keycode': null, 'keysym': null }
  };
  keyTable.push(entry)
  addRow(t, entry).scrollIntoView();
}
d.appendChild(addButton);

tipText = document.createTextNode(' Right click on keys to set custom keycode.')
d.appendChild(tipText);

closeButton = document.createElement('input');
closeButton.type = 'button';
closeButton.value = 'Save';
closeButton.style.float = 'right';
closeButton.onclick = function(e) {
  document.body.removeChild(d);
  packKeymap();
  editMode = false;
}
d.appendChild(closeButton);
d
window.d = d
if (editMode) {
document.body.appendChild(d)
}

keyTable
