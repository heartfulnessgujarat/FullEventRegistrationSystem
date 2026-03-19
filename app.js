const API_URL="https://script.google.com/macros/s/AKfycbwMXVVLzngiMoQr3XDlOKldn-_n0qflFgVxInhvkVQD5K5EKOeStm9v0q3hrSlJDjwT/exec";



const params =
new URLSearchParams(window.location.search);

const EVENT_ID=
params.get("event");

let RULES=[];
let OPTIONS=[];
let EVENT={};

init();

async function init(){

let res=
await fetch(API_URL+"?event="+EVENT_ID);

let data=
await res.json();

RULES=data.rules;

OPTIONS=data.options;

EVENT=data.event;

buildTitles(data.titles);

buildForm();

}

function buildTitles(titles){

let title=
titles.find(t=>t.Property=="Event Title");

let subtitle=
titles.find(t=>t.Property=="Event Subtitle");

document.getElementById("eventTitle")
.innerText=title.Value;

document.getElementById("eventSubtitle")
.innerText=subtitle.Value;

}

function buildForm(){

let form=
document.getElementById("dynamicForm");

RULES
.sort((a,b)=>a.Field_Order-b.Field_Order)
.forEach(field=>{

if(field.Show!="Yes")
return;

let label=
document.createElement("label");

label.innerText=
field.Field_Label;

form.appendChild(label);

let input;

if(field.Field_Type=="Dropdown"){

input=
document.createElement("select");

let fieldOptions=
OPTIONS.filter(o=>
o.Field_Name==
field.Field_Name
);

fieldOptions
.sort((a,b)=>a.Option_Order-b.Option_Order)
.forEach(opt=>{

if(opt.Option_Status!="Active")
return;

let option=
document.createElement("option");

option.value=
opt.Option_Value;

option.text=
opt.Option_Label;

input.appendChild(option);

});

}
else{

input=
document.createElement("input");

input.type="text";

}

input.id=
field.Field_Name;

form.appendChild(input);

form.appendChild(
document.createElement("br")
);

});

}
