SHIFT = 0x1000

if (typeof keyTable === 'undefined') {
keyTable = [];
keyTable.push( {'old':
                { 'shift': false, 'keycode': 65}, 'new':
                  {'shift': true, 'keycode': 83}});
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
    	sKEYMAP.set(packKeyinfo(entry.old), packKeyinfo(entry.new));
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
  packed = e.which | (e.shiftKey ? SHIFT : 0);
  if (!editMode) {
    n = sKEYMAP.get(packed);
    console.log("MATCH", n)
    if (n) {
      console.log("R");
      e.which = n & ~SHIFT;
      e.shiftKey = ((n & SHIFT) != 0);
    }
  	handler(e);
  } else {
    trans.set(e.which, e.key);
    if (remapTarget && e.keyCode != 16 /*shift key */) {
    	//remapTarget.appendChild(keySpan('a')););
      remapTarget(unpackKeyinfo(packed));
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
  let basekeySpan = keySpan(getKeysym(keyinfo.keycode));
  // E.g. "Escape" takes up more space than one letter
  //basekeySpan.style.width = '20px';
 	cell.appendChild(basekeySpan);
  
  basekeySpan.onclick = e => startRemappingKey(keyinfo, basekeySpan);
  shiftSpan.onclick = e => toggleShift(keyinfo, shiftSpan);
  
  return [shiftSpan, basekeySpan]
}

function getKeysym(keycode) {
  if (keycode === null) {
    return '<Unset>';
  }
  if (trans.has(keycode)) {
    key = trans.get(keycode);
  } else {
    key = "<" + keycode + ">";
  }
  return key;
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
    basekeySpan.innerText = getKeysym(keyinfo.keycode);
  }
}

function addRow(table, entry) {
  let r = table.insertRow(-1);
  r.style.lineHeight = '25px';
  
  let oldCell = r.insertCell(-1);
  keyCell(oldCell, entry.old);
  let newCell = r.insertCell(-1);
  keyCell(newCell, entry.new);
  
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
d.style.width = '300px';
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
header.innerHTML = '<th>Original</th><th>Replacement</th><th></th>';
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
    'old': { 'shift': false, 'keycode': null },
    'new': { 'shift': false, 'keycode': null }
  };
  keyTable.push(entry)
  addRow(t, entry).scrollIntoView();
}
d.appendChild(addButton);

closeButton = document.createElement('input');
closeButton.type = 'button';
closeButton.value = 'Close';
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
