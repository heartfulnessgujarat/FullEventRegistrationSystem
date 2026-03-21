alert("NEW VERSION LOADED");

const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
let REGISTRATIONS=[];
let CENTRES=[];

let participant=null;

init();

async function init(){

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

PARTICIPANTS=data.participants || [];

REGISTRATIONS=data.registrations || [];

CENTRES=data.centres || [];

setTitles(data.titles);

buildName();

}

function setTitles(titles){

let t=titles.find(x=>x.Property=="Event Title");

let s=titles.find(x=>x.Property=="Event Subtitle");

document.getElementById("eventTitle").innerText=t.Value;

document.getElementById("eventSubtitle").innerText=s.Value;

}

function buildName(){

let form=document.getElementById("form");

form.innerHTML="";

let label=document.createElement("label");

label.innerText="Name";

form.appendChild(label);

let input=document.createElement("input");

input.id="Name";

input.autocomplete="off";

form.appendChild(input);

attachLookup(

"Name",

PARTICIPANTS,

"Name",

function(p){

participant=p;

buildDetails();

prepareButtons();

}

);

}

function attachLookup(field,data,key,onSelect){

let input=document.getElementById(field);

let list=document.createElement("div");

list.id=field+"List";

input.after(list);

input.oninput=function(){

list.innerHTML="";

let text=this.value;

if(!text)return;

let results=data.filter(r=>
r[key] &&
r[key].toLowerCase()
.startsWith(text.toLowerCase())
);

results.slice(0,10)
.forEach(r=>{

let d=document.createElement("div");

d.innerText=r[key];

d.style.cursor="pointer";

d.style.padding="6px";

d.onclick=function(){

input.value=r[key];

list.innerHTML="";

onSelect(r);

};

list.appendChild(d);

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

input.value=value || "";

input.disabled=!editable;

form.appendChild(input);

}

function prepareButtons(){

let buttons=document.getElementById("buttons");

buttons.style.display="block";

document.getElementById("registerBtn").disabled=false;

document.getElementById("editBtn").style.display="inline";

document.getElementById("updateBtn").style.display="none";

document.getElementById("registerBtn").onclick=register;

document.getElementById("editBtn").onclick=enterEditMode;

}

function enterEditMode(){

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

let centre=document.getElementById("Centre");

centre.disabled=false;

attachLookup(

"Centre",

CENTRES,

"Centre",

function(c){

document.getElementById("District").value=c.District;

document.getElementById("Zone").value=c.Zone;

document.getElementById("updateBtn").disabled=false;

}

);

document.getElementById("updateBtn").disabled=true;

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
