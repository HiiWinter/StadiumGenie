import os
import urllib.request

code_mapping = {
    "CAN": "ca", "MEX": "mx", "USA": "us",
    "ALG": "dz", "ARG": "ar", "AUS": "au", "AUT": "at", "BEL": "be", "BIH": "ba", "BRA": "br",
    "CPV": "cv", "COL": "co", "COD": "cd", "CIV": "ci", "CRO": "hr", "CUW": "cw", "CZE": "cz",
    "ECU": "ec", "EGY": "eg", "ENG": "gb-eng", "FRA": "fr", "GER": "de", "GHA": "gh", "HAI": "ht",
    "IRN": "ir", "IRQ": "iq", "JPN": "jp", "JOR": "jo", "KOR": "kr", "MAR": "ma", "NED": "nl",
    "NZL": "nz", "NOR": "no", "PAN": "pa", "PAR": "py", "POR": "pt", "QAT": "qa", "KSA": "sa",
    "SCO": "gb-sct", "SEN": "sn", "RSA": "za", "ESP": "es", "SWE": "se", "SUI": "ch", "TUN": "tn",
    "TUR": "tr", "URU": "uy", "UZB": "uz"
}

# Create public/flags/ directory if it doesn't exist
os.makedirs("public/flags", exist_ok=True)

print("Starting flag downloads...")
for fifa_code, flagcdn_code in code_mapping.items():
    url = f"https://flagcdn.com/w160/{flagcdn_code}.png"
    target_path = f"public/flags/{fifa_code.lower()}.png"
    try:
        # Set User-Agent to avoid HTTP 403 Forbidden
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response, open(target_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded flag for {fifa_code} ({flagcdn_code}) -> {target_path}")
    except Exception as e:
        # Fallback if gb-eng or gb-sct fail
        if flagcdn_code in ["gb-eng", "gb-sct"]:
            fallback_url = "https://flagcdn.com/w160/gb.png"
            try:
                fallback_req = urllib.request.Request(
                    fallback_url, 
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                )
                with urllib.request.urlopen(fallback_req) as response, open(target_path, 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Downloaded fallback flag for {fifa_code} -> {target_path}")
                continue
            except Exception as fe:
                print(f"Failed to download fallback flag for {fifa_code}: {fe}")
        print(f"Failed to download flag for {fifa_code}: {e}")

print("Flag downloading completed.")
