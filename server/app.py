from flask import Flask, request, jsonify, make_response
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
import re


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
        return make_response([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
        } for user in users])

class SingleUser(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return make_response({
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

        return make_response({
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

        return make_response({'message': 'User deleted successfully'})

class RegisterUser(Resource):
    def post(self):
        data = request.get_json()

        if not data.get('username') or not data.get('email') or not data.get('password'):
            return make_response({'error': 'Missing required fields'}, 400)

        email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.match(email_regex, data['email']):
            return make_response({'error': 'Invalid email address'}, 400)

        if User.query.filter_by(email=data['email']).first():
            return make_response({'error': 'Email address already in use'}, 400)

        if User.query.filter_by(username=data['username']).first():
            return make_response({'error': 'Username already in use'}, 400)

        if len(data['password']) < 8:
            return make_response({'error': 'Password must be at least 8 characters long'}, 400)

        hashed_password = generate_password_hash(data['password'])

        new_user = User(
            username=data['username'],
            email=data['email'],
            _password_hash=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return make_response({
            'message': 'User created successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
            }
        }, 201)

# ------------------- Mood API -------------------

class MoodList(Resource):
    def get(self):
        moods = Mood.query.all()
        return make_response([{
            'id': mood.id,
            'feeling_name': mood.feeling_name,
            'description': mood.description,
            'user_id': mood.user_id,
        } for mood in moods])

class SingleMood(Resource):
    def get(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        return make_response({
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

        return make_response({
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

        return make_response({'message': 'Mood deleted successfully'})  

# ------------------- Place API -------------------

class PlaceList(Resource):
    def get(self):
        places = Place.query.all()
        return make_response([{
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

        return make_response({
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
        return make_response({
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

        return make_response({
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

        return make_response({'message': 'Place deleted successfully'})
    
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

        return make_response([{
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

        return make_response([{
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
        return make_response([{
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

        return make_response({
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
        return make_response({
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

        return make_response({
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

        return make_response({'message': 'Location deleted successfully'})

# ------------------- Favorite API -------------------

# class FavoriteList(Resource):
#     def get(self):
#         # If you want to fetch all global favorites as well as user-specific ones, just query them all
#         favorites = Favorite.query.all()
        
#         return make_response([{
#             'id': favorite.id,
#             'user_id': favorite.user_id,
#             'place_id': favorite.place_id,
#             'created_at': favorite.created_at.isoformat(),
#         } for favorite in favorites])

#     def post(self):
#         data = request.get_json()

#         # If user_id is provided, use it, otherwise save as a global favorite
#         user_id = data.get('user_id', None)  # Global if user_id is None
#         place_id = data['place_id']

#         # Check if the favorite already exists for the user or globally
#         existing_favorite = Favorite.query.filter_by(user_id=user_id, place_id=place_id).first()
#         if existing_favorite:
#             return make_response({
#                 'message': 'Place is already in favorites for this user or globally'
#             }, 400)

#         # Add the new favorite (user-specific or global)
#         new_favorite = Favorite(
#             user_id=user_id,  # This will be None for global favorites
#             place_id=place_id
#         )

#         db.session.add(new_favorite)
#         db.session.commit()

#         return make_response({
#             'message': 'Favorite added successfully',
#             'favorite': {
#                 'id': new_favorite.id,
#                 'user_id': new_favorite.user_id,
#                 'place_id': new_favorite.place_id,
#                 'created_at': new_favorite.created_at.isoformat(),
#             }
#         }, 201)


class SingleFavorite(Resource):
    def get(self, favorite_id):
        favorite = Favorite.query.get_or_404(favorite_id)
        return make_response({
            'id': favorite.id,
            'user_id': favorite.user_id,
            'place_id': favorite.place_id,
            'created_at': favorite.created_at.isoformat(),
        })

    def delete(self, favorite_id):
        favorite = Favorite.query.get_or_404(favorite_id)
        db.session.delete(favorite)
        db.session.commit()

        return make_response({'message': 'Favorite deleted successfully'})

    
class AddToFavorites(Resource):
    def post(self):
        try:
            data = request.get_json()

            place_id = data.get('place_id')

            if not place_id:
                return make_response({'error': 'Missing user_id or place_id'}, 400)

            # Check if the user and place exist
            place = Place.query.get(place_id)
            if not place:
                return make_response({'error': 'User or place not found'}, 404)

            # Check if the place is already in the favorites
            existing_favorite = Favorite.query.filter_by( place_id=place_id).first()
            if existing_favorite:
                return make_response({'message': 'Place already in favorites'}, 200)

            # Add the place to favorites
            new_favorite = Favorite(place_id=place_id)
            db.session.add(new_favorite)
            db.session.commit()

            return make_response({'message': 'Place added to favorites'}, 201)

        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            # Log the exception for debugging
            print(f"Exception occurred: {e}")
            return make_response({'error': 'Failed to add place to favorites'}, 500)

class UserFavorites(Resource):
    def get(self, user_id):
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        favorite_places = [{
            'id': favorite.place.id,
            'name': favorite.place.name,
            'description': favorite.place.description,
            'image': favorite.place.image
        } for favorite in favorites]
        return make_response(favorite_places)
    
class GetFavorites(Resource):
    def get(self):
        favorites = Favorite.query.all()
        favorite_places = [favorite.place for favorite in favorites]  
        
        if not favorite_places:
            return make_response({"message": "No favorite places found"}, 404)
        
        # Assuming the Place model has a serialize method
        return make_response([place.serialize() for place in favorite_places], 200)

class RemoveFromFavorites(Resource):
    def delete(self):
        data = request.get_json()
        place_id = data.get('place_id')

        if not place_id:
            return make_response({'error': 'Missing place_id'}, 400)

        # Find the favorite entry
        favorite = Favorite.query.filter_by(place_id=place_id).first()
        if not favorite:
            return make_response({'error': 'Place not in favorites'}, 404)

        # Remove the entry
        db.session.delete(favorite)
        db.session.commit()

        return make_response({'message': 'Place removed from favorites'}, 200)

    
class AddGlobalFavorite(Resource):
    def post(self):
        data = request.get_json()
        place_id = data.get('place_id')
        
        if not place_id:
            return make_response({"error": "Place ID is required"}, 400)
        
        # Check if the favorite already exists globally (with user_id=None)
        existing_favorite = Favorite.query.filter_by(place_id=place_id, user_id=None).first()
        if existing_favorite:
            return make_response({"message": "Place is already in global favorites"}, 400)
        
        # Create a new favorite with user_id=None (global favorite)
        favorite = Favorite(place_id=place_id, user_id=None, created_at=datetime.utcnow())
        db.session.add(favorite)
        db.session.commit()
        
        return make_response({"message": "Place added to global favorites"}, 201)

# Route to get all global favorites (those without a user_id)
class GetGlobalFavorites(Resource):
    def get(self):
        global_favorites = Favorite.query.filter_by(user_id=None).all()
        
        if not global_favorites:
            return make_response({"message": "No global favorite places found"}, 404)
        
        # Serialize the associated places for the global favorites
        favorite_places = [favorite.place.serialize() for favorite in global_favorites]
        return make_response(favorite_places, 200)



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

# api.add_resource(FavoriteList, '/favorites')
api.add_resource(SingleFavorite, '/favorites/<int:favorite_id>')
api.add_resource(GetFavorites, '/favorites')

api.add_resource(AddToFavorites, '/favorites/add')
# api.add_resource(GetFavorites, '/favorites/<int:user_id>')
api.add_resource(RemoveFromFavorites, '/favorites/remove')
api.add_resource(UserFavorites, '/favorites/<int:user_id>')

api.add_resource(AddGlobalFavorite, '/global_favorites/add')
api.add_resource(GetGlobalFavorites, '/global_favorites')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
