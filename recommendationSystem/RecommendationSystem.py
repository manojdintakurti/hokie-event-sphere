import random
import numpy as np
from annoy import AnnoyIndex
import pickle

class EventRecommendationSystem:
    def __init__(self, num_features=100, num_trees=10):
        """
        Initializes the recommendation system with Annoy.

        :param num_features: Number of features in each event vector (embedding size).
        :param num_trees: Number of trees to use in Annoy for building the index. More trees -> higher accuracy.
        """
        self.num_features = num_features
        self.num_trees = num_trees
        self.event_index = AnnoyIndex(num_features, 'angular')
        self.event_embeddings = {}
        self.event_ids = []

    def generate_random_embeddings(self, num_events):
        """
        Generates random embeddings for events. Replace this with your actual event feature vector generation logic.

        :param num_events: The number of events to generate embeddings for.
        """
        self.event_embeddings = {}
        self.event_ids = []
        for event_id in range(num_events):
            # Random embeddings for now, replace with actual feature extraction logic
            embedding = np.random.rand(self.num_features).tolist()
            self.event_embeddings[event_id] = embedding
            self.event_ids.append(event_id)

            # Add to the Annoy index
            self.event_index.add_item(event_id, embedding)

    def build_index(self):
        """
        Builds the Annoy index with the given number of trees.
        """
        print("Building the Annoy index with {} trees...".format(self.num_trees))
        self.event_index.build(self.num_trees)
        print("Annoy index built successfully.")

    def save_index(self, file_path):
        """
        Saves the Annoy index to a file.

        :param file_path: The path to save the index.
        """
        self.event_index.save(file_path)
        print(f"Annoy index saved to {file_path}.")

    def load_index(self, file_path):
        """
        Loads the Annoy index from a file.

        :param file_path: The path of the saved index.
        """
        self.event_index.load(file_path)
        print(f"Annoy index loaded from {file_path}.")

    def get_nearest_neighbors(self, event_id, num_neighbors=5):
        """
        Finds the nearest neighbors for a given event using the Annoy index.

        :param event_id: The ID of the event to find neighbors for.
        :param num_neighbors: The number of nearest neighbors to return.
        :return: A list of event IDs of the nearest neighbors.
        """
        if event_id not in self.event_embeddings:
            print(f"Event ID {event_id} not found.")
            return []

        print(f"Finding nearest neighbors for event ID {event_id}...")
        nearest_neighbors = self.event_index.get_nns_by_item(event_id, num_neighbors)
        return nearest_neighbors

    def recommend_events(self, user_profile, num_recommendations=5):
        """
        Recommends events based on user profile. For simplicity, this function compares user profile with event embeddings.

        :param user_profile: User profile vector (embedding).
        :param num_recommendations: Number of event recommendations to return.
        :return: List of recommended event IDs.
        """
        recommended_events = []

        # Use Annoy to find the nearest neighbors for the user profile
        nearest_neighbors = self.event_index.get_nns_by_vector(user_profile, num_recommendations)

        for event_id in nearest_neighbors:
            recommended_events.append(event_id)

        return recommended_events

    def simulate_user_profile(self):
        """
        Simulates a user profile vector (this can be based on event history, clicks, or interests).
        Replace this with actual logic to build user profiles based on user behavior or activity.
        """
        # Simulated user profile based on random features
        return np.random.rand(self.num_features).tolist()


if __name__ == "__main__":
    # Initialize the recommendation system
    recommender = EventRecommendationSystem(num_features=100, num_trees=10)

    # Simulate event embeddings for 1000 events
    recommender.generate_random_embeddings(num_events=1000)

    # Build the Annoy index
    recommender.build_index()

    # Save the index to disk
    recommender.save_index('event_index.annoy')

    # Simulate a user profile (based on behavior or preferences)
    user_profile = recommender.simulate_user_profile()

    # Recommend events for the user
    recommended_events = recommender.recommend_events(user_profile, num_recommendations=5)

    print("Recommended Events:", recommended_events)

    # Load the saved index and find the nearest neighbors for an event
    recommender.load_index('event_index.annoy')
    nearest_neighbors = recommender.get_nearest_neighbors(event_id=10, num_neighbors=5)
    print("Nearest Neighbors for Event 10:", nearest_neighbors)
