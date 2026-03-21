const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let PARTICIPANTS=[];
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

PARTICIPANTS=data.participants||[];

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

lookup(input,PARTICIPANTS,"Name",(p)=>{

participant=p;

buildDetails();

showButtons();

});

}

function lookup(input,data,key,callback){

let list=document.createElement("div");

/* IMPORTANT FIX */

list.style.position="absolute";
list.style.background="white";
list.style.zIndex="1000";
list.style.display="none";

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
r[key].toLowerCase()
.startsWith(text.toLowerCase())
);

if(results.length==0){

list.style.display="none";
return;

}

list.style.display="block";

results.slice(0,10).forEach(r=>{

let item=document.createElement("div");

item.innerText=r[key];

item.style.padding="5px";

item.style.cursor="pointer";

item.onclick=function(){

input.value=r[key];

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

field("Name",participant.Name,false);

field("Mobile",participant.Mobile,false);

field("Email",participant.Email,false);

field("Centre",participant.Centre,false);

field("District",participant.District,false);

field("Zone",participant.Zone,false);

field("SRCMID",participant.SRCMID,false);

field("PINCODE",participant.PINCODE,false);

}

function field(name,value,editable){

let form=document.getElementById("form");

let l=document.createElement("label");

l.innerText=name;

form.appendChild(l);

let i=document.createElement("input");

i.id=name;

i.value=value||"";

i.disabled=!editable;

form.appendChild(i);

}

function showButtons(){

let r=document.getElementById("registerBtn");

let e=document.getElementById("editBtn");

let u=document.getElementById("updateBtn");

document.getElementById("buttons").style.display="block";

r.disabled=false;

r.style.pointerEvents="auto";

r.tabIndex=0;

e.style.display="inline";

u.style.display="none";

r.onclick=register;

e.onclick=editMode;

}

function editMode(){

let r=document.getElementById("registerBtn");

r.disabled=true;

r.style.pointerEvents="none";

r.tabIndex=-1;

r.style.opacity="0.5";

document.getElementById("editBtn").style.display="none";

document.getElementById("updateBtn").style.display="inline";

enable("Mobile");

enable("Email");

enable("PINCODE");

enableCentre();

}

function enable(name){

document.getElementById(name).disabled=false;

}

function enableCentre(){

let c=document.getElementById("Centre");

c.disabled=false;

let u=document.getElementById("updateBtn");

u.disabled=true;

lookup(c,CENTRES,"Centre",(x)=>{

document.getElementById("District").value=x.District;

document.getElementById("Zone").value=x.Zone;

u.disabled=false;

});

c.oninput=function(){

u.disabled=true;

};

}

async function register(){

document.getElementById("message").innerText=
"Registration working (next step).";

}
