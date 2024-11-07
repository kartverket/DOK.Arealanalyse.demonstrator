from typing import List


def get_dataset_quality_measurements(config: dict, context: str) -> List[dict]:
    dataset_qms = [value for _, value in config.items()
                   if value['type'] == 'dataset']

    warnings = []

    for qm in dataset_qms:
        threshold_values = get_threshold_values(qm)
        
        print(threshold_values)
        # should_warn = any(entry[prop]for entry in data if any(
        #     value for value in threshold_values if value == entry[prop]))

        # if should_warn:
        #     warnings.append({
        #         'id': qm['quality_dimension_id'],
        #         'name': qm['quality_dimension_name'],
        #         'message': qm['quality_warning_text']
        #     })

    return warnings


def get_object_quality_measurements(config: dict, data: List[dict]) -> List[dict]:
    object_qms = [value for _, value in config.items()
                  if value['type'] == 'object']

    warnings = []

    for qm in object_qms:
        prop = qm['property']
        threshold_values = get_threshold_values(qm)

        should_warn = any(entry[prop]for entry in data if any(
            value for value in threshold_values if value == entry[prop]))

        if should_warn:
            warnings.append({
                'id': qm['quality_dimension_id'],
                'name': qm['quality_dimension_name'],
                'message': qm['quality_warning_text']
            })

    return warnings


def get_threshold_values(quality_measurement: dict) -> List[str]:
    threshold: str = quality_measurement['warning_threshold']
    values = [value.strip() for value in threshold.split('|')]

    return values
