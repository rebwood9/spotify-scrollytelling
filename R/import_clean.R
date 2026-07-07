# Importing Spotify Data 

# Packages ----
library(jsonlite)
library(tidyverse)

# Data ----
df <- list.files("data/raw", pattern = "Streaming_History_Audio.*\\.json", full.names = TRUE) |> 
  map_dfr(fromJSON)

# Clean ---
## Code time ----
df <- df |>
  mutate(
    ts_parsed = ymd_hms(ts, tz = "UTC"),
    year = year(ts_parsed),
    month = month(ts_parsed),
    day = day(ts_parsed),
    time = format(ts_parsed, "%H:%M:%S")
  )

## Re-code ms_played ----
df <- df |> 
  mutate(minutes_played = ms_played/60000)

## Re-code track ID ----
df <- df |> 
  mutate(track_id = str_remove(spotify_track_uri, "spotify:track:"))

## Select variables ----
df <- df |> 
  select(-c(ts, ip_addr, offline, incognito_mode, offline_timestamp))

# Save bounded data ----
write_excel_csv(df, "data/raw/combined_output.csv")


