-- ==========================================================
-- 03_seed_data.sql: Demo Users, Global Cities & Sample Trips
-- ==========================================================

-- 1. Demo Users
INSERT INTO users (id, email, password_hash, name, role, city, country, avatar)
VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'traveler@globetrotter.io',
        'c0a80101:e5f4d3c2b1a099887766554433221100ffeeddccbbaa99887766554433221100',
        'Jane Traveler',
        'traveler',
        'San Francisco',
        'United States',
        'JT'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'admin@globetrotter.io',
        'c0a80102:112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00',
        'System Admin',
        'admin',
        'New York',
        'United States',
        'SA'
    )
ON CONFLICT (email) DO NOTHING;

-- 2. Global Cities Catalog
INSERT INTO cities (id, name, country, region, cost_index, image_url)
VALUES
    ('11111111-0000-0000-0000-000000000001', 'Tokyo', 'Japan', 'East Asia', 1.35, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'),
    ('11111111-0000-0000-0000-000000000002', 'Kyoto', 'Japan', 'East Asia', 1.15, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'),
    ('11111111-0000-0000-0000-000000000003', 'Paris', 'France', 'Western Europe', 1.45, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
    ('11111111-0000-0000-0000-000000000004', 'Rome', 'Italy', 'Southern Europe', 1.25, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'),
    ('11111111-0000-0000-0000-000000000005', 'Zurich', 'Switzerland', 'Central Europe', 1.85, 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6'),
    ('11111111-0000-0000-0000-000000000006', 'Srinagar', 'India', 'South Asia', 0.65, 'https://images.unsplash.com/photo-1566837945700-30057527ade0'),
    ('11111111-0000-0000-0000-000000000007', 'Ujjain', 'India', 'South Asia', 0.45, 'https://images.unsplash.com/photo-1609946727292-c94318c5e638'),
    ('11111111-0000-0000-0000-000000000008', 'Positano', 'Italy', 'Southern Europe', 1.60, 'https://images.unsplash.com/photo-1533105079780-92b9be482077')
ON CONFLICT (id) DO NOTHING;

-- 3. Curated Activities Catalog
INSERT INTO activities (id, city_id, name, category, cost, duration_minutes, description)
VALUES
    ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Shinjuku Nighttime Omoide Yokocho Food Tour', 'culinary', 65.00, 150, 'Curated yakitori tasting and craft drinks in Tokyo old-town alleys.'),
    ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Senso-ji Ancient Temple & Asakusa Walking Tour', 'culture', 20.00, 120, 'Explore Tokyo oldest temple complex and traditional market.'),
    ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'Fushimi Inari Torii Gates Early Morning Hike', 'culture', 0.00, 180, 'Scenic hike through thousands of vermilion torii gates at sunrise.'),
    ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Gion Historic District Matcha Tea Ceremony', 'experience', 45.00, 90, 'Traditional Japanese tea preparation masterclass with zen sweets.'),
    ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'Colosseum & Roman Forum Guided VIP Access', 'sightseeing', 55.00, 180, 'Direct priority access to ancient Roman amphitheater and gladiator arena.')
ON CONFLICT (id) DO NOTHING;

-- 4. Sample Itinerary Trip
INSERT INTO trips (
    id,
    user_id,
    name,
    description,
    start_date,
    end_date,
    is_public,
    public_slug,
    cover_photo_url
) VALUES (
    '33333333-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Autumn in Japan: Tokyo & Kyoto',
    'A cultural exploration of Shinjuku nightlife, historic shrines, bullet trains, and scenic gardens.',
    '2026-10-12',
    '2026-10-22',
    true,
    'autumn-in-japan-demo',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'
) ON CONFLICT (id) DO NOTHING;

-- 5. Stops for Sample Trip
INSERT INTO stops (id, trip_id, city_id, order_index, start_date, end_date)
VALUES
    ('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 0, '2026-10-12', '2026-10-16'),
    ('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 1, '2026-10-16', '2026-10-22')
ON CONFLICT (id) DO NOTHING;

-- 6. Trip Activities for Sample Trip
INSERT INTO trip_activities (id, stop_id, activity_id, custom_name, category, cost, scheduled_time, order_index)
VALUES
    ('55555555-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Shinjuku Nighttime Omoide Yokocho Food Tour', 'culinary', 65.00, '18:00', 0),
    ('55555555-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Senso-ji Ancient Temple & Asakusa Walking Tour', 'culture', 20.00, '09:30', 1),
    ('55555555-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', 'Fushimi Inari Torii Gates Early Morning Hike', 'culture', 0.00, '07:30', 0),
    ('55555555-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004', 'Gion Historic District Matcha Tea Ceremony', 'experience', 45.00, '14:00', 1)
ON CONFLICT (id) DO NOTHING;
