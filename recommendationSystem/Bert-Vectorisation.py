import torch
from transformers import BertTokenizer, BertModel
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class BertEmbedding:
    def __init__(self, model_name="bert-base-uncased"):
        """
        Initialize the BERT model and tokenizer.

        :param model_name: The name of the pre-trained BERT model.
        """
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = BertModel.from_pretrained(model_name)
        self.model.eval()  # Set the model to evaluation mode (important for inference)

    def get_embedding(self, text):
        """
        Generate BERT embedding for a given text.

        :param text: The input text to generate the embedding for.
        :return: A numpy array representing the BERT embedding for the input text.
        """
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():  # Turn off gradients for inference
            outputs = self.model(**inputs)

        # Use the [CLS] token's embedding (first token) as the representation for the text
        cls_embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()

        return cls_embedding

class EventRecommendationSystem:
    def __init__(self, bert_model_name="bert-base-uncased"):
        """
        Initialize the event recommendation system with BERT for embeddings.

        :param bert_model_name: The pre-trained BERT model name.
        """
        self.bert_embedder = BertEmbedding(model_name=bert_model_name)
        self.event_embeddings = {}
        self.event_ids = []

    def add_event(self, event_id, event_description):
        """
        Add an event to the recommendation system by generating its BERT embedding.

        :param event_id: The ID of the event.
        :param event_description: The description of the event (text).
        """
        embedding = self.bert_embedder.get_embedding(event_description)
        self.event_embeddings[event_id] = embedding
        self.event_ids.append(event_id)

    def recommend_events(self, query_description, num_recommendations=5):
        """
        Recommend events based on a query description by comparing the query embedding to stored event embeddings.

        :param query_description: The description or profile text for which we want to find similar events.
        :param num_recommendations: The number of recommended events to return.
        :return: List of event IDs of the most similar events.
        """
        query_embedding = self.bert_embedder.get_embedding(query_description)

        # Calculate cosine similarity between query embedding and event embeddings
        similarities = []
        for event_id, event_embedding in self.event_embeddings.items():
            similarity = cosine_similarity([query_embedding], [event_embedding])[0][0]
            similarities.append((event_id, similarity))

        # Sort by similarity in descending order and return the top N
        similarities.sort(key=lambda x: x[1], reverse=True)

        recommended_events = [event_id for event_id, _ in similarities[:num_recommendations]]
        return recommended_events
