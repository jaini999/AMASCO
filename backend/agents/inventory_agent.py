import json
from pathlib import Path

class InventoryAgent:
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)

    def get_inventory(self):
        with open(self.data_path, 'r') as f:
            return json.load(f) 