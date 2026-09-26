import Legal from './Legal.jsx';

const SECTIONS = [
  { h: '1. Who we are', p: [
    "Lilly's Boutique is the online studio shop of the painter Hadeel. Every work sold here is an original, one-of-one piece made by hand. By placing an order you agree to these terms.",
  ] },
  { h: '2. Originals, not prints', p: [
    'Each listing is a single physical artwork. Once it is sold it is gone; we do not produce copies, editions or reproductions unless a listing says so explicitly.',
    'Photographs and mockups on this site show the work as faithfully as we can, but colour, texture and scale can differ on screen. Dimensions are given in centimetres and are approximate to within 1 cm.',
  ] },
  { h: '3. Prices and payment', p: [
    'Prices are shown in Egyptian pounds (EGP) and include the artwork and its packaging. Shipping is added at checkout and shown before you pay.',
    'We accept cash on delivery inside Egypt and Instapay bank transfer. For transfers, the studio contacts you with payment details before the work is dispatched. An order is confirmed only once payment (or a cash-on-delivery commitment) is received.',
    'We may correct obvious pricing errors and cancel an order placed at a mistaken price, refunding anything already paid.',
  ] },
  { h: '4. Availability and cancellations', p: [
    'Because each work exists once, availability can change while you are browsing. If two orders arrive for the same piece, the first confirmed payment wins and the other buyer is refunded in full.',
    'You may cancel an order free of charge until it has been dispatched. After dispatch, the returns policy below applies.',
  ] },
  { h: '5. Shipping', p: [
    'Works ship from Cairo. Standard delivery takes 7 to 10 business days and express 2 to 4 business days within Egypt; international timing is quoted per order. All shipments are packed by hand and insured in transit.',
    'Please check the parcel on arrival. Report visible damage to the courier and to us within 48 hours with photographs so the insurance claim can be made.',
  ] },
  { h: '6. Returns', p: [
    'If a work arrives damaged, or is materially different from its listing, contact us within 7 days of delivery. We will arrange collection and offer a repair, a replacement where possible, or a full refund.',
    'For change-of-mind returns we accept the work back within 14 days of delivery if it is undamaged and in its original packaging. Return shipping and insurance are at your cost and the refund excludes the original delivery charge.',
  ] },
  { h: '7. Copyright', p: [
    'Buying an artwork transfers ownership of the physical object only. Copyright in the image stays with the artist. You may photograph and display the work privately, but you may not reproduce, print, license or sell images of it without written permission.',
    "All text, photographs and code on this site are the property of Lilly's Boutique and may not be reused without permission.",
  ] },
  { h: '8. Liability', p: [
    'Our liability for any order is limited to the price paid for that order. Nothing in these terms limits liability that cannot be limited under applicable law.',
  ] },
  { h: '9. Changes', p: [
    'We may update these terms. The version in force is the one published on this page at the time you place your order.',
  ] },
];

export default function Terms() {
  return (
    <Legal
      eyebrow="Legal"
      title="Terms and Conditions"
      updated="26 September 2026"
      intro="Plain words about buying an original painting from the studio."
      sections={SECTIONS}
    />
  );
}
