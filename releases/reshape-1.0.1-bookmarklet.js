javascript:SHIFT=4096,reshapeToggle=function(){reshape.editMode||(reshape.editMode=!0,document.body.appendChild(reshape.reshapeDialog))};var reshapeInit=function(){"undefined"==typeof reshapeLoaded?(reshape={},loadKeyTable(),reshape.keymap=new Map,packKeymap(),reshape.editMode=!1,reshape.remapTarget=void 0,reshape.reshapeDialog=createDialog(),addToggleButton(document.body,!0),wrapEvents(),reshapeLoaded=!0):reshapeToggle()},reshapeInitWhenStable=function(){reshapeEventCount=0;setTimeout(pollStable,1e3)};function pollStable(){let e=$._data(document,"events");console.log("POLL"),e&&e.keydown&&e.keydown.length>0&&e.keydown.length==reshapeEventCount?(console.log("STABLE",e.keydown.length),reshapeInit()):(console.log("WAIT"),reshapeEventCount=e.keydown.length,setTimeout(pollStable,1e3))}function loadKeyTable(){let e=localStorage.getItem("reshape-keytable");reshape.keyTable=null==e?[]:JSON.parse(e)}function storeKeyTable(){localStorage.setItem("reshape-keytable",JSON.stringify(reshape.keyTable))}function addToggleButton(e){let t=reshapeLogo(!0);t.style.cursor="pointer",t.onclick=reshapeToggle,e.appendChild(t)}var reshapeLogo=function(e){let t=document.createElement("div");t.innerHTML="↬";let l=t.style;return e?(l.position="fixed",l.bottom=0,l.right=0):(l.margin="5px",l.display="inline-block"),l.background="red",l.fontSize="20px",l.clipPath="circle()",l.width="20px",l.height="20px",l.textAlign="center",l.lineHeight="16px",t};function logKey(e){console.log(e.which,e.keyCode,e.shiftKey,e.key,String.fromCharCode(e.which))}function packKeyinfo(e){return e.keycode|(e.shift?SHIFT:0)}function unpackKeyinfo(e){return{shift:e&0!=SHIFT,keycode:e&~SHIFT}}function packKeymap(){reshape.keymap.clear();for(let e of reshape.keyTable)null!=e.old.keycode&&null!=e.new.keycode&&reshape.keymap.set(packKeyinfo(e.old),e)}function wrap(e,t){if(packed=e.which|(e.shiftKey?SHIFT:0),reshape.editMode)reshape.remapTarget&&16!=e.which&&18!=e.which&&17!=e.which&&!e.shiftKey&&(keyinfo={shift:e.shiftKey,keycode:e.which,keysym:e.key},reshape.remapTarget(keyinfo),reshape.remapTarget=void 0);else{let l=reshape.keymap.get(packed);l&&(console.log((e.shiftKey?"shift+":"")+e.key+"("+e.which+") -> "+(l.new.shift?"shift+":"")+l.new.keysym+" ("+l.new.keycode+")"),e.which=l.new.keycode,e.shiftKey=l.new.shift),t(e),l&&l.clickSelector&&setTimeout(()=>{let e=document.querySelector(l.clickSelector);e?e.click():console.log("No match for click selector:",l.clickSelector)},100)}}function wrapEvents(){$._data(document,"events").keydown.forEach(e=>{let t=e.handler;e.handler=(e=>wrap(e,t))})}function keySpan(e){let t=document.createElement("span");return t.innerText=e,t.style.cursor="pointer",t.style.border="1px solid gray",t.style.backgroundColor="#eeeeee",t.style.fontSize="10px",t.style.height="16px",t.style.lineHeight="16px",t.style.padding="0px 5px 0px 5px",t.style.display="inline-block",t.style.textAlign="center",t}function keyCell(e,t){let l=keySpan("shift");e.appendChild(l),t.shift||(l.style.opacity="0.3");let n=keySpan(keyText(t));return e.appendChild(n),n.onclick=(e=>startRemappingKey(t,n)),n.oncontextmenu=(e=>remapKeyWithCode(t,n)),l.onclick=(e=>toggleShift(t,l)),[l,n]}function keyText(e){if(null==e.keysym)return"<Unset>";let t=e.keysym;return" "==e.keysym?t="Space":1==e.keysym.length&&(t=e.keysym.toUpperCase()),t+" <"+e.keycode+">"}function toggleShift(e,t){e.shift=!e.shift,e.shift?t.style.opacity="1":t.style.opacity="0.3"}function startRemappingKey(e,t){t.innerHTML="&nbsp;",reshape.remapTarget=function(l){reshape.remapTarget=void 0,e.keycode=l.keycode,e.keysym=l.keysym,t.innerText=keyText(e)}}function remapKeyWithCode(e,t){reshape.remapTarget=void 0;let l=e.keycode;for(null===l&&(l="");;){let n=prompt("Enter the keycode",l);if(!n)break;let o=parseInt(n);if(!isNaN(o)){e.keycode=o,e.keysym="",t.innerText=keyText(e);break}alert("Keycode must be a number")}return!1}function changeValue(e,t,l){e[t]=l.value}function addRow(e,t){let l=e.insertRow(-1);l.style.lineHeight="25px";let n=l.insertCell(-1);n.style.display="inline-flex";let o=document.createElement("input");o.type="text",o.style.lineHeight="10px",o.style.width="100px",t.note&&(o.value=t.note),o.onchange=(()=>changeValue(t,"note",o)),n.appendChild(o),keyCell(l.insertCell(-1),t.old),keyCell(l.insertCell(-1),t.new);let a=l.insertCell(-1);a.style.display="inline-flex";let i=document.createElement("input");i.type="text",i.style.lineHeight="10px",i.style.width="100px",t.clickSelector&&(i.value=t.clickSelector),i.onchange=(()=>changeValue(t,"clickSelector",i)),a.appendChild(i);let r=l.insertCell(-1);r.style.display="inline-flex";let d=document.createElement("input");return d.type="button",d.value="Remove",d.style.lineHeight="normal",r.appendChild(d),d.onclick=function(n){let o=reshape.keyTable.indexOf(t);reshape.keyTable.splice(o,1),e.tBodies[0].removeChild(l)},l}function rawEdit(){let e=prompt("Copy/paste. Note that inserting bad data will make ReShape work incorrectly. Settings are not saved until you click 'Save'.",JSON.stringify(reshape.keyTable));e&&(reshape.keyTable=JSON.parse(e),populateDialogTable())}function createDialog(){d=document.createElement("div"),d.appendChild(reshapeLogo());let e=document.createElement("span");e.innerHTML="ReShape 1.0.1",e.style.fontSize="16px",d.appendChild(e),d.id="reshape-form",d.style.position="fixed",d.style.marginLeft="auto",d.style.marginRight="auto",d.style.top="100px",d.style.backgroundColor="white",d.style.border="1px silver solid",d.style.padding="5px",d.style.width="600px",d.style.height="400px",tableDiv=document.createElement("div"),tableDiv.style.height="300px",tableDiv.style.overflowY="auto",tableDiv.style.marginBottom="15px",tableDiv.style.marginTop="10px",reshape.dialogTable=document.createElement("table");let t=document.createElement("thead");return header=t.insertRow(-1),header.style.position="sticky",header.style.top="0px",header.style.backgroundColor="white",header.style.zIndex=10,header.style.height="2em",header.innerHTML="<th>Note</th><th>Listen for keys</th><th>Send keys</th><th>& Click on (CSS selector)</th><th></th>",reshape.dialogTable.appendChild(t),populateDialogTable(),tableDiv.appendChild(reshape.dialogTable),d.appendChild(tableDiv),addButton=document.createElement("input"),addButton.type="button",addButton.value="Add Key",addButton.onclick=function(e){let t={old:{shift:!1,keycode:null,keysym:null},new:{shift:!1,keycode:null,keysym:null}};reshape.keyTable.push(t),addRow(reshape.dialogTable,t).scrollIntoView()},d.appendChild(addButton),tipText=document.createTextNode(" Right click on keys to set custom keycode. "),d.appendChild(tipText),rawButton=document.createElement("input"),rawButton.type="button",rawButton.value="Edit Raw",rawButton.onclick=rawEdit,d.appendChild(rawButton),closeButton=document.createElement("input"),closeButton.type="button",closeButton.value="Save & Close",closeButton.style.float="right",closeButton.onclick=function(e){document.body.removeChild(d),storeKeyTable(),packKeymap(),reshape.editMode=!1},d.appendChild(closeButton),d}function populateDialogTable(){reshape.dialogTable.tBodies.length>0&&reshape.dialogTable.removeChild(reshape.dialogTable.tBodies[0]);let e=document.createElement("tbody");reshape.dialogTable.appendChild(e);for(let t of reshape.keyTable)addRow(e,t)}reshapeInit();void(0)
