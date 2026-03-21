const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
let REGISTRATIONS=[];
let CENTRES=[];
let participant=null;

init();

async function init(){

let res=await fetch(API+"?event="+EVENT);

let data=await res.json();

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

/* HIDDEN BY DEFAULT */

list.style.display="none";

list.style.background="white";

list.style.position="relative";

input.after(list);

input.oninput=function(){

list.innerHTML="";

let text=this.value.trim();

if(!text){

list.style.display="none";
return;

}

let results=data.filter(r=>
r[key] &&
r[key].toString()
.trim()
.toLowerCase()
.startsWith(text.toLowerCase())
);

if(results.length==0){

list.style.display="none";
return;

}

/* SHOW ONLY WHEN RESULTS EXIST */

list.style.display="block";

results.slice(0,10).forEach(r=>{

let item=document.createElement("div");

item.innerText=r[key];

item.style.cursor="pointer";

item.style.padding="6px";

item.style.border="1px solid #eee";

item.onmouseover=function(){

this.style.background="#f5f5f5";

};

item.onmouseout=function(){

this.style.background="white";

};

item.onclick=function(){

input.value=r[key];

list.innerHTML="";
list.style.display="none";

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

let registerBtn=document.getElementById("registerBtn");

let editBtn=document.getElementById("editBtn");

let updateBtn=document.getElementById("updateBtn");

registerBtn.disabled=false;

registerBtn.style.opacity="1";

registerBtn.style.pointerEvents="auto";

editBtn.style.display="inline";

updateBtn.style.display="none";

registerBtn.onclick=register;

editBtn.onclick=enableEdit;

}

function enableEdit(){

let registerBtn=document.getElementById("registerBtn");

registerBtn.disabled=true;

/* HARD DISABLE */

registerBtn.style.pointerEvents="none";

registerBtn.style.opacity="0.5";

registerBtn.onclick=null;

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
