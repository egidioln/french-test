import pickle
import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.common.by import By
from selenium_stealth import stealth
import json
import time
from pathlib import Path
import random

from bs4 import BeautifulSoup

scrap = False

language = "dutch"

verb_list_path = Path(f"scrapers/{language}_verbs.txt")

verb_list = verb_list_path.read_text().split("\n")

link_root = f"https://en.bab.la/conjugation/{language}/"
if scrap:
    options = webdriver.ChromeOptions()

    options.add_argument("start-maximized")

    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    sources = {}
    for verb_link in verb_list:
        driver = webdriver.Chrome(options=options)
        stealth(driver,
                languages=["en-US", "en"],
                vendor="Google Inc.",
                platform="Win32",
                webgl_vendor="Intel Inc.",
                renderer="Intel Iris OpenGL Engine",
                fix_hairline=True,
                )
        driver.get(link_root+verb_link)
        time.sleep(1+random.random())
        sources[verb_link] = driver.page_source
        time.sleep(1+random.random())

    with open( f"{language}.pickle", "wb") as fp:
        pickle.dump(sources, fp)
else:
    with open( f"{language}.pickle", "rb") as fp:
        sources = pickle.load(fp)

verbs = dict()
for verb in verb_list:
    bs = BeautifulSoup(sources[verb], 'html.parser')
    verbs[verb] = dict()
    for div_conj_tense in bs.find_all(class_="conj-tense-block"):
        verb_tense, *conjugation = filter(None, div_conj_tense.text.split('\n'))
        verbs[verb][verb_tense] = dict(zip(conjugation[0::2], conjugation[1::2]))
    
with open(f'{language}.json', 'w') as fp:
    json.dump(verbs, fp, ensure_ascii=False, indent=4)
