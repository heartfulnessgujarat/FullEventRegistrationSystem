const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=
new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let participant=null;

init();

async function init(){

let res=
await fetch(API+"?event="+EVENT);

let data=
await res.json();

setTitles(data.titles);

buildName();

}

function setTitles(titles){

let t=titles.find(x=>x.Property=="Event Title");

let s=titles.find(x=>x.Property=="Event Subtitle");

document.getElementById("eventTitle")
.innerText=t.Value;

document.getElementById("eventSubtitle")
.innerText=s.Value;

}

function buildName(){

let form=
document.getElementById("form");

form.innerHTML="";

let l=document.createElement("label");

l.innerText="Name";

form.appendChild(l);

let input=document.createElement("input");

input.id="name";

input.oninput=function(){

searchName(this.value);

};

form.appendChild(input);

let list=document.createElement("div");

list.id="list";

form.appendChild(list);

}

async function searchName(name){

if(name.length<2)return;

let res=
await fetch(
API+
"?action=search"+
"&event="+EVENT+
"&name="+name
);

let data=await res.json();

let list=document.getElementById("list");

list.innerHTML="";

data.participants.forEach(p=>{

let d=document.createElement("div");

d.innerText=p.Name;

d.onclick=function(){

select(p);

};

list.appendChild(d);

});

}

async function select(p){

participant=p;

document.getElementById("list").innerHTML="";

buildDetails();

checkRegistration();

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

i.value=val;

i.id=name;

i.disabled=!editable;

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

let data=
await res.json();

if(data.status=="exists"){

document.getElementById("message")
.innerText=
"You are already registered";

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
"Registered. ID: "+
data.registrationId;

}

}
