import json
from pathlib import Path

class InventoryAgent:
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)

    def get_inventory(self):
        with open(self.data_path, 'r') as f:
            return json.load(f)

    def restock_if_needed(self):
        inventory = self.get_inventory()
        restock_actions = []
        updated = False
        for store, data in inventory.items():
            if data['stock'] < data['threshold']:
                restock_amount = data['threshold'] - data['stock']
                inventory[store]['stock'] = data['threshold']
                restock_actions.append({
                    'store': store,
                    'restock_amount': restock_amount,
                    'new_stock': data['threshold'],
                    'threshold': data['threshold']
                })
                updated = True
        if updated:
            with open(self.data_path, 'w') as f:
                json.dump(inventory, f, indent=2)
        return restock_actions 