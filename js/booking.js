/*
  EMAILJS SETUP
  1) Create an account at https://www.emailjs.com/
  2) Create a service and email template.
  3) Replace the three values below.
  4) Keep the public key in frontend code; never put private server keys here.
*/
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

const services = {
  haircut: {name:"Classic Haircut", price:150, duration:45},
  fade: {name:"Signature Fade", price:170, duration:50},
  beard: {name:"Beard Trim", price:120, duration:30},
  kids: {name:"Kids Cut", price:120, duration:35},
  premium: {name:"Premium Package", price:300, duration:75},
  hairbeard: {name:"Hair & Beard", price:250, duration:60}
};
const barbers = {
  mike:{name:"Mike", role:"Senior Barber"},
  jamal:{name:"Jamal", role:"Barber"},
  chris:{name:"Chris", role:"Barber"}
};

const form = document.querySelector("#bookingForm");
const summary = document.querySelector("#bookingSummary");
const dateInput = document.querySelector("#bookingDate");
const timeGrid = document.querySelector("#timeGrid");
const selectedTimeInput = document.querySelector("#selectedTime");
const confirmation = document.querySelector("#confirmation");
const today = new Date();
if(dateInput){
  dateInput.min = today.toISOString().split("T")[0];
  dateInput.value = today.toISOString().split("T")[0];
}

function getSelectedService(){
  const radio = document.querySelector('input[name="service"]:checked');
  return radio ? services[radio.value] : null;
}
function getSelectedBarber(){
  const radio = document.querySelector('input[name="barber"]:checked');
  return radio ? barbers[radio.value] : null;
}
function formatDate(value){
  if(!value) return "Not selected";
  return new Intl.DateTimeFormat("en-ZA",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(value+"T12:00:00"));
}
function renderTimes(){
  if(!timeGrid) return;
  const slots=["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
  timeGrid.innerHTML="";
  slots.forEach(t=>{
    const b=document.createElement("button");
    b.type="button"; b.className="time-btn"; b.textContent=t;
    b.addEventListener("click",()=>{
      document.querySelectorAll(".time-btn").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected"); selectedTimeInput.value=t; updateSummary();
    });
    timeGrid.appendChild(b);
  });
}
function updateSummary(){
  const s=getSelectedService(), b=getSelectedBarber();
  document.querySelector("#sumService").textContent=s?.name || "—";
  document.querySelector("#sumBarber").textContent=b?.name || "—";
  document.querySelector("#sumDate").textContent=formatDate(dateInput?.value);
  document.querySelector("#sumTime").textContent=selectedTimeInput?.value || "—";
  document.querySelector("#sumPrice").textContent=s ? `R${s.price}` : "R0";
}
document.querySelectorAll('input[name="service"],input[name="barber"]').forEach(x=>x.addEventListener("change",updateSummary));
dateInput?.addEventListener("change",()=>{ selectedTimeInput.value=""; document.querySelectorAll(".time-btn").forEach(x=>x.classList.remove("selected")); updateSummary(); });
renderTimes(); updateSummary();

function addMinutes(time, mins){
  const [h,m]=time.split(":").map(Number); const d=new Date(2000,0,1,h,m); d.setMinutes(d.getMinutes()+mins);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function googleCalendarUrl(data){
  const start = data.date.replaceAll("-","") + "T" + data.time.replace(":","") + "00";
  const end = data.date.replaceAll("-","") + "T" + addMinutes(data.time,data.duration).replace(":","") + "00";
  const params=new URLSearchParams({
    action:"TEMPLATE",
    text:`${data.service} with ${data.barber} — Crown Cuts`,
    dates:`${start}/${end}`,
    details:`Booking for ${data.customer}. Barber: ${data.barber}. Service: ${data.service}. Phone: ${data.phone}.`,
    location:"123 Long Street, Cape Town CBD, South Africa"
  });
  return "https://calendar.google.com/calendar/render?"+params.toString();
}
function downloadICS(data){
  const start = `${data.date}T${data.time}:00`;
  const endTime = addMinutes(data.time,data.duration);
  const end = `${data.date}T${endTime}:00`;
  const ics=[
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Crown Cuts//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start.replace(/[-:]/g,"")}`,
    `DTEND:${end.replace(/[-:]/g,"")}`,
    `SUMMARY:${data.service} with ${data.barber} - Crown Cuts`,
    `DESCRIPTION:Booking for ${data.customer}. Phone: ${data.phone}.`,
    "LOCATION:123 Long Street\\, Cape Town CBD\\, South Africa",
    "END:VEVENT","END:VCALENDAR"
  ].join("\r\n");
  const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a");
  a.href=url; a.download="crown-cuts-appointment.ics"; a.click(); URL.revokeObjectURL(url);
}
function collectData(){
  const s=getSelectedService(), b=getSelectedBarber();
  return {
    service:s.name, price:s.price, duration:s.duration, barber:b.name,
    date:dateInput.value, time:selectedTimeInput.value,
    customer:document.querySelector("#customerName").value.trim(),
    email:document.querySelector("#customerEmail").value.trim(),
    phone:document.querySelector("#customerPhone").value.trim()
  };
}
function validate(data){
  if(!data.service || !data.barber || !data.date || !data.time || !data.customer || !data.email || !data.phone){
    showToast("Please complete all booking fields."); return false;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){ showToast("Please enter a valid email."); return false; }
  return true;
}
form?.addEventListener("submit", async e=>{
  e.preventDefault();
  const data=collectData();
  if(!validate(data)) return;
  const submit=form.querySelector("button[type=submit]");
  submit.disabled=true; submit.textContent="Confirming…";

  let emailSent=false;
  if(window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"){
    try{
      emailjs.init({publicKey:EMAILJS_PUBLIC_KEY});
      await emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{
        customer_name:data.customer, customer_email:data.email, customer_phone:data.phone,
        service:data.service, barber:data.barber, booking_date:formatDate(data.date),
        booking_time:data.time, booking_price:`R${data.price}`
      });
      emailSent=true;
    }catch(err){ console.warn("EmailJS error:",err); }
  }

  document.querySelector("#confirmText").textContent =
    `Your ${data.service} with ${data.barber} is confirmed for ${formatDate(data.date)} at ${data.time}.`;
  confirmation.hidden=false; form.hidden=true;
  document.querySelector("#googleCalendar").href=googleCalendarUrl(data);
  document.querySelector("#downloadICS").onclick=()=>downloadICS(data);
  confirmation.scrollIntoView({behavior:"smooth",block:"start"});
  showToast(emailSent ? "Booking confirmed and email sent." : "Booking confirmed. Add it to your calendar.");
  submit.disabled=false; submit.textContent="Confirm Booking";
});
