import os
import shutil
import re
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Source directory for downloaded images
src_dir = r"C:\Users\kumar\Downloads\Picflow Images Jul 17"
dest_dir = r"e:\Challenge for\public\players"

os.makedirs(dest_dir, exist_ok=True)

algeria_players_raw = [
    # Goalkeepers
    {"name": "Melvin MASTIL", "file": "Melvin MASTIL.jpg", "pos": "Goalkeeper", "age": 25, "h": "188 cm", "w": "82 kg", "club": "Lausanne-Sport", "league": "Swiss Super League", "goals": 0, "caps": 3, "val": "$1.5M"},
    {"name": "Oussama BENBOT", "file": "Oussama BENBOT.jpg", "pos": "Goalkeeper", "age": 29, "h": "186 cm", "w": "80 kg", "club": "USM Alger", "league": "Algerian Ligue 1", "goals": 0, "caps": 5, "val": "$1.2M"},
    {"name": "Luca ZIDANE", "file": "Luca ZIDANE.jpg", "pos": "Goalkeeper", "age": 27, "h": "183 cm", "w": "78 kg", "club": "Granada CF", "league": "La Liga 2", "goals": 0, "caps": 4, "val": "$2.5M"},
    
    # Defenders
    {"name": "Aissa MANDI", "file": "Aissa MANDI.jpg", "pos": "Defender", "age": 33, "h": "184 cm", "w": "79 kg", "club": "Lille OSC", "league": "Ligue 1", "goals": 5, "caps": 97, "val": "$3.5M"},
    {"name": "Achref ABADA", "file": "Achref ABADA.jpg", "pos": "Defender", "age": 24, "h": "182 cm", "w": "75 kg", "club": "MC Alger", "league": "Algerian Ligue 1", "goals": 0, "caps": 4, "val": "$800K"},
    {"name": "Mohamed Amine TOUGAI", "file": "Mohamed Amine TOUGAI.jpg", "pos": "Defender", "age": 26, "h": "191 cm", "w": "84 kg", "club": "Espérance de Tunis", "league": "Tunisian Ligue 1", "goals": 1, "caps": 19, "val": "$2.0M"},
    {"name": "Zineddine BELAID", "file": "Zineddine BELAID.jpg", "pos": "Defender", "age": 26, "h": "187 cm", "w": "81 kg", "club": "Sint-Truiden", "league": "Belgian Pro League", "goals": 0, "caps": 10, "val": "$1.8M"},
    {"name": "Jaouen HADJAM", "file": "Jaouen HADJAM.jpg", "pos": "Defender", "age": 22, "h": "184 cm", "w": "77 kg", "club": "Young Boys", "league": "Swiss Super League", "goals": 0, "caps": 7, "val": "$4.0M"},
    {"name": "Rayan AIT-NOURI", "file": "Rayan AIT-NOURI.jpg", "pos": "Defender", "age": 24, "h": "179 cm", "w": "70 kg", "club": "Wolverhampton Wanderers", "league": "Premier League", "goals": 1, "caps": 13, "val": "$35M"},
    {"name": "Rafik BELGHALI", "file": "Rafik BELGHALI.jpg", "pos": "Defender", "age": 23, "h": "180 cm", "w": "74 kg", "club": "KV Mechelen", "league": "Belgian Pro League", "goals": 0, "caps": 2, "val": "$1.5M"},
    {"name": "Ramy BENSEBAINI", "file": "Ramy BENSEBAINI.jpg", "pos": "Defender", "age": 30, "h": "187 cm", "w": "82 kg", "club": "Borussia Dortmund", "league": "Bundesliga", "goals": 6, "caps": 67, "val": "$9.0M"},
    {"name": "Samir CHERGUI", "file": "Samir CHERGUI.jpg", "pos": "Defender", "age": 26, "h": "185 cm", "w": "78 kg", "club": "Paris FC", "league": "Ligue 2", "goals": 0, "caps": 3, "val": "$1.2M"},
    
    # Midfielders
    {"name": "Ramiz ZERROUKI", "file": "Ramiz ZERROUKI.jpg", "pos": "Midfielder", "age": 27, "h": "183 cm", "w": "76 kg", "club": "Feyenoord", "league": "Eredivisie", "goals": 3, "caps": 37, "val": "$8.5M"},
    {"name": "Houssem Aouar", "file": "Houssem Aouar.jpg", "pos": "Midfielder", "age": 27, "h": "175 cm", "w": "70 kg", "club": "Al-Ittihad", "league": "Saudi Pro League", "goals": 3, "caps": 11, "val": "$12M"},
    {"name": "Fares CHAIBI", "file": "Fares CHAIBI.jpg", "pos": "Midfielder", "age": 22, "h": "183 cm", "w": "75 kg", "club": "Eintracht Frankfurt", "league": "Bundesliga", "goals": 2, "caps": 15, "val": "$18M"},
    {"name": "Hicham BOUDAOUI", "file": "Hicham BOUDAOUI.jpg", "pos": "Midfielder", "age": 25, "h": "176 cm", "w": "68 kg", "club": "OGC Nice", "league": "Ligue 1", "goals": 0, "caps": 20, "val": "$10M"},
    {"name": "Nabil Bentaleb", "file": "Nabil Bentaleb.jpg", "pos": "Midfielder", "age": 30, "h": "187 cm", "w": "78 kg", "club": "Lille OSC", "league": "Ligue 1", "goals": 6, "caps": 52, "val": "$7.0M"},
    {"name": "Ibrahim MAZA", "file": "Ibrahim MAZA.jpg", "pos": "Midfielder", "age": 19, "h": "180 cm", "w": "72 kg", "club": "Hertha BSC", "league": "2. Bundesliga", "goals": 0, "caps": 1, "val": "$8.0M"},
    {"name": "Yassine TITRAOUI", "file": "Yassine TITRAOUI.jpg", "pos": "Midfielder", "age": 21, "h": "177 cm", "w": "70 kg", "club": "Charleroi", "league": "Belgian Pro League", "goals": 0, "caps": 2, "val": "$2.0M"},
    
    # Forwards
    {"name": "Riyad Mahrez", "file": "Riyad Mahrez.jpg", "pos": "Forward", "age": 34, "h": "179 cm", "w": "67 kg", "club": "Al-Ahli", "league": "Saudi Pro League", "goals": 31, "caps": 94, "val": "$14M"},
    {"name": "Amine GOUIRI", "file": "Amine GOUIRI.jpg", "pos": "Forward", "age": 25, "h": "180 cm", "w": "72 kg", "club": "Stade Rennais", "league": "Ligue 1", "goals": 4, "caps": 10, "val": "$25M"},
    {"name": "Anis HADJ MOUSSA", "file": "Anis HADJ MOUSSA.jpg", "pos": "Forward", "age": 23, "h": "174 cm", "w": "66 kg", "club": "Feyenoord", "league": "Eredivisie", "goals": 0, "caps": 3, "val": "$4.0M"},
    {"name": "Nadhir BENBOUALI", "file": "Nadhir BENBOUALI.jpg", "pos": "Forward", "age": 25, "h": "190 cm", "w": "83 kg", "club": "Győri ETO", "league": "NB I", "goals": 0, "caps": 2, "val": "$1.0M"},
    {"name": "Mohamed AMOURA", "file": "Mohamed AMOURA.jpg", "pos": "Forward", "age": 25, "h": "170 cm", "w": "64 kg", "club": "VfL Wolfsburg", "league": "Bundesliga", "goals": 6, "caps": 27, "val": "$16M"},
    {"name": "Adil BOULBINA", "file": "Adil BOULBINA.jpg", "pos": "Forward", "age": 22, "h": "178 cm", "w": "71 kg", "club": "Paradou AC", "league": "Algerian Ligue 1", "goals": 0, "caps": 2, "val": "$1.2M"},
    {"name": "Fares GHEDJEMIS", "file": "Fares GHEDJEMIS.jpg", "pos": "Forward", "age": 22, "h": "181 cm", "w": "73 kg", "club": "Frosinone", "league": "Serie B", "goals": 0, "caps": 1, "val": "$1.5M"},
    
    # Manager
    {"name": "Vladimir PETKOVIC", "file": "Vladimir PETKOVIC.jpg", "pos": "Manager", "age": 61, "h": "185 cm", "w": "84 kg", "club": "Algeria National Team", "league": "CAF International", "goals": 0, "caps": 12, "val": "N/A"}
]

# Copy image files and format JSON objects
copied_count = 0
algeria_json_list = []
helper_mappings = {}

for p in algeria_players_raw:
    src_file_path = os.path.join(src_dir, p["file"])
    clean_key = re.sub(r'[^a-z0-9]', '_', p["name"].lower()).strip('_')
    dest_file_name = f"alg_{clean_key}.jpg"
    dest_file_path = os.path.join(dest_dir, dest_file_name)
    
    if os.path.exists(src_file_path):
        shutil.copy2(src_file_path, dest_file_path)
        copied_count += 1
        print(f"Copied: {p['file']} -> {dest_file_name}")
    else:
        print(f"Warning: File not found {src_file_path}")
        
    img_rel_path = f"/players/{dest_file_name}"
    
    # Object for SpectatorHub PLAYER_DATABASE
    p_obj = {
        "name": p["name"],
        "code": "ALG",
        "country": "Algeria",
        "flag": "🇩🇿",
        "position": p["pos"],
        "height": p["h"],
        "weight": p["w"],
        "age": p["age"],
        "club": p["club"],
        "league": p["league"],
        "goals": p["goals"],
        "caps": p["caps"],
        "marketValue": p["val"],
        "image": img_rel_path
    }
    algeria_json_list.append(p_obj)
    
    # Mapping for playerImageHelper.js localPlayerFiles
    norm_name = p["name"].lower().replace("-", " ").strip()
    helper_mappings[norm_name] = img_rel_path
    # also mapped without accent if any
    clean_norm = re.sub(r'[^a-z0-9 ]', '', norm_name)
    if clean_norm != norm_name:
        helper_mappings[clean_norm] = img_rel_path

print(f"\nTotal images copied successfully: {copied_count}/27")

# Save outputs as temporary json for insertion
import json
with open("algeria_players.json", "w", encoding="utf-8") as f:
    json.dump(algeria_json_list, f, indent=2, ensure_ascii=False)

with open("algeria_helper_map.json", "w", encoding="utf-8") as f:
    json.dump(helper_mappings, f, indent=2, ensure_ascii=False)

print("Saved algeria_players.json & algeria_helper_map.json")
