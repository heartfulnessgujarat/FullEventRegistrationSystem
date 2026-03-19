const API_URL="YOUR_WEBAPP_URL";

const params=
new URLSearchParams(window.location.search);

const EVENT_ID=
params.get("event");

let RULES=[];
let OPTIONS=[];
let EVENT={};

init();

async function init(){

showLoading();

let cached=
localStorage.getItem("CFG_"+EVENT_ID);

if(cached){

let data=JSON.parse(cached);

applyConfig(data);

hideLoading();

loadFresh();

return;

}

await loadFresh();

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

}

function showLoading(){

document.getElementById("loading")
.style.display="block";

}

function hideLoading(){

document.getElementById("loading")
.style.display="none";

document.getElementById("submitBtn")
.style.display="block";

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

let label=
document.createElement("label");

label.innerText=
field.Field_Label;

if(field.Mandatory=="Yes"){

label.innerText+=" *";

}

form.appendChild(label);

let input;

if(field.Field_Type=="Dropdown"){

input=
document.createElement("select");

let defaultOpt=
document.createElement("option");

defaultOpt.text="Select";

defaultOpt.value="";

input.appendChild(defaultOpt);

OPTIONS
.filter(o=>o.Field_Name==field.Field_Name)
.sort((a,b)=>a.Option_Order-b.Option_Order)
.forEach(opt=>{

if(opt.Option_Status!="Active")
return;

let option=
document.createElement("option");

option.value=
opt.Option_Value;

option.text=
opt.Option_Label;

input.appendChild(option);

});

}
else{

input=
document.createElement("input");

input.type="text";

}

input.id=
field.Field_Name;

input.oninput=validateForm;

form.appendChild(input);

if(field.Help_Text){

let help=
document.createElement("div");

help.style.fontSize="12px";

help.style.color="gray";

help.innerText=
field.Help_Text;

form.appendChild(help);

}

form.appendChild(
document.createElement("br")
);

});

}

function validateForm(){

let valid=true;

RULES.forEach(field=>{

if(field.Mandatory!="Yes")
return;

let el=
document.getElementById(field.Field_Name);

if(!el)
return;

if(el.value.trim()==""){

valid=false;

}

});

document.getElementById("submitBtn")
.disabled=!valid;

}
