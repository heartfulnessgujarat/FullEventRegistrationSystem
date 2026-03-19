const API_URL="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT_ID=params.get("event");

let RULES=[];
let OPTIONS=[];
let EVENT={};

let EDIT_MODE=false;

init();

async function init(){

showLoading();

let cached=
localStorage.getItem("CFG_"+EVENT_ID);

if(cached){

applyConfig(JSON.parse(cached));

hideLoading();

loadFresh();

return;

}

loadFresh();

}

async function loadFresh(){

let res=
await fetch(API_URL+"?event="+EVENT_ID);

let data=
await res.json();

localStorage.setItem(
"CFG_"+EVENT_ID,
JSON.stringify(data)
);

applyConfig(data);

hideLoading();

}

function applyConfig(data){

RULES=data.rules;

OPTIONS=data.options;

EVENT=data.event;

buildTitles(data.titles);

buildForm();

initButtons();

}

function initButtons(){

document.getElementById("editBtn")
.onclick=enableEdit;

document.getElementById("registerBtn")
.onclick=registerInitial;

document.getElementById("updateBtn")
.onclick=registerUpdated;

}

function enableEdit(){

EDIT_MODE=true;

RULES.forEach(field=>{

let el=
document.getElementById(field.Field_Name);

if(!el) return;

if(field.Editable=="Yes"){

el.disabled=false;

}

});

document.getElementById("registerBtn").disabled=true;

document.getElementById("editBtn").style.display="none";

document.getElementById("updateBtn").style.display="inline";

validateForm();

}

function registerInitial(){

alert("Ready for submission");

}

function registerUpdated(){

alert("Updated submission ready");

}

function showLoading(){

document.getElementById("loading").style.display="block";

document.getElementById("buttonArea").style.display="none";

}

function hideLoading(){

document.getElementById("loading").style.display="none";

document.getElementById("buttonArea").style.display="block";

}

function buildTitles(titles){

let title=
titles.find(t=>t.Property=="Event Title");

let subtitle=
titles.find(t=>t.Property=="Event Subtitle");

document.getElementById("eventTitle")
.innerText=title?title.Value:"";

document.getElementById("eventSubtitle")
.innerText=subtitle?subtitle.Value:"";

}

function buildForm(){

let form=
document.getElementById("dynamicForm");

form.innerHTML="";

RULES
.sort((a,b)=>a.Field_Order-b.Field_Order)
.forEach(field=>{

if(field.Show!="Yes")
return;

let label=document.createElement("label");

label.innerText=field.Field_Label;

if(field.Mandatory=="Yes"){

label.innerText+=" *";

}

form.appendChild(label);

let input;

if(field.Field_Type=="Dropdown"){

input=document.createElement("select");

let defaultOpt=document.createElement("option");

defaultOpt.text="Select";

defaultOpt.value="";

input.appendChild(defaultOpt);

OPTIONS
.filter(o=>o.Field_Name==field.Field_Name)
.forEach(opt=>{

if(opt.Option_Status!="Active")
return;

let option=document.createElement("option");

option.value=opt.Option_Value;

option.text=opt.Option_Label;

input.appendChild(option);

});

}
else{

input=document.createElement("input");

input.type="text";

}

input.id=field.Field_Name;

if(field.Editable!="Yes"){

input.disabled=true;

}

input.oninput=function(){

validateForm();

if(field.Field_Name=="Mobile"){

fetchParticipant(this.value);

}

};

form.appendChild(input);

if(field.Help_Text){

let help=document.createElement("div");

help.style.fontSize="12px";

help.style.color="gray";

help.innerText=field.Help_Text;

form.appendChild(help);

}

form.appendChild(document.createElement("br"));

});

}

async function fetchParticipant(mobile){

if(mobile.length<10)
return;

let res=
await fetch(
API_URL+
"?action=participant"+
"&event="+EVENT_ID+
"&mobile="+mobile
);

let data=await res.json();

if(data.status=="found"){

fillParticipant(data.participant);

}

}

function fillParticipant(p){

RULES.forEach(field=>{

let el=
document.getElementById(field.Field_Name);

if(!el) return;

if(p[field.Field_Name]){

el.value=p[field.Field_Name];

}

});

}

function validateForm(){

let valid=true;

RULES.forEach(field=>{

if(field.Mandatory!="Yes")
return;

let el=document.getElementById(field.Field_Name);

if(!el) return;

if(el.value.trim()==""){

valid=false;

}

});

if(EDIT_MODE){

document.getElementById("updateBtn")
.disabled=!valid;

}

}
