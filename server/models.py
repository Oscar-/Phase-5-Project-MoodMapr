from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import relationship
from datetime import datetime



# Association table for the many-to-many relationship between Mood and Place
mood_place_association = db.Table(
    'mood_place',
    db.Column('mood_id', db.Integer, db.ForeignKey('moods.id'), primary_key=True),
    db.Column('place_id', db.Integer, db.ForeignKey('places.id'), primary_key=True)
)

# User model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    _password_hash = db.Column(db.String(128), nullable=False)  # Storing hashed password

    # Relationships 
    favorites = db.relationship('Favorite', back_populates='user')
    moods = db.relationship('Mood', back_populates='user')


    # Property setter for password (this hashes the password when setting it)
    @property
    def password(self):
        raise AttributeError('Password is not readable!')

    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)

    # Method to check password
    def check_password(self, password):
        return check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'


# Favorite model
class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='favorites')
    place = relationship('Place', back_populates='favorites')

    def __repr__(self):
        return f'<Favorite User: {self.user_id}, Place: {self.place_id}>'


# Mood model
class Mood(db.Model):
    __tablename__ = 'moods'

    id = db.Column(db.Integer, primary_key=True)
    feeling_name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relatioships
    user = db.relationship('User', back_populates='moods')

    # Many-to-many relationship with Place
    places = relationship('Place', secondary=mood_place_association, back_populates='moods')

    def __repr__(self):
        return f'<Mood {self.feeling_name} for User: {self.user_id}>'


# Place model
class Place(db.Model):
    __tablename__ = 'places'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=True)
    link = db.Column(db.String(255), nullable=True)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)

    # Relationships
    location = relationship('Location', back_populates='places')
    favorites = relationship('Favorite', back_populates='place')

    # Many-to-many relationship with Mood
    moods = relationship('Mood', secondary=mood_place_association, back_populates='places')


    def __repr__(self):
        return f'<Place {self.name}>'


# Location model
class Location(db.Model):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    city_name = db.Column(db.String(100), nullable=False)
    coordinates = db.Column(db.String(100), nullable=True)

    # Relationships
    places = relationship('Place', back_populates='location')

    def __repr__(self):
        return f'<Location {self.city_name}>'
    

    
# class Trip(db.Model):
#     pass