/* =========================================================
   CROWN CUTS — BOOKING EMAILJS
========================================================= */

const EMAILJS_PUBLIC_KEY = "f9iNhMxuaooaYZXoH";
const EMAILJS_SERVICE_ID = "service_qjyjftg";
const EMAILJS_BOOKING_TEMPLATE_ID = "template_cnak8f5";

const CROWN_COUPON = "CROWN10";
const CROWN_DISCOUNT = 10;

/* =========================================================
   SERVICES
========================================================= */

const services = {
  haircut: {
    name: "Classic Haircut",
    price: 150,
    duration: 45,
  },

  fade: {
    name: "Signature Fade",
    price: 170,
    duration: 50,
  },

  beard: {
    name: "Beard Trim",
    price: 120,
    duration: 30,
  },

  kids: {
    name: "Kids Cut",
    price: 120,
    duration: 35,
  },

  premium: {
    name: "Premium Package",
    price: 300,
    duration: 75,
  },

  hairbeard: {
    name: "Hair & Beard",
    price: 250,
    duration: 60,
  },
};

/* =========================================================
   BARBERS
========================================================= */

const barbers = {
  mike: {
    name: "Mike",
    role: "Senior Barber",
  },

  jamal: {
    name: "Jamal",
    role: "Barber",
  },

  chris: {
    name: "Chris",
    role: "Barber",
  },
};

/* =========================================================
   DOM ELEMENTS
========================================================= */

const form = document.querySelector("#bookingForm");
const summary = document.querySelector("#bookingSummary");

const dateInput = document.querySelector("#bookingDate");
const timeGrid = document.querySelector("#timeGrid");
const selectedTimeInput = document.querySelector("#selectedTime");

const confirmation = document.querySelector("#confirmation");

const couponInput = document.querySelector("#couponCode");

const applyCouponButton = document.querySelector("#applyCoupon");

const couponMessage = document.querySelector("#couponMessage");

/* =========================================================
   DISCOUNT STATE
========================================================= */

let couponApplied = false;
let discountPercent = 0;

/* =========================================================
   DATE
========================================================= */

const today = new Date();

if (dateInput) {
  dateInput.min = today.toISOString().split("T")[0];

  dateInput.value = today.toISOString().split("T")[0];
}

/* =========================================================
   SELECTED SERVICE
========================================================= */

function getSelectedService() {
  const radio = document.querySelector('input[name="service"]:checked');

  return radio ? services[radio.value] : null;
}

/* =========================================================
   SELECTED BARBER
========================================================= */

function getSelectedBarber() {
  const radio = document.querySelector('input[name="barber"]:checked');

  return radio ? barbers[radio.value] : null;
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value + "T12:00:00"));
}

/* =========================================================
   AVAILABLE TIMES
========================================================= */

function renderTimes() {
  if (!timeGrid) return;

  const slots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  timeGrid.innerHTML = "";

  slots.forEach((time) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "time-btn";
    button.textContent = time;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".time-btn")
        .forEach((item) => item.classList.remove("selected"));

      button.classList.add("selected");

      selectedTimeInput.value = time;

      updateSummary();
    });

    timeGrid.appendChild(button);
  });
}

/* =========================================================
   PRICE CALCULATION
========================================================= */

function getPriceDetails() {
  const service = getSelectedService();

  const originalPrice = service ? service.price : 0;

  const discountAmount = couponApplied
    ? Math.round((originalPrice * discountPercent) / 100)
    : 0;

  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountAmount,
    finalPrice,
  };
}

/* =========================================================
   UPDATE BOOKING SUMMARY
========================================================= */

function updateSummary() {
  const service = getSelectedService();

  const barber = getSelectedBarber();

  const prices = getPriceDetails();

  const serviceElement = document.querySelector("#sumService");

  const barberElement = document.querySelector("#sumBarber");

  const dateElement = document.querySelector("#sumDate");

  const timeElement = document.querySelector("#sumTime");

  const originalPriceElement = document.querySelector("#sumOriginalPrice");

  const priceElement = document.querySelector("#sumPrice");

  if (serviceElement) {
    serviceElement.textContent = service?.name || "—";
  }

  if (barberElement) {
    barberElement.textContent = barber?.name || "—";
  }

  if (dateElement) {
    dateElement.textContent = formatDate(dateInput?.value);
  }

  if (timeElement) {
    timeElement.textContent = selectedTimeInput?.value || "—";
  }

  if (originalPriceElement) {
    originalPriceElement.textContent = `R${prices.originalPrice}`;
  }

  if (priceElement) {
    priceElement.textContent = `R${prices.finalPrice}`;
  }

  /* Discount rows */

  const discountRow = document.querySelector("#discountSummaryRow");

  const savedRow = document.querySelector("#savedSummaryRow");

  const discountElement = document.querySelector("#sumDiscount");

  const savedElement = document.querySelector("#sumSaved");

  if (couponApplied && prices.discountAmount > 0) {
    if (discountRow) {
      discountRow.hidden = false;
    }

    if (savedRow) {
      savedRow.hidden = false;
    }

    if (discountElement) {
      discountElement.textContent = `${discountPercent}%`;
    }

    if (savedElement) {
      savedElement.textContent = `R${prices.discountAmount}`;
    }
  } else {
    if (discountRow) {
      discountRow.hidden = true;
    }

    if (savedRow) {
      savedRow.hidden = true;
    }
  }
}

/* =========================================================
   SERVICE + BARBER EVENTS
========================================================= */

document
  .querySelectorAll('input[name="service"], input[name="barber"]')
  .forEach((input) => {
    input.addEventListener("change", updateSummary);
  });

/* =========================================================
   DATE CHANGE
========================================================= */

dateInput?.addEventListener("change", () => {
  selectedTimeInput.value = "";

  document
    .querySelectorAll(".time-btn")
    .forEach((button) => button.classList.remove("selected"));

  updateSummary();
});

/* =========================================================
   COUPON MESSAGE
========================================================= */

function showCouponMessage(message, success = false) {
  if (!couponMessage) return;

  couponMessage.style.display = "block";

  couponMessage.textContent = message;

  couponMessage.style.color = success ? "#8a6a22" : "#b42318";
}

/* =========================================================
   APPLY CROWN10
========================================================= */

applyCouponButton?.addEventListener("click", () => {
  const code = couponInput?.value.trim().toUpperCase();

  /* Invalid code */

  if (code !== CROWN_COUPON) {
    couponApplied = false;
    discountPercent = 0;

    showCouponMessage(
      code ? "Invalid coupon code." : "Please enter a coupon code.",
    );

    updateSummary();

    return;
  }

  /* Get first-visit discount */

  const saved = localStorage.getItem("crownFirstVisitDiscount");

  if (!saved) {
    couponApplied = false;
    discountPercent = 0;

    showCouponMessage(
      "This coupon is only available after receiving the first-visit discount.",
    );

    updateSummary();

    return;
  }

  try {
    const discountData = JSON.parse(saved);

    /* Check discount */

    if (discountData.discount !== CROWN_DISCOUNT) {
      couponApplied = false;
      discountPercent = 0;

      showCouponMessage("This discount is not available.");

      updateSummary();

      return;
    }

    /* Check coupon */

    if (discountData.coupon && discountData.coupon !== CROWN_COUPON) {
      couponApplied = false;
      discountPercent = 0;

      showCouponMessage("This coupon is not valid.");

      updateSummary();

      return;
    }

    /* Check booking email */

    const bookingEmail = document
      .querySelector("#customerEmail")
      ?.value.trim()
      .toLowerCase();

    const savedEmail = discountData.email?.trim().toLowerCase();

    if (bookingEmail && savedEmail && bookingEmail !== savedEmail) {
      couponApplied = false;
      discountPercent = 0;

      showCouponMessage(
        "Please use the same email address that received the 10% discount.",
      );

      updateSummary();

      return;
    }

    /* SUCCESS */

    couponApplied = true;
    discountPercent = CROWN_DISCOUNT;

    showCouponMessage("Congratulations! You're receiving 10% off.", true);

    updateSummary();
  } catch (error) {
    console.warn("Coupon storage error:", error);

    couponApplied = false;
    discountPercent = 0;

    showCouponMessage("Unable to verify this coupon.");

    updateSummary();
  }
});

/* =========================================================
   EMAIL CHANGE
========================================================= */

document.querySelector("#customerEmail")?.addEventListener("change", () => {
  if (!couponApplied) return;

  const saved = localStorage.getItem("crownFirstVisitDiscount");

  if (!saved) return;

  try {
    const discountData = JSON.parse(saved);

    const bookingEmail = document
      .querySelector("#customerEmail")
      .value.trim()
      .toLowerCase();

    if (
      discountData.email &&
      bookingEmail &&
      discountData.email.toLowerCase() !== bookingEmail
    ) {
      couponApplied = false;
      discountPercent = 0;

      showCouponMessage("The coupon email does not match your discount email.");

      updateSummary();
    }
  } catch (error) {
    console.warn(error);
  }
});

/* =========================================================
   INITIALIZE
========================================================= */

renderTimes();
updateSummary();

/* =========================================================
   ADD MINUTES
========================================================= */

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(":").map(Number);

  const date = new Date(2000, 0, 1, hours, mins);

  date.setMinutes(date.getMinutes() + minutes);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

/* =========================================================
   GOOGLE CALENDAR
========================================================= */

function googleCalendarUrl(data) {
  const start =
    data.date.replaceAll("-", "") + "T" + data.time.replace(":", "") + "00";

  const end =
    data.date.replaceAll("-", "") +
    "T" +
    addMinutes(data.time, data.duration).replace(":", "") +
    "00";

  const params = new URLSearchParams({
    action: "TEMPLATE",

    text: `${data.service} with ${data.barber} — Crown Cuts`,

    dates: `${start}/${end}`,

    details: `Booking for ${data.customer}. Barber: ${data.barber}. Service: ${data.service}. Phone: ${data.phone}. Final price: R${data.price}.`,

    location: "123 Long Street, Cape Town CBD, South Africa",
  });

  return "https://calendar.google.com/calendar/render?" + params.toString();
}

/* =========================================================
   APPLE CALENDAR / ICS
========================================================= */

function downloadICS(data) {
  const start = `${data.date}T${data.time}:00`;

  const endTime = addMinutes(data.time, data.duration);

  const end = `${data.date}T${endTime}:00`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Crown Cuts//Booking//EN",
    "BEGIN:VEVENT",

    `DTSTART:${start.replace(/[-:]/g, "")}`,

    `DTEND:${end.replace(/[-:]/g, "")}`,

    `SUMMARY:${data.service} with ${data.barber} - Crown Cuts`,

    `DESCRIPTION:Booking for ${data.customer}. Phone: ${data.phone}. Final price: R${data.price}.`,

    "LOCATION:123 Long Street\\, Cape Town CBD\\, South Africa",

    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "crown-cuts-appointment.ics";

  link.click();

  URL.revokeObjectURL(url);
}

/* =========================================================
   COLLECT BOOKING DATA
========================================================= */

function collectData() {
  const service = getSelectedService();

  const barber = getSelectedBarber();

  const prices = getPriceDetails();

  return {
    service: service?.name || "",

    price: prices.finalPrice,

    originalPrice: prices.originalPrice,

    discountAmount: prices.discountAmount,

    discountPercent,

    duration: service?.duration || 0,

    barber: barber?.name || "",

    date: dateInput?.value || "",

    time: selectedTimeInput?.value || "",

    customer: document.querySelector("#customerName")?.value.trim() || "",

    email: document.querySelector("#customerEmail")?.value.trim() || "",

    phone: document.querySelector("#customerPhone")?.value.trim() || "",

    coupon: couponApplied ? CROWN_COUPON : "None",
  };
}

/* =========================================================
   VALIDATION
========================================================= */

function validate(data) {
  if (
    !data.service ||
    !data.barber ||
    !data.date ||
    !data.time ||
    !data.customer ||
    !data.email ||
    !data.phone
  ) {
    showToast("Please complete all booking fields.");

    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast("Please enter a valid email.");

    return false;
  }

  return true;
}

/* =========================================================
   BOOKING EMAIL
========================================================= */

async function sendBookingEmail(data) {
  if (!window.emailjs) {
    throw new Error("EmailJS is not loaded.");
  }

  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });

  /*
    IMPORTANT:

    These variable names match
    the Order Confirmation template.
  */

  return await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TEMPLATE_ID, {
    name: data.customer,

    email: data.email,

    service: data.service,

    barber: data.barber,

    date: formatDate(data.date),

    time: data.time,

    original_price: `R${data.originalPrice}`,

    discount_percent: `${data.discountPercent}%`,

    discount_amount: `R${data.discountAmount}`,

    final_price: `R${data.price}`,

    coupon: data.coupon,
  });
}

/* =========================================================
   BOOKING SUBMISSION
========================================================= */

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = collectData();

  if (!validate(data)) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  submitButton.textContent = "Confirming…";

  let emailSent = false;

  /* =====================================================
       EMAILJS BOOKING EMAIL
    ===================================================== */

  try {
    await sendBookingEmail(data);

    emailSent = true;
  } catch (error) {
    console.error("Booking EmailJS error:", error);
  }

  /* =====================================================
       CONFIRMATION
    ===================================================== */

  document.querySelector("#confirmText").textContent =
    `Your ${data.service} with ${data.barber} is confirmed for ${formatDate(data.date)} at ${data.time}. Final price: R${data.price}.`;

  confirmation.hidden = false;

  form.hidden = true;

  /* Google Calendar */

  document.querySelector("#googleCalendar").href = googleCalendarUrl(data);

  /* Apple Calendar */

  document.querySelector("#downloadICS").onclick = () => downloadICS(data);

  confirmation.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  /* Toast */

  showToast(
    emailSent
      ? "Booking confirmed and email sent."
      : "Booking confirmed. Add it to your calendar.",
  );

  submitButton.disabled = false;

  submitButton.textContent = "Confirm Booking";
});
