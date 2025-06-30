from flask import Flask, request, jsonify
import clip
import torch
from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)

# Check for GPU, fallback to CPU
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the CLIP model and preprocessing pipeline
model, preprocess = clip.load("ViT-B/32", device=device)

@app.route('/vectorize', methods=['POST'])
def vectorize_image():
    data = request.get_json()

    # Validate input
    if not data or 'Imageurl' not in data:
        return jsonify({"error": "Missing 'image_url' in request"}), 400

    Image_url = data['Imageurl']

    try:
        # Download image from the URL
        response = requests.get(Image_url)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Unable to fetch image: {str(e)}"}), 400

    # Preprocess and encode image
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image_input)
        image_features /= image_features.norm(dim=-1, keepdim=True)

    # Convert vector to list for JSON
    vector = image_features[0].cpu().numpy().tolist()

    return jsonify({"vector": vector})


@app.route('/text-vectorize', methods=['POST'])
def vectorize_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    text = data['text'].strip()
    prompt = "a photo of a " + text
    text_tokens = clip.tokenize([prompt]).to(device)

    with torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-1, keepdim=True)

    vector = text_features[0].cpu().numpy().tolist()
    return jsonify({"vector": vector})



if __name__ == "__main__":
    app.run(debug=True, port=5001)
