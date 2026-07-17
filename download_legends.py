import os
import json
import time
import urllib.request
import urllib.parse

# Legend players from FifaHistory who need real images
legend_wiki_titles = {
    "pele": "Pelé",
    "maradona": "Diego Maradona",
    "zidane": "Zinedine Zidane",
    "ronaldo_nazario": "Ronaldo (Brazilian footballer)",
    "beckenbauer": "Franz Beckenbauer",
    "cruyff": "Johan Cruyff",
    "platini": "Michel Platini",
    "matthaus": "Lothar Matthäus",
    "garrincha": "Garrincha",
    "klose": "Miroslav Klose",
    "mueller": "Gerd Müller",
    "roberto_carlos": "Roberto Carlos",
    "cafu": "Cafu",
    "rivaldo": "Rivaldo",
    "ronaldinho": "Ronaldinho",
    "iniesta": "Andrés Iniesta",
    "xavi": "Xavi Hernandez",
    "neymar": "Neymar",
    "modric": "Luka Modric",
    "suker": "Davor Suker",
    "forlan": "Diego Forlan",
    "villa": "David Villa",
    "henry": "Thierry Henry",
    "rooney": "Wayne Rooney",
    "neuer": "Manuel Neuer",
    "buffon": "Gianluigi Buffon",
    "toni_kroos": "Toni Kroos",
    "deschamps": "Didier Deschamps",
    "pogba": "Paul Pogba",
    "griezmann": "Antoine Griezmann",
    "perisic": "Ivan Perisic",
    "mandzukic": "Mario Mandzukic",
    "baggio": "Roberto Baggio",
    "baresi": "Franco Baresi",
    "romario": "Romario",
    "stoichkov": "Hristo Stoichkov",
    "rummenigge": "Karl-Heinz Rummenigge",
    "rossi": "Paolo Rossi",
    "kempes": "Mario Kempes",
    "eusebio": "Eusebio",
    "bobby_moore": "Bobby Moore",
    "geoff_hurst": "Geoff Hurst",
    "bobby_charlton": "Bobby Charlton",
    "puskas": "Ferenc Puskas",
    "fontaine": "Just Fontaine",
    "didi": "Didi (footballer)",
    "vava": "Vava (footballer)",
    "masopust": "Josef Masopust",
    "seeler": "Uwe Seeler",
    "jairzinho": "Jairzinho",
    "rivelino": "Rivellino",
    "muller_gerd": "Gerd Müller",
    "rensenbink": "Rob Rensenbrink",
    "ardiles": "Osvaldo Ardiles",
    "passarella": "Daniel Passarella",
    "schumacher": "Harald Schumacher",
    "lineker": "Gary Lineker",
    "voller": "Rudi Voller",
    "schillaci": "Salvatore Schillaci",
    "bergkamp": "Dennis Bergkamp",
    "batistuta": "Gabriel Batistuta",
    "klinsmann": "Jurgen Klinsmann",
    "cantona": "Eric Cantona",
    "owen": "Michael Owen",
    "rivaldo2": "Rivaldo",
    "lahm": "Philipp Lahm",
    "schweinsteiger": "Bastian Schweinsteiger",
    "gotze": "Mario Götze",
    "lloris": "Hugo Lloris",
    "giroud": "Olivier Giroud",
    "martinez_emi": "Emiliano Martinez (footballer, born 1992)",
    "di_maria": "Angel Di Maria",
}

# Create public/players/ directory if it doesn't exist
os.makedirs("public/players", exist_ok=True)

print("Starting Wikipedia LEGEND player image downloads...")
for player_key, wiki_title in legend_wiki_titles.items():
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=pageimages&format=json&pithumbsize=300"
    target_path = f"public/players/{player_key}.png"
    
    # Skip if already downloaded
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        print(f"Already exists: {player_key} -> {target_path}")
        continue
    
    try:
        req = urllib.request.Request(
            api_url, 
            headers={'User-Agent': 'StadiumGenieBot/1.0 (contact@stadiumgenie.org; educational project)'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            page_id = list(pages.keys())[0]
            thumbnail = pages.get(page_id, {}).get("thumbnail", {}).get("source")
            
            if thumbnail:
                img_req = urllib.request.Request(
                    thumbnail, 
                    headers={'User-Agent': 'StadiumGenieBot/1.0 (contact@stadiumgenie.org; educational project)'}
                )
                with urllib.request.urlopen(img_req) as img_response, open(target_path, 'wb') as out_file:
                    out_file.write(img_response.read())
                print(f"Downloaded: {wiki_title} ({player_key}) -> {target_path}")
            else:
                print(f"No image found for {wiki_title}")
                
    except Exception as e:
        print(f"Failed for {wiki_title}: {e}")
        
    time.sleep(0.8)

print("Legend player downloading completed.")
