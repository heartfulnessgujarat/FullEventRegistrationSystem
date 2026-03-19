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

let res=
await fetch(API_URL+"?event="+EVENT_ID);

let data=
await res.json();

RULES=data.rules;

OPTIONS=data.options;

EVENT=data.event;

buildTitles(data.titles);

buildForm();

hideLoading();

initButtons();

}

function initButtons(){

document.getElementById("editBtn").onclick=enableEdit;

document.getElementById("registerBtn").onclick=registerInitial;

document.getElementById("updateBtn").onclick=registerUpdated;

}

function enableEdit(){

EDIT_MODE=true;

RULES.forEach(field=>{

let el=document.getElementById(field.Field_Name);

if(!el) return;

if(field.Editable=="Yes"){

el.disabled=false;

}

});

document.getElementById("registerBtn").style.display="none";

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

let title=titles.find(t=>t.Property=="Event Title");

let subtitle=titles.find(t=>t.Property=="Event Subtitle");

document.getElementById("eventTitle").innerText=title?title.Value:"";

document.getElementById("eventSubtitle").innerText=subtitle?subtitle.Value:"";

}

function buildForm(){

let form=document.getElementById("dynamicForm");

form.innerHTML="";

RULES
.sort((a,b)=>a.Field_Order-b.Field_Order)
.forEach(field=>{

if(field.Show!="Yes") return;

let label=document.createElement("label");

label.innerText=field.Field_Label;

form.appendChild(label);

let input=document.createElement("input");

input.type="text";

input.id=field.Field_Name;

if(field.Editable!="Yes"){

input.disabled=true;

}

input.oninput=function(){

validateForm();

if(field.Field_Name=="Name"){

searchName(this.value);

}

};

form.appendChild(input);

form.appendChild(document.createElement("br"));

});

}

async function searchName(name){

if(name.length<2) return;

let res=await fetch(
API_URL+
"?action=search"+
"&event="+EVENT_ID+
"&name="+name
);

let data=await res.json();

showNameList(data.participants);

}

function showNameList(list){

let existing=document.getElementById("nameList");

if(existing){

existing.remove();

}

let div=document.createElement("div");

div.id="nameList";

list.forEach(p=>{

let item=document.createElement("div");

item.innerText=p.Name;

item.style.cursor="pointer";

item.onclick=function(){

selectParticipant(p);

};

div.appendChild(item);

});

document.getElementById("Name")
.after(div);

}

function selectParticipant(p){

RULES.forEach(field=>{

let el=document.getElementById(field.Field_Name);

if(el && p[field.Field_Name]){

el.value=p[field.Field_Name];

}

});

document.getElementById("nameList").remove();

}

function validateForm(){

let valid=true;

RULES.forEach(field=>{

if(field.Mandatory!="Yes") return;

let el=document.getElementById(field.Field_Name);

if(!el) return;

if(el.value=="") valid=false;

});

if(EDIT_MODE){

document.getElementById("updateBtn").disabled=!valid;

}

}
