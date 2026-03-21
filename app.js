const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
let REGISTRATIONS=[];
let CENTRES=[];

let participant=null;

init();

async function init(){

let cached=
localStorage.getItem("CFG_"+EVENT);

let data;

if(cached){

data=JSON.parse(cached);

}
else{

let res=
await fetch(API+"?event="+EVENT);

data=await res.json();

localStorage.setItem(
"CFG_"+EVENT,
JSON.stringify(data)
);

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

let l=document.createElement("label");

l.innerText="Name";

form.appendChild(l);

let input=document.createElement("input");

input.autocomplete="off";

input.oninput=function(){

searchLocal(this.value);

};

form.appendChild(input);

let list=document.createElement("div");

list.id="list";

form.appendChild(list);

}

function searchLocal(text){

let list=document.getElementById("list");

list.innerHTML="";

if(!text)return;

let results=
PARTICIPANTS.filter(p=>
p.Name.toLowerCase()
.startsWith(text.toLowerCase())
);

results.slice(0,10)
.forEach(p=>{

let d=document.createElement("div");

d.innerText=p.Name;

d.style.cursor="pointer";

d.style.padding="6px";

d.onclick=function(){

selectParticipant(p);

};

list.appendChild(d);

});

}

function selectParticipant(p){

participant=p;

document.getElementById("list").innerHTML="";

buildDetails();

prepareButtons();

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

let found=
REGISTRATIONS.find(r=>
r.Name==participant.Name &&
r.Registration_Status!="Cancelled"
);

let registerBtn=document.getElementById("registerBtn");

let editBtn=document.getElementById("editBtn");

let updateBtn=document.getElementById("updateBtn");

updateBtn.style.display="none";

registerBtn.disabled=false;

editBtn.style.display="inline";

if(found){

registerBtn.style.display="none";

editBtn.innerText="Edit my registration";

}
else{

registerBtn.style.display="inline";

editBtn.innerText="I want to edit my details";

}

registerBtn.onclick=register;

editBtn.onclick=enterEditMode;

updateBtn.onclick=updateRegistration;

}

function enterEditMode(){

let registerBtn=document.getElementById("registerBtn");

let editBtn=document.getElementById("editBtn");

let updateBtn=document.getElementById("updateBtn");

registerBtn.disabled=true;

editBtn.style.display="none";

updateBtn.style.display="inline";

enableField("Mobile");

enableField("Email");

enableCentreField();

enableField("PINCODE");

}

function enableField(name){

document.getElementById(name).disabled=false;

}

function enableCentreField(){

let centre=document.getElementById("Centre");

centre.disabled=false;

centre.oninput=function(){

document.getElementById("updateBtn").disabled=true;

centreLookup(this.value);

};

}

function centreLookup(text){

let existing=document.getElementById("centreList");

if(!existing){

existing=document.createElement("div");

existing.id="centreList";

document.getElementById("Centre").after(existing);

}

existing.innerHTML="";

let results=
CENTRES.filter(c=>
c.Centre.toLowerCase()
.startsWith(text.toLowerCase())
);

results.slice(0,10)
.forEach(c=>{

let d=document.createElement("div");

d.innerText=c.Centre;

d.style.cursor="pointer";

d.onclick=function(){

selectCentre(c);

};

existing.appendChild(d);

});

}

function selectCentre(c){

document.getElementById("Centre").value=c.Centre;

document.getElementById("District").value=c.District;

document.getElementById("Zone").value=c.Zone;

document.getElementById("centreList").innerHTML="";

document.getElementById("updateBtn").disabled=false;

}

async function register(){

let res=
await fetch(
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

function updateRegistration(){

document.getElementById("message")
.innerText="Update flow next step";

}
