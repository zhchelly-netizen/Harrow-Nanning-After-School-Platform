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
        "url": "https://docs.google.com/spreadsheets/d/1ecNyQBf6AlWq0MPiz5w1-67gRI0xoBHIApHIxXr99V4/export?format=csv&gid=1896389952",
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
    for row in rows[6:]:
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

            if not home or not away or home == "Home" or away == "Away":
                continue

            # Skip placeholder teams
            placeholder_patterns = ['Winner', 'Runner-up', 'A1', 'A2', 'A3', 'A4',
                                     'B1', 'B2', 'B3', 'B4', 'QF', 'SF', 'Final']
            is_placeholder = any(p in home or p in away for p in placeholder_patterns)
            if is_placeholder:
                continue

            # Determine gender from round name
            gender = "unknown"
            if round_name:
                if "Boys" in round_name:
                    gender = "Boys"
                elif "Girls" in round_name:
                    gender = "Girls"

            # Determine match type
            match_type = "group"
            if "Quarter" in round_name:
                match_type = "quarter_final"
            elif "Semi" in round_name:
                match_type = "semi_final"
            elif "Final" in round_name and "Third" not in round_name and "Plate" not in round_name:
                match_type = "final"
            elif "Third" in round_name:
                match_type = "third_place"
            elif "Plate" in round_name:
                match_type = "plate"

            # Determine group for this match using gender-specific lookup
            # For matches with unknown gender (e.g. QF/SF), try both lookups
            if gender == "unknown":
                # Try to resolve gender by checking which lookup both teams belong to
                home_in_boys = home in team_to_group_boys
                away_in_boys = away in team_to_group_boys
                home_in_girls = home in team_to_group_girls
                away_in_girls = away in team_to_group_girls
                if home_in_boys and away_in_boys and not (home_in_girls and away_in_girls):
                    gender = "Boys"
                elif home_in_girls and away_in_girls and not (home_in_boys and away_in_boys):
                    gender = "Girls"
                elif home_in_boys or away_in_boys:
                    gender = "Boys"
                elif home_in_girls or away_in_girls:
                    gender = "Girls"
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
                "home_score": int(home_score_str) if home_score_str.isdigit() else None,
                "away_score": int(away_score_str) if away_score_str.isdigit() else None,
                "venue": f"Pitch/ Court {start//7 + 1}" if start < 35 else "TBD"
            })

    return matches


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

            all_data[key] = {
                "meta": config,
                "groups": groups,
                "matches": matches
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
