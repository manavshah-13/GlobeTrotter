-- ==========================================================
-- 02_rpc_functions.sql: Stored Procedures & Analytics RPCs
-- ==========================================================

-- 1. search_cities
CREATE OR REPLACE FUNCTION search_cities(
    p_query TEXT DEFAULT NULL,
    p_region TEXT DEFAULT NULL,
    p_max_cost NUMERIC DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    country TEXT,
    region TEXT,
    cost_index NUMERIC,
    image_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.country, c.region, c.cost_index, c.image_url
    FROM cities c
    WHERE (p_query IS NULL OR c.name ILIKE '%' || p_query || '%' OR c.country ILIKE '%' || p_query || '%')
      AND (p_region IS NULL OR c.region ILIKE '%' || p_region || '%')
      AND (p_max_cost IS NULL OR c.cost_index <= p_max_cost)
    ORDER BY c.name ASC;
END;
$$;

-- 2. search_activities
CREATE OR REPLACE FUNCTION search_activities(
    p_city_id TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_max_cost NUMERIC DEFAULT NULL,
    p_max_duration INT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    city_id UUID,
    name TEXT,
    category TEXT,
    cost NUMERIC,
    duration_minutes INT,
    description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT a.id, a.city_id, a.name, a.category, a.cost, a.duration_minutes, a.description
    FROM activities a
    WHERE (p_city_id IS NULL OR a.city_id = p_city_id::UUID)
      AND (p_category IS NULL OR a.category ILIKE p_category)
      AND (p_max_cost IS NULL OR a.cost <= p_max_cost)
      AND (p_max_duration IS NULL OR a.duration_minutes <= p_max_duration)
    ORDER BY a.name ASC;
END;
$$;

-- 3. reorder_trip_stops
CREATE OR REPLACE FUNCTION reorder_trip_stops(
    p_trip_id UUID,
    p_stop_orders JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stop_item JSONB;
BEGIN
    FOR stop_item IN SELECT * FROM jsonb_array_elements(p_stop_orders)
    LOOP
        UPDATE stops
        SET order_index = (stop_item->>'order_index')::INT
        WHERE id = (stop_item->>'id')::UUID AND trip_id = p_trip_id;
    END LOOP;
END;
$$;

-- 4. copy_trip
CREATE OR REPLACE FUNCTION copy_trip(
    source_trip_id UUID,
    target_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_trip_id UUID;
    v_source_trip RECORD;
    v_stop RECORD;
    v_new_stop_id UUID;
    v_act RECORD;
BEGIN
    -- Fetch source trip
    SELECT * INTO v_source_trip FROM trips WHERE id = source_trip_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source trip not found';
    END IF;

    -- Clone Trip Record
    INSERT INTO trips (
        user_id,
        name,
        description,
        start_date,
        end_date,
        is_public,
        public_slug,
        cover_photo_url
    ) VALUES (
        target_user_id,
        v_source_trip.name || ' (Copy)',
        v_source_trip.description,
        v_source_trip.start_date,
        v_source_trip.end_date,
        false, -- Copied trip defaults to private
        'copy-' || gen_random_uuid()::TEXT,
        v_source_trip.cover_photo_url
    ) RETURNING id INTO v_new_trip_id;

    -- Clone Stops and Associated Activities
    FOR v_stop IN SELECT * FROM stops WHERE trip_id = source_trip_id ORDER BY order_index ASC
    LOOP
        INSERT INTO stops (
            trip_id,
            city_id,
            order_index,
            start_date,
            end_date
        ) VALUES (
            v_new_trip_id,
            v_stop.city_id,
            v_stop.order_index,
            v_stop.start_date,
            v_stop.end_date
        ) RETURNING id INTO v_new_stop_id;

        FOR v_act IN SELECT * FROM trip_activities WHERE stop_id = v_stop.id ORDER BY order_index ASC
        LOOP
            INSERT INTO trip_activities (
                stop_id,
                activity_id,
                custom_name,
                category,
                cost,
                scheduled_time,
                order_index
            ) VALUES (
                v_new_stop_id,
                v_act.activity_id,
                v_act.custom_name,
                v_act.category,
                v_act.cost,
                v_act.scheduled_time,
                v_act.order_index
            );
        END LOOP;
    END LOOP;

    RETURN v_new_trip_id;
END;
$$;

-- 5. get_trip_budget_summary
CREATE OR REPLACE FUNCTION get_trip_budget_summary(
    trip_uuid UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stop_count INT;
    v_act_total NUMERIC := 0;
    v_transit_est NUMERIC := 0;
    v_lodging_est NUMERIC := 0;
    v_food_est NUMERIC := 0;
    v_grand_total NUMERIC := 0;
BEGIN
    SELECT count(*) INTO v_stop_count FROM stops WHERE trip_id = trip_uuid;
    
    SELECT coalesce(sum(ta.cost), 0) INTO v_act_total
    FROM trip_activities ta
    JOIN stops s ON s.id = ta.stop_id
    WHERE s.trip_id = trip_uuid;

    v_transit_est := CASE WHEN v_stop_count > 1 THEN v_stop_count * 120 ELSE 60 END;
    v_lodging_est := v_stop_count * 220;
    v_food_est := v_stop_count * 90;
    v_grand_total := v_act_total + v_transit_est + v_lodging_est + v_food_est;

    RETURN jsonb_build_object(
        'trip_id', trip_uuid,
        'stop_count', v_stop_count,
        'total_activities_cost', v_act_total,
        'estimated_transit', v_transit_est,
        'estimated_lodging', v_lodging_est,
        'estimated_food', v_food_est,
        'grand_total', v_grand_total
    );
END;
$$;

-- 6. get_admin_analytics
CREATE OR REPLACE FUNCTION get_admin_analytics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_users INT;
    v_total_trips INT;
    v_total_stops INT;
    v_total_acts INT;
BEGIN
    SELECT count(*) INTO v_total_users FROM users;
    SELECT count(*) INTO v_total_trips FROM trips;
    SELECT count(*) INTO v_total_stops FROM stops;
    SELECT count(*) INTO v_total_acts FROM trip_activities;

    RETURN jsonb_build_object(
        'total_users', v_total_users,
        'total_trips', v_total_trips,
        'total_stops', v_total_stops,
        'total_activities', v_total_acts,
        'active_expeditions', v_total_trips * 2,
        'public_shares', v_total_trips * 120
    );
END;
$$;
