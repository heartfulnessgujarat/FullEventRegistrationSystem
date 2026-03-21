const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
let REGISTRATIONS=[];
let CENTRES=[];

let participant=null;

let EDIT_MODE=false;

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

d.onclick=function(){

selectParticipant(p);

};

list.appendChild(d);

});

}

function selectParticipant(p){

participant=p;

document.getElementById("list").innerHTML="";

showButtons();

buildDetails();

}

function buildDetails(){

let form=document.getElementById("form");

form.innerHTML="";

add("Name",participant.Name,false);

add("Mobile",participant.Mobile,false);

add("Email",participant.Email,false);

add("Centre",participant.Centre,false);

add("District",participant.District,false);

add("Zone",participant.Zone,false);

add("SRCMID",participant.SRCMID,false);

add("PINCODE",participant.PINCODE,false);

}

function add(name,val,editable){

let form=document.getElementById("form");

let l=document.createElement("label");

l.innerText=name;

form.appendChild(l);

let i=document.createElement("input");

i.value=val || "";

i.id=name;

i.disabled=!editable;

form.appendChild(i);

}

function showButtons(){

document.getElementById("buttons").style.display="block";

document.getElementById("registerBtn").disabled=false;

document.getElementById("registerBtn").style.display="inline";

document.getElementById("editBtn").style.display="inline";

document.getElementById("updateBtn").style.display="none";

}

document
.getElementById("editBtn")
.onclick=function(){

enterEditMode();

};

function enterEditMode(){

EDIT_MODE=true;

document.getElementById("registerBtn").disabled=true;

document.getElementById("editBtn").style.display="none";

document.getElementById("updateBtn").style.display="inline";

enable("Mobile");

enable("Email");

enableCentre();

enable("PINCODE");

}

function enable(name){

document.getElementById(name).disabled=false;

}

function enableCentre(){

let c=document.getElementById("Centre");

c.disabled=false;

c.oninput=function(){

document.getElementById("updateBtn").disabled=true;

centreSearch(this.value);

};

}

function centreSearch(text){

let list=document.getElementById("centreList");

if(!list){

list=document.createElement("div");

list.id="centreList";

document.getElementById("Centre")
.after(list);

}

list.innerHTML="";

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

list.appendChild(d);

});

}

function selectCentre(c){

document.getElementById("Centre").value=c.Centre;

document.getElementById("District").value=c.District;

document.getElementById("Zone").value=c.Zone;

document.getElementById("centreList").innerHTML="";

document.getElementById("updateBtn").disabled=false;

}

document
.getElementById("registerBtn")
.onclick=function(){

register();

};

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
