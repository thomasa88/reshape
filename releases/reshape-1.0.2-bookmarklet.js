javascript:SHIFT%3D4096%2CreshapeToggle%3Dfunction()%7Breshape.editMode%7C%7C(reshape.editMode%3D!0%2Cdocument.body.appendChild(reshape.reshapeDialog))%7D%3Bvar%20reshapeInit%3Dfunction()%7B%22undefined%22%3D%3Dtypeof%20reshapeLoaded%3F(reshape%3D%7B%7D%2CloadKeyTable()%2Creshape.keymap%3Dnew%20Map%2CpackKeymap()%2Creshape.editMode%3D!1%2Creshape.remapTarget%3Dvoid%200%2Creshape.reshapeDialog%3DcreateDialog()%2CaddToggleButton(document.body%2C!0)%2CwrapEvents()%2CreshapeLoaded%3D!0)%3AreshapeToggle()%7D%2CreshapeInitWhenStable%3Dfunction()%7BreshapeEventCount%3D0%3BsetTimeout(pollStable%2C1e3)%7D%3Bfunction%20pollStable()%7Blet%20e%3D%24._data(document%2C%22events%22)%3Bconsole.log(%22POLL%22)%2Ce%26%26e.keydown%26%26e.keydown.length%3E0%26%26e.keydown.length%3D%3DreshapeEventCount%3F(console.log(%22STABLE%22%2Ce.keydown.length)%2CreshapeInit())%3A(console.log(%22WAIT%22)%2CreshapeEventCount%3De.keydown.length%2CsetTimeout(pollStable%2C1e3))%7Dfunction%20loadKeyTable()%7Blet%20e%3DlocalStorage.getItem(%22reshape-keytable%22)%3Breshape.keyTable%3Dnull%3D%3De%3F%5B%5D%3AJSON.parse(e)%7Dfunction%20storeKeyTable()%7BlocalStorage.setItem(%22reshape-keytable%22%2CJSON.stringify(reshape.keyTable))%7Dfunction%20addToggleButton(e)%7Blet%20t%3DreshapeLogo(!0)%3Bt.style.cursor%3D%22pointer%22%2Ct.onclick%3DreshapeToggle%2Ce.appendChild(t)%7Dvar%20reshapeLogo%3Dfunction(e)%7Blet%20t%3Ddocument.createElement(%22div%22)%3Bt.innerHTML%3D%22%E2%86%AC%22%3Blet%20l%3Dt.style%3Breturn%20e%3F(l.position%3D%22fixed%22%2Cl.bottom%3D0%2Cl.right%3D0)%3A(l.margin%3D%225px%22%2Cl.display%3D%22inline-block%22)%2Cl.background%3D%22red%22%2Cl.fontSize%3D%2220px%22%2Cl.clipPath%3D%22circle()%22%2Cl.width%3D%2220px%22%2Cl.height%3D%2220px%22%2Cl.textAlign%3D%22center%22%2Cl.lineHeight%3D%2216px%22%2Ct%7D%3Bfunction%20logKey(e)%7Bconsole.log(e.which%2Ce.keyCode%2Ce.shiftKey%2Ce.key%2CString.fromCharCode(e.which))%7Dfunction%20packKeyinfo(e)%7Breturn%20e.keycode%7C(e.shift%3FSHIFT%3A0)%7Dfunction%20unpackKeyinfo(e)%7Breturn%7Bshift%3Ae%260!%3DSHIFT%2Ckeycode%3Ae%26~SHIFT%7D%7Dfunction%20packKeymap()%7Breshape.keymap.clear()%3Bfor(let%20e%20of%20reshape.keyTable)null!%3De.old.keycode%26%26null!%3De.new.keycode%26%26reshape.keymap.set(packKeyinfo(e.old)%2Ce)%7Dfunction%20wrap(e%2Ct)%7Bif(packed%3De.which%7C(e.shiftKey%3FSHIFT%3A0)%2Creshape.editMode)reshape.remapTarget%26%2616!%3De.which%26%2618!%3De.which%26%2617!%3De.which%26%26!e.shiftKey%26%26(keyinfo%3D%7Bshift%3Ae.shiftKey%2Ckeycode%3Ae.which%2Ckeysym%3Ae.key%7D%2Creshape.remapTarget(keyinfo)%2Creshape.remapTarget%3Dvoid%200)%3Belse%7Blet%20l%3Dreshape.keymap.get(packed)%3Bl%26%26(console.log((e.shiftKey%3F%22shift%2B%22%3A%22%22)%2Be.key%2B%22(%22%2Be.which%2B%22)%20-%3E%20%22%2B(l.new.shift%3F%22shift%2B%22%3A%22%22)%2Bl.new.keysym%2B%22%20(%22%2Bl.new.keycode%2B%22)%22)%2Ce.which%3Dl.new.keycode%2Ce.shiftKey%3Dl.new.shift)%2Ct(e)%2Cl%26%26l.clickSelector%26%26setTimeout(()%3D%3E%7Blet%20e%3Ddocument.querySelector(l.clickSelector)%3Be%3Fe.click()%3Aconsole.log(%22No%20match%20for%20click%20selector%3A%22%2Cl.clickSelector)%7D%2C100)%7D%7Dfunction%20wrapEvents()%7B%24._data(document%2C%22events%22).keydown.forEach(e%3D%3E%7Blet%20t%3De.handler%3Be.handler%3D(e%3D%3Ewrap(e%2Ct))%7D)%7Dfunction%20keySpan(e)%7Blet%20t%3Ddocument.createElement(%22span%22)%3Breturn%20t.innerText%3De%2Ct.style.cursor%3D%22pointer%22%2Ct.style.border%3D%221px%20solid%20gray%22%2Ct.style.backgroundColor%3D%22%23eeeeee%22%2Ct.style.fontSize%3D%2210px%22%2Ct.style.height%3D%2216px%22%2Ct.style.lineHeight%3D%2216px%22%2Ct.style.padding%3D%220px%205px%200px%205px%22%2Ct.style.display%3D%22inline-block%22%2Ct.style.textAlign%3D%22center%22%2Ct%7Dfunction%20keyCell(e%2Ct)%7Blet%20l%3DkeySpan(%22shift%22)%3Be.appendChild(l)%2Ct.shift%7C%7C(l.style.opacity%3D%220.3%22)%3Blet%20n%3DkeySpan(keyText(t))%3Breturn%20e.appendChild(n)%2Cn.onclick%3D(e%3D%3EstartRemappingKey(t%2Cn))%2Cn.oncontextmenu%3D(e%3D%3EremapKeyWithCode(t%2Cn))%2Cl.onclick%3D(e%3D%3EtoggleShift(t%2Cl))%2C%5Bl%2Cn%5D%7Dfunction%20keyText(e)%7Bif(null%3D%3De.keysym)return%22%3CUnset%3E%22%3Blet%20t%3De.keysym%3Breturn%22%20%22%3D%3De.keysym%3Ft%3D%22Space%22%3A1%3D%3De.keysym.length%26%26(t%3De.keysym.toUpperCase())%2Ct%2B%22%20%3C%22%2Be.keycode%2B%22%3E%22%7Dfunction%20toggleShift(e%2Ct)%7Be.shift%3D!e.shift%2Ce.shift%3Ft.style.opacity%3D%221%22%3At.style.opacity%3D%220.3%22%7Dfunction%20startRemappingKey(e%2Ct)%7Bt.innerHTML%3D%22%26nbsp%3B%22%2Creshape.remapTarget%3Dfunction(l)%7Breshape.remapTarget%3Dvoid%200%2Ce.keycode%3Dl.keycode%2Ce.keysym%3Dl.keysym%2Ct.innerText%3DkeyText(e)%7D%7Dfunction%20remapKeyWithCode(e%2Ct)%7Breshape.remapTarget%3Dvoid%200%3Blet%20l%3De.keycode%3Bfor(null%3D%3D%3Dl%26%26(l%3D%22%22)%3B%3B)%7Blet%20n%3Dprompt(%22Enter%20the%20keycode%22%2Cl)%3Bif(!n)break%3Blet%20o%3DparseInt(n)%3Bif(!isNaN(o))%7Be.keycode%3Do%2Ce.keysym%3D%22%22%2Ct.innerText%3DkeyText(e)%3Bbreak%7Dalert(%22Keycode%20must%20be%20a%20number%22)%7Dreturn!1%7Dfunction%20changeValue(e%2Ct%2Cl)%7Be%5Bt%5D%3Dl.value%7Dfunction%20addRow(e%2Ct)%7Blet%20l%3De.insertRow(-1)%3Bl.style.lineHeight%3D%2225px%22%3Blet%20n%3Dl.insertCell(-1)%3Bn.style.display%3D%22inline-flex%22%3Blet%20o%3Ddocument.createElement(%22input%22)%3Bo.type%3D%22text%22%2Co.style.lineHeight%3D%2210px%22%2Co.style.width%3D%22100px%22%2Ct.note%26%26(o.value%3Dt.note)%2Co.onchange%3D(()%3D%3EchangeValue(t%2C%22note%22%2Co))%2Cn.appendChild(o)%2CkeyCell(l.insertCell(-1)%2Ct.old)%2CkeyCell(l.insertCell(-1)%2Ct.new)%3Blet%20a%3Dl.insertCell(-1)%3Ba.style.display%3D%22inline-flex%22%3Blet%20i%3Ddocument.createElement(%22input%22)%3Bi.type%3D%22text%22%2Ci.style.lineHeight%3D%2210px%22%2Ci.style.width%3D%22100px%22%2Ct.clickSelector%26%26(i.value%3Dt.clickSelector)%2Ci.onchange%3D(()%3D%3EchangeValue(t%2C%22clickSelector%22%2Ci))%2Ca.appendChild(i)%3Blet%20r%3Dl.insertCell(-1)%3Br.style.display%3D%22inline-flex%22%3Blet%20d%3Ddocument.createElement(%22input%22)%3Breturn%20d.type%3D%22button%22%2Cd.value%3D%22Remove%22%2Cd.style.lineHeight%3D%22normal%22%2Cr.appendChild(d)%2Cd.onclick%3Dfunction(n)%7Blet%20o%3Dreshape.keyTable.indexOf(t)%3Breshape.keyTable.splice(o%2C1)%2Ce.removeChild(l)%7D%2Cl%7Dfunction%20rawEdit()%7Blet%20e%3Dprompt(%22Copy%2Fpaste.%20Note%20that%20inserting%20bad%20data%20will%20make%20ReShape%20work%20incorrectly.%20Settings%20are%20not%20saved%20until%20you%20click%20'Save'.%22%2CJSON.stringify(reshape.keyTable))%3Be%26%26(reshape.keyTable%3DJSON.parse(e)%2CpopulateDialogTable())%7Dfunction%20createDialog()%7Bd%3Ddocument.createElement(%22div%22)%2Cd.appendChild(reshapeLogo())%3Blet%20e%3Ddocument.createElement(%22span%22)%3Be.innerHTML%3D%22ReShape%201.0.2%22%2Ce.style.fontSize%3D%2216px%22%2Cd.appendChild(e)%2Cd.id%3D%22reshape-form%22%2Cd.style.position%3D%22fixed%22%2Cd.style.marginLeft%3D%22auto%22%2Cd.style.marginRight%3D%22auto%22%2Cd.style.top%3D%22100px%22%2Cd.style.backgroundColor%3D%22white%22%2Cd.style.border%3D%221px%20silver%20solid%22%2Cd.style.padding%3D%225px%22%2Cd.style.width%3D%22600px%22%2Cd.style.height%3D%22400px%22%2CtableDiv%3Ddocument.createElement(%22div%22)%2CtableDiv.style.height%3D%22300px%22%2CtableDiv.style.overflowY%3D%22auto%22%2CtableDiv.style.marginBottom%3D%2215px%22%2CtableDiv.style.marginTop%3D%2210px%22%2Creshape.dialogTable%3Ddocument.createElement(%22table%22)%3Blet%20t%3Ddocument.createElement(%22thead%22)%3Breturn%20header%3Dt.insertRow(-1)%2Cheader.style.position%3D%22sticky%22%2Cheader.style.top%3D%220px%22%2Cheader.style.backgroundColor%3D%22white%22%2Cheader.style.zIndex%3D10%2Cheader.style.height%3D%222em%22%2Cheader.innerHTML%3D%22%3Cth%3ENote%3C%2Fth%3E%3Cth%3EListen%20for%20keys%3C%2Fth%3E%3Cth%3ESend%20keys%3C%2Fth%3E%3Cth%3E%26%20Click%20on%20(CSS%20selector)%3C%2Fth%3E%3Cth%3E%3C%2Fth%3E%22%2Creshape.dialogTable.appendChild(t)%2CpopulateDialogTable()%2CtableDiv.appendChild(reshape.dialogTable)%2Cd.appendChild(tableDiv)%2CaddButton%3Ddocument.createElement(%22input%22)%2CaddButton.type%3D%22button%22%2CaddButton.value%3D%22Add%20Key%22%2CaddButton.onclick%3Dfunction(e)%7Blet%20t%3D%7Bold%3A%7Bshift%3A!1%2Ckeycode%3Anull%2Ckeysym%3Anull%7D%2Cnew%3A%7Bshift%3A!1%2Ckeycode%3Anull%2Ckeysym%3Anull%7D%7D%3Breshape.keyTable.push(t)%2CaddRow(reshape.dialogTable.tBodies%5B0%5D%2Ct).scrollIntoView()%7D%2Cd.appendChild(addButton)%2CtipText%3Ddocument.createTextNode(%22%20Right%20click%20on%20keys%20to%20set%20custom%20keycode.%20%22)%2Cd.appendChild(tipText)%2CrawButton%3Ddocument.createElement(%22input%22)%2CrawButton.type%3D%22button%22%2CrawButton.value%3D%22Edit%20Raw%22%2CrawButton.onclick%3DrawEdit%2Cd.appendChild(rawButton)%2CcloseButton%3Ddocument.createElement(%22input%22)%2CcloseButton.type%3D%22button%22%2CcloseButton.value%3D%22Save%20%26%20Close%22%2CcloseButton.style.float%3D%22right%22%2CcloseButton.onclick%3Dfunction(e)%7Bdocument.body.removeChild(d)%2CstoreKeyTable()%2CpackKeymap()%2Creshape.editMode%3D!1%7D%2Cd.appendChild(closeButton)%2Cd%7Dfunction%20populateDialogTable()%7Breshape.dialogTable.tBodies.length%3E0%26%26reshape.dialogTable.removeChild(reshape.dialogTable.tBodies%5B0%5D)%3Blet%20e%3Ddocument.createElement(%22tbody%22)%3Breshape.dialogTable.appendChild(e)%3Bfor(let%20t%20of%20reshape.keyTable)addRow(e%2Ct)%7DreshapeInit()%3Bvoid(0)