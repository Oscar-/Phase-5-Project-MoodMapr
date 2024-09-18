from app import app, db
from models import User, Favorite, Mood, Place, Location
from werkzeug.security import generate_password_hash
from datetime import datetime

def seed_database():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        db.create_all()

        # Create Locations
        location1 = Location(city_name='New York', coordinates='40.7128° N, 74.0060° W')
        location2 = Location(city_name='San Francisco', coordinates='37.7749° N, 122.4194° W')
        location3 = Location(city_name='Chicago', coordinates='41.8781° N, 87.6298° W')
        location4 = Location(city_name='Los Angeles', coordinates='34.0522° N, 118.2437° W')
        location5 = Location(city_name='Miami', coordinates='25.7617° N, 80.1918° W')

        db.session.add_all([location1, location2, location3, location4, location5])
        db.session.commit()

        # Create Users
        user1 = User(username='alice', email='alice@example.com', password=generate_password_hash('password123'))
        user2 = User(username='bob', email='bob@example.com', password=generate_password_hash('password456'))
        user3 = User(username='charlie', email='charlie@example.com', password=generate_password_hash('password789'))
        user4 = User(username='david', email='david@example.com', password=generate_password_hash('password012'))
        user5 = User(username='eve', email='eve@example.com', password=generate_password_hash('password345'))

        db.session.add_all([user1, user2, user3, user4, user5])
        db.session.commit()

        # Create Places
        place1 = Place(name='Central Park', description='A large public park in New York City.', image='central_park.jpg', link='http://centralparknyc.org', location_id=location1.id)
        place2 = Place(name='Golden Gate Bridge', description='A famous bridge in San Francisco.', image='golden_gate.jpg', link='http://goldengatebridge.org', location_id=location2.id)
        place3 = Place(name='Millennium Park', description='A large park in Chicago.', image='millennium_park.jpg', link='http://millenniumpark.org', location_id=location3.id)
        place4 = Place(name='Hollywood Sign', description='A famous landmark in Los Angeles.', image='hollywood_sign.jpg', link='http://hollywoodsign.org', location_id=location4.id)
        place5 = Place(name='South Beach', description='A popular beach in Miami.', image='south_beach.jpg', link='http://southbeach.org', location_id=location5.id)

        db.session.add_all([place1, place2, place3, place4, place5])
        db.session.commit()

        # Create Moods
        mood1 = Mood(feeling_name='Excited', description='Feeling enthusiastic and eager.', user_id=user1.id)
        mood2 = Mood(feeling_name='Relaxed', description='Feeling calm and at ease.', user_id=user2.id)
        mood3 = Mood(feeling_name='Happy', description='Feeling good and cheerful.', user_id=user3.id)
        mood4 = Mood(feeling_name='Curious', description='Eager to learn or explore.', user_id=user4.id)
        mood5 = Mood(feeling_name='Adventurous', description='Seeking new and exciting experiences.', user_id=user5.id)

        db.session.add_all([mood1, mood2, mood3, mood4, mood5])
        db.session.commit()

        # Create Favorites
        favorite1 = Favorite(user_id=user1.id, place_id=place1.id)
        favorite2 = Favorite(user_id=user2.id, place_id=place2.id)
        favorite3 = Favorite(user_id=user3.id, place_id=place3.id)
        favorite4 = Favorite(user_id=user4.id, place_id=place4.id)
        favorite5 = Favorite(user_id=user5.id, place_id=place5.id)

        db.session.add_all([favorite1, favorite2, favorite3, favorite4, favorite5])
        db.session.commit()

        # Associate Moods with Places
        mood1.places.append(place1)
        mood2.places.append(place2)
        mood3.places.append(place3)
        mood4.places.append(place4)
        mood5.places.append(place5)

        db.session.commit()

        print("Database seeded!")

if __name__ == '__main__':
    seed_database()
