#!/usr/bin/env python3
"""
Harrow Games Live Scraper
Fetches match data from Google Sheets CSV exports and saves as structured JSON.
"""
import csv
import json
import urllib.request
import os
import re
import ssl
from datetime import datetime

SHEETS = {
    "day2_u12": {
        "url": "https://docs.google.com/spreadsheets/d/1ecNyQBf6AlWq0MPiz5w1-67gRI0xoBHIApHIxXr99V4/export?format=csv&gid=829402849",
        "sport": "football",
        "age": "U12",
        "day": "Day 2",
        "date": "2025-06-05"
    },
    "day2_u14": {
        "url": "https://docs.google.com/spreadsheets/d/1ecNyQBf6AlWq0MPiz5w1-67gRI0xoBHIApHIxXr99V4/export?format=csv&gid=1250535933",
        "sport": "basketball",
        "age": "U14",
        "day": "Day 2",
        "date": "2025-06-05"
    },
    "day3_u12": {
        "url": "https://docs.google.com/spreadsheets/d/1ecNyQBf6AlWq0MPiz5w1-67gRI0xoBHIApHIxXr99V4/export?format=csv&gid=1031608088",
        "sport": "basketball",
        "age": "U12",
        "day": "Day 3",
        "date": "2025-06-06"
    },
    "day3_u14": {
        "url": "https://docs.google.com/spreadsheets/d/1ecNyQBf6AlWq0MPiz5w1-67gRI0xoBHIApHIxXr99V4/export?format=csv&gid=1340168278",
        "sport": "football",
        "age": "U14",
        "day": "Day 3",
        "date": "2025-06-06"
    }
}


def fetch_csv(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0'
    })
    with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
        return response.read().decode('utf-8')


def parse_groups(rows):
    """Extract both Boys and Girls group composition from header rows."""
    groups = {}
    for row in rows[:6]:
        text = row[0] if row else ""
        # Boys Group A / B
        if "Boys Group A:" in text:
            teams = text.split(":")[1].strip().split(" | ")
            groups["Boys-A"] = [t.strip() for t in teams]
        elif "Boys Group B:" in text:
            teams = text.split(":")[1].strip().split(" | ")
            groups["Boys-B"] = [t.strip() for t in teams]
        # Girls Group A / B (4+ teams per group)
        elif "Girls Group A:" in text:
            teams = text.split(":")[1].strip().split(" | ")
            groups["Girls-A"] = [t.strip() for t in teams]
        elif "Girls Group B:" in text:
            teams = text.split(":")[1].strip().split(" | ")
            groups["Girls-B"] = [t.strip() for t in teams]
        # Girls Group: single round-robin (7 teams)
        elif "Girls Group:" in text and "Girls Group A" not in text and "Girls Group B" not in text:
            teams = text.split(":")[1].strip().split(" | ")
            groups["Girls-Single"] = [t.strip() for t in teams]
    return groups


def parse_matches(csv_text, groups, meta):
    """Parse matches from CSV text, properly assigning gender and group."""
    reader = csv.reader(csv_text.splitlines())
    rows = list(reader)

    if len(rows) < 7:
        return []

    # Build separate team->group lookups per gender to avoid cross-gender collisions
    # e.g. "Bangkok" appears in both Boys-B and Girls-Single
    team_to_group_boys = {}
    team_to_group_girls = {}
    for gname, teams in groups.items():
        if gname.startswith("Boys-"):
            for team in teams:
                team_to_group_boys[team] = gname
        elif gname.startswith("Girls-"):
            for team in teams:
                team_to_group_girls[team] = gname

    matches = []
    for ri, row in enumerate(rows[6:]):
        row_num = ri + 7  # 1-indexed row number in original spreadsheet (data starts at row 7)
        for start in [0, 7, 14, 21, 28, 35]:
            if len(row) <= start + 6:
                continue
            block = row[start:start+7]
            round_name = block[0].strip() if len(block) > 0 else ""
            ko = block[2].strip() if len(block) > 2 else ""
            home = block[3].strip() if len(block) > 3 else ""
            home_score_str = block[4].strip() if len(block) > 4 else ""
            away_score_str = block[5].strip() if len(block) > 5 else ""
            away = block[6].strip() if len(block) > 6 else ""

            # Parse scores - handle "0win pens", "0-0win pens", etc.
            def _parse_score(s):
                s = s.strip()
                if not s:
                    return None, False
                m = re.match(r'^(\d+)', s)
                if m:
                    return int(m.group(1)), ('pen' in s.lower() or 'win' in s.lower())
                return None, False

            home_score, home_pen = _parse_score(home_score_str)
            away_score, away_pen = _parse_score(away_score_str)
            is_penalty = home_pen or away_pen

            # Determine match type from round_name FIRST (needed before skip logic)
            match_type = "group"
            if "9th" in round_name.lower():
                match_type = "9th_place"
            elif "Quarter" in round_name:
                match_type = "quarter_final"
            elif "Plate" in round_name and "Semi" in round_name:
                match_type = "plate_semi_final"
            elif "Plate" in round_name and "Third" in round_name:
                match_type = "plate_third_place"
            elif "Plate" in round_name and "Final" in round_name:
                match_type = "plate_final"
            elif "Semi" in round_name and "Plate" not in round_name:
                match_type = "semi_final"
            elif "Third" in round_name and "Plate" not in round_name:
                match_type = "third_place"
            elif "Final" in round_name and "Plate" not in round_name:
                match_type = "final"

            # Skip empty rows or header rows, but keep knockout matches even without team names
            if not home or not away or home == "Home" or away == "Away":
                if match_type == 'group':
                    continue
                # For knockout matches with empty teams, use TBD placeholder
                if not home:
                    home = "TBD"
                if not away:
                    away = "TBD"

            # Determine gender from round name first
            gender = "unknown"

            if round_name:
                if "Boys" in round_name:
                    gender = "Boys"
                elif "Girls" in round_name:
                    gender = "Girls"

            # Determine gender: round_name > row parity > team lookup
            if gender == "unknown":
                # Row parity: even = Boys, odd = Girls (row_num is 1-indexed from row 7)
                # In the CSV, rows alternate: Girls odd rows, Boys even rows
                actual_row = ri  # 0-indexed from data start (row 6 in CSV = ri=0)
                if actual_row % 2 == 1:  # ri=1,3,5... = odd CSV data rows = Boys
                    gender = "Boys"
                else:  # ri=0,2,4... = even CSV data rows = Girls
                    gender = "Girls"

            # Verify with team lookup if possible (override parity only if both teams unambiguously belong to one gender)
            if gender == "unknown" or True:  # Always verify
                home_in_boys = home in team_to_group_boys
                away_in_boys = away in team_to_group_boys
                home_in_girls = home in team_to_group_girls
                away_in_girls = away in team_to_group_girls
                # If both teams are ONLY in one gender's lookup, use that
                if home_in_girls and away_in_girls and not (home_in_boys and away_in_boys):
                    gender = "Girls"
                elif home_in_boys and away_in_boys and not (home_in_girls and away_in_girls):
                    gender = "Boys"
                # If ambiguous, keep the parity-based result
            lookup = team_to_group_boys if gender == "Boys" else team_to_group_girls
            match_group = lookup.get(home) or lookup.get(away)

            matches.append({
                "round": round_name,
                "ko": ko,
                "home": home,
                "away": away,
                "gender": gender,
                "type": match_type,
                "group": match_group,  # e.g. "Boys-A", "Girls-Single", etc.
                "home_score": home_score,
                "away_score": away_score,
                "is_penalty": is_penalty,
                "venue": f"Pitch/ Court {start//7 + 1}" if start < 35 else "TBD"
            })

    return matches


def extract_official_ranking(matches, groups):
    """Extract official team rankings from SF/Plate match data.
    CSV authors pre-fill SF/Plate matches with correct team names based on official ranking.
    E.g. "Semi Final 1(A1 v B2)" with home=Bangkok, away=Beijing means A1=Bangkok.
    """
    ranking = {}  # e.g. {"Boys-A": ["Bangkok", "Shanghai", "London", "Nanning", "Appi"]}
    
    for gender in ["Boys", "Girls"]:
        for group_letter in ["A", "B"]:
            gk = f"{gender}-{group_letter}"
            if gk not in groups:
                continue
            # Find SF matches that reveal A1-A5 or B1-B5
            # For Boys (no QF): SF1(A1vB2), SF2(B1vA2), PlateSF1(A3vB4), PlateSF2(B3vA4), 9th(A5vB5)
            # For Girls (has QF): QF1(A1vB4), QF2(A2vB3), QF3(B1vA4), QF4(B2vA3)
            pass
    
    # Extract from SF/Plate matches
    for m in matches:
        if m['type'] not in ('semi_final', 'quarter_final', '9th_place'):
            continue
        rn = m.get('round', '')
        home = m.get('home', '')
        away = m.get('away', '')
        gender = m.get('gender', '')
        if not home or not away or not gender:
            continue
        
        # Parse the bracket position from round name
        # Boys SF: "Semi Final 1(A1 v B2)" -> A1=home, B2=away
        # Boys SF: "Semi Final 2(B1 v A2)" -> B1=home, A2=away
        # Boys Plate: "Plate Semi Final 1(A3 v B4)" -> A3=home, B4=away
        # Boys Plate: "Plate Semi Final 2(B3 v A4)" -> B3=home, A4=away
        # 9th: "9th Place Play OffA5 v B5" -> A5=home, B5=away
        # Girls QF: "Quarter Finals 1 (A1vB4)" -> A1=home, B4=away
        # Girls QF: "Quarter Finals 2 (A2vB3)" -> A2=home, B3=away
        # Girls QF: "Quarter Finals 3 (B1vA4)" -> B1=home, A4=away
        # Girls QF: "Quarter Finals 4 (B2vA3)" -> B2=home, A3=away
        
        import re
        # Match patterns like "A1", "B2", "A3", etc.
        positions = re.findall(r'([AB])(\d)', rn)
        if len(positions) >= 2:
            pos1, pos2 = positions[0], positions[1]
            # pos1 corresponds to home team, pos2 to away team
            group1 = f"{gender}-{pos1[0]}"
            rank1 = int(pos1[1])
            group2 = f"{gender}-{pos2[0]}"
            rank2 = int(pos2[1])
            
            if group1 not in ranking:
                ranking[group1] = {}
            if group2 not in ranking:
                ranking[group2] = {}
            
            ranking[group1][rank1] = home
            ranking[group2][rank2] = away
    
    # Convert to ordered lists
    result = {}
    for gk, pos_map in ranking.items():
        if gk not in groups:
            continue
        ordered = [pos_map.get(i, '') for i in range(1, max(pos_map.keys())+1)]
        # Only use if we have all positions filled
        if all(ordered):
            result[gk] = ordered
    
    return result


def main():
    all_data = {}

    for key, config in SHEETS.items():
        print(f"Fetching {key}...")
        try:
            csv_text = fetch_csv(config["url"])
            reader = csv.reader(csv_text.splitlines())
            rows = list(reader)

            groups = parse_groups(rows)
            matches = parse_matches(csv_text, groups, config)
            official_ranking = extract_official_ranking(matches, groups)

            all_data[key] = {
                "meta": config,
                "groups": groups,
                "matches": matches,
                "official_ranking": official_ranking
            }
            print(f"  -> {len(matches)} matches, groups: {list(groups.keys())}")
        except Exception as e:
            print(f"  -> ERROR: {e}")
            all_data[key] = {"meta": config, "groups": {}, "matches": [], "error": str(e)}

    output_path = os.path.join(os.path.dirname(__file__), "..", "data", "harrow-games-data.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print(f"\nSaved to {output_path}")
    return all_data


if __name__ == "__main__":
    main()
