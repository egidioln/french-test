import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.common.by import By
import json
import time
import random

verbLinks = []

linkRoot = "https://www.the-conjugation.com"
options = webdriver.FirefoxOptions()
options.add_argument("window-size=1280,800")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
driver = webdriver.Firefox(options=options)
driver.get(linkRoot+f"/french/verb/{verbLinks[1]}.php")
driver.find_element(By.CSS_SELECTOR, "div.sd-cmp-3V2Vm:nth-child(2) > button:nth-child(2) > span:nth-child(1)").click()
verbs = dict()
# modes = driver.find_elements(By.CLASS_NAME, "mode")

mode = None
for verbLink in verbLinks:
    driver.get(linkRoot+f"/french/verb/{verbLink}.php")
    tempsTabs = driver.find_elements(By.CSS_SELECTOR, ".mode,.tempstab")
    verbs[verbLink] = dict()
    for tempsTab in tempsTabs:
        if tempsTab.tag_name=="div":
            verbInfo = tempsTab.text.split("\n")
            verbs[verbLink][verbInfo[0]+" - "+mode] = verbInfo[1:]
        elif tempsTab.tag_name=="h2":
            mode = tempsTab.text
    time.sleep(0.5+random.random()*1)

with open('data.json', 'w') as fp:
    json.dump(verbs, fp, ensure_ascii=False)
