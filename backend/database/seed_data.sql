-- Insert data into the airports table
INSERT INTO airports (code, name, city, country) VALUES
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA'),
('DEL', 'Indira Gandhi International Airport', 'Delhi', 'India'),
('LHR', 'London Heathrow Airport', 'London', 'UK'),
('DXB', 'Dubai International Airport', 'Dubai', 'UAE');

-- Insert data into the airlines table
INSERT INTO airlines (name) VALUES
('Emirates'),
('Air India'),
('British Airways');

-- Insert data into the flights table
INSERT INTO flights (flight_number, airline_id, origin_id, destination_id, departure_time, arrival_time, base_price) VALUES
('AI101', (SELECT id FROM airlines WHERE name = 'Air India'), (SELECT id FROM airports WHERE code = 'DEL'), (SELECT id FROM airports WHERE code = 'LHR'), '2025-11-20 10:00:00', '2025-11-20 16:30:00', 500.00),
('EK202', (SELECT id FROM airlines WHERE name = 'Emirates'), (SELECT id FROM airports WHERE code = 'DXB'), (SELECT id FROM airports WHERE code = 'JFK'), '2025-11-21 15:00:00', '2025-11-21 21:00:00', 750.00),
('BA303', (SELECT id FROM airlines WHERE name = 'British Airways'), (SELECT id FROM airports WHERE code = 'LHR'), (SELECT id FROM airports WHERE code = 'DEL'), '2025-11-22 08:00:00', '2025-11-22 19:30:00', 600.00);

-- Insert data into the seats table
INSERT INTO seats (flight_id, seat_number, class, is_available)
SELECT id, '1A', 'First', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '1B', 'First', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '10A', 'Economy', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '10B', 'Economy', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '10C', 'Economy', FALSE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '11A', 'Economy', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '11B', 'Economy', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '12A', 'Economy', TRUE FROM flights WHERE flight_number = 'AI101' UNION ALL
SELECT id, '12B', 'Economy', TRUE FROM flights WHERE flight_number = 'AI101';

-- Populate seats for Flight EK202 (using flight_number to get ID)
INSERT INTO seats (flight_id, seat_number, class, is_available)
SELECT id, '2A', 'Business', TRUE FROM flights WHERE flight_number = 'EK202' UNION ALL
SELECT id, '2B', 'Business', TRUE FROM flights WHERE flight_number = 'EK202' UNION ALL
SELECT id, '20A', 'Economy', TRUE FROM flights WHERE flight_number = 'EK202' UNION ALL
SELECT id, '20B', 'Economy', TRUE FROM flights WHERE flight_number = 'EK202' UNION ALL
SELECT id, '21A', 'Economy', TRUE FROM flights WHERE flight_number = 'EK202';