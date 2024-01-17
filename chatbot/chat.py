import torch
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
from nltk import sent_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load ClinicalBERT model and tokenizer
model_name = "emilyalsentzer/Bio_ClinicalBERT"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForQuestionAnswering.from_pretrained(model_name)

# Function to embed text using ClinicalBERT
def embed_text(text):
    inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
    outputs = model(**inputs)
    embeddings = outputs.pooler_output.squeeze().detach().numpy()
    return embeddings

# Function to calculate cosine similarity between two vectors
def cosine_similarity_score(vec1, vec2):
    vec1 = vec1.reshape(1, -1)
    vec2 = vec2.reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]

# Function to find the most similar sentence in a list
def find_most_similar(query, sentences):
    query_embedding = embed_text(query)
    sentence_embeddings = [embed_text(sentence) for sentence in sentences]
    similarity_scores = [cosine_similarity_score(query_embedding, emb) for emb in sentence_embeddings]
    max_index = np.argmax(similarity_scores)
    return sentences[max_index]

# Simple chatbot logic
def chatbot():
    print("Chatbot: Hello! I'm your ClinicalBERT-based chatbot. Ask me any medical question.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye!")
            break
        sentences = sent_tokenize(user_input)
        most_similar_sentence = find_most_similar(user_input, sentences)
        print("Chatbot:", most_similar_sentence)

# Run the chatbot
if __name__ == "__main__":
    chatbot()
