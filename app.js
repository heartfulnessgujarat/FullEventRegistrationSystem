const API="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";

const params=new URLSearchParams(window.location.search);

const EVENT=params.get("event");

let CONFIG;
let RULES=[];
let CENTRES=[];
let participant=null;

let verified=false;

init();

async function init(){

let res=await fetch(API+"?event="+EVENT);

CONFIG=await res.json();

RULES=CONFIG.rules||[];

CENTRES=CONFIG.centres||[];

setTitles(CONFIG.titles);

buildName();

}

function setTitles(titles){

document.getElementById("eventTitle")
.innerText=
titles.find(t=>t.Property=="Event Title").Value;

document.getElementById("eventSubtitle")
.innerText=
titles.find(t=>t.Property=="Event Subtitle").Value;

}

function buildName(){

let form=document.getElementById("form");

form.innerHTML="";

let input=document.createElement("input");

input.id="Name";

form.appendChild(input);

lookup(input,
CONFIG.participants,
"Name",
(p)=>{

participant=p;

buildDetails();

showButtons();

});

}

function buildDetails(){

let form=document.getElementById("form");

form.innerHTML="";

createField("Name",participant.Name,false);

createField("Mobile",participant.Mobile,false,true);

createField("Email",participant.Email,false,true);

createField("Centre",participant.Centre,false);

createField("District",participant.District,false);

createField("Zone",participant.Zone,false);

createField("SRCMID",participant.SRCMID,false);

createField("PINCODE",participant.PINCODE,false);

}

function createField(name,value,editable,verify){

let form=document.getElementById("form");

let label=document.createElement("label");

label.innerText=name;

form.appendChild(label);

let input=document.createElement("input");

input.id=name;

input.value=value;

input.disabled=!editable;

form.appendChild(input);

/* help */

let rule=RULES.find(r=>
r.Field_Name.trim()==name);

if(rule){

let help=document.createElement("div");

help.innerText=rule.Help_Text;

help.style.fontSize="12px";

help.style.color="gray";

help.style.display="none";

help.id="help_"+name;

form.appendChild(help);

}

/* verification */

if(verify){

let btn=document.createElement("button");

btn.innerText="Send Verification";

btn.style.display="none";

btn.id="verify_"+name;

btn.onclick=()=>sendCode();

form.appendChild(btn);

}

}

function showButtons(){

document.getElementById("buttons")
.style.display="block";

document.getElementById("registerBtn")
.onclick=register;

document.getElementById("editBtn")
.onclick=edit;

}

function edit(){

document.getElementById("registerBtn")
.disabled=true;

document.getElementById("editBtn")
.style.display="none";

document.getElementById("updateBtn")
.style.display="inline";

document.getElementById("updateBtn")
.disabled=true;

enable("Mobile");

enable("Email");

enable("PINCODE");

RULES.forEach(r=>{

let h=document.getElementById(
"help_"+r.Field_Name);

if(h) h.style.display="block";

});

document.getElementById("verify_Mobile")
.style.display="inline";

document.getElementById("verify_Email")
.style.display="inline";

}

function enable(id){

document.getElementById(id)
.disabled=false;

document.getElementById("updateBtn")
.disabled=true;

verified=false;

}

async function sendCode(){

let email=
document.getElementById("Email").value;

await fetch(
API+
"?action=verify&email="+email
);

alert(
"Verification code sent to "+
email
);

let input=
document.createElement("input");

input.placeholder=
"Enter verification code";

input.id="code";

document.getElementById("form")
.appendChild(input);

let btn=
document.createElement("button");

btn.innerText="Verify";

btn.onclick=verifyCode;

document.getElementById("form")
.appendChild(btn);

}

function verifyCode(){

verified=true;

document.getElementById("updateBtn")
.disabled=false;

alert("Verified");

}

async function register(){

await submit();

}

async function submit(){

let res=await fetch(

API+
"?action=register"+
"&event="+EVENT+
"&name="+document.getElementById("Name").value+
"&mobile="+document.getElementById("Mobile").value+
"&email="+document.getElementById("Email").value+
"&centre="+document.getElementById("Centre").value+
"&district="+document.getElementById("District").value+
"&zone="+document.getElementById("Zone").value+
"&srcm="+document.getElementById("SRCMID").value+
"&pincode="+document.getElementById("PINCODE").value

);

let data=await res.json();

showThankYou(data);

}

async function showThankYou(data){

document.getElementById("main")
.style.display="none";

let doc=
CONFIG.settings.ThankYou_Doc_URL
.replace("/edit","/export?format=html");

let html=
await fetch(doc).then(r=>r.text());

document.getElementById("thankyou")
.innerHTML=html;

document.getElementById("thankyou")
.style.display="block";

}
