# If you see linter errors for 'fastapi', make sure to install it with: pip install fastapi uvicorn
from fastapi import FastAPI, BackgroundTasks, Request
from agents.inventory_agent import InventoryAgent
import json
from pathlib import Path
from main import Simulator
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INVENTORY_PATH = 'data/inventory.json'
ROUTES_PATH = 'data/routes.json'
DISRUPTIONS_PATH = 'data/disruptions.json'
LOGS_PATH = 'data/logs.json'
ALL_POSSIBLE_ROUTES = [f'Route {i}' for i in range(1, 10)]

inventory_agent = InventoryAgent(INVENTORY_PATH)
sim = Simulator()
sim.start()

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

@app.post('/trigger-disruption')
def trigger_disruption():
    import random
    if random.random() < 0.5:
        # Inventory disruption: lower stock at a random store
        inventory = inventory_agent.get_inventory()
        stores = list(inventory.keys())
        if not stores:
            return {"status": "no_stores"}
        store = random.choice(stores)
        current_stock = inventory[store]['stock']
        if current_stock == 0:
            return {"status": "store_already_empty", "store": store}
        lower_by = random.randint(2, 5)
        new_stock = max(0, current_stock - lower_by)
        inventory[store]['stock'] = new_stock
        with open(INVENTORY_PATH, 'w') as f:
            json.dump(inventory, f, indent=2)
        sim.log_action('DisruptionAgent', 'inventory_disruption', store, f"Lowered stock at {store} by {current_stock - new_stock} units (new stock: {new_stock})")
        return {"status": "ok", "disruption": {"type": "inventory", "store": store, "lowered_by": current_stock - new_stock, "new_stock": new_stock}}
    else:
        disruption = sim.disruption_agent.add_disruption(ALL_POSSIBLE_ROUTES)
        if disruption:
            sim.log_action('DisruptionAgent', 'add_disruption', disruption['location'], f'Added {disruption["type"]} disruption at {disruption["location"]} (severity: {disruption["severity"]})')
            return {"status": "ok", "disruption": disruption}
        return {"status": "no_available_route"}

@app.post('/fast-forward')
def fast_forward(request: Request, background_tasks: BackgroundTasks):
    async def do_fast_forward():
        data = await request.json()
        n = data.get('n', 5)
        for _ in range(n):
            sim.simulation_step()
    background_tasks.add_task(do_fast_forward)
    return {"status": "fast_forwarding"}

@app.post('/pause')
def pause():
    if sim.paused:
        sim.resume()
        return {"status": "resumed"}
    else:
        sim.pause()
        return {"status": "paused"} 