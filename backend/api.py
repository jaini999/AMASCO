# If you see linter errors for 'fastapi', make sure to install it with: pip install fastapi uvicorn
from fastapi import FastAPI
from agents.inventory_agent import InventoryAgent
import json
from pathlib import Path

app = FastAPI()

INVENTORY_PATH = 'data/inventory.json'
ROUTES_PATH = 'data/routes.json'
DISRUPTIONS_PATH = 'data/disruptions.json'
LOGS_PATH = 'data/logs.json'

inventory_agent = InventoryAgent(INVENTORY_PATH)

def read_json(path):
    with open(path, 'r') as f:
        return json.load(f)

@app.get('/inventory')
def get_inventory():
    return inventory_agent.get_inventory()

@app.get('/routes')
def get_routes():
    return read_json(ROUTES_PATH)

@app.get('/disruptions')
def get_disruptions():
    return read_json(DISRUPTIONS_PATH)

@app.get('/logs')
def get_logs():
    return read_json(LOGS_PATH) 