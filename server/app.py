from flask import Flask, request, jsonify
from extensions import db
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from models import User, Favorite, Mood, Place, Location
from datetime import datetime
from flask_migrate import Migrate
import os 
from dotenv import load_dotenv
import openai


load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
api = Api(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins


# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

class GenerateText(Resource):
    def post(self):
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return {'error': 'Prompt is required'}, 400

        try:
            # Update to use the chat model and correct API call
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Or use "gpt-4" if that's what you intend
                messages=[{"role": "user", "content": prompt}],  # Chat-based format
                max_tokens=150  # Adjust as needed
            )
            return {'text': response['choices'][0]['message']['content'].strip()}
        except Exception as e:
            return {'error': str(e)}, 500

# ------------------- User API -------------------

class UserList(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
        } for user in users])

class SingleUser(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
        })

    def patch(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()

        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user._password_hash = generate_password_hash(data['password'])

        db.session.commit()

        return jsonify({
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'})

class RegisterUser(Resource):
    def post(self):
        data = request.get_json()

        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing required fields'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email address already in use'}), 400

        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already in use'}), 400

        hashed_password = generate_password_hash(data['password'])

        new_user = User(
            username=data['username'],
            email=data['email'],
            _password_hash=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
            }
        }), 201

# ------------------- Mood API -------------------

class MoodList(Resource):
    def get(self):
        moods = Mood.query.all()
        return jsonify([{
            'id': mood.id,
            'feeling_name': mood.feeling_name,
            'description': mood.description,
            'user_id': mood.user_id,
        } for mood in moods])

class SingleMood(Resource):
    def get(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        return jsonify({
            'id': mood.id,
            'feeling_name': mood.feeling_name,
            'description': mood.description,
            'user_id': mood.user_id,
        })

    def patch(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        data = request.get_json()

        if 'feeling_name' in data:
            mood.feeling_name = data['feeling_name']
        if 'description' in data:
            mood.description = data['description']
        if 'user_id' in data:
            mood.user_id = data['user_id']

        db.session.commit()

        return jsonify({
            'message': 'Mood updated successfully',
            'mood': {
                'id': mood.id,
                'feeling_name': mood.feeling_name,
                'description': mood.description,
                'user_id': mood.user_id,
            }
        })

    def delete(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        db.session.delete(mood)
        db.session.commit()

        return jsonify({'message': 'Mood deleted successfully'})  

# ------------------- Place API -------------------

class PlaceList(Resource):
    def get(self):
        places = Place.query.all()
        return jsonify([{
            'id': place.id,
            'name': place.name,
            'description': place.description,
            'image': place.image,
            'link': place.link,
            'location_id': place.location_id,
        } for place in places])

    def post(self):
        data = request.get_json()

        new_place = Place(
            name=data['name'],
            description=data.get('description', ''),
            image=data.get('image', ''),
            link=data.get('link', ''),
            location_id=data['location_id']
        )

        db.session.add(new_place)
        db.session.commit()

        return jsonify({
            'message': 'Place created successfully',
            'place': {
                'id': new_place.id,
                'name': new_place.name,
                'description': new_place.description,
                'image': new_place.image,
                'link': new_place.link,
                'location_id': new_place.location_id,
            }
        })

class SinglePlace(Resource):
    def get(self, place_id):
        place = Place.query.get_or_404(place_id)
        return jsonify({
            'id': place.id,
            'name': place.name,
            'description': place.description,
            'image': place.image,
            'link': place.link,
            'location_id': place.location_id,
        })

    def patch(self, place_id):
        place = Place.query.get_or_404(place_id)
        data = request.get_json()

        if 'name' in data:
            place.name = data['name']
        if 'description' in data:
            place.description = data['description']
        if 'image' in data:
            place.image = data['image']
        if 'link' in data:
            place.link = data['link']
        if 'location_id' in data:
            place.location_id = data['location_id']

        db.session.commit()

        return jsonify({
            'message': 'Place updated successfully',
            'place': {
                'id': place.id,
                'name': place.name,
                'description': place.description,
                'image': place.image,
                'link': place.link,
                'location_id': place.location_id,
            }
        })

    def delete(self, place_id):
        place = Place.query.get_or_404(place_id)
        db.session.delete(place)
        db.session.commit()

        return jsonify({'message': 'Place deleted successfully'})
    
class PlacesByLocation(Resource):
    def get(self):
        city_name = request.args.get('city', '').strip().lower()  # Get the city query parameter and convert to lowercase

        if not city_name:
            return {'message': 'City parameter is required'}, 400

        # Query locations based on city_name using ilike for case-insensitive search
        location = Location.query.filter(Location.city_name.ilike(f'%{city_name}%')).first()

        if not location:
            return {'message': 'No locations found for this city'}, 404

        # Query places based on location_id
        places = Place.query.filter_by(location_id=location.id).all()

        if not places:
            return {'message': 'No places found for this location'}, 404

        return jsonify([{
            'id': place.id,
            'name': place.name,
            'description': place.description,
            'image': place.image,
            'link': place.link
        } for place in places])
    
class PlacesByMood(Resource):
    def get(self):
        mood_name = request.args.get('mood')
        if not mood_name:
            return {'message': 'Mood parameter is required'}, 400

        # Query moods based on mood_name
        mood = Mood.query.filter_by(feeling_name=mood_name).first()
        if not mood:
            return {'message': 'No mood found for this name'}, 404

        # Query places associated with the mood
        places = Place.query.join(Place.moods).filter(Mood.feeling_name == mood_name).all()

        if not places:
            return {'message': 'No places found for this mood'}, 404

        return jsonify([{
            'id': place.id,
            'name': place.name,
            'description': place.description,
            'image': place.image,
            'link': place.link
        } for place in places])

# ------------------- Location API -------------------

class LocationList(Resource):
    def get(self):
        locations = Location.query.all()
        return jsonify([{
            'id': location.id,
            'name': location.name,
            'city': location.city,
            'country': location.country,
            'latitude': location.latitude,
            'longitude': location.longitude,
        } for location in locations])

    def post(self):
        data = request.get_json()

        new_location = Location(
            name=data['name'],
            city=data['city'],
            country=data['country'],
            latitude=data['latitude'],
            longitude=data['longitude']
        )

        db.session.add(new_location)
        db.session.commit()

        return jsonify({
            'message': 'Location created successfully',
            'location': {
                'id': new_location.id,
                'name': new_location.name,
                'city': new_location.city,
                'country': new_location.country,
                'latitude': new_location.latitude,
                'longitude': new_location.longitude,
            }
        })

class SingleLocation(Resource):
    def get(self, location_id):
        location = Location.query.get_or_404(location_id)
        return jsonify({
            'id': location.id,
            'name': location.name,
            'city': location.city,
            'country': location.country,
            'latitude': location.latitude,
            'longitude': location.longitude,
        })

    def patch(self, location_id):
        location = Location.query.get_or_404(location_id)
        data = request.get_json()

        if 'name' in data:
            location.name = data['name']
        if 'city' in data:
            location.city = data['city']
        if 'country' in data:
            location.country = data['country']
        if 'latitude' in data:
            location.latitude = data['latitude']
        if 'longitude' in data:
            location.longitude = data['longitude']

        db.session.commit()

        return jsonify({
            'message': 'Location updated successfully',
            'location': {
                'id': location.id,
                'name': location.name,
                'city': location.city,
                'country': location.country,
                'latitude': location.latitude,
                'longitude': location.longitude,
            }
        })

    def delete(self, location_id):
        location = Location.query.get_or_404(location_id)
        db.session.delete(location)
        db.session.commit()

        return jsonify({'message': 'Location deleted successfully'})

# ------------------- Favorite API -------------------

class FavoriteList(Resource):
    def get(self):
        favorites = Favorite.query.all()
        return jsonify([{
            'id': favorite.id,
            'user_id': favorite.user_id,
            'place_id': favorite.place_id,
            'created_at': favorite.created_at.isoformat(),
        } for favorite in favorites])

    def post(self):
        data = request.get_json()

        new_favorite = Favorite(
            user_id=data['user_id'],
            place_id=data['place_id']
        )

        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({
            'message': 'Favorite added successfully',
            'favorite': {
                'id': new_favorite.id,
                'user_id': new_favorite.user_id,
                'place_id': new_favorite.place_id,
                'created_at': new_favorite.created_at.isoformat(),
            }
        }), 201

class SingleFavorite(Resource):
    def get(self, favorite_id):
        favorite = Favorite.query.get_or_404(favorite_id)
        return jsonify({
            'id': favorite.id,
            'user_id': favorite.user_id,
            'place_id': favorite.place_id,
            'created_at': favorite.created_at.isoformat(),
        })

    def delete(self, favorite_id):
        favorite = Favorite.query.get_or_404(favorite_id)
        db.session.delete(favorite)
        db.session.commit()

        return jsonify({'message': 'Favorite deleted successfully'})

# Add API resources to the API
api.add_resource(GenerateText, '/generate-text')

api.add_resource(UserList, '/users')
api.add_resource(SingleUser, '/users/<int:user_id>')
api.add_resource(RegisterUser, '/register')

api.add_resource(MoodList, '/moods')
api.add_resource(SingleMood, '/moods/<int:mood_id>')

api.add_resource(PlaceList, '/places')
api.add_resource(SinglePlace, '/places/<int:place_id>')


api.add_resource(LocationList, '/locations')
api.add_resource(SingleLocation, '/locations/<int:location_id>')

api.add_resource(PlacesByLocation, '/places/by_location')
api.add_resource(PlacesByMood, '/places/by_mood')

api.add_resource(FavoriteList, '/favorites')
api.add_resource(SingleFavorite, '/favorites/<int:favorite_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
