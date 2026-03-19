const API_URL="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT_ID=params.get("event");

let PARTICIPANT=null;

let EDIT_MODE=false;

init();

async function init(){

showLoading();

let res=
await fetch(API_URL+"?event="+EVENT_ID);

let data=
await res.json();

buildNameField();

hideLoading();

}

function buildNameField(){

let form=document.getElementById("dynamicForm");

form.innerHTML="";

let label=document.createElement("label");

label.innerText="Name";

form.appendChild(label);

let input=document.createElement("input");

input.id="Name";

input.type="text";

input.oninput=function(){

searchName(this.value);

};

form.appendChild(input);

let list=document.createElement("div");

list.id="nameList";

form.appendChild(list);

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

let div=document.getElementById("nameList");

div.innerHTML="";

list.forEach(p=>{

let item=document.createElement("div");

item.innerText=p.Name;

item.style.cursor="pointer";

item.onclick=function(){

selectParticipant(p);

};

div.appendChild(item);

});

}

function selectParticipant(p){

PARTICIPANT=p;

document.getElementById("nameList").innerHTML="";

buildDetails();

}

function buildDetails(){

let form=document.getElementById("dynamicForm");

form.innerHTML="";

addField("Name",PARTICIPANT.Name,false);

addField("Mobile",PARTICIPANT.Mobile,false);

addField("Email",PARTICIPANT.Email,false);

addField("Centre",PARTICIPANT.Centre,false);

addField("District",PARTICIPANT.District,false);

addField("Zone",PARTICIPANT.Zone,false);

addField("SRCMID",PARTICIPANT.SRCMID,false);

addField("PINCODE",PARTICIPANT.PINCODE,false);

showButtons();

}

function addField(name,value,editable){

let form=document.getElementById("dynamicForm");

let label=document.createElement("label");

label.innerText=name;

form.appendChild(label);

let input=document.createElement("input");

input.id=name;

input.value=value;

input.disabled=!editable;

form.appendChild(input);

form.appendChild(document.createElement("br"));

}

function showButtons(){

document.getElementById("buttonArea")
.style.display="block";

document.getElementById("registerBtn")
.style.display="inline";

document.getElementById("editBtn")
.style.display="inline";

}

document.getElementById("editBtn").onclick=function(){

enableEdit();

};

function enableEdit(){

EDIT_MODE=true;

document.getElementById("registerBtn")
.disabled=true;

document.getElementById("editBtn")
.style.display="none";

document.getElementById("updateBtn")
.style.display="inline";

enableField("Mobile");

enableField("Email");

enableField("Centre");

enableField("PINCODE");

}

function enableField(name){

let el=document.getElementById(name);

if(el){

el.disabled=false;

}

}

document.getElementById("registerBtn").onclick=function(){

alert("Registration ready");

};

document.getElementById("updateBtn").onclick=function(){

alert("Updated registration ready");

};

function showLoading(){

document.getElementById("loading")
.style.display="block";

document.getElementById("buttonArea")
.style.display="none";

}

function hideLoading(){

document.getElementById("loading")
.style.display="none";

}
