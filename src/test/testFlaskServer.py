from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_image():
    # The JPEG data is sent as raw bytes in the body
    image_data = request.data
    if not image_data:
        return jsonify({'error': 'No image data received'}), 400
    
    try:
        # Save the image to a file
        with open('received_image.jpg', 'wb') as f:
            f.write(image_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Image received successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
