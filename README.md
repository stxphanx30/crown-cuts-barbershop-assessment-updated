# Crown Cuts Barbershop — Junior Full-Stack Assessment

## Structure
- `index.html` — Home
- `services.html` — Services and pricing
- `about.html` — Story and barbers
- `booking.html` — Working booking flow + calendar integration
- `contact.html` — Contact details/form
- `terms.html` — Terms & Conditions
- `css/style.css` — responsive visual design
- `js/main.js` — navigation, modal and toast
- `js/booking.js` — booking logic, EmailJS and calendar events
- `assets/logo.svg` — logo

## EmailJS setup
1. Create an account at https://www.emailjs.com/
2. Create an Email Service.
3. Create a template with these variables:
   `customer_name`, `customer_email`, `customer_phone`, `service`, `barber`, `booking_date`, `booking_time`, `booking_price`
4. Open `js/booking.js`.
5. Replace:
   `YOUR_PUBLIC_KEY`
   `YOUR_SERVICE_ID`
   `YOUR_TEMPLATE_ID`
6. Test a real booking.

If EmailJS is not configured, the booking UI still works and calendar links still generate; configure EmailJS before final submission so email notification is genuinely functional.

## Deployment
Recommended: Vercel or Netlify.

### Vercel
- Put this folder in a GitHub repository.
- Import the repository into Vercel.
- Framework preset: Other.
- No build command.
- Output directory: `.`
- Deploy.

### Netlify
- Drag the project folder into Netlify Drop, or connect the GitHub repository.

## Final test checklist
- Desktop navigation
- Mobile hamburger menu
- Home → Services → Booking
- Select service
- Select barber
- Select date
- Select time
- Enter customer details
- Confirm booking
- Google Calendar link
- Apple Calendar `.ics`
- EmailJS email
- Popup opens and closes
- Terms page
- Contact links
- No broken images
- No obvious console errors
