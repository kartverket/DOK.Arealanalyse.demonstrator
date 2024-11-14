import re
from typing import List
from datetime import datetime, timezone


def to_camel_case(text: str) -> str:
    matches = re.findall('[A-ZÆØÅ][^A-ZÆØÅ]*', text)
    words: List[str] = list(map(lambda word: word.strip(' -_'), matches))
    result = words[0].lower() + ''.join(word.capitalize()
                                        for word in words[1:])

    return result


def parse_string(value: str) -> str | int | float | bool:
    if value is None:
        return None

    if value.isdigit():
        return int(value)
    elif value.replace('.', '', 1).isdigit() and value.count('.') < 2:
        return float(value)
    elif value.lower() == True:
        return True
    elif value.lower() == False:
        return False

    return value


def should_refresh_cache(file_path: str, cache_days: int) -> bool:
    timestamp = file_path.stat().st_mtime
    modified = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    diff = datetime.now(tz=timezone.utc) - modified

    return diff.days > cache_days


def evaluate_condition(condition: str, data: dict[str, any]) -> bool:
    parsed_condition = __parse_condition(condition)
    result = eval(parsed_condition, data.copy())

    if isinstance(result, (bool)):
        return result

    raise Exception


def __parse_condition(condition: str) -> str:
    regex = r'(?<!=|>|<)\s*=\s*(?!=)'
    condition = re.sub(regex, ' == ', condition, 0, re.MULTILINE)

    return __replace_all(
        condition, {' AND ': ' and ', ' OR ': ' or ', ' IN ': ' in ', ' NOT ': ' not '})


def __replace_all(text: str, replacements: dict) -> str:
    for i, j in replacements.items():
        text = text.replace(i, j)
    return text
