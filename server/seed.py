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
        location1 = Location(city_name='New York', coordinates='40.7128, -74.0060')
        location2 = Location(city_name='San Francisco', coordinates='37.7749, -122.4194')
        location3 = Location(city_name='Chicago', coordinates='41.8781, -87.6298')
        location4 = Location(city_name='Los Angeles', coordinates='34.0522, -118.2437')
        location5 = Location(city_name='Miami', coordinates='25.7617, -80.1918')


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
        place1 = Place(name='Central Park', description='A large public park in New York City.', image='https://21529231.fs1.hubspotusercontent-na1.net/hub/21529231/hubfs/Central%20Park%208%20Things%20to%20Do%20This%20Weekend%202.webp?width=920&height=599&name=Central%20Park%208%20Things%20to%20Do%20This%20Weekend%202.webp', link='http://centralparknyc.org', location_id=location1.id)
        place2 = Place(name='Golden Gate Park', description='A large urban park in San Francisco.', image='https://www.sftravel.com/sites/default/files/styles/hero/public/2022-11/conservatory-of-flowers-exterior.jpg.webp?itok=Eppm7NSA', link='http://goldengatepark.org', location_id=location2.id)
        place3 = Place(name='Millennium Park', description='A park in downtown Chicago.', image='https://cdn.choosechicago.com/uploads/2020/03/sawyer-bengtson-tnv84LOjes4-unsplash-900x600.jpg', link='http://millenniumpark.org', location_id=location3.id)
        place4 = Place(name='Griffith Observatory', description='A Los Angeles landmark for exploring astronomy.', image='https://www.sunnydayscoot.com/wp-content/uploads/sites/4677/2019/08/IMG_0694.jpeg?w=700&h=700&zoom=2', link='http://griffithobservatory.org', location_id=location4.id)
        place5 = Place(name='South Beach', description='A popular beach in Miami.', image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8kAx21WIvonnnyMS3EoxN6gvgX0WDgn_i3Q&s', link='http://southbeach.org', location_id=location5.id)
        place6 = Place(name='Times Square', description='A major commercial intersection in New York.', image='https://images.ctfassets.net/1aemqu6a6t65/46MJ6ER585Rwl3NraEIoGL/784c5eb5d87f576b5548b1a2255f08e7/tripadvisortimessquare_taggeryanceyiv_5912?w=1200&h=800&q=75', link='http://timessquare.org', location_id=location1.id)
        place7 = Place(name='Fisherman’s Wharf', description='Popular tourist attraction in San Francisco.', image='https://www.dylanstours.com/wp-content/uploads/2020/02/unnamed-2.png', link='http://fishermanswharf.org', location_id=location2.id)
        place8 = Place(name='Navy Pier', description='A large pier on the Chicago shoreline.', image='https://narchitects.com/wp-content/uploads/2019/12/R02_Navy-Pier-Chicago-NA-8190-courtesy-nARCHITECTS-image-courtesy-Iwan-Baan.jpg', link='http://navypier.org', location_id=location3.id)
        place9 = Place(name='Hollywood Walk of Fame', description='A famous sidewalk in Los Angeles.', image='https://www.whatsonincalifornia.com/wp-content/uploads/2017/08/Hollywood-Walk-of-Fame-in-Los-Angeles.jpg', link='http://walkoffame.com', location_id=location4.id)
        place10 = Place(name='Art Deco District', description='Historic district in Miami Beach.', image='https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-10/231009-miami-beach-art-deco-jm-1121-1d6835.jpg', link='http://artdeco.org', location_id=location5.id)

        place11 = Place(name='Empire State Building', description='An iconic skyscraper in New York.', image='https://www.findingtheuniverse.com/wp-content/uploads/2020/07/outdoor-observation-deck-empire-state-building_by_Laurence-Norah.jpg', link='http://esbnyc.com', location_id=location1.id)
        place12 = Place(name='Alcatraz Island', description='A famous former prison in San Francisco Bay.', image='https://www.usatoday.com/gcdn/-mm-/1abbac059a7e6f21ff3aa7e38760a41a48819119/c=0-217-2118-1414/local/-/media/2018/08/17/USATODAY/USATODAY/636701422865855661-GettyImages-632216604.jpg', link='http://alcatrazisland.org', location_id=location2.id)
        place13 = Place(name='The Art Institute of Chicago', description='A renowned art museum in Chicago.', image='https://inspiredimperfection.com/wp-content/uploads/2017/07/art-institute-of-chicago.jpg', link='http://artic.edu', location_id=location3.id)
        place14 = Place(name='Santa Monica Pier', description='A famous pier with an amusement park in Los Angeles.', image='https://jernejletica.com/wp-content/uploads/2023/05/Photos-of-Santa-Monica-Pier.jpg', link='http://santamonicapier.org', location_id=location4.id)
        place15 = Place(name='Wynwood Walls', description='An outdoor museum showcasing street art in Miami.', image='https://media.architecturaldigest.com/photos/5a02353723fb522921eafe6d/4:3/w_880,h_660,c_limit/Wynwood%20Walls%20Garden%20By%20Will%20Graham.jpeg', link='http://wynwoodwalls.com', location_id=location5.id)

        db.session.add_all([place1, place2, place3, place4, place5, place6, place7, place8, place9, place10, place11, place12, place13, place14, place15])
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

        # Associate Moods with Places (mixed order)
        mood1.places.extend([place1, place12, place9, place14])  # Excited
        mood2.places.extend([place2, place7, place11, place13])  # Relaxed
        mood3.places.extend([place3, place10, place15, place8])  # Happy
        mood4.places.extend([place4, place6, place5, place13])   # Curious
        mood5.places.extend([place5, place9, place14, place15])  # Adventurous

        db.session.commit()

        print("Database seeded!")

if __name__ == '__main__':
    seed_database()
