!function(){var t={805:function(t,n,e){"use strict";var r,o=e(252),a=(r=e(90))&&r.__esModule?r:{default:r},i=e(672);function s(t){if(null==t)throw new TypeError("Cannot destructure undefined")}function u(t,n,e){var r=document.createElement("article");r.setAttribute("data-player-type",e);for(var o=0;o<t;o++){var a=document.createElement("div");a.className="row";for(var i=0;i<n;i++){var s=document.createElement("div");s.className="cell",0==o?s.style["border-top"]="2px solid black":o===t-1&&(s.style["border-bottom"]="2px solid black"),0==i?s.style["border-left"]="2px solid black":i===n-1&&(s.style["border-right"]="2px solid black");var u=document.createElement("div");s.appendChild(u),a.appendChild(s)}r.appendChild(a)}return r}function c(t,n,e){return t.children.item(e-1).children.item(n-1).firstChild}function l(t,n){var e=c(t,n.start_x,n.start_y);n.isVertical?e.classList.add("round-top"):e.classList.add("round-left"),n.isVertical?c(t,n.start_x,n.start_y+n.length-1).classList.add("round-bottom"):c(t,n.start_x+n.length-1,n.start_y).classList.add("round-right");for(var r=1;r<=n.length-2;r++)(n.isVertical?c(t,n.start_x,n.start_y+r):c(t,n.start_x+r,n.start_y)).classList.add("mid")}function d(t,n){for(var e=1;e<=n.num_of_rows;e++)for(var r=1;r<=n.num_of_columns;r++)n.canAttack(r,e)||c(t,r,e).classList.add("destroyed")}function f(t){var n=u(t.num_of_rows,t.num_of_columns,"current");return function(t,n){for(var e=function(e){for(var r=function(n){var r=c(t,n,e);r.addEventListener("dragover",(function(t){t.preventDefault()})),r.addEventListener("drop",(function(t){t.preventDefault();var r=t.dataTransfer.getData("ship-id"),a=t.dataTransfer.getData("ship-offset"),s=document.querySelector("#".concat(r)),u=parseInt(s.getAttribute("data-length")),c=s.classList.contains("vertical"),l=n,d=e;c?d-=a:l-=a,(0,i.publish)(o.HANDLE_ADD_SHIP,{start_x:l,start_y:d,length:u,isVertical:c})}))},a=1;a<=n.num_of_columns;a++)r(a)},r=1;r<=n.num_of_rows;r++)e(r)}(n,t),d(n,t),function(t,n){n.forEach((function(n){l(t,n)}))}(n,t.ships),n}function p(t){t.style["pointer-events"]="none"}function _(t){var n=u(t.num_of_rows,t.num_of_columns,"opponent");return function(t,n){for(var e=1;e<=n.num_of_rows;e++)for(var r=1;r<=n.num_of_columns;r++)n.canAttack(r,e)||n.isEmpty(r,e)||c(t,r,e).classList.add("success")}(n,t),d(n,t),n}function h(t,n){var e=n.currentPlayerGameBoard,r=n.opponentGameBoard,a=document.querySelector(".game-boards-section");a.innerHTML="";var s=f(e),u=_(r);!function(t,n){for(var e=function(e){for(var r=function(r){n.canAttack(r,e)&&c(t,r,e).addEventListener("click",(function(){p(t),(0,i.publish)(o.HANDLE_ATTACK,{x:r,y:e})}))},a=1;a<=n.num_of_columns;a++)r(a)},r=1;r<=n.num_of_rows;r++)e(r)}(u,r),a.append(s,u)}(0,i.subscribe)(o.ADD_SHIP_TO_DISPLAY,(function(t,n){var e=n.ship;document.querySelector('[data-length="'.concat(e.length,'"]')).remove(),l(document.querySelector('[data-player-type="current"]'),e)})),(0,i.subscribe)(o.ADD_GAME_BOARDS_TO_DISPLAY,h),(0,i.subscribe)(o.ADD_VERDICT_TO_DISPLAY,(function(t,n){var e=n.verdict,r=n.currentPlayerGameBoard,o=n.opponentGameBoard;document.querySelector(".verdict").textContent=e,h(0,{currentPlayerGameBoard:r,opponentGameBoard:o}),p(document.querySelector('[data-player-type="opponent"]'))})),(0,i.subscribe)(o.DOM_START_GAME,(function(t,n){var e=n.currentPlayerGameBoard,r=n.opponentGameBoard,a=document.querySelector(".ship-section"),s=document.querySelector("form"),u=document.querySelector(".start");document.querySelector(".verdict").textContent="",a.classList.add("hidden"),s.classList.add("hidden"),u.textContent="Restart",(0,i.publish)(o.ADD_GAME_BOARDS_TO_DISPLAY,{currentPlayerGameBoard:e,opponentGameBoard:r}),(0,i.publish)(o.ADD_INFO_TO_DISPLAY,{info:"Click on enemy grid cells to attack"})})),(0,i.subscribe)(o.DOM_RESET_GAME,(function(t,n){s(n);var e=document.querySelector(".ship-section"),r=document.querySelector("form"),u=document.querySelector(".start");document.querySelector(".verdict").textContent="",e.classList.contains("hidden")&&e.classList.remove("hidden"),r.classList.contains("hidden")&&r.classList.remove("hidden"),u.textContent="Start",function(){var t=[5,4,3,3,2],n=["Carrier","Battleship","Cruiser","Submarine","Destroyer"],e=document.querySelector(".drag-ships");e.innerHTML="";for(var r=function(r){var o=document.createElement("div");o.id=n[r],o.setAttribute("draggable","true"),o.setAttribute("data-length",t[r]),o.classList.add("ship");for(var a=0;a<t[r];a++){var i=document.createElement("div");i.classList.add("ship-part");var s=document.createElement("div");0===a?s.classList.add("round-left"):a===t[r]-1?s.classList.add("round-right"):s.classList.add("mid"),i.appendChild(s),o.appendChild(i)}o.addEventListener("dragstart",(function(t){var n=t.explicitOriginalTarget,e=Array.from(o.children).findIndex((function(t){return t.firstChild===n}));t.dataTransfer.setData("ship-id",o.id),t.dataTransfer.setData("ship-offset",e)})),o.addEventListener("dblclick",(function(t){var n=o.firstChild.firstChild,e=o.lastChild.firstChild;o.classList.contains("vertical")?(n.classList.replace("round-top","round-left"),e.classList.replace("round-bottom","round-right")):(n.classList.replace("round-left","round-top"),e.classList.replace("round-right","round-bottom")),o.classList.toggle("vertical")})),e.append(o)},o=0;o<t.length;o++)r(o)}(),function(){var t=document.querySelector(".game-boards-section");t.innerHTML="";var n=(0,a.default)(10,10),e=f(n),r=_(n);t.append(e,r)}(),(0,i.publish)(o.ADD_INFO_TO_DISPLAY,{info:"Drag and drop ships on your grid (double click the ship to rotate)"})})),(0,i.subscribe)(o.ADD_ERROR_TO_DISPLAY,(function(t,n){var e=n.error;document.querySelector(".error").textContent=e})),(0,i.subscribe)(o.ADD_INFO_TO_DISPLAY,(function(t,n){var e=n.info;document.querySelector(".instructions").textContent=e})),(0,i.subscribe)(o.INIT_DOM,(function(t,n){var e,r,a;s(n),(0,i.publish)(o.HANDLE_RESET_GAME,{}),e=document.querySelector(".start"),r=document.querySelector("#player-name"),a=document.querySelector("#computer-name"),e.addEventListener("click",(function(){var t=document.querySelector(".drag-ships"),n="";r.validity.valueMissing?n="Enter player name":a.validity.valueMissing?n="Enter computer name":0!==t.children.length?n="Place all your ships first":(0,i.publish)(o.HANDLE_START_GAME,{playerName:r.value,computerName:a.value}),(0,i.publish)(o.ADD_ERROR_TO_DISPLAY,{error:n})})),document.querySelector(".reset").addEventListener("click",(function(){(0,i.publish)(o.HANDLE_RESET_GAME,{})}))}))},4:function(t,n,e){"use strict";var r=e(672),o=u(e(56)),a=e(367),i=e(252),s=u(e(90));function u(t){return t&&t.__esModule?t:{default:t}}function c(t,n,e){(0,r.publish)(i.ADD_VERDICT_TO_DISPLAY,{verdict:t,currentPlayerGameBoard:n,opponentGameBoard:e})}var l=[],d=(0,s.default)(10,10);(0,r.subscribe)(i.HANDLE_ADD_SHIP,(function(t,n){var e=n.start_x,a=n.start_y,s=n.length,u=n.isVertical,c=(0,o.default)(e,a,s,u),f="";d.addShip(c)?(l.push({start_x:e,start_y:a,length:s,isVertical:u}),(0,r.publish)(i.ADD_SHIP_TO_DISPLAY,{ship:c})):f="Place the ship correctly",(0,r.publish)(i.ADD_ERROR_TO_DISPLAY,{error:f})}));var f=[{start_x:2,start_y:8,length:2,isVertical:!1},{start_x:9,start_y:2,length:3,isVertical:!0},{start_x:9,start_y:8,length:3,isVertical:!0},{start_x:6,start_y:6,length:4,isVertical:!0},{start_x:1,start_y:4,length:5,isVertical:!1}];(0,r.publish)(i.INIT_DOM,{});var p=null;function _(){null===p||p.isGameOver()||p.end(),p=null}(0,r.subscribe)(i.HANDLE_START_GAME,(function(t,n){var e=n.playerName,s=n.computerName;null!==p&&_();var u=[(0,a.playerFactory)(10,10,e),(0,a.computerFactory)(10,10,s)];l.forEach((function(t){var n=(0,o.default)(t.start_x,t.start_y,t.length,t.isVertical);u[0].gameboard.addShip(n)})),f.forEach((function(t){var n=(0,o.default)(t.start_x,t.start_y,t.length,t.isVertical);u[1].gameboard.addShip(n)})),(p=function(t,n){var e=0,o=[];function a(){e=1-e}function s(){return e}function u(){return 1-e}function l(){return n[s()].gameboard}function d(){return n[u()].gameboard}function f(){return n[u()].gameboard.isGameOver()}function p(t,e){n[u()].gameboard.attack(t,e)}var _=(0,r.subscribe)(i.HANDLE_ATTACK,(function(e,o){var u,c;if(p(o.x,o.y),f()){var _=n[s()].name;h("".concat(_," won!"))}else(function(){var e=!1;if("PVP"===t)a();else{a();var r=n[s()].getMove();if(p(r.x,r.y),e=f()){var o=n[s()].name;a(),h("".concat(o," won!"))}else a()}return{gameOver:e}})().gameOver||(u=l(),c=d(),(0,r.publish)(i.ADD_GAME_BOARDS_TO_DISPLAY,{currentPlayerGameBoard:u,opponentGameBoard:c}))}));function h(){c(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"game aborted",l(),d()),o.forEach((function(t){(0,r.unsubscribe)(t)}))}return o.push(_),{init:function(){(0,r.publish)(i.DOM_START_GAME,{currentPlayerGameBoard:l(),opponentGameBoard:d()})},end:h,isGameOver:f}}("VS Computer",u)).init()})),(0,r.subscribe)(i.HANDLE_RESET_GAME,(function(t,n){!function(t){if(null==t)throw new TypeError("Cannot destructure undefined")}(n),_(),l=[],d=(0,s.default)(10,10),(0,r.publish)(i.DOM_RESET_GAME,{})}))},90:function(t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default=function(t,n){for(var e=[],r=new Array(t+1),o=new Array(t+1),a=0;a<r.length;a++){r[a]=new Array(n+1),o[a]=new Array(n+1);for(var i=0;i<r[a].length;i++)r[a][i]=-1,o[a][i]=!1}var s=function(t,n){return!o[t][n]},u=function(t,n){return-1==r[t][n]};return{num_of_rows:t,num_of_columns:n,ships:e,addShip:function(o){if(!function(e){if(!(1<=e.start_x&&e.start_x<=n))return!1;if(!(1<=e.start_y&&e.start_y<=t))return!1;if(e.isVertical){var r=e.start_y+e.length-1;if(!(1<=r&&r<=t))return!1}else{var o=e.start_x+e.length-1;if(!(1<=o&&o<=n))return!1}return!0}(o)||function(t){for(var n=0;n<t.length;n++)if(t.isVertical){if(-1!==r[t.start_x][t.start_y+n])return!0}else if(-1!==r[t.start_x+n][t.start_y])return!0;return!1}(o))return!1;e.push(o);for(var a=0;a<o.length;a++)o.isVertical?r[o.start_x][o.start_y+a]=e.length-1:r[o.start_x+a][o.start_y]=e.length-1;return!0},attack:function(t,n){return!!s(t,n)&&(o[t][n]=!0,u(t,n)||e[r[t][n]].hit(t,n),!0)},canAttack:s,isGameOver:function(){return e.reduce((function(t,n){return!!n.isSunk()&&t}),!0)},isEmpty:u}}},367:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.computerFactory=function(t,n,e){for(var r=a(t,n,e).gameboard,o=[],i=1;i<=t;i++)for(var s=1;s<=n;s++)o.push({x:i,y:s});return{name:e,gameboard:r,getMove:function(){if(0===o.length)return"Out of moves";var t,n=(t=o.length-1,Math.floor(Math.random()*(t+1))),e=o[n];return o.splice(n,1),e}}},n.playerFactory=a;var r,o=(r=e(90))&&r.__esModule?r:{default:r};function a(t,n,e){return{name:e,gameboard:(0,o.default)(t,n)}}},56:function(t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default=function(t,n,e,r){for(var o=new Array(e),a=0;a<e;a++)o[a]=!1;var i=function(e,o){return r?o-n:e-t},s=function(t,n){var r=i(t,n);return 0<=r&&r<e&&!o[r]};return{start_x:t,start_y:n,length:e,isVertical:r,hit:function(t,n){var e=i(t,n);return!!s(t,n)&&(o[e]=!0,!0)},canHit:s,isSunk:function(){return o.reduce((function(t,n){return!!n&&t}),!0)}}}},672:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.publish=function(t,n){return console.log({topic:t,data:n}),(0,r.publish)(t,n)},n.subscribe=function(t,n){return(0,r.subscribe)(t,n)},n.unsubscribe=function(t){return(0,r.unsubscribe)(t)};var r=e(798)},252:function(t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.INIT_DOM=n.HANDLE_START_GAME=n.HANDLE_RESET_GAME=n.HANDLE_ATTACK=n.HANDLE_ADD_SHIP=n.DOM_START_GAME=n.DOM_RESET_GAME=n.ADD_VERDICT_TO_DISPLAY=n.ADD_SHIP_TO_DISPLAY=n.ADD_INFO_TO_DISPLAY=n.ADD_GAME_BOARDS_TO_DISPLAY=n.ADD_ERROR_TO_DISPLAY=void 0,n.ADD_GAME_BOARDS_TO_DISPLAY="DOM: add player game boards to display",n.HANDLE_ATTACK="Controller: handle attack on gameboard",n.ADD_VERDICT_TO_DISPLAY="DOM: add verdict to display",n.HANDLE_ADD_SHIP="Controller: handle add ship",n.INIT_DOM="DOM: Initialize",n.HANDLE_START_GAME="Controller: start game",n.HANDLE_RESET_GAME="Controller: reset game",n.ADD_SHIP_TO_DISPLAY="DOM: add ship to display",n.ADD_ERROR_TO_DISPLAY="DOM: add error to display",n.ADD_INFO_TO_DISPLAY="DOM: add info to display",n.DOM_START_GAME="DOM: start game",n.DOM_RESET_GAME="DOM: reset game"},28:function(t,n,e){"use strict";var r=e(81),o=e.n(r),a=e(645),i=e.n(a)()(o());i.push([t.id,"html,\nbody {\n  margin: 0;\n  min-height: 100vh;\n  overflow: auto;\n}\n\nhtml {\n  box-sizing: border-box;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit;\n}\n\n.cell {\n  width: 30px;\n  height: 30px;\n  border: 1px solid black;\n  pointer-events: inherit;\n}\n\n.cell div {\n  width: 100%;\n  height: 100%;\n}\n\n.round-top,\n.round-bottom,\n.round-left,\n.round-right,\n.mid {\n  background-color: black;\n  width: 100%;\n  height: 100%;\n}\n\n.round-top {\n  border-top-left-radius: 50%;\n  border-top-right-radius: 50%;\n}\n\n.round-bottom {\n  border-bottom-left-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\n.round-left {\n  border-top-left-radius: 50%;\n  border-bottom-left-radius: 50%;\n}\n\n.round-right {\n  border-top-right-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\n.row {\n  display: flex;\n  pointer-events: inherit;\n}\n\n.destroyed {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n\n.destroyed::before {\n  content: '';\n  transform: rotateY(0deg) rotate(45deg);\n  position: absolute;\n  background-color: red;\n  height: 28px;\n  width: 6px;\n  left: 11px;\n}\n\n.destroyed:after {\n  content: '';\n  transform: rotateY(0deg) rotate(45deg);\n  position: absolute;\n  background-color: red;\n  height: 6px;\n  width: 28px;\n  top: 11px;\n}\n\nbody {\n  display: flex;\n  flex-direction: column;\n}\n\nmain {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 16px;\n}\n\n.game-boards-section {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 32px;\n  margin: 32px 0px;\n}\n\n.success {\n  background-color: rgb(18, 223, 18);\n  border-radius: 0px;\n}\n\n.ship {\n  margin: 8px 0px;\n  display: flex;\n}\n\n.ship-part {\n  width: 30px;\n  height: 30px;\n}\n\n.vertical {\n  flex-direction: column;\n}\n\n.start,\n.reset {\n  margin: 8px 0px;\n  padding: 8px 16px;\n  font-size: 16px;\n}\n\n.action-buttons-section {\n  display: flex;\n  gap: 16px;\n  justify-content: center;\n  align-items: center;\n}\n\n.drag-ships {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.instructions {\n  font-size: 20px;\n  color: rgb(0, 131, 131);\n}\n\n.error {\n  font-size: 20px;\n  color: rgb(184, 25, 25);\n}\n\nheader {\n  font-size: 30px;\n}\n\nfooter {\n  font-size: 20px;\n}\n\nsection {\n  font-size: 22px;\n}\n\nfooter,\nheader {\n  height: 8vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: cadetblue;\n}\n\n.hidden {\n  display: none;\n}\n",""]),n.Z=i},645:function(t){"use strict";t.exports=function(t){var n=[];return n.toString=function(){return this.map((function(n){var e="",r=void 0!==n[5];return n[4]&&(e+="@supports (".concat(n[4],") {")),n[2]&&(e+="@media ".concat(n[2]," {")),r&&(e+="@layer".concat(n[5].length>0?" ".concat(n[5]):""," {")),e+=t(n),r&&(e+="}"),n[2]&&(e+="}"),n[4]&&(e+="}"),e})).join("")},n.i=function(t,e,r,o,a){"string"==typeof t&&(t=[[null,t,void 0]]);var i={};if(r)for(var s=0;s<this.length;s++){var u=this[s][0];null!=u&&(i[u]=!0)}for(var c=0;c<t.length;c++){var l=[].concat(t[c]);r&&i[l[0]]||(void 0!==a&&(void 0===l[5]||(l[1]="@layer".concat(l[5].length>0?" ".concat(l[5]):""," {").concat(l[1],"}")),l[5]=a),e&&(l[2]?(l[1]="@media ".concat(l[2]," {").concat(l[1],"}"),l[2]=e):l[2]=e),o&&(l[4]?(l[1]="@supports (".concat(l[4],") {").concat(l[1],"}"),l[4]=o):l[4]="".concat(o)),n.push(l))}},n}},81:function(t){"use strict";t.exports=function(t){return t[1]}},798:function(t,n,e){t=e.nmd(t),function(e,r){"use strict";var o={};e.PubSub?(o=e.PubSub,console.warn("PubSub already loaded, using existing version")):(e.PubSub=o,function(t){var n={},e=-1;function r(t,n,e){try{t(n,e)}catch(t){setTimeout(function(t){return function(){throw t}}(t),0)}}function o(t,n,e){t(n,e)}function a(t,e,a,i){var s,u=n[e],c=i?o:r;if(Object.prototype.hasOwnProperty.call(n,e))for(s in u)Object.prototype.hasOwnProperty.call(u,s)&&c(u[s],t,a)}function i(t){var e=String(t);return Boolean(Object.prototype.hasOwnProperty.call(n,e)&&function(t){var n;for(n in t)if(Object.prototype.hasOwnProperty.call(t,n))return!0;return!1}(n[e]))}function s(t,n,e,r){var o=function(t,n,e){return function(){var r=String(t),o=r.lastIndexOf(".");for(a(t,t,n,e);-1!==o;)o=(r=r.substr(0,o)).lastIndexOf("."),a(t,r,n,e);a(t,"*",n,e)}}(t="symbol"==typeof t?t.toString():t,n,r);return!!function(t){for(var n=String(t),e=i(n)||i("*"),r=n.lastIndexOf(".");!e&&-1!==r;)r=(n=n.substr(0,r)).lastIndexOf("."),e=i(n);return e}(t)&&(!0===e?o():setTimeout(o,0),!0)}t.publish=function(n,e){return s(n,e,!1,t.immediateExceptions)},t.publishSync=function(n,e){return s(n,e,!0,t.immediateExceptions)},t.subscribe=function(t,r){if("function"!=typeof r)return!1;t="symbol"==typeof t?t.toString():t,Object.prototype.hasOwnProperty.call(n,t)||(n[t]={});var o="uid_"+String(++e);return n[t][o]=r,o},t.subscribeAll=function(n){return t.subscribe("*",n)},t.subscribeOnce=function(n,e){var r=t.subscribe(n,(function(){t.unsubscribe(r),e.apply(this,arguments)}));return t},t.clearAllSubscriptions=function(){n={}},t.clearSubscriptions=function(t){var e;for(e in n)Object.prototype.hasOwnProperty.call(n,e)&&0===e.indexOf(t)&&delete n[e]},t.countSubscriptions=function(t){var e,r,o=0;for(e in n)if(Object.prototype.hasOwnProperty.call(n,e)&&0===e.indexOf(t)){for(r in n[e])o++;break}return o},t.getSubscriptions=function(t){var e,r=[];for(e in n)Object.prototype.hasOwnProperty.call(n,e)&&0===e.indexOf(t)&&r.push(e);return r},t.unsubscribe=function(e){var r,o,a,i="string"==typeof e&&(Object.prototype.hasOwnProperty.call(n,e)||function(t){var e;for(e in n)if(Object.prototype.hasOwnProperty.call(n,e)&&0===e.indexOf(t))return!0;return!1}(e)),s=!i&&"string"==typeof e,u="function"==typeof e,c=!1;if(!i){for(r in n)if(Object.prototype.hasOwnProperty.call(n,r)){if(o=n[r],s&&o[e]){delete o[e],c=e;break}if(u)for(a in o)Object.prototype.hasOwnProperty.call(o,a)&&o[a]===e&&(delete o[a],c=!0)}return c}t.clearSubscriptions(e)}}(o)),void 0!==t&&t.exports&&(n=t.exports=o),n.PubSub=o,t.exports=n=o}("object"==typeof window&&window||this)},89:function(t,n,e){"use strict";e.r(n);var r=e(379),o=e.n(r),a=e(795),i=e.n(a),s=e(569),u=e.n(s),c=e(565),l=e.n(c),d=e(216),f=e.n(d),p=e(589),_=e.n(p),h=e(28),m={};m.styleTagTransform=_(),m.setAttributes=l(),m.insert=u().bind(null,"head"),m.domAPI=i(),m.insertStyleElement=f(),o()(h.Z,m),n.default=h.Z&&h.Z.locals?h.Z.locals:void 0},379:function(t){"use strict";var n=[];function e(t){for(var e=-1,r=0;r<n.length;r++)if(n[r].identifier===t){e=r;break}return e}function r(t,r){for(var a={},i=[],s=0;s<t.length;s++){var u=t[s],c=r.base?u[0]+r.base:u[0],l=a[c]||0,d="".concat(c," ").concat(l);a[c]=l+1;var f=e(d),p={css:u[1],media:u[2],sourceMap:u[3],supports:u[4],layer:u[5]};if(-1!==f)n[f].references++,n[f].updater(p);else{var _=o(p,r);r.byIndex=s,n.splice(s,0,{identifier:d,updater:_,references:1})}i.push(d)}return i}function o(t,n){var e=n.domAPI(n);return e.update(t),function(n){if(n){if(n.css===t.css&&n.media===t.media&&n.sourceMap===t.sourceMap&&n.supports===t.supports&&n.layer===t.layer)return;e.update(t=n)}else e.remove()}}t.exports=function(t,o){var a=r(t=t||[],o=o||{});return function(t){t=t||[];for(var i=0;i<a.length;i++){var s=e(a[i]);n[s].references--}for(var u=r(t,o),c=0;c<a.length;c++){var l=e(a[c]);0===n[l].references&&(n[l].updater(),n.splice(l,1))}a=u}}},569:function(t){"use strict";var n={};t.exports=function(t,e){var r=function(t){if(void 0===n[t]){var e=document.querySelector(t);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(t){e=null}n[t]=e}return n[t]}(t);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(e)}},216:function(t){"use strict";t.exports=function(t){var n=document.createElement("style");return t.setAttributes(n,t.attributes),t.insert(n,t.options),n}},565:function(t,n,e){"use strict";t.exports=function(t){var n=e.nc;n&&t.setAttribute("nonce",n)}},795:function(t){"use strict";t.exports=function(t){var n=t.insertStyleElement(t);return{update:function(e){!function(t,n,e){var r="";e.supports&&(r+="@supports (".concat(e.supports,") {")),e.media&&(r+="@media ".concat(e.media," {"));var o=void 0!==e.layer;o&&(r+="@layer".concat(e.layer.length>0?" ".concat(e.layer):""," {")),r+=e.css,o&&(r+="}"),e.media&&(r+="}"),e.supports&&(r+="}");var a=e.sourceMap;a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),n.styleTagTransform(r,t,n.options)}(n,t,e)},remove:function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(n)}}}},589:function(t){"use strict";t.exports=function(t,n){if(n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}}},n={};function e(r){var o=n[r];if(void 0!==o)return o.exports;var a=n[r]={id:r,loaded:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,{a:n}),n},e.d=function(t,n){for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.nmd=function(t){return t.paths=[],t.children||(t.children=[]),t},function(){"use strict";e(89),e(805),e(4)}()}();