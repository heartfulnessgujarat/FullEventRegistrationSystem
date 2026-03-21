const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let participant=null;

let PARTICIPANTS=[];

init();

async function init(){

let cached=
localStorage.getItem("CFG_"+EVENT);

if(cached){

let data=JSON.parse(cached);

PARTICIPANTS=data.participants;

setTitles(data.titles);

buildName();

return;

}

let res=
await fetch(API+"?event="+EVENT);

let data=
await res.json();

PARTICIPANTS=data.participants;

localStorage.setItem(
"CFG_"+EVENT,
JSON.stringify(data)
);

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

input.id="name";

input.autocomplete="off";

input.oninput=function(){

searchLocal(this.value);

};

form.appendChild(input);

let list=document.createElement("div");

list.id="list";

form.appendChild(list);

}

function searchLocal(name){

let list=document.getElementById("list");

list.innerHTML="";

if(name.length<1)return;

let results=
PARTICIPANTS.filter(p=>
p.Name.toLowerCase()
.startsWith(name.toLowerCase())
);

results.slice(0,10)
.forEach(p=>{

let d=document.createElement("div");

d.innerText=p.Name;

d.style.cursor="pointer";

d.onclick=function(){

select(p);

};

list.appendChild(d);

});

}

function select(p){

participant=p;

document.getElementById("list").innerHTML="";

buildDetails();

checkRegistration();

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

i.value=val;

i.id=name;

i.disabled=true;

form.appendChild(i);

}

async function checkRegistration(){

let res=
await fetch(
API+
"?action=checkRegistration"+
"&event="+EVENT+
"&name="+participant.Name
);

let data=await res.json();

if(data.status=="exists"){

document.getElementById("message")
.innerText="You are already registered";

}
else{

document.getElementById("buttons")
.style.display="block";

}

}

document
.getElementById("registerBtn")
.onclick=register;

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
.innerText=
"Registration successful. ID: "+
data.registrationId;

}

}
