-- ==========================================================
-- 04_rls_policies.sql: Row Level Security (RLS) Policies
-- ==========================================================

-- Enable Row Level Security on all core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_activities ENABLE ROW LEVEL SECURITY;

-- 1. Cities & Activities Catalog Policies (Public Read, Admin Write)
CREATE POLICY "Public can view cities"
    ON cities FOR SELECT
    USING (true);

CREATE POLICY "Public can view activities"
    ON activities FOR SELECT
    USING (true);

-- 2. Trips Policies
-- View: Public trips can be seen by anyone; private trips only by trip owner or admins
CREATE POLICY "View public or own trips"
    ON trips FOR SELECT
    USING (
        is_public = true
        OR auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- Insert: Authenticated users can create trips
CREATE POLICY "Users can create trips"
    ON trips FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR user_id IS NULL
    );

-- Update/Delete: Only trip owner or admins can modify
CREATE POLICY "Users can update own trips"
    ON trips FOR UPDATE
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

CREATE POLICY "Users can delete own trips"
    ON trips FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- 3. Stops Policies
CREATE POLICY "View stops for accessible trips"
    ON stops FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = stops.trip_id
              AND (trips.is_public = true OR trips.user_id = auth.uid())
        )
    );

CREATE POLICY "Modify stops for own trips"
    ON stops FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = stops.trip_id
              AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

-- 4. Trip Activities Policies
CREATE POLICY "View trip activities for accessible trips"
    ON trip_activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM stops
            JOIN trips ON trips.id = stops.trip_id
            WHERE stops.id = trip_activities.stop_id
              AND (trips.is_public = true OR trips.user_id = auth.uid())
        )
    );

CREATE POLICY "Modify trip activities for own trips"
    ON trip_activities FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM stops
            JOIN trips ON trips.id = stops.trip_id
            WHERE stops.id = trip_activities.stop_id
              AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

-- 5. User Profiles
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);
