import random
import numpy as np
import math

class AnnoyTree:
    def __init__(self, data, num_features, num_trees, depth=0):
        self.num_features = num_features
        self.num_trees = num_trees
        self.depth = depth
        self.data = data
        self.left = None
        self.right = None
        self.split_dimension = None
        self.split_value = None
        self.children = []

        # Base case for the recursion, leaf node
        if len(data) <= 1 or self.depth >= num_trees:
            self.children = data
        else:
            self._build_tree()

    def _build_tree(self):
        # Randomly pick a dimension to split along
        self.split_dimension = random.randint(0, self.num_features - 1)

        # Randomly pick a split value
        all_values = [point[self.split_dimension] for point in self.data]
        self.split_value = random.choice(all_values)

        # Split the data into two parts: less than split_value and greater than split_value
        left_data = [point for point in self.data if point[self.split_dimension] <= self.split_value]
        right_data = [point for point in self.data if point[self.split_dimension] > self.split_value]

        # Recursively build subtrees
        self.left = AnnoyTree(left_data, self.num_features, self.num_trees, self.depth + 1)
        self.right = AnnoyTree(right_data, self.num_features, self.num_trees, self.depth + 1)

    def search(self, query, num_neighbors, candidates=None):
        if candidates is None:
            candidates = self.data

        if self.depth >= self.num_trees or not self.left or not self.right:
            return self._search_leaf(query, candidates, num_neighbors)

        # Determine which subtree the query is likely to belong to
        if query[self.split_dimension] <= self.split_value:
            return self.left.search(query, num_neighbors, candidates)
        else:
            return self.right.search(query, num_neighbors, candidates)

    def _search_leaf(self, query, candidates, num_neighbors):
        distances = []
        for point in candidates:
            dist = np.linalg.norm(np.array(query) - np.array(point))
            distances.append((point, dist))

        distances.sort(key=lambda x: x[1])

        return [point for point, _ in distances[:num_neighbors]]

class Annoy:
    def __init__(self, num_features, num_trees=10):
        self.num_features = num_features
        self.num_trees = num_trees
        self.trees = []
        self.data = {}
        self.index = {}

    def add_item(self, item_id, item_vector):
        self.data[item_id] = item_vector
        self.index[item_id] = len(self.data) - 1  # Track index for quick lookup

    def build(self):
        num_points = len(self.data)
        data_list = list(self.data.values())

        # Build multiple trees, each with a subset of data
        for _ in range(self.num_trees):
            random.shuffle(data_list)
            tree = AnnoyTree(data_list, self.num_features, self.num_trees)
            self.trees.append(tree)

    def get_nns_by_item(self, item_id, num_neighbors):
        if item_id not in self.data:
            raise ValueError(f"Item ID {item_id} not found.")

        query = self.data[item_id]
        all_neighbors = []

        for tree in self.trees:
            neighbors = tree.search(query, num_neighbors)
            all_neighbors.extend(neighbors)

        # Remove duplicates and sort by distance
        all_neighbors = list(set(all_neighbors))
        distances = [(point, np.linalg.norm(np.array(query) - np.array(point))) for point in all_neighbors]
        distances.sort(key=lambda x: x[1])

        return [point for point, _ in distances[:num_neighbors]]

    def get_nns_by_vector(self, query_vector, num_neighbors):
        all_neighbors = []

        for tree in self.trees:
            neighbors = tree.search(query_vector, num_neighbors)
            all_neighbors.extend(neighbors)

        # Remove duplicates and sort by distance
        all_neighbors = list(set(all_neighbors))
        distances = [(point, np.linalg.norm(np.array(query_vector) - np.array(point))) for point in all_neighbors]
        distances.sort(key=lambda x: x[1])

        return [point for point, _ in distances[:num_neighbors]]
