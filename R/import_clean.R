# Importing Spotify Data 

# Packages ----
library(jsonlite)
library(tidyverse)
library(readxl)

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

# Combine with genre & beat table ----
genre_df <- read_excel("data/raw/genre_beat_table.xlsx")

genre_df |>
  count(title, artist, sort = TRUE) |>
  filter(n > 1)

genre_dedup <- genre_df |>
  distinct(title, artist, .keep_all = TRUE) |> 
  select(-year)

df_combined <- df |> 
  left_join(genre_dedup, by = c("master_metadata_track_name" = "title",
                             "master_metadata_album_artist_name" = "artist"),
            relationship = "many-to-many")

# Save data ----
write_excel_csv(df_combined, "data/raw/combined_genre_output.csv")
