import os
import json
import time
import urllib.request
import urllib.parse

# 1. Direct URLs for active players (from original download_players.py)
player_direct_urls = {
    "messi": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg",
    "mbappe": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Kylian_Mbappé_2022.jpg",
    "ronaldo": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
    "kane": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Harry_Kane_2018.jpg",
    "bellingham": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Jude_Bellingham_2022.jpg",
    "vinicius": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Vinicius_Jr_2021.jpg",
    "debruyne": "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_2018.jpg",
    "yamal": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Lamine_Yamal_2024.jpg",
    "haaland": "https://upload.wikimedia.org/wikipedia/commons/0/07/Erling_Haaland_2022.jpg",
    "pedri": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Pedri_2021.jpg",
    "pulisic": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Christian_Pulisic_2021.jpg",
    "salah": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Mohamed_Salah_2018.jpg",
    "wirtz": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Florian_Wirtz_2021.jpg",
    "musiala": "https://upload.wikimedia.org/wikipedia/commons/2/25/Jamal_Musiala_2022.jpg",
    "odegaard": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Martin_Ødegaard_2021.jpg",
    "davies": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Alphonso_Davies_2021.jpg",
    "hakimi": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Achraf_Hakimi_2018.jpg",
    "alvarez": "https://upload.wikimedia.org/wikipedia/commons/6/68/Edson_Álvarez_2018.jpg",
    "adams": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Tyler_Adams_2022.jpg",
    "bounou": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Yassine_Bounou_2018.jpg",
    "mckennie": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Weston_McKennie_2021.jpg",
    
    # Algeria
    "mahrez": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Riyad_Mahrez_2018.jpg",
    "aouar": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Houssem_Aouar_2020.jpg",
    "ait_nouri": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Rayan_Aït-Nouri_2019.jpg",
    "bensebaini": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Ramy_Bensebaini_2018.jpg",
    "bentaleb": "https://upload.wikimedia.org/wikipedia/commons/8/87/Nabil_Bentaleb_2018.jpg",
    "mandi": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Aïssa_Mandi_2018.jpg",
    "luca_zidane": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Luca_Zidane_2018.jpg"
}

# 2. Wikipedia titles for active players (from download_wikipedia_players.py)
player_wiki_titles = {
    "messi": "Lionel Messi",
    "mbappe": "Kylian Mbappé",
    "ronaldo": "Cristiano Ronaldo",
    "kane": "Harry Kane",
    "bellingham": "Jude Bellingham",
    "vinicius": "Vinícius Júnior",
    "debruyne": "Kevin De Bruyne",
    "yamal": "Lamine Yamal",
    "haaland": "Erling Haaland",
    "pedri": "Pedri",
    "pulisic": "Christian Pulisic",
    "salah": "Mohamed Salah",
    "wirtz": "Florian Wirtz",
    "musiala": "Jamal Musiala",
    "odegaard": "Martin Ødegaard",
    "davies": "Alphonso Davies",
    "hakimi": "Achraf Hakimi",
    "alvarez": "Edson Álvarez",
    "adams": "Tyler Adams",
    "bounou": "Yassine Bounou",
    "mckennie": "Weston McKennie",
    "saka": "Bukayo Saka",
    "gimenez": "Santiago Giménez",
    "david": "Jonathan David",
    "eustaquio": "Stephen Eustáquio",
    "johnston": "Alistair Johnston",
    "shaffelburg": "Jacob Shaffelburg",
    
    # Algeria
    "mastil": "Melvin Mastil",
    "benbot": "Oussama Benbot",
    "luca_zidane": "Luca Zidane",
    "mandi": "Aïssa Mandi",
    "abada": "Achref Abada",
    "tougai": "Mohamed Amine Tougai",
    "belaid": "Zineddine Belaid",
    "hadjam": "Jaouen Hadjam",
    "ait_nouri": "Rayan Aït-Nouri",
    "belghali": "Rafik Belghali",
    "bensebaini": "Ramy Bensebaini",
    "chergui": "Samir Chergui",
    "zerrouki": "Ramiz Zerrouki",
    "aouar": "Houssem Aouar",
    "chaibi": "Farès Chaïbi",
    "boudaoui": "Hicham Boudaoui",
    "bentaleb": "Nabil Bentaleb",
    "maza": "Ibrahim Maza",
    "titraoui": "Yassine Titraoui",
    "mahrez": "Riyad Mahrez",
    "gouiri": "Amine Gouiri",
    "hadj_moussa": "Anis Hadj Moussa",
    "benbouali": "Nadhir Benbouali",
    "amoura": "Mohamed Amine Amoura",
    "boulbina": "Adil Boulbina",
    "ghedjemis": "Farès Ghedjemis"
}

# Create public/players/ directory if it doesn't exist
os.makedirs("public/players", exist_ok=True)

print("Starting consolidated player image downloads...")
for player_key, wiki_title in player_wiki_titles.items():
    target_path = f"public/players/{player_key}.png"
    
    # Check if already downloaded and valid
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        print(f"Already exists: {player_key} -> {target_path}")
        continue

    downloaded = False

    # Try direct URL download first if it exists
    if player_key in player_direct_urls:
        raw_url = player_direct_urls[player_key]
        parsed = urllib.parse.urlparse(raw_url)
        encoded_path = urllib.parse.quote(parsed.path)
        url = urllib.parse.urlunparse(parsed._replace(path=encoded_path))
        
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'StadiumGeniePlayerBot/1.0 (contact@stadiumgenie.org; educational challenge project)'}
            )
            with urllib.request.urlopen(req) as response, open(target_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Downloaded from direct URL: {player_key} -> {target_path}")
            downloaded = True
        except Exception as e:
            print(f"Direct URL download failed for {player_key}, falling back to Wikipedia API: {e}")

    # Fallback to Wikipedia API query
    if not downloaded:
        api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=pageimages&format=json&pithumbsize=300"
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
                    print(f"Downloaded from Wikipedia API: {wiki_title} ({player_key}) -> {target_path}")
                    downloaded = True
                else:
                    print(f"No Wikipedia thumbnail found for {wiki_title}")
                    
        except Exception as e:
            print(f"Wikipedia API download failed for {wiki_title}: {e}")

    time.sleep(1.0) # Respect rate limits

print("Player downloading completed.")
