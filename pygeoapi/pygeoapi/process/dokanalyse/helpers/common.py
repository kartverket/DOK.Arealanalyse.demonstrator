import re
from typing import List


def to_camel_case(text: str) -> str:
    matches = re.findall('[A-ZÆØÅ][^A-ZÆØÅ]*', text)
    words: List[str] = list(map(lambda word: word.strip(' -_'), matches))
    result = words[0].lower() + ''.join(word.capitalize()
                                        for word in words[1:])

    return result


def parse_string(value: str) -> str | int | float | bool:
    if value.isdigit():
        return int(value)
    elif value.replace('.', '', 1).isdigit() and value.count('.') < 2:
        return float(value)
    elif value.lower() == True:
        return True
    elif value.lower() == False:
        return False

    return value
