from agents.inventory_agent import InventoryAgent
import time
import threading
import json
from datetime import datetime

INVENTORY_PATH = 'data/inventory.json'
LOGS_PATH = 'data/logs.json'

class Simulator:
    def __init__(self):
        self.inventory_agent = InventoryAgent(INVENTORY_PATH)
        self.paused = False
        self.running = True
        self.loop_thread = threading.Thread(target=self.run_loop)

    def start(self):
        print('Starting simulation loop. Press Ctrl+C to stop.')
        self.loop_thread.start()

    def run_loop(self):
        while self.running:
            if not self.paused:
                self.simulation_step()
            time.sleep(2)

    def simulation_step(self):
        # Example: Check inventory and log a placeholder action
        inventory = self.inventory_agent.get_inventory()
        for store, data in inventory.items():
            if data['stock'] < data['threshold']:
                self.log_action('InventoryAgent', 'restock_check', store, f'Stock at {store} is low ({data["stock"]} < {data["threshold"]})')

    def log_action(self, agent, action, target, explanation):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'agent': agent,
            'action': action,
            'target': target,
            'details': explanation,
            'explanation': explanation
        }
        try:
            with open(LOGS_PATH, 'r+') as f:
                logs = json.load(f)
                logs.append(log_entry)
                f.seek(0)
                json.dump(logs, f, indent=2)
                f.truncate()
        except Exception as e:
            print(f'Error logging action: {e}')

    def pause(self):
        self.paused = True
        print('Simulation paused.')

    def resume(self):
        self.paused = False
        print('Simulation resumed.')

    def stop(self):
        self.running = False
        self.loop_thread.join()
        print('Simulation stopped.')

if __name__ == '__main__':
    sim = Simulator()
    try:
        sim.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sim.stop() 