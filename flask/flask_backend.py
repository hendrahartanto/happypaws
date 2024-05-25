from tensorflow.keras.models import load_model
from flask_cors import CORS
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import io
import tensorflow as tf

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

model = load_model('./alexnet_model/model.h5')

@app.route('/predict', methods=['POST'])
def predict():
  file = request.files['image']

  try :
    img = Image.open(io.BytesIO(file.read())).convert('RGB')
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array /= 255.0
    img_array = np.expand_dims(img_array, axis=0)
    prediction = model.predict([img_array])

    print(prediction)
    max_predict = int(np.argmax(prediction))
    print(max_predict)
    return jsonify({'prediction': max_predict})
  
  except Exception as e:
    return jsonify({'error': str(e)})

if __name__ == '__main__':
  app.run(port=9999, debug=True)