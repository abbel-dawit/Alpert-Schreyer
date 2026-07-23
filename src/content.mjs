/**
 * src/content.mjs
 * ---------------------------------------------------------------------------
 * Every piece of content on the site, in one place.
 *
 * Content was imported from the live WordPress site and is preserved verbatim
 * — case results, testimonials, FAQ answers, attorney bios, the TCPA consent
 * text and the legal disclaimer are exactly as published. Nothing was
 * rewritten. Structure changed; words did not.
 *
 * Edit this file to change the site. Do not edit dist/ — it is generated.
 */

export const firm = {
  name: 'Alpert Schreyer Personal Injury Lawyers',
  shortName: 'Alpert Schreyer',
  domain: 'https://dcmdlaw.com',
  tagline: '125+ Years of Combined Experience Seeking Justice',
  mainPhone: '(301) 932-9997',
  mainPhoneHref: 'tel:+13019329997',
  smsHref: 'sms:+13019329997',
  recovered: '$100+ Million',
  yearsCombined: '125+',
  logo: '/assets/media/202411-alpert-schreyer-pil-white.svg',
  ogImage: '/assets/media/202504-alpert-schreyer-pil-square.jpg',
  favicon: '/assets/media/202411-cropped-favicon-270x270.png',
  heroVideo: '/assets/media/202401-istock-1211880136.mp4',
  reviewsLink: 'https://maps.app.goo.gl/9uhp2Fn8Ci9NxzY49',
  social: {
    facebook: 'https://www.facebook.com/DCMDLaw',
    linkedin: 'https://www.linkedin.com/company/95677359/',
    instagram: 'https://www.instagram.com/dcmdlaw/',
    youtube: 'https://www.youtube.com/@alpertschreyerllc',
  },
  images: {
    interiorHero: '/assets/media/202503-internalhero-waldorf-desktop4.jpg',
    team1: '/assets/media/202606-26alpertschreyer4639.jpg',
    team2: '/assets/media/202606-26alpertschreyer4098.jpg',
    duiTeam: '/assets/media/202606-maryland-dui-attorneys.jpg',
    aboutHero: '/assets/media/202606-andrewalpert-com-about-1.png',
  },
};

export const consentText = `By checking this box, you agree to receive text messages from Alpert Schreyer Injury Accident Lawyers, including appointment reminders, case status updates, document requests, billing notifications, and general client communication.`;
export const consentFull = `Message frequency may vary. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance. For more information, visit dcmdlaw.com. View our Privacy Policy and Terms of Service at /privacy-policy/.`;

export const disclaimer = `The information you obtain at this site is not, nor is it intended to be, legal advice. You should consult an attorney for advice regarding your individual situation. We invite you to contact us and welcome your calls, letters and electronic mail. Contacting us does not create an attorney-client relationship. Please do not send any confidential information to us until such time as an attorney-client relationship has been established. This web site is not intended to solicit clients for matters outside of the state of Maryland. We serve all of Maryland.`;

export const aboutBlurb = `Alpert Schreyer Personal Injury Lawyers has over 125 years of combined experience fighting for injured victims across Maryland. Our dedicated team leverages unique strengths to deliver exceptional results, even in the toughest cases. Contact us today for a free consultation to speak with a trusted attorney and explore your legal options.`;

export const areasBlurb = `Alpert Schreyer Personal Injury Lawyers serves injured clients throughout Maryland. Our offices are conveniently located in Lanham, Waldorf, Frederick, and Rockville. We also serve Accokeek, MD; Annapolis, MD; Baltimore, MD; Bowie, MD; College Park, MD; California, MD; Columbia, MD; Frederick, MD; Hughesville, MD; Huntingtown, MD; Landover, MD; LaPlata, MD; Laurel, MD; Lexington Park, MD; Mechanicsville, MD; Upper Marlboro, MD; Prince Frederick, MD.`;

export const offices = [
  {
    key: 'waldorf', name: 'Waldorf Office', city: 'Waldorf',
    street: '8 Post Office Rd', addr: '8 Post Office Rd, Waldorf, MD 20602',
    locality: 'Waldorf', region: 'MD', zip: '20602',
    phone: '(301) 932-9997', phoneHref: 'tel:+13019329997',
    maps: 'https://maps.app.goo.gl/9uhp2Fn8Ci9NxzY49',
    embed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12469.309284813318!2d-76.9009741!3d38.6183504!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7a0d95725a603%3A0x9d242a9b6372341a!2sAlpert%20Schreyer%20Personal%20Injury%20Lawyers%20Waldorf%20Office!5e0!3m2!1sen!2smx!4v1740683214307!5m2!1sen!2smx',
  },
  {
    key: 'lanham', name: 'Lanham Office', city: 'Lanham',
    street: '4600 Forbes Blvd #200', addr: '4600 Forbes Boulevard #200, Lanham, MD 20706',
    locality: 'Lanham', region: 'MD', zip: '20706',
    phone: '(301) 936-0011', phoneHref: 'tel:+13019360011',
    maps: 'https://maps.app.goo.gl/xpngiVwqbetvxzBN6',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3102.7347887688425!2d-76.8361242!3d38.9528868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c19f20fc288b%3A0x68f0a9ccaee8d520!2sAlpert%20Schreyer%20Personal%20Injury%20Lawyers!5e0!3m2!1sen!2smx!4v1750896936907!5m2!1sen!2smx',
  },
  {
    key: 'frederick', name: 'Frederick Office', city: 'Frederick',
    street: '25 E Patrick St', addr: '25 E Patrick St, Frederick, MD 21701',
    locality: 'Frederick', region: 'MD', zip: '21701',
    phone: '(301) 381-1993', phoneHref: 'tel:+13013811993',
    maps: 'https://maps.app.goo.gl/5pBxBva1N5uxSw5Z6',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.4375725857126!2d-77.40999790000001!3d39.4142286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c9da599d4d430d%3A0xe0d2bd78498e7247!2s25%20E%20Patrick%20St%20%23200%2C%20Frederick%2C%20MD%2021701%2C%20USA!5e0!3m2!1sen!2smx!4v1740682874874!5m2!1sen!2smx',
  },
  {
    key: 'rockville', name: 'Rockville Office', city: 'Rockville',
    street: '11140 Rockville Pike Suite 550-J', addr: '11140 Rockville Pike Suite 550-J, Rockville, MD 20852',
    locality: 'Rockville', region: 'MD', zip: '20852',
    phone: '(301) 364-3195', phoneHref: 'tel:+13013643195',
    maps: 'https://maps.app.goo.gl/HMBKCmRSp9m8G9DJ6',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3098.9242071347358!2d-77.1102224!3d39.03984749999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7cc224faaaaab%3A0xdb5d2da87b10d79d!2sTHE%20BECO%20BUILDING%2C%2011140%20Rockville%20Pike%20Suite%20550-J%2C%20Rockville%2C%20MD%2020852%2C%20USA!5e0!3m2!1sen!2smx!4v1740683071314!5m2!1sen!2smx',
  },
];

/* ---------------------------------------------------------------------------
   ATTORNEYS — photos corrected. Each portrait is now the image published on
   that attorney's own bio page, not a stock team shot.
   --------------------------------------------------------------------------- */
export const attorneys = [
  {
    slug: 'andrew-d-alpert',
    name: 'Andrew D. Alpert',
    role: 'Founding Partner',
    photo: '/assets/media/202606-3703.jpg',
    alt: 'Andrew D. Alpert, Founding Partner',
    title: 'Andrew D. Alpert Board Certified DUI Defense Lawyer in Maryland',
    metaDesc: "Andrew D. Alpert is Maryland's first Board Certified DUI Defense Lawyer. Contact us for a free DUI consultation.",
    motto: 'Experience, Commitment & Integrity in the Pursuit of Justice',
    lede: `Maryland's first and only attorney to become Board Certified in DUI Defense Law by the National College for DUI Defense.`,
    facts: [
      { k: 'Admitted', v: 'Maryland, 1989' },
      { k: 'Law school', v: 'George Washington University' },
      { k: 'Former', v: "Assistant State's Attorney" },
    ],
    bio: [
      `Attorney Andrew D. Alpert is a Partner with the law firm of Alpert Schreyer, LLC and one of the leading DUI attorneys in the state of Maryland and the District of Columbia. Andrew Alpert has the honor of becoming Maryland's first and only attorney to become <strong>Board Certified in DUI Defense Law</strong> by the <a href="https://www.ncdd.com/ncdd-gallery" rel="noopener">National College for DUI Defense</a> (NCDD).`,
      `A former prosecutor, Mr. Alpert has specific training in DUI/DWI law and has earned a reputation as a highly skilled and aggressive criminal defense attorney. He has successfully defended thousands of DUI/DWI, criminal defense, and motor vehicle manslaughter cases, has had many cases covered by the press (<em>Maryland Independent</em> 09/17/2004; <em>Maryland Independent</em> 09/22/2004) and has appeared on national television to offer his legal opinion on high-profile criminal cases. Mr. Alpert has received numerous awards and honors from the legal community. He has been rated AV Preeminent® by Martindale-Hubbell®, carries a 10.0 Superb rating from Avvo, and has been selected several times for inclusion in <em>Super Lawyers</em> in Maryland and the District of Columbia.`,
      `Mr. Alpert regularly attends the National College for DUI Defense, as conducted at Harvard University where he receives advanced training in DUI/DWI defense law. He is a member of Board of Directors of the Maryland Criminal Defense Lawyer's Association, Chairman of the Legislative Group of the Maryland Criminal Defense Lawyer's Association on Narcotics, the Maryland State Representative of the National College for DUI Defense, a member of the Maryland Trial Lawyers Association, Maryland State Bar Association and the National Association of Criminal Defense Lawyers. A graduate of George Washington University School of Law, Alpert is one of only a few lawyers in the state of Maryland and the District of Columbia who is a Certified NHTSA Standardized Field Sobriety Test Instructor.`,
    ],
    creds: [
      { h: 'Education', long: false, items: [
        'Juris Doctor – George Washington University – 1989',
        'B.A. Degree – Franklin & Marshall College – 1986',
        'High School: The Mercersburg Academy – 1982',
      ]},
      { h: 'Positions', long: false, items: [
        'Private Practice, Partner – Alpert Schreyer, LLC',
        'Private Practice, Partner – Meng & Alpert, LLC',
        "Assistant State's Attorney Charles County, Maryland",
        "Assistant State's Attorney Prince George's County, Maryland",
      ]},
      { h: 'Bar Admissions', long: false, items: [
        'Maryland – 1989',
        'District of Columbia – 1996',
        'Pennsylvania – 1994',
        'New Jersey – 1994',
        'US District Court of Maryland – 1995',
        'US District Court for the District of Columbia – 2000',
      ]},
      { h: 'Awards, Honors & Certificates', long: true, items: [
        'Board Certification in DUI Defense Law',
        'Top Ten Ranking – National Academy of Personal Injury Attorneys, 2014',
        'Maryland Super Lawyers – 2009 – 2020',
        'Washington, DC Super Lawyers – 2015, 2014, 2013, 2012, 2011, 2010, 2009',
        'AV® Preeminent™ Rating – Martindale-Hubbell',
        '10 out of 10 Superb Rating – AVVO',
        'Top 100 Trial Lawyers – The National Trial Lawyers Association, 2013, 2012, 2011, 2010',
        'Certificate of Appreciation, National College for DUI Defense, 2009, 2007',
        'Certificate of Appreciation, Drug Enforcement Administration, Department of Justice Washington Field Division',
        'Certificate of Appreciation, Charles County Sheriff',
        'Recognition of Service, Maryland State Police',
        'National College for DUI Defense Certificate',
      ]},
      { h: 'Memberships', long: true, items: [
        'Founding Member, DUI Defense Lawyers Association',
        'Member, National Association of Criminal Defense Lawyers',
        'Member, The National Trial Lawyers',
        'Member, The American Trial Lawyers Association',
        'Member, American Bar Association',
        'Maryland State Representative, National College for DUI Defense',
        'Sustaining Member, National College for DUI Defense',
        'Member, Maryland State Bar Association',
        'Member, Maryland Association for Justice',
        "Board of Directors, Maryland Criminal Defense Attorneys' Association",
        "President, Maryland Criminal Defense Attorneys' Association",
        "Legislative Chairman Narcotics Law, Maryland Criminal Defense Attorneys' Association",
        "Member, Prince George's County Bar Association",
        'Member, The Society for Legal Advocates',
        'Board of Directors, DUI Defense Lawyers Association',
      ]},
    ],
  },
  {
    slug: 'christopher-murphy',
    name: 'Christopher Murphy',
    role: 'Partner',
    photo: '/assets/media/202606-chris-murphy.jpg',
    alt: 'Christopher Murphy, Partner',
    title: 'Christopher Murphy Personal Injury Trial Attorney in Maryland',
    metaDesc: "Christopher Murphy fights for injury & workers' compensation claims in Prince George's County, Anne Arundel County & St. Mary's County",
    motto: 'Experience, Commitment & Integrity in the Pursuit of Justice',
    lede: `A trial lawyer most at home in the courtroom — known for taking the cases insurance companies undervalue, and getting full value from the jury.`,
    facts: [
      { k: 'Recovered in 2025', v: 'Over $7 million' },
      { k: 'Focus', v: 'Personal injury trials' },
      { k: 'Also handles', v: "Workers' compensation" },
    ],
    bio: [
      `Mr. Murphy is a highly experienced personal injury trial attorney with a track record of success obtaining full payment for victims. He is among the very best of Maryland and Washington, D.C. personal injury attorneys having recovered over $7 million dollars for his clients in 2025 alone!`,
      `You can expect a client-focused approach: he takes the time to understand each person's story, goals, and concerns, and what has been taken from you in terms of your health, experiences, joys, and human dignity, ensuring that you are heard and informed at every step. His practice emphasizes strategic, results-focused representation, identifying the strongest path to recovery—whether through settlement or Court—with a focus on maximizing benefits and minimizing hassle. Mr. Murphy knows the Insurance company's tricks and uses that knowledge to fight back and get you the best outcome without delay.`,
      `He has built a reputation as a passionate trial lawyer who is most at home when fighting in the courtroom. Mr. Murphy's instincts for trial tactics and case presentation have made him the attorney that other attorneys turn to when seeking advice on how to fight and win in court. He is particularly known for taking cases which the Insurance companies undervalue and getting full value from the Jury.`,
      `Working with our team of experienced and dedicated paralegal professionals, your case is built for success as we accompany you throughout every step of the process making sure you receive the answers to your questions so you can have peace of mind as you recover from your injuries.`,
    ],
    // The offer -> verdict pattern, straight from his bio page.
    trials: [
      { what: 'Rear-end crash with minimal treatment', offer: 15000, verdict: 253000 },
      { what: 'Rear-end crash with disc injury', offer: 50000, verdict: 370000 },
      { what: 'Client with two car crashes a month apart — Case 1', offer: 10000, verdict: 372500 },
      { what: 'Client with two car crashes a month apart — Case 2', offer: 120000, verdict: 500000 },
      { what: 'Client with disc injury and facial tattoos', offer: 25000, verdict: 450000 },
      { what: '23-year-old client with back injury', offer: 13000, verdict: 103000 },
    ],
    creds: [],
  },
  {
    slug: 'ryan-zabel',
    name: 'Ryan Zabel',
    role: 'Attorney',
    photo: '/assets/media/202606-3667.jpg',
    alt: 'Ryan Zabel, Attorney',
    title: 'Ryan Zabel, Personal Injury Lawyer in Maryland',
    metaDesc: 'Attorney Ryan Zabel is committed to fighting for justice for his clients, whether they have been wrongfully injured or are facing criminal charges.',
    motto: 'Experience, Commitment & Integrity in the Pursuit of Justice',
    lede: `Committed to fighting for justice for his clients, whether they have been wrongfully injured or are facing criminal charges.`,
    facts: [
      { k: 'Law school', v: 'University of Baltimore' },
      { k: 'Graduated', v: 'Magna Cum Laude' },
      { k: 'Former', v: 'Judicial law clerk' },
    ],
    bio: [
      `Attorney Ryan Zabel is committed to fighting for justice for his clients, whether they have been wrongfully injured or are facing criminal charges. Mr. Zabel was born and raised in North Carolina where he attended Appalachian State University for his undergraduate degree. After working in the commercial door and hardware industry for nine years, Mr. Zabel moved to Maryland to pursue his JD, graduating Magna Cum Laude from the University of Baltimore School of Law.`,
      `While in law school, Mr. Zabel was a member of the Royal Graham Shannonhouse Honor Society. Mr. Zabel also served as a Staff Editor on the University of Baltimore Law Forum. During law school Mr. Zabel represented clients as a Rule 19 attorney through the Human Trafficking Prevention Project Clinic.`,
      `After graduating from law school, Mr. Zabel secured a position as a judicial law clerk for the Honorable Anthony Vittoria in the Circuit Court for Baltimore City. During his clerkship, Mr. Zabel conducted research, drafted opinions and orders, and observed proceedings across a broad range of civil and criminal matters.`,
    ],
    creds: [
      { h: 'Education', long: false, items: [
        'Juris Doctor – University of Baltimore School of Law, Magna Cum Laude',
        'B.S. – Appalachian State University',
      ]},
      { h: 'Honors & Activities', long: false, items: [
        'Royal Graham Shannonhouse Honor Society',
        'Staff Editor, University of Baltimore Law Forum',
        'Rule 19 attorney, Human Trafficking Prevention Project Clinic',
        'Judicial law clerk, Hon. Anthony Vittoria, Circuit Court for Baltimore City',
      ]},
    ],
  },
  {
    slug: 'john-g-costello',
    name: 'John G. Costello',
    role: 'Attorney',
    photo: '/assets/media/202606-3744.jpg',
    alt: 'John G. Costello, Attorney',
    title: 'John G. Costello, Personal Injury Lawyer in Maryland',
    metaDesc: "John G. Costello is a personal injury lawyer in Prince George's County, Charles County, Anne Arundel County & St. Mary's County",
    motto: 'Experience, Commitment & Integrity in the Pursuit of Justice',
    lede: `A third-generation attorney and former Montgomery County prosecutor who has tried criminal cases before judges and juries.`,
    facts: [
      { k: 'Law school', v: 'American University, WCL' },
      { k: 'Former', v: "Assistant State's Attorney" },
      { k: 'In practice since', v: '2016' },
    ],
    bio: [
      `John G. Costello grew up in Montgomery County and graduated from Gonzaga College High School. He is a graduate of the University of Delaware and received his J.D. from American University, Washington College of Law.`,
      `John became interested in the legal field at a young age due to his father and grandfather both being attorneys.`,
      `After law school, John served as a law clerk to the Honorable Terrence J. McGann of the Montgomery County Circuit Court. He then worked as an Assistant State's Attorney in Montgomery County for five years, where he regularly tried criminal cases before judges and juries. In 2016, John entered private practice handling serious personal injury matters on behalf of victims of negligence and representing individuals charged with criminal offenses.`,
      `John is an active member of multiple bar associations and has served multiple terms on the Board of Directors for the Prince George's County Bar Association. In 2025, John was selected as a Maryland Bar Foundation Fellow.`,
    ],
    creds: [
      { h: 'Education', long: false, items: [
        'Juris Doctor – American University, Washington College of Law',
        'B.A. – University of Delaware',
        'Gonzaga College High School',
      ]},
      { h: 'Positions', long: false, items: [
        'Law clerk, Hon. Terrence J. McGann, Montgomery County Circuit Court',
        "Assistant State's Attorney, Montgomery County — five years",
        'Private practice since 2016',
      ]},
      { h: 'Memberships & Honors', long: false, items: [
        "Board of Directors, Prince George's County Bar Association — multiple terms",
        'Maryland Bar Foundation Fellow, 2025',
      ]},
    ],
  },
];

/* --------------------------------------------------------------------------- */
export const caseResults = [
  { amt: '$5,500,000', label: 'Verdict', desc: 'Post-Operative Complications.', feature: true },
  { amt: '$3,750,000', desc: 'Birth Injury Settlement.' },
  { amt: '$2,900,000', desc: 'Settlement for Delayed Surgery.' },
  { amt: '$2,600,000', label: 'Jury verdict — Baltimore City', desc: 'Construction company and Baltimore City created a road hazard when they installed a 15-foot-long gate which could swing out into oncoming traffic. The steel pipe gate struck a passing automobile and caused a permanent brain injury to the driver.' },
  { amt: '$2,000,000', desc: 'Developmental Delay Birth Injury Result.' },
  { amt: '$2,000,000', label: 'Collision with commercial vehicle', desc: 'June 2014 — Collision with Commercial Vehicle in Suburban Washington, DC. Passenger Fatality, Driver Suffered Life-Threatening Pulmonary Injuries, Bilateral Wrist Fractures.' },
  { amt: '$1,800,000', label: 'Car accident verdict', desc: "2019 — Prince George's County firefighter awarded $1.8 million from State Farm for permanent damage to her wrist in a car crash." },
  { amt: '$543,000', desc: "A jury awarded <b>$543,000</b> in Prince George's County after the defense only offered <b>$5,000</b> for our client's injuries." },
];

export const testimonials = [
  /* SOURCE OF TRUTH: https://dcmdlaw.com/about-our-firm/testimonials/
     These six are the complete published set on that page, transcribed verbatim.
     Do not add testimonials from anywhere else — not the homepage rotator, not
     the free-downloads page, not Google. If the firm publishes a new one on the
     testimonials page, add it here; otherwise this list stays as-is. */
  { author: 'Kaitlyn Williams', text: `Was discouraged after speaking with other firms until I found this one. Michael is extremely professional, straight forward and proactive! Jaime is awesome as well, also very proactive and respectful. Everyone is professional and responsive. Made sure I was informed and comfortable with all decisions and kept me updated every step. Thank you all so much!` },
  { author: 'Eli Natoli', text: `I can't recommend Alpert Schreyer Personal Injury Lawyers enough! We selected the firm for a very difficult car accident case. Everyone has been beyond helpful. They kept us informed through-out the entire process and pushed through all the way to the end with outstanding outcome. Give them a call! They are fantastic!` },
  { author: 'Wendy Watson', text: `My experience with Mr Berman was better than expected. He made me feel very safe. He was extremely thorough with representing my case. Mr Berman never backed down and was very aggressive in defending me. I would highly recommend him to defend anyone that needs help. I am eternally grateful for everything you've done.` },
  { author: 'Tina Wagner', text: `I'm extremely happy with the outcome of my case. Mr. Schreyer is a brilliant arbitrator and took care of everything from start to end. My final award exceeded my expectations. I highly recommend this group if you have a need for an attorney.` },
  { author: 'Richard Ednie', text: `My attorney, Chris, was great! He guided me through the entire process of my personal injury case and I was very satisfied with the outcome. Donna, the paralegal assigned to my case couldn't have been better. Donna kept me informed and answered all of my questions. Very responsive. I would definitely recommend this firm.` },
  { author: 'Amanda Hanson', text: `Christopher Murphy represented me in a personal injury case regarding a major car accident. I felt fully understood despite my inability to always fully express/articulate my thoughts, feelings, pain, and emotions resulting from my accident. He is a direct, honest and outstanding attorney. I am so grateful for him, his staff and the outcome of my case. I highly recommend him to anyone seeking representation for a personal injury or workman's compensation case. He will fight for you.` },
];

export const faqs = [
  {
    q: 'What is my personal injury case worth?',
    aText: `The value of your personal injury claim depends on several factors, including the severity of your injuries, the cost of medical treatment, the amount of lost wages, the long-term impact of the injury on your life, and the impact of the accident on your mental health. We offer free consultations to help you understand the potential value of your case.`,
    a: `<p>One of the most common questions injury victims have is how much their case is worth. The value of your personal injury claim depends on several factors, including:</p>
    <ul>
      <li>The severity of your injuries</li>
      <li>The cost of medical treatment</li>
      <li>The amount of lost wages</li>
      <li>The long-term impact of the injury on your life</li>
      <li>The impact of the accident on your mental health</li>
    </ul>
    <p>Ultimately, the worth of your personal injury claim will depend on the unique details of your case. At Alpert Schreyer Personal Injury Lawyers, we offer free consultations to help you understand the potential value of your case and the legal options available to you.</p>`,
  },
  {
    q: 'How much does it cost to hire a personal injury lawyer?',
    aText: `We work on a contingency fee basis. You won't have to pay any upfront legal fees, and our fee is a percentage of the compensation we recover for you.`,
    a: `<p>One of the main concerns for people seeking legal representation after an accident is the cost. At Alpert Schreyer Personal Injury Lawyers, we work on a contingency fee basis. This means you won't have to pay any upfront legal fees, and our fee is a percentage of the compensation we recover for you. We'll go over exactly how fees and case costs work in your free consultation, before you sign anything.</p>
    <p>This fee structure allows everyone, regardless of their financial situation, to access skilled legal representation.</p>`,
  },
  {
    q: 'How long do I have to file a lawsuit after a personal injury accident in Maryland?',
    aText: `In Maryland, the statute of limitations for personal injury claims is generally three years from the date of the accident. If you fail to file within this time, you may lose your right to compensation.`,
    a: `<p>In Maryland, the statute of limitations for personal injury claims is generally <a href="https://mgaleg.maryland.gov/mgawebsite/laws/StatuteText?article=gcj&amp;section=5-101" rel="noopener">three years</a> from the date of the accident. If you fail to file within this time, you may lose your right to compensation.</p>`,
  },
  {
    q: "Can I recover compensation if I'm being blamed for an accident in Maryland?",
    aText: `Maryland follows a strict contributory negligence rule. If you are found even 1% at fault, you may be barred from recovering compensation.`,
    a: `<p>Maryland follows a strict <a href="https://www.findlaw.com/state/maryland-law/maryland-negligence-laws.html" rel="noopener">contributory negligence</a> rule. If you are found even 1% at fault, you may be barred from recovering compensation.</p>`,
  },
  {
    q: 'What kinds of damages are available to personal injury victims?',
    aText: `Personal injury victims may be entitled to economic damages (medical bills, lost wages) and non-economic damages (pain and suffering, emotional distress). In rare cases, punitive damages may also be awarded in Maryland if actual malice is proven.`,
    a: `<p>Personal injury victims may be entitled to economic damages (medical bills, lost wages) and non-economic damages (pain and suffering, emotional distress). In rare cases, punitive damages may also be awarded in Maryland if actual malice is proven.</p>`,
  },
];

/* ---------------------------------------------------------------------------
   PRACTICE AREAS — each generates its own page at /practice-areas/<slug>/
   `blurb` is the homepage card copy, verbatim from the live site.
   --------------------------------------------------------------------------- */
export const practiceAreas = [
  {
    slug: 'car-accidents', name: 'Car Accidents', featured: true,
    icon: '/assets/media/202501-group-2.svg',
    title: 'Maryland Car Accident Lawyer',
    metaDesc: 'Injured in a car accident in Maryland? Our car accident lawyers help you recover compensation for medical bills, lost wages, and more.',
    blurb: `Injured in a car accident? A Maryland car accident lawyer can help you recover compensation for medical bills, lost wages, and more. Alpert Schreyer Personal Injury Lawyers can guide you through the process, handle insurance claims, and fight for the compensation you deserve. Let us protect your rights and maximize your recovery.`,
    body: [
      `Injured in a car accident? A Maryland car accident lawyer can help you recover compensation for medical bills, lost wages, and more. Alpert Schreyer Personal Injury Lawyers can guide you through the process, handle insurance claims, and fight for the compensation you deserve. Let us protect your rights and maximize your recovery.`,
      `Maryland's strict contributory negligence rule makes car accident claims unusually unforgiving — if the insurance company can pin even 1% of the blame on you, your claim can be barred entirely. That is why what you say in the days after a crash matters so much, and why it is worth talking to a lawyer before you talk to an adjuster.`,
      `We handle the insurance company so you can concentrate on getting better. The consultation is free.`,
    ],
    checklist: [
      'Get medical attention, even if you feel fine — some injuries surface days later',
      'Photograph the vehicles, the scene, and any visible injuries',
      'Get the police report number',
      'Do not give a recorded statement to the other insurer before you speak with a lawyer',
      'Keep every bill, receipt, and note about missed work',
    ],
  },
  {
    slug: 'semi-truck-accidents', name: 'Semi-Truck Accidents', featured: true,
    icon: '/assets/media/202601-truck-accident-in-waldorf.svg',
    title: "Maryland's Top Semi-Truck Accident Lawyers",
    metaDesc: 'Injured by a semi-truck in Maryland? Our attorneys investigate immediately and fight for the compensation you deserve.',
    blurb: `Were you injured by a semi-truck? Whether you were hit on the highway or injured as a pedestrian, our personal injury attorneys will start investigating the accident immediately and fight to get you the compensation and support you deserve.`,
    body: [
      `Were you injured by a semi-truck? Whether you were hit on the highway or injured as a pedestrian, our personal injury attorneys will start investigating the accident immediately and fight to get you the compensation and support you deserve.`,
      `Semi-truck cases are not big car accident cases. There is a federal regulatory layer, an employer, a load, a maintenance history, and an electronic logging device — and the trucking company's rapid response team is often at the scene before the road reopens. Evidence disappears fast, which is why the investigation has to start immediately.`,
    ],
    checklist: [
      'The trucking company may be liable alongside the driver',
      'Electronic logging device data can be overwritten — a preservation letter matters',
      'Federal hours-of-service rules may have been violated',
      'Maintenance and inspection records are discoverable',
      'Cargo loading is frequently a separate contractor, and a separate defendant',
    ],
  },
  {
    slug: 'truck-accidents', name: 'Truck Accidents', featured: true,
    icon: '/assets/media/202601-car-icon-waldorf.svg',
    title: 'Maryland Truck Accident Lawyer',
    metaDesc: 'Injured in a truck accident? We help you hold the at-fault truck driver and trucking company accountable.',
    blurb: `Were you injured in a truck accident? You may be facing overwhelming medical bills, property repair estimates, and lost wages. We can help you hold the at-fault truck driver and trucking company accountable.`,
    body: [
      `Were you injured in a truck accident? You may be facing overwhelming medical bills, property repair estimates, and lost wages. We can help you hold the at-fault truck driver and trucking company accountable.`,
      `Commercial vehicles carry commercial insurance policies, which means higher limits — and far more aggressive defense. Our firm has recovered $2,000,000 for a collision with a commercial vehicle in suburban Washington, DC involving a passenger fatality and life-threatening injuries to the driver.`,
    ],
  },
  {
    slug: 'motorcycle-accidents', name: 'Motorcycle Accidents', featured: true,
    icon: '/assets/media/202501-group-4.svg',
    title: 'Maryland Motorcycle Accident Lawyer',
    metaDesc: 'Motorcycle accident attorneys helping riders pursue full compensation for catastrophic injuries in Maryland.',
    blurb: `When motorcycle accidents occur, riders are often at risk for catastrophic injuries and fatalities. Whether you are dealing with road rash or a traumatic brain injury, our motorcycle accident attorneys can help you pursue the full compensation you deserve.`,
    body: [
      `When motorcycle accidents occur, riders are often at risk for catastrophic injuries and fatalities. Whether you are dealing with road rash or a traumatic brain injury, our motorcycle accident attorneys can help you pursue the full compensation you deserve.`,
      `Riders face a particular problem in Maryland: jury bias. Insurers know it and price their offers accordingly. Countering that assumption — with scene reconstruction, rider training records, and clear evidence of the other driver's fault — is a large part of what we do on these cases.`,
    ],
  },
  {
    slug: 'dog-bites', name: 'Dog Bites', featured: true,
    icon: '/assets/media/202411-ico-dog-bites.svg',
    title: 'Maryland Dog Bite Lawyer',
    metaDesc: 'Bitten by someone else\u2019s dog? The owner may be liable. Our dog bite lawyers can help you pursue a fair result.',
    blurb: `If you or a loved one were bitten by someone else's dog, the owner may be liable for the resulting damages. Our dog bite lawyers can help you pursue a fair case result.`,
    body: [
      `If you or a loved one were bitten by someone else's dog, the owner may be liable for the resulting damages. Our dog bite lawyers can help you pursue a fair case result.`,
      `Dog bite claims often turn on homeowner's or renter's insurance rather than the owner's pocket — which is worth knowing when the owner is a neighbour, a friend, or family. Pursuing a claim does not have to mean pursuing a person.`,
    ],
  },
  {
    slug: 'slip-and-fall', name: 'Slip & Fall Accidents', featured: true,
    icon: '/assets/media/202411-ico-slip-and-fall.svg',
    title: 'Maryland Slip and Fall Lawyer',
    metaDesc: 'Property owners have a duty to keep premises safe. Injured in a slip and fall? We can help you pursue compensation.',
    blurb: `Property owners have a duty to keep their premises safe. If you have been injured in a slip and fall accident, we can help you pursue compensation.`,
    body: [
      `Property owners have a duty to keep their premises safe. If you have been injured in a slip and fall accident, we can help you pursue compensation.`,
      `These cases live and die on notice — did the owner know, or should they have known, about the hazard? Incident reports and surveillance footage are the usual proof, and footage is routinely overwritten within days. Speed matters here more than almost anywhere else in personal injury.`,
    ],
  },
  {
    slug: 'workers-compensation', name: "Workers' Compensation", featured: true,
    icon: '/assets/media/202411-ico-workers-comp.svg',
    title: "Maryland Workers' Compensation Lawyer",
    metaDesc: "Injured on the job in Maryland? You may be entitled to workers' compensation benefits. Our lawyers can help.",
    blurb: `If you were injured on the job, you may be entitled to workers' compensation benefits. Our lawyers can help you pursue what you are owed.`,
    body: [
      `If you were injured on the job, you may be entitled to workers' compensation benefits. Our lawyers can help you pursue what you are owed.`,
      `Workers' compensation is a no-fault system, which means you do not have to prove your employer did anything wrong. It also means the benefits are limited and the deadlines are strict. And if someone other than your employer contributed to the injury, you may have a separate claim on top of comp.`,
    ],
  },
  {
    slug: 'premises-liability', name: 'Premises Liability',
    title: 'Maryland Premises Liability Lawyer',
    metaDesc: 'Injured on someone else\u2019s property in Maryland? Our premises liability attorneys can help you pursue compensation.',
    blurb: `Property owners in Maryland have a legal duty to keep their premises reasonably safe. When they fail and someone is hurt, they can be held responsible.`,
    body: [
      `Property owners in Maryland have a legal duty to keep their premises reasonably safe. When they fail and someone is hurt, they can be held responsible.`,
      `What that duty amounts to depends on why you were there. Maryland still uses the old categories — invitee, licensee, trespasser — and they change the standard considerably. Our firm recovered $2,600,000 in Baltimore City where a construction company and the city created a road hazard with a 15-foot gate that swung into traffic and caused a permanent brain injury.`,
    ],
  },
  {
    slug: 'construction-accidents', name: 'Construction Accidents',
    title: 'Maryland Construction Accident Lawyer',
    metaDesc: 'Injured on a construction site in Maryland? Our attorneys pursue every avenue of recovery available to you.',
    blurb: `Construction sites are among the most dangerous workplaces in Maryland. If you were hurt on one, you may have more than one route to recovery.`,
    body: [
      `Construction sites are among the most dangerous workplaces in Maryland. If you were hurt on one, you may have more than one route to recovery.`,
      `Beyond workers' compensation, a general contractor, a subcontractor, an equipment manufacturer, or a property owner may each bear responsibility. Sorting out who controlled the site and who created the hazard is the work — and it is worth doing, because third-party claims are not capped the way comp benefits are.`,
    ],
  },
  {
    slug: 'hit-and-run-accidents', name: 'Hit & Run Accidents',
    title: 'Maryland Hit & Run Accident Lawyers',
    metaDesc: 'Hit by a driver who fled? You may still have a claim. Maryland hit and run accident lawyers who can help.',
    blurb: `If the driver who hit you fled the scene, you are not out of options. Uninsured motorist coverage often applies.`,
    body: [
      `If the driver who hit you fled the scene, you are not out of options. Uninsured motorist coverage often applies.`,
      `Maryland requires uninsured motorist coverage on every auto policy, and a hit-and-run driver counts as uninsured. That means your own insurer becomes the payer — and, unfortunately, sometimes the opponent. Notice requirements are strict and short, so tell us early.`,
    ],
  },
  {
    slug: 'rideshare-accidents', name: 'Rideshare Accidents',
    title: 'Maryland Rideshare Accident Lawyers',
    metaDesc: 'Injured in an Uber or Lyft accident in Maryland? Coverage depends on the driver\u2019s app status. We can help.',
    blurb: `Uber and Lyft crashes bring a layer of insurance complexity that ordinary car accidents do not.`,
    body: [
      `Uber and Lyft crashes bring a layer of insurance complexity that ordinary car accidents do not.`,
      `How much coverage applies turns on what the driver's app was doing at the moment of impact — offline, waiting for a ride, en route to a pickup, or carrying a passenger. Those tiers differ by an order of magnitude. Establishing app status early is often the single most valuable step in the case.`,
    ],
  },
  {
    slug: 'multi-car-accidents', name: 'Multi-Car Accidents',
    title: 'Maryland Multi-Car Accident Attorneys',
    metaDesc: 'Multi-vehicle pileups in Maryland involve multiple insurers and disputed fault. Our attorneys can help.',
    blurb: `Pileups involve several insurers, several versions of events, and a great deal of finger-pointing.`,
    body: [
      `Pileups involve several insurers, several versions of events, and a great deal of finger-pointing.`,
      `Under Maryland's contributory negligence rule, every carrier has a powerful incentive to shift a sliver of blame onto you — because 1% is all it takes to defeat your claim entirely. Reconstruction evidence and independent witnesses matter enormously in these cases.`,
    ],
  },
];

export const duiPages = [
  { slug: 'prince-georges-county', name: "Prince George's County DUI Lawyer", county: "Prince George's County" },
  { slug: 'montgomery-county', name: 'Montgomery County DUI Lawyer', county: 'Montgomery County' },
  { slug: 'charles-county', name: 'Charles County DUI Lawyer', county: 'Charles County' },
  { slug: 'frederick-county', name: 'Frederick County DUI Lawyer', county: 'Frederick County' },
];

export const areaPages = [
  { slug: 'lanham', name: 'Lanham', office: 'lanham' },
  { slug: 'waldorf', name: 'Waldorf', office: 'waldorf' },
  { slug: 'charles-county', name: 'Charles County', office: 'waldorf' },
  { slug: 'prince-georges-county', name: "Prince George's County", office: 'lanham' },
  { slug: 'frederick', name: 'Frederick', office: 'frederick' },
  { slug: 'rockville', name: 'Rockville', office: 'rockville' },
];

export const servedCities = [
  'Accokeek', 'Annapolis', 'Baltimore', 'Bowie', 'College Park', 'California',
  'Columbia', 'Frederick', 'Hughesville', 'Huntingtown', 'Landover', 'LaPlata',
  'Laurel', 'Lexington Park', 'Mechanicsville', 'Upper Marlboro', 'Prince Frederick',
];

export const trustBadges = [
  { src: '/assets/media/202503-trustslider01.png', alt: 'Maryland Association for Justice' },
  { src: '/assets/media/202503-trustslider02.png', alt: 'Maryland State Bar Association' },
  { src: '/assets/media/202503-trustslider04.png', alt: 'Multi-Million Dollar Advocates Forum' },
  { src: '/assets/media/202503-trustslider03.png', alt: 'American Association for Justice' },
];

export const awards = [
  { yr: '2014', h: 'Top Ten Ranking', p: 'National Academy of Personal Injury Attorneys — Andrew D. Alpert' },
  { yr: '2009–2020', h: 'Maryland Super Lawyers', p: 'Selected for inclusion across twelve consecutive years' },
  { yr: '2009–2015', h: 'Washington, DC Super Lawyers', p: 'Selected 2015, 2014, 2013, 2012, 2011, 2010, 2009' },
  { yr: '', h: 'AV® Preeminent™ Rating', p: 'Martindale-Hubbell — the highest available peer rating' },
  { yr: '', h: '10 out of 10 Superb Rating', p: 'AVVO' },
  { yr: '2010–2013', h: 'Top 100 Trial Lawyers', p: 'The National Trial Lawyers Association' },
  { yr: '', h: 'Board Certification in DUI Defense Law', p: "Maryland's first and only — National College for DUI Defense" },
  { yr: '2025', h: 'Maryland Bar Foundation Fellow', p: 'John G. Costello' },
];

/* ---------------------------------------------------------------------------
   WHY HIRE OUR FIRM — six reasons, imported verbatim from the live site.
   Used to fill the right-hand column of the intro/why sections.
   --------------------------------------------------------------------------- */
export const whyHire = [
  { icon: '/assets/media/202501-group-1.svg', h: 'Experienced Guidance', p: 'We have over 125 years of experience serving injured clients across Maryland and DC.' },
  { icon: '/assets/media/202503-ico-bills.svg', h: 'No Upfront Fees', p: 'We are so confident in our abilities that we do not charge a legal fee unless you receive compensation.' },
  { icon: '/assets/media/202503-ico-reputations.svg', h: 'Concierge Level of Service', p: 'We are willing to visit injury victims at their homes if they are severely injured or bereaved.' },
  { icon: '/assets/media/202503-ico-fight.svg', h: 'Fearless Advocacy', p: 'We are not afraid to battle any party, whether big or small, both in and out of the courtroom.' },
  { icon: '/assets/media/202503-ico-committed.svg', h: 'Esteemed Reputation', p: 'We have a sterling reputation in the community & among our peers in the legal field.' },
  { icon: '/assets/media/202503-ico-formerprosecutors.svg', h: 'Legal Insight', p: 'We commit to staying up-to-date on the latest developments in Maryland injury law.' },
];

/* Section imagery — fills the right column of prose sections. */
export const sectionImages = {
  intro: '/assets/media/202606-26alpertschreyer4173.jpg',
  why: '/assets/media/202606-26alpertschreyer3699.jpg',
  testimonial: '/assets/media/202503-foto-no-exif-2.jpg',
  waldorfBkg: '/assets/media/202503-tp-waldorf-bkg.jpg',
};


/* ---------------------------------------------------------------------------
   RESOURCES
   --------------------------------------------------------------------------- */
export const freeDownloads = [
  {
    slug: 'maryland-car-owners-guide-to-auto-insurance',
    title: "Maryland Car Owner's Guide to Auto Insurance",
    cover: '/assets/media/202501-043dd8739ca60869b77c89c7ff4b5fd5.png',
    blurb: 'Valuable information for car owners in Maryland — what your policy actually covers, what the insurer will not volunteer, and what to do after a crash.',
    cta: 'Download our free book',
  },
];

export const videoCenter = {
  featured: { id: 'qxL3v1bvW9g', title: 'Get to know Alpert Schreyer Personal Injury Lawyers' },
  channel: 'https://www.youtube.com/@alpertschreyerllc',
};

/* Blog posts imported from the live site (page 1 of 39).
   Run `npm run import:blog` to pull the full archive via the WordPress REST
   API — see scripts/import-blog.mjs and TECHNICAL-MANUAL §12. */
