curl -X POST  https://api.strava.com/api/v3/push_subscriptions  -F client_id=%CLIENT_ID% -F client_secret=%CLIENT_SECRET% -F callback_url=https://strava-group-ride-stats.netlify.com/.netlify/functions/webhook -F verify_token=STRAVA