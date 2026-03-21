const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
let REGISTRATIONS=[];
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
p.Name &&
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

/* SHOW BUTTONS FIRST */

showButtonsInstant();

/* RENDER DETAILS AFTER */

setTimeout(()=>{

buildDetails();

},50);

}

function buildDetails(){

let form=document.getElementById("form");

form.innerHTML="";

add("Name",participant.Name);

add("Mobile",participant.Mobile);

add("Email",participant.Email);

add("Centre",participant.Centre);

add("District",participant.District);

add("Zone",participant.Zone);

add("SRCMID",participant.SRCMID);

add("PINCODE",participant.PINCODE);

}

function add(name,val){

let form=document.getElementById("form");

let l=document.createElement("label");

l.innerText=name;

form.appendChild(l);

let i=document.createElement("input");

i.value=val || "";

i.disabled=true;

form.appendChild(i);

}

function showButtonsInstant(){

let buttons=document.getElementById("buttons");

buttons.style.display="block";

let found=
REGISTRATIONS.find(r=>
r.Name==participant.Name &&
r.Registration_Status!="Cancelled"
);

if(found){

document.getElementById("message")
.innerText="Already registered";

document.getElementById("registerBtn")
.style.display="none";

document.getElementById("editBtn")
.innerText="Edit my registration";

}
else{

document.getElementById("registerBtn")
.style.display="inline";

document.getElementById("editBtn")
.innerText="I want to edit my details";

}

}

document
.getElementById("registerBtn")
.onclick=function(){

register();

};

document
.getElementById("editBtn")
.onclick=function(){

enableEdit();

};

function enableEdit(){

document.getElementById("registerBtn")
.disabled=true;

document.getElementById("updateBtn")
.style.display="inline";

document.getElementById("editBtn")
.style.display="none";

unlock("Mobile");

unlock("Email");

unlock("Centre");

unlock("PINCODE");

}

function unlock(name){

let labels=document.getElementsByTagName("label");

for(let i=0;i<labels.length;i++){

if(labels[i].innerText==name){

labels[i].nextSibling.disabled=false;

}

}

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
