"""Cron script to gather all data from the API periodically."""
import datetime
from http import HTTPStatus
import json
import logging
import os
import requests


STATES_DICT = {
    'AL': {},
    'AK': {},
    'AZ': {},
    'AR': {},
    'CA': {},
    'CO': {},
    'CT': {},
    'DC': {},
    'DE': {},
    'FL': {},
    'GA': {},
    'HI': {},
    'ID': {},
    'IL': {},
    'IN': {},
    'IA': {},
    'KS': {},
    'KY': {},
    'LA': {},
    'ME': {},
    'MD': {},
    'MA': {},
    'MI': {},
    'MN': {},
    'MS': {},
    'MO': {},
    'MT': {},
    'NE': {},
    'NV': {},
    'NH': {},
    'NJ': {},
    'NM': {},
    'NY': {},
    'NC': {},
    'ND': {},
    'OH': {},
    'OK': {},
    'OR': {},
    'PA': {},
    'RI': {},
    'SC': {},
    'SD': {},
    'TN': {},
    'TX': {},
    'UT': {},
    'VT': {},
    'VA': {},
    'WA': {},
    'WV': {},
    'WI': {},
    'WY': {},
}


def get_four_years_back():
    now = datetime.datetime.now()
    return "{},{},{},{}".format(now.year,now.year-1,now.year-2,now.year-3)


def is_float(number):
    """
    Helper function to validate whether a number
    can be represented as a float or not.
    """
    try:
        number = float(number)
    except ValueError:
        return False
    return True


def get_sums_by_state(data):
    """
    Takes the data that already exists and grabs the top 50 records. These
    are exported independently of the master dataset.
    """
    data_dict = STATES_DICT
    for record in data:
        if record["Officeholder_Jurisdiction"]["Officeholder_Jurisdiction"] not in data_dict:
            data_dict[record["Officeholder_Jurisdiction"]["Officeholder_Jurisdiction"]] = {}

        if record["Contributor"]["id"] not in data_dict[record["Officeholder_Jurisdiction"]["Officeholder_Jurisdiction"]]:
            data_dict[record["Officeholder_Jurisdiction"]["Officeholder_Jurisdiction"]][record["Contributor"]["id"]] = {
                "contributor": record["Contributor"]["Contributor"],
                "officeholder": record["Officeholder"]["Officeholder"],
                "party_contributed_to": record["Specific_Party"]["Specific_Party"],
                "officeholder_jurisdiction_contributed_to": record["Officeholder_Jurisdiction"]["Officeholder_Jurisdiction"],
                "total_money": 0.00
            }
        if is_float(record["Total_$"]["Total_$"]):
            data_dict[record["Officeholder_Jurisdiction"]["Officeholder_Jurisdiction"]][record["Contributor"]["id"]]["total_money"] += float(record["Total_$"]["Total_$"])
    state_data = {}
    temp_records = {}
    for state in data_dict:
        state_data[state] = {}
        for key, value in data_dict[state].items():
            if value["officeholder"] not in state_data[state]:
                state_data[state][value["officeholder"]] = {}
            state_data[state][value["officeholder"]][value["contributor"]] = float(str(round(value["total_money"], 2)))
    full_state_file_path = os.path.join(os.getcwd(), "src/state_data.json")
    state_file = open(full_state_file_path, "w+")
    state_file.write(json.dumps(state_data, indent=4))
    state_file.close()
    get_top_50_sums(data_dict)


def get_top_50_sums(data):
    """
    Gets top 50 data records of contributors for homepage only.
    """
    all_records = {}
    for state in data:
        for id, record in data[state].items():
            all_records[record["total_money"]] = record
    sorted_records = sorted(all_records.keys(), reverse=True)
    first_50 = []
    count = 0
    while count < 50:
        count += 1
        first_50.append(all_records[sorted_records[count]])
    full_home_file_path = os.path.join(os.getcwd(), "src/homepage_data.json")
    top_50_file = open(full_home_file_path, "w+")
    top_50_file.write(json.dumps(first_50, indent=4))
    top_50_file.close()


if __name__ == "__main__":
    logging.basicConfig(filename='get_data.log', level=logging.WARNING)
    logging.info('Starting contributions data collection')
    API_KEY = os.getenv("API_KEY", None)
    if not API_KEY:
        print("API_KEY not set!")
        logging.error("API_KEY not set!")
        exit()
    page_number = 0
    data_out = []
    years = get_four_years_back()
    # Get first batch of contributions
    first_url = "https://api.followthemoney.org/?limchk=1&" +\
        "p={page_number}&f-y={years}&d-cci=51&" +\
        "gro=law-eid,law-did,law-pt,law-s,d-eid&mode=json&" +\
        "APIKey={api_key}"
    response = requests.get(
        first_url.format(page_number=page_number, years=years, api_key=API_KEY))
    data = response.json()
    logging.info("First request came back.")
    total_pages = data["metaInfo"]["paging"]["maxPage"]
    data_out = data_out + data["records"]
    page_number += 1
    logging.info("Now beginning to parse {max} pages.".format(
        max=total_pages))
    while page_number <= total_pages:
        url = "https://api.followthemoney.org/?limchk=1&" +\
            "p={page_number}&f-y={years}&d-cci=51&" +\
            "gro=law-eid,law-did,law-pt,law-s,d-eid&mode=json&" +\
            "APIKey={api_key}"
        print("Contributors query - {page_number}/{total_pages}".format(
            page_number=page_number, years=years, total_pages=total_pages))
        processing_response = requests.get(
            url.format(page_number=page_number, api_key=API_KEY))
        if processing_response.status_code != HTTPStatus.OK:
            print(
                "Page number: {page_number} returned status {status}".format(
                    page_number=page_number,
                    status=processing_response.status_code))
            logging.warning(
                "Page number: {page_number} returned status {status}".format(
                    page_number=page_number,
                    status=processing_response.status_code))
            logging.warning(processing_response.json())
            exit()
        processing_data = processing_response.json()
        data_out = data_out + processing_data["records"]
        page_number += 1

    # Get independent expenditures
    expend_url = "https://api.followthemoney.org/?limchk=1&" +\
        "p={page_number}&f-y=2020,2019,2018,2017&d-cci=51&" +\
        "gro=law-eid,law-did,law-pt,law-s,d-eid&mode=json&" +\
        "APIKey={api_key}"
    expend_response = requests.get(
        expend_url.format(page_number=0, api_key=API_KEY))
    expend_data = expend_response.json()
    total_expend_pages = expend_data["metaInfo"]["paging"]["maxPage"]
    expend_page_number = 1
    while expend_page_number <= total_expend_pages:
        expend_url = "https://api.followthemoney.org/?limchk=1&" +\
            "p={page_number}&f-y=2020,2019,2018,2017&d-cci=51&" +\
            "gro=law-eid,law-did,law-pt,law-s,d-eid&mode=json&" +\
            "APIKey={api_key}"
        print("Expenditures query - {page_number}/{total_pages}".format(
            page_number=expend_page_number, total_pages=total_expend_pages))
        processing_response = requests.get(
            expend_url.format(page_number=expend_page_number, api_key=API_KEY))
        if processing_response.status_code != HTTPStatus.OK:
            print("Page number: {page_number} returned status {status}".format(
                page_number=page_number,
                status=processing_response.status_code))
            logging.warning(
                "Page number: {page_number} returned status {status}".format(
                    page_number=page_number,
                    status=processing_response.status_code))
            logging.warning(processing_response.json())
            exit()
        processing_data = processing_response.json()
        data_out = data_out + processing_data["records"]
        expend_page_number += 1
    get_sums_by_state(data_out)

    full_file_path = os.path.join(os.getcwd(), "src/data.json")
    file = open(full_file_path, "w+")
    file.write(json.dumps(data_out, indent=4))
    file.close()
