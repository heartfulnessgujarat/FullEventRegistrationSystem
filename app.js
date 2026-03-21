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

createLookup(

input,
PARTICIPANTS,
"Name",
function(p){

participant=p;

buildDetails();

prepareButtons();

}

);

}

function createLookup(input,data,key,onSelect){

let list=document.createElement("div");

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

let item=document.createElement("div");

item.innerText=r[key];

item.style.cursor="pointer";

item.style.padding="5px";

item.onclick=function(){

input.value=r[key];

list.innerHTML="";

onSelect(r);

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

input.value=value || "";

input.disabled=!editable;

form.appendChild(input);

}

function prepareButtons(){

let buttons=document.getElementById("buttons");

buttons.style.display="block";

let registerBtn=document.getElementById("registerBtn");

let editBtn=document.getElementById("editBtn");

let updateBtn=document.getElementById("updateBtn");

updateBtn.style.display="none";

registerBtn.disabled=false;

editBtn.style.display="inline";

registerBtn.onclick=register;

editBtn.onclick=enterEditMode;

}

function enterEditMode(){

document.getElementById("registerBtn").disabled=true;

document.getElementById("editBtn").style.display="none";

document.getElementById("updateBtn").style.display="inline";

enableField("Mobile");

enableField("Email");

enableField("PINCODE");

enableCentre();

}

function enableField(name){

document.getElementById(name).disabled=false;

}

function enableCentre(){

let centre=document.getElementById("Centre");

centre.disabled=false;

let updateBtn=document.getElementById("updateBtn");

updateBtn.disabled=false;

createLookup(

centre,
CENTRES,
"Centre",

function(c){

document.getElementById("District").value=c.District;

document.getElementById("Zone").value=c.Zone;

updateBtn.disabled=false;

}

);

centre.oninput=function(){

updateBtn.disabled=true;

};

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
