const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
let REGISTRATIONS=[];
let CENTRES=[];
let participant=null;

init();

async function init(){

localStorage.removeItem("CFG_EVT001"); // TEMP safety

let cached=localStorage.getItem("CFG_"+EVENT);

let data;

if(cached){

data=JSON.parse(cached);

}
else{

let res=await fetch(API+"?event="+EVENT);

data=await res.json();

localStorage.setItem("CFG_"+EVENT,JSON.stringify(data));

}

PARTICIPANTS=data.participants||[];
REGISTRATIONS=data.registrations||[];
CENTRES=data.centres||[];

setTitles(data.titles);

buildName();

}

function setTitles(titles){

document.getElementById("eventTitle").innerText=
titles.find(t=>t.Property=="Event Title").Value;

document.getElementById("eventSubtitle").innerText=
titles.find(t=>t.Property=="Event Subtitle").Value;

}

function buildName(){

let form=document.getElementById("form");

form.innerHTML="";

let label=document.createElement("label");
label.innerText="Name";

form.appendChild(label);

let input=document.createElement("input");

input.id="Name";

form.appendChild(input);

attachLookup(input,PARTICIPANTS,"Name",(p)=>{

participant=p;

buildDetails();

showButtons();

});

}

function attachLookup(input,data,key,callback){

let list=document.createElement("div");

list.style.border="1px solid #ccc";

input.after(list);

input.oninput=function(){

list.innerHTML="";

let text=this.value.trim();

if(!text)return;

let results=data.filter(r=>
r[key] &&
r[key].toString()
.trim()
.toLowerCase()
.startsWith(text.toLowerCase())
);

results.slice(0,10).forEach(r=>{

let item=document.createElement("div");

item.innerText=r[key];

item.style.cursor="pointer";

item.style.padding="5px";

item.onclick=function(){

input.value=r[key];

list.innerHTML="";

callback(r);

};

list.appendChild(item);

});

};

}

function buildDetails(){

let form=document.getElementById("form");

form.innerHTML="";

createField("Name",participant.Name,false);

createField("Mobile",participant.Mobile,false);

createField("Email",participant.Email,false);

createField("Centre",participant.Centre,false);

createField("District",participant.District,false);

createField("Zone",participant.Zone,false);

createField("SRCMID",participant.SRCMID,false);

createField("PINCODE",participant.PINCODE,false);

}

function createField(name,value,editable){

let form=document.getElementById("form");

let label=document.createElement("label");

label.innerText=name;

form.appendChild(label);

let input=document.createElement("input");

input.id=name;

input.value=value||"";

input.disabled=!editable;

form.appendChild(input);

}

function showButtons(){

let buttons=document.getElementById("buttons");

buttons.style.display="block";

document.getElementById("registerBtn").disabled=false;

document.getElementById("editBtn").style.display="inline";

document.getElementById("updateBtn").style.display="none";

document.getElementById("registerBtn").onclick=register;

document.getElementById("editBtn").onclick=enableEdit;

}

function enableEdit(){

document.getElementById("registerBtn").disabled=true;

document.getElementById("editBtn").style.display="none";

document.getElementById("updateBtn").style.display="inline";

enableField("Mobile");

enableField("Email");

enableField("PINCODE");

enableCentreLookup();

}

function enableField(name){

document.getElementById(name).disabled=false;

}

function enableCentreLookup(){

let old=document.getElementById("Centre");

/* CLONE FIELD TO RESET EVENTS */

let newCentre=old.cloneNode(true);

old.parentNode.replaceChild(newCentre,old);

newCentre.disabled=false;

let updateBtn=document.getElementById("updateBtn");

updateBtn.disabled=true;

attachLookup(newCentre,CENTRES,"Centre",(c)=>{

document.getElementById("District").value=c.District;

document.getElementById("Zone").value=c.Zone;

updateBtn.disabled=false;

});

newCentre.addEventListener("input",()=>{

updateBtn.disabled=true;

});

}

async function register(){

let res=await fetch(
API+
"?action=register"+
"&event="+EVENT+
"&name="+participant.Name+
"&mobile="+participant.Mobile+
"&email="+participant.Email+
"&centre="+participant.Centre+
"&district="+participant.District+
"&zone="+participant.Zone+
"&srcm="+participant.SRCMID+
"&pincode="+participant.PINCODE
);

let data=await res.json();

if(data.status=="success"){

document.getElementById("message")
.innerText="Registration successful";

}

}
