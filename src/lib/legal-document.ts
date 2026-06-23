export type LegalBlock =
  | { t: "hr" }
  | { t: "h1"; text: string }
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] };

const nl: LegalBlock[] = [
  { t: "h1", text: "VYZR – ALGEMENE VOORWAARDEN, PRIVACY, VERZENDING & BELEID" },
  { t: "hr" },
  { t: "h2", text: "1. Algemene voorwaarden" },
  { t: "h3", text: "1.1 Toepasselijkheid" },
  {
    t: "p",
    text: "Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, bestellingen en overeenkomsten van VYZR (“wij”) met betrekking tot het graveren van motorhelmvizieren (“diensten”). Door een bestelling te plaatsen gaat de klant (“u”) akkoord.",
  },
  { t: "h3", text: "1.2 Dienst" },
  {
    t: "p",
    text: "VYZR biedt een maatwerk service waarbij u uw eigen vizier opstuurt. Wij brengen een gravering aan op basis van uw ontwerp en sturen het vizier retour.",
  },
  { t: "h3", text: "1.3 Verantwoordelijkheid klant" },
  {
    t: "p",
    text: "U bent verantwoordelijk voor:",
  },
  {
    t: "ul",
    items: [
      "het correct aanleveren van bestanden",
      "de kwaliteit en resolutie van het ontwerp",
      "het recht om het ontwerp te gebruiken",
    ],
  },
  {
    t: "p",
    text: "VYZR is niet aansprakelijk voor slechte resultaten door ongeschikte bestanden.",
  },
  { t: "h3", text: "1.4 Resultaat & preview" },
  {
    t: "p",
    text: "De preview op de website is indicatief. Het eindresultaat kan afwijken door materiaal, lichtval en technische beperkingen.",
  },
  { t: "h3", text: "1.5 Verzending & risico" },
  {
    t: "ul",
    items: ["Verzending naar VYZR: risico ligt bij de klant", "Retourzending: risico ligt bij vervoerder na verzending"],
  },
  { t: "h3", text: "1.6 Aansprakelijkheid" },
  {
    t: "p",
    text: "VYZR is alleen aansprakelijk voor directe schade door aantoonbare fouten. Maximale aansprakelijkheid = bedrag van de bestelling.",
  },
  { t: "p", text: "Niet aansprakelijk voor:" },
  {
    t: "ul",
    items: [
      "indirecte schade",
      "gebruik van het vizier",
      "zichtbaarheid of veiligheid",
    ],
  },
  { t: "h3", text: "1.7 Gebruik & veiligheid" },
  {
    t: "p",
    text: "De klant blijft verantwoordelijk voor veilig gebruik van het vizier.",
  },
  { t: "h3", text: "1.8 Herroepingsrecht" },
  {
    t: "p",
    text: "Maatwerkproducten zijn uitgesloten van retourrecht.",
  },
  { t: "h3", text: "1.9 Intellectueel eigendom" },
  {
    t: "p",
    text: "De klant garandeert dat het ontwerp geen rechten van derden schendt.",
  },
  { t: "h3", text: "1.10 Overmacht" },
  {
    t: "p",
    text: "VYZR is niet aansprakelijk bij overmacht.",
  },
  { t: "h3", text: "1.11 Toepasselijk recht" },
  {
    t: "p",
    text: "Nederlands recht is van toepassing.",
  },
  { t: "hr" },
  { t: "h2", text: "2. Privacy policy (AVG)" },
  { t: "h3", text: "2.1 Gegevens die wij verzamelen" },
  {
    t: "ul",
    items: ["Naam, adres, e-mail", "Bestelgegevens", "Uploads/designs", "IP-adres en cookies"],
  },
  { t: "h3", text: "2.2 Doeleinden" },
  {
    t: "ul",
    items: [
      "Bestellingen verwerken",
      "Klantenservice",
      "Website verbeteren",
      "Marketing (indien toegestaan)",
    ],
  },
  { t: "h3", text: "2.3 Delen van gegevens" },
  { t: "p", text: "Wij delen gegevens met:" },
  {
    t: "ul",
    items: ["betaalproviders", "verzendpartners", "Shopify / hosting"],
  },
  { t: "h3", text: "2.4 Rechten" },
  {
    t: "p",
    text: "U heeft recht op inzage, correctie en verwijdering van gegevens.",
  },
  { t: "h3", text: "2.5 Beveiliging" },
  {
    t: "p",
    text: "Wij nemen passende maatregelen om gegevens te beschermen.",
  },
  { t: "hr" },
  { t: "h2", text: "3. Verzendbeleid" },
  { t: "h3", text: "3.1 Proces" },
  {
    t: "ul",
    items: [
      "Bestel online",
      "Ontvang instructies",
      "Stuur vizier op",
      "Wij graveren en sturen retour",
    ],
  },
  { t: "h3", text: "3.2 Verzendkosten" },
  {
    t: "ul",
    items: ["Heenzending: klant betaalt", "Retour: inbegrepen of volgens prijsstelling"],
  },
  { t: "h3", text: "3.3 Levertijd" },
  {
    t: "ul",
    items: ["Productie: 3–7 werkdagen", "Verzending afhankelijk van vervoerder"],
  },
  { t: "hr" },
  { t: "h2", text: "4. Retour & refund" },
  {
    t: "ul",
    items: ["Geen retour mogelijk na productie", "Bij fouten van VYZR: herstel of (gedeeltelijke) refund"],
  },
  { t: "hr" },
  { t: "h2", text: "5. Cookiebeleid" },
  {
    t: "p",
    text: "Wij gebruiken:",
  },
  {
    t: "ul",
    items: ["Essentiële cookies", "Analytics cookies", "Marketing cookies (met toestemming)"],
  },
  {
    t: "p",
    text: "Gebruikers kunnen cookie-instellingen aanpassen via de banner.",
  },
  { t: "hr" },
  { t: "h2", text: "6. Bedrijfsgegevens (invullen)" },
  {
    t: "p",
    text: "Bedrijfsnaam: [Jouw naam]\nAdres: [Adres]\nE-mail: [E-mail]\nKvK: [KvK-nummer]\nBTW: [BTW-nummer]",
  },
];

const en: LegalBlock[] = [
  { t: "h1", text: "VYZR – TERMS, PRIVACY, SHIPPING & POLICIES" },
  { t: "hr" },
  { t: "h2", text: "1. General terms" },
  { t: "h3", text: "1.1 Scope" },
  {
    t: "p",
    text: "These terms apply to all offers, orders, and agreements between VYZR (“we”) and you regarding the engraving of motorcycle helmet visors (“services”). By placing an order, you agree to these terms.",
  },
  { t: "h3", text: "1.2 Service" },
  {
    t: "p",
    text: "VYZR provides a custom service: you send your own visor. We engrave according to your artwork and return the visor to you.",
  },
  { t: "h3", text: "1.3 Your responsibilities" },
  { t: "p", text: "You are responsible for:" },
  {
    t: "ul",
    items: [
      "supplying correct files",
      "the quality and resolution of the design",
      "having the right to use the design",
    ],
  },
  {
    t: "p",
    text: "VYZR is not liable for poor results caused by unsuitable files.",
  },
  { t: "h3", text: "1.4 Result & preview" },
  {
    t: "p",
    text: "The on-site preview is indicative. The final result may differ due to material, lighting, and technical limits.",
  },
  { t: "h3", text: "1.5 Shipping & risk" },
  {
    t: "ul",
    items: [
      "Shipment to VYZR: risk is with the customer",
      "Return shipment: risk passes to the carrier once dispatched",
    ],
  },
  { t: "h3", text: "1.6 Liability" },
  {
    t: "p",
    text: "VYZR is only liable for direct damage due to demonstrable errors. Maximum liability is limited to the order amount.",
  },
  { t: "p", text: "We are not liable for:" },
  {
    t: "ul",
    items: ["indirect damage", "use of the visor", "visibility or safety"],
  },
  { t: "h3", text: "1.7 Use & safety" },
  {
    t: "p",
    text: "You remain responsible for safe use of the visor.",
  },
  { t: "h3", text: "1.8 Right of withdrawal" },
  {
    t: "p",
    text: "Custom-made products are excluded from the statutory right of withdrawal.",
  },
  { t: "h3", text: "1.9 Intellectual property" },
  {
    t: "p",
    text: "You warrant that the design does not infringe third-party rights.",
  },
  { t: "h3", text: "1.10 Force majeure" },
  {
    t: "p",
    text: "VYZR is not liable in cases of force majeure.",
  },
  { t: "h3", text: "1.11 Applicable law" },
  {
    t: "p",
    text: "Dutch law applies.",
  },
  { t: "hr" },
  { t: "h2", text: "2. Privacy policy (GDPR)" },
  { t: "h3", text: "2.1 Data we collect" },
  {
    t: "ul",
    items: ["Name, address, email", "Order data", "Uploads / designs", "IP address and cookies"],
  },
  { t: "h3", text: "2.2 Purposes" },
  {
    t: "ul",
    items: [
      "Processing orders",
      "Customer support",
      "Improving the website",
      "Marketing (where permitted)",
    ],
  },
  { t: "h3", text: "2.3 Sharing data" },
  { t: "p", text: "We may share data with:" },
  {
    t: "ul",
    items: ["payment providers", "shipping partners", "Shopify / hosting"],
  },
  { t: "h3", text: "2.4 Your rights" },
  {
    t: "p",
    text: "You have the right to access, rectify, and erase your personal data where applicable.",
  },
  { t: "h3", text: "2.5 Security" },
  {
    t: "p",
    text: "We take appropriate measures to protect your data.",
  },
  { t: "hr" },
  { t: "h2", text: "3. Shipping policy" },
  { t: "h3", text: "3.1 Process" },
  {
    t: "ul",
    items: [
      "Order online",
      "Receive instructions",
      "Send your visor in",
      "We engrave and ship it back",
    ],
  },
  { t: "h3", text: "3.2 Shipping costs" },
  {
    t: "ul",
    items: ["Outbound to VYZR: paid by the customer", "Return: included or as stated in pricing"],
  },
  { t: "h3", text: "3.3 Lead times" },
  {
    t: "ul",
    items: ["Production: 3–7 business days", "Transit depends on the carrier"],
  },
  { t: "hr" },
  { t: "h2", text: "4. Returns & refunds" },
  {
    t: "ul",
    items: [
      "No returns after production has started or completed",
      "If VYZR is at fault: rework or (partial) refund",
    ],
  },
  { t: "hr" },
  { t: "h2", text: "5. Cookie policy" },
  { t: "p", text: "We use:" },
  {
    t: "ul",
    items: ["Essential cookies", "Analytics cookies", "Marketing cookies (with consent)"],
  },
  {
    t: "p",
    text: "Users can adjust cookie preferences via the site banner where available.",
  },
  { t: "hr" },
  { t: "h2", text: "6. Business details (to be completed)" },
  {
    t: "p",
    text: "Legal name: [Your name]\nAddress: [Address]\nEmail: [Email]\nChamber of Commerce: [KvK number]\nVAT: [VAT number]",
  },
];

export function getLegalBlocks(locale: string): LegalBlock[] {
  return locale === "nl" ? nl : en;
}
