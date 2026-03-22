import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'cases'))

def ensure_dir():
    os.makedirs(BASE_DIR, exist_ok=True)

cases = [
    # --- CRIMINAL - EASY ---
    {
        "id": "CRIM_EASY_1",
        "title": "State of Karnataka vs. Arjun Mehta - Chain Snatching Case",
        "type": "criminal",
        "difficulty": "easy",
        "laws_invoked": ["IPC 379"],
        "location": "Indiranagar, Bangalore",
        "description": "On January 15, 2024, at 6:30 PM, Sunita Desai was returning home from Gandhi Bazaar market carrying groceries. As she crossed the MG Road junction near Cubbon Park, Arjun Mehta approached on a black Honda Activa (KA-03-MH-4567) without a helmet. He snatched her 22-karat gold chain (weight: 45 grams, value: ₹2,45,000) and fled towards Brigade Road. Sunita fell during the incident, sustaining injuries to her right knee and elbow. She immediately screamed for help.",
        "characters": [
            {"name": "Sunita Desai", "role": "Victim", "details": "42, school teacher, widow, sole breadwinner"},
            {"name": "Arjun Mehta", "role": "Accused", "details": "26, unemployed, drug addiction history"},
            {"name": "Ramesh Kumar", "role": "Witness", "details": "shopkeeper"},
            {"name": "Priya Singh", "role": "Witness", "details": "passerby"},
            {"name": "Inspector Ravindra Nath", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 034/2024, Indiranagar Police Station",
            "CCTV footage (4 cameras, clear face capture)",
            "Medical examination report (Dr. Kavitha, Victoria Hospital)",
            "Recovery panchanama (chain found at accused's rented room)",
            "Two eyewitness statements (Ramesh & Priya)",
            "Accused's confession statement (retracted later)",
            "Gold chain valuation certificate"
        ],
        "evidence_chain": [
            "CCTV shows face clearly, vehicle number visible",
            "Chain recovered from Arjun's possession within 6 hours",
            "Pawn shop owner confirms Arjun tried to sell the chain",
            "Fingerprints on victim's bag match Arjun's",
            "Victim identifies accused in Test Identification Parade"
        ]
    },
    {
        "id": "CRIM_EASY_2",
        "title": "State of Maharashtra vs. Vikram Yadav - Bar Brawl Assault",
        "type": "criminal",
        "difficulty": "easy",
        "laws_invoked": ["IPC 323", "IPC 504"],
        "location": "Phoenix Mall, Pune",
        "description": "On February 3, 2024, around 11:45 PM at 'High Spirits' bar in Phoenix Mall, Rohan Kapoor accidentally bumped into Vikram Yadav while walking to the restroom. Vikram, who had consumed 4 pegs of whiskey (as per bill), verbally abused Rohan using casteist slurs. When Rohan asked him to calm down, Vikram punched him three times - once on the nose (causing bleeding), once on the left eye (resulting in swelling), and once on the chest. Rohan fell backwards, hitting his head on a bar stool. The bouncer intervened and separated them. Rohan was taken to Ruby Hall Clinic where he received 5 stitches on his forehead.",
        "characters": [
            {"name": "Rohan Kapoor", "role": "Victim", "details": "28, software engineer, married, new father"},
            {"name": "Vikram Yadav", "role": "Accused", "details": "32, gym trainer, known for anger issues"},
            {"name": "Sameer Khan", "role": "Witness", "details": "Bartender"},
            {"name": "Ajay Thakur", "role": "Witness", "details": "Bouncer"},
            {"name": "Sub-Inspector Meera Joshi", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 078/2024, Koregaon Park Police Station",
            "Medical Legal Certificate (MLC) from Ruby Hall Clinic",
            "Injury photographs (nose fracture, eye contusion, forehead laceration)",
            "Bar CCTV footage (shows entire incident)",
            "Bar bill (proof of Vikram's alcohol consumption)",
            "Witness statements (5 witnesses - all consistent)",
            "Blood alcohol test results (Vikram: 0.12% BAC)",
            "Rohan's shirt with bloodstains (forensic evidence)"
        ],
        "evidence_chain": [
            "Clear video showing unprovoked attack",
            "Medical report confirms simple hurt (not grievous)",
            "Multiple independent witnesses",
            "Accused was intoxicated (but not defense under IPC 85/86)",
            "Casteist slurs recorded in witness statements"
        ]
    },
    {
        "id": "CRIM_EASY_3",
        "title": "State of Delhi vs. Neha Sharma - Online Shopping Fraud",
        "type": "criminal",
        "difficulty": "easy",
        "laws_invoked": ["IPC 420", "IPC 465"],
        "location": "Rohini, Delhi",
        "description": "Between November 10-25, 2023, Neha Sharma created a fake e-commerce website 'SuperElectronics.in' mimicking the legitimate 'SuperElectronics.com'. She advertised iPhone 14 Pro Max at ₹45,000 (actual price: ₹1,39,900) on social media. Rajesh Gupta, looking for a phone for his grandson's birthday, placed an order and paid ₹45,000 via UPI to Neha's account (disguised as 'SuperElectronics Pvt Ltd'). After payment, Neha sent him a cheap Chinese phone worth ₹3,500 in an iPhone box. When Rajesh complained, Neha blocked all communication. Rajesh's son Amit, who works in IT, discovered the fake website and reported to cyber crime.",
        "characters": [
            {"name": "Rajesh Gupta", "role": "Victim", "details": "55, retired banker, not tech-savvy"},
            {"name": "Neha Sharma", "role": "Accused", "details": "29, MBA graduate, serial fraudster"},
            {"name": "Amit Gupta", "role": "Witness", "details": "Rajesh's son"},
            {"name": "Inspector Sandeep Kumar", "role": "Cyber Crime Expert", "details": ""},
            {"name": "ASI Priyanka Rao", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 234/2024, Cyber Crime Cell, Rohini",
            "Fake website screenshots (with grammatical errors)",
            "UPI transaction records (₹45,000 to Neha's account)",
            "Bank account statements (Neha received ₹14.5 lakhs from 47 victims)",
            "Courier tracking records",
            "Domain registration details (registered under fake name)",
            "WhatsApp chat screenshots (Neha promising delivery)",
            "Forensic report on the Chinese phone received",
            "Social media advertisement screenshots",
            "IP address logs (traced to Neha's location)"
        ],
        "evidence_chain": [
            "UPI payment directly to Neha's account",
            "46 other victims identified with similar complaints",
            "Domain registered just 1 month before scam",
            "Fake GST number used on website",
            "Digital evidence shows intent to cheat from beginning"
        ]
    },
    
    # --- CRIMINAL - MEDIUM ---
    {
        "id": "CRIM_MED_1",
        "title": "State of Tamil Nadu vs. Karthik Shankar - Road Rage Culpable Homicide",
        "type": "criminal",
        "difficulty": "medium",
        "laws_invoked": ["IPC 304 Part II"],
        "location": "OMR Road, Chennai",
        "description": "On March 12, 2024, at 10:15 PM on OMR Road near Siruseri toll plaza, Arun Prakash (driving Honda City) and Karthik Shankar (driving Toyota Fortuner) had a minor collision when Karthik changed lanes abruptly. Both vehicles had minor scratches. They pulled over to the side. What started as a heated argument escalated when Karthik, in a fit of rage, pushed Arun forcefully. Arun, who had recently undergone a heart surgery (2 months prior - medical records available), fell backwards and hit his head on the road divider edge. Karthik immediately called an ambulance, but Arun died en route to the hospital. Autopsy revealed: (1) Severe head trauma from hitting the divider, and (2) Heart attack possibly triggered by the altercation stress.",
        "characters": [
            {"name": "Arun Prakash", "role": "Victim (Deceased)", "details": "34, IT professional, father of 2 kids"},
            {"name": "Karthik Shankar", "role": "Accused", "details": "38, business owner, no criminal record"},
            {"name": "Murugan", "role": "Witness", "details": "Auto driver"},
            {"name": "Lakshmi", "role": "Witness", "details": "Toll booth operator"},
            {"name": "Inspector Venkatesan", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 156/2024, Siruseri Police Station",
            "Post-mortem report (two causes: head injury + cardiac arrest)",
            "Arun's medical history (cardiac bypass surgery 2 months ago)",
            "CCTV footage (shows push, fall, but NOT the initial collision)",
            "Dash cam footage from a passing vehicle (shows Arun falling)",
            "Witness statements (auto driver saw the push)",
            "Karthik's 100 call recording (shows immediate remorse)",
            "Forensic report on road divider (blood and hair samples)",
            "Insurance claim documents (proving minor collision damage)"
        ],
        "legal_ambiguity": "Did Karthik KNOW Arun had a heart condition? Did Karthik INTEND to cause death? Was the push sufficient in ordinary course of nature to cause death? Should it be IPC 304 Part I or Part II?"
    },
    {
        "id": "CRIM_MED_2",
        "title": "State of UP vs. Ramesh Tiwari & 2 Others - Armed Robbery",
        "type": "criminal",
        "difficulty": "medium",
        "laws_invoked": ["IPC 392", "IPC 397"],
        "location": "Swaroop Nagar, Kanpur",
        "description": "On April 8, 2024, at 8:45 PM (just before closing time), three masked men entered 'Gupta Jewellers' in Swaroop Nagar. Ramesh carried a countrymade pistol (.315 bore), Suresh had a knife, and Dinesh kept watch at the door. They threatened Shyam Lal and his son Rakesh at gunpoint, locked them in the back room, and looted jewelry worth ₹45 lakhs. The entire robbery took 12 minutes. They fled on a stolen motorcycle (UP-78-B-5432). A security guard noted the bike number. Police tracked the motorcycle to a scrap dealer who identified Ramesh. During the raid at Ramesh's house, stolen jewelry worth ₹38 lakhs was recovered. Suresh and Dinesh were arrested based on Ramesh's interrogation.",
        "characters": [
            {"name": "Ramesh Tiwari", "role": "Accused 1", "details": "35, unemployed, ring leader"},
            {"name": "Suresh Kumar", "role": "Accused 2", "details": "28, previous theft record"},
            {"name": "Dinesh Yadav", "role": "Accused 3", "details": "24, first-time offender"},
            {"name": "Shyam Lal Gupta", "role": "Victim", "details": "60, jewelry shop owner"},
            {"name": "Rakesh Gupta", "role": "Victim", "details": "32, son of Shyam Lal"},
            {"name": "Inspector Rajendra Singh", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 289/2024, Swaroop Nagar Police Station",
            "Shop CCTV footage (clear visuals of all 3 accused)",
            "Recovery panchanama (₹38 lakhs worth jewelry)",
            "Forensic report on the country-made pistol (loaded with 3 bullets)",
            "Motorcycle owner's statement (bike was stolen 2 days prior)",
            "Jewelry shop inventory list (before and after robbery)",
            "Victim statements (Shyam Lal & Rakesh)",
            "Security guard's statement (saw bike number)",
            "Call detail records (showing coordination between accused)"
        ],
        "legal_ambiguity": "Robbery (IPC 392) vs Dacoity (IPC 395) - does 3 persons constitute dacoity? IPC 397 (robbery with attempt to cause death) - was the gun actually intended to be used? Role differentiation - Dinesh claims he was just a lookout."
    },
    {
        "id": "CRIM_MED_3",
        "title": "State of West Bengal vs. Ananya Das - Criminal Breach of Trust",
        "type": "criminal",
        "difficulty": "medium",
        "laws_invoked": ["IPC 406", "IPC 408"],
        "location": "Salt Lake, Kolkata",
        "description": "Ananya Das joined TechCorp Solutions in 2019 as a junior accountant and was promoted to Senior Accountant in 2022 with access to company bank accounts. Between January 2023 and October 2023, she systematically embezzled ₹1.2 crores through 8 fake vendor accounts, 156 fraudulent payments, forging digital signatures of Director Arvind Malhotra, and manipulating accounting entries. The fraud was discovered during the annual audit in November 2023 when CA Rajesh Sinha noticed unusual vendor payment patterns. Ananya was confronted on November 24, 2023, and confessed in writing, promising to repay ₹30 lakhs immediately. She paid ₹18 lakhs and then disappeared. FIR was filed on December 1, 2023.",
        "characters": [
            {"name": "TechCorp Solutions Pvt. Ltd.", "role": "Victim", "details": "IT company"},
            {"name": "Ananya Das", "role": "Accused", "details": "31, Senior Accountant, 5 years employment"},
            {"name": "Arvind Malhotra", "role": "Witness", "details": "Company Director"},
            {"name": "CA Rajesh Sinha", "role": "Witness", "details": "Auditor who discovered the fraud"},
            {"name": "Priya Sen", "role": "Witness", "details": "Assistant Accountant (Co-worker)"},
            {"name": "Inspector Moumita Chatterjee", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 412/2023, Bidhannagar Police Station",
            "Forensic audit report (detailed breakdown of all 156 transactions)",
            "Fake vendor registration documents",
            "Bank statements showing transfers to Ananya's relatives",
            "Digital signature forgery analysis report",
            "Property purchase documents (flat in New Town bought in Aug 2023)",
            "Ananya's written confession (dated Nov 24, 2023)",
            "Email trails (fake communication with vendors)",
            "CCTV footage (Ananya leaving office with company documents)",
            "Recovery statement (₹18 lakhs returned, ₹1.02 crores outstanding)"
        ],
        "legal_ambiguity": "IPC 406 (criminal breach of trust) vs IPC 408 (by employee). Whether the written confession is admissible (obtained before FIR). Whether Priya Sen is also guilty (helped unknowingly)."
    },

    # --- CRIMINAL - HARD ---
    {
        "id": "CRIM_HARD_1",
        "title": "State of Haryana vs. Manoj Verma - Murder or Culpable Homicide? Intent Ambiguity",
        "type": "criminal",
        "difficulty": "hard",
        "laws_invoked": ["IPC 300", "IPC 304"],
        "location": "Sector 14, Gurgaon",
        "description": "Manoj and Ritu were married for 7 years. Manoj discovered in February 2024 that Ritu was having an affair with Sanjay Malhotra for the past 6 months. On March 3, 2024, Manoj confronted Sanjay at his office around 7 PM. Eyewitnesses say heated argument lasted 15 minutes. Manoj admits to 'losing control' and engaging in a physical fight. Manoj punched Sanjay 4 times. Sanjay fell and hit his head on a marble paperweight. Manoj picked up the paperweight and struck Sanjay once on the head. Sanjay collapsed, bleeding profusely. Manoj immediately called 100 (police) and ambulance. Sanjay died 40 minutes later. Autopsy Findings: Cause of Death: Severe head trauma from blunt object. Contributing Factor: Sanjay had a thin skull (congenital condition - discovered post-mortem).",
        "characters": [
            {"name": "Sanjay Malhotra", "role": "Victim (Deceased)", "details": "29, real estate agent, had affair with accused's wife"},
            {"name": "Manoj Verma", "role": "Accused", "details": "33, gym owner, discovered wife's affair"},
            {"name": "Ritu Verma", "role": "Witness", "details": "30, Accused's Wife - homemaker"},
            {"name": "DCP Rohit Mehra", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 089/2024, Sector 14 Police Station",
            "Post-mortem report (detailed skull analysis)",
            "WhatsApp chat evidence (Ritu-Sanjay affair messages)",
            "CCTV footage from office (shows fight, but angle doesn't clearly show paperweight blow)",
            "Manoj's call to police (recording shows panic, 'I didn't mean to kill him')",
            "Witness statements (2 witnesses - versions slightly differ on who started the fight)",
            "Forensic report on paperweight (blood, hair, fingerprints match)",
            "Medical expert opinion on 'thin skull rule'",
            "Ritu's statement (she admits affair, says Manoj was provoked)"
        ],
        "legal_ambiguity": "Is this MURDER (IPC 300) or CULPABLE HOMICIDE (IPC 304)? Was the paperweight blow a reflex action or deliberate? Role of provocation (Exception 1). Distinction between intent and knowledge. 'Thin skull rule'."
    },
    {
        "id": "CRIM_HARD_2",
        "title": "State of Rajasthan vs. Vikrant Singh - Rape with Evidence Challenges",
        "type": "criminal",
        "difficulty": "hard",
        "laws_invoked": ["IPC 376", "Evidence Act 53A", "Evidence Act 114A"],
        "location": "Jaipur",
        "description": "On March 15, 2024, Vikrant invited Meera (whom he had gone on 3 friendly dates with) to his apartment for 'dinner and Netflix'. Meera states that after dinner, Vikrant made advances and she clearly refused ('I'm not interested in a relationship'). Despite saying 'No', Vikrant forced himself on her. After the 15-minute incident, Meera left immediately to her friend Anjali's house, arriving in shock at 11:45 PM. A formal police complaint was filed with a 16-hour delay due to trauma. Vikrant claims it was fully consensual, stating she's filing a false case because he didn't want a deeper relationship afterward.",
        "characters": [
            {"name": "Meera Sharma", "role": "Victim", "details": "24, graphic designer, independent woman"},
            {"name": "Vikrant Singh", "role": "Accused", "details": "32, corporate lawyer, known to victim"},
            {"name": "Anjali Reddy", "role": "Witness", "details": "Victim's friend, critical witness"},
            {"name": "Dr. Sunita Patel", "role": "Medical Examiner", "details": ""},
            {"name": "Inspector Kavita Rathore", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 234/2024, Malviya Nagar Police Station",
            "Medical examination report (no external injuries, internal confirms intercourse, no semen as condom used)",
            "Forensic report from Vikrant's apartment (Meera's hair, wine glasses, used condom in dustbin)",
            "WhatsApp messages (Dec 2023 - Mar 2024) showing friendly relations but no messages from Meera post-incident",
            "Anjali's statement (Meera arrived crying, torn dress)",
            "CCTV footage (shows Meera leaving building running, adjusting clothes)",
            "Neighbors' statements (heard 'raised voices' around 10:30 PM)",
            "Psychological evaluation of Meera (shows PTSD signs)"
        ],
        "legal_ambiguity": "Application of Evidence Act 114A (presumption of no consent). 16-hour delay in reporting. No external injuries indicating force. Impact of prior friendly relationship. Whether inviting implies consent."
    },
    {
        "id": "CRIM_HARD_3",
        "title": "State of Bihar vs. Ramesh Prasad & Family - Dowry Death",
        "type": "criminal",
        "difficulty": "hard",
        "laws_invoked": ["IPC 304B", "IPC 498A", "Evidence Act 113B"],
        "location": "Patna",
        "description": "Priya married Ramesh on February 14, 2022. Dowry given: ₹25 lakhs cash, 100 grams gold, Honda City car. Problems started when Ramesh's business failed and they demanded ₹15 lakhs more. Medical records show Priya suffered burn marks, fractured wrist, and multiple bruises over late 2023. On March 20, 2024, at 11:30 AM, Priya was found hanging from a ceiling fan by a dupatta. Ramesh claims he was at work, mother Shanti at temple, and brother Rajeev studying. Post-Mortem Report found death by hanging between 11 AM - 1 PM, but also fresh bruising on forehead and scratches on neck, suggesting a struggle before death. No suicide note was found.",
        "characters": [
            {"name": "Priya Sharma", "role": "Victim (Deceased)", "details": "26, MBA graduate, married 2 years"},
            {"name": "Ramesh Prasad", "role": "Accused 1", "details": "30, husband, bank employee"},
            {"name": "Shanti Devi", "role": "Accused 2", "details": "55, mother-in-law"},
            {"name": "Rajeev Prasad", "role": "Accused 3", "details": "32, brother-in-law"},
            {"name": "Anil Sharma", "role": "Witness", "details": "60, Victim's Father - retired teacher"},
            {"name": "Rekha Singh", "role": "Witness", "details": "Neighbor"},
            {"name": "SI Priya Kumari", "role": "Investigating Officer", "details": ""}
        ],
        "evidence": [
            "FIR No. 156/2024, Kankarbagh Police Station",
            "Post-mortem report (death by hanging + fresh struggle injuries)",
            "Crime scene photos (feet 4 inches off ground, overturned stool, no suicide note)",
            "WhatsApp chat history (complaining about dowry demands and violence)",
            "Medical records (3 hospital visits in 6 months for suspicious injuries)",
            "Neighbor Rekha's statement (heard arguments at 10:30 AM that day)",
            "Bank statements (Ramesh pressuring Priya's father for €15L transfer)",
            "Forensic report on dupatta (no fingerprints - wiped clean?)",
            "Call detail records (Priya called father crying at 10:15 AM)"
        ],
        "legal_ambiguity": "Was it Suicide or Murder Disguised as Suicide? Application of Evidence Act 113B (presumption). All accused have partial alibis. Forensics ambiguous (hanging vs forced hanging). Circumstantial evidence chains."
    },

    # --- CIVIL - EASY/MED/HARD Placeholders as requested ---
    {
        "id": "CIVIL_EASY_1",
        "title": "Breach of Contract - E-commerce Delivery Dispute",
        "type": "civil",
        "difficulty": "easy",
        "laws_invoked": ["Contract Act 1872", "Sale of Goods Act 1930"],
        "location": "Mumbai",
        "description": "Detailed case with realistic characters, contract documents, email trails, delivery proofs involving a standard breach of e-commerce delivery contract.",
        "characters": [],
        "evidence": [],
        "legal_ambiguity": "Standard breach analysis."
    },
    {
        "id": "CIVIL_MED_1",
        "title": "Property Dispute - Ancestral Land Partition",
        "type": "civil",
        "difficulty": "medium",
        "laws_invoked": ["Transfer of Property Act 1882", "Hindu Succession Act 1956"],
        "location": "Lucknow",
        "description": "Detailed case with family tree, property documents, survey reports, rival claims regarding ancestral property partition.",
        "characters": [],
        "evidence": [],
        "legal_ambiguity": "Complex property division issues."
    },
    {
        "id": "CIVIL_HARD_1",
        "title": "Defamation vs Free Speech",
        "type": "civil",
        "difficulty": "hard",
        "laws_invoked": ["IPC 499", "Article 19(1)(a) Constitution"],
        "location": "Delhi",
        "description": "Detailed case with newspaper article, journalist's sources, and public figure's reputation damage analyzing free speech protections.",
        "characters": [],
        "evidence": [],
        "legal_ambiguity": "Balancing Article 19(1)(a) against reputation rights."
    },

    # --- CONSTITUTIONAL - EASY/MED/HARD Placeholders as requested ---
    {
        "id": "CONST_EASY_1",
        "title": "Right to Education Denial",
        "type": "constitutional",
        "difficulty": "easy",
        "laws_invoked": ["Article 21A", "RTE Act 2009"],
        "location": "Rural UP",
        "description": "Detailed case with school denial letter, RTI responses, and government circulars regarding denial of primary education.",
        "characters": [],
        "evidence": [],
        "legal_ambiguity": "Direct violation of Article 21A."
    },
    {
        "id": "CONST_MED_1",
        "title": "Sedition vs Freedom of Speech",
        "type": "constitutional",
        "difficulty": "medium",
        "laws_invoked": ["Article 19(1)(a)", "IPC 124A"],
        "location": "Bangalore",
        "description": "Detailed case with social media posts, speech transcripts, and police notices testing sedition laws.",
        "characters": [],
        "evidence": [],
        "legal_ambiguity": "Limits of free speech under Article 19(2)."
    },
    {
        "id": "CONST_HARD_1",
        "title": "Privacy Rights - Aadhaar-type Case",
        "type": "constitutional",
        "difficulty": "hard",
        "laws_invoked": ["Article 21 (Right to Privacy)"],
        "location": "Supreme Court",
        "description": "Detailed case with PILs, government's data collection policy, and surveillance evidence analyzing proportionality.",
        "characters": [],
        "evidence": [],
        "legal_ambiguity": "Proportionality test in overriding the fundamental right to privacy."
    }
]

def main():
    ensure_dir()
    
    index_data = []
    
    for case in cases:
        # Create individual JSON file
        file_path = os.path.join(BASE_DIR, f"{case['id']}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(case, f, indent=2, ensure_ascii=False)
        
        # Add to index
        index_data.append({
            "id": case["id"],
            "title": case["title"],
            "type": case["type"],
            "difficulty": case["difficulty"]
        })
        
    # Write case_index.json
    index_path = os.path.join(BASE_DIR, "case_index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {len(cases)} case JSON files and case_index.json")

if __name__ == "__main__":
    main()
