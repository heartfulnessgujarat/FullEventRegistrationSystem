const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let participant=null;

init();

async function init(){

if(!EVENT){

document.getElementById("message")
.innerText="Event not specified";

return;

}

let res=await fetch(
API+"?event="+encodeURIComponent(EVENT)
);

let data=await res.json();

setTitles(data.titles);

buildName();

}

function setTitles(titles){

let t=titles.find(x=>x.Property=="Event Title");

let s=titles.find(x=>x.Property=="Event Subtitle");

if(t){

document.getElementById("eventTitle")
.innerText=t.Value;

}

if(s){

document.getElementById("eventSubtitle")
.innerText=s.Value;

}

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

searchName(this.value);

};

form.appendChild(input);

let list=document.createElement("div");

list.id="list";

form.appendChild(list);

}

async function searchName(name){

if(name.length<2)return;

let url=
API+
"?action=search"+
"&event="+encodeURIComponent(EVENT)+
"&name="+encodeURIComponent(name);

let res=await fetch(url);

let data=await res.json();

let list=document.getElementById("list");

list.innerHTML="";

data.participants.forEach(p=>{

let d=document.createElement("div");

d.innerText=p.Name;

d.style.cursor="pointer";

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

await checkRegistration();

}

function buildDetails(){

let form=document.getElementById("form");

form.innerHTML="";

addField("Name",participant.Name);

addField("Mobile",participant.Mobile);

addField("Email",participant.Email);

addField("Centre",participant.Centre);

addField("District",participant.District);

addField("Zone",participant.Zone);

addField("SRCMID",participant.SRCMID);

addField("PINCODE",participant.PINCODE);

}

function addField(name,val){

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

let url=
API+
"?action=checkRegistration"+
"&event="+encodeURIComponent(EVENT)+
"&name="+encodeURIComponent(participant.Name);

let res=await fetch(url);

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

let url=
API+
"?action=register"+
"&event="+encodeURIComponent(EVENT)+
"&name="+encodeURIComponent(participant.Name)+
"&mobile="+encodeURIComponent(participant.Mobile)+
"&email="+encodeURIComponent(participant.Email)+
"&centre="+encodeURIComponent(participant.Centre)+
"&district="+encodeURIComponent(participant.District)+
"&zone="+encodeURIComponent(participant.Zone)+
"&srcm="+encodeURIComponent(participant.SRCMID)+
"&pincode="+encodeURIComponent(participant.PINCODE);

let res=await fetch(url);

let data=await res.json();

if(data.status=="success"){

document.getElementById("message")
.innerText=
"Registration successful. ID: "+
data.registrationId;

}

}
