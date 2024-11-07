-- Users table
CREATE TABLE users (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  email VARCHAR2(100) UNIQUE NOT NULL,
  password_hash RAW(32) NOT NULL,
  role VARCHAR2(20) NOT NULL CHECK (role IN ('admin', 'user')),
  department VARCHAR2(100) NOT NULL,
  status VARCHAR2(20) NOT NULL CHECK (status IN ('pending', 'approved', 'denied')),
  denial_reason VARCHAR2(500),
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1;

-- Rooms table
CREATE TABLE rooms (
  id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  capacity NUMBER NOT NULL,
  floor NUMBER NOT NULL,
  building VARCHAR2(100) NOT NULL,
  image_url VARCHAR2(500),
  amenities CLOB CHECK (amenities IS JSON),
  status VARCHAR2(20) NOT NULL CHECK (status IN ('available', 'maintenance'))
);

CREATE SEQUENCE room_id_seq START WITH 1 INCREMENT BY 1;

-- Bookings table
CREATE TABLE bookings (
  id NUMBER PRIMARY KEY,
  room_id NUMBER REFERENCES rooms(id) ON DELETE CASCADE,
  user_id NUMBER REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  title VARCHAR2(200) NOT NULL,
  description VARCHAR2(1000),
  status VARCHAR2(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  denial_reason VARCHAR2(500),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE SEQUENCE booking_id_seq START WITH 1 INCREMENT BY 1;

-- Indexes
CREATE INDEX idx_bookings_room_time ON bookings(room_id, start_time, end_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Initial admin user (password: admin)
INSERT INTO users (
  id, name, email, password_hash, role, department, status, last_login
) VALUES (
  user_id_seq.NEXTVAL,
  'Admin User',
  'admin@example.com',
  DBMS_CRYPTO.HASH(UTL_RAW.CAST_TO_RAW('admin'), 2),
  'admin',
  'IT',
  'approved',
  SYSTIMESTAMP
);