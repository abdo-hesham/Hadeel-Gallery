import Legal from './Legal.jsx';

const SECTIONS = [
  { h: '1. What we collect', p: [
    'When you order, we ask for your name, email address, delivery address and phone number. These are needed to confirm the order, ship the work and contact you about it.',
    'The site keeps your cart contents in your browser (local storage) so they survive a page reload. No account is created and no password is stored.',
  ] },
  { h: '2. Payment details', p: [
    'We do not store card numbers. Payments are made by cash on delivery or by Instapay transfer arranged directly with the studio; no card data passes through this website.',
  ] },
  { h: '3. How we use your information', p: [
    'Order details are used only to fulfil and support your purchase: confirming it by email, packing and shipping the work, handling returns and answering your questions.',
    'We do not sell or rent your information. We share it only with the courier delivering your order and with the email service that sends order confirmations, and only as far as needed for that purpose.',
  ] },
  { h: '4. Marketing', p: [
    'We do not send newsletters or marketing emails unless you ask to receive them. You can withdraw that request at any time by replying to any email from the studio.',
  ] },
  { h: '5. Cookies and analytics', p: [
    'This site does not set advertising or tracking cookies. Fonts are loaded from Google Fonts, which may record your IP address when the font files are requested. Any analytics we add will be anonymised and described here.',
  ] },
  { h: '6. Retention', p: [
    'Order records are kept for as long as needed to provide support and meet accounting obligations, then deleted. Cart data lives in your own browser and is removed when you clear site data.',
  ] },
  { h: '7. Your rights', p: [
    'You can ask to see, correct or delete the personal information we hold about you at any time by emailing the studio. We respond within 30 days.',
  ] },
  { h: '8. Changes', p: [
    'If this policy changes, the new version is published here with an updated date.',
  ] },
];

export default function Privacy() {
  return (
    <Legal
      eyebrow="Legal"
      title="Privacy Policy"
      updated="26 September 2026"
      intro="What this site knows about you, and what it does with it."
      sections={SECTIONS}
    />
  );
}
