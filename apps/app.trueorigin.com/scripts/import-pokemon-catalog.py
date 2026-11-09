"""Build the text reference catalog from a PokemonTCG/pokemon-tcg-data tarball.
Usage: python3 scripts/import-pokemon-catalog.py /path/to/archive.tar.gz
Source: https://github.com/PokemonTCG/pokemon-tcg-data (English snapshot).
"""
import json
from pathlib import Path
import sys
import tarfile

output = Path(__file__).resolve().parents[1] / 'src/features/reference/pokemon-cards.json'
with tarfile.open(sys.argv[1]) as archive:
    members = archive.getmembers()
    sets = json.load(archive.extractfile(next(m for m in members if m.name.endswith('/sets/en.json'))))
    for entry in sets:
        if entry['id'] == 'base1':
            entry['name'] = 'Base Set'
    cards = []
    for member in members:
        if '/cards/en/' not in member.name or not member.name.endswith('.json') or '/v1/' in member.name:
            continue
        set_id = Path(member.name).stem
        for card in json.load(archive.extractfile(member)):
            cards.append({
                'id': card['id'], 'name': card['name'], 'setId': set_id,
                'number': card['number'], 'supertype': card['supertype'],
                'subtypes': card.get('subtypes', []), 'types': card.get('types', []),
                'hp': card.get('hp'), 'rarity': card.get('rarity'),
                'artist': card.get('artist'), 'evolvesFrom': card.get('evolvesFrom'),
                'pokemonIds': card.get('nationalPokedexNumbers', []),
            })
    result = {
        'source': 'https://github.com/PokemonTCG/pokemon-tcg-data',
        'language': 'English',
        'sets': [{k: s.get(k) for k in ['id', 'name', 'series', 'printedTotal', 'releaseDate']} for s in sets],
        'cards': cards,
    }
    assert len({c['id'] for c in cards}) == len(cards)
    assert all(c['setId'] in {s['id'] for s in sets} for c in cards)
    output.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f"Imported {len(cards)} cards across {len(sets)} sets.")
