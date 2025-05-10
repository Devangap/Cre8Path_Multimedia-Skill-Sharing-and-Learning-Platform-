from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# ✅ Load dataset once
df_users = pd.read_csv("dataset_augmented.csv")
df_posts = pd.read_csv("posts.csv")
df_posts['post_profile'] = df_posts['tags'].fillna('') + ", " + df_posts['category'].fillna('') + ", " + df_posts['skillLevel'].fillna('')

@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        user_id = int(request.args.get('user_id'))
        skills = request.args.get('skills')
        interests = request.args.get('interests')

        if user_id in df_users['user_id'].values:
            user_row = df_users[df_users['user_id'] == user_id].iloc[0]
            user_profile = f"{user_row['skills']}, {user_row['interests']}"
        elif skills or interests:
            user_profile = f"{skills or ''}, {interests or ''}"
        else:
            user_profile = "beginner, design, video, multimedia"  # fallback default

        documents = [user_profile] + df_posts['post_profile'].tolist()
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(documents)
        similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])

        top_indices = similarity_scores.argsort()[0][::-1]
        recommended_post_ids = [int(df_posts.iloc[index]['post_id']) for index in top_indices[:5]]

        return jsonify({"recommended_post_ids": recommended_post_ids})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='localhost', port=5050, debug=True)

