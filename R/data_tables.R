# Data visualization start 

# Packages ----
library(jsonlite)
library(tidyverse)

# Data ----
df <- read_csv("data/raw/combined_output.csv")

# Isolate music data ----
music_df <- df |>
  filter(if_any(
    c(
      master_metadata_track_name,
      master_metadata_album_album_name,
      master_metadata_album_artist_name
    ),
    ~ !is.na(.x)
  )) |> 
  select(
    platform, ms_played, conn_country, track_id,
    master_metadata_track_name,
    master_metadata_album_album_name,
    master_metadata_album_artist_name,
    reason_start, reason_end,
    shuffle, skipped,
    year,  month, day, time, minutes_played
  )

# Summary Tables ----
## Year ---- 
yearly_summary <- music_df |> 
  summarise(
    total_songs = n(),
    total_minutes = sum(minutes_played),
    unique_songs = n_distinct(master_metadata_track_name), 
    unique_artists = n_distinct(master_metadata_album_artist_name), 
    .by = year
  )

## Month ---- 
monthly_summary <- music_df |> 
  summarise(
    total_songs = n(),
    total_minutes = sum(minutes_played),
    unique_songs = n_distinct(master_metadata_track_name), 
    unique_artists = n_distinct(master_metadata_album_artist_name), 
    .by = c(year, month)
  )

## Day ---- 
daily_summary <- music_df |> 
  summarise(
    total_songs = n(),
    total_minutes = sum(minutes_played),
    unique_songs = n_distinct(master_metadata_track_name), 
    unique_artists = n_distinct(master_metadata_album_artist_name), 
    .by = c(year, month, day)
  )

## Save tables ----
write_excel_csv(yearly_summary, "data/processed/yearly_summary.csv")
write_excel_csv(monthly_summary, "data/processed/monthly_summary.csv")
write_excel_csv(daily_summary, "data/processed/daily_summary.csv")
